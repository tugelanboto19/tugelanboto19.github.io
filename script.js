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