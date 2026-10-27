/* Служебная панель диагностики. Откройте адрес сайта с #dev в конце (например .../vse-bystree/#dev):
   вверху слева видно, какие модули загрузились, какой браузер и размер окна, какие были ошибки.
   Если у кого-то «ничего не работает», попросите сделать скриншот этой панели. */
(function () {
  if (location.hash !== '#dev') return;
  var T = window.T, need = ['data', 'typo', 'session', 'graphics', 'sections', 'scroll', 'experiment', 'finale', 'cursor'], p = document.createElement('pre');
  p.style.cssText = 'position:fixed;z-index:200;left:8px;top:8px;max-width:min(92vw,560px);margin:0;padding:10px 12px;background:#0B0B0B;color:#F1F1EE;font:500 12px/1.5 Arial,sans-serif;white-space:pre-wrap;border-radius:6px';
  function upd() {
    p.textContent = 'модули: ' + need.map(function (n) { return n + (T.mods.indexOf(n) > -1 ? ' ✓' : ' ✗'); }).join('  ') +
      '\nокно: ' + innerWidth + '×' + innerHeight + (T.flat ? ' (режим без закрепления: всё идёт подряд)' : ' (обычный режим)') + '\nуменьшить движение в системе: ' + (matchMedia('(prefers-reduced-motion:reduce)').matches ? 'да (расплывание и печать выключены)' : 'нет') +
      '\nбраузер: ' + navigator.userAgent.slice(0, 110) +
      '\nsvh: ' + (window.CSS && CSS.supports && CSS.supports('height', '100svh') ? 'да' : 'нет') + ', aspect-ratio: ' + (window.CSS && CSS.supports && CSS.supports('aspect-ratio', '1') ? 'да' : 'нет') +
      '\nошибки: ' + (T.errs && T.errs.length ? T.errs.join(' | ') : 'нет');
  }
  upd(); setInterval(upd, 1000); document.body.appendChild(p);
})();
