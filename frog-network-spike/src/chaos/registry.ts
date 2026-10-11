import {GRAPPLE_AIM} from '../simulation/aim-assist';
import {resizeFrogs} from '../simulation/frog-size';
import type {GameMode} from '../game/modes';
import type {ArenaId} from '../simulation/arenas';
import {defaults,type Tuning} from '../simulation/config';
import {WIDTH,HEIGHT} from '../simulation/arena';
import type {Simulation} from '../simulation/world';
/** Provisional, centralized, baseline-relative values. Size modifiers are mutually exclusive. */
export const CHAOS_TUNING={gravity:.25,moonAirAcceleration:.45,moonHorizontalDrag:1.5,moonVerticalDrag:.6,moonFallSpeed:4.2,range:Math.hypot(WIDTH,HEIGHT)+2,acceleration:.40,brake:.025,friction:.001,lick:1.25,turboSpeed:1.50,turboAcceleration:1.60,tinyScale:.75,megaScale:1.25,pull:1.20,takeup:1.10,magnetDegrees:GRAPPLE_AIM.magnetDegrees};
const eligibility={supportedModes:['poison','freeze','classic'] as readonly GameMode[],conflicts:[] as readonly string[],supportsArena:(_id:ArenaId)=>true};
export const MODIFIERS=[
 {...eligibility,id:'moon_frogs',name:'Moon Frogs',family:'movement',icon:'☾',description:'Space-float hops and slow drifting falls.'},
 {...eligibility,id:'mega_tongues',name:'Mega Tongues',family:'tongue',icon:'↗',description:'Reach any surface across the whole arena.'},
 {...eligibility,id:'butterfeet',name:'Butterfeet',family:'movement',icon:'≈',description:'Ice-like grip. Long slides and wide turns.'},
 {...eligibility,id:'quick_licks',name:'Quick Licks',family:'tongue',icon:'ϟ',description:'25% faster tongue flight and retraction.'},
 {...eligibility,id:'turbo_toads',name:'Turbo Toads',family:'movement',icon:'»',description:'50% faster runs. Big bursts of ground speed.'},
 {...eligibility,id:'tiny_trouble',name:'Tiny Trouble',family:'size',icon:'◦',conflicts:['mega_frogs'] as readonly string[],description:'Pocket-sized frogs. Same mass, smaller bodies.'},
 {...eligibility,id:'mega_frogs',name:'Mega Frogs',family:'size',icon:'●',conflicts:['tiny_trouble'] as readonly string[],description:'Big frog energy. Larger physical bodies.'},
 {...eligibility,id:'super_suckers',name:'Super Suckers',family:'tongue',icon:'⇥',description:'Stronger reciprocal pulls. Same safe speed limit.'},
 {...eligibility,id:'magnet_mouths',name:'Magnet Mouths',family:'tongue',icon:'⊕',description:'Wide frog-catching aim assist with a short lead.'},
] as const;
export type ModifierId=typeof MODIFIERS[number]['id'];
export function isModifier(value:unknown):value is ModifierId{return MODIFIERS.some(m=>m.id===value);}
export function modifier(id:ModifierId){return MODIFIERS.find(m=>m.id===id)!;}
export function effectiveTuning(ids:readonly ModifierId[],base:Tuning=defaults):Tuning{
 const active=validModifiers(ids);ids=active;const t={...base};if(ids.includes('moon_frogs')){t.gravity*=CHAOS_TUNING.gravity;t.airAcceleration*=CHAOS_TUNING.moonAirAcceleration;}
 if(ids.includes('mega_tongues'))t.tongueRange=CHAOS_TUNING.range;
 if(ids.includes('butterfeet')){t.groundAcceleration*=CHAOS_TUNING.acceleration;t.groundBrake*=CHAOS_TUNING.brake;}
 if(ids.includes('quick_licks')){t.tongueSpeed*=CHAOS_TUNING.lick;t.tongueRetractSpeed*=CHAOS_TUNING.lick;}if(ids.includes('turbo_toads')){t.groundSpeed*=CHAOS_TUNING.turboSpeed;t.groundAcceleration*=CHAOS_TUNING.turboAcceleration;}
 const scale=ids.includes('tiny_trouble')?CHAOS_TUNING.tinyScale:ids.includes('mega_frogs')?CHAOS_TUNING.megaScale:1;
 t.frogRadius*=scale;t.frogGrappleClearance*=scale;t.grappleMinLength*=scale;
 if(ids.includes('super_suckers')){t.grapplePullAcceleration*=CHAOS_TUNING.pull;t.grappleTakeupSpeed*=CHAOS_TUNING.takeup;}return t;
}
export function applyChaos(sim:Simulation,ids:readonly ModifierId[]){ids=validModifiers(ids);sim.tuning=effectiveTuning(ids);resizeFrogs(sim);sim.chaosAimDegrees=ids.includes('magnet_mouths')?CHAOS_TUNING.magnetDegrees:GRAPPLE_AIM.defaultDegrees;sim.chaosAimLeadSeconds=ids.includes('magnet_mouths')?GRAPPLE_AIM.magnetLeadSeconds:GRAPPLE_AIM.defaultLeadSeconds;sim.chaosSuperSuckers=ids.includes('super_suckers');sim.chaosTurbo=ids.includes('turbo_toads');sim.chaosButterfeet=ids.includes('butterfeet');sim.chaosGroundFriction=CHAOS_TUNING.friction;sim.chaosMoon=ids.includes('moon_frogs');sim.chaosMoonDragX=CHAOS_TUNING.moonHorizontalDrag;sim.chaosMoonDragY=CHAOS_TUNING.moonVerticalDrag;sim.chaosMoonFallSpeed=CHAOS_TUNING.moonFallSpeed;}

export function eligibleModifierIds(active:readonly ModifierId[],mode:GameMode,arena:ArenaId){const kept=active.length===3?active.slice(1):active;return MODIFIERS.filter(m=>!kept.includes(m.id)&&m.supportedModes.includes(mode)&&m.supportsArena(arena)&&kept.every(id=>!m.conflicts.includes(id)&&!modifier(id).conflicts.includes(m.id))).map(m=>m.id);}

/** Stable catalog order makes invalid/duplicate/conflicting payloads deterministic. */
export function validModifiers(ids:readonly unknown[]):ModifierId[]{const result:ModifierId[]=[];for(const m of MODIFIERS)if(ids.includes(m.id)&&result.every(id=>!m.conflicts.includes(id)&&!modifier(id).conflicts.includes(m.id)))result.push(m.id);return result;}
