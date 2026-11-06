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

// ─── Product Normalization & Storage Helpers ─────────────────────────

export function normalizeProduct(p) {
  if (!p) return null;
  const id = p.id !== undefined ? p.id : (p.Id !== undefined ? p.Id : Date.now());
  const name = p.name || p.Name || '';
  const nameAr = p.nameAr || p.NameAr || '';
  const category = p.category || p.Category || 'Premium Chocolates';
  const description = p.description || p.Description || '';
  const descriptionAr = p.descriptionAr || p.DescriptionAr || '';
  const variants = p.prodVarients_Pricing || p.ProdVarients_Pricing || p.prodVariants_Pricing || p.ProdVariants_Pricing || p.weightPrices || p.WeightPrices || '';
  const img = p.prodImg || p.ProdImg || p.imageUrl || p.ImageUrl || '/logo-circle.png';
  const highlight = p.highlight || p.Highlight || p.tag || p.Tag || '';
  const price = p.price !== undefined ? p.price : (p.Price !== undefined ? p.Price : 35);
  const origPrice = p.originalPrice !== undefined ? p.originalPrice : (p.OriginalPrice !== undefined ? p.OriginalPrice : null);
  const stock = p.stockQuantity !== undefined ? p.stockQuantity : (p.StockQuantity !== undefined ? p.StockQuantity : 0);
  const weight = p.weight || p.Weight || '';
  const isAvailable = p.isAvailable !== undefined ? p.isAvailable : (p.IsAvailable !== undefined ? p.IsAvailable : true);

  return {
    ...p,
    id,
    Id: id,
    name,
    Name: name,
    nameAr,
    NameAr: nameAr,
    category,
    Category: category,
    description,
    Description: description,
    descriptionAr,
    DescriptionAr: descriptionAr,
    prodVarients_Pricing: variants,
    ProdVarients_Pricing: variants,
    prodVariants_Pricing: variants,
    ProdVariants_Pricing: variants,
    weightPrices: variants,
    WeightPrices: variants,
    prodImg: img,
    ProdImg: img,
    imageUrl: img,
    ImageUrl: img,
    highlight,
    Highlight: highlight,
    tag: highlight,
    Tag: highlight,
    price,
    Price: price,
    originalPrice: origPrice,
    OriginalPrice: origPrice,
    stockQuantity: stock,
    StockQuantity: stock,
    weight,
    Weight: weight,
    isAvailable,
    IsAvailable: isAvailable,
  };
}

function getStoredOverrides() {
  try {
    const raw = localStorage.getItem('alrafa_products_override');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOverrides(items) {
  try {
    localStorage.setItem('alrafa_products_override', JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

function syncProductToLocal(product) {
  const normalized = normalizeProduct(product);
  const overrides = getStoredOverrides();
  const existingIdx = overrides.findIndex(p => p.id === normalized.id);
  if (existingIdx !== -1) {
    overrides[existingIdx] = normalized;
  } else {
    overrides.unshift(normalized);
  }
  saveStoredOverrides(overrides);
  return normalized;
}

function removeProductFromLocal(id) {
  const overrides = getStoredOverrides().filter(p => p.id !== id);
  saveStoredOverrides(overrides);
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
  let backendProducts = [];
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        backendProducts = data.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.warn('API fetch warning, loading local sync cache:', err.message);
  }

  const overrides = getStoredOverrides();
  if (overrides.length === 0) {
    return backendProducts;
  }

  // Merge: overrides replace matching backend products or prepend new ones
  const merged = [...backendProducts];
  for (const item of overrides) {
    const idx = merged.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      merged[idx] = item;
    } else {
      merged.unshift(item);
    }
  }
  return merged;
}

export async function fetchProduct(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (response.ok) {
      const data = await response.json();
      return normalizeProduct(data);
    }
  } catch {
    // Fall back to local search
  }
  const overrides = getStoredOverrides();
  const found = overrides.find(p => p.id === Number(id));
  if (found) return found;
  throw new Error(`Product #${id} not found.`);
}

export async function createProduct(productData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      const saved = await response.json();
      return syncProductToLocal(saved);
    }

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
    throw new Error(errorMsg);
  } catch (err) {
    if (err.message && err.message.includes('Unauthorized')) {
      throw err;
    }
    // Network or server waking fallback: save to local sync and return
    console.warn('API save note: Persisting to local database sync cache:', err.message);
    const localSaved = syncProductToLocal({
      ...productData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return localSaved;
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ ...productData, id }),
    });

    if (response.ok) {
      const updated = await response.json();
      return syncProductToLocal(updated);
    }

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
    throw new Error(errorMsg);
  } catch (err) {
    if (err.message && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.warn('API update note: Persisting to local database sync cache:', err.message);
    const localUpdated = syncProductToLocal({
      ...productData,
      id,
      updatedAt: new Date().toISOString(),
    });
    return localUpdated;
  }
}

export async function deleteProduct(id) {
  removeProductFromLocal(id);
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok && response.status === 401) {
      clearAuthData();
      throw new Error('Unauthorized or session expired. Please log in again.');
    }
  } catch (err) {
    console.warn('Delete backend notification note:', err.message);
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
