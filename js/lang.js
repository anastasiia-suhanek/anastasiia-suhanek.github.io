(function () {
  'use strict';

  // Modular-grid layout is the default; ?grid=0 shows the previous layout for this tab, ?grid brings the grid back
  (function () {
    var q = location.search.match(/[?&]grid(=0)?\b/), off = false;
    try {
      if (q) q[1] ? sessionStorage.setItem('grid', '0') : sessionStorage.removeItem('grid');
      off = sessionStorage.getItem('grid') === '0';
    } catch (e) { off = !!(q && q[1]); }
    if (!off) document.documentElement.classList.add('g4');
  })();

  function getSaved() {
    try { return localStorage.getItem('lang'); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  function detect() {
    var saved = getSaved();
    if (saved === 'en' || saved === 'ru') return saved;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return nav.startsWith('ru') ? 'ru' : 'en';
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    save(lang);
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-active', btn.dataset.lang === lang);
    });
  }

  window.setLang = apply;

  window.toggleNav = function () {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var open = nav.classList.toggle('is-open');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  // Visual direction: ?style=swiss | ?style=dusk, remembered per browser
  function getStyle() {
    var q = (location.search.match(/[?&]style=(swiss|dusk|editorial)/) || [])[1];
    try {
      if (q) { localStorage.setItem('style', q); localStorage.setItem('styleSwitcher', '1'); }
      return q || localStorage.getItem('style') || 'swiss';
    } catch (e) { return q || 'swiss'; }
  }
  var style = 'swiss';
  if (style === 'swiss' || style === 'editorial') document.documentElement.classList.add(style);
  document.documentElement.setAttribute('data-theme', style === 'dusk' ? 'dark' : 'light');

  // Set immediately to avoid flash of wrong language
  document.documentElement.lang = detect();

  document.addEventListener('DOMContentLoaded', function () {
    // No language picker: the browser language decides, the EN / RU toggle is always in the nav
    apply(detect());
    var hasSwitcher = false;
    try { hasSwitcher = false; } catch (e) {}
    if (hasSwitcher) {
      var names = { dusk: 'Dusk', swiss: 'Swiss', editorial: 'Editorial' };
      var a = document.createElement('div');
      a.setAttribute('style', 'position:fixed;right:12px;bottom:12px;z-index:9999;display:flex;gap:1px;font:500 12px/1 -apple-system,sans-serif;background:#0B0B0B;padding:1px');
      ['dusk', 'swiss', 'editorial'].forEach(function (k) {
        var l = document.createElement('a');
        l.href = location.pathname + '?style=' + k + location.hash;
        l.textContent = names[k];
        l.setAttribute('style', 'padding:8px 10px;text-decoration:none;' + (k === style ? 'background:#fff;color:#0B0B0B' : 'color:#fff'));
        a.appendChild(l);
      });
      document.body.appendChild(a);
    }
    // Close mobile nav when any nav link is tapped
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        var nav = document.querySelector('.nav');
        if (nav) nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  });
})();
