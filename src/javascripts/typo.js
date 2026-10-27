window.T && window.T.mods.push('typo');
/* Типографика: слова до трёх букв (предлоги, союзы, частицы, местоимения), тире и числа с единицей не остаются в конце строки.
   Применяется к тексту на странице и к любому тексту, который скрипты пишут позже (печать, результаты, подписи). */
(function () {
  var SH = '[A-Za-zА-Яа-яЁё]{1,3}';
  var re = new RegExp('(^|[\\s(«\\u00A0—–-])(' + SH + ')[ \\t]+(?=[^\\s])', 'g');
  var reEnd = new RegExp('(^|[\\s(«\\u00A0—–-])(' + SH + ')[ \\t]+$');
  function nb(s, hasNext) {
    for (var i = 0; i < 4; i++) { var n = s.replace(re, '$1$2\u00A0'); if (n === s) break; s = n; }
    if (hasNext) s = s.replace(reEnd, '$1$2\u00A0');
    return s.replace(/[ \t]+(—|–)/g, '\u00A0$1').replace(/(\d)[ \t]+(?=[а-яёА-ЯЁA-Za-z%°])/g, '$1\u00A0');
  }
  window.T.nb = function (s) { return nb(s, false); };
  function fix(node) {
    if (node.nodeType !== 3 || !node.parentNode || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.parentNode.nodeName)) return;
    var v = nb(node.nodeValue, !!node.nextSibling); if (v !== node.nodeValue) node.nodeValue = v;
  }
  function walk(root) {
    if (root.nodeType === 3) { fix(root); return; }
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(fix);
  }
  var main = document.body; walk(main);
  if (window.MutationObserver) new MutationObserver(function (ms) {
    ms.forEach(function (m) { if (m.type === 'characterData') fix(m.target); else Array.prototype.forEach.call(m.addedNodes, walk); });
  }).observe(main, { childList: true, characterData: true, subtree: true });
})();
