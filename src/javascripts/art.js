window.T && window.T.mods.push('art');
/* Графика-фотограммы: нарисована кодом (не фотографии). Цвета берутся из CSS-переменных,
   поэтому оттенок синего меняется везде одной строкой в style.css. */
(function () {
  var T = window.T;
  function rng(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  var f1 = function (v) { return Math.round(v * 10) / 10; };

  // общий фильтр мягкой полутени (как у предметов на фотограмме)
  T.artDefs = function () {
    if (document.getElementById('art-defs')) return;
    var d = document.createElement('div'); d.id = 'art-defs'; d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0"><defs><filter id="pen" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter></defs></svg>';
    document.body.appendChild(d);
  };

  // Кадр-фотограмма: абстрактные предметы, положенные на светочувствительную бумагу. seed задаёт композицию.
  T.frameSVG = function (seed) {
    var R = rng(seed * 13 + 5), g = '', n = 3 + Math.floor(R() * 2);
    for (var k = 0; k < n; k++) {
      var t = Math.floor(R() * 5), x = 36 + R() * 168, y = 30 + R() * 120, r = 14 + R() * 34, a = Math.floor(R() * 180);
      if (t === 0) g += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" stroke="none"/>';
      else if (t === 1) g += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="none" stroke-width="' + f1(4 + R() * 5) + '"/>';
      else if (t === 2) g += '<rect x="' + f1(x - 60) + '" y="' + f1(y - 5) + '" width="' + f1(80 + R() * 70) + '" height="' + f1(7 + R() * 8) + '" transform="rotate(' + a + ' ' + f1(x) + ' ' + f1(y) + ')" stroke="none"/>';
      else if (t === 3) g += '<path d="M' + f1(x - r) + ' ' + f1(y) + 'A' + f1(r) + ' ' + f1(r) + ' 0 0 1 ' + f1(x + r) + ' ' + f1(y) + '" fill="none" stroke-width="' + f1(4 + R() * 4) + '" transform="rotate(' + a + ' ' + f1(x) + ' ' + f1(y) + ')"/>';
      else { for (var j = 0; j < 6; j++) g += '<circle cx="' + f1(x - 50 + j * 20) + '" cy="' + f1(y + Math.sin(j + seed) * 10) + '" r="3.2" stroke="none"/>'; }
    }
    return '<svg viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="sh" filter="url(#pen)">' + g + '</g></svg>';
  };

})();
