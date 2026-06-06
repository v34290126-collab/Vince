/* ============================================================
   FOR MY LOVE — Site script
   Hamburger, particles, gallery, timeline, marry-me, animations
   ============================================================ */

/* ===== Background particles ===== */
function spawnParticles(n=24){
  const wrap=document.createElement('div');
  wrap.className='particles';
  for(let i=0;i<n;i++){
    const s=document.createElement('span');
    const size=8+Math.random()*20;
    s.textContent='\u2726';
    s.style.left=Math.random()*100+'%';
    s.style.fontSize=size+'px';
    s.style.animationDuration=(10+Math.random()*14)+'s';
    s.style.animationDelay=(Math.random()*14)+'s';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
}

/* ===== Hamburger menu ===== */
const NAV = [
  {href:'index.html',label:'Home',icon:'fa-house'},
  {href:'story.html',label:'Our Story',icon:'fa-book-heart'},
  {href:'gallery.html',label:'Gallery',icon:'fa-images'},
  {href:'timeline.html',label:'Timeline',icon:'fa-clock-rotate-left'},
  {href:'timer.html',label:'Countdown',icon:'fa-hourglass-half'},
  {href:'letter.html',label:'Letter',icon:'fa-envelope-open-text'},
  {href:'reasons.html',label:'Reasons',icon:'fa-heart'},
  {href:'future.html',label:'Future',icon:'fa-star'},
  {href:'music.html',label:'Music',icon:'fa-music'},
  {href:'game.html',label:'Game',icon:'fa-gamepad'},
  {href:'confession.html',label:'Confession',icon:'fa-feather'},
  {href:'marry.html',label:'Marry Me',icon:'fa-ring'},
];

function injectNav(){
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const bar=document.createElement('header');
  bar.className='topbar';
  bar.innerHTML=`
    <a class="brand" href="index.html">Althea Nicole &amp; Vince</a>
    <button class="hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>`;
  const overlay=document.createElement('div');
  overlay.className='menu-overlay';overlay.id='menuOverlay';
  const side=document.createElement('aside');
  side.className='sidemenu';side.id='sideMenu';
  side.innerHTML=`
    <button class="close" id="menuClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    <h3>Navigate</h3>
    <ul>${NAV.map(n=>`
      <li><a href="${n.href}" class="${current===n.href?'active':''}">
        <i class="fa-solid ${n.icon}"></i><span>${n.label}</span>
      </a></li>`).join('')}</ul>`;
  document.body.prepend(bar);
  document.body.appendChild(overlay);
  document.body.appendChild(side);
  setTimeout(() => {
  const active = side.querySelector('.active');
  if(active){
    active.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}, 100);

  const ham=document.getElementById('hamburger');
  const open=()=>{side.classList.add('open');overlay.classList.add('open');ham.classList.add('open');document.body.style.overflow='hidden'};
  const close=()=>{side.classList.remove('open');overlay.classList.remove('open');ham.classList.remove('open');document.body.style.overflow=''};
  ham.addEventListener('click',()=>side.classList.contains('open')?close():open());
  overlay.addEventListener('click',close);
  document.getElementById('menuClose').addEventListener('click',close);
}

/* ===== Typing effect ===== */
function typeText(el,text,speed=55){
  if(!el)return;let i=0;el.textContent='';
  (function tick(){
    if(i<text.length){el.textContent+=text.charAt(i++);setTimeout(tick,speed)}
  })();
}

/* ===== Scroll reveal ===== */
function revealOnScroll(selector='.t-item'){
  const items=document.querySelectorAll(selector);
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.15});
  items.forEach(i=>io.observe(i));
}

/* ===== LocalStorage helpers ===== */
const store = {
  get: (k, fallback = []) => {
    try {
      const value = localStorage.getItem(k);
      return value ? JSON.parse(value) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

/* ===== Gallery (memories) ===== */
function initGallery(){
  const grid=document.getElementById('memGrid');
  const empty=document.getElementById('memEmpty');
  const addBtn=document.getElementById('addMemBtn');
  const overlay=document.getElementById('memModal');
  const form=document.getElementById('memForm');
  const fileInput=document.getElementById('memFile');
  const preview=document.getElementById('memPreview');
  const cancel=document.getElementById('memCancel');
  let imageData=null;

  function render(){
    const mems=store.get('memories',[]);
    grid.innerHTML='';
    if(!mems.length){empty.style.display='block';return}
    empty.style.display='none';
    mems.slice().reverse().forEach((m,idx)=>{
      const realIdx=mems.length-1-idx;
      const card=document.createElement('article');
      card.className='glass mem-card';
      card.style.animationDelay=(idx*70)+'ms';
      card.innerHTML=`
        <div class="img"><img src="${m.image}" alt="memory"></div>
        <div class="body">
          <div class="date"><i class="fa-solid fa-calendar"></i>${formatDate(m.date)}</div>
          <div class="desc">${escapeHtml(m.desc)}</div>
        </div>
        <button class="edit" data-i="${realIdx}" aria-label="Edit">
  <i class="fa-solid fa-pen"></i>
</button>`;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.edit').forEach(b=>b.addEventListener('click',e=>{
  e.stopPropagation();

  const i = +b.dataset.i;
  const all = store.get('memories',[]);

  const newDesc = prompt(
    'Edit description:',
    all[i].desc
  );

  if(newDesc !== null && newDesc.trim() !== ''){
    all[i].desc = newDesc.trim();
    store.set('memories', all);
    render();
  }
}));

  }

  function openModal(){overlay.classList.add('show');imageData=null;preview.innerHTML='';form.reset()}
  function closeModal(){overlay.classList.remove('show')}

  addBtn.addEventListener('click',openModal);
  cancel.addEventListener('click',closeModal);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});

  fileInput.addEventListener('change',e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{imageData=ev.target.result;preview.innerHTML=`<img src="${imageData}" alt="preview">`};
    r.readAsDataURL(f);
  });

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const date=form.date.value;const desc=form.desc.value.trim();
    if(!imageData||!date||!desc){alert('Please complete all fields.');return}
    const all=store.get('memories',[]);
    all.push({image:imageData,date,desc,created:Date.now()});
    store.set('memories',all);
    closeModal();render();
  });

  render();
}

/* ===== Timeline (events) ===== */
function initTimeline(){
  const feed=document.getElementById('feed');
  const empty=document.getElementById('feedEmpty');
  const addBtn=document.getElementById('addEventBtn');
  const overlay=document.getElementById('evtModal');
  const form=document.getElementById('evtForm');
  const cancel=document.getElementById('evtCancel');

  function render(){
    const evs=store.get('events',[]);
    feed.innerHTML='';
    if(!evs.length){empty.style.display='block';return}
    empty.style.display='none';
    evs.slice().reverse().forEach((ev,idx)=>{
      const realIdx=evs.length-1-idx;
      const d=new Date(ev.ts);
      const card=document.createElement('article');
      card.className='glass feed-card';
      card.style.animationDelay=(idx*60)+'ms';
      card.innerHTML=`
        <div class="when"><i class="fa-regular fa-clock"></i>${formatDateTime(d)}</div>
<h3 class="event-title">${escapeHtml(ev.title || 'Untitled')}</h3>
<p class="msg">${escapeHtml(ev.msg)}</p>
        <button class="del" data-i="${realIdx}" aria-label="Delete"><i class="fa-solid fa-xmark"></i></button>`;
      feed.appendChild(card);
    });
    feed.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{
      const i=+b.dataset.i;const all=store.get('events',[]);all.splice(i,1);store.set('events',all);render();
    }));
  }

  addBtn.addEventListener('click',()=>overlay.classList.add('show'));
  cancel.addEventListener('click',()=>overlay.classList.remove('show'));
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('show')});

form.addEventListener('submit',e=>{
  e.preventDefault();

  const title = form.title.value.trim();
  const msg = form.msg.value.trim();

  if(!title || !msg) return;

  const all = store.get('events',[]);

  all.push({
    title,
    msg,
    ts: Date.now()
  });

  store.set('events',all);

  form.reset();
  overlay.classList.remove('show');
  render();
});

  render();
}

/* ===== Countdown ===== */
function initCountdown(targetDate){
  const t=new Date(targetDate).getTime();
  const dEl=document.getElementById('cd-d');
  const hEl=document.getElementById('cd-h');
  const mEl=document.getElementById('cd-m');
  const sEl=document.getElementById('cd-s');
  function tick(){
    const now=Date.now();let diff=t-now;
    const past=diff<0;diff=Math.abs(diff);
    const d=Math.floor(diff/86400000);
    const h=Math.floor((diff%86400000)/3600000);
    const m=Math.floor((diff%3600000)/60000);
    const s=Math.floor((diff%60000)/1000);
    dEl.textContent=d;hEl.textContent=String(h).padStart(2,'0');
    mEl.textContent=String(m).padStart(2,'0');sEl.textContent=String(s).padStart(2,'0');
    const lbl=document.getElementById('cd-label');
    if(lbl)lbl.textContent=past?'Time since naging tayo':'Until our day';
  }
  tick();setInterval(tick,1000);
}

/* ===== Game (find the heart) ===== */
function initGame(){
  const grid=document.getElementById('gameGrid');
  const msg=document.getElementById('gameMsg');
  if(!grid)return;
  function build(){
    grid.innerHTML='';
    const size=30;const heartIdx=Math.floor(Math.random()*size);
    for(let i=0;i<size;i++){
      const b=document.createElement('button');
      b.textContent='?';
      b.addEventListener('click',()=>{
        if(i===heartIdx){b.innerHTML='<i class="fa-solid fa-heart" style="color:#ff8fb1"></i>';msg.textContent='kulay pink madik kanya ata hahaha';setTimeout(build,1800)}
        else{b.style.opacity=.3;msg.textContent='Partakam. hanapin ah hayss'}
      });
      grid.appendChild(b);
    }
  }
  build();
}

/* ===== Marry Me ===== */
function initMarry(){
  const yes=document.getElementById('yesBtn');
  const no=document.getElementById('noBtn');
  const wrap=document.getElementById('marryBtns');
  const celebration=document.getElementById('celebration');
  let attempts=0;
  const yesSizes=[1,1.15,1.3,1.5,1.75,2,2.3,2.6];
  const noSizes=[1,.9,.78,.66,.54,.44,.36,.3];

  function escape(){
    attempts++;
    const i=Math.min(attempts,yesSizes.length-1);
    yes.style.transform=`scale(${yesSizes[i]})`;
    no.style.transform=`scale(${noSizes[i]})`;
    // move no button
    const w=window.innerWidth,h=window.innerHeight;
    const x=(Math.random()*w*.7)-w*.35;
    const y=(Math.random()*h*.6)-h*.3;
    no.style.position='fixed';
    no.style.left=Math.max(20,Math.min(w-140,w/2+x))+'px';
    no.style.top=Math.max(80,Math.min(h-80,h/2+y))+'px';
  }
  no.addEventListener('mouseenter',escape);
  no.addEventListener('focus',escape);
  no.addEventListener('touchstart',e=>{e.preventDefault();escape()},{passive:false});
  no.addEventListener('click',escape);

  yes.addEventListener('click',()=>{
    document.getElementById('marryMain').style.display='none';
    celebration.classList.add('show');
    bloomFlowers();
    setTimeout(fallingPetals,1200);
  });
}
function bloomFlowers(){
  const N=18;
  for(let i=0;i<N;i++){
    const f=document.createElement('div');f.className='flower';
    f.style.left=(Math.random()*90+5)+'vw';
    f.style.top=(Math.random()*80+10)+'vh';
    f.style.animationDelay=(Math.random()*1.2)+'s';
    for(let p=0;p<6;p++){
      const petal=document.createElement('div');petal.className='petal';
      petal.style.transform=`rotate(${p*60}deg) translateY(-12px)`;
      f.appendChild(petal);
    }
    const c=document.createElement('div');c.className='center';f.appendChild(c);
    document.body.appendChild(f);
  }
}
function fallingPetals(){
  setInterval(()=>{
    const p=document.createElement('div');p.className='petal-fall';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=(6+Math.random()*6)+'s';
    p.style.opacity=.4+Math.random()*.6;
    p.style.transform=`scale(${.6+Math.random()*.9})`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),12000);
  },180);
}

/* ===== Utils ===== */
function escapeHtml(s) {
  return String(s).replace(/[&]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function formatDate(iso){
  try{const d=new Date(iso+'T00:00:00');return d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}catch{return iso}
}
function formatDateTime(d){
  return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})+' · '+d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
}

/* ===== Bootstrap ===== */
document.addEventListener('DOMContentLoaded',()=>{
  injectNav();
  spawnParticles(22);
});

