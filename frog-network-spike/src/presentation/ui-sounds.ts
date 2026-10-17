/** Action pad has its gameplay sound; mute/unmute already handles its own feedback. */
export function isSoundClick(target:Element|null){const button=target?.closest?.('button,summary');return !!button&&!button.matches(':disabled,[aria-disabled=true]')&&!['sound','touch-action'].includes(button.id);}
