<template>
  <div class="company-profile">
    <!-- Top Decorative Line -->
    <div class="brand-top-stripe"></div>

    <!-- =========================================================================
         PAGE 1: BERANDA (HOME)
         ========================================================================= -->
    <div v-if="store.activePublicPage === 'home'" class="public-page page-home">
      <!-- Executive Hero Banner -->
      <section class="hero-executive">
        <div class="container-custom">
          <div class="hero-grid">
            <!-- Left: Value Prop & CTAs -->
            <div class="hero-content">
              <div class="badge-credential">
                <span class="pulse-indicator"></span>
                <span class="credential-text">{{ store.brand.name }} ACADEMY • RESMI & BERSERTIFIKASI</span>
              </div>

              <h1 class="hero-headline">
                {{ store.hero.headline }}
              </h1>

              <div class="hero-lead-bar">
                <div class="lead-accent-line"></div>
                <p class="hero-subheadline">
                  {{ store.hero.subheadline }}
                </p>
              </div>

              <!-- 4 Academy Pillars -->
              <div class="pillars-grid">
                <div class="pillar-card">
                  <div class="pillar-icon teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div class="pillar-text">
                    <strong>Kelas Kecil Terfokus</strong>
                    <span>Rasio 3-4 anak untuk perhatian intensif</span>
                  </div>
                </div>

                <div class="pillar-card">
                  <div class="pillar-icon green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  <div class="pillar-text">
                    <strong>Standar Safety Ketat</strong>
                    <span>Pelatih berpengalaman & safety protocol</span>
                  </div>
                </div>

                <div class="pillar-card">
                  <div class="pillar-icon gold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div class="pillar-text">
                    <strong>Kurikulum Level 1-4</strong>
                    <span>Pembelajaran terstruktur dan terukur</span>
                  </div>
                </div>

                <div class="pillar-card">
                  <div class="pillar-icon teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div class="pillar-text">
                    <strong>Evaluasi Tiap Sesi</strong>
                    <span>Raport digital real-time untuk orang tua</span>
                  </div>
                </div>
              </div>

              <!-- Executive Action Buttons -->
              <div class="hero-actions">
                <button @click="$emit('open-register')" class="btn-gold hero-cta-btn">
                  <span>Daftar Sekarang</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <button @click="navigateTo('programs')" class="btn-secondary">
                  <span>Jelajahi Program Pelatihan</span>
                </button>

                <button @click="navigateTo('pricing')" class="btn-secondary">
                  <span>Lihat Paket Biaya</span>
                </button>
              </div>
            </div>

            <!-- Right: Photo Visual Frame (Preserving Image 2 Loved Aesthetic) -->
            <div class="hero-visual">
              <!-- Tilted JOIN US Sticker from Image 2 -->
              <div class="join-us-sticker">
                <span>JOIN US</span>
              </div>

              <!-- Upward Gold Arrow/Starburst Ornament from Image 2 -->
              <div class="decor-floral-gold" aria-hidden="true" title="mine.skills official emblem">
                <svg width="38" height="38" viewBox="0 0 32 32" fill="#df8d18">
                  <path d="M16 2L3 15h7v13h12V15h7L16 2zm0 6l5 5h-3v11h-4V13h-3l5-5z" />
                </svg>
              </div>

              <!-- Main Hero Photo Frame with 36px 36px 8px 36px curvature -->
              <div class="hero-visual-frame">
                <img 
                  :src="selectedHeroImage" 
                  alt="Pelatihan Siswa mine.skills" 
                  class="hero-main-img" 
                />
                <div class="hero-caption-overlay">
                  <span class="caption-tag">Dokumentasi Pelatihan Resmi</span>
                  <strong class="caption-title">{{ store.brand.primaryLocation }}</strong>
                </div>
              </div>

              <!-- Side Geometric Strip from Image 2 -->
              <div class="poster-side-strip" aria-hidden="true">
                <span class="strip-pill-white"></span>
                <span class="strip-diamond-green"></span>
                <span class="strip-star-gold">★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Programs Preview Section -->
      <section class="section-home-programs">
        <div class="container-custom">
          <div class="section-header-row">
            <div>
              <span class="badge-chip teal">Program Unggulan</span>
              <h2 class="section-heading">Ekosistem Peningkatan Skill Terpadu</h2>
              <p class="section-subtext">Dari olah raga ketangkasan hingga kreativitas, dipandu pelatih berpengalaman</p>
            </div>
            <button @click="navigateTo('programs')" class="btn-outline-primary">
              <span>Lihat Semua Program & Kurikulum</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div class="programs-preview-grid">
            <div 
              v-for="prog in store.products" 
              :key="prog.id" 
              class="program-preview-card card-humanist"
            >
              <div class="prog-card-media">
                <img :src="prog.heroImage || '/images/swimming-hero.jpg'" :alt="prog.name" class="prog-card-img" />
                <span class="prog-card-category">{{ prog.category }}</span>
              </div>
              <div class="prog-card-content">
                <div class="prog-card-meta">
                  <span class="badge-chip green">Target: {{ prog.targetAge }}</span>
                  <span class="badge-chip gold">{{ prog.packages?.length || 3 }} Paket Kursus</span>
                </div>
                <h3 class="prog-card-title">{{ prog.name }}</h3>
                <p class="prog-card-desc">{{ prog.shortDesc }}</p>

                <div class="prog-card-actions">
                  <button @click="selectProgramAndGoPricing(prog.id)" class="btn-primary-sm">
                    Lihat Paket Biaya
                  </button>
                  <button @click="navigateTo('programs')" class="btn-text-sm">
                    Detail Kurikulum →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Verified Coaches Strip Preview -->
      <section class="section-home-coaches">
        <div class="container-custom">
          <div class="section-header-row">
            <div>
              <span class="badge-chip gold">Tenaga Pendidik</span>
              <h2 class="section-heading">Instruktur & Coach Terverifikasi</h2>
              <p class="section-subtext">Setiap siswa dibimbing langsung oleh coach berlisensi dan berpengalaman.</p>
            </div>
            <button @click="navigateTo('coaches')" class="btn-outline-primary">
              <span>Buka Direktori Lengkap Instruktur</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div class="coaches-preview-grid">
            <div 
              v-for="coach in (store.coaches || []).slice(0, 3)" 
              :key="coach.id" 
              class="coach-summary-card card-humanist"
            >
              <div class="coach-photo-wrap">
                <img :src="coach.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240'" :alt="coach.name" class="coach-photo" />
              </div>
              <div class="coach-summary-body">
                <h4 class="coach-summary-name">{{ coach.name }}</h4>
                <span class="coach-summary-spec">{{ coach.specialty }}</span>
                <p class="coach-summary-bio">{{ coach.bio }}</p>
                <div class="coach-summary-meta">
                  <span class="badge-chip teal">Membina {{ coach.activeStudentsCount || 10 }}+ Siswa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Institutional Guarantees -->
      <section class="section-home-trust">
        <div class="container-custom">
          <div class="trust-banner card-humanist">
            <div class="trust-grid">
              <div class="trust-text-col">
                <span class="badge-chip green">Komitmen Institusi</span>
                <h3 class="trust-heading">Mengapa Mempercayakan Putra-Putri Anda di mine.skills?</h3>
                <div class="trust-points-list">
                  <div class="trust-point">
                    <div class="point-check">✓</div>
                    <div>
                      <strong>Kurikulum Berjenjang & Sertifikasi Kelulusan:</strong>
                      <p>Siswa tidak hanya belajar sekadar bisa, melainkan memahami teknik baku dari Level 1 hingga Level 4 dengan sertifikat apresiasi.</p>
                    </div>
                  </div>
                  <div class="trust-point">
                    <div class="point-check">✓</div>
                    <div>
                      <strong>Terdapat Reward Setiap Pencapaian Level:</strong>
                      <p>Apresiasi dan reward nyata diberikan pada setiap kelulusan milestone level untuk memotivasi semangat dan rasa percaya diri ananda.</p>
                    </div>
                  </div>
                  <div class="trust-point">
                    <div class="point-check">✓</div>
                    <div>
                      <strong>Transparansi Raport Perkembangan Siswa:</strong>
                      <p>Orang tua dapat memantau catatan evaluasi, milestone tantangan, dan kehadiran langsung lewat Portal Siswa pada setiap sesi latihan.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="trust-cta-col">
                <div class="cta-card-inner">
                  <h4>Konsultasi Program Gratis</h4>
                  <p>Diskusikan minat, usia, dan target kemampuan anak bisa menghubungi admin.</p>
                  <a :href="directWaUrl" target="_blank" class="btn-whatsapp full-width">
                    <span>Chat WhatsApp Konsultasi</span>
                  </a>
                  <button @click="$emit('open-register')" class="btn-gold full-width" style="margin-top: 10px;">
                    <span>Daftar Member Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- =========================================================================
         PAGE 2: PROGRAM PELATIHAN (PROGRAMS CATALOG & CURRICULUM)
         ========================================================================= -->
    <div v-else-if="store.activePublicPage === 'programs'" class="public-page page-programs">
      <!-- Page Header -->
      <div class="page-intro-banner">
        <div class="container-custom">
          <div class="breadcrumb-trail">
            <span @click="navigateTo('home')" class="breadcrumb-link">Beranda</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Program Pelatihan</span>
          </div>
          <h1 class="page-intro-title">Katalog Program Pelatihan mine.skills</h1>
          <p class="page-intro-desc">
            Pilihan kurikulum terstruktur yang dipandu instruktur berpengalaman untuk membangun ketangkasan, kreativitas, dan rasa percaya diri.
          </p>

          <!-- Category Filter Bar -->
          <div class="category-tabs-bar">
            <button 
              class="cat-tab-btn" 
              :class="{ active: selectedCategoryFilter === '' }"
              @click="selectedCategoryFilter = ''"
            >
              Semua Program ({{ store.products.length }})
            </button>
            <button 
              v-for="cat in availableCategories" 
              :key="cat" 
              class="cat-tab-btn" 
              :class="{ active: selectedCategoryFilter === cat }"
              @click="selectedCategoryFilter = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <!-- Programs Detailed Grid -->
      <div class="container-custom page-main-body">
        <div class="programs-detailed-list">
          <div 
            v-for="prog in filteredPrograms" 
            :key="prog.id" 
            class="program-detail-card card-humanist"
          >
            <div class="prog-detail-grid">
              <!-- Left: Media & Tag -->
              <div class="prog-detail-media">
                <img :src="prog.heroImage || '/images/swimming-hero.jpg'" :alt="prog.name" class="prog-detail-img" />
                <div class="prog-badge-cluster">
                  <span class="badge-chip teal">{{ prog.category }}</span>
                  <span class="badge-chip green">Target: {{ prog.targetAge }}</span>
                </div>
              </div>

              <!-- Right: Content & Curriculum -->
              <div class="prog-detail-info">
                <div class="prog-info-top">
                  <h2 class="prog-detail-title">{{ prog.name }}</h2>
                  <p class="prog-detail-desc">{{ prog.shortDesc }}</p>
                </div>

                <!-- Structured Curriculum Progression (Level 1 to 4) -->
                <div class="prog-curriculum-container">
                  <h4 class="curriculum-heading">Kurikulum & Tahapan Capaian Level:</h4>
                  <div class="curriculum-steps-grid">
                    <div 
                      v-for="lvl in (prog.levels || [])" 
                      :key="lvl.levelNumber" 
                      class="curriculum-step-card"
                    >
                      <div class="step-badge">Level {{ lvl.levelNumber }}</div>
                      <strong class="step-title">{{ lvl.title }}</strong>
                      <div class="step-meta">
                        <span class="lbl-step">Fokus:</span>
                        <p class="txt-step">{{ lvl.focus }}</p>
                      </div>
                      <div class="step-meta" v-if="lvl.challenge">
                        <span class="lbl-step">Tantangan:</span>
                        <p class="txt-challenge">{{ lvl.challenge }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mapped Coaches for this Program -->
                <div class="prog-coaches-row">
                  <span class="lbl-coaches-assigned">Instruktur Tersedia:</span>
                  <div class="coach-inline-chips">
                    <span 
                      v-for="c in getCoachesForProgram(prog.id)" 
                      :key="c.id" 
                      class="coach-chip"
                    >
                      {{ c.name }}
                    </span>
                    <span v-if="getCoachesForProgram(prog.id).length === 0" class="text-subtle-hint">
                      Instruktur sedang ditugaskan manajemen
                    </span>
                  </div>
                </div>

                <!-- Action CTA Strip -->
                <div class="prog-cta-actions">
                  <button @click="selectProgramAndGoPricing(prog.id)" class="btn-primary">
                    <span>Lihat Pilihan Paket & Biaya</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <button @click="$emit('open-register')" class="btn-gold">
                    <span>Daftar Program Ini</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         PAGE 3: PAKET KURSUS & BIAYA (PRICING)
         ========================================================================= -->
    <div v-else-if="store.activePublicPage === 'pricing'" class="public-page page-pricing">
      <div class="page-intro-banner">
        <div class="container-custom">
          <div class="breadcrumb-trail">
            <span @click="navigateTo('home')" class="breadcrumb-link">Beranda</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Paket Kursus & Biaya</span>
          </div>
          <h1 class="page-intro-title">Pilihan Paket Kursus & Biaya Transparan</h1>
          <p class="page-intro-desc">
            Investasi terjangkau untuk akselerasi kemampuan putra-putri Anda. Bebas biaya tersembunyi, sudah termasuk fasilitas kurikulum dan evaluasi digital.
          </p>

          <!-- Program Filter Tabs (Setiap paket dipisah per program) -->
          <div class="category-tabs-bar">
            <button 
              v-for="p in store.products" 
              :key="p.id" 
              class="cat-tab-btn" 
              :class="{ active: (selectedPricingProgramId || store.products[0]?.id) === p.id }"
              @click="selectedPricingProgramId = p.id"
            >
              {{ p.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="container-custom page-main-body">
        <div class="pricing-cards-grid">
          <div 
            v-for="(pkg, idx) in filteredPricingPackages" 
            :key="pkg.id" 
            class="pricing-tier-card card-humanist"
            :class="{ 'featured-tier': idx === 1 || pkg.badge?.includes('Populer') || pkg.badge?.includes('Rekomendasi') }"
          >
            <div v-if="pkg.badge" class="tier-ribbon">{{ pkg.badge }}</div>
            <div class="tier-header">
              <span class="badge-chip teal">{{ pkg.productName }}</span>
              <h3 class="tier-name">{{ pkg.name }}</h3>
              <div class="tier-ratio">{{ pkg.ratio }}</div>
            </div>

            <div class="tier-price-box">
              <div class="tier-price-val">{{ pkg.formattedPrice }}</div>
              <div class="tier-terms">
                <span>{{ pkg.duration }}</span>
                <span>•</span>
                <span>{{ pkg.meetings }}</span>
              </div>
            </div>

            <p class="tier-desc">{{ pkg.description || 'Program pembinaan intensif dengan pelatih berpengalaman.' }}</p>

            <ul class="tier-features-list">
              <li>✓ Kurikulum berjenjang terstruktur Level 1 - 4</li>
              <li>✓ Raport perkembangan digital setiap akhir sesi</li>
              <li>✓ Sertifikat dan reward setiap pencapaian level</li>
              <li>✓ Fleksibilitas jadwal sesi latihan</li>
              <li>✓ Pembayaran mudah melalui QRIS Dinamis & Transfer Bank</li>
            </ul>

            <div class="tier-footer">
              <button @click="$emit('open-register')" class="btn-gold full-width">
                <span>Pilih Paket & Daftar</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Schedule Flex Banner -->
        <div class="schedule-notice-banner card-humanist">
          <div class="notice-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="notice-text">
            <strong>Jadwal Fleksibel & Penjadwalan Terstruktur:</strong>
            <p>Pilihan hari dan jam latihan dapat disesuaikan dengan ketersediaan slot (Jumat, Sabtu, dan Minggu, sesi pagi ataupun sore).</p>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         PAGE 4: DAFTAR INSTRUKTUR (COACHES DIRECTORY)
         ========================================================================= -->
    <div v-else-if="store.activePublicPage === 'coaches'" class="public-page page-coaches">
      <div class="page-intro-banner">
        <div class="container-custom">
          <div class="breadcrumb-trail">
            <span @click="navigateTo('home')" class="breadcrumb-link">Beranda</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Instruktur</span>
          </div>
          <h1 class="page-intro-title">Direktori Pelatih & Instruktur Bersertifikasi</h1>
          <p class="page-intro-desc">
            Profil lengkap tenaga pendidik dan instruktur resmi mine.skills. Berpengalaman, dedikasi pembinaan usia dini, dan rekam jejak teruji.
          </p>
        </div>
      </div>

      <div class="container-custom page-main-body">
        <div class="coaches-directory-grid">
          <div 
            v-for="coach in store.coaches" 
            :key="coach.id" 
            class="coach-directory-card card-humanist"
          >
            <div class="c-dir-head">
              <div class="c-avatar-container">
                <img :src="coach.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240'" :alt="coach.name" class="c-dir-avatar" />
              </div>
              <div class="c-dir-intro">
                <h3 class="c-dir-name">{{ coach.name }}</h3>
                <span class="c-dir-spec">{{ coach.specialty }}</span>
                <span class="c-dir-exp">Pengalaman: 5+ Tahun • Membina {{ coach.activeStudentsCount || 12 }} Siswa</span>
              </div>
            </div>

            <p class="c-dir-bio">{{ coach.bio }}</p>

            <div class="c-dir-mapping">
              <span class="lbl-dir-tag">Spesialisasi Program:</span>
              <div class="c-dir-tags">
                <span v-for="p in coach.mappedProducts" :key="p.id" class="badge-chip teal">
                  {{ p.name }}
                </span>
                <span v-if="!coach.mappedProducts || coach.mappedProducts.length === 0" class="badge-chip gold">
                  Semua Program
                </span>
              </div>
            </div>

            <div class="c-dir-footer">
              <a :href="buildCoachWaUrl(coach)" target="_blank" class="btn-whatsapp full-width">
                <span>Konsultasi dengan {{ coach.name.split(',')[0] }}</span>
              </a>
              <button @click="$emit('open-register')" class="btn-secondary full-width" style="margin-top: 8px;">
                <span>Daftar & Pilih Coach Ini</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         PAGE 5: FASILITAS & LOKASI (LOCATIONS)
         ========================================================================= -->
    <div v-else-if="store.activePublicPage === 'locations'" class="public-page page-locations">
      <div class="page-intro-banner">
        <div class="container-custom">
          <div class="breadcrumb-trail">
            <span @click="navigateTo('home')" class="breadcrumb-link">Beranda</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Fasilitas & Lokasi</span>
          </div>
          <h1 class="page-intro-title">Fasilitas & Cabang Latihan mine.skills</h1>
          <p class="page-intro-desc">
            Lingkungan pelatihan yang higienis, ramah anak, dan memenuhi standar keselamatan serta pengawasan ketat.
          </p>
        </div>
      </div>

      <div class="container-custom page-main-body">
        <div class="locations-directory-grid">
          <div 
            v-for="loc in store.locations" 
            :key="loc.id" 
            class="location-profile-card card-humanist"
          >
            <div class="loc-card-header">
              <div class="loc-icon-bubble">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <span class="badge-chip teal">{{ loc.area }}</span>
                <h3 class="loc-card-title">{{ loc.name }}</h3>
              </div>
            </div>

            <div class="loc-card-body">
              <div class="loc-info-row">
                <strong>Alamat Lengkap:</strong>
                <p>{{ loc.address }}</p>
              </div>

              <div class="loc-info-row" v-if="loc.productIds && loc.productIds.length > 0">
                <strong>Program Pelatihan di Lokasi Ini:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                  <span v-for="pId in loc.productIds" :key="pId" class="badge-chip gold">
                    {{ store.products.find(p => p.id === pId)?.name || pId }}
                  </span>
                </div>
              </div>

              <div class="loc-info-row">
                <strong>Jam Operasional Latihan:</strong>
                <p>{{ store.brand.operatingHours }}</p>
              </div>

              <div class="loc-amenities-box">
                <strong>Fasilitas & Sarana Pendukung:</strong>
                <p v-if="loc.facilities" style="font-size: 13.5px; color: var(--color-primary-dark); font-weight: 600; margin: 4px 0 8px 0;">
                  🏢 {{ loc.facilities }}
                </p>
                <ul class="amenities-list">
                  <li>✓ Kolam renang dengan zonasi kedalaman bertahap (aman anak)</li>
                  <li>✓ Sistem filtrasi & sirkulasi air higienis harian</li>
                  <li>✓ Ruang bilas & kamar ganti bersih dan tertutup</li>
                  <li>✓ Tribun & area tunggu nyaman beratap untuk wali siswa</li>
                  <li>✓ Pengawasan CCTV 24 jam & staf lifeguard siaga</li>
                  <li>✓ Perlengkapan latihan (kickboard, pull buoy, noodle) tersedia</li>
                </ul>
              </div>
            </div>

            <div class="loc-card-footer">
              <a 
                :href="`https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}`" 
                target="_blank" 
                class="btn-secondary full-width"
              >
                <span>Buka Petunjuk Arah di Google Maps</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         PAGE 6: KONTAK & PENDAFTARAN (CONTACT & FAQ)
         ========================================================================= -->
    <div v-else-if="store.activePublicPage === 'contact'" class="public-page page-contact">
      <div class="page-intro-banner">
        <div class="container-custom">
          <div class="breadcrumb-trail">
            <span @click="navigateTo('home')" class="breadcrumb-link">Beranda</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Kontak & Konsultasi</span>
          </div>
          <h1 class="page-intro-title">Pusat Layanan Informasi & Konsultasi</h1>
          <p class="page-intro-desc">
            Tim konsultan akademik dan helpdesk mine.skills siap melayani pertanyaan seputar program, jadwal, dan pendaftaran.
          </p>
        </div>
      </div>

      <div class="container-custom page-main-body">
        <div class="contact-two-cols-grid">
          <!-- Left: Contact Channels -->
          <div class="contact-channels-card card-humanist">
            <h3 class="channel-card-title">Saluran Komunikasi Resmi</h3>
            <p class="channel-card-sub">Silakan hubungi kami melalui saluran berikut untuk respon cepat.</p>

            <div class="contact-methods-list">
              <!-- WhatsApp -->
              <div class="contact-item">
                <div class="c-item-icon green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6-.01.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31"/>
                  </svg>
                </div>
                <div class="c-item-content">
                  <span class="c-item-lbl">Call Center WhatsApp:</span>
                  <strong class="c-item-val font-mono">{{ store.brand.callCenter }}</strong>
                  <a :href="directWaUrl" target="_blank" class="c-item-link">Chat Admin Sekarang →</a>
                </div>
              </div>

              <!-- Location -->
              <div class="contact-item">
                <div class="c-item-icon teal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="c-item-content">
                  <span class="c-item-lbl">Lokasi Utama:</span>
                  <strong class="c-item-val">{{ store.brand.primaryLocation }}</strong>
                  <p class="c-item-sub">{{ store.brand.addressFull }}</p>
                </div>
              </div>

              <!-- Email -->
              <div class="contact-item">
                <div class="c-item-icon gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="c-item-content">
                  <span class="c-item-lbl">Email Resmi:</span>
                  <strong class="c-item-val font-mono">{{ store.brand.officialEmail }}</strong>
                </div>
              </div>
            </div>

            <!-- Fast Registration Box -->
            <div class="fast-reg-box">
              <h4>Sudah Siap Mendaftarkan Ananda?</h4>
              <p>Formulir online memakan waktu kurang dari 2 menit dengan pembuatan jadwal sesi instan.</p>
              <button @click="$emit('open-register')" class="btn-gold full-width">
                <span>Buka Formulir Pendaftaran</span>
              </button>
            </div>
          </div>

          <!-- Right: Frequently Asked Questions (FAQ) -->
          <div class="faq-accordion-card card-humanist">
            <h3 class="channel-card-title">Pertanyaan yang Sering Diajukan (FAQ)</h3>
            <p class="channel-card-sub">Jawaban atas pertanyaan umum seputar program pembinaan skill.</p>

            <div class="faq-list">
              <div 
                v-for="(faq, i) in faqItems" 
                :key="i" 
                class="faq-item"
                :class="{ open: openFaqIndex === i }"
              >
                <div class="faq-question" @click="toggleFaq(i)">
                  <strong>{{ faq.q }}</strong>
                  <span class="faq-toggle-icon">{{ openFaqIndex === i ? '−' : '+' }}</span>
                </div>
                <div v-show="openFaqIndex === i" class="faq-answer">
                  <p>{{ faq.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         GLOBAL CORPORATE FOOTER
         ========================================================================= -->
    <footer class="corporate-footer">
      <div class="container-custom">
        <div class="footer-top-grid">
          <!-- Col 1: Brand Info -->
          <div class="footer-brand-col">
            <img 
              :src="store.brand.logoPath || '/images/mine-skills-logo.png'" 
              alt="mine.skills Logo" 
              class="footer-logo" 
            />
            <p class="footer-tagline">{{ store.brand.umbrellaTagline }}</p>
            <p class="footer-desc">
              Lembaga pembinaan bakat berjenjang dan peningkatan keterampilan anak di bawah lisensi resmi dan metode pembelajaran humanist.
            </p>
          </div>

          <!-- Col 2: Navigation Links -->
          <div class="footer-nav-col">
            <h5 class="footer-col-title">Halaman Informasi</h5>
            <ul class="footer-links">
              <li><button @click="navigateTo('home')">Beranda</button></li>
              <li><button @click="navigateTo('programs')">Program Pelatihan</button></li>
              <li><button @click="navigateTo('pricing')">Paket Kursus & Biaya</button></li>
              <li><button @click="navigateTo('coaches')">Daftar Instruktur</button></li>
              <li><button @click="navigateTo('locations')">Fasilitas & Lokasi</button></li>
              <li><button @click="navigateTo('contact')">Kontak & FAQ</button></li>
            </ul>
          </div>

          <!-- Col 3: Programs Directory -->
          <div class="footer-nav-col">
            <h5 class="footer-col-title">Program Terdaftar</h5>
            <ul class="footer-links">
              <li v-for="p in store.products" :key="p.id">
                <button @click="selectProgramAndGoPricing(p.id)">{{ p.name }}</button>
              </li>
            </ul>
          </div>

          <!-- Col 4: Role Switchers for Testing -->
          <div class="footer-nav-col">
            <h5 class="footer-col-title">Simulasi Akses Portal (RBAC)</h5>
            <p class="footer-role-hint">Pilih hak akses untuk memeriksa fungsi portal masing-masing peran:</p>
            <div class="footer-role-buttons">
              <button @click="switchRole('customer')" class="footer-role-btn">
                <span>Portal Siswa & Wali</span>
              </button>
              <button @click="switchRole('coach')" class="footer-role-btn">
                <span>Portal Instruktur / Coach</span>
              </button>
              <button @click="switchRole('manajemen')" class="footer-role-btn">
                <span>Portal Manajemen (Admin)</span>
              </button>
            </div>
          </div>
        </div>

        <div class="footer-bottom-row">
          <span class="copy-text">© 2026 mine.skills platform. Hak Cipta Dilindungi Undang-Undang.</span>
          <span class="security-text">Sistem Pembayaran Terenkripsi EMVCo & QRIS ASPI</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, actions } from '../data/store.js';

defineEmits(['open-register']);

const selectedCategoryFilter = ref('');
const selectedPricingProgramId = ref('prod_swimming');
const openFaqIndex = ref(0);

function toggleFaq(index) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index;
}

function navigateTo(page) {
  store.activePublicPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectProgramAndGoPricing(programId) {
  selectedPricingProgramId.value = programId;
  navigateTo('pricing');
}

function switchRole(roleId) {
  actions.switchRole(roleId);
}

const availableCategories = computed(() => {
  const cats = new Set();
  (store.products || []).forEach(p => {
    if (p.category) cats.add(p.category);
  });
  return Array.from(cats);
});

const filteredPrograms = computed(() => {
  if (!selectedCategoryFilter.value) return store.products;
  return store.products.filter(p => p.category === selectedCategoryFilter.value);
});

const filteredPricingPackages = computed(() => {
  const currentProgId = selectedPricingProgramId.value || store.products[0]?.id || 'prod_swimming';
  return store.packages.filter(p => p.productId === currentProgId);
});

function getCoachesForProgram(progId) {
  return (store.coaches || []).filter(c => Array.isArray(c.productIds) && c.productIds.includes(progId));
}

const selectedHeroImage = computed(() => {
  return store.products[0]?.heroImage || '/images/swimming-hero.jpg';
});

const directWaUrl = computed(() => {
  const cleanPhone = actions.cleanWaNumber(store.brand.callCenter);
  const msg = `Halo Tim Konsultan ${store.brand.name},\nSaya tertarik untuk mengetahui informasi pendaftaran program dan ketersediaan jadwal kelas kecil. Terima kasih.`;
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
});

function buildCoachWaUrl(coach) {
  const cleanPhone = actions.cleanWaNumber(coach.phone || store.brand.callCenter);
  const msg = `Halo ${coach.name},\nSaya tertarik berkonsultasi mengenai bimbingan kelas latihan di ${store.brand.name}. Mohon informasi ketersediaan jadwalnya. Terima kasih.`;
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
}

const faqItems = [
  {
    q: 'Berapa jumlah maksimal siswa dalam satu kelas?',
    a: 'Kami membatasi secara ketat maksimal 3 hingga 5 siswa per sesi untuk kelas reguler/small group, dan 1-on-1 untuk kelas privat. Hal ini untuk memastikan rasio keselamatan dan perhatian instruktur yang optimal.'
  },
  {
    q: 'Apakah jadwal sesi latihan mengikat dengan satu coach tertentu?',
    a: 'Ya. Sistem kami menerapkan ikatan siswa ke coach tertentu selama paket 4 atau 8 sesi berlangsung, sehingga perkembangan teknik ananda terpantau secara konsisten oleh satu pelatih yang memahami karakter anak.'
  },
  {
    q: 'Bagaimana jika anak berhalangan hadir karena sakit?',
    a: 'Orang tua dapat mengajukan reschedule minimal 6 jam sebelum sesi dimulai melalui nomor WhatsApp admin atau portal siswa untuk mendapatkan jadwal make-up class pengganti.'
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Kami mendukung pembayaran QRIS Dinamis (ASPI/EMVCo) yang dapat di-scan dari BCA Mobile, Livin Mandiri, GoPay, OVO, ShopeePay, serta transfer langsung ke rekening bank resmi yayasan.'
  },
  {
    q: 'Kapan orang tua bisa melihat raport perkembangan anak?',
    a: 'Coach mengisi evaluasi perkembangan anak setiap selesai sesi latihan. Orang tua dapat langsung login ke Portal Siswa untuk melihat pencapaian milestone dan saran latihan lanjutan.'
  }
];
</script>

<style scoped>
.brand-top-stripe {
  height: 4px;
  background: linear-gradient(90deg, #0d4d5d 0%, #e5a024 50%, #3f7e2f 100%);
}

.public-page {
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Intro Banner for Multi-Page system */
.page-intro-banner {
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-subtle);
  padding: 36px 0 28px;
}

.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}

.breadcrumb-link {
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-subtle);
}

.breadcrumb-current {
  color: var(--text-muted);
  font-weight: 500;
}

.page-intro-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.page-intro-desc {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 780px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.category-tabs-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-tab-btn {
  padding: 9px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  transition: all var(--transition-fast);
  cursor: pointer;
  letter-spacing: 0.01em;
}

.cat-tab-btn:hover {
  background-color: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.cat-tab-btn.active {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(13, 77, 93, 0.2);
}

.page-main-body {
  padding-top: 40px;
  padding-bottom: 60px;
}

/* =========================================================================
   PAGE 1: BERANDA STYLES
   ========================================================================= */
.hero-executive {
  padding: 56px 0 64px;
  background-color: #f7faf9;
  border-bottom: 1px solid var(--border-subtle);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  align-items: center;
}

.badge-credential {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: var(--color-primary-soft);
  border: 1px solid rgba(13, 77, 93, 0.2);
  border-radius: 6px;
  margin-bottom: 20px;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-accent-gold);
}

.credential-text {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--color-primary-dark);
  letter-spacing: 0.05em;
}

.hero-headline {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  color: #122428;
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}

.hero-lead-bar {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
}

.lead-accent-line {
  width: 4px;
  background-color: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.hero-subheadline {
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--text-muted);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.pillar-card {
  background-color: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.pillar-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pillar-icon.teal { background-color: var(--color-primary-soft); color: var(--color-primary); }
.pillar-icon.green { background-color: var(--color-accent-green-soft); color: var(--color-accent-green-dark); }
.pillar-icon.gold { background-color: var(--color-accent-gold-soft); color: var(--color-accent-gold-dark); }

.pillar-text strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
}

.pillar-text span {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-cta-btn {
  padding: 12px 24px;
  font-size: 14px;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Image 2 Loved Visual Elements */
.join-us-sticker {
  position: absolute;
  top: 14px;
  left: -20px;
  z-index: 12;
  background-color: #0d4d5d;
  color: #ffffff;
  padding: 6px 16px;
  font-weight: 800;
  font-size: 13.5px;
  letter-spacing: 0.05em;
  border-radius: 4px;
  box-shadow: 0 4px 14px rgba(13, 77, 93, 0.28);
  transform: rotate(-3deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.decor-floral-gold {
  position: absolute;
  top: -16px;
  left: 62px;
  z-index: 12;
  color: #df8d18;
  filter: drop-shadow(0 2px 4px rgba(223, 141, 24, 0.25));
  animation: floatSubtle 4s ease-in-out infinite;
}

@keyframes floatSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.hero-visual-frame {
  width: 100%;
  max-width: 430px;
  height: 450px;
  border-radius: 36px 36px 8px 36px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 16px 36px -8px rgba(13, 77, 93, 0.22);
  border: 4px solid #ffffff;
  background-color: var(--color-primary-dark);
}

.hero-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-caption-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(9, 35, 43, 0.9) 100%);
  padding: 24px 20px 16px;
  color: #ffffff;
}

.caption-tag {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #e5a024;
  letter-spacing: 0.05em;
}

.caption-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
}

.poster-side-strip {
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  width: 14px;
  height: 170px;
  background-color: #0d4d5d;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  z-index: 11;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.25);
}

.strip-pill-white {
  width: 6px;
  height: 26px;
  background-color: #ffffff;
  border-radius: 3px;
}

.strip-diamond-green {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  transform: rotate(45deg);
}

.strip-star-gold {
  color: #e5a024;
  font-size: 11px;
  line-height: 1;
}

.hero-badge-verified {
  position: absolute;
  bottom: -14px;
  left: 32px;
  z-index: 12;
  background-color: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 7px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 18px rgba(13, 77, 93, 0.12);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
}

/* Section Common */
.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.section-heading {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
  margin-top: 6px;
}

.section-subtext {
  font-size: 14.5px;
  color: var(--text-muted);
}

.btn-outline-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  background-color: transparent;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-outline-primary:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

/* Programs Preview Grid */
.section-home-programs {
  padding: 60px 0;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-subtle);
}

.programs-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.program-preview-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.prog-card-media {
  position: relative;
  height: 200px;
}

.prog-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prog-card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(9, 35, 43, 0.85);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.prog-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.prog-card-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.prog-card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 8px;
}

.prog-card-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.prog-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-subtle);
  padding-top: 14px;
}

.btn-primary-sm {
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary-sm:hover {
  background-color: var(--color-primary-dark);
}

.btn-text-sm {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

/* Coaches Preview */
.section-home-coaches {
  padding: 60px 0;
  background-color: #f7faf9;
  border-bottom: 1px solid var(--border-subtle);
}

.coaches-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.coach-summary-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.coach-photo-wrap {
  position: relative;
  flex-shrink: 0;
}

.coach-photo {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--border-subtle);
}

.coach-verified-badge {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 3px;
}

.coach-summary-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.coach-summary-spec {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.coach-summary-bio {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 8px;
}

/* Trust Section */
.section-home-trust {
  padding: 60px 0;
  background-color: #ffffff;
}

.trust-banner {
  padding: 36px;
  background-color: #f7faf9;
  border: 1.5px solid var(--border-subtle);
}

.trust-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 40px;
}

.trust-heading {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 6px;
  margin-bottom: 20px;
}

.trust-points-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trust-point {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.point-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-accent-green-soft);
  color: var(--color-accent-green-dark);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
}

.trust-point strong {
  display: block;
  font-size: 13.5px;
  color: var(--text-main);
  margin-bottom: 2px;
}

.trust-point p {
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
}

.cta-card-inner {
  background-color: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.cta-card-inner h4 {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 8px;
}

.cta-card-inner p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

/* =========================================================================
   PAGE 2: PROGRAM PELATIHAN STYLES
   ========================================================================= */
.programs-detailed-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.program-detail-card {
  padding: 0;
  overflow: hidden;
}

.prog-detail-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
}

.prog-detail-media {
  position: relative;
  background-color: var(--color-primary-dark);
}

.prog-detail-img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
}

.prog-badge-cluster {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prog-detail-info {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prog-detail-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.prog-detail-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

.curriculum-heading {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.curriculum-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.curriculum-step-card {
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 12px;
}

.step-badge {
  display: inline-block;
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.step-title {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.step-meta {
  margin-top: 4px;
}

.lbl-step {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-subtle);
  display: block;
}

.txt-step {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
}

.txt-challenge {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  line-height: 1.3;
}

.prog-coaches-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.lbl-coaches-assigned {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-subtle);
}

.coach-inline-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.coach-chip {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  border: 1px solid rgba(13, 77, 93, 0.15);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
}

.prog-cta-actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-subtle);
  padding-top: 16px;
}

/* =========================================================================
   PAGE 3: PRICING & PACKAGES STYLES
   ========================================================================= */
.pricing-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.pricing-tier-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border: 1.5px solid var(--border-subtle);
}

.pricing-tier-card.featured-tier {
  border-color: var(--color-accent-gold);
  box-shadow: 0 12px 32px -4px rgba(229, 160, 36, 0.2);
}

.tier-ribbon {
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: var(--color-accent-gold);
  color: #1a1600;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tier-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 8px;
  margin-bottom: 4px;
}

.tier-ratio {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.tier-price-box {
  margin: 18px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.tier-price-val {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
}

.tier-terms {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 4px;
}

.tier-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 18px;
}

.tier-features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-main);
  margin-bottom: 24px;
  flex: 1;
}

.schedule-notice-banner {
  display: flex;
  gap: 16px;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid var(--border-subtle);
  padding: 20px 24px;
}

.notice-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-text strong {
  display: block;
  font-size: 14px;
  color: var(--color-primary-dark);
  margin-bottom: 2px;
}

.notice-text p {
  font-size: 13px;
  color: var(--text-muted);
}

/* =========================================================================
   PAGE 4: COACHES DIRECTORY STYLES
   ========================================================================= */
.coaches-directory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.coach-directory-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.c-dir-head {
  display: flex;
  gap: 18px;
}

.c-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.c-dir-avatar {
  width: 84px;
  height: 84px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--border-subtle);
}

.c-dir-license {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 3px;
}

.c-dir-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.c-dir-spec {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  margin-top: 2px;
  margin-bottom: 4px;
}

.c-dir-exp {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
}

.c-dir-bio {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.c-dir-mapping {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.lbl-dir-tag {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.c-dir-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* =========================================================================
   PAGE 5: LOCATIONS STYLES
   ========================================================================= */
.locations-directory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.location-profile-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loc-card-header {
  display: flex;
  gap: 14px;
  align-items: center;
}

.loc-icon-bubble {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.loc-card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 4px;
}

.loc-info-row strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
}

.loc-info-row p {
  font-size: 13.5px;
  color: var(--text-muted);
}

.loc-amenities-box {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.loc-amenities-box strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.amenities-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-muted);
}

/* =========================================================================
   PAGE 6: CONTACT & FAQ STYLES
   ========================================================================= */
.contact-two-cols-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 32px;
}

.channel-card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 4px;
}

.channel-card-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.contact-methods-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
}

.c-item-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.c-item-icon.green { background-color: var(--color-accent-green-soft); color: var(--color-accent-green-dark); }
.c-item-icon.teal { background-color: var(--color-primary-soft); color: var(--color-primary); }
.c-item-icon.gold { background-color: var(--color-accent-gold-soft); color: var(--color-accent-gold-dark); }

.c-item-lbl {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
}

.c-item-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.c-item-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.c-item-link {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-accent-green-dark);
  margin-top: 4px;
}

.fast-reg-box {
  background-color: var(--color-primary-soft);
  border: 1px solid rgba(13, 77, 93, 0.2);
  border-radius: var(--radius-md);
  padding: 20px;
}

.fast-reg-box h4 {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 4px;
}

.fast-reg-box p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.faq-item.open {
  border-color: var(--color-primary);
}

.faq-question {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: var(--bg-surface);
  user-select: none;
}

.faq-question strong {
  font-size: 13.5px;
  color: var(--text-main);
}

.faq-toggle-icon {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
}

.faq-answer {
  padding: 0 16px 14px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  background-color: var(--bg-surface);
}

/* =========================================================================
   CORPORATE FOOTER STYLES
   ========================================================================= */
.corporate-footer {
  background-color: #09232b;
  color: #c9e1e7;
  padding: 56px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-top-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr 0.9fr 1.1fr;
  gap: 36px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  height: 44px;
  width: auto;
  object-fit: contain;
  margin-bottom: 14px;
  filter: brightness(0) invert(1);
}

.footer-tagline {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.footer-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #8da7ad;
}

.footer-col-title {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links button {
  background: none;
  border: none;
  color: #c9e1e7;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
}

.footer-links button:hover {
  color: #e5a024;
}

.footer-role-hint {
  font-size: 11.5px;
  color: #8da7ad;
  margin-bottom: 12px;
}

.footer-role-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-role-btn {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.footer-role-btn:hover {
  background-color: #e5a024;
  color: #1a1600;
  border-color: #e5a024;
}

.footer-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  font-size: 11.5px;
  color: #65848b;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .prog-detail-grid { grid-template-columns: 1fr; }
  .programs-preview-grid,
  .coaches-preview-grid,
  .pricing-cards-grid,
  .coaches-directory-grid,
  .locations-directory-grid,
  .contact-two-cols-grid,
  .footer-top-grid {
    grid-template-columns: 1fr;
  }
}
</style>
