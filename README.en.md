<div align="center">

# WoW 3.3.5a · Fury Warrior

**Three practical macros on plain keys: single target, AoE, interrupt and defense.**

Russian and English clients · install files · guide and talent viewer.

[🌐 Open the site](https://genocide12.github.io/wow-335-macros-v2/?lang=en) · [⬇️ Latest release](https://github.com/Genocide12/wow-335-macros-v2/releases/latest) · [📦 All releases](https://github.com/Genocide12/wow-335-macros-v2/releases) · [🐛 Report an issue](https://github.com/Genocide12/wow-335-macros-v2/issues)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-3b82f6?style=flat-square&logo=github)](https://genocide12.github.io/wow-335-macros-v2/)
[![WoW](https://img.shields.io/badge/WoW-3.3.5a-c93a46?style=flat-square)](https://github.com/Genocide12/wow-335-macros-v2/releases)
[![RU%20%2F%20EN](https://img.shields.io/badge/languages-RU%20%2F%20EN-3ac96e?style=flat-square)](README.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-4a86e8?style=flat-square)](LICENSE)

</div>

---

## Quick start

1. Download the installer for your client language: **[English](https://github.com/Genocide12/wow-335-macros-v2/releases/latest/download/macros-cache-en.txt)** · **[Русский](https://github.com/Genocide12/wow-335-macros-v2/releases/latest/download/macros-cache-ru.txt)**. Direct downloads are also attached to [release v1.0.0](https://github.com/Genocide12/wow-335-macros-v2/releases/tag/v1.0.0).
2. Close the game and back up your existing `macros-cache.txt`.
3. Save the selected file in the account folder under `WTF` as `macros-cache.txt`.
4. Launch the game, open `/macro`, and bind the three combat macros to `1`, `2`, and `3`.

No release yet? Check [all releases](https://github.com/Genocide12/wow-335-macros-v2/releases) or the [online macro catalog](https://genocide12.github.io/wow-335-macros-v2/macros.html?lang=en).

## What is included

| Key | Purpose |
|---|---|
| `1` | Single target and the main Fury priority |
| `2` | AoE: target acquisition, auto-attack and pack attacks |
| `3` | Mouseover interrupt and available defensive/control actions |

The same macros are provided in Russian and English. Level- or talent-gated abilities only work once the character has learned them and the in-game conditions are met.

## Important macro limitations

WoW 3.3.5a evaluates a macro only when its key is pressed. It cannot monitor combat by itself and normally performs only one GCD action per press. The built-in conditions cannot check for buffs/debuffs, a target's health percentage, or determine when a burst cooldown should be used. These are priority buttons, not a bot. Activate long buffs and defensive cooldowns manually when appropriate. Do not use Lua auto-casts for protected actions.

## About

**WoW 3.3.5a Fury Warrior macros in Russian and English, with installers, a guide, and GitHub Pages.**

## Website and screenshots

[Project home](https://genocide12.github.io/wow-335-macros-v2/?lang=en) · [Macros](https://genocide12.github.io/wow-335-macros-v2/macros.html?lang=en) · [Talents](https://genocide12.github.io/wow-335-macros-v2/talents.html?lang=en) · [Guide](https://genocide12.github.io/wow-335-macros-v2/guide.html?lang=en) · [Character import](https://genocide12.github.io/wow-335-macros-v2/hero.html?lang=en)

![Project home](docs/assets/shots/home.png)

![Macro catalog](docs/assets/shots/macros.png)

![Talent viewer](docs/assets/shots/talents.png)

![Guide](docs/assets/shots/guide.png)

![Character import](docs/assets/shots/hero.png)

![Project home](docs/assets/shots/home.png)

![Macro catalog](docs/assets/shots/macros.png)

![Talent viewer](docs/assets/shots/talents.png)

![Guide](docs/assets/shots/guide.png)

![Character page](docs/assets/shots/hero.png)

## Build and validate

Macro sources are in `macros/warrior-smart/{ru,en}/`. Installer files and the website macro catalog are generated from those sources:

```sh
python scripts/build.py
python scripts/validate.py
```

GitHub Actions checks command syntax, synchronization of installers and website content, the Russian “Жажда смерти” localization, absence of modifier keys in combat macros, and the 255-character limit. Test the actual rotation on a training dummy; private servers may change abilities and conditions.

## Releases

Releases are published manually when ready. Each release includes `macros-cache-ru.txt` and `macros-cache-en.txt`. GitHub Pages updates after changes are published to `main`.

## License

MIT. Not affiliated with Blizzard Entertainment; game names and assets belong to their respective owners.
