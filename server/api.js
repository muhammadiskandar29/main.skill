import url from 'node:url';
import {
  readDb,
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
  getAllSchedules,
  createStudentSchedule,
  updateStudentSchedule,
  deleteStudentSchedule,
  deleteStudent,
  getAllTransactions,
  verifyTransaction,
  registerCustomerFlow,
  saveUploadedImage,
  loginUser,
  getAllUsers
} from './db.js';

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against huge payload (> 20MB)
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

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export function apiPlugin() {
  return {
    name: 'monolithic-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        // Only intercept /api/* routes
        if (!pathname.startsWith('/api/')) {
          return next();
        }

        // Handle CORS preflight
        if (method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          return res.end();
        }

        try {
          // -------------------------------------------------------------
          // 1. BOOTSTRAP / HEALTH
          // -------------------------------------------------------------
          if (pathname === '/api/health') {
            return sendJson(res, 200, { status: 'ok', serverTime: new Date().toISOString() });
          }

          if (pathname === '/api/bootstrap' && method === 'GET') {
            const db = readDb();
            const products = getAllProducts();
            const coaches = getAllCoaches();
            const packages = getAllPackages();
            const students = getAllStudents();
            const transactions = getAllTransactions();
            const users = getAllUsers();

            return sendJson(res, 200, {
              success: true,
              data: {
                products,
                coaches,
                packages,
                students,
                transactions,
                users,
                locations: db.locations || []
              }
            });
          }

          // -------------------------------------------------------------
          // 2. IMAGE UPLOAD
          // -------------------------------------------------------------
          if (pathname === '/api/upload' && method === 'POST') {
            const body = await parseJsonBody(req);
            const { base64Data, folder, originalName } = body;
            if (!base64Data) {
              return sendJson(res, 400, { success: false, message: 'Data gambar base64 wajib dikirim.' });
            }
            const relativePath = saveUploadedImage({
              base64Data,
              folder: folder || 'misc',
              originalName: originalName || 'image.jpg'
            });
            return sendJson(res, 200, { success: true, url: relativePath });
          }

          // -------------------------------------------------------------
          // 3. PRODUCTS CRUD
          // -------------------------------------------------------------
          if (pathname === '/api/products') {
            if (method === 'GET') {
              return sendJson(res, 200, { success: true, data: getAllProducts() });
            }
            if (method === 'POST') {
              const body = await parseJsonBody(req);
              const created = createProduct(body);
              return sendJson(res, 201, { success: true, data: created });
            }
          }

          if (pathname.startsWith('/api/products/')) {
            const id = pathname.replace('/api/products/', '');
            if (method === 'PUT') {
              const body = await parseJsonBody(req);
              const updated = updateProduct(id, body);
              if (!updated) return sendJson(res, 404, { success: false, message: 'Produk tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: updated });
            }
            if (method === 'DELETE') {
              deleteProduct(id);
              return sendJson(res, 200, { success: true, message: 'Produk berhasil dihapus.' });
            }
          }

          // -------------------------------------------------------------
          // 4. PACKAGES CRUD
          // -------------------------------------------------------------
          if (pathname === '/api/packages') {
            if (method === 'GET') {
              const prodId = parsedUrl.query.productId;
              return sendJson(res, 200, { success: true, data: getAllPackages(prodId) });
            }
            if (method === 'POST') {
              const body = await parseJsonBody(req);
              const created = createPackage(body);
              return sendJson(res, 201, { success: true, data: created });
            }
          }

          if (pathname.startsWith('/api/packages/')) {
            const id = pathname.replace('/api/packages/', '');
            if (method === 'PUT') {
              const body = await parseJsonBody(req);
              const updated = updatePackage(id, body);
              if (!updated) return sendJson(res, 404, { success: false, message: 'Paket tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: updated });
            }
            if (method === 'DELETE') {
              deletePackage(id);
              return sendJson(res, 200, { success: true, message: 'Paket berhasil dihapus.' });
            }
          }

          // -------------------------------------------------------------
          // 5. COACHES CRUD (WITH AUTO USER ACCOUNT CREATION)
          // -------------------------------------------------------------
          if (pathname === '/api/coaches') {
            if (method === 'GET') {
              return sendJson(res, 200, { success: true, data: getAllCoaches() });
            }
            if (method === 'POST') {
              const body = await parseJsonBody(req);
              const created = createCoach(body);
              return sendJson(res, 201, { success: true, data: created });
            }
          }

          if (pathname.startsWith('/api/coaches/')) {
            const id = pathname.replace('/api/coaches/', '');
            if (method === 'PUT') {
              const body = await parseJsonBody(req);
              const updated = updateCoach(id, body);
              if (!updated) return sendJson(res, 404, { success: false, message: 'Coach tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: updated });
            }
            if (method === 'DELETE') {
              deleteCoach(id);
              return sendJson(res, 200, { success: true, message: 'Coach berhasil dihapus.' });
            }
          }

          // -------------------------------------------------------------
          // 6. STUDENTS & SCHEDULES CRUD
          // -------------------------------------------------------------
          if (pathname === '/api/students') {
            if (method === 'GET') {
              return sendJson(res, 200, { success: true, data: getAllStudents() });
            }
            if (method === 'POST') {
              const body = await parseJsonBody(req);
              const created = createStudent(body);
              return sendJson(res, 201, { success: true, data: created });
            }
          }

          if (pathname.startsWith('/api/students/')) {
            const id = pathname.replace('/api/students/', '');
            if (method === 'GET') {
              const student = getStudentById(id);
              if (!student) return sendJson(res, 404, { success: false, message: 'Siswa tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: student });
            }
            if (method === 'PUT') {
              const body = await parseJsonBody(req);
              const updated = updateStudent(id, body);
              if (!updated) return sendJson(res, 404, { success: false, message: 'Siswa tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: updated });
            }
            if (method === 'DELETE') {
              deleteStudent(id);
              return sendJson(res, 200, { success: true, message: 'Siswa berhasil dihapus.' });
            }
          }

          if (pathname === '/api/schedules') {
            if (method === 'GET') {
              return sendJson(res, 200, { success: true, data: getAllSchedules(parsedUrl.query) });
            }
            if (method === 'POST') {
              const body = await parseJsonBody(req);
              const created = createStudentSchedule(body);
              return sendJson(res, 201, { success: true, data: created });
            }
          }

          if (pathname.startsWith('/api/schedules/')) {
            const schedId = pathname.replace('/api/schedules/', '');
            if (method === 'PUT') {
              const body = await parseJsonBody(req);
              const updated = updateStudentSchedule(schedId, body);
              if (!updated) return sendJson(res, 404, { success: false, message: 'Jadwal sesi tidak ditemukan.' });
              return sendJson(res, 200, { success: true, data: updated });
            }
            if (method === 'DELETE') {
              deleteStudentSchedule(schedId);
              return sendJson(res, 200, { success: true, message: 'Sesi latihan berhasil dihapus.' });
            }
          }

          // -------------------------------------------------------------
          // 7. CUSTOMER REGISTRATION FLOW (DYNAMIC QRIS & AUTO USER)
          // -------------------------------------------------------------
          if (pathname === '/api/register' && method === 'POST') {
            const body = await parseJsonBody(req);
            if (!body.studentName || !body.phone) {
              return sendJson(res, 400, { success: false, message: 'Nama siswa dan nomor WhatsApp wajib diisi.' });
            }
            const result = registerCustomerFlow(body);
            return sendJson(res, 201, {
              success: true,
              message: 'Pendaftaran berhasil dibuat! Akun user otomatis dibuat dengan default password 123456.',
              data: result
            });
          }

          // -------------------------------------------------------------
          // 8. TRANSACTIONS / INVOICES
          // -------------------------------------------------------------
          if (pathname === '/api/transactions') {
            if (method === 'GET') {
              return sendJson(res, 200, { success: true, data: getAllTransactions() });
            }
          }

          if (pathname.startsWith('/api/transactions/') && pathname.endsWith('/verify') && method === 'POST') {
            const id = pathname.replace('/api/transactions/', '').replace('/verify', '');
            const verified = verifyTransaction(id);
            if (!verified) return sendJson(res, 404, { success: false, message: 'Invoice tidak ditemukan.' });
            return sendJson(res, 200, { success: true, data: verified });
          }

          // -------------------------------------------------------------
          // 9. AUTH (LOGIN & USERS)
          // -------------------------------------------------------------
          if (pathname === '/api/auth/login' && method === 'POST') {
            const body = await parseJsonBody(req);
            const { email, password } = body;
            const authResult = loginUser(email, password);
            if (!authResult.success) {
              return sendJson(res, 401, authResult);
            }
            return sendJson(res, 200, { success: true, data: authResult.user });
          }

          if (pathname === '/api/users' && method === 'GET') {
            return sendJson(res, 200, { success: true, data: getAllUsers() });
          }

          // Not found
          return sendJson(res, 404, { success: false, message: `Endpoint ${pathname} tidak ditemukan.` });
        } catch (error) {
          console.error('[API Middleware Error]', error);
          return sendJson(res, 500, { success: false, message: error.message });
        }
      });
    }
  };
}
