// Basic Service Worker for PWA
const CACHE_NAME = 'aoe2-overlay-v1';

// Install event - cache basic resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install event');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate event');
    event.waitUntil(
        clients.claim() // Take control of all open clients
    );
});

// Fetch event - basic pass-through for now
self.addEventListener('fetch', (event) => {
    // For now, just pass through all requests
    // In the future, you could add caching logic here
    event.respondWith(fetch(event.request));
});

// Push event - handle push notifications (when backend is ready)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received', event);

    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/logo.png',
            badge: '/assets/logo.png',
            vibrate: [100, 50, 100],
            data: data.data || {}
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'AOE2 Overlay', options)
        );
    }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click', event);
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});
