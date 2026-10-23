/* Служебная панель. Откройте index.html#dev:
   — внизу: подбор оттенка синего (потом впишите значения в style.css и удалите этот файл);
   — вверху слева: какие модули загрузились, нашлись ли цвета в CSS, какие были ошибки. */
(function () {
  if (location.hash !== '#dev') return;
  var T = window.T, O = [['кобальт', '#1740B8', '#8FB0FF', '#DCE5FF'], ['синька', '#0B4A9E', '#7FB2F0', '#D3E4F8'], ['берлинская', '#0A3B6E', '#6FA6D6', '#D0E2F1'], ['ультрамарин', '#2B4BFF', '#9DB0FF', '#E0E6FF']];
  var d = document.createElement('div'); d.style.cssText = 'position:fixed;z-index:200;left:50%;bottom:14px;transform:translateX(-50%);display:flex;gap:6px;background:#EEEBE3;border:1px solid #151513;padding:8px 10px;border-radius:99px;font:500 11px "Roboto Flex",monospace;text-transform:uppercase;color:#151513';
  O.forEach(function (o) { var b = document.createElement('button'); b.textContent = o[0]; b.style.cssText = 'border:1px solid #151513;border-radius:99px;padding:6px 10px;background:' + o[1] + ';color:#fff;font:inherit;cursor:pointer';
    b.onclick = function () { var s = document.documentElement.style; s.setProperty('--blue', o[1]); s.setProperty('--blue-hi', o[2]); s.setProperty('--blue-lt', o[3]); T.pal(); T.resetNight(); T.onScroll(); }; d.appendChild(b); });
  document.body.appendChild(d);
  var need = ['data', 'typo', 'session', 'graphics', 'sections', 'scroll', 'experiment', 'finale'], p = document.createElement('pre');
  p.style.cssText = 'position:fixed;z-index:200;left:8px;top:64px;max-width:min(92vw,520px);margin:0;padding:10px 12px;background:#151513;color:#EEEBE3;font:500 11px/1.5 "Roboto Flex",monospace;white-space:pre-wrap;pointer-events:none';
  function upd() { p.textContent = 'модули: ' + need.map(function (n) { return n + (T.mods.indexOf(n) > -1 ? ' ✓' : ' ✗'); }).join('  ') + '\nцвета из CSS: ' + (T.palOk ? 'найдены ✓' : 'не найдены, запасные ✗ (проверьте, загрузился ли style.css)') + '\nошибок: ' + T.errs.length + (T.errs.length ? '\n' + T.errs.slice(0, 4).join('\n') : ''); }
  upd(); setInterval(upd, 1000); document.body.appendChild(p);
})();
