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
        
        <!-- LEFT PANEL: ANIMATED INFORMATIVE ACADEMY SHOWCASE -->
        <section class="showcase-panel">
          <div class="showcase-content">
            <!-- Top Tag -->
            <div class="showcase-badge">
              <span class="badge-dot"></span>
              <span>Lembaga Peningkatan Skill Terpadu & Terstruktur</span>
            </div>

            <h1 class="showcase-title">
              Membangun Potensi & Karakter Unggul Sejak Dini.
            </h1>
            <p class="showcase-subtitle">
              Satu portal terintegrasi untuk Wali Murid memantau perkembangan, Pelatih mencatat presensi tervalidasi GPS, dan Manajemen mengelola operasional secara transparan.
            </p>

            <!-- CHEERFUL & INFORMATIVE KIDS ACADEMY SHOWCASE -->
            <div class="kids-showcase-stage">
              <!-- Floating Animated Bubbles Background -->
              <div class="bubbles-ambient" aria-hidden="true">
                <span class="bubble b1"></span>
                <span class="bubble b2"></span>
                <span class="bubble b3"></span>
                <span class="bubble b4"></span>
                <span class="bubble b5"></span>
                <span class="bubble b6"></span>
              </div>

              <!-- Top Category Tabs (Interactive / Auto-cycle) -->
              <div class="kids-tabs-bar">
                <button 
                  v-for="(slide, sIdx) in funSlides" 
                  :key="slide.id" 
                  type="button" 
                  class="kids-tab-pill" 
                  :class="{ active: currentFunSlide === sIdx }"
                  @click="setFunSlide(sIdx)"
                >
                  <component :is="slide.iconSvg" />
                  <span>{{ slide.tabTitle }}</span>
                </button>
              </div>

              <!-- Active Slide Card (Fun, Playful & Informative) -->
              <transition name="slide-card-fade" mode="out-in">
                <div :key="currentFunSlide" class="fun-slide-card" :class="funSlides[currentFunSlide].themeClass">
                  <!-- Tag Chip -->
                  <div class="slide-badge-row">
                    <span class="slide-tag-chip">{{ funSlides[currentFunSlide].badge }}</span>
                    <span v-if="funSlides[currentFunSlide].highlightPill" class="slide-promo-chip">
                      {{ funSlides[currentFunSlide].highlightPill }}
                    </span>
                  </div>

                  <!-- Headline & Description -->
                  <h3 class="fun-slide-title">{{ funSlides[currentFunSlide].headline }}</h3>
                  <p class="fun-slide-desc">{{ funSlides[currentFunSlide].description }}</p>

                  <!-- 3 Feature Points with Playful Check Icons -->
                  <div class="fun-perks-list">
                    <div 
                      v-for="(perk, pIdx) in funSlides[currentFunSlide].perks" 
                      :key="pIdx" 
                      class="perk-item"
                    >
                      <div class="perk-icon-circle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{{ perk }}</span>
                    </div>
                  </div>

                  <!-- Bottom Card Action Row -->
                  <div class="slide-card-footer">
                    <span class="slide-footer-hint">{{ funSlides[currentFunSlide].footerHint }}</span>
                    <button 
                      type="button" 
                      class="btn-slide-action" 
                      @click="handleRegisterClick"
                      :title="funSlides[currentFunSlide].ctaText"
                    >
                      <span>{{ funSlides[currentFunSlide].ctaText }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </transition>

              <!-- Dots Navigator -->
              <div class="slide-dots-row">
                <button 
                  v-for="(slide, dIdx) in funSlides" 
                  :key="dIdx" 
                  type="button" 
                  class="slide-dot" 
                  :class="{ active: currentFunSlide === dIdx }" 
                  @click="setFunSlide(dIdx)"
                  :aria-label="'Buka slide ' + (dIdx + 1)"
                ></button>
              </div>
            </div>

            <!-- THREE INFORMATIVE PILLARS (CHILDREN & PARENTS FIRST) -->
            <div class="cheerful-pillars-grid">
              <div class="cheerful-pillar-box">
                <div class="pillar-icon-wrap mint">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                    <path d="M12 6a4 4 0 0 0-4 4h2a2 2 0 0 1 4 0 2 2 0 0 1-2 2v2h2v-1.1a4 4 0 0 0 2-3.4 4 4 0 0 0-4-3.5z"></path>
                    <circle cx="12" cy="17" r="1"></circle>
                  </svg>
                </div>
                <div class="pillar-texts">
                  <strong>Belajar Sambil Bermain</strong>
                  <span>Suasana ceria, bebas rasa takut & ramah anak</span>
                </div>
              </div>

              <div class="cheerful-pillar-box">
                <div class="pillar-icon-wrap warm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div class="pillar-texts">
                  <strong>Pelatih Sabar & Positif</strong>
                  <span>Pendampingan hangat & perhatian intensif</span>
                </div>
              </div>

              <div class="cheerful-pillar-box">
                <div class="pillar-icon-wrap sky">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="6"></circle>
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path>
                  </svg>
                </div>
                <div class="pillar-texts">
                  <strong>Bintang & Sertifikat</strong>
                  <span>Apresiasi setiap pencapaian & kelulusan level</span>
                </div>
              </div>
            </div>

            <!-- REGISTRATION INVITE BANNER -->
            <div class="invite-register-bar">
              <div class="invite-text-col">
                <span class="invite-title">Yuk, Mulai Petualangan Seru Ananda!</span>
                <span class="invite-sub">Pilih jadwal fleksibel (Senin – Minggu) & konsultasi kebutuhan ananda.</span>
              </div>
              <button 
                type="button" 
                class="btn-open-reg-modal" 
                @click="handleRegisterClick"
              >
                <span>Daftar Sekarang</span>
              </button>
            </div>
          </div></section>

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
                <span>Portal Resmi {{ store.brand?.name || 'mine.skills' }}</span>
              </div>
              <h2 class="card-title">Masuk ke Akun</h2>
              <p class="card-desc">Silakan masukkan email dan kata sandi Anda untuk mengakses portal.</p>
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
                  <label class="field-label">Alamat Email</label>
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
                <div class="field-label-row" style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="field-label">Kata Sandi</label>
                  <button type="button" @click="actions.openForgotPasswordModal(email)" class="link-forgot-pw" style="background: none; border: none; padding: 0; font-size: 12px; font-weight: 600; color: #0284c7; cursor: pointer; text-decoration: none;">
                    Lupa Kata Sandi?
                  </button>
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
                  <span>Memverifikasi Akun...</span>
                </span>
                <span v-else class="ready-state">
                  <span>Masuk ke Akun</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </button>
            </form>

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

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const isEmailFocused = ref(false);
const isPassFocused = ref(false);

// Cheerful & Informative Slides for Kids & Parents
const currentFunSlide = ref(0);
let funInterval = null;

const funSlides = [
  {
    id: 'promo',
    tabTitle: 'Promo Spesial',
    badge: 'PROMO TERBATAS SISWA BARU',
    highlightPill: 'HEMAT RP 50.000',
    headline: 'Kelas Group Ceria Cuma Rp 350.000!',
    description: 'Bimbingan renang intensif ramah anak dalam kelompok kecil dengan harga terjangkau.',
    perks: [
      '4x sesi latihan terarah (90 menit per pertemuan)',
      'Kelompok kecil eksklusif maksimal 4-5 anak per sesi',
      'Bonus sertifikat kelulusan & reward bintang motivasi'
    ],
    footerHint: 'Khusus untuk 50 pendaftar pertama bulan ini!',
    ctaText: 'Klaim Promo',
    themeClass: 'theme-promo'
  },
  {
    id: 'class',
    tabTitle: 'Keseruan Kelas',
    badge: 'METODE RAMAH ANAK',
    highlightPill: 'BEBAS TAKUT AIR',
    headline: 'Bermain Sambil Belajar Renang dengan Percaya Diri',
    description: 'Anak diajak mencintai air lewat permainan edukatif dan pengenalan teknik renang bertahap.',
    perks: [
      'Pemanasan seru & adaptasi air tanpa rasa cemas',
      'Latihan meluncur & pernapasan yang menyenangkan',
      'Didampingi pelatih bersertifikasi yang ramah dan sabar'
    ],
    footerHint: 'Tersedia untuk anak mulai usia 4 tahun hingga remaja',
    ctaText: 'Pilih Jadwal',
    themeClass: 'theme-fun'
  },
  {
    id: 'rewards',
    tabTitle: 'Bintang & Prestasi',
    badge: 'KURIKULUM BERJENJANG',
    highlightPill: 'E-RAPORT DIGITAL',
    headline: 'Rayakan Setiap Langkah Kemajuan Ananda',
    description: 'Setiap pencapaian kecil dihargai. Orang tua dapat memantau perkembangan teknik anak secara berkala.',
    perks: [
      'Level 1 Water Explorer hingga penguasaan 4 gaya renang',
      'E-Raport digital dapat diakses kapan saja oleh orang tua',
      'Medali & sertifikat resmi kelulusan di setiap level'
    ],
    footerHint: 'Terbukti membantu ratusan anak lebih mandiri dan tangkas',
    ctaText: 'Daftar Kelas',
    themeClass: 'theme-reward'
  }
];

function setFunSlide(idx) {
  currentFunSlide.value = idx;
  resetFunTimer();
}

function resetFunTimer() {
  if (funInterval) clearInterval(funInterval);
  funInterval = setInterval(() => {
    currentFunSlide.value = (currentFunSlide.value + 1) % funSlides.length;
  }, 5000);
}

function handleRegisterClick() {
  emit('open-register');
}

onMounted(() => {
  // If user already has an active authenticated session, immediately redirect to portal!
  if (store.authToken && store.currentUser && store.currentRole !== 'public') {
    emit('login-success', store.currentUser);
    return;
  }

  

  try {
    const lastReg = localStorage.getItem('mineskills_last_registered_email');
    if (lastReg) {
      email.value = lastReg;
    }
  } catch (e) {}
  resetFunTimer();
});

onUnmounted(() => {
  if (funInterval) clearInterval(funInterval);
});

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
   PAGE WRAPPER & AMBIENT LIGHT BACKGROUND (PRISTINE & ELEGANT)
   ========================================================================= */
.login-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(240, 253, 250, 0.8) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(254, 243, 199, 0.4) 0px, transparent 50%);
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
  color: #0f172a;
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
    linear-gradient(rgba(15, 23, 42, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.025) 1px, transparent 1px);
  background-size: 40px 40px;
}

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb-teal {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, transparent 70%);
  top: -150px;
  left: -120px;
  animation: orbDrift1 20s ease-in-out infinite alternate;
}

.orb-gold {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
  bottom: -150px;
  right: -80px;
  animation: orbDrift2 22s ease-in-out infinite alternate;
}

.orb-blue {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  top: 35%;
  right: 25%;
  animation: orbDrift3 18s ease-in-out infinite alternate;
}

@keyframes orbDrift1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(60px, 80px) scale(1.08); }
}
@keyframes orbDrift2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-60px, -50px) scale(1.1); }
}
@keyframes orbDrift3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-40px, 40px) scale(0.95); }
}

/* =========================================================================
   1. RUNNING TICKER / MARQUEE BAR ("IKLAN BERJALAN" - LIGHT ELEGANT)
   ========================================================================= */
.running-ticker-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  height: 38px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.ticker-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: #0d4d5d;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  height: 100%;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 2px 0 8px rgba(13, 77, 93, 0.15);
}

.ticker-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2dd4bf;
  box-shadow: 0 0 6px #2dd4bf;
  animation: pulseBadge 1.8s infinite;
}

@keyframes pulseBadge {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
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
  animation: tickerScroll 38s linear infinite;
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
  color: #475569;
  white-space: nowrap;
}

.ticker-item strong {
  color: #0d4d5d;
  font-weight: 700;
}

.t-icon {
  font-size: 13px;
}

.ticker-sep {
  color: #cbd5e1;
  font-size: 12px;
}

@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* =========================================================================
   2. PORTAL HEADER (CLEAN FROSTED LIGHT)
   ========================================================================= */
.portal-header {
  position: relative;
  z-index: 10;
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
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
}

.logo-divider {
  width: 1px;
  height: 20px;
  background-color: #cbd5e1;
}

.header-portal-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.02em;
}

.btn-back-clean {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #334155;
  border: 1px solid #e2e8f0;
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.btn-back-clean:hover {
  background: #f8fafc;
  color: #0d4d5d;
  border-color: #cbd5e1;
  transform: translateX(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
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
  padding: 36px 20px;
}

.portal-grid {
  width: 100%;
  max-width: 1180px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 40px;
  align-items: center;
}

/* =========================================================================
   LEFT PANEL: SHOWCASE & CAROUSEL (LIGHT & CRISP)
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
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  color: #0f766e;
  width: fit-content;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0d9488;
  box-shadow: 0 0 6px rgba(13, 148, 136, 0.4);
}

.showcase-title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.25;
  color: #09343f;
  margin: 0;
  letter-spacing: -0.02em;
}

.showcase-subtitle {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
  max-width: 520px;
}


/* =========================================================================
   CHEERFUL & INFORMATIVE KIDS SHOWCASE & PROMO STAGE
   ========================================================================= */
.kids-showcase-stage {
  position: relative;
  width: 100%;
  background: linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%);
  border: 1.5px solid #ccfbf1;
  border-radius: 22px;
  padding: 16px 18px 14px;
  box-shadow: 
    0 16px 36px -8px rgba(13, 148, 136, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  margin-top: 10px;
}

/* Floating Animated Bubbles Background */
.bubbles-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(45, 212, 191, 0.25));
  border: 1px solid rgba(45, 212, 191, 0.4);
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.6);
  animation: floatUp 8s ease-in-out infinite;
}

.b1 { width: 22px; height: 22px; left: 8%; bottom: -30px; animation-duration: 7s; }
.b2 { width: 14px; height: 14px; left: 24%; bottom: -20px; animation-duration: 9s; animation-delay: 2s; }
.b3 { width: 30px; height: 30px; right: 14%; bottom: -35px; animation-duration: 8.5s; animation-delay: 1s; }
.b4 { width: 18px; height: 18px; right: 32%; bottom: -25px; animation-duration: 10s; animation-delay: 3.5s; }
.b5 { width: 12px; height: 12px; left: 52%; bottom: -20px; animation-duration: 6.5s; animation-delay: 4.5s; }
.b6 { width: 20px; height: 20px; right: 4%; bottom: -30px; animation-duration: 11s; animation-delay: 0.5s; }

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0) scale(0.9);
    opacity: 0;
  }
  20% {
    opacity: 0.85;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-260px) translateX(15px) scale(1.15);
    opacity: 0;
  }
}

/* Category Tabs Bar */
.kids-tabs-bar {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.kids-tab-pill {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.22s ease;
}

.kids-tab-pill:hover {
  background: #ffffff;
  color: #0d4d5d;
  border-color: #99f6e4;
}

.kids-tab-pill.active {
  background: #0d4d5d;
  color: #ffffff;
  border-color: #0d4d5d;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.25);
}

/* Slide Card Content */
.fun-slide-card {
  position: relative;
  z-index: 3;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
}

.fun-slide-card.theme-promo {
  border-left: 4px solid #f59e0b;
}

.fun-slide-card.theme-fun {
  border-left: 4px solid #0d9488;
}

.fun-slide-card.theme-reward {
  border-left: 4px solid #0284c7;
}

.slide-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.slide-tag-chip {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  color: #0f766e;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.slide-promo-chip {
  background: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.fun-slide-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 800;
  color: #09343f;
  line-height: 1.3;
}

.fun-slide-desc {
  margin: 0 0 10px;
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.4;
}

.fun-perks-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

.perk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #334155;
  font-weight: 600;
}

.perk-icon-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ccfbf1;
  color: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.slide-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.slide-footer-hint {
  font-size: 10.5px;
  color: #0d9488;
  font-weight: 700;
}

.btn-slide-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #0d4d5d;
  color: #ffffff;
  border: none;
  font-size: 11.5px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-slide-action:hover {
  background: #09343f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.3);
}

/* Dots Row */
.slide-dots-row {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.slide-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #cbd5e1;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s ease;
}

.slide-dot.active {
  width: 22px;
  background: #0d4d5d;
}

/* Slide Transition */
.slide-card-fade-enter-active,
.slide-card-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-card-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.slide-card-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Three Cheerful Pillars */
.cheerful-pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.cheerful-pillar-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.pillar-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pillar-icon-wrap.mint {
  background: #f0fdfa;
  color: #0f766e;
  border: 1px solid #99f6e4;
}

.pillar-icon-wrap.warm {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #ffedd5;
}

.pillar-icon-wrap.sky {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.pillar-texts {
  display: flex;
  flex-direction: column;
}

.pillar-texts strong {
  font-size: 11px;
  font-weight: 800;
  color: #09343f;
  line-height: 1.2;
}

.pillar-texts span {
  font-size: 9.5px;
  color: #64748b;
  line-height: 1.2;
}

/* Bottom Invite Register Banner */
.invite-register-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  background: linear-gradient(135deg, #09343f 0%, #0d4d5d 100%);
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 6px 16px -3px rgba(9, 52, 63, 0.25);
}

.invite-text-col {
  display: flex;
  flex-direction: column;
}

.invite-title {
  font-size: 11.5px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
}

.invite-sub {
  font-size: 9.5px;
  color: #99f6e4;
  margin-top: 2px;
}

.btn-open-reg-modal {
  background: #14b8a6;
  color: #ffffff;
  border: none;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 3px 8px rgba(20, 184, 166, 0.4);
}

.btn-open-reg-modal:hover {
  background: #0d9488;
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .cheerful-pillars-grid {
    grid-template-columns: 1fr;
  }
  .invite-register-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-open-reg-modal {
    width: 100%;
    text-align: center;
  }
}


/* =========================================================================
   RIGHT PANEL: COMPACT WHITE CARD (ULTRA ELEGANT & SHARP)
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
  padding: 28px 28px 22px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 
    0 20px 45px -10px rgba(13, 77, 93, 0.09),
    0 0 0 1px rgba(0, 0, 0, 0.01);
  position: relative;
  animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-head {
  margin-bottom: 18px;
}

.security-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  color: #0f766e;
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
  gap: 14px;
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
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #cbd5e1;
  border-radius: 9px;
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
  padding: 11px 12px 11px 38px;
  border: none;
  background: transparent;
  font-size: 13.5px;
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

/* Submit Action Button with subtle animated sheen */
.btn-primary-action {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  background: linear-gradient(135deg, #0d4d5d 0%, #156d82 50%, #09343f 100%);
  color: #ffffff;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.25);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary-action::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: btnSheen 4s infinite;
}

@keyframes btnSheen {
  0% { left: -100%; }
  25% { left: 200%; }
  100% { left: 200%; }
}

.btn-primary-action:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 8px 22px rgba(13, 77, 93, 0.35);
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
  z-index: 2;
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

/* Card Footer */
.card-foot {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.card-foot p {
  font-size: 12px;
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
    padding: 24px 16px;
  }

  .portal-grid {
    grid-template-columns: 1fr;
    gap: 28px;
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
    display: none;
  }

  .login-card {
    padding: 22px 18px 18px;
    border-radius: 16px;
  }
}
</style>
