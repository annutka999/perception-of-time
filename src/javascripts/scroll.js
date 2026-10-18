/* Скролл: появление и «забывание», прорисовка, проявка бумаги в синьку, поверхности, зоны */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: .12 });
  T.watch = function () { $$('.f:not(.w)').forEach(function (e) { e.classList.add('w'); io.observe(e); }); }; T.watch();
  var Z = $$('[data-z]'), frs = $$('#frames .fr'), pin = $('#z4pin'), z4 = $('#z4');
  var mix = function (a, b, t) { return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * t); }).join(',') + ')'; };
  var surf = function (e) { return e.dataset.surf || (e.classList.contains('si') ? 'i' : e.classList.contains('sb') ? 'b' : 'p'); };
  function onS() {
    var H = innerHeight, seen = 0, kept = 0, P = T.P;
    // в заставке прокрутка = время: метка идёт по линейке пяти минут
    var hp = cl(scrollY / (H * .8)), sc = Math.floor(hp * 300); $('#hm').style.left = (hp * 100) + '%'; $('#hmt').textContent = T.pad(Math.floor(sc / 60)) + ':' + T.pad(sc % 60);
    $$('.f').forEach(function (e) { var r = e.getBoundingClientRect(), k = e.classList.contains('k'); if (r.bottom < 0) { seen++; if (k) kept++; } if (!k) e.style.setProperty('--d', cl(-r.bottom / (H * 2))); });
    $('#h2').textContent = seen ? kept + ' из ' + seen : '—';
    $$('[data-draw]').forEach(function (e) { var r = e.getBoundingClientRect(); e.style.setProperty('--p', cl((H * .9 - r.top) / (r.height + H * .3))); });
    // проявка: бумага → синька; забытое сужается и тает, опорное становится бумажным окном
    var r4 = z4.getBoundingClientRect(), m = cl((cl(-r4.top / (r4.height - H)) - .25) / .5);
    pin.style.background = mix(P.paper, P.blue, m); pin.style.color = mix(P.ink, P.lt, m); z4.dataset.surf = m > .5 ? 'b' : 'p';
    frs.forEach(function (f) {
      var k = f.dataset.k, sp = f.querySelector('figcaption span'), ph = f.querySelector('.ph');
      if (k) { f.style.setProperty('--fb', mix(P.blue, P.paper, m)); f.style.setProperty('--sh', mix(P.paper, P.blue, m)); f.style.transform = 'scale(' + (1 + .08 * m) + ')'; sp.style.fontVariationSettings = "'wdth' " + (100 + 30 * m) + ",'wght' " + (600 + 250 * m); }
      else { f.style.setProperty('--ex', 1 - .88 * m); ph.style.outlineColor = 'rgba(' + P.paper.join(',') + ',' + (.3 * (1 - m)) + ')'; sp.style.fontVariationSettings = "'wdth' " + (100 - 75 * m) + ",'wght' " + (600 - 400 * m); f.querySelector('figcaption').style.opacity = 1 - .7 * m; }
    });
    $('#dlab').textContent = m > .5 ? 'Вспомнившийся день · 5 опорных точек' : 'Записанный день · 11 отметок';
  }
  T.onScroll = onS; addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); onS();
  var LY = [['событие', 2], ['переживание', 3], ['память', 4], ['чтение', 4], ['создание', 9]], shown = 0, tk = $$('.tk'), tc = [0, 0], sf = '';
  T.onFrame(function (dt) {
    var z = S.zone, s = sf; Z.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) z = +e.dataset.z; if (r.top < 40 && r.bottom > 40) s = surf(e); });
    if (s !== sf) { sf = s; document.body.dataset.surf = s; }
    S.zone = z; if (document.visibilityState === 'visible') S.dwell[z] = (S.dwell[z] || 0) + dt;
    $('#h3').textContent = T.pad(z) + ' / 09'; if (z > S.maxZone) S.maxZone = z;
    if (S.maxZone !== shown) { shown = S.maxZone; var on = LY.filter(function (l) { return l[1] <= shown; }); $('#h4').innerHTML = on.length ? 'времена: ' + on.map(function (l) { return l[1] === shown ? '<span class="k">' + l[0] + '</span>' : l[0]; }).join(' · ') : ''; }
    if (z === 6) tk.forEach(function (e, i) { tc[i] += dt / (+e.dataset.sp); var m = 480 + Math.floor(tc[i]); e.textContent = T.pad(Math.floor(m / 60) % 24) + ':' + T.pad(m % 60); });
  });
  // зона 4: объём материала против времени просмотра (измеряется по вашему скроллу)
  setInterval(function () { var n = Math.max(1, Math.round(S.dwell[3] || 0)); $('#vol').textContent = 'Этот день занял 15 ч 39 мин от первой до последней отметки. Вы пролистали его примерно за ' + n + ' с.'; }, 500);
})();
