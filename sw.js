const CACHE = "esp-v3";

// On install: cache only the main file
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add("index.html")).catch(() => {})
  );
  self.skipWaiting();
});

// On activate: delete ALL old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Fetch: network first, fall back to cache
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
