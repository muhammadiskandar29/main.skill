import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertQRIS } from '../src/utils/qris.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, 'db.json');
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

// Static Raw QRIS template (mine.skills base ASPI QRIS)
const DEFAULT_RAW_QRIS = '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB';

export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      throw new Error(`Database file not found at ${DB_FILE}`);
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB] Error reading db.json:', err);
    return {
      users: [],
      products: [],
      packages: [],
      coaches: [],
      students: [],
      studentSchedules: [],
      transactions: [],
      locations: []
    };
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Error writing db.json:', err);
    return false;
  }
}

// -------------------------------------------------------------
// Image File Upload Helper
// -------------------------------------------------------------
export function saveUploadedImage({ base64Data, folder = 'misc', originalName = 'upload.jpg' }) {
  if (!base64Data) {
    throw new Error('No base64 data provided');
  }

  // Clean folder name to prevent path traversal
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'misc';
  const targetDir = path.resolve(PUBLIC_DIR, 'images', cleanFolder);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Extract base64 payload & extension
  let ext = '.jpg';
  let pureBase64 = base64Data;

  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (matches) {
    ext = '.' + (matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('+xml', ''));
    pureBase64 = matches[2];
  } else if (originalName.includes('.')) {
    ext = path.extname(originalName) || '.jpg';
  }

  const safeFilename = `${cleanFolder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
  const targetPath = path.resolve(targetDir, safeFilename);

  fs.writeFileSync(targetPath, Buffer.from(pureBase64, 'base64'));

  // Relative path to store in database and serve via browser
  return `/images/${cleanFolder}/${safeFilename}`;
}

// -------------------------------------------------------------
// Products Model & Dynamic Mapping
// -------------------------------------------------------------
export function getAllProducts() {
  const db = readDb();
  const coaches = db.coaches || [];
  const packages = db.packages || [];

  // Enrich each product with its mapped coaches and dynamic packages
  return (db.products || []).map(product => {
    const mappedCoaches = coaches.filter(c => Array.isArray(c.productIds) && c.productIds.includes(product.id));
    const prodPackages = packages.filter(p => p.productId === product.id);

    return {
      ...product,
      coaches: mappedCoaches,
      packages: prodPackages,
      packagesCount: prodPackages.length
    };
  });
}

export function createProduct(payload) {
  const db = readDb();
  const id = payload.id || `prod_${Date.now()}`;
  
  const newProduct = {
    id,
    name: payload.name?.trim() || 'Produk Skill Baru',
    slug: payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id,
    shortDesc: payload.shortDesc?.trim() || '',
    category: payload.category || 'Skill Baru',
    targetAge: payload.targetAge || 'Semua Usia',
    heroImage: payload.heroImage || '/images/swimming-hero.jpg',
    isActive: payload.isActive !== false,
    featured: Boolean(payload.featured),
    levels: Array.isArray(payload.levels) && payload.levels.length > 0 ? payload.levels : [
      { levelNumber: 1, title: 'Dasar / Starter', focus: 'Pengenalan & Teori Dasar', challenge: 'Uji Teori & Praktik Awal' },
      { levelNumber: 2, title: 'Praktik Menengah', focus: 'Penguasaan Teknik Inti', challenge: 'Simulasi Mandiri' },
      { levelNumber: 3, title: 'Tingkat Mahir', focus: 'Evaluasi & Sertifikasi', challenge: 'Ujian Kelulusan' }
    ],
    created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };

  db.products = db.products || [];
  db.products.push(newProduct);

  // If initial package data provided or create 1 default package
  db.packages = db.packages || [];
  const priceNum = parseInt(payload.initialPrice) || 450000;
  const initialPkg = {
    id: `pkg_${Date.now()}`,
    productId: id,
    productName: newProduct.name,
    name: payload.packageName || 'Paket Reguler',
    ratio: payload.packageRatio || '3 - 4 peserta',
    price: priceNum,
    formattedPrice: `Rp ${priceNum.toLocaleString('id-ID')}`,
    duration: payload.packageDuration || '60 menit / sesi',
    meetings: payload.packageMeetings || '4x pertemuan',
    badge: 'Baru',
    description: `Program intensif ${newProduct.name} dengan bimbingan pelatih profesional.`
  };
  db.packages.push(initialPkg);

  writeDb(db);
  return { ...newProduct, packages: [initialPkg], coaches: [] };
}

export function updateProduct(id, patch) {
  const db = readDb();
  const idx = (db.products || []).findIndex(p => p.id === id);
  if (idx === -1) return null;

  db.products[idx] = { ...db.products[idx], ...patch };
  writeDb(db);
  return db.products[idx];
}

export function deleteProduct(id) {
  const db = readDb();
  db.products = (db.products || []).filter(p => p.id !== id);
  // Also clean up packages
  db.packages = (db.packages || []).filter(p => p.productId !== id);
  // Remove product from coach mappings
  if (db.coaches) {
    db.coaches.forEach(c => {
      if (Array.isArray(c.productIds)) {
        c.productIds = c.productIds.filter(pid => pid !== id);
      }
    });
  }
  writeDb(db);
  return true;
}

// -------------------------------------------------------------
// Packages Model (1 Product can have up to 20 Dynamic Price Packages)
// -------------------------------------------------------------
export function getAllPackages(productId = null) {
  const db = readDb();
  let pkgs = db.packages || [];
  if (productId) {
    pkgs = pkgs.filter(p => p.productId === productId);
  }
  return pkgs;
}

export function createPackage(payload) {
  const db = readDb();
  const priceNum = parseInt(payload.price) || 400000;
  const product = (db.products || []).find(p => p.id === payload.productId);

  const newPkg = {
    id: payload.id || `pkg_${Date.now()}`,
    productId: payload.productId || (db.products?.[0]?.id ?? 'prod_swimming'),
    productName: payload.productName || product?.name || 'Program Skill',
    name: payload.name?.trim() || 'Paket Pilihan',
    ratio: payload.ratio || '3 - 4 anak / kelas',
    price: priceNum,
    formattedPrice: `Rp ${priceNum.toLocaleString('id-ID')}`,
    duration: payload.duration || '45 menit / sesi',
    meetings: payload.meetings || '4x pertemuan',
    badge: payload.badge || 'Pilihan',
    description: payload.description || ''
  };

  db.packages = db.packages || [];
  db.packages.push(newPkg);
  writeDb(db);
  return newPkg;
}

export function updatePackage(id, patch) {
  const db = readDb();
  const idx = (db.packages || []).findIndex(p => p.id === id);
  if (idx === -1) return null;

  if (patch.price) {
    const priceNum = parseInt(patch.price) || db.packages[idx].price;
    patch.price = priceNum;
    patch.formattedPrice = `Rp ${priceNum.toLocaleString('id-ID')}`;
  }

  db.packages[idx] = { ...db.packages[idx], ...patch };
  writeDb(db);
  return db.packages[idx];
}

export function deletePackage(id) {
  const db = readDb();
  db.packages = (db.packages || []).filter(p => p.id !== id);
  writeDb(db);
  return true;
}

// -------------------------------------------------------------
// Coaches Model (Auto-creates User Account with Password 123456)
// -------------------------------------------------------------
export function getAllCoaches() {
  const db = readDb();
  const products = db.products || [];

  return (db.coaches || []).map(coach => {
    const mappedProducts = products.filter(p => Array.isArray(coach.productIds) && coach.productIds.includes(p.id));
    return {
      ...coach,
      mappedProducts
    };
  });
}

export function createCoach(payload) {
  const db = readDb();
  const coachId = payload.id || `coach_${Date.now()}`;
  const userId = `usr_${coachId}`;
  const email = payload.email?.trim() || `coach.${Date.now()}@mineskills.id`;
  const defaultPassword = '123'; // Default password for all users as required

  // 1. Automatically create User account for coach
  db.users = db.users || [];
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    db.users.push({
      id: userId,
      name: payload.name?.trim() || 'Coach Baru',
      email: email,
      password: defaultPassword,
      role: 'coach',
      phone: payload.phone?.trim() || '',
      avatar: payload.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
      student_id: null,
      coach_id: coachId,
      created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    });
  }

  // 2. Create Coach Master Record with productIds mapping
  const newCoach = {
    id: coachId,
    userId: existingUser?.id || userId,
    name: payload.name?.trim() || 'Coach Baru',
    email: email,
    phone: payload.phone?.trim() || '',
    specialty: payload.specialty?.trim() || 'Instruktur Skill',
    bio: payload.bio?.trim() || '',
    avatar: payload.avatar || '/images/coaches/default.jpg',
    productIds: Array.isArray(payload.productIds) ? payload.productIds : (payload.productId ? [payload.productId] : []),
    activeStudentsCount: 0,
    created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };

  db.coaches = db.coaches || [];
  db.coaches.push(newCoach);
  writeDb(db);

  return newCoach;
}

export function updateCoach(id, patch) {
  const db = readDb();
  const idx = (db.coaches || []).findIndex(c => c.id === id);
  if (idx === -1) return null;

  db.coaches[idx] = { ...db.coaches[idx], ...patch };

  // Also update corresponding user email / name if changed
  if (db.coaches[idx].userId && db.users) {
    const userIdx = db.users.findIndex(u => u.id === db.coaches[idx].userId);
    if (userIdx !== -1) {
      if (patch.name) db.users[userIdx].name = patch.name;
      if (patch.email) db.users[userIdx].email = patch.email;
      if (patch.phone) db.users[userIdx].phone = patch.phone;
      if (patch.avatar) db.users[userIdx].avatar = patch.avatar;
    }
  }

  writeDb(db);
  return db.coaches[idx];
}

export function deleteCoach(id) {
  const db = readDb();
  const coach = (db.coaches || []).find(c => c.id === id);
  if (coach && coach.userId && db.users) {
    db.users = db.users.filter(u => u.id !== coach.userId);
  }
  db.coaches = (db.coaches || []).filter(c => c.id !== id);
  writeDb(db);
  return true;
}

// -------------------------------------------------------------
// Students & Independent Customer Schedules
// -------------------------------------------------------------
export function getAllStudents() {
  const db = readDb();
  const schedules = db.studentSchedules || [];

  return (db.students || []).map(student => {
    const studentScheds = schedules.filter(s => s.studentId === student.id);
    return {
      ...student,
      memberSchedules: studentScheds
    };
  });
}

export function getStudentById(id) {
  const db = readDb();
  const student = (db.students || []).find(s => s.id === id);
  if (!student) return null;
  const schedules = (db.studentSchedules || []).filter(s => s.studentId === student.id);
  return { ...student, memberSchedules: schedules };
}

export function createStudent(payload) {
  const db = readDb();
  const now = new Date();
  const studentId = `stu_${Date.now()}`;
  const userId = `usr_cust_${Date.now()}`;
  const cleanEmail = payload.email?.trim() || `${(payload.phone || Date.now()).toString().replace(/\D/g, '')}@customer.mineskills.id`;
  
  // Find product & coach
  const product = (db.products || []).find(p => p.id === payload.productId) || db.products?.[0];
  const pkg = (db.packages || []).find(p => p.id === payload.packageId) || (db.packages || []).find(p => p.productId === product?.id) || db.packages?.[0];
  const coach = (db.coaches || []).find(c => c.id === payload.assignedCoachId) || (db.coaches || [])[0];

  db.users = db.users || [];
  let user = db.users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  if (!user) {
    user = {
      id: userId,
      name: payload.parentName || payload.name,
      email: cleanEmail,
      password: '123',
      role: 'customer',
      phone: payload.phone || '',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160',
      student_id: studentId,
      created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    db.users.push(user);
  } else {
    user.student_id = studentId;
  }

  const newStudent = {
    id: studentId,
    userId: user.id,
    name: payload.name?.trim() || 'Siswa Baru',
    nickname: payload.nickname || payload.name?.trim().split(' ')[0] || 'Siswa',
    age: parseInt(payload.age) || 7,
    parentName: payload.parentName?.trim() || 'Orang Tua Siswa',
    email: cleanEmail,
    phone: payload.phone?.trim() || '',
    productId: product?.id || 'prod_swimming',
    productName: product?.name || 'Skill Renang',
    packageId: pkg?.id || 'pkg_swim_group',
    packageName: pkg ? `${pkg.name} (${pkg.formattedPrice || 'Rp ' + pkg.price})` : 'Paket Standar',
    assignedCoachId: coach?.id || null,
    assignedCoachName: coach?.name || 'Belum di-assign',
    mappingLockSessions: parseInt(payload.mappingLockSessions) || 4,
    sessionsCompletedWithCoach: 0,
    mappingStatus: coach ? `Terkunci (${payload.mappingLockSessions || 4} Sesi Terikat)` : 'Belum Ditugaskan',
    location: payload.location || 'Kolam Graha Kresna Pratama Jatiwaringin',
    currentLevel: 1,
    currentLevelTitle: 'Level 1: Water Explorer',
    targetChallenge: '5 Meter Freestyle Challenge',
    packageTotalSessions: parseInt(payload.packageTotalSessions) || 4,
    completedSessions: 0,
    overallProgress: 0,
    status: 'Aktif / Enrolled',
    notes: payload.notes || '',
    joinedDate: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  db.students = db.students || [];
  db.students.unshift(newStudent);

  // Auto-generate 4 sessions schedule
  db.studentSchedules = db.studentSchedules || [];
  const studentSchedules = [];
  const dayName = payload.preferredDay || 'Sabtu';
  const timeSlot = payload.preferredTime || '09.00 - 09.45 WIB';

  for (let i = 1; i <= (newStudent.packageTotalSessions || 4); i++) {
    const targetDate = new Date(now.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    const dateStr = targetDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const sch = {
      id: `sch_${studentId}_${i}`,
      studentId: studentId,
      sessionNo: i,
      date: dateStr,
      day: dayName,
      time: timeSlot,
      coachName: newStudent.assignedCoachName,
      location: newStudent.location,
      status: 'Terjadwal',
      notes: `Sesi ${i} fokus kurikulum dasar`
    };
    db.studentSchedules.push(sch);
    studentSchedules.push(sch);
  }

  writeDb(db);
  return { ...newStudent, memberSchedules: studentSchedules };
}

export function updateStudent(id, patch) {
  const db = readDb();
  const idx = (db.students || []).findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.students[idx] = { ...db.students[idx], ...patch };
  writeDb(db);
  return db.students[idx];
}

export function getAllSchedules(filter = {}) {
  const db = readDb();
  let list = db.studentSchedules || [];
  if (filter.studentId) list = list.filter(s => s.studentId === filter.studentId);
  if (filter.coachName) list = list.filter(s => s.coachName === filter.coachName);
  if (filter.status) list = list.filter(s => s.status === filter.status);
  return list;
}

export function createStudentSchedule(payload) {
  const db = readDb();
  db.studentSchedules = db.studentSchedules || [];
  
  // Find student
  const student = (db.students || []).find(s => s.id === payload.studentId);
  const existingForStudent = db.studentSchedules.filter(s => s.studentId === payload.studentId);
  const nextSessionNo = parseInt(payload.sessionNo) || (existingForStudent.length + 1);

  const newSchedule = {
    id: `sch_${payload.studentId || 'manual'}_${Date.now()}`,
    studentId: payload.studentId || null,
    studentName: student?.name || payload.studentName || 'Siswa',
    parentName: student?.parentName || payload.parentName || 'Wali',
    phone: student?.phone || payload.phone || '',
    programName: student?.productName || payload.programName || 'Skill Renang',
    sessionNo: nextSessionNo,
    date: payload.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    day: payload.day || 'Sabtu',
    time: payload.time || '09.00 - 09.45 WIB',
    coachName: payload.coachName || student?.assignedCoachName || 'Coach Dimas Prasetyo, S.Or.',
    location: payload.location || student?.location || 'Kolam Graha Kresna Pratama',
    status: payload.status || 'Terjadwal',
    notes: payload.notes || `Sesi latihan ke-${nextSessionNo}`
  };

  db.studentSchedules.push(newSchedule);

  // Update total sessions count on student
  if (student) {
    const studentSchedules = db.studentSchedules.filter(s => s.studentId === student.id);
    student.packageTotalSessions = Math.max(student.packageTotalSessions || 4, studentSchedules.length);
  }

  writeDb(db);
  return newSchedule;
}

export function updateStudentSchedule(scheduleId, patch) {
  const db = readDb();
  const idx = (db.studentSchedules || []).findIndex(s => s.id === scheduleId);
  if (idx === -1) return null;
  db.studentSchedules[idx] = { ...db.studentSchedules[idx], ...patch };

  // Sync student progress
  const studentId = db.studentSchedules[idx].studentId;
  const student = (db.students || []).find(s => s.id === studentId);
  if (student) {
    const studentSchedules = db.studentSchedules.filter(s => s.studentId === studentId);
    const completedCount = studentSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
    student.completedSessions = completedCount;
    student.sessionsCompletedWithCoach = completedCount;
    const total = student.packageTotalSessions || studentSchedules.length || 4;
    student.overallProgress = Math.round((completedCount / total) * 100);
  }

  writeDb(db);
  return db.studentSchedules[idx];
}

export function deleteStudentSchedule(scheduleId) {
  const db = readDb();
  const sched = (db.studentSchedules || []).find(s => s.id === scheduleId);
  db.studentSchedules = (db.studentSchedules || []).filter(s => s.id !== scheduleId);
  if (sched && sched.studentId) {
    const student = (db.students || []).find(s => s.id === sched.studentId);
    if (student) {
      const studentSchedules = db.studentSchedules.filter(s => s.studentId === student.id);
      student.packageTotalSessions = studentSchedules.length;
      const completedCount = studentSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
      student.completedSessions = completedCount;
      student.sessionsCompletedWithCoach = completedCount;
      student.overallProgress = studentSchedules.length > 0 ? Math.round((completedCount / studentSchedules.length) * 100) : 0;
    }
  }
  writeDb(db);
  return true;
}

export function deleteStudent(id) {
  const db = readDb();
  db.students = (db.students || []).filter(s => s.id !== id);
  db.studentSchedules = (db.studentSchedules || []).filter(s => s.studentId !== id);
  writeDb(db);
  return true;
}

// -------------------------------------------------------------
// Customer Registration Flow
// -------------------------------------------------------------
export function registerCustomerFlow({
  studentName,
  studentAge,
  parentName,
  email,
  phone,
  productId,
  packageId,
  schedulePref,
  location,
  notes
}) {
  const db = readDb();
  const now = new Date();

  // Find product & package
  const product = (db.products || []).find(p => p.id === productId) || db.products?.[0];
  const pkg = (db.packages || []).find(p => p.id === packageId) || (db.packages || []).find(p => p.productId === product?.id) || db.packages?.[0];
  const packagePrice = pkg?.price || 400000;

  // Find suitable coach mapped to this product
  const mappedCoaches = (db.coaches || []).filter(c => Array.isArray(c.productIds) && c.productIds.includes(product?.id));
  const assignedCoach = mappedCoaches[0] || (db.coaches || [])[0] || { id: 'coach_1', name: 'Coach Dimas Prasetyo, S.Or.' };

  const studentId = `stu_${Date.now()}`;
  const userId = `usr_cust_${Date.now()}`;
  const cleanEmail = email?.trim() || `${phone.replace(/\D/g, '') || Date.now()}@customer.mineskills.id`;
  const defaultPassword = '123';

  // 1. Auto-create User account with password 123456
  db.users = db.users || [];
  let user = db.users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  if (!user) {
    user = {
      id: userId,
      name: parentName || studentName,
      email: cleanEmail,
      password: defaultPassword,
      role: 'customer',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160',
      student_id: studentId,
      coach_id: null,
      created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    db.users.push(user);
  } else {
    user.student_id = studentId;
  }

  // 2. Create Student Record
  const newStudent = {
    id: studentId,
    userId: user.id,
    name: studentName.trim(),
    nickname: studentName.trim().split(' ')[0],
    age: parseInt(studentAge) || 7,
    parentName: parentName?.trim() || 'Orang Tua Siswa',
    email: cleanEmail,
    phone: phone?.trim() || '',
    productId: product?.id || 'prod_swimming',
    productName: product?.name || 'Skill Renang',
    packageId: pkg?.id || 'pkg_swim_group',
    packageName: `${pkg?.name || 'Group Class'} (Rp ${packagePrice.toLocaleString('id-ID')})`,
    assignedCoachId: assignedCoach.id,
    assignedCoachName: assignedCoach.name,
    mappingLockSessions: 4,
    sessionsCompletedWithCoach: 0,
    mappingStatus: 'Terkunci (Sisa 4 Sesi)',
    location: location || 'Kolam Graha Kresna Pratama Jatiwaringin',
    currentLevel: 1,
    currentLevelTitle: 'Level 1: Water Explorer',
    targetChallenge: '5 Meter Freestyle Challenge',
    packageTotalSessions: 4,
    completedSessions: 0,
    overallProgress: 0,
    status: 'Aktif / Enrolled',
    notes: notes || '',
    joinedDate: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  db.students = db.students || [];
  db.students.unshift(newStudent);

  // 3. Generate Independent 4-Session Schedule for this customer
  db.studentSchedules = db.studentSchedules || [];
  const studentSchedules = [];
  const prefStr = schedulePref || 'Sabtu Pagi (09.00 WIB)';
  const dayName = prefStr.includes('Minggu') ? 'Minggu' : (prefStr.includes('Jumat') ? 'Jumat' : 'Sabtu');
  const timeSlot = prefStr.includes('Sore') ? '15.30 - 16.15 WIB' : '09.00 - 09.45 WIB';

  for (let i = 1; i <= 4; i++) {
    const targetDate = new Date(now.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    const dateStr = targetDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const sch = {
      id: `sch_${studentId}_${i}`,
      studentId: studentId,
      sessionNo: i,
      date: dateStr,
      day: dayName,
      time: timeSlot,
      coachName: assignedCoach.name,
      productName: product?.name || 'Skill Renang',
      status: i === 1 ? 'Mendatang (Aktif)' : 'Terjadwal'
    };
    db.studentSchedules.push(sch);
    studentSchedules.push(sch);
  }

  // 4. Generate Dynamic QRIS for the exact package price
  let dynamicQrisString = '';
  try {
    const resQris = convertQRIS(DEFAULT_RAW_QRIS, { amount: packagePrice });
    dynamicQrisString = typeof resQris === 'string' ? resQris : (resQris?.qris || DEFAULT_RAW_QRIS);
  } catch (err) {
    console.warn('[DB] Failed to convert QRIS dynamic:', err);
    dynamicQrisString = DEFAULT_RAW_QRIS;
  }

  // 5. Create Transaction Invoice
  const invoiceId = `INV-MS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;
  const newTransaction = {
    id: invoiceId,
    studentId: studentId,
    studentName: newStudent.name,
    parentName: newStudent.parentName,
    phone: newStudent.phone,
    productId: product?.id || 'prod_swimming',
    productName: product?.name || 'Skill Renang',
    packageId: pkg?.id || 'pkg_auto',
    packageName: `${product?.name} - ${pkg?.name}`,
    amount: packagePrice,
    formattedAmount: `Rp ${packagePrice.toLocaleString('id-ID')}`,
    paymentMethod: 'qris',
    paymentMethodName: 'QRIS Dinamis ASPI',
    qrisString: dynamicQrisString,
    status: 'Menunggu Pembayaran',
    paidAt: '-',
    notes: 'Pendaftaran online mandiri dengan QRIS otomatis',
    created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };

  db.transactions = db.transactions || [];
  db.transactions.unshift(newTransaction);

  // Commit database atomically
  writeDb(db);

  return {
    student: { ...newStudent, memberSchedules: studentSchedules },
    user,
    transaction: newTransaction,
    schedules: studentSchedules,
    qrisString: dynamicQrisString,
    amount: packagePrice
  };
}

// -------------------------------------------------------------
// Transactions Model
// -------------------------------------------------------------
export function getAllTransactions() {
  const db = readDb();
  return db.transactions || [];
}

export function verifyTransaction(invoiceId) {
  const db = readDb();
  const trx = (db.transactions || []).find(t => t.id === invoiceId);
  if (!trx) return null;

  trx.status = 'Lunas (Verified)';
  trx.paidAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  writeDb(db);
  return trx;
}

// -------------------------------------------------------------
// Authentication Model
// -------------------------------------------------------------
export function loginUser(email, password) {
  const db = readDb();
  const cleanEmail = email?.trim().toLowerCase();
  const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, message: 'Email tidak ditemukan.' };
  }

  // Default password 123456 or matching stored password
  if (password === '123' || user.password === password) {
    return { success: true, user };
  }

  return { success: false, message: 'Password salah (Gunakan default: 123).' };
}

export function getAllUsers() {
  const db = readDb();
  return db.users || [];
}
