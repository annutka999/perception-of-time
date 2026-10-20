window.T && window.T.mods.push('sections');
/* Сборка содержимого зон из данных (data.js) */
(function () {
  var T = window.T, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  // заставка: линейка пяти минут (300 секунд; на узком экране 60 отметок по 5 секунд)
  function rule() { var r = $('#hr'), n = innerWidth < 700 ? 60 : 300, h = ''; for (var i = 0; i <= n; i++) h += '<i' + (i % (n / 5) === 0 ? ' class="m"' : '') + ' style="--n:' + i + '"></i>'; $$('#hr i').forEach(function (e) { e.remove(); }); r.insertAdjacentHTML('afterbegin', h); T.hticks = $$('#hr i'); T.hrand = T.hticks.map(function (t, i) { return ((i * 9301 + 49297) % 233280) / 233280; }); $('#hrc').dataset.t = $('#hrc').textContent = T.nb('Пять минут. Одна отметка — ' + (n === 300 ? 'одна секунда.' : 'пять секунд.')); }
  rule(); addEventListener('resize', rule);
  // зона 2: список моментов ночи (метки времени)
  $('#n5').innerHTML = T.NIGHT.map(function (n, i) { return '<li><span class="tag' + (i ? '' : ' k') + '">' + n[0] + '</span></li>'; }).join('');
  // зона 3: день по минутам, положение отметки = реальное время
  var b0 = T.sec('08:12'), span = T.sec('23:51') - b0;
  $('#day3').insertAdjacentHTML('beforeend', T.E.map(function (e) { var y = (T.sec(e[0]) - b0) / span; return '<div class="ev3' + (e[2] ? ' k' : '') + '" data-y="' + y.toFixed(4) + '" style="top:' + (y * 96 + 2) + '%;--at:' + y.toFixed(3) + '"><time>' + e[0] + '</time><span>' + e[1] + '</span></div>'; }).join(''));
  // деления шкалы дня: каждый час (длинный) и каждые 15 минут (короткий) стоят там, где им положено по часам
  var tks = ''; for (var m = 495; m <= 1431; m += 15) { var yy = (m - b0) / span; tks += '<i class="tick ' + (m % 60 === 0 ? 'hr' : 'qt') + '" style="top:' + (yy * 96 + 2).toFixed(3) + '%;--at:' + yy.toFixed(3) + '"></i>'; }
  $('#day3').insertAdjacentHTML('beforeend', tks + '<div class="now" id="now"><time>08:12</time></div>');
  var a3 = $('#a3'); if (a3) { var AL = T.authorList(); if (AL) a3.innerHTML = '<span class="lbl">История этого фрагмента</span><ul style="margin-top:10px">' + AL + '</ul>'; else a3.remove(); }
  $('#daynote').textContent = T.nb(T.DAY.conditional ? 'Условный день, составленный для иллюстрации. Каждая отметка стоит там, где она была бы по часам: расстояния между отметками соответствуют времени.' : T.DAY.source);
  // зона 4: тот же день теми же положениями (вертикаль = время по часам); ниже — тот же ряд для ответа читателя
  var ai = 0, row = function (e, tag) { var y = (T.sec(e[0]) - b0) / span, top = y * 92 + 4, a = e[2] ? ai++ : -1; return '<' + tag + (tag === 'button' ? ' type="button" aria-pressed="false" data-m="' + (e[2] ? 1 : 0) + '"' : '') + ' class="ev4' + (e[2] ? ' k' : '') + (tag === 'button' ? ' rcb' : '') + '" data-t="' + top.toFixed(2) + '" data-a="' + a + '" style="top:' + top.toFixed(2) + '%"><time>' + e[0] + '</time><i></i><span>' + e[1] + '</span></' + tag + '>'; };
  $('#day4').insertAdjacentHTML('beforeend', T.E.map(function (e) { return row(e, 'div'); }).join(''));
  ai = 0; $('#rc').innerHTML = '<div class="axis"></div>' + T.E.map(function (e) { return row(e, 'button'); }).join('');
  // на сжатых шкалах (зона 4, вопрос про память) — только часы: четверти часа слились бы в сплошную полосу
  var ax = ''; for (var m2 = 540; m2 <= 1431; m2 += 60) ax += '<i class="tick hr" style="top:' + ((m2 - b0) / span * 92 + 4).toFixed(3) + '%"></i>';
  $$('#day4 .axis, #rc .axis').forEach(function (a) { a.innerHTML = ax; });
  // зона 6: два условных дня на одной вертикали (08:00–20:00); точка — эпизод, оставшийся в памяти.
  // Появление: в дне А точки возникают медленно, в дне Б — быстро.
  $$('.mini').forEach(function (m) {
    var slow = m.dataset.d === 'A', hx = ''; for (var hh = 480; hh <= 1200; hh += 60) hx += '<i class="tick hr" style="top:' + ((hh - 480) / 720 * 92 + 4).toFixed(3) + '%"></i>'; var h = '<div class="axis">' + hx + '</div><span class="end" style="top:-1.1em">08:00</span><span class="end" style="bottom:-1.1em">20:00</span>';
    T.DAYS[m.dataset.d].forEach(function (t, i) { var y = (T.sec(t) - 480) / 720 * 92 + 4; h += '<div class="ev4" style="top:' + y.toFixed(1) + '%;--dl:' + ((slow ? 500 + i * 900 : 300 + i * 130) / 1000) + 's"><time>' + t + '</time><i></i></div>'; });
    m.innerHTML = h;
  });
  // зона 7: масштаб
  var ord = []; for (var i = 0; i < 60; i++) ord.push(i); ord.sort(function () { return Math.random() - .5; });
  var TT = { 18: 'День · много событий', 7: 'Неделя · несколько опорных событий', 4: 'Месяц · несколько узлов', 2: 'Год · несколько воспоминаний' };
  $('#sc').innerHTML = '<i></i>'.repeat(60); var dots = $('#sc').children;
  function scale(n) { for (var j = 0; j < dots.length; j++) dots[j].className = ord.indexOf(j) < n ? (n < 18 ? 'y' : '') : 'x'; $('#sct').textContent = TT[n]; }
  var tm = [], touched = false;
  $$('button[data-n]').forEach(function (b) { b.onclick = function () { touched = true; tm.forEach(clearTimeout); scale(+b.dataset.n); }; }); scale(18);
  // при появлении зоны масштаб сам проходит день → неделя → месяц → год и возвращается; клик перехватывает управление
  var io7 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !touched) { io7.disconnect(); [[1400, 7], [3200, 4], [5000, 2], [7600, 18]].forEach(function (p) { tm.push(setTimeout(function () { if (!touched) scale(p[1]); }, p[0])); }); } }); }, { threshold: .55 });
  io7.observe($('#z7'));
})();
