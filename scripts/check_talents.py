#!/usr/bin/env python3
"""Validate talent presets against the embedded WotLK talent data."""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TALENTS = json.loads((ROOT / "docs/assets/data/talents.json").read_text(encoding="utf-8"))
SOURCE = (ROOT / "docs/talents.html").read_text(encoding="utf-8")
BODY = SOURCE.split("WOTLK_PRESETS=[", 1)[1].split("\n];", 1)[0]
TREE_ORDER = ("arms", "fury", "prot")
ALL = {talent["id"]: {**talent, "tree": tree["key"]}
       for tree in TALENTS["trees"] for talent in tree["talents"]}


def main() -> int:
    errors: list[str] = []
    rows = re.findall(
        r"\{tree:'(fury|arms|prot)',level:(\d+),source:'([^']+)',ru:'([^']+)',en:'([^']+)',points:\{([^}]*)\}\}", BODY)
    if not rows:
        print("No talent presets parsed from docs/talents.html")
        return 1
    for tree, level, source, label_ru, label_en, point_text in rows:
        level_i = int(level)
        pts = {int(k): int(v) for k, v in re.findall(r"(\d+)\s*:\s*(\d+)", point_text)}
        expected = max(0, level_i - 9)
        total = sum(pts.values())
        label = f"{tree} L{level_i} {label_en}"
        if total != expected:
            errors.append(f"{label}: total {total}; expected {expected} points")
        per_tree = {t: sum(rank for tid, rank in pts.items() if tid in ALL and ALL[tid]["tree"] == t) for t in TREE_ORDER}
        for tid, rank in pts.items():
            talent = ALL.get(tid)
            if not talent:
                errors.append(f"{label}: unknown talent id {tid}")
                continue
            if rank < 0 or rank > talent["ranks"]:
                errors.append(f"{label}: talent {tid} rank {rank} exceeds maximum {talent['ranks']}")
            if rank and talent["row"] * 5 > per_tree[talent["tree"]]:
                errors.append(f"{label}: talent {tid} requires tier {talent['row']*5} in {talent['tree']}, has {per_tree[talent['tree']]}")
            if rank:
                for req in talent.get("requires", []):
                    if pts.get(req["id"], 0) < req["qty"]:
                        errors.append(f"{label}: talent {tid} requires {req['qty']} ranks of talent {req['id']}")
        spread = "/".join(str(per_tree[t]) for t in TREE_ORDER)
        print(f"{label}: {total}/{expected} total; Arms/Fury/Protection {spread}")
    for tree_key in ('fury','arms','prot'):
        final=rows
        target=[r for r in final if r[0]==tree_key and int(r[1])==80]
        if not target: errors.append(f"Missing level-80 {tree_key} preset")
        if tree_key=='fury' and len(target)<2: errors.append("Fury must have separate level-80 raid and solo presets")
        if tree_key=='fury':
            raid=next((r for r in target if 'raid' in r[2]),None)
            if raid:
                p={int(k):int(v) for k,v in re.findall(r"(\d+)\s*:\s*(\d+)",raid[5])}
                spread={t:sum(v for i,v in p.items() if i in ALL and ALL[i]['tree']==t) for t in TREE_ORDER}
                if spread != {'arms':18,'fury':53,'prot':0}: errors.append(f"Fury PvE raid preset should be 18/53/0, found {spread}")

    if errors:
        print("Talent preset validation failed:\n- " + "\n- ".join(errors))
        return 1
    print(f"Validated {len(rows)} preset builds: level totals, talent IDs, ranks, tiers, and prerequisites.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
