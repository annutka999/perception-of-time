/* Скролл: появление, «забывание», прорисовка линий, зоны, параллакс, бегущие строки */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: .12 });
  T.watch = function () { $$('.f:not(.w)').forEach(function (e) { e.classList.add('w'); io.observe(e); }); }; T.watch();
  var Z = $$('[data-z]'), mq = $$('.mq div'), pk = $$('canvas.ht');
  function onS() {
    var H = innerHeight, seen = 0, kept = 0;
    $$('.f').forEach(function (e) { var r = e.getBoundingClientRect(), k = e.classList.contains('k'); if (r.bottom < 0) { seen++; if (k) kept++; } if (!k) e.style.setProperty('--d', cl(-r.bottom / (H * 2))); });
    $('#h2').textContent = seen ? kept + ' из ' + seen : '—';
    $$('[data-draw]').forEach(function (e) { var r = e.getBoundingClientRect(); e.style.setProperty('--p', cl((H * .9 - r.top) / (r.height + H * .3))); });
    pk.forEach(function (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--py', ((r.top + r.height / 2 - H / 2) * c.dataset.p) + 'px'); });
    mq.forEach(function (m) { m.style.transform = 'translateX(' + (-((window.scrollY * .6) % (m.scrollWidth / 2))) + 'px)'; });
    var r4 = $('#z4').getBoundingClientRect(), m = cl((cl(-r4.top / (r4.height - H)) - .35) / .35);
    $('#z4').style.setProperty('--m', m); $('#dlab').textContent = m > .5 ? 'Вспомнившийся день · 5 опорных точек' : 'Записанный день · 11 отметок';
  }
  addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); onS();
  // какие «времена» уже открыты читателю (показываются в шапке по мере прохождения)
  var LY = [['событие', 2], ['переживание', 3], ['память', 4], ['чтение', 4], ['создание', 9]], shown = 0, tk = $$('.tk'), tc = [0, 0];
  T.onFrame(function (dt) {
    var z = S.zone; Z.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) z = +e.dataset.z; });
    S.zone = z; if (document.visibilityState === 'visible') S.dwell[z] = (S.dwell[z] || 0) + dt;
    $('#h3').textContent = T.pad(z) + ' / 09';
    if (z > S.maxZone) S.maxZone = z;
    if (S.maxZone !== shown) { shown = S.maxZone; var on = LY.filter(function (l) { return l[1] <= shown; }); $('#h4').innerHTML = on.length ? 'времена: ' + on.map(function (l) { return l[1] === shown ? '<span class="r">' + l[0] + '</span>' : l[0]; }).join(' · ') : ''; }
    if (z === 6) tk.forEach(function (e, i) { tc[i] += dt / (+e.dataset.sp); var m = 480 + Math.floor(tc[i]); e.textContent = T.pad(Math.floor(m / 60) % 24) + ':' + T.pad(m % 60); });
  });
  // зона 4: объём материала против времени просмотра (измеряется по вашему скроллу)
  setInterval(function () { var n = Math.max(1, Math.round(S.dwell[3] || 0)); $('#vol').textContent = 'Этот день занял 15 ч 39 мин от первой до последней отметки. Вы пролистали его примерно за ' + n + ' с.'; }, 500);
})();
