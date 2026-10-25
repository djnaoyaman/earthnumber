const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const handlers={};let doc;
const el=(id,tagName='BUTTON')=>({id,tagName,hidden:false,inert:false,isConnected:true,disabled:false,value:'',attrs:{},events:{},dataset:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.events[k]=fn},focus(){doc.activeElement=this},closest(s){return s==='[hidden]'&&this.hidden?this:null}});
const menu=el('menu','NAV');menu.hidden=true;const header=el('header','HEADER'),main=el('main','MAIN'),footer=el('footer','FOOTER');footer.inert=true;
const nodes=Object.fromEntries(['menuBtn','closeMenu','menuSearch','clearMenuSearch','menuSearchCount','menuEmpty'].map(id=>[id,el(id)]));nodes.menu=menu;
const links=['水と海','雨と水','鉄の材料'].map(word=>{let e=el(word,'A');e.dataset.search=word;return e});
const groups=[{hidden:false,querySelectorAll:()=>links.slice(0,2)},{hidden:false,querySelectorAll:()=>links.slice(2)}];
menu.querySelectorAll=()=>[nodes.closeMenu,nodes.menuSearch,nodes.clearMenuSearch,...links];
doc={activeElement:nodes.menuBtn,body:{style:{overflow:'auto'},children:[header,menu,main,footer]},addEventListener(k,fn){handlers[k]=fn}};
const ctx={document:doc,$:s=>nodes[s.slice(1)],$$:s=>s==='#menuLinks a'?links:groups};
const code=fs.readFileSync('app.js','utf8');vm.runInNewContext(code.slice(code.indexOf('let menuReturnFocus'),code.indexOf('const planets=')),ctx);
ctx.toggleMenu(true);assert(!menu.hidden);assert(header.inert&&main.inert);assert.equal(doc.activeElement,nodes.menuSearch);assert.equal(doc.body.style.overflow,'hidden');ctx.toggleMenu(true);ctx.toggleMenu(false);assert(menu.hidden);assert(!header.inert&&!main.inert&&footer.inert);assert.equal(doc.activeElement,nodes.menuBtn);assert.equal(doc.body.style.overflow,'auto');
const opener=el('deep-exhibit');doc.activeElement=opener;ctx.toggleMenu(true);handlers.keydown({key:'Escape',preventDefault(){}});assert.equal(doc.activeElement,opener,'returns to originating exhibit rather than page top');
ctx.toggleMenu(true);nodes.menuSearch.value='水';ctx.filterMenu();assert.equal(links.filter(l=>!l.hidden).length,2);assert.equal(groups[1].hidden,true);nodes.menuSearch.value='存在しない';ctx.filterMenu();assert.equal(nodes.menuEmpty.hidden,false);assert.equal(nodes.menuSearchCount.textContent,'0 / 34 の展示');nodes.clearMenuSearch.onclick();assert(links.every(l=>!l.hidden));assert.equal(nodes.menuEmpty.hidden,true);
let prevented=false;doc.activeElement=links.at(-1);menu.events.keydown({key:'Tab',shiftKey:false,preventDefault(){prevented=true}});assert(prevented);assert.equal(doc.activeElement,nodes.closeMenu);ctx.toggleMenu(false);console.log('PASS menu repeat open/close, original focus, inert restoration, search/no-results/reset and focus trap');

// Execute the real late-loaded menu integration, not only the isolated app handlers.
let injected='';
const more=fs.readFileSync('more.js','utf8'),integration=more.split('// All 34 published exhibits, using the shared learning-level and genre catalog.')[1].split("$$('.exhibit')")[0];
vm.runInNewContext(integration,{$:s=>{assert.equal(s,'#menuLinks');return {insertAdjacentHTML(_where,html){injected+=html}}}});
const combined=fs.readFileSync('index.html','utf8')+injected;
assert.equal((combined.match(/type="search"/g)||[]).length,1,'one search input after more.js initialization');
assert(!more.includes('indexSearch')&&!more.includes('indexCount'),'no legacy second filter or stale count');
assert(injected.includes('href="exhibits.html"'),'catalog link retained');
console.log('PASS actual more.js menu integration has one search input/filter and preserved catalog link');
