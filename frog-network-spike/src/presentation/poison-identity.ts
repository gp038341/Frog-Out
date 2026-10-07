/** Render-only identity. Internal authoritative state names remain unchanged. */
export const POISON_ACCENTS=[0xffdc65,0x61e4ed,0xffae6a,0xbaff70,0xffdc65,0x67e2e8,0xffb7e5,0xbaff70];
export function poisonRole(state?:string){return {spotted:state==='transforming'||state==='infectious',transforming:state==='transforming',tagging:state==='infectious'};}
