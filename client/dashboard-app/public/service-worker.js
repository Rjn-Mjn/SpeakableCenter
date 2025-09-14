// // public/service-worker.js
// const BASE_PATH = "/dashboard/"; // <-- **PHẢI** thay thành đường dẫn deploy của bạn
// const CACHE_NAME = "speakable-cache-v1";
// const PRECACHE_URLS = [
//   BASE_PATH, // /dashboard/  (index.html)
//   BASE_PATH + "index.html", // đảm bảo index được cache
//   // Bạn có thể thêm các file tĩnh cố định ở đây nếu biết tên
// ];
// const OFFLINE_URL = "/offline.html";

// // Install: cache index.html (app shell)
// self.addEventListener("install", (event) => {
//   self.skipWaiting(); // activate ngay khi cài đặt
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       // cache.addAll(PRECACHE_URLS)
//       return cache.addAll([OFFLINE_URL]);
//     })
//   );
// });

// // Activate: dọn cache cũ
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches
//       .keys()
//       .then((keys) =>
//         Promise.all(
//           keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
//         )
//       )
//       .then(() => self.clients.claim())
//   );
// });

// // Fetch:
// // - Nếu request là navigation (user mở /dashboard/... hoặc gõ URL) => network-first, fallback cache index.html
// // - Với asset requests (js/css/images) => try network then cache fallback
// self.addEventListener("fetch", (event) => {
//   const req = event.request;
//   const url = new URL(req.url);

//   // Only handle requests inside BASE_PATH scope (SW scope ensures điều này),
//   // but we add an extra safety check:
//   if (!url.pathname.startsWith(BASE_PATH)) {
//     return; // ignore everything outside /dashboard/
//   }

//   // Navigation requests (user navigates /dashboard/...):
//   // if (req.mode === "navigate") {
//   //   event.respondWith(
//   //     fetch(req)
//   //       .then((res) => {
//   //         // nếu mạng ok, clone và cache index.html (optional)
//   //         const copy = res.clone();
//   //         caches.open(CACHE_NAME).then((cache) => {
//   //           // cache index for future offline (optional)
//   //           cache.put(BASE_PATH + "index.html", copy).catch(() => {});
//   //         });
//   //         return res;
//   //       })
//   //       .catch(() =>
//   //         caches.match(BASE_PATH + "index.html", { ignoreSearch: true })
//   //       )
//   //   );
//   //   return;
//   // }

//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       fetch(event.request).catch(() =>
//         caches.open(CACHE_NAME).then((cache) => cache.match(OFFLINE_URL))
//       )
//     );
//   }

//   // For other requests (assets): network-first then cache fallback
//   event.respondWith(
//     fetch(req)
//       .then((res) => {
//         // optional: cache runtime assets
//         const resClone = res.clone();
//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(req, resClone).catch(() => {});
//         });
//         return res;
//       })
//       .catch(() =>
//         caches
//           .match(req)
//           .then((cached) => cached || caches.match(BASE_PATH + "index.html"))
//       )
//   );
// });

// public/service-worker.js (robust)

// public/service-worker.js
const CACHE_NAME = "dashboard-cache-v1";

// build absolute URLs relative to where this SW file is served
const OFFLINE_URL = new URL("offline.html", self.location).href;
const INDEX_URL = new URL("index.html", self.location).href;

self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate ngay khi install xong
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([OFFLINE_URL, INDEX_URL]).catch((err) => {
        console.warn("Precache failed:", err);
      })
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // xóa cache cũ nếu có
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await self.clients.claim(); // <-- quan trọng: claim clients ngay khi activate
    })()
  );
});

// helper: trả offline page từ cache
async function getOfflinePage() {
  const c = await caches.open(CACHE_NAME);
  const match = await c.match(OFFLINE_URL);
  return (
    match || new Response("Offline", { status: 503, statusText: "Offline" })
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // chỉ intercept navigation (những lần reload / gõ url)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (err) {
          return getOfflinePage();
        }
      })()
    );
    return;
  }

  // assets: network-first, fallback cache, fallback offline page
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        return cached || getOfflinePage();
      }
    })()
  );
});

self.addEventListener("message", (evt) => {
  if (evt.data && evt.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
