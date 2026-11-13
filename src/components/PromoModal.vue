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
            title="Tutup Poster Promo"
          >
            <span class="close-icon">✕</span>
            <span>Tutup</span>
          </button>
        </div>

        <!-- MAIN POSTER IMAGE CARD (PURE IMAGE-BASED POPUP) -->
        <div class="promo-poster-frame" @click="handleActionClick" title="Klik untuk mendaftar via WhatsApp">
          <img 
            :src="posterSrc" 
            :alt="store.promoBanner?.title || 'Promo Spesial mine.skills'" 
            class="promo-poster-img"
            loading="eager"
          />

          <!-- Floating Hover Indicator to chat WhatsApp -->
          <div class="poster-hover-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path>
            </svg>
            <span>Klik Poster untuk Hubungi Admin via WhatsApp</span>
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

const posterSrc = computed(() => {
  if (!store.promoBanner?.imageUrl || store.promoBanner?.imageUrl.includes('photo-1530549387789')) {
    return '/images/promo/promo-spesial-group.png';
  }
  return store.promoBanner.imageUrl;
});

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
    `Halo Admin ${store.brand?.name || 'mine.skills'}, saya melihat poster Promo Spesial Kelas Group (Rp 350.000) di website dan ingin mendaftar untuk anak saya. Mohon info ketersediaan slotnya ya!`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
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
  max-width: 440px;
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
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-top-close:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.close-icon {
  font-size: 14px;
  font-weight: 700;
}

/* Main Poster Image Frame */
.promo-poster-frame {
  position: relative;
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 
    0 25px 60px -10px rgba(13, 77, 93, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  background: #ffffff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  line-height: 0;
}

.promo-poster-frame:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 30px 70px -10px rgba(13, 77, 93, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.promo-poster-img {
  width: 100%;
  height: auto;
  max-height: 82vh;
  object-fit: contain;
  display: block;
}

/* Floating Hover Hint */
.poster-hover-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.promo-poster-frame:hover .poster-hover-hint {
  opacity: 1;
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
  background: rgba(255, 255, 255, 0.12);
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

@media (max-width: 480px) {
  .promo-modal-backdrop {
    padding: 12px;
  }
  .promo-modal-wrapper {
    max-width: 92vw;
  }
  .promo-poster-frame {
    border-radius: 22px;
  }
}
</style>
