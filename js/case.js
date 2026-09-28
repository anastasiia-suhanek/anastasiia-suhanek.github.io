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
      a.innerHTML = '<i>' + String(i + 1).padStart(2, '0') + '</i>' +
                    '<span class="t-en">' + en.textContent + '</span>' +
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
      // A short last chapter never reaches the switch line: at the very bottom it is the current one
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
      // In the bar layout the strip scrolls sideways on phones: keep the current chapter in view
      if (nav.scrollWidth > nav.clientWidth && current !== last) {
        last = current;
        var l = links[current];
        nav.scrollTo({ left: l.offsetLeft - 16, behavior: 'smooth' });
      }
    }
    var last = -1;
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

  // Images marked data-lightbox open over the page; siblings in the same group page with ← →.
  // Every app screen in a case opens the same way: on a phone a 200px screen is too small to read,
  // so a tap shows it full size and a swipe pages through its strip
  function lightbox() {
    if (typeof HTMLDialogElement !== 'function') return;
    var ru = function () { return document.documentElement.lang === 'ru'; };
    var pick = function (root, sel) {
      var el = root && root.querySelector(sel + '.t-' + (ru() ? 'ru' : 'en'));
      return el ? el.textContent.trim() : '';
    };
    var items = [];
    Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]')).forEach(function (a) {
      var thumb = a.querySelector('img');
      items.push({ el: a, group: 'a:' + a.dataset.lightbox, src: function () { return a.href; },
        alt: thumb ? thumb.alt : '', cap: function () { return pick(a.closest('figure'), 'figcaption '); } });
    });
    Array.prototype.slice.call(document.querySelectorAll('.screen-item img')).forEach(function (im) {
      if (im.closest('a')) return;
      var item = im.closest('.screen-item'), strip = im.closest('.screens-row') || item;
      items.push({ el: im, group: strip, src: function () { return im.currentSrc || im.src; }, alt: im.alt,
        cap: function () {
          var c = item.querySelector('.screen-cap');
          return [pick(c, 'strong'), pick(c, 'span')].filter(Boolean).join(' – ');
        } });
      im.classList.add('is-zoomable');
      im.tabIndex = 0;
      im.setAttribute('role', 'button');
    });
    if (!items.length) return;
    // Touch has no zoom cursor: say it once, under the first strip of screens
    var first = document.querySelector('.screens-scroll');
    if (first && window.matchMedia('(hover: none)').matches) {
      var hint = document.createElement('p');
      hint.className = 'screens-hint';
      hint.innerHTML = '<span class="t-en">Tap a screen to open it full size</span><span class="t-ru">Нажмите на экран, чтобы открыть его целиком</span>';
      first.insertAdjacentElement('afterend', hint);
    }
    var d = document.createElement('dialog');
    d.className = 'lightbox';
    d.innerHTML = '<div class="lightbox-stage"><img alt=""><p class="lightbox-cap"></p><p class="lightbox-count" aria-live="polite"></p></div>' +
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">✕</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous">←</button>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next">→</button>';
    document.body.appendChild(d);
    var img = d.querySelector('img'), cap = d.querySelector('.lightbox-cap'), count = d.querySelector('.lightbox-count'),
        prev = d.querySelector('.lightbox-prev'), next = d.querySelector('.lightbox-next'), group = [], i = 0;
    function show(n) {
      i = (n + group.length) % group.length;
      var it = group[i];
      img.src = it.src(); img.alt = it.alt;
      cap.textContent = it.cap();
      count.textContent = group.length > 1 ? (i + 1) + ' / ' + group.length : '';
      prev.hidden = next.hidden = group.length < 2;
    }
    function open(it) {
      d.setAttribute('aria-label', ru() ? 'Просмотр изображения' : 'Image viewer');
      group = items.filter(function (x) { return x.group === it.group; });
      show(group.indexOf(it));
      d.showModal();
      document.documentElement.classList.add('has-lightbox');
    }
    items.forEach(function (it) {
      it.el.removeAttribute('target');
      it.el.addEventListener('click', function (e) { e.preventDefault(); open(it); });
      it.el.addEventListener('keydown', function (e) {
        if (it.el.tagName === 'IMG' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(it); }
      });
    });
    d.querySelector('.lightbox-close').addEventListener('click', function () { d.close(); });
    prev.addEventListener('click', function () { show(i - 1); });
    next.addEventListener('click', function () { show(i + 1); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
    // Swipe sideways to page, swipe down to close – what a phone photo viewer does
    var x0 = null, y0 = null;
    d.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    d.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && group.length > 1) show(dx < 0 ? i + 1 : i - 1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) d.close();
    }, { passive: true });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.classList.contains('lightbox-stage')) d.close(); });
    d.addEventListener('close', function () {
      img.removeAttribute('src');
      document.documentElement.classList.remove('has-lightbox');
    });
  }

  // Arriving on Results (from «Jump to results» or the home ticker) leaves no quick way back up:
  // a small button returns to the case cover, shown once the cover is out of view
  function toTop() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.innerHTML = '<span class="to-top-label"><span class="t-en">To the top</span><span class="t-ru">К началу</span></span> <span aria-hidden="true">↑</span>';
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
