(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var isHome = page === 'index.html' || page === '';

  var workHref    = isHome ? '#work'    : 'index.html#work';
  var contactHref = isHome ? '#contact' : 'index.html#contact';
  var nameHref    = isHome ? '#'        : 'index.html';

  // Segmented glass nav: the current page is the raised segment
  var links = [
    { href: workHref,       en: 'Cases',          ru: 'Кейсы',     active: isHome },
    { href: 'about.html',   en: 'About',          ru: 'Обо мне',   active: page === 'about.html' },
    { href: 'anastasiia-cv.html', en: 'CV', ru: 'CV', active: page === 'anastasiia-cv.html' },
  ];

  function navLink(l) {
    var cls   = 'nav-seg' + (l.active ? ' active' : '');
    var cur   = l.active ? ' aria-current="page"' : '';
    var ext   = l.external ? ' target="_blank" rel="noopener"' : '';
    var label = l.en === l.ru
      ? l.en
      : '<span class="t-en">' + l.en + '</span><span class="t-ru">' + l.ru + '</span>';
    return '<a class="' + cls + '" href="' + l.href + '"' + cur + ext + '>' + label + '</a>';
  }

  var langToggle =
    '<div class="lang-toggle">' +
      '<button class="lang-btn" data-lang="en" onclick="setLang(\'en\')">EN</button>' +
      '<button class="lang-btn" data-lang="ru" onclick="setLang(\'ru\')">RU</button>' +
    '</div>';

  var cta = '<span class="t-en">Get in touch</span><span class="t-ru">Написать</span>';

  var html =
    '<div class="nav-inner">' +
      '<a class="nav-name" href="' + nameHref + '">Anastasiia Sukhanek</a>' +
      '<div class="nav-links">' +
        links.map(navLink).join('') +
        '<a class="nav-seg nav-seg--cta" href="' + contactHref + '">' + cta + '</a>' +
        '<div class="nav-sheet-lang">' + langToggle + '</div>' +
      '</div>' +
      '<div class="nav-actions">' +
        '<a class="nav-cta" href="' + contactHref + '">' + cta + '</a>' +
        langToggle +
        '<button class="nav-hamburger" aria-label="Menu" onclick="toggleNav()">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</div>';

  var nav = document.getElementById('main-nav');
  if (nav) nav.innerHTML = html;
})();
