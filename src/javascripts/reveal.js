window.T && window.T.mods.push('reveal');
/* Появление текста.
   Заголовок страницы поднимается по буквам; заголовки зон и вопросы — по словам.
   */
(function () {
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function eachText(el, fn) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var f = document.createDocumentFragment();
      n.textContent.split(/([ \t\r\n]+)/).forEach(function (t) { if (!t) return; if (/^[ \t\r\n]+$/.test(t)) f.appendChild(document.createTextNode(' ')); else f.appendChild(fn(t)); });
      n.parentNode.replaceChild(f, n);
    });
  }
  function words(el) {
    var i = 0; el.classList.add('sp-w');
    eachText(el, function (t) { var w = document.createElement('span'), s = document.createElement('i'); w.className = 'wd'; s.style.setProperty('--i', i++); s.textContent = t; w.appendChild(s); return w; });
  }
  // заголовки зон и фразы-речь появляются по словам; все остаются читаемыми
  $$('h2.f, .q.f').forEach(function (el) {
    words(el);
    // фразы вне шагов финала появляются вместе с прокруткой: слова проявляются, пока фраза поднимается по экрану
    if (!el.closest('.fs')) { el.classList.add('scrub'); el._wd = Array.prototype.slice.call(el.querySelectorAll('.wd i')); (window.T.speech = window.T.speech || []).push(el); }
  });
  $$('.hero h1 span').forEach(function (sp, j) { sp.innerHTML = sp.textContent.split('').map(function (c, i) { return '<i style="animation-delay:' + (.2 + j * .35 + i * .06).toFixed(2) + 's">' + c + '</i>'; }).join(''); });
  // поворот: слова абзаца (кроме опорных) тают по мере прокрутки; управляет scroll.js
  var tp = document.getElementById('turnp');
  if (tp) { eachText(tp, function (t) { var s = document.createElement('span'); s.className = 'fw'; s.textContent = t; return s; }); window.T.turnWords = Array.prototype.slice.call(tp.querySelectorAll('.fw')); }
})();
