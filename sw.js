/* Service worker: l'app funziona senza rete.
   Pagine (scout e foglio gara): prima prova la rete (max 3 s) per prendere gli aggiornamenti, altrimenti la copia salvata.
   Font, icone, librerie del PDF: copia salvata. Cambiare VERSION a ogni rilascio. */
const VERSION = 'app-v1.4.2-2026-11-23';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-32.png',
  'fonts/Barlow-400.woff2', 'fonts/Barlow-500.woff2', 'fonts/Barlow-600.woff2', 'fonts/Barlow-700.woff2',
  'fonts/BarlowCondensed-500.woff2', 'fonts/BarlowCondensed-600.woff2', 'fonts/BarlowCondensed-700.woff2',
  'foglio/', 'foglio/lib/jspdf.umd.min.js', 'foglio/lib/svg2pdf.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      // each page under its own address: the scout (./) and the match sheet (foglio/)
      const key = new URL(url.pathname.endsWith('/') ? url.pathname : url.pathname.replace(/index\.html$/, ''), url.origin).href;
      try {
        const res = await Promise.race([fetch(req, { cache: 'no-store' }), timeout(3000)]);
        if (res && res.ok) { cache.put(key, res.clone()); return res; }
        throw new Error('bad response');
      } catch (err) {
        return (await cache.match(key)) || (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) { const c = await caches.open(VERSION); c.put(req, res.clone()); }
      return res;
    } catch (err) { return Response.error(); }
  })());
});
