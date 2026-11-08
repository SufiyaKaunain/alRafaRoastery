import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, RefreshCw, Upload, Image as ImageIcon, Check, Loader2,
  Link as LinkIcon, Folder, Package, X, Tag, CheckCircle2, RotateCcw, Save, Edit3,
  Info, UploadCloud
} from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, uploadProductImage, fetchCategories } from '../api';

const PRESET_IMAGES = [
  { label: 'Spanish Latte', url: '/assets/products/spanish-latte.jpg' },
  { label: 'Pistachio Latte', url: '/assets/products/pistachio-latte.jpg' },
  { label: 'Saffron Latte', url: '/assets/products/saffron-latte.jpg' },
  { label: 'Espresso', url: '/assets/products/espresso.jpg' },
  { label: 'V60 Pour Over', url: '/assets/products/v60-pour-over.jpg' },
  { label: 'Espresso Beans', url: '/assets/products/espresso-beans.jpg' },
  { label: 'Arabic Coffee', url: '/assets/products/arabic-coffee.jpg' },
  { label: 'Turkish Coffee', url: '/assets/products/turkish-coffee.jpg' },
  { label: 'House Blend', url: '/assets/products/house-blend.jpg' },
  { label: 'Cold Brew', url: '/assets/products/cold-brew.jpg' },
  { label: 'Roasted Pistachios', url: '/assets/products/roasted-pistachios.jpg' },
  { label: 'Roasted Almonds', url: '/assets/products/roasted-almonds.jpg' },
  { label: 'Roasted Cashews', url: '/assets/products/roasted-cashews.jpg' },
  { label: 'Mixed Nuts', url: '/assets/products/mixed-nuts.jpg' },
  { label: 'Milk Chocolate', url: '/assets/products/milk-chocolate.jpg' },
  { label: 'Dark Chocolate', url: '/assets/products/dark-chocolate.jpg' },
  { label: 'Filled Chocolates', url: '/assets/products/filled-chocolates.jpg' },
  { label: 'Stuffed Dates', url: '/assets/products/stuffed-dates.jpg' },
  { label: 'Chocolate Dates', url: '/assets/products/chocolate-dates.jpg' },
];

/* ── Light vs dark tokens ───────────────────────────────── */
function useTheme(lightMode) {
  return lightMode ? {
    cardBg: '#ffffff',
    border: '#e5e7eb',
    headBg: '#f9fafb',
    headColor: '#6b7280',
    textPrimary: '#111827',
    textMuted: '#6b7280',
    textFaint: '#9ca3af',
    inputBg: '#f9fafb',
    inputBorder: '#d1d5db',
    inputColor: '#111827',
    rowHover: '#f9fafb',
    editBtn: { bg: '#f3f4f6', border: '#d1d5db', color: '#374151' },
    delBtn: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
    tagColor: '#b45309',
    tagBg: '#fffbeb',
    tagBorder: '#fde68a',
    selectBg: '#ffffff',
    modalBg: '#ffffff',
    modalBorder: '#e5e7eb',
    labelColor: '#374151',
    presetBtn: { bg: '#f3f4f6', border: '#d1d5db', color: '#374151' },
    cancelBtn: { bg: '#f3f4f6', color: '#374151' },
  } : {
    cardBg: 'rgba(43,29,20,0.7)',
    border: 'var(--border-gold)',
    headBg: 'transparent',
    headColor: 'var(--accent-gold)',
    textPrimary: 'var(--text-cream)',
    textMuted: 'var(--text-muted)',
    textFaint: 'var(--text-faint)',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'var(--border-gold)',
    inputColor: 'var(--text-cream)',
    rowHover: 'rgba(255,255,255,0.03)',
    editBtn: { bg: 'rgba(255,255,255,0.08)', border: 'var(--border-gold)', color: 'var(--text-cream)' },
    delBtn: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
    tagColor: 'var(--accent-gold)',
    tagBg: 'rgba(200,155,106,0.1)',
    tagBorder: 'var(--border-gold)',
    selectBg: '#2B1D14',
    modalBg: '#1E140D',
    modalBorder: 'var(--accent-gold)',
    labelColor: 'var(--text-muted)',
    presetBtn: { bg: 'rgba(200,155,106,0.1)', border: 'var(--border-gold)', color: 'var(--accent-gold)' },
    cancelBtn: { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-cream)' },
  };
}

const getCategoryEmoji = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('chocolate')) return '🍫';
  if (n.includes('nut')) return '🥜';
  if (n.includes('arabic') || n.includes('gulf')) return '☕';
  if (n.includes('african') || n.includes('origin')) return '🌍';
  if (n.includes('turkish')) return '🇹🇷';
  if (n.includes('date')) return '🌴';
  if (n.includes('sweet') || n.includes('baklava')) return '🍬';
  if (n.includes('spice') || n.includes('saffron')) return '🌿';
  if (n.includes('bean')) return '🫘';
  if (n.includes('drink') || n.includes('latte') || n.includes('coffee')) return '☕';
  return '🏷️';
};

export default function AdminDashboard({
  products,
  onRefresh,
  showToast,
  lightMode = false,
}) {
  const t = useTheme(lightMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [categoriesList, setCategoriesList] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories().then(cats => {
      if (Array.isArray(cats) && cats.length > 0) {
        setCategoriesList(cats);
      }
    }).catch(() => {});
  }, []);

  // Helper to parse weight variants from a product
  const parseWeightVariantsFromProduct = (p) => {
    const rawVariants = p?.prodVarients_Pricing || p?.ProdVarients_Pricing || p?.prodVariants_Pricing || p?.ProdVariants_Pricing || p?.weightPrices || p?.WeightPrices;
    if (rawVariants) {
      try {
        const parsed = typeof rawVariants === 'string' ? JSON.parse(rawVariants) : rawVariants;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => {
            const sz = item.size || item.weight || '';
            const sp = item.sellingPrice !== undefined ? String(item.sellingPrice) : (item.price !== undefined ? String(item.price) : '');
            const op = item.originalPrice !== undefined && item.originalPrice !== null ? String(item.originalPrice) : '';
            const sq = item.stockQuantity !== undefined ? String(item.stockQuantity) : (item.stock !== undefined ? String(item.stock) : '20');
            return {
              size: sz,
              weight: sz,
              sellingPrice: sp,
              price: sp,
              originalPrice: op,
              stockQuantity: sq,
              stock: sq,
            };
          });
        }
      } catch (err) {
        console.warn('Failed to parse variants JSON:', err);
      }
    }

    // Fallback: parse comma-separated weights if present
    if (p?.weight) {
      const weights = p.weight.split(',').map(w => w.trim()).filter(Boolean);
      if (weights.length > 0) {
        const basePrice = Number(p.price) || 35;
        return weights.map((w, idx) => {
          let calculated = basePrice;
          if (idx > 0) {
            if (w.includes('1kg') || w.includes('1000g')) calculated = basePrice * 3.4;
            else if (w.includes('500g')) calculated = basePrice * 1.85;
          }
          const sPrice = calculated ? String(Math.round(calculated * 2) / 2) : '';
          return {
            size: w,
            weight: w,
            sellingPrice: sPrice,
            price: sPrice,
            originalPrice: '',
            stockQuantity: idx === 0 ? '20' : (idx === 1 ? '15' : '10'),
            stock: idx === 0 ? '20' : (idx === 1 ? '15' : '10'),
          };
        });
      }
    }

    // Default weight variants matching the design screenshot
    return [
      { size: '250g', weight: '250g', sellingPrice: '35', price: '35', originalPrice: '', stockQuantity: '20', stock: '20' },
      { size: '500g', weight: '500g', sellingPrice: '65', price: '65', originalPrice: '', stockQuantity: '15', stock: '15' },
      { size: '1kg', weight: '1kg', sellingPrice: '120', price: '120', originalPrice: '', stockQuantity: '10', stock: '10' },
    ];
  };

  const initialWeightVariants = [
    { size: '250g', weight: '250g', sellingPrice: '35', price: '35', originalPrice: '', stockQuantity: '20', stock: '20' },
    { size: '500g', weight: '500g', sellingPrice: '65', price: '65', originalPrice: '', stockQuantity: '15', stock: '15' },
    { size: '1kg', weight: '1kg', sellingPrice: '120', price: '120', originalPrice: '', stockQuantity: '10', stock: '10' },
  ];

  const [weightVariants, setWeightVariants] = useState(initialWeightVariants);

  const initialForm = {
    name: '', nameAr: '', description: '', descriptionAr: '',
    price: '35', category: 'Premium Chocolates', category_Id: 4, weight: '250g, 500g, 1kg',
    imageUrl: PRESET_IMAGES[0].url, tag: '', isAvailable: true,
  };
  const [form, setForm] = useState(initialForm);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const processUploadedFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG)', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size cannot exceed 10MB', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const savedUrl = await uploadProductImage(file);
      setForm(prev => ({ ...prev, imageUrl: savedUrl }));
      showToast('Product image saved in assets folder!', 'success');
    } catch (err) {
      showToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const allCategoryNames = [
    ...categoriesList.map(c => c.category_name || c.name).filter(Boolean),
    ...products.map(p => p.category).filter(Boolean)
  ];
  const categories = ['ALL', ...new Set(allCategoryNames)];
  const filteredProducts = products.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) ||
      (p.nameAr && p.nameAr.includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(s));
    return matchSearch && (selectedCategory === 'ALL' || p.category === selectedCategory);
  });

  const openAddModal = async () => {
    setEditingProduct(null);
    let cats = categoriesList;
    try {
      const dbCats = await fetchCategories();
      if (Array.isArray(dbCats) && dbCats.length > 0) {
        setCategoriesList(dbCats);
        cats = dbCats;
      }
    } catch {}

    const firstCat = cats[0]?.category_name || cats[0]?.name || 'Premium Chocolates';
    const firstCatId = cats[0]?.category_Id || cats[0]?.id || 4;

    setForm({
      ...initialForm,
      category: firstCat,
      category_Id: firstCatId,
    });
    setWeightVariants(initialWeightVariants);
    setIsModalOpen(true);
  };

  const openEditModal = async (p) => {
    setEditingProduct(p);
    const parsedVariants = parseWeightVariantsFromProduct(p);
    setWeightVariants(parsedVariants);
    const imageVal = p.prodImg || p.ProdImg || p.imageUrl || p.ImageUrl || '';
    const highlightVal = p.highlight || p.Highlight || p.tag || p.Tag || '';

    let cats = categoriesList;
    try {
      const dbCats = await fetchCategories();
      if (Array.isArray(dbCats) && dbCats.length > 0) {
        setCategoriesList(dbCats);
        cats = dbCats;
      }
    } catch {}

    const matchedCat = cats.find(c =>
      (p.category_Id && (c.category_Id === p.category_Id || c.id === p.category_Id)) ||
      (p.category && (c.category_name?.toLowerCase() === p.category.toLowerCase() || c.name?.toLowerCase() === p.category.toLowerCase()))
    );

    const activeCatName = matchedCat ? (matchedCat.category_name || matchedCat.name) : (p.category || p.Category || 'Premium Chocolates');
    const activeCatId = matchedCat ? (matchedCat.category_Id || matchedCat.id) : (p.category_Id || p.Category_Id || null);

    setForm({
      name: p.name || p.Name || '',
      nameAr: p.nameAr || p.NameAr || '',
      description: p.description || p.Description || '',
      descriptionAr: p.descriptionAr || p.DescriptionAr || '',
      price: parsedVariants[0]?.sellingPrice || parsedVariants[0]?.price || p.price || p.Price || '',
      category: activeCatName,
      category_Id: activeCatId,
      weight: p.weight || p.Weight || parsedVariants.map(v => v.size || v.weight).join(', '),
      imageUrl: imageVal,
      tag: highlightVal,
      isAvailable: p.isAvailable ?? p.IsAvailable ?? true,
    });
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setWeightVariants(prev => [
      ...prev,
      { size: '', weight: '', sellingPrice: '', price: '', originalPrice: '', stockQuantity: '10', stock: '10' }
    ]);
  };

  const handleAddCustomSize = () => {
    setWeightVariants(prev => [
      ...prev,
      { size: '', weight: '', sellingPrice: '', price: '', originalPrice: '', stockQuantity: '10', stock: '10' }
    ]);
    showToast('New variant row added. Enter custom size, prices and stock.', 'info');
  };

  const handleReset = () => {
    setForm(initialForm);
    setWeightVariants([
      { size: '250g', weight: '250g', sellingPrice: '35', price: '35', originalPrice: '', stockQuantity: '20', stock: '20' },
      { size: '500g', weight: '500g', sellingPrice: '65', price: '65', originalPrice: '', stockQuantity: '15', stock: '15' },
      { size: '1kg', weight: '1kg', sellingPrice: '120', price: '120', originalPrice: '', stockQuantity: '10', stock: '10' },
    ]);
    showToast('Form reset to defaults', 'info');
  };

  const handleQuickAddVariant = (weightLabel) => {
    // If already exists, notify user
    const existingIdx = weightVariants.findIndex(v => (v.size || v.weight || '').toLowerCase() === weightLabel.toLowerCase());
    if (existingIdx !== -1) {
      showToast(`${weightLabel} is already in the variants table`, 'info');
      return;
    }
    const lastPrice = weightVariants[weightVariants.length - 1]?.sellingPrice || weightVariants[weightVariants.length - 1]?.price || form.price || '35';
    let suggestedPrice = lastPrice;
    if (weightLabel.includes('1kg')) suggestedPrice = String(Number(lastPrice) * 2 || 120);
    else if (weightLabel.includes('500g')) suggestedPrice = String(Number(lastPrice) * 1.5 || 65);
    else if (weightLabel.includes('250g')) suggestedPrice = String(Number(lastPrice) * 0.7 || 35);

    setWeightVariants(prev => [
      ...prev,
      {
        size: weightLabel,
        weight: weightLabel,
        sellingPrice: suggestedPrice,
        price: suggestedPrice,
        originalPrice: '',
        stockQuantity: '20',
        stock: '20',
      }
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (weightVariants.length <= 1) {
      showToast('At least one variant option is required', 'error');
      return;
    }
    setWeightVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateVariant = (index, field, value) => {
    setWeightVariants(prev => {
      const updated = [...prev];
      const cur = { ...updated[index], [field]: value };
      if (field === 'size') cur.weight = value;
      if (field === 'weight') cur.size = value;
      if (field === 'sellingPrice') cur.price = value;
      if (field === 'price') cur.sellingPrice = value;
      if (field === 'stockQuantity') cur.stock = value;
      if (field === 'stock') cur.stockQuantity = value;
      updated[index] = cur;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Product name is required', 'error'); return; }

    const validVariants = weightVariants.filter(v => (v.size || v.weight) && (v.size || v.weight).trim());
    if (validVariants.length === 0) {
      showToast('Please add at least one product variant with its price and stock', 'error');
      return;
    }

    // Ensure all variants have a valid selling price
    for (const v of validVariants) {
      const p = v.sellingPrice || v.price;
      if (!p || isNaN(p) || Number(p) <= 0) {
        showToast(`Please enter a valid selling price for "${v.size || v.weight}"`, 'error');
        return;
      }
    }

    const basePrice = parseFloat(validVariants[0].sellingPrice || validVariants[0].price);
    const baseOriginalPrice = validVariants[0].originalPrice ? parseFloat(validVariants[0].originalPrice) : null;
    const totalStock = validVariants.reduce((sum, v) => sum + (parseInt(v.stockQuantity || v.stock) || 0), 0);

    const variantsPayload = validVariants.map(v => ({
      size: (v.size || v.weight || '').trim(),
      weight: (v.weight || v.size || '').trim(),
      sellingPrice: parseFloat(v.sellingPrice || v.price),
      price: parseFloat(v.price || v.sellingPrice),
      originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : null,
      stockQuantity: parseInt(v.stockQuantity || v.stock) || 0,
      stock: parseInt(v.stock || v.stockQuantity) || 0,
    }));

    setIsSaving(true);
    try {
      const variantsJson = JSON.stringify(variantsPayload);
      const chosenImg = form.imageUrl.trim() || PRESET_IMAGES[0].url;
      const chosenTag = form.tag.trim();
      const weightSummary = validVariants.map(v => (v.size || v.weight).trim()).join(', ');

      const payload = {
        // Name & NameAr
        name: form.name.trim(),
        Name: form.name.trim(),
        nameAr: form.nameAr.trim(),
        NameAr: form.nameAr.trim(),

        // Category & Category_Id
        category: form.category.trim(),
        Category: form.category.trim(),
        category_Id: form.category_Id || null,
        Category_Id: form.category_Id || null,

        // ProdVarients_Pricing
        prodVarients_Pricing: variantsJson,
        ProdVarients_Pricing: variantsJson,
        prodVariants_Pricing: variantsJson,
        ProdVariants_Pricing: variantsJson,
        weightPrices: variantsJson,
        WeightPrices: variantsJson,

        // ProdImg
        prodImg: chosenImg,
        ProdImg: chosenImg,
        imageUrl: chosenImg,
        ImageUrl: chosenImg,

        // Highlight
        highlight: chosenTag,
        Highlight: chosenTag,
        tag: chosenTag,
        Tag: chosenTag,

        // Description & DescriptionAr
        description: form.description.trim(),
        Description: form.description.trim(),
        descriptionAr: form.descriptionAr.trim(),
        DescriptionAr: form.descriptionAr.trim(),

        // Additional pricing and stock details
        price: basePrice,
        Price: basePrice,
        originalPrice: baseOriginalPrice,
        OriginalPrice: baseOriginalPrice,
        stockQuantity: totalStock,
        StockQuantity: totalStock,
        weight: weightSummary,
        Weight: weightSummary,
        isAvailable: Boolean(form.isAvailable),
        IsAvailable: Boolean(form.isAvailable),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast(`"${payload.name}" updated with ${validVariants.length} variants in database!`, 'success');
      } else {
        await createProduct(payload);
        showToast(`"${payload.name}" added with all details & variants to database!`, 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
      if (err.message && (err.message.includes('log in again') || err.message.includes('session expired') || err.message.includes('Unauthorized'))) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1800);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteProduct(id);
      showToast(`"${name}" deleted.`, 'info');
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error');
    }
  };

  const renderWeightPriceBadges = (p) => {
    if (p?.weightPrices) {
      try {
        const variants = typeof p.weightPrices === 'string' ? JSON.parse(p.weightPrices) : p.weightPrices;
        if (Array.isArray(variants) && variants.length > 0) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {variants.map((v, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: '#35251B',
                    border: '1px solid #35251B',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    {v.size || v.weight}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C89B6A' }}>
                    AED {Number(v.sellingPrice || v.price || 0).toFixed(2)}
                  </span>
                  {(v.stockQuantity !== undefined || v.stock !== undefined) && (
                    <span style={{ fontSize: '0.7rem', color: t.textMuted }}>
                      ({v.stockQuantity ?? v.stock} left)
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        }
      } catch (err) {
        console.warn('Error parsing product weightPrices:', err);
      }
    }

    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ color: t.textFaint, fontSize: '0.82rem' }}>{p.weight || 'Standard'}</span>
        <span style={{ fontWeight: 700, color: '#C89B6A', fontSize: '0.88rem' }}>AED {Number(p.price).toFixed(2)}</span>
      </div>
    );
  };

  /* shared input style */
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    color: t.inputColor, fontSize: '0.9rem', outline: 'none',
  };
  const selectStyle = { ...inputStyle, background: t.selectBg };
  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: t.labelColor, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* ── Section Header ─────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', marginBottom: '28px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: lightMode ? '#111827' : 'var(--text-cream)', marginBottom: '4px' }}>
            Product Management
          </h2>
          <p style={{ color: t.textMuted, fontSize: '0.9rem' }}>
            {products.length} items in database.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onRefresh}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '9999px',
              background: lightMode ? '#f3f4f6' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${lightMode ? '#d1d5db' : 'rgba(255,255,255,0.12)'}`,
              color: lightMode ? '#374151' : 'var(--text-cream)',
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={openAddModal}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 20px', borderRadius: '9999px',
              background: 'linear-gradient(135deg,#C89B6A,#A87747)',
              border: 'none', color: '#35251B',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(200,155,106,0.3)',
            }}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Search & Filters ───────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '14px',
        alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '260px', maxWidth: '420px' }}>
          <Search size={17} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: t.textFaint,
          }} />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: '42px', borderRadius: '9999px',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px', borderRadius: '9999px',
                  border: `1px solid ${active ? '#C89B6A' : (lightMode ? '#d1d5db' : 'var(--border-gold)')}`,
                  background: active ? '#C89B6A' : (lightMode ? '#f9fafb' : 'transparent'),
                  color: active ? '#35251B' : t.textMuted,
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Products Table ─────────────────────────────── */}
      <div style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        overflowX: 'auto',
        boxShadow: lightMode ? '0 1px 4px rgba(0,0,0,0.07)' : 'none',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
          <thead>
            <tr style={{
              background: t.headBg,
              color: t.headColor,
              fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em',
              borderBottom: `1px solid ${t.border}`,
            }}>
              {['Product', 'Category', 'Weight & Prices (AED)', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: i === 4 ? 'right' : 'left', fontWeight: 700 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                style={{ borderBottom: `1px solid ${t.border}`, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Product */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.imageUrl || PRESET_IMAGES[0].url}
                      alt={p.name}
                      style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: `1px solid ${t.border}` }}
                      onError={e => { e.currentTarget.src = PRESET_IMAGES[0].url; }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: t.textPrimary, fontSize: '0.9rem' }}>{p.name}</div>
                      {p.nameAr && (
                        <div style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.82rem', color: '#C89B6A' }}>{p.nameAr}</div>
                      )}
                      {p.tag && (
                        <span style={{
                          display: 'inline-block', marginTop: '3px',
                          padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700,
                          background: t.tagBg, border: `1px solid ${t.tagBorder}`, color: t.tagColor,
                        }}>
                          {p.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* Category */}
                <td style={{ padding: '14px 20px', color: t.textMuted, fontSize: '0.88rem' }}>{p.category}</td>
                {/* Weight & Prices */}
                <td style={{ padding: '14px 20px' }}>
                  {renderWeightPriceBadges(p)}
                </td>
                {/* Status */}
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: '9999px',
                    fontSize: '0.72rem', fontWeight: 700,
                    background: p.isAvailable ? (lightMode ? '#dcfce7' : 'rgba(34,197,94,0.15)')
                      : (lightMode ? '#fee2e2' : 'rgba(239,68,68,0.15)'),
                    color: p.isAvailable ? (lightMode ? '#15803d' : '#4ade80')
                      : (lightMode ? '#dc2626' : '#f87171'),
                  }}>
                    {p.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '7px 12px', borderRadius: '8px',
                        background: t.editBtn.bg, border: `1px solid ${t.editBtn.border}`,
                        color: t.editBtn.color, cursor: 'pointer',
                        fontSize: '0.8rem', fontWeight: 600,
                      }}
                    >
                      <Edit size={13} /> Edit
                    </button>
                    {deleteConfirmId === p.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          style={{
                            padding: '7px 12px', borderRadius: '8px',
                            background: '#dc2626', border: 'none', color: '#fff',
                            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                          }}
                        >Confirm</button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          style={{
                            padding: '7px 10px', borderRadius: '8px',
                            background: t.editBtn.bg, border: `1px solid ${t.editBtn.border}`,
                            color: t.textMuted, cursor: 'pointer', fontSize: '0.78rem',
                          }}
                        >Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          padding: '7px 10px', borderRadius: '8px',
                          background: t.delBtn.bg, border: `1px solid ${t.delBtn.border}`,
                          color: t.delBtn.color, cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: t.textMuted }}>
            No products found.
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(53, 37, 27, 0.72)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px',
        }}>
          <div style={{
            width: '100%', maxWidth: '840px', maxHeight: '92vh',
            display: 'flex', flexDirection: 'column',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 25px 60px -15px rgba(53, 37, 27, 0.5)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#35251B',
              color: '#FFFFFF',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(200, 155, 106, 0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(200, 155, 106, 0.15)',
                  border: '1px solid rgba(200, 155, 106, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C89B6A',
                }}>
                  <Package size={22} strokeWidth={2.2} />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none', color: '#FFFFFF', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{
                padding: '24px 28px',
                overflowY: 'auto',
                flex: 1,
                background: '#FFFFFF',
              }}>

                {/* Product Name (EN) & (Arabic) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                      Product Name (EN) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Belgian Milk Chocolate Box"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-arabic)' }}>
                        <span style={{ color: '#EF4444' }}>* </span>(Arabic) اسم المنتج
                      </label>
                    </div>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.nameAr}
                      onChange={e => setForm({ ...form, nameAr: e.target.value })}
                      placeholder="مثال: علبة شوكولاتة بالحليب"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        outline: 'none',
                        fontFamily: 'var(--font-arabic)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                      Category <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#059669',
                      background: '#ECFDF5',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #A7F3D0',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                      Live DB Categories ({categoriesList.length || 0})
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={form.category}
                      onChange={e => {
                        const val = e.target.value;
                        const matched = categoriesList.find(c => (c.category_name || c.name) === val);
                        setForm({
                          ...form,
                          category: val,
                          category_Id: matched ? (matched.category_Id || matched.id) : form.category_Id,
                        });
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      {categoriesList.length > 0 ? (
                        categoriesList.map(c => {
                          const catName = c.category_name || c.name;
                          const catAr = c.category_nameAr ? ` (${c.category_nameAr})` : '';
                          return (
                            <option key={c.category_Id || catName} value={catName}>
                              {getCategoryEmoji(catName)}  {catName}{catAr}
                            </option>
                          );
                        })
                      ) : (
                        <>
                          <option value="Premium Chocolates">🍫  Premium Chocolates</option>
                          <option value="Premium Nuts & Dry Fruits">🥜  Premium Nuts &amp; Dry Fruits</option>
                          <option value="Arabic & Gulf Heritage Roasts">☕  Arabic &amp; Gulf Heritage Roasts</option>
                          <option value="African Single Origin Roasts">🌍  African Single Origin Roasts</option>
                          <option value="Turkish Specialty Roasts">🇹🇷  Turkish Specialty Roasts</option>
                          <option value="Premium Dates">🌴  Premium Dates</option>
                          <option value="Premium Arabic Sweets">🍬  Premium Arabic Sweets</option>
                          <option value="Premium Spices">🌿  Premium Spices</option>
                        </>
                      )}
                      {form.category && !categoriesList.some(c => (c.category_name || c.name) === form.category) && (
                        <option value={form.category}>
                          {getCategoryEmoji(form.category)}  {form.category} (Current)
                        </option>
                      )}
                    </select>
                    <div style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      pointerEvents: 'none', color: '#0F172A', display: 'flex', alignItems: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* ── Product Variants & Pricing Card ── */}
                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid #E8DFD8',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '22px',
                }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: '#35251B', color: '#C89B6A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Tag size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#35251B', margin: 0 }}>
                          Product Variants &amp; Pricing
                        </h3>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: '#DCFCE7', color: '#15803D',
                          padding: '3px 10px', borderRadius: '9999px',
                          fontSize: '0.74rem', fontWeight: 700,
                        }}>
                          <Check size={12} strokeWidth={3} /> Recommended
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0 0', color: '#6E5D53', fontSize: '0.82rem' }}>
                        Add different sizes or weights and set individual prices for each variant.
                      </p>
                    </div>
                  </div>

                  {/* Quick Add Sizes Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#35251B' }}>
                        Quick Add Sizes:
                      </span>
                      {[].map((w, idx) => {
                        const isFirst = idx === 0;
                        return (
                          <button
                            key={`first-${w}-${idx}`}
                            type="button"
                            onClick={() => handleQuickAddVariant(w)}
                            style={{
                              padding: '6px 18px',
                              borderRadius: '9999px',
                              background: isFirst ? '#35251B' : '#FFFFFF',
                              color: isFirst ? '#FFFFFF' : '#35251B',
                              border: isFirst ? '1px solid #35251B' : '1px solid #CBD5E1',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {w}
                          </button>
                        );
                      })}
                      {['250g', '500g', '1kg'].map((w, idx) => (
                        <button
                          key={`second-${w}-${idx}`}
                          type="button"
                          onClick={() => handleQuickAddVariant(w)}
                          style={{
                            padding: '6px 18px',
                            borderRadius: '9999px',
                            background: '#FFFFFF',
                            color: '#35251B',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #35251B',
                        color: '#35251B',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Edit3 size={14} /> Custom Size
                    </button>
                  </div>

                  {/* Variants Table */}
                  <div style={{
                    border: '1px solid #E8DFD8',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    {/* Table Header with #35251B */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1.3fr 1.3fr 1.1fr 70px',
                      background: '#35251B',
                      color: '#FFFFFF',
                      padding: '12px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      alignItems: 'center',
                    }}>
                      <div>Size / Weight</div>
                      <div>Selling Price (AED) *</div>
                      <div>Original Price (AED)</div>
                      <div>Stock Quantity *</div>
                      <div style={{ textAlign: 'center' }}>Actions</div>
                    </div>

                    {/* Table Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {weightVariants.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 1.3fr 1.3fr 1.1fr 70px',
                            padding: '10px 16px',
                            alignItems: 'center',
                            gap: '12px',
                            borderBottom: idx === weightVariants.length - 1 ? 'none' : '1px solid #F1F5F9',
                            background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                          }}
                        >
                          <input
                            type="text"
                            required
                            value={item.size || item.weight}
                            onChange={e => handleUpdateVariant(idx, 'size', e.target.value)}
                            placeholder="e.g. 250g"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              background: '#F8FAFC',
                              color: '#35251B',
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <input
                            type="number"
                            step="0.5"
                            required
                            value={item.sellingPrice || item.price}
                            onChange={e => handleUpdateVariant(idx, 'sellingPrice', e.target.value)}
                            placeholder="35"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              background: '#F8FAFC',
                              color: '#35251B',
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <input
                            type="number"
                            step="0.5"
                            value={item.originalPrice}
                            onChange={e => handleUpdateVariant(idx, 'originalPrice', e.target.value)}
                            placeholder="Optional"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              background: '#F8FAFC',
                              color: '#35251B',
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.stockQuantity ?? item.stock ?? '20'}
                            onChange={e => handleUpdateVariant(idx, 'stockQuantity', e.target.value)}
                            placeholder="20"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              background: '#F8FAFC',
                              color: '#35251B',
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              disabled={weightVariants.length <= 1}
                              style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: '#FEE2E2', border: '1px solid #FECACA',
                                color: '#EF4444',
                                cursor: weightVariants.length <= 1 ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: weightVariants.length <= 1 ? 0.35 : 1,
                              }}
                              title="Delete variant"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Another Variant Button */}
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: '1.5px solid #35251B',
                      background: '#FFFFFF',
                      color: '#35251B',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '12px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    <Plus size={16} strokeWidth={2.5} /> Add Another Variant
                  </button>

                  {/* Info Note */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#F5EBE1',
                    border: '1px solid #DEC3AE',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginTop: '12px',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#C89B6A', color: '#35251B',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                    }}>
                      i
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#5C381E', fontWeight: 600 }}>
                      You can add multiple sizes like 250g, 500g, 1kg, etc. Each size can have its own price and stock.
                    </span>
                  </div>

                  {/* Variant Summary */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#FAF7F2',
                    border: '1px solid #E8DFD8',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    marginTop: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.84rem', color: '#35251B' }}>
                        <Tag size={15} color="#C89B6A" />
                        <span>Variant Summary:</span>
                      </div>
                      <span style={{ color: '#C89B6A' }}>|</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#35251B' }}>
                        {weightVariants.filter(v => (v.size || v.weight)).length} Variants Added
                      </span>
                      {weightVariants.filter(v => (v.size || v.weight)).map((v, i) => (
                        <React.Fragment key={i}>
                          <span style={{ color: '#DEC3AE' }}>|</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#35251B' }}>
                            {v.size || v.weight} - AED {Number(v.sellingPrice || v.price || 0).toFixed(0)}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#22C55E', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* ── Product Image Section ── */}
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={18} color="#35251B" />
                      <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#35251B', margin: 0 }}>
                        Product Image <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                    </div>

                    {/* Mode switcher tabs */}
                    <div style={{ display: 'inline-flex', gap: '6px', background: '#FAF7F2', padding: '4px', borderRadius: '8px', border: '1px solid #E8DFD8' }}>
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '6px', border: 'none',
                          background: imageTab === 'upload' ? '#35251B' : 'transparent',
                          color: imageTab === 'upload' ? '#FFFFFF' : '#6E5D53',
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Upload size={14} /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('preset')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '6px', border: 'none',
                          background: imageTab === 'preset' ? '#35251B' : 'transparent',
                          color: imageTab === 'preset' ? '#FFFFFF' : '#6E5D53',
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Folder size={14} /> Assets Folder
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '6px', border: 'none',
                          background: imageTab === 'url' ? '#35251B' : 'transparent',
                          color: imageTab === 'url' ? '#FFFFFF' : '#6E5D53',
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <LinkIcon size={14} /> Direct URL
                      </button>
                    </div>
                  </div>

                  {/* Tab 1: Upload File */}
                  {imageTab === 'upload' && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <div
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: '2px dashed #CBD5E1',
                          borderRadius: '12px',
                          padding: '28px 20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: '#F8FAFC',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isUploadingImage ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#35251B' }}>
                            <Loader2 size={32} className="animate-spin" />
                            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Saving image to dashboard assets folder...</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '46px', height: '46px', borderRadius: '50%',
                              background: 'rgba(200, 155, 106, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#C89B6A',
                            }}>
                              <UploadCloud size={24} />
                            </div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#35251B' }}>
                              Click to upload or drag &amp; drop product image
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#6E5D53' }}>
                              PNG, JPG, WEBP, SVG up to 10MB • Saved directly to dashboard assets folder
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Assets Folder Presets */}
                  {imageTab === 'preset' && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6E5D53', marginBottom: '8px' }}>
                        Choose an authentic roastery image saved in <code style={{ color: '#35251B', fontWeight: 700 }}>assets/products</code>:
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '8px',
                        maxHeight: '160px',
                        overflowY: 'auto',
                        padding: '4px',
                      }}>
                        {PRESET_IMAGES.map(img => {
                          const isSelected = form.imageUrl === img.url;
                          return (
                            <div
                              key={img.label}
                              onClick={() => setForm({ ...form, imageUrl: img.url })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: `1px solid ${isSelected ? '#35251B' : '#E8DFD8'}`,
                                background: isSelected ? '#FAF7F2' : '#FFFFFF',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <img
                                src={img.url}
                                alt={img.label}
                                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                                onError={e => { e.currentTarget.src = '/logo-circle.png'; }}
                              />
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? '#35251B' : '#5C4D43',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}>
                                {img.label}
                              </span>
                              {isSelected && <Check size={14} color="#C89B6A" style={{ flexShrink: 0 }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Direct URL */}
                  {imageTab === 'url' && (
                    <div>
                      <input
                        type="text"
                        value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="e.g. /assets/products/my-image.jpg or https://..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#35251B',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ fontSize: '0.72rem', color: '#6E5D53', marginTop: '4px' }}>
                        Can be a relative assets path (e.g. /assets/products/item.jpg) or full web URL.
                      </div>
                    </div>
                  )}

                  {/* Selected Preview */}
                  {form.imageUrl && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FAF7F2',
                      border: '1px solid #E8DFD8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <img
                          src={form.imageUrl}
                          alt="Selected Preview"
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #CBD5E1' }}
                          onError={e => { e.currentTarget.src = '/logo-circle.png'; }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#35251B' }}>
                            Selected Image Path:
                          </div>
                          <div style={{
                            fontSize: '0.74rem',
                            color: '#C89B6A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                          }}>
                            {form.imageUrl}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: '' })}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Details (Tag & Availability) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Highlight Tag (Optional)
                    </label>
                    <select
                      value={form.tag}
                      onChange={e => setForm({ ...form, tag: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        outline: 'none',
                      }}
                    >
                      <option value="">None</option>
                      <option value="bestseller">Bestseller</option>
                      <option value="signature">Signature</option>
                      <option value="popular">Popular</option>
                      <option value="traditional">Traditional</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '26px' }}>
                    <input
                      type="checkbox"
                      id="isAvail"
                      checked={form.isAvailable}
                      onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#35251B', cursor: 'pointer' }}
                    />
                    <label htmlFor="isAvail" style={{ fontSize: '0.88rem', color: '#35251B', cursor: 'pointer', fontWeight: 600 }}>
                      Available in Store (Active)
                    </label>
                  </div>
                </div>

                {/* Optional Descriptions */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#35251B', marginBottom: '6px' }}>
                    Description (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Handcrafted chocolates with velvety smooth ganache..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#35251B',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#35251B', marginBottom: '6px', textAlign: 'right', fontFamily: 'var(--font-arabic)' }}>
                    الوصف (باللغة العربية)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={form.descriptionAr}
                    onChange={e => setForm({ ...form, descriptionAr: e.target.value })}
                    placeholder="وصف المنتج باللغة العربية..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#35251B',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-arabic)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer with #35251B */}
              <div style={{
                padding: '16px 28px',
                background: '#FFFFFF',
                borderTop: '1px solid #E8DFD8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#35251B',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <RotateCcw size={15} /> Reset
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '9px 24px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#35251B',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 24px',
                      borderRadius: '8px',
                      border: '1px solid rgba(200, 155, 106, 0.4)',
                      background: '#35251B',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      boxShadow: '0 3px 10px rgba(53, 37, 27, 0.35)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#443023'}
                    onMouseLeave={e => e.currentTarget.style.background = '#35251B'}
                  >
                    <Save size={16} color="#C89B6A" />
                    {isSaving ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
