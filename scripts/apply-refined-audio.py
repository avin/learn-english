"""Install the reviewed boundary refinements and close transcription matches."""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

matches = {
    (126, 61): 0, (132, 52): 3, (149, 11): 7, (158, 3): 9,
    (174, 1): 15, (174, 50): 16, (176, 14): 17, (177, 54): 19,
    (179, 90): 45, (185, 2): 60, (189, 33): 61, (190, 60): 63,
    (191, 76): 64, (198, 31): 66,
}
trimmed = m.read_json(m.CACHE / 'trimmed-candidates' / 'report.json')
refined = m.read_json(m.CACHE / 'refined-candidates' / 'report.json')
selected = {}
for row in trimmed:
    key = (int(row['lesson']), row['id'])
    if m.words(row['expected'], True) == m.words(row['transcript'], True):
        selected.setdefault(key, row)
for key, index in matches.items():
    row = refined[index]
    if (int(row['lesson']), row['id']) != key:
        raise ValueError(f'Candidate order changed for {key}')
    selected.setdefault(key, row)
for (lesson_number, task_id), row in sorted(selected.items()):
    lesson = m.TRANSLATIONS / 'titan' / str(lesson_number)
    with m.FileLock(m.CACHE / 'titan' / str(lesson_number) / 'apply.lock'):
        tasks = m.read_json(lesson / 'tasks.json')
        task = next(task for task in tasks if task['id'] == task_id)
        if task['en']['text'] != row['expected']:
            raise ValueError(f'Text changed in lesson {lesson_number}, task {task_id}')
        path = lesson / 'audio' / m.audio_name(task_id)
        if path.exists() and path.stat().st_size:
            continue
        m.write_atomic(path, Path(row['file']).read_bytes())
        task['en']['audio'] = True
        m.write_atomic(lesson / 'tasks.json', m.json_bytes(tasks))
        print(lesson_number, task_id, row['transcript'])
