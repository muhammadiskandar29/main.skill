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
  createTransaction,
  updateTransaction,
  deleteTransaction,
  verifyTransaction,
  processBankMutationAutoVerify,
  registerCustomerFlow,
  saveUploadedImage,
  loginUser,
  requestPasswordResetOtp,
  verifyAndResetPassword,
  changeUserPassword,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllCoachAttendances,
  recordCoachAttendance,
  verifyCoachAttendance,
  deleteCoachAttendance,
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getPaymentConfig,
  updatePaymentConfig,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getBrandConfig,
  updateBrandConfig,
  getHeroConfig,
  updateHeroConfig,
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getRbacMatrix,
  updateRbacMatrix
} from './neon-db.js';
import { sendWhatsAppInvoiceBackground } from './whatsapp-service.js';
import { generateServerInvoicePdf } from './invoice-pdf-server.js';

export async function parseJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return { text: String(req.body) };
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
        // Fallback for iOS Shortcuts / Form-urlencoded / Plain text payloads
        try {
          resolve({ text: decodeURIComponent(body.replace(/\+/g, ' ')) });
        } catch (_) {
          resolve({ text: body });
        }
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
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createTransaction(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/transactions/') && pathname.endsWith('/verify') && method === 'POST') {
      const id = pathname.replace('/api/transactions/', '').replace('/verify', '');
      const verified = await verifyTransaction(id);
      if (!verified) return sendJson(res, 404, { success: false, message: 'Invoice tidak ditemukan.' });
      return sendJson(res, 200, { success: true, data: verified });
    }

    if (pathname.startsWith('/api/transactions/') && !pathname.endsWith('/verify')) {
      const id = decodeURIComponent(pathname.replace('/api/transactions/', '').replace(/\/$/, ''));
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateTransaction(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Transaksi tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteTransaction(id);
        return sendJson(res, 200, { success: true, message: 'Transaksi berhasil dihapus.' });
      }
    }

    // 8a-2. PUBLIC PDF INVOICE STREAMING & DOWNLOAD
    if ((pathname.startsWith('/api/invoices/') || pathname.startsWith('/api/transactions/')) && pathname.endsWith('/pdf')) {
      const id = decodeURIComponent(pathname.replace('/api/invoices/', '').replace('/api/transactions/', '').replace('/pdf', '').replace(/\/$/, ''));
      const allTrx = await getAllTransactions();
      const trx = allTrx.find(t => t.id === id || t.id.toLowerCase() === id.toLowerCase());
      if (!trx) {
        return sendJson(res, 404, { success: false, message: 'Invoice tidak ditemukan.' });
      }
      try {
        const brand = await getBrandConfig();
        const doc = generateServerInvoicePdf(trx, brand);
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Invoice_${trx.id}_LUNAS.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.end(pdfBuffer);
      } catch (err) {
        console.error('[PDF Generation Error]:', err);
        return sendJson(res, 500, { success: false, message: 'Gagal membuat dokumen PDF faktur.' });
      }
    }

    // 8b. WHATSAPP BACKGROUND AUTO-DISPATCH (PDF ATTACHED)
    if (pathname === '/api/whatsapp/send-invoice' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await sendWhatsAppInvoiceBackground(body);
      return sendJson(res, 200, result);
    }

    // 8b-2. WHATSAPP GATEWAY DIAGNOSTIC & TEST ENDPOINT
    if (pathname === '/api/whatsapp/test-fonnte') {
      const target = parsedUrl.query?.target || '085286274726';
      const fonnteToken = process.env.FONNTE_TOKEN || '1SX6TAyvC7Kh18J7TQX6';
      try {
        const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': fonnteToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            target,
            message: '🔔 *TES RESMI KONEKSI WHATSAPP MINE.SKILLS*\n\nJika pesan ini diterima, Fonnte telah 100% TERHUBUNG!',
            countryCode: '62'
          })
        });
        const resData = await response.json();
        return sendJson(res, 200, {
          success: resData.status === true,
          tokenUsed: fonnteToken.slice(0, 6) + '***',
          target,
          fonnteResponse: resData
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // 8c. AUTOMATED BANK MUTATION WEBHOOK (Play Store "Webhook Notification", Moota, Cekmutasi, Custom)
    if (pathname === '/api/webhook/mutasi' && (method === 'POST' || method === 'GET')) {
      const body = method === 'POST' ? await parseJsonBody(req) : {};
      const mergedPayload = { ...parsedUrl.query, ...(typeof body === 'object' && body !== null ? body : {}) };
      const mutations = Array.isArray(body) ? body : (Array.isArray(mergedPayload.mutations) ? mergedPayload.mutations : [mergedPayload]);
      const results = [];

      // Helper to extract Rupiah nominal from Android Notification text (BCA, Mandiri, BRI, BNI, DANA, GoPay, QRIS)
      const parseNominalFromText = (val) => {
        if (typeof val === 'number') return Math.round(val);
        const str = String(val || '').trim();
        if (!str) return 0;

        // 1. Try matching explicit currency patterns like "Rp 400.142,00", "Rp400.142", "IDR 400,142.00"
        const currencyRegex = /(?:rp\.?|idr)\s*([0-9][0-9.,]*)/gi;
        const matches = [...str.matchAll(currencyRegex)];
        if (matches.length > 0) {
          const candidates = [];
          for (const m of matches) {
            let numStr = m[1].trim();
            // Remove trailing decimal cents like ,00 or .00
            numStr = numStr.replace(/[.,]\d{2}$/, '');
            const digits = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
            if (digits >= 1000) candidates.push(digits);
          }
          if (candidates.length > 0) {
            // Prioritaskan nominal yang memiliki 3 digit kode unik (misal 500142 dibanding 500000)
            const withUniqueCode = candidates.find(d => d % 1000 !== 0);
            return withUniqueCode || candidates[0];
          }
        }

        // 2. Try matching formatted thousand numbers like 400.142 or 400,142 in notification body
        const thousandMatch = str.match(/\b(\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?\b/);
        if (thousandMatch) {
          const digits = parseInt(thousandMatch[1].replace(/[^0-9]/g, ''), 10);
          if (digits >= 1000) return digits;
        }

        // 3. Fallback: direct numeric string
        const clean = str.replace(/[.,]\d{2}$/, '').replace(/[^0-9]/g, '');
        return parseInt(clean, 10) || 0;
      };

      for (const item of mutations) {
        const type = String(item.type || item.mutation_type || 'CR').toUpperCase();
        if (type !== 'CR' && type !== 'CREDIT' && type !== 'MASUK') {
          continue;
        }

        const notifText = [
          item.text,
          item.bigText,
          item.message,
          item.content,
          item.body,
          item.description,
          item.note,
          item.title,
          item.subText
        ].filter(Boolean).join(' ');

        const rawAmount = item.amount || item.nominal || item.total || notifText || 0;
        const cleanAmount = parseNominalFromText(rawAmount);

        const detectedBank = item.bank || item.bank_type || item.account_type || item.appName || item.title || item.package || 'Webhook Notification HP';
        const detectedSender = item.sender || item.sender_name || item.title || 'Notifikasi Pembayaran';

        if (cleanAmount > 0) {
          const autoRes = await processBankMutationAutoVerify({
            amount: cleanAmount,
            bank: detectedBank,
            senderName: detectedSender,
            description: notifText || 'Notifikasi otomatis dari HP Admin',
            invoiceId: item.invoice_id || item.invoiceId || null
          });
          results.push(autoRes);
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: `Diproses ${results.length} notifikasi mutasi perbankan.`,
        data: results
      });
    }

    // 8d. SIMULATOR WEBHOOK MUTASI (For Admin & Testing in CMS)
    if (pathname === '/api/webhook/simulate-test' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { amount, invoiceId, bank, senderName, description } = body;
      const resData = await processBankMutationAutoVerify({
        amount,
        invoiceId,
        bank: bank || 'BCA (Simulasi)',
        senderName: senderName || 'Bapak/Ibu Wali Murid',
        description: description || 'Pembayaran Kursus mine.skills'
      });
      return sendJson(res, 200, resData);
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

    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { identifier } = body;
      const result = await requestPasswordResetOtp(identifier);
      if (!result.success) {
        return sendJson(res, 400, result);
      }
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/auth/verify-reset-otp' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { userId, otp, newPassword } = body;
      const result = await verifyAndResetPassword(userId, otp, newPassword);
      if (!result.success) {
        return sendJson(res, 400, result);
      }
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/auth/change-password' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { userId, oldPassword, newPassword } = body;
      const result = await changeUserPassword(userId, oldPassword, newPassword);
      if (!result.success) {
        return sendJson(res, 400, result);
      }
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/users') {
      if (method === 'GET') {
        const users = await getAllUsers();
        return sendJson(res, 200, { success: true, data: users });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createUser(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/users/')) {
      const id = decodeURIComponent(pathname.replace('/api/users/', '').replace(/\/$/, ''));
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateUser(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'User tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteUser(id);
        return sendJson(res, 200, { success: true, message: 'User berhasil dihapus.' });
      }
    }

    // 10. COACH ATTENDANCE & GEOLOCATION MONITORING
    if (pathname === '/api/coach-attendances') {
      if (method === 'GET') {
        const attendances = await getAllCoachAttendances();
        return sendJson(res, 200, { success: true, data: attendances });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const recorded = await recordCoachAttendance(body);
        return sendJson(res, 201, { success: true, data: recorded });
      }
    }

    if (pathname.startsWith('/api/coach-attendances/') && pathname.endsWith('/verify') && method === 'POST') {
      const id = pathname.replace('/api/coach-attendances/', '').replace('/verify', '');
      const verified = await verifyCoachAttendance(id);
      if (!verified) return sendJson(res, 404, { success: false, message: 'Data absensi tidak ditemukan.' });
      return sendJson(res, 200, { success: true, data: verified });
    }

    if (pathname.startsWith('/api/coach-attendances/') && !pathname.endsWith('/verify') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/coach-attendances/', '').replace(/\/$/, ''));
      await deleteCoachAttendance(id);
      return sendJson(res, 200, { success: true, message: 'Data absensi berhasil dihapus.' });
    }

    // 11. LOCATIONS / VENUES MASTER CRUD
    if (pathname === '/api/locations') {
      if (method === 'GET') {
        const locations = await getAllLocations();
        return sendJson(res, 200, { success: true, data: locations });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createLocation(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/locations/')) {
      const id = decodeURIComponent(pathname.replace('/api/locations/', '').replace(/\/$/, ''));
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateLocation(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Lokasi tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteLocation(id);
        return sendJson(res, 200, { success: true, message: 'Lokasi berhasil dihapus.' });
      }
    }

    // 12. PAYMENT CONFIG & BANK ACCOUNTS CRUD
    if (pathname === '/api/payment-config') {
      if (method === 'GET') {
        const config = await getPaymentConfig();
        return sendJson(res, 200, { success: true, data: config });
      }
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updatePaymentConfig(body);
        return sendJson(res, 200, { success: true, data: updated });
      }
    }

    if (pathname === '/api/payment-config/banks' && method === 'POST') {
      const body = await parseJsonBody(req);
      const created = await addBankAccount(body);
      return sendJson(res, 201, { success: true, data: created });
    }

    if (pathname.startsWith('/api/payment-config/banks/')) {
      const bankId = decodeURIComponent(pathname.replace('/api/payment-config/banks/', '').replace(/\/$/, ''));
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateBankAccount(bankId, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Rekening bank tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        const result = await deleteBankAccount(bankId);
        return sendJson(res, 200, { success: true, message: 'Rekening bank berhasil dihapus.', data: result });
      }
    }

    // 13. WEBSITE CMS (BRAND & HERO)
    if (pathname === '/api/settings/brand') {
      if (method === 'GET') {
        const brand = await getBrandConfig();
        return sendJson(res, 200, { success: true, data: brand });
      }
      if (method === 'PUT' || method === 'POST') {
        const body = await parseJsonBody(req);
        const updated = await updateBrandConfig(body);
        return sendJson(res, 200, { success: true, data: updated });
      }
    }

    if (pathname === '/api/settings/hero') {
      if (method === 'GET') {
        const hero = await getHeroConfig();
        return sendJson(res, 200, { success: true, data: hero });
      }
      if (method === 'PUT' || method === 'POST') {
        const body = await parseJsonBody(req);
        const updated = await updateHeroConfig(body);
        return sendJson(res, 200, { success: true, data: updated });
      }
    }

    // 14. FAQ CMS CRUD
    if (pathname === '/api/faqs') {
      if (method === 'GET') {
        const faqs = await getAllFaqs();
        return sendJson(res, 200, { success: true, data: faqs });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const created = await createFaq(body);
        return sendJson(res, 201, { success: true, data: created });
      }
    }

    if (pathname.startsWith('/api/faqs/')) {
      const id = decodeURIComponent(pathname.replace('/api/faqs/', '').replace(/\/$/, ''));
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateFaq(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'FAQ tidak ditemukan.' });
        return sendJson(res, 200, { success: true, data: updated });
      }
      if (method === 'DELETE') {
        await deleteFaq(id);
        return sendJson(res, 200, { success: true, message: 'FAQ berhasil dihapus.' });
      }
    }

    // 15. RBAC MATRIX CRUD
    if (pathname === '/api/rbac-matrix') {
      if (method === 'GET') {
        const matrix = await getRbacMatrix();
        return sendJson(res, 200, { success: true, data: matrix });
      }
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await updateRbacMatrix(body);
        return sendJson(res, 200, { success: true, data: updated });
      }
    }

    // Endpoint not found
    return sendJson(res, 404, { success: false, message: `Endpoint ${pathname} tidak ditemukan.` });
  } catch (error) {
    console.error('[API Error]', error);
    return sendJson(res, 500, { success: false, message: error.message });
  }
}
