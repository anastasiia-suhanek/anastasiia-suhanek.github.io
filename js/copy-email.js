/* Email links copy the address instead of opening a mail app; a short toast confirms it.
   The link stays mailto: so it still works without JS, and Cmd/Ctrl-click opens the mail app as before */
(function () {
  'use strict';

  var toast, timer;
  function show(text) {
    if (!toast) {
      toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('style', [
        'position:fixed', 'left:50%', 'bottom:32px', 'z-index:10000',
        'display:flex', 'align-items:center', 'gap:12px', 'padding:12px 20px', 'border-radius:999px',
        'background:#0B0B0B', 'color:#fff', 'border:1px solid rgba(255,255,255,.16)',
        'box-shadow:0 16px 48px -12px rgba(0,0,0,.5)',
        "font:500 16px/24px 'Inter',system-ui,sans-serif", 'width:max-content', 'max-width:calc(100vw - 32px)', 'text-align:left',
        'pointer-events:none', 'opacity:0', 'transform:translate(-50%,16px)',
        'transition:opacity .3s,transform .5s cubic-bezier(.16,1,.3,1)'
      ].join(';'));
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span style="display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#D2FF5C;color:#0B0B0B;font-size:12px;line-height:1" aria-hidden="true">✓</span>';
    toast.appendChild(document.createTextNode(text));
    // Restart the entrance on repeated clicks
    toast.style.opacity = '0'; toast.style.transform = 'translate(-50%,16px)';
    void toast.offsetWidth;
    toast.style.opacity = '1'; toast.style.transform = 'translate(-50%,0)';
    clearTimeout(timer);
    timer = setTimeout(function () { toast.style.opacity = '0'; toast.style.transform = 'translate(-50%,16px)'; }, 2400);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    // Older browsers and in-app webviews without the Clipboard API
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      ta.remove(); ok ? resolve() : reject();
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var email = decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);
    var ru = document.documentElement.lang === 'ru';
    e.preventDefault();
    copy(email).then(function () {
      show((ru ? 'Почта скопирована · ' : 'Email copied · ') + email);
    }, function () {
      // Copy refused (rare): fall back to the mail app
      location.href = a.href;
    });
  });

  // Hover hint, in the page language
  function hint() {
    var ru = document.documentElement.lang === 'ru';
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { a.title = ru ? 'Скопировать адрес' : 'Copy email address'; });
  }
  hint();
  new MutationObserver(hint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
