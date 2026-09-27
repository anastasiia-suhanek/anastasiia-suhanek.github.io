/* Case pages: reading time in the eyebrow + sticky table of contents */
(function () {
  'use strict';

  function readingTime() {
    var eyebrow = document.querySelector('.hero-eyebrow');
    if (!eyebrow) return;
    var words = 0;
    document.querySelectorAll('.section .t-en, .hero .t-en').forEach(function (el) {
      words += (el.textContent.trim().match(/\S+/g) || []).length;
    });
    var min = Math.max(1, Math.round(words / 220));
    eyebrow.insertAdjacentHTML('beforeend',
      ' · <span class="t-en">' + min + ' min read</span><span class="t-ru">' + min + ' мин чтения</span>');
  }

  function toc() {
    var sections = Array.prototype.filter.call(document.querySelectorAll('section.section'), function (s) {
      return s.querySelector('.section-label');
    });
    if (sections.length < 3) return;

    var nav = document.createElement('nav');
    nav.className = 'case-toc';
    nav.setAttribute('aria-label', 'Case sections');

    var links = sections.map(function (s, i) {
      if (!s.id) s.id = 'section-' + (i + 1);
      var en = s.querySelector('.section-label.t-en') || s.querySelector('.section-label');
      var ru = s.querySelector('.section-label.t-ru');
      var a = document.createElement('a');
      a.href = '#' + s.id;
      a.innerHTML = '<span class="t-en">' + en.textContent + '</span>' +
                    '<span class="t-ru">' + (ru ? ru.textContent : en.textContent) + '</span>';
      nav.appendChild(a);
      return a;
    });
    document.body.appendChild(nav);

    // show only once the reader has passed the hero
    var hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        nav.classList.toggle('is-visible', !e[0].isIntersecting);
      }).observe(hero);
    } else {
      nav.classList.add('is-visible');
    }

    // highlight the section currently in view
    function update() {
      var y = window.innerHeight * 0.35, current = 0;
      sections.forEach(function (s, i) { if (s.getBoundingClientRect().top < y) current = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function sliders() {
    var arrow = function (d) {
      return '<svg viewBox="0 0 16 16" fill="none"><path d="' + (d < 0 ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5') +
             '" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    };
    document.querySelectorAll('.screens-scroll').forEach(function (strip) {
      var item = strip.querySelector('.screen-item');
      if (!item) return;
      var controls = document.createElement('div');
      controls.className = 'slider-controls';
      controls.innerHTML =
        '<button class="slider-btn" type="button" aria-label="Previous screens">' + arrow(-1) + '</button>' +
        '<button class="slider-btn" type="button" aria-label="Next screens">' + arrow(1) + '</button>';
      strip.parentNode.insertBefore(controls, strip);
      var prev = controls.children[0], next = controls.children[1];

      function step() { return item.getBoundingClientRect().width + (parseFloat(getComputedStyle(item.parentNode).columnGap) || 0); }
      function update() {
        var max = strip.scrollWidth - strip.clientWidth - 2;
        controls.style.display = max <= 0 ? 'none' : '';
        prev.disabled = strip.scrollLeft <= 2;
        next.disabled = strip.scrollLeft >= max;
        strip.classList.toggle('is-end', strip.scrollLeft >= max);
      }
      prev.addEventListener('click', function () { strip.scrollBy({ left: -step(), behavior: 'smooth' }); });
      next.addEventListener('click', function () { strip.scrollBy({ left: step(), behavior: 'smooth' }); });
      strip.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  document.addEventListener('DOMContentLoaded', function () { readingTime(); toc(); sliders(); });
})();
