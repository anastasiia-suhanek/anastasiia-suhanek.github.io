/* KYC STATES – one entry point component, every verification scenario.
   A phone with the real screens and a list of situations: click one to switch, or watch them cycle.
   Renders into <div id="kyc-states" class="kyc-states">. Bilingual via .t-en / .t-ru (lang.js) */
(function () {
  'use strict';

  var root = document.getElementById('kyc-states');
  if (!root) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function L(p) { return '<span class="t-en">' + p[0] + '</span><span class="t-ru">' + p[1] + '</span>'; }

  // form · screen · title · when it shows · what the button does
  var GROUPS = [
    { form: ['Card on the main screen', 'Карточка на главном экране'], items: [
      { src: 'screen-entry-banner', t: ['Extra documents needed', 'Нужны доп. документы'], why: ['The check needs more from the user', 'Для проверки нужно что-то ещё'], act: ['Open bot', 'Открыть бота'] },
      { src: 'screen-checking-new', t: ['Checking your docs', 'Проверяем документы'], why: ['Docs are in, nothing to do but wait', 'Документы отправлены, остаётся ждать'], act: ['No button – just the status', 'Без кнопки — только статус'] },
      { src: 'refresh-expiring-banner', t: ['Docs expiring soon', 'Документы скоро истекут'], why: ['3–4 months before the date, can be closed', 'За 3–4 месяца до срока, можно закрыть'], act: ['Open bot', 'Открыть бота'] },
      { src: 'refresh-expired-card', t: ['Docs expired', 'Срок документов вышел'], why: ['Stays until the docs are updated', 'Висит, пока документы не обновят'], act: ['Open bot', 'Открыть бота'] }
    ] },
    { form: ['Bottom sheet mid-flow', 'Шторка во время перевода'], items: [
      { src: 'screen-failed', t: ['Verification didn’t go through', 'Верификация не прошла'], why: ['The docs couldn’t be verified', 'Документы не удалось проверить'], act: ['Open bot · Not now', 'Открыть бота · Не сейчас'] },
      { src: 'screen-finish-verif', t: ['Finish verification', 'Завершите верификацию'], why: ['Left halfway – progress is kept', 'Бросили на полпути — прогресс сохранён'], act: ['Finish · Do it later', 'Завершить · Позже'] },
      { src: 'midflow-left-to-send', t: ['X EUR left to send', 'Осталось X EUR'], why: ['Close to the limit, the transfer still goes', 'Лимит близко, перевод ещё проходит'], act: ['Open bot · Change amount', 'Открыть бота · Изменить сумму'] },
      { src: 'midflow-limit-reached', t: ['Today’s limit reached', 'Дневной лимит исчерпан'], why: ['The limit blocks the transfer', 'Лимит не пускает перевод'], act: ['Open bot', 'Открыть бота'] },
      { src: 'midflow-limits-review', t: ['Limits review', 'Проверка лимитов'], why: ['The bot can’t help here', 'Здесь бот не поможет'], act: ['Contact support', 'Написать в поддержку'] },
      { src: 'midflow-check-email', t: ['Extra details by email', 'Доп. данные по почте'], why: ['A few details are asked by email', 'Часть данных запрашивают письмом'], act: ['Open email', 'Открыть почту'] },
      { src: 'screen-kyc-refresh-modal', t: ['Update your docs', 'Обновите документы'], why: ['On launch while the docs are expiring', 'При запуске, пока документы истекают'], act: ['Open bot · Do it later', 'Открыть бота · Позже'] }
    ] },
    { form: ['Removed after launch', 'Убрали после запуска'], dropped: true, items: [
      { src: 'dropped-lift-limit', t: ['Let’s lift your limit', 'Давайте поднимем лимит'], why: ['Right after a successful transfer – almost everyone closed it', 'Сразу после успешного перевода — почти все закрывали'], act: ['Dropped', 'Убрали'] }
    ] }
  ];

  var all = [];
  GROUPS.forEach(function (g) { g.items.forEach(function (it) { it.dropped = g.dropped; it.form = g.form; all.push(it); }); });

  var list = '';
  GROUPS.forEach(function (g) {
    list += '<p class="ks-form">' + L(g.form) + '</p><ul class="ks-list">';
    g.items.forEach(function (it) {
      var i = all.indexOf(it);
      list += '<li><button type="button" class="ks-item' + (it.dropped ? ' ks-item--dropped' : '') + '" data-i="' + i + '" aria-pressed="false">' +
        '<span class="ks-title">' + L(it.t) + '</span><span class="ks-why">' + L(it.why) + '</span><i class="ks-bar" aria-hidden="true"></i></button></li>';
    });
    list += '</ul>';
  });
  var screens = all.map(function (it, i) {
    return '<img class="ks-screen" src="images/verif/' + it.src + '.png" alt="" data-i="' + i + '" loading="lazy">';
  }).join('');

  root.innerHTML =
    '<div class="ks-nav" role="group" aria-label="Verification scenarios">' + list + '</div>' +
    '<div class="ks-stage">' +
      '<div class="phone-frame ks-phone"><div class="phone-island"></div><div class="ks-screens">' + screens + '</div></div>' +
      '<p class="ks-caption" aria-live="polite"></p>' +
      '<button type="button" class="ks-play"></button>' +
    '</div>';

  var items = root.querySelectorAll('.ks-item'), imgs = root.querySelectorAll('.ks-screen');
  var caption = root.querySelector('.ks-caption'), play = root.querySelector('.ks-play');
  var cur = -1, timer = null, auto = !reduce, visible = false, DWELL = 2800;

  function show(i, animate) {
    if (i === cur) return;
    var prev = cur; cur = i;
    items.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    imgs.forEach(function (im, k) {
      im.classList.toggle('is-on', k === i);
      im.classList.toggle('is-prev', k === prev);
      if (k === i) { im.loading = 'eager'; im.alt = all[i].t[document.documentElement.lang === 'ru' ? 1 : 0]; }
    });
    root.classList.toggle('no-anim', !animate);
    var it = all[i];
    caption.innerHTML = '<b>' + L(it.form) + '</b> · ' + (it.dropped ? L(['removed after launch', 'убрали после запуска']) : L(['button: ', 'кнопка: ']) + L(it.act));
    // Restart the progress bar on the active item
    // On phones the list is a horizontal strip: keep the active card in view without moving the page
    var nav = root.querySelector('.ks-nav');
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: items[i].parentNode.offsetLeft - 16, behavior: animate ? 'smooth' : 'auto' });
    var bar = items[i].querySelector('.ks-bar'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    root.classList.toggle('is-auto', auto);
  }
  function tick() {
    clearTimeout(timer);
    if (!auto) return;
    timer = setTimeout(function () { if (visible && auto) show((cur + 1) % all.length, true); tick(); }, DWELL);
  }
  function setAuto(on) {
    auto = on; root.classList.toggle('is-auto', on);
    play.innerHTML = on ? L(['❚❚ Pause', '❚❚ Пауза']) : L(['▶ Play all scenarios', '▶ Показать все сценарии']);
    tick();
  }
  items.forEach(function (b) {
    b.addEventListener('click', function () { setAuto(false); show(+b.dataset.i, true); });
  });
  play.addEventListener('click', function () { setAuto(!auto); if (auto) show((cur + 1) % all.length, true); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .5 }).observe(root.querySelector('.ks-phone'));
  } else visible = true;

  show(0, false);
  setAuto(auto);
  // Alt text follows the language
  new MutationObserver(function () { var c = cur; cur = -1; show(c, false); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
