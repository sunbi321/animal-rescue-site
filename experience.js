(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  try { userPaused = localStorage.getItem('anshin-motion-paused') === 'true'; } catch {}
  let motion = !reduced.matches && !userPaused;
  const toggle = document.querySelector('.motion-toggle');
  const motionListeners = new Set();
  function syncMotion() {
    motion = !reduced.matches && !userPaused;
    document.body.classList.toggle('motion-paused', !motion);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(!motion));
      toggle.setAttribute('aria-label', reduced.matches ? 'Decorative motion disabled by your system preference' : motion ? 'Pause decorative motion' : 'Resume decorative motion');
      toggle.querySelector('.motion-label').textContent = motion ? 'Motion on' : 'Motion off';
      toggle.disabled = reduced.matches;
    }
    for (const listener of motionListeners) listener();
  }
  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('anshin-motion-paused', String(userPaused)); } catch {}
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  syncMotion();

  let scrollPending = false;
  function showProgress() {
    const range = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--scroll-progress', String(range > 0 ? scrollY / range : 0));
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) {scrollPending = true; requestAnimationFrame(showProgress);} }, {passive:true});
  addEventListener('resize', showProgress, {passive:true});
  showProgress();

  // Content is readable with scripting disabled; reveal is progressive enhancement.
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed'); reveal.unobserve(entry.target);
      }
    }, {threshold:0.1});
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('reveal-ready'); reveal.observe(el);
    });
  }
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-hidden', document.hidden);
  });
  // Stop decorative CSS loops once their section leaves the viewport, too.
  const decorationObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('decoration-idle', !entry.isIntersecting);
  });
  document.querySelectorAll('.studio-hero,.word-ribbon,.studio-intro').forEach(el => decorationObserver.observe(el));
  const portal = document.querySelector('[data-tilt]');
  if (portal && matchMedia('(pointer:fine)').matches) {
    portal.addEventListener('pointermove', event => {
      if (!motion) return;
      const r = portal.getBoundingClientRect();
      portal.style.setProperty('--tilt-x', ((event.clientX-r.left)/r.width*5-2.5)+'deg');
      portal.style.setProperty('--tilt-y', (2.5-(event.clientY-r.top)/r.height*5)+'deg');
    }, {passive:true});
    portal.addEventListener('pointerleave', () => {
      portal.style.setProperty('--tilt-x','0deg'); portal.style.setProperty('--tilt-y','0deg');
    });
  }

  const tabs = [...document.querySelectorAll('[data-world]')];
  function selectWorld(tab, focus=false) {
    for (const item of tabs) {
      const selected = tab === item;
      item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    const count = document.querySelector('.world-counter');
    if (count) count.innerHTML = `${String(tabs.indexOf(tab)+1).padStart(2,'0')} <i>/</i> 02`;
    if (focus) tab.focus();
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => selectWorld(tab));
    tab.addEventListener('keydown', event => {
      let index = tabs.indexOf(tab);
      if (event.key === 'ArrowRight') index = (index+1)%tabs.length;
      else if (event.key === 'ArrowLeft') index = (index+tabs.length-1)%tabs.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = tabs.length-1;
      else return;
      event.preventDefault(); selectWorld(tabs[index],true);
    });
  }

  const canvas = document.getElementById('world-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const terrain = document.createElement('canvas');
  const ground = terrain.getContext('2d');
  const seasons = [
    {name:'SUMMER',caption:'A LITTLE SUNSHINE',tiles:['#a5ba75','#b6c985','#94ad68'],side:'#698452',trees:['#47705b','#638c61','#7d9d66'],roof:'#b86643',light:'#f6d98c'},
    {name:'AUTUMN',caption:'A CHANGE OF COLOUR',tiles:['#bb9c65','#cfb47c','#ae945f'],side:'#89714e',trees:['#b6643f','#d58b43','#957345'],roof:'#667e70',light:'#f2c76d'},
    {name:'WINTER',caption:'A MOMENT OF QUIET',tiles:['#d0dfd7','#e0e8dc','#c0d3cf'],side:'#889e99',trees:['#708f86','#8eaaa0','#b4c9ba'],roof:'#7e9a94',light:'#d8e5d5'},
    {name:'SPRING',caption:'ROOM FOR SOMETHING NEW',tiles:['#adc48b','#bdcf9b','#a0ba80'],side:'#7c9364',trees:['#d0a8a0','#e2b8af','#91ac7e'],roof:'#b37b63',light:'#eed9b2'}
  ];
  let season=0, phase=0, frame=0, lastTime=0, visible=false;
  let pointer={x:0,y:0}, eased={x:0,y:0};
  const rng = n => { const x = Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); };
  const cells=[];
  for (let q=-4;q<=4;q++) for (let r=-4;r<=4;r++) {
    if ((q*q/21)+(r*r/15)>1) continue;
    cells.push({x:420+q*57,y:308+r*38+(Math.abs(q)%2)*19,q,r,n:(q+5)*17+r+5});
  }
  cells.sort((a,b)=>a.y-b.y);
  function polygon(c,points,fill,stroke) {
    c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
    if(fill){c.fillStyle=fill;c.fill();} if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}
  }
  function ellipse(c,x,y,rx,ry,fill) {c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function hex(c,x,y,palette,index) {
    const pts=[[x-38,y],[x-19,y-21],[x+19,y-21],[x+38,y],[x+19,y+21],[x-19,y+21]];
    polygon(c,[pts[0],pts[5],[x-19,y+40],[x-38,y+19]],palette.side);
    polygon(c,[pts[5],pts[4],[x+19,y+40],[x-19,y+40]],palette.side);
    polygon(c,[pts[4],pts[3],[x+38,y+19],[x+19,y+40]],'#586f53');
    polygon(c,pts,palette.tiles[index%3],'#f7f0d332');
  }
  function tree(c,x,y,size,n,palette) {
    ellipse(c,x,y+3,size*.52,size*.18,'#344d3523');
    c.fillStyle='#7c6b4b';c.fillRect(x-2,y-size*.9,4,size);
    for(let i=0;i<3;i++){
      const yy=y-size*(.5+i*.35),half=size*(.55-i*.11);
      polygon(c,[[x-half,yy],[x,yy-size*.7],[x+half,yy]],palette.trees[(n+i)%3]);
      polygon(c,[[x,yy-size*.7],[x+half,yy],[x,yy]],'#29423218');
    }
  }
  function tower(c,x,y,palette) {
    ellipse(c,x+6,y+5,51,19,'#3343352b');
    polygon(c,[[x-28,y],[x-28,y-79],[x+12,y-87],[x+12,y+9]],'#d4d3ad');
    polygon(c,[[x+12,y+9],[x+12,y-87],[x+37,y-75],[x+37,y-2]],'#a6b29b');
    polygon(c,[[x-32,y-78],[x+8,y-105],[x+42,y-76],[x+10,y-67]],palette.roof);
    polygon(c,[[x+8,y-105],[x+42,y-76],[x+10,y-67]],'#6d614c55');
    c.fillStyle='#506956';c.beginPath();c.roundRect(x-13,y-28,16,30,[8,8,0,0]);c.fill();
    c.fillStyle='#668073';c.fillRect(x-11,y-60,8,13);c.fillRect(x+22,y-56,6,11);
    c.fillStyle='#eedcad';c.fillRect(x-9,y-58,3,9);
    c.strokeStyle='#5e745b';c.lineWidth=2;c.beginPath();c.moveTo(x+8,y-107);c.lineTo(x+8,y-139);c.stroke();
    polygon(c,[[x+9,y-139],[x+31,y-133],[x+9,y-126]],'#cc7952');
  }
  function house(c,x,y,palette) {
    ellipse(c,x+4,y+2,28,10,'#34493520');
    polygon(c,[[x-22,y-31],[x+6,y-34],[x+6,y+5],[x-22,y]],'#e2d6ae');
    polygon(c,[[x+6,y-34],[x+25,y-25],[x+25,y-2],[x+6,y+5]],'#a9b594');
    polygon(c,[[x-30,y-29],[x-11,y-55],[x+8,y-29]],palette.roof);
    polygon(c,[[x-11,y-55],[x+16,y-58],[x+33,y-30],[x+8,y-29]],'#7e8e67');
    c.fillStyle='#667b58';c.fillRect(x-12,y-15,9,17);
  }
  function rebuildTerrain() {
    const p=seasons[season],c=ground;
    c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,terrain.width,terrain.height);
    c.setTransform(terrain.width/840,0,0,terrain.height/580,0,0);
    ellipse(c,424,477,239,40,'#63724e12');ellipse(c,424,468,190,27,'#63724e0c');
    for(const cell of cells) hex(c,cell.x,cell.y,p,Math.floor(rng(cell.n)*3));
    // A tiny winding path, drawn once per season or resize.
    c.strokeStyle=season===2?'#eee7ce':'#d9c792';c.lineWidth=14;c.lineJoin='round';c.lineCap='round';
    c.beginPath();c.moveTo(420,447);c.bezierCurveTo(383,397,479,358,420,310);c.bezierCurveTo(390,287,370,285,359,258);c.stroke();
    const objects=[];
    for(const cell of cells){
      if(Math.abs(cell.q)<=1&&Math.abs(cell.r)<=2)continue;
      if(rng(cell.n+7)>.52)objects.push({y:cell.y,draw:()=>tree(c,cell.x+(rng(cell.n+2)-.5)*15,cell.y,24+rng(cell.n+3)*15,cell.n,p)});
      else if(rng(cell.n+10)>.64)objects.push({y:cell.y,draw:()=>{const x=cell.x,y=cell.y;polygon(c,[[x-9,y],[x-5,y-11],[x+3,y-16],[x+10,y-2],[x+5,y+4]],'#98a58b');}});
    }
    objects.push({y:262,draw:()=>tower(c,362,260,p)},{y:331,draw:()=>house(c,510,329,p)});
    objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
    c.strokeStyle='#556e5433';c.lineWidth=1;
    for(const [x,y] of [[140,390],[666,175]]){c.beginPath();c.moveTo(x-8,y);c.lineTo(x+8,y);c.moveTo(x,y-8);c.lineTo(x,y+8);c.stroke();}
  }
  function nomo(c,x,y,t,n) {
    const walking=motion?Math.sin(t*5+n)*2.5:0;
    ellipse(c,x,y+3,10,4,'#31492f24');
    c.strokeStyle='#769279';c.lineWidth=4;c.lineCap='round';
    c.beginPath();c.moveTo(x-4,y-4);c.lineTo(x-4+walking,y+3);c.moveTo(x+4,y-4);c.lineTo(x+4-walking,y+3);c.stroke();
    c.fillStyle=n%3===0?'#d9df9e':'#bbd7af';c.strokeStyle='#7c9a7b';c.lineWidth=1.2;c.beginPath();c.roundRect(x-9,y-31,18,29,[9,9,5,5]);c.fill();c.stroke();
    const blink=motion&&Math.sin(t*.6+n*3)>.997;
    c.fillStyle='#426751';c.beginPath();c.roundRect(x-5,y-23,2.5,blink?1:6,1);c.roundRect(x+2,y-23,2.5,blink?1:6,1);c.fill();
    if(n%2===0){c.fillStyle='#8fa493';c.beginPath();c.roundRect(x-10,y-34,20,7,[6,6,0,0]);c.fill();c.strokeStyle='#d2dfbf';c.lineWidth=1;c.beginPath();c.moveTo(x,y-35);c.lineTo(x,y-29);c.stroke();}
  }
  function draw(t) {
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(terrain,0,0);
    ctx.setTransform(canvas.width/840,0,0,canvas.height/580,0,0);
    const units=[];
    for(let n=0;n<7;n++){
      const a=t*.12+n*.89;
      units.push({x:428+Math.sin(a)*75+n%2*15,y:350+Math.cos(a)*50,n});
    }
    units.sort((a,b)=>a.y-b.y).forEach(u=>nomo(ctx,u.x+eased.x,u.y+eased.y,t,u.n));
    // Sparse, cheap atmospheric particles. No full-screen canvas or WebGL dependency.
    for(let n=0;n<(season===2?24:10);n++){
      const speed=season===2?15:4;const x=210+rng(n+31)*430+Math.sin(t*.3+n)*15;
      const y=100+(rng(n+12)*330+t*speed)%330;
      ctx.globalAlpha=season===2?.7:.25+Math.sin(t+n)*.2;
      ellipse(ctx,x,y,season===2?2:1.8,season===2?2:1.8,seasons[season].light);
    }
    ctx.globalAlpha=1;
  }
  function tick(time) {
    frame=0;if(!visible||document.hidden||!motion)return;
    if(time-lastTime>=33){
      phase+=Math.min((time-lastTime)/1000,.05);lastTime=time;
      eased.x+=(pointer.x-eased.x)*.035;eased.y+=(pointer.y-eased.y)*.035;
      draw(phase);
    }
    frame=requestAnimationFrame(tick);
  }
  function scheduling() {
    if(frame){cancelAnimationFrame(frame);frame=0;}
    if(visible&&!document.hidden&&motion){lastTime=performance.now();frame=requestAnimationFrame(tick);}
    else draw(phase);
  }
  function resize() {
    const bounds=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
    const w=Math.max(1,Math.round(bounds.width*dpr)),h=Math.max(1,Math.round(bounds.height*dpr));
    if(canvas.width===w&&canvas.height===h)return;
    canvas.width=terrain.width=w;canvas.height=terrain.height=h;
    rebuildTerrain();draw(phase);
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scheduling();},{threshold:.01}).observe(canvas);
  motionListeners.add(scheduling);
  document.addEventListener('visibilitychange', scheduling);
  canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=canvas.getBoundingClientRect();pointer={x:((e.clientX-b.left)/b.width-.5)*15,y:((e.clientY-b.top)/b.height-.5)*8};},{passive:true});
  canvas.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
  document.getElementById('change-season').addEventListener('click',()=>{
    season=(season+1)%seasons.length;
    const p=seasons[season];document.getElementById('season-readout').textContent=p.name+' / '+p.caption;
    canvas.setAttribute('aria-label',`An illustrated ${p.name.toLowerCase()} hexagon island with tiny NOMOs, trees, and a little tower`);
    rebuildTerrain();draw(phase);
  });
  document.getElementById('season-readout').setAttribute('aria-live','polite');
  resize();rebuildTerrain();draw(0);
})();
