<script setup>
import { computed } from 'vue';

const props = defineProps({
  guestName: {
    type: String,
    default: 'Calista Oktavianti'
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['open']);
</script>

<template>
  <div class="attari-cover" :class="{ 'slide-up': isOpen }">
    <!-- Background Image Hitam Putih Persis Asli -->
    <div class="cover-bg">
      <div class="cover-overlay-dark"></div>
    </div>

    <!-- Content persis susunan screenshot & markup aslinya -->
    <div class="cover-inner">
      <!-- 1. Header Date -->
      <div class="cover-top-date">
        <span>8 &amp; 10 JANUARI</span>
      </div>

      <!-- 2. The Wedding Of & Couple Names -->
      <div class="cover-middle-section">
        <p class="title-the-wedding">THE WEDDING OF</p>
        <h1 class="couple-names">Ria &amp;<br>Iskandar</h1>
      </div>

      <!-- 3. Dear Guest & Open Invitation Button -->
      <div class="cover-bottom-section">
        <p class="dear-label">DEAR</p>
        <h2 class="guest-name">{{ guestName }}</h2>
        <p class="invitation-text">
          With grateful hearts, we invite you<br>
          to be part of our wedding celebration<br>
          and share in the joy of our union.
        </p>

        <button class="btn-attari-cover" @click="emit('open')">
          OPEN INVITATION
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attari-cover {
  position: fixed;
  inset: 0;
  max-width: 480px;
  margin: 0 auto;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.85s ease;
  overflow: hidden;
  background-color: #000;
}

.attari-cover.slide-up {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Background image prewedding B&W persis ByAttari */
.cover-bg {
  position: absolute;
  inset: 0;
  background-image: url("https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00785.webp");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: grayscale(100%) contrast(108%);
  z-index: 1;
}

.cover-overlay-dark {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.45) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.85) 100%
  );
}

.cover-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 55px 24px 45px;
  color: #ffffff;
}

/* 1. Tanggal Atas */
.cover-top-date {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #ffffff;
  opacity: 0.95;
}

/* 2. Middle Names: Font 'newyork' persis screenshot */
.cover-middle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -15px;
}

.title-the-wedding {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #ffffff;
  margin-bottom: 8px;
  opacity: 0.9;
}

.couple-names {
  font-family: 'newyork', 'Cormorant Garamond', Georgia, serif;
  font-size: 64px;
  line-height: 1.05;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
}

/* 3. Bottom Section: DEAR Guest & Button */
.cover-bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dear-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 2px;
  color: #ffffff;
  margin-bottom: 4px;
  text-transform: uppercase;
  opacity: 0.85;
}

.guest-name {
  font-family: 'newyork', 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.invitation-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
  text-align: center;
}
</style>
