import {build} from 'esbuild';
await build({entryPoints:['server/index.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outdir:'server-dist',target:'node22'});
