const CACHE_NAME = 'fm-radio-cache-v1'; // Cache version number

// Cache important resources on install
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/js/main.js',
                '/icons/android-chrome-192x192.png',
                // Add other important resources to cache here
            ]);
        })
    );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('fm-radio-cache-') && cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Serve cached resources or fetch from network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    // Redirect to HTTPS if served over HTTP
    if (request.url.startsWith('http://')) {
        event.respondWith(
            Response.redirect(request.url.replace(/^http:/, 'https:'), 301)
        );
        return;
    }

    // Serve cached resources or fetch from network
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            // Fallback to network if not cached
            return fetch(request).catch(() => {
                // Offline fallback page
                return caches.match('/offline.html');
            });
        })
    );
});
