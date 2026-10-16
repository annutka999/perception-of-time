/* Общее состояние и один общий цикл анимации */
(function () {
  var T = window.T;
  T.cl = function (v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); };
  var pad = function (n) { return String(Math.floor(n)).padStart(2, '0'); };
  T.pad = pad;
  T.fmt = function (s) { return pad(s / 60) + ':' + pad(s % 60); };
  // active — активное время на странице: идёт, пока вкладка видна; останавливается ответом читателя в зоне 9
  T.S = { active: 0, frozen: null, dwell: {}, vel: 0, p: 0, zone: 1, maxZone: 1, ex: null, ex2: null };
  T.vis = {};
  var fns = []; T.onFrame = function (f) { fns.push(f); };
  var last = performance.now(), ly = window.scrollY;
  function loop(n) {
    var dt = Math.min(.25, (n - last) / 1000); last = n;
    if (document.visibilityState === 'visible' && T.S.frozen === null) T.S.active += dt;
    T.S.vel = T.S.vel * .9 + Math.abs(window.scrollY - ly) * .1; ly = window.scrollY;
    T.S.p = T.cl(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    for (var i = 0; i < fns.length; i++) fns[i](dt, n / 1000);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
