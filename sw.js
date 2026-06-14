/* ══════════════════════════════════════════════════════════
   RANNE CARE — Service Worker
   Estratégia: NUNCA cacheia HTML — sempre busca do servidor
   Assets estáticos (imagens, ícones) são cacheados
   ══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'ranne-assets-v1';

const ASSETS_PARA_CACHEAR = [
  '/icons/launchericon-192x192.png',
  '/icons/launchericon-512x512.png',
];

// ── INSTALL ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_PARA_CACHEAR).catch(() => {});
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar requests externos (Supabase, Google Fonts, CDNs)
  if (url.origin !== self.location.origin) return;

  // Ignorar não-GET
  if (event.request.method !== 'GET') return;

  // HTML — NUNCA cacheia, sempre vai ao servidor
  const isHTML = event.request.headers.get('accept')?.includes('text/html')
    || url.pathname.endsWith('.html')
    || url.pathname === '/';

  if (isHTML) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // JS — NUNCA cacheia, sempre vai ao servidor
  if (url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Imagens e ícones — Cache First
  if (url.pathname.startsWith('/icons/') || /\.(png|jpg|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // Resto — Network First
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
// ── PUSH NOTIFICATIONS ───────────────────────────────────
self.addEventListener('push', function(event) {
  if (!event.data) return;
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/launchericon-192x192.png',
      badge: data.badge || '/icons/launchericon-192x192.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        { action: 'abrir', title: 'Abrir diagnóstico' },
        { action: 'depois', title: 'Mais tarde' }
      ]
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'depois') return;

  const url = event.notification.data?.url || '/app';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
