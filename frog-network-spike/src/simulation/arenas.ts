import {arena,WIDTH,HEIGHT,spawnPoint} from './arena';
export type ArenaId='canopy'|'swingworks';
export type Solid={x:number;y:number;w:number;h:number};
export type ArenaDefinition={id:ArenaId;name:string;description:string;solids:Solid[];width:number;height:number;geometryPreview:boolean};
/** Arena 1 is the exact approved geometry; only the second layout is experimental. */
export const ARENAS:Record<ArenaId,ArenaDefinition>={
 canopy:{id:'canopy',name:'Canopy Courtyard',description:'Layered crossings and compact chase routes.',solids:arena,width:WIDTH,height:HEIGHT,geometryPreview:false},
 swingworks:{id:'swingworks',name:'Swingworks',description:'Geometry preview · tall side routes, overhead grips and an open swing space.',width:WIDTH,height:HEIGHT,geometryPreview:true,solids:[
  ...arena.slice(0,4),
  // Four edge tiers. Charge jumps bridge their 4–4.75 m rises; underside grips give alternatives.
  {x:5,y:17,w:7,h:.5},{x:35,y:17,w:7,h:.5},
  {x:7,y:12.5,w:6,h:.5},{x:33,y:12.5,w:6,h:.5},
  {x:5,y:8,w:7,h:.5},{x:35,y:8,w:7,h:.5},
  {x:8,y:4,w:6,h:.5},{x:32,y:4,w:6,h:.5},
  // Slim ceiling teeth provide closeable overhead grapple angles, not sheltered camping pockets.
  {x:14,y:3,w:.5,h:5},{x:26,y:3,w:.5,h:5},
  // Low central perch: a pursuit/interception option, with a large open volume above it.
  {x:20,y:18,w:4,h:.5},
 ]},
};
export const DEFAULT_ARENA:ArenaId='canopy';
export const arenaList=Object.values(ARENAS);
export function isArenaId(value:unknown):value is ArenaId{return typeof value==='string'&&Object.hasOwn(ARENAS,value);}
export function getArena(id:ArenaId){return ARENAS[id];}
export {spawnPoint};
