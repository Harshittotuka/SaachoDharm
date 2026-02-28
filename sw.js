/* =========================================
   Service Worker — SaachoDharm PWA
   Caches calendar assets for offline use
   ========================================= */

const CACHE_NAME = 'saachodharm-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/calendar.html',
    '/css/styles.css',
    '/css/calendar.css',
    '/js/jain-calendar.js',
    '/js/script.js',
    '/js/theme-switcher.js',
    '/data/calendar_data.json',
    '/img/logo-navbar.png',
    '/img/icon.jpeg',
    '/manifest.json'
];

// Install — pre-cache key assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — network-first, fallback to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone and cache successful responses
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
