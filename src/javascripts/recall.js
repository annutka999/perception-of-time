window.T && window.T.mods.push('recall');
/* Зона 4: что запомнил сам читатель. Ответ возвращается на ту же вертикаль и сравнивается с моделью. */
(function () {
  var T = window.T, S = T.S, $ = function (s) { return document.querySelector(s); }, rows = Array.prototype.slice.call(document.querySelectorAll('#rc .rcb'));
  rows.forEach(function (b) { b.onclick = function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.classList.toggle('sel', on); }; });
  $('#rcgo').onclick = function () {
    var n = 0, m = 0;
    rows.forEach(function (b) { var sel = b.classList.contains('sel'), mod = b.dataset.m === '1'; if (sel) n++; if (sel && mod) m++; b.classList.toggle('mdl', mod); b.disabled = true; });
    S.recall = { n: n, m: m };
    var r = $('#rcres'); r.hidden = false;
    r.innerHTML = '<p class="q">' + (n ? 'Вы отметили ' + n + ' из 11. Модель оставляет 5, совпало ' + m + '.' : 'Вы ничего не отметили. Модель оставляет 5 событий.') + '</p><p class="cap">Заполненная точка — вы отметили. Кольцо — модель оставляет это событие. Модель лишь иллюстрирует, как со временем остаётся меньше опорных точек. Она не утверждает, что вы забыли именно те события, которых не отметили.</p>';
    this.hidden = true;
  };
})();
