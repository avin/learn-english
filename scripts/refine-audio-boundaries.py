"""Try alternative silence boundaries for uninstalled review candidates."""
import importlib.util
import os
from pathlib import Path
import sys

os.add_dll_directory(sys.argv[1])
os.environ['PATH'] = sys.argv[1] + os.pathsep + os.environ['PATH']
spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
model = m.BatchedInferencePipeline(m.WhisperModel(sys.argv[2], device='cuda', compute_type='int8_float16'))
reports = m.read_json(m.CACHE / 'manual-candidates' / 'report.json')
results = []
source = None
audio = None
for row in reports:
    lesson = m.TRANSLATIONS / 'titan' / row['lesson']
    if (lesson / 'audio' / m.audio_name(row['id'])).is_file():
        continue
    if source != row['source']:
        source = row['source']
        audio = m.decode_audio(source, sampling_rate=m.OUTPUT_RATE)
        silences = m.silence_ranges(audio)
    starts = [min(right - .05, left + .12) for left, right in silences if row['start'] - 2.2 < right < row['start'] + 2.2]
    ends = [min(right - .05, left + .16) for left, right in silences if row['end'] - 2.2 < left < row['end'] + 2.2]
    starts = sorted(starts, key=lambda value: abs(value - row['start']))[:4]
    ends = sorted(ends, key=lambda value: abs(value - row['end']))[:4]
    options = [(start, end) for start in starts for end in ends if .3 < end - start < 15]
    if not options:
        continue
    encoded = [m.encode_clip(audio, start, end) for start, end in options]
    texts = m.transcribe_clips(model, encoded, 8, individual=True)
    for (start, end), (content, _), text in zip(options, encoded, texts):
        if not text:
            continue
        folder = m.CACHE / 'refined-candidates' / row['lesson']
        name = f"{row['id']:03}_{len(results)}.m4a"
        m.write_atomic(folder / name, content)
        results.append({'lesson': row['lesson'], 'id': row['id'], 'expected': row['expected'],
                        'transcript': text, 'start': float(start), 'end': float(end), 'file': str(folder / name)})
    m.write_atomic(m.CACHE / 'refined-candidates' / 'report.json', m.json_bytes(results))
    print(row['lesson'], row['id'], len(options), flush=True)
