(() => {
  'use strict';

  const THEME_COLORS = { light: '#f2ede3', dark: '#131211' };
  let themeBound = false;

  function readStoredTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const getTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  function applyTheme(theme, persist) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    if (persist) {
      try { localStorage.setItem('theme', next); } catch {}
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[next]);

    const label = next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function initTheme() {
    applyTheme(readStoredTheme(), false);
    if (themeBound) return;
    themeBound = true;

    document.addEventListener('click', e => {
      const btn = e.target?.closest?.('[data-theme-toggle]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);
    });

    window.addEventListener('pageshow', e => {
      applyTheme(readStoredTheme(), false);
      if (e.persisted && document.activeElement?.matches?.('.wide, .back')) {
        document.activeElement.blur();
      }
    });

    window.addEventListener('storage', e => {
      if (e.key === 'theme') applyTheme(readStoredTheme(), false);
    });

    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch {}
      if (saved !== 'light' && saved !== 'dark') applyTheme(readStoredTheme(), false);
    });
  }

  function fillVolume() {
    const label = 'Vol. ' + String(new Date().getFullYear()).slice(-2);
    document.querySelectorAll('[data-vol]').forEach(el => { el.textContent = label; });
  }

  function maybeFitcheck() {
    try {
      if (!new URLSearchParams(location.search).has('fitcheck')) return;
      if (document.querySelector('script[data-fitcheck]')) return;
      const s = document.createElement('script');
      s.src = '/_dev/fit-check.js';
      s.setAttribute('data-fitcheck', '1');
      (document.body || document.documentElement).appendChild(s);
    } catch {}
  }

  const SITE = { getTheme, applyTheme, initTheme, fillVolume, maybeFitcheck };
  if (typeof module === 'object' && module.exports) module.exports = SITE;
  else window.SITE = SITE;
})();
