(function () {
  if (!('IntersectionObserver' in window)) return;

  var SELECTORS = [
    'img',
    'video',
    '.metric-tile',
    '.case-card',
    '.outcome-item',
    '.flow-wrap',
    '.screen-row',
    '.screen-img',
    '.iteration',
    '.about-section',
    '.exp-item',
    '.core-item',
    '.beliefs-list li',
    '.gallery-strip',
    '.next-case',
    '.hero-eyebrow',
    '.hero h1',
    '.hero-desc',
    '.section-label',
    'h2',
    '.insight',
    '.todo',
    '.result-block',
    '.reflection-block',
    '.competitors',
  ].join(', ');

  var SKIP_INSIDE = ['.nav', '.hero', '.gallery-track', '.gallery-item'];

  function isSkipped(el) {
    if (SKIP_INSIDE.some(function (sel) { return el.closest(sel); })) return true;
    // Skip if already visible in viewport at load time
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Collect, mark, and observe elements
  var seen = new Set();
  document.querySelectorAll(SELECTORS).forEach(function (el) {
    if (seen.has(el) || isSkipped(el)) return;
    seen.add(el);

    // Stagger siblings of the same type within same parent
    var siblings = Array.from(el.parentElement.children).filter(function (s) {
      return s.classList[0] === el.classList[0];
    });
    var idx = siblings.indexOf(el);
    var delay = Math.min(idx * 80, 400);

    el.classList.add('sr-hidden');
    if (delay > 0) el.style.transitionDelay = delay + 'ms';
    observer.observe(el);
  });
})();
