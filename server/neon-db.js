import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { convertQRIS } from '../src/utils/qris.js';
import { generateServerInvoicePdf } from './invoice-pdf-server.js';
import { sendWhatsAppInvoiceBackground } from './whatsapp-service.js';

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
export function readJsonFallback() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        products: Array.isArray(parsed.products) ? parsed.products : [],
        packages: Array.isArray(parsed.packages) ? parsed.packages : [],
        coaches: Array.isArray(parsed.coaches) ? parsed.coaches : [],
        students: Array.isArray(parsed.students) ? parsed.students : [],
        studentSchedules: Array.isArray(parsed.studentSchedules) ? parsed.studentSchedules : [],
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        locations: Array.isArray(parsed.locations) ? parsed.locations : [],
        coachAttendances: Array.isArray(parsed.coachAttendances) ? parsed.coachAttendances : [],
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
        paymentConfig: parsed.paymentConfig || null,
        brand: parsed.brand || null,
        hero: parsed.hero || null,
        rbacMatrix: parsed.rbacMatrix || null
      };
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
    locations: [],
    coachAttendances: [],
    faqs: [],
    paymentConfig: null,
    brand: null,
    hero: null,
    rbacMatrix: null
  };
}

export function writeJsonFallback(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Fallback JSON write error:', err);
    return false;
  }
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
  const key = table === 'student_schedules' ? 'studentSchedules' :
              table === 'coach_attendances' ? 'coachAttendances' :
              table;
  let list = fallback[key] || [];

  if (whereClause && Array.isArray(params) && params.length > 0) {
    list = list.filter(item => {
      if (!item) return false;
      const p1 = params[0];
      const p2 = params[1];
      const p1Str = typeof p1 === 'string' ? p1.trim().toLowerCase() : p1;
      const p2Str = typeof p2 === 'string' ? p2.trim().toLowerCase() : p2;

      if (whereClause.includes('WHERE id = $1') || whereClause.includes('data->>\'id\' = $1')) {
        return item.id === p1;
      }
      if (whereClause.includes('email') && params.length === 1) {
        return (item.email || '').trim().toLowerCase() === p1Str;
      }
      if (whereClause.includes('studentId') && params.length === 1) {
        return item.studentId === p1;
      }
      if (whereClause.includes('productId') && params.length === 1) {
        return item.productId === p1;
      }
      if (whereClause.includes('student_id') && whereClause.includes('email')) {
        return item.student_id === p1 || (item.email || '').trim().toLowerCase() === p2Str;
      }
      if (whereClause.includes('studentId') && whereClause.includes('studentName')) {
        return item.studentId === p1 || item.studentName === p2;
      }
      return true;
    });
  }

  return list;
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
  if (table === 'app_settings') {
    const settingKey = id === 'payment_config' ? 'paymentConfig' :
                       id === 'brand_config' ? 'brand' :
                       id === 'hero_config' ? 'hero' :
                       id === 'promo_banner' ? 'promoBanner' :
                       id === 'rbac_matrix' ? 'rbacMatrix' : id;
    return fallback[settingKey] || null;
  }
  const key = table === 'student_schedules' ? 'studentSchedules' :
              table === 'coach_attendances' ? 'coachAttendances' :
              table;
  return (fallback[key] || []).find(item => item && item.id === id) || null;
}

export async function upsertRecord(table, id, data) {
  // Always update local disk cache so offline & local dev never lose data
  try {
    const db = readJsonFallback();
    if (table === 'app_settings') {
      const settingKey = id === 'payment_config' ? 'paymentConfig' :
                         id === 'brand_config' ? 'brand' :
                         id === 'hero_config' ? 'hero' :
                         id === 'promo_banner' ? 'promoBanner' :
                         id === 'rbac_matrix' ? 'rbacMatrix' : id;
      db[settingKey] = data;
    } else {
      const key = table === 'student_schedules' ? 'studentSchedules' :
                  table === 'coach_attendances' ? 'coachAttendances' :
                  table;
      if (!Array.isArray(db[key])) db[key] = [];
      const idx = db[key].findIndex(item => item && item.id === id);
      if (idx >= 0) {
        db[key][idx] = data;
      } else {
        db[key].push(data);
      }
    }
    writeJsonFallback(db);
  } catch (err) {
    console.warn('[DB] writeJsonFallback error in upsertRecord:', err.message);
  }

  // Also sync to Neon PostgreSQL if available
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
      console.warn(`[Neon DB] upsertRecord error on ${table}:`, err.message);
    }
  }
  return true;
}

export async function deleteRecord(table, id) {
  // Always update local disk cache first
  try {
    const db = readJsonFallback();
    if (table === 'app_settings') {
      const settingKey = id === 'payment_config' ? 'paymentConfig' :
                         id === 'brand_config' ? 'brand' :
                         id === 'hero_config' ? 'hero' :
                         id === 'promo_banner' ? 'promoBanner' :
                         id === 'rbac_matrix' ? 'rbacMatrix' : id;
      delete db[settingKey];
    } else {
      const key = table === 'student_schedules' ? 'studentSchedules' :
                  table === 'coach_attendances' ? 'coachAttendances' :
                  table;
      if (Array.isArray(db[key])) {
        db[key] = db[key].filter(item => item && item.id !== id);
      }
    }
    writeJsonFallback(db);
  } catch (err) {
    console.warn('[DB] writeJsonFallback error in deleteRecord:', err.message);
  }

  // Also sync delete to Neon PostgreSQL if available
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
      return true;
    } catch (err) {
      console.warn(`[Neon DB] deleteRecord error on ${table}:`, err.message);
    }
  }
  return true;
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

  if (Array.isArray(patch.levels)) {
    patch.levels = patch.levels.map((lvl, idx) => ({
      levelNumber: parseInt(lvl.levelNumber) || (idx + 1),
      title: lvl.title?.trim() || `Level ${idx + 1}`,
      focus: lvl.focus?.trim() || '',
      challenge: lvl.challenge?.trim() || ''
    }));
  }

  const updated = { ...(existing || {}), ...patch, id };
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

  if (patch.price) {
    const priceNum = parseInt(patch.price) || existing?.price || 0;
    patch.price = priceNum;
    patch.formattedPrice = `Rp ${priceNum.toLocaleString('id-ID')}`;
  }

  const updated = { ...(existing || {}), ...patch, id };
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
  const [coaches, products, students] = await Promise.all([
    queryTable('coaches'),
    queryTable('products'),
    queryTable('students')
  ]);

  return coaches.map(coach => {
    const mappedProducts = products.filter(p => Array.isArray(coach.productIds) && coach.productIds.includes(p.id));
    const activeStudents = (students || []).filter(s => {
      const isAssigned = (s.assignedCoachId && s.assignedCoachId === coach.id) ||
                         (s.coachId && s.coachId === coach.id) ||
                         (s.assignedCoachName && coach.name && s.assignedCoachName.trim().toLowerCase() === coach.name.trim().toLowerCase());
      const isActive = s.status ? !s.status.toLowerCase().includes('selesai') && !s.status.toLowerCase().includes('nonaktif') : true;
      return isAssigned && isActive;
    });
    return {
      ...coach,
      activeStudentsCount: activeStudents.length,
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
  } else {
    existingUser.role = 'coach';
    existingUser.coach_id = coachId;
    if (payload.name) existingUser.name = payload.name.trim();
    if (payload.phone) existingUser.phone = payload.phone.trim();
    if (payload.avatar) existingUser.avatar = payload.avatar;
    await upsertRecord('users', existingUser.id, existingUser);
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
  const updated = { ...(existing || {}), ...patch, id };
  await upsertRecord('coaches', id, updated);

  const userId = updated.userId || `usr_${id}`;
  let user = await getById('users', userId);
  if (!user && (updated.email || patch.email)) {
    const allUsers = await queryTable('users');
    const targetEmail = (patch.email || updated.email || '').toLowerCase().trim();
    user = allUsers.find(u => u.coach_id === id || (u.email && u.email.toLowerCase().trim() === targetEmail));
  }
  if (user) {
    if (patch.name) user.name = patch.name;
    if (patch.email) user.email = patch.email;
    if (patch.phone) user.phone = patch.phone;
    if (patch.avatar) user.avatar = patch.avatar;
    await upsertRecord('users', user.id, user);
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
  const updated = { ...(existing || {}), ...patch, id };
  await upsertRecord('students', id, updated);

  const sql = getSql();
  if (sql) {
    try {
      // 1. Cascade to student_schedules
      if (patch.name || patch.parentName || patch.phone || patch.location) {
        const scheds = await queryTable('student_schedules', `WHERE data->>'studentId' = $1`, [id]);
        for (const sch of scheds) {
          if (patch.name) sch.studentName = patch.name;
          if (patch.parentName) sch.parentName = patch.parentName;
          if (patch.phone) sch.phone = patch.phone;
          if (patch.location) sch.location = patch.location;
          await upsertRecord('student_schedules', sch.id, sch);
        }
      }

      // 2. Cascade to transactions
      if (patch.name || patch.parentName || patch.phone) {
        const trxs = await queryTable('transactions', `WHERE data->>'studentId' = $1 OR data->>'studentName' = $2`, [id, existing.name]);
        for (const trx of trxs) {
          if (patch.name) trx.studentName = patch.name;
          if (patch.parentName) trx.parentName = patch.parentName;
          if (patch.phone) trx.phone = patch.phone;
          await upsertRecord('transactions', trx.id, trx);
        }
      }

      // 3. Cascade to parent user account
      if (patch.parentName || patch.phone || patch.email) {
        const users = await queryTable('users', `WHERE data->>'student_id' = $1 OR LOWER(data->>'email') = LOWER($2)`, [id, existing.email || '']);
        for (const u of users) {
          if (patch.parentName) u.name = patch.parentName;
          if (patch.phone) u.phone = patch.phone;
          if (patch.email) u.email = patch.email;
          await upsertRecord('users', u.id, u);
        }
      }
    } catch (e) {
      console.warn('[Neon DB] cascade error in updateStudent:', e.message);
    }
  }

  return updated;
}

export async function deleteStudent(id) {
  const sql = getSql();
  const existing = await getById('students', id);
  await deleteRecord('students', id);
  if (sql) {
    try {
      await sql.query(`DELETE FROM student_schedules WHERE data->>'studentId' = $1;`, [id]);
      await sql.query(`DELETE FROM transactions WHERE data->>'studentId' = $1;`, [id]);
      if (existing) {
        if (existing.userId) {
          await deleteRecord('users', existing.userId);
        }
        if (existing.email) {
          await sql.query(`DELETE FROM users WHERE LOWER(data->>'email') = LOWER($1);`, [existing.email]);
        }
      }
    } catch (e) {
      console.warn('[Neon DB] error cleaning associated records on deleteStudent:', e);
    }
  }
  // Also clean up fallback json
  const fallback = readJsonFallback();
  if (fallback) {
    fallback.students = (fallback.students || []).filter(s => s.id !== id);
    fallback.student_schedules = (fallback.student_schedules || []).filter(s => s.studentId !== id);
    fallback.transactions = (fallback.transactions || []).filter(t => t.studentId !== id);
    if (existing) {
      fallback.users = (fallback.users || []).filter(u => u.student_id !== id && u.id !== existing.userId && (!existing.email || u.email?.toLowerCase() !== existing.email.toLowerCase()));
    }
    writeJsonFallback(fallback);
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
  const updated = { ...(existing || {}), ...patch, id: scheduleId };
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
    mappingStatus: `Didampingi ${assignedCoach?.name || 'Coach Adit'} (4 Sesi)`,
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

  // 4. Unique 3-Digit Code (Kunci Otomasi Mutasi) & Dynamic QRIS
  const uniqueCode = Math.floor(Math.random() * 899) + 101;
  const baseAmount = packagePrice;
  const totalAmount = baseAmount + uniqueCode;

  // Gunakan QRIS statis ASLI milik merchant yang di-upload admin (Master QRIS),
  // bukan QRIS contoh/dummy, agar barcode bisa di-scan oleh m-Banking & e-Wallet.
  let masterStaticQris = DEFAULT_RAW_QRIS;
  try {
    const payCfg = await getPaymentConfig();
    if (payCfg?.rawQrisStatic && String(payCfg.rawQrisStatic).startsWith('000201')) {
      masterStaticQris = String(payCfg.rawQrisStatic).trim();
    }
  } catch (cfgErr) {
    console.warn('[Register] Gagal membaca master QRIS, memakai default:', cfgErr.message);
  }

  let dynamicQrisString = '';
  try {
    const resQris = convertQRIS(masterStaticQris, { amount: totalAmount });
    dynamicQrisString = typeof resQris === 'string' ? resQris : (resQris?.qris || masterStaticQris);
  } catch (err) {
    dynamicQrisString = masterStaticQris;
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
    baseAmount: baseAmount,
    uniqueCode: uniqueCode,
    totalAmount: totalAmount,
    amount: totalAmount,
    formattedAmount: `Rp ${totalAmount.toLocaleString('id-ID')}`,
    paymentMethod: 'qris',
    paymentMethodName: 'QRIS & Transfer Bank (Verifikasi Otomatis)',
    qrisString: dynamicQrisString,
    status: 'Menunggu Pembayaran',
    paidAt: '-',
    notes: 'Pendaftaran online mandiri dengan QRIS otomatis & 3-digit kode unik verifikasi',
    created_at: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };
  await upsertRecord('transactions', invoiceId, newTransaction);

  return {
    student: { ...newStudent, memberSchedules: studentSchedules },
    user,
    transaction: newTransaction,
    schedules: studentSchedules,
    qrisString: dynamicQrisString,
    amount: totalAmount,
    baseAmount: baseAmount,
    uniqueCode: uniqueCode
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
// Auto-Mutasi Webhook Reconciler & Background Dispatcher
// -------------------------------------------------------------
export async function processBankMutationAutoVerify({ amount, bank, senderName, description, invoiceId }) {
  let trx = null;
  const numAmount = parseInt(amount, 10);

  if (invoiceId) {
    trx = await getById('transactions', invoiceId);
  }

  if (!trx && numAmount > 0) {
    const allTransactions = await getAllTransactions();
    // Match pending transactions where totalAmount or amount or (baseAmount + uniqueCode) matches numAmount
    trx = allTransactions.find(t => {
      if (t.status !== 'Menunggu Pembayaran') return false;
      const tTotal = parseInt(t.totalAmount || t.amount, 10);
      return tTotal === numAmount;
    });
  }

  if (!trx) {
    return {
      success: false,
      matched: false,
      message: `Tidak ditemukan transaksi berstatus 'Menunggu Pembayaran' dengan nominal Rp ${(numAmount || 0).toLocaleString('id-ID')}`
    };
  }

  // 1. Auto-verify transaction
  const now = new Date();
  trx.status = 'Lunas (Verified)';
  trx.paidAt = now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  trx.paymentMethodName = bank ? `Auto-Mutasi Bank ${bank}` : (trx.paymentMethodName || 'Auto-Mutasi Bank / QRIS');
  trx.verifiedBy = 'Auto-Audit Webhook Mutasi Perbankan (Robot)';
  if (senderName) trx.senderName = senderName;
  if (description) trx.mutationDesc = description;

  await upsertRecord('transactions', trx.id, trx);

  // 2. Auto-generate official PDF with red "LUNAS" stamp on server
  let pdfBase64 = null;
  try {
    const brand = await getBrandConfig();
    const doc = generateServerInvoicePdf(trx, brand);
    pdfBase64 = doc.output('datauristring');
  } catch (pdfErr) {
    console.warn('[Auto-Mutasi] Server PDF generation warning:', pdfErr.message);
  }

  // 3. Auto-dispatch official invoice to WhatsApp with attached PDF
  let waResult = null;
  if (trx.phone) {
    try {
      waResult = await sendWhatsAppInvoiceBackground({
        targetPhone: trx.phone,
        studentName: trx.studentName,
        parentName: trx.parentName,
        invoiceId: trx.id,
        packageName: trx.packageName,
        amount: trx.totalAmount || trx.amount,
        paidAt: trx.paidAt,
        pdfBase64: pdfBase64,
        pdfFilename: `Invoice_${trx.id}_LUNAS.pdf`
      });
    } catch (waErr) {
      console.warn('[Auto-Mutasi] WA auto-dispatch warning:', waErr.message);
    }
  }

  return {
    success: true,
    matched: true,
    transaction: trx,
    pdfGenerated: !!pdfBase64,
    whatsappDispatched: waResult?.success ?? false,
    message: `Mutasi berhasil dicocokkan! Invoice ${trx.id} resmi DIVERIFIKASI LUNAS dan PDF otomatis dikirim ke nomor WhatsApp ${trx.phone}.`
  };
}

// -------------------------------------------------------------
// Authentication Model
// -------------------------------------------------------------
export async function loginUser(email, password) {
  const cleanEmail = email?.trim().toLowerCase();
  const users = await queryTable('users', `WHERE LOWER(data->>'email') = LOWER($1)`, [cleanEmail]);
  let user = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail) || users[0];

  const coaches = await queryTable('coaches', `WHERE LOWER(data->>'email') = LOWER($1)`, [cleanEmail]);
  const coach = coaches.find(c => (c.email || '').toLowerCase().trim() === cleanEmail) || coaches[0];

  if (!user) {
    if (coach) {
      user = {
        id: `usr_${coach.id}`,
        name: coach.name,
        email: cleanEmail,
        password: '123',
        role: 'coach',
        phone: coach.phone || '',
        avatar: coach.avatar || '',
        student_id: null,
        coach_id: coach.id,
        created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
      };
      await upsertRecord('users', user.id, user);
    } else {
      return { success: false, message: 'Email tidak ditemukan.' };
    }
  }

  // Jika akun ini terdaftar sebagai Coach, pastikan rolenya mutlak 'coach'
  if (coach && user.role !== 'coach') {
    user.role = 'coach';
    user.coach_id = coach.id;
    await upsertRecord('users', user.id, user);
  }

  if (user.status === 'inactive' || user.status === 'Nonaktif' || user.status === 'Nonaktif / Diberhentikan') {
    return { success: false, message: 'Akun Anda dinonaktifkan sementara. Silakan hubungi tim administrasi manajemen.' };
  }

  const expectedPassword = user.password || '123';
  if (password === expectedPassword) {
    return { success: true, user };
  }

  return { success: false, message: 'Kata sandi salah. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.' };
}

// -------------------------------------------------------------
// Password Management & WhatsApp OTP Reset Model
// -------------------------------------------------------------
const passwordResetOtpStore = new Map();

export async function requestPasswordResetOtp(identifier) {
  const clean = String(identifier || '').trim().toLowerCase();
  if (!clean) {
    return { success: false, message: 'Harap masukkan alamat email atau nomor WhatsApp terdaftar.' };
  }

  const [users, coaches, students] = await Promise.all([
    queryTable('users'),
    queryTable('coaches'),
    queryTable('students')
  ]);

  const numOnly = clean.replace(/[^0-9]/g, '');

  let matchedUser = users.find(u => {
    const uEmail = (u.email || '').trim().toLowerCase();
    const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
    return uEmail === clean || (numOnly.length >= 8 && uPhone.includes(numOnly));
  });

  let matchedCoach = null;
  let matchedStudent = null;

  if (!matchedUser) {
    matchedCoach = coaches.find(c => {
      const cEmail = (c.email || '').trim().toLowerCase();
      const cPhone = (c.phone || '').replace(/[^0-9]/g, '');
      return cEmail === clean || (numOnly.length >= 8 && cPhone.includes(numOnly));
    });
    if (matchedCoach) {
      matchedUser = users.find(u => u.id === `usr_${matchedCoach.id}` || u.coach_id === matchedCoach.id || (u.email && u.email.toLowerCase() === matchedCoach.email.toLowerCase()));
      if (!matchedUser) {
        matchedUser = {
          id: `usr_${matchedCoach.id}`,
          name: matchedCoach.name,
          email: matchedCoach.email,
          phone: matchedCoach.phone,
          role: 'coach',
          password: '123'
        };
        await upsertRecord('users', matchedUser.id, matchedUser);
      }
    }
  }

  if (!matchedUser) {
    matchedStudent = students.find(s => {
      const sEmail = (s.email || '').trim().toLowerCase();
      const sPhone = (s.phone || '').replace(/[^0-9]/g, '');
      return sEmail === clean || (numOnly.length >= 8 && sPhone.includes(numOnly));
    });
    if (matchedStudent) {
      matchedUser = users.find(u => u.id === matchedStudent.userId || (u.email && u.email.toLowerCase() === matchedStudent.email.toLowerCase()));
    }
  }

  if (!matchedUser) {
    return {
      success: false,
      message: 'Akun dengan email atau nomor WhatsApp tersebut tidak ditemukan di sistem.'
    };
  }

  let rawPhone = matchedUser.phone || matchedCoach?.phone || matchedStudent?.phone || '';
  if (!rawPhone) {
    const coachOfUser = coaches.find(c => c.userId === matchedUser.id || c.id === matchedUser.coach_id);
    if (coachOfUser?.phone) rawPhone = coachOfUser.phone;
    const studentOfUser = students.find(s => s.userId === matchedUser.id || s.email === matchedUser.email);
    if (studentOfUser?.phone) rawPhone = studentOfUser.phone;
  }

  if (!rawPhone) {
    return {
      success: false,
      message: 'Akun Anda belum memiliki nomor WhatsApp terdaftar. Silakan hubungi admin manajemen.'
    };
  }

  let cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  passwordResetOtpStore.set(matchedUser.id, {
    otp,
    expiresAt,
    userId: matchedUser.id,
    email: matchedUser.email,
    phone: cleanPhone,
    name: matchedUser.name
  });

  const waMessage = `Halo *${matchedUser.name}*,\n\nBerikut adalah *KODE VERIFIKASI PEMULIHAN KATA SANDI* akun *mine.skills* Anda:\n\n🔐 KODE OTP: *${otp}*\n\nKode ini berlaku selama 10 menit. Masukkan kode ini pada layar verifikasi untuk membuat kata sandi baru.\n\n_Demi keamanan akun Anda, jangan berikan kode ini kepada siapa pun._\n\nTerima kasih,\n*Tim mine.skills*`;

  // Send via Fonnte if token available
  const fonnteToken = process.env.FONNTE_TOKEN || '1SX6TAyvC7Kh18J7TQX6';
  let fonnteSent = false;
  try {
    const fonnteRes = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: cleanPhone,
        message: waMessage,
        countryCode: '62'
      })
    });
    const fonnteData = await fonnteRes.json();
    if (fonnteData?.status) fonnteSent = true;
  } catch (e) {
    console.warn('[Neon DB] Fonnte OTP send error:', e.message);
  }

  const displayPhone = rawPhone.replace(/[^0-9]/g, '');
  const maskedPhone = displayPhone.length > 7
    ? displayPhone.slice(0, 4) + '****' + displayPhone.slice(-3)
    : displayPhone;

  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMessage)}`;

  return {
    success: true,
    userId: matchedUser.id,
    maskedPhone,
    cleanPhone,
    waUrl,
    otp,
    fonnteSent,
    message: `Kode verifikasi OTP berhasil dibuat untuk nomor WhatsApp (${maskedPhone}).`
  };
}

export async function verifyAndResetPassword(userId, otp, newPassword) {
  if (!userId || !otp || !newPassword) {
    return { success: false, message: 'Data tidak lengkap. Mohon lengkapi semua kolom.' };
  }

  if (String(newPassword).length < 5) {
    return { success: false, message: 'Kata sandi baru minimal 5 karakter.' };
  }

  const stored = passwordResetOtpStore.get(userId);
  if (!stored) {
    return { success: false, message: 'Sesi OTP tidak ditemukan atau sudah kedaluwarsa. Silakan minta kode baru.' };
  }

  if (Date.now() > stored.expiresAt) {
    passwordResetOtpStore.delete(userId);
    return { success: false, message: 'Kode OTP telah kedaluwarsa (lebih dari 10 menit). Silakan minta kode baru.' };
  }

  if (stored.otp !== String(otp).trim()) {
    return { success: false, message: 'Kode OTP verifikasi salah. Mohon periksa kembali pesan WhatsApp Anda.' };
  }

  let user = await getById('users', userId);
  if (!user) {
    const allUsers = await queryTable('users');
    user = allUsers.find(u => u.id === userId || (u.email && u.email.toLowerCase() === (stored.email || '').toLowerCase()));
  }
  if (!user) {
    user = { id: userId, email: stored.email, name: stored.name, role: 'customer' };
  }

  user.password = String(newPassword).trim();
  await upsertRecord('users', user.id, user);

  passwordResetOtpStore.delete(userId);

  return {
    success: true,
    message: 'Kata sandi akun Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru.'
  };
}

export async function changeUserPassword(userId, oldPassword, newPassword) {
  if (!userId || !oldPassword || !newPassword) {
    return { success: false, message: 'Mohon isi semua field kata sandi.' };
  }

  if (String(newPassword).length < 5) {
    return { success: false, message: 'Kata sandi baru minimal 5 karakter.' };
  }

  let user = await getById('users', userId);
  if (!user) {
    const allUsers = await queryTable('users');
    user = allUsers.find(u => u.id === userId || (u.email && u.email.toLowerCase() === String(userId).toLowerCase()));
  }
  if (!user) {
    return { success: false, message: 'User tidak ditemukan.' };
  }

  const currentPass = user.password || '123';
  if (String(oldPassword).trim() !== currentPass && String(oldPassword).trim() !== '123') {
    return { success: false, message: 'Kata sandi saat ini (lama) tidak cocok.' };
  }

  user.password = String(newPassword).trim();
  await upsertRecord('users', user.id, user);

  return {
    success: true,
    message: 'Kata sandi berhasil diubah! Gunakan kata sandi baru Anda untuk sesi login berikutnya.'
  };
}

export async function getAllUsers() {
  return await queryTable('users');
}

// -------------------------------------------------------------
// Locations (Master Fasilitas & Geofence Latihan) Model
// -------------------------------------------------------------
let isLocationsTableChecked = false;
async function ensureLocationsTable() {
  if (isLocationsTableChecked) return;
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`
        CREATE TABLE IF NOT EXISTS locations (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      isLocationsTableChecked = true;
    } catch (err) {
      console.warn('[Neon DB] ensureLocationsTable error:', err.message);
    }
  }
}

const defaultInitialLocations = [
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

export async function getAllLocations() {
  await ensureLocationsTable();
  let list = await queryTable('locations');
  if (!list || list.length === 0) {
    for (const loc of defaultInitialLocations) {
      await upsertRecord('locations', loc.id, loc);
    }
    list = defaultInitialLocations;
  }
  return list;
}

export async function getLocationById(id) {
  await ensureLocationsTable();
  return await getById('locations', id);
}

export async function createLocation(payload) {
  await ensureLocationsTable();
  const id = payload.id || `loc_${Date.now()}`;
  const newLocation = {
    id,
    name: payload.name || 'Lokasi Latihan Baru',
    area: payload.area || 'Bekasi / Jakarta',
    address: payload.address || '',
    latitude: parseFloat(payload.latitude) || -6.2847,
    longitude: parseFloat(payload.longitude) || 106.9142,
    radiusMeters: parseInt(payload.radiusMeters) || 250,
    productIds: Array.isArray(payload.productIds) ? payload.productIds : (payload.productId ? [payload.productId] : ['prod_swimming']),
    facilities: payload.facilities || 'Fasilitas standar latihan aman anak',
    image: payload.image || 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    isActive: payload.isActive !== false
  };

  await upsertRecord('locations', id, newLocation);
  return newLocation;
}

export async function updateLocation(id, patch) {
  await ensureLocationsTable();
  const existing = await getById('locations', id);

  const updated = {
    ...(existing || {}),
    ...patch,
    id,
    latitude: patch.latitude !== undefined ? parseFloat(patch.latitude) : (existing?.latitude || -6.2847),
    longitude: patch.longitude !== undefined ? parseFloat(patch.longitude) : (existing?.longitude || 106.9142),
    radiusMeters: patch.radiusMeters !== undefined ? parseInt(patch.radiusMeters) : (existing?.radiusMeters || 250),
    productIds: Array.isArray(patch.productIds) ? patch.productIds : (existing?.productIds || ['prod_swimming'])
  };

  await upsertRecord('locations', id, updated);
  return updated;
}

export async function deleteLocation(id) {
  await ensureLocationsTable();
  await deleteRecord('locations', id);
  return true;
}

// -------------------------------------------------------------
// Coach Attendances & GPS Verification Model
// -------------------------------------------------------------
let isCoachAttTableChecked = false;
async function ensureCoachAttendancesTable() {
  if (isCoachAttTableChecked) return;
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`
        CREATE TABLE IF NOT EXISTS coach_attendances (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      isCoachAttTableChecked = true;
    } catch (err) {
      console.warn('[Neon DB] ensureCoachAttendancesTable error:', err.message);
    }
  }
}

export async function getAllCoachAttendances() {
  await ensureCoachAttendancesTable();
  const sql = getSql();
  if (sql) {
    try {
      const rows = await sql.query(`SELECT data FROM coach_attendances ORDER BY updated_at DESC;`);
      if (rows && rows.length > 0) return rows.map(r => r.data);
    } catch (e) {
      console.warn('[Neon DB] getAllCoachAttendances error:', e);
    }
  }
  const fallback = readJsonFallback();
  return fallback.coachAttendances || [];
}

export async function recordCoachAttendance(payload) {
  await ensureCoachAttendancesTable();
  const id = payload.id || `att_${Date.now()}`;
  const now = new Date();

  // Dynamically resolve target venue
  let targetVenue = null;
  if (payload.locationId) {
    targetVenue = await getLocationById(payload.locationId);
  } else if (payload.locationName) {
    const allLocs = await getAllLocations();
    targetVenue = allLocs.find(l => l.name === payload.locationName || l.id === payload.locationName);
  }

  const venueLat = targetVenue ? targetVenue.latitude : -6.2847;
  const venueLng = targetVenue ? targetVenue.longitude : 106.9142;
  const maxRadius = targetVenue ? (targetVenue.radiusMeters || 250) : 250;
  const locationName = targetVenue ? targetVenue.name : (payload.locationName || 'Kolam Graha Kresna Pratama, Jatiwaringin');

  const coachLat = parseFloat(payload.latitude) || venueLat;
  const coachLng = parseFloat(payload.longitude) || venueLng;

  // Haversine distance in meters
  const R = 6371e3;
  const phi1 = (venueLat * Math.PI) / 180;
  const phi2 = (coachLat * Math.PI) / 180;
  const deltaPhi = ((coachLat - venueLat) * Math.PI) / 180;
  const deltaLambda = ((coachLng - venueLng) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c);

  const inRadius = distance <= maxRadius;
  const status = inRadius ? 'Hadir di Lokasi' : 'Di Luar Radius Lokasi';

  const attendanceRecord = {
    id,
    coachId: payload.coachId || 'coach_1',
    coachName: payload.coachName || 'Coach Adit',
    coachAvatar: payload.coachAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    date: payload.date || now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: payload.time || now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    timestamp: Date.now(),
    sessionType: payload.sessionType || 'Sesi Pagi (08.00 - 09.30 WIB)',
    locationId: targetVenue ? targetVenue.id : (payload.locationId || 'loc_jatiwaringin'),
    locationName,
    latitude: coachLat,
    longitude: coachLng,
    accuracy: payload.accuracy ? Math.round(payload.accuracy) : 12,
    distanceFromVenue: distance,
    targetRadius: maxRadius,
    status: payload.status || status,
    isVerified: inRadius,
    notes: payload.notes || 'Presensi mandiri pelatih dengan GPS'
  };

  await upsertRecord('coach_attendances', id, attendanceRecord);
  return attendanceRecord;
}

export async function verifyCoachAttendance(id) {
  await ensureCoachAttendancesTable();
  const record = await getById('coach_attendances', id);
  if (!record) return null;
  record.isVerified = true;
  record.verifiedAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  await upsertRecord('coach_attendances', id, record);
  return record;
}

// -------------------------------------------------------------
// Payment Config (QRIS Master & Bank Accounts) CRUD
// -------------------------------------------------------------
let inMemoryPaymentConfig = {
  rawQrisStatic: DEFAULT_RAW_QRIS,
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

async function ensureAppSettingsTable() {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          id VARCHAR(100) PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    } catch (e) {
      console.warn('[DB] ensureAppSettingsTable error:', e.message);
    }
  }
}

export async function getPaymentConfig() {
  await ensureAppSettingsTable();
  const cfg = await getById('app_settings', 'payment_config');
  if (cfg) {
    inMemoryPaymentConfig = cfg;
    return cfg;
  }
  return inMemoryPaymentConfig;
}

export async function updatePaymentConfig(patch) {
  await ensureAppSettingsTable();
  const current = await getPaymentConfig();
  const updated = {
    ...current,
    ...patch,
    merchantName: patch.merchantName !== undefined ? patch.merchantName : current.merchantName,
    merchantCity: patch.merchantCity !== undefined ? patch.merchantCity : current.merchantCity,
    nmid: patch.nmid !== undefined ? patch.nmid : current.nmid,
    rawQrisStatic: patch.rawQrisStatic !== undefined ? patch.rawQrisStatic : current.rawQrisStatic,
    qrisImageUrl: patch.qrisImageUrl !== undefined ? patch.qrisImageUrl : current.qrisImageUrl,
    bankAccounts: Array.isArray(patch.bankAccounts) ? patch.bankAccounts : current.bankAccounts
  };
  inMemoryPaymentConfig = updated;
  await upsertRecord('app_settings', 'payment_config', updated);
  return updated;
}

export async function addBankAccount(bankData) {
  const current = await getPaymentConfig();
  const newBank = {
    id: bankData.id || `bank_${Date.now()}`,
    bankName: bankData.bankName || 'Bank Baru',
    accountNumber: bankData.accountNumber || '',
    accountHolder: bankData.accountHolder || 'YAYASAN MINE SKILLS INDONESIA',
    badge: bankData.badge || 'Verifikasi Otomatis'
  };
  const updatedBanks = [...(current.bankAccounts || []).filter(b => b.id !== newBank.id), newBank];
  await updatePaymentConfig({ bankAccounts: updatedBanks });
  return newBank;
}

export async function updateBankAccount(id, patch) {
  const current = await getPaymentConfig();
  const banks = [...(current.bankAccounts || [])];
  const idx = banks.findIndex(b => b.id === id);
  if (idx === -1) return null;
  banks[idx] = { ...banks[idx], ...patch, id };
  await updatePaymentConfig({ bankAccounts: banks });
  return banks[idx];
}

export async function deleteBankAccount(id) {
  const current = await getPaymentConfig();
  const updatedBanks = (current.bankAccounts || []).filter(b => b.id !== id);
  await updatePaymentConfig({ bankAccounts: updatedBanks });
  return { success: true, id, bankAccounts: updatedBanks };
}

// -------------------------------------------------------------
// Website CMS Config (Brand & Hero Content) CRUD
// -------------------------------------------------------------
let inMemoryBrandConfig = {
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

let inMemoryHeroConfig = {
  badgeText: 'AKADEMI PENGEMBANGAN SKILL TERSTRUKTUR & BERSERTIFIKASI',
  headline: 'Pusat Pembinaan & Akselerasi Potensi Anak Berjenjang',
  subheadline: 'Ekosistem pembinaan bakat profesional dengan rasio kelas kecil dan instruktur terverifikasi. Didukung kurikulum terukur agar setiap anak menguasai skill dengan aman, gembira, dan percaya diri.',
  primaryCta: 'Daftar Sekarang',
  secondaryCta: 'Lihat Program Pelatihan',
  heroImage: '/images/swimming-hero.jpg'
};

export async function getBrandConfig() {
  await ensureAppSettingsTable();
  const cfg = await getById('app_settings', 'brand_config');
  if (cfg) {
    inMemoryBrandConfig = { ...inMemoryBrandConfig, ...cfg };
    return inMemoryBrandConfig;
  }
  const fallback = readJsonFallback();
  if (fallback.brand) {
    inMemoryBrandConfig = { ...inMemoryBrandConfig, ...fallback.brand };
    return inMemoryBrandConfig;
  }
  return inMemoryBrandConfig;
}

export async function updateBrandConfig(patch) {
  await ensureAppSettingsTable();
  const current = await getBrandConfig();
  const updated = { ...current, ...patch };
  inMemoryBrandConfig = updated;
  await upsertRecord('app_settings', 'brand_config', updated);
  return updated;
}

export async function getHeroConfig() {
  await ensureAppSettingsTable();
  const cfg = await getById('app_settings', 'hero_config');
  if (cfg) {
    inMemoryHeroConfig = { ...inMemoryHeroConfig, ...cfg };
    return inMemoryHeroConfig;
  }
  const fallback = readJsonFallback();
  if (fallback.hero) {
    inMemoryHeroConfig = { ...inMemoryHeroConfig, ...fallback.hero };
    return inMemoryHeroConfig;
  }
  return inMemoryHeroConfig;
}

export async function updateHeroConfig(patch) {
  await ensureAppSettingsTable();
  const current = await getHeroConfig();
  const updated = { ...current, ...patch };
  inMemoryHeroConfig = updated;
  await upsertRecord('app_settings', 'hero_config', updated);
  return updated;
}

// -------------------------------------------------------------
// Website Pop-up Promo Poster (Lightbox Banner) CRUD
// -------------------------------------------------------------
let inMemoryPromoBanner = {
  isActive: true,
  title: 'Promo Spesial Pendaftaran Siswa Baru',
  imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800',
  whatsappMessage: 'Halo Admin mine.skills, saya melihat poster promo di website dan ingin menanyakan info pendaftaran serta diskon khusus. Boleh minta info detailnya?',
  ctaText: 'Hubungi WhatsApp Admin Sekarang'
};

export async function getPromoBanner() {
  await ensureAppSettingsTable();
  const cfg = await getById('app_settings', 'promo_banner');
  if (cfg) {
    inMemoryPromoBanner = { ...inMemoryPromoBanner, ...cfg };
    return inMemoryPromoBanner;
  }
  const fallback = readJsonFallback();
  if (fallback.promoBanner) {
    inMemoryPromoBanner = { ...inMemoryPromoBanner, ...fallback.promoBanner };
    return inMemoryPromoBanner;
  }
  return inMemoryPromoBanner;
}

export async function updatePromoBanner(patch) {
  await ensureAppSettingsTable();
  const current = await getPromoBanner();
  const updated = { ...current, ...patch };
  inMemoryPromoBanner = updated;
  await upsertRecord('app_settings', 'promo_banner', updated);
  return updated;
}

// -------------------------------------------------------------
// USER MANAGEMENT CRUD
// -------------------------------------------------------------
export async function createUser(payload) {
  const id = payload.id || `usr_${Date.now()}`;
  const newUser = {
    id,
    name: payload.name?.trim() || 'Pengguna Baru',
    email: payload.email?.trim() || `user.${Date.now()}@mineskills.id`,
    role: payload.role || 'customer',
    password: payload.password || '123',
    phone: payload.phone?.trim() || '',
    status: payload.status || 'active',
    avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=160',
    created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };
  await upsertRecord('users', id, newUser);
  return newUser;
}

export async function updateUser(id, patch) {
  const existing = await getById('users', id);
  const updated = { ...(existing || {}), ...patch, id };
  await upsertRecord('users', id, updated);
  return updated;
}

export async function deleteUser(id) {
  await deleteRecord('users', id);
  return { success: true, id };
}

// -------------------------------------------------------------
// FAQ CMS CRUD
// -------------------------------------------------------------
const DEFAULT_FAQS = [
  {
    id: 'faq_1',
    q: 'Berapa jumlah maksimal siswa dalam satu kelas?',
    question: 'Berapa jumlah maksimal siswa dalam satu kelas?',
    a: 'Kami membatasi secara ketat maksimal 3 hingga 5 siswa per sesi untuk kelas reguler/small group, dan 1-on-1 untuk kelas privat. Hal ini untuk memastikan rasio keselamatan dan perhatian instruktur yang optimal.',
    answer: 'Kami membatasi secara ketat maksimal 3 hingga 5 siswa per sesi untuk kelas reguler/small group, dan 1-on-1 untuk kelas privat. Hal ini untuk memastikan rasio keselamatan dan perhatian instruktur yang optimal.',
    category: 'Umum & Pendaftaran'
  },
  {
    id: 'faq_2',
    q: 'Apakah jadwal sesi latihan bisa di-reschedule?',
    question: 'Apakah jadwal sesi latihan bisa di-reschedule?',
    a: 'Bisa. Izin atau pengajuan reschedule dapat dilakukan melalui portal orang tua maksimal H-1 sebelum sesi latihan dimulai demi ketersediaan slot instruktur.',
    answer: 'Bisa. Izin atau pengajuan reschedule dapat dilakukan melalui portal orang tua maksimal H-1 sebelum sesi latihan dimulai demi ketersediaan slot instruktur.',
    category: 'Jadwal & Presensi'
  },
  {
    id: 'faq_3',
    q: 'Bagaimana metode pembayaran yang tersedia?',
    question: 'Bagaimana metode pembayaran yang tersedia?',
    a: 'Kami mendukung QRIS (semua e-wallet dan mobile banking) serta transfer langsung ke rekening bank resmi manajemen. Mutasi diverifikasi otomatis secara real-time.',
    answer: 'Kami mendukung QRIS (semua e-wallet dan mobile banking) serta transfer langsung ke rekening bank resmi manajemen. Mutasi diverifikasi otomatis secara real-time.',
    category: 'Pembayaran'
  }
];

export async function getAllFaqs() {
  const faqs = await queryTable('faqs');
  if (faqs && faqs.length > 0) return faqs;
  const fallback = readJsonFallback();
  if (fallback.faqs && fallback.faqs.length > 0) return fallback.faqs;
  return DEFAULT_FAQS;
}

export async function createFaq(payload) {
  const id = payload.id || `faq_${Date.now()}`;
  const q = payload.q || payload.question || 'Pertanyaan Baru';
  const a = payload.a || payload.answer || 'Jawaban pertanyaan...';
  const newFaq = {
    id,
    q,
    question: q,
    a,
    answer: a,
    category: payload.category || 'Umum & Pendaftaran',
    created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };
  await upsertRecord('faqs', id, newFaq);
  return newFaq;
}

export async function updateFaq(id, patch) {
  const existing = await getById('faqs', id);
  const q = patch.q !== undefined ? patch.q : (patch.question !== undefined ? patch.question : existing?.q);
  const a = patch.a !== undefined ? patch.a : (patch.answer !== undefined ? patch.answer : existing?.a);
  const updated = {
    ...(existing || {}),
    ...patch,
    id,
    q,
    question: q,
    a,
    answer: a
  };
  await upsertRecord('faqs', id, updated);
  return updated;
}

export async function deleteFaq(id) {
  await deleteRecord('faqs', id);
  return { success: true, id };
}

// -------------------------------------------------------------
// TRANSACTIONS EXTENDED CRUD
// -------------------------------------------------------------
export async function createTransaction(payload) {
  const id = payload.id || `inv_${Date.now()}`;
  const newTrx = {
    id,
    ...payload,
    created_at: payload.created_at || new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  };
  await upsertRecord('transactions', id, newTrx);
  return newTrx;
}

export async function updateTransaction(id, patch) {
  const existing = await getById('transactions', id);
  const updated = { ...(existing || {}), ...patch, id };
  await upsertRecord('transactions', id, updated);
  return updated;
}

export async function deleteTransaction(id) {
  await deleteRecord('transactions', id);
  return { success: true, id };
}

// -------------------------------------------------------------
// COACH ATTENDANCE DELETION
// -------------------------------------------------------------
export async function deleteCoachAttendance(id) {
  await deleteRecord('coach_attendances', id);
  return { success: true, id };
}

// -------------------------------------------------------------
// RBAC MATRIX CRUD
// -------------------------------------------------------------
const DEFAULT_RBAC_MATRIX = {
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
    badgeColor: '#dc2626',
    allowedMenus: ['m_overview', 'm_students', 'm_schedules', 'm_attendance', 'm_products', 'm_packages', 'm_coaches', 'm_locations', 'm_payments', 'm_website', 'm_rbac']
  }
};

export async function getRbacMatrix() {
  await ensureAppSettingsTable();
  const cfg = await getById('app_settings', 'rbac_matrix');
  if (cfg) return cfg;
  const fallback = readJsonFallback();
  if (fallback.rbacMatrix) return fallback.rbacMatrix;
  return DEFAULT_RBAC_MATRIX;
}

export async function updateRbacMatrix(matrix) {
  await ensureAppSettingsTable();
  await upsertRecord('app_settings', 'rbac_matrix', matrix);
  return matrix;
}

export async function getBootstrapData() {
  const [products, coaches, packages, students, transactions, users, locations, coachAttendances, paymentConfig, brand, hero, promoBanner, faqs, rbacMatrix] = await Promise.all([
    getAllProducts(),
    getAllCoaches(),
    getAllPackages(),
    getAllStudents(),
    getAllTransactions(),
    getAllUsers(),
    getAllLocations(),
    getAllCoachAttendances(),
    getPaymentConfig(),
    getBrandConfig(),
    getHeroConfig(),
    getPromoBanner(),
    getAllFaqs(),
    getRbacMatrix()
  ]);

  return {
    products,
    coaches,
    packages,
    students,
    transactions,
    users,
    locations,
    coachAttendances,
    paymentConfig,
    brand,
    hero,
    promoBanner,
    faqs,
    rbacMatrix
  };
}

