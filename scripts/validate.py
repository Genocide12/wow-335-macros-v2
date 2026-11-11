#!/usr/bin/env python3
"""Validate source macro layout and the WoW 3.3.5 macro text limit."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ("ru", "en")
FILES = ("01-attack-rotation.txt", "02-aoe-pack.txt", "03-interrupt.txt")
LIMIT = 255


def main() -> int:
    errors: list[str] = []
    for language in LANGUAGES:
        for filename in FILES:
            path = ROOT / "macros" / "warrior-smart" / language / filename
            if not path.is_file():
                errors.append(f"Missing macro: {path.relative_to(ROOT)}")
                continue
            text = path.read_text(encoding="utf-8-sig")
            if "\r" in text:
                errors.append(f"Use LF line endings: {path.relative_to(ROOT)}")
            commands = [line.strip() for line in text.splitlines() if line.strip()]
            if not commands:
                errors.append(f"Macro is empty: {path.relative_to(ROOT)}")
            for number, line in enumerate(commands, start=1):
                if len(line) > LIMIT:
                    errors.append(f"{path.relative_to(ROOT)}:{number}: {len(line)} characters (limit {LIMIT})")
                if not re.match(r"^(?:/(?:cast|use|startattack|target(?:enemy|friend|lasttarget)?|focus|cleartarget|stopmacro|run|script|showtooltip)\b|#showtooltip\b)", line, re.I):
                    errors.append(f"{path.relative_to(ROOT)}:{number}: unexpected command: {line}")
    if errors:
        print("Validation failed:", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(LANGUAGES) * len(FILES)} source macros; every line is within {LIMIT} characters.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
