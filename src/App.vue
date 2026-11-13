<template>
  <!-- DEDICATED LOGIN GATEWAY (/login) -->
  <LoginPage 
    v-if="currentRoute === 'login'" 
    @navigate-home="navigateToHome" 
    @open-register="handleOpenRegister" 
    @login-success="handleLoginSuccess" 
  />

  <!-- MAIN APP (HOME / RBAC PORTAL) -->
  <div v-else class="app-container" :class="{ 'portal-mode': store.currentRole !== 'public' }">
    <!-- Master Header & Nav -->
    <HeaderNav 
      @open-register="handleOpenRegister" 
      @open-login="navigateToLogin" 
      @logout="handleLogout" 
    />

    <!-- MAIN VIEW AREA -->
    <!-- VIEW A: PUBLIC COMPANY PROFILE -->
    <main v-if="store.currentRole === 'public'" class="site-content">
      <CompanyProfile @open-register="handleOpenRegister" />
    </main>

    <!-- VIEW B: RBAC PORTAL (CUSTOMER / COACH / MANAJEMEN) - STRICT AUTH GUARD -->
    <div v-else-if="store.authToken && store.currentUser" class="portal-layout">
      <!-- Mobile Sticky Portal Top Bar (only visible on mobile screens <= 900px) -->
      <div class="portal-mobile-topbar">
        <div class="mobile-topbar-info">
          <span class="mobile-role-tag">{{ currentRoleInfo.roleName }}</span>
          <h4 class="mobile-active-menu-title">{{ currentActiveMenuTitle }}</h4>
        </div>
        <button 
          type="button" 
          @click="isMobileSidebarOpen = !isMobileSidebarOpen" 
          class="btn-mobile-sidebar-toggle"
          aria-label="Toggle Menu Navigasi"
        >
          <svg v-if="!isMobileSidebarOpen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>{{ isMobileSidebarOpen ? 'Tutup' : 'Menu' }}</span>
        </button>
      </div>

      <!-- Backdrop for Mobile Drawer -->
      <div 
        v-if="isMobileSidebarOpen" 
        class="portal-mobile-backdrop" 
        @click="isMobileSidebarOpen = false"
      ></div>

      <!-- Dynamic RBAC Sidebar with Hierarchical Grouping for Management -->
      <aside class="portal-sidebar" :class="{ 'mobile-open': isMobileSidebarOpen }">
        <!-- Role Identifier Box -->
        <div class="sidebar-role-badge">
          <span class="role-badge-label">Peran Aktif:</span>
          <h4 class="role-badge-name">{{ currentRoleInfo.roleName }}</h4>
        </div>

        <!-- HIERARCHICAL GROUPED SIDEBAR FOR MANAJEMEN -->
        <!-- PROFESSIONAL MANAGEMENT SIDEBAR (CLEAN ENTERPRISE ARCHITECTURE) -->
        <!-- HIERARCHICAL GROUPED SIDEBAR FOR MANAJEMEN -->
        <nav v-if="store.currentRole === 'manajemen'" class="sidebar-nav">
          <!-- SECTION 1: RINGKASAN & OVERVIEW -->
          <div class="sidebar-section-divider">
            <span class="sidebar-section-title">Ringkasan</span>
          </div>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_overview' }"
            @click="switchMenu('m_overview')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1"></rect>
              <rect x="14" y="3" width="7" height="5" rx="1"></rect>
              <rect x="14" y="12" width="7" height="9" rx="1"></rect>
              <rect x="3" y="16" width="7" height="5" rx="1"></rect>
            </svg>
            <span class="nav-title">Ringkasan Eksekutif</span>
          </button>

          <!-- SECTION 2: MASTER AKADEMIK & FASILITAS -->
          <div class="sidebar-section-divider">
            <span class="sidebar-section-title">Akademik & Fasilitas</span>
          </div>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_products' }"
            @click="switchMenu('m_products')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span class="nav-title">Master Program Pelatihan</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_locations' }"
            @click="switchMenu('m_locations')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="nav-title">Master Lokasi & Geofence</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_packages' }"
            @click="switchMenu('m_packages')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span class="nav-title">Paket Kursus & Biaya</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_coaches' }"
            @click="switchMenu('m_coaches')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="nav-title">Daftar Instruktur</span>
          </button>

          <!-- SECTION 3: OPERASIONAL & SISWA -->
          <div class="sidebar-section-divider">
            <span class="sidebar-section-title">Operasional & Siswa</span>
          </div>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_students' }"
            @click="switchMenu('m_students')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span class="nav-title">Data Siswa & Wali</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_schedules' }"
            @click="switchMenu('m_schedules')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="nav-title">Jadwal & Sesi Latihan</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_attendance' }"
            @click="switchMenu('m_attendance')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="nav-title">Monitoring Kehadiran Coach</span>
          </button>

          <!-- SECTION 4: KEUANGAN & SISTEM -->
          <div class="sidebar-section-divider">
            <span class="sidebar-section-title">Keuangan & Sistem</span>
          </div>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_payments' }"
            @click="switchMenu('m_payments')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span class="nav-title">Keuangan & Tagihan</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_website' }"
            @click="switchMenu('m_website')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="nav-title">Profil & Website CMS</span>
          </button>

          <button 
            class="sidebar-nav-item" 
            :class="{ active: store.activePortalMenu === 'm_rbac' }"
            @click="switchMenu('m_rbac')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span class="nav-title">Pengaturan Akses (RBAC)</span>
          </button>
        </nav>

        <!-- SIDEBAR FOR CUSTOMER & COACH -->
        <nav v-else class="sidebar-nav">
          <button 
            v-for="menu in allowedSidebarMenus" 
            :key="menu.id"
            @click="switchMenu(menu.id)"
            class="sidebar-nav-item"
            :class="{ active: store.activePortalMenu === menu.id }"
          >
            <component :is="menu.icon" class="nav-svg" />
            <span class="nav-title">{{ menu.label }}</span>
          </button>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <button @click="actions.openChangePasswordModal()" class="btn-sidebar-home" title="Ganti Kata Sandi Akun" style="margin-bottom: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Ubah Kata Sandi</span>
          </button>
          <button v-if="store.currentRole === 'manajemen'" @click="viewWebsite" class="btn-sidebar-home" title="Lihat Tampilan Website Publik">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Tampilan Website Publik</span>
          </button>
          <button @click="handleLogout" class="btn-sidebar-logout" title="Keluar dari akun">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      <!-- Portal Content Body -->
      <main class="portal-main">
        <!-- Render Customer Portal -->
        <PortalCustomer 
          v-if="store.currentRole === 'customer'" 
          :active-menu="store.activePortalMenu" 
          @change-menu="store.activePortalMenu = $event" 
        />

        <!-- Render Coach Portal -->
        <PortalCoach 
          v-else-if="store.currentRole === 'coach'" 
          :active-menu="store.activePortalMenu" 
          @change-menu="store.activePortalMenu = $event" 
        />

        <!-- Render Manajemen Portal -->
        <PortalManajemen 
          v-else-if="store.currentRole === 'manajemen'" 
          :active-menu="store.activePortalMenu" 
          @change-menu="store.activePortalMenu = $event" 
        />
      </main>
    </div>

    <!-- Mobile Bottom Navigation Bar (Thumb Friendly for Smartphone Users) -->
    <nav v-if="store.authToken && store.currentUser && store.currentRole !== 'public'" class="portal-mobile-bottom-nav">
      <!-- Customer Bottom Nav -->
      <template v-if="store.currentRole === 'customer'">
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'c_overview' }"
          @click="switchMenu('c_overview')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
          <span>Ringkasan</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'c_progress' }"
          @click="switchMenu('c_progress')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>Progress</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'c_schedule' }"
          @click="switchMenu('c_schedule')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Jadwal</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'c_billing' }"
          @click="switchMenu('c_billing')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <span>Tagihan</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: isMobileSidebarOpen }"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>Semua Menu</span>
        </button>
      </template>

      <!-- Coach Bottom Nav -->
      <template v-else-if="store.currentRole === 'coach'">
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'co_overview' }"
          @click="switchMenu('co_overview')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
          <span>Dashboard</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'co_attendance' }"
          @click="switchMenu('co_attendance')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Presensi</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'co_schedule' }"
          @click="switchMenu('co_schedule')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Jadwal</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'co_input_progress' }"
          @click="switchMenu('co_input_progress')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Raport</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: isMobileSidebarOpen }"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>Menu</span>
        </button>
      </template>

      <!-- Manajemen Bottom Nav -->
      <template v-else-if="store.currentRole === 'manajemen'">
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'm_overview' }"
          @click="switchMenu('m_overview')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
          <span>Overview</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'm_students' }"
          @click="switchMenu('m_students')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          <span>Siswa</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'm_payments' }"
          @click="switchMenu('m_payments')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <span>Keuangan</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: store.activePortalMenu === 'm_attendance' }"
          @click="switchMenu('m_attendance')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Presensi</span>
        </button>
        <button 
          class="bottom-nav-item" 
          :class="{ active: isMobileSidebarOpen }"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>Semua Menu</span>
        </button>
      </template>
    </nav>

    <!-- Real Authentication Login Modal -->
    <LoginModal 
      v-if="store.isLoginModalOpen" 
      @close="actions.closeLoginModal()" 
      @open-register="handleOpenRegister" 
    />

    <!-- Registration Modal -->
    <RegistrationModal 
      v-if="isRegisterOpen" 
      :initial-product-id="selectedRegisterProductId"
      :initial-package-id="selectedRegisterPackageId"
      @close="isRegisterOpen = false" 
      @go-to-portal="handleRegistrationGoToPortal"
    />

    <!-- Global High-End Modal Alert (Replaces all Windows Alerts) -->
    <AlertModal />

    <!-- Forgot Password Modal (WhatsApp OTP Verification & Reset) -->
    <ForgotPasswordModal 
      v-if="store.isForgotPasswordModalOpen" 
      @close="actions.closeForgotPasswordModal()" 
    />

    <!-- Change Password Modal (For logged in users) -->
    <ChangePasswordModal 
      v-if="store.isChangePasswordModalOpen" 
      @close="actions.closeChangePasswordModal()" 
    />

    <!-- Public Website Promo Poster Pop-up Modal -->
    <PromoModal 
      v-if="store.currentRole === 'public' && isPromoModalOpen && store.promoBanner?.isActive && store.promoBanner?.imageUrl" 
      @close="isPromoModalOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onUnmounted, watch } from 'vue';
import { store, actions } from './data/store.js';
import HeaderNav from './components/HeaderNav.vue';
import CompanyProfile from './components/CompanyProfile.vue';
import RegistrationModal from './components/RegistrationModal.vue';
import LoginModal from './components/LoginModal.vue';
import LoginPage from './components/LoginPage.vue';
import ForgotPasswordModal from './components/ForgotPasswordModal.vue';
import ChangePasswordModal from './components/ChangePasswordModal.vue';
import PromoModal from './components/PromoModal.vue';
import AlertModal from './components/AlertModal.vue';
import PortalCustomer from './components/PortalCustomer.vue';
import PortalCoach from './components/PortalCoach.vue';
import PortalManajemen from './components/PortalManajemen.vue';

const isRegisterOpen = ref(false);
const isPromoModalOpen = ref(true);
const selectedRegisterProductId = ref('');
const selectedRegisterPackageId = ref('');
const currentRoute = ref('home');

function detectRoute() {
  // If user is already authenticated and has a valid role, NEVER show login page!
  if (store.authToken && store.currentUser && store.currentRole !== 'public') {
    return 'home';
  }

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.endsWith('/login') || path === '/login' || hash === '#/login' || hash.startsWith('#/login')) {
    return 'login';
  }
  return 'home';
}

function syncRoute() {
  currentRoute.value = detectRoute();

  // If in authenticated portal mode:
  if (store.currentRole !== 'public' && store.authToken && store.currentUser) {
    // If pathname was '/login' or hash was '#/login', clean it up to root portal URL immediately
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const targetMenu = store.activePortalMenu || actions.getInitialPortalMenu(store.currentRole);

    if (path === '/login' || path.endsWith('/login') || hash === '#/login' || hash.startsWith('#/login')) {
      try {
        window.history.replaceState(null, '', `/#/portal/${targetMenu}`);
      } catch (e) {}
    }

    // Check if hash contains a specific menu
    const currentHash = window.location.hash || '';
    const match = currentHash.match(/#(?:(?:\/portal\/)|(?:\/))([a-z0-9_]+)/i);
    if (match && match[1]) {
      let menuId = match[1].toLowerCase();
      if (menuId === 'c_finance' || menuId === 'c_payments') menuId = 'c_billing';
      if (actions.isMenuValidForRole(menuId, store.currentRole)) {
        if (store.activePortalMenu !== menuId) {
          store.activePortalMenu = menuId;
        }
      }
    } else {
      // Ensure current activePortalMenu matches this role
      if (!actions.isMenuValidForRole(store.activePortalMenu, store.currentRole)) {
        store.activePortalMenu = actions.getInitialPortalMenu(store.currentRole);
      }
    }
    return;
  }

  // Strict Auth Guard: If in portal mode without valid JWT auth, force to login
  if (store.currentRole !== 'public' && (!store.authToken || !store.currentUser)) {
    store.currentRole = 'public';
    navigateToLogin();
    return;
  }
}

// Watch activePortalMenu: keep in localStorage and sync with URL hash
watch(
  () => store.activePortalMenu,
  (newMenu) => {
    if (!newMenu || store.currentRole === 'public') return;
    try {
      localStorage.setItem('mine_skills_active_portal_menu_v2', newMenu);
      const targetUrl = `/#/portal/${newMenu}`;
      if (window.location.pathname !== '/' || window.location.hash !== `#/portal/${newMenu}`) {
        window.history.replaceState(null, '', targetUrl);
      }
    } catch (e) {}
  },
  { immediate: true }
);

function navigateToLogin() {
  currentRoute.value = 'login';
  try {
    const isVercelOrRoot = window.location.pathname === '/' || window.location.pathname === '/login';
    if (isVercelOrRoot) {
      window.history.pushState(null, '', '/login');
    } else {
      window.location.hash = '#/login';
    }
  } catch (e) {
    window.location.hash = '#/login';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToHome() {
  currentRoute.value = 'home';
  store.currentRole = 'public';
  try {
    window.history.pushState(null, '', '/');
  } catch (e) {
    window.location.hash = '';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleLoginSuccess(user) {
  currentRoute.value = 'home';
  store.currentRole = user.role;
  const initialMenu = actions.getInitialPortalMenu(user.role);
  store.activePortalMenu = initialMenu;
  try {
    window.history.replaceState(null, '', `/#/portal/${initialMenu}`);
  } catch (e) {
    window.location.hash = `#/portal/${initialMenu}`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRegistrationGoToPortal(user) {
  isRegisterOpen.value = false;
  currentRoute.value = 'home';
  try {
    window.history.replaceState(null, '', '/#/portal/c_billing');
  } catch (e) {
    window.location.hash = '#/portal/c_billing';
  }
  if (user) {
    actions.directLoginUser(user, 'c_billing');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  syncRoute();
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('hashchange', syncRoute);
});

onUnmounted(() => {
  window.removeEventListener('popstate', syncRoute);
  window.removeEventListener('hashchange', syncRoute);
});

function handleOpenRegister(productId = '', packageId = '') {
  selectedRegisterProductId.value = productId || (store.products[0]?.id || '');
  selectedRegisterPackageId.value = packageId || '';
  isRegisterOpen.value = true;
}

function viewWebsite() {
  store.currentRole = 'public';
  store.activePublicPage = 'home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleLogout() {
  actions.logout();
  navigateToLogin();
}

const openGroups = ref({
  cms: true,
  products: true,
  coaches: true,
  crm: true,
  payments: true,
  rbac: false
});

function toggleGroup(key) {
  openGroups.value[key] = !openGroups.value[key];
}

const currentRoleInfo = computed(() => {
  return store.rbacMatrix[store.currentRole] || {
    roleName: 'Tamu / Publik',
    allowedMenus: []
  };
});

// Clean SVG Icon generators
const IconDashboard = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('rect', { x: 3, y: 3, width: 7, height: 9, rx: 1 }),
  h('rect', { x: 14, y: 3, width: 7, height: 5, rx: 1 }),
  h('rect', { x: 14, y: 12, width: 7, height: 9, rx: 1 }),
  h('rect', { x: 3, y: 16, width: 7, height: 5, rx: 1 })
]);

const IconProgress = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('line', { x1: 18, y1: 20, x2: 18, y2: 10 }),
  h('line', { x1: 12, y1: 20, x2: 12, y2: 4 }),
  h('line', { x1: 6, y1: 20, x2: 6, y2: 14 })
]);

const IconCalendar = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
  h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
  h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
  h('line', { x1: 3, y1: 10, x2: 21, y2: 10 })
]);

const IconAward = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('circle', { cx: 12, cy: 8, r: 7 }),
  h('polyline', { points: '8.21 13.89 7 23 12 20 17 23 15.79 13.88' })
]);

const IconBilling = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 2, ry: 2 }),
  h('line', { x1: 1, y1: 10, x2: 23, y2: 10 })
]);

const IconInput = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
  h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
]);

const IconUsers = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: 9, cy: 7, r: 4 }),
  h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
  h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
]);

const IconCheck = () => h('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
  h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
  h('polyline', { points: '22 4 12 14.01 9 11.01' })
]);

const allMenusMap = {
  c_overview: { id: 'c_overview', label: 'Ringkasan Siswa', icon: IconDashboard },
  c_progress: { id: 'c_progress', label: 'Perkembangan Anak', icon: IconProgress },
  c_schedule: { id: 'c_schedule', label: 'Jadwal Sesi', icon: IconCalendar },
  c_certificates: { id: 'c_certificates', label: 'Sertifikat & Reward', icon: IconAward },
  c_billing: { id: 'c_billing', label: 'Tagihan & Pembayaran', icon: IconBilling },

  co_overview: { id: 'co_overview', label: 'Dashboard Coach', icon: IconDashboard },
  co_input_progress: { id: 'co_input_progress', label: 'Input Perkembangan', icon: IconInput },
  co_schedule: { id: 'co_schedule', label: 'Jadwal Mengajar', icon: IconCalendar },
  co_attendance: { id: 'co_attendance', label: 'Presensi Kehadiran', icon: IconCheck },
  co_students: { id: 'co_students', label: 'Siswa Binaan', icon: IconUsers }
};

const allowedSidebarMenus = computed(() => {
  const role = store.currentRole;
  if (role === 'public') return [];
  const matrix = store.rbacMatrix[role];
  if (!matrix) return [];

  return matrix.allowedMenus.map(mId => allMenusMap[mId]).filter(Boolean);
});

// Mobile Responsive Navigation State & Helpers
const isMobileSidebarOpen = ref(false);

const mgmtLabels = {
  m_overview: 'Ringkasan Eksekutif',
  m_products: 'Master Program',
  m_locations: 'Master Lokasi & Geofence',
  m_packages: 'Paket Kursus & Biaya',
  m_coaches: 'Daftar Instruktur',
  m_students: 'Data Siswa & Wali',
  m_schedules: 'Jadwal & Sesi Latihan',
  m_attendance: 'Monitoring Presensi',
  m_payments: 'Keuangan & Mutasi',
  m_website: 'Profil & CMS Web',
  m_rbac: 'Pengaturan Akses'
};

const currentActiveMenuTitle = computed(() => {
  const m = store.activePortalMenu;
  if (!m) return 'Portal';
  if (allMenusMap[m]) return allMenusMap[m].label;
  if (mgmtLabels[m]) return mgmtLabels[m];
  return 'Menu Portal';
});

function switchMenu(menuId) {
  store.activePortalMenu = menuId;
  isMobileSidebarOpen.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
/* Role Quick Bar */
.role-bar {
  background-color: #0d4d5d;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  font-size: 12.5px;
}

.role-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.role-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.role-bar-title {
  font-weight: 700;
  color: #c9e1e7;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.role-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.role-chip {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.role-chip:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.role-chip.active {
  background-color: #e5a024;
  color: #1a1600;
  border-color: #e5a024;
  font-weight: 700;
}

.user-active-txt {
  font-size: 12px;
  color: #c9e1e7;
}

.user-active-txt strong {
  color: #ffffff;
}

/* Sidebar */
.portal-sidebar {
  width: 270px;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-role-badge {
  background-color: var(--color-primary-soft);
  border: 1px solid rgba(13, 77, 93, 0.2);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  margin-bottom: 16px;
}

.role-badge-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-subtle);
  letter-spacing: 0.05em;
}

.role-badge-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 2px;
}

/* Accordion for Management */
.sidebar-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.menu-group {
  border-bottom: 1px solid #f1f5f4;
  padding-bottom: 6px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: var(--radius-xs);
  user-select: none;
}

.group-header:hover {
  background-color: var(--bg-subtle);
}

.group-title {
  font-size: 10.5px;
  font-weight: 800;
  color: var(--text-subtle);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.group-caret {
  font-size: 11px;
  color: var(--text-subtle);
}

.group-submenus {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 6px;
  margin-top: 4px;
}

.sub-nav-item {
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: left;
  transition: all var(--transition-fast);
}

.sub-nav-item:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.sub-nav-item.active {
  background-color: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
}

.highlight-sub {
  color: var(--color-primary);
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  overflow-y: auto;
}

.sidebar-section-divider {
  padding: 10px 10px 4px;
  margin-top: 6px;
}

.sidebar-section-title {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  display: block;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all var(--transition-fast);
  text-align: left;
}

.sidebar-nav-item:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.sidebar-nav-item.active {
  background-color: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}

.btn-sidebar-home {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-subtle);
  cursor: pointer;
}

.btn-sidebar-home:hover {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.btn-sidebar-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  color: #b91c1c;
  border: 1px solid #fecaca;
  background-color: #fef2f2;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.2s ease;
}

.btn-sidebar-logout:hover {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

/* Mobile Portal Topbar & Bottom Nav (Default: Hidden on Desktop) */
.portal-mobile-topbar {
  display: none;
}

.portal-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  z-index: 95;
}

.portal-mobile-bottom-nav {
  display: none;
}

@media (max-width: 1024px) {
  .portal-mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 90;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .mobile-topbar-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mobile-role-tag {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-primary, #0d4d5d);
  }

  .mobile-active-menu-title {
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .btn-mobile-sidebar-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-mobile-sidebar-toggle:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  /* Off-canvas sidebar drawer on mobile & tablet */
  .portal-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 290px;
    max-width: 85vw;
    height: 100vh;
    background: #ffffff;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px 14px 90px;
  }

  .portal-sidebar.mobile-open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .portal-mobile-bottom-nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    z-index: 85;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    padding: 0 4px;
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 100%;
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 4px 2px;
  }

  .bottom-nav-item svg {
    transition: transform 0.15s ease;
  }

  .bottom-nav-item:hover {
    color: var(--color-primary, #0d4d5d);
  }

  .bottom-nav-item.active {
    color: var(--color-primary, #0d4d5d);
    font-weight: 800;
  }

  .bottom-nav-item.active svg {
    stroke: var(--color-primary, #0d4d5d);
    stroke-width: 2.5;
    transform: scale(1.08);
  }
}
</style>
