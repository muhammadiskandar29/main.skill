<template>
  <transition name="alert-pop">
    <div 
      v-if="store.alertModal?.isOpen" 
      class="alert-modal-backdrop"
      @click.self="actions.closeAlert()"
      tabindex="-1"
      @keydown.esc="actions.closeAlert()"
      @keydown.enter="actions.closeAlert()"
    >
      <div class="alert-modal-dialog" role="dialog" aria-modal="true">
        <!-- Icon Badge -->
        <div class="alert-icon-wrap" :class="alertType">
          <!-- Warning Icon -->
          <svg v-if="alertType === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>

          <!-- Error Icon -->
          <svg v-else-if="alertType === 'error'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>

          <!-- Success Icon -->
          <svg v-else-if="alertType === 'success'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>

          <!-- Info Icon -->
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>

        <!-- Content -->
        <h4 class="alert-title">{{ store.alertModal?.title || 'Perhatian' }}</h4>
        <p class="alert-message">{{ store.alertModal?.message }}</p>

        <!-- Action Button -->
        <div class="alert-action-row">
          <button 
            type="button" 
            ref="confirmBtnRef"
            @click="actions.closeAlert()" 
            class="btn-alert-action" 
            :class="alertType"
            autofocus
          >
            {{ store.alertModal?.confirmText || 'Mengerti' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { store, actions } from '../data/store.js';

const confirmBtnRef = ref(null);

const alertType = computed(() => {
  return store.alertModal?.type || 'warning';
});

watch(
  () => store.alertModal?.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        confirmBtnRef.value?.focus();
      });
    }
  }
);
</script>

<style scoped>
.alert-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.alert-modal-dialog {
  max-width: 420px;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 
    0 25px 60px -15px rgba(15, 23, 42, 0.28),
    0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 28px 24px 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Icon Badges */
.alert-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.alert-icon-wrap.warning {
  background: #fef3c7;
  color: #d97706;
  border: 2px solid #fde68a;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
}

.alert-icon-wrap.error {
  background: #fee2e2;
  color: #dc2626;
  border: 2px solid #fecaca;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.alert-icon-wrap.success {
  background: #dcfce7;
  color: #16a34a;
  border: 2px solid #bbf7d0;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
}

.alert-icon-wrap.info {
  background: #f0fdfa;
  color: #0d9488;
  border: 2px solid #99f6e4;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.alert-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  line-height: 1.3;
}

.alert-message {
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 22px;
  line-height: 1.55;
  white-space: pre-line;
  max-width: 360px;
}

.alert-action-row {
  width: 100%;
}

.btn-alert-action {
  width: 100%;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-alert-action.warning {
  background: linear-gradient(135deg, #0d4d5d 0%, #156d82 100%);
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.25);
}

.btn-alert-action.warning:hover {
  background: linear-gradient(135deg, #09343f 0%, #0d4d5d 100%);
  transform: translateY(-1px);
}

.btn-alert-action.error {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);
}

.btn-alert-action.error:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-1px);
}

.btn-alert-action.success {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
}

.btn-alert-action.success:hover {
  background: linear-gradient(135deg, #166534 0%, #15803d 100%);
  transform: translateY(-1px);
}

.btn-alert-action.info {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.25);
}

.btn-alert-action.info:hover {
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
  transform: translateY(-1px);
}

/* Animations */
.alert-pop-enter-active,
.alert-pop-leave-active {
  transition: opacity 0.2s ease;
}

.alert-pop-enter-from,
.alert-pop-leave-to {
  opacity: 0;
}

.alert-pop-enter-active .alert-modal-dialog {
  animation: alertScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.alert-pop-leave-active .alert-modal-dialog {
  animation: alertScaleOut 0.18s ease-in;
}

@keyframes alertScaleIn {
  0% { transform: scale(0.92) translateY(8px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes alertScaleOut {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.94) translateY(6px); opacity: 0; }
}

@media (max-width: 480px) {
  .alert-modal-dialog {
    padding: 24px 20px 18px;
    border-radius: 18px;
  }
  .alert-icon-wrap {
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
  }
  .alert-title {
    font-size: 16.5px;
  }
  .alert-message {
    font-size: 13px;
    margin-bottom: 18px;
  }
  .btn-alert-action {
    padding: 11px 16px;
    font-size: 13.5px;
  }
}
</style>