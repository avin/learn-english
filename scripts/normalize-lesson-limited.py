"""Apply fixed lesson gain and the approved short-peak limiter to English clips."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile

spec = importlib.util.spec_from_file_location('lesson_gain', Path(__file__).with_name('normalize-lesson-gain.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
DEST = m.ROOT / '.lesson-audio-cache/lesson-limited'
TARGET = -19.0
VERSION = 1


def encode(original, gain, limit):
    with tempfile.NamedTemporaryFile(suffix='.m4a', dir=DEST, delete=False) as file:
        path = Path(file.name)
    try:
        result = subprocess.run([
            'ffmpeg', '-v', 'error', '-nostdin', '-y', '-threads', '1', '-i', str(original),
            '-af', f'volume={gain}dB,alimiter=limit={limit}:level=false:attack=5:release=50:latency=true',
            '-c:a', 'aac', '-b:a', '128k', '-ar', '24000', '-ac', '1', str(path)],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        if result.returncode:
            raise RuntimeError(result.stderr.decode('utf-8', errors='replace') or f'FFmpeg exited {result.returncode}')
        return path.read_bytes()
    finally:
        path.unlink(missing_ok=True)


def process(old_path):
    old = json.loads(old_path.read_text(encoding='utf-8'))
    folder = DEST / old['lesson']
    state_path = folder / 'plan.json'
    lesson = m.LESSONS / old['lesson'] / 'audio'
    originals = old_path.parent / 'originals'
    previous = json.loads(state_path.read_text(encoding='utf-8')) if state_path.is_file() else None
    if previous:
        if previous['version'] != VERSION:
            raise ValueError('Cached limiter settings changed')
        if previous.get('complete') and all(m.sha((lesson / f['name']).read_bytes()) == f['output_sha256'] for f in previous['files']):
            return previous
    gain = round(max(0, TARGET - old['input']['lufs']), 2)
    if gain < .25:
        gain = 0.0
    state = {'lesson': old['lesson'], 'version': VERSION, 'target_lufs': TARGET,
             'gain_db': gain, 'input': old['input'], 'files': [], 'limiter': .794}
    prior_files = {f['name']: f for f in previous['files']} if previous else {}
    for f in old['files']:
        original = originals / f['name']
        if m.sha(original.read_bytes()) != f['input_sha256']:
            raise ValueError(f'Backup changed: {original}')
        current = m.sha((lesson / f['name']).read_bytes())
        allowed = {f['input_sha256'], f['output_sha256'], prior_files.get(f['name'], {}).get('output_sha256')}
        if current not in allowed:
            raise ValueError(f"File changed: {lesson / f['name']}")
        state['files'].append({'name': f['name'], 'input_sha256': f['input_sha256'], 'previous_sha256': current})
    staged = folder / 'staged'
    for attempt in range(3):
        for f in state['files']:
            source = originals / f['name']
            data = encode(source, gain, state['limiter']) if gain else source.read_bytes()
            m.save(staged / f['name'], data)
        output = m.measure([staged / f['name'] for f in state['files']]) if gain else old['input']
        if not gain or output['peak_dbtp'] <= -1:
            break
        state['limiter'] *= 10 ** ((-1.5 - output['peak_dbtp']) / 20)
    else:
        raise RuntimeError(f"Unsafe encoded peak: {old['lesson']}")
    state['output'] = output
    for f in state['files']:
        f['output_sha256'] = m.sha((staged / f['name']).read_bytes())
    m.report(state_path, state)
    for f in state['files']:
        dest = lesson / f['name']
        current = m.sha(dest.read_bytes())
        if current not in (f['previous_sha256'], f['output_sha256']):
            raise ValueError(f'File changed before installation: {dest}')
        if current != f['output_sha256']:
            m.save(dest, (staged / f['name']).read_bytes())
    state['complete'] = True
    m.report(state_path, state)
    for f in state['files']:
        (staged / f['name']).unlink()
    return state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('patterns', nargs='*')
    parser.add_argument('--workers', type=int, default=6)
    args = parser.parse_args()
    if args.workers < 1:
        parser.error('--workers must be positive')
    paths = sorted({path for pattern in args.patterns or ['*/*'] for path in m.CACHE.glob(pattern + '/plan.json')})
    if not paths:
        parser.error('No original lesson plans found; run normalize-lesson-gain.py plan first')
    DEST.mkdir(parents=True, exist_ok=True)
    states = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(process, path): path for path in paths}
        for future in as_completed(futures):
            state = future.result()
            states.append(state)
            print(state['lesson'], f"gain={state['gain_db']:+.2f}dB", state['output'], flush=True)
    m.report(DEST / 'summary.json', states)
    print(f"Done: {len(states)} lessons, {sum(len(s['files']) for s in states)} files", flush=True)


if __name__ == '__main__':
    main()
