"""Install the reviewed candidates from the current manual review report."""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

# Each pair was checked against the independent transcription in report.json.
approved = {
    (127, 56), (132, 33), (133, 19), (133, 36), (134, 9), (135, 39),
    (142, 96), (142, 98), (145, 84), (146, 8), (146, 47), (146, 56),
    (146, 62), (147, 35), (147, 82), (150, 54), (150, 59), (151, 14),
    (153, 7), (156, 77), (162, 7), (177, 40), (179, 38), (182, 2),
    (182, 51), (183, 18), (186, 27), (186, 47), (186, 48), (189, 26),
    (189, 70), (194, 8), (194, 38), (200, 62), (201, 42), (204, 38), (205, 74),
}
folder = m.CACHE / 'manual-candidates'
rows = m.read_json(folder / 'report.json')
for lesson_number, task_id in sorted(approved):
    row = next(row for row in rows if int(row['lesson']) == lesson_number and row['id'] == task_id)
    lesson = m.TRANSLATIONS / 'titan' / str(lesson_number)
    with m.FileLock(m.CACHE / 'titan' / str(lesson_number) / 'apply.lock'):
        tasks = m.read_json(lesson / 'tasks.json')
        task = next(task for task in tasks if task['id'] == task_id)
        if task['en']['text'] != row['expected']:
            raise ValueError(f'Text changed in lesson {lesson_number}, task {task_id}')
        path = lesson / 'audio' / m.audio_name(task_id)
        if path.exists() and path.stat().st_size:
            continue
        m.write_atomic(path, (folder / str(lesson_number) / m.audio_name(task_id)).read_bytes())
        task['en']['audio'] = True
        m.write_atomic(lesson / 'tasks.json', m.json_bytes(tasks))
    print(lesson_number, task_id, row['transcript'])
