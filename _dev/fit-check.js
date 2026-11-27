(() => {
  'use strict';

  // Sync fit/flow threshold with assets/css/site.css and assets/js/projects.js
  const FIT_QUERY = '(min-width: 900px) and (min-height: 560px)';
  const STYLE_ID = 'fitcheck-style';
  const SKIP_SEL = 'dialog:not([open]), noscript, script, style, template, svg, [aria-hidden="true"], .sr-only';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.fitcheck-overflow{outline:3px solid #e00 !important;outline-offset:-3px !important;}' +
      '.fitcheck-tiny{outline:2px dashed #c0f !important;outline-offset:1px !important;}';
    document.head.appendChild(style);
  }

  function describeEl(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).filter(c => !c.startsWith('fitcheck-')).slice(0, 3).join('.')
      : '';
    const fitLabel = el.getAttribute('data-fit');
    return tag + id + cls + (fitLabel && fitLabel !== '1' ? `[${fitLabel}]` : '');
  }

  function isElementVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    for (let cur = el; cur && cur.nodeType === 1; cur = cur.parentElement) {
      if (cur.hidden) return false;
      if (cur.tagName === 'DIALOG' && !cur.open) return false;
      const cs = getComputedStyle(cur);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
        return false;
      }
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function checkCut(isFit) {
    const truncated = [];
    const clipped = new Set();

    for (const el of document.querySelectorAll('body *')) {
      if (el.closest(SKIP_SEL)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const ellipsis = cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1;
      const clamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1;
      if (ellipsis || clamp) {
        truncated.push(`truncated ${el.className || el.tagName}: ${el.textContent.trim().slice(0, 60)}`);
      }
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const p = n.parentElement;
      if (!n.textContent.trim() || !p || p.closest(SKIP_SEL)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;

      for (let a = p; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
        const ar = a.getBoundingClientRect();
        const d = Math.max(r.bottom - ar.bottom, r.right - ar.right, ar.top - r.top, ar.left - r.left);
        const scrollsX = cs.overflowX === 'auto' || cs.overflowX === 'scroll';
        if (d > 1 && cs.textOverflow !== 'ellipsis' && !scrollsX) {
          clipped.add(`${a.className || a.tagName} clips "${n.textContent.trim().slice(0, 40)}" by ${Math.round(d)}px`);
        }
        break;
      }
      if (isFit && (r.bottom > window.innerHeight + 1 || r.right > window.innerWidth + 1)) {
        clipped.add(`viewport clips "${n.textContent.trim().slice(0, 40)}"`);
      }
    }

    return [...truncated, ...clipped];
  }

  function checkContrast() {
    const parse = s => {
      const m = s && s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lin = v => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const mix = (fg, bg, a) => ({
      r: fg.r * a + bg.r * (1 - a),
      g: fg.g * a + bg.g * (1 - a),
      b: fg.b * a + bg.b * (1 - a),
      a: 1
    });
    const bgOf = el => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = parse(getComputedStyle(e).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        if (c && c.a === 1) break;
      }
      return layers.reverse().reduce((base, c) => mix(c, base, c.a), { r: 255, g: 255, b: 255, a: 1 });
    };
    const opacityOf = el => {
      let o = 1;
      for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
      return o;
    };

    const fails = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const t = n.textContent.trim();
      const el = n.parentElement;
      if (!t || !el || el.closest(SKIP_SEL)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || !el.getBoundingClientRect().width) continue;
      if (el.closest('button:disabled')) continue;
      const o = opacityOf(el);
      if (o < 0.05) continue;
      const c = parse(cs.color);
      if (!c) continue;
      const bg = bgOf(el);
      const fg = mix(c, bg, c.a * o);
      const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      if (ratio < need) {
        fails.add(`${t.slice(0, 30)} ${ratio.toFixed(2)}:1 (needs ${need}, ${size.toFixed(1)}px)`);
      }
    }
    return [...fails];
  }

  function checkClick() {
    const cards = document.querySelectorAll('.pgrid .card:not(.blank):not(.next)');
    if (!cards.length) return [];
    const sx = window.scrollX;
    const sy = window.scrollY;
    const fails = [];
    for (const c of cards) {
      c.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = c.getBoundingClientRect();
      let ok = 0;
      let n = 0;
      for (let i = 1; i < 6; i++) {
        for (let j = 1; j < 10; j++) {
          const x = r.left + r.width * i / 6;
          const y = r.top + r.height * j / 10;
          if (y < 0 || y > window.innerHeight) continue;
          n++;
          if (document.elementFromPoint(x, y)?.closest('a')) ok++;
        }
      }
      const pct = n ? Math.round(100 * ok / n) : 100;
      if (pct < 100) {
        fails.push(`${c.querySelector('.no')?.textContent?.trim() || '?'} ${pct}%`);
      }
    }
    window.scrollTo(sx, sy);
    return fails;
  }

  function runFitcheck() {
    ensureStyle();

    document.querySelectorAll('.fitcheck-overflow, .fitcheck-tiny').forEach(el => {
      el.classList.remove('fitcheck-overflow', 'fitcheck-tiny');
    });

    const forcedFlow = document.body?.dataset?.mode === 'flow';
    const isFit = !forcedFlow && window.matchMedia(FIT_QUERY).matches;
    const mode = isFit ? 'fit' : 'flow';
    const doc = document.documentElement;
    const vScroll = doc.scrollHeight > window.innerHeight + 1;
    const hScroll = doc.scrollWidth > window.innerWidth + 1;
    const pageScrolls = isFit ? (vScroll || hScroll) : hScroll;

    const overflow = [];
    for (const el of document.querySelectorAll('[data-fit]')) {
      if (!isElementVisible(el)) continue;
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        el.classList.add('fitcheck-overflow');
        overflow.push(
          `${describeEl(el)} (${el.scrollWidth}x${el.scrollHeight} > ${el.clientWidth}x${el.clientHeight})`
        );
      }
    }

    const tinyText = [];
    const seenTiny = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      const parent = node.parentElement;
      if (!parent) continue;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') continue;
      if (parent.closest('svg, .sr-only')) continue;
      if (!isElementVisible(parent)) continue;
      const fs = parseFloat(getComputedStyle(parent).fontSize);
      if (fs < 10.95 && !seenTiny.has(parent)) {
        seenTiny.add(parent);
        parent.classList.add('fitcheck-tiny');
        tinyText.push(`${describeEl(parent)} "${node.nodeValue.trim().slice(0, 28)}" (${fs.toFixed(1)}px)`);
      }
    }

    const cut = checkCut(isFit);
    const contrast = checkContrast();
    const click = checkClick();

    const result = {
      mode,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      pageScrolls,
      horizontalScroll: hScroll,
      overflow,
      tinyText,
      cut,
      contrast,
      click
    };

    window.__fit = result;
    if (console.table) {
      console.table([{
        mode: result.mode,
        viewport: result.viewport,
        theme: result.theme,
        pageScrolls: result.pageScrolls,
        hScroll: result.horizontalScroll,
        overflow: result.overflow.length,
        tinyText: result.tinyText.length,
        cut: result.cut.length,
        contrast: result.contrast.length,
        click: result.click.length
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
