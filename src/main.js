document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("produk-gallery");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  if (!gallery) return;

  // ---------- Daftar foto ----------
  const FOTO_FOLDER = "assets/"; // ganti sesuai folder fotomu, atau "" kalau sejajar dengan index.html

  const FOTO_RAK = [
    // rak_hotwheels_1 sampai 6 -> .webp
    ...Array.from({ length: 6 }, (_, i) => `rak_hotwheels_${i + 1}.webp`),
    // rak_hotwheels_7 sampai 13 -> .jpeg
    ...Array.from({ length: 7 }, (_, i) => `rak_hotwheels_${i + 7}.jpeg`),
  ];

  // Hapus item bawaan di HTML (kalau ada), lalu buat ulang dari daftar di atas
  gallery.querySelectorAll(".produk-item").forEach((el) => el.remove());

  FOTO_RAK.forEach((nama, i) => {
    const item = document.createElement("div");
    item.className = "produk-item produk-img rounded-2xl overflow-hidden";

    const img = document.createElement("img");
    img.src = FOTO_FOLDER + nama;
    img.alt = `Rak Hotwheels foto ${i + 1}`;
    img.className = "w-full h-full object-cover pointer-events-none drop-shadow-md";
    img.draggable = false; // supaya swipe/drag di desktop tidak bentrok dengan drag gambar bawaan browser
    img.decoding = "async";
    img.loading = "lazy";

    item.appendChild(img);
    gallery.appendChild(item);
  });

  // Urutan array = urutan tampil. items[0] selalu di tengah.
  const items = Array.from(gallery.querySelectorAll(".produk-item"));
  if (items.length === 0) return;

  // ---------- Posisi ----------
  // Posisi visual diatur lewat atribut data-pos, style-nya ada di style.css
  function getPosition(index, total) {
    if (index === 0) return "center";
    if (index === 1) return "right";
    if (index === total - 1) return "left";
    if (index === 2) return "hidden-right";
    return "hidden-left";
  }

  function updateGallery() {
    items.forEach((item, index) => {
      item.dataset.pos = getPosition(index, items.length);
    });
  }

  function rotateLeft() {
    items.unshift(items.pop()); // item terakhir jadi paling depan
    updateGallery();
  }

  function rotateRight() {
    items.push(items.shift()); // item pertama pindah ke belakang
    updateGallery();
  }

  // ---------- Auto-rotate ----------
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let autoRotate = null;
  if (items.length > 1 && !prefersReducedMotion) {
    autoRotate = setInterval(rotateRight, 3500);
  }

  // Dimatikan permanen begitu pengunjung berinteraksi
  function killAutoRotate() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  // ---------- Tombol ----------
  btnPrev?.addEventListener("click", () => {
    killAutoRotate();
    rotateLeft();
  });

  btnNext?.addEventListener("click", () => {
    killAutoRotate();
    rotateRight();
  });

  // ---------- Klik item samping ----------
  let justSwiped = false;

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (justSwiped) return; // abaikan klik yang muncul setelah swipe
      killAutoRotate();
      if (item.dataset.pos === "right") rotateRight();
      else if (item.dataset.pos === "left") rotateLeft();
    });
  });

  // ---------- Swipe (HP) ----------
  const SWIPE_THRESHOLD = 50; // px
  let startX = null;

  gallery.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    justSwiped = false;
  });

  gallery.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const deltaX = e.clientX - startX;
    startX = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    justSwiped = true;
    killAutoRotate();
    if (deltaX < 0) rotateRight(); // geser ke kiri -> foto berikutnya
    else rotateLeft(); // geser ke kanan -> foto sebelumnya
  });

  gallery.addEventListener("pointercancel", () => {
    startX = null;
  });

  // ---------- Keyboard ----------
  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      killAutoRotate();
      rotateLeft();
    } else if (e.key === "ArrowRight") {
      killAutoRotate();
      rotateRight();
    }
  });

  // Tampilan awal
  updateGallery();
});