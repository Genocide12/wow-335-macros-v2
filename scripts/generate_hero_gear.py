#!/usr/bin/env python3
"""Generate level-by-level Warrior gear previews from a 3.3.5 world DB dump.

Input: CMaNGOS wotlk-db Full_DB SQL dump (3.3.5a).
Output: docs/assets/js/leveling-gear.js

The preview ranks items by level, Warrior usability, item level, and Strength,
Stamina, Agility, hit, crit, expertise, and defensive stats. It is a guide
preview, not a claim that a character automatically receives these drops.
"""
from __future__ import annotations
import gzip, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/assets/js/leveling-gear.js"
SLOTS = {
    1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 7: [7], 8: [8],
    9: [9], 10: [10], 11: [11, 12], 12: [13, 14], 13: [16, 17],
    14: [17], 15: [18], 16: [15], 17: [16], 19: [19],
}
STAT_WEIGHTS = {3: 2.4, 4: 3.2, 7: 2.5, 12: 1.1, 13: 1.8, 14: 1.5,
                16: 1.0, 19: 1.4, 24: 1.2, 31: 1.7, 32: 1.8, 36: 1.5}

def sql_value(s: str):
    s = s.strip()
    if s.upper() == "NULL": return None
    if s.startswith("'") and s.endswith("'"):
        return s[1:-1].replace("\\'", "'").replace("\\\\", "\\")
    try: return float(s) if "." in s else int(s)
    except ValueError: return s

def tuples(statement: str):
    marker = re.search(r"\bvalues\s*", statement, re.I)
    if not marker: return
    i, n = marker.end(), len(statement)
    while i < n:
        while i < n and statement[i] in " \r\n\t,;": i += 1
        if i >= n or statement[i] != "(": break
        i += 1; fields = []; start = i; quoted = False
        while i < n:
            c = statement[i]
            if c == "\\": i += 2; continue
            if c == "'": quoted = not quoted
            elif not quoted and c in ",)":
                fields.append(sql_value(statement[start:i]))
                if c == ")": i += 1; break
                start = i + 1
            i += 1
        yield fields

def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: generate_hero_gear.py <WoTLKDB.sql.gz>")
    source = Path(sys.argv[1])
    opener = gzip.open if source.suffix == ".gz" else open
    columns = None; candidates = []
    with opener(source, "rt", encoding="utf-8", errors="replace") as stream:
        for line in stream:
            if "insert  into `item_template`(" not in line.lower(): continue
            head = re.search(r"insert\s+into\s+`item_template`\((.*?)\)\s*values", line, re.I)
            if not head: continue
            columns = [x.strip(" `") for x in head.group(1).split("`,`")]
            ix = {k: columns.index(k) for k in ("entry", "class", "subclass", "name", "displayid", "Quality", "InventoryType", "AllowableClass", "AllowableRace", "ItemLevel", "RequiredLevel", "RequiredSkill", "requiredspell", "requiredhonorrank", "RequiredReputationFaction", "StatsCount", "armor", "ScalingStatDistribution", "ScalingStatValue", "dmg_min1", "dmg_max1", "delay")}
            stat_ix = [(columns.index(f"stat_type{i}"), columns.index(f"stat_value{i}")) for i in range(1, 11)]
            for row in tuples(line):
                if len(row) < len(columns): continue
                get = lambda key: row[ix[key]]
                # These historical placeholder items were never obtainable by
                # players and do not have reliable appearances in the viewer.
                if get("entry") in (3536, 4193): continue
                if get("entry") in (49623, 50730, 50070): print("DEBUG ITEM", get("entry"), [(k,get(k)) for k in ("name","class","subclass","InventoryType","ItemLevel","RequiredLevel","Quality","AllowableClass","AllowableRace","requiredhonorrank","RequiredReputationFaction")])
                item_class, inv = get("class"), get("InventoryType")
                if item_class not in (2, 4) or inv not in SLOTS: continue
                class_mask, race_mask = int(get("AllowableClass") or 0), int(get("AllowableRace") or 0)
                if class_mask not in (0, -1) and not class_mask & 1: continue
                if race_mask not in (0, -1) and not race_mask & 1: continue
                if any(get(k) not in (None, 0) for k in ("RequiredSkill", "requiredspell", "requiredhonorrank", "RequiredReputationFaction")): continue
                quality, ilvl, req = get("Quality") or 0, get("ItemLevel") or 0, get("RequiredLevel") or 0
                if quality < 1 or quality > 4 or ilvl < 1: continue
                if req == 0 and ilvl <= 1: continue
                if get("ScalingStatDistribution") or get("ScalingStatValue"): continue
                if item_class == 4:
                    sub = get("subclass")
                    if inv in (1, 3, 5, 6, 7, 8, 9, 10) and sub not in (2, 3, 4): continue
                    if inv == 14 and sub != 6: continue
                    if inv in (2, 4, 11, 12, 19) and sub not in (0, 2, 3, 4): continue
                if item_class == 2 and inv not in (13, 15, 17): continue
                stats = {}
                for ti, vi in stat_ix:
                    t, v = row[ti], row[vi]
                    if t and v: stats[int(t)] = int(v)
                if item_class == 4 and not stats and not (get("armor") or 0): continue
                if item_class == 2 and not (((get("dmg_min1") or 0)+(get("dmg_max1") or 0)) or stats): continue
                candidates.append({"id":get("entry"), "name":get("name"), "displayId":get("displayid"),
                    "q":quality, "ilvl":ilvl, "req":req, "inv":inv, "class":item_class,
                    "subclass":get("subclass"), "armor":get("armor") or 0, "stats":stats,
                    "dps":(((get("dmg_min1") or 0)+(get("dmg_max1") or 0))/2)/max(1,(get("delay") or 0)/1000)})
            break
    if not candidates: raise SystemExit("item_template rows not found")

    result = {"arms": {}, "fury": {}, "prot": {}}
    for spec in result:
        for level in range(1, 81):
            slots = {}
            for inv, target_slots in SLOTS.items():
                if spec != "prot" and inv == 14: continue
                if spec == "arms" and inv == 13: continue
                if spec == "fury" and level < 20 and inv == 13: continue
                if spec == "fury" and 20 <= level < 60 and inv == 17: continue
                max_ilvl = level + 5 if level < 70 else (115 + (level - 70) * 17 if level < 80 else 284)
                eligible = [x for x in candidates if x["inv"] == inv and x["req"] <= level and x["ilvl"] <= max_ilvl]
                if inv in (13, 15, 17): eligible = [x for x in eligible if x["class"] == 2]
                if not eligible: continue
                def score(x):
                    armor = min(x["armor"], 1000) * (0.018 if spec == "prot" else 0.006)
                    stats = sum(v * STAT_WEIGHTS.get(t, 0.35) for t, v in x["stats"].items())
                    defense = sum(v * 1.6 for t, v in x["stats"].items() if t in (12, 13, 14, 15)) if spec == "prot" else 0
                    weapon = min(x["dps"], 150) * (5 if x["class"] == 2 else 0)
                    dps = (x["ilvl"] * 1.4 + x["q"] * 7 + stats + armor + defense + weapon)
                    return (dps, x["ilvl"], x["q"], -x["id"])
                eligible.sort(key=score, reverse=True)
                best = eligible[0]
                for slot in target_slots:
                    used_id = slots.get(str(target_slots[0]), {}).get("id") if slot != target_slots[0] else None
                    if slot in (12, 14, 17) or (spec == "fury" and slot == 17):
                        best = next((x for x in eligible if x["id"] != used_id), best)
                    slots[str(slot)] = {"id":best["id"], "name":best["name"], "displayId":best["displayId"], "q":best["q"], "ilvl":best["ilvl"], "inventoryType":best["inv"]}
            result[spec][str(level)] = slots
    payload = "// Generated from CMaNGOS WoTLK 3.3.5a item_template data.\nwindow.LEVELING_GEAR=" + json.dumps(result, ensure_ascii=False, separators=(",", ":")) + ";\n"
    OUT.write_text(payload, encoding="utf-8")
    print(f"Generated level routes from {len(candidates)} usable item records: {OUT}")

if __name__ == "__main__": main()
