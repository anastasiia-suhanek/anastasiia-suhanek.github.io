/* Site analytics on GoatCounter: cookieless, no personal data, so no consent banner. Only dist/ gets it:
   build.py adds js/count.js (vendored tracker, with no_onload + no_events) and then this file to every page,
   so pageviews and every event are sent from one place. count.js skips localhost on its own.
   To leave your own visits out, open any page once with #toggle-goatcounter.

   Events, shown in GoatCounter next to the pages and marked «event»:
     click/<target>       outbound link: telegram, email, linkedin, github, behance, figma, design-system
     cv/<en|ru>           CV PDF opened
     lang/<en|ru>         language switched by hand (the automatic choice shows as the visitor's country)
     jump/results         «Jump to results» on a case
     read/<page>/<lang>   the Results section of a case reached
     end/<page>/<lang>    the end of the page reached
     proto/<id>           the live prototype touched
     zoom/<page>          a screen opened full size */
(function () {
  'use strict';
  var gc = window.goatcounter;
  if (!gc || !gc.count) return;

  function page() { return location.pathname.replace(/^\/|\.html$|\/$/g, '') || 'home'; }
  function lang() { return document.documentElement.lang === 'ru' ? 'ru' : 'en'; }
  function send(path) { gc.count({ event: true, path: path, title: path }); }

  // Pageview, titled in English whichever language the visitor reads – the title would otherwise flip with every visitor
  function view() {
    var t = document.querySelector('title');
    gc.count({ title: (t && t.getAttribute('data-en')) || document.title });
  }
  if (!('visibilityState' in document) || document.visibilityState === 'visible') view();
  else document.addEventListener('visibilitychange', function f() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', f);
    view();
  });

  // Where an outbound link goes, by its href
  function target(a) {
    var href = a.getAttribute('href') || '';
    if (/^mailto:/.test(href)) return 'click/email';
    if (/\.pdf([?#]|$)/.test(href)) return 'cv/' + (/-ru\.pdf/.test(href) ? 'ru' : 'en');
    if (/(^|\/)design-system\//.test(href)) return 'click/design-system';
    var m = href.match(/^https?:\/\/(?:www\.)?([^/:]+)/);
    if (!m || m[1] === location.hostname) return null;
    if (m[1] === 't.me') return 'click/telegram';
    return 'click/' + m[1].replace(/\.(com|net|org|io)$/, '');
  }

  var once = {};
  function first(key, path) { if (!once[key]) { once[key] = true; send(path); } }

  function onClick(e) {
    var el = e.target.closest ? e.target.closest('a, button, .is-zoomable') : null;
    if (!el) return;
    if (el.classList.contains('lang-btn')) {
      if (el.dataset.lang && el.dataset.lang !== lang()) send('lang/' + el.dataset.lang);
    } else if (el.classList.contains('eyebrow-jump')) {
      send('jump/results');
    } else if (el.hasAttribute('data-lightbox') || el.classList.contains('is-zoomable')) {
      first('zoom', 'zoom/' + page());
    } else if (el.tagName === 'A') {
      var t = target(el);
      if (t) send(t);
    }
  }
  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', function (e) { if (e.button === 1) onClick(e); }, true);

  // The prototype on the Cards case: the first touch per player
  document.addEventListener('pointerdown', function (e) {
    var p = e.target.closest && e.target.closest('.proto');
    if (p) first('proto:' + (p.id || ''), 'proto/' + (p.id || page()));
  }, true);

  // Reading milestones: the Results section of a case, and the end of any page
  function results() {
    var el = document.getElementById('results');
    if (!el) {
      var label = Array.prototype.find.call(document.querySelectorAll('.section-label.t-en'), function (l) {
        return l.textContent.trim() === 'Results';
      });
      el = label && label.closest('section');
    }
    if (!el || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (x) { return x.isIntersecting; })) return;
      io.disconnect();
      send('read/' + page() + '/' + lang());
    }, { threshold: 0.1 });
    io.observe(el);
  }
  function end() {
    var h = document.documentElement;
    if (window.innerHeight + window.scrollY < h.scrollHeight - 240) return;
    window.removeEventListener('scroll', end);
    send('end/' + page() + '/' + lang());
  }
  window.addEventListener('scroll', end, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', results);
  else results();
})();
