const test = require('node:test');
const assert = require('node:assert/strict');
const FIGURES = require('../../assets/js/figures.js');

test('figures are safe, theme-able inline svg', () => {
  assert.equal(Object.keys(FIGURES).length, 6);
  for (const [id, svg] of Object.entries(FIGURES)) {
    assert.match(svg, /^<svg /, id);
    assert.match(svg, /viewBox="0 0 320 200"/, id);
    assert.match(svg, /preserveAspectRatio="xMidYMid slice"/, id);
    assert.match(svg, /aria-hidden="true"/, id);
    assert.doesNotMatch(svg, /<script|\son\w+=|\sid=/i, `${id} has script, handler or id`);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i, `${id} uses a fixed color`);
  }
});
