// Match celebration: when a racer finds a pair, the car takes centre stage.
// Cars with a Flow clip (deck.json "clip") come to life on video; the rest
// zoom in with a shine. Confetti, the car's name (the announcer line is
// played by the caller through the sound engine), and a tap anywhere to carry on. Returns a promise that resolves when it is over.

const blobs = new Map(); // clip path -> object URL, fetched once per visit

// Fetch clips as whole files (not streamed) so the offline cache can keep
// them and iPhones play them instantly from memory.
export function preloadClips(paths) {
  for (const path of paths) {
    if (!path || blobs.has(path)) continue;
    blobs.set(path, fetch(path).then(r => (r.ok ? r.blob() : null)).then(b => (b ? URL.createObjectURL(b) : null)).catch(() => null));
  }
}

const CONFETTI = ['#ffcc00', '#ed1c24', '#1f6bff', '#25c26e', '#ff7ac8', '#ffffff'];

export function celebrate({name, image, clip, reducedMotion = false}) {
  return new Promise(async resolve => {
    const el = document.createElement('div');
    el.className = 'match-show';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', `${name}! Pair found`);
    const bits = reducedMotion ? '' : Array.from({length: 26}, (_, i) => {
      const angle = (i / 26) * Math.PI * 2, dist = 120 + (i % 5) * 34;
      return `<i style="--x:${Math.round(Math.cos(angle) * dist)}px;--y:${Math.round(Math.sin(angle) * dist - 40)}px;--c:${CONFETTI[i % CONFETTI.length]};--r:${(i * 47) % 360}deg;--d:${(i % 4) * 0.04}s"></i>`;
    }).join('');
    el.innerHTML = `<div class="match-stage"><div class="match-confetti" aria-hidden="true">${bits}</div><div class="match-card"><img class="match-still" src="${image}" alt="" draggable="false"></div><div class="match-name">${name}!</div><div class="match-tap" aria-hidden="true">Tap to keep racing</div></div>`;
    document.body.append(el);

    let done = false, timer;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.classList.add('leaving');
      setTimeout(() => { el.remove(); resolve(); }, reducedMotion ? 0 : 220);
    };
    el.addEventListener('pointerdown', finish);
    el.addEventListener('keydown', finish);
    el.cancel = finish; // lets the game end it early (pause, leaving the race)

    const url = clip && blobs.has(clip) ? await blobs.get(clip) : null;
    if (done) return;
    if (url && !reducedMotion) {
      const video = document.createElement('video');
      Object.assign(video, {src: url, muted: true, playsInline: true, autoplay: true, preload: 'auto'});
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.className = 'match-clip';
      video.playbackRate = 1.4;
      el.querySelector('.match-card').classList.add('has-clip');
      el.querySelector('.match-card').append(video);
      video.addEventListener('ended', () => setTimeout(finish, 150));
      video.addEventListener('error', () => { timer = setTimeout(finish, 1800); });
      video.play().then(() => { video.playbackRate = 1.4; }).catch(() => { timer = setTimeout(finish, 1800); });
      timer = setTimeout(finish, 4800); // safety cap
    } else {
      timer = setTimeout(finish, reducedMotion ? 1200 : 1900);
    }
  });
}

export function cancelCelebration() {
  document.querySelectorAll('.match-show').forEach(el => (el.cancel ? el.cancel() : el.remove()));
}
