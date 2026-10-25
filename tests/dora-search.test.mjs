import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matchesReaderText} from '../app/script/reader-search.mjs';
test('reported Dora search excludes adorable and agrees in script and corpus scopes', () => {
  const base = new URL('../public/script-data/', import.meta.url);
  const corpus = JSON.parse(readFileSync(new URL('concordance.json',base)));
  const scriptRefs = [], corpusRefs = [];
  for (const route of corpus.routes) for (const script of route.scripts) {
    for (const row of script.lines) if (matchesReaderText([row[0],row[2],row[3],row[4],row[5],row[6],row[8]??''].join('\0'),'dora')) corpusRefs.push(row[0]);
    const payload = JSON.parse(readFileSync(new URL(script.id+'.json',base)));
    for (const row of payload.lines) if ([row.ref,row.speakerJa,row.speakerEn,row.japanese,row.audioJapanese??'',row.english].some(x=>matchesReaderText(x,'dora'))) scriptRefs.push(row.ref);
  }
  assert.deepEqual(scriptRefs.sort(),corpusRefs.sort());
  assert.equal(corpusRefs.filter(ref=>!ref.startsWith('oretsuba:prelude:')&&!ref.startsWith('oretsuba:afterstory:')).length,307);
  assert.ok(corpusRefs.some(ref=>ref.startsWith('oretsuba:prelude:')));
  assert.ok(corpusRefs.some(ref=>ref.startsWith('oretsuba:afterstory:')));
  for (const ref of ['oretsuba:section-02:s02_02a:0001b5a8','oretsuba:section-02:s02_02a:0001b4a7']) assert.ok(!corpusRefs.includes(ref));
  const source=readFileSync(new URL('../app/script/ScriptBrowser.tsx',import.meta.url),'utf8');
  assert.match(source,/matchesReaderText\(normalized, needle\)/);
  assert.match(source,/matchesReaderText\(primaryHaystack, normalizedCorpusQuery\)/);
  assert.match(source,/matchesReaderText\(comparisonHaystack, normalizedCorpusQuery\)/);
});
