import {FROG_CHAOS} from './frog-chaos';
/** Authoritative ticks, not a second wall-clock countdown. */
export function swapClock(tick:number,start:number){const period=FROG_CHAOS.swapPeriod,age=Math.max(0,tick-start),phase=age%period,remaining=period-phase;return {seconds:Math.ceil(remaining/60),urgent:remaining<=FROG_CHAOS.swapWarning};}
