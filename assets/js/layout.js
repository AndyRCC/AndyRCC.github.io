(() => {
  'use strict';

  const DEFAULT_CATS = ['ai', 'inst', 'research', 'soft'];

  function buildPages(projects, filter, perPage = 6) {
    const list = Array.isArray(projects) ? projects : [];
    const size = Math.max(1, Number(perPage) || 6);
    const f = typeof filter === 'string' && filter.trim() ? filter.trim().toLowerCase() : 'all';

    const known = new Set(DEFAULT_CATS);
    for (const p of list) {
      if (Array.isArray(p?.cats)) p.cats.forEach(c => known.add(String(c).toLowerCase()));
    }

    const filtered = f === 'all' || !known.has(f)
      ? list.slice()
      : list.filter(p => Array.isArray(p.cats) && p.cats.includes(f));

    if (!filtered.length) return [{ feature: null, items: [], showNext: false }];

    const feature = filtered.find(p => Boolean(p.featured)) || filtered[0];
    const rest = filtered.filter(p => p !== feature);
    if (!rest.length) return [{ feature, items: [], showNext: true }];

    const pages = [];
    for (let i = 0; i < rest.length; i += size) {
      const items = rest.slice(i, i + size);
      const isLast = i + size >= rest.length;
      pages.push({ feature, items, showNext: isLast && items.length < size });
    }
    return pages;
  }

  function clampPage(page, total) {
    const max = Math.max(1, Number(total) || 1);
    const n = Number(page);
    return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), max) : 1;
  }

  function parseState(search, validFilters) {
    const params = new URLSearchParams(search || '');
    const allowed = Array.isArray(validFilters)
      ? validFilters.map(v => String(v).toLowerCase())
      : ['all', ...DEFAULT_CATS];
    const rawF = (params.get('f') || 'all').trim().toLowerCase();
    const filter = allowed.includes(rawF) ? rawF : 'all';
    const rawP = (params.get('p') || '').trim();
    const n = /^\d+$/.test(rawP) ? Number(rawP) : 1;
    const page = Number.isSafeInteger(n) && n >= 1 ? n : 1;
    return { filter, page };
  }

  function stateToSearch({ filter, page } = {}) {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.set('f', filter);
    if (page && page > 1) params.set('p', String(page));
    const qs = params.toString();
    return qs ? '?' + qs : '';
  }

  const SITE_LAYOUT = { buildPages, clampPage, parseState, stateToSearch };
  if (typeof module === 'object' && module.exports) module.exports = SITE_LAYOUT;
  else window.SITE_LAYOUT = SITE_LAYOUT;
})();
