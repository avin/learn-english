"""Restore pre-normalization audio from the local import cache or Git."""
import hashlib
import os
from pathlib import Path
import sqlite3
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.lesson-audio-cache'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def replace(path, data):
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as file:
        temp = Path(file.name)
        try:
            file.write(data)
            file.close()
            os.replace(temp, path)
        finally:
            temp.unlink(missing_ok=True)


def main():
    db = sqlite3.connect(CACHE / 'normalization.sqlite3')
    rows = db.execute('SELECT path, input_hash, output_hash FROM normalized WHERE version=?', ('dynaudnorm-loudnorm-v1',)).fetchall()
    required = {row[1] for row in rows}
    cached = {}
    for index, path in enumerate(CACHE.rglob('*.m4a'), 1):
        value = sha(path.read_bytes())
        if value in required:
            cached.setdefault(value, path)
        if index % 5000 == 0:
            print(f'Indexed {index} cache files, found {len(cached)} originals', flush=True)
    missing = [(path, wanted, current) for path, wanted, current in rows if wanted not in cached]
    print(f'Cached originals: {len(rows)-len(missing)} of {len(rows)} files. Checking Git for {len(missing)}.', flush=True)
    tree = subprocess.check_output(['git', 'ls-tree', '-r', '-z', 'HEAD', '--', 'public/translations'], cwd=ROOT)
    objects = {}
    for item in tree.split(b'\0'):
        if not item:
            continue
        meta, name = item.split(b'\t', 1)
        objects[name.decode('utf-8')] = meta.split()[2].decode('ascii')
    git_paths = [(path, wanted, current, objects[path]) for path, wanted, current in missing if path in objects]
    proc = subprocess.Popen(['git', 'cat-file', '--batch'], cwd=ROOT, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    git_data = {}
    for path, wanted, current, oid in git_paths:
        proc.stdin.write((oid + '\n').encode())
        proc.stdin.flush()
        header = proc.stdout.readline().split()
        if len(header) != 3 or header[1] != b'blob':
            continue
        data = proc.stdout.read(int(header[2]))
        proc.stdout.read(1)
        if sha(data) == wanted:
            git_data[wanted] = data
    proc.stdin.close()
    proc.wait()
    restored = already = 0
    failed = []
    for path, wanted, current in rows:
        dest = ROOT / path
        if dest.parent.name == 'audio' and not dest.name.startswith('tasks_'):
            dest = dest.with_name('tasks_' + dest.name)
        try:
            actual = sha(dest.read_bytes())
            if actual == wanted:
                already += 1
                continue
            if actual != current:
                failed.append((path, 'changed since normalization'))
                continue
            if wanted in cached:
                content = cached[wanted].read_bytes()
            elif wanted in git_data:
                content = git_data[wanted]
            else:
                failed.append((path, 'original not found'))
                continue
            if sha(content) != wanted:
                failed.append((path, 'original checksum mismatch'))
                continue
            replace(dest, content)
            restored += 1
        except OSError as error:
            failed.append((path, str(error)))
        if restored and restored % 3000 == 0:
            print(f'Restored {restored}', flush=True)
    db.close()
    print(f'Restored {restored}, already restored {already}, unresolved {len(failed)}', flush=True)
    for item in failed:
        print('UNRESOLVED', *item, flush=True)
    if failed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
