const CACHE = 'dib-v9';
const ASSETS = [
  '/Deutch-im-Bern/',
  '/Deutch-im-Bern/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // take control of all open tabs immediately
});

self.addEventListener('fetch', e => {
  // Network-first strategy — always fetch fresh, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request)
        .then(cached => cached || caches.match('/Deutch-im-Bern/'))
      )
  );
});
