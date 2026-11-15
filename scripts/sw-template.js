// Offline support. The build turns this template into dist/sw.js and fills in
// RELEASE (a hash of every shipped file) and PRECACHE (the files to keep).
// Any change to the game changes RELEASE, so phones always pick up updates.
const RELEASE = '__RELEASE__';
const PRECACHE = __PRECACHE__;
const CACHE = `turbo-pairs-${RELEASE}`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE.map(url => new Request(url, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('turbo-pairs-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // iPhone <audio> uses partial (Range) requests, which a cache cannot answer
  // reliably, so the start sound simply stays quiet when offline. The
  // announcer lines are fetched whole by the game, so they can be kept.
  if (request.headers.has('range') || (url.pathname.endsWith('.mp3') && !url.pathname.includes('/voice/'))) return;

  if (request.mode === 'navigate') {
    // Fresh page when online; the saved copy when offline.
    event.respondWith(
      fetch(request).catch(() => caches.match('./', {ignoreSearch: true}).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Stylesheets and data decide how the game looks and plays, so prefer the
  // network for them and fall back to the cache offline. Art and clips are
  // content-addressed by name, so they stay cache-first.
  if (/\.(css|json)(\?|$)/.test(url.pathname + url.search)) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
        return response;
      }).catch(() => caches.match(request, {ignoreSearch: true}))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
