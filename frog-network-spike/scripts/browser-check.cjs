const {chromium}=require('playwright-core');const binary=require('@sparticuz/chromium');
const {spawn}=require('node:child_process');const fs=require('node:fs');
(async()=>{binary.setGraphicsMode=false;const server=spawn(process.execPath,['server-dist/index.js'],{env:{...process.env,PORT:'2867',HOST:'127.0.0.1',ENABLE_TESTS:'1'}});let log='';server.stdout.on('data',x=>log+=x);server.stderr.on('data',x=>log+=x);let browser;
try{
 await new Promise((resolve,reject)=>{const timer=setInterval(()=>{if(log.includes('listening')){clearInterval(timer);resolve();}},50);setTimeout(()=>{clearInterval(timer);reject(Error(log));},10000);});
 browser=await chromium.launch({executablePath:await binary.executablePath(),headless:true,args:[...binary.args,'--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],results=[];
 for(const lag of [50,100,150]){
 const a=await browser.newContext({viewport:{width:1280,height:900}}),b=await browser.newContext({viewport:{width:1280,height:900}});const p=await a.newPage(),q=await b.newPage();p.on('pageerror',e=>errors.push(e.message));q.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:2867/?lag=${lag}&jitter=10`);await p.waitForFunction(()=>window.spikeDebug?.slot>=0&&window.spikeDebug.snapshots.length>5);
 const room=await p.evaluate(()=>window.spikeDebug.room.roomId);await q.goto(`http://127.0.0.1:2867/?room=${room}&lag=${lag}&jitter=10`);await q.waitForFunction(()=>window.spikeDebug?.slot>=0&&window.spikeDebug.snapshots.length>5);
 await p.locator('canvas').click();await p.keyboard.down('KeyD');await p.keyboard.down('Space');await p.waitForTimeout(300);await p.keyboard.up('KeyD');await p.waitForTimeout(700);const charging=await p.evaluate(()=>window.spikeDebug.predictor.sim.frogs[window.spikeDebug.slot].charging);await p.keyboard.up('Space');await p.waitForTimeout(80);const jump=await p.evaluate(()=>window.spikeDebug.predictor.sim.frogs[window.spikeDebug.slot].body.getLinearVelocity().y);
 await p.keyboard.down('KeyW');await p.keyboard.down('Space');await p.waitForTimeout(500);const terrainAttached=await p.evaluate(()=>{const t=window.spikeDebug.predictor.sim.frogs[window.spikeDebug.slot].tongue;return t?.phase==='attached'&&!t.target.isDynamic();});if(!terrainAttached)throw Error('browser terrain grapple failed');await p.keyboard.down('KeyD');await p.waitForTimeout(300);await p.keyboard.up('Space');await p.keyboard.up('KeyW');await p.keyboard.up('KeyD');await p.waitForTimeout(100);const released=await p.evaluate(()=>!window.spikeDebug.predictor.sim.frogs[window.spikeDebug.slot].tongue);if(!released)throw Error('browser release failed');const first=await p.evaluate(()=>({slot:window.spikeDebug.slot,room:window.spikeDebug.room.roomId,rtt:window.spikeDebug.rtt,pending:window.spikeDebug.predictor.pending.length,snaps:window.spikeDebug.predictor.snaps}));const second=await q.evaluate(()=>({slot:window.spikeDebug.slot,room:window.spikeDebug.room.roomId,rtt:window.spikeDebug.rtt}));
 if(!charging||jump>=-10||first.slot===second.slot||first.room!==second.room)throw Error(JSON.stringify({charging,jump,first,second}));
 await q.locator('canvas').click();await q.keyboard.down('ArrowLeft');await q.waitForTimeout(300);await q.keyboard.up('ArrowLeft');await p.waitForTimeout(300);
 results.push({lag,charging,jump,terrainAttached,released,first,second,status:await p.locator('#status').textContent()});
 if(lag===100)await p.screenshot({path:'docs/results/browser-100ms.png'});
 await p.evaluate(()=>window.spikeDebug.room.leave());await q.evaluate(()=>window.spikeDebug.room.leave());await p.goto('about:blank');await q.goto('about:blank');
 }
 fs.writeFileSync('docs/results/browser.json',JSON.stringify({environment:'Two isolated headless Chromium browser contexts over loopback, artificial delay; not physical devices or human acceptance',results,errors},null,2));console.log(JSON.stringify({results,errors}));if(errors.length)throw Error('browser runtime errors');
}finally{if(browser)await browser.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
