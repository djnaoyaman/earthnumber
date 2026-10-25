const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('experience.css','utf8');
assert(!html.includes('class="earth-entry"'),'standalone demo removed');
assert(!fs.readFileSync('earth-experience.js','utf8').includes('[data-water-surface]'),'shared field is not the removed standalone demo');
const rule=css.match(/\.hero-title,\.hero-number,\.exhibit\.was-seen h2,\.exhibit\.was-seen \.value,\.exhibit\.was-seen \.power-number\{([^}]+)\}/)[1];
assert(rule.includes('animation:none!important'));assert(rule.includes('transform:none!important'));assert(rule.includes('opacity:1!important'));
assert(css.includes('.water.in-view #waterSphere{animation:none!important;transform:none!important}'));
for(const p of ['index.html','discoveries.html','exhibits.html','author.html'])assert(fs.readFileSync(p,'utf8').includes('experience.css?v=system1'));
console.log('PASS standalone removal and stable foreground rules in all four pages');
