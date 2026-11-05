"""Measure each lesson first, then apply one constant gain to all its English clips."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from fractions import Fraction
import hashlib
import io
import json
import math
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time

import av
from faster_whisper.audio import decode_audio
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / 'public/translations'
CACHE = ROOT / '.lesson-audio-cache/lesson-gain'
RATE = 24000


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as file:
        temporary = Path(file.name)
        try:
            file.write(data)
            file.close()
            for attempt in range(9):
                try:
                    os.replace(temporary, path)
                    break
                except PermissionError:
                    if attempt == 8:
                        raise
                    time.sleep(min(.1 * 2**attempt, 2))
        finally:
            temporary.unlink(missing_ok=True)


def report(path, data):
    save(path, (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode())


def measure(paths):
    audio = np.concatenate([decode_audio(str(path), sampling_rate=RATE) for path in paths])
    result = subprocess.run([
        'ffmpeg', '-hide_banner', '-nostats', '-nostdin', '-threads', '1',
        '-f', 'f32le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0',
        '-af', 'loudnorm=I=-18:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'],
        input=audio.astype('<f4').tobytes(), stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=True)
    match = re.search(rb'\{\s*"input_i".*?\}', result.stderr, re.S)
    if not match:
        raise RuntimeError('FFmpeg did not return loudness measurements')
    values = json.loads(match[0])
    loudness, peak = float(values['input_i']), float(values['input_tp'])
    if not math.isfinite(loudness) or not math.isfinite(peak):
        raise ValueError('Cannot measure silent audio')
    return {'lufs': loudness, 'peak_dbtp': peak}


def plan(lesson, target, ceiling):
    folder = CACHE / lesson.relative_to(LESSONS)
    state_path = folder / 'plan.json'
    if state_path.is_file():
        state = json.loads(state_path.read_text(encoding='utf-8'))
        if state['target_lufs'] != target or state['ceiling_dbtp'] != ceiling:
            if state.get('complete'):
                raise ValueError(f'{lesson}: completed plan uses different settings')
            state['target_lufs'] = target
            state['ceiling_dbtp'] = ceiling
            state['gain_db'] = round(max(0, min(target - state['input']['lufs'], ceiling - state['input']['peak_dbtp'])), 2)
            if state['gain_db'] < .25:
                state['gain_db'] = 0.0
            report(state_path, state)
        return state
    paths = sorted((lesson / 'audio').glob('*_en.m4a'))
    if not paths:
        return None
    files = []
    for path in paths:
        content = path.read_bytes()
        save(folder / 'originals' / path.name, content)
        files.append({'name': path.name, 'input_sha256': sha(content)})
    original = measure([folder / 'originals' / file['name'] for file in files])
    gain = round(max(0, min(target - original['lufs'], ceiling - original['peak_dbtp'])), 2)
    # Preserve original bytes for practically inaudible adjustments.
    if abs(gain) < .25:
        gain = 0.0
    state = {'lesson': lesson.relative_to(LESSONS).as_posix(), 'target_lufs': target,
             'ceiling_dbtp': ceiling, 'input': original, 'gain_db': gain, 'files': files}
    report(state_path, state)
    return state


def encode(original, gain):
    samples = decode_audio(str(original), sampling_rate=RATE)
    samples *= np.float32(10 ** (gain / 20))
    buffer = io.BytesIO()
    with av.open(buffer, mode='w', format='ipod') as output:
        stream = output.add_stream('aac', rate=RATE)
        stream.layout = 'mono'
        stream.bit_rate = 128000
        frame = av.AudioFrame.from_ndarray(samples.reshape(1, -1), format='fltp', layout='mono')
        frame.sample_rate = RATE
        frame.pts = 0
        frame.time_base = Fraction(1, RATE)
        for packet in stream.encode(frame):
            output.mux(packet)
        for packet in stream.encode():
            output.mux(packet)
    return buffer.getvalue()


def apply(state):
    folder = CACHE / state['lesson']
    lesson = LESSONS / state['lesson']
    state_path = folder / 'plan.json'
    for file in state['files']:
        current = sha((lesson / 'audio' / file['name']).read_bytes())
        if current not in (file['input_sha256'], file.get('output_sha256')):
            raise ValueError(f"Input changed: {state['lesson']}/{file['name']}")
    if state.get('complete') and state.get('encoding_revision') == 2 and all(sha((lesson / 'audio' / file['name']).read_bytes()) == file['output_sha256'] for file in state['files']):
        return state
    if state['gain_db'] == 0:
        state['output'] = state['input']
        for file in state['files']:
            file['output_sha256'] = file['input_sha256']
            original = folder / 'originals' / file['name']
            if sha(original.read_bytes()) != file['input_sha256']:
                raise ValueError(f'Backup changed: {original}')
            if sha((lesson / 'audio' / file['name']).read_bytes()) != file['input_sha256']:
                save(lesson / 'audio' / file['name'], original.read_bytes())
        state['complete'] = True
        state['encoding_revision'] = 2
        report(state_path, state)
        return state
    staged = folder / 'staged'
    for attempt in range(3):
        for file in state['files']:
            original = folder / 'originals' / file['name']
            if sha(original.read_bytes()) != file['input_sha256']:
                raise ValueError(f'Backup changed: {original}')
            data = original.read_bytes() if state['gain_db'] == 0 else encode(original, state['gain_db'])
            save(staged / file['name'], data)
        result = measure([staged / file['name'] for file in state['files']])
        # Check the encoded AAC result and reduce the entire lesson if necessary.
        if result['peak_dbtp'] <= -1.0:
            break
        state['gain_db'] = round(state['gain_db'] - result['peak_dbtp'] - 1.5, 2)
    else:
        raise RuntimeError(f"Cannot achieve safe encoded peak for {state['lesson']}")
    state['output'] = result
    for file in state['files']:
        file['output_sha256'] = sha((staged / file['name']).read_bytes())
    report(state_path, state)
    for file in state['files']:
        save(lesson / 'audio' / file['name'], (staged / file['name']).read_bytes())
    state['complete'] = True
    state['encoding_revision'] = 2
    report(state_path, state)
    return state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('phase', choices=('plan', 'apply'))
    parser.add_argument('patterns', nargs='*')
    parser.add_argument('--target', type=float, default=-16)
    parser.add_argument('--ceiling', type=float, default=-1.5)
    parser.add_argument('--workers', type=int, default=4)
    args = parser.parse_args()
    if args.workers < 1 or not math.isfinite(args.target) or not math.isfinite(args.ceiling):
        parser.error('Use finite levels and a positive worker count')
    lessons = sorted({path.parent for pattern in args.patterns or ['*/*']
                      for path in LESSONS.glob(pattern + '/tasks.json')})
    states = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        if args.phase == 'plan':
            futures = {executor.submit(plan, lesson, args.target, args.ceiling): lesson for lesson in lessons}
        else:
            states = [json.loads((CACHE / lesson.relative_to(LESSONS) / 'plan.json').read_text(encoding='utf-8'))
                      for lesson in lessons if (CACHE / lesson.relative_to(LESSONS) / 'plan.json').is_file()]
            futures = {executor.submit(apply, state): state['lesson'] for state in states}
            states = []
        for future in as_completed(futures):
            state = future.result()
            if state:
                states.append(state)
                print(state['lesson'], f"gain={state['gain_db']:+.2f} dB", state.get('output', state['input']), flush=True)
    report(CACHE / f'{args.phase}-summary.json', states)
    print(f"{args.phase}: {len(states)} lessons, {sum(len(state['files']) for state in states)} files", flush=True)


if __name__ == '__main__':
    main()
