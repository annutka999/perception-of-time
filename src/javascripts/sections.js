window.T && window.T.mods.push('sections');
/* Сборка содержимого зон из данных (data.js) */
(function () {
  var T = window.T, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  // зона 2: моменты ночи — отметки пробуждений и список реплик
  $('#n5').innerHTML = T.NIGHT.map(function (n) { return '<li><time>' + n[0] + '</time></li>'; }).join('');
  $('#nl').innerHTML = T.NIGHT.map(function (n) { return '<li><time>' + n[0] + '</time><span class="q sm">' + n[2] + '</span></li>'; }).join('');
  // шкала дня: одна и та же в зонах 3 и 4, положение отметки = настоящее время. top(y) задаёт вертикальный отступ в процентах
  var b0 = T.sec('08:12'), span = T.sec('23:51') - b0;
  function ruler(el, top, step) {
    var h = '<div class="rl"><div class="axis"></div>';
    for (var m = 480; m <= 1440; m += step) { var y = (m - b0) / span; if (y < 0 || y > 1) continue; var hr = m % 60 === 0; h += '<i class="tick ' + (hr ? 'hr' : m % 15 === 0 ? 'm15' : 'm5') + '" style="top:' + top(y).toFixed(3) + '%"></i>'; if (hr) h += '<span class="hl tn" style="top:' + top(y).toFixed(3) + '%">' + T.pad(m / 60) + ':00</span>'; }
    el.insertAdjacentHTML('afterbegin', h + '</div>');
  }
  var ev = function (e, top, extra) { var y = (T.sec(e[0]) - b0) / span; return '<div class="ev" data-y="' + y.toFixed(4) + '" data-t="' + top(y).toFixed(2) + '" style="top:' + top(y).toFixed(2) + '%;--at:' + y.toFixed(3) + '"' + (extra || '') + '><i class="cn"></i><time>' + e[0] + '</time><span class="name">' + e[1] + '</span></div>'; };
  // зона 3: длинная шкала, риски каждые 5 минут, длинные у часов
  var t3 = function (y) { return y * 96 + 2; };
  ruler($('#day3'), t3, 5);
  $('#day3').insertAdjacentHTML('beforeend', T.E.map(function (e) { return ev(e, t3); }).join('') + '<div class="now" id="now"><time>08:12</time></div>');
  $('#daynote').textContent = T.nb(T.DAY.conditional ? 'Возьмём один условный день, составленный для этого рассказа. Одиннадцать отметок стоят там, где стояли бы по часам: чем больше расстояние между ними, тем больше времени прошло.' : T.DAY.source + (T.DAY.provenance ? ' ' + T.DAY.provenance : ''));
  // зона 4: тот же день на том же месте слева; на сжатой шкале риски каждые 15 минут
  var t4 = function (y) { return y * 92 + 4; }, ai = 0;
  ruler($('#day4'), t4, 15);
  $('#day4').insertAdjacentHTML('beforeend', T.E.map(function (e) { return ev(e, t4, ' data-a="' + (e[2] ? ai++ : -1) + '"'); }).join(''));
  // веб-ринг: показывается, только когда заданы обе соседние работы
  if (T.RING.prev && T.RING.next) { $('#ring').hidden = false; $('#ringp').textContent = T.RING.prev.title + ' ←'; $('#ringp').href = T.RING.prev.url; $('#ringn').textContent = '→ ' + T.RING.next.title; $('#ringn').href = T.RING.next.url; $('#ringw').textContent = T.nb(T.RING.next.why || ''); }
  // зона 6: два условных дня на одной вертикали (08:00–20:00); точка — эпизод, оставшийся в памяти
  $$('.mini').forEach(function (m) {
    var top = function (t) { return (t - 480) / 720 * 92 + 4; }, h = '<div class="rl"><div class="axis"></div>';
    for (var hh = 480; hh <= 1200; hh += 60) h += '<i class="tick hr" style="top:' + top(hh).toFixed(2) + '%"></i><span class="hl tn" style="top:' + top(hh).toFixed(2) + '%">' + T.pad(hh / 60) + ':00</span>';
    h += '</div>';
    // как день переживался: плотность делений (в дне А почти пустые минуты ожидания, в дне Б заполненные), через неделю они исчезают
    for (var sl = 0; sl < 72; sl++) { var l = m.dataset.d === 'A' ? 5 + (sl * 7 % 4) * 2 : 16 + ((sl * 13) % 7) * 6; h += '<i class="bt" style="top:' + top(480 + sl * 10).toFixed(2) + '%;--l:' + l + 'px"></i>'; }
    // день А: эпизоды появляются редко и поздно, день Б: часто и сразу (появление привязано к прокрутке панели)
    T.DAYS[m.dataset.d].forEach(function (t, i) { var at = m.dataset.d === 'A' ? [.3, .75][i] : .2 + i * .05; h += '<div class="ev" style="top:' + top(T.sec(t)).toFixed(2) + '%;--at:' + at + '"><i class="cn"></i><i class="dot"></i><time>' + t + '</time></div>'; });
    m.innerHTML = h;
  });
  // зона 6: «Пусть пройдёт неделя» убирает переживание дня, остаются эпизоды памяти
  $('#wk').onclick = function () { var on = $('#wk').getAttribute('aria-pressed') !== 'true'; $('#wk').setAttribute('aria-pressed', on); $('#wk').textContent = on ? 'Вернуть день' : 'Пусть пройдёт неделя'; $('#days').classList.toggle('week', on); $('#wk-s').textContent = on ? 'Прошла неделя: от дня А осталось 2 эпизода, от дня Б 9.' : 'Что останется от каждого дня?'; };
  // зона 7: масштаб меняется только по выбору читателя; подпись печатается
  var ord = []; for (var i = 0; i < 60; i++) ord.push(i); ord.sort(function () { return Math.random() - .5; });
  var SC = [[18, 'День: много событий. Кофе, письмо, дорога, разговор: почти всё доступно.'], [7, 'Неделя: несколько опорных событий. Встреча, новость, поездка.'], [4, 'Месяц: несколько узлов. Важный разговор, праздник.'], [2, 'Год: несколько воспоминаний. Переезд, лето, начало чего-то нового.']];
  $('#sc').innerHTML = '<i></i>'.repeat(60); var dots = $('#sc').children;
  function scale(v, quick) { var n = SC[v - 1][0]; for (var j = 0; j < dots.length; j++) dots[j].className = ord.indexOf(j) < n ? (n < 18 ? 'y' : '') : 'x'; $('#scn').textContent = n; T.type($('#sct'), T.nb(SC[v - 1][1]), quick ? 0 : 22); }
  $('#scr').oninput = function () { scale(+$('#scr').value); }; scale(1, true);
  // зона 5: два вида оценки переключаются, текст печатается
  var TABS = ['Когда мы оцениваем длительность прямо во время события, внимание может быть направлено на само течение времени или на то, чем мы заняты.', 'Когда мы оцениваем уже прошедший период, мы опираемся на то, что сохранилось в памяти и было восстановлено [3]. Эти оценки могут различаться.'];
  function tab(i, quick) { $$('.tabs button').forEach(function (b) { var on = +b.dataset.t === i; b.setAttribute('aria-pressed', on); b.classList.toggle('o', !on); }); T.type($('#tabtxt'), T.nb(TABS[i]), quick ? 0 : 18); }
  $$('.tabs button').forEach(function (b) { b.onclick = function () { tab(+b.dataset.t); }; }); tab(0, true);
  // зона 8: две жизни в годах; каждый год — кнопка. Яркость в режиме «что остаётся» условна (по мотивам Rubin и др., 1998)
  function level(p, i) { var a = i + 1;
    if (p === 7) return a <= 2 ? .06 : a <= 4 ? .35 : a <= 6 ? .75 : 1;
    return a <= 3 ? .05 : a <= 9 ? .35 : a <= 30 ? .9 : a <= 50 ? .28 : a <= 55 ? .45 : .8; }
  function note(p, i) { var a = i + 1;
    if (p === 7) return a <= 2 ? 'Год ' + a + ': почти ничего не сохранится, самые первые годы человек не вспоминает.' : a <= 4 ? 'Год ' + a + ': несколько отдельных ярких эпизодов.' : 'Год ' + a + ': недавний, поэтому помнится много. Каждый год пока составляет заметную часть всей жизни.';
    return a <= 3 ? 'Год ' + a + ': почти ничего не сохранилось, как и у большинства людей.' : a <= 9 ? 'Год ' + a + ': несколько отдельных эпизодов: школа, дом, один-два события.' : a <= 30 ? 'Год ' + a + ': юность и молодость. У взрослых именно с этих лет приходится больше всего воспоминаний.' : a <= 50 ? 'Год ' + a + ': годы похожи друг на друга. Помнятся два-три события, остальное слилось в общую полосу работы и быта.' : a <= 55 ? 'Год ' + a + ': отдельные события, но уже не так отчётливо.' : 'Год ' + a + ': недавние годы помнятся лучше. Но один год — это лишь одна шестидесятая жизни.'; }
  [[7, '#y7'], [60, '#y60']].forEach(function (q) {
    var el = $(q[1]), h = ''; for (var i = 0; i < q[0]; i++) h += '<button class="yr" data-p="' + q[0] + '" data-i="' + i + '" style="--m:' + level(q[0], i) + '" aria-label="Год ' + (i + 1) + '"></button>'; el.innerHTML = h;
    el.addEventListener('click', function (e) { var b = e.target.closest('.yr'); if (!b) return; $$('.yr.sel').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); T.type($('#life-t'), T.nb(note(q[0], +b.dataset.i)), 18); });
  });
  $('#life-m').onclick = function () { var on = $('#life-m').getAttribute('aria-pressed') !== 'true'; $('#life-m').setAttribute('aria-pressed', on); $('#life-m').textContent = on ? 'Снова показать равные годы' : 'Показать, что остаётся в памяти'; $('#life7').classList.toggle('mem', on); $('#life60').classList.toggle('mem', on); };
})();
