<template>
  <transition name="promo-fade">
    <div 
      class="promo-modal-backdrop" 
      @click.self="handleBackdropClick"
      @keydown.esc="handleClose"
      tabindex="-1"
      ref="backdropRef"
    >
      <div class="promo-modal-wrapper">
        <!-- Top Close Bar Button ("✕ Tutup") -->
        <div class="top-close-bar">
          <button 
            type="button" 
            class="btn-top-close" 
            @click="handleClose" 
            title="Tutup Promo"
          >
            <span class="close-icon">✕</span>
            <span>Tutup</span>
          </button>
        </div>

        <!-- MAIN PROMO CARD (REPLICA OF FLYER WITH FLUID RESPONSIVENESS) -->
        <div class="promo-card">
          <!-- Decorative SVG Wave & Splash Background Accents -->
          <div class="splash-accent top-left" aria-hidden="true">
            <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0C40 10 70 30 65 60C60 90 20 85 0 100V0Z" fill="url(#splashGradTL)" opacity="0.35"/>
              <circle cx="85" cy="25" r="8" fill="#38bdf8" opacity="0.45"/>
              <circle cx="102" cy="42" r="5" fill="#0284c7" opacity="0.3"/>
              <defs>
                <linearGradient id="splashGradTL" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#38bdf8"/>
                  <stop offset="1" stop-color="#0284c7" stop-opacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div class="splash-accent bottom-right" aria-hidden="true">
            <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M140 120C90 115 60 90 65 50C70 15 110 25 140 0V120Z" fill="url(#splashGradBR)" opacity="0.3"/>
              <circle cx="45" cy="85" r="9" fill="#38bdf8" opacity="0.4"/>
              <circle cx="25" cy="65" r="5" fill="#0284c7" opacity="0.3"/>
              <defs>
                <linearGradient id="splashGradBR" x1="140" y1="120" x2="40" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0ea5e9"/>
                  <stop offset="1" stop-color="#38bdf8" stop-opacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- 1. Header: Logo & Tagline -->
          <div class="promo-header">
            <div class="brand-logo-unit">
              <!-- mine.skills SVG Logo Symbol -->
              <div class="logo-symbol">
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                  <path d="M8 28V15C8 11.5 11 8.5 14.5 8.5C18 8.5 20 11.5 20 15V28" stroke="#0d4d5d" stroke-width="3.5" stroke-linecap="round"/>
                  <path d="M20 28V15C20 11.5 23 8.5 26.5 8.5C30 8.5 32 11.5 32 15V28" stroke="#0d9488" stroke-width="3.5" stroke-linecap="round"/>
                  <circle cx="20" cy="5" r="2.5" fill="#f59e0b"/>
                </svg>
              </div>
              <div class="brand-text-col">
                <span class="brand-name">mine.skills</span>
                <span class="brand-tagline">latih, kembang,<br/>raih potensi terbaik</span>
              </div>
            </div>
          </div>

          <!-- 2. Headline: PROMO SPESIAL! -->
          <div class="promo-title-wrap">
            <span class="sparkle-icon left">✨</span>
            <h2 class="promo-main-title">{{ store.promoBanner?.headline || 'PROMO SPESIAL!' }}</h2>
            <span class="sparkle-icon right">✨</span>
          </div>

          <!-- 3. Target Class Badge -->
          <div class="target-badge-wrap">
            <span class="target-badge">{{ store.promoBanner?.classTarget || 'KELAS GROUP (4-5 Anak)' }}</span>
          </div>

          <!-- 4. Price Section -->
          <div class="price-section">
            <!-- Strikethrough Original Price -->
            <div class="original-price-wrap">
              <span class="original-price">{{ store.promoBanner?.originalPrice || 'Rp 400.000' }}</span>
              <span class="slash-strike" aria-hidden="true"></span>
            </div>

            <!-- Big Main Price Pill -->
            <div class="main-price-pill">
              <span class="price-val">{{ store.promoBanner?.discountedPrice || 'Rp 350.000' }}</span>
            </div>

            <!-- Bright Orange Banner: HANYA Rp 350.000! -->
            <div class="highlight-banner-pill">
              <span>HANYA {{ store.promoBanner?.discountedPrice || 'Rp 350.000' }}!</span>
            </div>

            <!-- Quota Badge -->
            <div class="quota-pill">
              <span>{{ store.promoBanner?.quotaText || 'Khusus untuk 50 Peserta Pertama!' }}</span>
            </div>
          </div>

          <!-- 5. Split Section: Include List (Left) + Swimmer Photo (Right) -->
          <div class="promo-content-grid">
            <!-- Left Column: Includes -->
            <div class="features-col">
              <h4 class="features-heading">Group & Include:</h4>
              <ul class="features-list">
                <li>
                  <span class="bullet-dot">•</span>
                  <span>90 menit / sesi</span>
                </li>
                <li>
                  <span class="bullet-dot">•</span>
                  <span>4x pertemuan</span>
                </li>
                <li>
                  <span class="bullet-dot">•</span>
                  <span>Sertifikat & reward setiap pencapaian</span>
                </li>
                <li>
                  <span class="bullet-dot">•</span>
                  <span>Belajar Seru & Terstruktur!</span>
                </li>
              </ul>
            </div>

            <!-- Right Column: Swimmer Photo in Circular Wave Frame -->
            <div class="photo-col">
              <div class="circular-photo-frame">
                <!-- Water Splash Decorative Ring -->
                <div class="water-ring"></div>
                <img 
                  :src="store.promoBanner?.childImageUrl || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=400'" 
                  alt="Anak Senang Belajar Renang" 
                  class="swimmer-img"
                  loading="eager"
                />
                <!-- Splash Droplet Icons -->
                <div class="splash-drop drop-1" aria-hidden="true">💧</div>
                <div class="splash-drop drop-2" aria-hidden="true">💦</div>
              </div>
            </div>
          </div>

          <!-- 6. Big Action CTA Button -->
          <div class="promo-action-wrap">
            <button 
              type="button" 
              class="btn-daftar-sekarang" 
              @click="handleActionClick"
              title="Daftar Sekarang via WhatsApp"
            >
              <span>DAFTAR SEKARANG!</span>
            </button>
          </div>

          <!-- 7. Footer Contact -->
          <div class="promo-footer-contact">
            <span>Hubungi Kami: </span>
            <a 
              :href="'https://wa.me/' + cleanPhone" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="contact-link"
            >
              {{ store.brand?.callCenter || '085286274726' }}
            </a>
          </div>
        </div>

        <!-- Bottom Plain Text Close ("Tutup") -->
        <div class="bottom-close-bar">
          <button 
            type="button" 
            class="btn-bottom-close" 
            @click="handleClose"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['close', 'open-register']);
const backdropRef = ref(null);

const cleanPhone = computed(() => {
  return actions.cleanWaNumber(store.brand?.callCenter || '085286274726');
});

function handleClose() {
  emit('close');
}

function handleBackdropClick() {
  emit('close');
}

function handleActionClick() {
  const phone = cleanPhone.value;
  const msg = store.promoBanner?.whatsappMessage || 
    `Halo Admin ${store.brand?.name || 'mine.skills'}, saya melihat Promo Spesial Kelas Group (Rp 350.000) di website dan ingin mendaftar untuk anak saya. Mohon info ketersediaan slotnya ya!`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  
  // Also optionally emit open register if user closes WA or comes back
  emit('close');
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    handleClose();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  if (backdropRef.value) {
    backdropRef.value.focus();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
/* Backdrop */
.promo-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
  outline: none;
}

/* Modal Wrapper Container */
.promo-modal-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popScale 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popScale {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(18px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Top Close Button */
.top-close-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.btn-top-close {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-top-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.close-icon {
  font-size: 14px;
  font-weight: 700;
}

/* Main Card */
.promo-card {
  position: relative;
  width: 100%;
  background: #ffffff;
  border-radius: 26px;
  padding: 22px 22px 18px;
  box-shadow: 
    0 24px 60px -10px rgba(13, 77, 93, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 0 0 2px rgba(186, 230, 253, 0.5);
  overflow: hidden;
  text-align: center;
}

/* Decorative Water Splashes */
.splash-accent {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.splash-accent.top-left {
  top: -8px;
  left: -8px;
  width: 110px;
  height: 90px;
}

.splash-accent.bottom-right {
  bottom: -6px;
  right: -6px;
  width: 120px;
  height: 100px;
}

/* 1. Header Logo Unit */
.promo-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.brand-logo-unit {
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
}

.logo-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text-col {
  display: flex;
  flex-direction: column;
  border-left: 1.5px solid #cbd5e1;
  padding-left: 9px;
}

.brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #0d4d5d;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.brand-tagline {
  font-size: 9.5px;
  color: #0f766e;
  font-style: italic;
  line-height: 1.25;
  margin-top: 1px;
}

/* 2. Headline */
.promo-title-wrap {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.promo-main-title {
  margin: 0;
  font-size: 23px;
  font-weight: 900;
  color: #09343f;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.sparkle-icon {
  font-size: 16px;
  color: #0d9488;
}

/* 3. Target Class Badge */
.target-badge-wrap {
  position: relative;
  z-index: 2;
  margin-bottom: 12px;
}

.target-badge {
  display: inline-block;
  background: #0d4d5d;
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 800;
  padding: 6px 18px;
  border-radius: 999px;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.25);
}

/* 4. Price Section */
.price-section {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
}

.original-price-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 3px;
}

.original-price {
  font-size: 19px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: -0.01em;
}

.slash-strike {
  position: absolute;
  top: 50%;
  left: -8%;
  width: 116%;
  height: 3px;
  background: #ef4444;
  transform: rotate(-10deg);
  border-radius: 2px;
}

.main-price-pill {
  background: #09404f;
  color: #ffffff;
  padding: 5px 24px;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(9, 64, 79, 0.3);
  margin-bottom: 5px;
}

.price-val {
  font-size: 29px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.highlight-banner-pill {
  background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  padding: 4px 18px;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.28);
  margin-bottom: 6px;
}

.quota-pill {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  color: #0f766e;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
}

/* 5. Split Section (Features & Circular Photo) */
.promo-content-grid {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  margin-bottom: 16px;
  padding: 0 4px;
}

.features-col {
  flex: 1;
}

.features-heading {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11.5px;
  color: #334155;
  line-height: 1.35;
  font-weight: 600;
}

.bullet-dot {
  color: #0d9488;
  font-size: 14px;
  line-height: 1.2;
}

.photo-col {
  flex-shrink: 0;
}

.circular-photo-frame {
  position: relative;
  width: 115px;
  height: 115px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  box-shadow: 0 10px 22px -4px rgba(2, 132, 199, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.swimmer-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  display: block;
}

.splash-drop {
  position: absolute;
  font-size: 14px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.drop-1 {
  top: -8px;
  left: 6px;
  transform: rotate(-15deg);
}

.drop-2 {
  bottom: -4px;
  right: -2px;
  transform: rotate(20deg);
}

/* 6. CTA Button */
.promo-action-wrap {
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}

.btn-daftar-sekarang {
  width: 100%;
  padding: 13px 20px;
  background: linear-gradient(135deg, #0d4d5d 0%, #09343f 100%);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 20px -3px rgba(13, 77, 93, 0.45);
  transition: all 0.22s ease;
}

.btn-daftar-sekarang:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px -4px rgba(13, 77, 93, 0.55);
  background: linear-gradient(135deg, #115e70 0%, #0d4352 100%);
}

.btn-daftar-sekarang:active {
  transform: translateY(0);
}

/* 7. Footer Contact */
.promo-footer-contact {
  position: relative;
  z-index: 2;
  font-size: 12.5px;
  color: #475569;
}

.contact-link {
  font-weight: 800;
  color: #0d4d5d;
  text-decoration: none;
  transition: color 0.15s ease;
}

.contact-link:hover {
  color: #0f766e;
  text-decoration: underline;
}

/* Bottom Text Close */
.bottom-close-bar {
  margin-top: 12px;
}

.btn-bottom-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.btn-bottom-close:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

/* Transition */
.promo-fade-enter-active,
.promo-fade-leave-active {
  transition: opacity 0.25s ease;
}

.promo-fade-enter-from,
.promo-fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments for smaller mobile screens */
@media (max-width: 440px) {
  .promo-modal-backdrop {
    padding: 12px;
  }
  .promo-card {
    padding: 18px 16px 14px;
    border-radius: 22px;
  }
  .promo-main-title {
    font-size: 20px;
  }
  .target-badge {
    font-size: 13px;
    padding: 5px 14px;
  }
  .price-val {
    font-size: 25px;
  }
  .circular-photo-frame {
    width: 95px;
    height: 95px;
  }
  .features-list li {
    font-size: 11px;
  }
  .btn-daftar-sekarang {
    font-size: 14.5px;
    padding: 12px 16px;
  }
}

@media (max-width: 360px) {
  .promo-content-grid {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .features-list {
    align-items: center;
  }
}
</style>
