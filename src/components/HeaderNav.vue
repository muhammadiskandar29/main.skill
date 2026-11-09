<template>
  <header class="site-header">
    <div class="container-custom header-inner">
      <!-- Brand Logo matching attached official design -->
      <div class="brand-wrapper" @click="goHome">
        <img 
          :src="store.brand.logoPath || '/images/mine-skills-logo.png'" 
          alt="mine.skills Logo" 
          class="brand-logo-img" 
        />
      </div>

      <!-- Navigation for Public Multi-Page System -->
      <nav v-if="store.currentRole === 'public'" class="nav-links">
        <button 
          @click="navigateTo('home')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'home' }"
        >
          Beranda
        </button>
        <button 
          @click="navigateTo('programs')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'programs' }"
        >
          Program Pelatihan
        </button>
        <button 
          @click="navigateTo('pricing')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'pricing' }"
        >
          Paket Kursus & Biaya
        </button>
        <button 
          @click="navigateTo('coaches')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'coaches' }"
        >
          Instruktur
        </button>
        <button 
          @click="navigateTo('locations')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'locations' }"
        >
          Fasilitas & Lokasi
        </button>
        <button 
          @click="navigateTo('contact')" 
          class="nav-item" 
          :class="{ active: store.activePublicPage === 'contact' }"
        >
          Kontak
        </button>
      </nav>

      <!-- Right Action Area: Login / Register OR Logged In Profile -->
      <div class="header-actions">
        <!-- MODE 1: GUEST / PUBLIC VISITOR (Gerbang Login Resmi) -->
        <template v-if="store.currentRole === 'public' && !store.currentUser">
          <button 
            @click="actions.openLoginModal()" 
            class="btn-header-login"
            title="Masuk ke Portal Siswa, Coach, atau Manajemen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Masuk / Login</span>
          </button>

          <button 
            @click="$emit('open-register')" 
            class="btn-gold btn-header-register"
          >
            <span>Daftar Sekarang</span>
          </button>
        </template>

        <!-- MODE 2: LOGGED IN USER (Profile & Logout Action) -->
        <template v-else>
          <div class="logged-in-profile">
            <div class="user-meta-header">
              <span class="user-greeting-name">{{ store.currentUser?.name || 'Pengguna' }}</span>
              <span class="badge-role-tag" :class="store.currentRole">
                {{ getRoleDisplay(store.currentRole) }}
              </span>
            </div>

            <!-- Tombol Kembali ke Website Publik -->
            <button 
              v-if="store.currentRole !== 'public'" 
              @click="viewPublicSite" 
              class="btn-subtle-nav" 
              title="Lihat Beranda Website Publik"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span class="desktop-only">Website</span>
            </button>

            <!-- Tombol Buka Portal jika sedang di public page -->
            <button 
              v-else 
              @click="backToPortal" 
              class="btn-primary-portal-nav" 
              title="Masuk ke Halaman Portal Anda"
            >
              <span>Buka Portal Saya</span>
            </button>

            <!-- Tombol Logout Resmi -->
            <button 
              @click="handleLogout" 
              class="btn-logout-header" 
              title="Keluar dari Akun"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span class="desktop-only">Keluar</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { store, actions } from '../data/store.js';

defineEmits(['open-register']);

function navigateTo(page) {
  store.activePublicPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  store.activePublicPage = 'home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewPublicSite() {
  store.currentRole = 'public';
  store.activePublicPage = 'home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToPortal() {
  if (store.currentUser?.role) {
    store.currentRole = store.currentUser.role;
  }
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
    actions.logout();
  }
}

function getRoleDisplay(role) {
  if (role === 'customer') return 'Wali Murid';
  if (role === 'coach') return 'Pelatih (Coach)';
  if (role === 'manajemen') return 'Manajemen';
  return 'Pengguna';
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-subtle, #e2e8f0);
  transition: all var(--transition-fast, 0.2s);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  gap: 16px;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.brand-logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
  transition: transform var(--transition-fast, 0.2s);
}

.brand-logo-img:hover {
  transform: scale(1.02);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-item {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-muted, #64748b);
  transition: all var(--transition-fast, 0.2s);
  padding: 8px 14px;
  border-radius: var(--radius-sm, 6px);
  background: transparent;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
}

.nav-item:hover {
  color: var(--color-primary, #0d4d5d);
  background: rgba(13, 77, 93, 0.04);
}

.nav-item.active {
  color: var(--color-primary-dark, #09343f);
  background-color: var(--color-primary-soft, #f0fdfa);
  border-color: rgba(13, 77, 93, 0.15);
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-header-login {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-primary, #0d4d5d);
  background: #ffffff;
  border: 1.5px solid var(--color-primary, #0d4d5d);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-header-login:hover {
  background: var(--color-primary, #0d4d5d);
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-header-register {
  padding: 9px 18px;
  font-size: 13.5px;
  font-weight: 700;
}

/* Logged In Bar */
.logged-in-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-meta-header {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-greeting-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-dark, #09343f);
  line-height: 1.2;
}

.badge-role-tag {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

.badge-role-tag.customer {
  background: #ccfbf1;
  color: #0f766e;
}

.badge-role-tag.coach {
  background: #fef3c7;
  color: #b45309;
}

.badge-role-tag.manajemen {
  background: #e0f2fe;
  color: #0369a1;
}

.btn-subtle-nav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-subtle, #f8fafc);
  color: var(--text-main, #334155);
  border: 1px solid var(--border-subtle, #cbd5e1);
  padding: 7px 12px;
  border-radius: var(--radius-md, 8px);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-subtle-nav:hover {
  background-color: #ffffff;
  border-color: var(--color-primary, #0d4d5d);
  color: var(--color-primary, #0d4d5d);
}

.btn-primary-portal-nav {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  background: var(--color-primary, #0d4d5d);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-portal-nav:hover {
  background: var(--color-primary-dark, #09343f);
}

.btn-logout-header {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 7px 12px;
  border-radius: var(--radius-md, 8px);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-header:hover {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

@media (max-width: 960px) {
  .nav-links {
    display: none;
  }
}

@media (max-width: 640px) {
  .desktop-only {
    display: none;
  }
}
</style>
