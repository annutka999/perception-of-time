/* Зона 9: вопрос → «Правильно» + реальное время → время автора → память читателя → протокол и финал */
(function () {
  var T = window.T, S = T.S, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var dated = T.AUTHOR.steps.filter(function (s) { return s.date; }), chosen = null;
  var f = function (v) { return v.toFixed(1).replace('.', ','); };
  function show(id) { $('#' + id).classList.add('on'); T.watch(); setTimeout(function () { $('#' + id).scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150); }
  function days() { if (dated.length < 2) return null; return Math.round((T.D(dated[dated.length - 1].date) - T.D(dated[0].date)) / 864e5); }
  // шаг 1 → 2
  $$('.opt').forEach(function (b) { b.onclick = function () { if (S.frozen !== null) return; S.frozen = S.active; b.classList.add('sel'); $('#pick').textContent = b.dataset.v; $('#real').textContent = T.fmt(S.frozen); show('s2'); }; });
  // шаг 3: время автора рядом с временем читателя (линии не в масштабе)
  function auth() {
    var r = Math.round((S.dwell[3] || 0) + (S.dwell[4] || 0)), d = days();
    $('#auth').innerHTML = '<div class="bar"><span class="mono">Вы · этот фрагмент</span><i style="width:3%"></i><em>' + r + ' с</em></div><div class="bar au"><span class="mono">Автор · ' + T.AUTHOR.fragment + '</span><i></i><em>' + (d !== null ? d + ' дн.' : '[срок — заполнить]') + '</em></div><ul class="stp" style="margin-top:3vh">' + T.authorList() + '</ul><p class="mono mu">Линии не в масштабе.</p>';
  }
  // шаг 4: выбор запомнившегося момента
  function mom() {
    var M = T.MOMENTS.filter(function (m) { return (S.dwell[m.z] || 0) >= 2; }); if (M.length < 2) M = T.MOMENTS;
    $('#mom').innerHTML = M.map(function (m) { return '<button class="mc"><span class="mono">0' + m.z + '</span><b>' + m.t + '</b><em>' + (m.z === 5 && S.ex !== null ? 'ваш результат: ' + f(S.ex) + ' с' : m.q) + '</em></button>'; }).join('');
    $$('.mc').forEach(function (b, i) { b.onclick = function () {
      if ($('#mom').classList.contains('chosen')) return; chosen = M[i]; $('#mom').classList.add('chosen'); b.classList.add('pick');
      $('#momcap').textContent = 'Размер обозначает вашу оценку значимости этого момента, а не его длительность.';
      setTimeout(function () { sum(); show('s5'); }, 2800);
    }; });
  }
  // шаг 5: протокол — пять времён одного материала
  function sum() {
    var d = days(), ex = S.ex !== null ? 'десять секунд по ощущению: ' + f(S.ex) + ' с' + (S.ex2 !== null ? '; занятым: ' + f(S.ex2) + ' с' : '') : 'вы не проходили пример в зоне 5';
    var cr = dated.length > 1 ? d + ' дн. (' + T.fd(T.D(dated[0].date)) + ' — ' + T.fd(T.D(dated[dated.length - 1].date)) + ')' : dated.length === 1 ? T.fd(T.D(dated[0].date)) + ' (одна дата)' : '[даты — заполнить]';
    var R = [['время события', 'день из карты: 15 ч 39 мин по часам'], ['время переживания', ex], ['время в памяти', 'ваш запомнившийся момент: «' + chosen.t + '»'], ['время чтения', 'активно ' + T.fmt(S.frozen !== null ? S.frozen : S.active) + ' · ваша оценка: ' + $('#pick').textContent + ' мин'], ['время создания', cr]];
    $('#sum').innerHTML = R.map(function (r) { return '<div class="sumrow"><span class="mono">' + r[0] + '</span><b' + (r[1].indexOf('[') === 0 ? ' class="ph"' : '') + '>' + r[1] + '</b></div>'; }).join('') + '<p class="mono mu">Это разные способы измерить один материал. Они не обязаны совпадать.</p>';
  }
  $$('[data-go]').forEach(function (b) { b.onclick = function () { var g = b.dataset.go; if (g === 's3') auth(); if (g === 's4') mom(); show(g); }; });

  // три циферблата финала: в моменте / по часам / в памяти
  function clock(id) {
    var e = $(id), s = ''; for (var i = 0; i < 60; i++) s += '<line x1="100" y1="4" x2="100" y2="' + (i % 5 ? 7 : 10) + '" transform="rotate(' + i * 6 + ' 100 100)"/>';
    for (var k = 1; k < 13; k++) s += '<text x="' + (100 + Math.sin(k * Math.PI / 6) * 80) + '" y="' + (103 - Math.cos(k * Math.PI / 6) * 80) + '">' + k + '</text>';
    e.innerHTML = s + '<line class="h" x1="100" y1="100" x2="100" y2="38"/><line class="h s" x1="100" y1="112" x2="100" y2="22"/><circle cx="100" cy="100" r="3.5"/>';
    var h = e.querySelectorAll('.h'); return function (d) { h[0].setAttribute('transform', 'rotate(' + d / 12 + ' 100 100)'); h[1].setAttribute('transform', 'rotate(' + d + ' 100 100)'); };
  }
  var C = [null, clock('#c1'), clock('#c2'), clock('#c3')], d2 = 0, t0 = performance.now() / 1000;
  T.onFrame(function (dt) {
    if (!$('#s5').classList.contains('on')) return; var t = performance.now() / 1000 - t0;
    C[1](t * 6); d2 += dt * 6 * (1 + .9 * Math.sin(t * .8) + .5 * Math.sin(t * 2.3)); C[2](d2); C[3](Math.floor(t / 3) * 40);
  });
})();
