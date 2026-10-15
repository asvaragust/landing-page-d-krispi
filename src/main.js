document.addEventListener("DOMContentLoaded", () => {
  // Ambil semua elemen produk secara dinamis
  const items = Array.from(document.querySelectorAll(".produk-item"));
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  
  // Konfigurasi style untuk tiap posisi visual
  const states = {
    hiddenLeft: { left: "10%", top: "65%", scale: "scale-50", opacity: "opacity-0", zIndex: "z-0" },
    left:       { left: "20%", top: "60%", scale: "scale-75", opacity: "opacity-60", zIndex: "z-10" },
    center:     { left: "50%", top: "50%", scale: "scale-100", opacity: "opacity-100", zIndex: "z-30" },
    right:      { left: "70%", top: "60%", scale: "scale-75", opacity: "opacity-60", zIndex: "z-10" },
    hiddenRight:{ left: "90%", top: "65%", scale: "scale-50", opacity: "opacity-0", zIndex: "z-0" }
  };

  // Set durasi interval auto-rotate (dalam milidetik)
  let autoRotateInterval = 3500;
  let autoRotate = setInterval(rotateRight, autoRotateInterval);

  // Fungsi mematikan auto-rotate secara permanen saat interaksi manual terjadi
  function killAutoRotate() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null; // Menandakan auto-rotate sudah mati total
    }
  }

  function updateGallery() {
    items.forEach((item, index) => {
      let state;
      
      // Menentukan posisi berdasarkan indeks array saat ini (Infinity Loop Logic)
      if (index === 0) state = states.center;       // Elemen pertama selalu di tengah
      else if (index === 1) state = states.right;    // Elemen kedua di kanan
      else if (index === items.length - 1) state = states.left; // Elemen terakhir di kiri
      else if (index === 2) state = states.hiddenRight; // Sisa elemen disembunyikan di kanan
      else state = states.hiddenLeft;               // Sisa elemen lainnya disembunyikan di kiri

      // Terapkan posisi koordinat & centering menggunakan translate standar
      item.style.left = state.left;
      item.style.top = state.top;
      item.style.transform = "translate(-50%, -50%)";

      // Bersihkan class Tailwind bawaan sebelumnya
      item.className = item.className.replace(/scale-\d+|opacity-\d+|z-\d+/g, '').trim();
      
      // Suntik class visual baru sesuai posisinya
      item.classList.add(state.scale, state.opacity, state.zIndex);
    });
  }

  function rotateLeft() {
    // Geser item: ambil item terakhir, taruh di paling depan (putar ke kiri)
    const lastItem = items.pop();
    items.unshift(lastItem);
    updateGallery();
  }

  function rotateRight() {
    // Geser item: ambil item pertama, taruh di paling belakang (putar ke kanan)
    const firstItem = items.shift();
    items.push(firstItem);
    updateGallery();
  }

  // --- EVENT LISTENERS ---

  // Tombol Navigasi Klik (Mematikan Auto Rotate)
  btnPrev.addEventListener("click", () => {
    killAutoRotate();
    rotateLeft();
  });

  btnNext.addEventListener("click", () => {
    killAutoRotate();
    rotateRight();
  });

  // Klik langsung pada item samping untuk memfokuskannya (Mematikan Auto Rotate)
  items.forEach((item) => {
    item.addEventListener("click", () => {
      killAutoRotate();
      const currentIndex = items.indexOf(item);
      
      if (currentIndex === 1) {
        rotateRight(); // Jika klik item kanan, geser ke tengah
      } else if (currentIndex === items.length - 1) {
        rotateLeft();  // Jika klik item kiri, geser ke tengah
      }
    });
  });

  // Inisialisasi tampilan pertama kali saat halaman dimuat
  updateGallery();
});
