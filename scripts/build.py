#!/usr/bin/env python3
"""Build install/macros-cache-{ru,en}.txt from checked-in macro sources."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    "ru": [("Ротация", "INV_Axe_67", "01-attack-rotation.txt"), ("AoE", "Ability_Whirlwind", "02-aoe-pack.txt"), ("Сбить каст", "Ability_Kick", "03-interrupt.txt")],
    "en": [("Rotation", "INV_Axe_67", "01-attack-rotation.txt"), ("AoE", "Ability_Whirlwind", "02-aoe-pack.txt"), ("Interrupt", "Ability_Kick", "03-interrupt.txt")],
}


def build(language: str) -> str:
    output = []
    for index, (name, icon, filename) in enumerate(SPECS[language]):
        source = ROOT / "macros" / "warrior-smart" / language / filename
        lines = source.read_text(encoding="utf-8-sig").splitlines()
        lines = [line.strip() for line in lines if line.strip()]
        if not lines:
            raise ValueError(f"Empty macro source: {source}")
        output.append(f'MACRO {16777216 + index} "{name}" {icon}')
        output.extend(lines)
        output.append("END")
    return "﻿" + "\n".join(output) + "\n"


def main() -> None:
    install = ROOT / "install"
    install.mkdir(exist_ok=True)
    for language in SPECS:
        destination = install / f"macros-cache-{language}.txt"
        destination.write_text(build(language), encoding="utf-8", newline="")
        print(f"Built {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
