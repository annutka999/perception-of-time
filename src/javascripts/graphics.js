/* Графика: палитра из CSS и экран бессонной ночи (циферблат с двумя дугами и маятник) */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); };
  // цвета читаются из CSS-переменных: смена --blue в style.css меняет и графику
  T.pal = function () {
    var cs = getComputedStyle(document.documentElement), hx = function (n) { var v = cs.getPropertyValue(n).trim(); return [1, 3, 5].map(function (i) { return parseInt(v.slice(i, i + 2), 16); }); };
    T.P = { paper: hx('--paper'), ink: hx('--ink'), blue: hx('--blue'), hi: hx('--blue-hi'), lt: hx('--blue-lt') };
  };
  T.pal();
  var rgba = function (a, al) { return 'rgba(' + a.join(',') + ',' + al + ')'; };

  function dial(x, cx, cy, R) {
    var L = T.P.paper; x.strokeStyle = rgba(L, .9); x.fillStyle = rgba(L, .85); x.lineWidth = 1.3;
    for (var i = 0; i < 60; i++) { var a = i * Math.PI / 30, l = i % 5 ? R * .035 : R * .09; x.beginPath(); x.moveTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.stroke(); }
    x.font = '400 ' + Math.max(11, R * .1) + 'px "Martian Mono",monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (var k = 1; k <= 12; k++) { var b = k * Math.PI / 6 - Math.PI / 2; x.fillText(k, cx + Math.cos(b) * R * .8, cy + Math.sin(b) * R * .8); }
  }
  // след минутной стрелки в длинной выдержке
  function sweep(x, cx, cy, r, th, len, al) {
    var L = T.P.paper, g = x.createConicGradient(th - len, cx, cy), f = len / 6.2832;
    g.addColorStop(0, rgba(L, 0)); g.addColorStop(f, rgba(L, al)); g.addColorStop(Math.min(.9999, f + .0001), rgba(L, 0));
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  }
  var pc = $('#pc'), px = pc.getContext('2d'), nc = $('#nc'), nx = nc.getContext('2d');
  function rs() { var d = Math.min(devicePixelRatio || 1, 2); [[pc, px], [nc, nx]].forEach(function (p) { p[0].width = p[0].clientWidth * d; p[0].height = p[0].clientHeight * d; p[1].setTransform(d, 0, 0, d, 0, 0); }); px.fillStyle = rgba(T.P.ink, 1); px.fillRect(0, 0, pc.clientWidth, pc.clientHeight); }
  addEventListener('resize', rs); rs();
  var vo = new IntersectionObserver(function (es) { es.forEach(function (e) { T.vis[e.target.id] = e.isIntersecting; }); }); vo.observe($('#z2'));

  var ni = -1, lastA = '', lastB = '';
  var hm = function (m) { return T.pad(Math.floor(m / 60) % 24) + ':' + T.pad(m % 60); };
  var ang = function (m) { return m / 720 * 6.2832 - 1.5708; };
  function night(t) {
    var P = T.P, H = innerHeight, r = $('#z2').getBoundingClientRect(), p = cl(-r.top / (r.height - H) * 1.08);
    // маятник оставляет призрачные следы
    var w = pc.clientWidth, h = pc.clientHeight, ox = w * (w < 700 ? .86 : .9), Ln = h * .8, a = .6 * Math.sin(t * 1.2), bx = ox + Math.sin(a) * Ln, by = Math.cos(a) * Ln;
    px.fillStyle = rgba(P.ink, .07); px.fillRect(0, 0, w, h); px.strokeStyle = rgba(P.paper, .22); px.lineWidth = 1; px.beginPath(); px.moveTo(ox, 0); px.lineTo(bx, by); px.stroke();
    px.strokeStyle = rgba(P.paper, .5); px.fillStyle = rgba(P.ink, .6); px.beginPath(); px.arc(bx, by, 22, 0, 7); px.fill(); px.stroke(); px.beginPath(); px.moveTo(bx, by); px.lineTo(bx + Math.cos(t * 6) * 16, by + Math.sin(t * 6) * 16); px.stroke();
    // циферблат: светлая дуга = по часам, синяя = как ощущалось (иллюстрация: сначала отстаёт, потом догоняет)
    var m = 17 + p * 345, mf = 17 + (p - .14 * Math.sin(6.2832 * p)) * 345;
    var cw = nc.clientWidth, ch = nc.clientHeight, cx = cw / 2, cy = ch / 2, R = Math.min(cw, ch) * .34;
    nx.clearRect(0, 0, cw, ch);
    nx.fillStyle = rgba(P.paper, .04); nx.beginPath(); nx.arc(cx, cy, R, 0, 7); nx.fill();
    nx.lineWidth = 1.4; nx.strokeStyle = rgba(P.paper, .9); nx.beginPath(); nx.arc(cx, cy, R, 0, 7); nx.stroke();
    var minA = (m % 60) / 60 * 6.2832 - 1.5708; sweep(nx, cx, cy, R * .97, minA, 2.2, .35); dial(nx, cx, cy, R);
    nx.lineCap = 'round'; nx.lineWidth = 6; nx.strokeStyle = rgba(P.paper, .12); nx.beginPath(); nx.arc(cx, cy, R * 1.17, ang(17), ang(362)); nx.stroke();
    nx.lineWidth = 5; nx.strokeStyle = rgba(P.paper, .95); nx.beginPath(); nx.arc(cx, cy, R * 1.17, ang(17), ang(m)); nx.stroke();
    nx.strokeStyle = rgba(P.hi, 1); nx.beginPath(); nx.arc(cx, cy, R * 1.27, ang(17), ang(mf)); nx.stroke();
    nx.strokeStyle = rgba(P.paper, .95); nx.lineWidth = 4; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(ang(m)) * R * .5, cy + Math.sin(ang(m)) * R * .5); nx.stroke();
    nx.lineWidth = 2; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(minA) * R * .86, cy + Math.sin(minA) * R * .86); nx.stroke();
    nx.fillStyle = rgba(P.hi, 1); nx.beginPath(); nx.arc(cx + Math.cos(ang(mf)) * R * 1.27, cy + Math.sin(ang(mf)) * R * 1.27, 6, 0, 7); nx.fill();
    nx.fillStyle = rgba(P.paper, 1); nx.beginPath(); nx.arc(cx, cy, 4, 0, 7); nx.fill();
    var A = hm(m), B = hm(mf); if (A !== lastA) { lastA = A; $('#nrr').textContent = A; } if (B !== lastB) { lastB = B; $('#nrf').textContent = B; }
    var i = 0; T.NIGHT.forEach(function (n, j) { if (p * 345 >= n[1] - .5) i = j; });
    if (i !== ni) { ni = i; var q = $('#nq'); q.textContent = T.NIGHT[i][2]; q.classList.remove('sw'); void q.offsetWidth; q.classList.add('sw'); Array.prototype.forEach.call($('#n5').children, function (li, j) { li.classList.toggle('on', j === i); }); }
  }
  T.onFrame(function (dt, t) { if (T.vis.z2) night(t); });
  T.resetNight = rs;
})();
