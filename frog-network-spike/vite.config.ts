import {defineConfig} from 'vite';
import {readFile} from 'node:fs/promises';
import {browserSocketSource} from './scripts/browser-socket-compat';
export default defineConfig({
 plugins:[{name:'colyseus-browser-constructor',enforce:'pre',transform(code,id){const patched=browserSocketSource(code,id);return patched===null?null:{code:patched,map:null};}}],
 optimizeDeps:{esbuildOptions:{plugins:[{name:'colyseus-browser-constructor',setup(build){build.onLoad({filter:/colyseus\.js[\/\\].*WebSocketTransport\.(?:js|mjs)$/},async({path})=>{const source=await readFile(path,'utf8');return {contents:browserSocketSource(source,path)??source,loader:'js'};});}}]}},
 server:{host:'127.0.0.1',proxy:{'/api':{target:'http://127.0.0.1:2567',changeOrigin:true},'/matchmake':{target:'http://127.0.0.1:2567',changeOrigin:true}}}
});
