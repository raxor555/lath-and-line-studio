/* Lath & Line: keeps the 3D visualizer's files on the device after the one-time download.
   Registered as /sw.js?v=<version> by the visualizer (the version comes from /visualizer-assets.json and changes when
   any 3D file changes, which drops the old copy). Only the 3D folders are handled, cache-first; the shop pages and
   everything else go to the network as usual. */
const VERSION = new URL(self.location.href).searchParams.get("v") || "0";
const CACHE = "ll-3d-" + VERSION;
const SCOPES = ["/models/", "/textures/", "/lightmaps/", "/hdri/", "/draco/"];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("ll-3d-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !SCOPES.some((s) => url.pathname.startsWith(s))) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(url.pathname);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && res.status === 200) cache.put(url.pathname, res.clone()).catch(() => {});
    return res;
  })());
});
