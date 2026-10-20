window.T && window.T.mods.push('typo');
/* Типографика: короткие слова и тире не остаются в конце строки (неразрывный пробел). */
(function () {
  var W = '[аовиксуяАВИКОСУЯ]|на|по|до|за|из|от|не|но|об|во|ко|со|же|ли|бы|ни|да|для|при|про|над|под|без|или|На|По|До|За|Из|От|Не|Но|Об|Во|Ко|Со|Же|Ли|Бы|Ни|Да|Для|При|Про|Над|Под|Без|Или';
  var re = new RegExp('(^|[\\s(«\\u00A0])(' + W + ')[ \\t]+', 'g');
  window.T.nb = function (s) {
    s = s.replace(re, '$1$2\u00A0').replace(re, '$1$2\u00A0');
    return s.replace(/[ \t]+—/g, '\u00A0—').replace(/(\d)[ \t]+(?=[а-яёА-ЯЁ])/g, '$1\u00A0');
  };
  var w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT), n, list = [];
  while ((n = w.nextNode())) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) list.push(n); }
  list.forEach(function (t) { var v = window.T.nb(t.nodeValue); if (v !== t.nodeValue) t.nodeValue = v; });
})();
