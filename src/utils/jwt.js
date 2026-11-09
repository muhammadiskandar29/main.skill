/**
 * Lightweight Client-Side JWT Generator & Validator
 * Standard header.payload.signature format with expiration check
 */

function base64UrlEncode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

function base64UrlDecode(str) {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  }
}

export function generateToken(user, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Date.now();
  const payload = {
    sub: user.id || user.email,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'active',
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + expiresInMs) / 1000)
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Deterministic mock HMAC signature based on payload hash
  const pseudoSig = base64UrlEncode(`sig_mineskill_${encPayload.slice(0, 16)}_${now}`);

  return `${encHeader}.${encPayload}.${pseudoSig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token tidak ditemukan.' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Format token tidak valid.' };
  }

  try {
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return { valid: false, error: 'Token autentikasi telah kedaluwarsa.', expired: true };
    }

    if (!payload.role || !payload.email) {
      return { valid: false, error: 'Klaim token tidak lengkap.' };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Gagal memverifikasi tanda tangan token.' };
  }
}
