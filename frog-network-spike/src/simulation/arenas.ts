import {arena,WIDTH,HEIGHT,spawnPoint} from './arena';
export type ArenaId='canopy'|'swingworks'|'sunny-pond';
export type Solid={x:number;y:number;w:number;h:number;surface?:'lily'|'mud';outline?:[number,number][];object?:'rock'|'branch'|'lily'};
export type ArenaDefinition={id:ArenaId;name:string;description:string;solids:Solid[];width:number;height:number;geometryPreview:boolean};
/** Arena 1 is the exact approved geometry; only the second layout is experimental. */
export const ARENAS:Record<ArenaId,ArenaDefinition>={
 canopy:{id:'canopy',name:'Canopy Courtyard',description:'Sunny garden · balanced crossings and chase routes.',solids:arena,width:WIDTH,height:HEIGHT,geometryPreview:false},
 swingworks:{id:'swingworks',name:'Rainbell Conservatory',description:'Glasshouse · climb, swing and launch across open air.',width:WIDTH,height:HEIGHT,geometryPreview:false,solids:[
  ...arena.slice(0,4),
  // Four edge tiers. Charge jumps bridge their 4–4.75 m rises; underside grips give alternatives.
  {x:5,y:17,w:7,h:.5},{x:35,y:17,w:7,h:.5},
  {x:7,y:12.5,w:6,h:.5},{x:33,y:12.5,w:6,h:.5},
  {x:5,y:8,w:7,h:.5},{x:35,y:8,w:7,h:.5},
  {x:8,y:4,w:6,h:.5},{x:32,y:4,w:6,h:.5},
  // Slim ceiling teeth provide closeable overhead grapple angles, not sheltered camping pockets.
  {x:14,y:3.5,w:.5,h:6},{x:26,y:2.5,w:.5,h:4},
  // Low central perch: a pursuit/interception option, with a large open volume above it.
  {x:20,y:18,w:4,h:.5},
 ]},
 'sunny-pond':{id:'sunny-pond',name:'Sunny Pond',description:'Sunny pond · lily tops bounce; mud tops slow running. Water is scenery.',width:WIDTH,height:HEIGHT,geometryPreview:false,solids:[
  ...arena.slice(0,4),
  {x:6,y:18,w:6,h:1.2,surface:'mud',object:'rock',outline:[[-2.5,-.6],[2.5,-.6],[3,.15],[2.4,.6],[-2.4,.6],[-3,.15]]},{x:34,y:18,w:6,h:1.2,surface:'mud',object:'rock',outline:[[-2.5,-.6],[2.5,-.6],[3,.15],[2.4,.6],[-2.4,.6],[-3,.15]]},
  {x:13,y:16,w:4,h:.6,surface:'lily',object:'lily',outline:[[-1.4,-.3],[1.4,-.3],[2,-.1],[2,.1],[1.4,.3],[-1.4,.3],[-2,.1],[-2,-.1]]},{x:27,y:16,w:4,h:.6,surface:'lily',object:'lily',outline:[[-1.4,-.3],[1.4,-.3],[2,-.1],[2,.1],[1.4,.3],[-1.4,.3],[-2,.1],[-2,-.1]]},
  {x:20,y:11.5,w:8,h:1,object:'branch',outline:[[-4,-.25],[2.8,-.25],[4,-.05],[3.7,.45],[-3.5,.5],[-4,.1]]},
  {x:8,y:8,w:5,h:.8,object:'branch',outline:[[-2.5,-.25],[1.8,-.25],[2.5,0],[2.15,.4],[-2.2,.4],[-2.5,.1]]},{x:32,y:8,w:5,h:.8,object:'branch',outline:[[-2.5,0],[-1.8,-.25],[2.5,-.25],[2.5,.1],[2.2,.4],[-2.15,.4]]},
  {x:20,y:5,w:5,h:.9,object:'rock',outline:[[-1.8,-.25],[1.8,-.25],[2.5,.1],[2,.5],[-2,.5],[-2.5,.1]]},
 ]},
};
export const DEFAULT_ARENA:ArenaId='canopy';
export const arenaList=Object.values(ARENAS);
export function isArenaId(value:unknown):value is ArenaId{return typeof value==='string'&&Object.hasOwn(ARENAS,value);}
export function getArena(id:ArenaId){return ARENAS[id];}
export {spawnPoint};
