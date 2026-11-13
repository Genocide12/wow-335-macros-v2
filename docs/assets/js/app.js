// Shared: header/footer injection, lang toggle, copy buttons, tooltips data.
(function () {
  const LANGS = ['ru', 'en'];
  const PAGES = [
    ['index.html', { ru: 'Главная', en: 'Home' }],
    ['macros.html', { ru: 'Макросы', en: 'Macros' }],
    ['talents.html', { ru: 'Таланты', en: 'Talents' }],
    ['hero.html', { ru: 'Герой', en: 'Hero' }],
    ['guide.html', { ru: 'Гайд', en: 'Guide' }],
  ];

  function getLang() {
    const u = new URLSearchParams(location.search);
    return (u.get('lang') || localStorage.getItem('wlang') || 'ru').slice(0, 2);
  }
  function setLang(l) {
    localStorage.setItem('wlang', l);
    const u = new URL(location);
    u.searchParams.set('lang', l);
    location.href = u;
  }
  const lang = LANGS.includes(getLang()) ? getLang() : 'ru';
  let soundOn = localStorage.getItem('wfxSound') === 'on';
  const UI_SOUND = 'https://wow.zamimg.com/wowsounds/sound/interface/uchatscrollbutton.ogg';
  let uiAudio;
  let queuedUiSound = null;
  function playUiSound(kind = 'click') {
    if (!soundOn) return;
    try {
      const profiles={click:[.16,1],open:[.14,.92],select:[.15,1.08],copy:[.2,.84],success:[.2,.76]};
      const [volume,rate]=profiles[kind]||profiles.click;
      if(!uiAudio){uiAudio=new Audio(UI_SOUND);uiAudio.preload='auto';uiAudio.addEventListener('ended',()=>{const next=queuedUiSound;queuedUiSound=null;if(next)playUiSound(next);});}
      if(!uiAudio.paused){queuedUiSound=kind;return;}
      uiAudio.volume=volume;uiAudio.playbackRate=rate;uiAudio.currentTime=0;
      const playback=uiAudio.play();if(playback?.catch)playback.catch(()=>{});
    } catch (_) {}
  }

  // Keep the UI intact when an upstream game icon is missing or its CDN is unavailable.
  document.addEventListener('error', event => {
    const img=event.target;
    if (img instanceof HTMLImageElement && img.src.includes('wow.zamimg.com')) {
      if(img.dataset.fallbackSrc&&!img.dataset.iconFallback){img.dataset.iconFallback='1';img.src=img.dataset.fallbackSrc;}
      else img.src='assets/icons/item-missing.svg';
    }
  }, true);

  function h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Release a stale WebGL pointer lock if a model viewer/browser plugin left one behind.
    if (document.pointerLockElement) document.exitPointerLock?.();
    const app = document.getElementById('app');
    // header
    const cur = location.pathname.split('/').pop() || 'index.html';
    const requestedSpec=new URLSearchParams(location.search).get('spec')||localStorage.getItem('warriorSpec')||'fury';
    const activeSpec=['arms','fury','prot'].includes(requestedSpec)?requestedSpec:'fury';
    const nav = PAGES.map(([f, n]) =>
      `<a href="${f}?lang=${lang}&spec=${activeSpec}" class="${f === cur ? 'on' : ''}">${n[lang]}</a>`
    ).join('');
    app.prepend(h(`
      <header class="top">
        <a class="logo" href="index.html?lang=${lang}">
          <img src="assets/icons/logo.jpg" alt="">
          <span class="t">WoW 3.3.5 · Warrior</span>
        </a>
        <nav>${nav}</nav>
        <button class="sound-btn" id="soundBtn" type="button" aria-pressed="${soundOn}" title="${lang === 'ru' ? 'Звуки интерфейса' : 'Interface sounds'}">${soundOn ? '♫' : '♪'}</button>
        <button class="lang-btn" id="langBtn">${lang === 'ru' ? 'EN' : 'RU'}</button>
      </header>`));
    const labels={arms:lang==='ru'?'Воин — Оружие · PvP':'Arms Warrior · PvP',fury:lang==='ru'?'Воин — Неистовство · PvE ДД':'Fury Warrior · PvE DPS',prot:lang==='ru'?'Воин — Защита · PvE танк':'Protection Warrior · PvE tank'};
    document.getElementById('langBtn').onclick = () => setLang(lang === 'ru' ? 'en' : 'ru');
    document.getElementById('soundBtn').onclick = event => {
      soundOn = !soundOn;
      localStorage.setItem('wfxSound', soundOn ? 'on' : 'off');
      event.currentTarget.textContent = soundOn ? '♫' : '♪';
      event.currentTarget.setAttribute('aria-pressed', String(soundOn));
      if (soundOn) playUiSound('open');
    };

    // footer
    app.append(h(`
      <footer class="bot">
        <span id="pathFooter">WotLK 3.3.5a · ${lang === 'ru' ? 'Воин — Неистовство' : 'Fury Warrior'}</span>
        <a href="https://github.com/Genocide12/wow-335-macros-v2" target="_blank" rel="noopener">GitHub</a>
        <span style="margin-left:auto" class="muted">${lang === 'ru' ? 'Иконки: Wowhead / zamimg' : 'Icons: Wowhead / zamimg'}</span>
      </footer>`));
    const pathFooter=document.getElementById('pathFooter');if(pathFooter)pathFooter.textContent='WotLK 3.3.5a · '+(labels[activeSpec]||labels.fury);

  });

  // Delegation supports buttons rendered after DOMContentLoaded; decode old encoded payloads.
  document.addEventListener('click', async event => {
    const target = event.target;
    const dialogBackdrop = target instanceof Element ? target.closest('dialog[open]') : null;
    if (dialogBackdrop && target === dialogBackdrop) dialogBackdrop.close();
    const dropdown = document.querySelector('.macro-dropdown.open');
    if (dropdown && !dropdown.contains(target) && !target.closest('.krow a')) dropdown.classList.remove('open');
    if (!target.closest('.tal[data-id], .tipcard, .slot')) {
      document.querySelectorAll('.tipcard').forEach(tip => { tip.style.display = 'none'; });
    }
    const btn = event.target.closest('[data-copy]');
    const interactive = target.closest('button, a, .tal[data-id], .slot, .t-tab, .g-item');
    if (interactive) {
      if(!interactive.matches('[data-copy]')&&!interactive.matches('a[href]'))playUiSound(interactive.matches('.krow a, #guideSources') ? 'open' : (interactive.matches('.tal[data-id], .t-tab, .g-item') ? 'select' : 'click'));
      interactive.classList.remove('ui-hit');
      void interactive.offsetWidth;
      interactive.classList.add('ui-hit');
      setTimeout(() => interactive.classList.remove('ui-hit'), 420);
    }
    if (!btn) return;
    let txt = btn.getAttribute('data-copy') || '';
    try { txt = decodeURIComponent(txt); } catch (_) {}
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(txt);
      else throw new Error('clipboard unavailable');
      copied = true;
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { copied = document.execCommand('copy'); } catch (_) {}
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = copied ? (btn.dataset.copySuccess || '✓') : (lang === 'ru' ? 'Выделено' : 'Selected');
    if(copied)playUiSound('copy');
    btn.classList.add('ok');
    if (!copied) { const pre=btn.parentElement.querySelector('pre'); if(pre){const r=document.createRange();r.selectNodeContents(pre);getSelection().removeAllRanges();getSelection().addRange(r);} }
    setTimeout(() => { btn.textContent = old; btn.classList.remove('ok'); }, 1400);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    document.querySelectorAll('.macro-dropdown.open').forEach(dropdown => dropdown.classList.remove('open'));
    document.querySelectorAll('.tipcard').forEach(tip => { tip.style.display = 'none'; });
  });

  // export helpers
  window.W = {
    lang,
    sound: playUiSound,
    // Wowhead CDN serves every WotLK icon — nothing is stored in the repo
    icon(name, size) {
      return `https://wow.zamimg.com/images/wow/icons/${size || 'large'}/${name}.jpg`;
    },
    hint(text, bottom) {
      return `<span class="hint${bottom ? ' b' : ''}"><span class="dot">?</span><span class="tip">${text}</span></span>`;
    }
  };
})();
