// Run against a local static server. Optional PLAYWRIGHT_MODULE points to an installed runtime.
import assert from 'node:assert/strict';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.SITE_URL || 'http://127.0.0.1:8177';
const browser=await chromium.launch({headless:true,channel:'chrome'});
let checks=0;
const errors=[];
const routes=['/','/animal-rescue.html','/privacy.html','/delete-account.html','/popora/','/popora/support.html','/popora/privacy.html','/popora/delete-account.html','/popora/notices/'];
function check(ok,message){checks++;assert.ok(ok,message);}
try {
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},locale:'ja-JP'});
  await context.addInitScript(()=>localStorage.setItem('anshin-language','ko'));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const response=await page.goto(base+route+'?lang=ko');await page.evaluate(()=>document.fonts.ready);
   // The notice mirror may be replaced by a live response (4-second timeout).
   if(route==='/popora/notices/') await page.waitForTimeout(4300);
   await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,lang:document.documentElement.lang,otherLanguage:/[\uac00-\ud7af\u3040-\u30ff\u4e00-\u9fff]/.test(document.body.innerText),broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
   check(response.ok(),`${width} ${route}: response`);check(!state.overflow,`${width} ${route}: horizontal overflow`);check(state.lang==='en'&&!state.otherLanguage,`${width} ${route}: English`);check(!state.broken.length,`${width} ${route}: broken images ${state.broken.join(", ")}`);
  }
  await page.goto(base);
  await page.locator('#tab-animal').click();check(await page.locator('#world-animal').isVisible(),'Animal panel opens');check(!await page.locator('#world-popora').isVisible(),'POPORA panel closes');
  await page.locator('#tab-animal').press('ArrowLeft');check(await page.locator('#world-popora').isVisible(),'Keyboard tab navigation');check(await page.locator('#tab-popora').evaluate(e=>document.activeElement===e),'Focus follows selected tab');
  await page.locator('#change-season').scrollIntoViewIfNeeded();
  const hash=()=>page.locator('canvas').evaluate(e=>e.toDataURL());
  const seasons=new Set();const pixels=new Set();
  for(let i=0;i<4;i++){await page.locator('#change-season').click();seasons.add(await page.locator('#season-readout').innerText());pixels.add(await hash());}
  check(seasons.size===4&&pixels.size===4,'Four distinct seasons and drawings');
  await page.locator('canvas').scrollIntoViewIfNeeded();await page.waitForTimeout(150);const start=await hash();await page.waitForTimeout(200);check(start!==await hash(),'NOMOs animate while canvas is visible');
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150);const stopped=await hash();await page.waitForTimeout(180);check(stopped===await hash(),'Offscreen canvas stops');
  await page.locator('.motion-toggle').click();check(await page.locator('body').evaluate(e=>e.classList.contains('motion-paused')),'Motion toggle pauses graphics');
  await page.locator('canvas').scrollIntoViewIfNeeded();await page.waitForTimeout(100);const paused=await hash();await page.waitForTimeout(180);check(paused===await hash(),'Visible canvas stays still when paused');
  await page.reload();check(await page.locator('.motion-toggle').getAttribute('aria-pressed')==='true','Motion preference survives navigation');
  await context.close();
 }
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 check(await page.locator('.motion-toggle').isDisabled(),'Reduced-motion system preference respected');await page.locator('canvas').scrollIntoViewIfNeeded();await page.waitForTimeout(120);let image=await page.locator('canvas').evaluate(e=>e.toDataURL());await page.waitForTimeout(160);check(image===await page.locator('canvas').evaluate(e=>e.toDataURL()),'Reduced motion static canvas');
 await page.locator('#change-season').click();check(image!==await page.locator('canvas').evaluate(e=>e.toDataURL()),'Season selection still works without animation');
 const links=new Set();
 for(const route of routes){await page.goto(base+route);for(const href of await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.href).filter(h=>h.startsWith(location.origin))))links.add(href);}
 for(const href of links)check((await page.request.get(href)).ok(),'Working internal link '+href);
 check(!errors.length,'No runtime errors: '+errors.join(';'));
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base);check(await nojs.locator('h1').isVisible(),'Core content available without JavaScript');check(await nojs.locator('a[href="/animal-rescue.html"]').last().isVisible(),'Both game routes accessible without JavaScript');
 console.log(JSON.stringify({checks,failures:0,widths:[320,390,768,1440],routes:routes.length,errors},null,2));
} finally {await browser.close();}
