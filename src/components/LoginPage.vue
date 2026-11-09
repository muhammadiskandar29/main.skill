<template>
  <div class="login-page-wrapper">
    <!-- ANIMATED BACKGROUND MESH & GLOWING FLOATING ORBS -->
    <div class="animated-bg-container">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="glow-orb orb-3"></div>
      <div class="glow-orb orb-4"></div>
      <div class="grid-overlay"></div>

      <!-- Floating Ambient Skill Badges (Interactive 3D-feel) -->
      <div class="floating-badge float-swimming">
        <span class="badge-icon">🏊‍♂️</span>
        <div class="badge-text">
          <strong>Skill Renang</strong>
          <span>Level 1 - 4 Terukur</span>
        </div>
      </div>

      <div class="floating-badge float-dance">
        <span class="badge-icon">💃</span>
        <div class="badge-text">
          <strong>Seni Tari</strong>
          <span>Motorik & Ekspresi</span>
        </div>
      </div>

      <div class="floating-badge float-coach">
        <span class="badge-icon">🥋</span>
        <div class="badge-text">
          <strong>Coach Terverifikasi</strong>
          <span>Sertifikasi Resmi</span>
        </div>
      </div>

      <div class="floating-badge float-cert">
        <span class="badge-icon">🏆</span>
        <div class="badge-text">
          <strong>Raport Digital</strong>
          <span>Evaluasi Berkala</span>
        </div>
      </div>
    </div>

    <!-- Top Bar with Back to Website link -->
    <header class="login-top-bar">
      <div class="container-custom top-bar-inner">
        <a href="javascript:void(0)" @click="goToHome" class="brand-link" title="Kembali ke Beranda">
          <img 
            :src="store.brand.logoPath || '/images/mine-skills-logo.png'" 
            alt="mine.skills Logo" 
            class="top-logo-img" 
          />
        </a>
        <button @click="goToHome" class="btn-back-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Kembali ke Website Beranda</span>
        </button>
      </div>
    </header>

    <!-- Center Card with Glassmorphism & Interactive Elements -->
    <main class="login-main-container">
      <div class="login-card-glass">
        <!-- Interactive Security Pill & Brand Tag -->
        <div class="card-security-pill">
          <span class="pulse-green"></span>
          <span class="security-txt">Gerbang Resmi • Terproteksi JWT 256-Bit</span>
        </div>

        <div class="login-card-header">
          <h2 class="login-title">Masuk ke Portal</h2>
          <p class="login-sub">
            Silakan pilih peran akun atau masukkan email & kata sandi Anda.
          </p>
        </div>

        <!-- INTERACTIVE ROLE SELECTOR TABS -->
        <div class="role-selector-tabs">
          <button 
            type="button" 
            class="role-tab" 
            :class="{ active: activeRoleTab === 'customer' }"
            @click="selectRoleTab('customer')"
          >
            <span class="tab-emoji">👨‍👩‍👧</span>
            <span class="tab-label">Wali Murid</span>
          </button>
          <button 
            type="button" 
            class="role-tab" 
            :class="{ active: activeRoleTab === 'coach' }"
            @click="selectRoleTab('coach')"
          >
            <span class="tab-emoji">🥋</span>
            <span class="tab-label">Pelatih (Coach)</span>
          </button>
          <button 
            type="button" 
            class="role-tab" 
            :class="{ active: activeRoleTab === 'manajemen' }"
            @click="selectRoleTab('manajemen')"
          >
            <span class="tab-emoji">⚙️</span>
            <span class="tab-label">Manajemen</span>
          </button>
        </div>

        <!-- Alert Error jika ada kendala / akun nonaktif -->
        <transition name="fade-slide">
          <div v-if="errorMessage" class="login-alert-box error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- Form Login -->
        <form @submit.prevent="handleLoginSubmit" class="login-form">
          <div class="form-group">
            <label class="form-label">
              <span>Alamat Email Terdaftar</span>
              <span class="role-hint-pill" :class="activeRoleTab">Akun {{ getRoleName(activeRoleTab) }}</span>
            </label>
            <div class="input-icon-wrap" :class="{ focused: isEmailFocused }">
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
                @focus="isEmailFocused = true"
                @blur="isEmailFocused = false"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Kata Sandi</label>
              <span class="sub-hint">Default akun demo: <strong>123</strong></span>
            </div>
            <div class="input-icon-wrap" :class="{ focused: isPassFocused }">
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
                @focus="isPassFocused = true"
                @blur="isPassFocused = false"
              />
              <button 
                type="button" 
                class="btn-toggle-eye" 
                @click="showPassword = !showPassword" 
                tabindex="-1"
                :title="showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'"
              >
                <svg v-if="showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="isLoading" class="btn-submit-glow">
            <span v-if="isLoading" class="btn-loading-row">
              <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
              </svg>
              <span>Memverifikasi Akses JWT...</span>
            </span>
            <span v-else class="btn-text-row">
              <span>Masuk ke Dashboard {{ getRoleName(activeRoleTab) }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </button>
        </form>

        <!-- Quick 1-Click Fast Switch Chips -->
        <div class="quick-access-section">
          <div class="quick-access-header">
            <span class="quick-line"></span>
            <span class="quick-tag">Atau Pilih 1-Klik Akun Langsung</span>
            <span class="quick-line"></span>
          </div>

          <div class="quick-chip-grid">
            <button 
              type="button" 
              class="quick-login-card" 
              :class="{ active: activeRoleTab === 'customer' }"
              @click="selectRoleTab('customer')"
            >
              <div class="chip-avatar parent">👨‍👩‍👧</div>
              <div class="chip-info">
                <strong>Bunda Sarah</strong>
                <span>Wali Murid (Kenzo)</span>
              </div>
              <span class="chip-badge">Siswa</span>
            </button>

            <button 
              type="button" 
              class="quick-login-card" 
              :class="{ active: activeRoleTab === 'coach' }"
              @click="selectRoleTab('coach')"
            >
              <div class="chip-avatar coach">🥋</div>
              <div class="chip-info">
                <strong>Coach Adit</strong>
                <span>Pelatih Renang</span>
              </div>
              <span class="chip-badge">Coach</span>
            </button>

            <button 
              type="button" 
              class="quick-login-card" 
              :class="{ active: activeRoleTab === 'manajemen' }"
              @click="selectRoleTab('manajemen')"
            >
              <div class="chip-avatar admin">⚙️</div>
              <div class="chip-info">
                <strong>Admin Pusat</strong>
                <span>Tim Manajemen</span>
              </div>
              <span class="chip-badge">Admin</span>
            </button>
          </div>
        </div>

        <!-- Footer link back to register -->
        <div class="login-card-footer">
          <p class="footer-msg">
            Belum mendaftarkan anak Anda di mine.skills? 
            <a href="javascript:void(0)" @click="$emit('open-register')" class="reg-link">Daftar Siswa Baru Sekarang ➔</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import confetti from 'canvas-confetti';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['navigate-home', 'open-register', 'login-success']);

const activeRoleTab = ref('manajemen');
const email = ref('admin@mine.skills.id');
const password = ref('123');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const isEmailFocused = ref(false);
const isPassFocused = ref(false);

const roleCredentials = {
  customer: { email: 'sarah.ramadhani@gmail.com', pass: '123' },
  coach: { email: 'adit.coach@mine.skills.id', pass: '123' },
  manajemen: { email: 'admin@mine.skills.id', pass: '123' }
};

function selectRoleTab(roleKey) {
  activeRoleTab.value = roleKey;
  errorMessage.value = '';
  const creds = roleCredentials[roleKey];
  if (creds) {
    email.value = creds.email;
    password.value = creds.pass;
  }
}

function getRoleName(roleKey) {
  if (roleKey === 'customer') return 'Wali Murid';
  if (roleKey === 'coach') return 'Coach';
  if (roleKey === 'manajemen') return 'Manajemen';
  return 'Portal';
}

function goToHome() {
  emit('navigate-home');
}

async function handleLoginSubmit() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const user = await actions.login(email.value, password.value);
    
    // Trigger celebratory confetti burst on success
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Small delay for smooth visual transition
    setTimeout(() => {
      emit('login-success', user);
    }, 300);
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
  background-color: #06232c;
  position: relative;
  overflow: hidden;
  font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
}

/* =========================================================================
   ANIMATED BACKGROUND MESH & GLOWING ORBS
   ========================================================================= */
.animated-bg-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.6;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  mix-blend-mode: screen;
}

.orb-1 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, #0d7a8e 0%, rgba(13, 122, 142, 0) 70%);
  top: -150px;
  left: -100px;
  animation: floatOrb1 16s ease-in-out infinite alternate;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #e5a024 0%, rgba(229, 160, 36, 0) 70%);
  bottom: -100px;
  right: -100px;
  animation: floatOrb2 18s ease-in-out infinite alternate;
}

.orb-3 {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, #10b981 0%, rgba(16, 185, 129, 0) 70%);
  top: 40%;
  right: 15%;
  animation: floatOrb3 14s ease-in-out infinite alternate;
}

.orb-4 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #3b82f6 0%, rgba(59, 130, 246, 0) 70%);
  bottom: 20%;
  left: 20%;
  animation: floatOrb4 20s ease-in-out infinite alternate;
}

@keyframes floatOrb1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(120px, 80px) scale(1.15); }
  100% { transform: translate(40px, 160px) scale(0.95); }
}

@keyframes floatOrb2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-100px, -60px) scale(1.2); }
  100% { transform: translate(-40px, -120px) scale(1.05); }
}

@keyframes floatOrb3 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-80px, 60px) scale(0.9); }
  100% { transform: translate(-140px, -40px) scale(1.1); }
}

@keyframes floatOrb4 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(80px, -80px) scale(1.15); }
  100% { transform: translate(40px, 40px) scale(1); }
}

/* Floating Ambient Badges */
.floating-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(13, 77, 93, 0.45);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #ffffff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  animation: floatBadge 6s ease-in-out infinite;
  z-index: 2;
  user-select: none;
}

.float-swimming {
  top: 18%;
  left: 8%;
  animation-delay: 0s;
}

.float-dance {
  bottom: 22%;
  left: 7%;
  animation-delay: 1.5s;
}

.float-coach {
  top: 22%;
  right: 8%;
  animation-delay: 2.5s;
}

.float-cert {
  bottom: 18%;
  right: 8%;
  animation-delay: 3.8s;
}

@keyframes floatBadge {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.badge-icon {
  font-size: 24px;
}

.badge-text strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}

.badge-text span {
  display: block;
  font-size: 11px;
  color: #c9e1e7;
}

@media (max-width: 1200px) {
  .floating-badge {
    display: none;
  }
}

/* =========================================================================
   TOP BAR
   ========================================================================= */
.login-top-bar {
  padding: 22px 0;
  position: relative;
  z-index: 10;
}

.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-logo-img {
  height: 42px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

.top-logo-img:hover {
  transform: scale(1.03);
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.25s ease;
}

.btn-back-home:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #ffffff;
  transform: translateX(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* =========================================================================
   CENTER GLASS CARD
   ========================================================================= */
.login-main-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px 40px;
  position: relative;
  z-index: 5;
}

.login-card-glass {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 36px 36px 30px;
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: cardEntry 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-security-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 5px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.pulse-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #16a34a;
  box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
  animation: pulseGreenAnim 2s infinite;
}

@keyframes pulseGreenAnim {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
}

.security-txt {
  font-size: 11px;
  font-weight: 700;
  color: #15803d;
  letter-spacing: 0.02em;
}

.login-card-header {
  margin-bottom: 22px;
}

.login-title {
  font-size: 26px;
  font-weight: 800;
  color: #09343f;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.login-sub {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* =========================================================================
   INTERACTIVE ROLE SELECTOR TABS
   ========================================================================= */
.role-selector-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  margin-bottom: 22px;
}

.role-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 6px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.role-tab:hover {
  background: rgba(255, 255, 255, 0.6);
}

.role-tab.active {
  background: #ffffff;
  border-color: rgba(13, 77, 93, 0.15);
  box-shadow: 0 3px 10px rgba(13, 77, 93, 0.12);
}

.tab-emoji {
  font-size: 17px;
  line-height: 1;
}

.tab-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  transition: color 0.2s ease;
}

.role-tab.active .tab-label {
  color: #0d4d5d;
}

/* Alert Box */
.login-alert-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 18px;
}

.login-alert-box.error {
  background: #fef2f2;
  border: 1px solid #fecdd3;
  color: #b91c1c;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* =========================================================================
   FORM STYLING
   ========================================================================= */
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

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #1e293b;
}

.role-hint-pill {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.role-hint-pill.customer {
  background: #fdf4ff;
  color: #a21caf;
  border: 1px solid #f0abfc;
}

.role-hint-pill.coach {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.role-hint-pill.manajemen {
  background: #fefce8;
  color: #a16207;
  border: 1px solid #fef08a;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-hint {
  font-size: 11px;
  color: #64748b;
}

.sub-hint strong {
  color: #0d4d5d;
}

.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.input-icon-wrap.focused {
  border-color: #0d4d5d;
  box-shadow: 0 0 0 4px rgba(13, 77, 93, 0.12);
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-icon-wrap.focused .input-icon {
  color: #0d4d5d;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #0f172a;
  outline: none;
}

.form-input.with-eye {
  padding-right: 44px;
}

.btn-toggle-eye {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.btn-toggle-eye:hover {
  color: #0d4d5d;
}

/* Submit Button with Gradient and Glow */
.btn-submit-glow {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
  background: linear-gradient(135deg, #0d4d5d 0%, #115f73 50%, #09343f 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(13, 77, 93, 0.35);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-submit-glow::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-submit-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(13, 77, 93, 0.45);
  background: linear-gradient(135deg, #0f5b6e 0%, #15738b 50%, #0d4d5d 100%);
}

.btn-submit-glow:hover::after {
  left: 100%;
}

.btn-submit-glow:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-text-row, .btn-loading-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* =========================================================================
   QUICK 1-CLICK TEST CHIPS
   ========================================================================= */
.quick-access-section {
  margin-top: 24px;
}

.quick-access-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.quick-line {
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.quick-tag {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quick-chip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.quick-login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 6px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.quick-login-card:hover {
  background: #ffffff;
  border-color: #0d4d5d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.1);
}

.quick-login-card.active {
  background: #ffffff;
  border-color: #e5a024;
  box-shadow: 0 0 0 2px rgba(229, 160, 36, 0.35);
}

.chip-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 6px;
}

.chip-avatar.parent { background-color: #fae8ff; }
.chip-avatar.coach { background-color: #dbeafe; }
.chip-avatar.admin { background-color: #fef9c3; }

.chip-info strong {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1px;
}

.chip-info span {
  display: block;
  font-size: 10px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}

.chip-badge {
  position: absolute;
  top: -6px;
  right: -4px;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 999px;
  background: #0d4d5d;
  color: #ffffff;
  text-transform: uppercase;
}

/* Footer Link */
.login-card-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.footer-msg {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}

.reg-link {
  color: #0d4d5d;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.reg-link:hover {
  color: #e5a024;
  text-decoration: underline;
}

/* Mobile responsive */
@media (max-width: 520px) {
  .login-card-glass {
    padding: 24px 20px 20px;
    border-radius: 16px;
  }
  .quick-chip-grid {
    grid-template-columns: 1fr;
  }
  .quick-login-card {
    flex-direction: row;
    gap: 10px;
    text-align: left;
    padding: 8px 12px;
  }
  .chip-avatar {
    margin-bottom: 0;
  }
  .chip-info span {
    max-width: none;
  }
  .chip-badge {
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
</style>
