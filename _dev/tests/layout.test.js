const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPages, clampPage, parseState, stateToSearch } = require('../../assets/js/layout.js');
const { PROJECTS } = require('../../assets/js/data.js');
const ids = list => list.map(p => p.id);
const FILTERS = ['all', 'ai', 'inst', 'research', 'soft'];
const fake = (n, featuredIndex) =>
  Array.from({ length: n }, (_, i) => ({ id: 'p' + i, cats: ['soft'], ...(i === featuredIndex ? { featured: true } : {}) }));

test('all: one page, hydradetect featured, five items, next-build slot', () => {
  const pages = buildPages(PROJECTS, 'all', 6);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].feature.id, 'hydradetect');
  assert.deepEqual(ids(pages[0].items), ['reservoir', 'meter-verification', 'erdos-straus', 'bsd-audit', 'hoardling']);
  assert.equal(pages[0].showNext, true);
});

test('unknown filter behaves like all', () => {
  assert.deepEqual(buildPages(PROJECTS, 'xyz', 6), buildPages(PROJECTS, 'all', 6));
});

test('research: first match becomes the feature', () => {
  const [p] = buildPages(PROJECTS, 'research', 6);
  assert.equal(p.feature.id, 'erdos-straus');
  assert.deepEqual(ids(p.items), ['bsd-audit']);
  assert.equal(p.showNext, true);
});

test('soft: no featured match, falls back to the first match', () => {
  const [p] = buildPages(PROJECTS, 'soft', 6);
  assert.equal(p.feature.id, 'reservoir');
  assert.deepEqual(ids(p.items), ['hoardling']);
});

test('ai: feature only', () => {
  const pages = buildPages(PROJECTS, 'ai', 6);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].feature.id, 'hydradetect');
  assert.deepEqual(pages[0].items, []);
  assert.equal(pages[0].showNext, true);
});

test('12 projects: 6 + 5, feature repeated on every page', () => {
  const pages = buildPages(fake(12, 3), 'all', 6);
  assert.equal(pages.length, 2);
  assert.equal(pages[0].feature.id, 'p3');
  assert.equal(pages[1].feature.id, 'p3');
  assert.deepEqual(ids(pages[0].items), ['p0', 'p1', 'p2', 'p4', 'p5', 'p6']);
  assert.deepEqual(ids(pages[1].items), ['p7', 'p8', 'p9', 'p10', 'p11']);
  assert.equal(pages[0].showNext, false);
  assert.equal(pages[1].showNext, true);
});

test('13 projects: last page full, no next-build slot', () => {
  const pages = buildPages(fake(13, 0), 'all', 6);
  assert.equal(pages.length, 2);
  assert.equal(pages[1].items.length, 6);
  assert.equal(pages[0].showNext, false);
  assert.equal(pages[1].showNext, false);
});

test('empty list', () => {
  assert.deepEqual(buildPages([], 'all', 6), [{ feature: null, items: [], showNext: false }]);
});

test('clampPage', () => {
  assert.equal(clampPage(5, 2), 2);
  assert.equal(clampPage(0, 2), 1);
  assert.equal(clampPage(2, 2), 2);
  assert.equal(clampPage(NaN, 3), 1);
});

test('parseState', () => {
  assert.deepEqual(parseState('', FILTERS), { filter: 'all', page: 1 });
  assert.deepEqual(parseState('?f=research&p=2', FILTERS), { filter: 'research', page: 2 });
  assert.deepEqual(parseState('?f=AI', FILTERS), { filter: 'ai', page: 1 });
  assert.deepEqual(parseState('?f=nope&p=-3', FILTERS), { filter: 'all', page: 1 });
  assert.deepEqual(parseState('?p=abc', FILTERS), { filter: 'all', page: 1 });
  assert.deepEqual(parseState('?p=9', FILTERS), { filter: 'all', page: 9 });
});

test('stateToSearch', () => {
  assert.equal(stateToSearch({ filter: 'all', page: 1 }), '');
  assert.equal(stateToSearch({ filter: 'research', page: 2 }), '?f=research&p=2');
  assert.equal(stateToSearch({ filter: 'all', page: 3 }), '?p=3');
  assert.equal(stateToSearch({ filter: 'ai', page: 1 }), '?f=ai');
});
