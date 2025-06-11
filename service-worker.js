self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('inventory-cache-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/owner.html',
      '/consumer.html',
      '/android.html',
      '/style.css',
      '/script.js',
      '/manifest.json'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
