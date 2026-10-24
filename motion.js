'use strict';
let allMotionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,orbitPlaying=false,explode=false;
function setMotionState(){document.body.classList.toggle('motion-paused',allMotionPaused);$('#motionToggle').setAttribute('aria-pressed',allMotionPaused);$('#motionToggle').setAttribute('aria-label',allMotionPaused?'アニメーションを再開':'アニメーションを停止');$('#motionToggle').textContent=allMotionPaused?'▶ Motion':'Ⅱ Motion';if(allMotionPaused){stopLight()}}
$('#motionToggle').onclick=()=>{allMotionPaused=!allMotionPaused;setMotionState()};setMotionState();
const activeSections=new Set();const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('in-view',e.isIntersecting);if(e.isIntersecting){activeSections.add(e.target.id);e.target.classList.add('was-seen')}else activeSections.delete(e.target.id)}),{threshold:.08});$$('main>section').forEach(s=>sectionObserver.observe(s));
$('#orbitPlay').onclick=()=>{orbitPlaying=!orbitPlaying;$('#orbitPlay').textContent=orbitPlaying?'軌道モデルを止める Ⅱ':'軌道モデルを動かす →'};$('#phase').addEventListener('input',()=>{orbitPlaying=false;$('#orbitPlay').textContent='軌道モデルを動かす →'});
const originalSetLayer=setLayer;setLayer=function(i){originalSetLayer(i);$('.cross-section').dataset.layer=i};
$('#explodeEarth').onclick=()=>{explode=!explode;$('.cross-section').classList.toggle('exploded',explode);$('#explodeEarth').textContent=explode?'同一縮尺に戻す −':'層を分けて見る ＋';$('.cross-section>span').textContent=explode?'EXPLODED VIEW / 位置をずらした模式表示':'SECTION / TRUE RADIAL SCALE'};
const originalSetTime=setTime;setTime=function(i){originalSetTime(i);const f=1-events[i][1]/4.54e9;$('#dayArc').setAttribute('stroke-dasharray',`${f*534} 534`);$('#clockHand').style.transform=`rotate(${f*360}deg)`};setTime(4);
$('#earthSize').addEventListener('input',()=>{const f=.65+(+$('#earthSize').value/200)*.35;$('.air-earth').style.transform=`scale(${f})`;$('.air .diagram-caption').textContent='数字は模型寸法。図は地球と50 kmの層の比率を保って表示。'});
$('#solarMinutes').addEventListener('input',()=>{$('.sun-orbit').style.setProperty('--sun-rate',Math.max(3,22-(+$('#solarMinutes').value/120)*19)+'s')});
const originalUpdateDistance=updateDistance;updateDistance=function(){originalUpdateDistance();const p=planets[planetIndex];$('#orbit').querySelectorAll('circle').forEach((c,i)=>{if(i===2)c.classList.add('moving-planet')})};updateDistance();
let prevTime=performance.now(),animTime=0,orbitTime=0;
function animateFrame(t){const dt=Math.min(.06,(t-prevTime)/1000);prevTime=t;if(!allMotionPaused&&!document.hidden){animTime+=dt;if(orbitPlaying&&activeSections.has('distance')){orbitTime+=dt;$('#phase').value=Math.round((Math.sin(orbitTime*.3-Math.PI/2)+1)*90);updateDistance()}
if(activeSections.has('dna')){let back='',front='',rungs='';for(let i=0;i<=100;i++){const x=i*10,angle=x/65+animTime*.75,y=90+Math.sin(angle)*56,y2=90-Math.sin(angle)*56;back+=(i?'L':'M')+x+','+y+' ';front+=(i?'L':'M')+x+','+y2+' ';if(i%2===0)rungs+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y2}" stroke="#8DA9D9" stroke-width="1.5" opacity="${.4+Math.abs(Math.cos(angle))*.4}"/>`}$('#dnaHelix').innerHTML=`${rungs}<path d="${back}" fill="none" stroke="#0033AD" stroke-width="3"/><path d="${front}" fill="none" stroke="#E7744C" stroke-width="3"/>`}}
requestAnimationFrame(animateFrame)}requestAnimationFrame(animateFrame);
// A fixed helix for reduced-motion users.
if(allMotionPaused){$('#dnaHelix').innerHTML='<path d="M0 90Q60 -20 120 90T240 90T360 90T480 90T600 90T720 90T840 90T960 90" fill="none" stroke="#0033AD" stroke-width="3"/><path d="M0 90Q60 200 120 90T240 90T360 90T480 90T600 90T720 90T840 90T960 90" fill="none" stroke="#E7744C" stroke-width="3"/>'}
// Persist animation preference in this browser only.
try{if(localStorage.getItem('earth-number-motion')==='paused'){allMotionPaused=true;setMotionState()}$('#motionToggle').addEventListener('click',()=>localStorage.setItem('earth-number-motion',allMotionPaused?'paused':'playing'))}catch{}
