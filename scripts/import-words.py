#!/usr/bin/env python3
"""Extract lesson dictionaries from the original text-based PDFs."""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
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

    source = args.source / "Титановый"
    if not source.is_dir():
        parser.error(f"Source directory not found: {source}")
    if not (args.translations / "titan").is_dir():
        parser.error(f"Titan course not found in {args.translations}")
    pdfs = sorted(p for p in source.glob("*/*/*.pdf") if "словар" in p.stem.casefold())
    if not pdfs:
        parser.error(f"No dictionary PDFs found in {source}")

    destinations = {}
    for pdf in pdfs:
        lesson = pdf.parent.name
        target_dir = args.translations / "titan" / lesson
        if not (target_dir / "tasks.json").is_file():
            print(f"Skipping {pdf}: no matching lesson", file=sys.stderr)
            continue
        if lesson in destinations:
            raise ValueError(f"Multiple dictionaries for lesson {lesson}: {destinations[lesson]} and {pdf}")
        destinations[lesson] = pdf

    # Validate every PDF before writing any files.
    results = []
    for lesson, pdf in destinations.items():
        result = subprocess.run([args.pdftotext, "-enc", "UTF-8", "-layout", str(pdf), "-"],
                                check=True, stdout=subprocess.PIPE)
        words = parse_words(result.stdout.decode("utf-8-sig"), pdf)
        results.append((args.translations / "titan" / lesson / "words.json", words))
    for target, words in results:
        if not args.dry_run:
            target.write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{'Validated' if args.dry_run else 'Written'} {len(results)} dictionaries, "
          f"{sum(len(words) for _, words in results)} entries; "
          f"skipped {len(pdfs) - len(results)} PDFs without matching lessons.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
