import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('reader uses the shared script-version label', () => {
  assert.ok(read("app/script/page.tsx").includes("Script version {stats.version}"));
});

test('GitHub navigation opens this title repository', () => {
  for (const file of ["app/SiteNav.tsx"]) {
    const text = read(file);
    assert.ok(text.includes('href="https://github.com/MAO-TLs/oretsuba">GitHub</a>'), file);
    assert.ok(!text.includes('href="https://github.com/MAO-TLs">GitHub</a>'), file);
  }
});

test('release metadata links to the existing installation section', () => {
  const home = read("app/page.tsx");
  assert.ok(home.includes('href="#install">Installation instructions</a>'));
  assert.ok(home.includes('id="install"'));
  assert.ok(home.includes('Release v1.3.2'));
});

test('reader version is bound to the published script data, not a stale literal', () => {
  const stats = JSON.parse(read('public/script-data/summary.json'));
  assert.equal(stats.version, 'v1.3.2');
  assert.ok(!read('app/script/page.tsx').includes('v1.2.0'));
  assert.ok(read('app/script/ScriptBrowser.tsx').includes('Script version {index?.version'));
  assert.ok(!read('app/script/ScriptBrowser.tsx').includes('English script · v1.2.0'));
});

