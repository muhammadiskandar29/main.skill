<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <img src="/images/mine-skills-logo.png" alt="mine.skills Logo" class="modal-logo-img" />
          <div class="badge-chip teal">Formulir Pendaftaran Siswa</div>
          <h3 class="modal-title">Pendaftaran Calon Siswa mine.skills</h3>
          <p class="modal-desc">Isi data di bawah untuk reservasi slot kelas, QRIS dinamis & penerbitan 4 jadwal sesi.</p>
        </div>
        <button class="btn-close" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- State 1: Form Input -->
      <form v-if="!registrationResult" @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-grid">
          <!-- Nama Siswa -->
          <div class="form-group">
            <label class="form-label">Nama Lengkap Siswa <span class="required">*</span></label>
            <input 
              v-model="formData.studentName" 
              type="text" 
              class="form-input" 
              placeholder="Contoh: Kenzo Al-Fatih" 
              required 
            />
          </div>

          <!-- Usia Siswa -->
          <div class="form-group">
            <label class="form-label">Usia Siswa (Tahun) <span class="required">*</span></label>
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
        </div>

        <div class="form-grid">
          <!-- Nama Orang Tua / Wali -->
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

          <!-- Email (Untuk Auto Create User) -->
          <div class="form-group">
            <label class="form-label">Email Aktif <span class="required">*</span></label>
            <input 
              v-model="formData.email" 
              type="email" 
              class="form-input" 
              placeholder="sarah.ramadhani@gmail.com" 
              required 
            />
            <span class="form-hint">Otomatis didaftarkan sebagai akun login portal (Default Password: <strong>123</strong>).</span>
          </div>
        </div>

        <div class="form-grid">
          <!-- No WhatsApp -->
          <div class="form-group">
            <label class="form-label">Nomor WhatsApp Aktif <span class="required">*</span></label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              class="form-input" 
              placeholder="081298456721" 
              required 
            />
          </div>

          <!-- Pilihan Program Skill (Dinamis dari Master Produk) -->
          <div class="form-group">
            <label class="form-label">Pilihan Program Skill <span class="required">*</span></label>
            <select v-model="formData.productId" @change="onProductChange" class="form-select" required>
              <option v-for="prog in store.products" :key="prog.id" :value="prog.id">
                {{ prog.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Pilihan Paket Harga (Dinamis dari Master Paket Produk Terpilih) -->
          <div class="form-group">
            <label class="form-label">Pilihan Paket & Biaya (Dinamis) <span class="required">*</span></label>
            <select v-model="formData.packageId" class="form-select" required>
              <option v-for="pkg in availablePackages" :key="pkg.id" :value="pkg.id">
                {{ pkg.name }} — {{ pkg.formattedPrice }} ({{ pkg.ratio }})
              </option>
            </select>
          </div>

          <!-- Lokasi Latihan -->
          <div class="form-group">
            <label class="form-label">Lokasi Latihan</label>
            <select v-model="formData.location" class="form-select">
              <option v-for="loc in store.locations" :key="loc.id" :value="loc.name">
                {{ loc.name }} ({{ loc.area }})
              </option>
            </select>
          </div>
        </div>

        <!-- Preferensi Hari & Jam -->
        <div class="form-group">
          <label class="form-label">Preferensi Hari & Jam Latihan</label>
          <select v-model="formData.schedulePref" class="form-select">
            <option value="Sabtu Pagi (09.00 - 09.45 WIB)">Sabtu Pagi (09.00 - 09.45 WIB)</option>
            <option value="Sabtu Sore (15.30 - 16.15 WIB)">Sabtu Sore (15.30 - 16.15 WIB)</option>
            <option value="Minggu Pagi (08.00 - 09.00 WIB)">Minggu Pagi (08.00 - 09.00 WIB)</option>
            <option value="Minggu Sore (15.30 - 16.30 WIB)">Minggu Sore (15.30 - 16.30 WIB)</option>
            <option value="Jumat Sore (16.00 - 16.45 WIB)">Jumat Sore (16.00 - 16.45 WIB)</option>
          </select>
        </div>

        <!-- Selected Price & Automatic Dynamic QRIS Notice -->
        <div class="price-banner-box">
          <div class="price-banner-left">
            <span class="price-banner-label">Total Biaya Paket (Dihitung Otomatis):</span>
            <strong class="price-banner-val">{{ currentSelectedPackage?.formattedPrice || 'Rp 400.000' }}</strong>
            <span class="price-banner-sub">{{ currentSelectedPackage?.meetings || '4x pertemuan' }} • {{ currentSelectedPackage?.duration || '45 menit/sesi' }}</span>
          </div>
          <div class="price-banner-right">
            <div class="badge-chip gold">QRIS Dinamis ASPI</div>
            <span class="qris-auto-tag">Otomatis generate QR & Invoice</span>
          </div>
        </div>

        <!-- Catatan Tambahan -->
        <div class="form-group">
          <label class="form-label">Catatan Tambahan / Pengalaman Sebelumnya (Opsional)</label>
          <textarea 
            v-model="formData.notes" 
            class="form-textarea" 
            rows="2" 
            placeholder="Contoh: Belum pernah les renang, anak sempat takut air dalam, ingin fokus kenyamanan dulu."
          ></textarea>
        </div>

        <!-- Modal Actions -->
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Batal
          </button>
          <button type="submit" :disabled="isSubmitting" class="btn-gold">
            <span v-if="isSubmitting">Memproses & Generate QR...</span>
            <span v-else>Kirim Pendaftaran & Buat QRIS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </form>

      <!-- State 2: Dynamic QRIS Generated & Account Confirmation -->
      <div v-else class="modal-body success-view">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h3 class="success-title">Pendaftaran & QRIS Berhasil Diterbitkan!</h3>
        <p class="success-message">
          Data pendaftaran ananda <strong>{{ registrationResult.student.name }}</strong> telah tersimpan di database lokal.
        </p>

        <!-- Auto User Account Created Info Banner -->
        <div class="account-created-box">
          <div class="acc-badge">Akun Portal Otomatis Dibuat</div>
          <div class="acc-details">
            <div class="acc-item">
              <span class="lbl">Email Login:</span>
              <strong class="val">{{ registrationResult.user.email }}</strong>
            </div>
            <div class="acc-item">
              <span class="lbl">Default Password:</span>
              <strong class="val font-mono">123</strong>
            </div>
          </div>
          <span class="acc-hint">Gunakan email & password di atas untuk login ke Portal Customer kapan saja.</span>
        </div>

        <!-- Dynamic QRIS Display Box -->
        <div class="qris-display-card card-humanist">
          <div class="qris-card-header">
            <span class="badge-chip gold">QRIS Dinamis ASPI Resmi</span>
            <span class="invoice-tag">No: {{ registrationResult.transaction.id }}</span>
          </div>

          <div class="qris-code-container">
            <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QRIS Dinamis" class="generated-qr-image" />
            <div v-else class="qr-loading">Menyiapkan QRIS Dinamis...</div>
          </div>

          <div class="qris-amount-row">
            <span class="amount-lbl">Total Pembayaran:</span>
            <strong class="amount-val">{{ registrationResult.transaction.formattedAmount }}</strong>
          </div>
          <p class="qris-instruction">
            Scan QR di atas menggunakan BCA Mobile, Livin' Mandiri, GoPay, OVO, ShopeePay, atau aplikasi perbankan apa saja.
          </p>
        </div>

        <!-- Auto Generated 4-Session Schedule -->
        <div class="auto-schedules-box">
          <div class="auto-sch-header">
            <span class="badge-chip green">Jadwal 4x Sesi Siswa Otomatis Terbit!</span>
            <span class="coach-bound">Coach: {{ registrationResult.student.assignedCoachName }}</span>
          </div>
          <div class="auto-sch-list">
            <div v-for="s in registrationResult.schedules" :key="s.id" class="auto-sch-item">
              <span class="s-no">Sesi {{ s.sessionNo }}</span>
              <span class="s-date">{{ s.day }}, {{ s.date }}</span>
              <span class="s-time">{{ s.time }}</span>
            </div>
          </div>
        </div>

        <div class="success-actions">
          <!-- WhatsApp Link -->
          <a 
            :href="getWaConfirmationUrl()" 
            target="_blank" 
            class="btn-whatsapp full-width"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6-.01.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31"/>
            </svg>
            <span>Konfirmasi Bukti ke WhatsApp Admin</span>
          </a>

          <button @click="goToCustomerPortal" class="btn-primary full-width">
            Buka Portal Siswa (Lihat Jadwal & Tagihan)
          </button>

          <button @click="$emit('close')" class="btn-secondary full-width">
            Tutup
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

const formData = ref({
  studentName: '',
  studentAge: '7',
  parentName: '',
  email: '',
  phone: '',
  productId: store.products[0]?.id || 'prod_swimming',
  packageId: store.packages[0]?.id || 'pkg_swim_group',
  schedulePref: 'Sabtu Pagi (09.00 - 09.45 WIB)',
  location: store.locations[0]?.name || 'Kolam Graha Kresna Pratama, Jatiwaringin',
  notes: ''
});

const isSubmitting = ref(false);
const registrationResult = ref(null);
const qrCodeDataUrl = ref('');

// Dynamically filter packages according to the selected product
const availablePackages = computed(() => {
  const pkgs = store.packages.filter(p => p.productId === formData.value.productId);
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
});

async function handleSubmit() {
  try {
    isSubmitting.value = true;
    const res = await actions.registerLead(formData.value);
    registrationResult.value = res;

    // Render dynamic QRIS code
    if (res.qrisString) {
      qrCodeDataUrl.value = await QRCode.toDataURL(res.qrisString, {
        width: 250,
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
  const msg = `Halo Admin ${store.brand.name},\nSaya (${formData.value.parentName}) baru saja menyelesaikan formulir pendaftaran untuk ananda *${formData.value.studentName}* (${formData.value.studentAge} th).\n\n📌 *Detail Pendaftaran:*\n• No. Invoice: ${registrationResult.value.transaction.id}\n• Program: ${registrationResult.value.transaction.productName}\n• Total: ${registrationResult.value.transaction.formattedAmount}\n• Email Login: ${registrationResult.value.user.email} (Password: 123)\n\nMohon dicek pembayarannya ya min. Terima kasih!`;
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
}
</script>

<style scoped>
.modal-header {
  padding: 24px 28px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-logo-img {
  height: 38px;
  width: auto;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 19px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-top: 6px;
}

.modal-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.btn-close {
  color: var(--text-subtle);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-close:hover {
  color: var(--text-main);
  background-color: var(--bg-subtle);
}

.modal-body {
  padding: 24px 28px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.required {
  color: #dc2626;
}

.form-hint {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.price-banner-box {
  background: linear-gradient(135deg, rgba(13, 77, 93, 0.06), rgba(229, 160, 36, 0.1));
  border: 1px solid rgba(229, 160, 36, 0.35);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price-banner-left {
  display: flex;
  flex-direction: column;
}

.price-banner-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.price-banner-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.price-banner-sub {
  font-size: 11.5px;
  color: var(--text-subtle);
}

.price-banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.qris-auto-tag {
  font-size: 10.5px;
  color: var(--color-accent-gold);
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.success-view {
  text-align: center;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(21, 128, 61, 0.1);
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
  max-width: 440px;
  margin: 0 auto 20px;
}

.account-created-box {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-bottom: 18px;
  text-align: left;
}

.acc-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #166534;
  margin-bottom: 6px;
}

.acc-details {
  display: flex;
  gap: 24px;
}

.acc-item .lbl {
  font-size: 11.5px;
  color: #166534;
  display: block;
}

.acc-item .val {
  font-size: 13.5px;
  color: #14532d;
}

.acc-hint {
  display: block;
  font-size: 11px;
  color: #15803d;
  margin-top: 6px;
}

.qris-display-card {
  padding: 18px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
}

.qris-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.invoice-tag {
  font-size: 11.5px;
  font-family: monospace;
  font-weight: 700;
  color: var(--color-primary-teal);
}

.qris-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  background-color: #ffffff;
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.generated-qr-image {
  max-width: 220px;
  height: auto;
  border-radius: 6px;
}

.qris-amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #f8fafc;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.amount-lbl {
  font-size: 13px;
  color: var(--text-muted);
}

.amount-val {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.qris-instruction {
  font-size: 11.5px;
  color: var(--text-subtle);
  line-height: 1.4;
}

.auto-schedules-box {
  background-color: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-bottom: 20px;
  text-align: left;
}

.auto-sch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.coach-bound {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.auto-sch-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.auto-sch-item {
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.s-no {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-accent-gold);
  text-transform: uppercase;
}

.s-date {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}

.s-time {
  font-size: 11px;
  color: var(--text-muted);
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #25d366;
  color: #ffffff;
  font-weight: 700;
  font-size: 13.5px;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-whatsapp:hover {
  background-color: #1eb855;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .auto-sch-list {
    grid-template-columns: 1fr;
  }
}
</style>
