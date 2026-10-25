/* Real NPS river footage, with a small illustrative touch displacement.
   The recorded river does not respond to the viewer. Scientific figures stay unchanged. */
'use strict';
(() => {
  window.earthLiquidExperience?.destroy();
  const life=new AbortController();
  const listen=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal:life.signal});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const backdrop=document.createElement('div');backdrop.className='earth-water-backdrop';backdrop.setAttribute('aria-hidden','true');
  const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';video.setAttribute('playsinline','');video.setAttribute('muted','');video.tabIndex=-1;backdrop.append(video);
  const canvas=document.createElement('canvas');canvas.className='earth-liquid-field';backdrop.append(canvas);document.body.prepend(backdrop);
  const toggle=document.createElement('button');toggle.type='button';toggle.className='liquid-motion-toggle';toggle.textContent='水面を動かす';toggle.setAttribute('aria-pressed','false');(document.querySelector('.header-actions')||document.querySelector('header'))?.append(toggle);
  const note=document.createElement('details');note.className='water-observation';
  note.innerHTML='<summary>水に映る色は、どこから来る？</summary><p>茶色は岩のかべ、青は空が水に映った色です。小さな波で水面のかたむきが変わると、光が目にとどく場所も変わります。</p><p>アメリカのコロラド川をカメラでとった動画です。指やマウスに合わせたゆらぎを、あとから重ねています。このゆらぎは、川の動きや光を正しく計算した実験ではありません。</p><p>動画：NPS / Blum, Well, and Wang（2009、Public Domain）。短く切り、つなぎ目をなじませています。</p><p><a href="https://www.nps.gov/media/video/view.htm?id=E914CCBB-155D-451F-67145502215368AD" target="_blank" rel="noopener">もとの動画を見る ↗</a> · <a href="https://psl.noaa.gov/outreach/education/science/glitter/" target="_blank" rel="noopener">光がきらめくしくみ（NOAA・英語）↗</a></p>';
  const status=document.createElement('p');status.className='water-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');note.append(status);
  document.querySelector('footer')?.before(note);
  let gl=null,program=null,buffer=null,film=null,surface=null,uniforms={},raf=0,last=0,started=false,desired=false,destroyed=false,globalPaused=document.body.classList.contains('motion-paused'),lastPoint=null,inputTime=0,activeUntil=0,slowFrames=0,playGeneration=0;
  let gw=120,gh=80,current=new Float32Array(gw*gh),previous=new Float32Array(gw*gh),normals=new Uint8Array(gw*gh*4);
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment=`precision mediump float;
uniform vec2 resolution;uniform float videoAspect;uniform sampler2D film;uniform sampler2D surface;
vec2 cover(vec2 uv){float a=resolution.x/resolution.y;vec2 s=a>videoAspect?vec2(1.,videoAspect/a):vec2(a/videoAspect,1.);return (uv-.5)*s+.5;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 slope=(texture2D(surface,vec2(uv.x,1.-uv.y)).rg*255.-128.)/127.;vec2 displaced=clamp(uv+vec2(slope.x,-slope.y)*.018,vec2(.002),vec2(.998));vec2 sampleUV=cover(displaced);gl_FragColor=texture2D(film,vec2(sampleUV.x,1.-sampleUV.y));}`;
  function disposeGL(){if(!gl)return;if(film)gl.deleteTexture(film);if(surface)gl.deleteTexture(surface);if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);gl=null;film=surface=buffer=program=null;backdrop.classList.remove('with-displacement');}
  function initGL(){
    const shaders=[];
    try{
      gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});if(!gl)return;
      program=gl.createProgram();
      for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('shader');gl.attachShader(program,s);}
      gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('link');gl.useProgram(program);
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
      const texture=unit=>{const t=gl.createTexture();gl.activeTexture(unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
      film=texture(gl.TEXTURE0);surface=texture(gl.TEXTURE1);uniforms={resolution:gl.getUniformLocation(program,'resolution'),aspect:gl.getUniformLocation(program,'videoAspect')};gl.uniform1i(gl.getUniformLocation(program,'film'),0);gl.uniform1i(gl.getUniformLocation(program,'surface'),1);
    }catch{if(gl)shaders.forEach(s=>gl.deleteShader(s));shaders.length=0;disposeGL();}finally{if(gl)shaders.forEach(s=>gl.deleteShader(s));}
  }
  function resize(){
    const longEdge=innerWidth<760?680:960,scale=Math.min(1,longEdge/Math.max(innerWidth,innerHeight));canvas.width=Math.max(1,Math.round(innerWidth*scale));canvas.height=Math.max(1,Math.round(innerHeight*scale));
    gw=Math.max(40,Math.round(innerWidth/Math.max(innerWidth/160,innerHeight/160,4)));gh=Math.max(40,Math.round(innerHeight/Math.max(innerWidth/160,innerHeight/160,4)));current=new Float32Array(gw*gh);previous=new Float32Array(gw*gh);normals=new Uint8Array(gw*gh*4);if(gl)gl.viewport(0,0,canvas.width,canvas.height);
  }
  function permitted(){return desired&&!reduced.matches&&!globalPaused&&!document.hidden&&!destroyed;}
  function updateButton(){toggle.disabled=reduced.matches||globalPaused;toggle.textContent=reduced.matches?'水面は止めています':globalPaused?'全体の動きは停止中':permitted()?'水面を止める':started?'水面を動かす':'水面を動かす';toggle.setAttribute('aria-pressed',String(permitted()));}
  function stop(){playGeneration++;if(raf)cancelAnimationFrame(raf);raf=0;video.pause();updateButton();}
  function tick(t){raf=0;if(!permitted())return;
    if(t-last>=40&&video.readyState>=2){last=t;const begin=performance.now();
      if(gl){
        if(t<activeUntil){for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){const i=y*gw+x;previous[i]=((current[i-1]+current[i+1]+current[i-gw]+current[i+gw])*.5-previous[i])*.975;}const a=current;current=previous;previous=a;}else{current.fill(0);previous.fill(0);}
        const fade=clamp((activeUntil-t)/900,0,1);
        for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const i=y*gw+x,j=i*4,nx=x>0&&x<gw-1?(current[i+1]-current[i-1])*.5:0,ny=y>0&&y<gh-1?(current[i+gw]-current[i-gw])*.5:0;normals[j]=clamp(128+nx*127*fade,0,255);normals[j+1]=clamp(128+ny*127*fade,0,255);normals[j+2]=0;normals[j+3]=255;}
        try{gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,film);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,surface);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gw,gh,0,gl.RGBA,gl.UNSIGNED_BYTE,normals);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform1f(uniforms.aspect,video.videoWidth/video.videoHeight);gl.drawArrays(gl.TRIANGLES,0,6);backdrop.classList.add('with-displacement');}catch{disposeGL();}
        slowFrames=performance.now()-begin>45?slowFrames+1:Math.max(0,slowFrames-1);if(slowFrames>=8)disposeGL();
      }
    }
    if(gl)raf=requestAnimationFrame(tick);
  }
  async function play(){
    if(!permitted())return;const generation=++playGeneration;
    if(!started){started=true;const portrait=innerHeight>innerWidth;video.src=portrait?'assets/water/colorado-reflections-portrait.mp4':'assets/water/colorado-reflections-768.mp4';if(!gl)initGL();resize();}
    try{await video.play();if(generation!==playGeneration)return;if(permitted()){backdrop.classList.add('has-video');if(gl&&!raf)raf=requestAnimationFrame(tick);status.textContent='本物の川をカメラでとった動画です。章の間の水面を、そっとなぞってみよう。';}else video.pause();}catch{if(generation!==playGeneration)return;desired=false;status.textContent='動画は止まっています。水面を動かすボタンでもう一度始められます。';}updateButton();
  }
  function disturb(x,y,dx,dy,energy){
    if(!permitted()||!gl||energy<=0)return;const cx=clamp(x*gw,9,gw-10),cy=clamp(y*gh,9,gh-10),ix=Math.floor(cx),iy=Math.floor(cy),len=Math.hypot(dx,dy),ux=dx/Math.max(1,len),uy=dy/Math.max(1,len);
    for(let yy=-8;yy<=8;yy++)for(let xx=-8;xx<=8;xx++){const px=ix+xx-cx,py=iy+yy-cy,along=px*ux+py*uy,across=-px*uy+py*ux;const depth=len?Math.exp(-along*along/24-across*across/16)*along*.35*energy:-Math.exp(-(px*px+py*py)/12)*energy;const i=(iy+yy)*gw+ix+xx;current[i]=clamp(current[i]+depth,-8,8);previous[i]=clamp(previous[i]+depth,-8,8);}
    activeUntil=performance.now()+3800;
  }
  listen(toggle,'click',()=>{desired=!desired;desired?play():stop();updateButton();});
  listen(document,'pointerdown',e=>{lastPoint={x:e.clientX,y:e.clientY};disturb(e.clientX/innerWidth,e.clientY/innerHeight,0,0,.8);},{passive:true});
  listen(document,'pointermove',e=>{const now=performance.now();if(now-inputTime<50)return;inputTime=now;const old=lastPoint||{x:e.clientX,y:e.clientY},dx=e.clientX-old.x,dy=e.clientY-old.y,d=Math.hypot(dx,dy),steps=Math.min(12,Math.max(1,Math.ceil(d/16))),energy=Math.min(e.buttons?1.6:.3,d*.03);for(let i=1;i<=steps;i++)disturb((old.x+dx*i/steps)/innerWidth,(old.y+dy*i/steps)/innerHeight,dx,dy,energy/steps);lastPoint={x:e.clientX,y:e.clientY};},{passive:true});
  listen(document,'pointerup',()=>{lastPoint=null;},{passive:true});listen(document,'pointercancel',()=>{lastPoint=null;},{passive:true});
  listen(document,'keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const r=e.target?.getBoundingClientRect?.();if(r)disturb((r.left+r.width/2)/innerWidth,(r.top+r.height/2)/innerHeight,0,0,.5);});
  listen(window,'resize',resize);listen(document,'visibilitychange',()=>{document.hidden?stop():play();});
  listen(reduced,'change',()=>{reduced.matches?stop():play();updateButton();});
  listen(video,'error',()=>{desired=false;stop();backdrop.classList.remove('has-video','with-displacement');status.textContent='動画を読みこめませんでした。写真を見せています。';});
  listen(canvas,'webglcontextlost',e=>{e.preventDefault();disposeGL();});
  let observer=new MutationObserver(()=>{const next=document.body.classList.contains('motion-paused');if(next!==globalPaused){globalPaused=next;globalPaused?stop():play();updateButton();}});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.body.classList.add('observed-water');resize();updateButton();
  window.earthLiquidExperience={destroy(){destroyed=true;life.abort();observer.disconnect();stop();disposeGL();video.removeAttribute('src');video.load();backdrop.remove();toggle.remove();note.remove();document.body.classList.remove('observed-water');delete window.earthLiquidExperience;}};
})();
