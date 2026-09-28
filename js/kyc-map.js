/* KYC MAP – research mind map for case-profee-verification.html.
   Source: Figma "📱 Profee App Flows" → Verification (node 323-6147).
   Left-to-right tree: KYC → why we ask / what we ask for / how it ends.
   Below it: what the map revealed → what I designed.
   Renders into <div id="kyc-map" class="kyc-map">. Bilingual via .t-en / .t-ru (lang.js). */
(function () {
  'use strict';

  var root = document.getElementById('kyc-map');
  if (!root) return;

  function L(en, ru) { return '<span class="t-en">' + en + '</span><span class="t-ru">' + ru + '</span>'; }
  function T(pair) { return L(pair[0], pair[1]); }

  var FINDINGS = [
    [['Every situation was explained differently and in a different place: profile, success screen, block screen, email', 'one entry point component for app and web'],
              ['Каждую ситуацию объясняли по-своему и в разных местах: профиль, экран успеха, экран блокировки, письмо', 'единый компонент точки входа в приложении и вебе']],
    [['Verification status lived only in email', 'status right in the app'],
              ['Статус проверки был только в письме', 'статус прямо в приложении']],
    [['Progress wasn’t saved, and nothing brought people back after leaving halfway', '“Finish your verification” banner'],
              ['Прогресс не сохранялся, и тех, кто бросил на полпути, ничто не возвращало', 'баннер «Завершите верификацию»']],
    [['Reminders went only to email', 'banners on the main screen'],
              ['Напоминания приходили только на почту', 'баннеры на главном экране']],
    [['People learned about expired documents only when blocked', 'a reminder 3–4 months ahead'],
              ['Об истёкших документах узнавали, только когда всё блокировалось', 'напоминание за 3–4 месяца до срока']]
  ];

  var TREE = [
    { label: ['Why we ask', 'Почему просим'], leaves: [
      { t: ['Hit the limit', 'Упёрлись в лимит'] },
      { t: ['Will hit it next time', 'Упрутся в лимит в следующий раз'] },
      { t: ['Wants a higher limit', 'Хотят лимит повыше'] },
      { t: ['Documents expired', 'Истёк срок документов'] },
      { t: ['Transfer paused', 'Перевод приостановлен'] },
      { t: ['Can’t finish a transfer', 'Не получается завершить перевод'] },
      { t: ['Account locked', 'Аккаунт заблокирован'] },
      { t: ['Extra check needed', 'Нужна дополнительная проверка'] }
    ] },
    { label: ['What we ask for', 'Что просим'], leaves: [
      { t: ['Identity', 'Личность'], s: ['ID photo + selfie', 'фото документа и селфи'] },
      { t: ['Address', 'Адрес'], s: ['bill or bank statement', 'счёт или выписка'] },
      { t: ['Extra documents', 'Доп. документы'], s: ['on request', 'по запросу'] }
    ] },
    { label: ['How it ends', 'Чем заканчивается'], leaves: [
      { t: ['Approved', 'Одобрено'], tone: 'good' },
      { t: ['Another try', 'Ещё попытка'], tone: 'retry' },
      { t: ['Manual review', 'Ручная проверка'], tone: 'manual' },
      { t: ['Rejected', 'Отказ'], tone: 'bad' }
    ] }
  ];


  var rows = TREE.map(function (b, i) {
    var leaves = b.leaves.map(function (l, j) {
      return '<li class="mm-leaf" data-leaf="' + i + '-' + j + '"' + (l.tone ? ' data-tone="' + l.tone + '"' : '') + '>' +
        '<span class="mm-leaf-text">' + T(l.t) + (l.s ? ' <span class="mm-leaf-sub">· ' + T(l.s) + '</span>' : '') + '</span></li>';
    }).join('');
    var row = 'grid-row:' + (i + 1);
    return '<div class="mm-branch" data-g="' + i + '" style="' + row + '"><span class="mm-branch-label">' + T(b.label) + '</span></div>' +
      '<ul class="mm-leaves" data-g="' + i + '" style="' + row + '">' + leaves + '</ul>';
  }).join('');

  root.innerHTML =
    '<p class="section-label section-label--sub">' + L('Research', 'Исследование') + '</p>' +
    '<p class="mm-caption">' + L('Before designing, I mapped the whole KYC system: why we ask people for documents, what exactly we ask for and how it ends. Below are the gaps it revealed and what I designed for each',
                                 'До проектирования я разобрала всю систему KYC: зачем мы просим документы, какие именно и чем всё заканчивается. Ниже – какие пробелы нашлись и что я с ними сделала') + '</p>' +
    '<div class="mm">' +
      '<svg class="mm-lines" aria-hidden="true"></svg>' +
      '<div class="mm-root"><span class="mm-root-title">KYC</span><span class="mm-root-sub">' + L('identity check', 'проверка личности') + '</span></div>' +
      rows +
    '</div>' +
    '<div class="mm-findings">' +
      '<div class="mm-findings-head"><span>' + L('What the map revealed', 'Что показала карта') + '</span><span>' + L('What I designed', 'Что я спроектировала') + '</span></div>' +
      FINDINGS.map(function (f) {
        return '<div class="mm-finding"><span>' + L(f[0][0], f[1][0]) + '</span><span class="mm-finding-fix">' + L(f[0][1], f[1][1]) + '</span></div>';
      }).join('') +
    '</div>';

  var mm = root.querySelector('.mm');
  var svg = root.querySelector('.mm-lines');
  var mqMobile = window.matchMedia('(max-width: 820px)');

  /* ── Lines ── */

  function curve(x1, y1, x2, y2) {
    var dx = Math.max(12, (x2 - x1) * 0.5);
    return 'M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2;
  }

  function draw() {
    if (mqMobile.matches) { svg.innerHTML = ''; return; }
    var b = mm.getBoundingClientRect();
    var r = root.querySelector('.mm-root').getBoundingClientRect();
    var out = '';
    root.querySelectorAll('.mm-branch').forEach(function (br) {
      var g = br.dataset.g, B = br.getBoundingClientRect();
      var by = B.top + B.height / 2 - b.top;
      out += '<path class="mm-edge mm-edge--trunk" data-g="' + g + '" d="' + curve(r.right - b.left, r.top + r.height / 2 - b.top, B.left - b.left, by) + '"/>';
      root.querySelectorAll('.mm-leaves[data-g="' + g + '"] .mm-leaf').forEach(function (leaf) {
        var R = leaf.getBoundingClientRect();
        var lx = R.left - b.left, ly = R.top + R.height / 2 - b.top;
        out += '<path class="mm-edge" data-g="' + g + '" d="' + curve(B.right - b.left + 4, by, lx - 2, ly) + '"/>';
      });
    });
    svg.innerHTML = out;
    setActive(mm.getAttribute('data-active'));
  }

  /* ── Branch focus on hover ── */

  function setActive(g) {
    if (g === null) mm.removeAttribute('data-active'); else mm.setAttribute('data-active', g);
    root.querySelectorAll('[data-g]').forEach(function (el) {
      el.classList.toggle('is-active', g !== null && el.dataset.g === String(g));
    });
  }
  mm.addEventListener('mouseover', function (e) {
    var el = e.target.closest('[data-g]');
    if (el && !mqMobile.matches) setActive(el.dataset.g);
  });
  mm.addEventListener('mouseleave', function () { setActive(null); });

  /* ── Redraw when layout changes ── */

  var raf = 0;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(mm);
  window.addEventListener('resize', schedule);
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  draw();
})();
