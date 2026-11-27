(function () {
  'use strict';

  var DEFAULT_CATS = ['ai', 'inst', 'research', 'soft'];

  function buildPages(projects, filter, perPage) {
    var list = Array.isArray(projects) ? projects : [];
    var size = Math.max(1, Number(perPage) || 6);
    var f = typeof filter === 'string' && filter.trim() ? filter.trim().toLowerCase() : 'all';

    var known = new Set(DEFAULT_CATS);
    for (var i = 0; i < list.length; i++) {
      var cats = list[i] && list[i].cats;
      if (Array.isArray(cats)) {
        for (var j = 0; j < cats.length; j++) known.add(String(cats[j]).toLowerCase());
      }
    }

    var filtered = (f === 'all' || !known.has(f))
      ? list.slice()
      : list.filter(function (p) {
          return Array.isArray(p.cats) && p.cats.indexOf(f) !== -1;
        });

    if (filtered.length === 0) {
      return [{ feature: null, items: [], showNext: false }];
    }

    var feature = filtered.find(function (p) { return Boolean(p.featured); }) || filtered[0];
    var rest = filtered.filter(function (p) { return p !== feature; });

    if (rest.length === 0) {
      return [{ feature: feature, items: [], showNext: true }];
    }

    var pages = [];
    for (var offset = 0; offset < rest.length; offset += size) {
      var chunk = rest.slice(offset, offset + size);
      var isLast = offset + size >= rest.length;
      pages.push({
        feature: feature,
        items: chunk,
        showNext: isLast && chunk.length < size
      });
    }
    return pages;
  }

  function clampPage(page, total) {
    var max = Math.max(1, Number(total) || 1);
    var n = Number(page);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(Math.floor(n), max);
  }

  function parseState(search, validFilters) {
    var params = new URLSearchParams(search || '');
    var allowed = Array.isArray(validFilters)
      ? validFilters.map(function (v) { return String(v).toLowerCase(); })
      : ['all'].concat(DEFAULT_CATS);

    var rawF = (params.get('f') || 'all').trim().toLowerCase();
    var filter = allowed.indexOf(rawF) !== -1 ? rawF : 'all';

    var rawP = (params.get('p') || '').trim();
    var page = 1;
    if (/^\d+$/.test(rawP)) {
      var n = Number(rawP);
      if (Number.isSafeInteger(n) && n >= 1) page = n;
    }

    return { filter: filter, page: page };
  }

  function stateToSearch(state) {
    var s = state || {};
    var params = new URLSearchParams();
    if (s.filter && s.filter !== 'all') params.set('f', s.filter);
    if (s.page && s.page > 1) params.set('p', String(s.page));
    var qs = params.toString();
    return qs ? '?' + qs : '';
  }

  var SITE_LAYOUT = {
    buildPages: buildPages,
    clampPage: clampPage,
    parseState: parseState,
    stateToSearch: stateToSearch
  };

  if (typeof module === 'object' && module.exports) module.exports = SITE_LAYOUT;
  else window.SITE_LAYOUT = SITE_LAYOUT;
})();
