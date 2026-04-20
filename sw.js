const CACHE = "esp-v4";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add("index.html")).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if(res.ok){ const c=res.clone(); caches.open(CACHE).then(ca=>ca.put(e.request,c)); }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
