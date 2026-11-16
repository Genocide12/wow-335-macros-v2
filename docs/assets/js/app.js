// Shared: header/footer injection, lang toggle, copy buttons, tooltips data.
(function () {
  const LANGS = ['ru', 'en'];
  const PAGES = [
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
  let soundOn = localStorage.getItem('wfxSound') !== 'off';
  const UI_SOUND = 'assets/audio/ui-click.ogg';
  const uiAudio = new Audio(UI_SOUND);
  uiAudio.preload = 'auto';
  uiAudio.load();
  const queuedUiSounds = [];
  let soundBusy = false;
  function playUiSound(kind = 'click') {
    if (!soundOn) return;
    try {
      const profiles={click:[.16,1],open:[.14,.92],select:[.15,1.08],copy:[.2,.84],success:[.2,.76]};
      queuedUiSounds.push(kind);
      if(soundBusy)return;
      const playNext=()=>{
        const next=queuedUiSounds.shift();
        if(!next){soundBusy=false;return;}
        const [volume,rate]=profiles[next]||profiles.click;
        soundBusy=true;uiAudio.volume=volume;uiAudio.playbackRate=rate;
        try{uiAudio.currentTime=0;}catch(_){}
        const done=()=>{uiAudio.removeEventListener('ended',done);uiAudio.removeEventListener('error',done);playNext();};
        uiAudio.addEventListener('ended',done,{once:true});uiAudio.addEventListener('error',done,{once:true});
        const playback=uiAudio.play();if(playback?.catch)playback.catch(()=>{uiAudio.removeEventListener('ended',done);uiAudio.removeEventListener('error',done);playNext();});
      };
      playNext();
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

  // Replace browser-native title popups with one consistent game-style tooltip.
  function bindGameTooltips() {
    const tip=document.createElement('div');
    tip.className='game-tip';tip.id='gameTooltip';tip.setAttribute('role','tooltip');tip.setAttribute('aria-hidden','true');
    document.body.appendChild(tip);
    let active=null;
    const targetFor=node=>node instanceof Element?node.closest('[title],[data-game-tooltip]'):null;
    const textFor=el=>el.dataset.gameTooltip||el.getAttribute('title')||'';
    const hide=()=>{
      if(!active)return;
      if(active.dataset.previousDescribedby!==undefined){
        if(active.dataset.previousDescribedby)active.setAttribute('aria-describedby',active.dataset.previousDescribedby);
        else active.removeAttribute('aria-describedby');
        delete active.dataset.previousDescribedby;
      }
      tip.classList.remove('on');tip.setAttribute('aria-hidden','true');active=null;
    };
    const show=el=>{
      if(!el)return hide();
      const text=textFor(el);if(!text)return hide();
      if(el.hasAttribute('title')){el.dataset.gameTooltip=text;el.removeAttribute('title');}
      if(active!==el){hide();active=el;active.dataset.previousDescribedby=active.getAttribute('aria-describedby')||'';active.setAttribute('aria-describedby','gameTooltip');}
      tip.textContent=text;tip.setAttribute('aria-hidden','false');tip.classList.add('on');
      tip.style.left='0px';tip.style.top='0px';
      const target=el.getBoundingClientRect(),box=tip.getBoundingClientRect(),pad=10;
      let left=target.left+target.width/2-box.width/2;
      left=Math.max(pad,Math.min(left,innerWidth-box.width-pad));
      let top=target.top-box.height-9;
      if(top<pad)top=target.bottom+9;
      if(top+box.height>innerHeight-pad)top=Math.max(pad,innerHeight-box.height-pad);
      tip.style.left=`${left}px`;tip.style.top=`${top}px`;
    };
    document.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const el=targetFor(event.target);if(el)show(el);});
    document.addEventListener('pointerout',event=>{if(event.pointerType==='touch')return;const el=targetFor(event.target);if(el===active&&!el.contains(event.relatedTarget))hide();});
    document.addEventListener('focusin',event=>{const el=targetFor(event.target);if(el)show(el);});
    document.addEventListener('focusout',event=>{const el=targetFor(event.target);if(el===active&&!el.contains(event.relatedTarget))hide();});
    document.addEventListener('pointerdown',event=>{
      if(event.pointerType==='touch'){
        const el=targetFor(event.target);
        if(el)show(active===el?null:el);
        else if(!event.target.closest('#gameTooltip'))hide();
      }else if(active&&!active.contains(event.target))hide();
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
    window.addEventListener('resize',()=>{if(active)show(active);});
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Release a stale WebGL pointer lock if a model viewer/browser plugin left one behind.
    if (document.pointerLockElement) document.exitPointerLock?.();
    const app = document.getElementById('app');
    bindGameTooltips();
    // header
    const cur = location.pathname.split('/').pop() || 'index.html';
    const requestedSpec=new URLSearchParams(location.search).get('spec')||localStorage.getItem('warriorSpec')||'fury';
    const activeSpec=['arms','fury','prot'].includes(requestedSpec)?requestedSpec:'fury';
    const specNames={arms:{ru:'Оружие · PvE ДД',en:'Arms · PvE DPS'},fury:{ru:'Неистовство · PvE ДД',en:'Fury · PvE DPS'},prot:{ru:'Защита · PvE танк',en:'Protection · PvE Tank'}};
    const specIcons={arms:'assets/icons/spec-arms.svg',fury:'assets/icons/spec-fury.svg',prot:'assets/icons/spec-protection.svg'};
    const nav = PAGES.map(([f, n]) =>
      `<a href="${f}?lang=${lang}&spec=${activeSpec}" class="${f === cur ? 'on' : ''}">${n[lang]}</a>`
    ).join('');
    app.prepend(h(`
      <header class="top">
        <a class="logo" href="index.html?lang=${lang}&spec=${activeSpec}" aria-label="${lang==='ru'?'На главную':'Home'}">
          <img src="${specIcons[activeSpec]}" width="64" height="64" decoding="async" alt="">
          <span class="t">WoW 3.3.5 · ${specNames[activeSpec][lang]}</span>
        </a>
        <nav>${nav}</nav>
        <button class="sound-btn" id="soundBtn" type="button" aria-pressed="${soundOn}" title="${lang === 'ru' ? 'Звуки интерфейса' : 'Interface sounds'}">${soundOn ? '♫' : '♪'}</button>
        <button class="lang-btn" id="langBtn">${lang === 'ru' ? 'EN' : 'RU'}</button>
      </header>`));
    if(document.pointerLockElement)document.exitPointerLock?.();
    document.getElementById('langBtn').onclick = () => setLang(lang === 'ru' ? 'en' : 'ru');
    document.getElementById('soundBtn').onclick = event => {
      soundOn = !soundOn;
      localStorage.setItem('wfxSound', soundOn ? 'on' : 'off');
      event.currentTarget.textContent = soundOn ? '♫' : '♪';
      event.currentTarget.setAttribute('aria-pressed', String(soundOn));
    };

  });

  // Delegation supports buttons rendered after DOMContentLoaded; decode old encoded payloads.
  document.addEventListener('click', async event => {
    const target = event.target;
    const hintButton=target instanceof Element?target.closest('.hint > .dot'):null;
    if(hintButton){const hint=hintButton.closest('.hint'),open=hint.classList.toggle('open');hintButton.setAttribute('aria-expanded',String(open));}
    else if(!target.closest('.hint'))document.querySelectorAll('.hint.open').forEach(hint=>{hint.classList.remove('open');hint.querySelector('.dot')?.setAttribute('aria-expanded','false');});
    const dialogBackdrop = target instanceof Element ? target.closest('dialog[open]') : null;
    if (dialogBackdrop && target === dialogBackdrop) dialogBackdrop.close();
    const dropdown = document.querySelector('.macro-dropdown.open');
    if (dropdown && !dropdown.contains(target) && !target.closest('.krow a, [data-macro-index]')) {
      dropdown.classList.remove('open');
      const macroBackdrop=document.getElementById('macroBackdrop');
      if(macroBackdrop)macroBackdrop.hidden=true;
    }
    if (!target.closest('.tal[data-id], .tipcard, .slot')) {
      document.querySelectorAll('.tipcard').forEach(tip => { tip.style.display = 'none'; });
    }
    const btn = event.target.closest('[data-copy]');
    const interactive = target.closest('button, a, .tal[data-id], .slot, .t-tab, .g-item');
    if (interactive) {
      const soundKind=interactive.dataset.soundKind||(interactive.matches('#soundBtn, a[href], .krow a, #guideSources')?'open':(interactive.matches('.tal[data-id], .t-tab, .g-item')?'select':(interactive.matches('[data-copy]')?'copy':'click')));
      playUiSound(soundKind);
      interactive.classList.remove('ui-hit');
      void interactive.offsetWidth;
      interactive.classList.add('ui-hit');
      setTimeout(() => interactive.classList.remove('ui-hit'), 420);
      if(interactive.matches('a[href]')&&!interactive.matches('.krow a')){
        const destination=new URL(interactive.href,location.href);
        if(destination.origin===location.origin&&destination.pathname!==location.pathname){
          event.preventDefault();
          setTimeout(()=>location.assign(destination.href),220);
        }
      }
    }
    if (!btn) return;
    // Copy the rendered payload when available: it is the exact macro shown to
    // the player and avoids encoding/HTML entities or adjacent labels leaking in.
    const visibleCode = btn.closest('.macro-box')?.querySelector('pre') ||
      btn.parentElement?.querySelector('pre');
    let txt = visibleCode ? visibleCode.textContent : (btn.getAttribute('data-copy') || '');
    try { if (!visibleCode) txt = decodeURIComponent(txt); } catch (_) {}
    txt = txt.replace(/\r\n/g, '\n').trim();
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(txt);
      else throw new Error('clipboard unavailable');
      copied = true;
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.readOnly = true;
      Object.assign(ta.style, { position: 'fixed', left: '0', top: '0', width: '2px', height: '2px', padding: '0', border: '0', opacity: '0.01', fontSize: '16px' });
      document.body.appendChild(ta); ta.focus({ preventScroll: true }); ta.select(); ta.setSelectionRange(0, txt.length);
      try { copied = document.execCommand('copy'); } catch (_) {}
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = copied ? (btn.dataset.copySuccess || '✓') : (lang === 'ru' ? 'Выделено' : 'Selected');
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
    setSpec(spec) {
      if (!['arms', 'fury', 'prot'].includes(spec)) return;
      localStorage.setItem('warriorSpec', spec);
      const names={arms:{ru:'Оружие · PvE ДД',en:'Arms · PvE DPS'},fury:{ru:'Неистовство · PvE ДД',en:'Fury · PvE DPS'},prot:{ru:'Защита · PvE танк',en:'Protection · PvE Tank'}};
      const icons={arms:'assets/icons/spec-arms.svg',fury:'assets/icons/spec-fury.svg',prot:'assets/icons/spec-protection.svg'};
      const logo=document.querySelector('header.top .logo');
      if(logo){logo.href=`index.html?lang=${lang}&spec=${spec}`;logo.querySelector('img').src=icons[spec];logo.querySelector('.t').textContent=`WoW 3.3.5 · ${names[spec][lang]}`;}
      document.querySelectorAll('header.top nav a').forEach(a=>{const url=new URL(a.href);url.searchParams.set('spec',spec);a.href=url.href;});
      document.body.dataset.spec=spec;
      window.dispatchEvent(new CustomEvent('warrior-spec-change',{detail:{spec}}));
    },
    // Ability and item icons stay game-authentic; navigation art is local SVG.
    icon(name, size) {
      return `https://wow.zamimg.com/images/wow/icons/${size || 'large'}/${name}.jpg`;
    },
    hint(text, bottom) {
      const label=lang==='ru'?'Показать подсказку':'Show hint';
      return `<span class="hint${bottom ? ' b' : ''}"><button class="dot" type="button" aria-label="${label}" aria-expanded="false">?</button><span class="tip" role="tooltip">${text}</span></span>`;
    }
  };
})();
