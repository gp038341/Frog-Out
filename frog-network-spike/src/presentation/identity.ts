/** Stable slot colors plus eight different head/cheek markings; identity is independent of poison. */
export const FROG_COLORS=[0x82e5a4,0xffbc70,0x80cff4,0xff95b6,0xc2b0ff,0xffe278,0x83e0d0,0xf0b3ed];
export const cssColor=(slot:number)=>`#${FROG_COLORS[((slot%8)+8)%8].toString(16).padStart(6,'0')}`;
export const MARK_NAMES=['leaf','dots','stripe','freckles','brow','diamond','band','star'];
