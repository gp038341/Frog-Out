import type {ModifierId} from '../chaos/registry';
const frog=(x=40,y=39,r=16)=>`<path d="M${x-r} ${y}q0 ${-r} ${r} ${-r}t${r} ${r}q2 ${r} ${-r} ${r}t${-r} ${-r}Z" fill="#fff1ce"/><circle cx="${x-r*.55}" cy="${y-r*.8}" r="${r*.43}" fill="#fff1ce"/><circle cx="${x+r*.55}" cy="${y-r*.8}" r="${r*.43}" fill="#fff1ce"/><path d="M${x-r*.5} ${y+3}q${r*.5} 6 ${r} 0"/>`;
/** Original, fixed SVG artwork. No player data enters these glyphs. */
const prints:Record<ModifierId,string>={
 moon_frogs:'<path d="M48 10a24 24 0 1 0 16 39A25 25 0 0 1 48 10Z" fill="#fff1ce"/><path d="M64 8v12m-6-6h12M24 8v6m-3-3h6"/>',
 mega_tongues:frog(24,41,14)+'<path d="M28 44q42 27 39-10t-18-8" stroke="#d86891" stroke-width="7"/>',
 butterfeet:'<path d="M24 57L15 36l9 4 1-23 11 23 12-28 2 27 17-16-10 30Z" fill="#fff1ce"/><path d="M5 55h12m42 8h14M15 10h19"/>',
 quick_licks:frog(29,39,14)+'<path d="M32 43q29 15 34-10m-9 8 10-8-12-2M6 18h17M4 26h12"/>',
 turbo_toads:frog(47,38,19)+'<path d="M7 24h16M3 34h13M9 45h13M10 58h20"/>',
 tiny_trouble:frog(40,40,10)+'<path d="M12 22V10h14m42 12V10H54M12 48v12h14m42-12v12H54"/>',
 mega_frogs:frog(40,37,24)+'<path d="M7 18V6h12m54 12V6H61M7 53v10h12m54-10v10H61"/>',
 super_suckers:'<path d="M39 9v29M21 44q19-28 38 0v9H21Z" fill="#fff1ce"/><path d="M10 12v22m-5-6 5 6 5-6m55-16v22m-5-6 5 6 5-6M17 61h46"/>',
 magnet_mouths:'<path d="M17 14v24a23 23 0 0 0 46 0V14H49v24a9 9 0 0 1-18 0V14Z" fill="#fff1ce"/><path d="M17 27h14m18 0h14M7 9l6 4m57-4-6 4M40 5v9"/>',
 windy_weather:'<path d="M9 23h43q19 0 16-11t-15-3M3 36h52q17 0 16 10t-16 4M13 49h21q13 0 11 9t-12 2M4 13h23"/>',
 bouncy_bombardment:'<circle cx="42" cy="34" r="25" fill="#fff1ce"/><path d="M25 15q35 17 19 43M20 51q15-30 43-27M6 60h17M4 46h10"/>',
 crumble_time:'<path d="M7 20h27l-9 9 12 6-6 11H7Zm33 0h32v26H39l6-14-12-4Z" fill="#fff1ce"/><path d="m16 55 7 5m30-5 7 5M39 4v8"/>',
 tilt_a_frog:'<path d="M9 46 70 23l3 10-60 23Z" fill="#fff1ce"/><path d="m40 42-8 20h21ZM12 14q11-12 21-5m-3-5 5 7-9 3m43 33q-2 13-16 13"/>'+frog(26,25,10),
 bumper_frogs:frog(20,38,13)+frog(60,38,13)+'<path d="m38 10 2 13 7-8m-10 8-7-8M39 53l1 10m-7-4 7 4 7-4"/>',
 balloon_bellies:frog(40,34,24)+'<path d="M36 58l-4 6h16l-5-6M7 15l5 5m56-5-5 5"/>',
 swap_hop:frog(19,43,11)+frog(61,25,11)+'<path d="M11 19Q22 2 44 9m-7-6 8 7-10 4M69 51Q58 68 36 61m7 6-8-7 10-4"/>',
 bubble_trouble:'<circle cx="40" cy="34" r="28" fill="#fff1ce"/><path d="M18 24q3-13 14-14M68 8l6-5m-2 18h6"/>'+frog(41,41,13),
 gravity_flip:'<path d="M21 59V10m-10 13 10-13 10 13M59 9v49m-10-13 10 13 10-13"/>'+frog(40,33,10),
 pogo_panic:frog(40,20,13)+'<path d="M25 38h30l-26 8 26 5-26 7h27M14 60h52M9 34V19m-5 6 5-6 5 6"/>',
 sticky_frogs:'<path d="M65 4v59m9-59v59M39 20 23 11l8 21L12 30l17 12-12 14 23-10 8 17 4-26Z" fill="#fff1ce"/><circle cx="23" cy="11" r="4"/><circle cx="12" cy="30" r="4"/><circle cx="17" cy="56" r="4"/><path d="m46 23 15-6m-8 19 8-1m-11 15 11 6"/>',
};
export function chaosPrint(id:ModifierId){return `<svg class="chaos-print" viewBox="0 0 80 68" aria-hidden="true"><g fill="none" stroke="#292431" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${prints[id]}</g></svg>`;}
