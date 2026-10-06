import {defineConfig} from 'vite';
export default defineConfig({server:{host:'127.0.0.1',proxy:{'/matchmake':{target:'http://127.0.0.1:2567',changeOrigin:true}}}});
