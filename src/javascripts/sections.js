/* Сборка содержимого зон из данных (data.js) */
(function () {
  var T = window.T, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  // заголовок: буквы поднимаются
  $('#ttl').innerHTML = ['Всё', 'Быстрее'].map(function (w, j) { return '<span class="l">' + w.split('').map(function (c, i) { return '<i style="animation-delay:' + (.2 + j * .35 + i * .07) + 's">' + c + '</i>'; }).join('') + '</span>'; }).join('');
  // бегущие строки
  $$('.mq div').forEach(function (d) { var s = d.dataset.t.repeat(8); d.innerHTML = s + s; });
  // полутоновые «фото»
  $$('canvas.ht').forEach(function (c) { T.ht(c, +c.dataset.s, c.dataset.i); });
  // зона 2: список моментов ночи
  $('#n5').innerHTML = T.NIGHT.map(function (n, i) { return '<li' + (i ? '' : ' class="on"') + '>' + n[0] + '</li>'; }).join('');
  // зона 3: день по минутам, положение отметки = реальное время
  var b0 = T.sec('08:12'), span = T.sec('23:51') - b0;
  $('#day3').insertAdjacentHTML('beforeend', T.E.map(function (e) { var y = (T.sec(e[0]) - b0) / span; return '<div class="ev3' + (e[2] ? ' k' : '') + '" style="top:' + (y * 96 + 2) + '%;--at:' + y.toFixed(3) + '"><time>' + e[0] + '</time><span>' + e[1] + '</span></div>'; }).join(''));
  $('#a3').innerHTML = '<span class="mono">История этого фрагмента</span><ul style="margin-top:10px">' + T.authorList() + '</ul>';
  // зона 4: «фотографии» дня
  $('#grid').innerHTML = T.E.map(function (e) { return '<div class="ev' + (e[2] ? ' k' : '') + '"><canvas></canvas><span>' + e[0] + '</span><span>' + e[1] + '</span></div>'; }).join('');
  $$('.ev canvas').forEach(function (c, i) { T.ht(c, i * 7 + 2, T.E[i][2]); });
  // зона 6: мозаики воспоминаний дня А и дня Б
  $$('.mos').forEach(function (m, k) { var n = +m.dataset.n; for (var i = 0; i < n; i++) { var c = document.createElement('canvas'); m.appendChild(c); T.ht(c, k * 50 + i * 5 + 1, 1); } });
  // зона 7: масштаб
  var ord = []; for (var i = 0; i < 60; i++) ord.push(i); ord.sort(function () { return Math.random() - .5; });
  var TT = { 18: 'День · много событий', 7: 'Неделя · несколько опорных событий', 4: 'Месяц · несколько узлов', 2: 'Год · несколько воспоминаний' };
  $('#sc').innerHTML = '<i></i>'.repeat(60); var dots = $('#sc').children;
  function scale(n) { for (var j = 0; j < dots.length; j++) dots[j].className = ord.indexOf(j) < n ? (n < 18 ? 'y' : '') : 'x'; $('#sct').textContent = TT[n]; }
  $$('button[data-n]').forEach(function (b) { b.onclick = function () { scale(+b.dataset.n); }; }); scale(18);
})();
