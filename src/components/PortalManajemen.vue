<template>
  <div class="portal-manajemen">
    <!-- Global Alert / Notice Toast -->
    <transition name="fade">
      <div v-if="noticeMessage" class="toast-notice">
        <div class="toast-icon">✓</div>
        <div class="toast-body">
          <strong>Notifikasi Sistem:</strong>
          <span>{{ noticeMessage }}</span>
        </div>
      </div>
    </transition>

    <!-- =========================================================================
         SUB-MENU 1: RINGKASAN EKSEKUTIF (m_overview)
         ========================================================================= -->
    <div v-if="activeMenu === 'm_overview'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Dashboard Manajemen</span>
          <h2 class="page-title">Ringkasan Operasional & Kinerja</h2>
          <p class="page-sub">Monitoring aktivitas akademik, penugasan instruktur, dan arus penerimaan pembayaran.</p>
        </div>
        <div class="top-date-badge">
          <span>Tahun Ajaran 2026/2027</span>
        </div>
      </div>

      <!-- KPI Metrics Cards Grid -->
      <div class="metrics-grid">
        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Total Siswa Terbina</span>
            <strong class="metric-val">{{ store.students.length }} Siswa</strong>
            <span class="metric-sub text-green">100% Memiliki Pelatih Terikat</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Instruktur Berlisensi</span>
            <strong class="metric-val">{{ store.coaches.length }} Coach</strong>
            <span class="metric-sub">Tersebar di {{ store.products.length }} Program</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Penerimaan Biaya Kursus</span>
            <strong class="metric-val">{{ totalRevenueFormatted }}</strong>
            <span class="metric-sub text-green">{{ paidTransactionsCount }} Tagihan Lunas</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Paket Kursus Terdaftar</span>
            <strong class="metric-val">{{ store.packages.length }} Skema</strong>
            <span class="metric-sub">{{ store.products.length }} Program Aktif</span>
          </div>
        </div>
      </div>

      <!-- Quick Operational Action Shortcuts -->
      <div class="management-shortcuts card-humanist">
        <h4 class="shortcut-title">Aksi Cepat Manajemen</h4>
        <div class="shortcut-buttons">
          <button @click="openAddStudentModal" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Daftarkan Siswa Baru</span>
          </button>

          <button @click="openAddProductModal" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Tambah Program Pelatihan</span>
          </button>

          <button @click="openAddPackageModal" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Buat Paket Biaya Baru</span>
          </button>

          <button @click="openAddCoachModal" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Rekrut Instruktur Baru</span>
          </button>

          <button @click="$emit('change-menu', 'm_payments')" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <span>Cek Status Tagihan & QRIS</span>
          </button>
        </div>
      </div>

      <!-- Recent Students Summary Table -->
      <div class="card-humanist table-wrap" style="margin-top: 24px;">
        <div class="table-header-bar">
          <h4 class="table-section-title">Siswa yang Baru Mendaftar</h4>
          <button @click="$emit('change-menu', 'm_students')" class="btn-link">Lihat Semua Siswa →</button>
        </div>
        <table class="leads-table">
          <thead>
            <tr>
              <th>Nama Siswa & Usia</th>
              <th>Nama Orang Tua / Wali</th>
              <th>Program & Paket</th>
              <th>Instruktur Terikat</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stu in (store.students || []).slice(0, 5)" :key="stu.id">
              <td>
                <strong>{{ stu.name }}</strong>
                <span class="sub-cell-txt">{{ stu.age }} Tahun</span>
              </td>
              <td>
                <div class="parent-info">
                  <span>{{ stu.parentName }}</span>
                  <span class="font-mono sub-cell-txt">{{ stu.phone }}</span>
                </div>
              </td>
              <td>
                <span class="badge-chip teal">{{ stu.productName || stu.program }}</span>
                <div class="sub-cell-txt">{{ stu.packageName }}</div>
              </td>
              <td>
                <strong>{{ stu.assignedCoachName || 'Belum di-assign' }}</strong>
                <div class="sub-cell-txt">{{ stu.mappingStatus }}</div>
              </td>
              <td>
                <span class="badge-chip green">{{ stu.status }}</span>
              </td>
              <td class="text-right">
                <button @click="openAssignCoachModal(stu)" class="btn-outline-primary-xs">
                  Assign Coach
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 2: MASTER PROGRAM PELATIHAN (m_products)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_products'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Master Data Akademik</span>
          <h2 class="page-title">Master Program Pelatihan</h2>
          <p class="page-sub">Kelola daftar bidang keahlian, gambar banner kurikulum, dan tahapan level capaian.</p>
        </div>
        <button @click="openAddProductModal" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Tambah Program Baru</span>
        </button>
      </div>

      <!-- Programs Grid Cards -->
      <div class="products-crud-grid">
        <div v-for="prod in store.products" :key="prod.id" class="product-crud-card card-humanist">
          <div class="prod-img-wrap">
            <img :src="prod.heroImage || '/images/swimming-hero.jpg'" :alt="prod.name" class="prod-thumb" />
            <span class="badge-chip teal prod-cat-badge">{{ prod.category }}</span>
          </div>

          <div class="prod-card-body">
            <div class="prod-title-row">
              <h3 class="prod-name">{{ prod.name }}</h3>
              <span class="badge-chip green" v-if="prod.isActive !== false">Aktif</span>
              <span class="badge-chip gold" v-else>Non-Aktif</span>
            </div>
            <p class="prod-desc">{{ prod.shortDesc }}</p>

            <div class="prod-meta-strip">
              <span>Target: {{ prod.targetAge }}</span>
              <span>•</span>
              <span>{{ (prod.levels || []).length }} Level Kurikulum</span>
              <span>•</span>
              <span>{{ (store.packages || []).filter(p => p.productId === prod.id).length }} Paket Biaya</span>
            </div>

            <!-- Mapped Coaches Badges -->
            <div class="prod-coaches-strip">
              <span class="lbl-coaches">Instruktur Tersedia:</span>
              <div v-if="getCoachesForProduct(prod.id).length > 0" class="coach-tag-list">
                <span v-for="c in getCoachesForProduct(prod.id)" :key="c.id" class="coach-tag">
                  {{ c.name.split(',')[0] }}
                </span>
              </div>
              <span v-else class="text-muted-tag">Belum ada coach yang dipetakan</span>
            </div>

            <!-- Mapped Locations Badges -->
            <div class="prod-locations-strip">
              <span class="lbl-coaches">📍 Lokasi Latihan:</span>
              <div v-if="getLocationsForProduct(prod.id).length > 0" class="loc-tag-list">
                <span v-for="l in getLocationsForProduct(prod.id)" :key="l.id" class="loc-tag">
                  {{ l.name }}
                </span>
              </div>
              <span v-else class="text-muted-tag">Belum ada lokasi yang dipetakan</span>
            </div>

            <div class="prod-card-actions">
              <button @click="openEditProductModal(prod)" class="btn-secondary-sm">
                Edit Program
              </button>
              <button @click="handleDeleteProduct(prod.id)" class="btn-danger-sm">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU: MASTER FASILITAS & LOKASI LATIHAN (m_locations)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_locations'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Master Fasilitas & Geofence GPS</span>
          <h2 class="page-title">Master Fasilitas & Lokasi Latihan</h2>
          <p class="page-sub">Kelola titik kolam/venue latihan, radius validasi geofence GPS presensi coach, dan mapping ke program pelatihan.</p>
        </div>
        <button @click="openAddLocationModal" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Tambah Lokasi Latihan Baru</span>
        </button>
      </div>

      <!-- KPI Metrics Cards Grid for Locations -->
      <div class="metrics-grid">
        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Total Lokasi Latihan</span>
            <strong class="metric-val">{{ store.locations.length }} Titik Venue</strong>
            <span class="metric-sub text-teal">Tersebar di Jabodetabek</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Lokasi Aktif Digunakan</span>
            <strong class="metric-val">{{ store.locations.filter(l => l.isActive !== false).length }} Fasilitas</strong>
            <span class="metric-sub text-green">Siap Menyelenggarakan Sesi</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Program Terpetakan</span>
            <strong class="metric-val">{{ store.products.length }} Program Skill</strong>
            <span class="metric-sub">Memiliki Lokasi Resmi</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Rata-rata Toleransi GPS</span>
            <strong class="metric-val">250 Meter</strong>
            <span class="metric-sub">Geofence Presensi Coach</span>
          </div>
        </div>
      </div>

      <!-- Locations Grid Cards -->
      <div class="locations-crud-grid">
        <div v-for="loc in store.locations" :key="loc.id" class="location-crud-card card-humanist">
          <div class="loc-card-header-bar">
            <div class="flex items-center gap-2">
              <span class="loc-pin-icon">📍</span>
              <div>
                <h3 class="loc-title">{{ loc.name }}</h3>
                <span class="badge-chip teal">{{ loc.area }}</span>
              </div>
            </div>
            <span class="badge-chip" :class="loc.isActive !== false ? 'green' : 'gold'">
              {{ loc.isActive !== false ? 'Aktif' : 'Non-Aktif' }}
            </span>
          </div>

          <div class="loc-card-inner">
            <div class="loc-address-box">
              <span class="loc-info-lbl">Alamat Lengkap:</span>
              <p class="loc-address-text">{{ loc.address }}</p>
            </div>

            <div class="loc-geo-box">
              <div class="geo-coord-pill">
                <span class="font-mono">Lat: {{ Number(loc.latitude).toFixed(5) }}, Lng: {{ Number(loc.longitude).toFixed(5) }}</span>
                <span class="geo-radius-badge">Radius Geofence: {{ loc.radiusMeters || 250 }}m</span>
              </div>
            </div>

            <!-- Mini Map Preview for Venue -->
            <div class="loc-mini-map-box">
              <iframe 
                :src="getMiniMapEmbedUrl(loc.latitude, loc.longitude)" 
                class="loc-thumb-iframe" 
                loading="lazy" 
                title="Peta Lokasi"
              ></iframe>
            </div>

            <!-- Mapped Products -->
            <div class="loc-mapped-products-strip">
              <span class="lbl-sec-sm">Program Pelatihan di Lokasi Ini:</span>
              <div v-if="loc.productIds && loc.productIds.length > 0" class="loc-prod-tags">
                <span v-for="pId in loc.productIds" :key="pId" class="badge-chip gold">
                  {{ store.products.find(p => p.id === pId)?.name || pId }}
                </span>
              </div>
              <span v-else class="text-muted-tag">Belum ada program yang dipetakan</span>
            </div>

            <!-- Facilities -->
            <div class="loc-amenities-snippet" v-if="loc.facilities">
              <span class="lbl-sec-sm">Fasilitas Pendukung:</span>
              <p class="amenities-text">{{ loc.facilities }}</p>
            </div>

            <div class="loc-card-actions">
              <button @click="openEditLocationModal(loc)" class="btn-secondary-sm">
                Edit Lokasi
              </button>
              <a :href="`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`" target="_blank" class="btn-text-sm">
                Buka di Maps ↗
              </a>
              <button @click="handleDeleteLocation(loc.id)" class="btn-danger-sm" style="margin-left: auto;">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 3: PAKET KURSUS & BIAYA (m_packages)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_packages'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Struktur Tarif & Biaya</span>
          <h2 class="page-title">Paket Kursus & Skema Biaya</h2>
          <p class="page-sub">Kelola variasi paket bimbingan, durasi sesi, dan nominal tarif pendaftaran.</p>
        </div>
        <button @click="openAddPackageModal" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Tambah Paket Kursus</span>
        </button>
      </div>

      <!-- Filter per Program -->
      <div class="package-filter-bar">
        <label class="filter-lbl">Filter Program:</label>
        <select v-model="selectedProductFilter" class="form-select filter-select">
          <option value="">Semua Program ({{ store.packages.length }} Paket Terdaftar)</option>
          <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <div class="packages-table-card card-humanist">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Program Keahlian</th>
              <th>Nama Paket</th>
              <th>Rasio Siswa</th>
              <th>Biaya Paket</th>
              <th>Durasi & Pertemuan</th>
              <th>Label Badge</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pkg in filteredPackages" :key="pkg.id">
              <td><span class="badge-chip teal">{{ pkg.productName }}</span></td>
              <td><strong>{{ pkg.name }}</strong></td>
              <td>{{ pkg.ratio }}</td>
              <td><strong class="color-primary">{{ pkg.formattedPrice }}</strong></td>
              <td>{{ pkg.duration }} • {{ pkg.meetings }}</td>
              <td><span class="badge-chip gold">{{ pkg.badge || 'Standar' }}</span></td>
              <td class="text-right">
                <button @click="openEditPackageModal(pkg)" class="btn-secondary-xs" style="margin-right: 6px;">
                  Edit
                </button>
                <button @click="handleDeletePackage(pkg.id)" class="btn-danger-sm">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="filteredPackages.length === 0">
              <td colspan="7" class="text-center" style="padding: 32px; color: var(--text-muted);">
                Belum ada paket untuk program ini. Klik "+ Tambah Paket Kursus" di atas untuk menambahkan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 4: DAFTAR INSTRUKTUR (m_coaches)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_coaches'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Tenaga Pengajar</span>
          <h2 class="page-title">Daftar Instruktur & Pelatih Terverifikasi</h2>
          <p class="page-sub">Menambah coach baru akan otomatis membuat akun login (Default Password: <strong>123</strong>) dan memetakan ke program pelatihan.</p>
        </div>
        <button @click="openAddCoachModal" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Tambah Instruktur Baru</span>
        </button>
      </div>

      <div class="coaches-grid">
        <div v-for="c in store.coaches" :key="c.id" class="coach-manage-card card-humanist">
          <div class="c-head">
            <img :src="c.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240'" :alt="c.name" class="c-avatar" />
            <div class="c-title-area">
              <h3 class="c-name">{{ c.name }}</h3>
              <span class="badge-chip green">Akun Login Aktif (123)</span>
            </div>
          </div>

          <p class="c-spec">{{ c.specialty }}</p>
          <p class="c-bio">{{ c.bio }}</p>

          <!-- Mapped Products -->
          <div class="coach-prod-mapping">
            <span class="lbl-small">Spesialisasi Program:</span>
            <div class="coach-tags-wrap">
              <span v-for="p in c.mappedProducts" :key="p.id" class="badge-chip teal">
                {{ p.name }}
              </span>
              <span v-if="!c.mappedProducts || c.mappedProducts.length === 0" class="badge-chip gold">
                Semua Program
              </span>
            </div>
          </div>

          <div class="c-meta">
            <span>Email: <strong>{{ c.email }}</strong></span>
            <span>WhatsApp: <strong>{{ c.phone }}</strong></span>
          </div>

          <div class="coach-card-actions">
            <button @click="openEditCoachModal(c)" class="btn-secondary-sm">
              Edit Data
            </button>
            <button @click="handleDeleteCoach(c.id)" class="btn-danger-sm">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 5: DATA SISWA & WALI (m_students)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_students'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip green">Data Akademik & Siswa</span>
          <h2 class="page-title">Data Siswa & Wali Murid</h2>
          <p class="page-sub">Kelola identitas siswa, nama orang tua, penugasan instruktur terikat, dan 4 sesi latihan berkala.</p>
        </div>
        <button @click="openAddStudentModal" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Tambah Siswa Baru</span>
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="filter-search-strip card-humanist">
        <div class="search-input-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="studentSearchQuery" 
            type="text" 
            placeholder="Cari nama siswa, orang tua, atau nomor telepon..." 
            class="input-search-clean" 
          />
        </div>
        <div class="filter-count">
          <span>Menampilkan {{ filteredStudents.length }} dari {{ store.students.length }} siswa</span>
        </div>
      </div>

      <!-- Students Table -->
      <div class="card-humanist table-wrap">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Identitas Siswa & Usia</th>
              <th>Nama Orang Tua / Wali</th>
              <th>Program & Paket</th>
              <th>Pelatih Terikat & Status Ikatan</th>
              <th>Jadwal Sesi</th>
              <th class="text-right">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stu in filteredStudents" :key="stu.id">
              <td>
                <div class="stu-name-cell">
                  <strong>{{ stu.name }}</strong>
                  <span class="sub-cell-txt">{{ stu.age }} Tahun • Bergabung: {{ stu.joinedDate }}</span>
                </div>
              </td>
              <td>
                <div class="parent-info">
                  <strong>{{ stu.parentName }}</strong>
                  <div class="wa-chat-inline">
                    <span class="font-mono sub-cell-txt">{{ stu.phone }}</span>
                    <a :href="actions.buildWhatsAppUrl(stu, 'welcome')" target="_blank" class="link-wa-chat" title="Chat via WhatsApp">
                      Chat WA
                    </a>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-chip teal">{{ stu.productName || stu.program }}</span>
                <div class="sub-cell-txt">{{ stu.packageName }}</div>
              </td>
              <td>
                <div class="coach-lock-status">
                  <strong>{{ stu.assignedCoachName || 'Belum di-assign' }}</strong>
                  <span class="badge-chip gold" style="font-size: 10.5px; margin-top: 2px;">
                    {{ stu.mappingStatus || 'Terkunci 4 Sesi' }}
                  </span>
                </div>
              </td>
              <td>
                <button @click="openStudentSchedulesModal(stu)" class="btn-schedule-view">
                  <span class="badge-chip green">{{ (stu.memberSchedules || []).length || 4 }} Sesi Terjadwal</span>
                  <span class="btn-view-txt">Atur Jadwal ▾</span>
                </button>
              </td>
              <td class="text-right">
                <div class="table-actions-cluster">
                  <button @click="openAssignCoachModal(stu)" class="btn-primary-xs" title="Tugaskan / Ganti Pelatih">
                    Assign Pelatih
                  </button>
                  <button @click="openEditStudentModal(stu)" class="btn-secondary-xs" title="Edit Data Siswa">
                    Edit
                  </button>
                  <button @click="handleDeleteStudent(stu.id)" class="btn-danger-xs" title="Hapus Siswa">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="6" class="text-center" style="padding: 32px; color: var(--text-muted);">
                Tidak ada data siswa yang cocok dengan pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 6: JADWAL & SESI LATIHAN     <!-- =========================================================================
         SUB-MENU 6: PLOTTING JADWAL & SESI LATIHAN (m_schedules) - FULL DYNAMIC
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_schedules'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Plotting & Presensi Interaktif</span>
          <h2 class="page-title">Jadwal & Sesi Latihan Seluruh Siswa</h2>
          <p class="page-sub">Kelola plotting jadwal dinamis, alokasi instruktur, pelacakan presensi, evaluasi capaian, dan rescheduling fleksibel.</p>
        </div>
        <button @click="openCreateScheduleModal()" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Plotting Sesi Latihan Baru</span>
        </button>
      </div>

      <!-- Schedule KPI Overview Cards -->
      <div class="sched-metrics-row">
        <div class="sched-metric-box">
          <span class="sched-metric-lbl">Total Sesi Terjadwal</span>
          <strong class="sched-metric-val">{{ allSchedulesList.length }} Sesi</strong>
        </div>
        <div class="sched-metric-box text-green">
          <span class="sched-metric-lbl">Sesi Terlaksana (Hadir)</span>
          <strong class="sched-metric-val">{{ countCompletedSchedules }} Sesi</strong>
        </div>
        <div class="sched-metric-box text-gold">
          <span class="sched-metric-lbl">Menunggu Pelaksanaan</span>
          <strong class="sched-metric-val">{{ countUpcomingSchedules }} Sesi</strong>
        </div>
        <div class="sched-metric-box text-blue">
          <span class="sched-metric-lbl">Izin / Reschedule</span>
          <strong class="sched-metric-val">{{ countRescheduledSchedules }} Sesi</strong>
        </div>
      </div>

      <!-- Multi-Filter & Search Bar -->
      <div class="schedule-filter-controls card-humanist">
        <div class="filter-group">
          <label class="filter-lbl">Filter Program:</label>
          <select v-model="selectedProgramScheduleFilter" class="form-select filter-select">
            <option value="">Semua Program ({{ store.products.length }})</option>
            <option v-for="p in store.products" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-lbl">Filter Instruktur:</label>
          <select v-model="selectedCoachScheduleFilter" class="form-select filter-select">
            <option value="">Semua Instruktur ({{ store.coaches.length }})</option>
            <option v-for="c in store.coaches" :key="c.id" :value="c.name">{{ c.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-lbl">Status Pelaksanaan:</label>
          <select v-model="selectedStatusScheduleFilter" class="form-select filter-select">
            <option value="">Semua Status</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Selesai">Hadir / Selesai</option>
            <option value="Izin">Izin / Sakit</option>
            <option value="Reschedule">Reschedule</option>
          </select>
        </div>

        <div class="filter-group filter-search-wrap">
          <label class="filter-lbl">Cari Siswa / Lokasi:</label>
          <input 
            v-model="scheduleSearchQuery" 
            type="text" 
            placeholder="Ketik nama siswa atau lokasi..." 
            class="form-input filter-search-input"
          />
        </div>
      </div>

      <!-- Dynamic Schedules Table -->
      <div class="card-humanist table-wrap">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Sesi & Waktu</th>
              <th>Nama Siswa & Wali</th>
              <th>Program & Lokasi</th>
              <th>Instruktur Pengampu</th>
              <th>Status</th>
              <th>Evaluasi & Catatan</th>
              <th class="text-right">Aksi Dinamis</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sch in filteredSchedulesList" :key="sch.id">
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-chip teal">Sesi {{ sch.sessionNo }}</span>
                  <strong>{{ sch.day }}</strong>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">{{ sch.date }}</div>
                <div class="font-mono text-xs font-bold" style="color: var(--color-primary); margin-top: 2px;">{{ sch.time }}</div>
              </td>
              <td>
                <strong>{{ sch.studentName }}</strong>
                <div class="sub-cell-txt">Wali: {{ sch.parentName }}</div>
                <a v-if="sch.phone" :href="'https://wa.me/' + cleanPhone(sch.phone)" target="_blank" class="sub-cell-wa">
                  {{ sch.phone }} ↗
                </a>
              </td>
              <td>
                <span class="badge-chip green">{{ sch.programName || 'Program' }}</span>
                <div class="font-mono text-xs text-muted" style="margin-top: 4px;">{{ sch.location }}</div>
              </td>
              <td>
                <strong>{{ sch.coachName }}</strong>
              </td>
              <td>
                <span 
                  class="badge-chip" 
                  :class="{
                    'green': sch.status === 'Selesai' || sch.status === 'Hadir',
                    'gold': sch.status === 'Terjadwal',
                    'teal': sch.status === 'Izin' || sch.status === 'Izin/Sakit',
                    'red': sch.status === 'Reschedule' || sch.status === 'Dibatalkan'
                  }"
                >
                  {{ sch.status }}
                </span>
              </td>
              <td>
                <div class="sched-notes-cell">
                  <span v-if="sch.rating" class="rating-stars">{{ '★'.repeat(sch.rating) }}</span>
                  <p class="sched-notes-text">{{ sch.notes || 'Belum ada catatan evaluasi' }}</p>
                </div>
              </td>
              <td class="text-right">
                <div class="table-actions-inline">
                  <button 
                    @click="openAttendanceModal(sch)" 
                    class="btn-primary-xs"
                    title="Catat Presensi & Evaluasi Kemampuan"
                  >
                    Presensi & Nilai
                  </button>
                  <button 
                    @click="openRescheduleModal(sch)" 
                    class="btn-secondary-xs"
                    title="Ubah Tanggal, Waktu atau Pelatih"
                  >
                    Reschedule
                  </button>
                  <button 
                    @click="handleDeleteSchedule(sch)" 
                    class="btn-danger-xs"
                    title="Hapus Sesi Latihan"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredSchedulesList.length === 0">
              <td colspan="7" class="text-center" style="padding: 40px; color: var(--text-muted);">
                Tidak ada data sesi latihan yang sesuai dengan filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU: MONITORING KEHADIRAN COACH (m_attendance)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_attendance'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Audit Kehadiran Berbasis Geofence GPS</span>
          <h2 class="page-title">Monitoring Kehadiran Instruktur & Coach</h2>
          <p class="page-sub">Pemantauan presensi pelatih secara real-time berdasarkan titik koordinat GPS dan validasi radius lokasi Kolam Graha Kresna Pratama.</p>
        </div>
        <div class="top-date-badge">
          <span>📍 Target: Kolam Graha Kresna Pratama (Maks. 250m)</span>
        </div>
      </div>

      <!-- KPI Metrics Cards Grid -->
      <div class="metrics-grid">
        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Total Presensi Masuk</span>
            <strong class="metric-val">{{ totalAttendances }} Catatan</strong>
            <span class="metric-sub text-teal">Presensi Coach Terdata</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Presensi Dalam Radius Kolam</span>
            <strong class="metric-val">{{ validGeofenceAttendances }} Valid</strong>
            <span class="metric-sub text-green">{{ geofenceCompliancePct }}% Kepatuhan Lokasi</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Coach Bertugas / Aktif</span>
            <strong class="metric-val">{{ coachesOnDutyToday }} Pelatih</strong>
            <span class="metric-sub">Tercatat Absen Hari Ini</span>
          </div>
        </div>

        <div class="metric-card card-humanist">
          <div class="metric-icon-wrap teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-lbl">Toleransi Radius Geofence</span>
            <strong class="metric-val">250 Meter</strong>
            <span class="metric-sub">Titik Kolam Jatiwaringin</span>
          </div>
        </div>
      </div>

      <!-- Venue Geofence Reference Strip -->
      <div class="geofence-info-strip card-humanist">
        <div class="strip-left">
          <div class="venue-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="venue-strip-title">Titik Pusat Latihan: Kolam Graha Kresna Pratama, Jatiwaringin</h4>
              <span class="badge-chip teal">Pusat Latihan Resmi</span>
            </div>
            <p class="venue-strip-desc">
              Koordinat Patokan: <code class="font-mono">-6.284700, 106.914200</code> • Toleransi Presensi: Maks. 250 Meter. Presensi yang berada di luar radius ini akan ditandai dengan label peringatan dan membutuhkan review manajemen.
            </p>
          </div>
        </div>
        <div class="strip-right">
          <a href="https://www.google.com/maps?q=-6.2847,106.9142" target="_blank" class="btn-secondary btn-sm">
            <span>Buka Lokasi Kolam di Maps</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="filter-toolbar card-humanist">
        <div class="toolbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="attSearchQuery" 
            type="text" 
            placeholder="Cari nama coach, sesi, atau catatan..." 
            class="search-input" 
          />
        </div>

        <div class="toolbar-filters">
          <select v-model="attFilterLocation" class="filter-select">
            <option value="all">Semua Lokasi Fasilitas</option>
            <option v-for="l in store.locations" :key="l.id" :value="l.id">{{ l.name }}</option>
          </select>

          <select v-model="attFilterCoach" class="filter-select">
            <option value="all">Semua Instruktur / Coach</option>
            <option v-for="c in store.coaches" :key="c.id" :value="c.name">{{ c.name }}</option>
          </select>

          <select v-model="attFilterStatus" class="filter-select">
            <option value="all">Semua Status Radius</option>
            <option value="valid">Dalam Radius (<= 250m)</option>
            <option value="invalid">Luar Radius (> 250m)</option>
          </select>
        </div>
      </div>

      <!-- Monitoring Attendance Table with Mini Maps -->
      <div class="attendance-table-wrap card-humanist">
        <div class="table-header-row">
          <div>
            <h3 class="table-card-title">Daftar Log Presensi & Titik Koordinat Pelatih</h3>
            <span class="table-card-sub">Menampilkan {{ filteredCoachAttendances.length }} data presensi real-time</span>
          </div>
        </div>

        <div v-if="filteredCoachAttendances.length === 0" class="empty-table-state">
          <p>Tidak ditemukan data presensi yang sesuai dengan filter.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Instruktur / Coach</th>
                <th>Waktu & Sesi</th>
                <th>Titik Koordinat GPS</th>
                <th>Jarak ke Kolam</th>
                <th>Preview Mini Map</th>
                <th>Status Validasi</th>
                <th style="text-align: right;">Aksi & Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="att in filteredCoachAttendances" :key="att.id">
                <td>
                  <div class="coach-td-cell">
                    <img :src="att.coachAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'" alt="Avatar" class="coach-sm-avatar" />
                    <div>
                      <strong class="coach-cell-name">{{ att.coachName }}</strong>
                      <span class="coach-cell-notes">{{ att.notes || 'Presensi mandiri' }}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="time-td-cell">
                    <strong class="att-date-str">{{ att.date || 'Hari Ini' }}</strong>
                    <span class="att-clock-str font-mono">{{ att.time }}</span>
                    <span class="badge-chip teal att-session-pill">{{ att.sessionType }}</span>
                    <span class="badge-chip gold att-session-pill" style="margin-top: 3px;">📍 {{ att.locationName || 'Kolam Graha Kresna' }}</span>
                  </div>
                </td>

                <td>
                  <div class="coord-td-cell">
                    <span class="font-mono coord-val">{{ Number(att.latitude).toFixed(5) }}, {{ Number(att.longitude).toFixed(5) }}</span>
                    <span class="acc-text">Akurasi GPS: ± {{ att.accuracy || 10 }}m</span>
                  </div>
                </td>

                <td>
                  <div class="dist-td-cell">
                    <span 
                      class="dist-badge"
                      :class="(att.distanceFromVenue || 0) <= 250 ? 'dist-valid' : 'dist-warning'"
                    >
                      📍 {{ att.distanceFromVenue }} Meter
                    </span>
                    <span class="dist-status-lbl">
                      {{ (att.distanceFromVenue || 0) <= 250 ? 'Di Dalam Radius' : 'Di Luar Radius' }}
                    </span>
                  </div>
                </td>

                <td>
                  <!-- Interactive Mini Map Thumbnail -->
                  <div class="mini-map-thumb-box" @click="openAttendanceMapModal(att)" title="Klik untuk perbesar peta">
                    <iframe 
                      :src="getMiniMapEmbedUrl(att.latitude, att.longitude)" 
                      class="thumb-iframe"
                      tabindex="-1"
                      loading="lazy"
                    ></iframe>
                    <div class="thumb-overlay">
                      <span>Perbesar Peta 🔍</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="status-td-cell">
                    <span 
                      class="badge-chip"
                      :class="att.isVerified ? 'green' : 'gold'"
                    >
                      {{ att.isVerified ? '✓ Terverifikasi' : '⏳ Menunggu Verifikasi' }}
                    </span>
                    <span v-if="att.verifiedAt" class="verif-time font-mono">Pada {{ att.verifiedAt }}</span>
                  </div>
                </td>

                <td style="text-align: right;">
                  <div class="action-buttons-cell">
                    <button 
                      v-if="!att.isVerified" 
                      @click="handleVerifyAttendance(att.id)" 
                      class="btn-primary btn-sm"
                      title="Verifikasi keabsahan presensi ini"
                    >
                      ✓ Verifikasi
                    </button>
                    <button 
                      @click="openAttendanceMapModal(att)" 
                      class="btn-secondary btn-sm"
                      title="Lihat peta titik koordinat lengkap"
                    >
                      📍 Buka Peta
                    </button>
                    <a 
                      :href="`https://www.google.com/maps?q=${att.latitude},${att.longitude}`" 
                      target="_blank" 
                      class="map-link-icon-btn"
                      title="Buka di Google Maps"
                    >
                      ↗
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL: Full View Mini Map & Coordinate Detail -->
      <div v-if="isAttMapModalOpen && selectedAttendanceForMap" class="modal-backdrop">
        <div class="modal-card modal-lg">
          <div class="modal-header">
            <div>
              <span class="badge-chip gold">Titik Absensi Geofence GPS</span>
              <h3 class="modal-title">Detail Lokasi Presensi: {{ selectedAttendanceForMap.coachName }}</h3>
            </div>
            <button class="btn-close" @click="closeAttendanceMapModal">✕</button>
          </div>

          <div class="modal-body map-modal-body">
            <!-- Top Details Banner -->
            <div class="modal-geo-summary card-humanist">
              <div class="modal-geo-col">
                <span class="geo-sub-lbl">Waktu & Sesi:</span>
                <strong>{{ selectedAttendanceForMap.date }} • {{ selectedAttendanceForMap.time }}</strong>
                <span class="badge-chip teal" style="margin-top: 4px;">{{ selectedAttendanceForMap.sessionType }}</span>
              </div>
              <div class="modal-geo-col">
                <span class="geo-sub-lbl">Koordinat GPS:</span>
                <strong class="font-mono">{{ selectedAttendanceForMap.latitude }}, {{ selectedAttendanceForMap.longitude }}</strong>
                <span class="acc-text">Akurasi Perangkat: ± {{ selectedAttendanceForMap.accuracy || 10 }}m</span>
              </div>
              <div class="modal-geo-col">
                <span class="geo-sub-lbl">Jarak ke Kolam Patokan:</span>
                <strong :class="(selectedAttendanceForMap.distanceFromVenue || 0) <= 250 ? 'text-green' : 'text-gold'">
                  {{ selectedAttendanceForMap.distanceFromVenue }} Meter
                </strong>
                <span class="acc-text">{{ (selectedAttendanceForMap.distanceFromVenue || 0) <= 250 ? 'Memenuhi Syarat Radius' : 'Di Luar Batas 250m' }}</span>
              </div>
              <div class="modal-geo-col">
                <span class="geo-sub-lbl">Catatan Pelatih:</span>
                <em>{{ selectedAttendanceForMap.notes || '-' }}</em>
              </div>
            </div>

            <!-- Full Interactive Map Embed -->
            <div class="full-map-embed-container">
              <iframe 
                :src="getMiniMapEmbedUrl(selectedAttendanceForMap.latitude, selectedAttendanceForMap.longitude, 0.005)" 
                class="full-map-iframe"
                loading="lazy"
                title="Peta Lengkap Absensi Pelatih"
              ></iframe>
              <div class="map-floating-pin-card">
                <div class="pin-header">
                  <span class="pin-dot-anim"></span>
                  <strong>{{ selectedAttendanceForMap.coachName }}</strong>
                </div>
                <p>📍 Posisi saat Check-in: {{ selectedAttendanceForMap.locationName }}</p>
                <div class="pin-actions">
                  <a 
                    :href="`https://www.google.com/maps?q=${selectedAttendanceForMap.latitude},${selectedAttendanceForMap.longitude}`" 
                    target="_blank" 
                    class="btn-primary btn-sm"
                  >
                    Buka Rute di Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button 
              v-if="!selectedAttendanceForMap.isVerified" 
              @click="handleVerifyAttendance(selectedAttendanceForMap.id)" 
              class="btn-primary"
            >
              ✓ Verifikasi Kehadiran Ini
            </button>
            <button class="btn-secondary" @click="closeAttendanceMapModal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 7: KEUANGAN & PEMBAYARAN (m_payments)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_payments'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Sistem Keuangan & Billing</span>
          <h2 class="page-title">Keuangan & Verifikasi Tagihan</h2>
          <p class="page-sub">Monitoring tagihan paket kursus, verifikasi transfer, dan preview QRIS Dinamis standar ASPI / EMVCo.</p>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="tabs-pill" style="margin-bottom: 20px;">
        <button 
          class="tab-pill-btn" 
          :class="{ active: paymentSubTab === 'invoices' }"
          @click="paymentSubTab = 'invoices'"
        >
          Daftar Tagihan & Invoice
        </button>
        <button 
          class="tab-pill-btn" 
          :class="{ active: paymentSubTab === 'qris_generator' }"
          @click="paymentSubTab = 'qris_generator'"
        >
          Generator QRIS Dinamis (ASPI/EMVCo)
        </button>
        <button 
          class="tab-pill-btn" 
          :class="{ active: paymentSubTab === 'bank_accounts' }"
          @click="paymentSubTab = 'bank_accounts'"
        >
          Rekening Transfer Bank
        </button>
      </div>

      <!-- Subtab A: Invoices -->
      <div v-if="paymentSubTab === 'invoices'" class="card-humanist table-wrap">
        <table class="leads-table">
          <thead>
            <tr>
              <th>No. Invoice</th>
              <th>Siswa & Wali Murid</th>
              <th>Paket Kursus</th>
              <th>Nominal Tagihan</th>
              <th>Metode Bayar</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in store.transactions" :key="trx.id">
              <td><strong class="font-mono">{{ trx.id }}</strong></td>
              <td>
                <strong>{{ trx.studentName }}</strong>
                <div class="sub-cell-txt">Wali: {{ trx.parentName }}</div>
              </td>
              <td>{{ trx.packageName }}</td>
              <td><strong class="color-primary">{{ trx.formattedAmount }}</strong></td>
              <td><span class="badge-chip teal">{{ trx.paymentMethodName || 'QRIS Dinamis' }}</span></td>
              <td>
                <span class="badge-chip" :class="trx.status?.includes('Lunas') ? 'green' : 'gold'">
                  {{ trx.status }}
                </span>
              </td>
              <td class="text-right">
                <button 
                  v-if="!trx.status?.includes('Lunas')" 
                  @click="handleVerifyPayment(trx.id)" 
                  class="btn-primary-xs"
                >
                  Verifikasi Lunas
                </button>
                <span v-else class="text-green" style="font-size: 12px; font-weight: 700;">✓ Lunas</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Subtab B: QRIS Dynamic Generator (Dynamic Master ASPI/EMVCo) -->
      <div v-else-if="paymentSubTab === 'qris_generator'" class="qris-tab-wrapper">
        <!-- Master Config Bar & Editor -->
        <div class="card-humanist" style="margin-bottom: 20px; padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
            <div>
              <div class="flex items-center gap-2">
                <span class="badge-chip gold">ASPI / EMVCo Standard</span>
                <span class="badge-chip teal">QRIS Dinamis Otomatis</span>
              </div>
              <h3 style="font-size: 18px; font-weight: 800; color: var(--color-primary-dark); margin: 6px 0 4px;">
                Master Generator QRIS Dinamis
              </h3>
              <p style="font-size: 13px; color: var(--text-muted); margin: 0;">
                Kelola master QRIS yayasan dengan upload gambar QRIS resmi dari bank. Sistem otomatis mengonversi ke QRIS dinamis real-time dengan kalkulasi CRC16.
              </p>
            </div>
            <div>
              <button 
                v-if="!isEditingQrisMaster" 
                @click="startEditQrisMaster" 
                class="btn-secondary"
                style="display: inline-flex; align-items: center; gap: 6px;"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Edit Konfigurasi Master QRIS</span>
              </button>
            </div>
          </div>

          <!-- Master QRIS Configuration Form (Inline/Expandable) -->
          <div v-if="isEditingQrisMaster" style="margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h4 style="font-size: 15px; font-weight: 800; color: var(--color-primary-dark); margin: 0;">
                ⚙️ Pengaturan Master QRIS (Upload Gambar & Data Merchant)
              </h4>
              <span class="badge-chip gold">Deteksi Otomatis Barcode</span>
            </div>

            <!-- Upload QRIS Image Dynamic Area -->
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="form-label" style="font-weight: 700; color: var(--color-primary-dark);">
                📷 Upload Gambar / Dokumen QRIS Resmi Yayasan *
              </label>
              <div class="upload-field-box" style="background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 12px; padding: 18px;">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  @change="handleQrisImageUpload"
                  id="qrisUploadInput"
                  style="display: none;"
                />
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <button 
                      type="button" 
                      @click="$el.querySelector('#qrisUploadInput')?.click()" 
                      class="btn-primary" 
                      style="display: inline-flex; align-items: center; gap: 8px;"
                      :disabled="isUploadingQrisImg"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>{{ isUploadingQrisImg ? 'Mengunggah & Membaca QR...' : 'Pilih File Gambar QRIS' }}</span>
                    </button>
                    <span style="font-size: 12px; color: var(--text-muted);">
                      Upload file JPG/PNG dari BCA/Bank/PJP. Sistem otomatis membaca barcode dan mengekstrak data QRIS!
                    </span>
                  </div>

                  <div v-if="qrisMasterForm.qrisImageUrl" style="display: flex; align-items: center; gap: 12px; background: #ffffff; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;">
                    <img :src="qrisMasterForm.qrisImageUrl" alt="Master QRIS" style="width: 52px; height: 52px; object-fit: contain; border-radius: 4px;" />
                    <div>
                      <div class="text-green" style="font-size: 12px; font-weight: 700;">✓ Gambar Berhasil Terpasang</div>
                      <span style="font-size: 11px; color: var(--text-subtle);">Master QRIS Aktif</span>
                    </div>
                  </div>
                </div>

                <div v-if="qrisDetectStatus" style="margin-top: 12px; padding: 8px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700;" :style="{ background: qrisDetectStatus.includes('✓') ? '#f0fdf4' : '#eff6ff', color: qrisDetectStatus.includes('✓') ? '#15803d' : '#1d4ed8' }">
                  {{ qrisDetectStatus }}
                </div>
              </div>
            </div>

            <!-- Merchant Info Grid -->
            <div class="form-grid" style="margin-bottom: 14px;">
              <div class="form-group">
                <label class="form-label">Nama Merchant (Tag 59) *</label>
                <input v-model="qrisMasterForm.merchantName" type="text" class="form-input" placeholder="Contoh: MINE.SKILLS INDONESIA" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kota Merchant (Tag 60) *</label>
                <input v-model="qrisMasterForm.merchantCity" type="text" class="form-input" placeholder="Contoh: JAKARTA" required />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">NMID (National Merchant Identifier)</label>
              <input v-model="qrisMasterForm.nmid" type="text" class="form-input font-mono" placeholder="Contoh: ID1020038847291" />
            </div>

            <!-- Auto Tag Integration Notice (Replaces the raw string payload requirement) -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 22px;">🛡️</span>
              <div>
                <strong style="font-size: 13px; color: #166534; display: block;">Integrasi Standar ASPI & EMVCo Dinamis Otomatis</strong>
                <p style="font-size: 12px; color: #15803d; margin: 0; line-height: 1.4;">
                  String payload QRIS terenkripsi dan diproses otomatis oleh sistem dari barcode gambar/standar resmi. Anda tidak perlu mengisi kode payload manual.
                </p>
              </div>
            </div>

            <!-- Optional Hidden Developer Mode for Debugging (Disabled & Collapsed) -->
            <details style="margin-bottom: 18px; font-size: 11.5px; color: var(--text-subtle);">
              <summary style="cursor: pointer; user-select: none; color: var(--text-muted); font-weight: 600;">
                Mode Pengembang / Debug String Raw (Disabled)
              </summary>
              <div style="margin-top: 8px;">
                <input 
                  type="text" 
                  :value="qrisMasterForm.rawQrisStatic" 
                  disabled 
                  readonly 
                  class="form-input font-mono" 
                  style="font-size: 11px; background: #f1f5f9; color: #64748b; cursor: not-allowed;" 
                />
              </div>
            </details>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" @click="cancelEditQrisMaster" class="btn-secondary">Batal</button>
              <button type="button" @click="saveQrisMaster" class="btn-primary">
                💾 Simpan Konfigurasi Master QRIS
              </button>
            </div>
          </div>
        </div>

        <!-- Live Generator & Simulator Card -->
        <div class="card-humanist qris-generator-card">
          <div class="qris-grid">
            <div class="qris-form-side">
              <h4 class="form-sec-title">Simulator & Preview QRIS Dinamis</h4>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                Pilih nominal paket latihan atau ketik nominal bebas untuk menguji generator QR dinamis secara instan.
              </p>

              <div class="form-group">
                <label class="form-label">Pilih Paket Tagihan Cepat</label>
                <select v-model="selectedQrisNominal" @change="generateQrisPreview" class="form-select">
                  <option :value="400000">Group Class — Rp 400.000</option>
                  <option :value="500000">Small Group — Rp 500.000</option>
                  <option :value="700000">Private Class — Rp 700.000</option>
                  <option :value="350000">Reguler Tari — Rp 350.000</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Atau Masukkan Nominal Bebas (Rp)</label>
                <input 
                  v-model.number="customQrisAmount" 
                  @input="generateQrisPreview" 
                  type="number" 
                  class="form-input" 
                  placeholder="Contoh: 500000" 
                />
              </div>

              <div class="qris-meta-box">
                <div class="box-row">
                  <span>Nama Merchant:</span>
                  <strong>{{ store.paymentConfig?.merchantName }}</strong>
                </div>
                <div class="box-row">
                  <span>Kota Merchant:</span>
                  <span>{{ store.paymentConfig?.merchantCity || 'JAKARTA' }}</span>
                </div>
                <div class="box-row">
                  <span>NMID:</span>
                  <span class="font-mono">{{ store.paymentConfig?.nmid }}</span>
                </div>
              </div>
            </div>

            <div class="qris-preview-side">
              <div class="qris-display-frame">
                <div class="qris-header-logo">
                  <span class="qris-txt">QRIS</span>
                  <span class="qris-sub">PEMBAYARAN DIGITAL RESMI</span>
                </div>
                
                <div class="qr-canvas-box">
                  <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QRIS Dinamis" class="qr-img" />
                  <div v-else class="qr-loading">Menyiapkan QR...</div>
                </div>

                <div class="qris-nominal-box">
                  <span class="lbl">Total Tagihan:</span>
                  <strong class="nominal-val">Rp {{ activeQrisAmount.toLocaleString('id-ID') }}</strong>
                </div>

                <div class="qris-footer-notes">
                  <span>Scan menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, Dana, atau ShopeePay.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subtab C: Bank Accounts (Full CRUD) -->
      <div v-else-if="paymentSubTab === 'bank_accounts'" class="bank-accounts-wrap">
        <div class="card-humanist" style="margin-bottom: 20px; padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge-chip teal">Master Rekening Yayasan</span>
              <h3 style="font-size: 18px; font-weight: 800; color: var(--color-primary-dark); margin: 6px 0 4px;">
                Daftar Rekening Transfer Bank Resmi
              </h3>
              <p style="font-size: 13px; color: var(--text-muted); margin: 0;">
                Kelola rekening resmi tujuan pembayaran pendaftaran & paket kursus. Rekening ini otomatis tampil di menu billing orang tua siswa.
              </p>
            </div>
            <button @click="openAddBankModal" class="btn-primary" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Tambah Rekening Baru</span>
            </button>
          </div>
        </div>

        <div class="bank-accounts-grid">
          <div v-for="bank in store.paymentConfig?.bankAccounts || []" :key="bank.id" class="bank-card card-humanist">
            <div class="bank-head">
              <h4 class="bank-title">{{ bank.bankName }}</h4>
              <span class="badge-chip teal">{{ bank.badge }}</span>
            </div>
            <div class="bank-num font-mono">{{ bank.accountNumber }}</div>
            <div class="bank-holder">a.n. {{ bank.accountHolder }}</div>

            <!-- Card Actions -->
            <div class="bank-card-actions">
              <button @click="openEditBankModal(bank)" class="btn-secondary btn-xs" title="Edit Rekening">
                ✏️ Edit
              </button>
              <button @click="confirmDeleteBank(bank)" class="btn-danger-xs" title="Hapus Rekening">
                🗑️ Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU: PROFIL & WEBSITE CMS (m_website)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_website'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip teal">Pengaturan Brand & CMS</span>
          <h2 class="page-title">Profil Bisnis & Konten Website</h2>
          <p class="page-sub">Atur identitas merek mine.skills, nomor kontak WhatsApp resmi, alamat kantor, dan konten banner beranda publik.</p>
        </div>
      </div>

      <div class="website-config-grid">
        <div class="card-humanist website-config-card">
          <form @submit.prevent="handleSaveWebsiteConfig">
            <h3 class="form-section-title">Identitas Brand & Kontak Resmi</h3>
            
            <div class="form-group">
              <label class="form-label">Nama Brand / Akademi <span class="required">*</span></label>
              <input v-model="websiteBrandForm.name" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Tagline Utama <span class="required">*</span></label>
              <input v-model="websiteBrandForm.umbrellaTagline" type="text" class="form-input" required />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nomor WhatsApp Resmi (Call Center)</label>
                <input v-model="websiteBrandForm.callCenter" type="text" class="form-input" placeholder="085286274726" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Resmi</label>
                <input v-model="websiteBrandForm.officialEmail" type="email" class="form-input" placeholder="halo@mineskills.id" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Alamat Kantor / Pusat Operasional</label>
              <textarea v-model="websiteBrandForm.addressFull" class="form-textarea" rows="2" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Jam Operasional Pelatihan</label>
              <input v-model="websiteBrandForm.operatingHours" type="text" class="form-input" placeholder="Setiap Hari: 07.30 - 18.00 WIB" required />
            </div>

            <h3 class="form-section-title" style="margin-top: 24px;">Konten Banner Beranda (Hero Banner)</h3>

            <div class="form-group">
              <label class="form-label">Badge Teks Banner</label>
              <input v-model="websiteHeroForm.badgeText" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Headline Utama Banner</label>
              <input v-model="websiteHeroForm.headline" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Subheadline / Penjelasan Singkat</label>
              <textarea v-model="websiteHeroForm.subheadline" class="form-textarea" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Label Tombol Utama (CTA)</label>
              <input v-model="websiteHeroForm.primaryCta" type="text" class="form-input" required />
            </div>

            <div class="form-actions" style="margin-top: 20px;">
              <button type="submit" class="btn-primary">
                <span>Simpan Perubahan Website & Brand</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SUB-MENU 8: PENGATURAN AKSES & RBAC (m_rbac)
         ========================================================================= -->
    <div v-else-if="activeMenu === 'm_rbac'" class="portal-tab-content">
      <div class="page-top-bar">
        <div>
          <span class="badge-chip gold">Keamanan & Otorisasi</span>
          <h2 class="page-title">Pengaturan Hak Akses (RBAC) & Akun Pengguna</h2>
          <p class="page-sub">Manajemen kredensial login (Customer, Coach, Manajemen). Seluruh akun baru memiliki default password: <strong>123</strong>.</p>
        </div>
      </div>

      <div class="card-humanist table-wrap">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Email Akun (Login ID)</th>
              <th>Peran (Role)</th>
              <th>Default Password</th>
              <th>Status Akun</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in store.users" :key="u.id">
              <td><strong>{{ u.name }}</strong></td>
              <td><span class="font-mono">{{ u.email }}</span></td>
              <td>
                <span class="badge-chip" :class="u.role === 'manajemen' ? 'gold' : (u.role === 'coach' ? 'teal' : 'green')">
                  {{ u.role.toUpperCase() }}
                </span>
              </td>
              <td><span class="badge-chip gold">123</span></td>
              <td><span class="badge-chip green">Aktif</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =========================================================================
         MODALS (ENTERPRISE CRUD)
         ========================================================================= -->
    <!-- 1. MODAL TAMBAH & EDIT PROGRAM PELATIHAN -->
    <div v-if="showProductModal" class="modal-backdrop" @click.self="showProductModal = false">
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditProduct ? 'Edit Program & Kurikulum' : 'Tambah Program Pelatihan Baru' }}</h3>
          <button class="btn-close" @click="showProductModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSubmitProduct" class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Program Keahlian <span class="required">*</span></label>
            <input v-model="productForm.name" type="text" class="form-input" placeholder="Contoh: Skill Renang Prestasi" required />
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <input v-model="productForm.category" type="text" class="form-input" placeholder="Olahraga & Ketangkasan / Seni" required />
            </div>
            <div class="form-group">
              <label class="form-label">Target Usia Peserta</label>
              <input v-model="productForm.targetAge" type="text" class="form-input" placeholder="Usia 5 - 15 Tahun" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Upload Foto / Banner Program</label>
            <div class="upload-field-box">
              <input type="file" @change="handleProductImageUpload" accept="image/*" class="file-input" />
              <div v-if="productUploading" class="upload-status">Mengunggah ke server...</div>
              <div v-if="productForm.heroImage" class="upload-preview-wrap">
                <img :src="productForm.heroImage" alt="Preview" class="preview-img" />
                <span class="preview-path font-mono">{{ productForm.heroImage }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Deskripsi Singkat Program</label>
            <textarea v-model="productForm.shortDesc" class="form-textarea" rows="2" placeholder="Fokus kurikulum dan capaian..." required></textarea>
          </div>

          <!-- MAPPING LOKASI LATIHAN UNTUK PRODUK INI -->
          <div class="form-group">
            <label class="form-label font-bold">Mapping Fasilitas & Lokasi Latihan <span class="required">*</span></label>
            <div class="form-hint">Pilih lokasi fasilitas mana saja yang menyelenggarakan program ini:</div>
            <div class="loc-checkboxes-grid">
              <label v-for="loc in store.locations" :key="loc.id" class="loc-check-pill">
                <input 
                  type="checkbox" 
                  :value="loc.id" 
                  v-model="productForm.locationIds" 
                />
                <span>{{ loc.name }} ({{ loc.area }})</span>
              </label>
            </div>
          </div>

          <!-- DYNAMIC CURRICULUM LEVELS SECTION -->
          <div class="curriculum-edit-section">
            <div class="curriculum-sec-header">
              <div>
                <label class="form-label font-bold mb-0">Kurikulum & Tahapan Capaian Level</label>
                <div class="form-hint">Atur tahapan kurikulum berjenjang, fokus materi, dan tantangan kelulusan produk ini.</div>
              </div>
              <button type="button" @click="addCurriculumLevel" class="btn-primary-xs">
                + Tambah Level
              </button>
            </div>

            <div class="curriculum-levels-list">
              <div 
                v-for="(lvl, idx) in productForm.levels" 
                :key="idx" 
                class="curriculum-level-box"
              >
                <div class="curriculum-level-head">
                  <div class="flex items-center gap-2">
                    <span class="badge-chip gold">Level {{ lvl.levelNumber }}</span>
                    <strong class="text-sm">{{ lvl.title || 'Judul Level' }}</strong>
                  </div>
                  <button 
                    type="button" 
                    @click="removeCurriculumLevel(idx)" 
                    class="btn-danger-xs"
                    title="Hapus level ini"
                  >
                    ✕ Hapus
                  </button>
                </div>

                <div class="form-grid">
                  <div class="form-group mb-2">
                    <label class="form-label-xs">Nama / Gelar Level <span class="required">*</span></label>
                    <input 
                      v-model="lvl.title" 
                      type="text" 
                      class="form-input form-input-sm" 
                      placeholder="Contoh: Water Explorer / Basic Parking" 
                      required 
                    />
                  </div>
                  <div class="form-group mb-2">
                    <label class="form-label-xs">Tantangan Kelulusan</label>
                    <input 
                      v-model="lvl.challenge" 
                      type="text" 
                      class="form-input form-input-sm" 
                      placeholder="Contoh: 5 Meter Freestyle Challenge" 
                    />
                  </div>
                </div>

                <div class="form-group mb-0">
                  <label class="form-label-xs">Fokus Pembelajaran <span class="required">*</span></label>
                  <textarea 
                    v-model="lvl.focus" 
                    class="form-textarea form-input-sm" 
                    rows="2" 
                    placeholder="Contoh: Water Confidence & Basic Freestyle..." 
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showProductModal = false" class="btn-secondary">Batal</button>
            <button type="submit" :disabled="productUploading" class="btn-primary">
              <span v-if="productUploading">Sedang Upload...</span>
              <span v-else>{{ isEditProduct ? 'Simpan Perubahan' : 'Buat Program Baru' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL TAMBAH & EDIT FASILITAS LOKASI (m_locations) -->
    <div v-if="showLocationModal" class="modal-backdrop" @click.self="showLocationModal = false">
      <div class="modal-dialog modal-md">
        <div class="modal-header">
          <div>
            <span class="badge-chip gold">{{ isEditLocation ? 'Edit Data Lokasi' : 'Tambah Lokasi Baru' }}</span>
            <h3 class="modal-title">{{ isEditLocation ? 'Perbarui Lokasi Latihan' : 'Daftarkan Lokasi Latihan Baru' }}</h3>
          </div>
          <button class="btn-close" @click="showLocationModal = false">✕</button>
        </div>

        <form @submit.prevent="handleSubmitLocation" class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Fasilitas / Lokasi <span class="required">*</span></label>
            <input v-model="locationForm.name" type="text" class="form-input" placeholder="Contoh: Kolam Renang Tirta Mas Galaxy" required />
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Wilayah / Area <span class="required">*</span></label>
              <input v-model="locationForm.area" type="text" class="form-input" placeholder="Contoh: Bekasi Selatan" required />
            </div>
            <div class="form-group">
              <label class="form-label">Toleransi Radius Geofence (Meter) <span class="required">*</span></label>
              <input v-model.number="locationForm.radiusMeters" type="number" min="50" max="2000" class="form-input" placeholder="250" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap Fasilitas <span class="required">*</span></label>
            <textarea v-model="locationForm.address" class="form-textarea" rows="2" placeholder="Alamat lengkap fasilitas..." required></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Latitude Koordinat GPS <span class="required">*</span></label>
              <input v-model.number="locationForm.latitude" type="number" step="any" class="form-input font-mono" placeholder="-6.284700" required />
            </div>
            <div class="form-group">
              <label class="form-label">Longitude Koordinat GPS <span class="required">*</span></label>
              <input v-model.number="locationForm.longitude" type="number" step="any" class="form-input font-mono" placeholder="106.914200" required />
            </div>
          </div>

          <div class="form-group">
            <button type="button" @click="getCurrentLocationCoords" class="btn-secondary btn-sm full-width">
              <span>📍 Ambil Titik Koordinat GPS Saat Ini</span>
            </button>
          </div>

          <!-- MAPPING PROGRAM PELATIHAN DI LOKASI INI -->
          <div class="form-group">
            <label class="form-label font-bold">Mapping Program Pelatihan di Lokasi Ini <span class="required">*</span></label>
            <div class="form-hint">Pilih produk keahlian apa saja yang diselenggarakan di fasilitas ini:</div>
            <div class="loc-checkboxes-grid">
              <label v-for="prod in store.products" :key="prod.id" class="loc-check-pill">
                <input 
                  type="checkbox" 
                  :value="prod.id" 
                  v-model="locationForm.productIds" 
                />
                <span>{{ prod.name }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fasilitas Pendukung</label>
            <input v-model="locationForm.facilities" type="text" class="form-input" placeholder="Contoh: Kolam Semi-Olympic, Ruang Bilas, Parkir Luas" />
          </div>

          <div class="form-group">
            <label class="form-label">URL Foto Banner Fasilitas</label>
            <input v-model="locationForm.image" type="text" class="form-input" placeholder="https://..." />
          </div>

          <div class="modal-footer" style="margin-top: 20px; padding: 0;">
            <button type="button" class="btn-secondary" @click="showLocationModal = false">Batal</button>
            <button type="submit" class="btn-primary">
              {{ isEditLocation ? 'Simpan Perubahan Lokasi' : 'Daftarkan Lokasi' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. MODAL TAMBAH & EDIT PAKET KURSUS -->
    <div v-if="showPackageModal" class="modal-backdrop" @click.self="showPackageModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditPackage ? 'Edit Paket Kursus' : 'Tambah Paket Kursus Baru' }}</h3>
          <button class="btn-close" @click="showPackageModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSubmitPackage" class="modal-body">
          <div class="form-group">
            <label class="form-label">Pilih Program Keahlian <span class="required">*</span></label>
            <select v-model="packageForm.productId" class="form-select" required>
              <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nama Paket <span class="required">*</span></label>
              <input v-model="packageForm.name" type="text" class="form-input" placeholder="Contoh: Small Group Class" required />
            </div>
            <div class="form-group">
              <label class="form-label">Biaya Paket (Rp) <span class="required">*</span></label>
              <input v-model.number="packageForm.price" type="number" class="form-input" placeholder="500000" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Rasio Peserta</label>
              <input v-model="packageForm.ratio" type="text" class="form-input" placeholder="2-3 anak / kelas" required />
            </div>
            <div class="form-group">
              <label class="form-label">Durasi per Sesi</label>
              <input v-model="packageForm.duration" type="text" class="form-input" placeholder="45 menit / sesi" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Jumlah Pertemuan</label>
              <input v-model="packageForm.meetings" type="text" class="form-input" placeholder="4x pertemuan" required />
            </div>
            <div class="form-group">
              <label class="form-label">Label Badge</label>
              <input v-model="packageForm.badge" type="text" class="form-input" placeholder="Rekomendasi Coach / Populer" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan / Fasilitas Tambahan</label>
            <textarea v-model="packageForm.description" class="form-textarea" rows="2" placeholder="Keunggulan paket ini..."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showPackageModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">
              {{ isEditPackage ? 'Simpan Perubahan' : 'Simpan Paket Baru' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. MODAL TAMBAH & EDIT INSTRUKTUR (COACH) -->
    <div v-if="showCoachModal" class="modal-backdrop" @click.self="showCoachModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditCoach ? 'Edit Data Instruktur' : 'Tambah Instruktur Baru' }}</h3>
          <button class="btn-close" @click="showCoachModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSubmitCoach" class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Lengkap & Gelar <span class="required">*</span></label>
            <input v-model="coachForm.name" type="text" class="form-input" placeholder="Contoh: Coach Bayu Pratama, S.Pd." required />
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Email Akun (Login ID) <span class="required">*</span></label>
              <input v-model="coachForm.email" type="email" class="form-input" placeholder="bayu@mineskills.id" required />
              <span class="form-hint">Otomatis memiliki login Coach (Password: <strong>123</strong>).</span>
            </div>
            <div class="form-group">
              <label class="form-label">Nomor WhatsApp <span class="required">*</span></label>
              <input v-model="coachForm.phone" type="tel" class="form-input" placeholder="0812xxxxxxxx" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Spesialisasi & Lisensi <span class="required">*</span></label>
            <input v-model="coachForm.specialty" type="text" class="form-input" placeholder="Contoh: Renang Prestasi & Water Safety (FINA Licensed)" required />
          </div>

          <!-- Upload Foto Coach -->
          <div class="form-group">
            <label class="form-label">Upload Foto Profil Instruktur</label>
            <div class="upload-field-box">
              <input type="file" @change="handleCoachImageUpload" accept="image/*" class="file-input" />
              <div v-if="coachUploading" class="upload-status">Mengunggah foto...</div>
              <div v-if="coachForm.avatar" class="upload-preview-wrap">
                <img :src="coachForm.avatar" alt="Preview Coach" class="preview-coach-img" />
                <span class="preview-path font-mono">{{ coachForm.avatar }}</span>
              </div>
            </div>
          </div>

          <!-- Mapping Program -->
          <div class="form-group">
            <label class="form-label">Program yang Diampu (Pilih satu atau lebih) <span class="required">*</span></label>
            <div class="product-checkboxes-grid">
              <label v-for="p in store.products" :key="p.id" class="prod-checkbox-label">
                <input type="checkbox" :value="p.id" v-model="coachForm.productIds" class="checkbox-input" />
                <span>{{ p.name }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Bio / Profil Singkat</label>
            <textarea v-model="coachForm.bio" class="form-textarea" rows="2" placeholder="Pengalaman melatih, latar belakang pendidikan, dsb."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showCoachModal = false" class="btn-secondary">Batal</button>
            <button type="submit" :disabled="coachUploading" class="btn-primary">
              <span v-if="coachUploading">Mengupload...</span>
              <span v-else>{{ isEditCoach ? 'Simpan Perubahan' : 'Daftarkan Instruktur' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. MODAL TAMBAH & EDIT SISWA -->
    <div v-if="showStudentModal" class="modal-backdrop" @click.self="showStudentModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru' }}</h3>
          <button class="btn-close" @click="showStudentModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSubmitStudent" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nama Lengkap Siswa <span class="required">*</span></label>
              <input v-model="studentForm.name" type="text" class="form-input" placeholder="Nama ananda" required />
            </div>
            <div class="form-group">
              <label class="form-label">Usia Siswa (Tahun) <span class="required">*</span></label>
              <input v-model.number="studentForm.age" type="number" class="form-input" placeholder="Contoh: 7" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nama Orang Tua / Wali <span class="required">*</span></label>
              <input v-model="studentForm.parentName" type="text" class="form-input" placeholder="Nama ayah / bunda" required />
            </div>
            <div class="form-group">
              <label class="form-label">Nomor WhatsApp Wali <span class="required">*</span></label>
              <input v-model="studentForm.phone" type="tel" class="form-input" placeholder="08xxxxxxxx" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Program Pilihan</label>
              <select v-model="studentForm.productId" class="form-select" required>
                <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Paket Kursus</label>
              <select v-model="studentForm.packageId" class="form-select" required>
                <option v-for="pkg in availablePackagesForSelectedProduct" :key="pkg.id" :value="pkg.id">
                  {{ pkg.name }} — {{ pkg.formattedPrice }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Tugaskan Instruktur (Coach)</label>
              <select v-model="studentForm.assignedCoachId" class="form-select">
                <option v-for="c in store.coaches" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah Sesi Mengikat</label>
              <input v-model.number="studentForm.mappingLockSessions" type="number" class="form-input" placeholder="4" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Catatan Tambahan / Alergi</label>
            <textarea v-model="studentForm.notes" class="form-textarea" rows="2" placeholder="Kondisi kesehatan atau preferensi jadwal..."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showStudentModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">
              {{ isEditStudent ? 'Simpan Perubahan Siswa' : 'Daftarkan Siswa' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 5. MODAL ASSIGN PELATIH KE SISWA (WITH SESSION LOCK) -->
    <div v-if="showAssignCoachModalFlag" class="modal-backdrop" @click.self="showAssignCoachModalFlag = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Penugasan Instruktur untuk Siswa</h3>
          <button class="btn-close" @click="showAssignCoachModalFlag = false">✕</button>
        </div>
        <form @submit.prevent="handleSaveCoachAssignment" class="modal-body">
          <div class="assign-student-info card-humanist">
            <span class="badge-chip teal">{{ activeStudentForAssignment?.productName || 'Program' }}</span>
            <h4 class="m-stu-name">{{ activeStudentForAssignment?.name }} ({{ activeStudentForAssignment?.age }} th)</h4>
            <span class="m-parent">Wali: {{ activeStudentForAssignment?.parentName }} • {{ activeStudentForAssignment?.phone }}</span>
          </div>

          <div class="form-group" style="margin-top: 16px;">
            <label class="form-label">Pilih Pelatih / Instruktur <span class="required">*</span></label>
            <select v-model="assignmentForm.coachId" class="form-select" required>
              <option value="" disabled>-- Pilih Instruktur Resmi --</option>
              <option v-for="c in store.coaches" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.specialty }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Durasi Ikatan Sesi Latihan</label>
            <select v-model.number="assignmentForm.lockSessions" class="form-select">
              <option :value="4">4 Sesi Mengikat (Paket Reguler Bulanan)</option>
              <option :value="8">8 Sesi Mengikat (Paket 2 Bulan)</option>
              <option :value="12">12 Sesi Mengikat (Paket Kuartal)</option>
            </select>
            <span class="form-hint">Pelatih ini akan mengajar secara konsisten selama jumlah sesi yang dipilih.</span>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showAssignCoachModalFlag = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Tugaskan Instruktur</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 6. MODAL KELOLA JADWAL & SESI LATIHAN SISWA (FULLY DYNAMIC) -->
    <div v-if="showSchedulesModalFlag" class="modal-backdrop" @click.self="showSchedulesModalFlag = false">
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <div>
            <span class="badge-chip teal">Kelola Sesi Dinamis</span>
            <h3 class="modal-title">Jadwal Sesi Latihan: {{ activeStudentForSchedules?.name }}</h3>
          </div>
          <button class="btn-close" @click="showSchedulesModalFlag = false">✕</button>
        </div>

        <div class="modal-body">
          <!-- Student Schedule Summary Bar -->
          <div class="schedules-student-summary card-humanist">
            <div class="summary-col">
              <span class="summary-lbl">Program:</span>
              <strong>{{ activeStudentForSchedules?.productName || 'Skill Renang' }}</strong>
            </div>
            <div class="summary-col">
              <span class="summary-lbl">Instruktur Terikat:</span>
              <strong>{{ activeStudentForSchedules?.assignedCoachName || 'Belum Ditugaskan' }}</strong>
            </div>
            <div class="summary-col">
              <span class="summary-lbl">Status Progres:</span>
              <strong class="text-green">{{ activeStudentCompletedCount }} dari {{ (activeStudentForSchedules?.memberSchedules || []).length }} Sesi Selesai ({{ activeStudentProgressPercent }}%)</strong>
            </div>
            <div class="summary-action">
              <button @click="openAddSessionForCurrentStudent()" class="btn-primary-xs">
                + Tambah Sesi Tambahan
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="student-session-progress-wrap">
            <div class="student-session-progress-bar" :style="{ width: activeStudentProgressPercent + '%' }"></div>
          </div>

          <!-- Sessions List -->
          <div class="schedules-list-wrap">
            <div 
              v-for="sch in (activeStudentForSchedules?.memberSchedules || [])" 
              :key="sch.id" 
              class="schedule-session-item card-humanist"
            >
              <div class="sch-left">
                <span class="badge-chip teal">Sesi {{ sch.sessionNo }}</span>
                <div class="sch-date-info">
                  <strong>{{ sch.day }}, {{ sch.date }}</strong>
                  <span class="font-mono text-xs">{{ sch.time }}</span>
                </div>
              </div>

              <div class="sch-mid">
                <div class="font-mono text-xs text-muted">{{ sch.location }}</div>
                <div class="text-xs">Coach: <strong>{{ sch.coachName }}</strong></div>
                <div v-if="sch.notes" class="sch-notes-snippet">
                  <em>"{{ sch.notes }}"</em>
                </div>
              </div>

              <div class="sch-status-col">
                <span 
                  class="badge-chip" 
                  :class="{
                    'green': sch.status === 'Selesai' || sch.status === 'Hadir',
                    'gold': sch.status === 'Terjadwal',
                    'teal': sch.status === 'Izin' || sch.status === 'Izin/Sakit',
                    'red': sch.status === 'Reschedule' || sch.status === 'Dibatalkan'
                  }"
                >
                  {{ sch.status }}
                </span>
              </div>

              <div class="sch-actions">
                <button 
                  @click="openAttendanceModal(sch)" 
                  class="btn-primary-xs"
                >
                  Presensi & Nilai
                </button>
                <button 
                  @click="openRescheduleModal(sch)" 
                  class="btn-secondary-xs"
                >
                  Reschedule
                </button>
                <button 
                  @click="handleDeleteSchedule(sch)" 
                  class="btn-danger-xs"
                  title="Hapus Sesi"
                >
                  ✕
                </button>
              </div>
            </div>

            <div v-if="(!activeStudentForSchedules?.memberSchedules || activeStudentForSchedules.memberSchedules.length === 0)" class="text-center p-6 text-muted">
              Belum ada plotting sesi untuk siswa ini. Silakan klik tombol "+ Tambah Sesi Tambahan".
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="showSchedulesModalFlag = false" class="btn-secondary">Tutup</button>
        </div>
      </div>
    </div>

    <!-- 7. MODAL PLOTTING SESI LATIHAN BARU (FULL DYNAMIC) -->
    <div v-if="showCreateScheduleModal" class="modal-backdrop" @click.self="showCreateScheduleModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Plotting Sesi Latihan Baru</h3>
          <button class="btn-close" @click="showCreateScheduleModal = false">✕</button>
        </div>
        <form @submit.prevent="handleCreateSchedule" class="modal-body">
          <div class="form-group">
            <label class="form-label">Pilih Siswa <span class="required">*</span></label>
            <select v-model="createScheduleForm.studentId" @change="onStudentSelectedInScheduleForm" class="form-select" required>
              <option value="" disabled>-- Pilih Siswa Terdaftar --</option>
              <option v-for="stu in store.students" :key="stu.id" :value="stu.id">
                {{ stu.name }} ({{ stu.productName || 'Program' }}) — Wali: {{ stu.parentName }}
              </option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Sesi Ke- <span class="required">*</span></label>
              <input v-model.number="createScheduleForm.sessionNo" type="number" min="1" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Hari Pelaksanaan <span class="required">*</span></label>
              <select v-model="createScheduleForm.day" class="form-select" required>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Tanggal Pelaksanaan <span class="required">*</span></label>
              <input v-model="createScheduleForm.date" type="date" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Slot Waktu Latihan <span class="required">*</span></label>
              <select v-model="createScheduleForm.time" class="form-select" required>
                <option value="08.00 - 08.45 WIB">08.00 - 08.45 WIB (Pagi 1)</option>
                <option value="09.00 - 09.45 WIB">09.00 - 09.45 WIB (Pagi 2)</option>
                <option value="10.00 - 10.45 WIB">10.00 - 10.45 WIB (Pagi 3)</option>
                <option value="15.30 - 16.15 WIB">15.30 - 16.15 WIB (Sore 1)</option>
                <option value="16.30 - 17.15 WIB">16.30 - 17.15 WIB (Sore 2)</option>
                <option value="17.15 - 18.00 WIB">17.15 - 18.00 WIB (Sore 3)</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Instruktur Pengampu <span class="required">*</span></label>
              <select v-model="createScheduleForm.coachName" class="form-select" required>
                <option v-for="c in store.coaches" :key="c.id" :value="c.name">
                  {{ c.name }} ({{ c.specialty }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status Awal</label>
              <select v-model="createScheduleForm.status" class="form-select">
                <option value="Terjadwal">Terjadwal</option>
                <option value="Selesai">Hadir / Selesai</option>
                <option value="Izin">Izin / Sakit</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi Fasilitas Latihan <span class="required">*</span></label>
            <select v-model="createScheduleForm.location" class="form-select" required>
              <option v-for="loc in store.locations" :key="loc.id" :value="loc.name">
                {{ loc.name }} ({{ loc.area }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Target Materi / Catatan Sesi</label>
            <textarea v-model="createScheduleForm.notes" class="form-textarea" rows="2" placeholder="Fokus latihan atau target capaian..."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showCreateScheduleModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Simpan Plotting Sesi</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 8. MODAL PRESENSI & EVALUASI KEMAMPUAN SESI -->
    <div v-if="showAttendanceModal" class="modal-backdrop" @click.self="showAttendanceModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Presensi & Catatan Evaluasi Sesi</h3>
          <button class="btn-close" @click="showAttendanceModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSaveAttendance" class="modal-body">
          <div class="attendance-summary-card card-humanist">
            <div style="font-size: 13px; color: var(--text-muted);">
              Siswa: <strong>{{ activeScheduleForAttendance?.studentName }}</strong> • Sesi {{ activeScheduleForAttendance?.sessionNo }}
            </div>
            <div style="font-size: 12px; color: var(--text-subtle); margin-top: 2px;">
              Jadwal: {{ activeScheduleForAttendance?.day }}, {{ activeScheduleForAttendance?.date }} ({{ activeScheduleForAttendance?.time }})
            </div>
          </div>

          <div class="form-group" style="margin-top: 16px;">
            <label class="form-label">Status Kehadiran <span class="required">*</span></label>
            <select v-model="attendanceForm.status" class="form-select" required>
              <option value="Selesai">Hadir & Selesai Latihan</option>
              <option value="Izin">Izin / Sakit</option>
              <option value="Alpha">Tidak Hadir Tanpa Keterangan</option>
              <option value="Terjadwal">Kembalikan ke Terjadwal</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Capaian / Penilaian Pelatih</label>
            <select v-model.number="attendanceForm.rating" class="form-select">
              <option :value="5">⭐⭐⭐⭐⭐ Sangat Baik (Menguasai Teknik Sempurna)</option>
              <option :value="4">⭐⭐⭐⭐ Baik (Progres Sangat Positif)</option>
              <option :value="3">⭐⭐⭐ Cukup (Mulai Memahami Gerakan)</option>
              <option :value="2">⭐⭐ Butuh Latihan Tambahan</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Catatan Kemampuan & Evaluasi untuk Orang Tua</label>
            <textarea 
              v-model="attendanceForm.notes" 
              class="form-textarea" 
              rows="3" 
              placeholder="Contoh: Ananda sudah berani mengambil napas dan meluncur sejauh 4 meter dengan rileks..."
            ></textarea>
            <span class="form-hint">Catatan ini akan langsung tampil di Raport Digital Portal Siswa/Wali.</span>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showAttendanceModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Simpan Presensi & Evaluasi</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 9. MODAL RESCHEDULE SESI LATIHAN -->
    <div v-if="showRescheduleModal" class="modal-backdrop" @click.self="showRescheduleModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Reschedule Sesi Latihan</h3>
          <button class="btn-close" @click="showRescheduleModal = false">✕</button>
        </div>
        <form @submit.prevent="handleSaveReschedule" class="modal-body">
          <div class="attendance-summary-card card-humanist">
            <div style="font-size: 13px; color: var(--text-muted);">
              Siswa: <strong>{{ activeScheduleForReschedule?.studentName }}</strong> (Sesi {{ activeScheduleForReschedule?.sessionNo }})
            </div>
            <div style="font-size: 12px; color: var(--text-subtle); margin-top: 2px;">
              Jadwal Semula: {{ activeScheduleForReschedule?.day }}, {{ activeScheduleForReschedule?.date }} ({{ activeScheduleForReschedule?.time }})
            </div>
          </div>

          <div class="form-grid" style="margin-top: 16px;">
            <div class="form-group">
              <label class="form-label">Hari Baru <span class="required">*</span></label>
              <select v-model="rescheduleForm.day" class="form-select" required>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Baru <span class="required">*</span></label>
              <input v-model="rescheduleForm.date" type="date" class="form-input" required />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Slot Waktu Baru <span class="required">*</span></label>
              <select v-model="rescheduleForm.time" class="form-select" required>
                <option value="08.00 - 08.45 WIB">08.00 - 08.45 WIB (Pagi 1)</option>
                <option value="09.00 - 09.45 WIB">09.00 - 09.45 WIB (Pagi 2)</option>
                <option value="10.00 - 10.45 WIB">10.00 - 10.45 WIB (Pagi 3)</option>
                <option value="15.30 - 16.15 WIB">15.30 - 16.15 WIB (Sore 1)</option>
                <option value="16.30 - 17.15 WIB">16.30 - 17.15 WIB (Sore 2)</option>
                <option value="17.15 - 18.00 WIB">17.15 - 18.00 WIB (Sore 3)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Instruktur (Bisa Pengganti)</label>
              <select v-model="rescheduleForm.coachName" class="form-select" required>
                <option v-for="c in store.coaches" :key="c.id" :value="c.name">
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi Fasilitas Latihan</label>
            <select v-model="rescheduleForm.location" class="form-select" required>
              <option v-for="loc in store.locations" :key="loc.id" :value="loc.name">
                {{ loc.name }} ({{ loc.area }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Alasan Reschedule <span class="required">*</span></label>
            <textarea 
              v-model="rescheduleForm.reason" 
              class="form-textarea" 
              rows="2" 
              placeholder="Contoh: Siswa izin sakit demam, direschedule atas persetujuan wali..."
              required
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showRescheduleModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Konfirmasi Reschedule</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 8. MODAL: TAMBAH / EDIT REKENING BANK (CRUD) -->
    <div v-if="showBankModal" class="modal-backdrop" @click.self="showBankModal = false">
      <div class="modal-dialog modal-md">
        <div class="modal-header">
          <div class="modal-header-info">
            <span class="badge-chip teal">Keuangan & Billing</span>
            <h3 class="modal-title">{{ bankModalMode === 'create' ? 'Tambah Rekening Bank Baru' : 'Edit Rekening Bank' }}</h3>
          </div>
          <button class="btn-close" @click="showBankModal = false">✕</button>
        </div>

        <form @submit.prevent="saveBankAccount">
          <div class="modal-body">
            <!-- Preset Bank Quick Buttons -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Pilihan Cepat Bank Populer</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                <button 
                  v-for="bname in bankPresets" 
                  :key="bname"
                  type="button"
                  @click="selectBankPreset(bname)"
                  class="preset-bank-chip"
                  :class="{ active: bankForm.bankName === bname }"
                >
                  {{ bname.replace(/Bank | \(.*\)/g, '') }}
                </button>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Nama Bank Lengkap *</label>
              <input v-model="bankForm.bankName" type="text" class="form-input" placeholder="Contoh: Bank Central Asia (BCA)" required />
            </div>

            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Nomor Rekening *</label>
              <input v-model="bankForm.accountNumber" type="text" class="form-input font-mono" placeholder="Contoh: 8420991823" required />
            </div>

            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Atas Nama (Pemilik Rekening) *</label>
              <input v-model="bankForm.accountHolder" type="text" class="form-input" placeholder="Contoh: YAYASAN MINE SKILLS INDONESIA" required />
            </div>

            <div class="form-group">
              <label class="form-label">Status & Label Rekening</label>
              <select v-model="bankForm.badge" class="form-select">
                <option value="Verifikasi Otomatis">Verifikasi Otomatis</option>
                <option value="Rekening Utama">Rekening Utama</option>
                <option value="Cek Manual Admin">Cek Manual Admin</option>
                <option value="Rekening Operasional">Rekening Operasional</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showBankModal = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">
              {{ bankModalMode === 'create' ? 'Simpan Rekening Baru' : 'Perbarui Rekening' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { store, actions } from '../data/store.js';
import { uploadImage } from '../data/api.js';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { convertQRIS } from '../utils/qris.js';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'm_overview'
  }
});

defineEmits(['change-menu']);

const noticeMessage = ref('');
function showNotice(msg) {
  noticeMessage.value = msg;
  setTimeout(() => { noticeMessage.value = ''; }, 3500);
}

// -------------------------------------------------------------
// STATS & AGGREGATIONS
// -------------------------------------------------------------
const paidTransactionsCount = computed(() => {
  return (store.transactions || []).filter(t => t.status?.includes('Lunas')).length;
});

const totalRevenueFormatted = computed(() => {
  const sum = (store.transactions || [])
    .filter(t => t.status?.includes('Lunas'))
    .reduce((acc, it) => acc + (it.amount || 0), 0);
  return `Rp ${sum.toLocaleString('id-ID')}`;
});

function getCoachesForProduct(productId) {
  return (store.coaches || []).filter(c => Array.isArray(c.productIds) && c.productIds.includes(productId));
}

function getLocationsForProduct(productId) {
  return (store.locations || []).filter(l => {
    const locProds = Array.isArray(l.productIds) ? l.productIds : [];
    const prodLocs = store.products.find(p => p.id === productId)?.locationIds || [];
    return locProds.includes(productId) || prodLocs.includes(l.id);
  });
}

// -------------------------------------------------------------
// COACH ATTENDANCE MONITORING (m_attendance)
// -------------------------------------------------------------
const attFilterCoach = ref('all');
const attFilterStatus = ref('all');
const attFilterLocation = ref('all');
const attSearchQuery = ref('');
const selectedAttendanceForMap = ref(null);
const isAttMapModalOpen = ref(false);

const totalAttendances = computed(() => (store.coachAttendances || []).length);

const validGeofenceAttendances = computed(() => {
  return (store.coachAttendances || []).filter(a => (a.distanceFromVenue || 0) <= 250).length;
});

const coachesOnDutyToday = computed(() => {
  const names = new Set((store.coachAttendances || []).map(a => a.coachName));
  return names.size;
});

const geofenceCompliancePct = computed(() => {
  if (!totalAttendances.value) return 100;
  return Math.round((validGeofenceAttendances.value / totalAttendances.value) * 100);
});

const filteredCoachAttendances = computed(() => {
  let list = store.coachAttendances || [];

  if (attFilterCoach.value !== 'all') {
    list = list.filter(a => a.coachName === attFilterCoach.value);
  }

  if (attFilterStatus.value === 'valid') {
    list = list.filter(a => (a.distanceFromVenue || 0) <= (a.targetRadius || 250));
  } else if (attFilterStatus.value === 'invalid') {
    list = list.filter(a => (a.distanceFromVenue || 0) > (a.targetRadius || 250));
  }

  if (attFilterLocation.value !== 'all') {
    list = list.filter(a => a.locationName === attFilterLocation.value || a.locationId === attFilterLocation.value);
  }

  if (attSearchQuery.value.trim()) {
    const q = attSearchQuery.value.toLowerCase();
    list = list.filter(a => {
      return (a.coachName && a.coachName.toLowerCase().includes(q)) ||
             (a.sessionType && a.sessionType.toLowerCase().includes(q)) ||
             (a.locationName && a.locationName.toLowerCase().includes(q)) ||
             (a.notes && a.notes.toLowerCase().includes(q));
    });
  }

  return list;
});

function getMiniMapEmbedUrl(lat, lng, delta = 0.003) {
  const nLat = parseFloat(lat) || -6.2847;
  const nLng = parseFloat(lng) || 106.9142;
  const bbox = `${nLng - delta}%2C${nLat - delta}%2C${nLng + delta}%2C${nLat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${nLat}%2C${nLng}`;
}

function openAttendanceMapModal(att) {
  selectedAttendanceForMap.value = att;
  isAttMapModalOpen.value = true;
}

function closeAttendanceMapModal() {
  selectedAttendanceForMap.value = null;
  isAttMapModalOpen.value = false;
}

async function handleVerifyAttendance(id) {
  await actions.verifyCoachAttendance(id);
  showNotice('Presensi coach berhasil diverifikasi oleh manajemen!');
  if (selectedAttendanceForMap.value && selectedAttendanceForMap.value.id === id) {
    selectedAttendanceForMap.value.isVerified = true;
    selectedAttendanceForMap.value.verifiedAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  }
}

// -------------------------------------------------------------
// PRODUCT CRUD MODAL
// -------------------------------------------------------------
const showProductModal = ref(false);
const isEditProduct = ref(false);
const productUploading = ref(false);
const editingProductId = ref(null);
const productForm = ref({
  name: '',
  category: 'Olahraga & Ketangkasan',
  targetAge: 'Usia 5 - 15 Tahun',
  shortDesc: '',
  heroImage: '/images/swimming-hero.jpg',
  locationIds: [],
  levels: [
    { levelNumber: 1, title: 'Level Dasar', focus: 'Pengenalan & Teori Dasar', challenge: 'Tantangan Dasar' }
  ]
});

function openAddProductModal() {
  isEditProduct.value = false;
  editingProductId.value = null;
  productForm.value = {
    name: '',
    category: 'Olahraga & Ketangkasan',
    targetAge: 'Usia 5 - 15 Tahun',
    shortDesc: '',
    heroImage: '/images/swimming-hero.jpg',
    locationIds: (store.locations || []).map(l => l.id),
    levels: [
      { levelNumber: 1, title: 'Level 1: Dasar', focus: 'Pengenalan & Teori Dasar', challenge: 'Uji Teori & Praktik Awal' },
      { levelNumber: 2, title: 'Level 2: Menengah', focus: 'Penguasaan Teknik Inti', challenge: 'Simulasi Mandiri' },
      { levelNumber: 3, title: 'Level 3: Mahir', focus: 'Aplikasi & Sertifikasi', challenge: 'Ujian Kelulusan' }
    ]
  };
  showProductModal.value = true;
}

function openEditProductModal(prod) {
  isEditProduct.value = true;
  editingProductId.value = prod.id;
  const initialLevels = Array.isArray(prod.levels) && prod.levels.length > 0
    ? JSON.parse(JSON.stringify(prod.levels))
    : [
        { levelNumber: 1, title: 'Level 1', focus: '', challenge: '' }
      ];
  productForm.value = {
    name: prod.name,
    category: prod.category || 'Olahraga & Ketangkasan',
    targetAge: prod.targetAge || 'Semua Usia',
    shortDesc: prod.shortDesc || '',
    heroImage: prod.heroImage || '/images/swimming-hero.jpg',
    locationIds: Array.isArray(prod.locationIds) ? [...prod.locationIds] : [],
    levels: initialLevels
  };
  showProductModal.value = true;
}

function addCurriculumLevel() {
  if (!productForm.value.levels) productForm.value.levels = [];
  const nextNum = productForm.value.levels.length + 1;
  productForm.value.levels.push({
    levelNumber: nextNum,
    title: `Level ${nextNum}`,
    focus: '',
    challenge: ''
  });
}

function removeCurriculumLevel(index) {
  if (productForm.value.levels.length <= 1) {
    alert('Minimal harus ada 1 level kurikulum.');
    return;
  }
  productForm.value.levels.splice(index, 1);
  productForm.value.levels.forEach((lvl, idx) => {
    lvl.levelNumber = idx + 1;
  });
}

async function handleProductImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    productUploading.value = true;
    const url = await actions.uploadImage(file, 'products');
    productForm.value.heroImage = url;
    showNotice('Gambar program berhasil diupload!');
  } catch (err) {
    alert(err.message || 'Gagal upload gambar');
  } finally {
    productUploading.value = false;
  }
}

async function handleSubmitProduct() {
  try {
    if (isEditProduct.value && editingProductId.value) {
      await actions.updateProduct(editingProductId.value, productForm.value);
      showNotice('Program pelatihan berhasil diperbarui!');
    } else {
      await actions.addProduct(productForm.value);
      showNotice('Program pelatihan baru berhasil disimpan!');
    }
    showProductModal.value = false;
  } catch (err) {
    alert(err.message || 'Gagal menyimpan program');
  }
}

async function handleDeleteProduct(id) {
  if (confirm('Yakin ingin menghapus program pelatihan ini beserta seluruh paketnya?')) {
    await actions.deleteProduct(id);
    showNotice('Program pelatihan berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// LOCATION CRUD MODAL (m_locations)
// -------------------------------------------------------------
const showLocationModal = ref(false);
const isEditLocation = ref(false);
const editingLocationId = ref(null);
const locationForm = ref({
  name: '',
  area: '',
  radiusMeters: 250,
  address: '',
  latitude: -6.2847,
  longitude: 106.9142,
  productIds: [],
  facilities: '',
  image: '',
  isActive: true
});

function openAddLocationModal() {
  isEditLocation.value = false;
  editingLocationId.value = null;
  locationForm.value = {
    name: '',
    area: '',
    radiusMeters: 250,
    address: '',
    latitude: -6.2847,
    longitude: 106.9142,
    productIds: (store.products || []).map(p => p.id),
    facilities: '',
    image: '',
    isActive: true
  };
  showLocationModal.value = true;
}

function openEditLocationModal(loc) {
  isEditLocation.value = true;
  editingLocationId.value = loc.id;
  locationForm.value = {
    name: loc.name || '',
    area: loc.area || '',
    radiusMeters: loc.radiusMeters || 250,
    address: loc.address || '',
    latitude: loc.latitude || -6.2847,
    longitude: loc.longitude || 106.9142,
    productIds: Array.isArray(loc.productIds) ? [...loc.productIds] : [],
    facilities: loc.facilities || '',
    image: loc.image || '',
    isActive: loc.isActive !== false
  };
  showLocationModal.value = true;
}

function getCurrentLocationCoords() {
  if (!navigator.geolocation) {
    alert('Browser tidak mendukung geolokasi GPS.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locationForm.value.latitude = parseFloat(pos.coords.latitude.toFixed(6));
      locationForm.value.longitude = parseFloat(pos.coords.longitude.toFixed(6));
      showNotice(`Koordinat GPS didapatkan: ${locationForm.value.latitude}, ${locationForm.value.longitude}`);
    },
    (err) => {
      alert(`Gagal mengambil titik GPS: ${err.message}`);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function handleSubmitLocation() {
  try {
    if (isEditLocation.value && editingLocationId.value) {
      await actions.updateLocation(editingLocationId.value, locationForm.value);
      showNotice('Data fasilitas & lokasi latihan berhasil diperbarui!');
    } else {
      await actions.addLocation(locationForm.value);
      showNotice('Lokasi latihan baru berhasil didaftarkan!');
    }
    showLocationModal.value = false;
  } catch (err) {
    alert(err.message || 'Gagal menyimpan data lokasi');
  }
}

async function handleDeleteLocation(id) {
  if (confirm('Yakin ingin menghapus data lokasi fasilitas ini?')) {
    await actions.deleteLocation(id);
    showNotice('Data lokasi berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// WEBSITE & BRAND CMS (m_website)
// -------------------------------------------------------------
const websiteBrandForm = ref({
  name: store.brand?.name || 'mine.skills',
  umbrellaTagline: store.brand?.umbrellaTagline || 'Beyond Skills, Shaping Future Achievers',
  callCenter: store.brand?.callCenter || '085286274726',
  officialEmail: store.brand?.officialEmail || 'halo@mineskills.id',
  addressFull: store.brand?.addressFull || 'Graha Kresna Pratama, Pondok Gede, Kota Bekasi, Jawa Barat 17411',
  operatingHours: store.brand?.operatingHours || 'Setiap Hari: 07.30 - 18.00 WIB'
});

const websiteHeroForm = ref({
  badgeText: store.hero?.badgeText || 'Pusat Kursus & Pelatihan Keahlian Anak Terintegrasi',
  headline: store.hero?.headline || 'Kembangkan Potensi & Bakat Terbaik Sejak Dini',
  subheadline: store.hero?.subheadline || 'Program terpadu renang prestasi, otomotif mengemudi, dan seni tari dengan pelatih berpengalaman dan kurikulum bertahap.',
  primaryCta: store.hero?.primaryCta || 'Daftar Kelas Sekarang'
});

// Keep form in sync if store.brand or store.hero updates
watch(
  () => store.brand,
  (b) => {
    if (b) {
      if (b.name) websiteBrandForm.value.name = b.name;
      if (b.umbrellaTagline) websiteBrandForm.value.umbrellaTagline = b.umbrellaTagline;
      if (b.callCenter) websiteBrandForm.value.callCenter = b.callCenter;
      if (b.officialEmail) websiteBrandForm.value.officialEmail = b.officialEmail;
      if (b.addressFull) websiteBrandForm.value.addressFull = b.addressFull;
      if (b.operatingHours) websiteBrandForm.value.operatingHours = b.operatingHours;
    }
  },
  { deep: true }
);

watch(
  () => store.hero,
  (h) => {
    if (h) {
      if (h.badgeText) websiteHeroForm.value.badgeText = h.badgeText;
      if (h.headline) websiteHeroForm.value.headline = h.headline;
      if (h.subheadline) websiteHeroForm.value.subheadline = h.subheadline;
      if (h.primaryCta) websiteHeroForm.value.primaryCta = h.primaryCta;
    }
  },
  { deep: true }
);

async function handleSaveWebsiteConfig() {
  try {
    await actions.updateBrand({
      name: websiteBrandForm.value.name,
      umbrellaTagline: websiteBrandForm.value.umbrellaTagline,
      callCenter: websiteBrandForm.value.callCenter,
      callCenterDisplay: websiteBrandForm.value.callCenter,
      officialEmail: websiteBrandForm.value.officialEmail,
      addressFull: websiteBrandForm.value.addressFull,
      operatingHours: websiteBrandForm.value.operatingHours
    });
    await actions.updateHero({
      badgeText: websiteHeroForm.value.badgeText,
      headline: websiteHeroForm.value.headline,
      subheadline: websiteHeroForm.value.subheadline,
      primaryCta: websiteHeroForm.value.primaryCta
    });
    showNotice('Pengaturan profil brand dan konten website berhasil disimpan!');
  } catch (err) {
    alert(err.message || 'Gagal menyimpan konfigurasi website');
  }
}

// -------------------------------------------------------------
// PACKAGE CRUD MODAL
// -------------------------------------------------------------
const showPackageModal = ref(false);
const isEditPackage = ref(false);
const editingPackageId = ref(null);
const selectedProductFilter = ref('');
const packageForm = ref({
  productId: store.products[0]?.id || 'prod_swimming',
  productName: 'Skill Renang',
  name: '',
  ratio: '3-4 anak / kelas',
  price: 450000,
  duration: '45 menit / sesi',
  meetings: '4x pertemuan',
  badge: 'Pilihan Utama',
  description: ''
});

const filteredPackages = computed(() => {
  if (!selectedProductFilter.value) return store.packages;
  return store.packages.filter(p => p.productId === selectedProductFilter.value);
});

function openAddPackageModal() {
  isEditPackage.value = false;
  editingPackageId.value = null;
  packageForm.value = {
    productId: store.products[0]?.id || 'prod_swimming',
    productName: store.products[0]?.name || 'Skill Renang',
    name: '',
    ratio: '3-4 anak / kelas',
    price: 450000,
    duration: '45 menit / sesi',
    meetings: '4x pertemuan',
    badge: 'Pilihan Utama',
    description: ''
  };
  showPackageModal.value = true;
}

function openEditPackageModal(pkg) {
  isEditPackage.value = true;
  editingPackageId.value = pkg.id;
  packageForm.value = {
    productId: pkg.productId,
    productName: pkg.productName,
    name: pkg.name,
    ratio: pkg.ratio,
    price: pkg.price,
    duration: pkg.duration,
    meetings: pkg.meetings,
    badge: pkg.badge || '',
    description: pkg.description || ''
  };
  showPackageModal.value = true;
}

async function handleSubmitPackage() {
  try {
    const prod = store.products.find(p => p.id === packageForm.value.productId);
    if (prod) packageForm.value.productName = prod.name;
    packageForm.value.formattedPrice = `Rp ${Number(packageForm.value.price).toLocaleString('id-ID')}`;

    if (isEditPackage.value && editingPackageId.value) {
      await actions.updatePackage(editingPackageId.value, packageForm.value);
      showNotice('Paket kursus berhasil diperbarui!');
    } else {
      await actions.addPackage(packageForm.value);
      showNotice('Paket kursus baru berhasil ditambahkan!');
    }
    showPackageModal.value = false;
  } catch (err) {
    alert(err.message || 'Gagal menyimpan paket');
  }
}

async function handleDeletePackage(id) {
  if (confirm('Hapus paket kursus ini?')) {
    await actions.deletePackage(id);
    showNotice('Paket kursus berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// COACH CRUD MODAL
// -------------------------------------------------------------
const showCoachModal = ref(false);
const isEditCoach = ref(false);
const editingCoachId = ref(null);
const coachUploading = ref(false);
const coachForm = ref({
  name: '',
  email: '',
  phone: '',
  specialty: '',
  bio: '',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
  productIds: []
});

function openAddCoachModal() {
  isEditCoach.value = false;
  editingCoachId.value = null;
  coachForm.value = {
    name: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    productIds: store.products.length > 0 ? [store.products[0].id] : []
  };
  showCoachModal.value = true;
}

function openEditCoachModal(coach) {
  isEditCoach.value = true;
  editingCoachId.value = coach.id;
  coachForm.value = {
    name: coach.name,
    email: coach.email,
    phone: coach.phone,
    specialty: coach.specialty,
    bio: coach.bio || '',
    avatar: coach.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    productIds: Array.isArray(coach.productIds) ? [...coach.productIds] : []
  };
  showCoachModal.value = true;
}

async function handleCoachImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    coachUploading.value = true;
    const url = await actions.uploadImage(file, 'coaches');
    coachForm.value.avatar = url;
    showNotice('Foto instruktur berhasil diunggah!');
  } catch (err) {
    alert(err.message || 'Gagal upload foto coach');
  } finally {
    coachUploading.value = false;
  }
}

async function handleSubmitCoach() {
  try {
    if (isEditCoach.value && editingCoachId.value) {
      await actions.updateCoach(editingCoachId.value, coachForm.value);
      showNotice('Data instruktur berhasil diperbarui!');
    } else {
      await actions.addCoach(coachForm.value);
      showNotice('Instruktur baru berhasil disimpan dan akun user otomatis dibuat (Password: 123)!');
    }
    showCoachModal.value = false;
  } catch (err) {
    alert(err.message || 'Gagal menyimpan instruktur');
  }
}

async function handleDeleteCoach(id) {
  if (confirm('Hapus instruktur ini? Akun login terkait juga akan dinonaktifkan.')) {
    await actions.deleteCoach(id);
    showNotice('Instruktur berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// STUDENT & GUARDIAN CRUD
// -------------------------------------------------------------
const showStudentModal = ref(false);
const isEditStudent = ref(false);
const editingStudentId = ref(null);
const studentSearchQuery = ref('');
const studentForm = ref({
  name: '',
  age: 7,
  parentName: '',
  phone: '',
  email: '',
  productId: 'prod_swimming',
  packageId: 'pkg_swim_group',
  assignedCoachId: '',
  mappingLockSessions: 4,
  notes: ''
});

const availablePackagesForSelectedProduct = computed(() => {
  const prodId = studentForm.value.productId;
  return (store.packages || []).filter(p => p.productId === prodId);
});

const filteredStudents = computed(() => {
  const q = studentSearchQuery.value.trim().toLowerCase();
  if (!q) return store.students;
  return store.students.filter(s => 
    s.name?.toLowerCase().includes(q) ||
    s.parentName?.toLowerCase().includes(q) ||
    s.phone?.includes(q) ||
    s.productName?.toLowerCase().includes(q)
  );
});

function openAddStudentModal() {
  isEditStudent.value = false;
  editingStudentId.value = null;
  studentForm.value = {
    name: '',
    age: 7,
    parentName: '',
    phone: '',
    email: '',
    productId: store.products[0]?.id || 'prod_swimming',
    packageId: store.packages[0]?.id || 'pkg_swim_group',
    assignedCoachId: store.coaches[0]?.id || '',
    mappingLockSessions: 4,
    notes: ''
  };
  showStudentModal.value = true;
}

function openEditStudentModal(stu) {
  isEditStudent.value = true;
  editingStudentId.value = stu.id;
  studentForm.value = {
    name: stu.name,
    age: stu.age,
    parentName: stu.parentName,
    phone: stu.phone,
    email: stu.email || '',
    productId: stu.productId || 'prod_swimming',
    packageId: stu.packageId || 'pkg_swim_group',
    assignedCoachId: stu.assignedCoachId || '',
    mappingLockSessions: stu.mappingLockSessions || 4,
    notes: stu.notes || ''
  };
  showStudentModal.value = true;
}

async function handleSubmitStudent() {
  try {
    if (isEditStudent.value && editingStudentId.value) {
      await actions.updateStudent(editingStudentId.value, studentForm.value);
      showNotice('Data siswa berhasil diperbarui!');
    } else {
      await actions.addStudent(studentForm.value);
      showNotice('Siswa baru berhasil didaftarkan dan 4 jadwal sesi otomatis digenerate!');
    }
    showStudentModal.value = false;
  } catch (err) {
    alert(err.message || 'Gagal menyimpan siswa');
  }
}

async function handleDeleteStudent(id) {
  if (confirm('Yakin ingin menghapus data siswa ini beserta jadwal sesinya?')) {
    await actions.deleteStudent(id);
    showNotice('Data siswa berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// ASSIGN COACH MODAL (STUDENT-COACH MAPPING & LOCK SESSIONS)
// -------------------------------------------------------------
const showAssignCoachModalFlag = ref(false);
const activeStudentForAssignment = ref(null);
const assignmentForm = ref({
  coachId: '',
  lockSessions: 4
});

function openAssignCoachModal(stu) {
  activeStudentForAssignment.value = stu;
  assignmentForm.value = {
    coachId: stu.assignedCoachId || store.coaches[0]?.id || '',
    lockSessions: stu.mappingLockSessions || 4
  };
  showAssignCoachModalFlag.value = true;
}

async function handleSaveCoachAssignment() {
  if (!activeStudentForAssignment.value || !assignmentForm.value.coachId) return;
  await actions.assignCoachToStudent(
    activeStudentForAssignment.value.id,
    assignmentForm.value.coachId,
    assignmentForm.value.lockSessions
  );
  showAssignCoachModalFlag.value = false;
  showNotice(`Pelatih berhasil di-assign dan mengikat selama ${assignmentForm.value.lockSessions} sesi!`);
}

// -------------------------------------------------------------
// DYNAMIC SCHEDULES & SESSIONS MANAGEMENT
// -------------------------------------------------------------
const showSchedulesModalFlag = ref(false);
const activeStudentForSchedules = ref(null);

// Filters for Schedules Table
const selectedCoachScheduleFilter = ref('');
const selectedProgramScheduleFilter = ref('');
const selectedStatusScheduleFilter = ref('');
const scheduleSearchQuery = ref('');

// Computed list of all schedules across all students
const allSchedulesList = computed(() => {
  const list = [];
  (store.students || []).forEach(stu => {
    (stu.memberSchedules || []).forEach(sch => {
      list.push({
        ...sch,
        studentId: stu.id,
        studentName: stu.name,
        studentAge: stu.age,
        parentName: stu.parentName,
        phone: stu.phone,
        programName: stu.productName || stu.program || 'Skill Renang'
      });
    });
  });
  return list;
});

const countCompletedSchedules = computed(() => {
  return allSchedulesList.value.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
});

const countUpcomingSchedules = computed(() => {
  return allSchedulesList.value.filter(s => s.status === 'Terjadwal').length;
});

const countRescheduledSchedules = computed(() => {
  return allSchedulesList.value.filter(s => s.status === 'Reschedule' || s.status === 'Izin' || s.status?.includes('Sakit')).length;
});

const filteredSchedulesList = computed(() => {
  let list = allSchedulesList.value;
  if (selectedCoachScheduleFilter.value) {
    list = list.filter(s => s.coachName === selectedCoachScheduleFilter.value);
  }
  if (selectedProgramScheduleFilter.value) {
    list = list.filter(s => s.programName === selectedProgramScheduleFilter.value);
  }
  if (selectedStatusScheduleFilter.value) {
    list = list.filter(s => {
      if (selectedStatusScheduleFilter.value === 'Selesai') return s.status === 'Selesai' || s.status === 'Hadir';
      if (selectedStatusScheduleFilter.value === 'Izin') return s.status === 'Izin' || s.status?.includes('Sakit');
      return s.status === selectedStatusScheduleFilter.value;
    });
  }
  if (scheduleSearchQuery.value.trim()) {
    const q = scheduleSearchQuery.value.trim().toLowerCase();
    list = list.filter(s => 
      s.studentName?.toLowerCase().includes(q) ||
      s.parentName?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.location?.toLowerCase().includes(q) ||
      s.programName?.toLowerCase().includes(q)
    );
  }
  return list;
});

function openStudentSchedulesModal(stu) {
  activeStudentForSchedules.value = stu;
  showSchedulesModalFlag.value = true;
}

const activeStudentCompletedCount = computed(() => {
  if (!activeStudentForSchedules.value) return 0;
  const list = activeStudentForSchedules.value.memberSchedules || [];
  return list.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
});

const activeStudentProgressPercent = computed(() => {
  if (!activeStudentForSchedules.value) return 0;
  const list = activeStudentForSchedules.value.memberSchedules || [];
  if (list.length === 0) return 0;
  return Math.round((activeStudentCompletedCount.value / list.length) * 100);
});

// -------------------------------------------------------------
// MODAL 7: CREATE / PLOT NEW SESSION
// -------------------------------------------------------------
const showCreateScheduleModal = ref(false);
const createScheduleForm = ref({
  studentId: '',
  sessionNo: 1,
  date: '',
  day: 'Sabtu',
  time: '09.00 - 09.45 WIB',
  coachName: '',
  location: 'Kolam Renang Graha Kresna Pratama',
  status: 'Terjadwal',
  notes: ''
});

function openCreateScheduleModal(prefillStudentId = null) {
  const targetStudentId = prefillStudentId || (store.students[0]?.id || '');
  const stu = store.students.find(s => s.id === targetStudentId);
  const existingCount = stu?.memberSchedules?.length || 0;
  
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  createScheduleForm.value = {
    studentId: targetStudentId,
    sessionNo: existingCount + 1,
    date: dateStr,
    day: 'Sabtu',
    time: '09.00 - 09.45 WIB',
    coachName: stu?.assignedCoachName || store.coaches[0]?.name || 'Coach Dimas Prasetyo, S.Or.',
    location: stu?.location || 'Kolam Renang Graha Kresna Pratama',
    status: 'Terjadwal',
    notes: `Sesi latihan ke-${existingCount + 1}`
  };
  showCreateScheduleModal.value = true;
}

function onStudentSelectedInScheduleForm() {
  const stu = store.students.find(s => s.id === createScheduleForm.value.studentId);
  if (stu) {
    createScheduleForm.value.sessionNo = (stu.memberSchedules?.length || 0) + 1;
    if (stu.assignedCoachName) createScheduleForm.value.coachName = stu.assignedCoachName;
    if (stu.location) createScheduleForm.value.location = stu.location;
    createScheduleForm.value.notes = `Sesi latihan ke-${createScheduleForm.value.sessionNo}`;
  }
}

function openAddSessionForCurrentStudent() {
  if (!activeStudentForSchedules.value) return;
  openCreateScheduleModal(activeStudentForSchedules.value.id);
}

async function handleCreateSchedule() {
  try {
    if (!createScheduleForm.value.studentId) {
      alert('Pilih siswa terlebih dahulu!');
      return;
    }
    const created = await actions.addSchedule(createScheduleForm.value);
    showNotice(`Plotting Sesi ${created.sessionNo} untuk ${created.studentName} berhasil dibuat!`);
    showCreateScheduleModal.value = false;
    
    // Refresh student modal if open
    if (activeStudentForSchedules.value && activeStudentForSchedules.value.id === createScheduleForm.value.studentId) {
      const refreshed = store.students.find(s => s.id === activeStudentForSchedules.value.id);
      if (refreshed) activeStudentForSchedules.value = refreshed;
    }
  } catch (err) {
    alert(err.message || 'Gagal membuat jadwal sesi');
  }
}

// -------------------------------------------------------------
// MODAL 8: ATTENDANCE & PROGRESS EVALUATION
// -------------------------------------------------------------
const showAttendanceModal = ref(false);
const activeScheduleForAttendance = ref(null);
const attendanceForm = ref({
  status: 'Selesai',
  rating: 5,
  notes: ''
});

function openAttendanceModal(sch) {
  activeScheduleForAttendance.value = sch;
  attendanceForm.value = {
    status: sch.status === 'Terjadwal' ? 'Selesai' : sch.status,
    rating: sch.rating || 5,
    notes: sch.notes || ''
  };
  showAttendanceModal.value = true;
}

async function handleSaveAttendance() {
  if (!activeScheduleForAttendance.value) return;
  try {
    await actions.updateSchedule(activeScheduleForAttendance.value.id, {
      status: attendanceForm.value.status,
      rating: attendanceForm.value.rating,
      notes: attendanceForm.value.notes
    });
    activeScheduleForAttendance.value.status = attendanceForm.value.status;
    activeScheduleForAttendance.value.rating = attendanceForm.value.rating;
    activeScheduleForAttendance.value.notes = attendanceForm.value.notes;
    showNotice(`Presensi & evaluasi sesi ${activeScheduleForAttendance.value.sessionNo} berhasil disimpan!`);
    showAttendanceModal.value = false;
    
    if (activeStudentForSchedules.value) {
      const refreshed = store.students.find(s => s.id === activeStudentForSchedules.value.id);
      if (refreshed) activeStudentForSchedules.value = refreshed;
    }
  } catch (err) {
    alert(err.message || 'Gagal menyimpan presensi');
  }
}

// -------------------------------------------------------------
// MODAL 9: RESCHEDULE SESSION
// -------------------------------------------------------------
const showRescheduleModal = ref(false);
const activeScheduleForReschedule = ref(null);
const rescheduleForm = ref({
  date: '',
  day: 'Sabtu',
  time: '09.00 - 09.45 WIB',
  coachName: '',
  location: '',
  reason: ''
});

function openRescheduleModal(sch) {
  activeScheduleForReschedule.value = sch;
  rescheduleForm.value = {
    date: sch.date || new Date().toISOString().split('T')[0],
    day: sch.day || 'Sabtu',
    time: sch.time || '09.00 - 09.45 WIB',
    coachName: sch.coachName || '',
    location: sch.location || '',
    reason: ''
  };
  showRescheduleModal.value = true;
}

async function handleSaveReschedule() {
  if (!activeScheduleForReschedule.value) return;
  try {
    const noteText = rescheduleForm.value.reason 
      ? `Reschedule: ${rescheduleForm.value.reason}` 
      : `Jadwal diubah ke ${rescheduleForm.value.day}, ${rescheduleForm.value.date}`;
      
    await actions.updateSchedule(activeScheduleForReschedule.value.id, {
      date: rescheduleForm.value.date,
      day: rescheduleForm.value.day,
      time: rescheduleForm.value.time,
      coachName: rescheduleForm.value.coachName,
      location: rescheduleForm.value.location,
      status: 'Reschedule',
      notes: noteText
    });
    showNotice(`Sesi ${activeScheduleForReschedule.value.sessionNo} berhasil di-reschedule!`);
    showRescheduleModal.value = false;

    if (activeStudentForSchedules.value) {
      const refreshed = store.students.find(s => s.id === activeStudentForSchedules.value.id);
      if (refreshed) activeStudentForSchedules.value = refreshed;
    }
  } catch (err) {
    alert(err.message || 'Gagal reschedule');
  }
}

async function handleDeleteSchedule(sch) {
  if (confirm(`Yakin ingin menghapus sesi latihan ke-${sch.sessionNo} untuk ${sch.studentName}?`)) {
    try {
      await actions.deleteSchedule(sch.id);
      showNotice(`Sesi latihan ke-${sch.sessionNo} berhasil dihapus.`);
      if (activeStudentForSchedules.value) {
        const refreshed = store.students.find(s => s.id === activeStudentForSchedules.value.id);
        if (refreshed) activeStudentForSchedules.value = refreshed;
      }
    } catch (err) {
      alert(err.message || 'Gagal menghapus sesi');
    }
  }
}

function cleanPhone(num) {
  if (!num) return '';
  return num.replace(/\D/g, '');
}

// -------------------------------------------------------------
// PAYMENTS & QRIS ASPI & BANK ACCOUNTS CRUD
// -------------------------------------------------------------
const paymentSubTab = ref('invoices');
const selectedQrisNominal = ref(500000);
const customQrisAmount = ref(null);
const qrCodeDataUrl = ref('');

const isEditingQrisMaster = ref(false);
const isUploadingQrisImg = ref(false);
const qrisDetectStatus = ref('');

const qrisMasterForm = reactive({
  merchantName: '',
  merchantCity: '',
  nmid: '',
  rawQrisStatic: '',
  qrisImageUrl: ''
});

function initQrisMasterForm() {
  qrisMasterForm.merchantName = store.paymentConfig?.merchantName || 'MINE.SKILLS INDONESIA';
  qrisMasterForm.merchantCity = store.paymentConfig?.merchantCity || 'JAKARTA';
  qrisMasterForm.nmid = store.paymentConfig?.nmid || 'ID1020038847291';
  qrisMasterForm.rawQrisStatic = store.paymentConfig?.rawQrisStatic || '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB';
  qrisMasterForm.qrisImageUrl = store.paymentConfig?.qrisImageUrl || '';
  qrisDetectStatus.value = '';
}

function startEditQrisMaster() {
  initQrisMasterForm();
  isEditingQrisMaster.value = true;
}

function cancelEditQrisMaster() {
  isEditingQrisMaster.value = false;
}

async function handleQrisImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  isUploadingQrisImg.value = true;
  qrisDetectStatus.value = 'Sedang membaca dan menganalisis barcode QRIS...';

  try {
    // 1. Upload image asset to server
    const imgUrl = await uploadImage(file, 'qris');
    qrisMasterForm.qrisImageUrl = imgUrl;

    // 2. Decode QRIS barcode using jsQR with HTML5 canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          qrisMasterForm.rawQrisStatic = code.data;

          // Auto-parse Tag 59 (Merchant Name) and Tag 60 (City) if available in standard ASPI
          try {
            const tag59Match = code.data.match(/59(\d{2})(.*?)(?=60|61|62|63)/);
            if (tag59Match && tag59Match[2]) {
              const len = parseInt(tag59Match[1]);
              const rawName = tag59Match[2].substring(0, len).trim();
              if (rawName) qrisMasterForm.merchantName = rawName;
            }
            const tag60Match = code.data.match(/60(\d{2})(.*?)(?=61|62|63)/);
            if (tag60Match && tag60Match[2]) {
              const len = parseInt(tag60Match[1]);
              const rawCity = tag60Match[2].substring(0, len).trim();
              if (rawCity) qrisMasterForm.merchantCity = rawCity;
            }
          } catch (pe) {
            console.warn('QR tag parse warning:', pe);
          }

          qrisDetectStatus.value = '✓ Barcode QRIS berhasil dideteksi & terintegrasi otomatis!';
          generateQrisPreview();
        } else {
          qrisDetectStatus.value = '✓ Gambar berhasil diunggah (Payload QRIS bawaan tetap aktif).';
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    showNotice('Gambar QRIS berhasil diunggah!');
  } catch (err) {
    console.error('QRIS Upload error:', err);
    alert(err.message || 'Gagal mengunggah gambar QRIS');
    qrisDetectStatus.value = '';
  } finally {
    isUploadingQrisImg.value = false;
  }
}

async function saveQrisMaster() {
  if (!qrisMasterForm.merchantName.trim()) {
    alert('Nama merchant tidak boleh kosong!');
    return;
  }
  await actions.updatePaymentConfig({
    merchantName: qrisMasterForm.merchantName,
    merchantCity: qrisMasterForm.merchantCity,
    nmid: qrisMasterForm.nmid,
    rawQrisStatic: qrisMasterForm.rawQrisStatic,
    qrisImageUrl: qrisMasterForm.qrisImageUrl
  });
  isEditingQrisMaster.value = false;
  await generateQrisPreview();
  showNotice('Konfigurasi Master QRIS berhasil disimpan!');
}

function resetQrisToDefault() {
  qrisMasterForm.merchantName = 'MINE.SKILLS INDONESIA';
  qrisMasterForm.merchantCity = 'JAKARTA';
  qrisMasterForm.nmid = 'ID1020038847291';
  qrisMasterForm.rawQrisStatic = '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB';
  qrisDetectStatus.value = '✓ Reset ke default template standar ASPI.';
}

// Bank Accounts CRUD
const showBankModal = ref(false);
const bankModalMode = ref('create'); // 'create' | 'edit'
const bankForm = reactive({
  id: '',
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '',
  accountHolder: 'YAYASAN MINE SKILLS INDONESIA',
  badge: 'Verifikasi Otomatis'
});

const bankPresets = [
  'Bank Central Asia (BCA)',
  'Bank Mandiri',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Syariah Indonesia (BSI)',
  'Bank CIMB Niaga',
  'Bank Permata',
  'Bank Jago'
];

function selectBankPreset(name) {
  bankForm.bankName = name;
}

function openAddBankModal() {
  bankModalMode.value = 'create';
  bankForm.id = '';
  bankForm.bankName = 'Bank Central Asia (BCA)';
  bankForm.accountNumber = '';
  bankForm.accountHolder = 'YAYASAN MINE SKILLS INDONESIA';
  bankForm.badge = 'Verifikasi Otomatis';
  showBankModal.value = true;
}

function openEditBankModal(bank) {
  bankModalMode.value = 'edit';
  bankForm.id = bank.id;
  bankForm.bankName = bank.bankName;
  bankForm.accountNumber = bank.accountNumber;
  bankForm.accountHolder = bank.accountHolder;
  bankForm.badge = bank.badge || 'Verifikasi Otomatis';
  showBankModal.value = true;
}

async function saveBankAccount() {
  if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim()) {
    alert('Nama Bank dan Nomor Rekening wajib diisi!');
    return;
  }
  if (bankModalMode.value === 'create') {
    await actions.addBankAccount({
      bankName: bankForm.bankName,
      accountNumber: bankForm.accountNumber,
      accountHolder: bankForm.accountHolder,
      badge: bankForm.badge
    });
    showNotice(`Rekening ${bankForm.bankName} berhasil ditambahkan!`);
  } else {
    await actions.updateBankAccount(bankForm.id, {
      bankName: bankForm.bankName,
      accountNumber: bankForm.accountNumber,
      accountHolder: bankForm.accountHolder,
      badge: bankForm.badge
    });
    showNotice(`Rekening ${bankForm.bankName} berhasil diperbarui!`);
  }
  showBankModal.value = false;
}

async function confirmDeleteBank(bank) {
  if (confirm(`Yakin ingin menghapus rekening ${bank.bankName} (${bank.accountNumber})? Rekening ini tidak akan muncul lagi di opsi transfer orang tua siswa.`)) {
    await actions.deleteBankAccount(bank.id);
    showNotice(`Rekening ${bank.bankName} berhasil dihapus.`);
  }
}

const activeQrisAmount = computed(() => {
  return customQrisAmount.value || selectedQrisNominal.value || 500000;
});

async function generateQrisPreview() {
  try {
    const rawStatic = store.paymentConfig?.rawQrisStatic || '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB';
    const res = convertQRIS(rawStatic, { amount: activeQrisAmount.value });
    const qrisStr = typeof res === 'string' ? res : (res?.qris || rawStatic);
    qrCodeDataUrl.value = await QRCode.toDataURL(qrisStr, {
      width: 240,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
  } catch (err) {
    console.warn('QRIS generation error:', err);
  }
}

async function handleVerifyPayment(invoiceId) {
  await actions.verifyPayment(invoiceId);
  showNotice(`Invoice ${invoiceId} berhasil diverifikasi Lunas!`);
}

onMounted(() => {
  initQrisMasterForm();
  generateQrisPreview();
});
</script>

<style scoped>
.portal-tab-content {
  max-width: 1100px;
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

.top-date-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-subtle);
  background-color: var(--bg-surface);
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
}

/* Toast Notice */
.toast-notice {
  position: fixed;
  top: 80px;
  right: 28px;
  z-index: 2000;
  background-color: #07333e;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(7, 51, 62, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #3f7e2f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.toast-body strong {
  display: block;
  font-size: 12px;
  color: #e5a024;
}

.toast-body span {
  font-size: 13px;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px 20px;
}

.metric-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon-wrap.teal { background-color: var(--color-primary-soft); color: var(--color-primary); }
.metric-icon-wrap.green { background-color: var(--color-accent-green-soft); color: var(--color-accent-green-dark); }
.metric-icon-wrap.gold { background-color: var(--color-accent-gold-soft); color: var(--color-accent-gold-dark); }

.metric-data {
  display: flex;
  flex-direction: column;
}

.metric-lbl {
  font-size: 12px;
  color: var(--text-subtle);
  font-weight: 600;
}

.metric-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.metric-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.text-green { color: var(--color-accent-green-dark); font-weight: 600; }

/* Shortcuts */
.management-shortcuts {
  padding: 20px;
}

.shortcut-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 12px;
}

.shortcut-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Tables */
.table-wrap {
  padding: 0;
  overflow: hidden;
  background-color: #ffffff;
}

.table-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.table-section-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.btn-link {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

.leads-table th {
  background-color: #f7faf9;
  padding: 12px 18px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  border-bottom: 1.5px solid var(--border-subtle);
}

.leads-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.leads-table tbody tr:hover {
  background-color: #f7faf9;
}

.text-right { text-align: right; }
.text-center { text-align: center; }

.sub-cell-txt {
  display: block;
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.stu-name-cell strong {
  font-size: 13.5px;
  color: var(--color-primary-dark);
}

.wa-chat-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-wa-chat {
  font-size: 11px;
  font-weight: 700;
  color: #25d366;
  text-decoration: underline;
}

.btn-schedule-view {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.btn-view-txt {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary);
}

.table-actions-cluster {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-primary-xs {
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-secondary-xs {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  padding: 5px 9px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger-xs {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 5px 9px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-outline-primary-xs {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

/* Filter Strip */
.filter-search-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  margin-bottom: 16px;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 360px;
  color: var(--text-subtle);
}

.input-search-clean {
  border: none;
  outline: none;
  font-size: 13.5px;
  width: 100%;
  background: transparent;
}

.filter-count {
  font-size: 12px;
  color: var(--text-muted);
}

/* Products CRUD Grid */
.products-crud-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-crud-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.prod-img-wrap {
  position: relative;
  height: 180px;
}

.prod-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
}

.prod-card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.prod-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.prod-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.prod-desc {
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 14px;
}

.prod-meta-strip {
  display: flex;
  gap: 6px;
  font-size: 11.5px;
  color: var(--text-subtle);
  margin-bottom: 12px;
}

.prod-coaches-strip {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-xs);
  padding: 8px 10px;
  margin-bottom: 16px;
}

.lbl-coaches {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-subtle);
  margin-bottom: 4px;
}

.coach-tag-list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.coach-tag {
  background-color: #ffffff;
  border: 1px solid var(--border-subtle);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
}

.prod-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
  margin-top: auto;
}

.btn-secondary-sm {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger-sm {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* Packages Filter */
.package-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-lbl {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.filter-select {
  width: auto;
  min-width: 260px;
}

/* Coaches Grid */
.coaches-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.coach-manage-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.c-head {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.c-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--border-subtle);
}

.c-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.c-spec {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.c-bio {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 12px;
}

.coach-prod-mapping {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-xs);
  padding: 8px 10px;
  margin-bottom: 12px;
}

.lbl-small {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-subtle);
  margin-bottom: 4px;
}

.coach-tags-wrap {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.c-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11.5px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.coach-card-actions {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
  margin-top: auto;
}

/* QRIS & Payment */
.qris-generator-card {
  padding: 28px;
}

.qris-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-sec-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.qris-meta-box {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-top: 16px;
}

.box-row {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  padding: 4px 0;
}

.qris-display-frame {
  background-color: #ffffff;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.qris-header-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.qris-txt {
  font-size: 24px;
  font-weight: 900;
  color: #dc2626;
  letter-spacing: 0.1em;
}

.qris-sub {
  font-size: 9px;
  font-weight: 800;
  color: #07333e;
  letter-spacing: 0.05em;
}

.qr-canvas-box {
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  justify-content: center;
}

.qr-img {
  width: 200px;
  height: 200px;
}

.qris-nominal-box {
  background-color: #f7faf9;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  margin: 12px 0;
}

.nominal-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.qris-footer-notes {
  font-size: 10.5px;
  color: var(--text-muted);
}

.bank-accounts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.bank-card {
  padding: 20px;
}

.bank-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bank-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.bank-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.bank-holder {
  font-size: 12px;
  color: var(--text-muted);
}

.bank-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.btn-danger-xs {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-danger-xs:hover {
  background: #dc2626;
  color: #ffffff;
}

.preset-bank-chip {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: var(--bg-subtle);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preset-bank-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.preset-bank-chip.active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 35, 43, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-dialog {
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 48px rgba(9, 35, 43, 0.25);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-subtle);
}

.modal-dialog.modal-lg {
  max-width: 720px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-subtle);
  cursor: pointer;
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.upload-field-box {
  background-color: var(--bg-subtle);
  border: 1.5px dashed var(--border-strong);
  border-radius: var(--radius-md);
  padding: 12px;
}

.upload-preview-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.preview-coach-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.preview-path {
  font-size: 11px;
  color: var(--text-muted);
}

.product-checkboxes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.prod-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.required { color: #dc2626; }

/* Student Schedule Dynamic Overview & Progress */
.sched-metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.sched-metric-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sched-metric-lbl {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  letter-spacing: 0.03em;
}

.sched-metric-val {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.sched-metric-box.text-green .sched-metric-val { color: #16a34a; }
.sched-metric-box.text-gold .sched-metric-val { color: #d97706; }
.sched-metric-box.text-blue .sched-metric-val { color: #0284c7; }

/* Filter Controls Bar */
.schedule-filter-controls {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
}

.filter-search-wrap {
  flex: 1.5;
  min-width: 220px;
}

.filter-search-input {
  padding: 8px 12px;
  font-size: 13px;
}

.sub-cell-wa {
  display: inline-block;
  font-size: 11px;
  color: #16a34a;
  font-weight: 700;
  text-decoration: none;
  margin-top: 2px;
}

.sub-cell-wa:hover {
  text-decoration: underline;
}

.sched-notes-cell {
  max-width: 220px;
}

.rating-stars {
  color: #e5a024;
  font-size: 11px;
  display: block;
  margin-bottom: 2px;
}

.sched-notes-text {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.35;
  margin: 0;
}

.table-actions-inline {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn-primary-xs {
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary-xs:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary-xs {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary-xs:hover {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.btn-danger-xs {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-danger-xs:hover {
  background-color: #dc2626;
  color: #ffffff;
}

/* Student Schedule Modal Items */
.schedules-student-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.summary-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-lbl {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-subtle);
  font-weight: 700;
}

.summary-col strong {
  font-size: 13.5px;
  color: var(--color-primary-dark);
}

.student-session-progress-wrap {
  width: 100%;
  height: 8px;
  background-color: #e2e8e5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.student-session-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0d4d5d, #16a34a);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.schedules-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

.schedule-session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}

.sch-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 160px;
}

.sch-date-info strong {
  display: block;
  font-size: 13px;
  color: var(--color-primary-dark);
}

.sch-date-info span {
  font-size: 11.5px;
  color: var(--text-muted);
}

.sch-mid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sch-notes-snippet {
  font-size: 11.5px;
  color: var(--color-primary);
  margin-top: 2px;
}

.sch-status-col {
  min-width: 90px;
  text-align: center;
}

.sch-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.attendance-summary-card {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  background-color: #f7faf9;
  border: 1px solid var(--border-subtle);
}

/* Curriculum Levels Editor */
.curriculum-edit-section {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: 14px;
  margin-bottom: 16px;
}

.curriculum-sec-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 12px;
}

.curriculum-sec-header .form-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 3px;
}

.curriculum-levels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.curriculum-level-box {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.curriculum-level-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border-subtle);
}

.form-label-xs {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.form-input-sm {
  font-size: 13px !important;
  padding: 7px 10px !important;
}

/* =========================================================
   MONITORING KEHADIRAN COACH & GEOFENCE STYLES
   ========================================================= */
.geofence-info-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-md);
  gap: 16px;
  flex-wrap: wrap;
}

.strip-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.venue-icon-circle {
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

.venue-strip-title {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0;
}

.venue-strip-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  margin-bottom: 20px;
  gap: 14px;
  flex-wrap: wrap;
}

.toolbar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  flex: 1;
  min-width: 260px;
}

.toolbar-search svg {
  color: #64748b;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--text-main);
}

.toolbar-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  font-weight: 600;
}

.attendance-table-wrap {
  padding: 20px;
  background: #ffffff;
}

.table-header-row {
  margin-bottom: 16px;
}

.table-card-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.table-card-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.empty-table-state {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13.5px;
}

.coach-td-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.coach-sm-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
  flex-shrink: 0;
}

.coach-cell-name {
  display: block;
  font-size: 13.5px;
  color: var(--color-primary-dark);
}

.coach-cell-notes {
  font-size: 11px;
  color: var(--text-subtle);
  font-style: italic;
  display: block;
}

.time-td-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.att-date-str {
  font-size: 12.5px;
  color: var(--text-main);
}

.att-clock-str {
  font-size: 11.5px;
  color: var(--text-muted);
}

.att-session-pill {
  margin-top: 2px;
  align-self: flex-start;
  font-size: 10px;
  padding: 2px 8px;
}

.coord-td-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.coord-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.acc-text {
  font-size: 10.5px;
  color: var(--text-subtle);
}

.dist-td-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dist-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  width: fit-content;
}

.dist-valid {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.dist-warning {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}

.dist-status-lbl {
  font-size: 10.5px;
  color: var(--text-muted);
}

/* Mini Map Thumbnail in Table */
.mini-map-thumb-box {
  position: relative;
  width: 120px;
  height: 68px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  background: #e2e8f0;
}

.thumb-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  display: block;
}

.thumb-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 83, 81, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 150ms ease;
}

.mini-map-thumb-box:hover .thumb-overlay {
  opacity: 1;
}

.status-td-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.verif-time {
  font-size: 10.5px;
  color: var(--text-subtle);
}

.action-buttons-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}

.map-link-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: var(--color-primary-dark);
  font-weight: 700;
  text-decoration: none;
  font-size: 12px;
}

.map-link-icon-btn:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* Map Modal Styles */
.modal-lg {
  max-width: 760px;
}

.map-modal-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-geo-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  padding: 14px 18px;
  background: #f8fafc;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.modal-geo-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12.5px;
}

.geo-sub-lbl {
  font-size: 10.5px;
  text-transform: uppercase;
  color: var(--text-subtle);
  font-weight: 700;
}

.full-map-embed-container {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1.5px solid #cbd5e1;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.full-map-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.map-floating-pin-card {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(6px);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  font-size: 12.5px;
  max-width: 320px;
}

.pin-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary-dark);
  font-size: 13.5px;
  margin-bottom: 4px;
}

.pin-dot-anim {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pinDotPulse 1.5s infinite;
}

@keyframes pinDotPulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.pin-actions {
  margin-top: 8px;
}

/* Location CRUD & Geofence Styles */
.locations-crud-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.location-crud-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loc-card-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.loc-pin-icon {
  font-size: 20px;
}

.loc-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.loc-card-inner {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.loc-address-box {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.loc-info-lbl,
.lbl-sec-sm {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
}

.loc-address-text {
  font-size: 12.5px;
  color: var(--color-primary-dark);
  line-height: 1.45;
  margin: 0;
}

.loc-geo-box {
  background: #f1f5f9;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 11.5px;
}

.geo-coord-pill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.geo-radius-badge {
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.loc-mini-map-box {
  width: 100%;
  height: 150px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid #cbd5e1;
}

.loc-thumb-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loc-mapped-products-strip {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.loc-prod-tags,
.loc-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.loc-tag {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.amenities-text {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.loc-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed #e2e8f0;
}

.btn-text-sm {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.btn-text-sm:hover {
  text-decoration: underline;
}

/* Checkbox Pills for Mapping */
.loc-checkboxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin-top: 6px;
}

.loc-check-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  background: #ffffff;
  cursor: pointer;
  font-size: 12.5px;
  transition: all 0.15s ease;
}

.loc-check-pill:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.loc-check-pill input[type="checkbox"] {
  accent-color: var(--color-primary);
}

/* Website CMS Styles */
.website-config-grid {
  max-width: 780px;
}

.website-config-card {
  padding: 24px;
}

.form-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #e2e8f0;
}

.prod-locations-strip {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 900px) {
  .metrics-grid,
  .products-crud-grid,
  .coaches-grid,
  .qris-grid,
  .bank-accounts-grid,
  .sched-metrics-row {
    grid-template-columns: 1fr;
  }
  .schedule-filter-controls {
    flex-direction: column;
  }
  .modal-geo-summary {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
