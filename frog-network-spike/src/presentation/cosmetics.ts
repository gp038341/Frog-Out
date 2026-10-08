/** Closed cosmetic catalog shared by server validation and presentation. No simulation imports. */
export const SKINS=[
 {id:'pond',name:'Pond Pop',color:0x83dc78,mark:0x246f59,pattern:'spots'},
 {id:'coral',name:'Coral Confetti',color:0xff8d91,mark:0xad4264,pattern:'freckles'},
 {id:'lagoon',name:'Lagoon Lightning',color:0x64dce5,mark:0x277998,pattern:'stripe'},
 {id:'sunshine',name:'Sunshine Speckles',color:0xffd66c,mark:0x916a30,pattern:'spots'},
 {id:'orchid',name:'Orchid Swirl',color:0xbe9af6,mark:0x704da4,pattern:'chevron'},
 {id:'melon',name:'Melon Racer',color:0xffb07b,mark:0xb76039,pattern:'stripe'},
 {id:'mint',name:'Mint Mosaic',color:0x8ce7c5,mark:0x317d70,pattern:'diamonds'},
 {id:'berry',name:'Berry Bandit',color:0xf69bd4,mark:0x974a86,pattern:'chevron'},
 {id:'blueberry',name:'Blueberry Dots',color:0x91b4ff,mark:0x46669e,pattern:'freckles'},
 {id:'lime',name:'Lime Checkers',color:0xc5e96e,mark:0x718d36,pattern:'diamonds'},
] as const;
export const EYES=[{id:'cheerful',name:'Cheerful'},{id:'determined',name:'Determined'},{id:'sleepy',name:'Sleepy'},{id:'surprised',name:'Surprised'},{id:'mischievous',name:'Mischievous'}] as const;
export const HATS=[{id:'none',name:'No hat'},{id:'crown',name:'Tiny crown'},{id:'mushroom',name:'Mushroom cap'},{id:'cowboy',name:'Cowboy hat'},{id:'propeller',name:'Propeller beanie'},{id:'party',name:'Party cone'},{id:'flower',name:'Daisy bonnet'}] as const;
export type Appearance={skin:typeof SKINS[number]['id'];eyes:typeof EYES[number]['id'];hat:typeof HATS[number]['id']};
export const DEFAULT_APPEARANCE:Readonly<Appearance>={skin:'pond',eyes:'cheerful',hat:'none'};
export function validAppearance(value:unknown):value is Appearance{if(!value||typeof value!=='object'||Array.isArray(value))return false;const a=value as Record<string,unknown>;return SKINS.some(s=>s.id===a.skin)&&EYES.some(s=>s.id===a.eyes)&&HATS.some(s=>s.id===a.hat);}
/** Pick only catalog fields; arbitrary client properties never enter room data. */
export function normalizeAppearance(value:unknown):Appearance{return validAppearance(value)?{skin:value.skin,eyes:value.eyes,hat:value.hat}:{...DEFAULT_APPEARANCE};}
export function skinFor(value:unknown){const a=normalizeAppearance(value);return SKINS.find(s=>s.id===a.skin)!;}
export function appearanceLayers(value:unknown,state?:string,startingTagger=false){const appearance=normalizeAppearance(value);return {appearance,skin:skinFor(appearance),showPattern:state!=='transforming'&&state!=='infectious',hat:startingTagger?'none':appearance.hat,poisonMarkings:state==='transforming'||state==='infectious',startingBadge:startingTagger};}
const storageKey='frog-out-appearance-v1';
export function loadAppearance():Appearance{try{return normalizeAppearance(JSON.parse(localStorage.getItem(storageKey)??'null'));}catch{return {...DEFAULT_APPEARANCE};}}
export function rememberAppearance(value:Appearance){try{localStorage.setItem(storageKey,JSON.stringify(normalizeAppearance(value)));}catch{/* Private/blocked storage does not prevent playing. */}}
