// ─── API Configuration ──────────────────────────────────────────────
function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://alrafaroastery.onrender.com/api';
}

const API_ROOT = getApiBase();
const API_BASE = `${API_ROOT}/Products`;
const AUTH_BASE = `${API_ROOT}/auth`;
const CATEGORIES_BASE = `${API_ROOT}/categories`;

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
  let backendOk = false;
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        backendProducts = data.map(normalizeProduct);
        backendOk = true;
      }
    }
  } catch (err) {
    console.warn('API fetch warning, loading local sync cache:', err.message);
  }

  if (backendOk) {
    // Backend is active and reachable:
    // Synchronize local storage cache so deleted products are never resurrected
    try {
      const backendIdSet = new Set(backendProducts.map(p => p.id));
      const overrides = getStoredOverrides();
      const validOverrides = overrides.filter(o => backendIdSet.has(o.id));
      saveStoredOverrides(validOverrides);
    } catch {}

    return backendProducts;
  }

  // Fallback if backend is completely down:
  const overrides = getStoredOverrides();
  return overrides.length > 0 ? overrides : backendProducts;
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

// ─── Categories API ──────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const res = await fetch(CATEGORIES_BASE);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Categories fetch note:', err.message);
  }

  // Fallback authentic roastery categories
  return [
    { category_Id: 1, category_name: 'African Single Origin Roasts', category_nameAr: 'محامص إفريقية أحادية المصدر', name: 'African Single Origin Roasts' },
    { category_Id: 2, category_name: 'Arabic & Gulf Heritage Roasts', category_nameAr: 'تحميص التراث العربي والخليجي', name: 'Arabic & Gulf Heritage Roasts' },
    { category_Id: 3, category_name: 'Premium Arabic Sweets', category_nameAr: 'حلويات عربية فاخرة', name: 'Premium Arabic Sweets' },
    { category_Id: 4, category_name: 'Premium Chocolates', category_nameAr: 'شوكولاتة بلجيكية فاخرة', name: 'Premium Chocolates' },
    { category_Id: 5, category_name: 'Luxury Chocolates', category_nameAr: 'شوكولاتة فاخرة', name: 'Luxury Chocolates' },
    { category_Id: 6, category_name: 'Premium Dates', category_nameAr: 'تمور فاخرة ومحشوة', name: 'Premium Dates' },
    { category_Id: 7, category_name: 'Dates & Confections', category_nameAr: 'تمور وحلويات', name: 'Dates & Confections' },
    { category_Id: 8, category_name: 'Premium Nuts & Dry Fruits', category_nameAr: 'مكسرات وفواكه مجففة فاخرة', name: 'Premium Nuts & Dry Fruits' },
    { category_Id: 9, category_name: 'Premium Spices', category_nameAr: 'بهارات وتوابل فاخرة', name: 'Premium Spices' },
    { category_Id: 10, category_name: 'Turkish Specialty Roasts', category_nameAr: 'قهوة تركية مختصة', name: 'Turkish Specialty Roasts' },
    { category_Id: 11, category_name: 'Coffee Beans', category_nameAr: 'حبوب القهوة', name: 'Coffee Beans' },
    { category_Id: 12, category_name: 'Specialty Drinks', category_nameAr: 'مشروبات مختصة', name: 'Specialty Drinks' },
  ];
}

export async function createCategory(categoryData) {
  const res = await fetch(CATEGORIES_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let msg = res.statusText;
    try { msg = JSON.parse(errorText).message || errorText; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function updateCategory(id, categoryData) {
  const res = await fetch(`${CATEGORIES_BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ ...categoryData, category_Id: id }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let msg = res.statusText;
    try { msg = JSON.parse(errorText).message || errorText; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function deleteCategory(id, deleteProducts = false, categoryName = '') {
  const url = deleteProducts
    ? `${CATEGORIES_BASE}/${id}?deleteProducts=true`
    : `${CATEGORIES_BASE}/${id}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let msg = res.statusText;
    try { msg = JSON.parse(errorText).message || errorText; } catch {}
    throw new Error(msg);
  }

  // Purge products from local storage overrides cache
  try {
    const overrides = getStoredOverrides();
    const idNum = Number(id);
    const catNameLower = String(categoryName || '').trim().toLowerCase();

    const cleaned = overrides.filter(p => {
      if (deleteProducts) {
        const pCatId = Number(p.category_Id || p.Category_Id);
        const pCatName = String(p.category || p.Category || '').trim().toLowerCase();
        if (pCatId === idNum || (catNameLower && pCatName === catNameLower)) {
          return false; // remove
        }
      } else {
        const pCatId = Number(p.category_Id || p.Category_Id);
        const pCatName = String(p.category || p.Category || '').trim().toLowerCase();
        if (pCatId === idNum || (catNameLower && pCatName === catNameLower)) {
          p.category_Id = null;
          p.Category = '';
          p.category = '';
        }
      }
      return true;
    });
    saveStoredOverrides(cleaned);
  } catch (err) {
    console.warn('Error updating local storage cache after deleteCategory:', err);
  }

  try {
    return await res.json();
  } catch {
    return true;
  }
}
