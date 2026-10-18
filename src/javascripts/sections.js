window.T && window.T.mods.push('sections');
/* Сборка содержимого зон из данных (data.js) */
(function () {
  var T = window.T, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  T.artDefs();
  // заставка: линейка пяти минут (300 секунд; на узком экране 60 отметок по 5 секунд)
  function rule() { var r = $('#hr'), n = innerWidth < 700 ? 60 : 300, h = ''; for (var i = 0; i <= n; i++) h += '<i' + (i % (n / 5) === 0 ? ' class="m"' : '') + '></i>'; $$('#hr i').forEach(function (e) { e.remove(); }); r.insertAdjacentHTML('afterbegin', h); }
  rule(); addEventListener('resize', rule);
  // зона 2: список моментов ночи (метки времени)
  $('#n5').innerHTML = T.NIGHT.map(function (n, i) { return '<li><span class="tag' + (i ? '' : ' k') + '">' + n[0] + '</span></li>'; }).join('');
  // зона 3: день по минутам, положение отметки = реальное время
  var b0 = T.sec('08:12'), span = T.sec('23:51') - b0;
  $('#day3').insertAdjacentHTML('beforeend', T.E.map(function (e) { var y = (T.sec(e[0]) - b0) / span; return '<div class="ev3' + (e[2] ? ' k' : '') + '" style="top:' + (y * 96 + 2) + '%;--at:' + y.toFixed(3) + '"><time>' + e[0] + '</time><span>' + e[1] + '</span></div>'; }).join(''));
  $('#a3').innerHTML = '<span class="lbl">История этого фрагмента</span><ul style="margin-top:10px">' + T.authorList() + '</ul>';
  // зона 4: день кадрами (проявка): каждый момент — фотограмма
  $('#frames').innerHTML = T.E.map(function (e, i) { return '<figure class="fr"' + (e[2] ? ' data-k="1"' : '') + '><div class="ph">' + T.frameSVG(i * 7 + 2) + '</div><figcaption><time>' + e[0] + '</time><span>' + e[1] + '</span></figcaption></figure>'; }).join('');
  // зона 6: эпизоды памяти — кадры
  $$('.eps').forEach(function (e, k) { var h = ''; for (var i = 0; i < +e.dataset.n; i++) h += '<figure class="fr efr"><div class="ph">' + T.frameSVG(k * 17 + i * 3 + 1) + '</div></figure>'; e.innerHTML = h; });
  // зона 7: масштаб
  var ord = []; for (var i = 0; i < 60; i++) ord.push(i); ord.sort(function () { return Math.random() - .5; });
  var TT = { 18: 'День · много событий', 7: 'Неделя · несколько опорных событий', 4: 'Месяц · несколько узлов', 2: 'Год · несколько воспоминаний' };
  $('#sc').innerHTML = '<i></i>'.repeat(60); var dots = $('#sc').children;
  function scale(n) { for (var j = 0; j < dots.length; j++) dots[j].className = ord.indexOf(j) < n ? (n < 18 ? 'y' : '') : 'x'; $('#sct').textContent = TT[n]; }
  $$('button[data-n]').forEach(function (b) { b.onclick = function () { scale(+b.dataset.n); }; }); scale(18);
})();
