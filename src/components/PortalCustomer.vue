<template>
  <div class="portal-customer">
    <!-- Active Sub-Menu: c_overview -->
    <div v-if="activeMenu === 'c_overview'" class="portal-tab-content">
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
            <p class="quick-desc">Sabtu, 09.00 WIB bersama {{ studentData.coachName }} di Kolam Graha Kresna Pratama.</p>
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
    <div v-else-if="activeMenu === 'c_progress'" class="portal-tab-content">
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
                {{ currentStudentLevel > lvl.levelNumber ? 'Lulus & Tersertifikasi' : (currentStudentLevel === lvl.levelNumber ? 'Sedang Berlangsung' : 'Terkunci') }}
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
            <span class="lbl">Fokus Latihan:</span>
            <strong class="focus-val">{{ rep.focus }}</strong>
          </div>

          <!-- Assessment Indicators -->
          <div class="assessment-indicators-grid">
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
            <span class="feedback-lbl">Evaluasi Coach:</span>
            <p class="feedback-text">"{{ rep.coachNotes }}"</p>
          </div>

          <div class="recommendation-strip">
            <span class="rec-lbl">Target Pertemuan Berikutnya:</span>
            <span class="rec-text">{{ rep.recommendation }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_schedule -->
    <div v-else-if="activeMenu === 'c_schedule'" class="portal-tab-content">
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
            <span class="badge-chip" :class="sch.status.includes('Selesai') ? 'green' : 'gold'">
              Sesi Ke-{{ sch.sessionNo }} ({{ sch.status }})
            </span>
            <span class="sch-date">{{ sch.date }}</span>
          </div>
          <h3 class="sch-time">{{ sch.time }}</h3>
          <p class="sch-program">{{ studentData.program }} • {{ studentData.packageType }}</p>
          <div class="sch-meta">
            <div class="meta-row">
              <span class="lbl">Coach Pembimbing:</span>
              <strong class="val">{{ sch.coach || studentData.assignedCoachName }}</strong>
            </div>
            <div class="meta-row">
              <span class="lbl">Lokasi:</span>
              <span class="val">{{ studentData.location }}</span>
            </div>
          </div>
          <div class="sch-preparation">
            <strong>Persiapan:</strong> Hadir 10 menit sebelum sesi, bawa kacamata renang & pakaian renang standar.
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_certificates -->
    <div v-else-if="activeMenu === 'c_certificates'" class="portal-tab-content">
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
              <div class="sig-line">Iskandar & Tim Manajemen</div>
              <span class="sig-title">Head of Academy mine.skills</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: c_billing -->
    <div v-else-if="activeMenu === 'c_billing'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Administrasi & Tagihan</span>
          <h2 class="page-title">Status Paket & Riwayat Pembayaran</h2>
          <p class="page-sub">Informasi invoice dan perpanjangan paket sesi ananda.</p>
        </div>
        <button @click="openQrisModal(500000, 'Perpanjangan Paket 4x Sesi')" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <span>Bayar Paket / Tagihan via QRIS</span>
        </button>
      </div>

      <div class="billing-card card-humanist">
        <div class="billing-header">
          <div>
            <span class="badge-chip green">Lunas (Paket Aktif)</span>
            <h3 class="billing-pkg">{{ studentData.packageType }} (4x Pertemuan)</h3>
            <span class="billing-inv">No. Invoice: INV-MS-202610-044</span>
          </div>
          <div class="billing-total">
            <span class="lbl">Total Dibayarkan</span>
            <strong class="val">Rp 500.000</strong>
          </div>
        </div>
        <div class="billing-details">
          <div class="b-row">
            <span>Sesi Terpakai:</span>
            <strong>{{ studentData.completedSessions }} dari {{ studentData.packageTotalSessions }} Sesi</strong>
          </div>
          <div class="b-row">
            <span>Sisa Pertemuan:</span>
            <strong>{{ studentData.packageTotalSessions - studentData.completedSessions }} Sesi Terikat ke {{ studentData.assignedCoachName }}</strong>
          </div>
          <div class="b-row">
            <span>Metode Pembayaran:</span>
            <span>QRIS Dinamis ASPI (Terverifikasi Otomatis)</span>
          </div>
        </div>
      </div>

      <!-- QRIS Checkout Modal for Customer -->
      <div v-if="showCustomerQris" class="modal-backdrop" @click.self="showCustomerQris = false">
        <div class="modal-dialog" style="max-width: 440px; text-align: center;">
          <div class="modal-header">
            <h3 class="modal-title">Pembayaran QRIS mine.skills</h3>
            <button class="btn-close" @click="showCustomerQris = false">✕</button>
          </div>
          <div class="modal-body" style="padding: 24px;">
            <div style="font-weight: 800; font-size: 24px; color: #dc2626; margin-bottom: 2px;">QRIS</div>
            <div style="font-size: 11px; color: var(--text-subtle); margin-bottom: 14px;">ASPI / BANK INDONESIA</div>
            <div style="display: flex; justify-content: center; margin-bottom: 14px;">
              <img v-if="custQrisDataUrl" :src="custQrisDataUrl" alt="QRIS" style="width: 210px; height: 210px;" />
            </div>
            <div style="background: var(--color-primary-soft); padding: 10px; border-radius: 8px; margin-bottom: 14px;">
              <span style="font-size: 11px; color: var(--text-subtle);">Nominal Pembayaran:</span>
              <div style="font-size: 20px; font-weight: 800; color: var(--color-primary);">Rp {{ qrisPayAmount.toLocaleString('id-ID') }}</div>
            </div>
            <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
              Buka aplikasi BCA Mobile, GoPay, OVO, Dana, ShopeePay, atau m-Banking Anda, lalu scan QR Code di atas.
            </p>
            <button @click="showCustomerQris = false" class="btn-primary" style="width: 100%; margin-top: 14px;">
              Saya Sudah Membayar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../data/store.js';
import QRCode from 'qrcode';
import { convertStaticQrisToDynamic } from '../utils/qris.js';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'c_overview'
  }
});

defineEmits(['change-menu']);

const showCustomerQris = ref(false);
const qrisPayAmount = ref(500000);
const custQrisDataUrl = ref('');

async function openQrisModal(amount = 500000) {
  qrisPayAmount.value = amount;
  showCustomerQris.value = true;
  try {
    const rawStatic = store.paymentConfig.rawQrisStatic;
    const dynamicQris = convertStaticQrisToDynamic(rawStatic, {
      amount: amount,
      feeType: 'fixed',
      feeValue: 0
    });
    custQrisDataUrl.value = await QRCode.toDataURL(dynamicQris, {
      width: 220,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
  } catch (e) {
    console.warn('Customer QRIS generation error:', e);
  }
}

const studentData = computed(() => {
  const currentStudentId = store.currentUser?.student_id;
  if (currentStudentId) {
    const found = (store.students || []).find(s => s.id === currentStudentId);
    if (found) return found;
  }
  return (store.students || [])[0] || {
    name: 'Kenzo Al-Fatih',
    age: 7,
    parentName: 'Bunda Sarah',
    program: 'Skill Renang',
    packageType: 'Small Group',
    currentLevel: 2,
    currentLevelTitle: 'Level 2: Breaststroke Hero',
    targetChallenge: '10 Meter Breaststroke Challenge Mandiri',
    overallProgress: 75,
    completedSessions: 3,
    packageTotalSessions: 4,
    coachName: 'Coach Dimas Prasetyo, S.Or.',
    assignedCoachName: 'Coach Dimas Prasetyo, S.Or.',
    location: 'Kolam Graha Kresna Pratama',
    memberSchedules: [],
    sessionReports: []
  };
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
  const reports = studentData.value.sessionReports || [];
  return reports.length ? reports[reports.length - 1] : null;
});

const reversedReports = computed(() => {
  const reports = [...(studentData.value.sessionReports || [])];
  return reports.reverse();
});

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
</style>
