const screens = [...document.querySelectorAll('.screen')];
const backBtn = document.getElementById('backBtn');
const historyStack = [];

let state = {
  place: null,
  drink: null,
  timer: 25 * 60,
  timerId: null,
  playing: false,
  player: null,
  playerReady: false,
  currentPlaylist: null,
  loadedPlaylistList: null,
  lastNeedleDrop: false,
  visited: JSON.parse(localStorage.getItem('jazzCafeVisited') || '[]'),
  name: localStorage.getItem('jazzCafeName') || '',
  focus: localStorage.getItem('jazzCafeFocus') || ''
};

const playlists = {
  'new-orleans': {
    label: 'New Orleans',
    list: 'PLd65nEfwevC_QLGlWyQLWzRoHBGqmAc3P',
    video: 'DHE7I1MWbrc',
    thumb: 'https://img.youtube.com/vi/DHE7I1MWbrc/hqdefault.jpg',
    story: 'The bartender dusts off an old crate. “If you’re starting anywhere, it should be here. Everything else owes a little something to New Orleans.”', closing: 'New Orleans stamped in your passport. The brass section fades into the street outside.'
  },
  'japan': {
    label: 'Japan',
    list: 'PLVJAuNJ6t3x-_1LKgn-GPMi-1cQJGyxJ4',
    video: 's-jtdKjzQaE',
    thumb: 'https://img.youtube.com/vi/s-jtdKjzQaE/hqdefault.jpg',
    story: 'The bartender carefully removes a sleeve. “This one came from a listening café. Take your time with it.”', closing: 'Japan stamped in your passport. The room quiets, but the record stays with you.'
  },
  'nyc': {
    label: 'NYC / Harlem',
    list: 'PLiuh3Mir6HQwZlxMt_xQfmHNTjXPgl-ov',
    video: 'PEiLZSuPPx4',
    thumb: 'https://img.youtube.com/vi/PEiLZSuPPx4/hqdefault.jpg',
    story: 'The bartender nods toward the stage. “Tonight’s a Harlem night. Small clubs, big bands, and midnight standards.”', closing: 'Harlem stamped in your passport. The last note hangs over the tables.'
  },
  'paris': {
    label: 'Paris',
    list: 'PLM6uZxswBALplzig23FCIyJPcvjoJR2_h',
    video: '4Mh0MiQ1mBw',
    thumb: 'https://img.youtube.com/vi/4Mh0MiQ1mBw/hqdefault.jpg',
    story: 'The bartender smiles. “Something from Saint-Germain. A slow evening deserves a slow record.”', closing: 'Paris stamped in your passport. The café lights soften over the last chord.'
  }
};

const imageFiles = {
  'new-orleans': 'https://upload.wikimedia.org/wikipedia/commons/7/74/Canal_Street_New_Orleans_Traffic_1926_Stereo_-_%28further_crop%29.png',
  'harlem': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Street_scene_harlem_1943.jpg/960px-Street_scene_harlem_1943.jpg',
  'paris': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rue_St._Rustique%2C_Paris_3c05725u.jpg',
  'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Tokyo_street_1905.jpg',
  'yokohama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/A_Street_in_Benten-Tori%2C_At_Yokohama.jpg/960px-A_Street_in_Benten-Tori%2C_At_Yokohama.jpg',
  'sapporo': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Toho_Eiga_Theater%2C_Sapporo_%281938%29_-_momat.jpg'
};

const places = [
  {id:'new-orleans', playlist:'new-orleans', name:'new orleans, usa', mood:'birthplace of jazz', img:imageFiles['new-orleans'], origin:'New Orleans is widely considered the birthplace of jazz, where blues, ragtime, brass bands, and street parades blended into something new.', fact:'Many early jazz musicians learned by playing parades, dances, and neighborhood gatherings.', artists:'Louis Armstrong • Jelly Roll Morton • Sidney Bechet'},
  {id:'harlem', playlist:'nyc', name:'harlem / nyc, usa', mood:'small clubs & big nights', img:imageFiles['harlem'], origin:'Harlem helped shape swing, bebop, and late-night jazz club culture in New York City.', fact:'Harlem venues helped make jazz feel glamorous, danceable, experimental, and alive.', artists:'Duke Ellington • Billie Holiday • Thelonious Monk'},
  {id:'paris', playlist:'paris', name:'paris, france', mood:'Parisian jazz & café nights', img:imageFiles['paris'], origin:'Paris became a major home for European jazz through café culture, dance halls, and late-night listening rooms.', fact:'Django Reinhardt helped create a French jazz sound that still feels instantly recognizable.', artists:'Django Reinhardt • Stéphane Grappelli • Michel Petrucciani'},
  {id:'tokyo', playlist:'japan', crateStory:'The bartender carefully removes a sleeve. “This one came from a Tokyo jazz kissa. Quiet room. Good speakers. No rush.”', name:'tokyo, japan', mood:'jazz kissa atmosphere', img:imageFiles['tokyo'], origin:'Tokyo is known for jazz kissas: listening cafés built around records, quiet rooms, and high-quality speakers.', fact:'Some jazz kissas feel more like record libraries than regular cafés.', artists:'Jun Miyake • Chihiro Yamanaka • Toshifumi Hinata'},
  {id:'yokohama', playlist:'japan', crateStory:'The bartender slides over a record. “Harbor cities always seem to make good jazz. Let’s see what tonight sounds like.”', name:'yokohama, japan', mood:'harbor city groove', img:imageFiles['yokohama'], origin:'Yokohama has a long port-city connection to imported records, nightlife, and Japanese jazz culture.', fact:'Its harbor atmosphere makes it perfect for slower, cinematic jazz sessions.', artists:'Ryo Fukui • Wun Two • WYL'},
  {id:'sapporo', playlist:'japan', crateStory:'The bartender laughs quietly. “Cold city. Warm record.”', name:'sapporo, japan', mood:'quiet piano jazz', img:imageFiles['sapporo'], origin:'Sapporo is tied to intimate piano jazz, snowy evenings, and a quieter listening mood.', fact:'Ryo Fukui helped make Sapporo feel important in Japanese jazz history.', artists:'Ryo Fukui • Toshifumi Hinata • Chihiro Yamanaka'}
];

const drinks = [
  ['sparkling cherry','bright & slow','drink-manhattan.png'],
  ['velvet citrus','warm & balanced','drink-old-fashioned.png'],
  ['red café spritz','deep red glow','drink-negroni.png'],
  ['nightcap tonic','smooth & timeless','drink-whiskey.png'],
  ['ruby soda','bitter & soft','drink-boulevardier.png'],
  ['golden sour','light & bright','drink-whiskey-sour.png'],
  ['espresso cream','late-night energy','drink-espresso-martini.png'],
  ['red grape fizz','velvet & calm','drink-red-wine.png']
];

function show(id, push = true) {
  const current = document.querySelector('.screen.active')?.id;
  if (push && current && current !== id) historyStack.push(current);
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  backBtn.classList.toggle('hidden', id === 'welcome');
  if (id !== 'session') pauseMusic();
  window.scrollTo(0, 0);
}

function goBack() {
  stopMusic();
  pauseTimerOnly();
  const prev = historyStack.pop() || 'welcome';
  show(prev, false);
}
backBtn.addEventListener('click', goBack);

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-go]');
  if (btn) show(btn.dataset.go);
});

function imgFallback(img, fallback) {
  img.onerror = () => {
    img.onerror = null;
    img.src = fallback;
  };
}

function saveVisited(id) {
  if (!state.visited.includes(id)) {
    state.visited.push(id);
    localStorage.setItem('jazzCafeVisited', JSON.stringify(state.visited));
  }
}

function renderPlaces() {
  const grid = document.getElementById('placeGrid');
  grid.innerHTML = '';
  places.forEach(p => {
    const el = document.createElement('button');
    el.className = 'place-card';
    el.setAttribute('aria-label', `Choose ${p.name}`);
    const visited = state.visited.includes(p.id) ? '<span class="passport-stamp">visited</span>' : '';
    el.innerHTML = `<img src="${p.img}" alt="Black and white photograph representing ${p.name}" loading="lazy"><h3>${p.name}</h3><p>${p.mood}</p>${visited}`;
    imgFallback(el.querySelector('img'), 'assets/cities/city-tokyo.jpg');
    el.onclick = () => selectPlace(p.id);
    grid.appendChild(el);
  });
}

function selectPlace(id) {
  const p = places.find(x => x.id === id);
  state.place = p;
  saveVisited(id);
  renderPlaces();
  const detailImg = document.getElementById('detailImg');
  detailImg.src = p.img;
  detailImg.alt = `Black and white photograph representing ${p.name}`;
  imgFallback(detailImg, 'assets/cities/city-tokyo.jpg');
  document.getElementById('detailTitle').textContent = p.name;
  document.getElementById('detailOrigin').textContent = p.origin;
  document.getElementById('detailFact').textContent = p.fact;
  document.getElementById('detailArtists').textContent = p.artists;
  show('placeDetail');
}

function renderDrinks() {
  const grid = document.getElementById('drinkGrid');
  grid.innerHTML = '';
  drinks.forEach(([name, desc, img]) => {
    const el = document.createElement('button');
    el.className = 'drink-card';
    el.setAttribute('aria-label', `Choose ${name}`);
    el.innerHTML = `<img src="assets/drinks/${img}" alt="${name}"><h3>${name}</h3><p>${desc}</p>`;
    el.onclick = () => {
      state.drink = name;
      localStorage.setItem('jazzCafeDrink', name);
      document.querySelectorAll('.drink-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    };
    grid.appendChild(el);
  });
}

document.getElementById('nameInput').value = state.name;
document.getElementById('focusInput').value = state.focus;
document.getElementById('nameInput').addEventListener('input', e => {
  state.name = e.target.value.trim();
  localStorage.setItem('jazzCafeName', state.name);
});
document.getElementById('focusInput').addEventListener('input', e => {
  state.focus = e.target.value.trim();
  localStorage.setItem('jazzCafeFocus', state.focus);
});

document.getElementById('sureBtn').onclick = () => {
  if (!state.drink) state.drink = drinks[Math.floor(Math.random() * drinks.length)][0];
  document.getElementById('strangerResult').textContent = `The bartender brings over a ${state.drink}. They recommend a record for the night.`;
  document.getElementById('recordBtn').classList.remove('hidden');
};

document.getElementById('noBtn').onclick = () => {
  document.getElementById('strangerResult').textContent = 'No worries. The bartender nods and lets the record keep spinning.';
  document.getElementById('recordBtn').classList.remove('hidden');
};

document.getElementById('recordBtn').addEventListener('click', setupCrate);
function cityTitle(place) {
  return (place?.name || 'record').split(',')[0].split('/')[0].trim().replace(/\b\w/g, c => c.toUpperCase());
}
function setupCrate() {
  const p = state.place || places[0];
  const pl = playlists[p.playlist];
  const cityLabel = cityTitle(p);
  document.getElementById('crateTitle').textContent = `${cityLabel} record crate`;
  document.getElementById('crateStory').textContent = p.crateStory || pl.story;
  document.getElementById('playlistThumb').src = pl.thumb;
  document.getElementById('recordCenter').src = pl.thumb;
  document.getElementById('trackTitle').textContent = 'waiting for the needle';
  document.getElementById('trackArtist').textContent = 'press start to begin';
  state.currentPlaylist = pl;
  state.loadedPlaylistList = null;
}

document.getElementById('playRecordBtn').onclick = () => {
  show('session');
  preparePlayer();
};

function onYouTubeIframeAPIReady() {
  state.playerReady = true;
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function preparePlayer() {
  const p = state.place || places[0];
  const pl = playlists[p.playlist];
  state.currentPlaylist = pl;
  state.loadedPlaylistList = null;
  const cityLabel = cityTitle(p);
  document.getElementById('nowPlaying').textContent = `${cityLabel} record crate`;
  document.getElementById('recordCenter').src = pl.thumb;
  updateTrackText('waiting for the needle', 'press start to begin');
  if (!state.player && window.YT && YT.Player) {
    state.player = new YT.Player('youtubeHolder', {
      height: '1',
      width: '1',
      playerVars: { listType: 'playlist', list: pl.list, modestbranding: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: () => {
          state.playerReady = true;
          state.player.cuePlaylist({ list: pl.list, listType: 'playlist' });
          state.loadedPlaylistList = null;
        },
        onStateChange: handlePlayerState
      }
    });
  } else if (state.player && state.player.cuePlaylist) {
    state.player.cuePlaylist({ list: pl.list, listType: 'playlist' });
    state.loadedPlaylistList = null;
  }
}

function playMusic() {
  const p = state.place || places[0];
  const pl = playlists[p.playlist];
  const record = document.getElementById('record');
  record.classList.add('playing');
  record.classList.remove('paused');
  document.body.classList.add('music-playing');
  state.playing = true;
  state.currentPlaylist = pl;
  if (state.player && state.player.loadPlaylist) {
    if (state.loadedPlaylistList !== pl.list) {
      state.player.loadPlaylist({ list: pl.list, listType: 'playlist' });
      state.loadedPlaylistList = pl.list;
    } else {
      state.player.playVideo();
    }
  } else {
    const src = `https://www.youtube.com/embed/videoseries?list=${pl.list}&enablejsapi=1&autoplay=1&modestbranding=1&rel=0`;
    document.getElementById('youtubeHolder').innerHTML = `<iframe id="fallbackPlayer" width="1" height="1" src="${src}" title="Jazz playlist" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    state.loadedPlaylistList = pl.list;
  }
}

function pauseMusic() {
  if (state.player && state.player.pauseVideo) state.player.pauseVideo();
  const record = document.getElementById('record');
  record.classList.remove('playing');
  record.classList.add('paused');
  document.body.classList.remove('music-playing');
  state.playing = false;
}

function stopMusic() {
  if (state.player && state.player.stopVideo) state.player.stopVideo();
  const record = document.getElementById('record');
  record.classList.remove('playing');
  record.classList.add('paused');
  document.body.classList.remove('music-playing');
  state.playing = false;
}

function handlePlayerState(event) {
  if (!state.player || !state.player.getVideoData) return;
  if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
    const data = state.player.getVideoData();
    const title = data?.title || state.currentPlaylist?.label || 'jazz record';
    const author = data?.author || 'YouTube playlist';
    updateTrackText(title, author);
    if (data?.video_id) document.getElementById('recordCenter').src = `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`;
  }
  if (event.data === YT.PlayerState.PAUSED) {
    document.getElementById('record').classList.remove('playing');
    document.getElementById('record').classList.add('paused');
  }
}

function updateTrackText(title, artist) {
  document.getElementById('trackTitle').textContent = title;
  document.getElementById('trackArtist').textContent = artist;
}

const timerEl = document.getElementById('timer');
function renderTimer() {
  const m = String(Math.floor(state.timer / 60)).padStart(2, '0');
  const s = String(state.timer % 60).padStart(2, '0');
  timerEl.textContent = `${m}:${s}`;
}

function pauseTimerOnly() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
    document.getElementById('startTimer').textContent = 'start';
  }
}

document.getElementById('startTimer').onclick = () => {
  if (state.timerId) {
    pauseTimerOnly();
    pauseMusic();
    return;
  }
  document.getElementById('startTimer').textContent = 'pause';
  playMusic();
  state.timerId = setInterval(() => {
    if (state.timer > 0) {
      state.timer--;
      renderTimer();
    } else {
      pauseTimerOnly();
      stopMusic();
      showClosingTime();
    }
  }, 1000);
};

document.getElementById('resetTimer').onclick = () => {
  pauseTimerOnly();
  stopMusic();
  state.timer = 25 * 60;
  renderTimer();
};

function showClosingTime() {
  const p = state.place || places[0];
  const pl = playlists[p.playlist] || playlists['new-orleans'];
  const city = cityTitle(p);
  const closing = pl.closing || `${city} stamped in your passport.`;
  const msg = document.createElement('div');
  msg.className = 'closing-time';
  msg.innerHTML = `<div><p class="eyebrow">closing time</p><h2>The bartender turns down the lights.</h2><p>“That’s all for tonight. Your table will be here whenever you return.”</p><p class="passport-line">${closing}</p><p class="session-complete">session completed • 25 minutes</p><button class="primary">leave the café</button></div>`;
  msg.querySelector('button').onclick = () => { msg.remove(); show('welcome', false); state.timer = 25 * 60; renderTimer(); };
  document.body.appendChild(msg);
}

renderPlaces();
renderDrinks();
renderTimer();
