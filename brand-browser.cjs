const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();fs.mkdirSync('brand-shots',{recursive:true});const report=[];
for(const width of [320,390,1280])for(const file of ['index.html','exhibits.html','discoveries.html','author.html','404.html']){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8765/')?r.continue():r.abort());
 await page.goto('http://127.0.0.1:8765/earthnumber/'+file);await page.evaluate(()=>document.fonts.ready);
 assert(await page.locator('header .brand-lockup').evaluate(i=>i.complete&&i.naturalWidth>0),'logo loads '+file);
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'no overflow '+file+' '+width);
 const boxes=await page.locator('header>.brand,header>.header-actions,header>.author-back,header>.header-catalog').evaluateAll(es=>es.map(e=>{let r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}}));
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(!(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1),'header overlap '+file+' '+width)}
 await page.screenshot({path:`brand-shots/${file}-${width}.png`});
 if(file==='index.html'){
  for(let n=0;n<2;n++){await page.locator('#menuBtn').click();await page.locator('#menuSearch').fill('水');await page.keyboard.press('Escape');assert(await page.locator('#menu').evaluate(e=>e.hidden));}
  await page.locator('footer').scrollIntoViewIfNeeded();await page.screenshot({path:`brand-shots/footer-${width}.png`});
 }
 assert(!errors.length,errors.join('\n'));report.push({file,width,errors,logo:true,overflow:false,overlap:false});await page.close();
}
fs.writeFileSync('brand-shots/report.json',JSON.stringify(report,null,2));await browser.close();})();
