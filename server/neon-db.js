import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { convertQRIS } from '../src/utils/qris.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const DB_FILE = path.resolve(__dirname, 'db.json');

const DEFAULT_RAW_QRIS = '00020101021126650014ID.GO.IDR.WWW011893600998000001234502150001234567890120303UMI51660014ID.LINKAJA.WWW011893600821000001234502150001234567890120303UMI5204581253033605802ID5914MINE.SKILLS ID6007JAKARTA61051234063040ADB';

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

// Helper to read fallback json if DB is offline
function readJsonFallback() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('[DB] Fallback JSON read error:', e);
  }
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

export async function queryTable(table, whereClause = '', params = []) {
  const sql = getSql();
  if (sql) {
    try {
      const query = `SELECT data FROM ${table} ${whereClause} ORDER BY updated_at ASC;`;
      const rows = await sql.query(query, params);
      return rows.map(r => r.data);
    } catch (err) {
      console.warn(`[Neon DB] queryTable error on ${table}:`, err.message);
    }
  }
  const fallback = readJsonFallback();
  const key = table === 'student_schedules' ? 'studentSchedules' : table;
  return fallback[key] || [];
}

export async function getById(table, id) {
  const sql = getSql();
  if (sql) {
    try {
      const rows = await sql.query(`SELECT data FROM ${table} WHERE id = $1;`, [id]);
      if (rows.length > 0) return rows[0].data;
    } catch (err) {
      console.warn(`[Neon DB] getById error on ${table}:`, err.message);
    }
  }
  const fallback = readJsonFallback();
  const key = table === 'student_schedules' ? 'studentSchedules' : table;
  return (fallback[key] || []).find(item => item.id === id) || null;
}

export async function upsertRecord(table, id, data) {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(
        `INSERT INTO ${table} (id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW();`,
        [id, JSON.stringify(data)]
      );
      return true;
    } catch (err) {
      console.error(`[Neon DB] upsertRecord error on ${table}:`, err.message);
    }
  }
  return false;
}

export async function deleteRecord(table, id) {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
      return true;
    } catch (err) {
      console.error(`[Neon DB] deleteRecord error on ${table}:`, err.message);
    }
  }
  return false;
}

// -------------------------------------------------------------
// Image File Upload Helper (Local file or Base64 on Vercel)
// -------------------------------------------------------------
export function saveUploadedImage({ base64Data, folder = 'misc', originalName = 'upload.jpg' }) {
  if (!base64Data) {
    throw new Error('No base64 data provided');
  }

  try {
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'misc';
    const targetDir = path.resolve(PUBLIC_DIR, 'images', cleanFolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

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
    return `/images/${cleanFolder}/${safeFilename}`;
  } catch (err) {
    // If running in a read-only filesystem like Vercel, return base64 Data URL directly
    return base64Data;
  }
}

// -------------------------------------------------------------
// Products Model
// -------------------------------------------------------------
export async function getAllProducts() {
  const [products, coaches, packages] = await Promise.all([
    queryTable('products'),
    queryTable('coaches'),
    queryTable('packages')
  ]);

  return products.map(product => {
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

export async function createProduct(payload) {
  const id = payload.id || `prod_${Date.now()}`;
  
  let formattedLevels = [
    { levelNumber: 1, title: 'Dasar / Starter', focus: 'Pengenalan & Teori Dasar', challenge: 'Uji Teori & Praktik Awal' },
    { levelNumber: 2, title: 'Praktik Menengah', focus: 'Penguasaan Teknik Inti', challenge: 'Simulasi Mandiri' },
    { levelNumber: 3, title: 'Tingkat Mahir', focus: 'Evaluasi & Sertifikasi', challenge: 'Ujian Kelulusan' }
  ];

  if (Array.isArray(payload.levels) && payload.levels.length > 0) {
    formattedLevels = payload.levels.map((lvl, idx) => ({
      levelNumber: parseInt(lvl.levelNumber) || (idx + 1),
      title: lvl.title?.trim() || `Level ${idx + 1}`,
      focus: lvl.focus?.trim() || '',
      challenge: lvl.challenge?.trim() || ''
    }));
  }

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
    levels: formattedLevels,
    created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };

  await upsertRecord('products', id, newProduct);

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
  await upsertRecord('packages', initialPkg.id, initialPkg);

  return { ...newProduct, packages: [initialPkg], coaches: [] };
}

export async function updateProduct(id, patch) {
  const existing = await getById('products', id);
  if (!existing) return null;

  if (Array.isArray(patch.levels)) {
    patch.levels = patch.levels.map((lvl, idx) => ({
      levelNumber: parseInt(lvl.levelNumber) || (idx + 1),
      title: lvl.title?.trim() || `Level ${idx + 1}`,
      focus: lvl.focus?.trim() || '',
      challenge: lvl.challenge?.trim() || ''
    }));
  }

  const updated = { ...existing, ...patch };
  await upsertRecord('products', id, updated);
  return updated;
}

export async function deleteProduct(id) {
  const sql = getSql();
  await deleteRecord('products', id);
  if (sql) {
    try {
      await sql.query(`DELETE FROM packages WHERE data->>'productId' = $1;`, [id]);
    } catch (e) {
      console.warn('[Neon DB] error cleaning packages on deleteProduct:', e);
    }
  }
  return true;
}

// -------------------------------------------------------------
// Packages Model
// -------------------------------------------------------------
export async function getAllPackages(productId = null) {
  if (productId) {
    return await queryTable('packages', `WHERE data->>'productId' = $1`, [productId]);
  }
  return await queryTable('packages');
}

export async function createPackage(payload) {
  const priceNum = parseInt(payload.price) || 400000;
  const product = await getById('products', payload.productId);

  const newPkg = {
    id: payload.id || `pkg_${Date.now()}`,
    productId: payload.productId || 'prod_swimming',
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

  await upsertRecord('packages', newPkg.id, newPkg);
  return newPkg;
}

export async function updatePackage(id, patch) {
  const existing = await getById('packages', id);
  if (!existing) return null;

  if (patch.price) {
    const priceNum = parseInt(patch.price) || existing.price;
    patch.price = priceNum;
    patch.formattedPrice = `Rp ${priceNum.toLocaleString('id-ID')}`;
  }

  const updated = { ...existing, ...patch };
  await upsertRecord('packages', id, updated);
  return updated;
}

export async function deletePackage(id) {
  return await deleteRecord('packages', id);
}

// -------------------------------------------------------------
// Coaches Model
// -------------------------------------------------------------
export async function getAllCoaches() {
  const [coaches, products] = await Promise.all([
    queryTable('coaches'),
    queryTable('products')
  ]);

  return coaches.map(coach => {
    const mappedProducts = products.filter(p => Array.isArray(coach.productIds) && coach.productIds.includes(p.id));
    return {
      ...coach,
      mappedProducts
    };
  });
}

export async function createCoach(payload) {
  const coachId = payload.id || `coach_${Date.now()}`;
  const userId = `usr_${coachId}`;
  const email = payload.email?.trim() || `coach.${Date.now()}@mineskills.id`;
  const defaultPassword = '123';

  // Check if user already exists
  const users = await queryTable('users', `WHERE LOWER(data->>'email') = LOWER($1)`, [email]);
  const existingUser = users[0];

  if (!existingUser) {
    const newUser = {
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
    };
    await upsertRecord('users', userId, newUser);
  }

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

  await upsertRecord('coaches', coachId, newCoach);
  return newCoach;
}

export async function updateCoach(id, patch) {
  const existing = await getById('coaches', id);
  if (!existing) return null;

  const updated = { ...existing, ...patch };
  await upsertRecord('coaches', id, updated);

  if (updated.userId) {
    const user = await getById('users', updated.userId);
    if (user) {
      if (patch.name) user.name = patch.name;
      if (patch.email) user.email = patch.email;
      if (patch.phone) user.phone = patch.phone;
      if (patch.avatar) user.avatar = patch.avatar;
      await upsertRecord('users', updated.userId, user);
    }
  }

  return updated;
}

export async function deleteCoach(id) {
  const coach = await getById('coaches', id);
  if (coach && coach.userId) {
    await deleteRecord('users', coach.userId);
  }
  await deleteRecord('coaches', id);
  return true;
}

// -------------------------------------------------------------
// Students & Independent Customer Schedules
// -------------------------------------------------------------
export async function getAllStudents() {
  const [students, schedules] = await Promise.all([
    queryTable('students'),
    queryTable('student_schedules')
  ]);

  return students.map(student => {
    const studentScheds = schedules.filter(s => s.studentId === student.id);
    return {
      ...student,
      memberSchedules: studentScheds
    };
  });
}

export async function getStudentById(id) {
  const student = await getById('students', id);
  if (!student) return null;
  const schedules = await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [id]);
  return { ...student, memberSchedules: schedules };
}

export async function createStudent(payload) {
  const now = new Date();
  const studentId = `stu_${Date.now()}`;
  const userId = `usr_cust_${Date.now()}`;
  const cleanEmail = payload.email?.trim() || `${(payload.phone || Date.now()).toString().replace(/\D/g, '')}@customer.mineskills.id`;

  const [products, packages, coaches] = await Promise.all([
    queryTable('products'),
    queryTable('packages'),
    queryTable('coaches')
  ]);

  const product = products.find(p => p.id === payload.productId) || products[0];
  const pkg = packages.find(p => p.id === payload.packageId) || packages.find(p => p.productId === product?.id) || packages[0];
  const coach = coaches.find(c => c.id === payload.assignedCoachId) || coaches[0];

  const existingUsers = await queryTable('users', `WHERE LOWER(data->>'email') = LOWER($1)`, [cleanEmail]);
  let user = existingUsers[0];
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
    await upsertRecord('users', userId, user);
  } else {
    user.student_id = studentId;
    await upsertRecord('users', user.id, user);
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

  await upsertRecord('students', studentId, newStudent);

  // Auto-generate schedules
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
    await upsertRecord('student_schedules', sch.id, sch);
    studentSchedules.push(sch);
  }

  return { ...newStudent, memberSchedules: studentSchedules };
}

export async function updateStudent(id, patch) {
  const existing = await getById('students', id);
  if (!existing) return null;

  const updated = { ...existing, ...patch };
  await upsertRecord('students', id, updated);
  return updated;
}

export async function deleteStudent(id) {
  const sql = getSql();
  await deleteRecord('students', id);
  if (sql) {
    try {
      await sql.query(`DELETE FROM student_schedules WHERE data->>'studentId' = $1;`, [id]);
    } catch (e) {
      console.warn('[Neon DB] error cleaning schedules on deleteStudent:', e);
    }
  }
  return true;
}

export async function getAllSchedules(filter = {}) {
  let list = await queryTable('student_schedules');
  if (filter.studentId) list = list.filter(s => s.studentId === filter.studentId);
  if (filter.coachName) list = list.filter(s => s.coachName === filter.coachName);
  if (filter.status) list = list.filter(s => s.status === filter.status);
  return list;
}

export async function createStudentSchedule(payload) {
  const student = payload.studentId ? await getById('students', payload.studentId) : null;
  const existingForStudent = payload.studentId ? await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [payload.studentId]) : [];
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

  await upsertRecord('student_schedules', newSchedule.id, newSchedule);

  if (student) {
    const studentSchedules = await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [student.id]);
    student.packageTotalSessions = Math.max(student.packageTotalSessions || 4, studentSchedules.length);
    await upsertRecord('students', student.id, student);
  }

  return newSchedule;
}

export async function updateStudentSchedule(scheduleId, patch) {
  const existing = await getById('student_schedules', scheduleId);
  if (!existing) return null;

  const updated = { ...existing, ...patch };
  await upsertRecord('student_schedules', scheduleId, updated);

  const studentId = updated.studentId;
  if (studentId) {
    const student = await getById('students', studentId);
    if (student) {
      const studentSchedules = await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [studentId]);
      const completedCount = studentSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
      student.completedSessions = completedCount;
      student.sessionsCompletedWithCoach = completedCount;
      const total = student.packageTotalSessions || studentSchedules.length || 4;
      student.overallProgress = Math.round((completedCount / total) * 100);
      await upsertRecord('students', student.id, student);
    }
  }

  return updated;
}

export async function deleteStudentSchedule(scheduleId) {
  const existing = await getById('student_schedules', scheduleId);
  await deleteRecord('student_schedules', scheduleId);

  if (existing && existing.studentId) {
    const student = await getById('students', existing.studentId);
    if (student) {
      const studentSchedules = await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [student.id]);
      student.packageTotalSessions = studentSchedules.length;
      const completedCount = studentSchedules.filter(s => s.status === 'Selesai' || s.status === 'Hadir').length;
      student.completedSessions = completedCount;
      student.sessionsCompletedWithCoach = completedCount;
      student.overallProgress = studentSchedules.length > 0 ? Math.round((completedCount / studentSchedules.length) * 100) : 0;
      await upsertRecord('students', student.id, student);
    }
  }
  return true;
}

// -------------------------------------------------------------
// Customer Registration Flow
// -------------------------------------------------------------
export async function registerCustomerFlow({
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
  const now = new Date();
  const [products, packages, coaches] = await Promise.all([
    queryTable('products'),
    queryTable('packages'),
    queryTable('coaches')
  ]);

  const product = products.find(p => p.id === productId) || products[0];
  const pkg = packages.find(p => p.id === packageId) || packages.find(p => p.productId === product?.id) || packages[0];
  const packagePrice = pkg?.price || 400000;

  const mappedCoaches = coaches.filter(c => Array.isArray(c.productIds) && c.productIds.includes(product?.id));
  const assignedCoach = mappedCoaches[0] || coaches[0] || { id: 'coach_1', name: 'Coach Dimas Prasetyo, S.Or.' };

  const studentId = `stu_${Date.now()}`;
  const userId = `usr_cust_${Date.now()}`;
  const cleanEmail = email?.trim() || `${phone.replace(/\D/g, '') || Date.now()}@customer.mineskills.id`;
  const defaultPassword = '123';

  // 1. Auto User Account
  const existingUsers = await queryTable('users', `WHERE LOWER(data->>'email') = LOWER($1)`, [cleanEmail]);
  let user = existingUsers[0];
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
      created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    await upsertRecord('users', userId, user);
  } else {
    user.student_id = studentId;
    await upsertRecord('users', user.id, user);
  }

  // 2. Student Record
  const newStudent = {
    id: studentId,
    userId: user.id,
    name: studentName?.trim() || 'Siswa Baru',
    nickname: studentName?.trim().split(' ')[0] || 'Siswa',
    age: parseInt(studentAge) || 7,
    parentName: parentName?.trim() || 'Orang Tua Siswa',
    email: cleanEmail,
    phone: phone?.trim() || '',
    productId: product?.id || 'prod_swimming',
    productName: product?.name || 'Skill Renang',
    packageId: pkg?.id || 'pkg_swim_group',
    packageName: `${product?.name} - ${pkg?.name}`,
    assignedCoachId: assignedCoach?.id || null,
    assignedCoachName: assignedCoach?.name || 'Coach Dimas Prasetyo, S.Or.',
    mappingLockSessions: 4,
    sessionsCompletedWithCoach: 0,
    mappingStatus: 'Terkunci (4 Sesi Terikat)',
    location: location || 'Kolam Graha Kresna Pratama, Jatiwaringin',
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
  await upsertRecord('students', studentId, newStudent);

  // 3. Schedules
  const studentSchedules = [];
  const dayName = schedulePref?.split(' ')?.[0] || 'Sabtu';
  const timeSlot = '09.00 - 09.45 WIB';

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
    await upsertRecord('student_schedules', sch.id, sch);
    studentSchedules.push(sch);
  }

  // 4. Dynamic QRIS
  let dynamicQrisString = '';
  try {
    const resQris = convertQRIS(DEFAULT_RAW_QRIS, { amount: packagePrice });
    dynamicQrisString = typeof resQris === 'string' ? resQris : (resQris?.qris || DEFAULT_RAW_QRIS);
  } catch (err) {
    dynamicQrisString = DEFAULT_RAW_QRIS;
  }

  // 5. Transaction
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
  await upsertRecord('transactions', invoiceId, newTransaction);

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
export async function getAllTransactions() {
  const sql = getSql();
  if (sql) {
    try {
      const rows = await sql.query(`SELECT data FROM transactions ORDER BY updated_at DESC;`);
      return rows.map(r => r.data);
    } catch (e) {
      console.warn('[Neon DB] getAllTransactions error:', e);
    }
  }
  const fallback = readJsonFallback();
  return fallback.transactions || [];
}

export async function verifyTransaction(invoiceId) {
  const trx = await getById('transactions', invoiceId);
  if (!trx) return null;

  trx.status = 'Lunas (Verified)';
  trx.paidAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  await upsertRecord('transactions', invoiceId, trx);
  return trx;
}

// -------------------------------------------------------------
// Authentication Model
// -------------------------------------------------------------
export async function loginUser(email, password) {
  const cleanEmail = email?.trim().toLowerCase();
  const users = await queryTable('users', `WHERE LOWER(data->>'email') = LOWER($1)`, [cleanEmail]);
  const user = users[0];

  if (!user) {
    return { success: false, message: 'Email tidak ditemukan.' };
  }

  if (password === '123' || user.password === password) {
    return { success: true, user };
  }

  return { success: false, message: 'Password salah (Gunakan default: 123).' };
}

export async function getAllUsers() {
  return await queryTable('users');
}

export async function getBootstrapData() {
  const [products, coaches, packages, students, transactions, users, locations] = await Promise.all([
    getAllProducts(),
    getAllCoaches(),
    getAllPackages(),
    getAllStudents(),
    getAllTransactions(),
    getAllUsers(),
    queryTable('locations')
  ]);

  return {
    products,
    coaches,
    packages,
    students,
    transactions,
    users,
    locations
  };
}
