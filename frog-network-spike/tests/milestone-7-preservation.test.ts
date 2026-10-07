import {preservedSource} from './preserved-source';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('Milestone 7 preserves M6 physics, graphics, touch recovery, networking, scoring and fullscreen',()=>{
 const b=JSON.parse(readFileSync(new URL('../docs/milestone-7-preservation.json',import.meta.url),'utf8'));
 const hash=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
 for(const [path,expected] of Object.entries(b.sha256))assert.equal(hash(preservedSource(path)),expected,path);
 const main=preservedSource('src/main.ts');
 for(const block of b.mainProtectedBlocks)assert.equal(hash(main.slice(main.indexOf(block.start),main.indexOf(block.end))),block.sha256,block.start);
});
