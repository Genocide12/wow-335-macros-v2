# WoW 3.3.5a · Warrior Macro Toolkit

A maintainable Fury Warrior macro toolkit for WotLK 3.3.5a, with Russian and English client versions, reproducible installer builds, and automatic checks for the 255-character macro limit.

**Combat modifiers use Alt only. No macro needs Shift or Ctrl**, so the main macros can be bound directly to `1`, `2`, and `3`. Check that Alt does not conflict with your game or operating-system bindings.

> Macros do not automate a rotation: protected actions still require a player press, and normally only one GCD action can fire per press. Test abilities, stances, and server-specific behavior in game; private servers may differ.

## Install

1. Choose `install/macros-cache-en.txt` or `install/macros-cache-ru.txt` to match the client language.
2. Close the game and back up the existing `WTF/Account/<ACCOUNT>/macros-cache.txt`.
3. Copy the selected file into the account's WTF folder and name it `macros-cache.txt`. Paths differ by client; check `WTF/Accounts` or `WTF/Аккаунт`.
4. Start the game, inspect `/macro`, and bind the three macros to `1`, `2`, and `3`.

## Keys and behavior

| Key | Purpose | Alt action |
|---|---|---|
| `1` | Single-target attacks, auto-attack, stance/Charge | Battle Shout, Recklessness, Heroic Strike; Death Wish is tried on a normal press |
| `2` | AoE, selecting a target if absent/dead, auto-attack and attacks | Death Wish and trinket slot 13, or Intimidating Shout |
| `3` | Mouseover interrupt and emergency actions | Racial ability, Defensive Stance, Disarm, Taunt, Berserker Rage |

Macro `2` selects an enemy only when the current target is absent or dead, then starts auto-attacking. Macro `3` does not change your target for Pummel: point the mouse at the enemy caster. Each press can perform only the first available action, subject to GCD, stance, range, and ability conditions.

## Build and validate

Macro source files are in `macros/warrior-smart/{ru,en}/`. Edit these sources, then run:

```sh
python scripts/build.py
python scripts/validate.py
```

The build script refreshes `install/macros-cache-{ru,en}.txt`. Validation checks both languages, permitted command syntax, line endings, and the 255-character limit. It cannot verify in-game conditions or server modifications; test those in game.

## Before using

- Match the macro language to the client language.
- Check that the abilities are learned and required talents/equipment are available.
- Test targeting and priorities on a training dummy before combat.
- Bind bare `1`, `2`, `3`; optional actions are on Alt only.

Project pages and guide: [docs/](docs/). Русская документация: [README.md](README.md).

## License

MIT. Game names and assets belong to their respective owners; this project is not affiliated with Blizzard Entertainment.
