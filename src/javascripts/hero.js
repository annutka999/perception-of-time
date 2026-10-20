window.T && window.T.mods.push('hero');
/* Линейка заставки: отметки приподнимаются под курсором (только высота, положение отметок не меняется). */
(function () {
  var hr = document.getElementById('hr'); if (!hr) return;
  var px = null, raf = 0;
  function draw() {
    raf = 0; var t = hr.querySelectorAll('i'), n = t.length - 1, r = hr.getBoundingClientRect();
    for (var i = 0; i <= n; i++) {
      var s = 1; if (px !== null) { var d = (r.left + i / n * r.width) - px; s = 1 + 1.5 * Math.exp(-(d * d) / (2 * 60 * 60)); }
      t[i].style.transform = s > 1.03 ? 'scaleY(' + s.toFixed(2) + ')' : '';
    }
  }
  function move(e) { var r = hr.getBoundingClientRect(); px = (e.clientY > r.top - 110 && e.clientY < r.bottom + 90) ? e.clientX : null; if (!raf) raf = requestAnimationFrame(draw); }
  addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', function () { px = null; if (!raf) raf = requestAnimationFrame(draw); });
})();
