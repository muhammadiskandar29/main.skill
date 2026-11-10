<template>
  <div class="login-page-wrapper">
    <!-- BACKGROUND AMBIENT GLOW MESH -->
    <div class="ambient-mesh">
      <div class="mesh-orb orb-teal"></div>
      <div class="mesh-orb orb-gold"></div>
      <div class="mesh-orb orb-blue"></div>
      <div class="mesh-grid"></div>
    </div>

    <!-- 1. IKLAN BERJALAN / RUNNING NEWS TICKER (SMOOTH INFINITE MARQUEE) -->
    <div class="running-ticker-bar">
      <div class="ticker-badge">
        <span class="ticker-pulse"></span>
        <span class="ticker-badge-text">PENGUMUMAN RESMI</span>
      </div>
      <div class="ticker-track-wrap">
        <div class="ticker-track">
          <div class="ticker-group">
            <span class="ticker-item"><strong class="ticker-tag">[ Akademi Renang ]</strong> Pembukaan Pendaftaran Semester Baru — Rasio Eksklusif 1 Instruktur : 3 Siswa</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Registrasi Awal ]</strong> Potongan Biaya Program untuk Pendaftaran Periode Berjalan</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Seni Tari & Gerak ]</strong> Kurikulum Olah Tubuh, Keluwesan, dan Koreografi Terstruktur</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Evaluasi Digital ]</strong> Pemantauan Kemampuan Siswa & Validasi Presensi Geofencing Instruktur Real-Time</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Akreditasi Mutu ]</strong> Indeks Kepuasan 99.4% Dipercaya Lebih dari 1.200 Wali Murid</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Layanan Informasi ]</strong> Layanan Konsultasi Akademik WhatsApp: 0852-8627-4726</span>
            <span class="ticker-sep">•</span>
          </div>
          <!-- Duplicate for seamless loop -->
          <div class="ticker-group" aria-hidden="true">
            <span class="ticker-item"><strong class="ticker-tag">[ Akademi Renang ]</strong> Pembukaan Pendaftaran Semester Baru — Rasio Eksklusif 1 Instruktur : 3 Siswa</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Registrasi Awal ]</strong> Potongan Biaya Program untuk Pendaftaran Periode Berjalan</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Seni Tari & Gerak ]</strong> Kurikulum Olah Tubuh, Keluwesan, dan Koreografi Terstruktur</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Evaluasi Digital ]</strong> Pemantauan Kemampuan Siswa & Validasi Presensi Geofencing Instruktur Real-Time</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Akreditasi Mutu ]</strong> Indeks Kepuasan 99.4% Dipercaya Lebih dari 1.200 Wali Murid</span>
            <span class="ticker-sep">•</span>
            <span class="ticker-item"><strong class="ticker-tag">[ Layanan Informasi ]</strong> Layanan Konsultasi Akademik WhatsApp: 0852-8627-4726</span>
            <span class="ticker-sep">•</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. COMPACT HEADER BAR -->
    <header class="portal-header">
      <div class="portal-header-container">
        <a href="javascript:void(0)" @click="goToHome" class="header-logo-wrap" title="Kembali ke Beranda mine.skills">
          <img 
            :src="store.brand.logoPath || '/images/mine-skills-logo.png'" 
            alt="mine.skills Logo" 
            class="header-logo-img" 
          />
          <div class="logo-divider"></div>
          <span class="header-portal-label">Portal Akses Terpadu</span>
        </a>

        <div class="header-actions">
          <button @click="goToHome" class="btn-back-clean" title="Kembali ke Halaman Depan">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Website Beranda</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 3. MAIN CONTENT: RESPONSIVE 2-COLUMN SPLIT PORTAL -->
    <main class="portal-main-area">
      <div class="portal-grid">
        
        <!-- LEFT PANEL: INTERACTIVE BRAND SHOWCASE & CAROUSEL -->
        <section class="showcase-panel">
          <div class="showcase-content">
            <!-- Top Tag -->
            <div class="showcase-badge">
              <span class="badge-dot"></span>
              <span>Platform Manajemen Akademi & Kursus Anak</span>
            </div>

            <h1 class="showcase-title">
              Membangun Potensi & Prestasi Anak Sejak Dini.
            </h1>
            <p class="showcase-subtitle">
              Satu portal terintegrasi untuk Wali Murid memantau perkembangan, Pelatih mencatat presensi, dan Manajemen mengelola operasional secara transparan.
            </p>

            <!-- INTERACTIVE SHOWCASE SLIDER -->
            <div class="feature-slider-card">
              <div class="slider-header">
                <span class="slider-tag">{{ activeSlide.category }}</span>
                <div class="slider-dots">
                  <button 
                    v-for="(slide, idx) in slides" 
                    :key="idx" 
                    class="dot" 
                    :class="{ active: currentSlideIdx === idx }"
                    @click="setSlide(idx)"
                    :title="slide.title"
                  ></button>
                </div>
              </div>

              <div class="slider-body">
                <div class="slider-icon-box">
                  <svg v-if="activeSlide.type === 'swimming'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 20c1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0 1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0 1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0"></path>
                    <path d="M2 16c1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0 1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0 1.25-.5 2.5-.5 3.75 0 1.25.5 2.5.5 3.75 0"></path>
                    <circle cx="16" cy="7" r="2.5"></circle>
                    <path d="M9 13l3.5-3.5L16 11l3-2"></path>
                  </svg>
                  <svg v-else-if="activeSlide.type === 'dance'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                    <path d="M9 10l-3 4 3 2-2 6"></path>
                    <path d="M15 10l3 4-3 2 2 6"></path>
                  </svg>
                  <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div class="slider-text">
                  <h3 class="slide-headline">{{ activeSlide.title }}</h3>
                  <p class="slide-desc">{{ activeSlide.desc }}</p>
                  <div class="slide-highlight-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{{ activeSlide.highlight }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- MINI METRICS STATS BAR -->
            <div class="metrics-row">
              <div class="metric-box">
                <span class="metric-val">1,500+</span>
                <span class="metric-lbl">Siswa Aktif</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-box">
                <span class="metric-val">40+</span>
                <span class="metric-lbl">Instruktur Resmi</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-box">
                <span class="metric-val">15+</span>
                <span class="metric-lbl">Fasilitas Lokasi</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-box">
                <span class="metric-val">99.4%</span>
                <span class="metric-lbl">Indeks Kepuasan</span>
              </div>
            </div>

            <!-- MINI TESTIMONIAL CHIP -->
            <div class="mini-testimonial">
              <div class="parent-avatar font-bold" style="background: var(--color-primary-soft); color: var(--color-primary); font-size: 13px;">SR</div>
              <div class="testimonial-body">
                <div class="stars" style="display: flex; gap: 3px; color: #f59e0b;">
                  <svg v-for="s in 5" :key="s" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <p class="quote">"Raport digital & presensi tervalidasi pelatih membuat jadwal latihan anak terpantau secara teratur dan transparan."</p>
                <span class="author">— Bunda Sarah, Wali Murid Kenzo</span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT PANEL: COMPACT, BALANCED, ULTRA-RESPONSIVE LOGIN CARD -->
        <section class="login-panel">
          <div class="login-card">
            <!-- Card Header -->
            <div class="card-head">
              <div class="security-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Autentikasi Aman Terenkripsi</span>
              </div>
              <h2 class="card-title">Masuk ke Portal</h2>
              <p class="card-desc">Pilih otorisasi akun Anda untuk mengakses dashboard sistem.</p>
            </div>

            <!-- INTERACTIVE ROLE SWITCHER -->
            <div class="role-selector" role="tablist">
              <button 
                type="button" 
                class="role-btn" 
                :class="{ active: activeRoleTab === 'customer' }"
                @click="selectRoleTab('customer')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span class="btn-text">Wali Murid</span>
              </button>
              <button 
                type="button" 
                class="role-btn" 
                :class="{ active: activeRoleTab === 'coach' }"
                @click="selectRoleTab('coach')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                <span class="btn-text">Pelatih / Instruktur</span>
              </button>
              <button 
                type="button" 
                class="role-btn" 
                :class="{ active: activeRoleTab === 'manajemen' }"
                @click="selectRoleTab('manajemen')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span class="btn-text">Manajemen</span>
              </button>
            </div>

            <!-- ERROR ALERT -->
            <transition name="alert-slide">
              <div v-if="errorMessage" class="error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ errorMessage }}</span>
              </div>
            </transition>

            <!-- LOGIN FORM -->
            <form @submit.prevent="handleLoginSubmit" class="form-container">
              <!-- Email Input -->
              <div class="field-wrap">
                <div class="field-label-row">
                  <label class="field-label">Alamat Email Terdaftar</label>
                  <span class="field-role-tag" :class="activeRoleTab">Akun {{ getRoleName(activeRoleTab) }}</span>
                </div>
                <div class="input-shell" :class="{ focused: isEmailFocused }">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input 
                    v-model="email" 
                    type="email" 
                    class="clean-input" 
                    placeholder="nama@email.com" 
                    required 
                    autocomplete="username"
                    @focus="isEmailFocused = true"
                    @blur="isEmailFocused = false"
                  />
                </div>
              </div>

              <!-- Password Input -->
              <div class="field-wrap">
                <div class="field-label-row">
                  <label class="field-label">Kata Sandi</label>
                  <span class="demo-tag">Default demo: <strong>123</strong></span>
                </div>
                <div class="input-shell" :class="{ focused: isPassFocused }">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    v-model="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="clean-input with-toggle" 
                    placeholder="Masukkan kata sandi..." 
                    required 
                    autocomplete="current-password"
                    @focus="isPassFocused = true"
                    @blur="isPassFocused = false"
                  />
                  <button 
                    type="button" 
                    class="eye-btn" 
                    @click="showPassword = !showPassword"
                    :title="showPassword ? 'Sembunyikan' : 'Lihat'"
                    tabindex="-1"
                  >
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

              <!-- Submit Button -->
              <button type="submit" :disabled="isLoading" class="btn-primary-action">
                <span v-if="isLoading" class="loading-state">
                  <span class="spinner-circle"></span>
                  <span>Memverifikasi Akses JWT...</span>
                </span>
                <span v-else class="ready-state">
                  <span>Masuk Dashboard {{ getRoleName(activeRoleTab) }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </button>
            </form>

            <!-- FAST 1-CLICK DEMO ACCOUNT SELECTOR -->
            <div class="fast-demo-box">
              <div class="fast-demo-title">
                <span>Pilih Cepat Akun Demo (1-Klik)</span>
              </div>
              <div class="fast-pills">
                <button 
                  type="button" 
                  class="demo-pill" 
                  :class="{ active: activeRoleTab === 'customer' }"
                  @click="selectRoleTab('customer')"
                  title="Akses Demo Akun Wali Murid"
                >
                  <span class="pill-ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <div class="pill-meta">
                    <strong>Bunda Sarah</strong>
                    <small>Wali Murid</small>
                  </div>
                </button>

                <button 
                  type="button" 
                  class="demo-pill" 
                  :class="{ active: activeRoleTab === 'coach' }"
                  @click="selectRoleTab('coach')"
                  title="Akses Demo Akun Instruktur"
                >
                  <span class="pill-ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                  </span>
                  <div class="pill-meta">
                    <strong>Coach Adit</strong>
                    <small>Instruktur</small>
                  </div>
                </button>

                <button 
                  type="button" 
                  class="demo-pill" 
                  :class="{ active: activeRoleTab === 'manajemen' }"
                  @click="selectRoleTab('manajemen')"
                  title="Akses Demo Akun Administrator"
                >
                  <span class="pill-ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                  <div class="pill-meta">
                    <strong>Admin Pusat</strong>
                    <small>Manajemen</small>
                  </div>
                </button>
              </div>
            </div>

            <!-- CARD FOOTER -->
            <div class="card-foot">
              <p>
                Belum mendaftar kursus? 
                <a href="javascript:void(0)" @click="$emit('open-register')" class="register-link" style="display: inline-flex; align-items: center; gap: 5px;">
                  <span>Daftar Siswa Baru Sekarang</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

// Interactive Feature Slider Data
const currentSlideIdx = ref(0);
const slides = [
  {
    category: 'AKADEMI RENANG',
    type: 'swimming',
    title: 'Kurikulum Bertingkat Level 1 - 4 & Rasio Terbatas',
    desc: 'Metode pengajaran aman & terukur dengan instruktur bersertifikasi PRSI / Swimming Instructor Indonesia.',
    highlight: 'Rasio Eksklusif 1 Instruktur Maksimal 3 Siswa'
  },
  {
    category: 'SENI TARI & GERAK',
    type: 'dance',
    title: 'Pengembangan Motorik, Postur Tubuh, & Eksplorasi Gerak',
    desc: 'Kelas tari anak mulai usia dini untuk melatih keluwesan, disiplin ritme, dan kepercayaan diri di atas panggung.',
    highlight: 'Pentas Seni Tahunan & Uji Sertifikasi Gerak'
  },
  {
    category: 'EVALUASI DIGITAL & PRESENSI',
    type: 'analytics',
    title: 'Pemantauan Perkembangan Siswa Secara Berkala',
    desc: 'Setiap latihan tervalidasi dengan presensi GPS pelatih dan laporan evaluasi digital berkala yang dapat diunduh resmi.',
    highlight: 'Faktur Resmi Berstempel LUNAS & E-Raport PDF'
  }
];

const activeSlide = computed(() => slides[currentSlideIdx.value]);

let slideInterval = null;

function setSlide(idx) {
  currentSlideIdx.value = idx;
}

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlideIdx.value = (currentSlideIdx.value + 1) % slides.length;
  }, 4500);

  try {
    const lastReg = localStorage.getItem('mineskills_last_registered_email');
    if (lastReg) {
      activeRoleTab.value = 'customer';
      email.value = lastReg;
      password.value = '123';
    }
  } catch (e) {}
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});

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
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

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
/* =========================================================================
   PAGE WRAPPER & AMBIENT BACKGROUND
   ========================================================================= */
.login-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #071f26;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
  color: #ffffff;
}

.ambient-mesh {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.mesh-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 40px 40px;
}

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.4;
}

.orb-teal {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #0e7490 0%, transparent 70%);
  top: -150px;
  left: -120px;
  animation: orbDrift1 18s ease-in-out infinite alternate;
}

.orb-gold {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #d97706 0%, transparent 70%);
  bottom: -150px;
  right: -80px;
  animation: orbDrift2 20s ease-in-out infinite alternate;
}

.orb-blue {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #2563eb 0%, transparent 70%);
  top: 35%;
  right: 25%;
  animation: orbDrift3 16s ease-in-out infinite alternate;
}

@keyframes orbDrift1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(80px, 100px) scale(1.1); }
}
@keyframes orbDrift2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-80px, -70px) scale(1.15); }
}
@keyframes orbDrift3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-60px, 50px) scale(0.9); }
}

/* =========================================================================
   1. RUNNING TICKER / MARQUEE BAR ("IKLAN BERJALAN")
   ========================================================================= */
.running-ticker-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #09323c 0%, #0d4653 50%, #09323c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 38px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.ticker-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: #e5a024;
  color: #05232a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  height: 100%;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.25);
}

.ticker-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b45309;
  animation: pulseBadge 1.5s infinite;
}

@keyframes pulseBadge {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 1; }
}

.ticker-track-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent);
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: tickerScroll 35s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
}

.ticker-group {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-right: 18px;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #e0f2fe;
  white-space: nowrap;
}

.ticker-item strong {
  color: #fbbf24;
  font-weight: 700;
}

.t-icon {
  font-size: 13px;
}

.ticker-sep {
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
}

@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* =========================================================================
   2. PORTAL HEADER
   ========================================================================= */
.portal-header {
  position: relative;
  z-index: 10;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 31, 38, 0.6);
  backdrop-filter: blur(12px);
}

.portal-header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.header-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.logo-divider {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
}

.header-portal-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.btn-back-clean {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back-clean:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateX(-2px);
}

/* =========================================================================
   3. MAIN CONTENT: 2-COLUMN SPLIT GRID
   ========================================================================= */
.portal-main-area {
  flex: 1;
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}

.portal-grid {
  width: 100%;
  max-width: 1180px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 36px;
  align-items: center;
}

/* =========================================================================
   LEFT PANEL: SHOWCASE & CAROUSEL
   ========================================================================= */
.showcase-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.showcase-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.showcase-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(13, 77, 93, 0.6);
  border: 1px solid rgba(45, 212, 191, 0.35);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  color: #5eead4;
  width: fit-content;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2dd4bf;
  box-shadow: 0 0 8px #2dd4bf;
}

.showcase-title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.25;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

.showcase-subtitle {
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
  max-width: 520px;
}

/* Feature Slider Card */
.feature-slider-card {
  background: rgba(13, 77, 93, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 18px 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.slider-tag {
  font-size: 10.5px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.06em;
}

.slider-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s ease;
}

.dot.active {
  width: 22px;
  background: #2dd4bf;
  box-shadow: 0 0 8px rgba(45, 212, 191, 0.6);
}

.slider-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.slider-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.big-icon {
  font-size: 26px;
}

.slider-text {
  flex: 1;
}

.slide-headline {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px 0;
}

.slide-desc {
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  margin: 0 0 8px 0;
}

.slide-highlight-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(45, 212, 191, 0.12);
  color: #2dd4bf;
  border: 1px solid rgba(45, 212, 191, 0.3);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

/* Metrics Row */
.metrics-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(5, 23, 29, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 18px;
}

.metric-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-val {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
}

.metric-lbl {
  font-size: 10.5px;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 2px;
}

.metric-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Mini Testimonial */
.mini-testimonial {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
}

.parent-avatar {
  font-size: 24px;
}

.testimonial-body .stars {
  color: #fbbf24;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 2px;
}

.testimonial-body .quote {
  font-size: 11.5px;
  color: #cbd5e1;
  margin: 3px 0 2px 0;
  font-style: italic;
  line-height: 1.4;
}

.testimonial-body .author {
  font-size: 10.5px;
  font-weight: 700;
  color: #5eead4;
}

/* =========================================================================
   RIGHT PANEL: COMPACT LOGIN CARD
   ========================================================================= */
.login-panel {
  display: flex;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  color: #0f172a;
  border-radius: 18px;
  padding: 24px 26px 20px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-head {
  margin-bottom: 16px;
}

.security-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 22px;
  font-weight: 800;
  color: #09343f;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.card-desc {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Role Selector Segmented Controls */
.role-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.role-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn:hover {
  background: rgba(255, 255, 255, 0.7);
}

.role-btn.active {
  background: #ffffff;
  border-color: rgba(13, 77, 93, 0.15);
  box-shadow: 0 2px 8px rgba(13, 77, 93, 0.12);
}

.btn-emoji {
  font-size: 14px;
}

.btn-text {
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  white-space: nowrap;
}

.role-btn.active .btn-text {
  color: #0d4d5d;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  background: #fef2f2;
  border: 1px solid #fecdd3;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;
}

.alert-slide-enter-active, .alert-slide-leave-active {
  transition: all 0.25s ease;
}
.alert-slide-enter-from, .alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Form Styles */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #1e293b;
}

.field-role-tag {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  text-transform: uppercase;
}

.field-role-tag.customer { background: #fae8ff; color: #a21caf; border: 1px solid #f0abfc; }
.field-role-tag.coach { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
.field-role-tag.manajemen { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

.demo-tag {
  font-size: 10.5px;
  color: #64748b;
}

.demo-tag strong {
  color: #0d4d5d;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.input-shell.focused {
  border-color: #0d4d5d;
  box-shadow: 0 0 0 3px rgba(13, 77, 93, 0.12);
}

.field-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-shell.focused .field-icon {
  color: #0d4d5d;
}

.clean-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  color: #0f172a;
  outline: none;
}

.clean-input.with-toggle {
  padding-right: 38px;
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-btn:hover {
  color: #0d4d5d;
}

/* Submit Action Button */
.btn-primary-action {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  background: linear-gradient(135deg, #0d4d5d 0%, #156d82 50%, #09343f 100%);
  color: #ffffff;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.3);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary-action:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 8px 20px rgba(13, 77, 93, 0.4);
  background: linear-gradient(135deg, #10596b 0%, #187a92 50%, #0d4d5d 100%);
}

.btn-primary-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.ready-state, .loading-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner-circle {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Fast 1-Click Demo Pills */
.fast-demo-box {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.fast-demo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.fast-demo-title span {
  font-size: 10.5px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fast-pills {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.demo-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 7px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.demo-pill:hover {
  background: #ffffff;
  border-color: #0d4d5d;
  box-shadow: 0 2px 6px rgba(13, 77, 93, 0.08);
}

.demo-pill.active {
  background: #ffffff;
  border-color: #e5a024;
  box-shadow: 0 0 0 1.5px #e5a024;
}

.pill-ico {
  font-size: 14px;
}

.pill-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pill-meta strong {
  font-size: 10.5px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-meta small {
  font-size: 9px;
  color: #64748b;
  white-space: nowrap;
}

/* Card Footer */
.card-foot {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.card-foot p {
  font-size: 11.5px;
  color: #64748b;
  margin: 0;
}

.register-link {
  color: #0d4d5d;
  font-weight: 700;
  text-decoration: none;
}

.register-link:hover {
  color: #e5a024;
  text-decoration: underline;
}

/* =========================================================================
   RESPONSIVE DESIGN (TABLETS & PHONES)
   ========================================================================= */
@media (max-width: 992px) {
  .portal-main-area {
    padding: 20px 16px;
  }

  .portal-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .showcase-panel {
    text-align: center;
    align-items: center;
  }

  .showcase-content {
    align-items: center;
  }

  .showcase-title {
    font-size: 24px;
  }

  .showcase-subtitle {
    font-size: 13px;
  }

  .feature-slider-card {
    max-width: 500px;
    width: 100%;
    text-align: left;
  }

  .metrics-row {
    width: 100%;
    max-width: 500px;
  }

  .mini-testimonial {
    max-width: 500px;
    width: 100%;
    text-align: left;
  }

  .login-card {
    max-width: 480px;
  }
}

@media (max-width: 540px) {
  .portal-header-container {
    padding: 0 16px;
  }

  .header-portal-label {
    display: none;
  }

  .logo-divider {
    display: none;
  }

  .showcase-panel {
    display: none; /* Hide large showcase on small mobile to give instant access to login */
  }

  .login-card {
    padding: 20px 18px 16px;
    border-radius: 14px;
  }

  .fast-pills {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .demo-pill {
    padding: 7px 10px;
  }

  .demo-pill strong {
    font-size: 11.5px;
  }

  .demo-pill small {
    font-size: 10px;
  }
}
</style>
