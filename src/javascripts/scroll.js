window.T && window.T.mods.push('scroll');
/* Прокрутка. Главное свойство публикации: прокрутка как время.
   Здесь: таймер в начале, линия чтения на шкале дня, состояния зоны 4, ночь, «забывание» после экрана-поворота,
   полоса прочитанного. */
(function () {
  var T = window.T, S = T.S, cl = T.cl, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  S.read = {}; S.last = {};
  // режим без закрепления: только по размеру окна (телефон или очень низкое окно); системная настройка «уменьшить движение» его больше не включает, она лишь выключает расплывание и печать текста
  var mq = matchMedia('(max-width:700px),(max-height:520px)'), rmq = matchMedia('(prefers-reduced-motion:reduce)');
  T.fade = !rmq.matches;
  function setFlat() { T.flat = mq.matches; document.documentElement.classList.toggle('flat', T.flat); }
  setFlat(); if (mq.addEventListener) mq.addEventListener('change', function () { setFlat(); onS(); });
  // слова поворотного абзаца: по ходу прокрутки тают, опорные фразы (жирные) остаются
  T.turnWords = []; Array.prototype.slice.call($('#turnp').childNodes).forEach(function (n) {
    if (n.nodeType !== 3) return; var f = document.createDocumentFragment();
    n.textContent.split(/([ \t\r\n]+)/).forEach(function (t) { if (!t) return; if (/^[ \t\r\n]+$/.test(t)) f.appendChild(document.createTextNode(' ')); else { var s = document.createElement('span'); s.textContent = t; T.turnWords.push(s); f.appendChild(s); } });
    n.parentNode.replaceChild(f, n);
  });
  var Z = $$('[data-z]'), fs = $$('.f'), draws = $$('[data-draw]'), ev = $$('#day4 .ev'), rl4 = $('#day4 .rl'), pin = $('#z4pin'), z4 = $('#z4'), cap = $('#d4cap'), segb = $$('#seg button'), step = 0, d3 = $('#day3'), nw = $('#now'), z2 = $('#z2'), bars = $$('#rail .b'), ZN = ['Вход', 'Ночь', 'День', 'Неделя', 'Опыт', 'Насыщенность', 'Масштаб', 'Возраст', 'Финал'];
  var mix = function (a, b, t) { return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * t); }).join(',') + ')'; };
  var surf = function (e) { return e.classList.contains('si') ? 'i' : e.classList.contains('sb') ? 'b' : e.classList.contains('sh') ? 'h' : 'p'; };
  var hero = $('#z1'), heroin = $('#heroin'), intro = $('#intro'), bar = $('#timerbar'), ph = [1, 2, 3, 4].map(function (k) { return $('#ph' + k); });
  var ramp = function (p, a, b) { return cl((p - a) / (b - a)); };
  var STEP = [0, .5, .95];
  function onS() {
    var H = innerHeight, P = T.P, turn = $('#turn');
    // первый экран: таймер и название уходят вверх по мере прокрутки
    heroin.style.setProperty('--he', cl(-hero.getBoundingClientRect().top / (hero.offsetHeight * .75)));
    // вступление: сколько прокрутки занимает фраза, столько она «длится»; первая долго, вторая мельком, третья сжимается до нескольких слов
    if (!T.flat) { var ri = intro.getBoundingClientRect(), pi = cl(-ri.top / (ri.height - H));
      var O = [ramp(pi, 0, .05) * (1 - ramp(pi, .33, .38)), ramp(pi, .38, .4) * (1 - ramp(pi, .48, .5)), ramp(pi, .5, .55) * (1 - ramp(pi, .74, .78)), ramp(pi, .8, .86)];
      ph.forEach(function (e, i) { e.style.setProperty('--o', O[i].toFixed(3)); }); ph[2].style.setProperty('--dm', (1 - .9 * ramp(pi, .6, .68)).toFixed(3)); }
    // забывание: только после экрана-поворота и только то, что уже прокручено выше экрана; вернувшись к тексту, вы видите его резким
    fs.forEach(function (e) {
      var pos = turn.compareDocumentPosition(e), after = (pos & 4) && !(pos & 16), r = e.getBoundingClientRect();
      e.style.setProperty('--d', after && T.fade ? cl(-r.bottom / (H * 2)) : 0);
    });
    draws.forEach(function (e) { var r = e.getBoundingClientRect(); e.style.setProperty('--p', cl((H * .9 - r.top) / (r.height + H * .3))); });
    // шкала дня: линия чтения показывает время суток там, где вы читаете
    var dr = d3.getBoundingClientRect();
    if (dr.bottom > 0 && dr.top < H) { var yy = cl((H * .5 - dr.top) / dr.height), yt = cl((yy * 100 - 2) / 96), mm = Math.round(492 + yt * 939); nw.style.display = 'block'; nw.style.top = (yy * 100) + '%'; nw.firstChild.textContent = $('#rdo').textContent = T.pad(Math.floor(mm / 60)) + ':' + T.pad(mm % 60);
    }
    else nw.style.display = 'none';
    // поворот: слова абзаца таят по мере прокрутки
    var tpr = $('#turnp').getBoundingClientRect(), tpg = cl((H * .6 - tpr.top) / (H * .8)), nwd = T.turnWords.length;
    T.turnWords.forEach(function (w, i) { var o = T.fade ? 1 - .86 * cl((tpg * 1.2 - i / nwd) * 6, 0, 1) : 1; w.style.opacity = o.toFixed(2); w.style.filter = o < .99 ? 'blur(' + ((1 - o) * 4).toFixed(1) + 'px)' : ''; });
    // ночь: доля пройденной ночи (в режиме без закрепления показан конец ночи)
    var r2 = z2.getBoundingClientRect(); if (r2.bottom > 0 && r2.top < H) { try { T.night(T.flat ? 1 : cl(-r2.top / (r2.height - H) * 1.08)); } catch (e) { T.errs.push('night: ' + e.message); } }
    // зона 4: те же положения; сначала лишнее тускнеет на месте, потом отдельное событие — пересборка
    var r4 = z4.getBoundingClientRect(), p4 = T.flat ? STEP[step] : cl(-r4.top / (r4.height - H)), f = cl((p4 - .12) / .3), r = cl((p4 - .58) / .28), bg = cl((p4 - .12) / .35), e3 = r * r * (3 - 2 * r);
    pin.style.background = mix(P.paper, P.blue, bg); pin.style.color = mix(P.ink, P.paper, bg); z4.dataset.surf = bg > .5 ? 'b' : 'p';
    ev.forEach(function (n) {
      var a = +n.dataset.a, t = +n.dataset.t;
      if (a >= 0) { n.style.top = (t + (8 + a * 21 - t) * e3) + '%'; n.style.opacity = 1; }
      else n.style.opacity = Math.max(0, 1 - .9 * f - r);
    });
    rl4.style.opacity = 1 - r; $('#d4n').textContent = Math.round(5 + 6 * (1 - f));
    cap.textContent = T.nb(r > .02 ? 'А теперь память собирает день заново: точки придвигаются друг к другу. Расстояния больше не измеряют время, остаётся только порядок.' : f > .25 ? 'Это те события, которые человек смог вспомнить. Остальные фрагменты стёрла память.' : 'Спустя 7 дней был задан вопрос: что вы помните о том дне, какие события тогда происходили?');
  }
  segb.forEach(function (b) { b.onclick = function () { step = +b.dataset.s; segb.forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); onS(); }; });
  // возврат: нажать можно только на уже прочитанную зону
  bars.forEach(function (b, i) { b.onclick = function () { if (S.read[i + 1]) { var t = $('#z' + (i + 1)); if (t) t.scrollIntoView({ behavior: 'smooth' }); } }; });
  // окно на таймере: на половине срока и по его окончании
  var tn = $('#tnote'), tt_ = $('#tnote-t'), tp_ = $('#tnote-p'), tmo = 0;
  function note(t, p) { tn.hidden = false; tt_.textContent = t; T.type(tp_, p, 24); clearTimeout(tmo); tmo = setTimeout(function () { tn.hidden = true; }, 16000); }
  tn.querySelector('.x').onclick = function () { tn.hidden = true; };
  T.onScroll = onS; addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); onS();
  // ориентация и прочитанное: таймер первого экрана, цвет полосы, зоны, которые вы уже прошли
  var sf = '', lastT = '', lastN = -1, lastZ = 0;
  T.onFrame(function (dt) {
    var z = S.zone, s = sf; Z.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) z = +e.dataset.z; if (r.top < 40 && r.bottom > 40) s = e.dataset.surf || surf(e); });
    if (s !== sf) { sf = s; document.body.dataset.surf = s; }
    S.zone = z; if (document.visibilityState === 'visible') S.dwell[z] = (S.dwell[z] || 0) + dt;
    if (!S.n1 && S.active >= 150) { S.n1 = 1; note('02:30', 'Это половина срока, который мы вам дали. Но срока нет: читайте столько, сколько нужно.'); }
    if (!S.n2 && S.active >= 300) { S.n2 = 1; note('05:00', 'Время, которое мы вам дали, вышло. Ничего не произошло: оно только казалось ограниченным.'); }
    var left = Math.max(0, 300 - Math.floor(S.active)); bar.style.setProperty('--left', Math.max(0, 1 - S.active / 300).toFixed(4)); var tt = T.pad(left / 60) + ':' + T.pad(left % 60); if (tt !== lastT) { lastT = tt; $('#timer').textContent = tt; }
    var n = 0, mx = 1, now = performance.now() / 1000; for (k = 1; k <= 9; k++) mx = Math.max(mx, S.dwell[k] || 0); S.last[z] = now;
    for (var k = 1; k <= 9; k++) { if (k < z || (S.dwell[k] || 0) >= 6) S.read[k] = true; if (S.read[k]) n++; var age = k === z ? 0 : now - (S.last[k] || now); bars[k - 1].classList.toggle('on', !!S.read[k]); bars[k - 1].classList.toggle('cur', k === z); bars[k - 1].disabled = !S.read[k]; }
    if (n !== lastN) { lastN = n; $('#prog-sr').textContent = 'Прочитано зон: ' + n + ' из 9'; }
  });
})();
