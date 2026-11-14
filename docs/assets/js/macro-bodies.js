// Canonical strings shown and copied on the home and macro pages.
// Fury bodies come from macros-data.js, generated directly from macro source files.
window.WARRIOR_MACRO_BODIES = {
  "arms": {
    "ru": [
      "#showtooltip Зуботычина\n/cast [nostance:3]Стойка берсерка\n/cast [@focus,harm,nodead][@mouseover,harm,nodead][]Зуботычина",
      "#showtooltip Смертельный удар\n/cast [nostance:1]Боевая стойка\n/cast Смертельный удар",
      "#showtooltip [combat]Перехват;Рывок\n/cast [combat,nostance:3]Стойка берсерка;[nocombat,nostance:1]Боевая стойка\n/cast [combat,stance:3]Перехват;[nocombat,stance:1]Рывок",
      "#showtooltip Разоружение\n/cast [nostance:2]Оборонительная стойка\n/cast [@mouseover,harm,nodead][]Разоружение"
    ],
    "en": [
      "#showtooltip Pummel\n/cast [nostance:3]Berserker Stance\n/cast [@focus,harm,nodead][@mouseover,harm,nodead][]Pummel",
      "#showtooltip Mortal Strike\n/cast [nostance:1]Battle Stance\n/cast Mortal Strike",
      "#showtooltip [combat]Intercept;Charge\n/cast [combat,nostance:3]Berserker Stance;[nocombat,nostance:1]Battle Stance\n/cast [combat,stance:3]Intercept;[nocombat,stance:1]Charge",
      "#showtooltip Disarm\n/cast [nostance:2]Defensive Stance\n/cast [@mouseover,harm,nodead][]Disarm"
    ]
  },
  "prot": {
    "ru": [
      "#showtooltip Мощный удар щитом\n/startattack\n/cast Мощный удар щитом\n/cast Реванш\n/cast Сокрушение",
      "#showtooltip Удар грома\n/cast [nostance:2]Оборонительная стойка\n/cast Удар грома\n/cast Ударная волна",
      "#showtooltip Провокация\n/cast [@mouseover,harm,nodead][]Провокация",
      "#showtooltip Удар щитом\n/cast [nostance:1,nostance:2]Оборонительная стойка\n/cast [@mouseover,harm,nodead][]Удар щитом"
    ],
    "en": [
      "#showtooltip Shield Slam\n/startattack\n/cast Shield Slam\n/cast Revenge\n/cast Devastate",
      "#showtooltip Thunder Clap\n/cast [nostance:2]Defensive Stance\n/cast Thunder Clap\n/cast Shockwave",
      "#showtooltip Taunt\n/cast [@mouseover,harm,nodead][]Taunt",
      "#showtooltip Shield Bash\n/cast [nostance:1,nostance:2]Defensive Stance\n/cast [@mouseover,harm,nodead][]Shield Bash"
    ]
  }
};
window.WARRIOR_MACRO_LABELS = {
  "arms": {
    "ru": [["Зуботычина по фокусу","Прерывание; после смены стойки нажми повторно.","inv_gauntlets_04"],["Смертельный удар","Главный удар Оружия; при смене стойки нажми повторно.","ability_warrior_savageblow"],["Рывок и Перехват","Вне боя — Рывок; в бою — Перехват.","ability_warrior_charge"]],
    "en": [["Focus Pummel","Interrupt; press again after a stance change.","inv_gauntlets_04"],["Mortal Strike","Arms core attack; press again after a stance change.","ability_warrior_savageblow"],["Charge and Intercept","Charge out of combat; Intercept in combat.","ability_warrior_charge"]]
  },
  "fury": {
    "ru": [["Ротация одной цели","Кровожадность → Вихрь → Казнь","inv_axe_66"],["Бой с группой","Вихрь и Рассекающий удар","ability_whirlwind"],["Прерывание","Зуботычина по наведению","inv_gauntlets_04"]],
    "en": [["Single-target rotation","Bloodthirst → Whirlwind → Execute","inv_axe_66"],["Area damage","Whirlwind and Cleave","ability_whirlwind"],["Interrupt","Mouseover Pummel","inv_gauntlets_04"]]
  },
  "prot": {
    "ru": [["Приоритет угрозы","Мощный удар щитом → Реванш → Сокрушение.","ability_warrior_shieldslam"],["Угроза по площади","Удар грома и Ударная волна.","ability_thunderclap"],["Провокация по наведению","Перехвати цель под курсором.","spell_nature_reincarnation"]],
    "en": [["Threat priority","Shield Slam → Revenge → Devastate.","ability_warrior_shieldslam"],["Area threat","Thunder Clap and Shockwave.","ability_thunderclap"],["Mouseover Taunt","Taunt the enemy under your cursor.","spell_nature_reincarnation"]]
  }
};
