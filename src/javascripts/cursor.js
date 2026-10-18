window.T && window.T.mods.push('cursor');
/* Курсор: кольцо, увеличивается над кнопками; клик посылает круг. Ничего не оставляет за собой. */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.body.classList.add('cc');
  var cu = document.querySelector('#cur'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; });
  addEventListener('pointerdown', function (e) { var r = document.createElement('i'); r.className = 'rp'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(function () { r.remove(); }, 1300); });
  document.addEventListener('pointerover', function (e) { cu.classList.toggle('h', !!e.target.closest('a,button,input')); });
  (function C() { cx += (mx - cx) * .22; cy += (my - cy) * .22; cu.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(C); })();
})();
