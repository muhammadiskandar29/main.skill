<template>
  <div class="portal-customer">
    <!-- Active Sub-Menu: c_overview -->
    <div v-if="resolvedMenu === 'c_overview'" class="portal-tab-content">
      <!-- Student Profile Card Banner -->
      <div class="student-hero-banner card-humanist">
        <div class="student-hero-left">
          <div class="student-avatar-wrap">
            <img :src="studentData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160'" alt="Avatar" class="student-avatar" />
            <span class="level-indicator-badge">L{{ studentData.currentLevel }}</span>
          </div>
          <div class="student-info">
            <div class="badge-chip teal">Portal Perkembangan Siswa</div>
            <h2 class="student-name">{{ studentData.name }} ({{ studentData.age }} th)</h2>
            <p class="student-meta">
              <span>Wali: {{ studentData.parentName }}</span>
              <span class="dot">•</span>
              <span>{{ studentData.program }}</span>
              <span class="dot">•</span>
              <span>Paket: {{ studentData.packageType }}</span>
            </p>
            <div style="margin-top: 8px;">
              <button @click="openEditCustProfileModal" class="btn-edit-cust-profile" title="Ubah data profil siswa & kontak wali murid">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit Profil Siswa & Wali</span>
              </button>
            </div>
          </div>
        </div>

        <div class="student-hero-right">
          <div class="stat-pill-box">
            <span class="pill-lbl">Tingkat Kemampuan Saat Ini</span>
            <strong class="pill-val color-primary">{{ studentData.currentLevelTitle }}</strong>
            <span class="pill-sub">Target: {{ studentData.targetChallenge }}</span>
          </div>
          <div class="stat-pill-box">
            <span class="pill-lbl">Kemajuan Paket Latihan</span>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" :style="{ width: studentData.overallProgress + '%' }"></div>
            </div>
            <span class="pill-sub">{{ studentData.completedSessions }} dari {{ studentData.packageTotalSessions }} Sesi Selesai ({{ studentData.overallProgress }}%)</span>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           1. INTERACTIVE SKILL QUEST ROADMAP (PETA PETUALANGAN LEVEL)
           ========================================================================= -->
      <div class="quest-roadmap-card card-humanist">
        <div class="quest-roadmap-header">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge-chip gold">Alur Kurikulum & Capaian Tingkat</span>
              <span class="quest-track-sub-badge">Kurikulum {{ activeProduct?.name || 'Renang' }}</span>
            </div>
            <h3 class="quest-roadmap-title">Peta Capaian Kompetensi Siswa: {{ studentData.name }}</h3>
            <p class="quest-roadmap-desc">
              Peta milestone bertahap. Klik stasiun level untuk memeriksa fokus teknik dan tantangan kelulusan (*Challenge Milestone*).
            </p>
          </div>
          <div class="quest-summary-stat">
            <span class="q-stat-lbl">Posisi Saat Ini:</span>
            <strong class="q-stat-val text-gold">Level {{ currentStudentLevel }} — {{ studentData.currentLevelTitle }}</strong>
          </div>
        </div>

        <!-- Adventure Quest Track Canvas -->
        <div class="quest-trail-wrapper">
          <div class="quest-wave-bg"></div>

          <div class="quest-stations-row">
            <div 
              v-for="lvl in activeProductLevels" 
              :key="lvl.levelNumber"
              class="quest-station-node"
              :class="{
                'node-completed': currentStudentLevel > lvl.levelNumber,
                'node-current': currentStudentLevel === lvl.levelNumber,
                'node-locked': currentStudentLevel < lvl.levelNumber
              }"
              @click="openQuestModal(lvl)"
              title="Klik untuk detail tantangan level ini"
            >
              <!-- Floating Avatar Pin for Current Level -->
              <div v-if="currentStudentLevel === lvl.levelNumber" class="kenzo-avatar-pin">
                <div class="pin-speech-bubble">
                  <span>Level Aktif Siswa</span>
                </div>
                <div class="pin-avatar-circle">
                  <img :src="studentData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160'" alt="Avatar" class="pin-img" />
                  <span class="pin-ripple-pulse"></span>
                </div>
              </div>

              <!-- Node Checkpoint Circle -->
              <div class="node-checkpoint-circle">
                <svg v-if="currentStudentLevel > lvl.levelNumber" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span v-else-if="currentStudentLevel === lvl.levelNumber" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ffffff;"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>

              <!-- Node Card Detail -->
              <div class="node-checkpoint-card">
                <span class="node-lvl-chip" :class="{
                  'gold': currentStudentLevel > lvl.levelNumber,
                  'teal': currentStudentLevel === lvl.levelNumber,
                  'muted': currentStudentLevel < lvl.levelNumber
                }">
                  Level {{ lvl.levelNumber }}
                </span>
                <strong class="node-title">{{ lvl.title }}</strong>
                
                <div class="node-challenge-pill" v-if="lvl.challenge">
                  <span class="badge-chip gold mini" style="font-size: 10px;">Target</span>
                  <span class="c-text">{{ lvl.challenge }}</span>
                </div>

                <div class="node-status-foot">
                  <span v-if="currentStudentLevel > lvl.levelNumber" class="text-green font-bold">
                    ✓ Lulus Standar
                  </span>
                  <span v-else-if="currentStudentLevel === lvl.levelNumber" class="text-gold font-bold">
                    Sedang Ditempuh (75%)
                  </span>
                  <span v-else class="text-muted">
                    Belum Terbuka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           2. RADAR SPIDER-WEB CHART (GRAFIK PENTAGON 5 PILAR KEMAMPUAN ANAK)
           ========================================================================= -->
      <div class="radar-pentagon-card card-humanist">
        <div class="radar-card-header">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge-chip teal">Evaluasi 5 Pilar Kompetensi</span>
              <span class="badge-chip green">Pertumbuhan +{{ overallGrowthPct }}% Sejak Sesi 1</span>
            </div>
            <h3 class="radar-card-title">Radar Spider-Web Kemampuan Ananda</h3>
            <p class="radar-card-sub">
              Grafik pentagon visual: perbandingan penguasaan teknik ananda saat sesi pertama (baseline) vs sesi terkini.
            </p>
          </div>

          <!-- Interactive Switcher -->
          <div class="radar-mode-switcher">
            <button 
              class="r-switch-btn" 
              :class="{ active: radarMode === 'compare' }"
              @click="radarMode = 'compare'"
            >
              Bandingkan (Awal vs Terkini)
            </button>
            <button 
              class="r-switch-btn" 
              :class="{ active: radarMode === 'baseline' }"
              @click="radarMode = 'baseline'"
            >
              Sesi 1 (Awal)
            </button>
            <button 
              class="r-switch-btn" 
              :class="{ active: radarMode === 'current' }"
              @click="radarMode = 'current'"
            >
              Sesi 3 (Terkini)
            </button>
          </div>
        </div>

        <div class="radar-main-grid">
          <!-- Left: SVG Radar Canvas -->
          <div class="radar-svg-col">
            <div class="radar-canvas-box">
              <svg viewBox="0 0 360 360" class="radar-svg">
                <!-- Concentric Rings (20%, 40%, 60%, 80%, 100%) -->
                <polygon :points="getRingPolygonPoints(100)" class="radar-ring outer" />
                <polygon :points="getRingPolygonPoints(80)" class="radar-ring" />
                <polygon :points="getRingPolygonPoints(60)" class="radar-ring" />
                <polygon :points="getRingPolygonPoints(40)" class="radar-ring" />
                <polygon :points="getRingPolygonPoints(20)" class="radar-ring inner" />

                <!-- Radial Axis Lines -->
                <line 
                  v-for="(pos, i) in labelPositions" 
                  :key="i"
                  :x1="cx" 
                  :y1="cy" 
                  :x2="getPentagonVertex(i, maxR).x" 
                  :y2="getPentagonVertex(i, maxR).y" 
                  class="radar-axis-line" 
                />

                <!-- Baseline Polygon (Sesi Awal) -->
                <polygon 
                  v-if="radarMode === 'compare' || radarMode === 'baseline'"
                  :points="baselinePolygonPoints" 
                  class="radar-polygon-baseline" 
                />

                <!-- Current Polygon (Sesi Terkini) -->
                <polygon 
                  v-if="radarMode === 'compare' || radarMode === 'current'"
                  :points="currentPolygonPoints" 
                  class="radar-polygon-current" 
                />

                <!-- Current Vertex Dots with Glowing Pulse -->
                <g v-if="radarMode === 'compare' || radarMode === 'current'">
                  <circle 
                    v-for="(pt, idx) in currentVertexPoints" 
                    :key="idx"
                    :cx="pt.x" 
                    :cy="pt.y" 
                    r="5" 
                    class="radar-vertex-dot"
                  />
                </g>

                <!-- Labels around vertices -->
                <g v-for="(lbl, idx) in labelPositions" :key="'lbl-' + idx">
                  <text 
                    :x="lbl.x" 
                    :y="lbl.y" 
                    text-anchor="middle" 
                    dominant-baseline="central"
                    class="radar-vertex-label"
                  >
                    {{ lbl.pillar.label }}
                  </text>
                </g>
              </svg>

              <!-- Legend Footer under SVG -->
              <div class="radar-legend-bar">
                <div class="legend-item" v-if="radarMode === 'compare' || radarMode === 'baseline'">
                  <span class="legend-dot baseline"></span>
                  <span>Sesi 1 (Awal Masuk: Rata-rata 50)</span>
                </div>
                <div class="legend-item" v-if="radarMode === 'compare' || radarMode === 'current'">
                  <span class="legend-dot current"></span>
                  <strong>Sesi Terkini (Rata-rata {{ overallAverageScore }})</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: 5 Pillars Detailed Growth Cards -->
          <div class="radar-details-col">
            <div class="kpi-score-badge-card">
              <div class="kpi-score-left">
                <span class="kpi-lbl">Skor Rata-Rata Kemampuan</span>
                <div class="kpi-val-row">
                  <strong class="kpi-num">{{ overallAverageScore }}</strong>
                  <span class="kpi-denom">/ 100</span>
                  <span class="kpi-grade-badge">Predikat: Mahir & Mandiri</span>
                </div>
              </div>
              <div class="kpi-growth-box">
                <span class="kpi-grow-lbl">Pertumbuhan:</span>
                <strong class="kpi-grow-num">+{{ overallGrowthPct }}%</strong>
              </div>
            </div>

            <!-- Pillars Breakdown List -->
            <div class="pillars-breakdown-list">
              <div 
                v-for="p in radarPillars" 
                :key="p.key" 
                class="pillar-breakdown-item"
              >
                <div class="pillar-row-head">
                  <div class="flex items-center gap-2">
                    <span class="p-icon">{{ p.icon }}</span>
                    <div>
                      <strong class="p-title">{{ p.label }}</strong>
                      <div class="p-desc">{{ p.desc }}</div>
                    </div>
                  </div>
                  <div class="pillar-score-box">
                    <span class="p-curr">{{ radarCurrent[p.key] }}</span>
                    <span class="p-diff">+{{ radarCurrent[p.key] - radarBaseline[p.key] }}%</span>
                  </div>
                </div>

                <div class="pillar-meter-wrap">
                  <div class="meter-base-fill" :style="{ width: radarBaseline[p.key] + '%' }" title="Sesi 1 (Awal)"></div>
                  <div class="meter-curr-fill" :style="{ width: radarCurrent[p.key] + '%' }" title="Sesi Terkini"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="quick-cards-grid">
        <div class="quick-card card-humanist" @click="$emit('change-menu', 'c_progress')">
          <div class="quick-icon teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div class="quick-details">
            <h4 class="quick-title">Perkembangan Anak (Swimming Report)</h4>
            <p class="quick-desc">Lihat evaluasi teknik pernapasan, gaya dada, dan catatan coach dari sesi terakhir.</p>
          </div>
          <svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <div class="quick-card card-humanist" @click="$emit('change-menu', 'c_schedule')">
          <div class="quick-icon gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="quick-details">
            <h4 class="quick-title">Jadwal Sesi Selanjutnya</h4>
            <p class="quick-desc" v-if="nextSchedule">
              {{ nextSchedule.day }}, {{ nextSchedule.time }} bersama {{ nextSchedule.coachName || studentData.assignedCoachName || 'Coach' }} di {{ nextSchedule.location || studentData.location }}.
            </p>
            <p class="quick-desc" v-else>
              Belum ada jadwal sesi latihan aktif saat ini.
            </p>
          </div>
          <svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <!-- Recent Coach Note Card -->
      <div class="recent-note-card card-humanist" v-if="latestReport">
        <div class="note-header">
          <div class="note-title-wrap">
            <span class="badge-chip green">Catatan Coach Sesi {{ latestReport.sessionNumber }}</span>
            <span class="note-date">{{ latestReport.date }} • Oleh {{ latestReport.coachName }}</span>
          </div>
          <button @click="$emit('change-menu', 'c_progress')" class="btn-secondary btn-sm">
            Lihat Raport Lengkap
          </button>
        </div>
        <p class="note-quote">"{{ latestReport.coachNotes }}"</p>
        <div class="note-rec">
          <strong>Rekomendasi Coach:</strong> {{ latestReport.recommendation }}
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_progress (PERKEMBANGAN ANAK / SWIMMING REPORT) -->
    <div v-else-if="resolvedMenu === 'c_progress'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Raport Perkembangan Berkala</span>
          <h2 class="page-title">Perkembangan Anak: {{ studentData.name }}</h2>
          <p class="page-sub">Laporan evaluasi kemampuan teknik, keberanian, dan kesiapan kenaikan level.</p>
        </div>
        <button @click="printReport" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Cetak / Simpan Raport</span>
        </button>
      </div>

      <!-- Level Tracker Progression Map -->
      <div class="level-progress-tracker card-humanist">
        <div class="tracker-header-flex">
          <div>
            <h4 class="tracker-title">Status Kurikulum & Capaian Level: {{ activeProduct?.name || 'Program' }}</h4>
            <p class="tracker-sub">Kurikulum berjenjang terstruktur dari {{ activeProductLevels.length }} tahapan level yang ditentukan instruktur.</p>
          </div>
          <span class="badge-chip gold">Level Saat Ini: {{ currentStudentLevel }}</span>
        </div>
        <div class="tracker-steps-grid">
          <div 
            v-for="lvl in activeProductLevels" 
            :key="lvl.levelNumber"
            class="tracker-step"
            :class="{
              'completed': currentStudentLevel > lvl.levelNumber,
              'in-progress': currentStudentLevel === lvl.levelNumber,
              'locked': currentStudentLevel < lvl.levelNumber
            }"
          >
            <div class="step-circle" :class="{ 'current': currentStudentLevel === lvl.levelNumber }">
              <span v-if="currentStudentLevel > lvl.levelNumber">✓</span>
              <span v-else>{{ lvl.levelNumber }}</span>
            </div>
            <div class="step-info">
              <span class="step-lvl">
                Level {{ lvl.levelNumber }}
                <span v-if="currentStudentLevel === lvl.levelNumber">(Aktif)</span>
              </span>
              <strong class="step-name">{{ lvl.title }}</strong>
              <span class="step-status">
                {{ currentStudentLevel > lvl.levelNumber ? 'Lulus & Tersertifikasi' : (currentStudentLevel === lvl.levelNumber ? 'Sedang Berlangsung' : 'Belum Terbuka') }}
              </span>
              <p v-if="lvl.focus" class="step-focus-text">{{ lvl.focus }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History of Session Reports -->
      <div class="session-reports-list">
        <h4 class="list-section-title">Riwayat Evaluasi Sesi Latihan</h4>
        
        <div 
          v-for="rep in reversedReports" 
          :key="rep.sessionNumber" 
          class="session-report-card card-humanist"
        >
          <div class="report-header">
            <div class="report-num-pill">
              <span class="num">Sesi {{ rep.sessionNumber }}</span>
              <span class="date">{{ rep.date }}</span>
            </div>
            <div class="report-coach-badge">
              <span>Instruktur: {{ rep.coachName }}</span>
            </div>
          </div>

          <div class="report-focus-strip">
            <span class="lbl">Latihan Inti:</span>
            <strong class="focus-val">{{ rep.mainExercise || rep.focus }}</strong>
          </div>

          <!-- Structured Training Materials -->
          <div class="training-materials-box" v-if="rep.warmup || rep.cooldown">
            <div class="mat-item" v-if="rep.warmup">
              <span class="mat-lbl">Pemanasan :</span>
              <span class="mat-txt">{{ rep.warmup }}</span>
            </div>
            <div class="mat-item" v-if="rep.cooldown">
              <span class="mat-lbl">Pendinginan :</span>
              <span class="mat-txt">{{ rep.cooldown }}</span>
            </div>
          </div>

          <!-- Assessment Indicators (if any) -->
          <div class="assessment-indicators-grid" v-if="rep.assessments && rep.assessments.length">
            <div 
              v-for="(item, idx) in rep.assessments" 
              :key="idx" 
              class="indicator-item"
            >
              <span class="ind-name">{{ item.indicator }}</span>
              <span class="ind-score badge-chip teal">{{ item.score }}</span>
            </div>
          </div>

          <!-- Coach Feedback -->
          <div class="coach-feedback-box">
            <span class="feedback-lbl">Catatan Coach:</span>
            <p class="feedback-text">{{ rep.coachNotes }}</p>
          </div>

          <div class="coach-sign-footer" v-if="rep.coachName">
            <span class="sign-salam">Salam,</span>
            <strong class="sign-coach">{{ rep.coachName }}</strong>
          </div>

          <div class="recommendation-strip" v-if="rep.recommendation">
            <span class="rec-lbl">Target Pertemuan Berikutnya:</span>
            <span class="rec-text">{{ rep.recommendation }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_schedule -->
    <div v-else-if="resolvedMenu === 'c_schedule'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Jadwal Kelas</span>
          <h2 class="page-title">Jadwal Sesi Latihan Saya</h2>
          <p class="page-sub">Daftar waktu dan lokasi sesi latihan aktif ananda.</p>
        </div>
      </div>

      <div class="schedule-list-grid">
        <div 
          v-for="sch in (studentData.memberSchedules || [])" 
          :key="sch.sessionNo" 
          class="schedule-card card-humanist"
        >
          <div class="sch-badge-row">
            <span class="badge-chip" :class="sch.status.includes('Selesai') ? 'green' : (sch.status.includes('Mendatang') ? 'teal' : 'gold')">
              Sesi Ke-{{ sch.sessionNo }} ({{ sch.status }})
            </span>
            <span class="sch-date">{{ sch.date }}</span>
          </div>
          <h3 class="sch-time">{{ sch.time }}</h3>
          <p class="sch-program">{{ studentData.program }} • {{ studentData.packageType }}</p>
          <div class="sch-meta">
            <div class="meta-row">
              <span class="lbl">Pelatih Pendamping:</span>
              <strong class="val">{{ sch.coachName || sch.coach || studentData.assignedCoachName }}</strong>
              <span v-if="sch.isSubstitute" class="badge-chip gold mini" style="font-size: 10px; margin-left: 6px;">
                Coach Pengganti ({{ sch.substituteReason || 'Tugas Khusus' }})
              </span>
            </div>
            <div class="meta-row">
              <span class="lbl">Lokasi:</span>
              <span class="val">{{ sch.location || studentData.location }}</span>
            </div>
          </div>
          <div class="sch-preparation">
            <strong>Aturan Izin:</strong> Konfirmasi berhalangan hadir wajib disampaikan maksimal 24 jam sebelum sesi dimulai agar hak sesi pengganti (make-up class) tidak hangus.
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_certificates -->
    <div v-else-if="resolvedMenu === 'c_certificates'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip green">Pencapaian & Kelulusan</span>
          <h2 class="page-title">Sertifikat Resmi mine.skills</h2>
          <p class="page-sub">Apresiasi dan bukti pencapaian tantangan level ananda.</p>
        </div>
      </div>

      <div class="cert-card card-humanist">
        <div class="cert-border-inner">
          <div class="cert-header">
            <span class="cert-org">mine.skills academy</span>
            <h3 class="cert-title">SERTIFIKAT KELULUSAN LEVEL</h3>
            <span class="cert-id">No. Registrasi: CERT-MS-2026-0891</span>
          </div>

          <div class="cert-body">
            <p class="cert-given">Diberikan secara resmi kepada:</p>
            <h2 class="cert-student">{{ studentData.name }}</h2>
            <p class="cert-desc">
              Telah berhasil menyelesaikan seluruh indikator kompetensi dan lulus tantangan mandiri pada:
            </p>
            <div class="cert-level-badge">
              <strong>LEVEL {{ currentStudentLevel }}: {{ (activeProductLevels.find(l => l.levelNumber === currentStudentLevel)?.title || studentData.currentLevelTitle || 'KOMPETENSI TERUJI').toUpperCase() }}</strong>
              <span>{{ activeProductLevels.find(l => l.levelNumber === currentStudentLevel)?.challenge || studentData.targetChallenge || 'Tantangan Kelulusan Mandiri' }}</span>
            </div>
          </div>

          <div class="cert-footer">
            <div class="sig-box">
              <div class="sig-line">{{ studentData.assignedCoachName || studentData.coachName || 'Coach Pembina' }}</div>
              <span class="sig-title">Instruktur {{ activeProduct?.name || 'Program' }}</span>
            </div>
            <div class="sig-box">
              <div class="sig-line">Tim Manajemen</div>
              <span class="sig-title">Head of Academy mine.skills</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_billing -->
    <div v-else-if="resolvedMenu === 'c_billing'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Administrasi & Tagihan</span>
          <h2 class="page-title">Status Paket & Riwayat Pembayaran</h2>
          <p class="page-sub">Informasi invoice dan perpanjangan paket sesi ananda.</p>
        </div>
      </div>

      <!-- Banner Kuota Sesi Selesai / Perlu Perpanjangan -->
      <div v-if="studentData.completedSessions >= studentData.packageTotalSessions" class="renewal-alert-banner" style="background: linear-gradient(135deg, #fef3c7, #fef9c3); border: 1.5px solid #fde047; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div>
          <span class="badge-chip gold" style="font-size: 11px; margin-bottom: 4px;">Paket Sesi Selesai ({{ studentData.completedSessions }}/{{ studentData.packageTotalSessions }} Pertemuan)</span>
          <h4 style="font-size: 16px; font-weight: 800; color: #854d0e; margin: 4px 0 2px;">Siswa telah menyelesaikan seluruh sesi pada paket sebelumnya</h4>
          <p style="font-size: 13px; color: #713f12; margin: 0;">Tagihan perpanjangan paket lanjutan telah diterbitkan. Silakan melakukan pembayaran agar sesi latihan berikutnya dapat segera dijadwalkan.</p>
        </div>
      </div>

      <!-- Daftar Invoice & Status Paket Siswa -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div 
          v-for="trx in studentTransactions" 
          :key="trx.id"
          class="billing-card card-humanist"
        >
          <div class="billing-header">
            <div>
              <span class="badge-chip" :class="trx.status.includes('Lunas') ? 'green' : 'gold'">
                {{ trx.status }}
              </span>
              <h3 class="billing-pkg">{{ trx.packageName || studentData.packageType }}</h3>
              <span class="billing-inv">No. Invoice: {{ trx.id }}</span>
            </div>
            <div class="billing-total">
              <span class="lbl">Total Tagihan</span>
              <strong class="val">{{ trx.formattedAmount || ('Rp ' + Number(trx.amount || 0).toLocaleString('id-ID')) }}</strong>
            </div>
          </div>
          <div class="billing-details">
            <div class="b-row">
              <span>Sesi Terpakai:</span>
              <strong>{{ studentData.completedSessions }} dari {{ studentData.packageTotalSessions }} Sesi</strong>
            </div>
            <div class="b-row">
              <span>Sisa Pertemuan:</span>
              <strong>{{ Math.max(0, studentData.packageTotalSessions - studentData.completedSessions) }} Sesi (Didampingi {{ studentData.assignedCoachName }})</strong>
            </div>
            <div class="b-row">
              <span>Metode Pembayaran:</span>
              <span>{{ trx.paymentMethodName || 'QRIS & Transfer Bank' }}</span>
            </div>
          </div>

          <!-- Tombol Bayar jika status Menunggu Pembayaran -->
          <div v-if="!trx.status.includes('Lunas')" style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: flex-end;">
            <button @click="openPaymentModal(trx.amount, trx.packageName, trx)" class="btn-primary" style="padding: 9px 18px; font-size: 13px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>Bayar Tagihan Ini ({{ trx.formattedAmount || ('Rp ' + Number(trx.amount || 0).toLocaleString('id-ID')) }})</span>
            </button>
          </div>

          <!-- Tombol Unduh Invoice Resmi jika sudah Lunas -->
          <div v-else style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: flex-end;">
            <button @click="downloadCustomerInvoice(trx)" class="btn-secondary" style="padding: 8px 16px; font-size: 12.5px; display: inline-flex; align-items: center; gap: 7px; color: #15803d; border-color: #86efac; background: #f0fdf4; font-weight: 700; cursor: pointer;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Unduh Tanda Terima / Invoice Ber-Cap LUNAS (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Rekening Transfer Bank Resmi (Dinamis dari Master Manajemen) -->
      <div class="bank-transfer-option card-humanist" style="margin-top: 20px;">
        <div style="margin-bottom: 14px;">
          <h4 style="font-size: 15px; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 4px;">
            Alternatif Pembayaran: Transfer Rekening Bank Resmi
          </h4>
          <p style="font-size: 13px; color: var(--text-muted);">
            Bila tidak menggunakan QRIS, Ayah/Bunda dapat mentransfer biaya paket kursus ke salah satu rekening resmi manajemen berikut:
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          <div 
            v-for="bank in store.paymentConfig?.bankAccounts || []" 
            :key="bank.id" 
            style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 14px; color: var(--color-primary-dark);">{{ bank.bankName }}</strong>
              <span class="badge-chip teal" style="font-size: 10px;">{{ bank.badge }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="font-mono" style="font-size: 18px; font-weight: 800; color: var(--color-primary); letter-spacing: 0.05em;">{{ bank.accountNumber }}</span>
              <button 
                @click="copyBankAcc(bank.accountNumber, bank.bankName)" 
                class="btn-secondary" 
                style="padding: 4px 10px; font-size: 11px;"
                title="Salin No. Rekening"
              >
                {{ copiedBankId === bank.accountNumber ? '✓ Disalin' : 'Salin' }}
              </button>
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">a.n. {{ bank.accountHolder }}</div>
          </div>
        </div>
      </div>

      <!-- PAYMENT METHOD MODAL (QRIS & TRANSFER BANK DENGAN DROPDOWN OPSI) -->
      <div v-if="showPaymentModal" class="modal-backdrop" @click.self="showPaymentModal = false">
        <div class="modal-dialog" style="max-width: 480px;">
          <div class="modal-header">
            <div>
              <span class="badge-chip gold">Metode Pembayaran Resmi</span>
              <h3 class="modal-title" style="margin-top: 4px;">Pilih Cara Pembayaran</h3>
            </div>
            <button class="btn-close" @click="showPaymentModal = false">✕</button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <!-- Info Tagihan Ringkas -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11.5px; color: #64748b; display: block;">Total Tagihan:</span>
                <strong style="font-size: 18px; color: #0284c7;" class="font-mono">Rp {{ Number(qrisPayAmount || 0).toLocaleString('id-ID') }}</strong>
              </div>
              <span class="badge-chip teal">{{ activePayingTrx?.id || 'Tagihan Kursus' }}</span>
            </div>

            <!-- Tab / Pilihan Metode Pembayaran Utama (QRIS vs Transfer Bank) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
              <button 
                type="button" 
                @click="selectedPayMethod = 'qris'" 
                :class="selectedPayMethod === 'qris' ? 'btn-primary' : 'btn-secondary'"
                style="padding: 12px 10px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; border-radius: 10px;"
              >
                <span style="font-size: 15px;">📱 QRIS Resmi</span>
                <span style="font-size: 10.5px; opacity: 0.85; font-weight: 500;">BCA, GoPay, Mandiri, OVO & Semua Bank</span>
              </button>
              <button 
                type="button" 
                @click="selectedPayMethod = 'transfer'" 
                :class="selectedPayMethod === 'transfer' ? 'btn-primary' : 'btn-secondary'"
                style="padding: 12px 10px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; border-radius: 10px;"
              >
                <span style="font-size: 15px;">🏦 Transfer Bank</span>
                <span style="font-size: 10.5px; opacity: 0.85; font-weight: 500;">BCA, Mandiri, BRI, BNI</span>
              </button>
            </div>

            <!-- ==============================================
                 OPSI A: QRIS DENGAN KARTU ORNAMEN RESMI
                 ============================================== -->
            <div v-if="selectedPayMethod === 'qris'" class="qris-payment-panel">
              <!-- Dropdown Opsi QRIS -->
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" style="font-weight: 700; font-size: 12.5px;">Pilihan Tampilan / Format QRIS:</label>
                <select v-model="qrisDisplayFormat" class="form-select" style="font-size: 13px;">
                  <option value="card">Kartu Standar mine.skills (Siap Download PNG)</option>
                  <option value="qr_only">QR Code Saja (Langsung Scan di Layar)</option>
                </select>
              </div>

              <!-- Kartu Ornamen QRIS Resmi (Siap didownload jadi PNG) -->
              <div 
                ref="qrisCardDownloadRef"
                id="qrisCardPoster"
                style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); position: relative; overflow: hidden; margin-bottom: 14px; text-align: center; border: 1px solid rgba(255,255,255,0.1);"
              >
                <!-- Ornamen Lingkaran Aksen Brand -->
                <div style="position: absolute; top: -30px; right: -30px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, rgba(2,132,199,0.35) 0%, rgba(2,132,199,0) 70%); pointer-events: none;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0) 70%); pointer-events: none;"></div>

                <!-- Header Kartu: Logo & ASPI Badge -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 10px;">
                  <div style="text-align: left;">
                    <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.05em; color: #38bdf8;">MINE.SKILLS</div>
                    <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Official Payment Partner</span>
                  </div>
                  <div style="background: #dc2626; color: #ffffff; font-weight: 900; font-size: 14px; padding: 3px 10px; border-radius: 6px; letter-spacing: 0.08em;">
                    QRIS
                  </div>
                </div>

                <!-- QR Image Holder -->
                <div style="background: #ffffff; padding: 12px; border-radius: 12px; display: inline-block; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                  <img v-if="custQrisDataUrl" :src="custQrisDataUrl" alt="QRIS Dinamis" style="width: 200px; height: 200px; display: block; border-radius: 4px;" />
                  <div v-else style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 12px;">Menyiapkan QRIS...</div>
                </div>

                <!-- Nominal Terkunci -->
                <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 8px 12px; margin-bottom: 8px;">
                  <span style="font-size: 11px; color: #94a3b8; display: block;">Nominal Terkunci Otomatis:</span>
                  <div style="font-size: 21px; font-weight: 900; color: #38bdf8;" class="font-mono">
                    Rp {{ Number(qrisPayAmount || 0).toLocaleString('id-ID') }}
                  </div>
                </div>

                <!-- Footer Ornamen: Nama Merchant & Info ASPI -->
                <div style="font-size: 10.5px; color: #94a3b8; line-height: 1.4;">
                  NMID: {{ store.paymentConfig?.nmid || 'ID1020038847291' }} • {{ store.paymentConfig?.merchantName || 'MINE.SKILLS INDONESIA' }}
                  <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Terverifikasi Otomatis oleh Sistem Perbankan ASPI</div>
                </div>
              </div>

              <!-- Tombol Aksi QRIS -->
              <div style="display: flex; gap: 8px;">
                <button 
                  type="button" 
                  @click="downloadQrisImage" 
                  class="btn-primary" 
                  style="flex: 1; padding: 9px; font-size: 12.5px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"
                  :disabled="isDownloadingQris"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{{ isDownloadingQris ? 'Menyimpan...' : 'Download Gambar QRIS (PNG)' }}</span>
                </button>
                <button 
                  type="button" 
                  @click="copyBankAcc(qrisPayAmount, 'Nominal QRIS')" 
                  class="btn-secondary" 
                  style="padding: 9px 12px; font-size: 12px;"
                  title="Salin Angka Tagihan"
                >
                  {{ copiedBankId === qrisPayAmount ? '✓ Disalin' : 'Salin Nominal' }}
                </button>
              </div>
            </div>

            <!-- ==============================================
                 OPSI B: TRANSFER BANK DENGAN DROPDOWN PILIHAN
                 ============================================== -->
            <div v-else class="transfer-payment-panel">
              <!-- Dropdown Pilih Bank -->
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" style="font-weight: 700; font-size: 12.5px;">Pilih Rekening Bank Tujuan:</label>
                <select v-model="selectedBankId" class="form-select" style="font-size: 13px;">
                  <option 
                    v-for="b in (store.paymentConfig?.bankAccounts || [])" 
                    :key="b.id" 
                    :value="b.id"
                  >
                    {{ b.bankName }} — {{ b.accountNumber }} (a.n {{ b.accountHolder }})
                  </option>
                </select>
              </div>

              <!-- Kartu Detail Rekening yang Dipilih -->
              <div 
                v-if="selectedBankDetail" 
                style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 16px; margin-bottom: 14px;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong style="font-size: 15px; color: #166534;">{{ selectedBankDetail.bankName }}</strong>
                  <span class="badge-chip teal">{{ selectedBankDetail.badge || 'Rekening Resmi' }}</span>
                </div>

                <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="font-size: 11px; color: #64748b; display: block;">Nomor Rekening:</span>
                    <span class="font-mono" style="font-size: 18px; font-weight: 900; color: #0284c7; letter-spacing: 0.05em;">
                      {{ selectedBankDetail.accountNumber }}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    @click="copyBankAcc(selectedBankDetail.accountNumber, selectedBankDetail.bankName)" 
                    class="btn-secondary" 
                    style="padding: 5px 12px; font-size: 11.5px; font-weight: 700;"
                  >
                    {{ copiedBankId === selectedBankDetail.accountNumber ? '✓ Disalin' : 'Salin Rekening' }}
                  </button>
                </div>

                <div style="font-size: 12px; color: #166534; margin-bottom: 6px;">
                  Atas Nama: <strong>{{ selectedBankDetail.accountHolder }}</strong>
                </div>

                <div style="background: #ecfdf5; border-radius: 6px; padding: 8px 10px; font-size: 11.5px; color: #065f46; line-height: 1.45;">
                  <strong>Penting:</strong> Pastikan mentransfer tepat sejumlah <strong>Rp {{ Number(qrisPayAmount || 0).toLocaleString('id-ID') }}</strong> (termasuk 3 digit kode unik) agar pembayaran otomatis terverifikasi LUNAS oleh sistem.
                </div>
              </div>

              <!-- Tombol Salin Seluruh Instruksi Transfer -->
              <div style="display: flex; gap: 8px;">
                <button 
                  type="button" 
                  @click="copyFullTransferInstruction" 
                  class="btn-primary" 
                  style="flex: 1; padding: 10px; font-size: 12.5px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>{{ copyInstructionStatus || 'Salin Info Transfer & Nominal' }}</span>
                </button>
              </div>
            </div>

            <p style="font-size: 11px; color: var(--text-muted); line-height: 1.45; margin: 16px 0 0; text-align: center;">
              Setelah transfer / scan QRIS berhasil, sistem otomatis mendeteksi mutasi dalam 1 menit dan mengubah invoice menjadi <strong>LUNAS</strong>.
            </p>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
            <button @click="showPaymentModal = false" class="btn-secondary" style="width: 100%;">
              Tutup Jendela Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: DETAIL STATION QUEST LEVEL -->
    <div v-if="isQuestModalOpen && selectedQuestLevel" class="modal-backdrop" @click.self="closeQuestModal">
      <div class="modal-dialog modal-quest-dialog">
        <div class="modal-header">
          <div class="modal-header-info">
            <span class="badge-chip gold">Milestone Capaian Kurikulum</span>
            <h3 class="modal-title">Level {{ selectedQuestLevel.levelNumber }}: {{ selectedQuestLevel.title }}</h3>
          </div>
          <button class="btn-close" @click="closeQuestModal" title="Tutup">✕</button>
        </div>

        <div class="modal-body">
          <div class="quest-modal-hero">
            <div class="quest-badge-big">
              <svg v-if="currentStudentLevel > selectedQuestLevel.levelNumber" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else-if="currentStudentLevel === selectedQuestLevel.levelNumber" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none" color="#d97706">
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div class="quest-hero-meta">
              <h4 class="quest-hero-title">{{ selectedQuestLevel.title }}</h4>
              <span class="badge-chip" :class="currentStudentLevel > selectedQuestLevel.levelNumber ? 'green' : (currentStudentLevel === selectedQuestLevel.levelNumber ? 'gold' : 'teal')">
                {{ currentStudentLevel > selectedQuestLevel.levelNumber ? '✓ Lulus Standar Kompetensi' : (currentStudentLevel === selectedQuestLevel.levelNumber ? 'Sedang Ditempuh (Sesi Aktif)' : 'Belum Terbuka (Tingkat Lanjutan)') }}
              </span>
            </div>
          </div>

          <div class="quest-modal-details card-humanist">
            <div class="q-detail-block">
              <span class="q-detail-label">FOKUS PEMBELAJARAN:</span>
              <p class="q-detail-value">{{ selectedQuestLevel.focus }}</p>
            </div>

            <div class="q-detail-block">
              <span class="q-detail-label">STANDAR KELULUSAN (TARGET CAPAIAN):</span>
              <div class="challenge-highlight-box">
                <span class="challenge-text">{{ selectedQuestLevel.challenge }}</span>
              </div>
            </div>

            <div class="q-detail-block" v-if="currentStudentLevel > selectedQuestLevel.levelNumber">
              <span class="q-detail-label">CATATAN EVALUASI PELATIH:</span>
              <div class="coach-congrats-box">
                <p class="coach-congrats-text">"Ananda telah lulus tantangan ini dengan percaya diri, postur streamline yang baik, dan penguasaan teknik yang matang."</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeQuestModal">Tutup</button>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT PROFIL SISWA & WALI OLEH CUSTOMER -->
    <div v-if="showEditCustProfileModal" class="modal-backdrop" @click.self="showEditCustProfileModal = false">
      <div class="modal-dialog" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge-chip gold">Profil Mandiri</span>
            <h3 class="modal-title">Edit Profil Siswa & Wali Murid</h3>
          </div>
          <button class="btn-close" @click="showEditCustProfileModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSaveCustProfile" class="modal-body" style="padding: 20px;">
          <!-- Data Siswa -->
          <div style="margin-bottom: 16px;">
            <div style="font-size: 13px; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              Data Siswa (Peserta Kursus)
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nama Lengkap Siswa <span class="required">*</span></label>
                <input v-model="custProfileForm.name" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Nama Panggilan (Nickname)</label>
                <input v-model="custProfileForm.nickname" type="text" class="form-input" placeholder="Contoh: Kenzo" />
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Usia Ananda (Tahun) <span class="required">*</span></label>
                <input v-model.number="custProfileForm.age" type="number" min="1" max="40" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Catatan Medis / Alergi</label>
                <input v-model="custProfileForm.medicalCondition" type="text" class="form-input" placeholder="Misal: Asma ringan, alergi kaporit, dll" />
              </div>
            </div>
          </div>

          <!-- Data Orang Tua -->
          <div style="margin-bottom: 16px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
            <div style="font-size: 13px; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              Data Orang Tua / Wali Murid
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nama Ayah / Bunda (Wali) <span class="required">*</span></label>
                <input v-model="custProfileForm.parentName" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Nomor WhatsApp Aktif <span class="required">*</span></label>
                <input v-model="custProfileForm.phone" type="tel" class="form-input" placeholder="08xxxxxxxx" required />
                <span style="font-size: 10.5px; color: var(--text-muted); display: block; margin-top: 2px;">
                  *Nomor tujuan kirim invoice PDF resmi ber-cap LUNAS & laporan coach
                </span>
              </div>
            </div>
            <div class="form-group" style="margin-top: 8px;">
              <label class="form-label">Alamat Email Terdaftar</label>
              <input v-model="custProfileForm.email" type="email" class="form-input" placeholder="email@gmail.com" />
            </div>
          </div>

          <div class="modal-footer" style="padding-top: 12px; border-top: 1px solid #e2e8f0;">
            <button type="button" @click="showEditCustProfileModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary" :disabled="isSavingCustProfile">
              {{ isSavingCustProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, actions } from '../data/store.js';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { convertStaticQrisToDynamic } from '../utils/qris.js';
import { generateInvoicePdf } from '../utils/invoicePdf.js';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'c_overview'
  }
});

const resolvedMenu = computed(() => {
  const m = (props.activeMenu || '').toLowerCase();
  if (m === 'c_finance' || m === 'c_billing' || m === 'c_payments') return 'c_billing';
  if (['c_overview', 'c_progress', 'c_schedule', 'c_certificates'].includes(m)) return m;
  return 'c_overview';
});

defineEmits(['change-menu']);

function downloadCustomerInvoice(trx) {
  try {
    const doc = generateInvoicePdf(trx, store.brand);
    doc.save(`Invoice_${trx.id}_LUNAS.pdf`);
  } catch (err) {
    actions.showAlert({
      title: 'Unduh Invoice',
      message: 'Gagal mengunduh invoice: ' + err.message,
      type: 'error'
    });
  }
}

const showCustomerQris = ref(false);
const showPaymentModal = ref(false);
const selectedPayMethod = ref('qris'); // 'qris' | 'transfer'
const qrisDisplayFormat = ref('card'); // 'card' | 'qr_only'
const selectedBankId = ref('');
const qrisCardDownloadRef = ref(null);
const isDownloadingQris = ref(false);
const copyInstructionStatus = ref('');
const qrisPayAmount = ref(500000);
const custQrisDataUrl = ref('');
const copiedBankId = ref('');

// CUSTOMER EDIT PROFILE (SISWA & WALI MURID)
const showEditCustProfileModal = ref(false);
const isSavingCustProfile = ref(false);
const custProfileForm = ref({
  name: '',
  nickname: '',
  age: 7,
  parentName: '',
  phone: '',
  email: '',
  medicalCondition: ''
});

function openEditCustProfileModal() {
  const current = studentData.value;
  custProfileForm.value = {
    name: current.name || '',
    nickname: current.nickname || current.name?.split(' ')[0] || '',
    age: current.age || 7,
    parentName: current.parentName || '',
    phone: current.phone || '',
    email: current.email || (store.currentUser?.email || ''),
    medicalCondition: current.medicalCondition || ''
  };
  showEditCustProfileModal.value = true;
}

async function handleSaveCustProfile() {
  if (!studentData.value?.id) return;
  isSavingCustProfile.value = true;
  try {
    await actions.updateStudent(studentData.value.id, custProfileForm.value);
    showEditCustProfileModal.value = false;
    actions.showAlert({
      title: 'Pembaruan Berhasil',
      message: 'Profil siswa dan kontak wali murid berhasil diperbarui.',
      type: 'success'
    });
  } catch (err) {
    actions.showAlert({
      title: 'Gagal Memperbarui Profil',
      message: err.message || 'Gagal memperbarui profil siswa.',
      type: 'error'
    });
  } finally {
    isSavingCustProfile.value = false;
  }
}

function copyBankAcc(accNum, bankName) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(accNum);
  }
  copiedBankId.value = accNum;
  setTimeout(() => {
    if (copiedBankId.value === accNum) copiedBankId.value = '';
  }, 2000);
}

const activePayingTrx = ref(null);

const selectedBankDetail = computed(() => {
  const banks = store.paymentConfig?.bankAccounts || [];
  if (selectedBankId.value) {
    const found = banks.find(b => b.id === selectedBankId.value);
    if (found) return found;
  }
  return banks[0] || null;
});

async function openPaymentModal(amount = 500000, packageName = '', trx = null) {
  activePayingTrx.value = trx;
  qrisPayAmount.value = amount;
  selectedPayMethod.value = 'qris';
  qrisDisplayFormat.value = 'card';
  
  const banks = store.paymentConfig?.bankAccounts || [];
  if (banks.length > 0 && !selectedBankId.value) {
    selectedBankId.value = banks[0].id;
  }
  
  showPaymentModal.value = true;
  try {
    const rawStatic = store.paymentConfig?.rawQrisStatic;
    const dynamicQris = convertStaticQrisToDynamic(rawStatic, {
      amount: amount,
      feeType: 'fixed',
      feeValue: 0
    });
    custQrisDataUrl.value = await QRCode.toDataURL(dynamicQris, {
      width: 240,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
  } catch (e) {
    console.warn('Customer QRIS generation error:', e);
  }
}

async function downloadQrisImage() {
  const cardElem = qrisCardDownloadRef.value || document.getElementById('qrisCardPoster');
  if (!cardElem) return;
  
  isDownloadingQris.value = true;
  try {
    const canvas = await html2canvas(cardElem, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });
    const link = document.createElement('a');
    const invId = activePayingTrx.value?.id || 'QRIS';
    link.download = `QRIS_${invId}_mine_skills.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    actions.showAlert({
      title: 'Unduh Barcode',
      message: 'Gagal mengunduh gambar QRIS: ' + err.message,
      type: 'error'
    });
  } finally {
    isDownloadingQris.value = false;
  }
}

function copyFullTransferInstruction() {
  const bank = selectedBankDetail.value;
  if (!bank) return;
  const nominal = Number(qrisPayAmount.value || 0).toLocaleString('id-ID');
  const text = [
    `*Instruksi Pembayaran Paket Kursus mine.skills*`,
    `Bank: ${bank.bankName}`,
    `No. Rekening: ${bank.accountNumber}`,
    `Atas Nama: ${bank.accountHolder}`,
    `Total Transfer: Rp ${nominal} (Wajib pas hingga 3 digit terakhir)`,
    `No. Invoice: ${activePayingTrx.value?.id || '-'}`
  ].join('\n');
  
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  }
  copyInstructionStatus.value = '✓ Info Transfer & Nominal Berhasil Disalin!';
  setTimeout(() => {
    copyInstructionStatus.value = '';
  }, 2500);
}

async function openQrisModal(amount = 500000, packageName = '', trx = null) {
  return openPaymentModal(amount, packageName, trx);
}

const studentData = computed(() => {
  const currentStudentId = store.currentUser?.student_id;
  if (currentStudentId) {
    const found = (store.students || []).find(s => s.id === currentStudentId);
    if (found) return found;
  }
  if (store.currentUser?.email) {
    const foundEmail = (store.students || []).find(s => s.email && s.email.toLowerCase() === store.currentUser.email.toLowerCase());
    if (foundEmail) return foundEmail;
  }
  if (store.currentUser?.name) {
    const foundName = (store.students || []).find(s => s.parentName?.toLowerCase() === store.currentUser.name.toLowerCase() || s.name?.toLowerCase() === store.currentUser.name.toLowerCase());
    if (foundName) return foundName;
  }
  return (store.students || []).find(s => s.userId === store.currentUser?.id) || {
    name: store.currentUser?.name || 'Siswa Didik',
    age: '-',
    parentName: store.currentUser?.name || 'Wali Murid',
    program: store.products[0]?.name || 'Program Belum Dipilih',
    packageType: 'Belum Terdaftar',
    currentLevel: 1,
    currentLevelTitle: 'Belum Terdaftar Program',
    targetChallenge: 'Silakan hubungi admin atau daftar paket baru',
    overallProgress: 0,
    completedSessions: 0,
    packageTotalSessions: 0,
    coachName: 'Belum Ditugaskan',
    assignedCoachName: 'Belum Ditugaskan',
    location: store.locations[0]?.name || 'Lokasi Latihan',
    memberSchedules: [],
    sessionReports: []
  };
});

const studentTransactions = computed(() => {
  const sId = studentData.value?.id;
  const sName = studentData.value?.name;
  const all = store.transactions || [];
  const filtered = all.filter(t => (sId && t.studentId === sId) || (sName && t.studentName?.toLowerCase() === sName.toLowerCase()));
  if (filtered.length > 0) return filtered;
  const byUser = all.filter(t => (store.currentUser?.phone && t.phone === store.currentUser.phone) || (store.currentUser?.email && t.email === store.currentUser.email));
  if (byUser.length > 0) return byUser;
  return [];
});

const activeProduct = computed(() => {
  const prodId = studentData.value.productId;
  if (prodId) {
    const match = (store.products || []).find(p => p.id === prodId);
    if (match) return match;
  }
  return (store.products || [])[0] || null;
});

const activeProductLevels = computed(() => {
  if (activeProduct.value && Array.isArray(activeProduct.value.levels) && activeProduct.value.levels.length > 0) {
    return activeProduct.value.levels;
  }
  return [
    { levelNumber: 1, title: 'Level 1: Dasar', focus: 'Pengenalan & Teori Dasar', challenge: 'Tantangan Dasar' },
    { levelNumber: 2, title: 'Level 2: Menengah', focus: 'Penguasaan Teknik Inti', challenge: 'Tantangan Mandiri' },
    { levelNumber: 3, title: 'Level 3: Mahir', focus: 'Aplikasi & Evaluasi', challenge: 'Ujian Kelulusan' }
  ];
});

const currentStudentLevel = computed(() => {
  return parseInt(studentData.value.currentLevel) || 1;
});

const latestReport = computed(() => {
  const reports = studentData.value?.sessionReports || [];
  return reports.length ? reports[reports.length - 1] : null;
});

const nextSchedule = computed(() => {
  const schedules = studentData.value?.memberSchedules || [];
  return schedules.find(s => s.status === 'Mendatang (Aktif)' || s.status === 'Terjadwal') || null;
});

const reversedReports = computed(() => {
  const reports = [...(studentData.value.sessionReports || [])];
  return reports.reverse();
});

// ========================================================
// GAMIFIKASI: QUEST ROADMAP & RADAR 5 PILAR
// ========================================================
const radarMode = ref('compare'); // 'compare' | 'baseline' | 'current'
const selectedQuestLevel = ref(null);
const isQuestModalOpen = ref(false);

const radarPillars = computed(() => {
  return studentData.value.radarSkills?.pillars || [
    { key: 'waterConfidence', label: 'Keberanian Air', icon: '', desc: 'Adaptasi dan ketenangan di dalam air tanpa panik' },
    { key: 'breathControl', label: 'Ketahanan Nafas', icon: '', desc: 'Pengambilan nafas ritmis dan ketahanan paru-paru' },
    { key: 'strokeTechnique', label: 'Teknik Gerak', icon: '', desc: 'Ayunan tangan dan kekuatan dorongan kaki' },
    { key: 'bodyBalance', label: 'Keseimbangan', icon: '', desc: 'Posisi tubuh mendatar sejajar permukaan air' },
    { key: 'disciplineFocus', label: 'Fokus & Mental', icon: '', desc: 'Konsentrasi mendengarkan instruksi coach di kolam' }
  ];
});

const radarBaseline = computed(() => {
  return studentData.value.radarSkills?.baseline || {
    waterConfidence: 55,
    breathControl: 45,
    strokeTechnique: 40,
    bodyBalance: 50,
    disciplineFocus: 60
  };
});

const radarCurrent = computed(() => {
  return studentData.value.radarSkills?.current || {
    waterConfidence: 92,
    breathControl: 85,
    strokeTechnique: 88,
    bodyBalance: 90,
    disciplineFocus: 85
  };
});

// SVG Pentagon Math constants
const cx = 180;
const cy = 180;
const maxR = 115;

function getPentagonVertex(index, radius) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return { x, y, angle };
}

function getRingPolygonPoints(pct) {
  const r = (pct / 100) * maxR;
  return Array.from({ length: 5 }, (_, i) => {
    const pt = getPentagonVertex(i, r);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');
}

const baselinePolygonPoints = computed(() => {
  const keys = ['waterConfidence', 'breathControl', 'strokeTechnique', 'bodyBalance', 'disciplineFocus'];
  return keys.map((k, i) => {
    const val = radarBaseline.value[k] || 50;
    const r = (val / 100) * maxR;
    const pt = getPentagonVertex(i, r);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');
});

const currentPolygonPoints = computed(() => {
  const keys = ['waterConfidence', 'breathControl', 'strokeTechnique', 'bodyBalance', 'disciplineFocus'];
  return keys.map((k, i) => {
    const val = radarCurrent.value[k] || 85;
    const r = (val / 100) * maxR;
    const pt = getPentagonVertex(i, r);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');
});

const currentVertexPoints = computed(() => {
  const keys = ['waterConfidence', 'breathControl', 'strokeTechnique', 'bodyBalance', 'disciplineFocus'];
  return keys.map((k, i) => {
    const val = radarCurrent.value[k] || 85;
    const r = (val / 100) * maxR;
    const pt = getPentagonVertex(i, r);
    return { ...pt, val, key: k, label: radarPillars.value[i].label, icon: radarPillars.value[i].icon };
  });
});

const labelPositions = computed(() => {
  const labelDist = maxR + 24;
  return Array.from({ length: 5 }, (_, i) => {
    const pt = getPentagonVertex(i, labelDist);
    return {
      x: pt.x,
      y: pt.y,
      pillar: radarPillars.value[i]
    };
  });
});

const overallAverageScore = computed(() => {
  const keys = ['waterConfidence', 'breathControl', 'strokeTechnique', 'bodyBalance', 'disciplineFocus'];
  const total = keys.reduce((sum, k) => sum + (radarCurrent.value[k] || 0), 0);
  return Math.round(total / keys.length);
});

const overallGrowthPct = computed(() => {
  const keys = ['waterConfidence', 'breathControl', 'strokeTechnique', 'bodyBalance', 'disciplineFocus'];
  const baseAvg = keys.reduce((sum, k) => sum + (radarBaseline.value[k] || 0), 0) / keys.length;
  const currAvg = overallAverageScore.value;
  return Math.round(((currAvg - baseAvg) / baseAvg) * 100);
});

function openQuestModal(lvl) {
  selectedQuestLevel.value = lvl;
  isQuestModalOpen.value = true;
}

function closeQuestModal() {
  selectedQuestLevel.value = null;
  isQuestModalOpen.value = false;
}

function printReport() {
  window.print();
}
</script>

<style scoped>
.portal-tab-content {
  max-width: 960px;
  margin: 0 auto;
}

.page-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 4px;
}

.page-sub {
  font-size: 13.5px;
  color: var(--text-muted);
}

/* Student Hero Banner */
.student-hero-banner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  padding: 28px;
  margin-bottom: 24px;
}

.student-hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.student-avatar-wrap {
  position: relative;
}

.student-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
}

.level-indicator-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: var(--color-accent-gold);
  color: #1a1600;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  border: 2px solid #ffffff;
}

.student-name {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 4px 0 2px;
}

.student-meta {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.student-hero-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background-color: var(--bg-subtle);
  padding: 18px;
  border-radius: var(--radius-md);
}

.stat-pill-box {
  display: flex;
  flex-direction: column;
}

.pill-lbl {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  letter-spacing: 0.04em;
}

.pill-val {
  font-size: 15px;
  font-weight: 800;
}

.color-primary { color: var(--color-primary); }

.pill-sub {
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.progress-bar-wrap {
  width: 100%;
  height: 8px;
  background-color: #e2e8e5;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 6px 0 2px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d4d5d, #15803d);
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

/* Quick Cards */
.quick-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  cursor: pointer;
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-icon.teal { background-color: var(--color-primary-soft); color: var(--color-primary); }
.quick-icon.gold { background-color: var(--color-accent-gold-soft); color: var(--color-accent-gold-dark); }

.quick-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.quick-desc {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.chevron-icon {
  color: var(--text-subtle);
  margin-left: auto;
  flex-shrink: 0;
}

/* Recent Note */
.recent-note-card {
  padding: 24px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.note-date {
  font-size: 12px;
  color: var(--text-subtle);
  margin-left: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.note-quote {
  font-size: 14.5px;
  font-style: italic;
  color: var(--text-main);
  background-color: var(--bg-subtle);
  padding: 14px 18px;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
  margin-bottom: 12px;
}

.note-rec {
  font-size: 13px;
  color: var(--text-muted);
}

/* Level Tracker Map */
.level-progress-tracker {
  padding: 24px;
  margin-bottom: 24px;
}

.tracker-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.tracker-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 4px;
}

.tracker-sub {
  font-size: 12.5px;
  color: var(--text-muted);
}

.step-focus-text {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 5px;
  line-height: 1.35;
}

.tracker-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.tracker-step {
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tracker-step.completed {
  border-color: #15803d;
  background-color: #f2f9f3;
}

.tracker-step.in-progress {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
  box-shadow: 0 0 0 2px rgba(13, 77, 93, 0.15);
}

.tracker-step.locked {
  opacity: 0.6;
  background-color: #f8faf9;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  margin-bottom: 8px;
}

.tracker-step.completed .step-circle { background-color: #15803d; color: #ffffff; }
.tracker-step.in-progress .step-circle { background-color: var(--color-primary); color: #ffffff; }
.tracker-step.locked .step-circle { background-color: #cbd5e1; color: #475569; }

.step-lvl {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--text-subtle);
  font-weight: 700;
}

.step-name {
  font-size: 13px;
  display: block;
  margin: 2px 0;
  color: var(--text-main);
}

.step-status {
  font-size: 11px;
  color: var(--text-muted);
}

/* Session Reports List */
.list-section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 14px;
}

.session-report-card {
  padding: 24px;
  margin-bottom: 16px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.report-num-pill {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-num-pill .num {
  font-weight: 800;
  color: var(--color-primary);
  font-size: 15px;
}

.report-num-pill .date {
  font-size: 12px;
  color: var(--text-subtle);
}

.report-coach-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-subtle);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.report-focus-strip {
  background-color: var(--bg-subtle);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  margin-bottom: 14px;
}

.report-focus-strip .lbl {
  color: var(--text-subtle);
  margin-right: 6px;
}

.assessment-indicators-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.indicator-item {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ind-name {
  font-size: 12px;
  color: var(--text-main);
  font-weight: 600;
}

.coach-feedback-box {
  margin-bottom: 12px;
}

.feedback-lbl {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  display: block;
  margin-bottom: 4px;
}

.feedback-text {
  font-size: 13.5px;
  color: var(--text-main);
  line-height: 1.5;
}

.training-materials-box {
  background-color: #f8fafc;
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mat-item {
  font-size: 12.5px;
  display: flex;
  gap: 6px;
}

.mat-lbl {
  font-weight: 700;
  color: var(--color-primary-dark);
}

.mat-txt {
  color: #334155;
}

.coach-sign-footer {
  margin-top: 10px;
  margin-bottom: 8px;
  font-size: 13px;
}

.sign-salam {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}

.sign-coach {
  color: var(--color-primary-dark);
  font-weight: 700;
}

.recommendation-strip {
  border-top: 1px dashed var(--border-subtle);
  padding-top: 10px;
  font-size: 12.5px;
}

.rec-lbl {
  font-weight: 700;
  color: var(--color-primary);
  margin-right: 6px;
}

/* Certificate */
.cert-card {
  padding: 32px;
  background-color: #fffefb;
  border: 2px solid #e5a024;
}

.cert-border-inner {
  border: 1.5px solid #d4af37;
  padding: 32px;
  text-align: center;
}

.cert-org {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-primary);
  font-weight: 800;
}

.cert-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-primary-dark);
  letter-spacing: 0.05em;
  margin: 6px 0;
}

.cert-id {
  font-size: 11px;
  font-family: monospace;
  color: var(--text-subtle);
}

.cert-body {
  margin: 28px 0;
}

.cert-given {
  font-size: 13px;
  color: var(--text-muted);
}

.cert-student {
  font-size: 32px;
  font-weight: 800;
  color: #122428;
  margin: 8px 0;
}

.cert-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto 16px;
}

.cert-level-badge {
  background-color: var(--color-primary-soft);
  display: inline-block;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-primary);
}

.cert-level-badge strong {
  display: block;
  font-size: 16px;
  color: var(--color-primary);
}

.cert-level-badge span {
  font-size: 12px;
  color: var(--text-muted);
}

.cert-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}

.sig-box {
  text-align: center;
}

.sig-line {
  border-top: 1px solid #122428;
  padding-top: 6px;
  font-weight: 700;
  font-size: 13px;
}

.sig-title {
  font-size: 11px;
  color: var(--text-subtle);
}

/* Billing */
.billing-card {
  padding: 24px;
}

.billing-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.billing-pkg {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 4px;
}

.billing-inv {
  font-size: 12px;
  font-family: monospace;
  color: var(--text-subtle);
}

.billing-total {
  text-align: right;
}

.billing-total .lbl { font-size: 11px; color: var(--text-subtle); display: block; }
.billing-total .val { font-size: 22px; color: var(--color-primary); font-weight: 800; }

.billing-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13.5px;
}

.b-row {
  display: flex;
  justify-content: space-between;
}

/* ========================================================
   1. GAMIFIKASI: SKILL QUEST ROADMAP STYLES
   ======================================================== */
.quest-roadmap-card {
  padding: 24px 28px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
  border: 1.5px solid #ccfbf1;
  position: relative;
  overflow: hidden;
}

.quest-roadmap-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.quest-track-sub-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-dark);
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
}

.quest-roadmap-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 6px;
  margin-bottom: 4px;
}

.quest-roadmap-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.quest-summary-stat {
  background: #ffffff;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.q-stat-lbl {
  font-size: 10.5px;
  text-transform: uppercase;
  color: var(--text-subtle);
  font-weight: 700;
}

.q-stat-val {
  font-size: 13px;
}

/* Quest Trail Track */
.quest-trail-wrapper {
  position: relative;
  padding: 40px 12px 16px 12px;
}

.quest-wave-bg {
  position: absolute;
  top: 68px;
  left: 5%;
  right: 5%;
  height: 6px;
  background: linear-gradient(90deg, #10b981 0%, #0d9488 45%, #0284c7 70%, #cbd5e1 100%);
  border-radius: 6px;
  z-index: 1;
}

.quest-stations-row {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.quest-station-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
}

.quest-station-node:hover {
  transform: translateY(-4px);
}

/* Kenzo Floating Avatar Pin */
.kenzo-avatar-pin {
  position: absolute;
  top: -54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  animation: questPinBounce 2.5s infinite ease-in-out;
}

@keyframes questPinBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.pin-speech-bubble {
  background: #042f2e;
  color: #5eead4;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 4px;
  border: 1px solid #14b8a6;
}

.pin-avatar-circle {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2.5px solid #0d9488;
  box-shadow: 0 0 14px rgba(13, 148, 136, 0.6);
  background: #ffffff;
}

.pin-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.pin-ripple-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #14b8a6;
  opacity: 0.8;
  animation: ripplePulse 1.8s infinite;
}

@keyframes ripplePulse {
  0% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Node Checkpoint Circle */
.node-checkpoint-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 3px solid #cbd5e1;
  transition: all 0.25s ease;
  margin-bottom: 12px;
}

.node-completed .node-checkpoint-circle {
  border-color: #10b981;
  background: #ecfdf5;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.node-current .node-checkpoint-circle {
  border-color: #0d9488;
  background: #f0fdfa;
  transform: scale(1.12);
  box-shadow: 0 0 16px rgba(13, 148, 136, 0.4);
}

.node-locked .node-checkpoint-circle {
  border-color: #e2e8f0;
  background: #f8fafc;
  opacity: 0.7;
}

/* Node Card Box */
.node-checkpoint-card {
  width: 100%;
  background: #ffffff;
  padding: 12px 10px;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 120px;
}

.node-current .node-checkpoint-card {
  border-color: #0d9488;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.12);
}

.node-lvl-chip {
  font-size: 9.5px;
  text-transform: uppercase;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: center;
}

.node-lvl-chip.gold { background: #fef08a; color: #854d0e; }
.node-lvl-chip.teal { background: #ccfbf1; color: #115e59; }
.node-lvl-chip.muted { background: #f1f5f9; color: #64748b; }

.node-title {
  font-size: 12.5px;
  color: var(--color-primary-dark);
  line-height: 1.3;
}

.node-challenge-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 3px 6px;
  border-radius: 4px;
  color: #334155;
  text-align: left;
  line-height: 1.25;
}

.node-status-foot {
  margin-top: auto;
  font-size: 11px;
  padding-top: 4px;
}

/* ========================================================
   2. GAMIFIKASI: RADAR SPIDER-WEB CHART STYLES
   ======================================================== */
.radar-pentagon-card {
  padding: 24px 28px;
  margin-bottom: 24px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
}

.radar-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.radar-card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 6px;
  margin-bottom: 4px;
}

.radar-card-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.radar-mode-switcher {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: var(--radius-sm);
  gap: 3px;
}

.r-switch-btn {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.r-switch-btn.active {
  background: #ffffff;
  color: var(--color-primary-dark);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.radar-main-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 28px;
  align-items: center;
}

/* Radar SVG Canvas */
.radar-svg-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.radar-canvas-box {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.radar-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.radar-ring {
  fill: transparent;
  stroke: #e2e8f0;
  stroke-width: 1.2;
}

.radar-ring.outer {
  stroke: #cbd5e1;
  stroke-width: 1.8;
}

.radar-ring.inner {
  stroke-dasharray: 2 2;
}

.radar-axis-line {
  stroke: #e2e8f0;
  stroke-width: 1.2;
}

.radar-polygon-baseline {
  fill: rgba(168, 85, 247, 0.16);
  stroke: #9333ea;
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.radar-polygon-current {
  fill: rgba(13, 148, 136, 0.28);
  stroke: #0d9488;
  stroke-width: 2.8;
  filter: drop-shadow(0 4px 10px rgba(13, 148, 136, 0.25));
}

.radar-vertex-dot {
  fill: #0d9488;
  stroke: #ffffff;
  stroke-width: 2.5;
}

.radar-vertex-label {
  font-size: 11px;
  font-weight: 700;
  fill: #334155;
  font-family: inherit;
}

.radar-legend-bar {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  font-size: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.baseline {
  background: #9333ea;
  border: 1px dashed #ffffff;
}

.legend-dot.current {
  background: #0d9488;
}

/* Radar Right Column Details */
.radar-details-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-score-badge-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
  border: 1.5px solid #99f6e4;
  border-radius: var(--radius-md);
}

.kpi-score-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-lbl {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
}

.kpi-val-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.kpi-num {
  font-size: 32px;
  font-weight: 800;
  color: #0f766e;
  line-height: 1;
}

.kpi-denom {
  font-size: 14px;
  color: var(--text-muted);
}

.kpi-grade-badge {
  font-size: 11.5px;
  font-weight: 700;
  color: #065f46;
  background: #d1fae5;
  padding: 3px 8px;
  border-radius: 12px;
}

.kpi-growth-box {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kpi-grow-lbl {
  font-size: 10.5px;
  color: var(--text-subtle);
  text-transform: uppercase;
}

.kpi-grow-num {
  font-size: 22px;
  font-weight: 800;
  color: #10b981;
}

/* 5 Pillars Breakdown List */
.pillars-breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pillar-breakdown-item {
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pillar-row-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.p-icon {
  font-size: 18px;
}

.p-title {
  font-size: 12.5px;
  color: var(--color-primary-dark);
}

.p-desc {
  font-size: 11px;
  color: var(--text-subtle);
}

.pillar-score-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.p-curr {
  font-size: 14px;
  font-weight: 800;
  color: #0f766e;
}

.p-diff {
  font-size: 10.5px;
  font-weight: 700;
  color: #10b981;
  background: #ecfdf5;
  padding: 1px 5px;
  border-radius: 4px;
}

.pillar-meter-wrap {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.meter-base-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #c084fc;
  border-radius: 6px;
  opacity: 0.6;
}

.meter-curr-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #14b8a6 0%, #10b981 100%);
  border-radius: 6px;
}

/* Quest Modal Detail */
.modal-quest-dialog {
  max-width: 520px;
}

.quest-modal-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0fdfa 0%, #e8f4f7 100%);
  border-radius: var(--radius-lg);
  border: 1px solid #ccfbf1;
  margin-bottom: 20px;
}

.quest-badge-big {
  font-size: 38px;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(13, 77, 93, 0.08);
  flex-shrink: 0;
}

.quest-hero-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quest-hero-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-primary-dark);
  line-height: 1.25;
}

.quest-modal-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.q-detail-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.q-detail-label {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--text-subtle);
  text-transform: uppercase;
}

.q-detail-value {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.5;
}

.challenge-highlight-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fefce8;
  border: 1.5px solid #fef08a;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: #854d0e;
  font-weight: 700;
  font-size: 14px;
}

.challenge-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.coach-congrats-box {
  background: #f0fdf4;
  border-left: 3px solid #22c55e;
  padding: 10px 14px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.coach-congrats-text {
  font-size: 13px;
  color: #15803d;
  font-style: italic;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .quest-stations-row {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .quest-wave-bg {
    display: none;
  }
  .radar-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .student-hero-banner {
    grid-template-columns: 1fr;
  }
  .quick-cards-grid {
    grid-template-columns: 1fr;
  }
  .tracker-steps-grid {
    grid-template-columns: 1fr 1fr;
  }
  .assessment-indicators-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .quest-stations-row {
    grid-template-columns: 1fr;
  }
  .tracker-steps-grid {
    grid-template-columns: 1fr;
  }
  .student-avatar-box {
    margin: 0 auto;
  }
  .student-hero-banner {
    text-align: center;
  }
  .hero-badges-row {
    justify-content: center;
  }
}

.btn-edit-cust-profile {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(13, 77, 93, 0.08);
  border: 1px solid rgba(13, 77, 93, 0.2);
  color: var(--color-primary-dark, #09343f);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit-cust-profile:hover {
  background: var(--color-primary, #0d4d5d);
  color: #ffffff;
  border-color: var(--color-primary, #0d4d5d);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(13, 77, 93, 0.15);
}
</style>
