<template>
  <transition name="promo-fade">
    <div 
      class="promo-modal-backdrop" 
      @click.self="handleBackdropClick"
      @keydown.esc="handleClose"
      tabindex="-1"
      ref="backdropRef"
    >
      <div class="promo-modal-container">
        <!-- Floating Close Button -->
        <button 
          type="button" 
          class="btn-close-promo" 
          @click="handleClose" 
          title="Tutup Poster Promo"
          aria-label="Tutup Poster Promo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Poster Image Card -->
        <div class="promo-poster-card" @click="handleCta">
          <div class="promo-img-wrapper">
            <img 
              :src="store.promoBanner?.imageUrl || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800'" 
              :alt="store.promoBanner?.title || 'Poster Promo Spesial'" 
              class="promo-poster-img"
              loading="eager"
            />
            <!-- Subtle Hover Shine Overlay -->
            <div class="promo-hover-overlay">
              <span class="promo-hover-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path>
                </svg>
                Klik untuk Hubungi Admin via WhatsApp
              </span>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="promo-bottom-bar" @click.stop>
            <div class="promo-info">
              <h4 class="promo-title">{{ store.promoBanner?.title || 'Promo Spesial Siswa Baru' }}</h4>
              <p class="promo-sub">Dapatkan penawaran istimewa pendaftaran kelas bimbingan hari ini.</p>
            </div>
            <button 
              type="button" 
              class="btn-cta-whatsapp" 
              @click="handleCta"
              title="Chat WhatsApp Admin Resmi"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path>
              </svg>
              <span>{{ store.promoBanner?.ctaText || 'Klaim Promo via WhatsApp' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['close']);
const backdropRef = ref(null);

function handleClose() {
  emit('close');
}

function handleBackdropClick() {
  emit('close');
}

function handleCta() {
  const cleanPhone = actions.cleanWaNumber(store.brand?.callCenter || '085286274726');
  const text = store.promoBanner?.whatsappMessage || 
    `Halo Admin ${store.brand?.name || 'mine.skills'}, saya melihat poster promo di website dan ingin menanyakan info pendaftaran serta diskon khusus. Mohon infonya ya!`;
  
  const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
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
.promo-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  outline: none;
}

.promo-modal-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  animation: promoPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  margin: auto;
}

@keyframes promoPop {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(16px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Floating Close Button at Top Right */
.btn-close-promo {
  position: absolute;
  top: -16px;
  right: -16px;
  z-index: 10;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  color: #0f172a;
  border: 2px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-promo:hover {
  background: #f43f5e;
  color: #ffffff;
  border-color: #f43f5e;
  transform: rotate(90deg) scale(1.08);
}

/* Poster Card */
.promo-poster-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.25s ease;
}

.promo-poster-card:hover {
  transform: translateY(-2px);
}

.promo-img-wrapper {
  position: relative;
  width: 100%;
  max-height: 540px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.promo-poster-img {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.promo-poster-card:hover .promo-poster-img {
  transform: scale(1.02);
}

.promo-hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.promo-poster-card:hover .promo-hover-overlay {
  opacity: 1;
}

.promo-hover-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(37, 211, 102, 0.95);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
}

/* Bottom Bar */
.promo-bottom-bar {
  padding: 18px 20px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.promo-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.promo-sub {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.4;
}

.btn-cta-whatsapp {
  width: 100%;
  padding: 12px 18px;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 20px -4px rgba(37, 211, 102, 0.5);
  transition: all 0.2s ease;
}

.btn-cta-whatsapp:hover {
  background: linear-gradient(135deg, #2ee06e 0%, #0f7a6e 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(37, 211, 102, 0.6);
}

/* Transition */
.promo-fade-enter-active,
.promo-fade-leave-active {
  transition: opacity 0.3s ease;
}

.promo-fade-enter-from,
.promo-fade-leave-to {
  opacity: 0;
}

@media (max-width: 540px) {
  .promo-modal-container {
    max-width: 92vw;
  }
  .btn-close-promo {
    top: -12px;
    right: -8px;
    width: 34px;
    height: 34px;
  }
  .promo-bottom-bar {
    padding: 14px 16px;
  }
  .promo-title {
    font-size: 15px;
  }
}
</style>
