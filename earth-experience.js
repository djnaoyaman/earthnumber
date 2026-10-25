/* A shared tactile light field. Numbers, text and scientific diagrams are not deformed. */
'use strict';
(() => {
  window.earthLiquidExperience?.destroy();
  const {min,max,abs,floor,sqrt,ceil,hypot,exp,sin,cos,pow}=Math;
  const life=new AbortController(),listen=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal:life.signal});
  const canvas=document.createElement('canvas');canvas.className='earth-liquid-field';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
  const context=canvas.getContext('2d');if(!context){canvas.remove();return;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const existingToggle=document.querySelector('#motionToggle');let ownToggle=null;
  if(!existingToggle){ownToggle=document.createElement('button');ownToggle.type='button';ownToggle.className='liquid-motion-toggle';ownToggle.setAttribute('aria-label','背景の光と波の動きを切り替える');document.querySelector('header')?.append(ownToggle);}
  let width,height,current,previous,pixels,texture,frame=0,last=0,activeUntil=0,paused=reduced.matches,pointerTime=0,lastPoint=null,scrollTime=0,lastScroll=scrollY,scrollEnergy=0;
  try{paused=paused||localStorage.getItem('earth-number-motion')==='paused';}catch{}
  const clamp=(n,a,b)=>min(b,max(a,n));
  function resize(){
    const cap=innerWidth>=900?320:240;
    const scale=max(innerWidth/cap,innerHeight/cap,3);
    width=max(40,Math.round(innerWidth/scale));height=max(40,Math.round(innerHeight/scale));
    canvas.width=width;canvas.height=height;current=new Float32Array(width*height);previous=new Float32Array(width*height);pixels=context.createImageData(width,height);
    texture=new Float32Array(width*height);
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const u=x/width,v=y/height;
      const level=.9*sin(u*6.4+1.3*sin(v*3.1))+.7*cos(v*7.2+1.2*sin(u*2.6))+.3*sin((u+v)*12);
      texture[y*width+x]=3+17*pow(.5+.5*cos(level*12),22);
    }
    draw(0);
  }
  function draw(fade=1){
    const p=pixels.data;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const i=y*width+x,j=i*4;
      const nx=x>0&&x<width-1?current[i+1]-current[i-1]:0;
      const ny=y>0&&y<height-1?current[i+width]-current[i-width]:0;
      // Refract a quiet contour texture, rather than stamping blurred cursor dots.
      const tx=clamp(x+nx*4*fade,0,width-1.001),ty=clamp(y+ny*4*fade,0,height-1.001);
      const ix=floor(tx),iy=floor(ty),fx=tx-ix,fy=ty-iy;
      const top=texture[iy*width+ix]*(1-fx)+texture[iy*width+ix+1]*fx;
      const bottom=texture[(iy+1)*width+ix]*(1-fx)+texture[(iy+1)*width+ix+1]*fx;
      const contour=top*(1-fy)+bottom*fy;
      const light=nx*.7+ny*.9,crest=min(85,sqrt(abs(light))*120)*fade;
      const alpha=contour+crest,mix=crest/max(1,alpha),positive=light>0;
      p[j]=80*(1-mix)+(positive?145:10)*mix;
      p[j+1]=158*(1-mix)+(positive?222:85)*mix;
      p[j+2]=179*(1-mix)+(positive?240:155)*mix;
      p[j+3]=min(125,alpha);
    }
    context.putImageData(pixels,0,0);
  }
  function step(){
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const i=y*width+x;previous[i]=((current[i-1]+current[i+1]+current[i-width]+current[i+width])*.5-previous[i])*.989;
    }
    const swap=previous;previous=current;current=swap;
  }
  function allowed(){return !paused&&!document.hidden;}
  function tick(t){frame=0;if(!allowed())return;
    if(t-last>=33){last=t;step();draw(clamp((activeUntil-t)/900,0,1));}
    if(t<activeUntil)frame=requestAnimationFrame(tick);else{current.fill(0);previous.fill(0);draw(0);}
  }
  function wake(){if(allowed()&&!frame)frame=requestAnimationFrame(tick);}
  function ripple(x,y,strength=3){
    if(!allowed())return;
    const cx=clamp(Math.round(x*width),5,width-6),cy=clamp(Math.round(y*height),5,height-6);
    for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const i=(cy+dy)*width+cx+dx,depth=exp(-(dx*dx+dy*dy)/9)*strength;current[i]-=depth;previous[i]-=depth;}
    activeUntil=performance.now()+4200;wake();
  }
  function setPaused(next){
    paused=next;document.body.classList.toggle('liquid-paused',paused);
    if(ownToggle){ownToggle.textContent=paused?'光と波を動かす':'光と波を止める';ownToggle.setAttribute('aria-pressed',String(paused));ownToggle.disabled=reduced.matches;if(reduced.matches)ownToggle.textContent='動きを少なくする設定中';}
    if(paused){if(frame)cancelAnimationFrame(frame);frame=0;current.fill(0);previous.fill(0);context.clearRect(0,0,width,height);}else draw(0);
  }
  listen(document,'pointerdown',e=>{lastPoint={x:e.clientX,y:e.clientY};ripple(e.clientX/innerWidth,e.clientY/innerHeight,8);},{passive:true});
  listen(document,'pointermove',e=>{
    const now=performance.now();if(now-pointerTime<55)return;pointerTime=now;
    const target={x:e.clientX,y:e.clientY},start=e.buttons&&lastPoint?lastPoint:target;
    const distance=hypot(target.x-start.x,target.y-start.y);
    const steps=min(16,max(1,ceil(distance/14)));
    const energy=e.buttons?min(3.2,distance*.055):.8;
    for(let i=1;i<=steps;i++)ripple((start.x+(target.x-start.x)*i/steps)/innerWidth,(start.y+(target.y-start.y)*i/steps)/innerHeight,energy/steps);
    lastPoint=target;
  },{passive:true});
  listen(document,'pointerup',()=>{lastPoint=null;},{passive:true});
  listen(document,'pointercancel',()=>{lastPoint=null;},{passive:true});
  listen(window,'scroll',()=>{const now=performance.now(),delta=scrollY-lastScroll;lastScroll=scrollY;scrollEnergy+=abs(delta);if(now-scrollTime<95||scrollEnergy<2)return;scrollTime=now;ripple(.5,delta>0?.76:.24,min(2,scrollEnergy/160));scrollEnergy=0;},{passive:true});
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
