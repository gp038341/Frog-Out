import {readFileSync} from 'node:fs';
/** Historical baseline hashes still apply after reversing only documented M8 adapter edits.
 * arenas.test.ts independently requires those exact edits and the approved M7 full-file hash.
 */
export function iphonePreservedSource(path:string){let source=readFileSync(new URL(`../${path}`,import.meta.url),'utf8');const m=JSON.parse(readFileSync(new URL('../docs/iphone-reliability-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
export function preservedSource(path:string){
 let source=iphonePreservedSource(path);
 const manifest=JSON.parse(readFileSync(new URL('../docs/milestone-8-adapter-preservation.json',import.meta.url),'utf8'));
 for(const change of manifest.files[path]?.changes??[])source=source.replace(change.from,change.to);
 return source;
}
