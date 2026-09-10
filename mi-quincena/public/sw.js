// Service worker de "Mi Quincena": cachea la app (HTML/CSS/JS) para que
// abra aunque no haya internet. Nunca cachea llamadas a las funciones de
// Netlify ni a Identity — esos datos siempre deben pedirse frescos.

const CACHE_NAME = "mi-quincena-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/.netlify/functions/") || url.pathname.startsWith("/.netlify/identity")) {
    return; // datos y login: siempre a la red, nunca cache
  }
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
