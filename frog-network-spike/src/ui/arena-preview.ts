import type {ArenaDefinition} from '../simulation/arenas';
/** Small vector layout previews use the exact authoritative rectangles, never a duplicate map. */
export function arenaPreview(a:ArenaDefinition):string{
 const glass=a.id==='swingworks',bg=glass?'#243e62':'#245b50',solid=glass?'#9bc7dc':'#cba570',edge=glass?'#d9eef3':'#d7e99d';
 const backdrop=glass?'<path d="M4 21V6L20 1L36 6V21M4 6H36M12 4V21M20 1V21M28 4V21" fill="none" stroke="#587594" stroke-width=".25"/>':'<circle cx="32" cy="4" r="2" fill="#e2c685" opacity=".5"/><path d="M1 21Q8 13 15 21T39 21" fill="#367769"/>';
 return `<svg viewBox="0 0 ${a.width} ${a.height}" role="img" aria-label="${a.name} platform layout"><rect width="40" height="22.5" fill="${bg}"/>${backdrop}${a.solids.map(r=>`<rect x="${r.x-r.w/2}" y="${r.y-r.h/2}" width="${r.w}" height="${r.h}" fill="${solid}" stroke="${edge}" stroke-width=".12"/>`).join('')}</svg>`;
}
