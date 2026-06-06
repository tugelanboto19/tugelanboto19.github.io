console.log("JS CONNECTED");
document.querySelectorAll(".design img").forEach(img => {
  const originalSrc = img.getAttribute("src");
  const hoverSrc = img.getAttribute("data-hover");

  const preload = new Image();
  preload.src = hoverSrc;

  img.addEventListener("mouseenter", () => {
    img.classList.add("fade-out");

    setTimeout(() => {
      img.src = hoverSrc;
      img.classList.remove("fade-out");
      img.classList.add("fade-in");
    }, 200);
  });

  img.addEventListener("mouseleave", () => {
    img.classList.add("fade-out");

    setTimeout(() => {
      img.src = originalSrc;
      img.classList.remove("fade-out");
      img.classList.add("fade-in");
    }, 200);
  });
});

let idleTimer;

function startIdleEffect() {
  document.querySelectorAll(".design img").forEach(img => {
    img.classList.add("idle");
  });
}

function stopIdleEffect() {
  document.querySelectorAll(".design img").forEach(img => {
    img.classList.remove("idle");
  });
}

document.addEventListener("mousemove", () => {
  stopIdleEffect();
  clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    startIdleEffect();
  }, 3000);
});

startIdleEffect();
document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('gallery-grid');
    
    // ATURAN NOMOR:
    // Mulai dari 100 (batas atas untuk masa depan)
    // Sampai 19 (file terlama Anda saat ini)
    const maxNum = 100;
    const minNum = 19;

    for (let i = maxNum; i >= minNum; i--) {
        // Format nomor menjadi 3 digit (contoh: 23 menjadi "023")
        const numberString = i.toString().padStart(3, '0');
        
        // Buat elemen card
        const card = document.createElement('div');
        card.className = 'design-card';
        
        // Tentukan nama file sesuai format Anda
        // Format: 023 Medium.jpeg dan 023a Medium.jpeg
        const mockupSrc = `assets/images/${numberString} Medium.jpeg`;
        const artworkSrc = `assets/images/${numberString}a Medium.jpeg`;

        // Masukkan HTML ke dalam card
        // Kita tambahkan onerror="this.parentElement.style.display='none'"
        // Artinya: Jika gambar Mockup TIDAK DITEMUKAN (belum diupload), sembunyikan satu kotak design-card ini.
        card.innerHTML = `
            <img src="${mockupSrc}" class="mockup" onerror="this.closest('.design-card').style.display='none'">
            <img src="${artworkSrc}" class="artwork" onerror="this.style.display='none'">
        `;

        // Masukkan card ke dalam grid
        gridContainer.appendChild(card);
    }
});
// --- FITUR PROTEKSI GAMBAR ---

// 1. Mencegah Klik Kanan (Context Menu)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// 2. Mencegah Drag and Drop (Agar gambar tidak bisa ditarik ke desktop)
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
// --- FITUR KURSOR BERDARAH (MODE PEMBANTAIAN) ---

document.addEventListener('mousemove', function(e) {
    // Kita panggil fungsi createBlood beberapa kali untuk efek 'muncrat'
    // Angka 3 berarti sekali geser keluar 3 tetes. Bisa ganti jadi 5 kalau mau lebih parah.
    for (let i = 0; i < 3; i++) {
        createBlood(e.pageX, e.pageY);
    }
});

function createBlood(x, y) {
    const blood = document.createElement('div');
    blood.classList.add('blood-drop');
    
    // Memberi sedikit "sebaran" (random offset) biar tidak menumpuk di satu titik
    // Darah akan muncul acak di sekitar kursor (jarak -10px sampai +10px)
    const spread = 15; 
    const randomX = (Math.random() * spread) - (spread / 2);
    const randomY = (Math.random() * spread) - (spread / 2);

    blood.style.left = (x + randomX) + 'px';
    blood.style.top = (y + randomY) + 'px';
    
    // Variasi ukuran: ada yang kecil (2px) ada yang besar (12px)
    const size = Math.random() * 10 + 2; 
    blood.style.width = size + 'px';
    blood.style.height = size + 'px';
    
    // Warna: Variasi merah (biar ada yang merah segar & merah hati)
    // Logika: Kadang merah terang, kadang merah gelap
    blood.style.backgroundColor = Math.random() < 0.5 ? '#8a0303' : '#ff0000';

    document.body.appendChild(blood);

    // Hapus elemen lebih cepat (0.8 detik) biar tidak bikin komputer lag karena kebanyakan elemen
    setTimeout(() => {
        blood.remove();
    }, 800);
}
// --- WARNING GATE LOGIC ---
window.addEventListener('load', function() {
    // Tunggu 3.5 detik agar efek loading selesai terasa
    setTimeout(() => {
        openGate();
    }, 3500);
});

// Fungsi membuka gerbang
function openGate() {
    const gate = document.getElementById('warning-gate');
    if (gate) {
        // Tambahkan class agar CSS menggeser div ke atas
        gate.classList.add('gate-open');
        
        // Opsional: Hapus elemen dari HTML setelah animasi selesai (biar ringan)
        setTimeout(() => {
            gate.style.display = 'none';
        }, 1000); 
    }
}

// Fitur Tambahan: Klik layar untuk skip loading (jika user tidak sabar)
document.getElementById('warning-gate').addEventListener('click', function() {
    openGate();
});
// --- FORENSIC ZOOM LOGIC ---

// Ambil elemen modal
const modal = document.getElementById("forensic-modal");
const modalImg = document.getElementById("evidence-img");
const captionText = document.getElementById("caption");
const span = document.getElementsByClassName("close-modal")[0];

// Fungsi untuk mendeteksi klik pada gambar karya
// Kita gunakan Event Delegation agar gambar yang digenerate otomatis (023-100) juga bisa diklik
document.querySelector('.grid').addEventListener('click', function(e) {
    // Cek apakah yang diklik adalah gambar (img)
    if (e.target.tagName === 'IMG') {
        modal.style.display = "block";
        
        // Ambil sumber gambar yang diklik
        // Trik: Jika yang diklik Mockup, kita bisa cari Artwork aslinya (opsional)
        // Untuk sekarang, kita tampilkan saja apa yang diklik
        modalImg.src = e.target.src;
        
        // Ambil nama file sebagai caption (biar terlihat teknis)
        // Contoh: assets/images/023 Medium.jpeg -> EVIDENCE FILE: 023 Medium.jpeg
        const filename = e.target.src.split('/').pop();
        captionText.innerHTML = "EVIDENCE FILE: <span style='color:red'>" + filename + "</span>";
    }
});

// Fungsi tombol Close (X)
span.onclick = function() { 
  modal.style.display = "none";
}

// Fitur tambahan: Klik di area gelap mana saja untuk menutup (biar gampang)
modal.onclick = function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
}

// --- PROTEKSI (ANTI MALING) ---

// 1. Mencegah Klik Kanan pada Gambar (Agar tidak bisa Save As)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault(); // Matikan menu klik kanan
    }
});

// 2. Mencegah Drag and Drop (Agar gambar tidak bisa ditarik ke desktop)
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

/**
 * PWA Architecture & High-Performance Asset Management
 * Core Engine: Intersection Observer untuk Efisiensi Rendering
 */

// 1. Registrasi Service Worker secara Non-blocking
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker terestorasi pada scope:', registration.scope);
            })
            .catch(error => {
                console.error('Kegagalan registrasi Service Worker:', error);
            });
    });
}

// 2. Mesin Utama Asynchronous Lazy Loading
document.addEventListener("DOMContentLoaded", () => {
    const komponenGambar = document.querySelectorAll("img.lazy-target");

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Periksa apakah elemen sudah masuk ke dalam batas viewport
                if (entry.isIntersecting) {
                    const gambar = entry.target;
                    
                    // Substitusi placeholder base64 dengan path aset riil
                    if (gambar.dataset.src) {
                        gambar.src = gambar.dataset.src;
                        gambar.classList.remove("lazy-target");
                        gambar.classList.add("fade-in-complete");
                    }
                    
                    // Lepaskan observasi pada elemen ini untuk menghemat alokasi memori
                    observer.unobserve(gambar);
                }
            });
        }, {
            root: null, // Menggunakan viewport perangkat default
            rootMargin: "0px 0px 300px 0px", // Pre-load aset 300px sebelum muncul di layar (menjaga UX)
            threshold: 0.01 // Terpancing saat 1% dimensi objek memotong viewport
        });

        komponenGambar.forEach(img => imageObserver.observe(img));
    } else {
        // Mekanisme Fallback aman jika browser lama tidak mendukung Intersection Observer
        let jodaScroll = false;
        const fallbackLazyLoad = () => {
            if (jodaScroll === false) {
                jodaScroll = true;
                setTimeout(() => {
                    komponenGambar.forEach(gambar => {
                        if ((gambar.getBoundingClientRect().top <= window.innerHeight && gambar.getBoundingClientRect().bottom >= 0) && getComputedStyle(gambar).display !== "none") {
                            gambar.src = gambar.dataset.src;
                            gambar.classList.remove("lazy-target");
                        }
                    });
                    jodaScroll = false;
                    // Hapus event listener jika semua gambar sudah terevaluasi
                    if (document.querySelectorAll("img.lazy-target").length === 0) {
                        document.removeEventListener("scroll", fallbackLazyLoad);
                    }
                }, 200);
            }
        };
        document.addEventListener("scroll", fallbackLazyLoad);
    }
});