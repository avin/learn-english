#!/usr/bin/env python3
"""Extract lesson dictionaries from the original text-based PDFs."""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
HEADING = re.compile(r"^слова\s+к\s+уроку\s*[:№\d.\-–—]*$", re.I)
ENTRY = re.compile(r"^(?:(\d+)\.?\s+)?(.+?)\s*\[([^\[\]]+)\]\s*[-–—]\s*(.+)$")


def parse_words(text, source):
    words = []
    for line_number, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.isdecimal() or line.casefold() == "слова к уроку":
            continue
        match = ENTRY.fullmatch(line)
        if not match:
            raise ValueError(f"{source}:{line_number}: unrecognized line: {line!r}")
        _, english, transcription, russian = match.groups()
        words.append({
            "id": len(words) + 1,
            "ru": {"text": russian.strip(), "audio": False},
            "en": {"text": english.strip(), "audio": False, "transcription": transcription.strip()},
        })
    if not words:
        raise ValueError(f"{source}: no dictionary entries found")
    return words


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path("F:/Английский по плейлистам"),
                        help="Directory containing the original course materials")
    parser.add_argument("--translations", type=Path, default=ROOT / "public" / "translations")
    parser.add_argument("--pdftotext", default="pdftotext", help="Path to Poppler's pdftotext")
    parser.add_argument("--dry-run", action="store_true", help="Validate without writing files")
    args = parser.parse_args()

    sources = [("titan", args.source / "Титановый"), ("express", args.source / "Экспресс")]
    if not all(folder.is_dir() for _, folder in sources):
        parser.error(f"Course directories not found in {args.source}")
    pdfs = [(course, p) for course, folder in sources for p in folder.rglob("*.pdf")]
    candidates = {}
    scanned = 0
    for course, pdf in sorted(pdfs, key=lambda item: str(item[1])):
        result = subprocess.run([args.pdftotext, "-enc", "UTF-8", "-layout", str(pdf), "-"],
                                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        lines = result.stdout.decode("utf-8-sig").splitlines()
        scanned += 1
        headings = [i for i, line in enumerate(lines) if HEADING.fullmatch(line.strip())]
        standalone = course == "titan" and "словар" in pdf.stem.casefold()
        if not headings and not standalone:
            continue
        if len(headings) > 1:
            raise ValueError(f"Multiple vocabulary headings in {pdf}")
        text = "\n".join(lines[headings[0] + 1:]) if headings else "\n".join(lines)
        if course == "titan":
            if not pdf.parent.name.isdecimal():
                raise ValueError(f"Cannot identify lesson for {pdf}")
            lesson = pdf.parent.name
        else:
            pair = re.match(r"^(\d+\s*-\s*\d+)\.", pdf.stem)
            if not pair:
                raise ValueError(f"Cannot identify Express lesson for {pdf}")
            lesson = f"{pdf.parent.name} {re.sub(r'\s+', '', pair.group(1))}"
        target = args.translations / course / lesson / "words.json"
        words = parse_words(text, pdf)
        if target in candidates and candidates[target][0] != words:
            raise ValueError(f"Conflicting dictionaries for {target}: {candidates[target][1]} and {pdf}")
        candidates[target] = (words, pdf)

    created = []
    existing = []
    for target, (words, pdf) in candidates.items():
        if target.exists():
            old = json.loads(target.read_text(encoding="utf-8"))
            def content(row):
                return row["id"], row["en"]["text"], row["en"].get("transcription"), row["ru"]["text"]
            if list(map(content, old)) != list(map(content, words)):
                raise ValueError(f"Existing dictionary differs from {pdf}: {target}; left unchanged")
            existing.append(target)
        else:
            created.append((target, words))
    for target, words in created:
        if not args.dry_run:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{'Would create' if args.dry_run else 'Created'} {target} ({len(words)} entries)")
    print(f"Scanned {scanned} PDFs; {'would create' if args.dry_run else 'created'} {len(created)} "
          f"dictionaries; preserved {len(existing)} existing dictionaries.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
