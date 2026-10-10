import type {GameMode} from '../game/modes';
import type {ArenaId} from '../simulation/arenas';
import {defaults,type Tuning} from '../simulation/config';
import type {Simulation} from '../simulation/world';
/** Provisional, centralized, baseline-relative values. All four A modifiers are compatible. */
export const CHAOS_TUNING={gravity:.75,range:1.30,acceleration:.65,brake:.30,friction:.03,lick:1.25};
const eligibility={supportedModes:['poison','freeze','classic'] as readonly GameMode[],conflicts:[] as readonly string[],supportsArena:(_id:ArenaId)=>true};
export const MODIFIERS=[
 {...eligibility,id:'moon_frogs',name:'Moon Frogs',family:'movement',icon:'☾',description:'Lower gravity. Higher hops and longer swings.'},
 {...eligibility,id:'mega_tongues',name:'Mega Tongues',family:'tongue',icon:'↗',description:'30% longer tongue reach. Aim stays yours.'},
 {...eligibility,id:'butterfeet',name:'Butterfeet',family:'movement',icon:'≈',description:'Less grip. Slide farther; steer your escape.'},
 {...eligibility,id:'quick_licks',name:'Quick Licks',family:'tongue',icon:'ϟ',description:'25% faster tongue flight and retraction.'},
] as const;
export type ModifierId=typeof MODIFIERS[number]['id'];
export function isModifier(value:unknown):value is ModifierId{return MODIFIERS.some(m=>m.id===value);}
export function modifier(id:ModifierId){return MODIFIERS.find(m=>m.id===id)!;}
export function effectiveTuning(ids:readonly ModifierId[],base:Tuning=defaults):Tuning{
 const t={...base};if(ids.includes('moon_frogs'))t.gravity*=CHAOS_TUNING.gravity;
 if(ids.includes('mega_tongues'))t.tongueRange*=CHAOS_TUNING.range;
 if(ids.includes('butterfeet')){t.groundAcceleration*=CHAOS_TUNING.acceleration;t.groundBrake*=CHAOS_TUNING.brake;}
 if(ids.includes('quick_licks')){t.tongueSpeed*=CHAOS_TUNING.lick;t.tongueRetractSpeed*=CHAOS_TUNING.lick;}return t;
}
export function applyChaos(sim:Simulation,ids:readonly ModifierId[]){sim.tuning=effectiveTuning(ids);sim.chaosButterfeet=ids.includes('butterfeet');sim.chaosGroundFriction=CHAOS_TUNING.friction;}

export function eligibleModifierIds(active:readonly ModifierId[],mode:GameMode,arena:ArenaId){const kept=active.length===3?active.slice(1):active;return MODIFIERS.filter(m=>!active.includes(m.id)&&m.supportedModes.includes(mode)&&m.supportsArena(arena)&&kept.every(id=>!m.conflicts.includes(id)&&!modifier(id).conflicts.includes(m.id))).map(m=>m.id);}
