/**
 * Service Worker for E-Learning Platform
 * Provides offline support, caching strategies, and faster reload
 * 
 * Install in main.jsx with:
 * if ('serviceWorker' in navigator) {
 *   navigator.serviceWorker.register('/service-worker.js');
 * }
 */

const CACHE_NAME = 'elearn-v1';
const RUNTIME_CACHE = 'elearn-runtime-v1';
const API_CACHE = 'elearn-api-v1';

// Assets to cache on install (shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css',
  '/src/theme.js',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        // Don't fail if some assets aren't available yet
        return cache.addAll(STATIC_ASSETS).catch(() => {});
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== API_CACHE)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.origin.includes('http://127.0.0.1:8000') || url.origin.includes('railway')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok && response.status === 200) {
            const cache = caches.open(API_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached API response
          return caches.match(request)
            .then((cached) => cached || new Response('Offline - no cached data', { status: 503 }));
        })
    );
    return;
  }

  // Image/Video requests - Cache first, fallback to network
  if (/\.(jpg|jpeg|png|gif|webp|mp4|webm)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            // Return cached but also update it
            fetch(request).then((response) => {
              if (response.ok) {
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, response.clone());
                });
              }
            }).catch(() => {}); // Silently fail update
            return cached;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              if (response.ok && response.status === 200) {
                const cache = caches.open(RUNTIME_CACHE);
                cache.then((c) => c.put(request, response.clone()));
              }
              return response;
            })
            .catch(() => {
              // Offline and no cache - return placeholder
              if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                // Return a transparent pixel PNG
                return new Response(
                  new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]),
                  { headers: { 'Content-Type': 'image/png' } }
                );
              }
              return new Response('Offline', { status: 503 });
            });
        })
    );
    return;
  }

  // HTML and JS/CSS - Network first, fallback to cache
  if (url.pathname.endsWith('.html') || /\.(js|css)$/.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cached) => cached || new Response('Offline', { status: 503 }));
        })
    );
    return;
  }

  // Default - Network first
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Sync any pending data to server
    console.log('[Service Worker] Syncing data...');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Push notifications support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New update from EduSphere',
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    tag: 'elearn-notification',
  };

  event.waitUntil(
    self.registration.showNotification('EduSphere', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('[Service Worker] Loaded');
