from pathlib import Path
from html.parser import HTMLParser
import json,re
P=Path(__file__).parent
class Page(HTMLParser):
 def __init__(self):super().__init__();self.tags=[]
 def handle_starttag(self,t,a):self.tags.append((t,dict(a)))
for p in P.glob('*.html'):
 text=p.read_text();s=Page();s.feed(text)
 assert any(t=='img'and a.get('class')=='brand-lockup'and a.get('alt')=='Earth Number'for t,a in s.tags),p
 assert 'brand.css?v=20261031-c'in text and '2026.10.31'in text,p
 for t,a in s.tags:
  if t in ['img','link']:
   u=a.get('src')or a.get('href','')
   if not u or u.startswith(('http','#','data:')):continue
   path=u.split('?')[0].replace('/earthnumber/','')
   # Existing sponsor marks are not touched by this change.
   if 'mineralion-logo'in path or 'themarox-logo'in path:continue
   assert (P/path).exists(),(p,path)
 for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):json.loads(m[1])
 assert text.count('class="exhibit')==(31 if p.name=='index.html'else 3 if p.name=='discoveries.html'else text.count('class="exhibit'))
assert '<text'not in(P/'assets/earth-number-logo.svg').read_text()
m=json.loads((P/'site.webmanifest').read_text());assert m['start_url']=='/earthnumber/'and m['scope']=='/earthnumber/'
assert len([i for i in m['icons']if i['purpose']=='maskable'])==1
print('PASS brand metadata, five page marks, asset paths, JSON-LD, manifest scope and outlined logo')
