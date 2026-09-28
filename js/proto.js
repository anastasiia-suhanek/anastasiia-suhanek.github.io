/* Live prototype player. Stacks screen images inside .proto and plays a scripted interaction
   the way the app would: the status bar and tab bar stay put while content pushes, buttons
   show a pressed state, sheets slide up, an amount is typed digit by digit.
   Page defines window.protoScripts = { [elementId]: { base, screens, tabbar, steps } } */
(function () {
  'use strict';
  if (!window.protoScripts) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IOS = 'cubic-bezier(.22,.82,.18,1)';  // UIKit-like: quick start, long soft landing
  var SHEET = 'cubic-bezier(.2,.9,.25,1)';  // sheets: a touch more spring
  var STATUS = 6.2;                          // % of height taken by the status bar
  var TABBAR = 12;                           // % of height taken by the floating tab bar

  function el(tag, cls, parent) { var n = document.createElement(tag); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  // Animate, write the final keyframe into inline styles, cancel – so fill:forwards never
  // overrides what show() sets later.
  function anim(node, frames, ms, ease, keep) {
    var a = node.animate(frames, { duration: ms, easing: ease || IOS, fill: 'forwards' });
    return a.finished.then(function () {
      if (keep !== false) { var last = frames[frames.length - 1]; Object.keys(last).forEach(function (k) { if (k !== 'offset') node.style[k] = last[k]; }); }
      a.cancel();
    });
  }
  function clipContent(top, bottom) { return 'inset(' + top + '% 0 ' + bottom + '% 0)'; }

  function Player(root, cfg) {
    var self = this;
    this.root = root; this.cfg = cfg; this.layers = {}; this.running = false; this.visible = true; this.sheet = null;
    this.tabbar = {}; (cfg.tabbar || []).forEach(function (n) { self.tabbar[n] = true; });
    cfg.screens.forEach(function (name) {
      var img = el('img', 'proto-screen', root); img.src = cfg.base + name + '.jpg'; img.alt = ''; img.draggable = false; self.layers[name] = img;
    });
    this.dim = el('div', 'proto-dim', root);
    this.chromeTop = el('img', 'proto-screen proto-chrome', root);   // incoming status bar, fixed
    this.chromeBot = el('img', 'proto-screen proto-chrome', root);   // incoming tab bar, fixed
    this.press = el('div', 'proto-press', root);
    this.tapEl = el('div', 'proto-tap', root);
    this.covers = [el('div', 'proto-cover', root), el('div', 'proto-cover', root)];
    this.hotLayer = el('div', 'proto-hotspots', root);
    this.current = null; this.mode = 'auto'; this.busy = false;
    this.graph = this.buildGraph(cfg);
    this.hint = cfg.hint ? document.getElementById(cfg.hint) : null;
    root.addEventListener('pointerdown', function (e) {
      if (self.mode === 'auto' && !e.target.classList.contains('proto-hot')) self.setMode('manual');
    });
    if (this.hint) this.hint.addEventListener('click', function () { self.setMode(self.mode === 'auto' ? 'manual' : 'auto'); });
  }

  // Which step starts on which screen – so the visitor can drive the same script by hand
  Player.prototype.buildGraph = function (cfg) {
    var g = {}, cur = cfg.start || cfg.screens[0];
    function target(s) { return s.push || s.pop || s.dissolve || s.sheet || s.sheetSwap || s.sheetDown || (s.type && s.type.to) || null; }
    cfg.steps.forEach(function (s, i) {
      if (s.reset) return;
      var box = s.press || [s.tap[0] - 9, s.tap[1] - 4, 18, 8];
      (g[cur] = g[cur] || {}); g[cur].hot = g[cur].hot || []; g[cur].hot.push({ box: box, step: s });
      cur = target(s);
    });
    Object.keys(cfg.extra || {}).forEach(function (scr) {
      (g[scr] = g[scr] || {}); g[scr].hot = g[scr].hot || [];
      cfg.extra[scr].forEach(function (h) { g[scr].hot.push({ box: h.box, step: h.step }); });
    });
    return g;
  };

  Player.prototype.setMode = function (mode) {
    this.mode = mode; this.root.classList.toggle('is-manual', mode === 'manual');
    if (this.hint) this.hint.classList.toggle('is-manual', mode === 'manual');
    if (mode === 'manual') { this.running = false; this.renderHotspots(); }
    else { this.clearHotspots(); this.run(); }
  };

  Player.prototype.clearHotspots = function () { this.hotLayer.innerHTML = ''; };

  Player.prototype.renderHotspots = function () {
    var self = this; this.clearHotspots();
    if (this.mode !== 'manual' || this.busy) return;
    var node = this.graph[this.current]; if (!node || !node.hot) return;
    node.hot.forEach(function (h) {
      var b = el('button', 'proto-hot', self.hotLayer); b.type = 'button';
      b.setAttribute('aria-label', (h.step.label && h.step.label.en) || 'Tap');
      b.style.left = h.box[0] + '%'; b.style.top = h.box[1] + '%'; b.style.width = h.box[2] + '%'; b.style.height = h.box[3] + '%';
      if (h.box[3] > 10) b.classList.add('proto-hot--row');
      if (h.step.label) {
        var lab = el('span', 'proto-label' + (h.box[1] < 18 ? ' proto-label--below' : ''), b);
        lab.innerHTML = '<span class="t-en">' + h.step.label.en + '</span><span class="t-ru">' + h.step.label.ru + '</span>';
      }
      b.addEventListener('click', function (e) { e.stopPropagation(); self.perform(h.step); });
    });
  };

  // Run one scripted step by hand (tap ring + press + transition), then type if the new screen asks for it
  Player.prototype.perform = async function (s) {
    if (this.busy) return; this.busy = true; this.clearHotspots();
    await this.doStep(s, true);
    this.busy = false; this.renderHotspots();
  };

  Player.prototype.show = function (name) {
    var self = this;
    Object.keys(this.layers).forEach(function (k) {
      var L = self.layers[k]; L.style.opacity = k === name ? 1 : 0; L.style.transform = 'none'; L.style.clipPath = 'none'; L.style.zIndex = k === name ? 2 : 1;
    });
    this.dim.style.opacity = 0; this.chromeTop.style.opacity = 0; this.chromeBot.style.opacity = 0;
    this.covers.forEach(function (c) { c.style.opacity = 0; });
    this.current = name;
  };

  Player.prototype.tap = function (x, y) {
    var t = this.tapEl; t.style.left = x + '%'; t.style.top = y + '%';
    return anim(t, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.4)' },
                    { opacity: .9, transform: 'translate(-50%,-50%) scale(1)', offset: .35 },
                    { opacity: 0, transform: 'translate(-50%,-50%) scale(1.5)' }], 520, 'cubic-bezier(.2,.7,.3,1)', false);
  };

  // Pressed state on a button: [x, y, w, h] in %
  Player.prototype.pressBtn = async function (box) {
    var p = this.press; p.style.left = box[0] + '%'; p.style.top = box[1] + '%'; p.style.width = box[2] + '%'; p.style.height = box[3] + '%';
    p.style.zIndex = 8;
    await anim(p, [{ opacity: 0 }, { opacity: 1 }], 60, 'ease-out');
    await wait(90);
    await anim(p, [{ opacity: 1 }, { opacity: 0 }], 200, 'ease-out');
  };

  // Navigation push/pop: content slides, status bar (and tab bar, if both screens have it) stays
  Player.prototype.push = async function (next, back) {
    var cur = this.layers[this.current], nxt = this.layers[next];
    var keepTab = this.tabbar[this.current] && this.tabbar[next];
    var clip = clipContent(STATUS, keepTab ? TABBAR : 0);
    // fixed chrome from the incoming screen
    this.chromeTop.src = nxt.src; this.chromeTop.style.clipPath = 'inset(0 0 ' + (100 - STATUS) + '% 0)'; this.chromeTop.style.zIndex = 6;
    if (keepTab) { this.chromeBot.src = nxt.src; this.chromeBot.style.clipPath = 'inset(' + (100 - TABBAR) + '% 0 0 0)'; this.chromeBot.style.zIndex = 6; }
    cur.style.clipPath = clip; nxt.style.clipPath = clip;
    var from = back ? '-100%' : '100%', to = back ? '30%' : '-30%';
    nxt.style.opacity = 1; nxt.style.zIndex = 4; nxt.style.transform = 'translateX(' + from + ')';
    nxt.style.boxShadow = back ? '14px 0 32px rgba(0,0,0,.16)' : '-14px 0 32px rgba(0,0,0,.16)';
    this.chromeTop.style.opacity = 1; if (keepTab) this.chromeBot.style.opacity = 1;
    this.dim.style.zIndex = 3; this.dim.style.clipPath = clip; this.dim.style.opacity = 0;
    var jobs = [
      anim(nxt, [{ transform: 'translateX(' + from + ')' }, { transform: 'translateX(0)' }], 560),
      anim(cur, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + to + ')' }], 560),
      anim(this.dim, [{ opacity: 0 }, { opacity: .22 }], 560)
    ];
    await Promise.all(jobs);
    nxt.style.boxShadow = 'none';
    this.dim.style.clipPath = 'none';
    this.show(next);
  };

  Player.prototype.dissolve = async function (next, scale) {
    var nxt = this.layers[next]; nxt.style.zIndex = 4; nxt.style.clipPath = 'none';
    nxt.style.transform = scale ? 'scale(.985)' : 'none';
    await anim(nxt, [{ opacity: 0, transform: nxt.style.transform }, { opacity: 1, transform: 'none' }], scale ? 420 : 340, IOS);
    this.show(next);
  };

  Player.prototype.sheetUp = async function (next, top) {
    var nxt = this.layers[next]; nxt.style.zIndex = 4; nxt.style.transform = 'translateY(100%)'; nxt.style.opacity = 1;
    nxt.style.clipPath = 'inset(' + top + '% 0 0 0 round 24px 24px 0 0)';
    this.dim.style.zIndex = 3;
    await Promise.all([
      anim(nxt, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], 520, SHEET),
      anim(this.dim, [{ opacity: 0 }, { opacity: .42 }], 520, SHEET)
    ]);
    this.sheet = { name: next, top: top }; this.current = next;
  };

  Player.prototype.sheetSwap = async function (next) {
    var cur = this.layers[this.current], nxt = this.layers[next], top = this.sheet.top;
    nxt.style.zIndex = 5; nxt.style.transform = 'none'; nxt.style.clipPath = 'inset(' + top + '% 0 0 0 round 24px 24px 0 0)';
    await anim(nxt, [{ opacity: 0 }, { opacity: 1 }], 300, 'ease-out');
    cur.style.opacity = 0; nxt.style.zIndex = 4; this.sheet.name = next; this.current = next;
  };

  Player.prototype.sheetDown = async function (base) {
    var sh = this.layers[this.sheet.name];
    await Promise.all([
      anim(sh, [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], 420, 'cubic-bezier(.4,0,.8,.4)'),
      anim(this.dim, [{ opacity: .42 }, { opacity: 0 }], 420, 'ease-out')
    ]);
    this.sheet = null; this.show(base);
  };

  // Enter the amount: after a tap on the field the filled screen simply appears – a quick fade,
  // like the value being pasted in. Keys are not simulated.
  Player.prototype.typeReveal = async function (t) {
    var nxt = this.layers[t.to];
    nxt.style.zIndex = 5; nxt.style.transform = 'none'; nxt.style.clipPath = 'none';
    await anim(nxt, [{ opacity: 0 }, { opacity: 1 }], 160, 'ease-out');
    this.show(t.to);
  };

  Player.prototype.doStep = async function (s, manual) {
    if (!manual && s.hold) await wait(s.hold);
    // Autoplay shows where the finger lands; a real click needs no ring and only a quick press flash
    if (s.tap && !manual) await this.tap(s.tap[0], s.tap[1]);
    if (s.type) { if (!manual) await wait(60); await this.typeReveal(s.type); return; }
    if (s.tap && !manual) await wait(60);
    if (s.push) await this.push(s.push, false);
    else if (s.pop) await this.push(s.pop, true);
    else if (s.dissolve) await this.dissolve(s.dissolve, s.scale);
    else if (s.sheet) await this.sheetUp(s.sheet, s.top);
    else if (s.sheetSwap) await this.sheetSwap(s.sheetSwap);
    else if (s.sheetDown) await this.sheetDown(s.sheetDown);
    else if (s.reset) { await anim(this.root, [{ opacity: 1 }, { opacity: 0 }], 520, 'ease-in-out'); this.show(s.reset); await anim(this.root, [{ opacity: 0 }, { opacity: 1 }], 520, 'ease-out'); }
  };

  Player.prototype.run = async function () {
    if (this.running) return; this.running = true;
    var steps = this.cfg.steps;
    while (this.running) {
      for (var i = 0; i < steps.length && this.running; i++) {
        while (!this.visible && this.running) await wait(300);
        if (!this.running) break;
        this.busy = true; await this.doStep(steps[i], false); this.busy = false;
      }
    }
    this.renderHotspots();
  };

  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(window.protoScripts).forEach(function (id) {
      var root = document.getElementById(id); if (!root) return;
      var cfg = window.protoScripts[id]; var p = new Player(root, cfg);
      p.show(cfg.start || cfg.screens[0]);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { p.visible = e.isIntersecting; }); }, { threshold: .2 }).observe(root);
      }
      var imgs = Object.keys(p.layers).map(function (k) { return p.layers[k]; });
      Promise.all(imgs.map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); })).then(function () {
        if (cfg.autoplay && !reduce) p.run(); else p.setMode('manual');   // default: hands-on, no autoplay
      });
    });
  });
})();
