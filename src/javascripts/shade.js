/* Подбор оттенка синего. Откройте index.html#dev — внизу появится панель.
   Когда выберете, впишите значения в начало src/stylesheets/style.css (--blue, --blue-hi, --blue-lt) и удалите этот файл вместе с <script> в index.html. */
(function () {
  if (location.hash !== '#dev') return;
  var T = window.T, O = [['кобальт', '#1740B8', '#8FB0FF', '#DCE5FF'], ['синька', '#0B4A9E', '#7FB2F0', '#D3E4F8'], ['берлинская', '#0A3B6E', '#6FA6D6', '#D0E2F1'], ['ультрамарин', '#2B4BFF', '#9DB0FF', '#E0E6FF']];
  var d = document.createElement('div'); d.style.cssText = 'position:fixed;z-index:200;left:50%;bottom:14px;transform:translateX(-50%);display:flex;gap:6px;background:#EEEBE3;border:1px solid #151513;padding:8px 10px;border-radius:99px;font:500 11px "Martian Mono",monospace;text-transform:uppercase;color:#151513';
  O.forEach(function (o) { var b = document.createElement('button'); b.textContent = o[0]; b.style.cssText = 'border:1px solid #151513;border-radius:99px;padding:6px 10px;background:' + o[1] + ';color:#fff;font:inherit;cursor:pointer';
    b.onclick = function () { var s = document.documentElement.style; s.setProperty('--blue', o[1]); s.setProperty('--blue-hi', o[2]); s.setProperty('--blue-lt', o[3]); T.pal(); T.resetNight(); T.onScroll(); }; d.appendChild(b); });
  document.body.appendChild(d);
})();
