<template>
  <header class="site-header">
    <div class="container-custom header-inner">
      <!-- Brand Logo matching attached official design -->
      <div class="brand-wrapper" @click="goHome">
        <img 
          :src="store.cms.brand.logoPath || '/images/mine-skills-logo.png'" 
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

      <!-- Right Action Area: Role Selector & CTA -->
      <div class="header-actions">
        <!-- RBAC Quick Role Switcher Pill -->
        <div class="rbac-switcher">
          <label class="rbac-label">
            <span class="rbac-dot" :class="store.currentRole"></span>
            <span class="rbac-title">Peran:</span>
          </label>
          <select 
            :value="store.currentRole" 
            @change="handleRoleChange($event.target.value)" 
            class="rbac-select"
            title="Pilih role untuk menguji RBAC sistem"
          >
            <option value="public">Portal Publik (Company Profile)</option>
            <option value="customer">Role: Customer (Orang Tua / Siswa)</option>
            <option value="coach">Role: Coach (Pelatih)</option>
            <option value="manajemen">Role: Manajemen (Admin)</option>
          </select>
        </div>

        <!-- Mode Public: Button Daftar Sekarang -->
        <button 
          v-if="store.currentRole === 'public'" 
          @click="$emit('open-register')" 
          class="btn-gold btn-header-register"
        >
          <span>Daftar Sekarang</span>
        </button>

        <!-- Mode Portal: User Profile & Back to Landing -->
        <div v-else class="portal-user-badge">
          <button @click="goHome" class="btn-back-home" title="Kembali ke Company Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="desktop-only">Website</span>
          </button>
        </div>
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

function handleRoleChange(newRole) {
  actions.switchRole(newRole);
}

function goHome() {
  actions.switchRole('public');
  store.activePublicPage = 'home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
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
  transition: transform var(--transition-fast);
}

.brand-logo-img:hover {
  transform: scale(1.02);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all var(--transition-fast);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
}

.nav-item:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.nav-item.active {
  color: var(--color-primary-dark);
  font-weight: 700;
  background-color: var(--color-primary-soft);
  border-color: rgba(13, 77, 93, 0.15);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 14px;
  right: 14px;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* RBAC Switcher styling */
.rbac-switcher {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 4px 10px;
}

.rbac-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rbac-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #94a3b8;
}

.rbac-dot.public { background-color: #64748b; }
.rbac-dot.customer { background-color: #0d9488; }
.rbac-dot.coach { background-color: #e5a024; }
.rbac-dot.manajemen { background-color: #0d4d5d; }

.rbac-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  letter-spacing: 0.04em;
}

.rbac-select {
  border: none;
  background: transparent;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
  padding: 2px 4px;
}

.btn-header-register {
  padding: 8px 18px;
  font-size: 13.5px;
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  border: 1px solid rgba(13, 77, 93, 0.2);
  padding: 7px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-back-home:hover {
  background-color: var(--color-primary);
  color: #ffffff;
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
  .brand-sub {
    display: none;
  }
}
</style>
