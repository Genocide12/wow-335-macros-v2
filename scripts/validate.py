#!/usr/bin/env python3
"""Validate WoW 3.3.5a macro sources and generated installers/catalog."""
from __future__ import annotations
from pathlib import Path
import json
import re
import sys
from build import BUFF_CHECK, SPECS

ROOT=Path(__file__).resolve().parents[1]
LANGUAGES=("ru","en")
COMBAT_FILES=("01-attack-rotation.txt","02-aoe-pack.txt","03-interrupt.txt")
FILES=COMBAT_FILES+(BUFF_CHECK,)
LIMIT=255
COMMAND=re.compile(r"^(?:/(?:cast|use|startattack|target(?:enemy|friend|lasttarget)?|focus|cleartarget|stopmacro|run|script|showtooltip)\b|#showtooltip\b)",re.I)
MODIFIER=re.compile(r"\[mod:(?:ctrl|shift|alt)\]",re.I)


def main()->int:
    errors=[]
    sources={}
    for lang in LANGUAGES:
        sources[lang]={}
        for filename in FILES:
            path=ROOT/"macros"/"warrior-smart"/lang/filename
            if not path.is_file():
                errors.append(f"Missing source {path.relative_to(ROOT)}")
                continue
            raw=path.read_text(encoding="utf-8-sig")
            if "\r" in raw: errors.append(f"Use LF line endings: {path.relative_to(ROOT)}")
            body=raw.strip()
            sources[lang][Path(filename).stem]=body
            commands=[x.strip() for x in body.splitlines() if x.strip()]
            for no,line in enumerate(commands,1):
                if len(line)>LIMIT: errors.append(f"{path.relative_to(ROOT)}:{no}: {len(line)} chars exceeds {LIMIT}")
                if not COMMAND.match(line): errors.append(f"{path.relative_to(ROOT)}:{no}: unsupported macro command {line}")
                if MODIFIER.search(line):
                    errors.append(f"{path.relative_to(ROOT)}:{no}: modifier conditions are not used by this site")
                if lang=="ru" and "Инстинкт смерти" in line: errors.append(f"{path.relative_to(ROOT)}:{no}: use localized name Жажда смерти")
                if filename!=BUFF_CHECK:
                    if lang=="ru" and "Жажда смерти" in line and "[combat]" not in line: errors.append(f"{path.relative_to(ROOT)}:{no}: Death Wish should be combat-only")
                    if lang=="en" and "Death Wish" in line and "[combat]" not in line: errors.append(f"{path.relative_to(ROOT)}:{no}: Death Wish should be combat-only")
                    if lang=="ru" and "Кровавая ярость" in line and "[combat]" not in line: errors.append(f"{path.relative_to(ROOT)}:{no}: Bloodrage should be combat-only")
                    if lang=="en" and "Bloodrage" in line and "[combat]" not in line: errors.append(f"{path.relative_to(ROOT)}:{no}: Bloodrage should be combat-only")
                if "/run" in line:
                    if filename!=BUFF_CHECK:
                        errors.append(f"{path.relative_to(ROOT)}:{no}: Lua aura checks belong only in the dedicated buff macro")
                    if "UnitDebuff" in line and ("/stopmacro [combat]" not in body or filename!=BUFF_CHECK):
                        errors.append(f"{path.relative_to(ROOT)}:{no}: target debuff checker must be a pre-pull macro that stops in combat")
        joined="\n".join(sources[lang].values())
        buff=sources[lang].get(Path(BUFF_CHECK).stem,"")
        if "/stopmacro [combat]" not in buff: errors.append(f"Buff checker must stop in combat: {lang}")
        if "UnitBuff" not in buff: errors.append(f"Buff checker must inspect own buff: {lang}")

    webraw=(ROOT/"docs/assets/js/macros-data.js").read_text(encoding="utf-8-sig").removeprefix("window.MACRO_TXT = ").strip()
    web=json.loads(webraw[:-1] if webraw.endswith(";") else webraw)
    for lang,items in sources.items():
        for key,body in items.items():
            if web.get(lang,{}).get(key)!=body: errors.append(f"Web catalog mismatch: {lang}/{key}")
        for extra in ("04-buff-check","export-part1","export-part2","export-character"):
            expected=(ROOT/"macros"/"warrior-smart"/lang/(extra+".txt")).read_text(encoding="utf-8-sig").strip()
            if web.get(lang,{}).get(extra)!=expected: errors.append(f"Web export macro mismatch: {lang}/{extra}")
            if extra.startswith("export-"):
                for line in expected.splitlines():
                    if line.startswith("/run") and len(line)>LIMIT: errors.append(f"{lang}/{extra}: {len(line)} chars exceeds {LIMIT}")

    sharedraw=(ROOT/"docs/assets/js/macro-bodies.js").read_text(encoding="utf-8-sig").strip()
    sharedraw=re.sub(r"^(?://[^\n]*\n)+", "", sharedraw).removeprefix("window.WARRIOR_MACRO_BODIES = ").strip()
    shared=json.loads(sharedraw[:-1] if sharedraw.endswith(";") else sharedraw)
    for spec in ("arms","prot"):
        for lang in LANGUAGES:
            bodies=shared.get(spec,{}).get(lang,[])
            if len(bodies)!=4: errors.append(f"Shared site catalog must contain 4 {spec}/{lang} macros")
            for i,body in enumerate(bodies,1):
                for no,line in enumerate(body.splitlines(),1):
                    if len(line)>LIMIT: errors.append(f"Shared {spec}/{lang} macro {i}, line {no} exceeds {LIMIT} chars")
                    if MODIFIER.search(line): errors.append(f"Shared {spec}/{lang} macro {i} contains an unsupported modifier")
                    if not COMMAND.match(line): errors.append(f"Shared {spec}/{lang} macro {i} has unsupported command: {line}")

    installer_specs={lang:[item[2] for item in SPECS[lang]] for lang in LANGUAGES}
    for lang in LANGUAGES:
        path=ROOT/"install"/f"macros-cache-{lang}.txt"
        if not path.is_file():
            errors.append(f"Missing generated installer {path.relative_to(ROOT)}")
            continue
        content=path.read_text(encoding="utf-8-sig")
        combat_content="\n".join(sources[lang][Path(f).stem] for f in COMBAT_FILES if Path(f).stem in sources[lang])
        for filename in COMBAT_FILES:
            body=sources[lang].get(Path(filename).stem,"")
            for line in body.splitlines():
                if MODIFIER.search(line): errors.append(f"Combat source {lang}/{filename} contains unsupported modifier condition")
        installer_macros=re.split(r"^MACRO .*?$",content,flags=re.M)[1:]
        for i,macro in enumerate(installer_macros):
            body=macro.split("\nEND",1)[0]
            if MODIFIER.search(body): errors.append(f"Installer {path.name} macro {i+1} contains unsupported modifier")
        if sources[lang].get(Path(BUFF_CHECK).stem,"") not in content:
            errors.append(f"Installer {path.name} missing the optional buff checker")
        if "Инстинкт смерти" in content: errors.append(f"Installer {path.name} has incorrect localized Death Wish")
        for i,filename in enumerate(installer_specs[lang]):
            macro_id=Path(filename).stem
            body=sources[lang].get(macro_id,"")
            if body not in content: errors.append(f"Installer {path.name} out of sync: {macro_id}")
        buff=sources[lang].get(Path(BUFF_CHECK).stem,"")
        if buff not in content: errors.append(f"Installer {path.name} missing buff-check macro")
        for i,body in enumerate(re.split(r"^MACRO .*?$",content,flags=re.M)[1:],1):
            text=body.split("\nEND",1)[0].strip()
            if len(text)>LIMIT: errors.append(f"Installer {path.name} macro {i} exceeds {LIMIT} chars ({len(text)})")
    if errors:
        print("Validation failed:\n- "+"\n- ".join(errors),file=sys.stderr)
        return 1
    print(f"Validated {len(LANGUAGES)} RU/EN sets: combat macro syntax, 255-char limit, modifier policy, localized ability names, out-of-combat buff checker, and installer/site synchronization.")
    return 0

if __name__=="__main__": raise SystemExit(main())
