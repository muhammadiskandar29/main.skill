# 📘 PANDUAN & DOKUMENTASI LENGKAP FITUR SISTEM MINE.SKILLS
**Ekosistem Manajemen & Kursus Pembinaan Skill Terpadu**  
*(Renang Prestasi, Otomotif Mengemudi, Seni Budaya & Tari)*

---

## 📌 DAFTAR ISI
1. [Ringkasan Arsitektur & Relasi Antar Data](#1-ringkasan-arsitektur--relasi-antar-data)
2. [Role 1: Public Visitor (Pengunjung & Calon Siswa)](#2-role-1-public-visitor-pengunjung--calon-siswa)
3. [Role 2: Customer (Orang Tua & Siswa Didik)](#3-role-2-customer-orang-tua--siswa-didik)
4. [Role 3: Coach (Instruktur Lapangan)](#4-role-3-coach-instruktur-lapangan)
5. [Role 4: Manajemen (Super Administrator)](#5-role-4-manajemen-super-administrator)
6. [Alur Operasional Sistem (End-to-End Workflow)](#6-alur-operasional-sistem-end-to-end-workflow)
7. [Daftar Akun & Kredensial Uji Coba](#7-daftar-akun--kredensial-uji-coba)

---

## 1. Ringkasan Arsitektur & Relasi Antar Data

Sistem **mine.skills** dibangun dengan prinsip keterhubungan data penuh (*fully integrated relational ecosystem*). Tidak ada data yang berdiri sendiri (*orphan data*). 

```
┌─────────────────────────────────┐
│     MASTER PROGRAM / PRODUK     │
│   (Kurikulum Bertahap L1 - L4)  │
└───────────────┬─────────────────┘
                │
     Two-Way    │ Dipetakan ke Lokasi &
     Mapping    │ Dipilih saat Pendaftaran
                ▼
┌─────────────────────────────────┐          ┌─────────────────────────────────┐
│    MASTER FASILITAS & LOKASI    │          │      DATA SISWA & WALI          │
│  (Titik GPS + Radius Geofence)  │          │   (Paket Kursus & Kuota Sesi)   │
└───────────────┬─────────────────┘          └────────────────┬────────────────┘
                │                                             │
                │ Menjadi Target                              │ Penugasan Coach
                │ Patokan Absensi                             │ (Locking 4 Sesi)
                ▼                                             ▼
┌─────────────────────────────────┐          ┌─────────────────────────────────┐
│    PRESENSI COACH BERBASIS GPS  │ ◄─────── │    PLOTTING JADWAL & SESI       │
│    (Haversine + Mini Map OSM)   │          │ (Siswa, Waktu, Pelatih, Lokasi) │
└───────────────┬─────────────────┘          └─────────────────────────────────┘
                │
                │ Mengirim Log Presensi & Titik Koordinat
                ▼
┌─────────────────────────────────┐
│   MONITORING & AUDIT MANAJEMEN  │
│  (Verifikasi Radius & Kehadiran)│
└─────────────────────────────────┘
```

### Relasi Utama Sistem:
1. **Produk ⇄ Lokasi**: Setiap produk keahlian memetakan fasilitas kolam/venue mana saja yang menyelenggarakannya. Setiap lokasi memetakan produk apa saja yang dibuka di sana.
2. **Siswa ⇄ Coach**: Siswa dikunci (*locked*) ke 1 instruktur tetap selama 4, 8, atau 12 sesi untuk menjaga konsistensi bonding emosional & pemahaman perkembangan anak.
3. **Sesi Latihan ⇄ Lokasi**: Plotting jadwal latihan siswa dan jadwal mengajar coach memilih lokasi fasilitas dinamis dari database.
4. **Presensi Coach ⇄ Geofence Lokasi**: Coach memilih lokasi tempat ia mengajar hari ini. Sensor GPS perangkat mendeteksi titik koordinat aktual coach, lalu menghitung jarak meter terhadap koordinat venue patokan secara real-time.
5. **Presensi ⇄ Raport ⇄ WhatsApp**: Evaluasi capaian sesi latihan langsung meng-update progress raport digital murid dan meng-generate teks baku WhatsApp siap kirim ke orang tua murid.

---

## 2. Role 1: Public Visitor (Pengunjung & Calon Siswa)

Akses: Halaman Depan Website (`CompanyProfile.vue`)  
Tujuan: Menampilkan profil lembaga yang kredibel, kurikulum transparan, dan pendaftaran mandiri.

### Fitur yang Dapat Dilakukan:
* **Eksplorasi Profil & Identitas Brand**: Membaca profil resmi, visi pembinaan karakter anak, standar keamanan & keselamatan ketat, jam operasional, dan lokasi kantor pusat.
* **Katalog Program Pelatihan Dinamis**: Meninjau program keahlian yang dibuka (Renang Prestasi, Otomotif Mengemudi, Tari Tradisional & Modern), kategori program, target rentang usia anak, dan foto fasilitas.
* **Eksplorasi Kurikulum Berjenjang (Level 1 s/d Level 4)**:
  * Mengetahui silabus dan target pembelajaran di setiap tingkatan.
  * Mengetahui fokus materi teknis (contoh: *Water Confidence, Gaya Dada, Gaya Punggung, Gaya Kupu-kupu*).
  * Mengetahui tantangan kelulusan (*Challenge Milestone*) sebelum ananda naik ke level berikutnya.
* **Direktori Lokasi & Fasilitas Latihan**:
  * Melihat daftar venue kolam renang/fasilitas yang bekerjasama di area Jabodetabek.
  * Mengetahui alamat lengkap dan sarana pendukung (kamar bilas tertutup, tribun beratap, zonasi kedalaman anak, staf lifeguard, pengawasan CCTV).
  * Melihat program pelatihan apa saja yang tersedia di masing-masing fasilitas.
  * Membuka rute navigasi langsung ke Google Maps dengan 1 klik.
* **Direktori Instruktur Resmi**:
  * Melihat profil pelatih, foto, sertifikasi keahlian, pengalaman jam terbang (5+ tahun), dan jumlah murid yang dibina.
  * Tombol konsultasi langsung via WhatsApp dengan pelatih terkait.
* **Transparansi Skema Paket Biaya**:
  * Komparasi paket kursus (Group Class, Small Group, Private VIP).
  * Rincian rasio murid per kelas (1:1, 1:2-3, 1:4-6), durasi sesi (45-60 menit), dan nominal investasi kursus.
* **Pendaftaran Online Mandiri (Registration Modal)**:
  * Mengisi data diri ananda dan wali murid.
  * Memilih program skill dan skema paket kursus yang diminati.
  * Kalkulasi otomatis total rincian biaya pendaftaran yang langsung masuk ke antrean database admin.
* **Konsultasi Cepat Call Center**: Tombol WhatsApp direct chat dengan admin call center untuk konsultasi minat & bakat anak secara gratis.

---

## 3. Role 2: Customer (Orang Tua & Siswa Didik)

Akses: Portal Siswa / Wali Murid (`PortalCustomer.vue`)  
Tujuan: Memberikan transparansi penuh kepada orang tua atas progres belajar anak, jadwal latihan, dan administrasi tagihan.

### Fitur yang Dapat Dilakukan:

#### A. Ringkasan Akun & Gamifikasi (`c_overview`)
* **🗺️ Interactive Skill Quest Roadmap (Peta Petualangan Level)**:
  * Alur perjalanan kurikulum bergaya petualangan RPG / Duolingo dengan grafis lintasan air ombak (*wave trail*).
  * Menampilkan stasiun checkpoint Level 1 s/d Level 4 dengan tantangan kelulusan (*Challenge Milestone*).
  * **Pin Avatar Siswa Mengambang (*Floating Avatar Pin*)**: Foto profil anak dengan balon teks animasi *"Kenzo ada di sini! 🏊‍♂️"* dan cincin riak air (*ripple pulse*) yang berada tepat di stasiun level aktifnya.
  * Stasiun level yang sudah lulus diberi trofi emas, stasiun aktif bertanda bintang dengan progress bar 75%, dan stasiun berikutnya terkunci gembok.
  * Setiap stasiun dapat diklik untuk membuka modal rincian fokus materi, tantangan kelulusan, dan catatan evaluasi pelatih.
* **🕸️ Radar Spider-Web Chart (Grafik Pentagon 5 Pilar Kemampuan)**:
  * Grafik radar visual SVG yang menganalisis 5 pilar kemampuan utama anak:
    1. 🌊 **Keberanian Air (*Water Confidence*)**
    2. 🫁 **Ketahanan Nafas (*Breath Control*)**
    3. 🏊‍♂️ **Teknik Gerak (*Propulsion / Tendangan*)**
    4. ⚖️ **Keseimbangan Tubuh (*Streamline*)**
    5. 🎯 **Kedisiplinan & Fokus (*Mental Discipline*)**
  * **Analisis Komparasi 2 Lapisan**: Menampilkan poligon ungu putus-putus (*Sesi 1 / Baseline Awal*) dan poligon toska bercahaya (*Sesi Terkini*), sehingga orang tua dapat melihat bentuk pentagon kemampuan anaknya membesar keluar secara visual!
  * **Mode Switcher Interaktif**: Tombol beralih antara `[Bandingkan Awal vs Terkini]`, `[Sesi 1 Awal]`, dan `[Sesi Terkini]`.
  * **Kartu Breakdown 5 Pilar**: Skor numerik (contoh: 92/100), persentase peningkatan (contoh: +37%), meter progress bar, dan skor rata-rata total (*Predikat: Mahir & Mandiri*).
* Kartu identitas anak, status keanggotaan aktif, dan program skill yang diikuti.
* Nama instruktur/coach tetap yang membina ananda.
* Sisa kuota sesi dalam paket (contoh: *Sisa 3 dari 4 Sesi Pertemuan*).
* Countdown waktu pelaksanaan jadwal latihan terdekat.

#### B. Raport Digital & Histori Belajar (`c_progress`)
* Memantau rekam jejak capaian latihan ananda pada setiap pertemuan yang telah selesai.
* Membaca rincian materi sesi:
  * Menu Pemanasan (*Warm-up*)
  * Latihan Inti Gerak (*Main Exercise*)
  * Pendinginan (*Cool-down*)
* Membaca catatan personal dan masukan evaluasi dari coach mengenai perkembangan fisik, teknik, serta mental anak.
* Memeriksa status pencapaian tantangan (*Challenge Passed / In Progress*).

#### C. Kalender Jadwal & Kehadiran (`c_schedule`)
* Melihat kalender sesi latihan ananda (hari, tanggal pelaksanaan, dan slot jam latihan).
* Memeriksa lokasi fasilitas tempat sesi latihan diselenggarakan.
* Melihat status kehadiran pada tiap sesi:
  * 🟢 **Selesai / Hadir**: Sesi telah terlaksana.
  * 🟡 **Terjadwal**: Menunggu pelaksanaan sesi.
  * 🔵 **Izin / Sakit**: Sesi izin resmi dan tidak memotong kuota paket.
  * 🔴 **Reschedule**: Sesi telah dialihkan ke jadwal pengganti.
* Mengajukan permohonan reschedule/izin langsung ke admin manajemen jika anak berhalangan hadir.

#### D. E-Sertifikat Apresiasi (`c_certificate`)
* Melihat dan mengunduh sertifikat penghargaan digital resmi mine.skills setiap kali ananda berhasil lulus dari satu level kurikulum.
* Tampilan sertifikat dilengkapi nomor registrasi siswa resmi sebagai bukti portofolio prestasi anak.

#### E. Tagihan & Pembayaran Digital (`c_billing`)
* Memeriksa daftar tagihan invoice kursus yang masih aktif maupun yang sudah lunas.
* Membaca instruksi transfer bank (BCA, Bank Mandiri, BSI).
* Melakukan scan **QRIS Dinamis resmi standar ASPI / EMVCo** yang langsung menampilkan nominal tagihan presisi (bisa di-scan dari BCA Mobile, Livin Mandiri, GoPay, OVO, Dana, ShopeePay).

---

## 4. Role 3: Coach (Instruktur Lapangan)

Akses: Portal Instruktur (`PortalCoach.vue`)  
Tujuan: Mendukung mobilitas pelatih di lapangan, presensi absensi berbasis verifikasi geofence GPS, dan pelaporan evaluasi murid instan.

### Fitur yang Dapat Dilakukan:

#### A. Dashboard Utama Coach (`co_overview`)
* Ringkasan jam terbang dan sesi melatih hari ini.
* Total siswa binaan aktif yang dipercayakan dalam bimbingan pelatih.
* Status presensi pelatih hari ini (Sudah Absen / Belum Absen).
* Akses cepat ke modul presensi GPS dan modul pengisian raport.

#### B. Presensi Kehadiran Geofence GPS (`co_attendance`)
* **Pemilihan Fasilitas / Lokasi Mengajar**:
  * Pelatih memilih lokasi kolam/venue tempat ia bertugas mengajar hari ini dari dropdown dinamis (`store.locations`).
  * Informasi koordinat patokan dan toleransi radius venue otomatis dimuat.
* **Deteksi Titik Koordinat GPS Perangkat**:
  * Tombol *📍 Nyalakan GPS & Ambil Titik Lokasi*: Mengakses sensor GPS perangkat untuk mengambil koordinat lintang & bujur aktual (*latitude, longitude*) serta radius akurasi alat.
* **Perhitungan Geofence Otomatis (Haversine Formula)**:
  * Sistem otomatis menghitung jarak lurus (meter) antara posisi aktual coach dengan titik kolam venue yang dipilih.
  * Status otomatis: **Valid (Dalam Radius Aman ≤ 250m)** atau **Warning (Di Luar Radius Venue)**.
* **Peta Mini Interaktif (Mini Map OpenStreetMap)**:
  * Menampilkan cuplikan peta satelit mini dengan pin lokasi coach secara real-time.
  * Tombol direct link *Buka di Google Maps* untuk validasi posisi.
* **Simulasi Uji Koordinat**:
  * Tombol *Gunakan Titik Lokasi Venue (Simulasi Tes)* untuk mempermudah uji coba fitur saat menggunakan laptop/PC kantor tanpa sensor GPS fisik.
* **Form Check-In**:
  * Memilih sesi mengajar (Sesi Pagi: 08.00-09.30, Sesi Siang: 10.00-11.30, Sesi Sore: 15.30-17.00 WIB).
  * Mengisi catatan kesiapan alat dan kondisi kolam.
* **Riwayat Kehadiran**:
  * Memeriksa log kehadiran pribadi hari ini (jam check-in, titik koordinat, jarak radius, status verifikasi manajemen).

#### C. Input Raport & WhatsApp Generator (`co_report`)
* Memilih siswa asuh dari dropdown siswa binaan.
* Mengisi tingkatan level siswa dan nomor pertemuan ke-berapa.
* Mengisi materi pelatihan: Pemanasan, Latihan Inti, dan Pendinginan.
* Mengisi catatan evaluasi psikomotorik & mental anak.
* Memberikan centang *Rekomendasikan Kenaikan Level (Lulus Challenge)* jika siswa telah menuntaskan target tantangan level.
* **Live WhatsApp Generator**:
  * Mengonversi seluruh form penilaian ke dalam format teks baku WhatsApp secara real-time:
    ```
    Nama siswa : [Nama Anak]
    Level : [Level]
    Pertemuan ke : [No]

    Materi latihan
    Pemanasan : [...]
    Latihan inti : [...]
    Pendinginan : [...]

    Catatan coach
    [...]

    Salam,
    [Nama Coach]
    ```
* Tombol 1-klik *Salin Teks ke Clipboard*.
* Tombol 1-klik *Kirim Langsung via WhatsApp Web* ke nomor kontak orang tua murid.

#### D. Jadwal Mengajar & Siswa Binaan (`co_schedules`, `co_students`)
* Memantau daftar jadwal sesi latihan harian dan kuota peserta di kolam.
* Memantau data profil murid-murid tetap asuhannya (usia, kontak wali murid, level kurikulum saat ini, dan akumulasi sesi yang telah ditempuh).

---

## 5. Role 4: Manajemen (Super Administrator)

Akses: Portal Manajemen (`PortalManajemen.vue`)  
Tujuan: Pusat operasional lengkap yang mengelola akademik, fasilitas, penugasan instruktur, plotting jadwal, monitoring presensi, keuangan, dan konten website.

Menu sidebar manajemen terbagi ke dalam **4 Kategori Hierarkis Rapi**:

```
├── 1. RINGKASAN
│   └── 📊 Ringkasan & Kinerja (m_overview)
├── 2. AKADEMIK & FASILITAS
│   ├── 📚 Master Program Pelatihan (m_products)
│   ├── 📍 Master Lokasi & Geofence (m_locations)
│   ├── 🏷️ Paket Kursus & Biaya (m_packages)
│   └── 🥋 Daftar Instruktur / Coach (m_coaches)
├── 3. OPERASIONAL & SISWA
│   ├── 👨‍👩‍👧 Data Siswa & Wali (m_students)
│   ├── 📅 Jadwal & Sesi Latihan (m_schedules)
│   └── ⏱️ Monitoring Kehadiran Coach (m_attendance)
└── 4. KEUANGAN & SISTEM
    ├── 💳 Keuangan & Tagihan QRIS (m_payments)
    ├── 🌐 Profil & Website CMS (m_website)
    └── 🔐 Pengaturan Akses & RBAC (m_rbac)
```

### Rincian Fitur per Modul Manajemen:

### 1. Kategori Ringkasan
* **Ringkasan Operasional & Kinerja (`m_overview`)**:
  * **Kartu Metrik KPI**: Total Siswa Terbina (100% terikat coach), Instruktur Berlisensi, Akumulasi Penerimaan Biaya Kursus Lunas (Rp), Jumlah Paket Kursus Aktif.
  * **Pintasan Aksi Cepat**: Tombol instan pendaftaran siswa baru, buat program baru, buat paket biaya, rekrut coach, dan cek billing pembayaran.
  * **Tabel Pendaftar Terbaru**: Menampilkan 5 siswa pendaftar terakhir dengan aksi cepat penugasan (*assign*) pelatih.

### 2. Kategori Akademik & Fasilitas
* **Master Program Pelatihan (`m_products`)**:
  * Menambah, mengedit, dan menghapus program keahlian (*Skill Renang*, *Skill Otomotif*, dsb.).
  * Mengunggah foto banner kurikulum (*hero image*) langsung ke cloud/server.
  * Menentukan kategori program dan target rentang usia anak.
  * **Mapping Lokasi Fasilitas Latihan**: Memilih fasilitas kolam/venue mana saja yang menyelenggarakan program ini.
  * **Editor Kurikulum Bertahap Dinamis**: Menambah level kurikulum tanpa batas (Level 1 s/d N), mengisi judul level, fokus kurikulum, dan tantangan kelulusan (*challenge*).
* **Master Fasilitas & Lokasi Latihan (`m_locations`)**:
  * Menambah, mengedit, dan menghapus lokasi fasilitas latihan (kolam/lapangan/studio).
  * Mengisi nama venue, area/wilayah, dan alamat lengkap fasilitas.
  * Mengisi titik koordinat GPS patokan (*Latitude* dan *Longitude*).
  * Tombol otomatis *📍 Ambil Titik Koordinat GPS Saat Ini* dari lokasi perangkat manajemen.
  * Mengatur toleransi radius validasi geofence (50 s/d 2.000 meter).
  * **Mapping Program Pelatihan**: Menandai produk pelatihan apa saja yang diselenggarakan di fasilitas ini.
  * Mengisi sarana & fasilitas pendukung (kamar bilas, tribun, zonasi aman, dsb.).
  * Preview peta mini satelit OpenStreetMap dan link Google Maps per lokasi.
* **Paket Kursus & Skema Biaya (`m_packages`)**:
  * Mengatur skema paket per program keahlian.
  * Mengatur nominal harga kursus, rasio peserta per kelas (1:1, 1:2-3, 1:4-6), durasi sesi (45-60 menit), dan jumlah total pertemuan (contoh: 4x pertemuan).
  * Memberikan label badge promosi (*Pilihan Utama, Paling Populer, VIP*).
* **Daftar Instruktur / Coach (`m_coaches`)**:
  * Menambah, mengedit, dan menonaktifkan akun pelatih.
  * Upload foto profil / avatar resmi coach.
  * Mengisi spesialisasi bimbingan, pengalaman melatih, dan bio profil.
  * Memetakan program keahlian apa saja yang boleh diampu oleh coach tersebut.

### 3. Kategori Operasional & Siswa
* **Data Siswa & Wali Murid (`m_students`)**:
  * Pendaftaran murid baru secara manual dari manajemen.
  * Mengedit biodata siswa (usia, tanggal bergabung, nama orang tua, nomor telepon WhatsApp).
  * **Tombol Direct Chat WhatsApp**: Menghubungi orang tua siswa langsung via WhatsApp tanpa simpan nomor manual.
  * **Penugasan Pelatih Terikat (*Coach Locking Mechanism*)**: Menugaskan coach tertentu untuk mengasuh anak selama 4, 8, atau 12 sesi demi menjaga bonding psikologis anak.
  * Menghapus data siswa yang sudah berhenti.
* **Jadwal & Sesi Latihan Siswa (`m_schedules`)**:
  * **Plotting Sesi Latihan Baru**: Menentukan siswa, nomor sesi ke-berapa, hari, tanggal, slot waktu, pelatih pengampu, dan lokasi venue latihan secara dinamis.
  * **Multi-Filter Jadwal**: Filter berdasarkan program pelatihan, pelatih pengampu, dan status sesi.
  * **Presensi & Evaluasi Sesi**: Input status kehadiran murid (*Hadir, Izin, Sakit*) dan catatan evaluasi yang langsung masuk ke raport digital portal siswa.
  * **Fitur Reschedule Fleksibel**: Memindahkan jadwal murid yang berhalangan hadir ke hari, tanggal, slot waktu, pelatih pengganti, atau lokasi lain tanpa menghanguskan kuota sesi.
* **Monitoring Kehadiran Coach (`m_attendance`)**:
  * **Live Audit Log Presensi**: Memantau seluruh aktivitas check-in coach secara real-time.
  * **Multi-Filter**: Filter per nama pelatih, filter status validitas radius (dalam radius ≤ 250m / luar radius), dan filter per fasilitas lokasi.
  * **Audit Titik Koordinat GPS**: Memeriksa koordinat lintang & bujur check-in coach, tingkat akurasi alat, dan jarak meter aktual terhadap titik venue patokan.
  * **Mini Map Preview & Modal Peta Penuh**: Thumbnail mini map yang dapat diklik untuk membuka modal peta satelit lokasi presensi coach.
  * **Tombol Verifikasi Manajemen**: Menandai presensi coach sebagai *✓ Terverifikasi* sebagai syarat sah pencairan honor melatih.

### 4. Kategori Keuangan & Sistem
* **Keuangan & Verifikasi Tagihan (`m_payments`)**:
  * **Daftar Tagihan & Invoice**: Memantau tagihan biaya kursus murid, status lunas, dan tombol verifikasi lunas manual jika orang tua membayar via transfer bank.
  * **Generator QRIS Dinamis (EMVCo & ASPI)**: Mengonversi nominal tagihan ke QRIS dinamis resmi dengan kalkulasi algoritma CRC16 otomatis yang siap di-scan dari seluruh aplikasi perbankan & e-wallet Indonesia.
  * **Rekening Bank**: Menampilkan akun rekening bank penampung milik institusi.
* **Profil Bisnis & Website CMS (`m_website`)**:
  * Mengubah nama brand/akademi, umbrella tagline, nomor WhatsApp call center resmi, email, alamat kantor, dan jam operasional tanpa menyentuh kode program.
  * Mengubah konten teks hero banner beranda publik (badge teks, headline utama, subheadline penjelasan, dan label tombol CTA).
* **Pengaturan Hak Akses (RBAC) & Kredensial (`m_rbac`)**:
  * Mengaudit seluruh akun terdaftar dalam sistem (Customer, Coach, Manajemen).
  * Memantau email login ID, peran (*role*), status keaktifan akun, dan default password (`123`).

---

## 6. Alur Operasional Sistem (End-to-End Workflow)

Berikut adalah skenario alur kerja dari pendaftaran siswa hingga sesi latihan selesai:

```
[1. Orang Tua Mendaftar di Website]
               │
               ▼
[2. Data Masuk ke Portal Manajemen] ──► [Manajemen Mengunci Coach Tetap (Lock 4 Sesi)]
                                                        │
                                                        ▼
                                        [Manajemen Mem-plotting Jadwal Sesi & Venue]
                                                        │
               ┌────────────────────────────────────────┴────────────────────────────────────────┐
               ▼                                                                                 ▼
[3. Orang Tua Melihat Jadwal di Portal Customer]                              [4. Coach Bersiap Mengajar di Lokasi]
               │                                                                                 │
               ▼                                                                                 ▼
[5. Pembayaran via QRIS Dinamis / Transfer]                                    [6. Coach Check-In via GPS Geofence]
               │                                                                                 │
               ▼                                                                                 ▼
[7. Manajemen Memverifikasi Pembayaran Lunas]                                  [8. Coach Mengajar & Input Raport]
                                                                                                 │
                                                                                                 ▼
                                                                               [9. Raport Terkirim via WA & Masuk Portal]
                                                                                                 │
                                                                                                 ▼
                                                                               [10. Anak Lulus Level ──► Terbit E-Sertifikat]
```

---

## 7. Daftar Akun & Kredensial Uji Coba

Sistem telah dilengkapi data *seed* pengujian yang siap digunakan langsung:

| Peran Pengguna | Email Login | Password Default | Akses Menu & Fungsi |
| :--- | :--- | :---: | :--- |
| **Manajemen (Super Admin)** | `admin@mineskills.id` | `123` | Seluruh 10 Menu Manajemen Lengkap |
| **Coach (Instruktur Renang)** | `coach.adit@mineskills.id` | `123` | Portal Pelatih, Presensi GPS, Input Raport & WA |
| **Customer (Orang Tua Siswa)** | `bunda.alya@gmail.com` | `123` | Portal Siswa, Raport Digital, Jadwal, Invoice QRIS |

---
*Dokumentasi ini disusun sebagai acuan resmi operasional platform mine.skills.*
