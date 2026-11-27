(function () {
  'use strict';

  var THEME_COLORS = {
    light: '#f2ede3',
    dark: '#131211'
  };

  var themeBound = false;

  function readStoredTheme() {
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    if (persist) {
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
    }

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[next]);

    var label = next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-label', label);
      buttons[i].setAttribute('title', label);
    }
  }

  function initTheme() {
    applyTheme(readStoredTheme(), false);

    if (themeBound) return;
    themeBound = true;

    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);
    });

    window.addEventListener('pageshow', function () {
      applyTheme(readStoredTheme(), false);
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'theme') applyTheme(readStoredTheme(), false);
    });

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onSystemChange = function () {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) {}
        if (saved !== 'light' && saved !== 'dark') applyTheme(readStoredTheme(), false);
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    }
  }

  function fillVolume() {
    var yy = String(new Date().getFullYear()).slice(-2);
    var label = 'Vol. ' + yy;
    var els = document.querySelectorAll('[data-vol]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = label;
    }
  }

  function maybeFitcheck() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (!params.has('fitcheck')) return;
      if (document.querySelector('script[data-fitcheck]')) return;
      var s = document.createElement('script');
      s.src = '/_dev/fit-check.js';
      s.setAttribute('data-fitcheck', '1');
      (document.body || document.documentElement).appendChild(s);
    } catch (e) {}
  }

  var SITE = {
    getTheme: getTheme,
    applyTheme: applyTheme,
    initTheme: initTheme,
    fillVolume: fillVolume,
    maybeFitcheck: maybeFitcheck
  };

  if (typeof module === 'object' && module.exports) module.exports = SITE;
  else window.SITE = SITE;
})();
