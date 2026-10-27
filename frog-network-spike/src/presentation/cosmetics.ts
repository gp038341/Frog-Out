/** Closed cosmetic catalog shared by server validation and presentation. No simulation imports. */
export const SKINS=[
 {id:'pond',name:'Pond green',color:0x83dc78,mark:0x246f59,pattern:'spots'},
 {id:'coral',name:'Coral pink',color:0xff8d91,mark:0xad4264,pattern:'freckles'},
 {id:'lagoon',name:'Lagoon blue',color:0x64dce5,mark:0x277998,pattern:'stripe'},
 {id:'sunshine',name:'Sunshine yellow',color:0xffd66c,mark:0x916a30,pattern:'spots'},
 {id:'orchid',name:'Orchid purple',color:0xbe9af6,mark:0x704da4,pattern:'chevron'},
 {id:'melon',name:'Melon orange',color:0xffb07b,mark:0xb76039,pattern:'stripe'},
 {id:'mint',name:'Mint green',color:0x8ce7c5,mark:0x317d70,pattern:'diamonds'},
 {id:'berry',name:'Berry pink',color:0xf69bd4,mark:0x974a86,pattern:'chevron'},
 {id:'blueberry',name:'Blueberry blue',color:0x91b4ff,mark:0x46669e,pattern:'freckles'},
 {id:'lime',name:'Lime green',color:0xc5e96e,mark:0x718d36,pattern:'diamonds'},
] as const;
export const EYES=[{id:'cheerful',name:'Cheerful'},{id:'determined',name:'Determined'},{id:'sleepy',name:'Sleepy'},{id:'surprised',name:'Surprised'},{id:'mischievous',name:'Mischievous'},{id:'wink',name:'Wink'},{id:'joyful',name:'Joyful'},{id:'worried',name:'Worried'}] as const;
export const HATS=[{id:'none',name:'No hat'},{id:'crown',name:'Tiny crown'},{id:'mushroom',name:'Mushroom cap'},{id:'cowboy',name:'Cowboy hat'},{id:'propeller',name:'Propeller beanie'},{id:'party',name:'Party cone'},{id:'flower',name:'Daisy bonnet'},{id:'rain',name:'Rain hat'},{id:'sprout',name:'Leaf sprout'},{id:'bow',name:'Coral bow'}] as const;
export const PATTERNS=[{id:'none',name:'Plain'},{id:'spots',name:'Dart spots'},{id:'freckles',name:'Confetti freckles'},{id:'stripe',name:'Racing stripe'},{id:'chevron',name:'River ripples'},{id:'diamonds',name:'Harlequin diamonds'},{id:'tiger',name:'Tiger bands'},{id:'lightning',name:'Lightning bolts'},{id:'constellation',name:'Star trail'},{id:'patches',name:'Pebble patches'}] as const;
export type Pattern=typeof PATTERNS[number]['id'];
export type Appearance={skin:typeof SKINS[number]['id'];eyes:typeof EYES[number]['id'];hat:typeof HATS[number]['id'];pattern?:Pattern};
export const DEFAULT_APPEARANCE:Readonly<Required<Appearance>>={skin:'pond',eyes:'cheerful',hat:'none',pattern:'spots'};
export function validAppearance(value:unknown):value is Appearance{if(!value||typeof value!=='object'||Array.isArray(value))return false;const a=value as Record<string,unknown>;return SKINS.some(s=>s.id===a.skin)&&EYES.some(s=>s.id===a.eyes)&&HATS.some(s=>s.id===a.hat)&&(a.pattern===undefined||PATTERNS.some(s=>s.id===a.pattern));}
/** Pick only catalog fields; arbitrary client properties never enter room data. */
export function normalizeAppearance(value:unknown):Required<Appearance>{return validAppearance(value)?{skin:value.skin,eyes:value.eyes,hat:value.hat,pattern:value.pattern??SKINS.find(s=>s.id===value.skin)!.pattern}:{...DEFAULT_APPEARANCE};}
export function skinFor(value:unknown){const a=normalizeAppearance(value);return SKINS.find(s=>s.id===a.skin)!;}
export function patternFor(value:unknown){return PATTERNS.find(p=>p.id===normalizeAppearance(value).pattern)!;}
export const COLORS=SKINS;
export function appearanceLayers(value:unknown,state?:string,startingTagger=false){const appearance=normalizeAppearance(value);return {appearance,skin:skinFor(appearance),showPattern:state!=='transforming'&&state!=='infectious',hat:startingTagger?'none':appearance.hat,poisonMarkings:state==='transforming'||state==='infectious',startingBadge:startingTagger};}
const storageKey='frog-out-appearance-v1';
export function loadAppearance():Required<Appearance>{try{return normalizeAppearance(JSON.parse(localStorage.getItem(storageKey)??'null'));}catch{return {...DEFAULT_APPEARANCE};}}
export function rememberAppearance(value:Appearance){try{localStorage.setItem(storageKey,JSON.stringify(normalizeAppearance(value)));}catch{/* Private/blocked storage does not prevent playing. */}}
