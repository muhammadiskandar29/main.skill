/**
 * Frontend API Client for Monolithic Backend
 * Interacts with /api/* routes served by Vite server
 */

const API_BASE = '/api';

export async function fetchBootstrap() {
  const res = await fetch(`${API_BASE}/bootstrap`);
  if (!res.ok) throw new Error('Failed to fetch bootstrap data');
  const json = await res.json();
  return json.data;
}

export async function uploadImage(file, folder = 'misc') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            folder,
            originalName: file.name
          })
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Gagal upload gambar');
        }
        resolve(json.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Products
export async function apiGetProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const json = await res.json();
  return json.data;
}

export async function apiCreateProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal membuat produk');
  return json.data;
}

export async function apiUpdateProduct(id, patch) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal update produk');
  return json.data;
}

export async function apiDeleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus produk');
  return json;
}

// Packages (Dynamic Price Tiers)
export async function apiCreatePackage(pkgData) {
  const res = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pkgData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal membuat paket');
  return json.data;
}

export async function apiUpdatePackage(id, patch) {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal update paket');
  return json.data;
}

export async function apiDeletePackage(id) {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus paket');
  return json;
}

// Coaches (Auto creates User Account with password 123456)
export async function apiCreateCoach(coachData) {
  const res = await fetch(`${API_BASE}/coaches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coachData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal membuat coach');
  return json.data;
}

export async function apiUpdateCoach(id, patch) {
  const res = await fetch(`${API_BASE}/coaches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal update coach');
  return json.data;
}

export async function apiDeleteCoach(id) {
  const res = await fetch(`${API_BASE}/coaches/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus coach');
  return json;
}

// Students
export async function apiCreateStudent(studentData) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menambahkan siswa');
  return json.data;
}

export async function apiUpdateStudent(id, patch) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal update siswa');
  return json.data;
}

export async function apiUpdateSchedule(scheduleId, patch) {
  const res = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal update sesi jadwal');
  return json.data;
}

export async function apiCreateSchedule(scheduleData) {
  const res = await fetch(`${API_BASE}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal membuat sesi jadwal');
  return json.data;
}

export async function apiDeleteSchedule(scheduleId) {
  const res = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus sesi jadwal');
  return json;
}

export async function apiDeleteStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus siswa');
  return json;
}

// Customer Registration (Auto Student + User 123456 + Dynamic QRIS + Schedule + Invoice)
export async function apiRegisterCustomer(registrationData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal memproses pendaftaran');
  }
  return json.data;
}

// Transactions / Payment Verification
export async function apiVerifyPayment(invoiceId) {
  const res = await fetch(`${API_BASE}/transactions/${invoiceId}/verify`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal verifikasi pembayaran');
  return json.data;
}

// Auth Login
export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal login');
  }
  return json.data;
}

// Coach Attendances & Geolocation
export async function apiGetCoachAttendances() {
  const res = await fetch(`${API_BASE}/coach-attendances`);
  const json = await res.json();
  return json.data || [];
}

export async function apiRecordCoachAttendance(payload) {
  const res = await fetch(`${API_BASE}/coach-attendances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal mencatat presensi');
  }
  return json.data;
}

export async function apiVerifyCoachAttendance(id) {
  const res = await fetch(`${API_BASE}/coach-attendances/${id}/verify`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal verifikasi presensi');
  return json.data;
}

// Master Locations & Facilities
export async function apiGetLocations() {
  const res = await fetch(`${API_BASE}/locations`);
  const json = await res.json();
  return json.data || [];
}

export async function apiCreateLocation(payload) {
  const res = await fetch(`${API_BASE}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menambah lokasi');
  return json.data;
}

export async function apiUpdateLocation(id, patch) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengubah lokasi');
  return json.data;
}

export async function apiDeleteLocation(id) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghapus lokasi');
  return true;
}

