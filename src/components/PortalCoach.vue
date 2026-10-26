<template>
  <div class="portal-coach">
    <!-- Active Sub-Menu: co_overview -->
    <div v-if="activeMenu === 'co_overview'" class="portal-tab-content">
      <!-- Coach Header Profile Card -->
      <div class="coach-hero-banner card-humanist">
        <div class="coach-profile-left">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160" alt="Coach Avatar" class="coach-avatar" />
          <div class="coach-info">
            <div class="badge-chip gold">Instruktur Terverifikasi</div>
            <h2 class="coach-name">{{ currentCoach.name }}</h2>
            <p class="coach-meta">{{ currentCoach.specialty }}</p>
          </div>
        </div>

        <div class="coach-profile-stats">
          <div class="stat-box">
            <span class="stat-num">14</span>
            <span class="stat-lbl">Murid Aktif</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">4</span>
            <span class="stat-lbl">Sesi Hari Ini</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">98%</span>
            <span class="stat-lbl">Kelulusan Level</span>
          </div>
        </div>
      </div>

      <!-- Quick Action: Input Perkembangan -->
      <div class="quick-action-strip card-humanist">
        <div>
          <h4 class="strip-title">Perlu Mengisi Raport Latihan Hari Ini?</h4>
          <p class="strip-sub">Catat hasil evaluasi teknik renang siswa setelah sesi selesai agar orang tua dapat memantau.</p>
        </div>
        <button @click="$emit('change-menu', 'co_input_progress')" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Buka Form Input Raport</span>
        </button>
      </div>

      <!-- Today's Schedule -->
      <div class="today-schedule-section">
        <h3 class="section-heading">Jadwal Sesi Mengajar Hari Ini</h3>
        <div class="session-slot-cards">
          <div class="slot-card card-humanist">
            <div class="slot-time">08.00 - 08.45 WIB</div>
            <div class="slot-details">
              <span class="badge-chip teal">Group Class</span>
              <h4 class="slot-title">Renang Level 1: Water Explorer</h4>
              <p class="slot-loc">Kolam Graha Kresna Pratama • 4 Siswa</p>
            </div>
            <button @click="$emit('change-menu', 'co_input_progress')" class="btn-secondary btn-sm">
              Input Raport
            </button>
          </div>

          <div class="slot-card card-humanist active-slot">
            <div class="slot-time">09.00 - 09.45 WIB</div>
            <div class="slot-details">
              <span class="badge-chip gold">Small Group</span>
              <h4 class="slot-title">Renang Level 2: Breaststroke Hero</h4>
              <p class="slot-loc">Kolam Graha Kresna Pratama • Kenzo & Danendra</p>
            </div>
            <button @click="$emit('change-menu', 'co_input_progress')" class="btn-primary btn-sm">
              Input Raport
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: co_input_progress (INPUT PERKEMBANGAN LATIHAN) -->
    <div v-else-if="activeMenu === 'co_input_progress'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Daily Assessment Tool</span>
          <h2 class="page-title">Input Perkembangan Latihan Siswa</h2>
          <p class="page-sub">Formulir evaluasi kompetensi teknik dan umpan balik humanis untuk orang tua.</p>
        </div>
      </div>

      <div class="assessment-form-card card-humanist">
        <!-- Success Alert -->
        <div v-if="saveSuccess" class="alert-success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Raport perkembangan siswa berhasil disimpan dan dipublikasikan ke portal orang tua!</span>
        </div>

        <form @submit.prevent="handleSaveReport">
          <div class="form-grid">
            <!-- Pilih Siswa -->
            <div class="form-group">
              <label class="form-label">Pilih Siswa Didik <span class="required">*</span></label>
              <select v-model="selectedStudentId" class="form-select" required>
                <option v-for="stu in store.students" :key="stu.id" :value="stu.id">
                  {{ stu.name }} ({{ stu.program }} - {{ stu.currentLevelTitle }})
                </option>
              </select>
            </div>

            <!-- Fokus Materi Sesi Ini -->
            <div class="form-group">
              <label class="form-label">Fokus Materi Sesi Ini <span class="required">*</span></label>
              <input 
                v-model="assessmentData.focus" 
                type="text" 
                class="form-input" 
                placeholder="Contoh: Pemantapan Gerakan Kaki Katak & Nafas Teratur" 
                required 
              />
            </div>
          </div>

          <!-- Indikator Penilaian Kompetensi -->
          <div class="indicators-section">
            <h4 class="ind-sec-title">Penilaian Indikator Kompetensi (3 Aspek Utama)</h4>
            
            <div class="indicators-grid-3">
              <div class="form-group">
                <label class="form-label">1. Keberanian & Kepercayaan Diri</label>
                <select v-model="assessmentData.score1" class="form-select">
                  <option value="Sangat Baik">Sangat Baik (Percaya diri penuh)</option>
                  <option value="Baik">Baik (Berani dengan instruksi)</option>
                  <option value="Cukup">Cukup (Masih butuh didampingi)</option>
                  <option value="Perlu Latihan">Perlu Latihan Lebih</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">2. Ketepatan Teknik Gerakan</label>
                <select v-model="assessmentData.score2" class="form-select">
                  <option value="Sangat Baik">Sangat Baik (Simetris & Rileks)</option>
                  <option value="Baik">Baik (Mekanik sudah terbentuk)</option>
                  <option value="Cukup">Cukup (Kadang kaki kurang simetris)</option>
                  <option value="Perlu Latihan">Perlu Latihan Lebih</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">3. Kontrol Nafas & Ketahanan</label>
                <select v-model="assessmentData.score3" class="form-select">
                  <option value="Sangat Baik">Sangat Baik (Tidak tersedak/stabil)</option>
                  <option value="Baik">Baik (Irama 1 tarikan 1 hembus)</option>
                  <option value="Cukup">Cukup (Cepat lelah di akhir)</option>
                  <option value="Perlu Latihan">Perlu Latihan Lebih</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Catatan Evaluasi Coach -->
          <div class="form-group">
            <label class="form-label">Catatan Evaluasi Coach untuk Orang Tua <span class="required">*</span></label>
            <textarea 
              v-model="assessmentData.coachNotes" 
              class="form-textarea" 
              rows="3" 
              placeholder="Contoh: Ananda hari ini sangat aktif dan ceria. Gerakan meluncur gaya dada sudah mencapai jarak 8 meter tanpa berhenti. Pertahankan kedisiplinan nafasnya ya Bunda." 
              required
            ></textarea>
            <span class="form-hint">Gunakan bahasa yang mengapresiasi usaha anak dan informatif bagi orang tua.</span>
          </div>

          <!-- Rekomendasi Sesi Selanjutnya -->
          <div class="form-group">
            <label class="form-label">Rekomendasi Latihan Sesi Berikutnya</label>
            <input 
              v-model="assessmentData.recommendation" 
              type="text" 
              class="form-input" 
              placeholder="Contoh: Simulasi Ujian Challenge 10 Meter Mandiri & Transisi Gaya Punggung." 
            />
          </div>

          <!-- Level Promotion Checkbox -->
          <div class="promotion-box">
            <label class="checkbox-label">
              <input type="checkbox" v-model="assessmentData.promoteLevel" class="checkbox-input" />
              <div class="checkbox-text">
                <strong>Rekomendasikan Kenaikan Level (Lulus Challenge)</strong>
                <p>Centang jika anak telah berhasil menuntaskan tantangan level saat ini dan siap diterbitkan sertifikat kenaikan level.</p>
              </div>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>Simpan & Publikasikan Raport</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Active Sub-Menu: co_schedule -->
    <div v-else-if="activeMenu === 'co_schedule'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Agenda Mengajar</span>
          <h2 class="page-title">Jadwal Sesi Mingguan Coach Dimas</h2>
          <p class="page-sub">Rincian alokasi jam mengajar di Kolam Graha Kresna Pratama.</p>
        </div>
      </div>

      <div class="schedule-table-wrap card-humanist">
        <table class="simple-table">
          <thead>
            <tr>
              <th>Hari & Waktu</th>
              <th>Program & Level</th>
              <th>Tipe Kelas</th>
              <th>Siswa Terdaftar</th>
              <th>Status Slot</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sch in store.schedules" :key="sch.id">
              <td><strong>{{ sch.day }}</strong>, {{ sch.time }}</td>
              <td>{{ sch.program }}</td>
              <td><span class="badge-chip teal">{{ sch.classType }}</span></td>
              <td>{{ sch.students.join(', ') }}</td>
              <td>{{ sch.slotsFilled }}/{{ sch.slotsMax }} Terisi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Active Sub-Menu: co_attendance -->
    <div v-else-if="activeMenu === 'co_attendance'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip green">Presensi Murid</span>
          <h2 class="page-title">Kehadiran Siswa Hari Ini</h2>
          <p class="page-sub">Konfirmasi absensi sebelum memulai sesi latihan kolam.</p>
        </div>
      </div>

      <div class="attendance-card card-humanist">
        <div v-for="stu in store.students" :key="stu.id" class="attendance-row">
          <div class="att-student-info">
            <strong>{{ stu.name }}</strong>
            <span>{{ stu.program }} • {{ stu.currentLevelTitle }}</span>
          </div>
          <div class="att-status-buttons">
            <button class="att-btn active">Hadir</button>
            <button class="att-btn">Izin</button>
            <button class="att-btn">Sakit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sub-Menu: co_students -->
    <div v-else-if="activeMenu === 'co_students'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Daftar Bimbingan</span>
          <h2 class="page-title">Siswa Binaan Aktif</h2>
          <p class="page-sub">Total siswa yang sedang Anda bimbing dalam program peningkatan skill.</p>
        </div>
      </div>

      <div class="students-grid">
        <div v-for="stu in store.students" :key="stu.id" class="student-binaan-card card-humanist">
          <div class="binaan-header">
            <div>
              <h4 class="binaan-name">{{ stu.name }} ({{ stu.age }} th)</h4>
              <span class="binaan-parent">Wali: {{ stu.parentName }} ({{ stu.phone }})</span>
            </div>
            <span class="badge-chip teal">L{{ stu.currentLevel }}</span>
          </div>
          <div class="binaan-level-info">
            <strong>{{ stu.currentLevelTitle }}</strong>
            <p>{{ stu.targetChallenge }}</p>
          </div>
          <div class="binaan-progress">
            <span>Progress Paket: {{ stu.completedSessions }}/{{ stu.packageTotalSessions }} Sesi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, actions } from '../data/store.js';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'co_overview'
  }
});

defineEmits(['change-menu']);

const currentCoach = computed(() => {
  return store.mockUsers.find(u => u.role === 'coach') || {
    name: 'Coach Dimas Prasetyo, S.Or.',
    specialty: 'Renang Anak & Water Safety'
  };
});

const selectedStudentId = ref(store.students[0]?.id || 'stu_1');
const saveSuccess = ref(false);

const assessmentData = ref({
  focus: 'Simulasi Challenge 10 Meter Mandiri & Gaya Dada Stabil',
  score1: 'Sangat Baik',
  score2: 'Baik',
  score3: 'Sangat Baik',
  coachNotes: 'Kemajuan luar biasa! Koordinasi kayuhan tangan dan ayunan kaki katak semakin selaras. Anak berenang dengan rileks dan percaya diri.',
  recommendation: 'Pertahankan daya tahan untuk persiapan sertifikasi kenaikan level.',
  promoteLevel: false
});

function handleSaveReport() {
  const ok = actions.addSessionReport(selectedStudentId.value, assessmentData.value);
  if (ok) {
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 4000);
  }
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

/* Coach Hero */
.coach-hero-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.coach-profile-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.coach-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
}

.coach-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 4px 0 2px;
}

.coach-meta {
  font-size: 13px;
  color: var(--text-muted);
}

.coach-profile-stats {
  display: flex;
  gap: 20px;
}

.stat-box {
  text-align: center;
  background-color: var(--bg-subtle);
  padding: 10px 18px;
  border-radius: var(--radius-md);
}

.stat-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary);
  display: block;
}

.stat-lbl {
  font-size: 11px;
  color: var(--text-subtle);
  font-weight: 600;
}

/* Quick Action Strip */
.quick-action-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 28px;
  background: linear-gradient(90deg, #ffffff, var(--color-primary-soft));
  border-left: 4px solid var(--color-primary);
}

.strip-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.strip-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Session Slot Cards */
.section-heading {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 14px;
}

.session-slot-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.slot-card.active-slot {
  border-color: var(--color-accent-gold);
  background-color: #fefdfa;
}

.slot-time {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary);
  width: 140px;
}

.slot-details {
  flex: 1;
}

.slot-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-main);
  margin: 4px 0 2px;
}

.slot-loc {
  font-size: 12px;
  color: var(--text-muted);
}

/* Assessment Form */
.assessment-form-card {
  padding: 28px;
}

.alert-success {
  background-color: #edf7eb;
  color: #15803d;
  border: 1px solid #c7e9c0;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
}

.indicators-section {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 18px;
  margin-bottom: 20px;
}

.ind-sec-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.indicators-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.promotion-box {
  background-color: var(--color-accent-gold-soft);
  border: 1.5px dashed var(--color-accent-gold);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.checkbox-input {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent-gold-dark);
}

.checkbox-text strong {
  display: block;
  font-size: 14px;
  color: #1a1600;
}

.checkbox-text p {
  font-size: 12px;
  color: #554400;
  margin-top: 2px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

/* Simple Table */
.schedule-table-wrap {
  padding: 0;
  overflow: hidden;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.simple-table th {
  background-color: var(--bg-subtle);
  text-align: left;
  padding: 12px 16px;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
  font-size: 11px;
}

.simple-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-main);
}

/* Attendance */
.attendance-card {
  padding: 16px 20px;
}

.attendance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.attendance-row:last-child {
  border-bottom: none;
}

.att-student-info strong {
  display: block;
  font-size: 14px;
}

.att-student-info span {
  font-size: 12px;
  color: var(--text-muted);
}

.att-status-buttons {
  display: flex;
  gap: 6px;
}

.att-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface);
  color: var(--text-muted);
}

.att-btn.active {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

/* Students Grid */
.students-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.student-binaan-card {
  padding: 20px;
}

.binaan-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.binaan-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.binaan-parent {
  font-size: 12px;
  color: var(--text-muted);
}

.binaan-level-info {
  background-color: var(--bg-subtle);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
  font-size: 12.5px;
}

.binaan-level-info strong {
  display: block;
  color: var(--color-primary);
}

.binaan-level-info p {
  font-size: 11.5px;
}

.binaan-progress {
  font-size: 12px;
  color: var(--text-subtle);
  font-weight: 600;
}

@media (max-width: 768px) {
  .coach-hero-banner {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .coach-profile-left {
    flex-direction: column;
  }
  .quick-action-strip {
    flex-direction: column;
    gap: 14px;
  }
  .indicators-grid-3 {
    grid-template-columns: 1fr;
  }
  .students-grid {
    grid-template-columns: 1fr;
  }
}
</style>
