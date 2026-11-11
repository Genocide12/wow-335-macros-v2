# WoW 3.3.5a · Warrior Macro Toolkit

RU/EN Fury Warrior macro sources, built installation files, a 255-character validator, and CI checks. Bind the three macros to `1`, `2`, and `3`; the macros use **Alt only** as a modifier, never Shift or Ctrl.

## What macros can and cannot do

WoW macros are not a programmable combat rotation. On each key press, the client evaluates macro lines and can perform an eligible action; a macro cannot automatically press several GCD abilities or continuously monitor combat. In 3.3.5a, the macro condition system cannot test whether your buff or a target debuff is present. Refresh shouts and other timed effects manually with Alt after checking that the aura has ended. Do not try to bypass this restriction with `/run` or auto-cast scripts.

## Install

1. Choose `install/macros-cache-en.txt` or `install/macros-cache-ru.txt` for the client language.
2. Close the game and back up the existing `macros-cache.txt`.
3. Copy the chosen file to your account folder under `WTF` and name it `macros-cache.txt` (the path varies by client).
4. Start the game, inspect `/macro`, then bind the macros to `1`, `2`, and `3`.

## Keys

| Key | Action | Alt |
|---|---|---|
| `1` | Single target: auto-attack, stance/Charge out of combat, Victory Rush, Bloodthirst, Whirlwind, Execute | Heroic Strike, Death Wish, Recklessness, Battle Shout (manual Alt; buffs are not inspected) |
| `2` | AoE: choose a target if absent/dead, auto-attack, Intercept, Whirlwind, Cleave, Bloodthirst | Death Wish, trinket slot 13, Intimidating Shout |
| `3` | Pummel mouseover target, Berserker Stance, emergency actions | racial ability, Defensive Stance, Disarm, Taunt, Berserker Rage |

Usually a press performs only one GCD action. Attacks are ahead of cooldowns on `1`, so normal presses follow the attack priority; holding Alt lets the client evaluate the Alt-conditional actions. Aura presence still cannot be detected by the macro, so activate timed buffs manually only when they have expired. An addon or WeakAura may provide a visual reminder, but the player must press the button.

## Build and validate

Sources: `macros/warrior-smart/{ru,en}/`.

```sh
python scripts/build.py
python scripts/validate.py
```

The builder refreshes `install/macros-cache-{ru,en}.txt`. The validator checks command syntax and the 255-character limit; GitHub Actions runs it on pushes and pull requests. It cannot test server-specific conditions, learned spells, talents, or client localization, so test in game on a training dummy.

## License

MIT. Not affiliated with Blizzard Entertainment.
