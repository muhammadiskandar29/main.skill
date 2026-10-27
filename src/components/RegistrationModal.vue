<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-wizard">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-header-info">
          <div class="modal-brand-row">
            <img src="/images/mine-skills-logo.png" alt="mine.skills Logo" class="modal-logo-img" />
            <div class="badge-chip gold">Registrasi Siswa Resmi</div>
          </div>
          <h3 class="modal-title">Formulir Pendaftaran Siswa {{ store.brand.name }}</h3>
          <p class="modal-desc">Asesmen kemampuan awal, reservasi slot kelas, dan tagihan QRIS Dinamis ASPI.</p>
        </div>
        <button class="btn-close" @click="$emit('close')" aria-label="Tutup Formulir">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- State 1: Multi-Step Interactive Wizard Form -->
      <div v-if="!registrationResult" class="wizard-container">
        <!-- Wizard Step Progress Bar -->
        <div class="wizard-stepper">
          <div 
            v-for="(st, idx) in steps" 
            :key="st.number"
            class="step-item"
            :class="{ 
              active: currentStep === st.number, 
              completed: currentStep > st.number 
            }"
            @click="goToStep(st.number)"
          >
            <div class="step-circle">
              <svg v-if="currentStep > st.number" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-else>{{ st.number }}</span>
            </div>
            <div class="step-meta">
              <span class="step-num-txt">Langkah {{ st.number }}</span>
              <strong class="step-title-txt">{{ st.title }}</strong>
            </div>
            <div v-if="idx < steps.length - 1" class="step-connector"></div>
          </div>
        </div>

        <form @submit.prevent="handleStepSubmit" class="modal-body wizard-body">
          <!-- =====================================================================
               STEP 1: DATA PESERTA & ORANG TUA / WALI (SEKSI A & B)
               ===================================================================== -->
          <div v-if="currentStep === 1" class="wizard-step-pane">
            <div class="step-intro-banner">
              <h4 class="step-pane-title">A. Data Peserta & Orang Tua / Wali</h4>
              <p class="step-pane-desc">Informasi dasar ananda dan kontak resmi untuk pelaporan perkembangan serta akun portal.</p>
            </div>

            <!-- Bagian A: Data Anak -->
            <div class="card-section">
              <span class="card-section-badge">Data Ananda</span>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nama Lengkap Anak <span class="required">*</span></label>
                  <input 
                    v-model="formData.studentName" 
                    type="text" 
                    class="form-input" 
                    placeholder="Contoh: Kenzo Al-Fatih" 
                    required 
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Nama Panggilan Anak <span class="required">*</span></label>
                  <input 
                    v-model="formData.nickname" 
                    type="text" 
                    class="form-input" 
                    placeholder="Contoh: Kenzo" 
                    required 
                  />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">Usia Anak (Tahun) <span class="required">*</span></label>
                  <input 
                    v-model="formData.studentAge" 
                    type="number" 
                    min="3" 
                    max="70" 
                    class="form-input" 
                    placeholder="Contoh: 7" 
                    required 
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Jenis Kelamin <span class="required">*</span></label>
                  <div class="chips-selector">
                    <button 
                      type="button" 
                      class="chip-btn" 
                      :class="{ active: formData.gender === 'Laki-laki' }"
                      @click="formData.gender = 'Laki-laki'"
                    >
                      👦 Laki-laki
                    </button>
                    <button 
                      type="button" 
                      class="chip-btn" 
                      :class="{ active: formData.gender === 'Perempuan' }"
                      @click="formData.gender = 'Perempuan'"
                    >
                      👧 Perempuan
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Sekolah & Kelas <span class="required">*</span></label>
                  <input 
                    v-model="formData.schoolGrade" 
                    type="text" 
                    class="form-input" 
                    placeholder="Contoh: SDIT Al-Azhar / Kelas 2" 
                    required 
                  />
                </div>
              </div>
            </div>

            <!-- Bagian B: Data Orang Tua -->
            <div class="card-section" style="margin-top: 18px;">
              <span class="card-section-badge">Data Orang Tua / Wali</span>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nama Orang Tua / Wali <span class="required">*</span></label>
                  <input 
                    v-model="formData.parentName" 
                    type="text" 
                    class="form-input" 
                    placeholder="Contoh: Bunda Sarah Ramadhani" 
                    required 
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Nomor WhatsApp Aktif <span class="required">*</span></label>
                  <input 
                    v-model="formData.phone" 
                    type="tel" 
                    class="form-input" 
                    placeholder="Contoh: 081298456721" 
                    required 
                  />
                  <span class="form-hint">Digunakan admin untuk konfirmasi jadwal resmi & koordinasi kolam.</span>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Email Aktif (Akun Portal) <span class="required">*</span></label>
                  <input 
                    v-model="formData.email" 
                    type="email" 
                    class="form-input" 
                    placeholder="sarah.ramadhani@gmail.com" 
                    required 
                  />
                  <span class="form-hint">Login portal siswa otomatis dibuat dengan default password: <strong>123</strong></span>
                </div>

                <div class="form-group">
                  <label class="form-label">Alamat Domisili Singkat</label>
                  <input 
                    v-model="formData.address" 
                    type="text" 
                    class="form-input" 
                    placeholder="Contoh: Jatiwaringin, Pondok Gede, Kota Bekasi" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- =====================================================================
               STEP 2: ASESMEN KEMAMPUAN RENANG & KESEHATAN (SEKSI C & D)
               ===================================================================== -->
          <div v-else-if="currentStep === 2" class="wizard-step-pane">
            <div class="step-intro-banner">
              <h4 class="step-pane-title">B. Informasi Kemampuan & Keselamatan Air</h4>
              <p class="step-pane-desc">Data ini sangat penting bagi Coach agar dapat menyesuaikan pendekatan latihan dengan aman & terukur.</p>
            </div>

            <div class="card-section">
              <span class="card-section-badge">Kemampuan Renang Anak Saat Ini</span>

              <!-- Pernah les renang -->
              <div class="form-group">
                <label class="form-label">Apakah ananda pernah mengikuti les renang sebelumnya? <span class="required">*</span></label>
                <div class="chips-grid-4">
                  <button 
                    v-for="exp in experienceOptions" 
                    :key="exp"
                    type="button" 
                    class="chip-card-btn"
                    :class="{ active: formData.swimmingExperience === exp }"
                    @click="formData.swimmingExperience = exp"
                  >
                    <span class="chip-title">{{ exp }}</span>
                  </button>
                </div>
              </div>

              <!-- Tingkat Kemampuan Air -->
              <div class="form-group" style="margin-top: 18px;">
                <label class="form-label">Bagaimana kemampuan ananda di air saat ini? <span class="required">*</span></label>
                <div class="chips-grid-wrap">
                  <button 
                    v-for="cap in capacityOptions" 
                    :key="cap"
                    type="button" 
                    class="chip-card-btn mini"
                    :class="{ active: formData.waterConfidence === cap }"
                    @click="formData.waterConfidence = cap"
                  >
                    <span>{{ cap }}</span>
                  </button>
                </div>
              </div>

              <!-- Tingkat Ketakutan Air -->
              <div class="form-group" style="margin-top: 18px;">
                <label class="form-label">Apakah ananda memiliki rasa takut terhadap air? <span class="required">*</span></label>
                <div class="chips-grid-4">
                  <button 
                    v-for="fear in fearOptions" 
                    :key="fear"
                    type="button" 
                    class="chip-card-btn"
                    :class="{ active: formData.waterFear === fear }"
                    @click="formData.waterFear = fear"
                  >
                    <span>{{ fear }}</span>
                  </button>
                </div>
              </div>

              <!-- Gaya Renang Yang Dikuasai -->
              <div class="form-group" style="margin-top: 18px;">
                <label class="form-label">Gaya renang yang sudah dikuasai (Bisa pilih lebih dari satu): <span class="required">*</span></label>
                <div class="chips-grid-wrap">
                  <button 
                    v-for="style in styleOptions" 
                    :key="style"
                    type="button" 
                    class="chip-card-btn mini"
                    :class="{ active: formData.masteredStyles.includes(style) }"
                    @click="toggleStyleOption(style)"
                  >
                    <span v-if="formData.masteredStyles.includes(style)">✓ </span>
                    <span>{{ style }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Bagian D: Kesehatan & Keselamatan -->
            <div class="card-section" style="margin-top: 18px;">
              <span class="card-section-badge">Informasi Kesehatan & Keselamatan</span>

              <div class="form-group">
                <label class="form-label">
                  Kondisi kesehatan, riwayat asma, alergi, atau kebutuhan khusus anak? <span class="required">*</span>
                </label>
                <textarea 
                  v-model="formData.medicalCondition" 
                  class="form-textarea" 
                  rows="2" 
                  placeholder="Contoh: Ada riwayat asma jika kedinginan lama, alergi kaporit ringan. Jika tidak ada, tuliskan 'Tidak ada'."
                  required
                ></textarea>
                <span class="form-hint">Informasi ini mutlak untuk keselamatan anak saat latihan bersama pelatih.</span>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <label class="form-label">Catatan Tambahan untuk Coach (Opsional)</label>
                <input 
                  v-model="formData.coachNotes" 
                  type="text" 
                  class="form-input" 
                  placeholder="Contoh: Ananda sedikit pemalu di pertemuan pertama, mohon bimbingan ramah." 
                />
              </div>
            </div>
          </div>

          <!-- =====================================================================
               STEP 3: PILIHAN KELAS, JADWAL & KOLAM (SEKSI E & F)
               ===================================================================== -->
          <div v-else-if="currentStep === 3" class="wizard-step-pane">
            <div class="step-intro-banner">
              <h4 class="step-pane-title">C. Pilihan Kelas, Jadwal & Fasilitas Kolam</h4>
              <p class="step-pane-desc">Semua paket terdiri dari 4 sesi berjenjang. Penempatan level resmi akan ditentukan melalui evaluasi coach.</p>
            </div>

            <!-- Pilihan Jenis Kelas (Dinamis dari Master Paket) -->
            <div class="card-section">
              <span class="card-section-badge">Pilih Jenis Kelas Pelatihan (Dinamis Master)</span>

              <div class="package-cards-grid">
                <div 
                  v-for="pkg in availablePackages" 
                  :key="pkg.id"
                  class="pkg-choice-card"
                  :class="{ selected: formData.packageId === pkg.id }"
                  @click="formData.packageId = pkg.id"
                >
                  <div class="pkg-choice-top">
                    <span v-if="pkg.badge" class="badge-chip gold mini">{{ pkg.badge }}</span>
                    <span v-else class="badge-chip teal mini">Paket Resmi</span>
                    <strong class="pkg-choice-price">{{ pkg.formattedPrice }}</strong>
                  </div>
                  <h4 class="pkg-choice-name">{{ pkg.name }}</h4>
                  <div class="pkg-choice-specs">
                    <span>👥 {{ pkg.ratio }}</span>
                    <span>⏱️ {{ pkg.duration }}</span>
                    <span>📅 {{ pkg.meetings }}</span>
                  </div>
                  <p class="pkg-choice-desc">{{ pkg.description || 'Program pembinaan skill bertahap dengan pengawasan intensif' }}</p>
                </div>
              </div>
            </div>

            <!-- Pilihan Kolam Latihan (Dinamis dari Master Lokasi) -->
            <div class="card-section" style="margin-top: 18px;">
              <span class="card-section-badge">Pilihan Fasilitas Kolam & Geofence</span>

              <div class="form-group">
                <label class="form-label">Pilih Kolam Renang Latihan <span class="required">*</span></label>
                <div class="venues-choice-grid">
                  <div 
                    v-for="loc in store.locations" 
                    :key="loc.id"
                    class="venue-choice-box"
                    :class="{ selected: formData.location === loc.name }"
                    @click="formData.location = loc.name"
                  >
                    <div class="venue-radio-indicator"></div>
                    <div class="venue-choice-info">
                      <strong class="venue-choice-title">{{ loc.name }}</strong>
                      <span class="venue-choice-sub">{{ loc.area }} • {{ loc.address }}</span>
                      <span class="venue-choice-facilities">🏊 {{ loc.facilities }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pilihan Hari & Jam -->
              <div class="form-grid" style="margin-top: 18px;">
                <div class="form-group">
                  <label class="form-label">Hari yang Diinginkan <span class="required">*</span></label>
                  <div class="chips-selector">
                    <button 
                      v-for="day in ['Sabtu', 'Minggu', 'Jumat']"
                      :key="day"
                      type="button" 
                      class="chip-btn"
                      :class="{ active: formData.preferredDay === day }"
                      @click="formData.preferredDay = day"
                    >
                      {{ day }}
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Waktu / Jam Sesi <span class="required">*</span></label>
                  <select v-model="formData.preferredTime" class="form-select" required>
                    <option value="07.00 - 07.45 WIB">07.00 WIB (Pagi)</option>
                    <option value="08.00 - 08.45 WIB">08.00 WIB (Pagi)</option>
                    <option value="09.00 - 09.45 WIB">09.00 WIB (Pagi)</option>
                    <option value="10.00 - 10.45 WIB">10.00 WIB (Pagi)</option>
                    <option value="15.00 - 15.45 WIB">15.00 WIB (Sore)</option>
                    <option value="16.00 - 16.45 WIB">16.00 WIB (Sore)</option>
                    <option value="17.00 - 17.45 WIB">17.00 WIB (Sore)</option>
                  </select>
                </div>
              </div>

              <!-- Tujuan Ikut Renang & Referral -->
              <div class="form-grid" style="margin-top: 18px;">
                <div class="form-group">
                  <label class="form-label">Tujuan Utama Mengikuti Program</label>
                  <select v-model="formData.programGoals" class="form-select">
                    <option value="Membangun keberanian di air">Membangun keberanian di air</option>
                    <option value="Belajar berenang dari dasar">Belajar berenang dari dasar</option>
                    <option value="Menguasai gaya bebas">Menguasai gaya bebas</option>
                    <option value="Menguasai empat gaya renang">Menguasai empat gaya renang</option>
                    <option value="Meningkatkan kemampuan renang">Meningkatkan kemampuan renang</option>
                    <option value="Persiapan lomba / prestasi">Persiapan lomba / prestasi</option>
                    <option value="Olahraga dan kebugaran anak">Olahraga dan kebugaran anak</option>
                    <option value="Meningkatkan rasa percaya diri">Meningkatkan rasa percaya diri</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Dari Mana Mengetahui {{ store.brand.name }}?</label>
                  <select v-model="formData.referralSource" class="form-select">
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Teman atau keluarga">Teman atau keluarga</option>
                    <option value="Rekomendasi orang tua peserta">Rekomendasi orang tua peserta</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- =====================================================================
               STEP 4: PERSETUJUAN & TAGIHAN QRIS DINAMIS (SEKSI G, H & PAYMENT)
               ===================================================================== -->
          <div v-else-if="currentStep === 4" class="wizard-step-pane">
            <div class="step-intro-banner">
              <h4 class="step-pane-title">D. Konfirmasi Persetujuan & Penerbitan QRIS</h4>
              <p class="step-pane-desc">Periksa ringkasan pendaftaran Anda, setujui dokumentasi, dan selesaikan dengan QRIS Dinamis ASPI.</p>
            </div>

            <!-- Ringkasan Paket Dinamis Terpilih -->
            <div class="price-banner-box">
              <div class="price-banner-left">
                <span class="price-banner-label">Total Biaya Paket (Dihitung Otomatis):</span>
                <strong class="price-banner-val">{{ currentSelectedPackage?.formattedPrice || 'Rp 400.000' }}</strong>
                <span class="price-banner-sub">
                  {{ currentSelectedPackage?.name }} • {{ currentSelectedPackage?.meetings || '4x pertemuan' }} • {{ currentSelectedPackage?.duration || '45 menit/sesi' }}
                </span>
                <span class="price-venue-tag">📍 {{ formData.location }} • {{ formData.preferredDay }} ({{ formData.preferredTime }})</span>
              </div>
              <div class="price-banner-right">
                <div class="badge-chip gold">QRIS Dinamis ASPI</div>
                <span class="qris-auto-tag">EMVCo Checksum CRC16</span>
                <span class="merchant-tag-sm">{{ store.paymentConfig.merchantName }}</span>
              </div>
            </div>

            <!-- Opsi Pembayaran Lainnya (Bank Accounts dari Master Payment) -->
            <div v-if="store.paymentConfig.bankAccounts && store.paymentConfig.bankAccounts.length > 0" class="bank-accounts-info-box">
              <span class="bank-acc-title">Atau Bayar Melalui Transfer Rekening Resmi Yayasan:</span>
              <div class="bank-chips-row">
                <div v-for="b in store.paymentConfig.bankAccounts" :key="b.id" class="bank-chip-item">
                  <strong>{{ b.bankName }}</strong>: <span class="font-mono">{{ b.accountNumber }}</span> (a.n {{ b.accountHolder }})
                </div>
              </div>
            </div>

            <!-- Seksi G: Persetujuan Dokumentasi -->
            <div class="card-section" style="margin-top: 18px;">
              <span class="card-section-badge">Izin & Persetujuan Dokumentasi</span>

              <div class="consent-row">
                <div class="consent-info">
                  <strong>Izin Dokumentasi untuk Laporan Perkembangan (Progress Report) <span class="required">*</span></strong>
                  <p class="consent-desc">Dokumentasi foto/video bawah air untuk analisis teknik renang oleh coach.</p>
                </div>
                <div class="consent-options">
                  <label class="radio-label">
                    <input type="radio" :value="true" v-model="formData.consentProgressDocumentation" />
                    <span>Mengizinkan</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" :value="false" v-model="formData.consentProgressDocumentation" />
                    <span>Tidak Mengizinkan</span>
                  </label>
                </div>
              </div>

              <div class="consent-row" style="margin-top: 12px; border-top: 1px dashed var(--border-subtle); padding-top: 12px;">
                <div class="consent-info">
                  <strong>Izin Penggunaan Dokumentasi untuk Promosi / Media Sosial (Opsional)</strong>
                  <p class="consent-desc">Persetujuan terpisah dan tidak wajib. Menolak tidak memengaruhi keikutsertaan anak.</p>
                </div>
                <div class="consent-options">
                  <label class="radio-label">
                    <input type="radio" :value="true" v-model="formData.consentPromotionalUsage" />
                    <span>Mengizinkan</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" :value="false" v-model="formData.consentPromotionalUsage" />
                    <span>Tidak Mengizinkan</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Seksi H: Pernyataan Orang Tua / Wali -->
            <div class="card-section" style="margin-top: 18px;">
              <span class="card-section-badge">Pernyataan Orang Tua / Wali</span>

              <label class="checkbox-statement-card">
                <input type="checkbox" v-model="formData.parentDeclaration" required class="statement-check" />
                <div class="statement-txt">
                  <strong>Saya menyatakan konfirmasi dan persetujuan:</strong>
                  <ul>
                    <li>Seluruh data yang saya isi adalah benar dan dapat dipertanggungjawabkan.</li>
                    <li>Saya memahami bahwa penempatan level belajar awal ananda ditentukan melalui asesmen langsung oleh pelatih.</li>
                    <li>Saya berkomitmen menyampaikan informasi penting terkait kesehatan & keselamatan ananda demi kebaikan bersama.</li>
                  </ul>
                </div>
              </label>
            </div>
          </div>

          <!-- Wizard Footer Actions -->
          <div class="modal-footer wizard-footer">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              @click="prevStep" 
              class="btn-secondary"
            >
              ← Kembali ke Step {{ currentStep - 1 }}
            </button>
            <button 
              v-else 
              type="button" 
              @click="$emit('close')" 
              class="btn-secondary"
            >
              Batal
            </button>

            <button 
              v-if="currentStep < 4" 
              type="button" 
              @click="nextStep" 
              class="btn-primary btn-next-step"
            >
              <span>Lanjut ke Step {{ currentStep + 1 }}: {{ steps[currentStep].title }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <button 
              v-else 
              type="submit" 
              :disabled="isSubmitting || !formData.parentDeclaration" 
              class="btn-gold btn-submit-wizard"
            >
              <span v-if="isSubmitting">Menerbitkan Invoice & QRIS...</span>
              <span v-else>Daftar Sekarang & Dapatkan QRIS ({{ currentSelectedPackage?.formattedPrice }})</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- State 2: Dynamic QRIS Generated & Account Confirmation -->
      <div v-else class="modal-body success-view">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h3 class="success-title">Pendaftaran & Tagihan Berhasil Diterbitkan!</h3>
        <p class="success-message">
          Data ananda <strong>{{ registrationResult.student.name }}</strong> telah terdaftar untuk paket <strong>{{ registrationResult.transaction.packageName }}</strong> di <strong>{{ registrationResult.student.location }}</strong>.
        </p>

        <!-- Auto User Account Created Info Banner -->
        <div class="account-created-box">
          <div class="acc-badge">Akun Portal Customer Otomatis Dibuat</div>
          <div class="acc-details">
            <div class="acc-item">
              <span class="lbl">Email Akun:</span>
              <strong class="val">{{ registrationResult.user.email }}</strong>
            </div>
            <div class="acc-item">
              <span class="lbl">Default Password:</span>
              <strong class="val font-mono">123</strong>
            </div>
          </div>
          <span class="acc-hint">Gunakan email & password di atas untuk login ke Portal Customer kapan saja dan melihat 4 jadwal sesi resmi.</span>
        </div>

        <!-- Dynamic QRIS Display Box -->
        <div class="qris-display-card card-humanist">
          <div class="qris-card-header">
            <div>
              <span class="badge-chip gold">QRIS Dinamis ASPI Resmi</span>
              <h4 class="qris-merchant-title">{{ store.paymentConfig.merchantName }}</h4>
            </div>
            <span class="invoice-tag">No: {{ registrationResult.transaction.id }}</span>
          </div>

          <div class="qris-code-container">
            <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QRIS Dinamis" class="generated-qr-image" />
            <div v-else class="qr-loading">Menyiapkan QRIS Dinamis ASPI...</div>
          </div>

          <div class="qris-amount-row">
            <span class="amount-lbl">Total Pembayaran:</span>
            <strong class="amount-val">{{ registrationResult.transaction.formattedAmount }}</strong>
          </div>
          <p class="qris-instruction">
            Buka aplikasi Mobile Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, Dana, ShopeePay), lalu scan barcode di atas.
          </p>
        </div>

        <!-- Success Actions -->
        <div class="success-actions">
          <a :href="getWaConfirmationUrl()" target="_blank" class="btn-wa full-width">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
            </svg>
            <span>Kirim Bukti Pembayaran ke WhatsApp Admin</span>
          </a>

          <button @click="goToCustomerPortal" class="btn-primary full-width">
            Buka Portal Siswa (Lihat Jadwal & Progress)
          </button>

          <button @click="$emit('close')" class="btn-secondary full-width">
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store, actions } from '../data/store.js';
import QRCode from 'qrcode';

const emit = defineEmits(['close']);

// 4 Interactive Steps
const steps = [
  { number: 1, title: 'Identitas Anak & Wali' },
  { number: 2, title: 'Kemampuan & Kesehatan' },
  { number: 3, title: 'Pilihan Kelas & Jadwal' },
  { number: 4, title: 'Persetujuan & QRIS' }
];

const currentStep = ref(1);

// Complete Intake Form Data (from Google Form SOP)
const formData = ref({
  // Step 1: Identitas
  studentName: '',
  nickname: '',
  studentAge: 7,
  gender: 'Laki-laki',
  schoolGrade: '',
  parentName: '',
  phone: '',
  email: '',
  address: '',

  // Step 2: Asesmen Kemampuan & Kesehatan
  swimmingExperience: 'Belum pernah',
  waterConfidence: 'Belum berani masuk air',
  waterFear: 'Tidak',
  masteredStyles: ['Belum menguasai gaya tertentu'],
  medicalCondition: 'Tidak ada',
  coachNotes: '',

  // Step 3: Pilihan Kelas, Jadwal, Kolam
  productId: store.products[0]?.id || 'prod_swimming',
  packageId: store.packages[0]?.id || 'pkg_swim_group',
  location: store.locations[0]?.name || 'Kolam Graha Kresna Pratama',
  preferredDay: 'Sabtu',
  preferredTime: '09.00 - 09.45 WIB',
  programGoals: 'Belajar berenang dari dasar',
  referralSource: 'Instagram',

  // Step 4: Persetujuan
  consentProgressDocumentation: true,
  consentPromotionalUsage: true,
  parentDeclaration: false
});

// Options Lists
const experienceOptions = [
  'Belum pernah',
  'Pernah (< 3 bulan)',
  'Pernah (3–6 bulan)',
  'Pernah (> 6 bulan)'
];

const capacityOptions = [
  'Belum berani masuk air',
  'Berani masuk air, belum bisa berenang',
  'Bisa floating / mengapung',
  'Bisa meluncur',
  'Bisa freestyle dasar',
  'Bisa freestyle cukup baik',
  'Sudah menguasai beberapa gaya'
];

const fearOptions = ['Tidak', 'Sedikit', 'Cukup takut', 'Sangat takut'];

const styleOptions = [
  'Freestyle / Gaya Bebas',
  'Gaya Dada',
  'Gaya Punggung',
  'Gaya Kupu-kupu',
  'Belum menguasai gaya tertentu'
];

function toggleStyleOption(style) {
  const list = formData.value.masteredStyles;
  const idx = list.indexOf(style);
  if (idx > -1) {
    list.splice(idx, 1);
    if (list.length === 0) list.push('Belum menguasai gaya tertentu');
  } else {
    if (style === 'Belum menguasai gaya tertentu') {
      formData.value.masteredStyles = ['Belum menguasai gaya tertentu'];
    } else {
      const noneIdx = list.indexOf('Belum menguasai gaya tertentu');
      if (noneIdx > -1) list.splice(noneIdx, 1);
      list.push(style);
    }
  }
}

// Packages dynamically from Master
const availablePackages = computed(() => {
  const pkgs = (store.packages || []).filter(p => p.productId === formData.value.productId);
  return pkgs.length > 0 ? pkgs : store.packages;
});

const currentSelectedPackage = computed(() => {
  return availablePackages.value.find(p => p.id === formData.value.packageId) || availablePackages.value[0];
});

function onProductChange() {
  const pkgs = availablePackages.value;
  if (pkgs.length > 0) {
    formData.value.packageId = pkgs[0].id;
  }
}

onMounted(() => {
  if (store.products.length > 0) {
    formData.value.productId = store.products[0].id;
    onProductChange();
  }
  if (store.locations.length > 0) {
    formData.value.location = store.locations[0].name;
  }
});

// Step Navigation & Validation
function validateCurrentStep() {
  if (currentStep.value === 1) {
    if (!formData.value.studentName?.trim()) {
      alert('Mohon isi nama lengkap ananda.');
      return false;
    }
    if (!formData.value.studentAge || formData.value.studentAge < 3) {
      alert('Mohon isi usia ananda yang valid.');
      return false;
    }
    if (!formData.value.parentName?.trim()) {
      alert('Mohon isi nama orang tua / wali.');
      return false;
    }
    if (!formData.value.phone?.trim()) {
      alert('Mohon isi nomor WhatsApp aktif orang tua.');
      return false;
    }
    if (!formData.value.email?.trim() || !formData.value.email.includes('@')) {
      alert('Mohon isi alamat email aktif untuk akun portal.');
      return false;
    }
    return true;
  }

  if (currentStep.value === 2) {
    if (!formData.value.medicalCondition?.trim()) {
      formData.value.medicalCondition = 'Tidak ada';
    }
    return true;
  }

  if (currentStep.value === 3) {
    if (!formData.value.packageId) {
      formData.value.packageId = availablePackages.value[0]?.id;
    }
    if (!formData.value.location) {
      formData.value.location = store.locations[0]?.name;
    }
    return true;
  }

  return true;
}

function nextStep() {
  if (validateCurrentStep()) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function goToStep(stepNum) {
  if (stepNum < currentStep.value) {
    currentStep.value = stepNum;
  } else if (stepNum === currentStep.value + 1) {
    nextStep();
  }
}

// Submission & Dynamic QRIS Generation
const isSubmitting = ref(false);
const registrationResult = ref(null);
const qrCodeDataUrl = ref('');

async function handleStepSubmit() {
  if (currentStep.value < 4) {
    nextStep();
    return;
  }

  if (!formData.value.parentDeclaration) {
    alert('Mohon centang pernyataan dan persetujuan orang tua/wali.');
    return;
  }

  try {
    isSubmitting.value = true;
    const res = await actions.registerLead(formData.value);
    registrationResult.value = res;

    // Render dynamic QRIS code
    if (res.qrisString) {
      qrCodeDataUrl.value = await QRCode.toDataURL(res.qrisString, {
        width: 260,
        margin: 1,
        color: { dark: '#0a0a0a', light: '#ffffff' }
      });
    }
  } catch (err) {
    alert(err.message || 'Gagal mengirim pendaftaran.');
  } finally {
    isSubmitting.value = false;
  }
}

function goToCustomerPortal() {
  emit('close');
  if (registrationResult.value?.user) {
    store.currentUser = registrationResult.value.user;
  }
  actions.switchRole('customer');
  store.activePortalMenu = 'c_schedule';
}

function getWaConfirmationUrl() {
  if (!registrationResult.value) return '#';
  const cleanPhone = actions.cleanWaNumber(store.brand.callCenter);
  const msg = `Halo Admin ${store.brand.name},\nSaya (${formData.value.parentName}) baru saja menyelesaikan formulir pendaftaran untuk ananda *${formData.value.studentName}* (${formData.value.studentAge} th).\n\n📌 *Detail Pendaftaran:*\n• No. Invoice: ${registrationResult.value.transaction.id}\n• Paket: ${registrationResult.value.transaction.packageName}\n• Lokasi: ${formData.value.location}\n• Jadwal: ${formData.value.preferredDay} (${formData.value.preferredTime})\n• Total Biaya: ${registrationResult.value.transaction.formattedAmount}\n• Email Portal: ${registrationResult.value.user.email} (Password: 123)\n\nMohon diverifikasi pembayarannya ya admin. Terima kasih!`;
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
}
</script>

<style scoped>
.modal-dialog-wizard {
  max-width: 780px;
  width: 95%;
  height: 88vh;
  max-height: 850px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.wizard-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.modal-header {
  padding: 20px 28px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #ffffff;
  flex-shrink: 0;
}

.modal-brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.modal-logo-img {
  height: 32px;
  width: auto;
}

.modal-title {
  font-size: 19px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0;
}

.modal-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

/* Wizard Stepper Header */
.wizard-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  gap: 8px;
  flex-shrink: 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  flex: 1;
  opacity: 0.55;
  transition: all 0.2s ease;
}

.step-item.active {
  opacity: 1;
}

.step-item.completed {
  opacity: 0.9;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.step-item.active .step-circle {
  background: var(--color-accent-gold);
  color: #1a1600;
  box-shadow: 0 0 0 4px rgba(229, 160, 36, 0.2);
}

.step-item.completed .step-circle {
  background: #0d9488;
  color: #ffffff;
}

.step-meta {
  display: flex;
  flex-direction: column;
}

.step-num-txt {
  font-size: 10.5px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.step-title-txt {
  font-size: 12.5px;
  color: var(--text-main);
  white-space: nowrap;
}

.step-connector {
  position: absolute;
  right: -8px;
  top: 50%;
  width: 14px;
  height: 2px;
  background: #cbd5e1;
}

/* Wizard Body & Scrollable Pane */
.wizard-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0;
}

.wizard-step-pane {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 28px;
}

.step-intro-banner {
  margin-bottom: 20px;
}

.step-pane-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0 0 4px;
}

.step-pane-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* Card Sections */
.card-section {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.card-section-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-dark);
  background: #f1f5f9;
  padding: 3px 9px;
  border-radius: 4px;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.5fr;
  gap: 16px;
}

/* Interactive Chips */
.chips-selector {
  display: flex;
  gap: 8px;
}

.chip-btn {
  flex: 1;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: #f8fafc;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.chip-btn.active {
  background: #0f766e;
  border-color: #0f766e;
  color: #ffffff;
  font-weight: 700;
}

.chips-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.chips-grid-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-card-btn {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: #f8fafc;
  color: var(--text-main);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.chip-card-btn.mini {
  padding: 7px 12px;
  font-size: 12px;
}

.chip-card-btn:hover {
  background: #f1f5f9;
  border-color: var(--color-accent-gold);
}

.chip-card-btn.active {
  background: #0f766e;
  border-color: #0f766e;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(15, 118, 110, 0.25);
}

/* Package Cards Grid */
.package-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.pkg-choice-card {
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.pkg-choice-card:hover {
  border-color: var(--color-accent-gold);
  transform: translateY(-2px);
  background: #ffffff;
}

.pkg-choice-card.selected {
  border-color: var(--color-accent-gold);
  background: #fffdf5;
  box-shadow: 0 4px 12px rgba(229, 160, 36, 0.2);
}

.pkg-choice-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pkg-choice-price {
  font-size: 15px;
  font-weight: 800;
  color: #0f766e;
}

.pkg-choice-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0 0 8px;
}

.pkg-choice-specs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
  color: #475569;
  margin-bottom: 8px;
  font-weight: 600;
}

.pkg-choice-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
  margin-top: auto;
}

/* Venues Selection Grid */
.venues-choice-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.venue-choice-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease;
}

.venue-choice-box:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.venue-choice-box.selected {
  border-color: #0f766e;
  background: #f0fdfa;
}

.venue-radio-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  margin-top: 2px;
  flex-shrink: 0;
  position: relative;
}

.venue-choice-box.selected .venue-radio-indicator {
  border-color: #0f766e;
}

.venue-choice-box.selected .venue-radio-indicator::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0f766e;
}

.venue-choice-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.venue-choice-title {
  font-size: 13.5px;
  color: var(--color-primary-dark);
}

.venue-choice-sub {
  font-size: 12px;
  color: #64748b;
}

.venue-choice-facilities {
  font-size: 11.5px;
  color: #0d9488;
  font-weight: 600;
  margin-top: 2px;
}

/* Step 4 Price Box & Consents */
.price-banner-box {
  background: linear-gradient(135deg, #093b44 0%, #0d525f 100%);
  color: #ffffff;
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(9, 59, 68, 0.2);
}

.price-banner-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.price-banner-label {
  font-size: 12px;
  color: #a4cdd5;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.price-banner-val {
  font-size: 26px;
  font-weight: 800;
  color: #f7ca5e;
}

.price-banner-sub {
  font-size: 13px;
  color: #e2f0f3;
}

.price-venue-tag {
  font-size: 11.5px;
  color: #93c5fd;
  margin-top: 4px;
}

.price-banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.merchant-tag-sm {
  font-size: 11px;
  color: #e2e8f0;
}

/* Bank Accounts Box */
.bank-accounts-info-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-top: 14px;
}

.bank-acc-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  display: block;
  margin-bottom: 6px;
}

.bank-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.bank-chip-item {
  font-size: 12px;
  background: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}

/* Consent Rows */
.consent-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.consent-info strong {
  font-size: 13px;
  color: var(--text-main);
  display: block;
}

.consent-desc {
  font-size: 11.5px;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.consent-options {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.checkbox-statement-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.statement-check {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  accent-color: #0f766e;
}

.statement-txt strong {
  font-size: 13px;
  color: var(--color-primary-dark);
}

.statement-txt ul {
  margin: 6px 0 0;
  padding-left: 18px;
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

/* Wizard Footer */
.wizard-footer {
  padding: 16px 28px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);
}

.btn-next-step, .btn-submit-wizard {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

/* Success View Styles */
.success-view {
  overflow-y: auto;
  flex: 1;
  text-align: center;
  padding: 32px 28px;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.success-message {
  font-size: 13.5px;
  color: var(--text-muted);
  max-width: 540px;
  margin: 0 auto 20px;
}

.account-created-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-bottom: 24px;
  text-align: left;
}

.acc-badge {
  font-size: 11px;
  font-weight: 700;
  color: #15803d;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.acc-details {
  display: flex;
  gap: 24px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.acc-item .lbl {
  font-size: 12px;
  color: #475569;
  display: block;
}

.acc-item .val {
  font-size: 14px;
  color: #1e293b;
}

.acc-hint {
  font-size: 11.5px;
  color: #166534;
}

/* QRIS Display Card */
.qris-display-card {
  max-width: 380px;
  margin: 0 auto 24px;
  border: 2px solid #e2e8f0;
  border-radius: var(--radius-md);
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.qris-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  text-align: left;
}

.qris-merchant-title {
  font-size: 12px;
  font-weight: 800;
  color: #1e293b;
  margin: 2px 0 0;
}

.invoice-tag {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}

.qris-code-container {
  background: #ffffff;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #cbd5e1;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.generated-qr-image {
  max-width: 220px;
  width: 100%;
  height: auto;
}

.qris-amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  margin-bottom: 6px;
}

.amount-lbl {
  font-size: 12.5px;
  color: #64748b;
}

.amount-val {
  font-size: 18px;
  font-weight: 800;
  color: #0f766e;
}

.qris-instruction {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

/* Success Action Buttons */
.success-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  margin: 0 auto;
}

.btn-wa {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #25d366;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-wa:hover {
  background: #1ebc59;
}

@media (max-width: 640px) {
  .wizard-stepper {
    padding: 10px 14px;
    gap: 4px;
  }
  .step-meta {
    display: none;
  }
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
  .chips-grid-4 {
    grid-template-columns: 1fr 1fr;
  }
  .price-banner-box {
    flex-direction: column;
    align-items: flex-start;
  }
  .price-banner-right {
    align-items: flex-start;
  }
}
</style>
