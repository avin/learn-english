"""Trim neighbouring words from candidate clips using word timestamps."""
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
rows = m.read_json(m.CACHE / 'refined-candidates' / 'report.json')
output = []
for row in rows:
    if int(row['lesson']) not in (132, 139, 179, 183, 198):
        continue
    path = Path(row['file'])
    audio = m.decode_audio(str(path), sampling_rate=m.OUTPUT_RATE)
    speech = m.decode_audio(str(path), sampling_rate=m.ASR_RATE)
    segments = m.transcript(model, speech, [{'start': 0, 'end': len(speech)/m.ASR_RATE}], 1, True)
    timed = [(token, float(word.start), float(word.end)) for seg in segments for word in seg.words for token in m.words(word.word, True)]
    tokens = [word[0] for word in timed]
    expected = list(m.words(row['expected'], True))
    for i in range(len(tokens) - len(expected) + 1):
        if tokens[i:i+len(expected)] != expected:
            continue
        end_index = i + len(expected) - 1
        start = max(0, timed[i][1] - .12)
        stop = min(len(audio)/m.OUTPUT_RATE, timed[end_index][2] + .20)
        if i and start < timed[i-1][2]:
            start = (timed[i-1][2] + timed[i][1]) / 2
        if end_index + 1 < len(timed) and stop > timed[end_index+1][1]:
            stop = (timed[end_index][2] + timed[end_index+1][1]) / 2
        if stop <= start:
            continue
        content, decoded = m.encode_clip(audio, start, stop)
        transcript = m.transcribe_clips(model, [(content, decoded)], 1, individual=True)[0]
        folder = m.CACHE / 'trimmed-candidates' / row['lesson']
        file = folder / f"{row['id']:03}_{len(output)}.m4a"
        m.write_atomic(file, content)
        output.append({'lesson': row['lesson'], 'id': row['id'], 'expected': row['expected'], 'transcript': transcript, 'file': str(file)})
        break
    print(row['lesson'], row['id'], len(output), flush=True)
    m.write_atomic(m.CACHE / 'trimmed-candidates' / 'report.json', m.json_bytes(output))
