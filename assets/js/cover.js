(function () {
  'use strict';

  var clockTimer = null;

  function updateProjectCounts(count) {
    var els = document.querySelectorAll('[data-project-count]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = String(count);
    }
    var tile = document.getElementById('projectsTile');
    if (tile) tile.setAttribute('aria-label', 'Projects, see all ' + count);
  }

  function renderFan(container, projects, figures) {
    if (!container) return;
    var list = Array.isArray(projects) ? projects : [];
    updateProjectCounts(list.length);

    var shown = list.slice(0, 6);
    var n = shown.length;
    var center = (n - 1) / 2;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < n; i++) {
      var p = shown[i];
      var d = i - center;
      var x = (d * 6.6).toFixed(3);
      var y = (-0.7 + Math.abs(d) * 0.28).toFixed(3);
      var r = (d * 3.2).toFixed(3);
      var hx = (d * 7).toFixed(3);
      var hy = (-1 + Math.abs(d) * 0.52).toFixed(3);
      var hr = (d * 2).toFixed(3);

      var print = document.createElement('div');
      print.className = 'print';
      print.setAttribute('aria-hidden', 'true');
      print.style.setProperty('--x', 'calc(' + x + ' * var(--u))');
      print.style.setProperty('--y', 'calc(' + y + ' * var(--u))');
      print.style.setProperty('--r', r + 'deg');
      print.style.setProperty('--hx', 'calc(' + hx + ' * var(--u))');
      print.style.setProperty('--hy', 'calc(' + hy + ' * var(--u))');
      print.style.setProperty('--hr', hr + 'deg');
      print.style.setProperty('--z', String(i + 1));
      print.style.viewTransitionName = 'vt-' + p.id;

      var fig = (figures && figures[p.id]) ? figures[p.id] : '';
      print.innerHTML = fig;

      var cap = document.createElement('div');
      cap.className = 'cap';
      var titleSpan = document.createElement('span');
      titleSpan.textContent = p.short;
      var noSmall = document.createElement('small');
      noSmall.textContent = p.no;
      cap.appendChild(titleSpan);
      cap.appendChild(noSmall);
      print.appendChild(cap);

      frag.appendChild(print);
    }

    container.textContent = '';
    container.appendChild(frag);
  }

  function startClock(el) {
    if (!el) return null;
    if (clockTimer) clearInterval(clockTimer);

    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Lima',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    function tick() {
      var now = new Date();
      var hhmm = fmt.format(now);
      el.textContent = hhmm;
      el.setAttribute('datetime', hhmm);
    }

    tick();
    clockTimer = setInterval(tick, 15000);
    return clockTimer;
  }

  var PANEL_IDS = ['about', 'skills'];
  var panelsBound = false;

  function initPanels() {
    var dialogs = {};
    var returnTargets = {};

    for (var i = 0; i < PANEL_IDS.length; i++) {
      var id = PANEL_IDS[i];
      var d = document.getElementById(id);
      if (d && typeof d.showModal === 'function') dialogs[id] = d;
    }

    function openPanel(id, trigger, updateHash) {
      var d = dialogs[id];
      if (!d) return;

      for (var k in dialogs) {
        if (k !== id && dialogs[k].open) dialogs[k].close();
      }

      returnTargets[id] = trigger || document.querySelector('a[href="#' + id + '"]');
      if (!d.open) d.showModal();
      if (updateHash !== false && window.location.hash !== '#' + id) {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search + '#' + id);
        } catch (e) {}
      }
    }

    function syncFromHash() {
      var hashId = window.location.hash ? window.location.hash.slice(1).toLowerCase() : '';
      if (dialogs[hashId]) {
        openPanel(hashId, null, false);
      } else {
        for (var k in dialogs) {
          if (dialogs[k].open) dialogs[k].close();
        }
      }
    }

    if (!panelsBound) {
      panelsBound = true;

      document.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!link) return;
        var targetId = link.getAttribute('href').slice(1).toLowerCase();
        if (!dialogs[targetId]) return;
        e.preventDefault();
        openPanel(targetId, link, true);
      });

      for (var j = 0; j < PANEL_IDS.length; j++) {
        (function (id) {
          var d = dialogs[id];
          if (!d) return;

          d.addEventListener('click', function (e) {
            if (e.target && e.target.closest && e.target.closest('[data-close]')) {
              d.close();
              return;
            }
            if (e.target === d) {
              var rect = d.getBoundingClientRect();
              var outside = e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom;
              if (outside) d.close();
            }
          });

          d.addEventListener('close', function () {
            if (window.location.hash === '#' + id) {
              try {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              } catch (e) {}
            }
            var target = returnTargets[id] || document.querySelector('a[href="#' + id + '"]');
            if (target && typeof target.focus === 'function') target.focus();
          });
        })(PANEL_IDS[j]);
      }

      window.addEventListener('hashchange', syncFromHash);
      window.addEventListener('pageshow', function (e) {
        if (e.persisted) syncFromHash();
      });
    }

    syncFromHash();
  }

  var COVER = {
    renderFan: renderFan,
    startClock: startClock,
    initPanels: initPanels
  };

  if (typeof module === 'object' && module.exports) module.exports = COVER;
  else window.COVER = COVER;
})();
