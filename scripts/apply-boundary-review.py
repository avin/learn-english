"""Install individually reviewed clips located by word timestamps."""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('lesson_audio', Path(__file__).with_name('import-lesson-audio.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

approved = {
    (128, 26), (128, 27), (142, 75), (142, 76), (145, 82), (145, 83),
    (150, 88), (150, 89), (158, 4), (174, 29), (174, 30), (179, 8),
    (179, 17), (179, 22), (179, 39), (183, 69), (198, 52),
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
