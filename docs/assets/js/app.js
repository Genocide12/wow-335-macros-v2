// Shared: header/footer injection, lang toggle, copy buttons, tooltips data.
(function () {
  const LANGS = ['ru', 'en'];
  const PAGES = [
    ['index.html', { ru: 'Главная', en: 'Home' }],
    ['macros.html', { ru: 'Макросы', en: 'Macros' }],
    ['talents.html', { ru: 'Таланты', en: 'Talents' }],
    ['hero.html', { ru: 'Герой', en: 'Hero' }],
    ['guide.html', { ru: 'Гайд', en: 'Guide' }],
    ['warrior-modes.html', { ru: 'Направления', en: 'Warrior paths' }],
  ];

  function getLang() {
    const u = new URLSearchParams(location.search);
    let saved = 'ru';
    try { saved = localStorage.getItem('wlang') || 'ru'; } catch (_) {}
    return (u.get('lang') || saved).slice(0, 2);
  }
  function setLang(l) {
    try { localStorage.setItem('wlang', l); } catch (_) {}
    const u = new URL(location);
    u.searchParams.set('lang', l);
    location.href = u;
  }
  const lang = LANGS.includes(getLang()) ? getLang() : 'ru';

  function h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    // header
    const cur = location.pathname.split('/').pop() || 'index.html';
    const nav = PAGES.map(([f, n]) =>
      `<a href="${f}?lang=${lang}" class="${f === cur ? 'on' : ''}">${n[lang]}</a>`
    ).join('');
    app.prepend(h(`
      <header class="top">
        <a class="logo" href="index.html?lang=${lang}">
          <img src="assets/icons/logo.jpg" alt="">
          <span class="t">WoW 3.3.5 · Warrior</span>
        </a>
        <nav>${nav}</nav>
        <button class="lang-btn" id="langBtn">${lang === 'ru' ? 'EN' : 'RU'}</button>
      </header>`));
    document.getElementById('langBtn').onclick = () => setLang(lang === 'ru' ? 'en' : 'ru');

    // footer
    app.append(h(`
      <footer class="bot">
        <span>WotLK 3.3.5a · ${lang === 'ru' ? 'Пути воина' : 'Warrior paths'}</span>
        <a href="https://github.com/Genocide12/wow-335-macros-v2" target="_blank" rel="noopener">GitHub</a> <a href="https://github.com/Genocide12/wow-335-macros-v2/releases" target="_blank" rel="noopener">${lang === 'ru' ? 'Релизы' : 'Releases'}</a> <a href="https://github.com/Genocide12/wow-335-macros-v2/issues" target="_blank" rel="noopener">${lang === 'ru' ? 'Ошибки' : 'Issues'}</a>
        <span style="margin-left:auto" class="muted">${lang === 'ru' ? 'Иконки: Wowhead / zamimg' : 'Icons: Wowhead / zamimg'}</span>
      </footer>`));

    // copy buttons
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const txt = btn.getAttribute('data-copy');
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
          .catch(() => {
            const ta = document.createElement('textarea');
            ta.value = txt; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); ta.remove();
          })
          .finally(() => {
            const old = btn.textContent;
            btn.textContent = '✓'; btn.classList.add('ok');
            setTimeout(() => { btn.textContent = old; btn.classList.remove('ok'); }, 1200);
          });
      });
    });
  });

  // export helpers
  window.W = {
    lang,
    // Wowhead CDN serves every WotLK icon — nothing is stored in the repo
    icon(name, size) {
      return `https://wow.zamimg.com/images/wow/icons/${size || 'large'}/${name}.jpg`;
    },
    hint(text, bottom) {
      return `<span class="hint${bottom ? ' b' : ''}"><span class="dot">?</span><span class="tip">${text}</span></span>`;
    }
  };
})();
