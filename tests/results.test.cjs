const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {createServer}=require('node:http');
const {readFile,mkdir}=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
let server,browser,base;
before(async()=>{
  const root=path.resolve(__dirname,'..');
  server=createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    try{
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
      res.end(await readFile(file));
    }catch{res.writeHead(404).end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  base=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
});
after(async()=>{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));});
async function open(options={}){
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await page.addInitScript(options=>{
    window.analyticsEvents=[];window.writes=[];window.analyticsEnabled=[];
    if(options.consent!==null)localStorage.setItem('eddie_analytics_consent_v2',options.consent||'granted');
    if(options.best!==undefined)localStorage.setItem('eddie_unaufhaltsam_best_boxes_v4',String(options.best));
    let seed=12345;
    Math.random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
    const firestore=()=>({collection:()=>({
      onSnapshot(){},
      doc:()=>({
        get:async()=>({exists:options.remoteBest!==undefined,data:()=>({score:options.remoteBest})}),
        set:async value=>{window.writes.push(value);if(options.failSave)throw Error('offline');}
      })
    })});
    firestore.FieldValue={serverTimestamp:()=> 'server-time'};
    window.firebase={apps:[],initializeApp(config){const app={options:config};this.apps.push(app);return app;},firestore,
      auth:()=>({currentUser:{uid:'test-player'},signInAnonymously:async()=>{}}),
      analytics:()=>({setAnalyticsCollectionEnabled(value){window.analyticsEnabled.push(value);},logEvent(name,params){if(options.failAnalytics)throw Error('blocked');window.analyticsEvents.push({name,params});}})
    };
    navigator.share=async payload=>{window.shared=payload.text;};
  },options);
  await page.clock.install();
  await page.goto(base+'/?utm_source=youtube&utm_medium=profil_link'+(options.debug?'&analytics_debug=1':''));
  return {page,context};
}
async function playRound(page,win=false){
  const correct=await page.locator('.box.focus').getAttribute('data-id');
  for(let i=0;i<40;i++){
    if((await page.locator('#msg').textContent()).includes('Pick the Eddie box'))break;
    await page.clock.runFor(500);
  }
  assert.match(await page.locator('#msg').textContent(),/Pick the Eddie box/);
  const selector=win?`.box[data-id="${correct}"]`:`.box:not([data-id="${correct}"])`;
  await page.locator(selector).first().click();
  if(win)await page.clock.runFor(800);
}
async function lose(page,wins=0){
  await page.locator('#startBtn').click();
  for(let i=0;i<wins;i++)await playRound(page,true);
  await playRound(page,false);
}
const events=page=>page.evaluate(()=>window.analyticsEvents.filter(e=>['game_over','retry_clicked','share_clicked'].includes(e.name)));

test('existing Firebase app and measurement ID are reused',async()=>{
  const {page,context}=await open();
  assert.deepEqual(await page.evaluate(()=>firebase.apps.map(app=>({projectId:app.options.projectId,measurementId:app.options.measurementId}))),[{projectId:'mg-challenge',measurementId:'G-4KYDE7P5W8'}]);
  assert.deepEqual(await events(page),[]);
  await context.close();
});
test('three target events reach the existing consent-gated Analytics adapter once per action',async()=>{
  const {page,context}=await open({debug:true});
  await lose(page);
  assert.equal(await page.locator('#entryPanel').evaluate(el=>el.classList.contains('show')),false);
  assert.match(await page.locator('[data-result="score"]').textContent(),/^Level 2 · \d+,\d Sekunden$/);
  await page.locator('[data-result="share"]').click();
  await page.locator('[data-result="retry"]').dblclick();
  const sent=await events(page);
  assert.deepEqual(sent.map(e=>e.name),['game_over','share_clicked','retry_clicked']);
  for(const event of sent){
    assert.equal(event.params.level,2);
    assert.equal(event.params.current_source,'youtube');
    assert.equal(event.params.debug_mode,true);
    assert.equal(event.params.app_version,'eddie-unaufhaltsam-v3.2-direct-results');
    assert.equal('name' in event.params,false);
    assert.equal('socialHandle' in event.params,false);
  }
  assert.equal(await page.locator('.box').count(),2);
  assert.deepEqual(await page.evaluate(()=>window.writes),[]);
  await context.close();
});
test('denied consent produces no Analytics target events while result/retry still work',async()=>{
  const {page,context}=await open({consent:'denied'});
  await lose(page);
  await page.locator('[data-result="share"]').click();
  await page.locator('[data-result="retry"]').click();
  assert.deepEqual(await page.evaluate(()=>window.analyticsEvents),[]);
  assert.deepEqual(await page.evaluate(()=>window.analyticsEnabled),[]);
  assert.equal(await page.locator('.box').count(),2);
  await context.close();
});
test('no consent decision uses the existing consent dialog, with no Analytics collection',async()=>{
  const {page,context}=await open({consent:null});
  assert.equal(await page.locator('#consentPanel').isVisible(),true);
  assert.deepEqual(await page.evaluate(()=>window.analyticsEvents),[]);
  await context.close();
});
test('failed Analytics does not block immediate retry',async()=>{
  const {page,context}=await open({failAnalytics:true});
  await lose(page);
  await page.locator('[data-result="retry"]').click();
  assert.equal(await page.locator('.box').count(),2);
  await context.close();
});
test('existing box-based record is preserved, ties do not qualify for ranking',async()=>{
  const {page,context}=await open({best:4});
  await lose(page,2);
  assert.equal(await page.locator('[data-result="best"]').textContent(),'Dein Rekord: Level 4');
  assert.equal(await page.locator('[data-result="rank"]').isVisible(),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem('eddie_unaufhaltsam_best_boxes_v4')),'4');
  await context.close();
});
test('new record is local first, ranking remains optional and preserves Firestore schema',async()=>{
  const {page,context}=await open();
  await lose(page,2);
  assert.equal(await page.locator('[data-result="best"]').textContent(),'Neue Bestleistung!');
  assert.deepEqual(await page.evaluate(()=>window.writes),[]);
  await page.locator('[data-result="rank"]').click();
  await page.locator('#nameInput').pressSequentially('Tester');
  await page.locator('#saveScoreBtn').click();
  await page.waitForFunction(()=>window.writes.length===1);
  const record=await page.evaluate(()=>window.writes[0]);
  assert.equal(record.name,'TESTER');assert.equal(record.score,4);
  assert.equal(record.docId,'PLAYER_test-player');assert.equal(record.rounds,2);
  assert.equal(record.clientVersion,'eddie-unaufhaltsam-v3.2-direct-results');
  assert.equal(record.timestamp,'server-time');
  assert.equal('level' in record,false);
  await context.close();
});
test('already higher server score is not overwritten',async()=>{
  const {page,context}=await open({remoteBest:20});
  await lose(page,2);
  await page.locator('[data-result="rank"]').click();
  await page.locator('#nameInput').pressSequentially('Tester');
  await page.locator('#saveScoreBtn').click();
  await page.waitForFunction(()=>document.getElementById('saveScoreBtn').disabled===false);
  assert.deepEqual(await page.evaluate(()=>window.writes),[]);
  await context.close();
});
test('shared challenge contains the completed run and public route without tracking query',async()=>{
  const {page,context}=await open();
  await lose(page);
  await page.locator('[data-result="share"]').click();
  assert.match(await page.evaluate(()=>window.shared),new RegExp('^UNAUFHALTSAM \\| Level 2 in \\d+,\\d Sekunden\\. Schlag mich: '+base+'/$'));
  await context.close();
});
test('share cancellation does not copy; missing APIs expose selectable challenge text',async()=>{
  const {page,context}=await open();
  await lose(page);
  await page.evaluate(()=>{
    navigator.share=async()=>{throw new DOMException('cancelled','AbortError');};
    Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{window.copied=true;}},configurable:true});
  });
  await page.locator('[data-result="share"]').click();
  assert.equal(await page.evaluate(()=>!!window.copied),false);
  await page.evaluate(()=>{navigator.share=undefined;navigator.clipboard.writeText=async()=>{throw Error('denied');};});
  await page.locator('[data-result="share"]').click();
  assert.equal(await page.locator('[data-result="copy"]').isVisible(),true);
  assert.match(await page.locator('[data-result="copy"]').inputValue(),/UNAUFHALTSAM \| Level 2/);
  await context.close();
});
test('reset during a completed-round delay does not revive an old run',async()=>{
  const {page,context}=await open();
  await page.locator('#startBtn').click();
  const correct=await page.locator('.box.focus').getAttribute('data-id');
  await page.clock.runFor(7000);
  await page.locator(`.box[data-id="${correct}"]`).click();
  await page.locator('#resetBtn').click();
  await page.clock.runFor(1000);
  assert.equal(await page.locator('.box').count(),0);
  assert.equal(await page.locator('#startBtn').isVisible(),true);
  assert.deepEqual(await events(page),[]);
  await context.close();
});
test('result text and retry are visible on mobile and desktop',async()=>{
  const {page,context}=await open();
  await lose(page);
  await mkdir(path.resolve(__dirname,'../test-results'),{recursive:true});
  await page.locator('#resultPanel').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.resolve(__dirname,'../test-results/results-mobile.png'),fullPage:true});
  assert.equal(await page.locator('[data-result="score"]').isVisible(),true);
  assert.equal(await page.locator('[data-result="retry"]').isVisible(),true);
  await page.setViewportSize({width:1280,height:900});
  await page.screenshot({path:path.resolve(__dirname,'../test-results/results-desktop.png'),fullPage:true});
  await context.close();
});
