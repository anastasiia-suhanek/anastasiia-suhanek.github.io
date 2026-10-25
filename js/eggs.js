/* Easter eggs on every page (not the CV):
   – a note in the DevTools console for the curious
   – junior Texas, the Abyssinian cat, runs along the bottom of the screen once per visit after a minute of idling.
     Click him for a line from QA. texas() in the console calls him on demand */
(function () {
  'use strict';

  var ru = function () { return document.documentElement.lang === 'ru'; };

  // Console
  var tram =
    '   _____________________\n' +
    '  |  [ ]  [ ]  [ ]  [ ] |  22 → your team\n' +
    '  |_____________________|\n' +
    '    (o)            (o)\n' +
    '==========================';
  try {
    console.log('%c' + tram, 'font-family:monospace;color:#FFB547');
    console.log(ru()
      ? '%cРаз вы заглянули сюда, нам точно есть о чём поговорить\nanastasiia.suhanek@gmail.com · t.me/suhastasiia\n\nP.S. Позовите кота: texas()'
      : '%cIf you’re reading this, we definitely have things to talk about\nanastasiia.suhanek@gmail.com · t.me/suhastasiia\n\nP.S. Call the cat: texas()',
      'font:14px/20px system-ui,sans-serif');
  } catch (e) {}

  // Texas
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = false;

  var CAT =
    '<svg viewBox="0 0 120 72" width="120" height="72" aria-hidden="true">' +
      '<path class="tx-tail" d="M32 38 C20 36 12 30 8 18" fill="none" stroke="#B85F2A" stroke-width="6" stroke-linecap="round"/>' +
      '<g class="tx-legs-b"><path d="M40 46 L36 66" stroke="#A9551F" stroke-width="7" stroke-linecap="round"/></g>' +
      '<g class="tx-legs-f"><path d="M78 46 L82 66" stroke="#A9551F" stroke-width="7" stroke-linecap="round"/></g>' +
      '<ellipse cx="58" cy="40" rx="30" ry="13" fill="#C46A2F"/>' +
      '<g class="tx-legs-f2"><path d="M74 46 L70 66" stroke="#C46A2F" stroke-width="7" stroke-linecap="round"/></g>' +
      '<g class="tx-legs-b2"><path d="M44 46 L48 66" stroke="#C46A2F" stroke-width="7" stroke-linecap="round"/></g>' +
      '<path d="M84 22 L87 6 L95 19 Z M96 19 L102 6 L104 23 Z" fill="#C46A2F"/>' +
      '<path d="M87 18 L88 11 L92 18 Z M98 18 L101 11 L102 20 Z" fill="#E8A273"/>' +
      '<circle cx="93" cy="30" r="12" fill="#C46A2F"/>' +
      '<ellipse cx="103" cy="34" rx="5" ry="4" fill="#D98A52"/>' +
      '<circle cx="97" cy="28" r="2" fill="#2A1A0E"/>' +
      '<circle cx="107" cy="33" r="1.4" fill="#5A2E1A"/>' +
    '</svg>';

  function css() {
    if (document.getElementById('tx-css')) return;
    var s = document.createElement('style'); s.id = 'tx-css';
    s.textContent =
      '.tx{position:fixed;left:0;bottom:0;z-index:9000;width:120px;height:72px;cursor:pointer;transform:translateX(-140px);will-change:transform}' +
      '.tx svg{display:block;animation:tx-bob .32s ease-in-out infinite alternate}' +
      '.tx g{transform-box:fill-box;transform-origin:50% 0;animation:tx-leg .32s ease-in-out infinite alternate}' +
      '.tx .tx-legs-f,.tx .tx-legs-b2{animation-direction:alternate-reverse}' +
      '.tx .tx-tail{transform-box:fill-box;transform-origin:100% 100%;animation:tx-tail .64s ease-in-out infinite alternate}' +
      '.tx.sit svg,.tx.sit g{animation-play-state:paused}' +
      '.tx-say{position:absolute;bottom:80px;left:50%;transform:translateX(-50%);width:max-content;max-width:240px;padding:8px 12px;border-radius:12px;background:#F2EDE4;color:#0B0907;font:500 14px/20px Inter,system-ui,sans-serif;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.3)}' +
      '@keyframes tx-bob{to{transform:translateY(-4px)}}' +
      '@keyframes tx-leg{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}' +
      '@keyframes tx-tail{from{transform:rotate(-8deg)}to{transform:rotate(12deg)}}';
    document.head.appendChild(s);
  }

  var LINES = {
    ru: ['Джуниор Техас, отдел QA. Нашёл баг: вы отдыхаете', 'Мяу. Это значит «пишите Насте»', 'Я тут за метриками слежу'],
    en: ['Junior Texas, QA. Bug found: you’re taking a break', 'Meow. That means “message Anastasiia”', 'Just keeping an eye on the metrics']
  };

  function run() {
    if (running || reduce) return;
    running = true; css();
    var cat = document.createElement('div'); cat.className = 'tx'; cat.innerHTML = CAT;
    cat.setAttribute('role', 'img'); cat.setAttribute('aria-label', ru() ? 'Кот Техас пробегает мимо' : 'Texas the cat runs by');
    document.body.appendChild(cat);
    var W = innerWidth, stop = Math.round(W * (.3 + Math.random() * .3)), t0 = performance.now(), phase = 0, paused = 0, said = false;
    var speed = .36; // px per ms
    cat.addEventListener('click', function () {
      if (said) return; said = true;
      var l = LINES[ru() ? 'ru' : 'en'], b = document.createElement('div'); b.className = 'tx-say';
      b.textContent = l[Math.floor(Math.random() * l.length)]; cat.appendChild(b);
      phase = 1; paused = performance.now(); cat.classList.add('sit');
    });
    var x = -140;
    function step(now) {
      var dt = Math.min(now - t0, 50); t0 = now;
      if (phase === 0) { x += speed * dt; if (x >= stop) { phase = 1; paused = now; cat.classList.add('sit'); } }
      else if (phase === 1) { if (now - paused > (said ? 2400 : 900)) { phase = 2; cat.classList.remove('sit'); var b = cat.querySelector('.tx-say'); if (b) b.remove(); } }
      else { x += speed * 1.4 * dt; }
      cat.style.transform = 'translateX(' + x + 'px)';
      if (x < W + 20) requestAnimationFrame(step);
      else { cat.remove(); running = false; }
    }
    requestAnimationFrame(step);
  }
  window.texas = function () { run(); return ru() ? 'Мяу' : 'Meow'; };

  // Once per visit, after a minute without any input
  var seen = false;
  try { seen = sessionStorage.getItem('texas') === '1'; } catch (e) {}
  if (!seen && !reduce) {
    var idle;
    var arm = function () {
      clearTimeout(idle);
      idle = setTimeout(function () {
        if (document.hidden) return arm();
        try { sessionStorage.setItem('texas', '1'); } catch (e) {}
        ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) { removeEventListener(ev, arm); });
        run();
      }, 60000);
    };
    ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) { addEventListener(ev, arm, { passive: true }); });
    arm();
  }
})();
