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
        <!-- MODE 1: GUEST / PUBLIC VISITOR (Clean Navigation) -->
        <template v-if="!store.authToken || !store.currentUser">
          <button 
            @click="$emit('open-register')" 
            class="btn-gold btn-header-register"
          >
            <span>Daftar Sekarang</span>
          </button>
        </template>

        <!-- MODE 2: AUTHENTICATED USER BROWSING PUBLIC WEBSITE -->
        <template v-else-if="store.currentRole === 'public'">
          <div class="user-logged-clean">
            <button 
              @click="backToPortal" 
              class="btn-portal-pill" 
              :title="'Masuk ke Dashboard ' + getUserRoleLabel()"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard {{ getUserRoleLabel() }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <button 
              @click="handleLogout" 
              class="btn-logout-clean" 
              title="Keluar dari akun"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </template>

        <!-- MODE 3: LOGGED IN USER INSIDE RBAC PORTAL -->
        <template v-else>
          <div class="logged-in-container">
            <button 
              @click="viewPublicSite" 
              class="btn-website-pill" 
              title="Lihat Beranda Website Publik"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>Website Beranda</span>
            </button>

            <!-- User Profile Pill & Dropdown -->
            <div class="user-pill-dropdown-wrap">
              <div 
                class="user-profile-pill" 
                @click.stop="isUserMenuOpen = !isUserMenuOpen"
                :class="{ active: isUserMenuOpen }"
                title="Menu Akun Pengguna"
              >
                <div class="user-avatar-badge">
                  {{ getUserInitials(store.currentUser?.name) }}
                </div>
                <div class="user-pill-info">
                  <span class="user-pill-name">{{ getShortName(store.currentUser?.name) }}</span>
                  <span class="user-pill-role" :class="store.currentUser?.role">
                    {{ getUserRoleLabel() }}
                  </span>
                </div>
                <svg class="chevron-arrow" :class="{ open: isUserMenuOpen }" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <!-- Sleek Dropdown Popover -->
              <transition name="dropdown-anim">
                <div v-if="isUserMenuOpen" class="user-popover-menu" @click.stop>
                  <div class="popover-profile-header">
                    <div class="popover-avatar">
                      {{ getUserInitials(store.currentUser?.name) }}
                    </div>
                    <div class="popover-meta">
                      <strong class="popover-fullname">{{ store.currentUser?.name }}</strong>
                      <span class="popover-email">{{ store.currentUser?.email }}</span>
                      <span class="popover-role-tag" :class="store.currentUser?.role">
                        {{ getUserRoleLabel() }}
                      </span>
                    </div>
                  </div>

                  <div class="popover-divider"></div>

                  <div class="popover-actions">
                    <button 
                      @click="viewPublicSite(); isUserMenuOpen = false" 
                      class="popover-item"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>Halaman Beranda Website</span>
                    </button>

                    <button 
                      @click="handleLogout(); isUserMenuOpen = false" 
                      class="popover-item danger"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Keluar Akun (Logout)</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store, actions } from '../data/store.js';

const emit = defineEmits(['open-register', 'open-login', 'logout']);

const isUserMenuOpen = ref(false);

function closeMenuOnClickOutside(e) {
  const el = document.querySelector('.user-pill-dropdown-wrap');
  if (el && !el.contains(e.target)) {
    isUserMenuOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', closeMenuOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenuOnClickOutside);
});

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
  if (store.authToken && store.currentUser?.role) {
    store.currentRole = store.currentUser.role;
  } else {
    emit('open-login');
  }
}

function handleLogout() {
  actions.logout();
  emit('logout');
}

function getShortName(name) {
  if (!name) return 'Akun';
  const clean = name.replace(/&.*$/g, '').trim();
  const parts = clean.split(' ');
  return parts[0] || clean;
}

function getUserInitials(name) {
  if (!name) return 'U';
  const clean = name.replace(/&.*$/g, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

function getUserRoleLabel() {
  const role = store.currentUser?.role;
  if (role === 'manajemen') return 'Admin';
  if (role === 'coach') return 'Coach';
  if (role === 'customer') return 'Wali Murid';
  return 'Member';
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

/* User Logged in Clean mode on Public Site */
.user-logged-clean {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-logout-clean {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-clean:hover {
  background: #ffe4e6;
  border-color: #fda4af;
  color: #be123c;
  transform: translateY(-1px);
}

/* Logged In Container */
.logged-in-container {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.btn-portal-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0d4d5d 0%, #09343f 100%);
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.2);
  transition: all 0.2s ease;
}

.btn-portal-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(13, 77, 93, 0.3);
  background: linear-gradient(135deg, #0f5b6e 0%, #0d4d5d 100%);
}

.btn-website-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-website-pill:hover {
  background: #ffffff;
  border-color: #0d4d5d;
  color: #0d4d5d;
}

/* User Pill Trigger */
.user-pill-dropdown-wrap {
  position: relative;
}

.user-profile-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 6px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.user-profile-pill:hover,
.user-profile-pill.active {
  background: #ffffff;
  border-color: #0d4d5d;
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.12);
}

.user-avatar-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d4d5d 0%, #1a7185 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(13, 77, 93, 0.25);
  flex-shrink: 0;
}

.user-pill-info {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-pill-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.user-pill-role {
  font-size: 10.5px;
  font-weight: 700;
  color: #0d4d5d;
}

.user-pill-role.manajemen {
  color: #0369a1;
}

.user-pill-role.coach {
  color: #b45309;
}

.user-pill-role.customer {
  color: #0f766e;
}

.chevron-arrow {
  color: #64748b;
  transition: transform 0.2s ease;
}

.chevron-arrow.open {
  transform: rotate(180deg);
}

/* Dropdown Popover */
.user-popover-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(15, 23, 42, 0.05);
  z-index: 9999;
  padding: 14px;
  animation: popoverFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popoverFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.popover-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
}

.popover-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d4d5d 0%, #1a7185 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.popover-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popover-fullname {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popover-email {
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popover-role-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
  margin-top: 4px;
  background: #f1f5f9;
  color: #475569;
}

.popover-role-tag.manajemen {
  background: #e0f2fe;
  color: #0369a1;
}

.popover-role-tag.coach {
  background: #fef3c7;
  color: #b45309;
}

.popover-role-tag.customer {
  background: #ccfbf1;
  color: #0f766e;
}

.popover-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
}

.popover-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popover-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.popover-item:hover {
  background: #f8fafc;
  color: #0d4d5d;
}

.popover-item.primary {
  color: #0d4d5d;
  font-weight: 700;
}

.popover-item.primary:hover {
  background: #f0fdfa;
}

.popover-item.danger {
  color: #dc2626;
}

.popover-item.danger:hover {
  background: #fef2f2;
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
