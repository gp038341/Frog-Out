export const MODES=[{id:'poison',name:'Poison Tag',description:'Survive the spreading poison. Body contact only.'},{id:'freeze',name:'Freeze Tag',description:'Dodge the freezer. Touch frozen teammates to rescue them.'}]as const;
export type GameMode=typeof MODES[number]['id'];
export function isGameMode(value:unknown):value is GameMode{return MODES.some(m=>m.id===value);}
