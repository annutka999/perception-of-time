window.T && window.T.mods.push('graphics');
/* Палитра из CSS и циферблат бессонной ночи. Рисуется только при прокрутке (без собственной анимации). */
(function () {
  var T = window.T, cl = T.cl, $ = function (s) { return document.querySelector(s); };
  // Если стили ещё не успели загрузиться, берутся запасные значения; после полной загрузки палитра перечитывается.
  var DEF = { '--paper': [239, 237, 230], '--ink': [14, 14, 13], '--hot': [255, 79, 26] };
  T.pal = function () {
    var cs = getComputedStyle(document.documentElement), ok = true, hx = function (n) { var v = cs.getPropertyValue(n).trim(); if (!/^#[0-9a-f]{6}$/i.test(v)) { ok = false; return DEF[n]; } return [1, 3, 5].map(function (i) { return parseInt(v.slice(i, i + 2), 16); }); };
    T.P = { paper: hx('--paper'), ink: hx('--ink'), blue: hx('--ink'), hi: hx('--hot'), lt: hx('--paper') }; T.palOk = ok;
  };
  T.pal();
  var rgba = function (a, al) { return 'rgba(' + a.join(',') + ',' + al + ')'; };
  var nc = $('#nc'), nx = nc.getContext('2d') || new Proxy({}, { get: function () { return function () {}; }, set: function () { return true; } }), lastA = '', lastB = '';
  function rs() { var d = Math.min(devicePixelRatio || 1, 2); nc.width = nc.clientWidth * d; nc.height = nc.clientHeight * d; nx.setTransform(d, 0, 0, d, 0, 0); }
  var hm = function (m) { return T.pad(Math.floor(m / 60) % 24) + ':' + T.pad(m % 60); };
  var ang = function (m) { return m / 720 * 6.2832 - 1.5708; };
  function dial(cx, cy, R) {
    var L = T.P.paper; nx.strokeStyle = rgba(L, .9); nx.fillStyle = rgba(L, .85); nx.lineWidth = 1.3;
    for (var i = 0; i < 60; i++) { var a = i * Math.PI / 30, l = i % 5 ? R * .035 : R * .09; nx.beginPath(); nx.moveTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); nx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); nx.stroke(); }
    nx.font = '500 ' + Math.max(12, R * .1) + 'px "Inter",Arial,sans-serif'; nx.textAlign = 'center'; nx.textBaseline = 'middle';
    for (var k = 1; k <= 12; k++) { var b = k * Math.PI / 6 - Math.PI / 2; nx.fillText(k, cx + Math.cos(b) * R * .8, cy + Math.sin(b) * R * .8); }
  }
  // p — доля ночи от 0 до 1: светлая дуга = по часам, синяя = как ощущалось (схема: сначала отстаёт, потом догоняет)
  T.ni = -1;
  T.night = function (p) {
    var P = T.P, m = 17 + p * 345, mf = 17 + (p - .14 * Math.sin(6.2832 * p)) * 345;
    var cw = nc.clientWidth, ch = nc.clientHeight, cx = cw / 2, cy = ch / 2, R = Math.min(cw, ch) * .34;
    nx.clearRect(0, 0, cw, ch); nx.lineWidth = 1.4; nx.strokeStyle = rgba(P.paper, .9); nx.beginPath(); nx.arc(cx, cy, R, 0, 7); nx.stroke(); dial(cx, cy, R);
    nx.lineCap = 'round'; nx.lineWidth = 6; nx.strokeStyle = rgba(P.paper, .12); nx.beginPath(); nx.arc(cx, cy, R * 1.17, ang(17), ang(362)); nx.stroke();
    nx.lineWidth = 5; nx.strokeStyle = rgba(P.paper, .95); nx.beginPath(); nx.arc(cx, cy, R * 1.17, ang(17), ang(m)); nx.stroke();
    nx.setLineDash([1, 11]); nx.lineWidth = 6; nx.strokeStyle = rgba(P.paper, 1); nx.beginPath(); nx.arc(cx, cy, R * 1.27, ang(17), ang(mf)); nx.stroke(); nx.setLineDash([]);
    var minA = (m % 60) / 60 * 6.2832 - 1.5708; nx.strokeStyle = rgba(P.paper, .95); nx.lineWidth = 4; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(ang(m)) * R * .5, cy + Math.sin(ang(m)) * R * .5); nx.stroke();
    nx.lineWidth = 2; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(minA) * R * .86, cy + Math.sin(minA) * R * .86); nx.stroke();
    nx.fillStyle = rgba(P.paper, 1); nx.beginPath(); nx.arc(cx + Math.cos(ang(mf)) * R * 1.27, cy + Math.sin(ang(mf)) * R * 1.27, 6, 0, 7); nx.fill();
    var A = hm(m), B = hm(mf); if (A !== lastA) { lastA = A; $('#nrr').textContent = A; } if (B !== lastB) { lastB = B; $('#nrf').textContent = B; }
    // реплика момента и отметки пробуждений; в режиме без закрепления все реплики видны списком
    var i = 0; T.NIGHT.forEach(function (n, j) { if (p * 345 >= n[1] - .5) i = j; });
    if (i !== T.ni) { T.ni = i; T.type($('#nq'), T.NIGHT[i][2], 32); Array.prototype.forEach.call($('#n5').children, function (li, j) { li.classList.toggle('on', j === i); }); }
  };
  // печать текста: используется там, где речь появляется «в моменте» (реплики ночи, подписи масштаба, окно таймера)
  T.type = function (el, text, ms) {
    if (el._tm) clearInterval(el._tm);
    if (matchMedia('(prefers-reduced-motion:reduce)').matches || !ms) { el.textContent = text; return; }
    el.innerHTML = '<span class="sr"></span><span class="ty" aria-hidden="true"></span>'; el.firstChild.textContent = text;
    var ty = el.lastChild, i = 0; el._tm = setInterval(function () { i++; ty.textContent = text.slice(0, i); if (i >= text.length) clearInterval(el._tm); }, ms);
  };
  addEventListener('resize', function () { rs(); if (T.onScroll) T.onScroll(); }); rs();
  addEventListener('load', function () { T.pal(); rs(); if (T.onScroll) T.onScroll(); });
})();
