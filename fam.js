// The little dancing family on the website: two line-drawn dancers (the same drawing as in the game)
// on a small stage, plus a site music player (off until the visitor taps it, no download).
(function(){
const stage=document.getElementById('famstage');
// ---------- music ----------
const SONGS=[['m_lahore','Lahore Night Celebration'],['m_feast','Desert Feast Dance'],['m_wedding','Wedding Night Drive'],['m_bhangra','Rang De Bhangra'],['m_desert','Desert Feast Dance II']];
let si=0,playing=false,AT=0;const au=new Audio();au.preload='none';au.setAttribute('controlslist','nodownload');
au.addEventListener('ended',()=>{si=(si+1)%SONGS.length;load();au.play().catch(()=>{})});
function load(){au.src='/play/sfx/'+SONGS[si][0]+'.mp3';if(lbl)lbl.textContent=SONGS[si][1]}
const pill=document.createElement('div');pill.className='mpill';pill.innerHTML='<button class="mpbtn" aria-pressed="false" aria-label="Play the music"><span class="mpic">&#9835;</span><span class="mptx">Play the music</span></button><span class="mpname"></span>';
document.body.appendChild(pill);const btn=pill.querySelector('.mpbtn'),tx=pill.querySelector('.mptx'),lbl=pill.querySelector('.mpname');
pill.addEventListener('contextmenu',e=>e.preventDefault());
function setPlay(on){playing=on;btn.setAttribute('aria-pressed',on);pill.classList.toggle('on',on);tx.textContent=on?'Music on':'Play the music';if(on){if(!au.src)load();au.play().catch(()=>{setPlay(false)})}else au.pause()}
btn.addEventListener('click',()=>setPlay(!playing));
window.__famMusic=()=>{if(!playing)setPlay(true)};
if(!stage)return;
// ---------- dancers ----------
const W=48,H=58,SC=2,dpr=Math.min(2,devicePixelRatio||1);
let HS=1,MVG=0,LOOKO=null,LOOKU=0,LEG=1,GUIT=false,g=null,px=null,drops=null,lvl=0,TT=0,beat=0,ph=0;
const NAMES=['Dad','Mom'];
const TICK=[["Hee hee! That tickles!","Ha ha, stop! I'm ticklish!","Play the music and I'll dance for you!"],["Ha ha! Not the tummy!","Hee hee hee! Okay, okay!","Tap the music button and we'll dance!"]];let TK=0;
const LINES=[["Hi! We're the dancing family.","Tap me and I'll change my moves!","Turn on the music and watch us go."],["Hello there! Pick us up and move us around.","We live inside the Gogo game.","Come spend more time with us!"]];
const HW=W*SC/2;
function bounds(){const w=stage.clientWidth,h=stage.clientHeight,mob=w<480;return {w,h,L:(mob?0:w*.40+18)+HW,R:w-HW}}
const DS=[0,1].map(who=>{const cv=document.createElement('canvas');cv.className='famd';cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W*SC+'px';cv.style.height=H*SC+'px';cv.title='Tap to change moves, drag or throw them';cv.setAttribute('role','img');cv.setAttribute('aria-label',NAMES[who]+' of the dancing family');stage.appendChild(cv);
 const d={who,cv,g:cv.getContext('2d'),col:who?'#ffe7a8':'#f6d27a',drops:[],px:null,X:0,Y:0,vx:0,vy:0,st:'floor',init:true,mv:who?4:0,said:0,cheer:0};
 let down=false,moved=false,sx=0,sy=0,ox=0,oy=0,hist=[];
 cv.addEventListener('pointerdown',e=>{if(d.st==='gone'||d.st==='return'||d.st==='runout')return;e.preventDefault();cv.setPointerCapture(e.pointerId);down=true;moved=false;sx=e.clientX;sy=e.clientY;ox=d.free?d.FX:d.X;oy=d.free?d.FY:d.Y;hist=[[e.clientX,e.clientY,performance.now()]];if(d.sk<.4)d.idle=0});
 cv.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.hypot(dx,dy)<6)return;if(!moved&&!d.free){const r=cv.getBoundingClientRect();d.free=true;ox=r.left+HW-dx;oy=innerHeight-r.bottom+dy}moved=true;d.st='drag';if(d.free){d.FX=ox+dx;d.FY=Math.max(0,oy-dy)}else{d.X=ox+dx;d.Y=Math.max(0,oy-dy)}hist.push([e.clientX,e.clientY,performance.now()]);if(hist.length>6)hist.shift()});
 const up=()=>{if(!down)return;down=false;if(!moved){if(d.sk>.4){d.idle=0;d.cheer=TT;say(d,'Good morning!');return}if(!(playing&&!au.paused)){d.tk=TT;d.idle=0;say(d,TICK[who][d.tks=(d.tks||0)+1,d.tks%TICK[who].length]);return}d.picked=si;d.mv=(d.mv+1+Math.floor(Math.random()*3))%11;d.cheer=TT;say(d,LINES[who][d.said++%LINES[who].length]);return}
  const p0=hist[0],p1=hist[hist.length-1],t=Math.max(16,p1[2]-p0[2])/1000;d.vx=(p1[0]-p0[0])/t;d.vy=-(p1[1]-p0[1])/t;d.thrown=Math.hypot(d.vx,d.vy)>900;d.st='air';
  // let go over the box: back inside the box. Let go anywhere else: fall to the bottom of the screen, run off, come home
  if(d.free){const r=stage.getBoundingClientRect(),cx=d.FX,cy=innerHeight-d.FY;if(cx>r.left&&cx<r.right&&cy>r.top&&cy<r.bottom+10){d.free=false;d.X=cx-r.left;d.Y=Math.max(0,r.bottom-cy-10)}}};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 return d});
// the baby: appears when Mom and Dad dance close together
const BB=document.createElement('canvas');BB.className='famd famb';BB.width=W*dpr;BB.height=H*dpr;BB.style.width=W*1.15+'px';BB.style.height=H*1.15+'px';BB.style.display='none';BB.setAttribute('aria-hidden','true');stage.appendChild(BB);
const baby={on:false,g:BB.getContext('2d'),drops:[],X:0,side:1,closeT:0,st:'floor',free:false,FX:0,FY:0,vx:0,vy:0,sk:0,zs:0},HB=W*1.15/2;
BB.style.cursor='grab';BB.style.touchAction='none';
{let down=false,moved=false,sx=0,sy=0,ox=0,oy=0,hist=[];
 BB.addEventListener('pointerdown',e=>{if(baby.st!=='floor'&&baby.st!=='air')return;e.preventDefault();BB.setPointerCapture(e.pointerId);down=true;moved=false;sx=e.clientX;sy=e.clientY;ox=baby.FX;oy=baby.FY;hist=[[e.clientX,e.clientY,performance.now()]]});
 BB.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.hypot(dx,dy)<6)return;if(!moved&&!baby.free){const r=BB.getBoundingClientRect();baby.free=true;ox=r.left+HB-dx;oy=innerHeight-r.bottom+dy}moved=true;baby.st='drag';baby.FX=ox+dx;baby.FY=Math.max(0,oy-dy);hist.push([e.clientX,e.clientY,performance.now()]);if(hist.length>6)hist.shift()});
 const bup=()=>{if(!down)return;down=false;if(!moved){if(!(playing&&!au.paused)&&baby.sk<.4){baby.tk=TT;say(DS[0],'Giggles! The little one is ticklish.');return}baby.cheer=TT;say(DS[1],baby.sk>.4?'Shh, the little one is sleeping.':'Our little one loves to be picked up!');return}
  const p0=hist[0],p1=hist[hist.length-1],t=Math.max(16,p1[2]-p0[2])/1000;baby.vx=(p1[0]-p0[0])/t;baby.vy=-(p1[1]-p0[1])/t;baby.st='air';
  const r=stage.getBoundingClientRect(),cx=baby.FX,cy=innerHeight-baby.FY;if(cx>r.left&&cx<r.right&&cy>r.top&&cy<r.bottom+10){baby.free=false;baby.st='floor';baby.X=cx-r.left;baby.cheer=TT}};
 BB.addEventListener('pointerup',bup);BB.addEventListener('pointercancel',bup)}
// messages: one at a time, each stays up before the next
const msg=document.createElement('div');msg.className='fammsg';msg.innerHTML='<div class="fmline"></div>';stage.appendChild(msg);const mline=msg.firstChild;
const Q=[];let qNext=0;function say(d,t){if(Q.some(q=>q[1]===t))return;Q.push([d.who,t]);if(Q.length>3)Q.shift()}
function showNext(){if(!Q.length||TT<qNext)return;const [w,t]=Q.shift();mline.classList.remove('show');void mline.offsetWidth;mline.innerHTML='<b>'+NAMES[w]+':</b> '+t;mline.classList.add('show');qNext=TT+3.2}
function place(){DS.forEach(d=>{const s=d.cv.style;if(d.free){s.position='fixed';s.zIndex=60;s.left=(d.FX-HW)+'px';s.bottom=d.FY+'px'}else{s.position='';s.zIndex='';s.left=(d.X-HW)+'px';s.bottom=(10+d.Y)+'px'}});if(baby.on){const s=BB.style;if(baby.free){s.position='fixed';s.zIndex=60;s.left=(baby.FX-HB)+'px';s.bottom=baby.FY+'px'}else{s.position='';s.zIndex='';s.left=(baby.X-HB)+'px';s.bottom='10px'}}}
addEventListener('pointermove',e=>{DS.forEach(d=>{const r=d.cv.getBoundingClientRect();d.px=(e.clientX-r.left)/SC})});
// --- drawing: copied from the game so they look the same ---
const lerp=(a,b,k)=>a+(b-a)*k;
 let HANDS=[];function limb(sx,sy,a1,a2,L1,L2){let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;d=Math.max(-1.1,Math.min(1.1,d));a2=a1+d;const ex=sx+Math.cos(a1)*L1,ey=sy+Math.sin(a1)*L1;g.moveTo(sx,sy);g.lineTo(ex,ey);const hx=ex+Math.cos(a2)*L2,hy=ey+Math.sin(a2)*L2;g.lineTo(hx,hy);HANDS.push([hx,hy])}
 function fig(x,who,col,wk,ch){const move=MVG;GUIT=false;const e=lvl,b=beat;const t=ph+(who?Math.PI*.5*(move===1?1:0):0);const c=Math.cos(t),s=Math.sin(t),on=Math.abs(c);const par=(Math.round(ph/Math.PI)+who)%2?1:-1;
  const y0=H-3;let drop=on*3*e,jump=0,sway=s*3*e,kneeL=0,kneeR=0;let A;
  if(ch){A=who?[-2.3,-2.0,-1.0,-1.2]:[-2.1,-1.9,-.85,-1.1];jump=Math.abs(Math.sin(TT*9))*5}
  else if(move===0){const p=on*.45;A=[-2.25-p,-1.75-p*.6,-.9+p,-1.4+p*.6];if(par>0)kneeL=7*e*on;else kneeR=7*e*on}
  else if(move===1){const w=Math.sin(t*2),w2=Math.sin(t*2+1.3);A=[Math.PI+w*.45,Math.PI+w2*.9,-w*.45,-w2*.9];sway=s*4*e}
  else if(move===2){A=par>0?[-2.4,-2.2,.9,2.4]:[2.25,.75,-.75,-.95];sway=par*2.5*e}
  else if(move===5){const sh=Math.sin(TT*17)*1.6*Math.max(.4,e);sway=sh;drop=on*1.5*e;if(LEG>0)kneeL=8*Math.max(.5,e);else kneeR=8*Math.max(.5,e);A=[Math.PI-.35+s*.25,Math.PI-1.35+s*.4,.35-s*.25,1.35-s*.4]}
  else if(move===4){const rk=c*6*e;sway=rk;drop=on*2*e;A=[-2.1-s*.25,-1.85-s*.35,-1.05+s*.25,-1.3+s*.35]}
  else if(move===6){const st=(Math.floor(ph*2/Math.PI)%4+4)%4;A=[-2.5,.7,-.5+st*.32,-.5+st*.32];drop=on*2*e;sway=0}
  else if(move===7){A=par>0?[Math.PI,-Math.PI/2,0,Math.PI/2]:[Math.PI,Math.PI/2,0,-Math.PI/2];drop=on*1.5*e;sway=0}
  else if(move===8){const w=Math.sin(t*1.5);A=[Math.PI+.2-w*1.1,Math.PI-.3-w*1.4,-.2-w*1.1,.3-w*1.4];sway=w*3*e;drop=on*2*e}
  else if(move===9){const w=Math.sin(t*2);sway=w*4*e;drop=2+on*2*e;A=[Math.PI/2+.9+w*.5,-.6+w*.6,Math.PI/2-.9+w*.5,-2.5+w*.6];kneeL=Math.max(0,w)*3*e;kneeR=Math.max(0,-w)*3*e}
  else if(move===10){const fl=(Math.round(ph/Math.PI)%2)?1:-1;sway=fl*3.5*Math.max(.5,e);drop=on*2.5*e;A=[Math.PI-.5,Math.PI-1.2,.5,1.2];if(fl>0)kneeL=5*e;else kneeR=5*e}
  else if(move===11){const hit=Math.max(0,Math.sin(ph*2)),hit2=Math.max(0,-Math.sin(ph*2));A=[Math.PI/2+1.05+hit*.5,Math.PI/2-.35+hit*.9,Math.PI/2-1.05-hit2*.5,Math.PI/2+.35-hit2*.9];drop=1+on*1.5*e;sway=s*1.5*e}
  else if(move===13){const st=Math.sin(TT*14)*.25;A=[Math.PI-.2,Math.PI+.9,.6+st,1.7+st];drop=on*1.5*e;sway=s*1*e;kneeL=on*2*e}
  else if(move===12){const w=Math.sin(TT*3)*.08;A=[-.15+w,-.55+w,.2+w,-.35+w];sway=Math.sin(ph)*1.5*e}
  else{jump=Math.max(0,Math.sin(ph))*7*e;drop=0;A=[-2.0-s*.5,-1.9-s*.8,-1.1+s*.5,-1.2+s*.8];kneeL=kneeR=jump*.5}
  const R=[Math.PI/2+.55,Math.PI/2+.3,Math.PI/2-.55,Math.PI/2-.3];if(!ch)for(let i=0;i<4;i++)A[i]=lerp(R[i],A[i],Math.min(1,e*1.6));if(!ch&&e<.05){sway+=Math.sin(TT*1.6+who*2)*.9;const wv=(TT+who*3.5)%7;if(wv<1.6){const k=Math.sin(Math.min(1,wv/.3,(1.6-wv)/.3)*Math.PI/2),w=Math.sin(TT*11);A[2]=lerp(A[2],-1.05+w*.3,k);A[3]=lerp(A[3],-1.75+w*.55,k)}}if(TK){const w=Math.sin(TT*24),w2=Math.sin(TT*19+1);A=[Math.PI+.5+w*.7,Math.PI-.5+w2*1,-.5-w*.7,.5-w2*1];sway=Math.sin(TT*17)*3.2;jump=Math.abs(Math.sin(TT*12))*2.5;kneeL=Math.max(0,w)*4;kneeR=Math.max(0,-w)*4;drop=1}
  if(wk){const w=Math.sin(TT*11);A=[Math.PI/2+.25+.55*w,Math.PI/2+.1+.7*w,Math.PI/2-.25-.55*w,Math.PI/2-.1-.7*w];kneeL=Math.max(0,w)*5;kneeR=Math.max(0,-w)*5;sway=0;drop=Math.abs(w)*1.2;jump=0}
  const hipY=y0-16+drop-jump,shY=hipY-12,hd=shY-6.5-(LOOKU&&!ch?1.2:0),hx=x+sway*.5,sx=x+sway;
  let look=0;if(LOOKO!==null)look=LOOKO*.9;else if(px!==null)look=Math.max(-1,Math.min(1,(px-x)/40));
  g.strokeStyle=col;g.lineWidth=2;g.lineCap='round';g.lineJoin='round';g.shadowColor='rgba(246,210,122,.7)';g.shadowBlur=4;g.beginPath();
  const fy_=y0-jump,kb=drop*.8+2;
  g.moveTo(hx,hipY);g.lineTo(hx-3-kneeL*.6+(jump?-2:0),(hipY+fy_)/2-kneeL+.5);g.lineTo(hx-5-(jump?3:0),fy_-kneeL*.7);g.lineTo(hx-8.5-(jump?3:0),fy_-kneeL*.7+.4);
  g.moveTo(hx,hipY);g.lineTo(hx+3+kneeR*.6+(jump?2:0)+kb*.2,(hipY+fy_)/2-kneeR+.5);g.lineTo(hx+5+(jump?3:0),fy_-kneeR*.7);g.lineTo(hx+8.5+(jump?3:0),fy_-kneeR*.7+.4);
  g.moveTo(hx,hipY);g.lineTo(sx,shY);
  HANDS=[];limb(sx,shY+1,A[0],A[1],9.5,10);limb(sx,shY+1,A[2],A[3],9.5,10);
  if(GUIT&&!ch&&!wk){const gx_=hx+3,gy_=hipY-3;g.stroke();g.save();g.lineWidth=1.6;g.beginPath();g.ellipse(gx_+1,gy_+1,6.4,4.6,-.45,0,7);g.globalAlpha=.35;g.fillStyle=col;g.fill();g.globalAlpha=1;g.stroke();g.beginPath();g.arc(gx_+1,gy_+1,1.3,0,7);g.stroke();g.beginPath();g.moveTo(gx_-4.5,gy_-2.4);g.lineTo(sx-14,shY-1);g.lineWidth=1.8;g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(sx-14,shY-1);g.lineTo(sx-17,shY-2.6);g.stroke();g.restore();g.beginPath()}
  g.stroke();g.fillStyle=col;g.beginPath();HANDS.forEach(h=>{g.moveTo(h[0]+1.6,h[1]);g.arc(h[0],h[1],1.6,0,7)});g.fill();g.beginPath();g.arc(sx+look*1.2,hd,4.8,0,7);g.stroke();g.shadowBlur=0;g.fillStyle=col;g.beginPath();g.arc(sx+look*2.2-1.5,hd-.5-LOOKU*1.6,.9,0,7);g.arc(sx+look*2.2+1.5,hd-.5-LOOKU*1.6,.9,0,7);g.fill();
  if(e>.25||ch){g.beginPath();g.arc(sx+look*2,hd+1.6,1.6,.15,Math.PI-.15);g.lineWidth=1;g.stroke();g.lineWidth=2}
  if(who===1){const hs=HS;g.lineWidth=1.6;g.beginPath();for(let i=0;i<4;i++){const o=i*1.7,len=8+i*1.8,sp=1+i*.35;g.moveTo(sx+look*1.2+hs*(1.5+i*.9),hd-4.6+i*.9);g.quadraticCurveTo(sx+look+hs*(6+o)*sp*.8-s*2*e,hd+1+i,sx+look+hs*(4.5+o)-s*3*e*sp,hd+len)}g.stroke();g.lineWidth=2}
  else if(who===0){const bs=look<-.15?-1:1;g.beginPath();g.moveTo(sx+look*1.2-5*bs,hd-2);g.lineTo(sx+look*1.2+5*bs,hd-3.5);g.lineTo(sx+look*1.2+8*bs,hd-2.5);g.stroke()}
  if(move===13&&!ch){g.save();g.strokeStyle=col;g.shadowBlur=0;const bx=hx+6,by=hipY+1,L=HANDS[0];g.lineWidth=2.4;g.beginPath();g.moveTo(bx-2,by-2);g.lineTo(L[0]-3,L[1]-2.2);g.stroke();g.lineWidth=1.4;g.beginPath();g.moveTo(L[0]-3,L[1]-2.2);g.lineTo(L[0]-6,L[1]-4);g.stroke();g.lineWidth=1.6;g.beginPath();g.ellipse(bx,by,6.2,5,-.6,0,7);g.stroke();g.globalAlpha=.3;g.fillStyle=col;g.fill();g.globalAlpha=1;g.beginPath();g.arc(bx-.5,by-.5,1.4,0,7);g.stroke();g.restore()}
  if(move===11&&!ch){g.save();g.strokeStyle=col;g.lineWidth=1.6;g.shadowBlur=0;const dy=hipY-3;g.beginPath();g.ellipse(hx-8,dy,2,4.2,0,0,7);g.moveTo(hx+8+2,dy);g.ellipse(hx+8,dy,2,4.2,0,0,7);g.moveTo(hx-8,dy-4.2);g.lineTo(hx+8,dy-4.2);g.moveTo(hx-8,dy+4.2);g.lineTo(hx+8,dy+4.2);g.stroke();g.globalAlpha=.3;g.fillStyle=col;g.fillRect(hx-8,dy-4.2,16,8.4);g.restore()}
 if(move===12&&!ch){g.save();g.strokeStyle=col;g.lineWidth=1.8;g.shadowBlur=0;g.beginPath();g.moveTo(sx+3,hd+2.5);g.lineTo(sx+21,shY+1);g.stroke();if(Math.sin(TT*6)>.6){g.lineWidth=1;g.beginPath();g.moveTo(sx+23,shY-6);g.quadraticCurveTo(sx+26,shY-9,sx+24,shY-12);g.stroke()}g.restore()}
  if(e>.45&&Math.random()<.012*e)drops.push({x:sx+(Math.random()<.5?-5:5),y:hd-2,vx:(Math.random()<.5?-1:1)*(18+Math.random()*16),vy:-28-Math.random()*14,life:.9})}
// sleeping: the figure tips over onto the floor, little z's float up
function lie(k,t){g.save();if(k>.01){const e=k*k*(3-2*k);g.translate(W/2,35+17*e);g.rotate(-Math.PI/2*e);g.translate(-W/2,-35)}}
function zz(k,t,col){if(k<.85)return;g.save();g.fillStyle=col;g.globalAlpha=Math.min(1,(k-.85)*7);for(let i=0;i<3;i++){const f=(t*.45+i/3)%1;g.globalAlpha*=1;g.font='bold '+(5+f*5)+'px sans-serif';g.globalAlpha=Math.min(1,(k-.85)*7)*(1-f);g.fillText('z',30+f*10+i,32-f*26)}g.restore()}
function sweat(dt){g.fillStyle='#9fd8ff';for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.vy+=110*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.life-=dt;if(d.life<=0||d.y>H){drops.splice(i,1);continue}g.globalAlpha=Math.min(1,d.life*2);g.beginPath();g.arc(d.x,d.y,1.4,0,7);g.fill()}g.globalAlpha=1}
// --- motion: dance on a steady beat when the music plays, sway gently when it doesn't ---
let band=false,bandEnd=0,beats=0,bandN=0;let last=performance.now(),nb=0,visible=false,greeted=false;const PER=60/112;
new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!greeted){greeted=true;setTimeout(()=>say(DS[0],LINES[0][0]),600);setTimeout(()=>say(DS[1],LINES[1][0]),2600);DS[0].said=DS[1].said=1}}).observe(stage);
function frame(now){requestAnimationFrame(frame);if(!visible&&!DS.some(d=>d.free)&&!baby.free){last=now;return}const dt=Math.min(.05,(now-last)/1000);last=now;TT+=dt;
 const on=playing&&!au.paused;lvl+=((on?.85:0)-lvl)*Math.min(1,dt*(on?2.5:6));if(on){ph+=dt*Math.PI/PER;if(TT>nb){nb=TT+PER;beat=1;beats++;if(!band&&beats%72===40){band=true;bandN++;bandEnd=beats+16}else if(band&&beats>=bandEnd)band=false}}else{band=false;beat=0}
 beat=Math.max(0,beat-dt*5);showNext();
 const B=bounds();
 DS.forEach(d=>{if(d.init){d.X=B.L+(B.R-B.L)*(d.who?.72:.28);d.init=false}
  if(d.free&&d.st==='air'){d.vy-=1500*dt;d.FX+=d.vx*dt;d.FY+=d.vy*dt;const VW=innerWidth;
   if(d.FX<-HW*2||d.FX>VW+HW*2){d.st='gone';d.free=false;d.X=-HW*4;d.t=TT+1.1;say(d,'Whoaaa!')}
   else if(d.FY<=0){d.FY=0;d.st='runout';d.dir=d.FX<VW/2?-1:1;say(d,"I'll be right back!")}}
  else if(d.free&&d.st==='runout'){d.FX+=d.dir*300*dt;if(d.FX<-HW*2||d.FX>innerWidth+HW*2){d.st='gone';d.free=false;d.X=-HW*4;d.t=TT+.9}}
  else if(d.free){}
  else if(d.st==='air'){d.vy-=1500*dt;d.X+=d.vx*dt;d.Y+=d.vy*dt;
   if(d.X<-HW*2||d.X>B.w+HW*2||d.Y>B.h+60){d.st='gone';d.t=TT+1.1;say(d,'Whoaaa!')}
   else if(d.Y<=0){d.Y=0;if(d.thrown){d.st='runout';d.dir=d.X<B.w/2?-1:1;say(d,"I'll be right back!")}else{d.st='floor';d.cheer=TT}}}
  else if(d.st==='runout'){d.X+=d.dir*260*dt;if(d.X<-HW*2||d.X>B.w+HW*2){d.st='gone';d.t=TT+.9}}
  else if(d.st==='gone'&&TT>d.t){d.st='return';d.Y=0;d.fromR=Math.random()<.5;d.X=d.fromR?B.w+HW*2:-HW*2;d.tx=B.L+(B.R-B.L)*(d.who?.7:.3)}
  else if(d.st==='return'){const s=240*dt,gap=d.tx-d.X;d.X+=Math.sign(gap)*Math.min(s,Math.abs(gap));if(Math.abs(gap)<1){d.st='floor';d.cheer=TT;say(d,"I'm back!")}}
  if(d.st==='floor'){d.X=Math.max(B.L,Math.min(B.R,d.X));d.Y=0}});
 // never on top of each other
 {const a=DS[0],b=DS[1],MIN=64;if(!a.free&&!b.free&&['floor','drag'].includes(a.st)&&['floor','drag'].includes(b.st)&&a.Y<50&&b.Y<50){let dx=b.X-a.X;if(Math.abs(dx)<MIN){const dir=dx>=0?1:-1,push=MIN-Math.abs(dx);if(a.st==='drag')b.X+=dir*push;else if(b.st==='drag')a.X-=dir*push;else{a.X-=dir*push/2;b.X+=dir*push/2}
   [a,b].forEach(q=>{if(q.st==='floor')q.X=Math.max(B.L,Math.min(B.R,q.X))});dx=b.X-a.X;if(Math.abs(dx)<MIN){if(a.st!=='drag')a.X=b.X-dir*MIN;else b.X=a.X+dir*MIN}}}
  const close=a.st==='floor'&&b.st==='floor'&&Math.abs(b.X-a.X)<MIN+22;baby.closeT=close&&on?baby.closeT+dt:0;
  if(!baby.on&&baby.closeT>1.6){baby.on=true;BB.style.display='block';say(DS[1],'Look! Our little one!');BB.animate([{transform:'scale(0)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:600})}
  if(baby.on){const m=DS[1],p=DS[0],s=(m.X>=p.X)?1:-1,BG=50,ok=x=>x>=B.L-HW+16&&x<=B.R+HW-16&&Math.abs(x-m.X)>=BG&&(p.st!=='floor'||Math.abs(x-p.X)>=BG);
   let bx=[m.X+s*58,p.X-s*58,m.X-s*58].find(ok);
   if(bx==null){bx=Math.max(B.L-HW+16,Math.min(B.R+HW-16,m.X+s*58));const need=BG-Math.abs(bx-m.X);if(need>0&&m.st==='floor'){m.X-=s*need;if(p.st==='floor'&&Math.abs(m.X-p.X)<64)p.X=m.X-s*64}}
   if(baby.free&&baby.st==='air'){baby.vy-=1500*dt;baby.FX+=baby.vx*dt;baby.FY+=baby.vy*dt;if(baby.FX<-HB*2||baby.FX>innerWidth+HB*2){baby.st='gone';baby.free=false;baby.X=-HB*4;baby.t=TT+1.1;say(DS[1],'Come back, little one!')}else if(baby.FY<=0){baby.FY=0;baby.st='runout';baby.dir=baby.FX<innerWidth/2?-1:1}}
   else if(baby.free&&baby.st==='runout'){baby.FX+=baby.dir*220*dt;if(baby.FX<-HB*2||baby.FX>innerWidth+HB*2){baby.st='gone';baby.free=false;baby.X=-HB*4;baby.t=TT+.9}}
   else if(baby.st==='gone'&&TT>baby.t){baby.st='return';baby.X=Math.random()<.5?B.w+HB*2:-HB*2}
   else if(baby.st==='return'){const gap=bx-baby.X;baby.X+=Math.sign(gap)*Math.min(200*dt,Math.abs(gap));if(Math.abs(gap)<2){baby.st='floor';baby.cheer=TT;say(DS[1],'Welcome back, little one!')}}
   else if(baby.st==='floor'){if(!baby.X)baby.X=bx;else if(m.st==='floor')baby.X+=(bx-baby.X)*Math.min(1,dt*4)}}}
 DS.forEach(d=>{if(d.sk==null){d.sk=0;d.idle=0;d.zs=0}if(on||d.st!=='floor'||(d.cheer&&TT-d.cheer<1.2))d.idle=0;else d.idle+=dt;const tg=d.idle>9?1:0;d.sk+=(tg-d.sk)*Math.min(1,dt*(tg?1.6:3.5));if(d.sk>.9&&!d.zs){d.zs=1;if(d.who)say(d,'Zzz... tap us to wake us up.')}if(d.sk<.1)d.zs=0});
 {const tg=baby.st==='floor'&&!(baby.cheer&&TT-baby.cheer<1.2)?Math.min(DS[0].sk,DS[1].sk):0;baby.sk+=(tg-baby.sk)*Math.min(1,dt*3)}
 place();
 const moving=DS.some(d=>d.st!=='floor');AT+=dt;if(!on&&lvl<.01)lvl=0;const RT=TT;TT=AT;
 DS.forEach(d=>{g=d.g;drops=d.drops;px=d.px;MVG=band?(d.who?12:(bandN%2?13:11)):(d.who===1&&on&&si===0&&d.picked!==si?10:d.mv);LOOKO=null;if(MVG===10&&d.who===1&&on){LOOKO=(Math.round(ph/Math.PI)%2)?1:-1}if(d.hs==null){d.hs=1;d.hv=0}const ht=LOOKO!==null?-LOOKO*1.6:(MVG===12?-1.4:1);if(MVG===10&&on){const k=Math.min(1,dt*22);d.hs+=(ht-d.hs)*k;d.hv=0}else{d.hv+=(ht-d.hs)*160*dt;d.hv*=Math.max(0,1-7*dt);d.hs+=d.hv*dt}HS=d.who?Math.max(-1.6,Math.min(1.6,d.hs)):-1;
  g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);const wk=d.st==='return'||d.st==='runout';const ch=(d.cheer&&TT-d.cheer<1.2)||d.st==='air'||d.st==='drag';TK=d.tk&&RT-d.tk<1.4&&!wk&&d.sk<.2?1:0;lie(d.sk,RT);if(wk){const sv=lvl;lvl=Math.max(lvl,.6);fig(W/2,d.who,d.col,true,false);lvl=sv}else fig(W/2,d.who,d.col,false,ch&&d.sk<.2);g.restore();zz(d.sk,RT,d.col);sweat(dt)});
 TT=RT;
 if(baby.on){const R2=TT;TT=AT;g=baby.g;drops=baby.drops;px=null;MVG=3;LOOKO=null;HS=-1;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);const bwk=baby.st==='runout'||baby.st==='return',bch=baby.st==='air'||baby.st==='drag'||(baby.cheer&&R2-baby.cheer<1.2);TK=baby.tk&&R2-baby.tk<1.4&&!bwk&&baby.sk<.2?1:0;lie(baby.sk,R2);if(bwk){const sv=lvl;lvl=Math.max(lvl,.6);fig(W/2,0,'#fff2c4',true,false);lvl=sv}else fig(W/2,0,'#fff2c4',false,bch&&baby.sk<.2);g.restore();zz(baby.sk,R2+1.3,'#fff2c4');sweat(dt);TT=R2}
 if(on&&Math.floor(TT/(PER*16))!==Math.floor((TT-dt)/(PER*16)))DS.forEach(d=>{d.mv=(d.mv+1+Math.floor(Math.random()*4))%11})}
requestAnimationFrame(frame);if(0){lvl=.2;DS.forEach(d=>{g=d.g;drops=d.drops;g.setTransform(dpr,0,0,dpr,0,0);fig(W/2,d.who,d.col,false,false)})}
})();
