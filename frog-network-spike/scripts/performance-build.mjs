import{build}from'vite';
await build({build:{outDir:process.env.PERF_DIST||'/tmp/frog-perf-baseline',emptyOutDir:true},plugins:[{name:'profile-only-observation',transform(code,id){if(id.endsWith('/src/main.ts'))return code+'\nglobalThis.__perf={game,art:()=>inputScene?.art,ResultsUI};';}}]});
