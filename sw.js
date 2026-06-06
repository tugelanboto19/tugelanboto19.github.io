const CACHE_IDENTIFIER = 'pma-architect-v1';
const APPLICATION_SHELL = [
    '/',
    '/index.html',
    '/portfolio.html',
    '/profile.html',
    '/network.html',
    '/verify.html',
    '/esign.html',
    '/halftone.html',
    '/assets/css/style.css',
    '/script.js',
    '/manifest.json',
    '/assets/images/logopma.png',
    '/assets/images/logotglbt.png'
];

// 1. Fase Install: Alokasi Memori dan Pre-caching App Shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_IDENTIFIER)
            .then(cache => {
                console.log('[Service Worker] Mengunci Struktur App Shell Ke Cache');
                return cache.addAll(APPLICATION_SHELL);
            })
            .then(() => self.skipWaiting()) // Memaksa SW baru langsung aktif
    );
});

// 2. Fase Aktivasi: Purging Cache Kedaluwarsa (Mencegah Storage Bloat)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_IDENTIFIER) {
                    console.log('[Service Worker] Menghapus Cache Lama:', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // Langsung mengontrol seluruh open tabs
    );
});

// 3. Intersepsi Request & Penentuan Strategi Caching Hibrida
self.addEventListener('fetch', event => {
    const URLAkses = new URL(event.request.url);

    // STRATEGI A: Cache-First Khusus Komponen Gambar (.jpeg / .png)
    if (URLAkses.pathname.includes('/assets/images/') && 
       (URLAkses.pathname.endsWith('.jpeg') || URLAkses.pathname.endsWith('.png'))) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse; // Return dari local storage jika ada
                
                return fetch(event.request).then(networkResponse => {
                    // Validasi respons sebelum disimpan ke cache
                    if (!networkResponse || networkResponse.status !== 200) return networkResponse;
                    
                    return caches.open(CACHE_IDENTIFIER).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // STRATEGI B: Stale-While-Revalidate Untuk File Logika Struktural & Dokumen
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const networkFetch = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_IDENTIFIER).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Mekanisme Kontingensi jika koneksi internet terputus total
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });

            return cachedResponse || networkFetch;
        })
    );
});