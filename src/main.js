document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("produk-gallery");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  if (!gallery) return;

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