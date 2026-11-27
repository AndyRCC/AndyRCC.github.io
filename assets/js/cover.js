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

  var COVER = {
    renderFan: renderFan,
    startClock: startClock
  };

  if (typeof module === 'object' && module.exports) module.exports = COVER;
  else window.COVER = COVER;
})();
