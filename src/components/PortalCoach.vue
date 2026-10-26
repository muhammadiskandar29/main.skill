<template>
  <div class="portal-coach">
    <!-- Active Sub-Menu: co_overview -->
    <div v-if="activeMenu === 'co_overview'" class="portal-tab-content">
      <!-- Coach Header Profile Card -->
      <div class="coach-hero-banner card-humanist">
        <div class="coach-profile-left">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160" alt="Coach Avatar" class="coach-avatar" />
          <div class="coach-info">
            <div class="badge-chip gold">Instruktur mine.skills</div>
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
          <p class="page-sub">Formulir evaluasi kompetensi teknik dan format laporan latihan resmi coach.</p>
        </div>
      </div>

      <!-- Success & Copy Alerts -->
      <div v-if="saveSuccess" class="alert-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Raport perkembangan siswa berhasil disimpan dan dipublikasikan ke portal orang tua!</span>
      </div>

      <div v-if="copySuccess" class="alert-success" style="background-color: #e8f5e9; border-color: #4caf50; color: #2e7d32;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Format laporan WhatsApp berhasil disalin ke clipboard! Silakan paste langsung ke chat orang tua siswa.</span>
      </div>

      <div class="progress-input-grid">
        <!-- Left: Form Input -->
        <div class="assessment-form-card card-humanist">
          <form @submit.prevent="handleSaveReport">
            <h3 class="form-section-title">Data Siswa & Sesi</h3>
            
            <div class="form-grid">
              <!-- Pilih Siswa -->
              <div class="form-group full-width">
                <label class="form-label">Pilih Siswa Didik <span class="required">*</span></label>
                <select v-model="selectedStudentId" class="form-select" required>
                  <option v-for="stu in store.students" :key="stu.id" :value="stu.id">
                    {{ stu.name }} ({{ stu.program || stu.productName }} - {{ stu.currentLevelTitle }})
                  </option>
                </select>
              </div>

              <!-- Level Siswa -->
              <div class="form-group">
                <label class="form-label">Level <span class="required">*</span></label>
                <input 
                  v-model="assessmentData.level" 
                  type="text" 
                  class="form-input" 
                  placeholder="Contoh: Level 1 / Level 2" 
                  required 
                />
              </div>

              <!-- Pertemuan ke -->
              <div class="form-group">
                <label class="form-label">Pertemuan ke <span class="required">*</span></label>
                <input 
                  v-model.number="assessmentData.sessionNumber" 
                  type="number" 
                  min="1"
                  class="form-input" 
                  placeholder="Contoh: 1, 2, 3..." 
                  required 
                />
              </div>
            </div>

            <h3 class="form-section-title" style="margin-top: 20px;">Materi Latihan</h3>
            
            <!-- Pemanasan -->
            <div class="form-group">
              <label class="form-label">Pemanasan :</label>
              <input 
                v-model="assessmentData.warmup" 
                type="text" 
                class="form-input" 
                placeholder="stretching dinamis & statis" 
                required 
              />
            </div>

            <!-- Latihan Inti -->
            <div class="form-group">
              <label class="form-label">Latihan Inti : <span class="required">*</span></label>
              <textarea 
                v-model="assessmentData.mainExercise" 
                class="form-textarea" 
                rows="2" 
                placeholder="Contoh: Gerakan meluncur gaya dada & kombinasi ayunan tangan nafas teratur" 
                required
              ></textarea>
            </div>

            <!-- Pendinginan -->
            <div class="form-group">
              <label class="form-label">Pendinginan :</label>
              <input 
                v-model="assessmentData.cooldown" 
                type="text" 
                class="form-input" 
                placeholder="bubbling & starfish" 
                required 
              />
            </div>

            <h3 class="form-section-title" style="margin-top: 20px;">Catatan & Evaluasi</h3>

            <!-- Catatan Coach -->
            <div class="form-group">
              <label class="form-label">Catatan Coach : <span class="required">*</span></label>
              <textarea 
                v-model="assessmentData.coachNotes" 
                class="form-textarea" 
                rows="3" 
                placeholder="Tuliskan catatan evaluasi perkembangan ananda..." 
                required
              ></textarea>
            </div>

            <!-- Nama Coach / Salam -->
            <div class="form-group">
              <label class="form-label">Nama Coach / Tanda Tangan Salam :</label>
              <input 
                v-model="assessmentData.coachName" 
                type="text" 
                class="form-input" 
                placeholder="Coach Adit" 
                required 
              />
            </div>

            <!-- Level Promotion Checkbox -->
            <div class="promotion-box">
              <label class="checkbox-label">
                <input type="checkbox" v-model="assessmentData.promoteLevel" class="checkbox-input" />
                <div class="checkbox-text">
                  <strong>Rekomendasikan Kenaikan Level (Lulus Challenge)</strong>
                  <p>Centang jika anak telah berhasil menuntaskan tantangan level saat ini.</p>
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
                <span>Simpan Raport ke Sistem</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Live Output Preview & WhatsApp Export -->
        <div class="assessment-preview-card card-humanist">
          <div class="preview-header">
            <div>
              <span class="badge-chip gold">Format Output Standar</span>
              <h3 class="preview-title">Laporan Perkembangan Siswa</h3>
              <p class="preview-sub">Hasil format teks siap kirim ke WhatsApp orang tua siswa.</p>
            </div>
            <button @click="copyOutputText" class="btn-secondary btn-sm" title="Salin teks ke clipboard">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{{ copySuccess ? 'Tersalin! ✓' : 'Salin Teks' }}</span>
            </button>
          </div>

          <div class="wa-formatted-preview-box">
            <pre class="wa-preview-text">{{ formattedOutputText }}</pre>
          </div>

          <div class="preview-actions">
            <button @click="copyOutputText" class="btn-gold full-width">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{{ copySuccess ? 'Berhasil Disalin! ✓' : 'Salin Format WhatsApp' }}</span>
            </button>

            <a :href="directWaSendUrl" target="_blank" class="btn-whatsapp full-width" style="margin-top: 10px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6-.01.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31"/>
              </svg>
              <span>Kirim Langsung via WhatsApp</span>
            </a>
          </div>
        </div>
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

    <!-- Active Sub-Menu: co_attendance (PRESENSI KEHADIRAN COACH DENGAN GPS & MINI MAP) -->
    <div v-else-if="activeMenu === 'co_attendance'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Sistem Presensi Geofence GPS</span>
          <h2 class="page-title">Presensi & Kehadiran Coach</h2>
          <p class="page-sub">Wajib menyalakan lokasi GPS untuk memvalidasi kehadiran di Kolam Graha Kresna Pratama.</p>
        </div>
        <div class="live-clock-badge">
          <span>{{ currentDateTimeStr }}</span>
        </div>
      </div>

      <!-- Success Alert -->
      <div v-if="checkInSuccess" class="alert-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Absensi kehadiran berhasil dicatat dan diverifikasi di Kolam Graha Kresna Pratama!</span>
      </div>

      <!-- Error Alert -->
      <div v-if="locationError" class="alert-error-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <strong>Akses Lokasi Diperlukan:</strong>
          <p>{{ locationError }}</p>
        </div>
      </div>

      <!-- Card 1: GPS Check-in Module -->
      <div class="coach-attendance-main card-humanist">
        <div class="att-header-row">
          <div class="att-coach-profile">
            <img :src="currentCoach.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240'" alt="Coach" class="coach-att-avatar" />
            <div>
              <span class="badge-chip teal">Instruktur Aktif</span>
              <h3 class="att-coach-name">{{ currentCoach.name }}</h3>
              <p class="att-venue-target">📍 Target Lokasi: {{ VENUE_COORDS.name }}</p>
            </div>
          </div>

          <div class="gps-status-pill" :class="coachCoords ? (coachCoords.inRadius ? 'valid' : 'warning') : 'idle'">
            <span class="gps-status-dot"></span>
            <span v-if="!coachCoords">GPS Belum Terhubung</span>
            <span v-else-if="coachCoords.inRadius">GPS Terhubung (Radius {{ coachCoords.distance }}m)</span>
            <span v-else>Di Luar Radius ({{ coachCoords.distance }}m)</span>
          </div>
        </div>

        <!-- Section: State A (GPS Not Yet Turned On) -->
        <div v-if="!coachCoords" class="gps-prompt-box">
          <div class="radar-scan-anim">
            <div class="radar-ping"></div>
            <div class="radar-center-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
          <h4 class="prompt-title">Nyalakan Lokasi Perangkat untuk Melakukan Presensi</h4>
          <p class="prompt-desc">
            Sistem memerlukan koordinat GPS presisi untuk memverifikasi bahwa Anda telah berada di lokasi latihan sebelum memulai sesi mengajar.
          </p>

          <div class="prompt-buttons">
            <button @click="requestLocation" class="btn-primary" :disabled="isLocating">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="22" y1="12" x2="18" y2="12"></line>
                <line x1="6" y1="12" x2="2" y2="12"></line>
                <line x1="12" y1="6" x2="12" y2="2"></line>
                <line x1="12" y1="22" x2="12" y2="18"></line>
              </svg>
              <span>{{ isLocating ? 'Mendeteksi Koordinat GPS...' : '📍 Nyalakan GPS & Ambil Titik Lokasi' }}</span>
            </button>

            <!-- Quick fallback for desktop testing -->
            <button @click="useSimulatedVenueLocation" class="btn-text-sm" style="margin-top: 8px;">
              Gunakan Titik Lokasi Kolam Graha Kresna Pratama (Simulasi Tes)
            </button>
          </div>
        </div>

        <!-- Section: State B (GPS Detected & Active Mini Map) -->
        <div v-else class="gps-verified-box">
          <div class="verified-geo-meta">
            <div class="geo-meta-item">
              <span class="geo-lbl">Titik Koordinat:</span>
              <strong class="geo-val font-mono">{{ coachCoords.lat.toFixed(6) }}, {{ coachCoords.lng.toFixed(6) }}</strong>
            </div>
            <div class="geo-meta-item">
              <span class="geo-lbl">Akurasi GPS:</span>
              <strong class="geo-val">± {{ coachCoords.accuracy }} Meter</strong>
            </div>
            <div class="geo-meta-item">
              <span class="geo-lbl">Jarak ke Kolam:</span>
              <strong class="geo-val" :class="coachCoords.inRadius ? 'text-green' : 'text-gold'">
                {{ coachCoords.distance }} Meter ({{ coachCoords.inRadius ? 'Dalam Radius Aman' : 'Perhatian: Luar Radius' }})
              </strong>
            </div>
            <button @click="requestLocation" class="btn-secondary btn-sm" title="Perbarui titik koordinat">
              🔄 Refresh GPS
            </button>
          </div>

          <!-- Mini Map Embed Box (Menampilkan Titik Maps Kecil) -->
          <div class="mini-map-card">
            <div class="mini-map-header">
              <span class="map-label">Titik Maps Presensi Real-Time:</span>
              <a :href="`https://www.google.com/maps?q=${coachCoords.lat},${coachCoords.lng}`" target="_blank" class="map-link-btn">
                <span>Buka di Google Maps</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            <div class="mini-map-frame-wrapper">
              <iframe 
                :src="coachCoords.mapUrl" 
                class="mini-map-iframe" 
                loading="lazy" 
                title="Peta Titik Absen Coach"
              ></iframe>
              <div class="map-pin-indicator">
                <span class="pin-pulse"></span>
                <span class="pin-text">Coach: {{ currentCoach.name }}</span>
              </div>
            </div>
          </div>

          <!-- Check-in Form Inputs -->
          <div class="checkin-inputs-grid">
            <div class="form-group">
              <label class="form-label">Sesi Mengajar Hari Ini <span class="required">*</span></label>
              <select v-model="checkInData.sessionType" class="form-select" required>
                <option value="Sesi Pagi (08.00 - 09.30 WIB)">Sesi Pagi (08.00 - 09.30 WIB)</option>
                <option value="Sesi Siang (10.00 - 11.30 WIB)">Sesi Siang (10.00 - 11.30 WIB)</option>
                <option value="Sesi Sore (15.30 - 17.00 WIB)">Sesi Sore (15.30 - 17.00 WIB)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Kehadiran / Kondisi</label>
              <input 
                v-model="checkInData.notes" 
                type="text" 
                class="form-input" 
                placeholder="Contoh: Hadir tepat waktu, perlengkapan latihan siap" 
              />
            </div>
          </div>

          <div class="checkin-action-bar">
            <button @click="handleCoachCheckIn" class="btn-primary full-width">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Kirim Presensi Kehadiran Sekarang (Check-In)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Coach Attendance History -->
      <div class="attendance-history-section card-humanist" style="margin-top: 24px;">
        <div class="section-top-row">
          <h3 class="section-title">Riwayat Presensi Coach {{ currentCoach.name }}</h3>
          <span class="badge-chip teal">{{ coachAttendanceHistory.length }} Catatan Tersimpan</span>
        </div>

        <div v-if="coachAttendanceHistory.length === 0" class="empty-state-box">
          <p>Belum ada catatan kehadiran hari ini. Silakan aktifkan GPS dan klik Check-In di atas.</p>
        </div>

        <div v-else class="att-history-list">
          <div 
            v-for="att in coachAttendanceHistory" 
            :key="att.id" 
            class="att-history-card"
          >
            <div class="att-hist-left">
              <div class="att-time-pill font-mono">{{ att.time }}</div>
              <div class="att-hist-details">
                <span class="badge-chip green">{{ att.status }}</span>
                <strong class="att-session-title">{{ att.sessionType }}</strong>
                <p class="att-loc-info">📍 {{ att.locationName }} (Radius: {{ att.distanceFromVenue }}m)</p>
                <span class="att-note-txt">{{ att.notes }}</span>
              </div>
            </div>

            <div class="att-hist-right">
              <div class="att-coord-box font-mono">
                Lat: {{ Number(att.latitude).toFixed(5) }}<br/>
                Lng: {{ Number(att.longitude).toFixed(5) }}
              </div>
              <a 
                :href="`https://www.google.com/maps?q=${att.latitude},${att.longitude}`" 
                target="_blank" 
                class="btn-text-sm"
              >
                Lihat di Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Presensi Siswa Binaan Sesi Ini -->
      <div class="student-attendance-section card-humanist" style="margin-top: 24px;">
        <div class="section-top-row">
          <div>
            <h3 class="section-title">Presensi Siswa Binaan Sesi Ini</h3>
            <p class="section-sub">Tandai kehadiran murid sebelum memulai sesi pemanasan.</p>
          </div>
        </div>

        <div class="attendance-card">
          <div v-for="stu in store.students" :key="stu.id" class="attendance-row">
            <div class="att-student-info">
              <strong>{{ stu.name }}</strong>
              <span>{{ stu.program || stu.productName }} • {{ stu.currentLevelTitle }}</span>
            </div>
            <div class="att-status-buttons">
              <button class="att-btn active">Hadir</button>
              <button class="att-btn">Izin</button>
              <button class="att-btn">Sakit</button>
            </div>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
    id: 'coach_1',
    name: 'Coach Adit',
    specialty: 'Renang Anak & Water Safety',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240'
  };
});

const selectedStudentId = ref(store.students[0]?.id || 'stu_1');
const saveSuccess = ref(false);
const copySuccess = ref(false);

const selectedStudent = computed(() => {
  return store.students.find(s => s.id === selectedStudentId.value) || store.students[0];
});

const assessmentData = ref({
  level: 'Level 2',
  sessionNumber: 3,
  warmup: 'stretching dinamis & statis',
  mainExercise: 'Gerakan meluncur gaya dada & kombinasi ayunan tangan nafas teratur',
  cooldown: 'bubbling & starfish',
  coachNotes: 'Ananda hari ini sangat aktif dan percaya diri. Gerakan meluncur gaya dada sudah mencapai jarak 8 meter tanpa henti.',
  coachName: 'Coach Adit',
  promoteLevel: false
});

watch(selectedStudent, (newStu) => {
  if (newStu) {
    assessmentData.value.level = newStu.currentLevelTitle || `Level ${newStu.currentLevel || 1}`;
    assessmentData.value.sessionNumber = (newStu.sessionReports?.length || newStu.completedSessions || 0) + 1;
  }
}, { immediate: true });

const formattedOutputText = computed(() => {
  const stuName = selectedStudent.value?.name || '';
  const lvl = assessmentData.value.level || '';
  const sess = assessmentData.value.sessionNumber || 1;
  const warmup = assessmentData.value.warmup || 'stretching dinamis & statis';
  const mainEx = assessmentData.value.mainExercise || '';
  const cooldown = assessmentData.value.cooldown || 'bubbling & starfish';
  const notes = assessmentData.value.coachNotes || '';
  const coach = assessmentData.value.coachName || 'Coach Adit';

  return `Nama siswa : ${stuName}
Level : ${lvl}
Pertemuan ke : ${sess}

Materi latihan
Pemanasan : ${warmup}
Latihan inti : ${mainEx}
Pendinginan : ${cooldown}

Catatan coach
${notes}

Salam,
${coach}`;
});

async function copyOutputText() {
  try {
    await navigator.clipboard.writeText(formattedOutputText.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3500);
  } catch (err) {
    console.error('Clipboard copy error:', err);
  }
}

const directWaSendUrl = computed(() => {
  const phone = selectedStudent.value?.phone || store.brand.callCenter;
  const cleanPhone = actions.cleanWaNumber(phone);
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedOutputText.value)}`;
});

async function handleSaveReport() {
  const reportPayload = {
    studentId: selectedStudentId.value,
    studentName: selectedStudent.value?.name,
    level: assessmentData.value.level,
    sessionNumber: assessmentData.value.sessionNumber,
    warmup: assessmentData.value.warmup,
    mainExercise: assessmentData.value.mainExercise,
    cooldown: assessmentData.value.cooldown,
    coachNotes: assessmentData.value.coachNotes,
    coachName: assessmentData.value.coachName || 'Coach Adit',
    promoteLevel: assessmentData.value.promoteLevel
  };

  const ok = await actions.addSessionReport(selectedStudentId.value, reportPayload);
  if (ok) {
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 4000);
  }
}

// ==========================================
// FITUR KEHADIRAN & GEOFENCE GPS COACH
// ==========================================
const VENUE_COORDS = {
  name: 'Kolam Graha Kresna Pratama, Jatiwaringin',
  lat: -6.2847,
  lng: 106.9142,
  radiusMeters: 250
};

// Live Clock Real-Time
const currentDateTimeStr = ref('');
function updateTime() {
  const now = new Date();
  currentDateTimeStr.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
}

let clockTimer = null;
onMounted(() => {
  updateTime();
  clockTimer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});

// GPS State
const isLocating = ref(false);
const locationError = ref('');
const coachCoords = ref(null);
const checkInSuccess = ref(false);
const checkInData = ref({
  sessionType: 'Sesi Pagi (08.00 - 09.30 WIB)',
  notes: 'Hadir tepat waktu, perlengkapan latihan siap'
});

// Haversine Formula: Calculate Distance in Meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// OpenStreetMap Embed URL for Mini Map Preview
function generateMapUrl(lat, lng) {
  const delta = 0.003;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

// Request Real GPS Coordinates from Device
function requestLocation() {
  locationError.value = '';
  if (!navigator.geolocation) {
    locationError.value = 'Browser Anda tidak mendukung Geolocation GPS. Anda dapat menggunakan tombol simulasi lokasi untuk mencoba.';
    return;
  }

  isLocating.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      isLocating.value = false;
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy || 10);
      const distance = calculateDistance(lat, lng, VENUE_COORDS.lat, VENUE_COORDS.lng);
      const inRadius = distance <= VENUE_COORDS.radiusMeters;

      coachCoords.value = {
        lat,
        lng,
        accuracy,
        distance,
        inRadius,
        mapUrl: generateMapUrl(lat, lng)
      };
    },
    (err) => {
      isLocating.value = false;
      let msg = 'Gagal mendeteksi lokasi GPS.';
      if (err.code === 1) {
        msg = 'Izin akses lokasi ditolak oleh browser. Mohon izinkan akses lokasi (GPS) pada browser Anda, atau klik tombol simulasi lokasi kolam.';
      } else if (err.code === 2) {
        msg = 'Posisi tidak dapat ditemukan oleh perangkat.';
      } else if (err.code === 3) {
        msg = 'Waktu permintaan lokasi GPS habis (timeout). Silakan coba lagi.';
      }
      locationError.value = msg;
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

// Simulated GPS for Desktop Testing
function useSimulatedVenueLocation() {
  locationError.value = '';
  // Subtle variation within 15-30m of Graha Kresna Pratama
  const jitterLat = (Math.random() - 0.5) * 0.0002;
  const jitterLng = (Math.random() - 0.5) * 0.0002;
  const lat = VENUE_COORDS.lat + jitterLat;
  const lng = VENUE_COORDS.lng + jitterLng;
  const distance = calculateDistance(lat, lng, VENUE_COORDS.lat, VENUE_COORDS.lng);

  coachCoords.value = {
    lat,
    lng,
    accuracy: 8,
    distance,
    inRadius: true,
    mapUrl: generateMapUrl(lat, lng)
  };
}

// Submit Coach Attendance
async function handleCoachCheckIn() {
  if (!coachCoords.value) {
    locationError.value = 'Harap aktifkan lokasi GPS Anda terlebih dahulu sebelum absen!';
    return;
  }

  const payload = {
    coachId: currentCoach.value.id || 'coach_1',
    coachName: currentCoach.value.name,
    coachAvatar: currentCoach.value.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    sessionType: checkInData.value.sessionType,
    locationName: VENUE_COORDS.name,
    latitude: coachCoords.value.lat,
    longitude: coachCoords.value.lng,
    accuracy: coachCoords.value.accuracy,
    distanceFromVenue: coachCoords.value.distance,
    status: coachCoords.value.inRadius ? 'Hadir di Lokasi' : 'Luar Radius Lokasi',
    notes: checkInData.value.notes || 'Presensi mandiri coach dengan verifikasi GPS'
  };

  const res = await actions.recordCoachAttendance(payload);
  if (res) {
    checkInSuccess.value = true;
    setTimeout(() => {
      checkInSuccess.value = false;
    }, 4500);
  }
}

// Filter Attendance History for Current Coach
const coachAttendanceHistory = computed(() => {
  return (store.coachAttendances || []).filter(a => {
    return a.coachName === currentCoach.value.name || a.coachId === currentCoach.value.id;
  });
});
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

/* Progress Input Grid & Live WhatsApp Preview */
.progress-input-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.form-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--border-subtle);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.assessment-preview-card {
  padding: 24px;
  position: sticky;
  top: 90px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.preview-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 4px;
}

.preview-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.wa-formatted-preview-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  padding: 18px 20px;
  margin-bottom: 18px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
}

.wa-preview-text {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13.5px;
  line-height: 1.6;
  color: #1e293b;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #25d366;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 13.5px;
  text-decoration: none;
  transition: background-color 150ms ease;
  border: none;
  cursor: pointer;
}

.btn-whatsapp:hover {
  background-color: #1eb956;
}

@media (max-width: 900px) {
  .progress-input-grid {
    grid-template-columns: 1fr;
  }
  .assessment-preview-card {
    position: static;
  }
}

/* =========================================================
   GEOFENCE GPS ATTENDANCE & MINI MAP STYLES
   ========================================================= */
.live-clock-badge {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.alert-error-box {
  background-color: #fff1f2;
  border: 1.5px solid #fecdd3;
  color: #be123c;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13.5px;
}

.alert-error-box svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.coach-attendance-main {
  padding: 24px;
  background: #ffffff;
}

.att-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 16px;
}

.att-coach-profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.coach-att-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid var(--color-primary);
}

.att-coach-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 3px 0 2px;
}

.att-venue-target {
  font-size: 12.5px;
  color: var(--text-muted);
}

.gps-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
}

.gps-status-pill.valid {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.gps-status-pill.warning {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}

.gps-status-pill.idle {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.gps-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.gps-status-pill.valid .gps-status-dot {
  animation: pulseGreen 2s infinite;
}

@keyframes pulseGreen {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* Prompt State Box (Before GPS Active) */
.gps-prompt-box {
  text-align: center;
  padding: 36px 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #cbd5e1;
  border-radius: var(--radius-lg);
}

.radar-scan-anim {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-ping {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-primary-soft);
  animation: radarWave 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes radarWave {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.6); opacity: 0; }
}

.radar-center-icon {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(11, 83, 81, 0.25);
}

.prompt-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.prompt-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto 20px;
  line-height: 1.5;
}

.prompt-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.btn-text-sm {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;
}

.btn-text-sm:hover {
  color: var(--color-accent-gold-dark);
}

/* Verified GPS State & Mini Map */
.gps-verified-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.verified-geo-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 12px;
}

.geo-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.geo-lbl {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-subtle);
  font-weight: 700;
}

.geo-val {
  font-size: 13px;
  color: var(--text-main);
}

.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.text-green {
  color: #15803d;
}

.text-gold {
  color: #b45309;
}

/* Mini Map Embed Card */
.mini-map-card {
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.mini-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.map-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.map-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.map-link-btn:hover {
  text-decoration: underline;
}

.mini-map-frame-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  background: #e2e8f0;
}

.mini-map-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.map-pin-indicator {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(11, 83, 81, 0.92);
  backdrop-filter: blur(4px);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.pin-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48cae4;
  box-shadow: 0 0 0 rgba(72, 202, 228, 0.4);
  animation: pinPulse 1.5s infinite;
}

@keyframes pinPulse {
  0% { box-shadow: 0 0 0 0 rgba(72, 202, 228, 0.8); }
  70% { box-shadow: 0 0 0 8px rgba(72, 202, 228, 0); }
  100% { box-shadow: 0 0 0 0 rgba(72, 202, 228, 0); }
}

.checkin-inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkin-action-bar {
  margin-top: 4px;
}

/* History Section */
.attendance-history-section {
  padding: 24px;
}

.section-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.section-sub {
  font-size: 12.5px;
  color: var(--text-muted);
}

.empty-state-box {
  padding: 28px;
  text-align: center;
  background: #f8fafc;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 13.5px;
}

.att-history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.att-history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  gap: 16px;
  flex-wrap: wrap;
}

.att-hist-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.att-time-pill {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: var(--color-primary-dark);
  font-weight: 800;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.att-hist-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.att-session-title {
  font-size: 14px;
  color: var(--text-main);
}

.att-loc-info {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.att-note-txt {
  font-size: 11.5px;
  color: var(--text-subtle);
  font-style: italic;
}

.att-hist-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.att-coord-box {
  font-size: 11.5px;
  color: var(--text-muted);
  text-align: right;
  line-height: 1.4;
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
  .checkin-inputs-grid {
    grid-template-columns: 1fr;
  }
  .att-history-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .att-hist-right {
    align-items: flex-start;
    margin-top: 8px;
  }
}
</style>
