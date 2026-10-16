/* Зона 5: «десять секунд». Приглашение → действие → ответ → объяснение → дальше.
   Две попытки: сначала внимание на времени, потом занятые делом. Всё измеряется по вашим нажатиям. */
(function () {
  var T = window.T, S = T.S, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var mode = 'wait', t1 = 0, cnt = 0, cur = 0, views = $$('.st-v'), steps = $$('.st-steps li'), box = $('#st-dots');
  var f = function (v) { return v.toFixed(1).replace('.', ','); };
  function go(i) { cur = i; views.forEach(function (v) { v.classList.toggle('on', +v.dataset.s === i); }); steps.forEach(function (s, k) { s.classList.toggle('on', k <= i || (i === 3 && k === 4)); }); }
  function spawn() { box.innerHTML = ''; var b = document.createElement('button'); b.setAttribute('aria-label', 'Нажмите на точку'); b.style.left = (8 + Math.random() * 84) + '%'; b.style.top = (12 + Math.random() * 76) + '%'; b.onclick = function () { cnt++; spawn(); }; box.appendChild(b); }
  function start(m) {
    mode = m; t1 = performance.now(); cnt = 0;
    $('#st-act').textContent = m === 'wait' ? 'Нажмите «Стоп», когда, по ощущению, пройдёт десять секунд. Время не показано.' : 'Кликайте по точкам. Когда, по ощущению, пройдёт десять секунд, нажмите «Стоп».';
    box.style.display = m === 'wait' ? 'none' : 'block'; if (m === 'busy') spawn(); else box.innerHTML = ''; go(1);
  }
  function mark(el, v, label) { if (v === null) { el.style.display = 'none'; return; } el.style.display = 'block'; el.style.left = Math.min(100, v / 20 * 100) + '%'; el.firstChild.textContent = label + ' ' + f(v) + ' с'; }
  function stop() {
    var v = (performance.now() - t1) / 1000; if (mode === 'wait') S.ex = v; else S.ex2 = v;
    $('#st-val').textContent = f(v) + ' с'; mark($('#st-you'), S.ex, S.ex2 === null ? '' : 'ждали'); mark($('#st-you2'), S.ex2, 'заняты');
    $('#st-res').textContent = 'Красная метка — ваше нажатие, белая — настоящие десять секунд.'; go(2);
  }
  function explain() {
    var both = S.ex !== null && S.ex2 !== null;
    $('#st-ex').textContent = both ? 'В первой попытке внимание было на времени (' + f(S.ex) + ' с), во второй — на задаче (' + f(S.ex2) + ' с). Исследования показывают, что внимание к времени влияет на оценку длительности в моменте.' : 'Мы сравнили ощущение «десяти секунд» и измеренный интервал (' + f(S.ex) + ' с). Что изменилось бы, если бы вы были заняты делом?';
    $('#st-busy').style.display = both ? 'none' : 'inline-block'; go(3);
  }
  $$('[data-a]').forEach(function (b) { b.onclick = function () {
    var a = b.dataset.a;
    if (a === 'start-wait') start('wait'); else if (a === 'start-busy') start('busy'); else if (a === 'stop') stop();
    else if (a === 'explain') explain(); else if (a === 'again') go(0); else if (a === 'down') $('#expl').scrollIntoView({ behavior: 'smooth' });
  }; });
})();
