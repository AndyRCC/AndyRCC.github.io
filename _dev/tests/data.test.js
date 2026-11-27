const test = require('node:test');
const assert = require('node:assert/strict');
const { PROJECTS, CATEGORIES } = require('../../assets/js/data.js');
const FIGURES = require('../../assets/js/figures.js');

test('six projects in the approved order', () => {
  assert.deepEqual(PROJECTS.map(p => p.id),
    ['hydradetect', 'reservoir', 'meter-verification', 'erdos-straus', 'bsd-audit', 'hoardling']);
  assert.deepEqual(PROJECTS.map(p => p.no), ['P.01', 'P.02', 'P.03', 'P.04', 'P.05', 'P.06']);
});

test('required fields', () => {
  for (const p of PROJECTS) {
    for (const k of ['id', 'no', 'title', 'short', 'kicker', 'summary', 'url', 'linkLabel'])
      assert.ok(typeof p[k] === 'string' && p[k].trim(), `${p.id}.${k}`);
    assert.ok(Array.isArray(p.tags) && p.tags.length >= 2, `${p.id}.tags`);
    assert.ok(p.url.startsWith('https://'), `${p.id}.url`);
    assert.ok(['Open', 'Code'].includes(p.linkLabel), `${p.id}.linkLabel`);
    assert.ok(p.summary.length <= 240, `${p.id}.summary has ${p.summary.length} chars`);
    if (p.extra) assert.ok(p.extra.url.startsWith('https://'), `${p.id}.extra.url`);
  }
});

test('known categories', () => {
  const ids = CATEGORIES.map(c => c.id);
  assert.deepEqual(ids, ['ai', 'inst', 'research', 'soft']);
  for (const p of PROJECTS) {
    assert.ok(p.cats.length >= 1, `${p.id} has no category`);
    for (const c of p.cats) assert.ok(ids.includes(c), `${p.id} has unknown category ${c}`);
  }
});

test('exactly one featured project with three stats', () => {
  const f = PROJECTS.filter(p => p.featured);
  assert.equal(f.length, 1);
  assert.equal(f[0].id, 'hydradetect');
  assert.equal(f[0].stats.length, 3);
});

test('every project has a figure', () => {
  for (const p of PROJECTS) assert.ok(FIGURES[p.id], `missing figure for ${p.id}`);
});

test('client name never appears in visible project text', () => {
  const text = PROJECTS.map(p => [p.title, p.short, p.kicker, p.summary, ...p.tags].join(' ')).join(' ');
  assert.doesNotMatch(text, /emapica/i);
});
