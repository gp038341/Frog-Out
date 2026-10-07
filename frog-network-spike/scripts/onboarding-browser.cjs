// Isolated local browser regression, never a physical iOS/Android certification.
const {chromium}=require('playwright-core'),bin=require('@sparticuz/chromium');
const {spawn}=require('node:child_process'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 bin.setGraphicsMode=false;
 const port=3191,server=spawn(process.execPath,['server-dist/index.js'],{env:{...process.env,HOST:'127.0.0.1',PORT:String(port),ENABLE_TESTS:'1',TEST_OUTBREAK_SHORT_COUNTDOWN:'1'}});
 let log='',browser;server.stdout.on('data',x=>log+=x);server.stderr.on('data',x=>log+=x);
 const checks=[],errors=[];const pass=x=>{checks.push(x);console.log('PASS '+x);};
 try{
  await new Promise((resolve,reject)=>{const t=setInterval(()=>{if(log.includes('listening')){clearInterval(t);resolve();}},20);setTimeout(()=>{clearInterval(t);reject(Error(log));},10000);});
  browser=await chromium.launch({executablePath:await bin.executablePath(),headless:true,args:[...bin.args,'--no-sandbox','--disable-dev-shm-usage']});
  const host=await browser.newPage({viewport:{width:1280,height:900}}),ctx=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:844,height:390}}),phone=await ctx.newPage(),peer=await browser.newPage({viewport:{width:1280,height:900}});
  for(const p of [host,phone,peer]){p.on('pageerror',e=>errors.push(e.message));await p.goto(`http://127.0.0.1:${port}/`);}
  assert.ok(await host.locator('#quick-guide .guide-desktop').isVisible());assert.ok(!await host.locator('#quick-guide .guide-touch').isVisible());assert.ok(await phone.locator('#quick-guide .guide-touch').isVisible());assert.ok(!await phone.locator('#quick-guide .guide-desktop').isVisible());
  assert.match(await host.locator('#quick-guide').innerText(),/Tongues never do/);assert.match(await phone.locator('#quick-guide').innerText(),/Left pad/);
  await host.locator('#home-help').click();await host.locator('#help-dialog').waitFor({state:'visible'});await host.locator('#help-close').click();pass('home teaches desktop/touch controls and exact rules; visible Controls & Rules opens help');
  await host.locator('#name').fill('New Desktop');await host.locator('#create').click();await host.locator('#lobby').waitFor({state:'visible'});const code=await host.locator('#code').textContent();
  for(const [p,name] of [[phone,'New Touch'],[peer,'Third Frog']]){await p.locator('#name').fill(name);await p.locator('#join-code').fill(code);await p.locator('#join').click();await p.locator('#lobby').waitFor({state:'visible'});}
  assert.ok(await phone.locator('#lobby-guide .guide-touch').isVisible());assert.ok(await host.locator('#lobby-guide .guide-desktop').isVisible());assert.match(await phone.locator('#lifecycle-hint').innerText(),/30 seconds/);pass('three-client mixed lobby teaches controls before Ready and explains same-tab reconnect');
  for(const p of [host,phone,peer])await p.locator('#ready').click();await host.locator('#start').click();await host.waitForFunction(()=>window.spikeDebug.playing);await phone.waitForFunction(()=>window.spikeDebug.playing);
  const original=await host.evaluate(()=>({room:window.spikeDebug.room.roomId,id:window.spikeDebug.playerId,slot:window.spikeDebug.slot}));
  async function arrange(positions){const reset=await host.evaluate(()=>window.spikeDebug.lastReset);await host.evaluate(p=>window.spikeDebug.room.send('outbreak-test',{positions:p}),positions);await host.waitForFunction(n=>window.spikeDebug.lastReset!==n,reset);await host.waitForTimeout(100);}
  await arrange([[16,11],[24,20.5],[3,20.5]]);await host.keyboard.down('KeyW');await host.keyboard.down('Space');await host.waitForFunction(()=>window.spikeDebug.snapshots.at(-1).state.frogs[0].tongue?.phase==='attached');
  await host.locator('#help').click();await host.waitForFunction(()=>document.querySelector('#help-dialog').open&&!window.spikeDebug.snapshots.at(-1).state.frogs[0].tongue&&!window.spikeDebug.snapshots.at(-1).state.frogs[0].input.held);
  await host.keyboard.up('KeyW');await host.keyboard.up('Space');await host.keyboard.press('KeyD');assert.deepEqual(await host.evaluate(()=>window.spikeDebug.input),{x:0,y:0,held:false});
  await host.locator('#help-close').click();await host.keyboard.down('KeyD');await host.waitForFunction(()=>window.spikeDebug.snapshots.at(-1).state.frogs[0].input.x===1);await host.keyboard.up('KeyD');pass('help releases held terrain grapple; modal keyboard stays neutral; fresh keyboard input resumes without reconnect');
  const cdp=await ctx.newCDPSession(phone),points=new Map();
  async function touch(id,target,dx=0){const r=await phone.locator(target).boundingBox();points.set(id,{id,x:r.x+r.width/2+dx,y:r.y+r.height/2});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[...points.values()]});}
  async function cancel(){await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});points.clear();}
  await arrange([[3,20.5],[12,20.5],[29,20.5]]);await touch(1,'#direction-pad',28);await touch(2,'#touch-action');await phone.waitForFunction(()=>window.spikeDebug.input.x===1&&window.spikeDebug.input.held);
  await phone.locator('#help').click();await phone.waitForFunction(()=>document.querySelector('#help-dialog').open&&!window.spikeDebug.input.held&&window.spikeDebug.input.x===0);
  await cancel();await phone.keyboard.press('Space');assert.equal(await phone.evaluate(()=>window.spikeDebug.input.held),false);await phone.locator('#help-close').tap();await phone.waitForTimeout(160);
  for(let i=0;i<12;i++){await touch(10+i*2,'#direction-pad',i%2?28:-28);await touch(11+i*2,'#touch-action');await phone.waitForFunction(()=>window.spikeDebug.input.x!==0&&window.spikeDebug.input.held);await cancel();await phone.waitForFunction(()=>!window.spikeDebug.input.held&&window.spikeDebug.input.x===0);}
  pass('help clears two-thumb state; 12 fresh touch attach/action/cancel cycles recover; no frozen input');
  await host.locator('#leave').click();await host.locator('#leave-dialog').waitFor({state:'visible'});assert.match(await host.locator('#leave-dialog').innerText(),/everyone/);await host.locator('#leave-cancel').click();
  assert.deepEqual(await host.evaluate(()=>({room:window.spikeDebug.room.roomId,id:window.spikeDebug.playerId,slot:window.spikeDebug.slot})),original);assert.ok(await host.evaluate(()=>window.spikeDebug.playing));pass('host Leave warns that everyone is affected; cancel preserves the existing match and frog');
  for(const viewport of [{width:844,height:390},{width:667,height:375},{width:568,height:320}]){
   await phone.setViewportSize(viewport);await phone.waitForTimeout(180);const boxes=await phone.evaluate(()=>{const box=id=>{const r=document.querySelector(id).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};return {canvas:box('canvas'),left:box('#direction-pad'),right:box('#touch-action'),footer:box('#session-footer'),width:innerWidth,height:innerHeight};});
   assert.ok(Math.abs(boxes.canvas.width/boxes.canvas.height-16/9)<.02);assert.ok(boxes.canvas.y+boxes.canvas.height<=boxes.height+1);assert.ok(boxes.footer.y+boxes.footer.height<=boxes.height+1);assert.ok(boxes.left.width>=80&&boxes.right.width>=80);assert.ok(boxes.left.x+boxes.left.width<=boxes.canvas.x&&boxes.canvas.x+boxes.canvas.width<=boxes.right.x);
   await phone.locator('#help').tap();await phone.locator('#help-close').scrollIntoViewIfNeeded();await phone.locator('#help-close').tap();
  }
  await phone.setViewportSize({width:390,height:844});await phone.locator('#rotate-prompt').waitFor({state:'visible'});await phone.setViewportSize({width:844,height:390});await phone.locator('#rotate-prompt').waitFor({state:'hidden'});pass('small landscape canvas/controls/footer fit; help can scroll/close; orientation preserves session');
  await phone.reload();await phone.waitForFunction(()=>window.spikeDebug.playing&&window.spikeDebug.slot===1);pass('same-tab refresh restores phone identity while desktop match continues');
  for(let round=1;round<=3;round++){
   await host.waitForFunction(r=>window.spikeDebug.outbreak?.phase==='playing'&&window.spikeDebug.outbreak.round===r,round);await arrange([[16,9],[16.88,9],[15.12,9]]);await host.locator('#results').waitFor({state:'visible'});assert.equal(await host.locator('#results-context').innerText(),`Round ${round} of 3`);assert.match(await host.locator('#standings').innerText(),/Survival.*Bonus.*Round score/s);await host.locator('#next-round').click();
  }
  await host.waitForFunction(()=>window.spikeDebug.outbreak?.phase==='match-results');await host.locator('#results-context').filter({hasText:'3 rounds played'}).waitFor({state:'visible'});assert.match(await host.locator('#results-context').innerText(),/3 rounds played/);await host.locator('#return-lobby').click();await host.locator('#lobby').waitFor({state:'visible'});assert.equal(await host.locator('#code').textContent(),code);pass('round context, survival breakdown, final standings and same-room rematch work');
  for(const p of [host,phone,peer])await p.locator('#ready').click();await host.locator('#start').click();await phone.waitForFunction(()=>window.spikeDebug.playing);await phone.locator('#leave').click();await phone.locator('#leave-dialog').waitFor({state:'visible'});await phone.locator('#leave-confirm').click();await phone.locator('#home').waitFor({state:'visible'});await host.locator('#lobby').waitFor({state:'visible'});assert.equal(await phone.locator('#notice').innerText(),'');pass('non-host explicit Leave also warns; confirm returns others to lobby and clears old notice');
  await host.locator('#leave').click();await host.locator('#home').waitFor({state:'visible'});assert.equal(await host.locator('#notice').innerText(),'');assert.equal(errors.length,0);
  await host.screenshot({path:'docs/results/onboarding-milestone-7.jpg',fullPage:true});
  fs.writeFileSync('docs/results/onboarding-milestone-7.json',JSON.stringify({environment:'Local compiled server; isolated Chromium desktop and trusted CDP touch phone; test-only arrangements and shortened intro, unchanged grace; not physical iOS/Android',checks,errors},null,2));
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
