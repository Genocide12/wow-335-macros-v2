// Canonical strings shown and copied on the home and macro pages.
// Fury bodies come from macros-data.js, generated directly from macro source files.
window.WARRIOR_MACRO_BODIES = {
  "arms": {
    "ru": [
      "#showtooltip Смертельный удар\n/cast [nostance:1]Боевая стойка\n/startattack\n/cast Смертельный удар\n/cast Превосходство\n/cast Мощный удар\n/cast Казнь",
      "#showtooltip Рассекающий удар\n/cast [nostance:1]Боевая стойка\n/startattack\n/cast Удар грома\n/cast Вихрь\n/cast Рассекающий удар",
      "#showtooltip [combat]Перехват;Рывок\n/cast [nocombat,nostance:1]Боевая стойка;[combat,nostance:3]Стойка берсерка\n/cast [nocombat,stance:1]Рывок;[combat,stance:3]Перехват",
      "#showtooltip Зуботычина\n/cast [nostance:3]Стойка берсерка\n/cast [@focus,harm,nodead][@mouseover,harm,nodead][]Зуботычина",
      "#showtooltip Каждый за себя\n/cast Каждый за себя\n/cast Неистовство героя\n/cast Ярость берсерка"
    ],
    "en": [
      "#showtooltip Mortal Strike\n/cast [nostance:1]Battle Stance\n/startattack\n/cast Mortal Strike\n/cast Overpower\n/cast Slam\n/cast Execute",
      "#showtooltip Cleave\n/cast [nostance:1]Battle Stance\n/startattack\n/cast Thunder Clap\n/cast Whirlwind\n/cast Cleave",
      "#showtooltip [combat]Intercept;Charge\n/cast [nocombat,nostance:1]Battle Stance;[combat,nostance:3]Berserker Stance\n/cast [nocombat,stance:1]Charge;[combat,stance:3]Intercept",
      "#showtooltip Pummel\n/cast [nostance:3]Berserker Stance\n/cast [@focus,harm,nodead][@mouseover,harm,nodead][]Pummel",
      "#showtooltip Every Man for Himself\n/cast Every Man for Himself\n/cast Heroic Fury\n/cast Berserker Rage"
    ]
  },
  "prot": {
    "ru": [
      "#showtooltip Мощный удар щитом\n/startattack\n/cast Мощный удар щитом\n/cast Реванш\n/cast Сокрушение",
      "#showtooltip Удар грома\n/cast [nostance:2]Оборонительная стойка\n/cast Удар грома\n/cast Ударная волна",
      "#showtooltip Провокация\n/cast [@mouseover,harm,nodead][]Провокация",
      "#showtooltip Удар щитом\n/cast [nostance:1,nostance:2]Оборонительная стойка\n/cast [@mouseover,harm,nodead][]Удар щитом",
      "#showtooltip Каждый за себя\n/cast Каждый за себя\n/cast Неистовство героя\n/cast Ярость берсерка"
    ],
    "en": [
      "#showtooltip Shield Slam\n/startattack\n/cast Shield Slam\n/cast Revenge\n/cast Devastate",
      "#showtooltip Thunder Clap\n/cast [nostance:2]Defensive Stance\n/cast Thunder Clap\n/cast Shockwave",
      "#showtooltip Taunt\n/cast [@mouseover,harm,nodead][]Taunt",
      "#showtooltip Shield Bash\n/cast [nostance:1,nostance:2]Defensive Stance\n/cast [@mouseover,harm,nodead][]Shield Bash",
      "#showtooltip Every Man for Himself\n/cast Every Man for Himself\n/cast Heroic Fury\n/cast Berserker Rage"
    ]
  }
};
window.WARRIOR_MACRO_LABELS = {
  "arms": {
    "ru": [["Одна цель — приоритет Arms","Смертельный удар → Превосходство → Мощный удар → Казнь.","ability_warrior_savageblow"],["Несколько целей — Arms","Удар грома → Вихрь → Рассекающий удар.","ability_warrior_cleave"],["Рывок и Перехват","Вне боя — Рывок; в бою — стойка берсерка и Перехват.","ability_warrior_charge"]],
    "en": [["Arms single-target priority","Mortal Strike → Overpower → Slam → Execute.","ability_warrior_savageblow"],["Arms multi-target","Thunder Clap → Whirlwind → Cleave.","ability_warrior_cleave"],["Charge and Intercept","Charge out of combat; Berserker Stance and Intercept in combat.","ability_warrior_charge"]]
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
