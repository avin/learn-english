"""Normalize vocabulary recordings and import independently verified English clips."""
import argparse
import importlib.util
import json
import math
from pathlib import Path
import re
import subprocess
import tempfile
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
from faster_whisper import BatchedInferencePipeline, WhisperModel

ROOT = m.ROOT
CACHE = m.CACHE / 'words-audio'
SOURCE = Path(r'F:\Английский по плейлистам\Титановый')


def source_for(number, root):
    level = m.LEVELS[(number - 1) // 50]
    folder = root / level / str(number)
    if not folder.is_dir():
        return None
    matches = [p for p in folder.glob('*.mp3') if re.search(r'(?:new words|словар|\d+[wв]\.mp3)', p.name, re.I)]
    if len(matches) > 1:
        raise ValueError(f'Multiple vocabulary recordings: {folder}')
    return matches[0] if matches else None


def normalized(source, dest):
    measure = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-nostdin', '-i', str(source),
        '-af', 'loudnorm=I=-19:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'],
        stderr=subprocess.PIPE, stdout=subprocess.DEVNULL, check=True).stderr
    found = re.search(rb'\{\s*"input_i".*?\}', measure, re.S)
    if not found:
        raise ValueError(f'Cannot measure {source}')
    values = json.loads(found[0])
    loudness = float(values['input_i'])
    if not math.isfinite(loudness):
        raise ValueError(f'Silent recording: {source}')
    gain = round(max(0, -19 - loudness), 2)
    if gain < .25:
        gain = 0
    filt = f'volume={gain}dB,alimiter=limit=0.794:level=false:attack=5:release=50:latency=true'
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-threads', '1', '-i', str(source),
        '-af', filt, '-ar', str(m.OUTPUT_RATE), '-ac', '1', '-c:a', 'pcm_f32le', str(dest)], check=True)
    return {'input_lufs': loudness, 'gain_db': gain, 'limiter': .794}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('lessons', nargs='*', type=int)
    p.add_argument('--source-root', type=Path, default=SOURCE)
    p.add_argument('--model', default=str(m.CACHE / 'models' / 'base.en'))
    p.add_argument('--device', choices=['cpu', 'cuda'], default='cpu')
    p.add_argument('--batch-size', type=int, default=8)
    args = p.parse_args()
    lessons = sorted((m.TRANSLATIONS / 'titan').glob('*/words.json'), key=lambda x: int(x.parent.name))
    if args.lessons:
        lessons = [p for p in lessons if int(p.parent.name) in args.lessons]
    if not lessons:
        p.error('No matching dictionaries')
    CACHE.mkdir(parents=True, exist_ok=True)
    pipeline = BatchedInferencePipeline(WhisperModel(args.model, device=args.device,
        compute_type='int8_float16' if args.device == 'cuda' else 'int8', cpu_threads=6))
    totals = {'lessons': 0, 'words': 0, 'ready': 0, 'missing_sources': 0}
    for path in lessons:
        number = int(path.parent.name)
        source = source_for(number, args.source_root)
        tasks = m.read_json(path)
        totals['words'] += len(tasks)
        if source is None:
            totals['missing_sources'] += 1
            print(f'{number}: no recording', flush=True)
            continue
        folder = CACHE / str(number)
        folder.mkdir(parents=True, exist_ok=True)
        signature = m.cache_key(source, tasks, ['words-v1', args.model])
        report_path = folder / 'report.json'
        report = m.read_json(report_path) if report_path.exists() else None
        if not report or report.get('fingerprint') != signature or 'normalization' not in report:
            with tempfile.TemporaryDirectory(dir=folder) as tmp:
                normalized_path = Path(tmp) / 'normalized.wav'
                settings = normalized(source, normalized_path)
                report = m.stage(pipeline, normalized_path, path.parent, tasks, folder, signature,
                    SimpleNamespace(batch_size=args.batch_size, equivalent_spellings=True), None, None)
                report['source'] = str(source)
                report['normalization'] = settings
                m.write_atomic(report_path, m.json_bytes(report))
        # Install only independently verified clips, in their original order.
        verified = [row for row in report['rows'] if row['status'] in ('verified', 'ordered')]
        bad = set()
        for left, right in zip(verified, verified[1:]):
            if left['end'] > right['start'] + .15:
                bad.update((left['id'], right['id']))
        installed = 0
        for row in verified:
            if row['id'] in bad:
                continue
            item = next(t for t in tasks if t['id'] == row['id'])
            if item['en']['text'] != row['expected']:
                raise ValueError(f"Changed word: {path} {row['id']}")
            content = (folder / m.audio_name(row['id'])).read_bytes()
            if m.hashlib.sha256(content).hexdigest() != row['sha256']:
                raise ValueError('Staged audio changed')
            dest = path.parent / 'audio' / f"words_{m.audio_name(row['id'])}"
            if dest.exists() and dest.read_bytes() != content:
                print(f'{number}/{row["id"]}: existing file differs; skipped', flush=True)
                continue
            if not dest.exists():
                m.write_atomic(dest, content)
            item['en']['audio'] = True
            installed += 1
        m.write_atomic(path, m.json_bytes(tasks))
        totals['lessons'] += 1
        totals['ready'] += installed
        print(f'{number}: {installed}/{len(tasks)} ready; gain {report["normalization"]["gain_db"]} dB', flush=True)
    print(json.dumps(totals), flush=True)

if __name__ == '__main__':
    main()
