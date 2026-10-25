const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function fixture(reduced=false,hasExisting=false){let ctx,now=0,id=0,pending=new Map(),lastImage,clears=0,observer;const all=[];
 function el(tag='DIV'){const e={tagName:tag,events:{},attrs:{},style:{},disabled:false,textContent:'',setAttribute(k,v){this.attrs[k]=v},remove(){this.removed=true},append(){},matches(){return true},getBoundingClientRect(){return {left:0,top:0,width:100,height:44}},addEventListener(k,fn,opt={}){this.events[k]=fn;opt.signal?.addEventListener('abort',()=>{if(this.events[k]===fn)delete this.events[k]})}};all.push(e);return e;}
 const body=el(),classes=new Set();body.classList={contains:k=>classes.has(k),toggle(k,on){if(on)classes.add(k);else classes.delete(k)},add(...ks){ks.forEach(k=>classes.add(k))},remove(...ks){ks.forEach(k=>classes.delete(k))}};body.prepend=e=>body.canvas=e;
 const mainToggle=el('BUTTON');const doc=el();doc.body=body;doc.hidden=false;doc.createElement=tag=>{const e=el(tag);if(tag==='canvas')e.getContext=()=>({clearRect(){clears++},createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)}},putImageData(image){lastImage=image}});return e};doc.querySelector=s=>s==='header'?el():s==='#motionToggle'&&hasExisting?mainToggle:null;
 const media=el();media.matches=reduced;const win=el();ctx={window:win,document:doc,innerWidth:1200,innerHeight:800,scrollY:0,AbortController,Float32Array,matchMedia:()=>media,localStorage:{getItem(){return null},setItem(){}},performance:{now:()=>now},requestAnimationFrame:fn=>{pending.set(++id,fn);return id},cancelAnimationFrame:i=>pending.delete(i),MutationObserver:class{constructor(fn){observer=fn}observe(){}disconnect(){}}};
 function execute(){vm.runInNewContext(fs.readFileSync('earth-experience.js','utf8'),ctx)}execute();
 function run(t){now=t;const tasks=[...pending.values()];pending.clear();tasks.forEach(f=>f(t));}
 return {ctx,win,doc,media,all,pending,run,execute,mutate:()=>observer?.(),setTime:t=>now=t,get image(){return lastImage},get clears(){return clears}};
}
let f=fixture();assert.equal(f.pending.size,0,'idle has no frame loop');assert.equal(f.doc.body.canvas.attrs['aria-hidden'],'true');assert(f.doc.body.canvas.width<=320&&f.doc.body.canvas.height<=320);
const baseline=Uint8ClampedArray.from(f.image.data);
f.doc.events.pointerdown({clientX:600,clientY:400});for(let t=0;t<1000;t+=34)f.run(t);assert(f.image.data.some((x,i)=>i%4===3&&x>0),'wave paints alpha');assert(f.image.data.every(Number.isFinite));for(let t=1000;t<5000;t+=34)f.run(t);assert.equal(f.pending.size,0,'settled surface stops work');assert.deepEqual(f.image.data,baseline,'settled surface returns exactly to static contour without a hard blank');assert(f.image.data.every((v,i)=>i%4!==3||v<=125),'alpha capped');
f.setTime(6000);f.doc.events.pointermove({clientX:-200,clientY:99999,buttons:1});f.run(6034);assert(f.image.data.every(Number.isFinite));f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.pending.size,0);f.doc.hidden=false;f.doc.events.visibilitychange();assert.equal(f.pending.size,1);
f.win.earthLiquidExperience.destroy();assert.equal(f.pending.size,0);assert(!f.doc.events.pointerdown,'abort removes input listener');f.execute();assert(f.win.earthLiquidExperience);f.win.earthLiquidExperience.destroy();
f=fixture(true);f.doc.events.pointerdown({clientX:200,clientY:200});assert.equal(f.pending.size,0,'reduced motion schedules no frames');f.win.earthLiquidExperience.destroy();console.log('PASS bounded field, pointer response, idle settle, hidden pause, cleanup/reinit and reduced motion');

f=fixture(false,true);f.doc.events.pointerdown({clientX:300,clientY:200});assert.equal(f.pending.size,1);f.doc.body.classList.add('motion-paused');f.mutate();assert.equal(f.pending.size,0,'existing global stop cancels field');f.doc.body.classList.remove('motion-paused');f.mutate();f.doc.events.pointerdown({clientX:300,clientY:200});assert.equal(f.pending.size,1,'existing global resume allows response');f.media.matches=true;f.media.events.change({matches:true});f.mutate();assert.equal(f.pending.size,0,'own class mutation cannot undo reduced motion');f.win.earthLiquidExperience.destroy();console.log('PASS main global pause/resume and reduced-motion observer feedback');

if(process.env.RENDER_FRAMES){
 const shot=fixture();shot.doc.events.pointerdown({clientX:600,clientY:400});
 for(let t=0;t<=1836;t+=34){shot.run(t);if([204,816,1802].includes(t)){fs.writeFileSync('/tmp/earth-material-'+t+'.rgba',shot.image.data);fs.writeFileSync('/tmp/earth-material-size.json',JSON.stringify([shot.doc.body.canvas.width,shot.doc.body.canvas.height]));}}
 shot.win.earthLiquidExperience.destroy();
}

if(process.env.RENDER_FRAMES){
 const stroke=fixture();stroke.doc.events.pointerdown({clientX:240,clientY:400});
 for(let t=0;t<=3604;t+=34){stroke.setTime(t);if(t<=1360&&t%68===0)stroke.doc.events.pointermove({clientX:240+t/1360*720,clientY:400,buttons:1});stroke.run(t);if([1564,2176,3162].includes(t))fs.writeFileSync('/tmp/earth-material-stroke-'+t+'.rgba',stroke.image.data);}
 stroke.win.earthLiquidExperience.destroy();
}

f=fixture();f.doc.events.pointerdown({clientX:300,clientY:300});
for(let t=0;t<5000;t+=34)f.run(t);
f.setTime(6000);f.doc.events.pointermove({clientX:300,clientY:300,buttons:1});
assert.equal(f.pending.size,0,'stationary pointer adds no repeated circular impulse');
f.setTime(6100);f.doc.events.pointermove({clientX:600,clientY:300,buttons:1});f.run(6134);
assert.equal(f.pending.size,1,'directional movement creates a wake');
assert(f.image.data.every(Number.isFinite));f.win.earthLiquidExperience.destroy();
console.log('PASS stationary gesture injects no energy; movement creates a finite directional wake');
