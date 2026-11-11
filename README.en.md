# WoW 3.3.5a · Fury Warrior Macro Toolkit

Three macros for Russian and English clients. Every active ability is attempted by a **plain press of one of the three macro keys**; there are no Alt, Shift, or Ctrl modifiers. The macros can be used while leveling and at level 80: abilities the character has not learned are simply unavailable to cast.

## The honest 3.3.5a limitation

A macro cannot continuously observe combat or execute an ability queue by itself. It checks lines from top to bottom only when a key is pressed, and the client normally performs one GCD action per press. The standard macro system cannot test whether a buff/debuff exists, count nearby targets, read a target's health percentage, or decide when a burst is appropriate. These are priority buttons, not a bot: press the relevant key repeatedly and choose defensive cooldowns manually. Do not use Lua auto-casts; protected actions must remain tied to a player press.

## Keys

| Key | Role |
|---|---|
| `1` | Single-target Fury priority: Charge out of combat, Victory Rush, Bloodthirst, Whirlwind, Execute, and available press-triggered cooldowns |
| `2` | AoE: acquire a target if absent/dead, start auto-attack, attempt Berserker Stance, then Intercept, Whirlwind, Cleave and other available abilities |
| `3` | Mouseover/current-target interrupt, stance changes, available defensive and control abilities |

Line order matters. Some abilities need a stance, talent, target, weapon, or ready cooldown; the client skips actions that cannot currently be used. Racial abilities are excluded because the macro cannot know which race your character has.

## Install

1. Choose `install/macros-cache-en.txt` for an English client or `install/macros-cache-ru.txt` for Russian.
2. Close the game and back up your existing `macros-cache.txt`.
3. Place the selected file in the account folder under `WTF`, named `macros-cache.txt` (the exact path varies by client).
4. Launch the game, inspect `/macro`, and bind the three macros to `1`, `2`, and `3`.

## Build and validate

Sources: `macros/warrior-smart/{ru,en}/`. Installer files and website macro text are built from those sources.

```sh
python scripts/build.py
python scripts/validate.py
```

Validation checks allowed commands and conditions, no Alt/Shift/Ctrl in combat macros, correct Russian “Жажда смерти” naming, synchronized website/install output, and the 255-character per-macro limit. GitHub Actions runs the checks on changes. Test actual rotation on a training dummy for your client/server; private servers can alter abilities, translations, and rules.

## License

MIT. Not affiliated with Blizzard Entertainment.
