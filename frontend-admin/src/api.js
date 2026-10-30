// ─── API Configuration ──────────────────────────────────────────────
function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  return 'https://alrafaroastery.onrender.com/api';
}

const API_ROOT = getApiBase();
const API_BASE = `${API_ROOT}/Products`;
const AUTH_BASE = `${API_ROOT}/auth`;

// ─── Token Management ───────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('alrafa_admin_token');
}

export function getAdminUser() {
  try {
    const user = localStorage.getItem('alrafa_admin_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setAuthData(token, fullName, email) {
  localStorage.setItem('alrafa_admin_token', token);
  localStorage.setItem('alrafa_admin_user', JSON.stringify({ fullName, email }));
}

export function clearAuthData() {
  localStorage.removeItem('alrafa_admin_token');
  localStorage.removeItem('alrafa_admin_user');
}

export function isAuthenticated() {
  return !!getToken();
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ─── Auth API ────────────────────────────────────────────────────────

export async function loginUser(email, password) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid email or password.');
  }
  const data = await response.json();
  setAuthData(data.token, data.fullName, data.email);
  return data;
}

export async function signupUser(fullName, email, password) {
  const response = await fetch(`${AUTH_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create account.');
  }
  const data = await response.json();
  setAuthData(data.token, data.fullName, data.email);
  return data;
}

export function logoutUser() {
  clearAuthData();
}

// ─── Products API ────────────────────────────────────────────────────

export async function uploadProductImage(file) {
  // 1. Try local dev Vite middleware if running on localhost
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      const devRes = await fetch('/api/upload-local', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'image/jpeg',
        },
        body: file,
      });
      if (devRes.ok) {
        const data = await devRes.json();
        if (data.url) return data.url;
      }
    } catch {
      // Fall through to backend upload
    }
  }

  // 2. Try Backend API upload endpoint
  const formData = new FormData();
  formData.append('file', file);
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_ROOT}/products/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data.url || data.relativeUrl;
    }
  } catch (err) {
    console.warn('Backend upload failed, attempting fallback:', err);
  }

  // 3. Fallback: Base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export async function fetchProducts() {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product #${id}: ${response.status}`);
  }
  return await response.json();
}

export async function createProduct(productData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Unauthorized or session expired. Please log in again.');
    }
    const errorText = await response.text();
    let errorMsg = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed.message || parsed.title || errorText;
    } catch {
      if (errorText) errorMsg = errorText;
    }
    throw new Error(`Failed to create product: ${errorMsg}`);
  }
  return await response.json();
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ ...productData, id }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Unauthorized or session expired. Please log in again.');
    }
    const errorText = await response.text();
    let errorMsg = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed.message || parsed.title || errorText;
    } catch {
      if (errorText) errorMsg = errorText;
    }
    throw new Error(`Failed to update product: ${errorMsg}`);
  }
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Unauthorized or session expired. Please log in again.');
    }
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
  return true;
}

export async function checkBackendStatus() {
  try {
    const res = await fetch(API_BASE, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
