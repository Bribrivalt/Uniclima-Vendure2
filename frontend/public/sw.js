/**
 * Service Worker - Uniclima Solutions PWA
 * 
 * Implementa estrategias de caché para mejor rendimiento offline
 * y experiencia de usuario mejorada.
 */

const CACHE_NAME = 'uniclima-v1';
const STATIC_CACHE = 'uniclima-static-v1';
const DYNAMIC_CACHE = 'uniclima-dynamic-v1';
const IMAGE_CACHE = 'uniclima-images-v1';

// Recursos estáticos a cachear en instalación
const STATIC_ASSETS = [
  '/',
  '/productos',
  '/carrito',
  '/contacto',
  '/offline',
  '/manifest.json',
];

// URLs que siempre deben ir a la red
const NETWORK_ONLY = [
  '/api/',
  '/shop-api/',
  '/checkout',
  '/cuenta',
  '/login',
  '/registro',
];

// ========================================
// INSTALL - Pre-cache static assets
// ========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Forzar activación inmediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Pre-cache failed:', error);
      })
  );
});

// ========================================
// ACTIVATE - Clean old caches
// ========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Eliminar cachés antiguas
              return name.startsWith('uniclima-') &&
                name !== STATIC_CACHE &&
                name !== DYNAMIC_CACHE &&
                name !== IMAGE_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Tomar control de todas las pestañas abiertas
        return self.clients.claim();
      })
  );
});

// ========================================
// FETCH - Intercept network requests
// ========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests del mismo origen y HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-only para APIs y rutas de usuario
  if (NETWORK_ONLY.some(path => url.pathname.startsWith(path))) {
    event.respondWith(networkOnly(request));
    return;
  }

  // Imágenes: Cache-first con fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstWithFallback(request, IMAGE_CACHE));
    return;
  }

  // Navegación (páginas HTML): Network-first con fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Assets estáticos (JS, CSS, fonts): Cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Default: Network-first con cache
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ========================================
// ESTRATEGIAS DE CACHÉ
// ========================================

/**
 * Network-only: Siempre ir a la red
 */
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[SW] Network-only failed:', error);
    throw error;
  }
}

/**
 * Cache-first: Buscar en caché, si no está, ir a la red
 */
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first network failed:', error);
    throw error;
  }
}

/**
 * Cache-first con fallback para imágenes
 */
async function cacheFirstWithFallback(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Retornar placeholder SVG para imágenes fallidas
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect fill="#f5f5f5" width="200" height="200"/>
        <text fill="#9e9e9e" font-family="sans-serif" font-size="14" x="50%" y="50%" 
              dominant-baseline="middle" text-anchor="middle">
          Imagen no disponible
        </text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}

/**
 * Network-first: Intentar red primero, fallback a caché
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Network-first con fallback a página offline
 */
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Mostrar página offline
    const offlinePage = await caches.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }

    // Fallback HTML básico
    return new Response(
      `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sin conexión - Uniclima</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            background: #f5f5f5;
          }
          h1 { color: #E53935; margin-bottom: 10px; }
          p { color: #616161; margin-bottom: 20px; }
          button {
            background: #E53935;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover { background: #C62828; }
        </style>
      </head>
      <body>
        <h1>Sin conexión</h1>
        <p>Parece que no tienes conexión a internet.<br>Verifica tu conexión e intenta de nuevo.</p>
        <button onclick="location.reload()">Reintentar</button>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }
}

// ========================================
// PUSH NOTIFICATIONS (preparado)
// ========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || 'Nueva notificación de Uniclima',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'close', title: 'Cerrar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Uniclima', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// ========================================
// BACKGROUND SYNC (preparado)
// ========================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  // Implementar sincronización del carrito cuando vuelva la conexión
  console.log('[SW] Syncing cart...');
}

console.log('[SW] Service Worker loaded');