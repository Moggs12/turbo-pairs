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
  // iPhone audio uses partial (Range) requests, which a cache cannot answer
  // reliably. The start sound simply stays quiet when offline.
  if (request.headers.has('range') || url.pathname.endsWith('.mp3')) return;

  if (request.mode === 'navigate') {
    // Fresh page when online; the saved copy when offline.
    event.respondWith(
      fetch(request).catch(() => caches.match('./', {ignoreSearch: true}).then(hit => hit || caches.match('index.html')))
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
