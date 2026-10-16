/* Курсор: стрелка вращается быстрее, когда вы двигаете мышь; клик посылает круг */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.body.classList.add('cc');
  var cu = document.querySelector('#cur'), hand = cu.firstElementChild, mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, ang = 0;
  addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; });
  addEventListener('pointerdown', function (e) { var r = document.createElement('i'); r.className = 'rp'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(function () { r.remove(); }, 1300); });
  document.addEventListener('pointerover', function (e) { cu.classList.toggle('h', !!e.target.closest('a,button,input')); });
  (function C() { var dx = mx - cx, dy = my - cy; cx += dx * .2; cy += dy * .2; ang += .05 + Math.hypot(dx, dy) * .06; cu.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; hand.style.transform = 'rotate(' + ang + 'rad)'; requestAnimationFrame(C); })();
})();
