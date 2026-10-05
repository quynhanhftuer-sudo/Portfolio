const $=id=>document.getElementById(id),cover=$('cover'),main=$('main');
/* ---- Bong bóng (canvas) ---- */
const cv=$('fx'),cx=cv.getContext('2d');let W,H,bub=[],deep=true;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight}size();addEventListener('resize',size);
for(let i=0;i<46;i++)bub.push({x:Math.random(),y:Math.random(),r:2+Math.random()*9,s:.0006+Math.random()*.0016,w:Math.random()*6});
let pops=[],lastP=0;
(function loop(t){cx.clearRect(0,0,W,H);const a=deep?.8:.45;
 for(const b of bub){b.y-=b.s;if(b.y<-.05){b.y=1.05;b.x=Math.random()}
  const x=b.x*W+Math.sin(t/900+b.w)*14,y=b.y*H,g=cx.createRadialGradient(x-b.r/3,y-b.r/3,1,x,y,b.r);
  g.addColorStop(0,'rgba(255,255,255,'+a+')');g.addColorStop(.6,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(255,255,255,'+a*.5+')');
  cx.fillStyle=g;cx.beginPath();cx.arc(x,y,b.r,0,7);cx.fill()}
 pops=pops.filter(p=>p.life>0&&p.y>-30);
 for(const p of pops){p.x+=p.vx+Math.sin(t/260+p.w)*.35;p.y+=p.vy;p.life-=.005;const al=Math.min(1,p.life),g=cx.createRadialGradient(p.x-p.r/3,p.y-p.r/3,1,p.x,p.y,p.r);
  g.addColorStop(0,'rgba(255,255,255,'+.9*al+')');g.addColorStop(.6,'rgba(200,240,255,'+.1*al+')');g.addColorStop(1,'rgba(255,255,255,'+.6*al+')');
  cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(loop)})(0);
function pop(x,y,n){for(let i=0;i<n;i++)pops.push({x:x+(Math.random()-.5)*34,y:y+(Math.random()-.5)*34,r:3+Math.random()*13,vx:(Math.random()-.5)*1.1,vy:-(.5+Math.random()*1.6),w:Math.random()*6,life:1.2+Math.random()*.8})}
addEventListener('pointerdown',e=>{if(deep)pop(e.clientX,e.clientY,8)});
addEventListener('pointermove',e=>{if(!deep)return;const n=performance.now();if((e.buttons||e.pointerType==='touch')&&n-lastP>50){lastP=n;pop(e.clientX,e.clientY,1)}});

/* ---- Âm thanh biển (Web Audio, tạo trực tiếp) ---- */
let ac,lp,master,on=false;
function initAudio(){if(ac)return;ac=new(window.AudioContext||window.webkitAudioContext)();
 const n=ac.sampleRate*4,buf=ac.createBuffer(1,n,ac.sampleRate),d=buf.getChannelData(0);let l=0;
 for(let i=0;i<n;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}
 const src=ac.createBufferSource();src.buffer=buf;src.loop=true;
 lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=450;
 const wave=ac.createGain();wave.gain.value=.55;
 const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.11;lg.gain.value=.4;lfo.connect(lg);lg.connect(wave.gain);lfo.start();
 master=ac.createGain();master.gain.value=0;
 src.connect(lp);lp.connect(wave);wave.connect(master);master.connect(ac.destination);src.start();
 setInterval(blip,1700)}
function blip(){if(!on||!deep||ac.state!=='running')return;const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime,f=350+Math.random()*500;
 o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*2.2,t+.12);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);
 o.connect(g);g.connect(master);o.start(t);o.stop(t+.15)}
function setSound(v){on=v;initAudio();ac.resume();master.gain.setTargetAtTime(v?.7:0,ac.currentTime,.4);
 $('snd').textContent=v?'🔊 Tắt âm thanh biển':'🔇 Bật âm thanh biển';$('snd').setAttribute('aria-pressed',v)}
function mood(){if(ac)lp.frequency.setTargetAtTime(deep?450:1500,ac.currentTime,.8)}
$('snd').onclick=()=>setSound(!on);

/* ---- Chuyển trang ---- */
function swap(from,to,toDeep){from.classList.remove('show');setTimeout(()=>{from.classList.remove('on');to.classList.add('on');deep=toDeep;mood();scrollTo(0,0);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{to.classList.add('show');reveal()}))},700)}
$('go').onclick=()=>{setSound(true);swap(cover,main,false)};
$('back').onclick=()=>swap(main,cover,true);
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.rv').forEach(el=>io.observe(el))}
$('play').onclick=()=>setSound(!on);
function viaMail(n,r,m){
 location.href='mailto:'+CONFIG.EMAIL+'?subject='+encodeURIComponent('Lời nhắn từ portfolio: '+(n||'bạn'))+'&body='+encodeURIComponent('Tên: '+n+'\nChủ đề: '+r+'\n\n'+m);
 return 'Ứng dụng email của bạn sẽ mở với nội dung đã điền sẵn. Bấm Gửi để hoàn tất nhé!'}
$('frm').onsubmit=async e=>{e.preventDefault();
 const n=$('n').value.trim(),m=$('m').value.trim(),r=document.querySelector('#frm input[type=radio]:checked').parentNode.textContent.trim(),ok=$('ok');
 const C=CONFIG;let msg;
 if(C.GFORM_ID&&C.ENTRY_NAME&&C.ENTRY_TOPIC&&C.ENTRY_MSG){
  try{const d=new URLSearchParams();d.append('entry.'+C.ENTRY_NAME,n);d.append('entry.'+C.ENTRY_TOPIC,r);d.append('entry.'+C.ENTRY_MSG,m);
   await fetch('https://docs.google.com/forms/d/e/'+C.GFORM_ID+'/formResponse',{method:'POST',mode:'no-cors',body:d});
   msg='Cảm ơn bạn! Lời nhắn đã được gửi, mình sẽ phản hồi sớm nhất.';$('frm').reset()}
  catch(err){msg=viaMail(n,r,m)}
 }else msg=viaMail(n,r,m);
 ok.textContent=msg;ok.style.display='block'};
function tick(){const n=new Date(),t=new Date(n.getFullYear()+1,0,1),d=t-n;
 $('d').textContent=Math.floor(d/864e5);$('h').textContent=Math.floor(d/36e5)%24;$('mi').textContent=Math.floor(d/6e4)%60;$('s').textContent=Math.floor(d/1e3)%60}
tick();setInterval(tick,1000);
