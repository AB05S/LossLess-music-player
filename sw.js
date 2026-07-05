const CACHE_NAME = 'music-player-shell-v1';
const SHELL_FILES = ['./lossless.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // App-shell files: serve from cache first, so the player still opens with no signal.
  // Local music files are opened via blob: URLs directly from the device and never touch this.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
