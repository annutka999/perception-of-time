window.T && window.T.mods.push('cursor');
/* Курсор: точка (как точка данных на шкалах) и кольцо над тем, что можно нажать. Только для мыши; на телефоне и при работе с клавиатуры ничего не меняется.
   Цвет подбирается под светлый и тёмный фон сам (mix-blend-mode). Убрать: удалите этот файл и его строку в index.html. */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var c = document.createElement('div'); c.id = 'cur'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
  var sel = 'a,button,input,select,textarea,label,[role=button],.yr';
  addEventListener('mousemove', function (e) {
    document.documentElement.classList.add('hascur'); c.classList.add('on');
    c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    c.classList.toggle('act', !!(e.target.closest && e.target.closest(sel)));
  }, { passive: true });
  document.addEventListener('mouseleave', function () { c.classList.remove('on'); });
  document.addEventListener('mouseenter', function () { c.classList.add('on'); });
  addEventListener('mousedown', function () { c.classList.add('press'); });
  addEventListener('mouseup', function () { c.classList.remove('press'); });
})();
