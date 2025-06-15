const CACHE_VERSION = 'v2';
const CACHE_NAME = `inventory-cache-${CACHE_VERSION}`;
const CACHE_FILES = [
  '/',
  '/index.html',
  '/owner.html',
  '/consumer.html',
  '/android.html',
  '/fallback.html',
  '/style.css',
  // '/script.js', // Removed
  '/js/main.js',
  '/js/i18n.js',
  '/js/domUtils.js',
  '/js/ui.js',
  '/js/inventoryLogic.js', // Added
  '/locales/en.json',
  '/locales/es.json',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/CNAME' // Added
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(names =>
        Promise.all(
          names
            .filter(name => name.startsWith('inventory-cache-') && name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => caches.match('/fallback.html'));
    })
  );
});
