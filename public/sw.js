// Cú Đầu Tư — Service Worker
// Cache-first strategy for static assets, network-first for HTML

const CACHE_NAME = "cu-dau-tu-v2";
// NOTE: Next.js `trailingSlash: true` means actual URLs end with "/".
// Cache both forms so offline works regardless of how user typed the URL.
const STATIC_CACHE = [
  "/",
  "/learn/",
  "/leaderboard/",
  "/profile/",
  "/shop/",
  "/stats/",
  "/tools/",
  "/tutor/",
  "/review/",
  "/auth/sign-in/",
  "/auth/sign-up/",
  "/onboarding/",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/og-image.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!request.url.startsWith(self.location.origin)) return;

  // HTML pages: network-first, fallback to cache
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(async () => {
          // Try exact match, then trailing-slash variant, then root.
          const url = new URL(request.url);
          const path = url.pathname;
          const candidates = [request, path, path.endsWith("/") ? path : path + "/", path.endsWith("/") ? path.slice(0, -1) : path, "/learn/", "/"];
          for (const c of candidates) {
            if (typeof c === "string") {
              const match = await caches.match(c);
              if (match) return match;
            } else {
              const match = await caches.match(c);
              if (match) return match;
            }
          }
          return caches.match("/");
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok && (res.type === "basic" || res.type === "default")) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
