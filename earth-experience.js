/* A shared tactile light field. Numbers, text and scientific diagrams are not deformed. */
'use strict';
(() => {
  window.earthLiquidExperience?.destroy();
  const life=new AbortController(),listen=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal:life.signal});
  const canvas=document.createElement('canvas');canvas.className='earth-liquid-field';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
  const context=canvas.getContext('2d');if(!context){canvas.remove();return;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const existingToggle=document.querySelector('#motionToggle');let ownToggle=null;
  if(!existingToggle){ownToggle=document.createElement('button');ownToggle.type='button';ownToggle.className='liquid-motion-toggle';ownToggle.setAttribute('aria-label','背景の光と波の動きを切り替える');document.querySelector('header')?.append(ownToggle);}
  let width,height,current,previous,pixels,frame=0,last=0,activeUntil=0,paused=reduced.matches,pointerTime=0,scrollTime=0,lastScroll=scrollY,scrollEnergy=0;
  try{paused=paused||localStorage.getItem('earth-number-motion')==='paused';}catch{}
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  function resize(){
    const scale=Math.max(innerWidth/240,innerHeight/240,4);
    width=Math.max(40,Math.round(innerWidth/scale));height=Math.max(40,Math.round(innerHeight/scale));
    canvas.width=width;canvas.height=height;current=new Float32Array(width*height);previous=new Float32Array(width*height);pixels=context.createImageData(width,height);
    context.clearRect(0,0,width,height);
  }
  function draw(){
    const p=pixels.data;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const i=y*width+x,j=i*4;
      const nx=x>0&&x<width-1?current[i+1]-current[i-1]:0;
      const ny=y>0&&y<height-1?current[i+width]-current[i-width]:0;
      const light=nx*.7+ny*.9;
      const positive=light>0;
      p[j]=positive?190:0;p[j+1]=positive?246:72;p[j+2]=positive?255:145;
      p[j+3]=Math.min(74,Math.abs(light)*36);
    }
    context.putImageData(pixels,0,0);
  }
  function step(){
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const i=y*width+x;previous[i]=((current[i-1]+current[i+1]+current[i-width]+current[i+width])*.5-previous[i])*.974;
    }
    const swap=previous;previous=current;current=swap;
  }
  function allowed(){return !paused&&!document.hidden;}
  function tick(t){frame=0;if(!allowed())return;
    if(t-last>=33){last=t;step();draw();}
    if(t<activeUntil)frame=requestAnimationFrame(tick);else{current.fill(0);previous.fill(0);context.clearRect(0,0,width,height);}
  }
  function wake(){if(allowed()&&!frame)frame=requestAnimationFrame(tick);}
  function ripple(x,y,strength=3){
    if(!allowed())return;
    const cx=clamp(Math.round(x*width),5,width-6),cy=clamp(Math.round(y*height),5,height-6);
    for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++)current[(cy+dy)*width+cx+dx]+=Math.exp(-(dx*dx+dy*dy)/9)*strength;
    activeUntil=performance.now()+4200;wake();
  }
  function setPaused(next){
    paused=next;document.body.classList.toggle('liquid-paused',paused);
    if(ownToggle){ownToggle.textContent=paused?'光と波を動かす':'光と波を止める';ownToggle.setAttribute('aria-pressed',String(paused));ownToggle.disabled=reduced.matches;if(reduced.matches)ownToggle.textContent='動きを少なくする設定中';}
    if(paused){if(frame)cancelAnimationFrame(frame);frame=0;current.fill(0);previous.fill(0);context.clearRect(0,0,width,height);}
  }
  listen(document,'pointerdown',e=>{ripple(e.clientX/innerWidth,e.clientY/innerHeight,5);},{passive:true});
  listen(document,'pointermove',e=>{const now=performance.now();if(now-pointerTime<55)return;pointerTime=now;ripple(e.clientX/innerWidth,e.clientY/innerHeight,e.buttons?3.5:1.1);},{passive:true});
  listen(window,'scroll',()=>{const now=performance.now(),delta=scrollY-lastScroll;lastScroll=scrollY;scrollEnergy+=Math.abs(delta);if(now-scrollTime<95||scrollEnergy<2)return;scrollTime=now;ripple(.5,delta>0?.76:.24,Math.min(2,scrollEnergy/160));scrollEnergy=0;},{passive:true});
  listen(document,'keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const target=e.target;if(!target?.matches?.('button,a,summary,input'))return;const r=target.getBoundingClientRect();ripple((r.left+r.width/2)/innerWidth,(r.top+r.height/2)/innerHeight,4);});
  listen(window,'resize',resize);
  listen(document,'visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else wake();});
  listen(reduced,'change',e=>setPaused(e.matches||document.body.classList.contains('motion-paused')));
  let observer=null,lastGlobalPaused=document.body.classList.contains('motion-paused');
  if(existingToggle){observer=new MutationObserver(()=>{const next=document.body.classList.contains('motion-paused');if(next!==lastGlobalPaused){lastGlobalPaused=next;setPaused(next||reduced.matches);}});observer.observe(document.body,{attributes:true,attributeFilter:['class']});}
  if(ownToggle)listen(ownToggle,'click',()=>{setPaused(!paused);try{localStorage.setItem('earth-number-motion',paused?'paused':'playing')}catch{}});
  resize();setPaused(paused||document.body.classList.contains('motion-paused'));
  document.body.classList.add('liquid-experience');
  window.earthLiquidExperience={destroy(){life.abort();observer?.disconnect();if(frame)cancelAnimationFrame(frame);canvas.remove();ownToggle?.remove();document.body.classList.remove('liquid-experience','liquid-paused');delete window.earthLiquidExperience;}};
})();
