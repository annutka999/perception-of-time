/* Содержание (право выхода и ориентация) и «пройти заново» */
(function () {
  var $ = function (s) { return document.querySelector(s); }, toc = $('#toc'), b = $('#tocb');
  function open(v) { toc.hidden = !v; b.setAttribute('aria-expanded', v); if (v) toc.querySelector('a').focus(); else b.focus(); }
  b.onclick = function () { open(toc.hidden); }; $('#tocx').onclick = function () { open(false); };
  toc.addEventListener('click', function (e) { if (e.target.closest('a')) toc.hidden = true, b.setAttribute('aria-expanded', false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !toc.hidden) open(false); });
  $('#again9').onclick = function () { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0); location.reload(); };
})();
