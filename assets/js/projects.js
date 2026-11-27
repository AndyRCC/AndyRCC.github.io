(() => {
  'use strict';

  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const GH = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';
  const svgIcon = d => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

  const fitMedia = window.matchMedia?.('(min-width: 900px) and (min-height: 560px)');
  let state = { filter: 'all', page: 1 };
  let totalPages = 1;
  let bound = false;

  const isFit = () => !fitMedia || fitMedia.matches;
  const validFilters = () => ['all', ...(window.SITE_DATA?.CATEGORIES || []).map(c => c.id)];

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  function buildCard(p, isFeature, fit) {
    const card = el('article', isFeature ? 'card feature' : 'card');
    card.setAttribute('data-fit', `card-${p.id}`);
    card.dataset.projectId = p.id;

    const media = el('div', 'media');
    media.style.viewTransitionName = `vt-${p.id}`;
    const clip = el('div', 'media-clip');
    clip.innerHTML = window.SITE_FIGURES?.[p.id] || '';
    clip.querySelector('svg')?.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    media.appendChild(clip);
    if (!isFeature && fit) {
      const sum = el('div', 'sum');
      sum.appendChild(el('span', 'sum-text', p.summary));
      media.appendChild(sum);
    }

    const kick = el('div', 'kick');
    kick.append(el('span', 'kick-text', isFeature ? `Cover story · ${p.kicker}` : p.kicker), el('span', 'no', p.no));

    const h2 = el('h2');
    const link = el('a', 'card-link', p.title);
    Object.assign(link, { href: p.url, target: '_blank', rel: 'noopener' });
    h2.appendChild(link);
    card.append(media, kick, h2);

    if (isFeature) {
      card.appendChild(el('p', 'feature-summary', p.summary));
      if (p.stats?.length) {
        const stats = el('div', 'stats');
        p.stats.forEach(s => {
          const cell = el('div');
          cell.append(el('b', null, s.value), el('span', null, s.label));
          stats.appendChild(cell);
        });
        card.appendChild(stats);
      }
    } else if (!fit) {
      card.appendChild(el('p', 'sum sum--flow', p.summary));
    }

    const actions = el('div', 'foot-actions');
    if (p.extra?.url) {
      const extra = el('a', 'extra-link', `${p.extra.label} ↗`);
      Object.assign(extra, { href: p.extra.url, target: '_blank', rel: 'noopener' });
      extra.setAttribute('aria-label', `${p.title} — ${p.extra.label}`);
      actions.appendChild(extra);
    }
    const open = el('span', 'open');
    open.setAttribute('aria-hidden', 'true');
    if (p.linkLabel === 'Code') open.innerHTML = `${GH}<span>Code ↗</span>`;
    else open.textContent = `${p.linkLabel} ↗`;
    actions.appendChild(open);

    const foot = el('div', 'foot');
    foot.append(el('div', 'tags', p.tags.join(' · ')), actions);
    card.appendChild(foot);
    return card;
  }

  function buildNextCard(nextNo) {
    const card = el('article', 'card next');
    card.setAttribute('data-fit', 'card-next');
    const plus = el('span', 'plus');
    plus.setAttribute('aria-hidden', 'true');
    plus.innerHTML = svgIcon('M12 5v14M5 12h14');
    const h2 = el('h2');
    h2.innerHTML = 'Your next build <i>loads here</i>';
    card.append(plus, h2, el('small', null, `P.${String(nextNo).padStart(2, '0')} · coming soon`));
    return card;
  }

  function syncUrl(s) {
    let hadFit = false;
    try { hadFit = new URLSearchParams(location.search).has('fitcheck'); } catch {}
    let qs = window.SITE_LAYOUT.stateToSearch(s);
    if (hadFit) qs = qs ? `${qs}&fitcheck` : '?fitcheck';
    const target = location.pathname + qs + location.hash;
    if (target !== location.pathname + location.search + location.hash) {
      try { history.replaceState(null, '', target); } catch {}
    }
  }

  function render(next, projectsOverride) {
    const projects = Array.isArray(projectsOverride) ? projectsOverride : (window.SITE_DATA?.PROJECTS || []);
    const reqF = typeof next?.filter === 'string' ? next.filter.toLowerCase() : 'all';
    const filter = validFilters().includes(reqF) ? reqF : 'all';
    const fit = isFit();
    const pages = window.SITE_LAYOUT.buildPages(projects, filter, fit ? 6 : Math.max(projects.length + 1, 7));
    totalPages = pages.length;
    const page = fit ? window.SITE_LAYOUT.clampPage(next?.page ?? 1, totalPages) : 1;
    const cur = pages[page - 1];

    state = { filter, page };
    syncUrl(state);

    const sub = document.getElementById('projectsSubtitle');
    if (sub) sub.textContent = `${WORDS[projects.length] ?? projects.length} things I've built end to end`;
    const cnt = document.getElementById('projectsCount');
    if (cnt) cnt.textContent = `${projects.length} ${projects.length === 1 ? 'build' : 'builds'} · more coming`;

    const fNav = document.getElementById('projectsFilters');
    if (fNav) {
      fNav.textContent = '';
      [{ id: 'all', label: 'All' }, ...(window.SITE_DATA?.CATEGORIES || [])].forEach(c => {
        const b = el('button', 'filter-btn' + (c.id === filter ? ' on' : ''), c.label);
        b.type = 'button';
        b.dataset.filter = c.id;
        b.setAttribute('aria-pressed', String(c.id === filter));
        fNav.appendChild(b);
      });
    }

    const pNav = document.getElementById('projectsPager');
    if (pNav) {
      const mk = (dir, label, pathD, disabled) => {
        const b = el('button', 'pg-btn');
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.dataset.page = String(page + dir);
        b.disabled = disabled;
        b.innerHTML = svgIcon(pathD);
        return b;
      };
      pNav.textContent = '';
      pNav.append(
        mk(-1, 'Previous page', 'm15 18-6-6 6-6', page <= 1),
        el('span', 'pg-status', `Page ${page} / ${totalPages}`),
        mk(1, 'Next page', 'm9 18 6-6-6-6', page >= totalPages)
      );
    }

    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();
    if (!cur?.feature) {
      const box = el('div', 'empty-state');
      box.setAttribute('data-fit', 'empty');
      const reset = el('a', 'ul empty-reset', 'Show all');
      reset.href = '/projects/';
      box.append(el('p', null, 'Nothing here yet.'), reset);
      frag.appendChild(box);
    } else {
      frag.appendChild(buildCard(cur.feature, true, fit));
      cur.items.forEach(item => frag.appendChild(buildCard(item, false, fit)));
      if (cur.showNext) frag.appendChild(buildNextCard(projects.length + 1));
      if (fit) {
        const used = cur.items.length + (cur.showNext ? 1 : 0);
        for (let i = used; i < 6; i++) {
          const blank = el('div', 'card blank');
          blank.setAttribute('aria-hidden', 'true');
          frag.appendChild(blank);
        }
      }
    }
    grid.textContent = '';
    grid.appendChild(frag);
  }

  function transitionTo(next) {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition === 'function' && !reduce) {
      document.startViewTransition(() => render(next));
    } else {
      render(next);
    }
  }

  function init() {
    render(window.SITE_LAYOUT.parseState(location.search, validFilters()));
    if (bound) return;
    bound = true;

    document.getElementById('projectsFilters')?.addEventListener('click', e => {
      const f = e.target?.closest?.('[data-filter]')?.dataset.filter;
      if (f && (f !== state.filter || state.page !== 1)) transitionTo({ filter: f, page: 1 });
    });

    document.getElementById('projectsPager')?.addEventListener('click', e => {
      const b = e.target?.closest?.('[data-page]');
      if (!b || b.disabled) return;
      const p = Number(b.dataset.page);
      if (p !== state.page) transitionTo({ filter: state.filter, page: p });
    });

    document.getElementById('projectsGrid')?.addEventListener('click', e => {
      if (!e.target?.closest?.('.empty-reset')) return;
      e.preventDefault();
      transitionTo({ filter: 'all', page: 1 });
    });

    document.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector('dialog[open]')) return;
      const a = document.activeElement;
      if (a && (['INPUT', 'TEXTAREA', 'SELECT'].includes(a.tagName) || a.isContentEditable)) return;
      if (e.key === 'Escape') location.href = '/';
      else if (isFit() && e.key === 'ArrowLeft' && state.page > 1) {
        e.preventDefault();
        transitionTo({ filter: state.filter, page: state.page - 1 });
      } else if (isFit() && e.key === 'ArrowRight' && state.page < totalPages) {
        e.preventDefault();
        transitionTo({ filter: state.filter, page: state.page + 1 });
      }
    });

    fitMedia?.addEventListener?.('change', () => render(state));
  }

  const PROJECTS_PAGE = { init, render };
  if (typeof module === 'object' && module.exports) module.exports = PROJECTS_PAGE;
  else window.PROJECTS_PAGE = PROJECTS_PAGE;
})();
