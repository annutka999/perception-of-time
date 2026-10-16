/* Графика: полутоновые «фото», заставка, ночь с циферблатом и маятником */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); }, L = '233,231,225';

  // Полутоновое «фото», собранное из мягких пятен света
  T.ht = function (c, seed, inv) {
    var w = c.width = 200, h = c.height = 160, g = c.getContext('2d'), s = 10, sw = w / s, sh = h / s, o = document.createElement('canvas');
    o.width = sw; o.height = sh; var q = o.getContext('2d'), r = seed * 9301 + 49297;
    var R = function () { return (r = (r * 9301 + 49297) % 233280) / 233280; };
    q.fillStyle = '#000'; q.fillRect(0, 0, sw, sh);
    for (var i = 0; i < 5; i++) { var x = R() * sw, y = R() * sh, rr = sh * (.25 + R() * .4), gr = q.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = gr; q.fillRect(0, 0, sw, sh); }
    var d = q.getImageData(0, 0, sw, sh).data; g.fillStyle = inv ? '#0b0b0b' : '#d3d1ca'; g.fillRect(0, 0, w, h); g.fillStyle = inv ? '#e9e7e1' : '#0b0b0b';
    for (var yy = 0; yy < sh; yy++) for (var xx = 0; xx < sw; xx++) { g.beginPath(); g.arc(xx * s + s / 2, yy * s + s / 2, d[(yy * sw + xx) * 4] / 255 * s * .58, 0, 7); g.fill(); }
  };

  // Циферблат: отметки и (по желанию) цифры
  function dial(x, cx, cy, R, num) {
    x.strokeStyle = 'rgba(' + L + ',.9)'; x.fillStyle = 'rgba(' + L + ',.85)'; x.lineWidth = 1.3;
    for (var i = 0; i < 60; i++) { var a = i * Math.PI / 30, l = i % 5 ? R * .035 : R * .09; x.beginPath(); x.moveTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.stroke(); }
    if (num) { x.font = '500 ' + Math.max(11, R * .1) + 'px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; for (var k = 1; k <= 12; k++) { var b = k * Math.PI / 6 - Math.PI / 2; x.fillText(k, cx + Math.cos(b) * R * .8, cy + Math.sin(b) * R * .8); } }
  }
  function sweep(x, cx, cy, r, th, len, al) {
    var g = x.createConicGradient(th - len, cx, cy), f = len / 6.2832; g.addColorStop(0, 'rgba(' + L + ',0)'); g.addColorStop(f, 'rgba(' + L + ',' + al + ')'); g.addColorStop(Math.min(.9999, f + .0001), 'rgba(' + L + ',0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  }
  var hc = $('#hc'), hx = hc.getContext('2d'), pc = $('#pc'), px = pc.getContext('2d'), nc = $('#nc'), nx = nc.getContext('2d');
  var S0 = []; for (var i = 0; i < 170; i++) S0.push([Math.random() * 6.283, Math.random(), .1 + Math.random() * .9]);
  function rs() { var d = Math.min(devicePixelRatio || 1, 2); [[hc, hx], [pc, px], [nc, nx]].forEach(function (p) { p[0].width = p[0].clientWidth * d; p[0].height = p[0].clientHeight * d; p[1].setTransform(d, 0, 0, d, 0, 0); }); px.fillStyle = '#0b0b0b'; px.fillRect(0, 0, pc.clientWidth, pc.clientHeight); }
  addEventListener('resize', rs); rs();
  var vo = new IntersectionObserver(function (es) { es.forEach(function (e) { T.vis[e.target.id] = e.isIntersecting; }); });
  vo.observe($('#z1')); vo.observe($('#z2'));

  // Заставка: туннель лучей, спираль и циферблат в длинной выдержке
  function hero(t) {
    var w = hc.clientWidth, h = hc.clientHeight, mob = w < 700, cx = mob ? w * .5 : w * .7, cy = mob ? h * .45 : h * .36, R = Math.min(w, h) * (mob ? .52 : .38), sp = 1 + S.vel * .12;
    hx.fillStyle = '#0b0b0b'; hx.fillRect(0, 0, w, h);
    S0.forEach(function (s) { s[1] = (s[1] + .0016 * s[2] * sp) % 1; var a = s[0] + window.scrollY * .0006, r1 = R * .35 + s[1] * w * .8, r2 = r1 + R * .18 * s[2] * (1 + S.vel * .35);
      hx.strokeStyle = 'rgba(' + L + ',' + (.04 + .32 * s[2] * (1 - s[1])) + ')'; hx.lineWidth = .5 + s[2] * 1.3; hx.beginPath(); hx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); hx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); hx.stroke(); });
    for (var k = 0; k < 280; k++) { var r = k * R * 1.8 / 280, a = k * .16 - t * .25; hx.fillStyle = 'rgba(' + L + ',' + (.75 * (1 - k / 280)) + ')'; hx.beginPath(); hx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .8, .7 + k / 280 * 1.8, 0, 7); hx.fill(); }
    var rr = R * .62, th = window.scrollY * .008 + t * .8 - 1.5708;
    hx.fillStyle = 'rgba(11,11,11,.62)'; hx.beginPath(); hx.arc(cx, cy, rr, 0, 7); hx.fill(); sweep(hx, cx, cy, rr, th, 1.9, .55);
    hx.strokeStyle = 'rgba(' + L + ',.9)'; hx.lineWidth = 1.4; hx.beginPath(); hx.arc(cx, cy, rr, 0, 7); hx.stroke(); dial(hx, cx, cy, rr, false);
    hx.lineWidth = 3; hx.beginPath(); hx.moveTo(cx, cy); hx.lineTo(cx + Math.cos(th / 12) * rr * .55, cy + Math.sin(th / 12) * rr * .55); hx.stroke();
    hx.strokeStyle = '#e8321a'; hx.lineWidth = 2; hx.beginPath(); hx.moveTo(cx - Math.cos(th) * rr * .15, cy - Math.sin(th) * rr * .15); hx.lineTo(cx + Math.cos(th) * rr * .95, cy + Math.sin(th) * rr * .95); hx.stroke();
    hc.style.filter = 'blur(' + Math.min(S.vel * .3, 7) + 'px)';
  }

  // Ночь: циферблат, где белая дуга — время по часам, красная — как оно ощущалось (схема)
  var ni = -1, lastA = '', lastB = '';
  var hm = function (m) { return T.pad(Math.floor(m / 60) % 24) + ':' + T.pad(m % 60); };
  var ang = function (m) { return m / 720 * 6.2832 - 1.5708; };
  function night(t) {
    var H = innerHeight, r = $('#z2').getBoundingClientRect(), p = cl(-r.top / (r.height - H) * 1.08);
    var w = pc.clientWidth, h = pc.clientHeight, ox = w * (w < 700 ? .86 : .9), Ln = h * .8, a = .6 * Math.sin(t * 1.2), bx = ox + Math.sin(a) * Ln, by = Math.cos(a) * Ln;
    px.fillStyle = 'rgba(11,11,11,.07)'; px.fillRect(0, 0, w, h); px.strokeStyle = 'rgba(' + L + ',.22)'; px.lineWidth = 1; px.beginPath(); px.moveTo(ox, 0); px.lineTo(bx, by); px.stroke();
    px.strokeStyle = 'rgba(' + L + ',.5)'; px.fillStyle = 'rgba(11,11,11,.6)'; px.beginPath(); px.arc(bx, by, 22, 0, 7); px.fill(); px.stroke(); px.beginPath(); px.moveTo(bx, by); px.lineTo(bx + Math.cos(t * 6) * 16, by + Math.sin(t * 6) * 16); px.stroke();

    var m = 17 + p * 345, mf = 17 + (p - .14 * Math.sin(6.2832 * p)) * 345;
    var cw = nc.clientWidth, ch = nc.clientHeight, cx = cw / 2, cy = ch / 2, R = Math.min(cw, ch) * .34;
    nx.clearRect(0, 0, cw, ch);
    nx.fillStyle = 'rgba(' + L + ',.04)'; nx.beginPath(); nx.arc(cx, cy, R, 0, 7); nx.fill();
    nx.lineWidth = 1.4; nx.strokeStyle = 'rgba(' + L + ',.9)'; nx.beginPath(); nx.arc(cx, cy, R, 0, 7); nx.stroke();
    var minA = (m % 60) / 60 * 6.2832 - 1.5708; sweep(nx, cx, cy, R * .97, minA, 2.2, .35); dial(nx, cx, cy, R, true);
    nx.lineCap = 'round'; nx.lineWidth = 6; nx.strokeStyle = 'rgba(' + L + ',.14)'; nx.beginPath(); nx.arc(cx, cy, R * 1.17, -1.5708, ang(17 + 345 * 1.0)); nx.stroke();
    nx.lineWidth = 5; nx.strokeStyle = 'rgba(' + L + ',.95)'; nx.beginPath(); nx.arc(cx, cy, R * 1.17, ang(17), ang(m)); nx.stroke();
    nx.strokeStyle = '#e8321a'; nx.beginPath(); nx.arc(cx, cy, R * 1.27, ang(17), ang(mf)); nx.stroke();
    nx.strokeStyle = 'rgba(' + L + ',.95)'; nx.lineWidth = 4; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(ang(m)) * R * .5, cy + Math.sin(ang(m)) * R * .5); nx.stroke();
    nx.lineWidth = 2; nx.beginPath(); nx.moveTo(cx, cy); nx.lineTo(cx + Math.cos(minA) * R * .86, cy + Math.sin(minA) * R * .86); nx.stroke();
    nx.fillStyle = '#e8321a'; nx.beginPath(); nx.arc(cx + Math.cos(ang(mf)) * R * 1.27, cy + Math.sin(ang(mf)) * R * 1.27, 6, 0, 7); nx.fill();
    nx.fillStyle = '#e9e7e1'; nx.beginPath(); nx.arc(cx, cy, 4, 0, 7); nx.fill();

    var A = hm(m), B = hm(mf); if (A !== lastA) { lastA = A; $('#nrr').textContent = A; } if (B !== lastB) { lastB = B; $('#nrf').textContent = B; }
    var i = 0; T.NIGHT.forEach(function (n, j) { if (p * 345 >= n[1] - .5) i = j; });
    if (i !== ni) { ni = i; var q = $('#nq'); q.textContent = T.NIGHT[i][2]; q.classList.remove('sw'); void q.offsetWidth; q.classList.add('sw'); Array.prototype.forEach.call($('#n5').children, function (li, j) { li.classList.toggle('on', j === i); }); }
  }
  T.onFrame(function (dt, t) { if (T.vis.z1 && window.scrollY < innerHeight * 1.3) hero(t); if (T.vis.z2) night(t); });
})();
