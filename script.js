const screens = [...document.querySelectorAll('.screen')];
const backBtn = document.getElementById('backBtn');
const historyStack = [];
let state = { place: null, drink: null, timer: 25*60, timerId: null, playing: false };

const playlists = {
  'new-orleans': { label:'New Orleans', list:'PLd65nEfwevC_QLGlWyQLWzRoHBGqmAc3P', video:'DHE7I1MWbrc', thumb:'https://img.youtube.com/vi/DHE7I1MWbrc/hqdefault.jpg' },
  'japan': { label:'Japan', list:'PLVJAuNJ6t3x-_1LKgn-GPMi-1cQJGyxJ4', video:'s-jtdKjzQaE', thumb:'https://img.youtube.com/vi/s-jtdKjzQaE/hqdefault.jpg' },
  'nyc': { label:'NYC / Harlem', list:'PLiuh3Mir6HQwZlxMt_xQfmHNTjXPgl-ov', video:'PEiLZSuPPx4', thumb:'https://img.youtube.com/vi/PEiLZSuPPx4/hqdefault.jpg' },
  'paris': { label:'Paris', list:'PLM6uZxswBALplzig23FCIyJPcvjoJR2_h', video:'4Mh0MiQ1mBw', thumb:'https://img.youtube.com/vi/4Mh0MiQ1mBw/hqdefault.jpg' }
};

const places = [
  {id:'new-orleans', playlist:'new-orleans', name:'new orleans, usa', mood:'birthplace of jazz', img:'https://source.unsplash.com/900x520/?new-orleans,french-quarter,black-and-white', origin:'New Orleans is widely considered the birthplace of jazz, where blues, ragtime, brass bands, and street parades blended into something new.', fact:'Many early jazz musicians learned by playing parades, dances, and neighborhood gatherings.', artists:'Louis Armstrong • Jelly Roll Morton • Sidney Bechet'},
  {id:'harlem', playlist:'nyc', name:'harlem / nyc, usa', mood:'small clubs & big nights', img:'https://source.unsplash.com/900x520/?harlem,new-york,black-and-white', origin:'Harlem helped shape swing, bebop, and late-night jazz club culture in New York City.', fact:'Harlem venues helped make jazz feel glamorous, danceable, experimental, and alive.', artists:'Duke Ellington • Billie Holiday • Thelonious Monk'},
  {id:'paris', playlist:'paris', name:'paris, france', mood:'Parisian jazz & café nights', img:'https://source.unsplash.com/900x520/?paris,cafe,black-and-white', origin:'Paris became a major home for European jazz through café culture, dance halls, and late-night listening rooms.', fact:'Django Reinhardt helped create a French jazz sound that still feels instantly recognizable.', artists:'Django Reinhardt • Stéphane Grappelli • Michel Petrucciani'},
  {id:'tokyo', playlist:'japan', name:'tokyo, japan', mood:'jazz kissa atmosphere', img:'https://source.unsplash.com/900x520/?tokyo,jazz-cafe,black-and-white', origin:'Tokyo is known for jazz kissas: listening cafés built around records, quiet rooms, and high-quality speakers.', fact:'Some jazz kissas feel more like record libraries than regular cafés.', artists:'Jun Miyake • Chihiro Yamanaka • Toshifumi Hinata'},
  {id:'yokohama', playlist:'japan', name:'yokohama, japan', mood:'harbor city groove', img:'https://source.unsplash.com/900x520/?yokohama,harbor,black-and-white', origin:'Yokohama has a long port-city connection to imported records, nightlife, and Japanese jazz culture.', fact:'Its harbor atmosphere makes it perfect for slower, cinematic jazz sessions.', artists:'Ryo Fukui • Wun Two • WYL'},
  {id:'sapporo', playlist:'japan', name:'sapporo, japan', mood:'quiet piano jazz', img:'https://source.unsplash.com/900x520/?sapporo,snow,black-and-white', origin:'Sapporo is tied to intimate piano jazz, snowy evenings, and a quieter listening mood.', fact:'Ryo Fukui helped make Sapporo feel important in Japanese jazz history.', artists:'Ryo Fukui • Toshifumi Hinata • Chihiro Yamanaka'}
];

const drinks = [
  ['whiskey neat','strong & timeless','drink-whiskey.png'],['old fashioned','classic & slow','drink-old-fashioned.png'],['manhattan','deep cherry glow','drink-manhattan.png'],['negroni','bitter & red','drink-negroni.png'],['boulevardier','smooth & warm','drink-boulevardier.png'],['whiskey sour','bright & golden','drink-whiskey-sour.png'],['espresso martini','late-night energy','drink-espresso-martini.png'],['red wine','velvet & calm','drink-red-wine.png']
];

function show(id, push=true){
  const current = document.querySelector('.screen.active')?.id;
  if(push && current && current !== id) historyStack.push(current);
  screens.forEach(s=>s.classList.toggle('active', s.id===id));
  backBtn.classList.toggle('hidden', id==='welcome');
  if(id !== 'session') stopMusic();
  window.scrollTo(0,0);
}
function goBack(){ const prev = historyStack.pop() || 'welcome'; show(prev, false); }
backBtn.addEventListener('click', goBack);
document.addEventListener('click', e=>{ const btn=e.target.closest('[data-go]'); if(btn) show(btn.dataset.go); });

function imgFallback(img, fallback){ img.onerror=()=>{img.onerror=null; img.src=fallback}; }

function renderPlaces(){
  const grid=document.getElementById('placeGrid');
  grid.innerHTML='';
  places.forEach(p=>{
    const el=document.createElement('button'); el.className='place-card';
    el.innerHTML=`<img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3><p>${p.mood}</p>`;
    imgFallback(el.querySelector('img'), 'assets/cities/city-tokyo.jpg');
    el.onclick=()=>selectPlace(p.id);
    grid.appendChild(el);
  });
}
function selectPlace(id){
  const p=places.find(x=>x.id===id); state.place=p;
  document.getElementById('detailImg').src=p.img; imgFallback(document.getElementById('detailImg'), 'assets/cities/city-tokyo.jpg');
  document.getElementById('detailTitle').textContent=p.name;
  document.getElementById('detailOrigin').textContent=p.origin;
  document.getElementById('detailFact').textContent=p.fact;
  document.getElementById('detailArtists').textContent=p.artists;
  show('placeDetail');
}
function renderDrinks(){
  const grid=document.getElementById('drinkGrid'); grid.innerHTML='';
  drinks.forEach(([name,desc,img])=>{
    const el=document.createElement('button'); el.className='drink-card';
    el.innerHTML=`<img src="assets/drinks/${img}" alt="${name}"><h3>${name}</h3><p>${desc}</p>`;
    el.onclick=()=>{ state.drink=name; document.querySelectorAll('.drink-card').forEach(c=>c.classList.remove('selected')); el.classList.add('selected'); };
    grid.appendChild(el);
  });
}

document.getElementById('sureBtn').onclick=()=>{
  if(!state.drink) state.drink = drinks[Math.floor(Math.random()*drinks.length)][0];
  document.getElementById('strangerResult').textContent = `They bought you a ${state.drink}. They recommend a record for the night.`;
  document.getElementById('recordBtn').classList.remove('hidden');
};
document.getElementById('noBtn').onclick=()=>{
  document.getElementById('strangerResult').textContent = 'No worries, enjoy your night.';
  document.getElementById('recordBtn').classList.remove('hidden');
};

document.getElementById('recordBtn').addEventListener('click', ()=>setupCrate());
function setupCrate(){
  const p=state.place || places[0]; const pl=playlists[p.playlist];
  document.getElementById('crateTitle').textContent=`${pl.label} record crate`;
  document.getElementById('crateStory').textContent=`The bartender slides over a weathered crate labeled ${pl.label}. “These should keep your table warm.”`;
  document.getElementById('playlistThumb').src=pl.thumb;
  document.getElementById('recordCenter').src=pl.thumb;
}

document.getElementById('playRecordBtn').onclick=()=>{ show('session'); startMusic(); };
function startMusic(){
  const p=state.place || places[0]; const pl=playlists[p.playlist];
  document.getElementById('nowPlaying').textContent=`now playing: ${pl.label} record crate`;
  document.getElementById('recordCenter').src=pl.thumb;
  document.getElementById('record').classList.add('playing');
  const src=`https://www.youtube.com/embed/videoseries?list=${pl.list}&autoplay=1&loop=1&modestbranding=1&rel=0`;
  document.getElementById('youtubeHolder').innerHTML=`<iframe width="1" height="1" src="${src}" title="Jazz playlist" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  state.playing=true;
}
function stopMusic(){
  document.getElementById('youtubeHolder').innerHTML='';
  document.getElementById('record').classList.remove('playing');
  state.playing=false;
}

const timerEl=document.getElementById('timer');
function renderTimer(){ const m=String(Math.floor(state.timer/60)).padStart(2,'0'); const s=String(state.timer%60).padStart(2,'0'); timerEl.textContent=`${m}:${s}`; }
document.getElementById('startTimer').onclick=()=>{
  if(state.timerId){ clearInterval(state.timerId); state.timerId=null; document.getElementById('startTimer').textContent='start'; return; }
  document.getElementById('startTimer').textContent='pause';
  state.timerId=setInterval(()=>{ if(state.timer>0){ state.timer--; renderTimer(); } else { clearInterval(state.timerId); state.timerId=null; stopMusic(); document.getElementById('startTimer').textContent='start'; }},1000);
};
document.getElementById('resetTimer').onclick=()=>{ clearInterval(state.timerId); state.timerId=null; state.timer=25*60; renderTimer(); document.getElementById('startTimer').textContent='start'; };

renderPlaces(); renderDrinks(); renderTimer();
