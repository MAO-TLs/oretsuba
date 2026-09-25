import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('release and reader share the deployed wing favicon', () => {
  for (const page of ['index.html', 'script/index.html']) {
    const html = readFileSync(new URL('../dist/client/' + page, import.meta.url), 'utf8');
    assert.match(html, /href="\/oretsuba\/favicon\.svg"/);
  }
  const svg = readFileSync(new URL('../dist/client/favicon.svg', import.meta.url), 'utf8');
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(svg, /#390d29/);
});
