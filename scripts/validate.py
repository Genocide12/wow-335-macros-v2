#!/usr/bin/env python3
"""Validate source macro layout and the WoW 3.3.5 macro text limit."""
from pathlib import Path
import json
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
                if re.search(r"\[mod:(?:ctrl|shift|alt)\]", line, re.I):
                    errors.append(f"{path.relative_to(ROOT)}:{number}: combat macros must not require modifiers")
                if language == "ru" and "Инстинкт смерти" in line:
                    errors.append(f"{path.relative_to(ROOT)}:{number}: use the Russian spell name Жажда смерти")
                if len(line) > LIMIT:
                    errors.append(f"{path.relative_to(ROOT)}:{number}: {len(line)} characters (limit {LIMIT})")
                if not re.match(r"^(?:/(?:cast|use|startattack|target(?:enemy|friend|lasttarget)?|focus|cleartarget|stopmacro|run|script|showtooltip)\b|#showtooltip\b)", line, re.I):
                    errors.append(f"{path.relative_to(ROOT)}:{number}: unexpected command: {line}")
    for language in LANGUAGES:
        macro_source = "\n".join((ROOT / "macros" / "warrior-smart" / language / filename).read_text(encoding="utf-8-sig") for filename in FILES)
        website_text = (ROOT / "docs/assets/js/macros-data.js").read_text(encoding="utf-8-sig").removeprefix("window.MACRO_TXT = ").strip()
        website_data = json.loads(website_text[:-1] if website_text.endswith(";") else website_text)
        if language == "ru" and "Жажда смерти" not in macro_source:
            errors.append("Russian macro set must use the localized spell name Жажда смерти")
        if language == "en" and "Death Wish" not in macro_source:
            errors.append("English macro set must use Death Wish")
        for filename in FILES:
            text = (ROOT / "macros" / "warrior-smart" / language / filename).read_text(encoding="utf-8-sig").rstrip("\r\n")
            if website_data.get(language, {}).get(Path(filename).stem) != text:
                errors.append(f"Website macro catalogue is out of sync: {language}/{filename}")
    for generated in (ROOT / "install/macros-cache-ru.txt", ROOT / "install/macros-cache-en.txt"):
        if generated.is_file():
            installer = generated.read_text(encoding="utf-8-sig")
            for language, specs in (("ru", ("Одна цель", "AoE", "Контроль")), ("en", ("Single", "AoE", "Control"))):
                if generated.name.endswith(f"-{language}.txt"):
                    for filename in FILES:
                        text = (ROOT / "macros" / "warrior-smart" / language / filename).read_text(encoding="utf-8-sig").strip()
                        if text not in installer:
                            errors.append(f"Installer is out of sync: {language}/{filename}")
                    break
    for generated in (ROOT / "install/macros-cache-ru.txt", ROOT / "install/macros-cache-en.txt"):
        if not generated.is_file():
            errors.append(f"Missing generated installer: {generated.relative_to(ROOT)}")
            continue
        content = generated.read_text(encoding="utf-8-sig")
        if "Инстинкт смерти" in content:
            errors.append(f"Wrong Russian Death Wish name in {generated.relative_to(ROOT)}")
        bodies = re.split(r"^MACRO .*?$", content, flags=re.M)[1:]
        for body in bodies:
            macro_text = body.split("\nEND", 1)[0]
            if len(macro_text.strip()) > LIMIT:
                errors.append(f"{generated.relative_to(ROOT)}: macro body exceeds {LIMIT} characters")
        if re.search(r"\[mod:(?:ctrl|shift|alt)\]", content, re.I):
            errors.append(f"Combat macro requires a modifier in {generated.relative_to(ROOT)}")
    if errors:
        print("Validation failed:", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(LANGUAGES) * len(FILES)} source macros; every line is within {LIMIT} characters.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
