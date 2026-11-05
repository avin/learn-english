"""Verify AAC true peaks and re-cut from the source if a lesson exceeds the ceiling."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(filename))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

m = load('lesson_audio', 'import-lesson-audio.py')
gain = load('lesson_gain', 'normalize-lesson-gain.py')
CACHE = m.CACHE / 'words-audio'


def refine(report_path):
    report = m.read_json(report_path)
    if 'normalization' not in report:
        return None
    lesson = m.TRANSLATIONS / 'titan' / report_path.parent.name
    rows = []
    for row in report['rows']:
        dest = lesson / 'audio' / f"words_{m.audio_name(row['id'])}"
        if row['status'] in ('verified', 'ordered') and dest.is_file():
            if m.hashlib.sha256(dest.read_bytes()).hexdigest() != row['sha256']:
                raise ValueError(f'File has changed: {dest}')
            rows.append((row, dest))
    if not rows:
        return None
    measured = gain.measure([dest for _, dest in rows])
    if measured['peak_dbtp'] <= -1:
        return (report_path.parent.name, measured['peak_dbtp'], False)
    limit = report['normalization'].get('limiter', .794)
    source = Path(report['source'])
    with tempfile.TemporaryDirectory(dir=report_path.parent) as tmp:
        tmp = Path(tmp)
        for attempt in range(5):
            limit *= 10 ** ((-1.5 - measured['peak_dbtp']) / 20)
            norm = tmp / 'normalized.wav'
            filt = (f"volume={report['normalization']['gain_db']}dB,"
                    f'alimiter=limit={limit}:level=false:attack=5:release=50:latency=true')
            subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-threads', '1',
                '-i', str(source), '-af', filt, '-ar', str(m.OUTPUT_RATE), '-ac', '1',
                '-c:a', 'pcm_f32le', str(norm)], check=True)
            audio = m.decode_audio(str(norm), sampling_rate=m.OUTPUT_RATE)
            for row, dest in rows:
                content, _ = m.encode_clip(audio, row['start'], row['end'])
                (tmp / dest.name).write_bytes(content)
            measured = gain.measure([tmp / dest.name for _, dest in rows])
            if measured['peak_dbtp'] <= -1:
                break
        else:
            raise ValueError(f'Cannot achieve peak ceiling: {source}, {measured}')
        for row, dest in rows:
            content = (tmp / dest.name).read_bytes()
            m.write_atomic(dest, content)
            m.write_atomic(report_path.parent / m.audio_name(row['id']), content)
            row['sha256'] = m.hashlib.sha256(content).hexdigest()
        report['normalization']['limiter'] = limit
        report['normalization']['output_peak_dbtp'] = measured['peak_dbtp']
        m.write_atomic(report_path, m.json_bytes(report))
    return (report_path.parent.name, measured['peak_dbtp'], True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--max-lesson', type=int)
    parser.add_argument('--min-lesson', type=int, default=0)
    args = parser.parse_args()
    reports = [p for p in CACHE.glob('*/report.json') if int(p.parent.name) >= args.min_lesson and (args.max_lesson is None or int(p.parent.name) <= args.max_lesson)]
    errors = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for f in as_completed({pool.submit(refine, p): p for p in reports}):
            try:
                result = f.result()
                if result:
                    print(*result, flush=True)
            except Exception as exc:
                errors.append(str(exc))
                print('ERROR', exc, flush=True)
    if errors:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
