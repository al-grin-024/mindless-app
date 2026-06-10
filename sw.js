/**
 * Mindless — Service Worker
 * Base-path aware: the app is hosted under a MAMP subdirectory, so all
 * cached URLs are derived from the SW's own scope rather than the origin root.
 */
const CACHE = 'mindless-v5';

// e.g. "/Antigravity/Personal/Home/"
const BASE = self.location.pathname.replace(/sw\.js$/, '');
const url = (p) => BASE + p;

const ASSETS = [
  BASE,
  url('index.html'),
  url('manifest.json'),
  url('css/design-system.css'), url('css/app.css'), url('css/animations.css'),
  url('js/app.js'), url('js/router.js'), url('js/store.js'), url('js/db.js'),
  url('js/auth.js'), url('js/firebase.js'), url('js/firebase-config.js'),
  url('js/i18n.js'), url('js/voice.js'), url('js/notifications.js'),
  url('js/data/translations-en.js'), url('js/data/categories.js'),
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  // HTML navigations → serve the app shell (SPA), network-first so dev edits show.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(url('index.html')))
    );
    return;
  }

  // Same-origin assets → network-first so code/config updates always land.
  // Cache is only a fallback for offline use (avoids stale-JS bugs, e.g. an
  // old auth.js pinning a previous Google client_id).
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? (e.data.json ? e.data.json() : { body: e.data.text() }) : {};
  e.waitUntil(self.registration.showNotification(data.title || 'Mindless', {
    body: data.body || '', icon: url('icons/icon-192x192.svg'), data: data.url || BASE
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data || BASE));
});
