"""Import independently transcribed English phrases from the local lesson MP3s."""

import argparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from glob import glob
import hashlib
import io
import json
import os
from pathlib import Path
import re
import tempfile
import time
import unicodedata

import av
from faster_whisper import BatchedInferencePipeline, WhisperModel
from faster_whisper.audio import decode_audio
from filelock import FileLock
from num2words import num2words
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
TRANSLATIONS = ROOT / "public" / "translations"
CACHE = ROOT / ".lesson-audio-cache"
LEVELS = ("A0", "A1", "A2", "B1", "B2")
OUTPUT_RATE = 24000
ASR_RATE = 16000
REVISION = 4
SPELLING = {
    "analyse": "analyze",
    "analysed": "analyzed",
    "analyses": "analyzes",
    "analysing": "analyzing",
    "realise": "realize",
    "realised": "realized",
    "realises": "realizes",
    "realising": "realizing",
    "criticise": "criticize",
    "criticised": "criticized",
    "criticises": "criticizes",
    "apologise": "apologize",
    "apologised": "apologized",
    "apologises": "apologizes",
    "behaviour": "behavior",
    "catalogue": "catalog",
    "spoilt": "spoiled",
    "smelt": "smelled",
    "neighbours": "neighbors",
    "neighbour": "neighbor",
    "programme": "program",
    "flavour": "flavor",
    "skilful": "skillful",
    "favour": "favor",
    "favourable": "favorable",
    "colourful": "colorful",
    "metres": "meters",
    "travelling": "traveling",
    "travelled": "traveled",
    "traveller": "traveler",
    "travellers": "travelers",
    "enrol": "enroll",
    "enrolment": "enrollment",
    "colour": "color",
    "colours": "colors",
    "favourite": "favorite",
    "favourites": "favorites",
    "centre": "center",
    "centres": "centers",
    "theatre": "theater",
    "theatres": "theaters",
    "practise": "practice",
    "practises": "practices",
    "practised": "practiced",
    "practising": "practicing",
}
INTEGER = r"(?:[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,6})"
NUMBER_END = r"(?![\w\-/]|[.,][0-9])"
CURRENCY = {"$": "dollar", "£": "pound", "€": "euro"}


def spoken_integer(value):
    return num2words(int(value.replace(",", ""))).replace(" and ", " ")


def spoken_amount(match):
    symbol, amount, scale = match.groups()
    unit = CURRENCY[symbol]
    number = spoken_integer(amount)
    if scale:
        return f"{number} {scale} {unit}s"
    return f"{number} {unit if number == 'one' else unit + 's'}"


def source_for(root, lesson):
    if lesson.parent.name == "express":
        level, pair = lesson.name.split()
        number = pair.split("-")[-1]
        folder = root / "Экспресс" / level
        name = f"{number}. Lesson {number}.mp3" if level in LEVELS[:2] else f"{number}. {number}.mp3"
        path = folder / name
        return path if path.is_file() else None

    number = int(lesson.name)
    level = LEVELS[(number - 1) // 50]
    folder = root / "Титановый" / level / str(number)
    if level != "A0":
        path = folder / f"{number}.mp3"
        return path if path.is_file() else None
    pattern = rf"Lesson (?:Уро1 )?{number}\s*\.mp3"
    candidates = [p for p in folder.glob("*.mp3") if re.fullmatch(pattern, p.name, re.I)]
    return candidates[0] if len(candidates) == 1 else None


def words(text, equivalents=False):
    text = unicodedata.normalize("NFKC", text).casefold()
    text = text.replace("’", "'").replace("‘", "'")
    if equivalents:
        # Restrict digit expansion to whole integers, leaving dates and decimals alone.
        text = re.sub(
            rf"(?<![\w/\-])([$£€]) *({INTEGER})(?: +(thousand|million|billion)\b)?{NUMBER_END}",
            spoken_amount,
            text,
        )
        text = re.sub(
            rf"(?<![\w.,\-/$£€]){INTEGER}{NUMBER_END}",
            lambda match: spoken_integer(match[0]),
            text,
        )
    text = re.sub(r"\bo\s+'\s*clock\b", "o'clock", text)
    tokens = tuple(re.findall(r"[^\W_]+(?:'[^\W_]+)*", text, re.UNICODE))
    return tuple(SPELLING.get(token, token) for token in tokens) if equivalents else tokens


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_atomic(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as output:
        temporary = Path(output.name)
        try:
            output.write(content)
            output.close()
            for attempt in range(9):
                try:
                    os.replace(temporary, path)
                    break
                except PermissionError as error:
                    if getattr(error, "winerror", None) not in (5, 32, 33) or attempt == 8:
                        raise
                    time.sleep(min(0.1 * 2 ** attempt, 2))
        finally:
            temporary.unlink(missing_ok=True)


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode()


def silence_ranges(audio):
    frame = OUTPUT_RATE // 100
    complete = audio[: len(audio) // frame * frame]
    quiet = np.max(np.abs(complete.reshape(-1, frame)), axis=1) < 0.01
    edges = np.flatnonzero(np.diff(np.r_[False, quiet, False]))
    return [(start / 100, end / 100) for start, end in zip(edges[::2], edges[1::2]) if end - start >= 16]


def transcription_windows(duration, silences):
    centers = [(start + end) / 2 for start, end in silences]
    start = 0
    while duration - start > 27:
        options = [center for center in centers if start + 15 < center <= start + 27]
        end = max(options) if options else start + 25
        yield {"start": start, "end": end}
        start = end
    yield {"start": start, "end": duration}


def transcript(pipeline, audio, clips, batch, with_words):
    segments, _ = pipeline.transcribe(
        audio, language="en", beam_size=3, batch_size=batch,
        clip_timestamps=clips, word_timestamps=with_words,
        without_timestamps=True, vad_filter=False,
    )
    return list(segments)


def clip_boundary(silences, before, after, *, starting):
    # Pick silence between neighboring words, allowing for Whisper timestamp drift.
    low, high = min(before, after), max(before, after)
    nearby = [
        (left, right) for left, right in silences
        if (left + right) / 2 >= low - 0.14 and (left + right) / 2 <= high + 0.14
    ]
    if not nearby:
        return None
    left, right = min(nearby, key=lambda gap: abs(sum(gap) / 2 - (before + after) / 2))
    midpoint = (left + right) / 2
    if starting:
        return max(midpoint, right - 0.15)
    return min(midpoint, left + 0.20)


def find_candidates(segments, silences, duration, tasks, equivalents):
    expected = defaultdict(set)
    multi_sentence = set()
    for task in tasks:
        text = task["en"]["text"]
        tokens = words(text, equivalents)
        if tokens:
            expected[tokens[0]].add(tokens)
            if re.search(r"[.!?]\s+\S", text):
                multi_sentence.add(tokens)

    timed = []
    for segment in segments:
        word_items = list(segment.words)
        for position, word in enumerate(word_items):
            if word.word.lstrip().startswith("'clock") and position and word_items[position - 1].word.strip().casefold() == "o":
                previous = timed.pop()
                timed.append(("o'clock", previous[1], word.end, min(previous[3], word.probability), 0, 1))
                continue
            tokens = words(word.word, equivalents)
            for index, token in enumerate(tokens):
                timed.append((token, word.start, word.end, word.probability, index, len(tokens)))
    sequence = tuple(word[0] for word in timed)
    candidates = defaultdict(list)
    for index, first in enumerate(timed):
        if first[4] != 0:
            continue
        for phrase in expected[first[0]]:
            stop = index + len(phrase)
            if sequence[index:stop] != phrase:
                continue
            last = timed[stop - 1]
            if last[4] != last[5] - 1:
                continue
            max_pause = 3.5 if phrase in multi_sentence else 1.3
            if any(timed[i + 1][1] - timed[i][2] > max_pause for i in range(index, stop - 1)):
                continue
            # Whisper can assign an inter-phrase pause to the start of the next word.
            # Its end still bounds the pause even when the reported start is too early.
            before = timed[index - 1][2] if index else 0
            after = timed[stop][2] if stop < len(timed) else duration
            if first[2] - before > 5:
                before = max(0, first[2] - 2.5)
            if after - last[2] > 5:
                after = min(duration, last[2] + 2.5)
            start = clip_boundary(silences, before, first[2], starting=True)
            end = clip_boundary(silences, last[2], after, starting=False)
            if start is None and index == 0 and first[1] < 0.35:
                start = 0
            if end is None and stop == len(timed) and duration - last[2] < 0.7:
                end = duration
            if start is not None and end is not None and 0.15 < end - start < 20:
                score = sum(word[3] for word in timed[index:stop]) / len(phrase)
                candidates[phrase].append((score, start, end))

    return {
        phrase: sorted(set(cuts), reverse=True)[:3] for phrase, cuts in candidates.items()
    }


def encode_clip(audio, start, end):
    samples = audio[round(start * OUTPUT_RATE): round(end * OUTPUT_RATE)]
    buffer = io.BytesIO()
    with av.open(buffer, mode="w", format="ipod") as output:
        stream = output.add_stream("aac", rate=OUTPUT_RATE)
        stream.layout = "mono"
        stream.bit_rate = 64000
        frame = av.AudioFrame.from_ndarray(samples.reshape(1, -1), format="fltp", layout="mono")
        frame.sample_rate = OUTPUT_RATE
        for packet in stream.encode(frame):
            output.mux(packet)
        for packet in stream.encode():
            output.mux(packet)
    content = buffer.getvalue()
    return content, decode_audio(io.BytesIO(content), sampling_rate=ASR_RATE)


def transcribe_clips(pipeline, encoded, batch, *, individual):
    gap = np.zeros(round(0.85 * ASR_RATE), dtype=np.float32)
    samples = []
    clips = []
    separators = []
    offset = start = 0
    for _, audio in encoded:
        if offset > start and offset - start + len(audio) + len(gap) > 25 * ASR_RATE:
            clips.append({"start": start / ASR_RATE, "end": offset / ASR_RATE})
            start = offset
        if offset == start:
            separators.append(offset / ASR_RATE)
        else:
            separators.append((offset - len(gap) / 2) / ASR_RATE)
        samples.extend((audio, gap))
        offset += len(audio) + len(gap)
        if individual or offset - start >= 19 * ASR_RATE:
            clips.append({"start": start / ASR_RATE, "end": offset / ASR_RATE})
            start = offset
    if start < offset:
        clips.append({"start": start / ASR_RATE, "end": offset / ASR_RATE})
    recognized = defaultdict(list)
    for segment in transcript(pipeline, np.concatenate(samples), clips, batch, not individual):
        if individual:
            index = int(np.searchsorted(separators, segment.start + 0.001, side="right")) - 1
            recognized[index].append(segment.text.strip())
        else:
            for word in segment.words:
                index = int(np.searchsorted(separators, (word.start + word.end) / 2, side="right")) - 1
                recognized[index].append(word.word.strip())
    return [" ".join(recognized[index]) for index in range(len(encoded))]


def verify_candidates(pipeline, audio, candidates, batch, equivalents):
    verified = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for attempt in range(max(map(len, candidates.values()), default=0)):
            pending = [(phrase, cuts[attempt]) for phrase, cuts in candidates.items()
                       if phrase not in verified and len(cuts) > attempt]
            # Keep only a bounded number of decoded M4A clips in memory.
            for offset in range(0, len(pending), batch * 4):
                group = pending[offset:offset + batch * 4][::-1]
                encoded = list(pool.map(lambda pair: encode_clip(audio, *pair[1][1:]), group))
                recognized = transcribe_clips(pipeline, encoded, batch, individual=False)
                retry = [
                    index for index, (phrase, _) in enumerate(group)
                    if words(recognized[index], equivalents) != phrase
                ]
                if retry:
                    independent = transcribe_clips(pipeline, [encoded[index] for index in retry], batch, individual=True)
                    for index, text in zip(retry, independent):
                        recognized[index] = text
                for index, ((phrase, (_, start, end)), (content, _)) in enumerate(zip(group, encoded)):
                    text = recognized[index]
                    if words(text, equivalents) == phrase:
                        verified[phrase] = (start, end, text, content)
    return verified


def pause_cuts(silences, duration, excluded):
    cuts = set()
    for threshold in (0.30, 0.43, 0.58, 0.78):
        start = 0
        for left, right in [*silences, (duration, duration + threshold)]:
            if right - left < threshold - 0.001:
                continue
            midpoint = (left + right) / 2
            end = min(duration, midpoint, left + 0.20)
            if 0.24 <= end - start <= 17 and not any(
                min(end, other_end) - max(start, other_start) > 0.07
                for other_start, other_end in excluded
            ):
                cuts.add((start, end))
            start = max(midpoint, right - 0.15)
    return sorted(cuts)


def recover_from_pauses(pipeline, audio, cuts, missing, args):
    recovered = {}
    batch = args.batch_size
    with ThreadPoolExecutor(max_workers=4) as pool:
        for offset in range(0, len(cuts), batch * 4):
            group = cuts[offset:offset + batch * 4]
            encoded = list(pool.map(lambda cut: encode_clip(audio, *cut), group))
            recognized = transcribe_clips(pipeline, encoded, batch, individual=False)
            for (start, end), (content, _), text in zip(group, encoded, recognized):
                phrase = words(text, args.equivalent_spellings)
                if phrase in missing:
                    recovered[phrase] = (start, end, text, content)
                    missing.remove(phrase)
            if not missing:
                break
    return recovered


def windows_with_unverified_speech(windows, duration, silences, known):
    speech = np.ones(round(duration * 100), dtype=bool)
    for start, end in (*silences, *known):
        speech[round(start * 100):round(end * 100)] = False
    return [
        window for window in windows
        if np.count_nonzero(speech[round(window["start"] * 100):round(window["end"] * 100)]) >= 12
    ]


def stage(pipeline, source, lesson, tasks, folder, fingerprint, args, previous, existing):
    audio = decode_audio(str(source), sampling_rate=OUTPUT_RATE)
    speech = decode_audio(str(source), sampling_rate=ASR_RATE)
    duration = len(audio) / OUTPUT_RATE
    silences = silence_ranges(audio)
    windows = list(transcription_windows(duration, silences))
    kept = {row["id"]: row for row in existing["rows"] if row["status"] == "verified"} if existing else {}
    pending = [task for task in tasks if task["id"] not in kept]
    excluded = [(row["start"], row["end"]) for row in kept.values()]
    if previous:
        excluded.extend((row["start"], row["end"]) for row in previous["rows"] if row["status"] == "verified")
        if lesson.parent.name == "titan":
            windows = windows_with_unverified_speech(windows, duration, silences, excluded)
    segments = transcript(pipeline, speech, windows, args.batch_size, True) if windows else []
    candidates = find_candidates(segments, silences, duration, pending, args.equivalent_spellings)
    verified = verify_candidates(pipeline, audio, candidates, args.batch_size, args.equivalent_spellings)
    if previous or existing:
        missing = {words(task["en"]["text"], args.equivalent_spellings) for task in pending} - verified.keys()
        if missing:
            excluded.extend((start, end) for start, end, _, _ in verified.values())
            cuts = pause_cuts(silences, duration, [])
            verified.update(recover_from_pauses(pipeline, audio, cuts, missing, args))
    rows = []
    for task in tasks:
        if task["id"] in kept:
            rows.append(kept[task["id"]])
            continue
        expected = task["en"]["text"]
        key = words(expected, args.equivalent_spellings)
        row = {"id": task["id"], "expected": expected, "status": "no matching cut"}
        if key in candidates:
            row["status"] = "clip transcription differed"
        if key in verified:
            start, end, text, content = verified[key]
            row.update(status="verified", start=round(start, 3), end=round(end, 3),
                       transcript=text, sha256=hashlib.sha256(content).hexdigest())
            write_atomic(folder / audio_name(task["id"]), content)
        rows.append(row)
    report = {
        "lesson": lesson.relative_to(TRANSLATIONS).as_posix(),
        "source": str(source),
        "fingerprint": fingerprint,
        "equivalent_spellings": args.equivalent_spellings,
        "transcript": [segment.text.strip() for segment in segments],
        "rows": rows,
    }
    write_atomic(folder / "report.json", json_bytes(report))
    return report


def audio_name(task_id):
    return f"{task_id:03d}_en.m4a"


def apply_verified(lesson, cache, folder, report):
    with FileLock(cache / "apply.lock"):
        return install_clips(lesson, folder, report)


def install_clips(lesson, folder, report):
    tasks = read_json(lesson / "tasks.json")
    by_id = {task["id"]: task for task in tasks}
    changed = added = replaced = 0
    equivalents = report.get("equivalent_spellings", False)
    for row in report["rows"]:
        if row["status"] != "verified":
            continue
        task = by_id[row["id"]]
        if row["expected"] != task["en"]["text"] or words(row["transcript"], equivalents) != words(task["en"]["text"], equivalents):
            raise ValueError(f"Verification no longer matches task {row['id']}")
        name = audio_name(row["id"])
        content = (folder / name).read_bytes()
        if hashlib.sha256(content).hexdigest() != row["sha256"]:
            raise ValueError(f"Staged clip changed: {name}")
        destination = lesson / "audio" / f"tasks_{name}"
        old = destination.read_bytes() if destination.is_file() else b""
        if old != content:
            write_atomic(destination, content)
            if old:
                replaced += 1
            else:
                added += 1
        if task["en"].get("audio") is not True:
            task["en"]["audio"] = True
            changed += 1
    if changed:
        write_atomic(lesson / "tasks.json", json_bytes(tasks))
    return added, replaced


def cache_key(source, tasks, settings):
    stat = source.stat()
    return hashlib.sha256(json_bytes([
        *settings, str(source), stat.st_size, stat.st_mtime_ns,
        [(task["id"], task["en"]["text"]) for task in tasks],
    ])).hexdigest()


def prior_report(cache, source, tasks, model):
    # Revision 2 produced the first verified import. Current strict runs are also accepted.
    for settings in ([REVISION, model, False, None], [3, model, False, None], [2, model]):
        path = cache / cache_key(source, tasks, settings) / "report.json"
        if path.is_file():
            return read_json(path), path.parent
    return None, None


def unverified_rows(lesson, source, tasks, rows, status):
    by_id = {row["id"]: row["status"] for row in rows}
    return [
        {
            "lesson": lesson.as_posix(),
            "id": task["id"],
            "expected": task["en"]["text"],
            "status": by_id.get(task["id"], status),
            "source": str(source) if source else None,
        }
        for task in tasks
        if by_id.get(task["id"]) != "verified"
    ]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("lessons", nargs="*", help="Patterns such as 'express/A0*' or 'titan/1'")
    parser.add_argument("--source-root", type=Path, default=Path(r"F:\Английский по плейлистам"))
    parser.add_argument("--source", type=Path, help="Override the MP3 for a single selected lesson")
    parser.add_argument("--device", choices=("cpu", "cuda"), default="cpu")
    parser.add_argument("--cuda-dll-dir", type=Path, help="Directory with CUDA and cuDNN DLLs on Windows")
    parser.add_argument("--model", default="large-v3-turbo")
    parser.add_argument("--fill-gaps-from", metavar="MODEL", help="Only check tasks missed by a prior strict run")
    parser.add_argument("--equivalent-spellings", action="store_true", help="Allow selected US/UK spellings and integer notation")
    parser.add_argument("--retry-unverified", action="store_true", help="Recheck gaps in an existing report")
    parser.add_argument("--batch-size", type=int, default=12)
    parser.add_argument("--apply", action="store_true", help="Install verified clips in public/translations")
    parser.add_argument("--report", type=Path, help="Save a summary and the list of unverified tasks")
    args = parser.parse_args()
    if args.batch_size < 1:
        parser.error("--batch-size must be positive")
    dll_handle = None
    if args.cuda_dll_dir and os.name == "nt":
        dll_dir = str(args.cuda_dll_dir.resolve())
        os.environ["PATH"] = dll_dir + os.pathsep + os.environ["PATH"]
        dll_handle = os.add_dll_directory(dll_dir)
    lessons = sorted({
        Path(path).resolve().parent
        for pattern in args.lessons or ["express/*", "titan/*"]
        for path in glob(str(TRANSLATIONS / pattern / "tasks.json"))
        if Path(path).resolve().is_relative_to(TRANSLATIONS)
    }, key=lambda path: [int(part) if part.isdigit() else part for part in re.split(r"(\d+)", path.as_posix())])
    if not lessons or (args.source and len(lessons) != 1):
        parser.error("Select existing lessons, or exactly one lesson when using --source")
    if (args.source and not args.source.is_file()) or (not args.source and not args.source_root.is_dir()):
        parser.error("Source path does not exist")

    pipeline = None
    totals = defaultdict(int)
    remaining = []
    for lesson in lessons:
        key = lesson.relative_to(TRANSLATIONS)
        source = args.source or source_for(args.source_root, lesson)
        tasks = read_json(lesson / "tasks.json")
        totals["tasks"] += len(tasks)
        if source is None:
            totals["missing sources"] += 1
            remaining.extend(unverified_rows(key, None, tasks, [], "missing source"))
            print(f"{key}: missing source ({len(tasks)} tasks)", flush=True)
            continue
        source = source.resolve()
        cache = CACHE / key
        previous = None
        if args.fill_gaps_from:
            previous, previous_folder = prior_report(cache, source, tasks, args.fill_gaps_from)
            if previous is None:
                totals["missing prior reports"] += 1
                remaining.extend(unverified_rows(key, source, tasks, [], "missing prior report"))
                print(f"{key}: no prior report", flush=True)
                continue
            previous_ids = {row["id"] for row in previous["rows"] if row["status"] == "verified"}
            totals["previously verified"] += len(previous_ids)
            if args.apply:
                added, replaced = apply_verified(lesson, cache, previous_folder, previous)
                totals["added"] += added
                totals["replaced"] += replaced
            tasks = [task for task in tasks if task["id"] not in previous_ids]
            if not tasks:
                continue
        settings = [REVISION, args.model, args.equivalent_spellings, args.fill_gaps_from]
        fingerprint = cache_key(source, tasks, settings)
        folder = cache / fingerprint
        report_path = folder / "report.json"
        try:
            folder.mkdir(parents=True, exist_ok=True)
            with FileLock(folder / "stage.lock"):
                report = read_json(report_path) if report_path.is_file() else None
                retry = args.retry_unverified and report and any(row["status"] != "verified" for row in report["rows"])
                if report is None or retry:
                    if pipeline is None:
                        pipeline = BatchedInferencePipeline(WhisperModel(
                            args.model, device=args.device,
                            compute_type="int8_float16" if args.device == "cuda" else "int8",
                        ))
                    report = stage(pipeline, source, lesson, tasks, folder, fingerprint, args, previous, report)
            verified = sum(row["status"] == "verified" for row in report["rows"])
            totals["verified"] += verified
            print(f"{key}: {verified}/{len(tasks)} verified ({source.name})", flush=True)
            if args.apply:
                added, replaced = apply_verified(lesson, cache, folder, report)
                totals["added"] += added
                totals["replaced"] += replaced
            remaining.extend(unverified_rows(key, source, tasks, report["rows"], "unverified"))
        except (OSError, ValueError, av.FFmpegError) as error:
            totals["errors"] += 1
            remaining.extend(unverified_rows(key, source, tasks, [], str(error)))
            print(f"{key}: {error}", flush=True)
    totals["unverified"] = len(remaining)
    if args.report:
        write_atomic(args.report, json_bytes({"totals": dict(totals), "unverified": remaining}))
    print(json.dumps(dict(totals), ensure_ascii=False), flush=True)
    if dll_handle:
        dll_handle.close()
    if totals["errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
