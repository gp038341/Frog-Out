import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {m16PreservedSource} from './preserved-source';
test('M16 documented adapters preserve every touched approved M15 source exactly',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../docs/milestone-16-preservation.json',import.meta.url),'utf8'));
 for(const [path,record] of Object.entries(manifest.files) as [string,{beforeSha256:string}][])
  assert.equal(createHash('sha256').update(m16PreservedSource(path)).digest('hex'),record.beforeSha256,path);
});
