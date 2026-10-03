import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('public release retains the existing design and links its versioned patch',()=>{
 const home=read('dist/client/index.html');
 const release=JSON.parse(read('public/release.json'));
 assert.match(home,/ORETACHI\sNI<br\/>TSUBASA\sWA<br\/>NAI/);
 assert.match(home,/releases\/download\/v1.2.7\/OreTsuba-English-v1.2.7.zip/);
 assert.equal(release.version,'1.2.7');
 assert.equal(release.v120_unique_refs,8722);
 assert.equal(release.hepburn_name_dialogue_rows,1044);
 assert.equal(release.american_english_dialogue_rows,75);
 assert.equal(release.wordplay_equivalence_records,240);
 assert.equal(release.wordplay_equivalence_lines_changed,236);
 assert.equal(release.wordplay_equivalence_clusters_applied,163);
 assert.equal(release.metalinguistic_localization_records,29);
 assert.equal(release.linguistic_device_lines_changed,263);
 assert.equal(release.reported_display_text_corrections,1);
 assert.equal(release.engine_safety_corrections,1);
 assert.equal(release.speaker_label_fit_forms,79);
 assert.equal(release.speaker_label_fit_records,229);
 assert.equal(release.speaker_nameplate_glyph_limit,17);
 assert.match(read('public/SHA256SUMS.txt'),new RegExp('^'+release.zip_sha256+'  OreTsuba-English-v1\\.2\\.7\\.zip\\n$'));
 assert.doesNotMatch(home,/Local preview|Local test build|noindex|disabled|In preparation/);
 assert.match(home,/\/oretsuba\/assets\//);
 assert.doesNotMatch(home,/"\/assets\//);
 assert.match(read('dist/client/script/index.html'),/57,797/);
});
test('all 389 scripts and all 57797 bilingual entries are coherent',()=>{
 const index=JSON.parse(read('public/script-data/index.json'));
 const corpus=JSON.parse(read('public/script-data/concordance.json'));
 assert.equal(index.version,'v1.2.7');assert.equal(corpus.version,'v1.2.7');
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
test('v1.2.7 reader carries the reported display-safe dialogue revision',()=>{
 const script=JSON.parse(read('public/script-data/s02_03f.json'));
 const line=script.lines.find(row=>row.ref==='oretsuba:section-02:s02_03f:0000e977');
 assert.equal(line.english,'“Hmm. A table ninety centimeters wide... Exactly five B5 issues of *Monthly S&M Erotichronicle* fit side by side without a gap...”');
});
test('v1.2.7 reader carries the engine-safe symbolic-outburst repair',()=>{
 const script=JSON.parse(read('public/script-data/s03_07b.json'));
 const line=script.lines.find(row=>row.ref==='oretsuba:section-03:s03_07b:00017a4d');
 assert.equal(line.japanese,'「○×△＃※％＆──っ！」');
 assert.equal(line.english,'“Gyaaaah!”');
});
test('v1.2.7 reader carries normalized names and fitted nameplates',()=>{
 const corpus=JSON.parse(read('public/script-data/concordance.json'));
 const lines=corpus.routes.flatMap(route=>route.scripts.flatMap(script=>script.lines));
 const speakers=new Set(lines.map(line=>line[3]));
 const english=lines.map(line=>line[5]).join('\n');
 assert.ok(speakers.has('Shuusuke'));
 assert.ok(speakers.has('Youji'));
 assert.ok(!speakers.has('Shusuke'));
 assert.ok(!speakers.has('Yoji'));
 assert.doesNotMatch(english,/\b(?:Shusuke|Yoji|Kyoya|Kurodo|Haryu)\b/);
 assert.ok([...speakers].every(label=>[...label].length<=17));
 assert.ok(speakers.has('Back-Row Longhair'));
 assert.ok(!speakers.has('Long-Haired Man at the Back'));
});

test('v1.2.7 pairs the italic script with its font and matching installer version',()=>{
 const release=JSON.parse(read('public/release.json'));
 const patch=JSON.parse(read('installer/patch.json'));
 assert.equal(release.inline_italics,true);
 assert.equal(release.italic_display_rows,969);
 assert.equal(release.ampersand_display_rows,4);
 assert.equal(patch.version,'1.2.7');
 assert.equal(patch.font_family,'MAO Gothic Q4I');
 assert.equal(patch.font_sha256,release.font_sha256);
 assert.deepEqual(patch.files.map(f=>f.output_sha256),release.files.map(f=>f.output_sha256));
 assert.match(read('installer/install.py'),/English v1\.2\.7 installed/);
 assert.match(read('installer/Install English Patch.ps1'),/English v1\.2\.7 installed/);
 assert.doesNotMatch(read('installer/Install English Patch.ps1'),/MAOGothicQ3/);
});

test('v1.2.7 restores quotation marks and the reported wordless reaction',()=>{
 const release=JSON.parse(read('public/release.json'));
 assert.equal(release.dialogue_quote_repairs,980);
 assert.equal(release.hayato_section_quote_repairs,304);
 assert.equal(release.wordless_reaction_repairs,1);
 const script=JSON.parse(read('public/script-data/s03_15g.json'));
 assert.equal(script.lines.find(r=>r.ref==='oretsuba:section-03:s03_15g:0001c961').english,'“...!”');
 const index=JSON.parse(read('public/script-data/index.json'));
 for(const route of index.routes)for(const item of route.scripts){
  for(const row of JSON.parse(read('public/script-data/'+item.file)).lines){
   const jp=row.japanese.replace(/^(?:<-?\d+>\\?\s*)+/, '').trim();
   const en=row.english.replace(/^(?:<-?\d+>\s*)+/, '').trim();
   if(jp.startsWith('「')&&jp.endsWith('」')){
    assert.ok(en.startsWith('“')||en.startsWith('"'),row.ref+' opening');
    assert.ok(en.endsWith('”')||en.endsWith('"'),row.ref+' closing');
   }
  }
 }
});
