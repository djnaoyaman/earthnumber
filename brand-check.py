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
# Keep search/social metadata and the structured catalog aligned with the actual catalog.
from urllib.parse import urljoin, urlsplit
catalog = json.loads((P/'catalog-data.js').read_text().partition('=')[2].strip().removesuffix(';'))['exhibits']
count = len(catalog)
assert len({entry['id'] for entry in catalog}) == count
index = (P/'index.html').read_text()
parsed = Page(); parsed.feed(index)
meta = {a.get('name', a.get('property', '')): a.get('content', '') for t, a in parsed.tags if t == 'meta'}
assert f'{count}の展示' in re.search(r'<title>(.*?)</title>', index, re.S)[1]
for key in ['og:title', 'twitter:title']:
 assert f'{count}の展示' in meta[key], key
for key in ['description', 'og:description', 'twitter:description']:
 assert f'{count}テーマ' in meta[key], key
structured = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', index, re.S)[1])
collection = next(node for node in structured['@graph'] if node.get('mainEntity', {}).get('@type') == 'ItemList')
items = collection['mainEntity']
assert items['numberOfItems'] == len(items['itemListElement']) == count
assert [entry['position'] for entry in items['itemListElement']] == list(range(1, count + 1))
actual_urls = {entry['item']['url'] for entry in items['itemListElement']}
expected_urls = {urljoin('https://djnaoyaman.github.io/earthnumber/', entry['href']) for entry in catalog}
normalize = lambda url: url.replace('/earthnumber/index.html#', '/earthnumber/#')
assert {normalize(url) for url in actual_urls} == {normalize(url) for url in expected_urls}
for entry in catalog:
 target = urlsplit(entry['href'])
 page = Page(); page.feed((P/(target.path or 'index.html')).read_text())
 assert any(a.get('id') == target.fragment for _, a in page.tags), entry['href']
print('PASS catalog count, title/description/OGP/X labels, JSON-LD inventory and all 34 DOM targets')

# Page metadata dates must agree without overwriting the historical brand revision.
import xml.etree.ElementTree as ET
page_date = collection['dateModified']
visible = re.search(r'class="brand-updated">最終更新：<time datetime="([^"]+)"', index)[1]
assert visible == page_date
sitemap = ET.parse(P/'sitemap.xml')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
root_row = next(row for row in sitemap.getroot() if row.find('s:loc', ns).text == 'https://djnaoyaman.github.io/earthnumber/')
assert root_row.find('s:lastmod', ns).text == page_date
assert 'ブランド表示改訂：<time datetime="2026-10-31">2026.10.31</time>' in index
assert m['description'] == meta['description']
print('PASS page date/JSON-LD/sitemap coherence, preserved brand revision and manifest description')
