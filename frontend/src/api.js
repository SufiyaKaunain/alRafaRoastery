// ─── Customer Storefront API Client ──────────────────────────────────
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

export function normalizeProduct(p) {
  if (!p) return null;
  const id = p.id !== undefined ? p.id : (p.Id !== undefined ? p.Id : Date.now());
  const name = p.name || p.Name || '';
  const nameAr = p.nameAr || p.NameAr || '';
  const category = p.category || p.Category || 'Specialty Roastery';
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

// ─── Products API ────────────────────────────────────────────────────

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
    console.warn('API products fetch warning, loading local sync cache:', err.message);
  }

  const overrides = getStoredOverrides();
  if (overrides.length === 0) {
    return backendProducts;
  }

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
    // Fall back to local overrides
  }
  const overrides = getStoredOverrides();
  const found = overrides.find(p => p.id === Number(id));
  if (found) return found;
  throw new Error(`Product #${id} not found.`);
}

export async function checkBackendStatus() {
  try {
    const res = await fetch(API_BASE, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
