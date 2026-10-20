/* MOTION – the main site's animations (css/motion.css). Loaded in <head> so the page entrance starts with the first paint.
   1 · the name window follows the cursor and the scroll
   2 · case list: a peek at the key screen follows the cursor, bars draw again
   3 · page transitions: an indigo line, then the next page rises in
   4 · case pages: reading progress and metrics that count up
   5 · screen rows slide in as they arrive */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;
  if (reduce) return;

  // 3 · arriving through our transition: the page rises in
  try { if (sessionStorage.getItem('mv-in') === '1') { sessionStorage.removeItem('mv-in'); root.classList.add('mv-enter'); } } catch (e) {}

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  document.addEventListener('DOMContentLoaded', function () {
    var line = document.createElement('div'); line.className = 'mv-line'; line.setAttribute('aria-hidden', 'true'); document.body.appendChild(line);
    setTimeout(function () { root.classList.remove('mv-enter'); }, 900);

    /* 3 · leaving: same-site pages only; new tabs, downloads, anchors and mail stay as they are */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute('href');
      if (a.target === '_blank' || a.hasAttribute('download') || href.charAt(0) === '#' || /^(mailto|tel|javascript):/.test(href)) return;
      if (a.origin !== location.origin) return;
      if (a.pathname === location.pathname && a.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem('mv-in', '1'); } catch (err) {}
      root.classList.add('mv-leaving');
      setTimeout(function () { location.href = a.href; }, 380);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) root.classList.remove('mv-leaving', 'mv-enter'); });

    nameWindow();
    casePeek();
    caseReading();
    screenRows();
  });

  /* 1 · the name as a window onto the portrait: the picture drifts behind the letters */
  function nameWindow() {
    var el = document.querySelector('.hero .sw-name');
    if (!el || getComputedStyle(el).backgroundClip.indexOf('text') < 0 && getComputedStyle(el).webkitBackgroundClip !== 'text') return;
    var AR = 1800 / 788, box, iw, ih, m = { x: 0, y: 0, tx: 0, ty: 0 };
    function measure() {
      var r = el.getBoundingClientRect(); box = { w: r.width, h: r.height };
      // 10% bigger than "cover", so there is room to move
      var cover = Math.max(box.w / AR, box.h); ih = cover * 1.1; iw = ih * AR;
      if (iw < box.w * 1.1) { iw = box.w * 1.1; ih = iw / AR; }
      el.style.backgroundSize = iw + 'px ' + ih + 'px';
    }
    measure(); addEventListener('resize', measure);
    if (fine) addEventListener('pointermove', function (e) { m.tx = e.clientX / innerWidth - .5; m.ty = e.clientY / innerHeight - .5; }, { passive: true });
    (function frame() {
      m.x += (m.tx - m.x) * .06; m.y += (m.ty - m.y) * .06;
      var r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        var sx = iw - box.w, sy = ih - box.h, scroll = clamp(-r.top / innerHeight, -1, 1);
        // Base: right and top aligned like the original crop, minus half the slack so it can move both ways
        var x = box.w - iw + sx * (.5 - m.x * .9);
        var y = -sy * (.5 + m.y * .6 + scroll * .5);
        el.style.backgroundPosition = x.toFixed(1) + 'px ' + clamp(y, -sy, 0).toFixed(1) + 'px';
      }
      requestAnimationFrame(frame);
    })();
  }

  /* 2 · case list: the key screen follows the cursor, the before → after bars draw again */
  function casePeek() {
    var rows = document.querySelectorAll('.rb-row');
    if (!rows.length) return;
    var PREVIEW = {
      'case-profee-verification.html': 'images/verif/screen-entry-new.png',
      'case-profee-topup.html': 'images/topup/quick.png',
      'case-profee-statuses.html': 'images/statuses/transfer-screen-main.png',
      'case-profee-cards.html': 'images/cards/flow/02.jpg',
      'design-system/': 'images/ds/figma-bottom-sheet.png',
      'case-sber-spasibo.html': 'images/sber/app-game-play.png'
    };
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        row.classList.remove('mv-redraw'); void row.offsetWidth; row.classList.add('mv-redraw');
      });
    });
    if (!fine || innerWidth < 900) return;
    var peek = document.createElement('div'); peek.className = 'mv-peek'; peek.setAttribute('aria-hidden', 'true');
    peek.innerHTML = '<div class="mv-peek-frame"><img alt=""></div>';
    document.body.appendChild(peek);
    var img = peek.querySelector('img'), p = { x: 0, y: 0, tx: 0, ty: 0, vx: 0 }, on = false;
    // Warm the cache so the first hover isn't empty
    Object.keys(PREVIEW).forEach(function (k) { var i = new Image(); i.src = PREVIEW[k]; });
    rows.forEach(function (row) {
      var key = (row.getAttribute('data-href-en') || row.getAttribute('href') || '').split('#')[0];
      var src = row.getAttribute('href').indexOf('#ai') >= 0 ? null : PREVIEW[key];
      row.addEventListener('mouseenter', function (e) {
        if (!src) return;
        img.src = src; peek.classList.toggle('is-wide', key === 'design-system/');
        p.x = p.tx = e.clientX; p.y = p.ty = e.clientY; on = true; peek.classList.add('is-on');
      });
      row.addEventListener('mouseleave', function () { on = false; peek.classList.remove('is-on'); });
    });
    addEventListener('pointermove', function (e) { p.tx = e.clientX; p.ty = e.clientY; }, { passive: true });
    addEventListener('scroll', function () { if (on) { on = false; peek.classList.remove('is-on'); } }, { passive: true });
    (function frame() {
      var dx = p.tx - p.x; p.x += dx * .18; p.y += (p.ty - p.y) * .18; p.vx += (dx - p.vx) * .2;
      var w = peek.offsetWidth, h = peek.offsetHeight;
      var x = clamp(p.x + 56, 8, innerWidth - w - 8), y = clamp(p.y - h * .7, 72, innerHeight - h - 8);
      peek.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      peek.firstChild.style.setProperty('--tilt', clamp(p.vx * .12, -8, 8).toFixed(2) + 'deg');
      requestAnimationFrame(frame);
    })();
  }

  /* 4 · case pages: reading progress; metrics count up when they come into view */
  function caseReading() {
    var sections = document.querySelectorAll('section.section');
    if (sections.length < 3) return;
    var bar = document.createElement('div'); bar.className = 'mv-read'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
    function upd() {
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--read', max > 0 ? clamp(scrollY / max, 0, 1).toFixed(4) : 0);
    }
    upd(); addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd);

    var nums = document.querySelectorAll('.metric-num');
    if (!nums.length || !('IntersectionObserver' in window)) return;
    // Every text node that starts a number: keep its prefix, separator, decimals and suffix
    function parts(el) {
      var out = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = walk.nextNode())) {
        var m = n.textContent.match(/^(\s*[^0-9\s]*)([0-9]+)(?:([.,])([0-9]+))?(.*)$/);
        if (!m || /[–-]\s*[0-9]/.test(m[5])) continue;          // ranges like 60–70% stay as they are
        out.push({ node: n, pre: m[1], val: parseFloat(m[2] + '.' + (m[4] || '0')), sep: m[3] || '', dec: (m[4] || '').length, post: m[5], text: n.textContent });
      }
      return out;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var ps = parts(e.target); if (!ps.length) return;
        var t0 = performance.now();
        (function step(now) {
          var t = Math.min(1, (now - t0) / 1100), k = 1 - Math.pow(1 - t, 3);
          ps.forEach(function (q) {
            var v = (q.val * k).toFixed(q.dec);
            q.node.textContent = t >= 1 ? q.text : q.pre + (q.sep ? v.replace('.', q.sep) : v) + q.post;
          });
          if (t < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* 5 · screen rows slide in a little as they arrive */
  function screenRows() {
    var rows = document.querySelectorAll('.screens-row');
    if (!rows.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('mv-pending'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    rows.forEach(function (r) {
      if (r.getBoundingClientRect().top < innerHeight) return;   // already on screen: leave it
      r.classList.add('mv-pending'); io.observe(r);
    });
  }
})();
