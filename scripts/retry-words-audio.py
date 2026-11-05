"""Retry unverified vocabulary clips with another local speech model."""
import argparse
import importlib.util
from pathlib import Path
import subprocess
import tempfile
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
from faster_whisper import BatchedInferencePipeline, WhisperModel
CACHE = m.CACHE / 'words-audio'


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('lessons', nargs='*', type=int)
    p.add_argument('--min-lesson', type=int, default=0)
    p.add_argument('--max-lesson', type=int, default=9999)
    p.add_argument('--model', default=str(m.CACHE / 'models' / 'small.en'))
    args = p.parse_args()
    pipeline = BatchedInferencePipeline(WhisperModel(args.model, device='cpu', compute_type='int8', cpu_threads=6))
    for report_path in sorted(CACHE.glob('*/report.json'), key=lambda x:int(x.parent.name)):
        n = int(report_path.parent.name)
        if n < args.min_lesson or n > args.max_lesson or (args.lessons and n not in args.lessons):
            continue
        report = m.read_json(report_path)
        if 'normalization' not in report:
            continue
        lesson = m.TRANSLATIONS / 'titan' / str(n)
        words_path = lesson / 'words.json'
        tasks = m.read_json(words_path)
        remaining = [t for t in tasks if not t['en'].get('audio')]
        if not remaining:
            continue
        folder = report_path.parent / 'retry-small'
        folder.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=folder) as tmp:
            normalized = Path(tmp) / 'normalized.wav'
            settings = report['normalization']
            filt = (f"volume={settings['gain_db']}dB,alimiter=limit={settings['limiter']}:"
                    'level=false:attack=5:release=50:latency=true')
            subprocess.run(['ffmpeg','-v','error','-nostdin','-y','-threads','1','-i',report['source'],
                '-af',filt,'-ar',str(m.OUTPUT_RATE),'-ac','1','-c:a','pcm_f32le',str(normalized)],check=True)
            retry = m.stage(pipeline, normalized, lesson, remaining, folder, 'retry',
                SimpleNamespace(batch_size=8,equivalent_spellings=True), None, None)
        old = {row['id']:row for row in report['rows']}
        installed = []
        for row in retry['rows']:
            if row['status'] != 'verified':
                continue
            prev = [r for i,r in old.items() if i < row['id'] and (lesson/'audio'/f"words_{m.audio_name(i)}").is_file()]
            nex = [r for i,r in old.items() if i > row['id'] and (lesson/'audio'/f"words_{m.audio_name(i)}").is_file()]
            if (prev and max(r['end'] for r in prev) > row['start']) or (nex and min(r['start'] for r in nex) < row['end']):
                continue
            content = (folder / m.audio_name(row['id'])).read_bytes()
            dest = lesson / 'audio' / f"words_{m.audio_name(row['id'])}"
            if dest.exists():
                continue
            m.write_atomic(dest, content)
            m.write_atomic(report_path.parent / m.audio_name(row['id']),content)
            next(t for t in tasks if t['id']==row['id'])['en']['audio']=True
            old[row['id']] = row
            installed.append(row['id'])
        if installed:
            report['rows'] = [old[t['id']] for t in tasks]
            m.write_atomic(report_path, m.json_bytes(report))
            m.write_atomic(words_path,m.json_bytes(tasks))
        print(f'{n}: recovered {len(installed)}/{len(remaining)} {installed}',flush=True)

if __name__ == '__main__':
    main()
