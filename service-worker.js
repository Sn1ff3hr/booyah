// service-worker.js

const CACHE_NAME = 'inventory-order-cache-v1';
const URLS_TO_CACHE = [
  '/',
  'consumer.html',
  'owner.html',
  'consumer.css',
  'owner.css',
  'consumer.js',
  'owner.js',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
  // Add other important assets here, especially those for the offline experience
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation completed');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Found in cache', event.request.url);
          return response; // Serve from cache
        }
        console.log('Service Worker: Not found in cache, fetching from network', event.request.url);
        return fetch(event.request); // Fetch from network
      })
      .catch(error => {
        console.error('Service Worker: Fetch error', error);
        // Optionally, return a fallback page for navigation requests if offline
        // if (event.request.mode === 'navigate') {
        //   return caches.match('offline.html'); // You would need to create and cache an offline.html
        // }
      })
  );
});
