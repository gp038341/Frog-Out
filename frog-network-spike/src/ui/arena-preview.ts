import type {ArenaDefinition} from '../simulation/arenas';
/** Small vector layout previews use the exact authoritative rectangles, never a duplicate map. */
export function arenaPreview(a:ArenaDefinition):string{
 if(a.id==='sunny-pond')return `<svg viewBox="0 0 40 22.5" role="img" aria-label="Sunny Pond platform layout"><rect width="40" height="22.5" fill="#8acdd9"/><circle cx="33" cy="4" r="2.2" fill="#ffdf70"/><path d="M0 21Q10 16 20 21T40 21" fill="#51b8bc"/>${a.solids.map(r=>`<rect x="${r.x-r.w/2}" y="${r.y-r.h/2}" width="${r.w}" height="${r.h}" fill="${r.surface==='lily'?'#74cc64':r.surface==='mud'?'#765249':'#c69d6b'}" stroke="#204943" stroke-width=".14"/>`).join('')}</svg>`;
 const glass=a.id==='swingworks',bg=glass?'#243e62':'#245b50',solid=glass?'#9bc7dc':'#cba570',edge=glass?'#d9eef3':'#d7e99d';
 const backdrop=glass?'<path d="M4 21V6L20 1L36 6V21M4 6H36M12 4V21M20 1V21M28 4V21" fill="none" stroke="#587594" stroke-width=".25"/>':'<circle cx="32" cy="4" r="2" fill="#e2c685" opacity=".5"/><path d="M1 21Q8 13 15 21T39 21" fill="#367769"/>';
 return `<svg viewBox="0 0 ${a.width} ${a.height}" role="img" aria-label="${a.name} platform layout"><rect width="40" height="22.5" fill="${bg}"/>${backdrop}${a.solids.map(r=>`<rect x="${r.x-r.w/2}" y="${r.y-r.h/2}" width="${r.w}" height="${r.h}" fill="${solid}" stroke="${edge}" stroke-width=".12"/>`).join('')}</svg>`;
}
