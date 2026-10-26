window.T && window.T.mods.push('experiment');
/* Зона 5: «десять секунд». Две попытки: сначала внимание на времени, потом занятые делом. Всё измеряется по вашим нажатиям. */
(function () {
  var T = window.T, S = T.S, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var mode = 'wait', t1 = 0, cnt = 0, views = $$('.st-v'), box = $('#st-dots');
  var f = function (v) { return v.toFixed(1).replace('.', ','); };
  var A1 = $('#att-a'), A2 = $('#att-b');
  function marks() { A1.classList.toggle('on', mode === 'wait' && !done1() || (S.ex === null)); A2.classList.toggle('on', S.ex !== null && S.ex2 === null); A1.classList.toggle('done', S.ex !== null); A2.classList.toggle('done', S.ex2 !== null); $('#att1').textContent = S.ex !== null ? f(S.ex) + ' с' : '—'; $('#att2').textContent = S.ex2 !== null ? f(S.ex2) + ' с' : '—'; }
  function done1() { return S.ex !== null; }
  function go(i) { views.forEach(function (v) { v.classList.toggle('on', +v.dataset.s === i); }); $('#st').classList.toggle('run', i === 1); marks(); }
  function spawn() { box.innerHTML = ''; var b = document.createElement('button'); b.setAttribute('aria-label', 'Нажмите на точку'); b.style.left = (8 + Math.random() * 84) + '%'; b.style.top = (12 + Math.random() * 76) + '%'; b.onclick = function () { cnt++; spawn(); }; box.appendChild(b); }
  function start(m) {
    mode = m; t1 = performance.now(); cnt = 0;
    $('#st-act').textContent = m === 'wait' ? 'Время идёт. Нажмите «Стоп», когда, по ощущению, пройдёт десять секунд.' : 'Теперь займитесь делом: нажимайте на точку, пока она появляется. Когда, по ощущению, пройдёт десять секунд, нажмите «Стоп».';
    box.style.display = m === 'wait' ? 'none' : 'block'; if (m === 'busy') spawn(); else box.innerHTML = ''; go(1);
  }
  function mark(el, v, label) { if (v === null) { el.style.display = 'none'; return; } el.style.display = 'block'; el.style.left = Math.min(100, v / 20 * 100) + '%'; el.firstChild.textContent = label + ' ' + f(v) + ' с'; }
  function stop() {
    var v = (performance.now() - t1) / 1000; if (mode === 'wait') S.ex = v; else S.ex2 = v;
    $('#st-val').textContent = f(v) + ' с'; mark($('#st-you'), S.ex, S.ex2 === null ? 'вы' : 'следили'); mark($('#st-you2'), S.ex2, 'заняты');
    var d = v - 10; $('#st-res').innerHTML = '<p class="lead">' + (Math.abs(d) < .5 ? 'Почти ровно десять секунд.' : 'Вы нажали на <b>' + f(Math.abs(d)) + ' с ' + (d < 0 ? 'раньше' : 'позже') + '</b> настоящих десяти секунд.') + '</p>'; $('#st-busy2').style.display = S.ex2 !== null ? 'none' : 'inline-block'; go(2);
  }
  function explain() {
    var both = S.ex !== null && S.ex2 !== null;
    $('#st-ex').textContent = T.nb(both ? 'Когда вы следили за временем, получилось ' + f(S.ex) + ' с, когда были заняты — ' + f(S.ex2) + ' с. Обе попытки измерены по вашим нажатиям и показывают, как на оценку влияет то, куда направлено внимание.' : 'Вы следили за временем и получили ' + f(S.ex) + ' с. Теперь попробуйте то же самое, пока заняты делом, и сравните.');
    $('#st-busy').style.display = both ? 'none' : 'inline-block'; go(3);
  }
  $$('[data-a]').forEach(function (b) { b.onclick = function () {
    var a = b.dataset.a;
    if (a === 'start-wait') start('wait'); else if (a === 'start-busy') start('busy'); else if (a === 'stop') stop();
    else if (a === 'explain') explain(); else if (a === 'again') go(0); else if (a === 'down') $('#expl-h').scrollIntoView({ behavior: 'smooth' });
  }; });
})();
