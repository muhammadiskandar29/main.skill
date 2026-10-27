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
  apiVerifyCoachAttendance,
  apiGetLocations,
  apiCreateLocation,
  apiUpdateLocation,
  apiDeleteLocation,
  apiGetPaymentConfig,
  apiUpdatePaymentConfig,
  apiAddBankAccount,
  apiUpdateBankAccount,
  apiDeleteBankAccount,
  apiGetBrandConfig,
  apiUpdateBrandConfig,
  apiGetHeroConfig,
  apiUpdateHeroConfig
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
    locationIds: ['loc_jatiwaringin', 'loc_galaxy', 'loc_raden_inten'],
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
    locationIds: ['loc_raden_inten'],
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
    ],
    radarSkills: {
      baseline: {
        waterConfidence: 55,
        breathControl: 45,
        strokeTechnique: 40,
        bodyBalance: 50,
        disciplineFocus: 60
      },
      current: {
        waterConfidence: 92,
        breathControl: 85,
        strokeTechnique: 88,
        bodyBalance: 90,
        disciplineFocus: 85
      },
      pillars: [
        { key: 'waterConfidence', label: 'Keberanian Air (Water Confidence)', icon: '🌊', desc: 'Adaptasi dan ketenangan di dalam air tanpa panik' },
        { key: 'breathControl', label: 'Ketahanan Nafas (Breath Control)', icon: '🫁', desc: 'Pengambilan nafas ritmis dan ketahanan paru-paru' },
        { key: 'strokeTechnique', label: 'Teknik Gerak (Propulsion)', icon: '🏊‍♂️', desc: 'Ayunan tangan dan kekuatan dorongan kaki' },
        { key: 'bodyBalance', label: 'Keseimbangan (Streamline)', icon: '⚖️', desc: 'Posisi tubuh mendatar sejajar permukaan air' },
        { key: 'disciplineFocus', label: 'Fokus & Mental (Discipline)', icon: '🎯', desc: 'Konsentrasi mendengarkan instruksi coach di kolam' }
      ]
    }
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
    id: 'loc_jatiwaringin',
    name: 'Kolam Graha Kresna Pratama',
    area: 'Jatiwaringin, Pondok Gede',
    address: 'Komplek Graha Kresna Pratama, Jl. Raya Jatiwaringin No. 45, Pondok Gede, Kota Bekasi',
    latitude: -6.2847,
    longitude: 106.9142,
    radiusMeters: 250,
    productIds: ['prod_swimming'],
    facilities: 'Kolam Semi-Olympic 25M, Area Dangkal Anak (80cm), Ruang Bilas Air Hangat, Parkir Luas, Kantin',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    isActive: true
  },
  {
    id: 'loc_galaxy',
    name: 'Kolam Renang Tirta Mas Galaxy',
    area: 'Grand Galaxy City, Bekasi Selatan',
    address: 'Jl. Boulevard Raya Barat No. 1, Jaka Setia, Bekasi Selatan, Kota Bekasi',
    latitude: -6.2682,
    longitude: 106.9741,
    radiusMeters: 250,
    productIds: ['prod_swimming'],
    facilities: 'Kolam Kanopi Ramah Anak, Kolam Standar Dewasa, Gazebo Tunggu Beratap, Loker Aman',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=600',
    isActive: true
  },
  {
    id: 'loc_raden_inten',
    name: 'Sport Center Raden Inten',
    area: 'Duren Sawit, Jakarta Timur',
    address: 'Jl. Raden Inten II No. 8, Duren Sawit, Kota Jakarta Timur',
    latitude: -6.2365,
    longitude: 106.9157,
    radiusMeters: 300,
    productIds: ['prod_swimming', 'prod_dance'],
    facilities: 'Studio Tari Berlantai Kayu & Kaca Penuh, Kolam Renang Indoor, Area Tunggu Nyaman AC',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=600',
    isActive: true
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
  qrisImageUrl: '',
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
      'm_locations',
      'm_packages',
      'm_coaches',
      'm_students',
      'm_schedules',
      'm_attendance',
      'm_payments',
      'm_website',
      'm_rbac'
    ]
  }
};

export function persistLocalStore(key, data) {
  try {
    localStorage.setItem(`mine_skills_${key}_v1`, JSON.stringify(data));
  } catch (e) {
    console.warn(`[Store] LocalStorage write error for ${key}:`, e);
  }
}

export function loadLocalStore(key, fallback) {
  try {
    const raw = localStorage.getItem(`mine_skills_${key}_v1`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length > 0) return parsed;
      if (!Array.isArray(fallback) && typeof parsed === 'object' && parsed !== null) return { ...fallback, ...parsed };
    }
  } catch (e) {
    console.warn(`[Store] LocalStorage read error for ${key}:`, e);
  }
  return fallback;
}

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

  products: loadLocalStore('products', initialProducts),
  packages: loadLocalStore('packages', initialPackages),
  coaches: loadLocalStore('coaches', initialCoaches),
  students: loadLocalStore('students', initialStudents),
  transactions: loadLocalStore('transactions', initialTransactions),
  users: loadLocalStore('users', initialUsers),
  locations: loadLocalStore('locations', initialLocations),
  coachAttendances: loadLocalStore('coachAttendances', initialCoachAttendances),

  brand: loadLocalStore('brand', initialBrand),
  hero: loadLocalStore('hero', initialHero),
  paymentConfig: loadLocalStore('paymentConfig', initialPaymentConfig),
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
          persistLocalStore('products', store.products);
        }
        if (Array.isArray(data.coaches) && data.coaches.length > 0) {
          store.coaches = data.coaches;
          persistLocalStore('coaches', store.coaches);
        }
        if (Array.isArray(data.packages) && data.packages.length > 0) {
          store.packages = data.packages;
          persistLocalStore('packages', store.packages);
        }
        if (Array.isArray(data.students) && data.students.length > 0) {
          store.students = data.students;
          persistLocalStore('students', store.students);
        }
        if (Array.isArray(data.transactions) && data.transactions.length > 0) {
          store.transactions = data.transactions;
          persistLocalStore('transactions', store.transactions);
        }
        if (Array.isArray(data.users) && data.users.length > 0) {
          store.users = data.users;
          persistLocalStore('users', store.users);
        }
        if (Array.isArray(data.locations) && data.locations.length > 0) {
          store.locations = data.locations;
          persistLocalStore('locations', store.locations);
        }
        if (Array.isArray(data.coachAttendances) && data.coachAttendances.length > 0) {
          store.coachAttendances = data.coachAttendances;
          persistLocalStore('coachAttendances', store.coachAttendances);
        }
        if (data.paymentConfig) {
          store.paymentConfig = {
            ...store.paymentConfig,
            ...data.paymentConfig
          };
          persistLocalStore('paymentConfig', store.paymentConfig);
        }
        if (data.brand) {
          store.brand = {
            ...store.brand,
            ...data.brand
          };
          persistLocalStore('brand', store.brand);
        }
        if (data.hero) {
          store.hero = {
            ...store.hero,
            ...data.hero
          };
          persistLocalStore('hero', store.hero);
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

  // -------------------------------------------------------------
  // PRODUCTS CRUD (Instant Optimistic & Background Sync)
  // -------------------------------------------------------------
  async addProduct(productData) {
    const id = productData.id || `prod_${Date.now()}`;
    let formattedLevels = [
      { levelNumber: 1, title: 'Dasar / Starter', focus: 'Pengenalan & Teori Dasar', challenge: 'Uji Teori & Praktik Awal' },
      { levelNumber: 2, title: 'Praktik Menengah', focus: 'Penguasaan Teknik Inti', challenge: 'Simulasi Mandiri' },
      { levelNumber: 3, title: 'Tingkat Mahir', focus: 'Evaluasi & Sertifikasi', challenge: 'Ujian Kelulusan' }
    ];
    if (Array.isArray(productData.levels) && productData.levels.length > 0) {
      formattedLevels = productData.levels.map((lvl, idx) => ({
        levelNumber: parseInt(lvl.levelNumber) || (idx + 1),
        title: lvl.title?.trim() || `Level ${idx + 1}`,
        focus: lvl.focus?.trim() || '',
        challenge: lvl.challenge?.trim() || ''
      }));
    }

    const newProduct = {
      id,
      name: productData.name?.trim() || 'Program Pelatihan Baru',
      slug: productData.slug || productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id,
      shortDesc: productData.shortDesc?.trim() || '',
      category: productData.category || 'Olahraga & Ketangkasan',
      targetAge: productData.targetAge || 'Semua Usia',
      heroImage: productData.heroImage || '/images/swimming-hero.jpg',
      isActive: productData.isActive !== false,
      featured: Boolean(productData.featured),
      locationIds: Array.isArray(productData.locationIds) ? productData.locationIds : [],
      levels: formattedLevels
    };

    store.products = [...(store.products || []), newProduct];
    persistLocalStore('products', store.products);

    // Auto-create default package for this new product if none exists
    const hasPkg = (store.packages || []).some(p => p.productId === id);
    if (!hasPkg) {
      const defaultPkg = {
        id: `pkg_${id}_reguler`,
        productId: id,
        productName: newProduct.name,
        name: 'Reguler Class',
        ratio: '3 - 4 anak / kelas',
        price: 450000,
        formattedPrice: 'Rp 450.000',
        duration: '45 menit / sesi',
        meetings: '4x pertemuan',
        badge: 'Pilihan Populer',
        description: 'Sesi latihan terpandu dengan kurikulum berjenjang'
      };
      store.packages = [...(store.packages || []), defaultPkg];
      persistLocalStore('packages', store.packages);
      apiCreatePackage(defaultPkg).catch(e => console.warn('[Store] Default package sync:', e.message));
    }

    // Background sync to DB
    apiCreateProduct(newProduct).then(res => {
      if (res && res.id && res.id !== id) {
        newProduct.id = res.id;
        persistLocalStore('products', store.products);
      }
    }).catch(err => {
      console.warn('[Store] apiCreateProduct background sync warning:', err.message);
    });

    return newProduct;
  },

  async updateProduct(id, updatedData) {
    const idx = (store.products || []).findIndex(p => p.id === id);
    if (idx > -1) {
      if (Array.isArray(updatedData.levels)) {
        updatedData.levels = updatedData.levels.map((lvl, i) => ({
          levelNumber: parseInt(lvl.levelNumber) || (i + 1),
          title: lvl.title?.trim() || `Level ${i + 1}`,
          focus: lvl.focus?.trim() || '',
          challenge: lvl.challenge?.trim() || ''
        }));
      }
      Object.assign(store.products[idx], updatedData);
      persistLocalStore('products', store.products);

      // Propagate product name changes to linked packages and students
      if (updatedData.name) {
        (store.packages || []).forEach(pkg => {
          if (pkg.productId === id) pkg.productName = updatedData.name;
        });
        persistLocalStore('packages', store.packages);

        (store.students || []).forEach(stu => {
          if (stu.productId === id) stu.productName = updatedData.name;
        });
        persistLocalStore('students', store.students);
      }
    }

    apiUpdateProduct(id, updatedData).catch(err => {
      console.warn('[Store] apiUpdateProduct background sync warning:', err.message);
    });

    return store.products[idx];
  },

  async deleteProduct(id) {
    store.products = (store.products || []).filter(p => p.id !== id);
    store.packages = (store.packages || []).filter(p => p.productId !== id);
    persistLocalStore('products', store.products);
    persistLocalStore('packages', store.packages);

    apiDeleteProduct(id).catch(err => {
      console.warn('[Store] apiDeleteProduct background sync warning:', err.message);
    });

    return true;
  },

  // -------------------------------------------------------------
  // PACKAGES CRUD (Dinamis 1 - 20 Paket per Produk)
  // -------------------------------------------------------------
  async addPackage(pkgData) {
    const id = pkgData.id || `pkg_${Date.now()}`;
    const prod = (store.products || []).find(p => p.id === pkgData.productId);
    const priceNum = parseInt(pkgData.price) || 450000;
    const newPkg = {
      id,
      productId: pkgData.productId || store.products[0]?.id || 'prod_swimming',
      productName: prod?.name || pkgData.productName || 'Program Skill',
      name: pkgData.name?.trim() || 'Paket Kursus Baru',
      ratio: pkgData.ratio || '3 - 4 anak / kelas',
      price: priceNum,
      formattedPrice: `Rp ${priceNum.toLocaleString('id-ID')}`,
      duration: pkgData.duration || '45 menit / sesi',
      meetings: pkgData.meetings || '4x pertemuan',
      badge: pkgData.badge || '',
      description: pkgData.description || ''
    };

    store.packages = [...(store.packages || []), newPkg];
    persistLocalStore('packages', store.packages);

    apiCreatePackage(newPkg).catch(err => {
      console.warn('[Store] apiCreatePackage background sync warning:', err.message);
    });

    return newPkg;
  },

  async updatePackage(id, patch) {
    const idx = (store.packages || []).findIndex(p => p.id === id);
    if (idx > -1) {
      if (patch.price !== undefined) {
        const priceNum = parseInt(patch.price) || 0;
        patch.price = priceNum;
        patch.formattedPrice = `Rp ${priceNum.toLocaleString('id-ID')}`;
      }
      if (patch.productId) {
        const prod = (store.products || []).find(p => p.id === patch.productId);
        if (prod) patch.productName = prod.name;
      }
      Object.assign(store.packages[idx], patch);
      persistLocalStore('packages', store.packages);
    }

    apiUpdatePackage(id, patch).catch(err => {
      console.warn('[Store] apiUpdatePackage background sync warning:', err.message);
    });

    return store.packages[idx];
  },

  async deletePackage(id) {
    store.packages = (store.packages || []).filter(p => p.id !== id);
    persistLocalStore('packages', store.packages);

    apiDeletePackage(id).catch(err => {
      console.warn('[Store] apiDeletePackage background sync warning:', err.message);
    });

    return true;
  },

  // -------------------------------------------------------------
  // LOCATIONS DYNAMIC CRUD (Master Fasilitas & Geofence)
  // -------------------------------------------------------------
  async addLocation(locData) {
    const id = locData.id || `loc_${Date.now()}`;
    const newLoc = {
      id,
      name: locData.name?.trim() || 'Lokasi Baru',
      area: locData.area?.trim() || '',
      address: locData.address?.trim() || '',
      latitude: parseFloat(locData.latitude) || -6.2847,
      longitude: parseFloat(locData.longitude) || 106.9142,
      radiusMeters: parseInt(locData.radiusMeters) || 250,
      productIds: Array.isArray(locData.productIds) && locData.productIds.length > 0 ? locData.productIds : [(store.products[0]?.id || 'prod_swimming')],
      facilities: locData.facilities || 'Fasilitas lengkap',
      image: locData.image || 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
      isActive: locData.isActive !== false
    };

    store.locations = [...(store.locations || []), newLoc];
    persistLocalStore('locations', store.locations);

    apiCreateLocation(newLoc).catch(err => {
      console.warn('[Store] apiCreateLocation background sync warning:', err.message);
    });

    return newLoc;
  },

  async updateLocation(id, patch) {
    const idx = (store.locations || []).findIndex(l => l.id === id);
    if (idx > -1) {
      if (patch.latitude !== undefined) patch.latitude = parseFloat(patch.latitude);
      if (patch.longitude !== undefined) patch.longitude = parseFloat(patch.longitude);
      if (patch.radiusMeters !== undefined) patch.radiusMeters = parseInt(patch.radiusMeters);
      Object.assign(store.locations[idx], patch);
      persistLocalStore('locations', store.locations);
    }

    apiUpdateLocation(id, patch).catch(err => {
      console.warn('[Store] apiUpdateLocation background sync warning:', err.message);
    });

    return store.locations[idx];
  },

  async deleteLocation(id) {
    store.locations = (store.locations || []).filter(l => l.id !== id);
    persistLocalStore('locations', store.locations);

    apiDeleteLocation(id).catch(err => {
      console.warn('[Store] apiDeleteLocation background sync warning:', err.message);
    });

    return true;
  },

  // -------------------------------------------------------------
  // COACHES CRUD (Auto-creates User with password 123)
  // -------------------------------------------------------------
  async addCoach(coachData) {
    const id = coachData.id || `coach_${Date.now()}`;
    const newCoach = {
      id,
      name: coachData.name?.trim() || 'Instruktur Baru',
      email: coachData.email?.trim() || `${coachData.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'coach'}@mineskills.id`,
      phone: coachData.phone || '081234567890',
      specialty: coachData.specialty || 'Instruktur Keahlian',
      bio: coachData.bio || 'Pelatih bersertifikasi profesional.',
      avatar: coachData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
      productIds: Array.isArray(coachData.productIds) && coachData.productIds.length > 0 ? coachData.productIds : [(store.products[0]?.id || 'prod_swimming')]
    };

    store.coaches = [...(store.coaches || []), newCoach];
    persistLocalStore('coaches', store.coaches);

    // Auto-create login user in store.users
    const userEmail = newCoach.email.toLowerCase();
    const existingUser = (store.users || []).find(u => u.email.toLowerCase() === userEmail);
    if (!existingUser) {
      const newUser = {
        id: `usr_${id}`,
        name: newCoach.name,
        email: userEmail,
        role: 'coach',
        password: '123'
      };
      store.users = [...(store.users || []), newUser];
      persistLocalStore('users', store.users);
    }

    apiCreateCoach(newCoach).catch(err => {
      console.warn('[Store] apiCreateCoach background sync warning:', err.message);
    });

    return newCoach;
  },

  async updateCoach(id, patch) {
    const idx = (store.coaches || []).findIndex(c => c.id === id);
    if (idx > -1) {
      const oldEmail = store.coaches[idx].email;
      Object.assign(store.coaches[idx], patch);
      persistLocalStore('coaches', store.coaches);

      // Update linked user
      const user = (store.users || []).find(u => u.id === `usr_${id}` || (oldEmail && u.email === oldEmail));
      if (user) {
        if (patch.name) user.name = patch.name;
        if (patch.email) user.email = patch.email.toLowerCase();
        persistLocalStore('users', store.users);
      }
    }

    apiUpdateCoach(id, patch).catch(err => {
      console.warn('[Store] apiUpdateCoach background sync warning:', err.message);
    });

    return store.coaches[idx];
  },

  async deleteCoach(id) {
    const coach = (store.coaches || []).find(c => c.id === id);
    store.coaches = (store.coaches || []).filter(c => c.id !== id);
    if (coach) {
      store.users = (store.users || []).filter(u => u.id !== `usr_${id}` && u.email !== coach.email);
    }
    persistLocalStore('coaches', store.coaches);
    persistLocalStore('users', store.users);

    apiDeleteCoach(id).catch(err => {
      console.warn('[Store] apiDeleteCoach background sync warning:', err.message);
    });

    return true;
  },

  // -------------------------------------------------------------
  // CUSTOMER REGISTRATION FLOW (Instant Registration)
  // -------------------------------------------------------------
  async registerLead(regData) {
    const student = await this.addStudent({
      name: regData.studentName,
      age: regData.studentAge,
      parentName: regData.parentName,
      phone: regData.phone,
      email: regData.email,
      productId: regData.productId,
      packageId: regData.packageId,
      location: regData.location,
      notes: regData.notes
    });

    apiRegisterCustomer(regData).catch(err => {
      console.warn('[Store] apiRegisterCustomer background sync warning:', err.message);
    });

    return { student };
  },

  // -------------------------------------------------------------
  // STUDENTS CRUD (Auto-creates 4 Member Schedules & User Account)
  // -------------------------------------------------------------
  async addStudent(studentData) {
    const id = studentData.id || `stu_${Date.now()}`;
    const prod = (store.products || []).find(p => p.id === studentData.productId);
    const pkg = (store.packages || []).find(p => p.id === studentData.packageId);
    const assignedCoach = (store.coaches || []).find(c => c.id === studentData.assignedCoachId) || (store.coaches || [])[0];

    const initialSchedules = [];
    const days = ['Sabtu', 'Minggu', 'Sabtu', 'Minggu'];
    for (let i = 1; i <= 4; i++) {
      initialSchedules.push({
        id: `sch_${id}_${i}`,
        studentId: id,
        studentName: studentData.name,
        sessionNo: i,
        date: `Sesi ${i}`,
        day: days[i - 1],
        time: '08.00 - 08.45 WIB',
        coachName: assignedCoach?.name || 'Coach Dimas Prasetyo, S.Or.',
        location: studentData.location || 'Kolam Graha Kresna Pratama',
        status: i === 1 ? 'Mendatang (Aktif)' : 'Terjadwal',
        notes: `Sesi latihan ke-${i}`
      });
    }

    const newStudent = {
      id,
      name: studentData.name?.trim() || 'Siswa Baru',
      age: parseInt(studentData.age) || 7,
      parentName: studentData.parentName?.trim() || 'Orang Tua',
      phone: studentData.phone || '',
      email: studentData.email || '',
      productId: studentData.productId || prod?.id || 'prod_swimming',
      productName: prod?.name || studentData.productName || 'Skill Renang',
      packageId: studentData.packageId || pkg?.id || 'pkg_swim_group',
      packageName: pkg?.name || studentData.packageName || 'Group Class',
      assignedCoachId: assignedCoach?.id || '',
      assignedCoachName: assignedCoach?.name || '',
      mappingLockSessions: parseInt(studentData.mappingLockSessions) || 4,
      sessionsCompletedWithCoach: 0,
      mappingStatus: `Terkunci (${studentData.mappingLockSessions || 4} Sesi Terikat)`,
      joinedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Aktif',
      currentLevel: 1,
      currentLevelTitle: 'Level 1: Water Explorer',
      targetChallenge: '5 Meter Freestyle Challenge',
      completedSessions: 0,
      packageTotalSessions: 4,
      overallProgress: 0,
      memberSchedules: initialSchedules,
      sessionReports: [],
      notes: studentData.notes || ''
    };

    store.students = [newStudent, ...(store.students || [])];
    persistLocalStore('students', store.students);

    // Auto-create parent user login if email provided
    if (studentData.email) {
      const userEmail = studentData.email.toLowerCase();
      const existing = (store.users || []).find(u => u.email.toLowerCase() === userEmail);
      if (!existing) {
        store.users = [...(store.users || []), {
          id: `usr_${id}`,
          name: studentData.parentName || studentData.name,
          email: userEmail,
          role: 'customer',
          password: '123'
        }];
        persistLocalStore('users', store.users);
      }
    }

    // Auto-create invoice
    const now = new Date();
    const pkgPrice = pkg?.price || 450000;
    const invId = `INV-MS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const invoice = {
      id: invId,
      studentId: id,
      studentName: newStudent.name,
      parentName: newStudent.parentName,
      phone: newStudent.phone,
      productId: newStudent.productId,
      productName: newStudent.productName,
      packageId: newStudent.packageId,
      packageName: `${newStudent.productName} - ${newStudent.packageName}`,
      amount: pkgPrice,
      formattedAmount: `Rp ${pkgPrice.toLocaleString('id-ID')}`,
      paymentMethod: 'qris',
      paymentMethodName: 'QRIS Dinamis ASPI',
      status: 'Menunggu Pembayaran',
      paidAt: '-',
      created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    store.transactions = [invoice, ...(store.transactions || [])];
    persistLocalStore('transactions', store.transactions);

    apiCreateStudent(newStudent).catch(err => {
      console.warn('[Store] apiCreateStudent background sync warning:', err.message);
    });

    return newStudent;
  },

  async updateStudent(id, patch) {
    const idx = (store.students || []).findIndex(s => s.id === id);
    if (idx > -1) {
      if (patch.productId) {
        const prod = (store.products || []).find(p => p.id === patch.productId);
        if (prod) patch.productName = prod.name;
      }
      if (patch.packageId) {
        const pkg = (store.packages || []).find(p => p.id === patch.packageId);
        if (pkg) patch.packageName = pkg.name;
      }
      if (patch.assignedCoachId) {
        const coach = (store.coaches || []).find(c => c.id === patch.assignedCoachId);
        if (coach) patch.assignedCoachName = coach.name;
      }
      Object.assign(store.students[idx], patch);
      persistLocalStore('students', store.students);
    }

    apiUpdateStudent(id, patch).catch(err => {
      console.warn('[Store] apiUpdateStudent background sync warning:', err.message);
    });

    return store.students[idx];
  },

  async deleteStudent(id) {
    store.students = (store.students || []).filter(s => s.id !== id);
    store.transactions = (store.transactions || []).filter(t => t.studentId !== id);
    persistLocalStore('students', store.students);
    persistLocalStore('transactions', store.transactions);

    apiDeleteStudent(id).catch(err => {
      console.warn('[Store] apiDeleteStudent background sync warning:', err.message);
    });

    return true;
  },

  // -------------------------------------------------------------
  // SCHEDULES DYNAMIC CRUD
  // -------------------------------------------------------------
  async addSchedule(scheduleData) {
    const student = (store.students || []).find(s => s.id === scheduleData.studentId);
    const id = scheduleData.id || `sch_${scheduleData.studentId || 'manual'}_${Date.now()}`;
    const newSch = {
      id,
      studentId: scheduleData.studentId,
      studentName: student?.name || scheduleData.studentName || 'Siswa',
      parentName: student?.parentName || scheduleData.parentName || 'Wali',
      phone: student?.phone || scheduleData.phone || '',
      programName: student?.productName || scheduleData.programName || 'Skill Renang',
      sessionNo: (student?.memberSchedules?.length || 0) + 1,
      date: scheduleData.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      day: scheduleData.day || 'Sabtu',
      time: scheduleData.time || '08.00 - 08.45 WIB',
      coachName: scheduleData.coachName || student?.assignedCoachName || 'Coach Dimas Prasetyo, S.Or.',
      location: scheduleData.location || student?.location || 'Kolam Graha Kresna Pratama',
      status: scheduleData.status || 'Terjadwal',
      notes: scheduleData.notes || `Sesi latihan ke-${(student?.memberSchedules?.length || 0) + 1}`
    };

    if (student) {
      if (!Array.isArray(student.memberSchedules)) student.memberSchedules = [];
      student.memberSchedules.push(newSch);
      student.packageTotalSessions = Math.max(student.packageTotalSessions || 4, student.memberSchedules.length);
      persistLocalStore('students', store.students);
    }

    apiCreateSchedule(newSch).catch(err => {
      console.warn('[Store] apiCreateSchedule background sync warning:', err.message);
    });

    return newSch;
  },

  async updateSchedule(scheduleId, patch) {
    let foundSch = null;
    let targetStudent = null;
    for (const stu of (store.students || [])) {
      if (Array.isArray(stu.memberSchedules)) {
        const sch = stu.memberSchedules.find(s => s.id === scheduleId);
        if (sch) {
          foundSch = sch;
          targetStudent = stu;
          Object.assign(sch, patch);
          break;
        }
      }
    }

    if (targetStudent) {
      const completedCount = targetStudent.memberSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
      targetStudent.completedSessions = completedCount;
      targetStudent.sessionsCompletedWithCoach = completedCount;
      const total = targetStudent.packageTotalSessions || targetStudent.memberSchedules.length || 4;
      targetStudent.overallProgress = Math.round((completedCount / total) * 100);
      persistLocalStore('students', store.students);
    }

    apiUpdateSchedule(scheduleId, patch).catch(err => {
      console.warn('[Store] apiUpdateSchedule background sync warning:', err.message);
    });

    return foundSch;
  },

  async deleteSchedule(scheduleId) {
    for (const stu of (store.students || [])) {
      if (Array.isArray(stu.memberSchedules)) {
        const beforeLen = stu.memberSchedules.length;
        stu.memberSchedules = stu.memberSchedules.filter(s => s.id !== scheduleId);
        if (stu.memberSchedules.length !== beforeLen) {
          stu.packageTotalSessions = stu.memberSchedules.length;
          const completedCount = stu.memberSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
          stu.completedSessions = completedCount;
          stu.sessionsCompletedWithCoach = completedCount;
          stu.overallProgress = stu.memberSchedules.length > 0 ? Math.round((completedCount / stu.memberSchedules.length) * 100) : 0;
          persistLocalStore('students', store.students);
          break;
        }
      }
    }

    apiDeleteSchedule(scheduleId).catch(err => {
      console.warn('[Store] apiDeleteSchedule background sync warning:', err.message);
    });

    return true;
  },

  // Assign / Reassign Coach to Student (with session lock count)
  async assignCoachToStudent(studentId, coachId, lockSessionsCount = 4) {
    const coach = (store.coaches || []).find(c => c.id === coachId);
    if (!coach) return false;

    const student = (store.students || []).find(s => s.id === studentId);
    if (student) {
      student.assignedCoachId = coach.id;
      student.assignedCoachName = coach.name;
      student.mappingLockSessions = lockSessionsCount;
      student.sessionsCompletedWithCoach = 0;
      student.mappingStatus = `Terkunci (${lockSessionsCount} Sesi Terikat)`;

      if (Array.isArray(student.memberSchedules)) {
        student.memberSchedules.forEach(sch => {
          if (sch.status !== 'Selesai' && sch.status !== 'Hadir') {
            sch.coachName = coach.name;
          }
        });
      }
      persistLocalStore('students', store.students);
    }

    apiUpdateStudent(studentId, {
      assignedCoachId: coach.id,
      assignedCoachName: coach.name,
      mappingLockSessions: lockSessionsCount,
      sessionsCompletedWithCoach: 0,
      mappingStatus: `Terkunci (${lockSessionsCount} Sesi Terikat)`
    }).catch(err => {
      console.warn('[Store] assignCoach background sync warning:', err.message);
    });

    return true;
  },

  // Payment Verification
  async verifyPayment(invoiceId) {
    const trx = (store.transactions || []).find(t => t.id === invoiceId);
    if (trx) {
      trx.status = 'Lunas (Verified)';
      trx.paidAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
      persistLocalStore('transactions', store.transactions);
    }

    apiVerifyPayment(invoiceId).catch(err => {
      console.warn('[Store] apiVerifyPayment background sync warning:', err.message);
    });

    return trx;
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
    persistLocalStore('coachAttendances', store.coachAttendances);

    apiRecordCoachAttendance(payload).then(res => {
      if (res && res.id) {
        fallbackRecord.id = res.id;
        persistLocalStore('coachAttendances', store.coachAttendances);
      }
    }).catch(err => {
      console.warn('[Store] apiRecordCoachAttendance background sync warning:', err.message);
    });

    return fallbackRecord;
  },

  async verifyCoachAttendance(id) {
    const match = (store.coachAttendances || []).find(a => a.id === id);
    if (match) {
      match.isVerified = true;
      match.verifiedAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
      persistLocalStore('coachAttendances', store.coachAttendances);
    }

    apiVerifyCoachAttendance(id).catch(err => {
      console.warn('[Store] apiVerifyCoachAttendance background sync warning:', err.message);
    });

    return match;
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
  },

  // -------------------------------------------------------------
  // PROFIL BRAND & WEBSITE CMS CRUD
  // -------------------------------------------------------------
  async updateBrand(brandPatch) {
    store.brand = { ...store.brand, ...brandPatch };
    persistLocalStore('brand', store.brand);

    apiUpdateBrandConfig(brandPatch).catch(err => {
      console.warn('[Store] apiUpdateBrandConfig background sync warning:', err.message);
    });

    return store.brand;
  },

  async updateHero(heroPatch) {
    store.hero = { ...store.hero, ...heroPatch };
    persistLocalStore('hero', store.hero);

    apiUpdateHeroConfig(heroPatch).catch(err => {
      console.warn('[Store] apiUpdateHeroConfig background sync warning:', err.message);
    });

    return store.hero;
  },

  // -------------------------------------------------------------
  // DYNAMIC PAYMENT & BANK ACCOUNTS CRUD
  // -------------------------------------------------------------
  async updatePaymentConfig(patch) {
    store.paymentConfig = { ...store.paymentConfig, ...patch };
    persistLocalStore('paymentConfig', store.paymentConfig);

    apiUpdatePaymentConfig(patch).catch(err => {
      console.warn('[Store] apiUpdatePaymentConfig background sync warning:', err.message);
    });

    return store.paymentConfig;
  },

  async addBankAccount(bankData) {
    const newBank = {
      id: `bank_${Date.now()}`,
      bankName: bankData.bankName || 'Bank Baru',
      accountNumber: bankData.accountNumber || '',
      accountHolder: bankData.accountHolder || 'YAYASAN MINE SKILLS INDONESIA',
      badge: bankData.badge || 'Verifikasi Otomatis'
    };

    if (!store.paymentConfig.bankAccounts) store.paymentConfig.bankAccounts = [];
    store.paymentConfig.bankAccounts.push(newBank);
    persistLocalStore('paymentConfig', store.paymentConfig);

    apiAddBankAccount(newBank).then(res => {
      if (res && res.id) {
        newBank.id = res.id;
        persistLocalStore('paymentConfig', store.paymentConfig);
      }
    }).catch(err => {
      console.warn('[Store] apiAddBankAccount background sync warning:', err.message);
    });

    return newBank;
  },

  async updateBankAccount(id, patch) {
    const match = (store.paymentConfig.bankAccounts || []).find(b => b.id === id);
    if (match) {
      Object.assign(match, patch);
      persistLocalStore('paymentConfig', store.paymentConfig);
    }

    apiUpdateBankAccount(id, patch).catch(err => {
      console.warn('[Store] apiUpdateBankAccount background sync warning:', err.message);
    });

    return match;
  },

  async deleteBankAccount(id) {
    store.paymentConfig.bankAccounts = (store.paymentConfig.bankAccounts || []).filter(b => b.id !== id);
    persistLocalStore('paymentConfig', store.paymentConfig);

    apiDeleteBankAccount(id).catch(err => {
      console.warn('[Store] apiDeleteBankAccount background sync warning:', err.message);
    });

    return true;
  }
};

// Initial bootstrap trigger
actions.init();
