import type {GameMode} from '../game/modes';
import type {ArenaId} from '../simulation/arenas';
import {defaults,type Tuning} from '../simulation/config';
import {WIDTH,HEIGHT} from '../simulation/arena';
import type {Simulation} from '../simulation/world';
/** Provisional, centralized, baseline-relative values. All four A modifiers are compatible. */
export const CHAOS_TUNING={gravity:.25,moonAirAcceleration:.45,moonHorizontalDrag:1.5,moonVerticalDrag:.6,moonFallSpeed:4.2,range:Math.hypot(WIDTH,HEIGHT)+2,acceleration:.40,brake:.025,friction:.001,lick:1.25};
const eligibility={supportedModes:['poison','freeze','classic'] as readonly GameMode[],conflicts:[] as readonly string[],supportsArena:(_id:ArenaId)=>true};
export const MODIFIERS=[
 {...eligibility,id:'moon_frogs',name:'Moon Frogs',family:'movement',icon:'☾',description:'Space-float hops and slow drifting falls.'},
 {...eligibility,id:'mega_tongues',name:'Mega Tongues',family:'tongue',icon:'↗',description:'Reach any surface across the whole arena.'},
 {...eligibility,id:'butterfeet',name:'Butterfeet',family:'movement',icon:'≈',description:'Ice-like grip. Long slides and wide turns.'},
 {...eligibility,id:'quick_licks',name:'Quick Licks',family:'tongue',icon:'ϟ',description:'25% faster tongue flight and retraction.'},
] as const;
export type ModifierId=typeof MODIFIERS[number]['id'];
export function isModifier(value:unknown):value is ModifierId{return MODIFIERS.some(m=>m.id===value);}
export function modifier(id:ModifierId){return MODIFIERS.find(m=>m.id===id)!;}
export function effectiveTuning(ids:readonly ModifierId[],base:Tuning=defaults):Tuning{
 const t={...base};if(ids.includes('moon_frogs')){t.gravity*=CHAOS_TUNING.gravity;t.airAcceleration*=CHAOS_TUNING.moonAirAcceleration;}
 if(ids.includes('mega_tongues'))t.tongueRange=CHAOS_TUNING.range;
 if(ids.includes('butterfeet')){t.groundAcceleration*=CHAOS_TUNING.acceleration;t.groundBrake*=CHAOS_TUNING.brake;}
 if(ids.includes('quick_licks')){t.tongueSpeed*=CHAOS_TUNING.lick;t.tongueRetractSpeed*=CHAOS_TUNING.lick;}return t;
}
export function applyChaos(sim:Simulation,ids:readonly ModifierId[]){sim.tuning=effectiveTuning(ids);sim.chaosButterfeet=ids.includes('butterfeet');sim.chaosGroundFriction=CHAOS_TUNING.friction;sim.chaosMoon=ids.includes('moon_frogs');sim.chaosMoonDragX=CHAOS_TUNING.moonHorizontalDrag;sim.chaosMoonDragY=CHAOS_TUNING.moonVerticalDrag;sim.chaosMoonFallSpeed=CHAOS_TUNING.moonFallSpeed;}

export function eligibleModifierIds(active:readonly ModifierId[],mode:GameMode,arena:ArenaId){const kept=active.length===3?active.slice(1):active;return MODIFIERS.filter(m=>!kept.includes(m.id)&&m.supportedModes.includes(mode)&&m.supportsArena(arena)&&kept.every(id=>!m.conflicts.includes(id)&&!modifier(id).conflicts.includes(m.id))).map(m=>m.id);}
