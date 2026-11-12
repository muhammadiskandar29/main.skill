<template>
  <div class="modal-backdrop" @click.self="actions.closeChangePasswordModal()">
    <div class="modal-dialog modal-dialog-change-pw card-humanist">
      <!-- Modal Header -->
      <div class="modal-header-custom">
        <div class="header-tag-row">
          <span class="badge-chip teal">Keamanan Akun</span>
          <button class="btn-close-modal" @click="actions.closeChangePasswordModal()" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <h3 class="modal-title-custom">Ubah Kata Sandi Akun</h3>
        <p class="modal-desc-custom">
          Pastikan menggunakan kata sandi yang kuat dan unik untuk melindungi akun Anda.
        </p>
      </div>

      <!-- Alert Notice -->
      <div v-if="errorMessage" class="notice-box error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="successMessage" class="notice-box success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="handleChangePassword" class="form-body">
        <!-- Kata Sandi Lama -->
        <div class="form-group">
          <label class="form-label">Kata Sandi Saat Ini (Lama) <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              v-model="oldPassword" 
              :type="showOldPass ? 'text' : 'password'" 
              class="form-input with-icon with-eye" 
              placeholder="Masukkan kata sandi lama..." 
              required 
              autocomplete="current-password"
            />
            <button type="button" class="btn-toggle-eye" @click="showOldPass = !showOldPass" tabindex="-1">
              <svg v-if="showOldPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <span class="form-hint">Jika belum pernah diubah, gunakan kata sandi awal bawaan: <strong>123</strong>.</span>
        </div>

        <!-- Kata Sandi Baru -->
        <div class="form-group">
          <label class="form-label">Kata Sandi Baru <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <input 
              v-model="newPassword" 
              :type="showNewPass ? 'text' : 'password'" 
              class="form-input with-icon with-eye" 
              placeholder="Minimal 5 karakter..." 
              required 
              minlength="5"
              autocomplete="new-password"
            />
            <button type="button" class="btn-toggle-eye" @click="showNewPass = !showNewPass" tabindex="-1">
              <svg v-if="showNewPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <!-- Konfirmasi Kata Sandi Baru -->
        <div class="form-group">
          <label class="form-label">Konfirmasi Kata Sandi Baru <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <input 
              v-model="confirmPassword" 
              :type="showNewPass ? 'text' : 'password'" 
              class="form-input with-icon" 
              placeholder="Ulangi kata sandi baru..." 
              required 
              autocomplete="new-password"
            />
          </div>
        </div>

        <div class="modal-actions-row">
          <button type="button" @click="actions.closeChangePasswordModal()" class="btn-secondary">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary">
            <span v-if="isLoading">Menyimpan Perubahan...</span>
            <span v-else>Simpan Kata Sandi</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { actions } from '../data/store.js';

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showOldPass = ref(false);
const showNewPass = ref(false);

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleChangePassword() {
  errorMessage.value = '';
  successMessage.value = '';

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi kata sandi baru tidak sama.';
    return;
  }

  if (newPassword.value.length < 5) {
    errorMessage.value = 'Kata sandi baru minimal 5 karakter.';
    return;
  }

  isLoading.value = true;
  try {
    await actions.changePassword(oldPassword.value, newPassword.value);
    actions.showAlert({
      title: 'Kata Sandi Diperbarui',
      message: 'Kata sandi akun Anda berhasil diubah! Gunakan kata sandi baru untuk login berikutnya.',
      type: 'success'
    });
    actions.closeChangePasswordModal();
  } catch (err) {
    errorMessage.value = err.message || 'Gagal mengubah kata sandi.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-dialog-change-pw {
  background: #ffffff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 440px;
  padding: 28px 24px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.22);
  animation: modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header-custom {
  margin-bottom: 20px;
}

.header-tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn-close-modal {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  background-color: #f1f5f9;
  color: var(--color-primary-dark);
}

.modal-title-custom {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0 0 6px 0;
}

.modal-desc-custom {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.45;
  margin: 0;
}

.notice-box {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.notice-box.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.notice-box.success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
}

.form-input.with-icon {
  padding-left: 38px;
}

.form-input.with-eye {
  padding-right: 38px;
}

.btn-toggle-eye {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.modal-actions-row {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 12px;
  margin-top: 8px;
}
</style>
