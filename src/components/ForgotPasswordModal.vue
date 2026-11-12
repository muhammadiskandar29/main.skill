<template>
  <div class="modal-backdrop" @click.self="actions.closeForgotPasswordModal()">
    <div class="modal-dialog modal-dialog-forgot card-humanist">
      <!-- Modal Header -->
      <div class="modal-header-custom">
        <div class="header-tag-row">
          <span class="badge-chip gold">Pemulihan Akun Resmi</span>
          <button class="btn-close-modal" @click="actions.closeForgotPasswordModal()" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <h3 class="modal-title-custom">Lupa Kata Sandi Akun</h3>
        <p class="modal-desc-custom">
          Verifikasi identitas melalui nomor WhatsApp terdaftar untuk mengatur ulang kata sandi akun Anda secara aman.
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

      <!-- STEP 1: INPUT IDENTIFIER (EMAIL / WA) -->
      <form v-if="step === 1" @submit.prevent="handleRequestOtp" class="form-body">
        <div class="form-group">
          <label class="form-label">Email atau Nomor WhatsApp Terdaftar <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <input 
              v-model="identifier" 
              type="text" 
              class="form-input with-icon" 
              placeholder="Contoh: user@mail.com atau 0812xxxxxxxx" 
              required 
              autofocus
            />
          </div>
          <span class="form-hint">
            Sistem akan mencocokkan akun Anda dan mengirimkan 6 digit kode OTP ke nomor WhatsApp terdaftar.
          </span>
        </div>

        <div class="form-actions-stack">
          <button type="submit" :disabled="isLoading" class="btn-primary full-width">
            <span v-if="isLoading">Memeriksa Akun & Membuat OTP...</span>
            <span v-else>Kirim Kode OTP via WhatsApp</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button type="button" @click="backToLogin" class="btn-secondary full-width">
            <span>Kembali ke Halaman Masuk</span>
          </button>
        </div>
      </form>

      <!-- STEP 2: VERIFY OTP & ENTER NEW PASSWORD -->
      <form v-else-if="step === 2" @submit.prevent="handleResetPassword" class="form-body">
        <!-- Info Banner OTP Sent -->
        <div class="otp-sent-banner">
          <div class="otp-sent-head">
            <span class="wa-indicator-dot"></span>
            <strong>Kode OTP Terkirim ke WhatsApp</strong>
          </div>
          <p class="otp-sent-desc">
            Kode verifikasi 6-digit telah dikirimkan ke nomor WhatsApp <strong>{{ maskedPhone }}</strong>.
          </p>
          <a 
            v-if="waUrl" 
            :href="waUrl" 
            target="_blank" 
            class="btn-wa-direct-receive"
            title="Klik jika Anda ingin membuka WhatsApp untuk mengecek kode verifikasi"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6-.01.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31"/>
            </svg>
            <span>Buka WhatsApp Sekarang</span>
          </a>
        </div>

        <!-- Input Kode OTP -->
        <div class="form-group">
          <label class="form-label">Masukkan 6-Digit Kode OTP <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              v-model="otpCode" 
              type="text" 
              maxlength="6"
              class="form-input with-icon otp-input" 
              placeholder="Contoh: 123456" 
              required 
              autocomplete="one-time-code"
            />
          </div>
          <span class="form-hint">Masa berlaku kode adalah 10 menit sejak dikirimkan.</span>
        </div>

        <!-- Input Password Baru -->
        <div class="form-group">
          <label class="form-label">Kata Sandi Baru <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <input 
              v-model="newPassword" 
              :type="showNewPassword ? 'text' : 'password'" 
              class="form-input with-icon with-eye" 
              placeholder="Minimal 5 atau 6 karakter..." 
              required 
              minlength="5"
            />
            <button type="button" class="btn-toggle-eye" @click="showNewPassword = !showNewPassword" tabindex="-1">
              <svg v-if="showNewPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

        <!-- Konfirmasi Password Baru -->
        <div class="form-group">
          <label class="form-label">Konfirmasi Kata Sandi Baru <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <input 
              v-model="confirmPassword" 
              :type="showNewPassword ? 'text' : 'password'" 
              class="form-input with-icon" 
              placeholder="Ulangi kata sandi baru..." 
              required 
            />
          </div>
        </div>

        <div class="form-actions-stack">
          <button type="submit" :disabled="isLoading" class="btn-gold full-width">
            <span v-if="isLoading">Menyimpan Kata Sandi...</span>
            <span v-else>Verifikasi & Simpan Kata Sandi Baru</span>
          </button>

          <button type="button" @click="step = 1" class="btn-secondary full-width">
            <span>↺ Kirim Ulang Kode OTP</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store, actions } from '../data/store.js';

const step = ref(1); // 1 = input identifier, 2 = input OTP & new pass
const identifier = ref('');
const otpCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const targetUserId = ref('');
const maskedPhone = ref('');
const waUrl = ref('');

async function handleRequestOtp() {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const res = await actions.requestPasswordResetOtp(identifier.value);
    targetUserId.value = res.userId;
    maskedPhone.value = res.maskedPhone;
    waUrl.value = res.waUrl;
    successMessage.value = res.message || 'Kode verifikasi telah dibuat!';
    step.value = 2;
  } catch (err) {
    errorMessage.value = err.message || 'Gagal meminta kode OTP. Periksa email atau nomor WhatsApp Anda.';
  } finally {
    isLoading.value = false;
  }
}

async function handleResetPassword() {
  errorMessage.value = '';
  successMessage.value = '';

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok. Silakan samakan kedua kolom kata sandi.';
    return;
  }

  if (newPassword.value.length < 5) {
    errorMessage.value = 'Kata sandi minimal 5 karakter.';
    return;
  }

  isLoading.value = true;
  try {
    await actions.verifyAndResetPassword(targetUserId.value, otpCode.value, newPassword.value);
    actions.showAlert({
      title: 'Kata Sandi Berhasil Diperbarui',
      message: 'Kata sandi akun Anda telah berhasil diubah! Silakan masuk kembali dengan kata sandi baru.',
      type: 'success'
    });
    actions.closeForgotPasswordModal();
    actions.openLoginModal();
  } catch (err) {
    errorMessage.value = err.message || 'Gagal mengatur ulang kata sandi.';
  } finally {
    isLoading.value = false;
  }
}

function backToLogin() {
  actions.closeForgotPasswordModal();
  actions.openLoginModal();
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

.modal-dialog-forgot {
  background: #ffffff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 460px;
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

.otp-sent-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 14px;
  margin-bottom: 4px;
}

.otp-sent-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #166534;
  margin-bottom: 4px;
}

.wa-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.otp-sent-desc {
  font-size: 12.5px;
  color: #15803d;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.btn-wa-direct-receive {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #25d366;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-wa-direct-receive:hover {
  background-color: #20ba59;
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

.otp-input {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 3px;
  font-family: monospace;
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

.form-actions-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}
</style>
