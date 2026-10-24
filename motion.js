'use strict';
let allMotionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,orbitPlaying=false,explode=false;
function setMotionState(){document.body.classList.toggle('motion-paused',allMotionPaused);$('#motionToggle').setAttribute('aria-pressed',allMotionPaused);$('#motionToggle').setAttribute('aria-label',allMotionPaused?'動きを再開する':'動きを止める');$('#motionToggle').textContent=allMotionPaused?'▶ 動かす':'Ⅱ 止める';if(allMotionPaused)stopLight()}
$('#motionToggle').onclick=()=>{allMotionPaused=!allMotionPaused;setMotionState()};setMotionState();
const activeSections=new Set();const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('in-view',e.isIntersecting);if(e.isIntersecting){activeSections.add(e.target.id);e.target.classList.add('was-seen')}else activeSections.delete(e.target.id)}),{threshold:.08});$$('main>section').forEach(s=>sectionObserver.observe(s));
$('#orbitPlay').onclick=()=>{orbitPlaying=!orbitPlaying;$('#orbitPlay').textContent=orbitPlaying?'星を止める Ⅱ':'星の位置を動かす ▶'};$('#phase').addEventListener('input',()=>{orbitPlaying=false;$('#orbitPlay').textContent='星の位置を動かす ▶'});
const originalSetLayer=setLayer;setLayer=function(i){originalSetLayer(i);$('.cross-section').dataset.layer=i};
$('#explodeEarth').onclick=()=>{explode=!explode;$('.cross-section').classList.toggle('exploded',explode);$('#explodeEarth').textContent=explode?'元の図に戻す −':'層を分けて見る ＋';$('.cross-section>span').textContent=explode?'層の位置をずらして見せています':'地球の中の大きさを、同じ割合で縮めた図'};
const originalSetTime=setTime;setTime=function(i){originalSetTime(i);const f=1-events[i][1]/4.54e9;$('#dayArc').setAttribute('stroke-dasharray',`${f*534} 534`);$('#clockHand').style.transform=`rotate(${f*360}deg)`};setTime(4);
function scaleAir(){$('.air-earth').style.transform=`scale(${+$('#earthSize').value/200})`;$('.air .diagram-caption').textContent='地球と50 kmまでの空気の層を、同じ割合で小さくした図です。'}$('#earthSize').addEventListener('input',scaleAir);scaleAir();
let prevTime=performance.now(),orbitTime=0;
function animateFrame(t){const dt=Math.min(.06,(t-prevTime)/1000);prevTime=t;if(!allMotionPaused&&!document.hidden&&orbitPlaying&&activeSections.has('distance')){orbitTime+=dt;$('#phase').value=Math.round((Math.sin(orbitTime*.3-Math.PI/2)+1)*90);updateDistance()}requestAnimationFrame(animateFrame)}requestAnimationFrame(animateFrame);
try{if(localStorage.getItem('earth-number-motion')==='paused'){allMotionPaused=true;setMotionState()}$('#motionToggle').addEventListener('click',()=>localStorage.setItem('earth-number-motion',allMotionPaused?'paused':'playing'))}catch{}
