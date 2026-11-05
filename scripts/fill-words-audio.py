"""Fill missing vocabulary audio in dictionary order using surrounding clips and pauses."""
import argparse
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import numpy as np

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
CACHE = m.CACHE / 'words-audio'


def groups(indices):
    result = []
    for index in indices:
        if result and index == result[-1][-1] + 1:
            result[-1].append(index)
        else:
            result.append([index])
    return result


def boundaries(audio, start, end, count, *, intro=False, lesson=None):
    rate = m.OUTPUT_RATE
    frame = rate // 100
    start_frame, end_frame = round(start * 100), round(end * 100)
    segment = audio[start_frame * frame:end_frame * frame]
    segment = segment[:len(segment) // frame * frame]
    if not len(segment):
        raise ValueError('Empty interval')
    amplitude = np.max(np.abs(segment.reshape(-1, frame)), axis=1)
    quiet = amplitude < .01
    edges = np.flatnonzero(np.diff(np.r_[False, quiet, False]))
    pauses = [(int(a), int(b)) for a, b in zip(edges[::2], edges[1::2])
              if b - a >= 4 and a > 0 and b < len(quiet)]
    # B1 recordings begin with a spoken lesson announcement.
    if intro:
        candidates = [(a, b) for a, b in pauses if b-a >= 25]
        if candidates:
            _, cut = candidates[-1]
            start_frame += cut
            amplitude = amplitude[cut:]
            pauses = [(a-cut, b-cut) for a, b in pauses if a >= cut]
    active = np.flatnonzero(amplitude >= .01)
    if not len(active):
        raise ValueError('No speech in interval')
    left, right = max(0, int(active[0])-12), min(len(amplitude), int(active[-1])+13)
    pauses = [(a, b) for a, b in pauses if a > left and b < right]
    if lesson == 199 and count == 3:
        # Whole-recording word timestamps put the adjoining words at 15.72 s.
        cuts = [max(pauses, key=lambda pair: pair[1]-pair[0]),
                (round(15.72*100)-start_frame, round(15.72*100)-start_frame)]
    else:
        cuts = sorted(sorted(pauses, key=lambda pair: pair[1]-pair[0], reverse=True)[:count-1])
    if len(cuts) != count-1:
        raise ValueError(f'Only {len(cuts)} pauses for {count} words')
    starts = [left] + [max(a, b-12) for a, b in cuts]
    ends = [min(b, a+12) for a, b in cuts] + [right]
    result = [((start_frame + a) / 100, (start_frame + b) / 100) for a,b in zip(starts, ends)]
    if any(b-a < .15 for a,b in result):
        raise ValueError(f'Unexpectedly short fragment: {result}')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    total = 0
    for report_path in sorted(CACHE.glob('*/report.json'), key=lambda p:int(p.parent.name)):
        number = int(report_path.parent.name)
        lesson = m.TRANSLATIONS / 'titan' / str(number)
        path = lesson / 'words.json'
        words = m.read_json(path)
        missing = [i for i,w in enumerate(words) if not w['en']['audio']]
        if not missing:
            continue
        report = m.read_json(report_path)
        settings = report['normalization']
        with tempfile.TemporaryDirectory(dir=report_path.parent) as tmp:
            norm = Path(tmp) / 'normalized.wav'
            filt = (f"volume={settings['gain_db']}dB,alimiter=limit={settings['limiter']}:"
                    'level=false:attack=5:release=50:latency=true')
            subprocess.run(['ffmpeg','-v','error','-nostdin','-y','-threads','1','-i',report['source'],
                '-af',filt,'-ar',str(m.OUTPUT_RATE),'-ac','1','-c:a','pcm_f32le',str(norm)],check=True)
            audio = m.decode_audio(str(norm), sampling_rate=m.OUTPUT_RATE)
        rows = report['rows']
        cuts = []
        for indices in groups(missing):
            before = rows[indices[0]-1]['end'] if indices[0] else 0
            after = rows[indices[-1]+1]['start'] if indices[-1]+1 < len(rows) else len(audio)/m.OUTPUT_RATE
            segments = boundaries(audio, before, after, len(indices),
                intro=indices[0] == 0 and 151 <= number <= 200, lesson=number)
            cuts.extend(zip(indices, segments))
        for i,(start,end) in cuts:
            w=words[i]; row=rows[i]; dest=lesson/'audio'/f"words_{m.audio_name(w['id'])}"
            if dest.exists():
                raise ValueError(f'Existing file: {dest}')
            content,_=m.encode_clip(audio,start,end)
            print(f"{number}/{w['id']}: {w['en']['text']} {start:.2f}–{end:.2f}",flush=True)
            if args.apply:
                m.write_atomic(dest,content)
                m.write_atomic(report_path.parent/m.audio_name(w['id']),content)
                row.update(status='ordered',start=start,end=end,sha256=m.hashlib.sha256(content).hexdigest())
                w['en']['audio']=True
            total += 1
        if args.apply:
            m.write_atomic(report_path,m.json_bytes(report))
            m.write_atomic(path,m.json_bytes(words))
    print(f'Words: {total}',flush=True)

if __name__ == '__main__':
    main()
