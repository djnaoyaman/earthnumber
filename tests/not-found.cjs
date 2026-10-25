const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('404.html','utf8');
assert.match(s,/<html lang="ja">/);assert.match(s,/name="robots" content="noindex,follow"/);
assert.match(s,/404 — ページが見つかりません/);assert.match(s,/id="main"/);assert.match(s,/:focus-visible/);
assert(!/<script|<iframe|<video|<canvas|http-equiv="refresh"|animation:/i.test(s));
for(const m of s.matchAll(/href="([^"]+)"/g)){const target=m[1];assert(target.startsWith('/earthnumber/')||target==='#main');if(target.startsWith('/earthnumber/'))assert(fs.existsSync(target.replace('/earthnumber/','')||'index.html'));}
assert.match(s,/@media\(max-width:700px\)/);assert.match(s,/<svg[^>]*viewBox=/);assert.match(s,/class="chart" aria-hidden="true"/);
console.log('404: no-JS recovery, deep-path-safe links, noindex, responsive/focus/decoration checks PASS');
