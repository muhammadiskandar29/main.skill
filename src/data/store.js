import { reactive, watch } from 'vue';
import {
  fetchBootstrap,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiCreatePackage,
  apiUpdatePackage,
  apiDeletePackage,
  apiCreateCoach,
  apiUpdateCoach,
  apiDeleteCoach,
  apiCreateStudent,
  apiUpdateStudent,
  apiCreateSchedule,
  apiUpdateSchedule,
  apiDeleteSchedule,
  apiDeleteStudent,
  apiRegisterCustomer,
  apiVerifyPayment,
  apiLogin,
  uploadImage,
  apiGetCoachAttendances,
  apiRecordCoachAttendance,
  apiVerifyCoachAttendance
} from './api.js';

const STORAGE_KEY = 'mine_skills_auth_session_v3';

// Initial Default Entities (prevents blank screen during initial tick before API resolves)
const initialProducts = [
  {
    id: 'prod_swimming',
    name: 'Skill Renang (Swimming Academy)',
    slug: 'swimming',
    shortDesc: 'Program renang berjenjang dari pengenalan air hingga penguasaan 4 gaya renang kompeten dengan kelas kecil & pengawasan intensif.',
    category: 'Olahraga & Ketangkasan',
    targetAge: 'Usia 4 - 15 Tahun & Dewasa',
    heroImage: '/images/swimming-hero.jpg',
    isActive: true,
    featured: true,
    levels: [
      { levelNumber: 1, title: 'Water Explorer', focus: 'Water Confidence & Basic Freestyle', challenge: '5 Meter Freestyle Challenge' },
      { levelNumber: 2, title: 'Breaststroke Hero', focus: 'Gaya Dada (Kaki, Tarikan & Nafas)', challenge: '10 Meter Breaststroke Challenge' },
      { levelNumber: 3, title: 'Backstroke Master', focus: 'Gaya Punggung (Streamline & Ritme)', challenge: '15 Meter Backstroke Challenge' },
      { levelNumber: 4, title: 'Butterfly Champion', focus: 'Gaya Kupu-kupu (Dolphin Kick & Power)', challenge: '15-25 Meter Butterfly Challenge' }
    ]
  },
  {
    id: 'prod_dance',
    name: 'Skill Tari (Dance & Movement)',
    slug: 'dance',
    shortDesc: 'Latihan motorik, kelenturan, ekspresi artistik melalui tari tradisional Nusantara dan modern dance kreasi baru.',
    category: 'Seni Pertunjukan & Motorik',
    targetAge: 'Usia 5 - 17 Tahun',
    heroImage: '/images/dance-hero.jpg',
    isActive: true,
    featured: false,
    levels: [
      { levelNumber: 1, title: 'Rhythm Starter', focus: 'Postur Tubuh, Fleksibilitas & Ritme Dasar', challenge: 'Koreografi Dasar 1 Menit' },
      { levelNumber: 2, title: 'Graceful Mover', focus: 'Gerak Tari Tradisional (Agem, Seledet)', challenge: 'Penampilan Tarian Pilihan Kelompok' },
      { levelNumber: 3, title: 'Stage Performer', focus: 'Sinkronisasi Musik Cepat & Ekspresi', challenge: 'Ujian Pentas Seni Tahunan' }
    ]
  },
  {
    id: 'prod_driving',
    name: 'Skill Mengemudi (Defensive Driving)',
    slug: 'driving',
    shortDesc: 'Pelatihan mengemudi mobil manual & matic bersertifikasi dengan penekanan safety driving & etika jalan raya.',
    category: 'Kecakapan Hidup (Life Skills)',
    targetAge: 'Usia 17+ Tahun (Persiapan SIM A)',
    heroImage: '/images/driving-hero.jpg',
    isActive: true,
    featured: false,
    levels: [
      { levelNumber: 1, title: 'Basic Controls & Parking', focus: 'Pedal Control, Manuver Halus & Parkir', challenge: 'Uji Parkir Tanpa Koreksi Berulang' },
      { levelNumber: 2, title: 'Urban Traffic Navigator', focus: 'Lalu Lintas Padat & Tanjakan', challenge: 'Rute Jalan Raya Kota & Blind Spot Check' },
      { levelNumber: 3, title: 'Highway & Defensive Driver', focus: 'Kecepatan Tol & Pengereman Darurat', challenge: 'Simulasi Perjalanan Luar Kota' }
    ]
  }
];

const initialPackages = [
  {
    id: 'pkg_swim_group',
    productId: 'prod_swimming',
    productName: 'Skill Renang',
    name: 'Group Class',
    ratio: '4 - 5 anak / kelas',
    price: 400000,
    formattedPrice: 'Rp 400.000',
    duration: '90 menit / sesi',
    meetings: '4x pertemuan',
    badge: 'Paling Populer',
    description: 'Pilihan hemat dengan suasana bersosialisasi yang menyenangkan dan tetap terpantau.'
  },
  {
    id: 'pkg_swim_small',
    productId: 'prod_swimming',
    productName: 'Skill Renang',
    name: 'Small Group',
    ratio: '2 - 3 anak / kelas',
    price: 500000,
    formattedPrice: 'Rp 500.000',
    duration: '90 menit / sesi',
    meetings: '4x pertemuan',
    badge: 'Rekomendasi Coach',
    description: 'Fokus perhatian lebih intensif dengan teman sebaya atau saudara.'
  },
  {
    id: 'pkg_swim_private',
    productId: 'prod_swimming',
    productName: 'Skill Renang',
    name: 'Private Class',
    ratio: '1 anak / kelas (1-on-1)',
    price: 700000,
    formattedPrice: 'Rp 700.000',
    duration: '60 menit / sesi',
    meetings: '4x pertemuan',
    badge: 'Perhatian Penuh',
    description: 'Bimbingan privat 1 pelatih 1 murid, durasi ekstra 60 menit untuk akselerasi maksimal.'
  },
  {
    id: 'pkg_dance_regular',
    productId: 'prod_dance',
    productName: 'Skill Tari',
    name: 'Reguler Class Tari',
    ratio: '6 - 8 anak / kelas',
    price: 350000,
    formattedPrice: 'Rp 350.000',
    duration: '60 menit / sesi',
    meetings: '4x pertemuan',
    badge: 'Populer',
    description: 'Latihan bersama kelompok sebaya dengan bimbingan koreografer berpengalaman.'
  },
  {
    id: 'pkg_driving_manual',
    productId: 'prod_driving',
    productName: 'Skill Mengemudi',
    name: 'Paket Lancar Manual',
    ratio: '1-on-1 Privat Mobil',
    price: 950000,
    formattedPrice: 'Rp 950.000',
    duration: '90 menit / sesi',
    meetings: '5x pertemuan',
    badge: 'Best Value',
    description: 'Paket tuntas jalan raya, tanjakan, parkir, dan pendampingan sertifikasi.'
  }
];

const initialCoaches = [
  {
    id: 'coach_1',
    name: 'Coach Adit',
    email: 'adit.coach@mine.skills.id',
    phone: '085286274726',
    specialty: 'Renang Anak & Water Safety (Head Coach)',
    bio: 'Berpengalaman lebih dari 8 tahun membina anak usia dini hingga remaja dalam penguasaan 4 gaya renang kompeten dan keselamatan air.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    productIds: ['prod_swimming'],
    activeStudentsCount: 14
  },
  {
    id: 'coach_2',
    name: 'Coach Sekar Ayu, S.Sn.',
    email: 'sekar.dance@mine.skills.id',
    phone: '081399887711',
    specialty: 'Seni Tari Nusantara & Modern Ballet',
    bio: 'Lulusan Institut Kesenian Jakarta dengan metode pengajaran gerak berirama yang melatih kelenturan motorik, percaya diri, dan estetika panggung.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
    productIds: ['prod_dance'],
    activeStudentsCount: 8
  }
];

const initialStudents = [
  {
    id: 'stu_1',
    name: 'Kenzo Al-Fatih',
    nickname: 'Kenzo',
    age: 7,
    parentName: 'Bunda Sarah Ramadhani',
    email: 'sarah.ramadhani@gmail.com',
    phone: '081298456721',
    productId: 'prod_swimming',
    productName: 'Skill Renang (Swimming Academy)',
    packageId: 'pkg_swim_small',
    packageName: 'Small Group (Rp 500.000)',
    assignedCoachId: 'coach_1',
    assignedCoachName: 'Coach Adit',
    mappingLockSessions: 4,
    sessionsCompletedWithCoach: 3,
    mappingStatus: 'Terkunci (Sisa 1 Sesi)',
    location: 'Kolam Graha Kresna Pratama Jatiwaringin',
    currentLevel: 2,
    currentLevelTitle: 'Level 2: Breaststroke Hero',
    targetChallenge: '10 Meter Breaststroke Challenge Mandiri',
    packageTotalSessions: 4,
    completedSessions: 3,
    overallProgress: 75,
    status: 'Aktif / Enrolled',
    joinedDate: '1 Oktober 2026',
    memberSchedules: [
      { sessionNo: 1, date: '04 Okt 2026', day: 'Sabtu', time: '09.00 - 09.45 WIB', coach: 'Coach Adit', status: 'Selesai' },
      { sessionNo: 2, date: '11 Okt 2026', day: 'Sabtu', time: '09.00 - 09.45 WIB', coach: 'Coach Adit', status: 'Selesai' },
      { sessionNo: 3, date: '18 Okt 2026', day: 'Sabtu', time: '09.00 - 09.45 WIB', coach: 'Coach Adit', status: 'Selesai' },
      { sessionNo: 4, date: '25 Okt 2026', day: 'Sabtu', time: '09.00 - 09.45 WIB', coach: 'Coach Adit', status: 'Mendatang (Aktif)' }
    ],
    sessionReports: [
      {
        sessionNumber: 3,
        date: '18 Okt 2026',
        coachName: 'Coach Adit',
        focus: 'Simulasi Challenge 10 Meter Gaya Dada Mandiri',
        warmup: 'stretching dinamis & statis',
        mainExercise: 'Simulasi Challenge 10 Meter Gaya Dada Mandiri',
        cooldown: 'bubbling & starfish',
        assessments: [
          { indicator: 'Konsistensi Gaya Dada', score: 'Sangat Baik' },
          { indicator: 'Ketahanan Fisik 45 Menit', score: 'Sangat Baik' },
          { indicator: 'Jarak Tempuh Capaian', score: '8.5 Meter' }
        ],
        coachNotes: 'Kemajuan pesat! Kenzo sudah sangat percaya diri meluncur dan mengambil nafas ritmis.',
        recommendation: 'Sesi berikutnya persiapan tantangan kenaikan level.'
      }
    ]
  }
];

const initialTransactions = [
  {
    id: 'INV-MS-202610-044',
    studentId: 'stu_1',
    studentName: 'Kenzo Al-Fatih',
    parentName: 'Bunda Sarah Ramadhani',
    phone: '081298456721',
    productId: 'prod_swimming',
    productName: 'Skill Renang',
    packageId: 'pkg_swim_small',
    packageName: 'Small Group (Rp 500.000)',
    amount: 500000,
    formattedAmount: 'Rp 500.000',
    paymentMethod: 'qris',
    paymentMethodName: 'QRIS Dinamis ASPI',
    status: 'Lunas (Verified)',
    paidAt: '2026-10-02 14:22',
    notes: 'Pembayaran pendaftaran QRIS lunas'
  }
];

const initialUsers = [
  {
    id: 'usr_admin_1',
    name: 'Iskandar & Tim Manajemen',
    email: 'admin@mine.skills.id',
    role: 'manajemen',
    phone: '085286274726'
  },
  {
    id: 'usr_coach_1',
    name: 'Coach Adit',
    email: 'adit.coach@mine.skills.id',
    role: 'coach',
    phone: '085286274726'
  },
  {
    id: 'usr_cust_1',
    name: 'Bunda Sarah Ramadhani',
    email: 'sarah.ramadhani@gmail.com',
    role: 'customer',
    phone: '081298456721',
    student_id: 'stu_1'
  }
];

const initialLocations = [
  {
    id: 'jatiwaringin',
    name: 'Kolam Graha Kresna Pratama',
    area: 'Jatiwaringin, Pondok Gede',
    address: 'Komplek Graha Kresna Pratama, Jl. Raya Jatiwaringin No. 45, Pondok Gede, Kota Bekasi'
  }
];

const initialCoachAttendances = [
  {
    id: 'att_init_1',
    coachId: 'coach_1',
    coachName: 'Coach Adit',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    date: '26 Okt 2026',
    time: '07:48 WIB',
    timestamp: Date.now() - 3600000,
    sessionType: 'Sesi Pagi (08.00 - 09.30 WIB)',
    locationName: 'Kolam Graha Kresna Pratama, Jatiwaringin',
    latitude: -6.284715,
    longitude: 106.914292,
    accuracy: 8,
    distanceFromVenue: 15,
    status: 'Hadir di Lokasi',
    isVerified: true,
    notes: 'Sesi latihan pembinaan Small Group Renang Gaya Dada'
  },
  {
    id: 'att_init_2',
    coachId: 'coach_2',
    coachName: 'Coach Sekar Ayu, S.Sn.',
    coachAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
    date: '26 Okt 2026',
    time: '08:05 WIB',
    timestamp: Date.now() - 1800000,
    sessionType: 'Sesi Pagi (08.00 - 09.30 WIB)',
    locationName: 'Kolam Graha Kresna Pratama, Jatiwaringin',
    latitude: -6.284680,
    longitude: 106.914350,
    accuracy: 12,
    distanceFromVenue: 22,
    status: 'Hadir di Lokasi',
    isVerified: true,
    notes: 'Pendampingan pemanasan kelas motorik'
  }
];

const initialBrand = {
  name: 'mine.skills',
  logoPath: '/images/mine-skills-logo.png',
  umbrellaTagline: 'Pusat Pembinaan & Akselerasi Potensi Anak',
  callCenter: '085286274726',
  callCenterDisplay: '085286274726',
  officialEmail: 'halo@mineskills.id',
  primaryLocation: 'Kolam Graha Kresna Pratama, Jatiwaringin',
  addressFull: 'Komplek Graha Kresna Pratama, Jl. Raya Jatiwaringin No. 45, Pondok Gede, Kota Bekasi',
  operatingHours: 'Setiap Hari: 07.30 - 18.00 WIB'
};

const initialHero = {
  badgeText: 'AKADEMI PENGEMBANGAN SKILL TERSTRUKTUR & BERSERTIFIKASI',
  headline: 'Pusat Pembinaan & Akselerasi Potensi Anak Berjenjang',
  subheadline: 'Ekosistem pembinaan bakat profesional dengan rasio kelas kecil dan instruktur terverifikasi. Didukung kurikulum terukur agar setiap anak menguasai skill dengan aman, gembira, dan percaya diri.',
  primaryCta: 'Daftar Sekarang',
  secondaryCta: 'Lihat Program Pelatihan',
  heroImage: '/images/swimming-hero.jpg'
};

const initialPaymentConfig = {
  rawQrisStatic: '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB',
  merchantName: 'MINE.SKILLS INDONESIA',
  merchantCity: 'JAKARTA',
  nmid: 'ID1020038847291',
  bankAccounts: [
    {
      id: 'bca',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8420991823',
      accountHolder: 'YAYASAN MINE SKILLS INDONESIA',
      badge: 'Verifikasi Otomatis'
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '1560019283741',
      accountHolder: 'MINE SKILLS ACADEMY',
      badge: 'Cek Manual'
    }
  ]
};

const initialRbacMatrix = {
  customer: {
    roleName: 'Customer (Orang Tua / Siswa)',
    badgeColor: '#0d9488',
    allowedMenus: ['c_overview', 'c_progress', 'c_schedule', 'c_certificates', 'c_billing', 'c_payment_checkout']
  },
  coach: {
    roleName: 'Coach (Pelatih / Instruktur)',
    badgeColor: '#e5a024',
    allowedMenus: ['co_overview', 'co_schedule', 'co_input_progress', 'co_attendance', 'co_students']
  },
  manajemen: {
    roleName: 'Manajemen (Admin CMS & CRM)',
    badgeColor: '#0f766e',
    allowedMenus: [
      'm_overview',
      'm_products',
      'm_packages',
      'm_coaches',
      'm_students',
      'm_schedules',
      'm_attendance',
      'm_payments',
      'm_rbac'
    ]
  }
};

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentRole: parsed.currentRole || 'public',
        currentUser: parsed.currentUser || null
      };
    }
  } catch (e) {
    console.warn('Failed to parse session:', e);
  }
  return { currentRole: 'public', currentUser: null };
}

const savedSession = loadSavedSession();

// Create reactive store
export const store = reactive({
  currentRole: savedSession.currentRole || 'public',
  currentUser: savedSession.currentUser || null,
  activePublicPage: 'home', // 'home' | 'programs' | 'pricing' | 'coaches' | 'locations' | 'contact'
  activePortalMenu: 'm_overview',
  isLoading: false,

  products: initialProducts,
  packages: initialPackages,
  coaches: initialCoaches,
  students: initialStudents,
  transactions: initialTransactions,
  users: initialUsers,
  locations: initialLocations,
  coachAttendances: initialCoachAttendances,

  brand: initialBrand,
  hero: initialHero,
  paymentConfig: initialPaymentConfig,
  rbacMatrix: initialRbacMatrix,

  usps: [
    { id: 1, title: 'Kelas Kecil', subtitle: 'Maksimal 4-5 anak untuk hasil optimal dan pengawasan intensif' },
    { id: 2, title: 'Aman & Nyaman', subtitle: 'Mengutamakan keselamatan anak dengan standar water safety ketat' },
    { id: 3, title: 'Sistem Level', subtitle: 'Kurikulum terstruktur Level 1 - 4 dengan capaian milestone terukur' },
    { id: 4, title: 'Swimming Report', subtitle: 'Pantau progress dan evaluasi kemampuan anak setiap sesi' }
  ]
});

// Define reactive getters directly on the store object so they are NEVER lost!
Object.defineProperty(store, 'cms', {
  get() {
    return {
      brand: store.brand,
      hero: store.hero,
      programs: store.products,
      packages: store.packages,
      locations: store.locations,
      usps: store.usps
    };
  },
  enumerable: true
});

Object.defineProperty(store, 'mockUsers', {
  get() {
    return store.users;
  },
  enumerable: true
});

Object.defineProperty(store, 'leads', {
  get() {
    return (store.students || []).map(s => ({
      id: `lead_${s.id}`,
      studentName: s.name,
      studentAge: s.age,
      parentName: s.parentName,
      phone: s.phone,
      program: s.productName || s.program || 'Skill Renang',
      packageType: s.packageName || s.packageType || 'Small Group',
      schedulePref: s.memberSchedules?.[0]?.day ? `${s.memberSchedules[0].day} (${s.memberSchedules[0].time})` : 'Sabtu Pagi',
      location: s.location,
      notes: s.notes || '',
      status: s.status,
      createdAt: s.joinedDate
    }));
  },
  enumerable: true
});

Object.defineProperty(store, 'classes', {
  get() {
    return [
      {
        id: 'cls_swim_group_sabtu',
        name: 'Renang Group Sabtu Pagi',
        productName: 'Skill Renang',
        coachName: 'Coach Dimas Prasetyo, S.Or.',
        day: 'Sabtu',
        time: '08.00 - 08.45 WIB',
        location: 'Kolam Graha Kresna Pratama',
        capacityMax: 5,
        capacityFilled: 4,
        studentNames: ['Kenzo Al-Fatih', 'Danendra Arya', 'Bima Sakti', 'Farhan']
      },
      {
        id: 'cls_swim_small_sabtu',
        name: 'Renang Small Group Sabtu Siang',
        productName: 'Skill Renang',
        coachName: 'Coach Dimas Prasetyo, S.Or.',
        day: 'Sabtu',
        time: '09.00 - 09.45 WIB',
        location: 'Kolam Graha Kresna Pratama',
        capacityMax: 3,
        capacityFilled: 2,
        studentNames: ['Kenzo Al-Fatih', 'Danendra Arya']
      },
      {
        id: 'cls_swim_private_minggu',
        name: 'Renang Private Minggu Pagi',
        productName: 'Skill Renang',
        coachName: 'Coach Dimas Prasetyo, S.Or.',
        day: 'Minggu',
        time: '08.00 - 09.00 WIB',
        location: 'Kolam Graha Kresna Pratama',
        capacityMax: 1,
        capacityFilled: 1,
        studentNames: ['Alya Putri Zahra']
      }
    ];
  },
  enumerable: true
});

// Auto persist session
watch(
  () => [store.currentRole, store.currentUser],
  ([role, user]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentRole: role, currentUser: user }));
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  }
);

export const actions = {
  // Bootstrap data from backend database
  async init() {
    try {
      store.isLoading = true;
      const data = await fetchBootstrap();
      if (data) {
        if (Array.isArray(data.products) && data.products.length > 0) {
          store.products = data.products;
        }
        if (Array.isArray(data.coaches) && data.coaches.length > 0) {
          store.coaches = data.coaches;
        }
        if (Array.isArray(data.packages) && data.packages.length > 0) {
          store.packages = data.packages;
        }
        if (Array.isArray(data.students) && data.students.length > 0) {
          store.students = data.students;
        }
        if (Array.isArray(data.transactions) && data.transactions.length > 0) {
          store.transactions = data.transactions;
        }
        if (Array.isArray(data.users) && data.users.length > 0) {
          store.users = data.users;
        }
        if (Array.isArray(data.locations) && data.locations.length > 0) {
          store.locations = data.locations;
        }
        if (Array.isArray(data.coachAttendances) && data.coachAttendances.length > 0) {
          store.coachAttendances = data.coachAttendances;
        }

        // Set default current user if role matches
        if (store.currentRole !== 'public' && !store.currentUser) {
          const matched = store.users.find(u => u.role === store.currentRole);
          if (matched) store.currentUser = matched;
        }
      }
    } catch (err) {
      console.warn('[Store] API bootstrap error (using local cache):', err.message);
    } finally {
      store.isLoading = false;
    }
  },

  // Role Switcher
  switchRole(roleId) {
    store.currentRole = roleId;
    if (roleId === 'public') {
      store.currentUser = null;
      return;
    }
    const foundUser = store.users.find(u => u.role === roleId);
    store.currentUser = foundUser || store.users[0] || null;

    if (roleId === 'customer') store.activePortalMenu = 'c_overview';
    else if (roleId === 'coach') store.activePortalMenu = 'co_overview';
    else if (roleId === 'manajemen') store.activePortalMenu = 'm_overview';
  },

  // Login
  async login(email, password) {
    const user = await apiLogin(email, password);
    store.currentUser = user;
    store.currentRole = user.role;
    if (user.role === 'customer') store.activePortalMenu = 'c_overview';
    else if (user.role === 'coach') store.activePortalMenu = 'co_overview';
    else if (user.role === 'manajemen') store.activePortalMenu = 'm_overview';
    return user;
  },

  // Image Upload helper
  async uploadImage(file, folder) {
    return await uploadImage(file, folder);
  },

  // Products CRUD
  async addProduct(productData) {
    const created = await apiCreateProduct(productData);
    await this.init();
    return created;
  },

  async updateProduct(id, updatedData) {
    const updated = await apiUpdateProduct(id, updatedData);
    await this.init();
    return updated;
  },

  async deleteProduct(id) {
    await apiDeleteProduct(id);
    await this.init();
  },

  // Packages CRUD (Dinamis 1 - 20 Paket per Produk)
  async addPackage(pkgData) {
    const created = await apiCreatePackage(pkgData);
    await this.init();
    return created;
  },

  async updatePackage(id, patch) {
    const updated = await apiUpdatePackage(id, patch);
    await this.init();
    return updated;
  },

  async deletePackage(id) {
    await apiDeletePackage(id);
    await this.init();
  },

  // Coaches CRUD (Auto-creates User with password 123)
  async addCoach(coachData) {
    const created = await apiCreateCoach(coachData);
    await this.init();
    return created;
  },

  async updateCoach(id, patch) {
    const updated = await apiUpdateCoach(id, patch);
    await this.init();
    return updated;
  },

  async deleteCoach(id) {
    await apiDeleteCoach(id);
    await this.init();
  },

  // Customer Registration Flow
  async registerLead(regData) {
    const result = await apiRegisterCustomer(regData);
    await this.init();
    return result;
  },

  // Students CRUD
  async addStudent(studentData) {
    const created = await apiCreateStudent(studentData);
    await this.init();
    return created;
  },

  async updateStudent(id, patch) {
    const updated = await apiUpdateStudent(id, patch);
    await this.init();
    return updated;
  },

  async deleteStudent(id) {
    await apiDeleteStudent(id);
    await this.init();
  },

  // Schedules Dynamic CRUD
  async addSchedule(scheduleData) {
    const created = await apiCreateSchedule(scheduleData);
    await this.init();
    return created;
  },

  async updateSchedule(scheduleId, patch) {
    const updated = await apiUpdateSchedule(scheduleId, patch);
    await this.init();
    return updated;
  },

  async deleteSchedule(scheduleId) {
    await apiDeleteSchedule(scheduleId);
    await this.init();
  },

  // Assign / Reassign Coach to Student (with session lock count)
  async assignCoachToStudent(studentId, coachId, lockSessionsCount = 4) {
    const coach = store.coaches.find(c => c.id === coachId);
    if (!coach) return false;

    await apiUpdateStudent(studentId, {
      assignedCoachId: coach.id,
      assignedCoachName: coach.name,
      mappingLockSessions: lockSessionsCount,
      sessionsCompletedWithCoach: 0,
      mappingStatus: `Terkunci (${lockSessionsCount} Sesi Terikat)`
    });
    await this.init();
    return true;
  },

  // Payment Verification
  async verifyPayment(invoiceId) {
    const res = await apiVerifyPayment(invoiceId);
    await this.init();
    return res;
  },

  // Session Evaluation Report (Coach Role)
  async addSessionReport(studentId, reportData) {
    const student = (store.students || []).find(s => s.id === studentId);
    if (!student) return false;

    if (!Array.isArray(student.sessionReports)) {
      student.sessionReports = [];
    }

    const reportItem = {
      id: `rep_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      level: reportData.level || `Level ${student.currentLevel || 1}`,
      sessionNumber: reportData.sessionNumber || (student.sessionReports.length + 1),
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      warmup: reportData.warmup || 'stretching dinamis & statis',
      mainExercise: reportData.mainExercise || reportData.focus || '',
      cooldown: reportData.cooldown || 'bubbling & starfish',
      coachNotes: reportData.coachNotes || '',
      coachName: reportData.coachName || 'Coach Adit',
      score1: reportData.score1 || 'Baik',
      score2: reportData.score2 || 'Baik',
      score3: reportData.score3 || 'Baik'
    };

    student.sessionReports.push(reportItem);

    const patch = { sessionReports: student.sessionReports };
    if (reportData.promoteLevel) {
      patch.currentLevel = (parseInt(student.currentLevel) || 1) + 1;
      patch.currentLevelTitle = `Level ${patch.currentLevel}`;
    }

    await this.updateStudent(studentId, patch);
    return reportItem;
  },

  // Coach Attendance & Geolocation Actions
  async recordCoachAttendance(payload) {
    try {
      const recorded = await apiRecordCoachAttendance(payload);
      // Prepend to local store list
      const existingIdx = (store.coachAttendances || []).findIndex(a => a.id === recorded.id);
      if (existingIdx > -1) {
        store.coachAttendances[existingIdx] = recorded;
      } else {
        store.coachAttendances = [recorded, ...(store.coachAttendances || [])];
      }
      return recorded;
    } catch (err) {
      console.warn('[Store] API recordCoachAttendance failed, saving locally:', err.message);
      const fallbackRecord = {
        id: `att_${Date.now()}`,
        coachId: payload.coachId || 'coach_1',
        coachName: payload.coachName || 'Coach Adit',
        coachAvatar: payload.coachAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
        date: payload.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: payload.time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        timestamp: Date.now(),
        sessionType: payload.sessionType || 'Sesi Pagi (08.00 - 09.30 WIB)',
        locationName: payload.locationName || 'Kolam Graha Kresna Pratama, Jatiwaringin',
        latitude: parseFloat(payload.latitude) || -6.2847,
        longitude: parseFloat(payload.longitude) || 106.9142,
        accuracy: payload.accuracy ? Math.round(payload.accuracy) : 10,
        distanceFromVenue: payload.distanceFromVenue || 15,
        status: payload.status || 'Hadir di Lokasi',
        isVerified: true,
        notes: payload.notes || 'Presensi mandiri pelatih dengan GPS real-time'
      };
      store.coachAttendances = [fallbackRecord, ...(store.coachAttendances || [])];
      return fallbackRecord;
    }
  },

  async verifyCoachAttendance(id) {
    try {
      const verified = await apiVerifyCoachAttendance(id);
      const match = (store.coachAttendances || []).find(a => a.id === id);
      if (match) {
        match.isVerified = true;
        match.verifiedAt = verified.verifiedAt;
      }
      return verified;
    } catch (err) {
      const match = (store.coachAttendances || []).find(a => a.id === id);
      if (match) {
        match.isVerified = true;
        match.verifiedAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
      }
      return match;
    }
  },

  cleanWaNumber(phoneStr) {
    if (!phoneStr) return '';
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  },

  buildWhatsAppUrl(lead, template = 'welcome') {
    const targetPhone = this.cleanWaNumber(lead.phone || store.brand.callCenter);
    let message = '';

    if (template === 'welcome') {
      message = `Halo Kak/Bunda ${lead.parentName},\n\nTerima kasih telah mendaftar di *${store.brand.name}* untuk ananda *${lead.studentName}* (${lead.studentAge} th).\n\n📌 *Detail Pilihan:*\n• Program: ${lead.program || lead.productName}\n• Paket: ${lead.packageType || lead.packageName}\n• Lokasi: ${lead.location}\n\nJadwal 4 sesi resmi telah tersimpan. Silakan login ke portal siswa dengan email Anda dan default password: *123*.\n\nApakah ada pertanyaan sebelum sesi pertama?`;
    } else if (template === 'invoice') {
      message = `Halo Ayah/Bunda ${lead.parentName},\n\nBerikut rincian tagihan pendaftaran *${store.brand.name}* ananda *${lead.studentName}*:\n\n• Paket: ${lead.packageType || lead.packageName}\n• Pembayaran: QRIS Dinamis ASPI / Transfer BCA\n\nDefault login portal: *123*. Terima kasih!`;
    }

    return `https://web.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;
  },

  toggleRbacPermission(roleKey, menuKey) {
    const matrix = store.rbacMatrix[roleKey];
    if (!matrix) return;
    const idx = matrix.allowedMenus.indexOf(menuKey);
    if (idx > -1) {
      matrix.allowedMenus.splice(idx, 1);
    } else {
      matrix.allowedMenus.push(menuKey);
    }
  }
};

// Initial bootstrap trigger
actions.init();
