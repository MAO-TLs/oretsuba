import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('public release retains the existing design and links its versioned patch',()=>{
 const home=read('dist/client/index.html');
 const release=JSON.parse(read('public/release.json'));
 assert.match(home,/ORETACHI\sNI<br\/>TSUBASA\sWA<br\/>NAI/);
 assert.match(home,/releases\/download\/v1.2.0\/OreTsuba-English-v1.2.0.zip/);
 assert.equal(release.version,'1.2.0');
 assert.equal(release.v120_unique_refs,6099);
 assert.match(read('public/SHA256SUMS.txt'),new RegExp('^'+release.zip_sha256+'  OreTsuba-English-v1\\.2\\.0\\.zip\\n$'));
 assert.doesNotMatch(home,/Local preview|Local test build|noindex|disabled|In preparation/);
 assert.match(home,/\/oretsuba\/assets\//);
 assert.doesNotMatch(home,/"\/assets\//);
 assert.match(read('dist/client/script/index.html'),/57,797/);
});
test('all 389 scripts and all 57797 bilingual entries are coherent',()=>{
 const index=JSON.parse(read('public/script-data/index.json'));
 const corpus=JSON.parse(read('public/script-data/concordance.json'));
 assert.equal(index.version,'v1.2.0');assert.equal(corpus.version,'v1.2.0');
 assert.equal(index.totalLines,57797);assert.equal(corpus.totalLines,57797);
 assert.ok(!index.routes.some(r=>r.id==='section-03c'));
 const merged=index.routes.find(r=>r.id==='section-03');assert.equal(merged.lineCount,20062);assert.equal(merged.scripts.length,116);
 let count=0,scripts=0;const refs=new Set();
 for(const route of index.routes)for(const script of route.scripts){
  scripts++;const payload=JSON.parse(read('public/script-data/'+script.file));
  assert.equal(payload.route,route.id);assert.equal(payload.lines.length,script.lineCount);
  const other=corpus.routes.find(r=>r.id===route.id).scripts.find(s=>s.id===script.id);
  for(let i=0;i<payload.lines.length;i++){
   const line=payload.lines[i];assert.ok(!refs.has(line.ref));refs.add(line.ref);
   assert.equal(line.english,other.lines[i][5]);assert.equal(line.japanese,other.lines[i][4]);
   assert.ok(line.ref.startsWith('oretsuba:'+route.id+':'+script.id+':'));
  }count+=payload.lines.length;
 }
 assert.equal(count,57797);assert.equal(scripts,389);
});
