const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function fixture(reduce=false){
 let pending=new Map(),id=0,writes=0,lastImage;
 const element=()=>({events:{},attrs:{},addEventListener(n,fn){this.events[n]=fn},setAttribute(n,v){this.attrs[n]=v},textContent:'',disabled:false});
 const canvas=element(),button=element(),pause=element(),status=element(),host=element();
 canvas.getBoundingClientRect=()=>({width:900,height:360,left:0,top:0});
 canvas.getContext=()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>{writes++;lastImage=image;}});
 host.querySelector=s=>s==='canvas'?canvas:s==='[data-ripple]'?button:s==='[data-water-pause]'?pause:status;
 const media={matches:reduce,addEventListener(n,fn){this.change=fn}};
 const document={hidden:false,body:{classList:{contains:()=>false}},querySelector:()=>host,addEventListener(n,fn){this[n]=fn}};
 const ctx={AbortController,document,matchMedia:()=>media,Float32Array,Math,performance:{now:()=>100},requestAnimationFrame:fn=>{pending.set(++id,fn);return id},cancelAnimationFrame:i=>pending.delete(i),IntersectionObserver:class{constructor(fn){ctx.visible=fn}observe(){}disconnect(){}},ResizeObserver:class{constructor(fn){}observe(){}disconnect(){}},MutationObserver:class{constructor(fn){ctx.mutate=fn}observe(){}disconnect(){}}};
 vm.runInNewContext(fs.readFileSync('earth-experience.js','utf8'),ctx);
 function run(t){let work=[...pending.values()];pending.clear();work.forEach(fn=>fn(t));}
 return {host,canvas,button,pause,status,media,document,ctx,run,pending,get writes(){return writes},get image(){return lastImage}};
}
let f=fixture();assert.equal(f.pending.size,0,'offscreen has no animation');f.ctx.visible([{isIntersecting:true}]);assert.equal(f.pending.size,1);f.button.events.click();for(let t=0;t<3000;t+=34)f.run(t);assert(f.writes>60);assert(f.image.data.every(Number.isFinite));
fs.writeFileSync('/tmp/earth-water.rgba',f.image.data);fs.writeFileSync('/tmp/earth-water-size.json',JSON.stringify([f.canvas.width,f.canvas.height]));
f.pause.events.click();assert.equal(f.pending.size,0);assert(f.button.disabled);f.pause.events.click();assert.equal(f.pending.size,1);f.document.hidden=true;f.document.visibilitychange();assert.equal(f.pending.size,0);f.document.hidden=false;f.document.visibilitychange();assert.equal(f.pending.size,1);f.ctx.visible([{isIntersecting:false}]);assert.equal(f.pending.size,0);
f=fixture(true);f.ctx.visible([{isIntersecting:true}]);assert.equal(f.pending.size,0,'reduced motion defaults static');assert(f.button.disabled);f.pause.events.click();assert.equal(f.pending.size,1,'explicit opt-in supported');let prevented=false;f.canvas.events.keydown({key:'Enter',preventDefault(){prevented=true}});assert(prevented);console.log('PASS offscreen/hidden/pause/resume/reduced-motion/keyboard and finite rendering');

f.host.earthWaterExperience.destroy();assert.equal(f.pending.size,0,'destroy cancels all animation');assert.equal(f.host.earthWaterExperience,undefined);vm.runInNewContext(fs.readFileSync('earth-experience.js','utf8'),f.ctx);assert(f.host.earthWaterExperience);f.ctx.visible([{isIntersecting:true}]);assert.equal(f.pending.size,0,'reinit preserves reduced-motion default');f.host.earthWaterExperience.destroy();console.log('PASS destroy and reinitialization');
