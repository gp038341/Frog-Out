/** Colyseus 0.16.22 probes Node options in browsers. WebKit reports that invalid protocol probe
 * even though SDK fallback succeeds. Use exactly its successful browser constructor in Vite only. */
export function browserSocketSource(code:string,id:string):string|null{
 if(id.startsWith('\0')||id.includes('?'))return null;
 if(!/colyseus\.js\/(?:build\/(?:esm|cjs)|lib)\/transport\/WebSocketTransport\.(?:mjs|js)(?:\?|$)/.test(id.replaceAll('\\','/')))return null;
 const probe='new WebSocket(url, { headers, protocols: this.protocols })';
 if(!code.includes(probe))throw Error('Pinned Colyseus browser constructor changed; review the compatibility adapter.');
 return code.replace(probe,'new WebSocket(url, this.protocols)');
}
