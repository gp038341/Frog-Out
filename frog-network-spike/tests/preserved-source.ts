import {readFileSync} from 'node:fs';
/** Historical baseline hashes still apply after reversing only documented M8 adapter edits.
 * arenas.test.ts independently requires those exact edits and the approved M7 full-file hash.
 */
export function m9PreservedSource(path:string){let source=multitouchPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-9-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
export function iphonePreservedSource(path:string){let source=m9PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-reliability-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
export function preservedSource(path:string){
 let source=iphonePreservedSource(path);
 const manifest=JSON.parse(readFileSync(new URL('../docs/milestone-8-adapter-preservation.json',import.meta.url),'utf8'));
 for(const change of manifest.files[path]?.changes??[])source=source.replace(change.from,change.to);
 return source;
}

export function multitouchPreservedSource(path:string){let source=recoveryPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-multitouch-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function recoveryPreservedSource(path:string){let source=viewportPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-recovery-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function viewportPreservedSource(path:string){let source=m11PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-viewport-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m11PreservedSource(path:string){let source=m12PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-11-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m12PreservedSource(path:string){let source=m13PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-12-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m13PreservedSource(path:string){let source=refinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-13-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function refinementPreservedSource(path:string){let source=m14PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-13-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m14PreservedSource(path:string){let source=bathhousePreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-14-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function bathhousePreservedSource(path:string){let source=toyshopRosterPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/bubblewash-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

function toyshopRosterPreservedSource(path:string){let source=soapPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/toyshop-roster-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function soapPreservedSource(path:string){let source=m15PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/soap-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m15PreservedSource(path:string){let source=m16PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-15-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m16PreservedSource(path:string){let source=classicPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-16-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosBRefinementPreservedSource(path:string){let source=readFileSync(new URL(`../${path}`,import.meta.url),'utf8');const m=JSON.parse(readFileSync(new URL('../docs/chaos-b-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosBPreservedSource(path:string){let source=chaosBRefinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-b-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosPreservedSource(path:string){let source=chaosBPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-a-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function classicPreservedSource(path:string){let source=chaosPreservedSource(path);const m17=JSON.parse(readFileSync(new URL('../docs/milestone-17-preservation.json',import.meta.url),'utf8'));for(const c of m17.files[path]?.changes??[])source=source.replace(c.from,c.to);const poof=JSON.parse(readFileSync(new URL('../docs/tag-poof-preservation.json',import.meta.url),'utf8'));for(const c of poof.files[path]?.changes??[])source=source.replace(c.from,c.to);const m=JSON.parse(readFileSync(new URL('../docs/classic-tag-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
