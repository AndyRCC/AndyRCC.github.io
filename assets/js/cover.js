(() => {
  'use strict';

  const PANEL_IDS = ['about', 'skills'];
  let clockTimer = null;
  let panelsBound = false;

  function renderFan(container, projects, figures) {
    if (!container) return;
    const list = Array.isArray(projects) ? projects : [];
    document.querySelectorAll('[data-project-count]').forEach(n => {
      n.textContent = String(list.length);
    });

    const shown = list.slice(0, 6);
    const center = (shown.length - 1) / 2;
    const frag = document.createDocumentFragment();

    shown.forEach((p, i) => {
      const d = i - center;
      const print = document.createElement('div');
      print.className = 'print';
      print.setAttribute('aria-hidden', 'true');
      print.style.setProperty('--x', `calc(${(d * 6.6).toFixed(3)} * var(--u))`);
      print.style.setProperty('--y', `calc(${(-0.7 + Math.abs(d) * 0.28).toFixed(3)} * var(--u))`);
      print.style.setProperty('--r', `${(d * 3.2).toFixed(3)}deg`);
      print.style.setProperty('--hx', `calc(${(d * 7).toFixed(3)} * var(--u))`);
      print.style.setProperty('--hy', `calc(${(-1 + Math.abs(d) * 0.52).toFixed(3)} * var(--u))`);
      print.style.setProperty('--hr', `${(d * 2).toFixed(3)}deg`);
      print.style.setProperty('--z', String(i + 1));
      print.style.viewTransitionName = `vt-${p.id}`;
      print.innerHTML = figures?.[p.id] || '';

      const cap = document.createElement('div');
      cap.className = 'cap';
      const title = document.createElement('span');
      title.textContent = p.short;
      const no = document.createElement('small');
      no.textContent = p.no;
      cap.append(title, no);
      print.appendChild(cap);
      frag.appendChild(print);
    });

    container.textContent = '';
    container.appendChild(frag);
  }

  function startClock(el) {
    if (!el) return null;
    if (clockTimer) clearInterval(clockTimer);
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false
    });
    const tick = () => {
      const hhmm = fmt.format(new Date());
      el.textContent = hhmm;
      el.setAttribute('datetime', hhmm);
    };
    tick();
    clockTimer = setInterval(tick, 15000);
    return clockTimer;
  }

  function initPanels() {
    const dialogs = {};
    const returnTargets = {};
    for (const id of PANEL_IDS) {
      const d = document.getElementById(id);
      if (d?.showModal) dialogs[id] = d;
    }

    const openPanel = (id, trigger, updateHash = true) => {
      const d = dialogs[id];
      if (!d) return;
      for (const k of Object.keys(dialogs)) {
        if (k !== id && dialogs[k].open) dialogs[k].close();
      }
      returnTargets[id] = trigger || document.querySelector(`a[href="#${id}"]`);
      if (!d.open) d.showModal();
      if (updateHash && location.hash !== `#${id}`) {
        try { history.replaceState(null, '', location.pathname + location.search + `#${id}`); } catch {}
      }
    };

    const syncFromHash = () => {
      const hashId = location.hash ? location.hash.slice(1).toLowerCase() : '';
      if (hashId === 'projects') { location.replace('/projects/'); return; }
      if (dialogs[hashId]) openPanel(hashId, null, false);
      else Object.values(dialogs).forEach(d => { if (d.open) d.close(); });
    };

    if (!panelsBound) {
      panelsBound = true;
      document.addEventListener('click', e => {
        const link = e.target?.closest?.('a[href^="#"]');
        const id = link?.getAttribute('href').slice(1).toLowerCase();
        if (!id || !dialogs[id]) return;
        e.preventDefault();
        openPanel(id, link, true);
      });

      for (const id of Object.keys(dialogs)) {
        const d = dialogs[id];
        d.addEventListener('click', e => {
          if (e.target?.closest?.('[data-close]')) { d.close(); return; }
          if (e.target === d) {
            const r = d.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
              d.close();
            }
          }
        });
        d.addEventListener('close', () => {
          if (location.hash === `#${id}`) {
            try { history.replaceState(null, '', location.pathname + location.search); } catch {}
          }
          (returnTargets[id] || document.querySelector(`a[href="#${id}"]`))?.focus?.();
        });
      }

      window.addEventListener('hashchange', syncFromHash);
      window.addEventListener('pageshow', e => { if (e.persisted) syncFromHash(); });
    }

    syncFromHash();
  }

  const COVER = { renderFan, startClock, initPanels };
  if (typeof module === 'object' && module.exports) module.exports = COVER;
  else window.COVER = COVER;
})();
