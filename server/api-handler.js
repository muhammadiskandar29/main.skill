import url from 'node:url';
import {
  getBootstrapData,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getAllCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllSchedules,
  createStudentSchedule,
  updateStudentSchedule,
  deleteStudentSchedule,
  getAllTransactions,
  verifyTransaction,
  registerCustomerFlow,
  saveUploadedImage,
  loginUser,
  getAllUsers
} from './neon-db.js';

export async function parseJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  return res.end(JSON.stringify(data));
}

export async function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname || '/api';
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  try {
    // 1. HEALTH & BOOTSTRAP
    if (pathname === '/api/health') {
      return sendJson(res, 200, { status: 'ok', database: 'neon-postgresql', serverTime: new Date().toISOString() });
    }

    if (pathname === '/api/bootstrap' && method === 'GET') {
      const data = await getBootstrapData();
      return sendJson(res, 200, { success: true, data });
    }

    // 2. IMAGE UPLOAD
    if (pathname === '/api/upload' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { base64Data, folder, originalName } = body;
      if (!base64Data) {
        return sendJson(res, 400, { success: false, message: 'Data gambar base64 wajib dikirim.' });
      }
      const fileUrl = saveUploadedImage({
        base64Data,
        folder: folder || 'misc',
        originalName: originalName || 'image.jpg'
      });
      return sendJson(res, 200, { success: true, url: fileUrl });
    }

    // 3. PRODUCTS CRUD
    if (pathname === '/api/products') {
      if (method === 'GET') {
        const products = await getAllProducts();
        return sendJson(res, 200, { success: true, data: products });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createProduct(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/products/')) {
      const id = pathname.replace('/api/products/', '');
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateProduct(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Produk tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteProduct(id);
        return sendJson(res, 200, { success: true, message: 'Produk berhasil dihapus.' });
      }
    }

    // 4. PACKAGES CRUD
    if (pathname === '/api/packages') {
      if (method === 'GET') {
        const prodId = parsedUrl.query.productId;
        const packages = await getAllPackages(prodId);
        return sendJson(res, 200, { success: true, data: packages });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createPackage(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/packages/')) {
      const id = pathname.replace('/api/packages/', '');
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updatePackage(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Paket tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deletePackage(id);
        return sendJson(res, 200, { success: true, message: 'Paket berhasil dihapus.' });
      }
    }

    // 5. COACHES CRUD
    if (pathname === '/api/coaches') {
      if (method === 'GET') {
        const coaches = await getAllCoaches();
        return sendJson(res, 200, { success: true, data: coaches });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createCoach(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/coaches/')) {
      const id = pathname.replace('/api/coaches/', '');
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateCoach(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Coach tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteCoach(id);
        return sendJson(res, 200, { success: true, message: 'Coach berhasil dihapus.' });
      }
    }

    // 6. STUDENTS & SCHEDULES CRUD
    if (pathname === '/api/students') {
      if (method === 'GET') {
        const students = await getAllStudents();
        return sendJson(res, 200, { success: true, data: students });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createStudent(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/students/')) {
      const id = pathname.replace('/api/students/', '');
      if (method === 'GET') {
        const student = await getStudentById(id);
        if (!student) return sendJson(res, 404, { success: false, message: 'Siswa tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: student });
      }
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateStudent(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Siswa tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteStudent(id);
        return sendJson(res, 200, { success: true, message: 'Siswa berhasil dihapus.' });
      }
    }

    if (pathname === '/api/schedules') {
      if (method === 'GET') {
        const schedules = await getAllSchedules(parsedUrl.query);
        return sendJson(res, 200, { success: true, data: schedules });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createStudentSchedule(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/schedules/')) {
      const schedId = pathname.replace('/api/schedules/', '');
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateStudentSchedule(schedId, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Jadwal sesi tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteStudentSchedule(schedId);
        return sendJson(res, 200, { success: true, message: 'Sesi latihan berhasil dihapus.' });
      }
    }

    // 7. CUSTOMER REGISTRATION FLOW
    if (pathname === '/api/register' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.studentName || !body.phone) {
        return sendJson(res, 400, { success: false, message: 'Nama siswa dan nomor WhatsApp wajib diisi.' });
      }
      const result = await registerCustomerFlow(body);
      return sendJson(res, 201, {
        success: true,
        message: 'Pendaftaran berhasil dibuat! Akun user otomatis dibuat dengan default password 123.',
        data: result
      });
    }

    // 8. TRANSACTIONS
    if (pathname === '/api/transactions') {
      if (method === 'GET') {
        const transactions = await getAllTransactions();
        return sendJson(res, 200, { success: true, data: transactions });
      }
    }

    if (pathname.startsWith('/api/transactions/') && pathname.endsWith('/verify') && method === 'POST') {
      const id = pathname.replace('/api/transactions/', '').replace('/verify', '');
      const verified = await verifyTransaction(id);
      if (!verified) return sendJson(res, 404, { success: false, message: 'Invoice tidak ditemukan.' });
      return sendJson(res, 200, { success: true, data: verified });
    }

    // 9. AUTH
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password } = body;
      const authResult = await loginUser(email, password);
      if (!authResult.success) {
        return sendJson(res, 401, authResult);
      }
      return sendJson(res, 200, { success: true, data: authResult.user });
    }

    if (pathname === '/api/users' && method === 'GET') {
      const users = await getAllUsers();
      return sendJson(res, 200, { success: true, data: users });
    }

    // Endpoint not found
    return sendJson(res, 404, { success: false, message: `Endpoint ${pathname} tidak ditemukan.` });
  } catch (error) {
    console.error('[API Error]', error);
    return sendJson(res, 500, { success: false, message: error.message });
  }
}
