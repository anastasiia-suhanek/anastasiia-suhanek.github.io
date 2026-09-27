(function () {
  'use strict';

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

  // ?intro forces the picker, e.g. to preview it after a language is already saved
  var firstVisit = !getSaved() || /[?&]intro\b/.test(location.search);

  // First visit: a full-screen language picker. The browser language is pre-highlighted.
  function showPicker() {
    var guess = detect();
    var el = document.createElement('div');
    el.className = 'lang-splash';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Choose language');
    el.innerHTML =
      '<div class="lang-splash-inner">' +
        '<p class="lang-splash-name">Anastasiia Sukhanek</p>' +
        '<p class="lang-splash-q"><span lang="ru">На каком языке хотите со мной познакомиться?</span><span lang="en">Which language would you like to meet me in?</span></p>' +
        '<div class="lang-splash-opts">' +
          '<button type="button" data-lang="en"' + (guess === 'en' ? ' class="is-guess"' : '') + '><span class="lang-splash-big">English</span></button>' +
          '<button type="button" data-lang="ru"' + (guess === 'ru' ? ' class="is-guess"' : '') + '><span class="lang-splash-big">Русский</span></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    document.documentElement.classList.add('has-splash');
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    function choose(lang) {
      apply(lang);
      // The first page after the splash is the home page, not About.
      // Case links still open the case: someone was sent there on purpose
      if (/about\.html$/.test(location.pathname)) { location.replace('index.html' + location.search); return; }
      el.classList.remove('is-in');
      el.classList.add('is-out');
      document.documentElement.classList.remove('has-splash');
      setTimeout(function () { el.remove(); }, 450);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lang]'); if (b) choose(b.getAttribute('data-lang'));
    });
    document.addEventListener('keydown', function onKey(e) {
      if (!document.body.contains(el)) return document.removeEventListener('keydown', onKey);
      if (e.key === 'Escape' || e.key === 'Enter') choose(guess);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (firstVisit) { document.documentElement.lang = detect(); showPicker(); }
    else apply(detect());
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
