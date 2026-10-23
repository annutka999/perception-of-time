window.T && window.T.mods.push('finale');
/* Зона 9. Возвращение к таймеру из первого экрана: ваша оценка, часы, три времени и вывод. */
(function () {
  var T = window.T, S = T.S, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var f = function (v) { return v.toFixed(1).replace('.', ','); };
  function show(id) { $('#' + id).classList.add('on'); setTimeout(function () { $('#' + id).scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150); }
  var guess = null;
  var cat = function (s) { return s < 240 ? 3 : s <= 360 ? 5 : 8; };
  var NAME = { 3: 'меньше пяти минут', 5: 'около пяти минут', 8: 'больше пяти минут' };
  // шаг 1 → 2: оценка читателя против часов
  $$('.opt').forEach(function (b) { b.onclick = function () {
    if (S.frozen !== null) return; S.frozen = S.active; guess = +b.dataset.v; b.classList.add('sel');
    var real = S.frozen, same = cat(real) === guess;
    $('#real').textContent = T.fmt(real);
    $('#s2-cmp').textContent = T.nb('Вы ответили: ' + NAME[guess] + '. ' + (same ? 'Оценка совпала с часами.' : 'Оценка не совпала с часами.'));
    $('#s2-why').textContent = T.nb('Это не ошибка. Часы считают время страницы, а оценка складывается из того, на что вы смотрели, чем были заняты и что запомнилось.');
    show('s2');
  }; });
  // шаг 2 → 3: три времени одного материала и вывод
  $('[data-go=s3]').onclick = function () {
    var real = S.frozen !== null ? S.frozen : S.active;
    var R = [['В моменте', S.ex !== null ? f(S.ex) + ' с' : '—', S.ex !== null ? 'Столько вам показались десять секунд, когда вы следили за временем' + (S.ex2 !== null ? '. Когда вы были заняты: ' + f(S.ex2) + ' с.' : '.') : 'Вы не проходили опыт про десять секунд: он в зоне 5.'], ['По часам', T.fmt(real), 'Столько страница была открыта.'], ['В памяти', NAME[guess].replace('меньше пяти минут', '< 5 мин').replace('около пяти минут', '≈ 5 мин').replace('больше пяти минут', '> 5 мин'), 'Так вы решили, что читали: «' + NAME[guess] + '».']];
    var au = T.authorSteps(); if (au.length) R.push(['А создание?', T.fd(T.D(au[0].date)), 'Работа над этим фрагментом' + (au.length > 1 ? ' длилась до ' + T.fd(T.D(au[au.length - 1].date)) : '') + '.']);
    $('#three').innerHTML = R.map(function (r) { return '<div><p class="q">' + r[0] + '</p><div class="v tn">' + r[1] + '</div><p>' + T.nb(r[2]) + '</p></div>'; }).join('');
    var ZN = ['Вход', 'Ночь', 'День', 'Неделя', 'Опыт', 'Насыщенность', 'Масштаб', 'Возраст', 'Финал'], mx = 1, k; for (k = 1; k <= 9; k++) mx = Math.max(mx, S.dwell[k] || 0);
    $('#trace').innerHTML = ZN.map(function (n, j) { var d = S.dwell[j + 1] || 0; return '<a class="tr" href="#z' + (j + 1) + '" aria-label="Вернуться: ' + n + '"><span>' + T.pad(j + 1) + ' ' + n + '</span><i style="--w:' + (d / mx).toFixed(3) + '"></i><b>' + Math.round(d) + ' с</b></a>'; }).join('');
    show('s3');
  };
  $('#again9').onclick = function () { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0); location.reload(); };
})();
