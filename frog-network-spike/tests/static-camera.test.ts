import {m11PreservedSource} from './preserved-source';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('post-M10 production exactly preserves accepted static-camera and compatibility source',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../docs/milestone-10-preservation.json',import.meta.url),'utf8'));
 const files={...manifest.protected,'src/main.ts':manifest.files['src/main.ts'].sha256};
 for(const [path,hash] of Object.entries(files))assert.equal(createHash('sha256').update(m11PreservedSource(path)).digest('hex'),hash,path);
 for(const path of ['src/presentation/arena-camera.ts','src/presentation/camera-options.ts','src/presentation/camera-options.css'])assert.equal(existsSync(new URL(`../${path}`,import.meta.url)),false,path);
});
