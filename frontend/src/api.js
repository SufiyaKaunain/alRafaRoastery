// ─── Customer Storefront API Client ──────────────────────────────────
const RAW_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://alrafaroastery.onrender.com/api');
const BACKEND_BASE = RAW_BASE.replace(/\/$/, '');

const API_BASE = `${BACKEND_BASE}/Products`;

// ─── Products API ────────────────────────────────────────────────────

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

export async function checkBackendStatus() {
  try {
    const res = await fetch(API_BASE, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
