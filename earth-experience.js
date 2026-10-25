/* Earth Number: an expressive water surface, separate from scientific models. */
'use strict';
(() => {
  const host = document.querySelector('[data-water-surface]');
  if (!host) return;
  const canvas = host.querySelector('canvas'), context = canvas.getContext('2d', {alpha:false});
  const button = host.querySelector('[data-ripple]'), pause = host.querySelector('[data-water-pause]');
  const status = host.querySelector('[role=status]');
  if (!context) { status.textContent='水の展示へは、下のリンクから進めます。'; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,current,previous,frame,last=0,visible=false,paused=reduced.matches,globalPaused=false;
  let image,clock=0,ambient=0,lastPointer=0;
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  function size(){
    const rect=canvas.getBoundingClientRect();
    width=Math.min(300,Math.max(120,Math.round(rect.width/3)));
    height=Math.max(60,Math.round(width*rect.height/Math.max(1,rect.width)));
    canvas.width=width;canvas.height=height;
    current=new Float32Array(width*height);previous=new Float32Array(width*height);
    image=context.createImageData(width,height);paint();
  }
  function disturb(x,y,strength=6){
    const cx=clamp(Math.round(x*(width-1)),4,width-5),cy=clamp(Math.round(y*(height-1)),4,height-5);
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)current[(cy+dy)*width+cx+dx]+=Math.exp(-(dx*dx+dy*dy)/7)*strength;
  }
  function step(){
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const i=y*width+x;
      previous[i]=((current[i-1]+current[i+1]+current[i-width]+current[i+width])*.5-previous[i])*.982;
    }
    const swap=previous;previous=current;current=swap;
  }
  function paint(){
    const data=image.data;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const i=y*width+x,j=i*4;
      const nx=(current[i+1]||0)-(current[i-1]||0),ny=(current[i+width]||0)-(current[i-width]||0);
      const u=x/width,v=y/height;
      // Refraction and moving sunlight are expressive, not measured water data.
      const a=u*21+nx*.8+Math.sin(v*11+clock*.08)*1.3,b=v*17+ny*.8+Math.cos(u*13-clock*.06)*1.7;
      const light=Math.pow(Math.max(0,Math.sin(a+Math.sin(b+clock*.15))*Math.sin(b+Math.cos(a-clock*.12))),8);
      const glint=Math.pow(Math.max(0,1-Math.abs(nx*.65+ny*.4-.45)),14);
      const shade=clamp(nx*12+ny*16,-28,32),depth=v*.45+u*.15;
      data[j]=clamp(8+light*44+glint*26+shade,0,255);
      data[j+1]=clamp(100-depth*65+light*88+glint*60+shade,0,255);
      data[j+2]=clamp(151-depth*30+light*85+glint*56+shade,0,255);data[j+3]=255;
    }
    context.putImageData(image,0,0);
  }
  function shouldRun(){return visible&&!paused&&!globalPaused&&!document.hidden;}
  function tick(t){frame=0;if(!shouldRun())return;if(t-last>=33){last=t;clock+=.033;ambient++;if(ambient%38===0)disturb(.5+Math.sin(clock*.7)*.4,.5+Math.cos(clock*.91)*.35,.45);step();paint();}frame=requestAnimationFrame(tick);}
  function schedule(){if(shouldRun()&&!frame)frame=requestAnimationFrame(tick);else if(!shouldRun()&&frame){cancelAnimationFrame(frame);frame=0;}}
  function sync(){
    const stopped=paused||globalPaused;
    pause.setAttribute('aria-pressed',String(stopped));pause.textContent=stopped?'水面を動かす':'水面を止める';pause.disabled=globalPaused;
    if(globalPaused)status.textContent='ページ上の「動かす」で、動きを再開できます。';
    button.disabled=stopped;canvas.setAttribute('aria-disabled',String(stopped));schedule();
  }
  function ripple(x=.5,y=.5){if(paused||globalPaused)return;disturb(x,y);status.textContent='ふれた場所から、波が広がります。';schedule();}
  canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect();ripple((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);});
  canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&!e.buttons)return;const now=performance.now();if(now-lastPointer<70)return;lastPointer=now;const r=canvas.getBoundingClientRect();ripple((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);},{passive:true});
  canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ripple();}});
  button.addEventListener('click',()=>ripple());pause.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',e=>{paused=e.matches;sync();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'80px'});observer.observe(host);
  const bodyObserver=new MutationObserver(()=>{const next=document.body.classList.contains('motion-paused');if(next!==globalPaused){globalPaused=next;sync();}});bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',schedule);
  new ResizeObserver(size).observe(canvas);globalPaused=document.body.classList.contains('motion-paused');size();sync();
})();
