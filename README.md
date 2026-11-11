<div align="center">

# WoW 3.3.5a · Fury Warrior

**Три боевые кнопки, отдельная проверка баффов и талантные билды от прокачки до 80-го.**

[🌐 Игровой сайт](https://genocide12.github.io/wow-335-macros-v2/) · [⬇️ Установщики RU/EN](https://github.com/Genocide12/wow-335-macros-v2/releases/latest) · [📋 Макросы](https://genocide12.github.io/wow-335-macros-v2/macros.html) · [🐛 Ошибка/предложение](https://github.com/Genocide12/wow-335-macros-v2/issues)

[![Pages](https://img.shields.io/badge/GitHub%20Pages-live-3b82f6?style=flat-square&logo=github)](https://genocide12.github.io/wow-335-macros-v2/)
[![WoW](https://img.shields.io/badge/WoW-3.3.5a-c93a46?style=flat-square)](https://github.com/Genocide12/wow-335-macros-v2/releases)
[![Языки](https://img.shields.io/badge/языки-RU%20%2F%20EN-3ac96e?style=flat-square)](README.en.md)
[![MIT](https://img.shields.io/badge/license-MIT-4a86e8?style=flat-square)](LICENSE)

</div>

## Быстрый старт

1. Скачай [установщик RU](https://github.com/Genocide12/wow-335-macros-v2/releases/latest/download/macros-cache-ru.txt) или [EN](https://github.com/Genocide12/wow-335-macros-v2/releases/latest/download/macros-cache-en.txt).
2. Закрой клиент и сохрани копию текущего `macros-cache.txt`.
3. Скопируй скачанный файл в папку аккаунта `WTF` с именем `macros-cache.txt`.
4. Запусти игру, открой `/macro`, назначь боевые кнопки `1`, `2`, `3`.
5. Макрос проверки баффов — отдельный четвёртый макрос: скопируй его со [страницы макросов](https://genocide12.github.io/wow-335-macros-v2/macros.html) и назначь на свободную кнопку. Он проверяет ауры только вне боя.

## Макросы

| Клавиша | Роль |
|---|---|
| `1` | Fury: одиночная цель, Рывок вне боя, приоритет ударов и кулдауны в бою |
| `2` | AoE/подхват цели; до боя пытается повесить Боевой крик, если его нет |
| `3` | Зуботычина по наведению/цели, Ярость берсерка и аварийные действия; `Alt` — дополнительные опции |
| `4` (отдельный макрос) | Проверка Боевого крика и Деморализующего крика перед пуллом; `Ctrl` вручную применяет Деморализующий крик |

Порядок строк задаёт приоритет. Каждый запуск — по нажатию; обычно клиент применяет одну способность с GCD за раз. Макрос не является ботом и не выбирает сам, когда использовать защитный кулдаун.

## Таланты и путь до 80-го

[Открой интерактивный просмотрщик талантов](https://genocide12.github.io/wow-335-macros-v2/talents.html). Перенесены пути прокачки оригинального проекта для Fury, Arms и Protection; добавлены отдельные пресеты **Fury PvE raid 18/53/0** и **Fury solo DPS/survival**. Под «топовым» рейдовым билдом подразумевается конкретный WotLK 3.3.5a Titan’s Grip PvE пресет, а не универсально лучший билд для каждого сервера и экипировки.

## Герой и случайное демо

На странице [Герой](https://genocide12.github.io/wow-335-macros-v2/hero.html) можно импортировать экспорт WEXP из клиента 3.3.5a или создать случайный демо-персонаж. Демо выбирает подходящий пресет по уровню/специализации, случайное имя, расу, экипировку и показывает распределение талантов. Это визуальная демонстрация, не данные реального персонажа.

## Важное ограничение макросов 3.3.5a

Встроенные макро-условия не проверяют наличие баффов и дебаффов. Lua-проверка через `UnitBuff` + `CastSpellByName` используется только в отдельном макросе до боя; `UnitDebuff` здесь применяется только до боя после явного нажатия. В бою защищённый Lua-каст блокируется клиентом. Проверяй названия и поведение на своём сервере: приватные серверы могут отличаться от оригинальной версии.

## Сборка и проверки

```sh
python scripts/build.py
python scripts/validate.py
python scripts/check_talents.py
```

Установщики RU/EN и каталог макросов генерируются из исходников `macros/warrior-smart/{ru,en}/`. CI проверяет макросы, предел 255 символов, синхронность источников, логику и требования талантных пресетов.

## Скриншоты

![Главная](docs/assets/shots/home.png)
![Макросы](docs/assets/shots/macros.png)
![Таланты](docs/assets/shots/talents.png)
![Герой](docs/assets/shots/hero.png)

## Лицензия

MIT. Проект не связан с Blizzard Entertainment.
