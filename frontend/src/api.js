// ─── Customer Storefront API Client ──────────────────────────────────
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
    console.warn('API products fetch warning, loading local sync cache:', err.message);
  }

  if (backendOk) {
    try {
      const backendIdSet = new Set(backendProducts.map(p => p.id));
      const overrides = getStoredOverrides();
      const validOverrides = overrides.filter(o => backendIdSet.has(o.id));
      localStorage.setItem('alrafa_products_override', JSON.stringify(validOverrides));
    } catch {}

    return backendProducts;
  }

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

const CATEGORIES_BASE = `${API_ROOT}/categories`;

export async function fetchCategories() {
  try {
    const res = await fetch(CATEGORIES_BASE);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Customer categories fetch note:', err.message);
  }

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
