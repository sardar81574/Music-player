/* ==========================================
   VIBEWAVE MUSIC PLAYER
   Demo music + local audio uploads
========================================== */

const $ = (id) => document.getElementById(id);

const audio = $("audio");

let currentSongId = null;
let currentMood = "all";
let currentView = "home";
let isShuffle = false;
let repeatOne = false;
let searchQuery = "";
let nextId = 100;

// Demo album artwork
const covers = [
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
];

// Demo tracks.
// These are sample instrumental tracks, not Bollywood recordings.

const songs = [
  {
    id: "demo1",
    title: "Midnight Dreams",
    artist: "VibeWave Sessions",
    mood: "chill",
    cover: covers[0],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "demo2",
    title: "Electric Nights",
    artist: "Neon Sounds",
    mood: "energy",
    cover: covers[1],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "demo3",
    title: "Moonlight",
    artist: "Dreamscape",
    mood: "romantic",
    cover: covers[2],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "demo4",
    title: "Feel The Beat",
    artist: "Urban Waves",
    mood: "pop",
    cover: covers[3],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "demo5",
    title: "Golden Hour",
    artist: "Sunset Audio",
    mood: "chill",
    cover: covers[4],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "demo6",
    title: "Dreamy Vibes",
    artist: "Cloud Nine",
    mood: "romantic",
    cover: covers[5],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "demo7",
    title: "Night Drive",
    artist: "After Hours",
    mood: "energy",
    cover: covers[6],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "demo8",
    title: "Ocean Eyes",
    artist: "Blue Horizon",
    mood: "chill",
    cover: covers[7],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "demo9",
    title: "Wild Heart",
    artist: "Free Spirit",
    mood: "pop",
    cover: covers[8],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  },
  {
    id: "demo10",
    title: "Starlight",
    artist: "Cosmic Beats",
    mood: "romantic",
    cover: covers[9],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  },
  {
    id: "demo11",
    title: "Power Up",
    artist: "Pulse Studio",
    mood: "energy",
    cover: covers[10],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"
  },
  {
    id: "demo12",
    title: "Summer Feeling",
    artist: "Golden Waves",
    mood: "pop",
    cover: covers[11],
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  }
];

// Uploaded songs are added to this array.
// Their temporary object URLs work for the current page session.

let likedSongs = new Set();

try {
  likedSongs = new Set(
    JSON.parse(localStorage.getItem("vibewave-liked") || "[]")
  );
} catch {
  likedSongs = new Set();
}

let playlists = [];

try {
  playlists = JSON.parse(
    localStorage.getItem("vibewave-playlists") || "[]"
  );

  if (!Array.isArray(playlists)) {
    playlists = [];
  }
} catch {
  playlists = [];
}

/* ==========================================
   HELPERS
========================================== */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getSong(id) {
  return songs.find(song => song.id === String(id));
}

function getCurrentSong() {
  return getSong(currentSongId);
}

function saveLikes() {
  localStorage.setItem(
    "vibewave-liked",
    JSON.stringify([...likedSongs])
  );
}

function savePlaylists() {
  localStorage.setItem(
    "vibewave-playlists",
    JSON.stringify(playlists)
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function setButtonActive(button, active) {
  if (button) {
    button.classList.toggle("active", active);
  }
}

/* ==========================================
   RENDER SONG CARDS
========================================== */

function renderSongCards(containerId, list) {
  const container = $(containerId);

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <p class="empty-message" style="grid-column:1/-1">
        No songs found. Try another search or upload your own music.
      </p>
    `;
    return;
  }

  container.innerHTML = list.map(song => {
    const isLiked = likedSongs.has(song.id);
    const isPlaying = currentSongId === song.id && !audio.paused;

    return `
      <article class="song-card">

        <div class="cover">
          <img
            src="${escapeHTML(song.cover)}"
            alt="${escapeHTML(song.title)} album cover"
            loading="lazy"
          >

          <div class="cover-overlay">
            <button
              class="cover-play"
              data-action="play"
              data-id="${escapeHTML(song.id)}"
              aria-label="Play ${escapeHTML(song.title)}"
            >${isPlaying ? "Ⅱ" : "▶"}</button>
          </div>
        </div>

        <h3 title="${escapeHTML(song.title)}">
          ${escapeHTML(song.title)}
        </h3>

        <p class="artist" title="${escapeHTML(song.artist)}">
          ${escapeHTML(song.artist)}
        </p>

        <div class="card-actions">
          <button
            class="${isLiked ? "liked" : ""}"
            data-action="like"
            data-id="${escapeHTML(song.id)}"
            aria-label="Like song"
            title="Like song"
          >${isLiked ? "♥" : "♡"}</button>

          <button
            data-action="play"
            data-id="${escapeHTML(song.id)}"
            aria-label="Play song"
            title="Play song"
          >${isPlaying ? "Ⅱ" : "▶"}</button>

          <button
            class="add-to-playlist"
            data-action="add-playlist"
            data-id="${escapeHTML(song.id)}"
            aria-label="Add to playlist"
            title="Add to playlist"
          >＋</button>
        </div>

      </article>
    `;
  }).join("");
}

/* ==========================================
   FILTER SONGS
========================================== */

function getFilteredSongs() {
  return songs.filter(song => {
    const matchesMood =
      currentMood === "all" || song.mood === currentMood;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query);

    return matchesMood && matchesSearch;
  });
}

function renderHome() {
  const filteredSongs = getFilteredSongs();

  renderSongCards("songCards", filteredSongs);

  if ($("songCount")) {
    $("songCount").textContent = songs.length;
  }

  renderSearchResults();
  renderLibrary();
  renderLikedSongs();
  renderPlaylists();
}

function renderSearchResults() {
  const query = searchQuery.trim().toLowerCase();

  const results = query
    ? songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
      )
    : songs;

  renderSongCards("searchResults", results);

  if ($("searchEmpty")) {
    $("searchEmpty").hidden = results.length !== 0;
  }
}

/* ==========================================
   LIBRARY AND LIKED SONGS
========================================== */

function renderTrackList(containerId, list, emptyId, emptyText) {
  const container = $(containerId);

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = "";

    if ($(emptyId)) {
      $(emptyId).textContent = emptyText;
      $(emptyId).hidden = false;
    }

    return;
  }

  if ($(emptyId)) {
    $(emptyId).hidden = true;
  }

  container.innerHTML = list.map(song => `
    <div class="track">
      <div class="track-art">
        <img
          src="${escapeHTML(song.cover)}"
          alt=""
          loading="lazy"
        >
      </div>

      <div class="track-info">
        <h3>${escapeHTML(song.title)}</h3>
        <p>${escapeHTML(song.artist)}</p>
      </div>

      <button
        data-action="play"
        data-id="${escapeHTML(song.id)}"
        aria-label="Play song"
        title="Play"
      >▶</button>

      <button
        data-action="like"
        data-id="${escapeHTML(song.id)}"
        aria-label="Like song"
        title="Like"
      >${likedSongs.has(song.id) ? "♥" : "♡"}</button>
    </div>
  `).join("");
}

function renderLibrary() {
  renderTrackList(
    "libraryList",
    songs,
    "libraryEmpty",
    "Your library is empty."
  );
}

function renderLikedSongs() {
  const liked = songs.filter(song => likedSongs.has(song.id));

  renderTrackList(
    "likedList",
    liked,
    "likedEmpty",
    "You haven't liked any songs yet. Tap ♡ on a song to save it here."
  );
}

/* ==========================================
   PLAYLISTS
========================================== */

function renderPlaylists() {
  const container = $("playlistList");

  if (!container) return;

  const empty = $("playlistEmpty");

  if (empty) {
    empty.hidden = playlists.length !== 0;
  }

  container.innerHTML = playlists.map(playlist => {
    const count = playlist.songIds.length;

    return `
      <article class="playlist">

        <div class="playlist-art">♫</div>

        <h3>${escapeHTML(playlist.name)}</h3>

        <p>${count} ${count === 1 ? "song" : "songs"}</p>

        <div class="playlist-actions">
          <button
            data-action="play-playlist"
            data-id="${escapeHTML(playlist.id)}"
          >▶ Play</button>

          <button
            data-action="view-playlist"
            data-id="${escapeHTML(playlist.id)}"
          >View Songs</button>

          <button
            data-action="delete-playlist"
            data-id="${escapeHTML(playlist.id)}"
          >Delete</button>
        </div>

      </article>
    `;
  }).join("");
}

$("playlistForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("playlistName");
  const name = input.value.trim();

  if (!name) {
    input.focus();
    return;
  }

  playlists.push({
    id: "playlist-" + Date.now(),
    name,
    songIds: []
  });

  savePlaylists();
  renderPlaylists();

  input.value = "";

  alert("Playlist created successfully!");
});

function addSongToPlaylist(songId) {
  if (playlists.length === 0) {
    alert("Pehle Playlists section mein ek playlist banao.");
    return;
  }

  const options = playlists
    .map((playlist, index) => `${index + 1}. ${playlist.name}`)
    .join("\n");

  const answer = prompt(
    "Kis playlist mein song add karna hai?\n\n" +
    options +
    "\n\nPlaylist ka number enter karo:"
  );

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || !playlists[index]) {
    alert("Invalid playlist number.");
    return;
  }

  const playlist = playlists[index];

  if (!playlist.songIds.includes(songId)) {
    playlist.songIds.push(songId);
    savePlaylists();
    renderPlaylists();

    alert(`Song added to "${playlist.name}"!`);
  } else {
    alert("Ye song pehle se is playlist mein hai.");
  }
}

function playPlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) return;

  const playlistSongs = playlist.songIds
    .map(id => getSong(id))
    .filter(Boolean);

  if (playlistSongs.length === 0) {
    alert("Is playlist mein abhi koi song nahi hai. Song card par + dabao.");
    return;
  }

  playSong(playlistSongs[0].id, playlistSongs);
}

function viewPlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) return;

  const playlistSongs = playlist.songIds
    .map(id => getSong(id))
    .filter(Boolean);

  showView("playlists");

  const container = $("playlistList");

  container.innerHTML = `
    <div class="playlist" style="grid-column:1/-1">
      <h3>${escapeHTML(playlist.name)}</h3>
      <p>${playlistSongs.length} songs</p>
      <button class="primary" data-action="back-playlists">
        ← Back to Playlists
      </button>
      <div class="track-list" style="margin-top:20px">
        ${
          playlistSongs.map(song => `
            <div class="track">
              <div class="track-art">
                <img src="${escapeHTML(song.cover)}" alt="">
              </div>
              <div class="track-info">
                <h3>${escapeHTML(song.title)}</h3>
                <p>${escapeHTML(song.artist)}</p>
              </div>
              <button data-action="play" data-id="${escapeHTML(song.id)}">▶</button>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;

  $("playlistEmpty").hidden = true;
}

/* ==========================================
   PLAYBACK
========================================== */

let playbackQueue = songs.map(song => song.id);

async function playSong(songId, customQueue = null) {
  const song = getSong(songId);

  if (!song) return;

  if (customQueue) {
    playbackQueue = customQueue.map(item =>
      typeof item === "string" ? item : item.id
    );
  } else if (!playbackQueue.includes(songId)) {
    playbackQueue = songs.map(item => item.id);
  }

  currentSongId = songId;

  $("currentTitle").textContent = song.title;
  $("currentArtist").textContent = song.artist;

  $("currentArt").innerHTML = `
    <img src="${escapeHTML(song.cover)}" alt="">
  `;

  $("likeCurrent").textContent =
    likedSongs.has(song.id) ? "♥" : "♡";

  $("likeCurrent").classList.toggle(
    "liked",
    likedSongs.has(song.id)
  );

  $("currentTime").textContent = "0:00";
  $("duration").textContent = "0:00";
  $("seek").value = 0;

  audio.pause();
  audio.src = song.src;
  audio.load();

  renderHome();

  try {
    await audio.play();
    $("playPause").textContent = "Ⅱ";
  } catch (error) {
    $("playPause").textContent = "▶";

    console.error("Audio playback failed:", error);

    alert(
      "Song play nahi hua. Internet connection check karo. " +
      "Agar demo audio link unavailable hai, to Add Songs se apni MP3 file upload karo."
    );
  }
}

async function togglePlayPause() {
  if (!currentSongId) {
    const firstSong = songs[0];

    if (firstSong) {
      await playSong(firstSong.id);
    }

    return;
  }

  if (audio.paused) {
    try {
      await audio.play();
      $("playPause").textContent = "Ⅱ";
    } catch (error) {
      console.error("Playback error:", error);
      alert("Audio play nahi hua. Audio file ya internet connection check karo.");
    }
  } else {
    audio.pause();
    $("playPause").textContent = "▶";
  }

  renderHome();
}

function getQueueSongs() {
  const queue = playbackQueue
    .map(id => getSong(id))
    .filter(Boolean);

  return queue.length ? queue : songs;
}

function nextSong() {
  const queue = getQueueSongs();

  if (!queue.length) return;

  if (isShuffle && queue.length > 1) {
    const available = queue.filter(song => song.id !== currentSongId);
    const randomSong = available[
      Math.floor(Math.random() * available.length)
    ];

    playSong(randomSong.id, queue);
    return;
  }

  const index = queue.findIndex(song => song.id === currentSongId);
  const nextIndex = index < 0 ? 0 : (index + 1) % queue.length;

  playSong(queue[nextIndex].id, queue);
}

function previousSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  const queue = getQueueSongs();

  if (!queue.length) return;

  const index = queue.findIndex(song => song.id === currentSongId);
  const previousIndex = index <= 0 ? queue.length - 1 : index - 1;

  playSong(queue[previousIndex].id, queue);
}

/* Player controls */

$("playPause").addEventListener("click", togglePlayPause);

$("next").addEventListener("click", nextSong);

$("previous").addEventListener("click", previousSong);

$("shuffle").addEventListener("click", () => {
  isShuffle = !isShuffle;
  setButtonActive($("shuffle"), isShuffle);
});

$("repeat").addEventListener("click", () => {
  repeatOne = !repeatOne;
  audio.loop = repeatOne;

  setButtonActive($("repeat"), repeatOne);

  $("repeat").title = repeatOne
    ? "Repeat current song: ON"
    : "Repeat current song: OFF";
});

$("playAll").addEventListener("click", () => {
  if (songs.length) {
    playbackQueue = songs.map(song => song.id);
    playSong(songs[0].id, playbackQueue);
  }
});

/* Audio progress */

audio.addEventListener("loadedmetadata", () => {
  $("duration").textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  $("currentTime").textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    $("duration").textContent = formatTime(audio.duration);

    $("seek").value =
      (audio.currentTime / audio.duration) * 100;
  }
});

$("seek").addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number($("seek").value) / 100) * audio.duration;
  }
});

$("volume").addEventListener("input", () => {
  audio.volume = Number($("volume").value);
});

audio.volume = 0.8;

audio.addEventListener("play", () => {
  $("playPause").textContent = "Ⅱ";
  renderHome();
});

audio.addEventListener("pause", () => {
  $("playPause").textContent = "▶";
  renderHome();
});

audio.addEventListener("ended", () => {
  if (!repeatOne) {
    nextSong();
  }
});

audio.addEventListener("error", () => {
  console.error(
    "Audio source error:",
    audio.currentSrc || audio.src
  );
});

/* ==========================================
   LIKES
========================================== */

function toggleLike(songId) {
  if (likedSongs.has(songId)) {
    likedSongs.delete(songId);
  } else {
    likedSongs.add(songId);
  }

  saveLikes();
  renderHome();

  const currentSong = getCurrentSong();

  if (currentSong) {
    $("likeCurrent").textContent =
      likedSongs.has(currentSong.id) ? "♥" : "♡";

    $("likeCurrent").classList.toggle(
      "liked",
      likedSongs.has(currentSong.id)
    );
  }
}

$("likeCurrent").addEventListener("click", () => {
  if (currentSongId) {
    toggleLike(currentSongId);
  } else {
    alert("Pehle koi song play karo.");
  }
});

/* ==========================================
   SONG CARD BUTTONS
========================================== */

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");

  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
    return;
  }

  const moodButton = event.target.closest("[data-mood]");

  if (moodButton) {
    currentMood = moodButton.dataset.mood;

    document.querySelectorAll(".mood-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mood === currentMood
      );
    });

    renderHome();
    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const id = actionButton.dataset.id;

  switch (action) {
    case "play":
      playSong(id);
      break;

    case "like":
      toggleLike(id);
      break;

    case "add-playlist":
      addSongToPlaylist(id);
      break;

    case "play-playlist":
      playPlaylist(id);
      break;

    case "view-playlist":
      viewPlaylist(id);
      break;

    case "delete-playlist": {
      const playlist = playlists.find(item => item.id === id);

      if (
        playlist &&
        confirm(`Delete playlist "${playlist.name}"?`)
      ) {
        playlists = playlists.filter(item => item.id !== id);
        savePlaylists();
        renderPlaylists();
      }

      break;
    }

    case "back-playlists":
      renderPlaylists();
      break;
  }
});

/* ==========================================
   NAVIGATION
========================================== */

function showView(view) {
  const sectionMap = {
    home: "homeSection",
    search: "searchSection",
    library: "librarySection",
    liked: "likedSection",
    playlists: "playlistsSection"
  };

  if (!sectionMap[view]) {
    view = "home";
  }

  currentView = view;

  Object.entries(sectionMap).forEach(([key, id]) => {
    $(id).hidden = key !== view;
  });

  document.querySelectorAll("[data-view]").forEach(button => {
    const active = button.dataset.view === view;

    if (
      button.classList.contains("nav-btn") ||
      button.classList.contains("bottom-nav-btn")
    ) {
      button.classList.toggle("active", active);
    }
  });

  if (view === "search") {
    renderSearchResults();
  }

  if (view === "library") {
    renderLibrary();
  }

  if (view === "liked") {
    renderLikedSongs();
  }

  if (view === "playlists") {
    renderPlaylists();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* Search */

$("search").addEventListener("input", event => {
  searchQuery = event.target.value;

  renderSearchResults();

  if (searchQuery.trim()) {
    showView("search");
  } else if (currentView === "search") {
    renderSearchResults();
  }
});

/* View all songs */

$("showAllSongs").addEventListener("click", () => {
  currentMood = "all";

  document.querySelectorAll(".mood-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.mood === "all"
    );
  });

  renderHome();

  document.getElementById("songCards").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* ==========================================
   UPLOAD LOCAL MUSIC
========================================== */

function handleFiles(fileList) {
  const files = Array.from(fileList || []);

  const audioFiles = files.filter(file =>
    file.type.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)
  );

  if (audioFiles.length === 0) {
    alert("Please select valid audio files.");
    return;
  }

  audioFiles.forEach(file => {
    const objectURL = URL.createObjectURL(file);

    const title = file.name.replace(/\.[^/.]+$/, "");

    songs.push({
      id: "local-" + nextId++,
      title,
      artist: "Your Music",
      mood: "all",
      cover: covers[Math.floor(Math.random() * covers.length)],
      src: objectURL,
      localFile: true
    });
  });

  playbackQueue = songs.map(song => song.id);

  renderHome();

  showView("library");

  alert(
    `${audioFiles.length} song(s) added to your library!`
  );
}

$("fileInput").addEventListener("change", event => {
  handleFiles(event.target.files);
  event.target.value = "";
});

$("featureFileInput").addEventListener("change", event => {
  handleFiles(event.target.files);
  event.target.value = "";
});

/* ==========================================
   START PLAYER
========================================== */

playbackQueue = songs.map(song => song.id);

renderHome();
showView("home");