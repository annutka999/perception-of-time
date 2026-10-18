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
  // негатив читателя: экспозиция кадра = реальное время в зоне; запомнившийся момент — бумажное окно
  function neg() {
    var mx = 1, z, h = ''; for (z = 1; z <= 9; z++) mx = Math.max(mx, S.dwell[z] || 0);
    for (z = 1; z <= 9; z++) { var d = S.dwell[z] || 0, big = chosen && chosen.z === z;
      h += '<figure class="fr' + (big ? ' big' : '') + '" style="--ex:' + (.15 + .85 * d / mx).toFixed(2) + (big ? ';--fb:var(--paper);--sh:var(--blue);--ex:1' : '') + '"><div class="ph">' + T.frameSVG(z * 11 + 3) + '</div><figcaption><time>0' + z + '</time><span>' + Math.round(d) + ' с</span></figcaption></figure>'; }
    $('#neg').innerHTML = h;
  }
  function sum() {
    neg();
    var d = days(), ex = S.ex !== null ? 'десять секунд по ощущению: ' + f(S.ex) + ' с' + (S.ex2 !== null ? '; занятым: ' + f(S.ex2) + ' с' : '') : 'вы не проходили пример в зоне 5';
    var cr = dated.length > 1 ? d + ' дн. (' + T.fd(T.D(dated[0].date)) + ' — ' + T.fd(T.D(dated[dated.length - 1].date)) + ')' : dated.length === 1 ? T.fd(T.D(dated[0].date)) + ' (одна дата)' : '[даты — заполнить]';
    var R = [['время события', 'день из карты: 15 ч 39 мин по часам'], ['время переживания', ex], ['время в памяти', 'ваш запомнившийся момент: «' + chosen.t + '»'], ['время чтения', 'активно ' + T.fmt(S.frozen !== null ? S.frozen : S.active) + ' · ваша оценка: ' + $('#pick').textContent + ' мин'], ['время создания', cr]];
    $('#sum').innerHTML = R.map(function (r) { return '<div class="sumrow"><span class="mono">' + r[0] + '</span><b' + (r[1].indexOf('[') === 0 ? ' class="ph"' : '') + '>' + r[1] + '</b></div>'; }).join('') + '<p class="mono mu">Это разные способы измерить один материал. Они не обязаны совпадать.</p>';
  }
  $$('[data-go]').forEach(function (b) { b.onclick = function () { var g = b.dataset.go; if (g === 's3') auth(); if (g === 's4') mom(); show(g); }; });

})();
