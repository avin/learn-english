"""Find candidate clips for manual review of English tasks without audio."""
import difflib
import importlib.util
import json
import os
from pathlib import Path
import sys

os.add_dll_directory(sys.argv[1])
os.environ['PATH'] = sys.argv[1] + os.pathsep + os.environ['PATH']
spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
model = m.BatchedInferencePipeline(m.WhisperModel(sys.argv[2], device='cuda', compute_type='int8_float16'))
output = []
for lesson in sorted((m.TRANSLATIONS / 'titan').iterdir(), key=lambda p: int(p.name)):
    tasks = m.read_json(lesson / 'tasks.json')
    missing = [t for t in tasks if not (lesson / 'audio' / m.audio_name(t['id'])).is_file()]
    if not missing:
        continue
    source = m.source_for(Path(r'F:\Английский по плейлистам'), lesson)
    if not source:
        continue
    audio = m.decode_audio(str(source), sampling_rate=m.OUTPUT_RATE)
    speech = m.decode_audio(str(source), sampling_rate=m.ASR_RATE)
    silences = m.silence_ranges(audio)
    segments = m.transcript(model, speech, list(m.transcription_windows(len(audio)/m.OUTPUT_RATE, silences)), 8, True)
    timed = []
    for segment in segments:
        for word in segment.words:
            for token in m.words(word.word, True):
                timed.append((token, float(word.start), float(word.end)))
    sequence = [w[0] for w in timed]
    for task in missing:
        expected = m.words(task['en']['text'], True)
        matches = []
        for i in range(len(sequence)):
            for size in range(max(2, len(expected)-2), len(expected)+3):
                part = sequence[i:i+size]
                if not part:
                    continue
                score = difflib.SequenceMatcher(None, expected, part).ratio()
                if score >= .72:
                    matches.append((score, i, min(i+size, len(sequence))))
        if not matches:
            continue
        score, first, end = max(matches)
        starts = [s for s in silences if s[0] <= timed[first][1]+0.4 and s[1] >= timed[first][1]-1.3]
        ends = [s for s in silences if s[0] <= timed[end-1][2]+1.2 and s[1] >= timed[end-1][2]-0.3]
        start = max(0, timed[first][1] - .12)
        stop = min(len(audio) / m.OUTPUT_RATE, timed[end-1][2] + .2)
        if first:
            start = max(start, (timed[first - 1][2] + timed[first][1]) / 2)
        if end < len(timed):
            stop = min(stop, (timed[end - 1][2] + timed[end][1]) / 2)
        if not .3 < stop-start < 18:
            continue
        content, decoded = m.encode_clip(audio,start,stop)
        recognized = m.transcribe_clips(model, [(content,decoded)], 1, individual=True)[0]
        folder = m.CACHE / 'manual-candidates' / lesson.name
        name = m.audio_name(task['id'])
        m.write_atomic(folder/name,content)
        output.append({'lesson':lesson.name,'id':task['id'],'expected':task['en']['text'], 'transcript':recognized,'source':str(source),'start':float(start),'end':float(stop),'score':score})
    print(lesson.name, len(output), flush=True)
    m.write_atomic(m.CACHE/'manual-candidates'/'report.json',m.json_bytes(output))
