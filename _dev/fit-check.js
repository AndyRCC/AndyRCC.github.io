(function () {
  'use strict';

  var FIT_QUERY = '(min-width: 900px) and (min-height: 560px)';
  var STYLE_ID = 'fitcheck-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.fitcheck-overflow{outline:3px solid #e00 !important;outline-offset:-3px !important;}' +
      '.fitcheck-tiny{outline:2px dashed #c0f !important;outline-offset:1px !important;}';
    document.head.appendChild(style);
  }

  function describeEl(el) {
    var tag = el.tagName.toLowerCase();
    var id = el.id ? '#' + el.id : '';
    var cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).filter(function (c) {
          return c.indexOf('fitcheck-') !== 0;
        }).slice(0, 3).join('.')
      : '';
    var fitLabel = el.getAttribute('data-fit');
    return tag + id + cls + (fitLabel && fitLabel !== '' && fitLabel !== '1' ? '[' + fitLabel + ']' : '');
  }

  function isElementVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    var cur = el;
    while (cur && cur.nodeType === 1) {
      if (cur.hidden) return false;
      if (cur.tagName === 'DIALOG' && !cur.open) return false;
      var cs = getComputedStyle(cur);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
        return false;
      }
      cur = cur.parentElement;
    }
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function runFitcheck() {
    ensureStyle();

    var prev = document.querySelectorAll('.fitcheck-overflow, .fitcheck-tiny');
    for (var p = 0; p < prev.length; p++) {
      prev[p].classList.remove('fitcheck-overflow', 'fitcheck-tiny');
    }

    var isFit = window.matchMedia(FIT_QUERY).matches;
    var mode = isFit ? 'fit' : 'flow';
    var doc = document.documentElement;
    var vScroll = doc.scrollHeight > window.innerHeight + 1;
    var hScroll = doc.scrollWidth > window.innerWidth + 1;
    var pageScrolls = isFit ? (vScroll || hScroll) : hScroll;

    var overflow = [];
    var fitEls = document.querySelectorAll('[data-fit]');
    for (var i = 0; i < fitEls.length; i++) {
      var el = fitEls[i];
      if (!isElementVisible(el)) continue;
      var oy = el.scrollHeight > el.clientHeight + 1;
      var ox = el.scrollWidth > el.clientWidth + 1;
      if (oy || ox) {
        el.classList.add('fitcheck-overflow');
        overflow.push(
          describeEl(el) +
          ' (' + el.scrollWidth + 'x' + el.scrollHeight +
          ' > ' + el.clientWidth + 'x' + el.clientHeight + ')'
        );
      }
    }

    var tinyText = [];
    var seenTiny = new Set();
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      var parent = node.parentElement;
      if (!parent) continue;
      var tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') continue;
      if (parent.closest && parent.closest('svg')) continue;
      if (!isElementVisible(parent)) continue;
      if (parent.classList.contains('sr-only') || (parent.closest && parent.closest('.sr-only'))) continue;
      var fs = parseFloat(getComputedStyle(parent).fontSize);
      if (fs < 10.95 && !seenTiny.has(parent)) {
        seenTiny.add(parent);
        parent.classList.add('fitcheck-tiny');
        var snippet = node.nodeValue.trim().slice(0, 28);
        tinyText.push(describeEl(parent) + ' "' + snippet + '" (' + fs.toFixed(1) + 'px)');
      }
    }

    var result = {
      mode: mode,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      pageScrolls: pageScrolls,
      horizontalScroll: hScroll,
      overflow: overflow,
      tinyText: tinyText
    };

    window.__fit = result;
    if (console.table) {
      console.table([{
        mode: result.mode,
        viewport: result.viewport,
        theme: result.theme,
        pageScrolls: result.pageScrolls,
        horizontalScroll: result.horizontalScroll,
        overflowCount: result.overflow.length,
        tinyTextCount: result.tinyText.length
      }]);
    }
    console.log('[fitcheck]', JSON.stringify(result));
    return result;
  }

  window.__runFitcheck = runFitcheck;

  runFitcheck();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runFitcheck);
  }
  window.addEventListener('load', runFitcheck);
  window.addEventListener('resize', runFitcheck);
})();
