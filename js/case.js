/* Case pages: reading time and a jump to results in the eyebrow + sticky table of contents */
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

  // For the reader who only wants the outcome: jump straight to the Results section
  function jumpToResults() {
    var eyebrow = document.querySelector('.hero-eyebrow');
    var label = Array.prototype.find.call(document.querySelectorAll('.section-label.t-en'), function (el) {
      return el.textContent.trim() === 'Results';
    });
    if (!eyebrow || !label) return;
    var section = label.closest('section');
    if (!section.id) section.id = 'results';
    // Meta on the left, the jump pinned to the right edge of the container
    var meta = document.createElement('span');
    meta.className = 'eyebrow-meta';
    while (eyebrow.firstChild) meta.appendChild(eyebrow.firstChild);
    eyebrow.appendChild(meta);
    eyebrow.insertAdjacentHTML('beforeend',
      '<a class="eyebrow-jump" href="#' + section.id + '">' +
      '<span class="t-en"><span class="jump-long">Jump to results</span><span class="jump-short">Results</span> ↓</span>' +
      '<span class="t-ru"><span class="jump-long">К результатам</span><span class="jump-short">Итоги</span> ↓</span></a>');
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

      // Hide captions of cards cut by the strip edges – the right-edge fade must never cut a sentence
      // mid-word. The fade is gone once the strip is scrolled to the end, so the last card keeps its caption
      function peek() {
        var r = strip.getBoundingClientRect();
        var fade = strip.classList.contains('is-end') ? 0 : 48;
        items.forEach(function (it) {
          var b = it.getBoundingClientRect();
          it.classList.toggle('is-peek', b.left < r.left - 2 || b.right > r.right - fade + 2);
        });
      }
      var items = Array.prototype.slice.call(strip.querySelectorAll('.screen-item'));
      strip.addEventListener('scroll', peek, { passive: true });
      window.addEventListener('resize', peek);
      peek();
    });
  }

  // Arriving on #results from the home ticker: smooth scroll lets images load on the way and push the
  // target down, so jump instantly and re-align as images above settle – until the reader scrolls
  function holdAnchor() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    var until = Date.now() + 4000;
    function align() { if (Date.now() < until) el.scrollIntoView({ behavior: 'instant', block: 'start' }); }
    align();
    Array.prototype.forEach.call(document.images, function (img) {
      if (!img.complete) img.addEventListener('load', align, { once: true });
    });
    window.addEventListener('load', align, { once: true });
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
      window.addEventListener(ev, function () { until = 0; }, { once: true, passive: true });
    });
  }

  // Images marked data-lightbox open over the page; siblings in the same group page with ← →
  function lightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
    if (!links.length || typeof HTMLDialogElement !== 'function') return;
    var d = document.createElement('dialog');
    d.className = 'lightbox';
    d.setAttribute('aria-label', document.documentElement.lang === 'ru' ? 'Просмотр изображения' : 'Image viewer');
    d.innerHTML = '<div class="lightbox-stage"><img alt=""><p class="lightbox-cap"></p></div>' +
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">✕</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous">←</button>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next">→</button>';
    document.body.appendChild(d);
    var img = d.querySelector('img'), cap = d.querySelector('.lightbox-cap'), group = [], i = 0;
    function show(n) {
      i = (n + group.length) % group.length;
      var a = group[i], thumb = a.querySelector('img'), fig = a.closest('figure');
      var c = fig && fig.querySelector('figcaption .t-' + (document.documentElement.lang === 'ru' ? 'ru' : 'en'));
      img.src = a.href; img.alt = thumb ? thumb.alt : '';
      cap.textContent = c ? c.textContent.trim() : '';
      d.querySelector('.lightbox-prev').hidden = d.querySelector('.lightbox-next').hidden = group.length < 2;
    }
    links.forEach(function (a) {
      a.removeAttribute('target');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        group = links.filter(function (l) { return l.dataset.lightbox === a.dataset.lightbox; });
        show(group.indexOf(a));
        d.showModal();
      });
    });
    d.querySelector('.lightbox-close').addEventListener('click', function () { d.close(); });
    d.querySelector('.lightbox-prev').addEventListener('click', function () { show(i - 1); });
    d.querySelector('.lightbox-next').addEventListener('click', function () { show(i + 1); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.classList.contains('lightbox-stage')) d.close(); });
    d.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  // Arriving on Results (from «Jump to results» or the home ticker) leaves no quick way back up:
  // a small button returns to the case cover, shown once the cover is out of view
  function toTop() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.innerHTML = '<span class="t-en">To the top ↑</span><span class="t-ru">К началу ↑</span>';
    b.addEventListener('click', function () {
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
    document.body.appendChild(b);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { b.classList.toggle('is-visible', !e[0].isIntersecting); }).observe(hero);
    } else {
      b.classList.add('is-visible');
    }
  }

  document.addEventListener('DOMContentLoaded', function () { readingTime(); jumpToResults(); toc(); sliders(); holdAnchor(); lightbox(); toTop(); });
})();
