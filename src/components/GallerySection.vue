<script setup>
import { ref } from 'vue';

const galleryPhotos = [
  "https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00632.webp",
  "https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00645.webp",
  "https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00867.webp",
  "https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00894.webp",
  "https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00785.webp"
];

const selectedPhoto = ref(null);
</script>

<template>
  <section id="gallery" class="attari-gallery-section">
    <div class="gallery-header">
      <span class="sub-tag">OUR MOMENTS</span>
      <h2 class="title-heading">Photo Gallery</h2>
      <p class="quote-text font-serif">“To love, to shelter, to walk as one”</p>
    </div>

    <!-- Gallery Grid Foto B&W persis ByAttari -->
    <div class="gallery-grid">
      <div 
        v-for="(photo, i) in galleryPhotos" 
        :key="i" 
        class="photo-item"
        @click="selectedPhoto = photo"
      >
        <img :src="photo" alt="Gallery Photo" loading="lazy" class="gallery-img" />
      </div>
    </div>

    <!-- Instagram Wedding Frame Filter Card -->
    <div class="ig-frame-box">
      <span class="ig-badge">CAPTURE YOUR MOMENT</span>
      <h3 class="ig-title">WEDDING FRAME</h3>
      <p class="ig-desc">
        Upload and capture your moments while attending our wedding by using the Wedding Frame below.
      </p>
      <a href="https://instagram.com" target="_blank" rel="noopener" class="btn-ig-frame">
        OPEN INSTAGRAM FRAME
      </a>
      <span class="ig-note">*Disarankan memperbarui aplikasi Instagram ke versi terbaru</span>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="selectedPhoto" class="lightbox-overlay" @click="selectedPhoto = null">
      <div class="lightbox-content" @click.stop>
        <img :src="selectedPhoto" alt="Preview" class="full-img" />
        <button class="btn-close" @click="selectedPhoto = null">Tutup</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attari-gallery-section {
  padding: 50px 20px;
  background-color: #0b0d0c;
  color: #ffffff;
}

.gallery-header {
  text-align: center;
  margin-bottom: 30px;
}

.sub-tag {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: #d8c29d;
  display: block;
  margin-bottom: 6px;
}

.title-heading {
  font-family: 'newyork', Georgia, serif;
  font-size: 40px;
  color: #ffffff;
  font-weight: 400;
}

.quote-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-top: 6px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 36px;
}

.photo-item {
  border-radius: 8px;
  overflow: hidden;
  height: 220px;
  background: #171a18;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.photo-item:first-child {
  grid-column: span 2;
  height: 280px;
}

.photo-item:hover {
  transform: scale(1.02);
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(105%);
  transition: filter 0.3s ease;
}

.photo-item:hover .gallery-img {
  filter: grayscale(80%) contrast(110%);
}

/* IG Frame */
.ig-frame-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 28px 20px;
  text-align: center;
}

.ig-badge {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: #d8c29d;
  display: block;
  margin-bottom: 4px;
}

.ig-title {
  font-family: 'newyork', Georgia, serif;
  font-size: 24px;
  color: #ffffff;
  font-weight: 400;
  margin-bottom: 10px;
}

.ig-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  max-width: 340px;
  margin: 0 auto 20px;
}

.btn-ig-frame {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
  transition: all 0.25s;
}

.btn-ig-frame:hover {
  background: #ffffff;
  color: #0b0d0c;
}

.ig-note {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.lightbox-content {
  max-width: 440px;
  width: 100%;
  text-align: center;
}

.full-img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  filter: grayscale(100%);
  margin-bottom: 14px;
}

.btn-close {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}
</style>
