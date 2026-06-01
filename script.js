// For My Love 💚 — shared JS

// Floating hearts background
function initHearts(){
  const c=document.createElement('div');c.className='hearts';document.body.prepend(c);
  const hs=['💚','💖','💕','✨','💗'];
  for(let i=0;i<25;i++){
    const s=document.createElement('span');
    s.textContent=hs[i%hs.length];
    s.style.left=Math.random()*100+'vw';
    s.style.fontSize=(12+Math.random()*22)+'px';
    s.style.animationDuration=(8+Math.random()*12)+'s';
    s.style.animationDelay=(Math.random()*10)+'s';
    c.appendChild(s);
  }
}

// Active nav link
function initNav(){
  const here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    if(a.getAttribute('href')===here)a.classList.add('active');
  });
}

// Typing effect
function typeText(el,text,speed=55,cb){
  let i=0;el.innerHTML='';
  const cur=document.createElement('span');cur.className='cursor';cur.innerHTML='&nbsp;';
  el.appendChild(cur);
  const id=setInterval(()=>{
    if(i<text.length){cur.insertAdjacentText('beforebegin',text[i++]);}
    else{clearInterval(id);cb&&cb();}
  },speed);
}

// Scroll reveal
function initReveal(sel='.fade'){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}
  }),{threshold:.15});
  document.querySelectorAll(sel).forEach(el=>io.observe(el));
}

// Parallax mouse
function initParallax(sel='.parallax'){
  const els=document.querySelectorAll(sel);
  document.addEventListener('mousemove',e=>{
    const x=(e.clientX/window.innerWidth-.5)*20;
    const y=(e.clientY/window.innerHeight-.5)*20;
    els.forEach(el=>el.style.transform=`translate(${x}px,${y}px)`);
  });
}

// Init on every page
document.addEventListener('DOMContentLoaded',()=>{
  initHearts();initNav();initReveal();
});
