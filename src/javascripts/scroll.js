window.T && window.T.mods.push('scroll');
/* Скролл: появление и «забывание», прорисовка, проявка бумаги в синьку, поверхности, зоны */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: .01, rootMargin: '0px 0px -18% 0px' });
  T.watch = function () { $$('.f:not(.wtch)').forEach(function (e) { e.classList.add('wtch'); io.observe(e); }); }; T.watch();
  var Z = $$('[data-z]'), ev = $$('#day4 .ev4'), pin = $('#z4pin'), z4 = $('#z4'), cap = $('#d4cap'), axis = $('#day4 .axis'); T.fade = true;
  var mix = function (a, b, t) { return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * t); }).join(',') + ')'; };
  var surf = function (e) { return e.dataset.surf || (e.classList.contains('si') ? 'i' : e.classList.contains('sb') ? 'b' : 'p'); };
  function onS() {
    var H = innerHeight, seen = 0, kept = 0, P = T.P;
    var turn = $('#turn');
    $$('.f').forEach(function (e) {
      // страница начинает «забывать» только после поворота: до него весь текст остаётся на месте
      var pos = turn.compareDocumentPosition(e), after = (pos & 4) && !(pos & 16), r = e.getBoundingClientRect(), k = e.classList.contains('k');
      if (after && r.bottom < 0) { seen++; if (k) kept++; }
      if (!k) e.style.setProperty('--d', after && T.fade ? cl(-r.bottom / (H * 2)) : 0);
    });
    $('#h2').textContent = seen && T.fade ? (seen - kept) + ' фр.' : '—';
    $$('[data-draw]').forEach(function (e) { var r = e.getBoundingClientRect(); e.style.setProperty('--p', cl((H * .9 - r.top) / (r.height + H * .3))); });
    // фразы-речь и заголовки: слова проявляются вместе с прокруткой (фраза поднимается от 94% до 52% высоты экрана)
    if (T.speech) { var atEnd = scrollY + H >= document.documentElement.scrollHeight - 4, rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
      T.speech.forEach(function (e) {
        var rr = e.getBoundingClientRect(), p = rm || rr.bottom < 0 ? 1 : rr.top > H ? 0 : atEnd ? 1 : cl((H * .94 - rr.top) / (H * .42)), ws = e._wd, n = ws.length;
        e.style.setProperty('--in', cl(p * 1.6));
        for (var i = 0; i < n; i++) { var v = cl((p - i / n * .7) / .3), w = ws[i];
          w.style.transform = v >= 1 ? 'none' : 'translateY(' + ((1 - v) * 112).toFixed(0) + '%)'; w.style.filter = v >= 1 ? 'none' : 'blur(' + ((1 - v) * 6).toFixed(1) + 'px)'; w.style.opacity = v.toFixed(2); }
      }); }
    // шкала дня: линия чтения показывает время суток в той точке, где вы читаете; событие рядом подчёркивается
    var d3 = $('#day3'), nw = $('#now');
    if (d3 && nw) { var dr = d3.getBoundingClientRect();
      if (dr.bottom > 0 && dr.top < H) { var yy = cl((H * .5 - dr.top) / dr.height), yt = cl((yy * 100 - 2) / 96), mm = Math.round(492 + yt * 939); nw.style.display = 'block'; nw.style.top = (yy * 100) + '%'; nw.firstChild.textContent = T.pad(Math.floor(mm / 60)) + ':' + T.pad(mm % 60);
        $$('#day3 .ev3').forEach(function (e) { e.classList.toggle('cur', Math.abs(+e.dataset.y - yt) < .02); }); }
      else nw.style.display = 'none'; }
    // заставка: по мере прокрутки отметки гаснут, остаются только минуты (иллюстрация сжатия)
    if (T.hticks) { var r1 = $('#z1').getBoundingClientRect(), p1 = cl(-r1.top / (r1.height - H));
      T.hticks.forEach(function (t, i) { if (t.classList.contains('m')) return; var o = 1 - .94 * cl((p1 - (.1 + .7 * T.hrand[i])) * 9, 0, 1); t.style.opacity = (.55 * o).toFixed(3); });      }
    // поворот: слова абзаца таят по мере прокрутки, опорные остаются; кнопка отключает
    if (T.turnWords) { var tpr = $('#turnp').getBoundingClientRect(), tpg = cl((H * .6 - tpr.top) / (H * .8)), nw = T.turnWords.length;
      T.turnWords.forEach(function (w, i) { var o = T.fade ? 1 - .86 * cl((tpg * 1.2 - i / nw) * 6, 0, 1) : 1; w.style.opacity = o.toFixed(2); w.style.filter = o < .99 ? 'blur(' + ((1 - o) * 4).toFixed(1) + 'px)' : ''; }); }
    // зона 4: те же положения; сначала лишнее тускнеет на месте, потом отдельное событие — пересборка
    var r4 = z4.getBoundingClientRect(), p4 = cl(-r4.top / (r4.height - H)), f = cl((p4 - .12) / .3), r = cl((p4 - .58) / .28), bg = cl((p4 - .12) / .35), e3 = r * r * (3 - 2 * r);
    var pbg = mix(P.paper, P.blue, bg); pin.style.background = pbg; pin.style.setProperty('--pb', pbg); pin.style.color = mix(P.ink, P.lt, bg); z4.dataset.surf = bg > .5 ? 'b' : 'p';
    ev.forEach(function (n) {
      var a = +n.dataset.a, t = +n.dataset.t;
      if (a >= 0) { n.style.top = (t + (8 + a * 21 - t) * e3) + '%'; n.style.opacity = 1; n.style.setProperty('--dc', mix(P.blue, P.paper, bg)); }
      else { n.style.opacity = Math.max(0, 1 - .9 * f - r); }
    });
    axis.style.opacity = 1 - r;
    cap.textContent = r > .02 ? 'Отдельное событие: память пересобирает день. Точки сдвигаются друг к другу. Вертикаль больше не время, сохраняется только порядок.' : f > .25 ? 'Через неделю (модель): остаются 5 опорных точек, остальные тускнеют. Положения прежние.' : 'Записанный день: 11 отметок. Вертикаль — время по часам, от 08:12 до 23:51.';
  }
  var fb = $('#fgt'); fb.onclick = function () { T.fade = !T.fade; fb.textContent = T.fade ? 'Показать всё как было' : 'Снова расплывать'; fb.setAttribute('aria-pressed', !T.fade); onS(); };
  T.onScroll = onS; addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); onS();
  var LY = [['событие', 2], ['переживание', 3], ['память', 4], ['чтение', 4], ['создание', 9]], shown = 0, sf = ''; if (!T.authorSteps().length) LY.pop();
  T.onFrame(function (dt) {
    var z = S.zone, s = sf; Z.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) z = +e.dataset.z; if (r.top < 40 && r.bottom > 40) s = surf(e); });
    if (s !== sf) { sf = s; document.body.dataset.surf = s; }
    S.zone = z; if (document.visibilityState === 'visible') S.dwell[z] = (S.dwell[z] || 0) + dt;
    $('#h3').textContent = T.pad(z) + ' / 09'; if (z > S.maxZone) S.maxZone = z;
    if (S.maxZone !== shown) { shown = S.maxZone; var on = LY.filter(function (l) { return l[1] <= shown; }); $('#h4').innerHTML = on.length ? 'времена: ' + on.map(function (l) { return l[1] === shown ? '<span class="k">' + l[0] + '</span>' : l[0]; }).join(' · ') : ''; }
  });
  // зона 4: объём материала против времени просмотра (измеряется по вашему скроллу)
  setInterval(function () { var n = Math.max(1, Math.round(S.dwell[3] || 0)); $('#vol').textContent = 'Этот день занял 15 ч 39 мин от первой до последней отметки. Вы пролистали его примерно за ' + n + ' с.'; }, 500);
})();
