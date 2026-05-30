// Nama dan versi Cache (Ubah v1 menjadi v2 dll jika ada update besar di masa depan)
const CACHE_NAME = 'pma-cyber-cache-v1';

// Daftar semua file yang HARUS didownload dan dikunci di memori HP pengguna
const urlsToCache = [
    '/',
    '/index.html',
    '/esign.html',
    '/halftone.html',
    '/verify.html',
    '/assets/css/style.css',
    '/assets/images/logopma.png',
    // Mengunci pustaka eksternal agar bisa jalan tanpa internet
    'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
];

// PROSES 1: INSTALL (Mengunduh semua file saat pertama kali situs dibuka)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('PMA_SERVICE_WORKER: Mengunci aset ke memori...');
                return cache.addAll(urlsToCache);
            })
    );
});

// PROSES 2: FETCH (Mencegat koneksi internet saat aplikasi digunakan)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika file ada di memori offline, gunakan itu.
                if (response) {
                    return response;
                }
                // Jika tidak ada, baru minta ke server internet.
                return fetch(event.request);
            })
    );
});

// PROSES 3: ACTIVATE (Membersihkan cache lama jika ada update versi)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});