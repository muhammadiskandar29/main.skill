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

            <!-- LIVE INTERACTIVE TRANSPARENCY & TRUST CONSOLE -->
            <div class="sim-console-card">
              <!-- Console Top Header -->
              <div class="console-top-bar">
                <div class="live-status-chip">
                  <span class="live-pulse-dot"></span>
                  <span class="live-status-text">SISTEM PEMANTAUAN RESMI & TERVALIDASI</span>
                </div>
                <div class="sim-tabs-nav">
                  <button 
                    type="button" 
                    class="sim-tab-btn" 
                    :class="{ active: activeSimTab === 'gps' }" 
                    @click="setSimTab('gps')"
                    title="Simulasi Presensi GPS Geofence"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Presensi GPS</span>
                  </button>
                  <button 
                    type="button" 
                    class="sim-tab-btn" 
                    :class="{ active: activeSimTab === 'raport' }" 
                    @click="setSimTab('raport')"
                    title="Simulasi E-Raport Digital"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>E-Raport</span>
                  </button>
                  <button 
                    type="button" 
                    class="sim-tab-btn" 
                    :class="{ active: activeSimTab === 'safety' }" 
                    @click="setSimTab('safety')"
                    title="Simulasi Rasio & Keselamatan"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Rasio 1:3</span>
                  </button>
                </div>
              </div>

              <!-- Console Screen Area -->
              <div class="sim-screen-body">
                <!-- TAB 1: GPS GEOFENCE RADAR SIMULATOR -->
                <transition name="screen-fade" mode="out-in">
                  <div v-if="activeSimTab === 'gps'" key="gps" class="screen-view gps-view">
                    <div class="radar-visual-col">
                      <div class="radar-circle-wrap">
                        <div class="radar-grid-ring ring-3"></div>
                        <div class="radar-grid-ring ring-2"></div>
                        <div class="radar-grid-ring ring-1"></div>
                        <div class="radar-sweep-beam"></div>
                        <div class="radar-pulse-wave"></div>
                        <div class="radar-center-marker">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                          </svg>
                        </div>
                      </div>
                      <span class="radar-caption">Radius Geofence: 15 Meter</span>
                    </div>

                    <div class="telemetry-col">
                      <div class="telemetry-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>GPS Tervalidasi di Tepi Kolam</span>
                      </div>
                      <h4 class="telemetry-coach">Coach Adit, S.Pd.</h4>
                      <p class="telemetry-detail">Lisensi PRSI No. 412/PRSI/2024 • Kolam Graha Kresna Pratama</p>
                      
                      <div class="telemetry-meta-row">
                        <div class="meta-cell">
                          <span class="meta-label">Status Presensi</span>
                          <span class="meta-val green">Hadir Tepat Waktu (07:48 WIB)</span>
                        </div>
                        <div class="meta-cell">
                          <span class="meta-label">Akurasi Satelit</span>
                          <span class="meta-val">±8m (Radius Valid)</span>
                        </div>
                      </div>
                      <div class="security-lock-note">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Sistem anti-manipulasi: Pelatih wajib berada di lokasi sebelum jam sesi.</span>
                      </div>
                    </div>
                  </div>

                  <!-- TAB 2: E-RAPORT DIGITAL & METRICS SIMULATOR -->
                  <div v-else-if="activeSimTab === 'raport'" key="raport" class="screen-view raport-view">
                    <div class="raport-student-header">
                      <div class="student-avatar-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div class="student-info-col">
                        <div class="student-name-row">
                          <strong>Kenzo Al-Fatih (7 Th)</strong>
                          <span class="level-chip">Level 1: Water Explorer</span>
                        </div>
                        <span class="session-counter">Evaluasi Berkala: Sesi 3 dari 4 Selesai</span>
                      </div>
                    </div>

                    <div class="skills-progress-bars">
                      <div class="skill-bar-item">
                        <div class="skill-label-row">
                          <span>Kenyamanan Air & Selam Dasar</span>
                          <strong class="green">100% (Tuntas)</strong>
                        </div>
                        <div class="bar-track">
                          <div class="bar-fill w-100"></div>
                        </div>
                      </div>
                      <div class="skill-bar-item">
                        <div class="skill-label-row">
                          <span>Meluncur (Streamline) & Kicking</span>
                          <strong class="blue">85% (Optimal)</strong>
                        </div>
                        <div class="bar-track">
                          <div class="bar-fill w-85"></div>
                        </div>
                      </div>
                      <div class="skill-bar-item">
                        <div class="skill-label-row">
                          <span>Pengaturan Nafas Ritmis</span>
                          <strong class="amber">70% (Proses Latihan)</strong>
                        </div>
                        <div class="bar-track">
                          <div class="bar-fill w-70"></div>
                        </div>
                      </div>
                    </div>

                    <div class="coach-note-box">
                      <span class="note-quote">"Kemandirian & adaptasi ananda sangat baik, siap untuk sertifikasi level berikutnya."</span>
                      <span class="raport-sync-tag">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Tersinkron otomatis ke WhatsApp & portal orang tua
                      </span>
                    </div>
                  </div>

                  <!-- TAB 3: SAFETY & STRICT RATIO SIMULATOR -->
                  <div v-else key="safety" class="screen-view safety-view">
                    <div class="ratio-banner">
                      <div class="ratio-big-badge">
                        <span class="ratio-num">1 : 3</span>
                        <span class="ratio-sub">Rasio Maksimal</span>
                      </div>
                      <div class="ratio-text-col">
                        <h4>Fokus Penuh pada Keselamatan Ananda</h4>
                        <p>1 Pelatih hanya membina maksimal 3 siswa per sesi untuk memastikan pengawasan 100% tanpa risiko luput.</p>
                      </div>
                    </div>

                    <div class="capacity-slots-row">
                      <div class="slot-box filled">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Siswa 1</span>
                      </div>
                      <div class="slot-box filled">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Siswa 2</span>
                      </div>
                      <div class="slot-box filled">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Siswa 3</span>
                      </div>
                      <div class="slot-box locked">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Slot Dikunci</span>
                      </div>
                    </div>

                    <div class="safety-points-grid">
                      <div class="safety-point">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Instruktur Tersertifikasi CPR & P3K Air</span>
                      </div>
                      <div class="safety-point">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Jadwal Fleksibel: Garansi Reschedule jika Sakit</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Animated Auto-cycle Progress Line -->
              <div class="sim-cycle-timer-track">
                <div class="sim-cycle-timer-fill"></div>
              </div>
            </div>

            <!-- THREE TRUST PILLARS (CLEAN PROFESSIONAL SVG ICONS, NO EMOJIS) -->
            <div class="trust-pillars-row">
              <div class="trust-pillar-card">
                <div class="trust-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div class="trust-pillar-info">
                  <strong>Rasio Terbatas 1 : 3–4</strong>
                  <span>Prioritas keselamatan & pendampingan intensif</span>
                </div>
              </div>

              <div class="trust-pillar-card">
                <div class="trust-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="6"></circle>
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path>
                  </svg>
                </div>
                <div class="trust-pillar-info">
                  <strong>Pelatih Berlisensi Resmi</strong>
                  <span>Tersertifikasi instruktur renang nasional</span>
                </div>
              </div>

              <div class="trust-pillar-card">
                <div class="trust-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div class="trust-pillar-info">
                  <strong>E-Raport Real-Time</strong>
                  <span>Laporan evaluasi berkala dapat diakses online</span>
                </div>
              </div>
            </div>

            <!-- HIGH-CONVERSION TRUST & REGISTER ACTION BOX -->
            <div class="trust-cta-banner">
              <div class="cta-text-group">
                <span class="cta-headline">Ingin ananda belajar renang terarah & terpantau transparan?</span>
                <span class="cta-sub">Daftarkan sesi konsultasi & penempatan level tanpa dipungut biaya.</span>
              </div>
              <button 
                type="button" 
                class="btn-cta-register" 
                @click="handleRegisterClick"
                title="Buka Form Pendaftaran Siswa Baru"
              >
                <span>Daftar Siswa Baru</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
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

// Live Interactive Academy Simulator
const activeSimTab = ref('gps');
const simTabs = [
  { id: 'gps', label: 'Presensi GPS' },
  { id: 'raport', label: 'E-Raport' },
  { id: 'safety', label: 'Rasio 1:3' }
];
let simInterval = null;

function setSimTab(tabId) {
  activeSimTab.value = tabId;
  resetSimTimer();
}

function resetSimTimer() {
  if (simInterval) clearInterval(simInterval);
  simInterval = setInterval(() => {
    const currentIndex = simTabs.findIndex(t => t.id === activeSimTab.value);
    const nextIndex = (currentIndex + 1) % simTabs.length;
    activeSimTab.value = simTabs[nextIndex].id;
  }, 4800);
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
  resetSimTimer();
});

onUnmounted(() => {
  if (simInterval) clearInterval(simInterval);
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
   LIVE INTERACTIVE TRANSPARENCY & TRUST CONSOLE
   ========================================================================= */
.sim-console-card {
  position: relative;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 
    0 16px 36px -10px rgba(13, 77, 93, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  margin-top: 10px;
}

/* Console Top Bar */
.console-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  gap: 12px;
}

.live-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 800;
  color: #0f766e;
  letter-spacing: 0.04em;
}

.live-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.7);
  animation: radarPulse 1.8s infinite;
}

.sim-tabs-nav {
  display: flex;
  gap: 4px;
}

.sim-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-tab-btn:hover {
  color: #09343f;
  background: rgba(241, 245, 249, 0.8);
}

.sim-tab-btn.active {
  background: #ffffff;
  color: #0d4d5d;
  border-color: #cbd5e1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
}

/* Screen Body */
.sim-screen-body {
  padding: 16px 18px;
  min-height: 180px;
  display: flex;
  align-items: center;
}

.screen-view {
  width: 100%;
}

/* View 1: GPS Radar */
.gps-view {
  display: flex;
  align-items: center;
  gap: 18px;
}

.radar-visual-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.radar-circle-wrap {
  position: relative;
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background: #09343f;
  border: 2px solid #0d9488;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 20px -4px rgba(13, 77, 93, 0.35);
}

.radar-grid-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(20, 184, 166, 0.35);
  pointer-events: none;
}

.ring-1 { width: 35px; height: 35px; }
.ring-2 { width: 70px; height: 70px; }
.ring-3 { width: 95px; height: 95px; }

.radar-sweep-beam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform-origin: 0 0;
  background: conic-gradient(from 0deg, rgba(45, 212, 191, 0.7) 0deg, transparent 65deg);
  animation: radarSweep 3.6s linear infinite;
  pointer-events: none;
}

@keyframes radarSweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.radar-pulse-wave {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1.5px solid #2dd4bf;
  animation: waveExpand 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
  pointer-events: none;
}

@keyframes waveExpand {
  0% { width: 10px; height: 10px; opacity: 1; }
  100% { width: 100px; height: 100px; opacity: 0; }
}

.radar-center-marker {
  position: relative;
  z-index: 2;
  color: #10b981;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.9));
}

.radar-caption {
  font-size: 10px;
  font-weight: 700;
  color: #0f766e;
}

.telemetry-col {
  flex: 1;
}

.telemetry-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  color: #0f766e;
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 5px;
}

.telemetry-coach {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #09343f;
  line-height: 1.2;
}

.telemetry-detail {
  margin: 2px 0 8px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}

.telemetry-meta-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.meta-cell {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 9.5px;
  color: #64748b;
  font-weight: 600;
}

.meta-val {
  font-size: 11px;
  font-weight: 800;
  color: #0f172a;
}

.meta-val.green {
  color: #059669;
}

.security-lock-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #047857;
  line-height: 1.3;
}

/* View 2: Raport */
.raport-student-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.student-avatar-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-info-col {
  flex: 1;
}

.student-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-name-row strong {
  font-size: 13.5px;
  color: #0f172a;
}

.level-chip {
  background: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}

.session-counter {
  font-size: 10.5px;
  color: #64748b;
  display: block;
}

.skills-progress-bars {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 10px;
}

.skill-bar-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.skill-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #334155;
}

.skill-label-row strong.green { color: #059669; }
.skill-label-row strong.blue { color: #0284c7; }
.skill-label-row strong.amber { color: #d97706; }

.bar-track {
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  position: relative;
  transition: width 1s ease;
}

.bar-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmerMove 2s infinite;
}

@keyframes shimmerMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.bar-fill.w-100 { width: 100%; background: #10b981; }
.bar-fill.w-85 { width: 85%; background: #0ea5e9; }
.bar-fill.w-70 { width: 70%; background: #f59e0b; }

.coach-note-box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 7px 10px;
}

.note-quote {
  font-size: 10.5px;
  font-style: italic;
  color: #475569;
  display: block;
  line-height: 1.35;
}

.raport-sync-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  font-weight: 700;
  color: #0d9488;
  margin-top: 3px;
}

/* View 3: Safety */
.ratio-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.ratio-big-badge {
  background: #09343f;
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(9, 52, 63, 0.25);
  flex-shrink: 0;
}

.ratio-num {
  font-size: 20px;
  font-weight: 900;
  display: block;
  line-height: 1;
}

.ratio-sub {
  font-size: 9px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #99f6e4;
  margin-top: 2px;
  display: block;
}

.ratio-text-col h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #09343f;
}

.ratio-text-col p {
  margin: 2px 0 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.35;
}

.capacity-slots-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.slot-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.slot-box.filled {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  color: #0f766e;
}

.slot-box.locked {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.safety-points-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.safety-point {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: #334155;
  background: #f8fafc;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.safety-point svg {
  color: #10b981;
  flex-shrink: 0;
}

/* Timer line */
.sim-cycle-timer-track {
  height: 3px;
  background: #f1f5f9;
  width: 100%;
  overflow: hidden;
}

.sim-cycle-timer-fill {
  height: 100%;
  background: #0d9488;
  animation: cycleTimer 4.8s linear infinite;
}

@keyframes cycleTimer {
  0% { width: 0%; }
  100% { width: 100%; }
}

/* Screen Transitions */
.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.screen-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Trust Pillars Row (No Emojis, Pure SVG) */
.trust-pillars-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.trust-pillar-card {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.trust-pillar-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px -3px rgba(13, 77, 93, 0.08);
}

.trust-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  color: #0d9488;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trust-pillar-info {
  display: flex;
  flex-direction: column;
}

.trust-pillar-info strong {
  font-size: 11px;
  font-weight: 800;
  color: #09343f;
  line-height: 1.2;
}

.trust-pillar-info span {
  font-size: 9.5px;
  color: #64748b;
  line-height: 1.25;
}

/* High Conversion Trust CTA Banner */
.trust-cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 12px;
  background: linear-gradient(135deg, #09343f 0%, #0d4d5d 100%);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 14px;
  box-shadow: 0 8px 20px -4px rgba(9, 52, 63, 0.25);
}

.cta-text-group {
  display: flex;
  flex-direction: column;
}

.cta-headline {
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
}

.cta-sub {
  font-size: 10px;
  color: #99f6e4;
  margin-top: 2px;
}

.btn-cta-register {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #14b8a6;
  color: #ffffff;
  border: none;
  font-size: 11.5px;
  font-weight: 800;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  transition: all 0.2s ease;
}

.btn-cta-register:hover {
  background: #0d9488;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 16px rgba(20, 184, 166, 0.5);
}

@media (max-width: 900px) {
  .trust-pillars-row {
    grid-template-columns: 1fr;
  }
  .trust-cta-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-cta-register {
    width: 100%;
    justify-content: center;
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
