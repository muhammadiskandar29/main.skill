<template>
  <div class="modal-backdrop" @click.self="actions.closeLoginModal()">
    <div class="modal-dialog modal-dialog-login card-humanist">
      <!-- Modal Header -->
      <div class="login-header">
        <div class="brand-row">
          <img :src="store.brand.logoPath || '/images/mine-skills-logo.png'" alt="mine.skills Logo" class="login-logo-img" />
          <span class="badge-chip gold">Gerbang Portal Resmi</span>
        </div>
        <h3 class="login-title">Masuk ke Portal {{ store.brand.name }}</h3>
        <p class="login-desc">Silakan masukkan email dan kata sandi untuk mengakses portal pembelajaran, evaluasi raport, atau operasional.</p>
        <button class="btn-close-login" @click="actions.closeLoginModal()" aria-label="Tutup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Alert Error jika ada kendala atau akun dinonaktifkan -->
      <div v-if="errorMessage" class="login-alert error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Alamat Email Terdaftar <span class="required">*</span></label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              v-model="email" 
              type="email" 
              class="form-input with-icon" 
              placeholder="nama@email.com" 
              required 
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="label-row">
            <label class="form-label">Kata Sandi <span class="required">*</span></label>
            <span class="sub-hint">Default akun: <strong>123</strong></span>
          </div>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="form-input with-icon with-eye" 
              placeholder="Masukkan kata sandi..." 
              required 
              autocomplete="current-password"
            />
            <button type="button" class="btn-toggle-eye" @click="showPassword = !showPassword" tabindex="-1">
              <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

        <button type="submit" :disabled="isLoading" class="btn-gold full-width btn-submit-login">
          <span v-if="isLoading">Memverifikasi Akun...</span>
          <span v-else>Masuk ke Akun Saya</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </form>

      <!-- Quick Helper: Akun Uji Coba Resmi -->
      <div class="quick-login-box">
        <span class="quick-title">Bantuan Akses Cepat (Akun Uji Coba):</span>
        <div class="quick-chips">
          <button 
            type="button" 
            class="quick-chip chip-cust" 
            @click="fillQuick('sarah.ramadhani@gmail.com', '123')"
            title="Masuk sebagai Orang Tua Siswa"
          >
            <span>👨‍👩‍👧 Wali Murid (Bunda Sarah)</span>
          </button>
          <button 
            type="button" 
            class="quick-chip chip-coach" 
            @click="fillQuick('adit.coach@mine.skills.id', '123')"
            title="Masuk sebagai Pelatih Renang"
          >
            <span>🥋 Coach (Coach Adit)</span>
          </button>
          <button 
            type="button" 
            class="quick-chip chip-admin" 
            @click="fillQuick('admin@mine.skills.id', '123')"
            title="Masuk sebagai Manajemen Administrator"
          >
            <span>⚙️ Manajemen (Admin)</span>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="login-footer">
        <p class="footer-txt">
          Belum mendaftarkan ananda? 
          <a href="javascript:void(0)" @click="openRegister" class="link-register">Daftar Siswa Baru Sekarang</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['close', 'open-register']);

const email = ref('');
const password = ref('123');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

function fillQuick(e, p) {
  email.value = e;
  password.value = p;
  errorMessage.value = '';
}

async function handleLogin() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await actions.login(email.value, password.value);
    actions.closeLoginModal();
  } catch (err) {
    errorMessage.value = err.message || 'Gagal masuk ke akun.';
  } finally {
    isLoading.value = false;
  }
}

function openRegister() {
  actions.closeLoginModal();
  emit('open-register');
}
</script>

<style scoped>
.modal-dialog-login {
  max-width: 460px;
  width: 92%;
  padding: 32px 28px;
  background: #ffffff;
  border-radius: var(--radius-lg, 16px);
  box-shadow: 0 25px 50px -12px rgba(13, 77, 93, 0.25);
  position: relative;
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.login-header {
  position: relative;
  margin-bottom: 20px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.login-logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.login-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark, #09343f);
  margin-bottom: 6px;
}

.login-desc {
  font-size: 13px;
  color: var(--text-muted, #64748b);
  line-height: 1.5;
}

.btn-close-login {
  position: absolute;
  top: -6px;
  right: -4px;
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-login:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.login-alert.error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-primary-dark, #09343f);
}

.sub-hint {
  font-size: 11px;
  color: #64748b;
}

.required {
  color: #dc2626;
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
  padding-right: 40px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary, #0d4d5d);
  background: #ffffff;
}

.btn-toggle-eye {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.btn-toggle-eye:hover {
  color: #475569;
}

.btn-submit-login {
  margin-top: 6px;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quick-login-box {
  margin-top: 20px;
  padding: 14px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
}

.quick-title {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 10px;
}

.quick-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-chip {
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #334155;
}

.quick-chip:hover {
  border-color: var(--color-primary, #0d4d5d);
  background: #f0fdfa;
  color: var(--color-primary-dark, #09343f);
  transform: translateX(2px);
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.footer-txt {
  font-size: 13px;
  color: #64748b;
}

.link-register {
  color: var(--color-primary, #0d4d5d);
  font-weight: 700;
  text-decoration: underline;
}

.link-register:hover {
  color: var(--color-accent-gold, #e5a024);
}
</style>
