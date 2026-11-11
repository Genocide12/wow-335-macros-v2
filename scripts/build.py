#!/usr/bin/env python3
"""Generate install files and the embedded website macro catalogue."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    "ru": [("Одна цель", "INV_Axe_67", "01-attack-rotation.txt"), ("AoE", "Ability_Whirlwind", "02-aoe-pack.txt"), ("Контроль", "Ability_Kick", "03-interrupt.txt")],
    "en": [("Single", "INV_Axe_67", "01-attack-rotation.txt"), ("AoE", "Ability_Whirlwind", "02-aoe-pack.txt"), ("Control", "Ability_Kick", "03-interrupt.txt")],
}
EXPORTS = ("export-part1.txt", "export-part2.txt")


def source_text(language: str, filename: str) -> str:
    path = ROOT / "macros" / "warrior-smart" / language / filename
    return path.read_text(encoding="utf-8-sig").strip() + "\n"


def build(language: str) -> str:
    output = []
    for index, (name, icon, filename) in enumerate(SPECS[language]):
        output.append(f'MACRO {16777216 + index} "{name}" {icon}')
        output.extend(source_text(language, filename).splitlines())
        output.append("END")
    return "﻿" + "\n".join(output) + "\n"


def build_web_catalog() -> str:
    catalogue = {}
    for language in SPECS:
        catalogue[language] = {
            Path(filename).stem: source_text(language, filename).rstrip("\n")
            for filename in [item[2] for item in SPECS[language]] + list(EXPORTS)
        }
    return "window.MACRO_TXT = " + json.dumps(catalogue, ensure_ascii=False, indent=2) + ";\n"


def main() -> None:
    install = ROOT / "install"
    install.mkdir(exist_ok=True)
    for language in SPECS:
        destination = install / f"macros-cache-{language}.txt"
        destination.write_text(build(language), encoding="utf-8", newline="")
        print(f"Built {destination.relative_to(ROOT)}")
    web = ROOT / "docs" / "assets" / "js" / "macros-data.js"
    web.write_text(build_web_catalog(), encoding="utf-8", newline="")
    print(f"Built {web.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
