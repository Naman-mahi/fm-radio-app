self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Add caching logic here if necessary
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    // Add activation logic here if necessary
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
