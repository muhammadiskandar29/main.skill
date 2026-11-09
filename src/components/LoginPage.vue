<template>
  <div class="login-page-wrapper">
    <!-- Top Bar with Back to Website link -->
    <header class="login-top-bar">
      <div class="container-custom top-bar-inner">
        <a href="javascript:void(0)" @click="goToHome" class="brand-link">
          <img 
            :src="store.brand.logoPath || '/images/mine-skills-logo.png'" 
            alt="mine.skills Logo" 
            class="top-logo-img" 
          />
        </a>
        <button @click="goToHome" class="btn-back-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Kembali ke Website Beranda</span>
        </button>
      </div>
    </header>

    <!-- Center Card -->
    <main class="login-main-container">
      <div class="login-card card-humanist">
        <!-- Brand & Badge -->
        <div class="login-card-header">
          <div class="badge-row">
            <span class="badge-chip gold">Gerbang Portal Resmi</span>
          </div>
          <h2 class="login-title">Masuk ke Portal mine.skills</h2>
          <p class="login-sub">
            Silakan masukkan email dan kata sandi untuk mengakses portal evaluasi siswa, jadwal mengajar coach, atau operasional manajemen.
          </p>
        </div>

        <!-- Alert Error jika ada kendala / akun nonaktif -->
        <div v-if="errorMessage" class="login-alert-box error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form Login -->
        <form @submit.prevent="handleLoginSubmit" class="login-form">
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

          <button type="submit" :disabled="isLoading" class="btn-submit-main">
            <span v-if="isLoading">Memverifikasi Akun...</span>
            <span v-else>Masuk ke Portal Saya</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </form>

        <!-- Quick 1-Click Access Chips -->
        <div class="quick-access-section">
          <div class="quick-access-header">
            <span class="quick-tag">Pilihan Akun Uji Coba (1-Klik):</span>
          </div>
          <div class="quick-chip-grid">
            <button 
              type="button" 
              class="quick-login-card chip-parent" 
              @click="fillCredentials('sarah.ramadhani@gmail.com', '123')"
            >
              <div class="chip-icon">👨‍👩‍👧</div>
              <div class="chip-info">
                <strong>Wali Murid</strong>
                <span>Bunda Sarah (Kenzo)</span>
              </div>
            </button>

            <button 
              type="button" 
              class="quick-login-card chip-coach" 
              @click="fillCredentials('adit.coach@mine.skills.id', '123')"
            >
              <div class="chip-icon">🥋</div>
              <div class="chip-info">
                <strong>Pelatih (Coach)</strong>
                <span>Coach Adit (Renang)</span>
              </div>
            </button>

            <button 
              type="button" 
              class="quick-login-card chip-admin" 
              @click="fillCredentials('admin@mine.skills.id', '123')"
            >
              <div class="chip-icon">⚙️</div>
              <div class="chip-info">
                <strong>Manajemen</strong>
                <span>Administrator Pusat</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="login-card-footer">
          <p class="footer-msg">
            Belum mendaftarkan ananda? 
            <a href="javascript:void(0)" @click="$emit('open-register')" class="reg-link">Daftar Siswa Baru Sekarang</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['navigate-home', 'open-register', 'login-success']);

const email = ref('admin@mine.skills.id');
const password = ref('123');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

function fillCredentials(e, p) {
  email.value = e;
  password.value = p;
  errorMessage.value = '';
}

function goToHome() {
  emit('navigate-home');
}

async function handleLoginSubmit() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const user = await actions.login(email.value, password.value);
    emit('login-success', user);
  } catch (err) {
    errorMessage.value = err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #09343f 0%, #0d4d5d 50%, #082933 100%);
  position: relative;
  overflow-x: hidden;
}

.login-page-wrapper::before {
  content: '';
  position: absolute;
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 160, 36, 0.15) 0%, rgba(229, 160, 36, 0) 70%);
  pointer-events: none;
}

.login-page-wrapper::after {
  content: '';
  position: absolute;
  bottom: -150px;
  left: -150px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 77, 93, 0.4) 0%, rgba(13, 77, 93, 0) 70%);
  pointer-events: none;
}

.login-top-bar {
  padding: 20px 0;
  position: relative;
  z-index: 10;
}

.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.btn-back-home:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: #ffffff;
  transform: translateX(-2px);
}

.login-main-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 16px 50px 16px;
  position: relative;
  z-index: 5;
}

.login-card {
  max-width: 480px;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 1px 1px rgba(255,255,255,0.2);
}

.login-card-header {
  margin-bottom: 24px;
}

.badge-row {
  margin-bottom: 10px;
}

.login-title {
  font-size: 22px;
  font-weight: 800;
  color: #09343f;
  margin: 0 0 8px 0;
  line-height: 1.25;
}

.login-sub {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.login-alert-box.error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 20px;
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
  color: #09343f;
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
  padding: 11px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #0d4d5d;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(13, 77, 93, 0.12);
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

.btn-submit-main {
  margin-top: 6px;
  padding: 13px;
  background: linear-gradient(135deg, #0d4d5d 0%, #09343f 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.3);
  transition: all 0.2s ease;
}

.btn-submit-main:hover {
  background: linear-gradient(135deg, #115f73 0%, #0d4d5d 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(13, 77, 93, 0.35);
}

.btn-submit-main:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.quick-access-section {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px dashed #e2e8f0;
}

.quick-access-header {
  margin-bottom: 10px;
}

.quick-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.quick-chip-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-login-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.quick-login-card:hover {
  background: #ffffff;
  border-color: #0d4d5d;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.08);
  transform: translateX(3px);
}

.chip-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.chip-info {
  display: flex;
  flex-direction: column;
}

.chip-info strong {
  font-size: 12.5px;
  color: #0f172a;
}

.chip-info span {
  font-size: 11px;
  color: #64748b;
}

.login-card-footer {
  margin-top: 20px;
  text-align: center;
}

.footer-msg {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.reg-link {
  color: #0d4d5d;
  font-weight: 700;
  text-decoration: underline;
}

.reg-link:hover {
  color: #e5a024;
}
</style>
