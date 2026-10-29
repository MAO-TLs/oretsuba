import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read = path => readFileSync(new URL('../'+path, import.meta.url));
const json = path => JSON.parse(read(path));
const sha = value => createHash('sha256').update(value).digest('hex');

test('family sections preserve every main-game entry and have independent identities', () => {
  const corpus = json('public/script-data/concordance.json');
  const main = corpus.routes.filter(r => !['prelude','afterstory'].includes(r.id));
  assert.equal(sha(JSON.stringify(main.map(r=>({...r,scripts:r.scripts.map(s=>({...s,lines:s.lines.map(l=>[l[0],l[1],l[2],l[4],...l.slice(6)])}))})))), '32002fa910fda50ad7cbb5952de371949cbe5a720a11e4b9d07fad391629e5f8');
  for (const [id, records, scripts] of [['prelude',8936,54],['afterstory',18027,171]]) {
    const route = corpus.routes.find(r=>r.id===id);
    assert.equal(route.lineCount, records);
    assert.equal(route.scripts.length, scripts);
    assert.equal(route.scripts.reduce((n,s)=>n+s.lines.length,0),records);
    for (const script of route.scripts) {
      assert.ok(script.id.startsWith(id+'-'));
      const payload = json('public/script-data/'+script.id+'.json');
      assert.ok(payload.lines.every(r=>r.sourceRef.startsWith('oretsuba-'+id+':')));
      assert.ok(payload.lines.every(r=>!/[\u0000-\u0008\uf8f3]/u.test(r.japanese)));
    }
  }
});

test('each family installer matches its release, font, payload and download checksum', () => {
  const release = json('public/release.json');
  const checksums = read('public/SHA256SUMS.txt').toString();
  assert.equal(release.main_game_version, '1.2.13');
  assert.deepEqual(release.editions.map(e=>e.id), ['prelude','afterstory']);
  for (const edition of release.editions) {
    const prefix = 'installer/'+edition.id+'/';
    const patch = json(prefix+'patch.json');
    assert.equal(patch.version, edition.version);
    assert.equal(patch.version, '1.0.3');
    assert.equal(sha(read(prefix+'patch.dat')),patch.payload_sha256);
    assert.equal(sha(read(prefix+'mao-font.ttf')),release.font_sha256);
    assert.equal(patch.font_family,'MAO Gothic Q5I');
    for (const runtime of patch.runtime_files) {
      assert.equal(sha(read(prefix+runtime.name)), runtime.sha256);
    }
    assert.deepEqual(patch.files.map(f=>f.output_sha256),edition.files.map(f=>f.output_sha256));
    for (const file of ['install.py',`Install ${edition.title} English Patch.ps1`,'README.txt']) {
      assert.doesNotMatch(read(prefix+file).toString(), /1\.0\.0-rc1|v1\.2\.13 installed/);
    }
    assert.ok(checksums.includes(edition.zip_sha256+'  '+edition.file+'\n'));
    assert.ok(edition.url.endsWith('/v1.3.3/'+edition.file));
  }
});
