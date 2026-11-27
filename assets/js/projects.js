(function () {
  'use strict';

  var NUMBER_WORDS = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six',
    'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
  ];

  var GITHUB_ICON =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' +
    '<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z"/>' +
    '</svg>';

  var PLUS_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<path d="M12 5v14M5 12h14"/>' +
    '</svg>';

  var CHEVRON_LEFT =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="m15 18-6-6 6-6"/>' +
    '</svg>';

  var CHEVRON_RIGHT =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="m9 18 6-6-6-6"/>' +
    '</svg>';

  var currentState = { filter: 'all', page: 1 };
  var totalPages = 1;
  var bound = false;

  function numberWord(n) {
    return n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n);
  }

  function validFilterIds() {
    var cats = (window.SITE_DATA && window.SITE_DATA.CATEGORIES) || [];
    return ['all'].concat(cats.map(function (c) { return c.id; }));
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildOpenSpan(project) {
    var span = el('span', 'open');
    span.setAttribute('aria-hidden', 'true');
    if (project.linkLabel === 'Code') {
      span.innerHTML = GITHUB_ICON + '<span>Code ↗</span>';
    } else {
      span.textContent = project.linkLabel + ' ↗';
    }
    return span;
  }

  function buildCard(project, isFeature) {
    var article = el('article', isFeature ? 'card feature' : 'card');
    article.setAttribute('data-fit', 'card-' + project.id);
    article.setAttribute('data-project-id', project.id);

    var media = el('div', 'media');
    media.style.viewTransitionName = 'vt-' + project.id;
    var fig = (window.SITE_FIGURES && window.SITE_FIGURES[project.id]) || '';
    media.innerHTML = fig;

    if (!isFeature) {
      var sum = el('div', 'sum');
      sum.appendChild(el('span', 'sum-text', project.summary));
      media.appendChild(sum);
    }
    article.appendChild(media);

    var kick = el('div', 'kick');
    var kickText = el('span', 'kick-text', isFeature ? 'Cover story · ' + project.kicker : project.kicker);
    var no = el('span', 'no', project.no);
    kick.appendChild(kickText);
    kick.appendChild(no);
    article.appendChild(kick);

    var h2 = document.createElement('h2');
    var link = el('a', 'card-link', project.title);
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener';
    h2.appendChild(link);
    article.appendChild(h2);

    if (isFeature) {
      article.appendChild(el('p', 'feature-summary', project.summary));
      if (Array.isArray(project.stats) && project.stats.length) {
        var stats = el('div', 'stats');
        for (var i = 0; i < project.stats.length; i++) {
          var s = project.stats[i];
          var cell = document.createElement('div');
          var val = el('b', null, s.value);
          var lbl = el('span', null, s.label);
          cell.appendChild(val);
          cell.appendChild(lbl);
          stats.appendChild(cell);
        }
        article.appendChild(stats);
      }
    }

    var foot = el('div', 'foot');
    var tags = el('div', 'tags', project.tags.join(' · '));
    foot.appendChild(tags);

    var actions = el('div', 'foot-actions');
    if (project.extra && project.extra.url) {
      var extra = el('a', 'extra-link', project.extra.label + ' ↗');
      extra.href = project.extra.url;
      extra.target = '_blank';
      extra.rel = 'noopener';
      extra.setAttribute('aria-label', project.title + ' — ' + project.extra.label);
      actions.appendChild(extra);
    }
    actions.appendChild(buildOpenSpan(project));
    foot.appendChild(actions);
    article.appendChild(foot);

    return article;
  }

  function buildNextCard(nextNumber) {
    var card = el('article', 'card next');
    card.setAttribute('data-fit', 'card-next');

    var plus = el('span', 'plus');
    plus.setAttribute('aria-hidden', 'true');
    plus.innerHTML = PLUS_ICON;
    card.appendChild(plus);

    var h2 = document.createElement('h2');
    h2.innerHTML = 'Your next build <i>loads here</i>';
    card.appendChild(h2);

    var code = 'P.' + String(nextNumber).padStart(2, '0');
    card.appendChild(el('small', null, code + ' · coming soon'));

    return card;
  }

  function buildEmptyState() {
    var box = el('div', 'empty-state');
    box.setAttribute('data-fit', 'empty');
    box.appendChild(el('p', null, 'Nothing here yet.'));
    var reset = el('a', 'ul empty-reset', 'Show all');
    reset.href = '/projects/';
    box.appendChild(reset);
    return box;
  }

  function renderFilters(activeFilter) {
    var nav = document.getElementById('projectsFilters');
    if (!nav) return;

    var cats = (window.SITE_DATA && window.SITE_DATA.CATEGORIES) || [];
    var items = [{ id: 'all', label: 'All' }].concat(cats);
    var frag = document.createDocumentFragment();

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var btn = el('button', 'filter-btn' + (item.id === activeFilter ? ' on' : ''), item.label);
      btn.type = 'button';
      btn.setAttribute('data-filter', item.id);
      btn.setAttribute('aria-pressed', item.id === activeFilter ? 'true' : 'false');
      frag.appendChild(btn);
    }

    nav.textContent = '';
    nav.appendChild(frag);
  }

  function renderPager(page, total) {
    var nav = document.getElementById('projectsPager');
    if (!nav) return;

    nav.textContent = '';

    var prev = el('button', 'pg-btn');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous page');
    prev.setAttribute('data-page', String(page - 1));
    prev.disabled = page <= 1;
    prev.innerHTML = CHEVRON_LEFT;

    var status = el('span', 'pg-status', 'Page ' + page + ' / ' + total);

    var next = el('button', 'pg-btn');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next page');
    next.setAttribute('data-page', String(page + 1));
    next.disabled = page >= total;
    next.innerHTML = CHEVRON_RIGHT;

    nav.appendChild(prev);
    nav.appendChild(status);
    nav.appendChild(next);
  }

  function syncUrl(state) {
    var hadFitcheck = false;
    try {
      hadFitcheck = new URLSearchParams(window.location.search).has('fitcheck');
    } catch (e) {}

    var search = window.SITE_LAYOUT.stateToSearch(state);
    if (hadFitcheck) {
      search = search ? search + '&fitcheck' : '?fitcheck';
    }

    var target = window.location.pathname + search + window.location.hash;
    var current = window.location.pathname + window.location.search + window.location.hash;
    if (target !== current) {
      try {
        history.replaceState(null, '', target);
      } catch (e) {}
    }
  }

  function render(state, projectsOverride) {
    var projects = Array.isArray(projectsOverride)
      ? projectsOverride
      : ((window.SITE_DATA && window.SITE_DATA.PROJECTS) || []);

    var allowed = validFilterIds();
    var reqFilter = state && typeof state.filter === 'string' ? state.filter.toLowerCase() : 'all';
    var filter = allowed.indexOf(reqFilter) !== -1 ? reqFilter : 'all';

    var pages = window.SITE_LAYOUT.buildPages(projects, filter, 6);
    totalPages = pages.length;
    var pageNum = window.SITE_LAYOUT.clampPage(state ? state.page : 1, totalPages);
    var pageData = pages[pageNum - 1];

    currentState = { filter: filter, page: pageNum };
    syncUrl(currentState);

    var subtitle = document.getElementById('projectsSubtitle');
    if (subtitle) {
      subtitle.textContent = numberWord(projects.length) + " things I've built end to end";
    }

    var countEl = document.getElementById('projectsCount');
    if (countEl) {
      countEl.textContent = projects.length + (projects.length === 1 ? ' build' : ' builds') + ' · more coming';
    }

    renderFilters(filter);
    renderPager(pageNum, totalPages);

    var grid = document.getElementById('projectsGrid');
    if (!grid) return;

    var frag = document.createDocumentFragment();
    if (!pageData || !pageData.feature) {
      frag.appendChild(buildEmptyState());
    } else {
      frag.appendChild(buildCard(pageData.feature, true));
      for (var i = 0; i < pageData.items.length; i++) {
        frag.appendChild(buildCard(pageData.items[i], false));
      }
      if (pageData.showNext) {
        frag.appendChild(buildNextCard(projects.length + 1));
      }
    }

    grid.textContent = '';
    grid.appendChild(frag);
  }

  function transitionTo(nextState) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition === 'function' && !reduce) {
      document.startViewTransition(function () {
        render(nextState);
      });
    } else {
      render(nextState);
    }
  }

  function init() {
    var initial = window.SITE_LAYOUT.parseState(window.location.search, validFilterIds());
    render(initial);

    if (bound) return;
    bound = true;

    var filtersEl = document.getElementById('projectsFilters');
    if (filtersEl) {
      filtersEl.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('[data-filter]') : null;
        if (!btn) return;
        var nextFilter = btn.getAttribute('data-filter');
        if (nextFilter === currentState.filter && currentState.page === 1) return;
        transitionTo({ filter: nextFilter, page: 1 });
      });
    }

    var pagerEl = document.getElementById('projectsPager');
    if (pagerEl) {
      pagerEl.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('[data-page]') : null;
        if (!btn || btn.disabled) return;
        var nextPage = Number(btn.getAttribute('data-page'));
        if (nextPage === currentState.page) return;
        transitionTo({ filter: currentState.filter, page: nextPage });
      });
    }

    var gridEl = document.getElementById('projectsGrid');
    if (gridEl) {
      gridEl.addEventListener('click', function (e) {
        var reset = e.target && e.target.closest ? e.target.closest('.empty-reset') : null;
        if (!reset) return;
        e.preventDefault();
        transitionTo({ filter: 'all', page: 1 });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var active = document.activeElement;
      if (active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.isContentEditable
      )) {
        return;
      }
      if (document.querySelector('dialog[open]')) return;

      if (e.key === 'Escape') {
        window.location.href = '/';
      } else if (e.key === 'ArrowLeft' && currentState.page > 1) {
        e.preventDefault();
        transitionTo({ filter: currentState.filter, page: currentState.page - 1 });
      } else if (e.key === 'ArrowRight' && currentState.page < totalPages) {
        e.preventDefault();
        transitionTo({ filter: currentState.filter, page: currentState.page + 1 });
      }
    });
  }

  var PROJECTS_PAGE = {
    init: init,
    render: render
  };

  if (typeof module === 'object' && module.exports) module.exports = PROJECTS_PAGE;
  else window.PROJECTS_PAGE = PROJECTS_PAGE;
})();
