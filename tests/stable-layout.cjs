const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const css=fs.readFileSync('experience.css','utf8');
for(const p of ['index.html','discoveries.html','exhibits.html','author.html']){
 const html=fs.readFileSync(p,'utf8');assert(!html.includes('earth-experience.js'));assert(!html.includes('class="earth-entry"'));assert(html.includes('experience.css?v=restore1'));
}
assert(!fs.existsSync('earth-experience.js'),'withdrawn liquid runtime is removed');
assert(!/earth-liquid|liquid-experience|liquid-motion|pointer|canvas|box-shadow/.test(css),'no liquid overlay, controls or decorative paint');
assert(!/padding-block|main>section|learning-badge/.test(css),'no withdrawn layout/typography overrides');
assert(css.includes('.hero-title,.hero-number,.exhibit.was-seen h2,.exhibit.was-seen .value,.exhibit.was-seen .power-number{animation:none!important;transform:none!important;opacity:1!important}'));
assert(css.includes('.water.in-view #waterSphere{animation:none!important;transform:none!important}'));
assert(css.includes('html{scrollbar-gutter:stable}'));
for(const p of ['style.css','catalog.css','reading.css','visual-review.css','motion.js','extra.js','discoveries-review.js','visual-review.js','catalog-data.js','catalog.js','reading.js'])assert.equal(fs.readFileSync(p,'utf8'),cp.execFileSync('git',['show','5ceb30b:'+p],{encoding:'utf8'}),p+' retains pre-liquid scientific/visual baseline');
for(const p of ['index.html','discoveries.html']){
 const old=cp.execFileSync('git',['show','5ceb30b:'+p],{encoding:'utf8'}),now=fs.readFileSync(p,'utf8');
 const sections=s=>[...s.matchAll(/<section\b[^>]*class="[^"]*exhibit[^"]*"[\s\S]*?<\/section>/g)].map(x=>x[0]);
 assert.equal(sections(now).length,p==='index.html'?31:3);
 assert.deepEqual(sections(now),sections(old),p+' exhibit blocks unchanged');
}
console.log('PASS liquid removal, four-page loader removal, baseline visuals/models/exhibit blocks, independent stable text and gutter');
