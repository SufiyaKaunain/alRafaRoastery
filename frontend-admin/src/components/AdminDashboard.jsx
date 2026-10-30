import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, Upload, Image as ImageIcon, Check, Loader2, Link as LinkIcon, Folder } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '../api';

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
  const fileInputRef = useRef(null);

  const initialForm = {
    name: '', nameAr: '', description: '', descriptionAr: '',
    price: '', category: 'Luxury Chocolates', weight: '250g',
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

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = products.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) ||
      (p.nameAr && p.nameAr.includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(s));
    return matchSearch && (selectedCategory === 'ALL' || p.category === selectedCategory);
  });

  const openAddModal = () => { setEditingProduct(null); setForm(initialForm); setIsModalOpen(true); };
  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || '', nameAr: p.nameAr || '',
      description: p.description || '', descriptionAr: p.descriptionAr || '',
      price: p.price || '', category: p.category || 'Luxury Chocolates',
      weight: p.weight || '', imageUrl: p.imageUrl || '',
      tag: p.tag || '', isAvailable: p.isAvailable ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Product name is required', 'error'); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      showToast('Please enter a valid price in AED', 'error'); return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(), nameAr: form.nameAr.trim(),
        description: form.description.trim(), descriptionAr: form.descriptionAr.trim(),
        price: parseFloat(form.price), category: form.category.trim(),
        weight: form.weight.trim(), imageUrl: form.imageUrl.trim() || PRESET_IMAGES[0].url,
        tag: form.tag.trim(), isAvailable: Boolean(form.isAvailable),
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast(`"${payload.name}" updated!`, 'success');
      } else {
        await createProduct(payload);
        showToast(`"${payload.name}" added to database!`, 'success');
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
              border: 'none', color: '#1B120C',
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
                  color: active ? '#1B120C' : t.textMuted,
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
              {['Product', 'Category', 'Weight', 'Price (AED)', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: i === 5 ? 'right' : 'left', fontWeight: 700 }}>
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
                {/* Weight */}
                <td style={{ padding: '14px 20px', color: t.textFaint, fontSize: '0.85rem' }}>{p.weight || '—'}</td>
                {/* Price */}
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#C89B6A', fontSize: '0.92rem' }}>
                  {Number(p.price).toFixed(2)}
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
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px',
        }}>
          <div style={{
            width: '100%', maxWidth: '660px', maxHeight: '92vh', overflowY: 'auto',
            background: t.modalBg, border: `1px solid ${t.modalBorder}`,
            borderRadius: '20px', padding: '32px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: t.textPrimary }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p style={{ color: t.textMuted, fontSize: '0.83rem', marginTop: '2px' }}>
                  {editingProduct ? 'Update the product details below.' : 'Fill in the product details to add to PostgreSQL.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: lightMode ? '#f3f4f6' : 'rgba(255,255,255,0.1)',
                  border: 'none', color: t.textMuted, cursor: 'pointer',
                  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Names */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Product Name (EN) *</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Belgian Milk Chocolate Box" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>اسم المنتج (Arabic)</label>
                  <input type="text" dir="rtl" value={form.nameAr}
                    onChange={e => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="مثال: علبة شوكولاتة بالحليب"
                    style={{ ...inputStyle, fontFamily: 'var(--font-arabic)' }} />
                </div>
              </div>

              {/* Category / Price / Weight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={selectStyle}>
                    <option>Luxury Chocolates</option>
                    <option>Specialty Drinks</option>
                    <option>Coffee Beans</option>
                    <option>Premium Nuts</option>
                    <option>Dates &amp; Confections</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (AED) *</label>
                  <input type="number" step="0.5" required value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="35.00" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Weight / Size</label>
                  <input type="text" value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })}
                    placeholder="250g / 500ml" style={inputStyle} />
                </div>
              </div>

              {/* Product Image Section */}
              <div style={{
                background: lightMode ? '#f9fafb' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Product Image *</label>
                  
                  {/* Mode switcher */}
                  <div style={{ display: 'inline-flex', gap: '4px', background: lightMode ? '#e5e7eb' : 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '6px', border: 'none',
                        background: imageTab === 'upload' ? '#C89B6A' : 'transparent',
                        color: imageTab === 'upload' ? '#1B120C' : t.textMuted,
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <Upload size={13} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('preset')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '6px', border: 'none',
                        background: imageTab === 'preset' ? '#C89B6A' : 'transparent',
                        color: imageTab === 'preset' ? '#1B120C' : t.textMuted,
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <Folder size={13} /> Assets Folder
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '6px', border: 'none',
                        background: imageTab === 'url' ? '#C89B6A' : 'transparent',
                        color: imageTab === 'url' ? '#1B120C' : t.textMuted,
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <LinkIcon size={13} /> Direct URL
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
                        border: `2px dashed ${isUploadingImage ? '#C89B6A' : (lightMode ? '#d1d5db' : 'rgba(200,155,106,0.35)')}`,
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: lightMode ? '#ffffff' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isUploadingImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#C89B6A' }}>
                          <Loader2 size={28} className="animate-spin" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Saving image to assets/products folder...</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'rgba(200,155,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#C89B6A', marginBottom: '2px',
                          }}>
                            <Upload size={20} />
                          </div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: t.textPrimary }}>
                            Click to upload or drag &amp; drop product image
                          </div>
                          <div style={{ fontSize: '0.75rem', color: t.textMuted }}>
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
                    <div style={{ fontSize: '0.75rem', color: t.textMuted, marginBottom: '8px' }}>
                      Choose an authentic roastery image saved in <code style={{ color: '#C89B6A' }}>assets/products</code>:
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
                              border: `1px solid ${isSelected ? '#C89B6A' : t.border}`,
                              background: isSelected ? (lightMode ? '#fff8f0' : 'rgba(200,155,106,0.15)') : (lightMode ? '#ffffff' : 'transparent'),
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
                              color: isSelected ? '#C89B6A' : t.textPrimary,
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
                      style={inputStyle}
                    />
                    <div style={{ fontSize: '0.72rem', color: t.textFaint, marginTop: '4px' }}>
                      Can be a relative assets path (e.g. /assets/products/item.jpg) or full web URL.
                    </div>
                  </div>
                )}

                {/* Current Selected Image Preview */}
                {form.imageUrl && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: lightMode ? '#ffffff' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={form.imageUrl}
                        alt="Selected Preview"
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: `1px solid ${t.border}` }}
                        onError={e => { e.currentTarget.src = '/logo-circle.png'; }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: t.textPrimary }}>
                          Selected Image Path:
                        </div>
                        <div style={{
                          fontSize: '0.74rem',
                          color: '#C89B6A',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontFamily: 'monospace',
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
                        background: lightMode ? '#fee2e2' : 'rgba(239,68,68,0.15)',
                        color: '#dc2626',
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

              {/* Tag & Availability */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Highlight Tag</label>
                  <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={selectStyle}>
                    <option value="">None</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="signature">Signature</option>
                    <option value="popular">Popular</option>
                    <option value="traditional">Traditional</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '26px' }}>
                  <input type="checkbox" id="isAvail" checked={form.isAvailable}
                    onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#C89B6A', cursor: 'pointer' }} />
                  <label htmlFor="isAvail" style={{ fontSize: '0.9rem', color: t.textPrimary, cursor: 'pointer', fontWeight: 600 }}>
                    Available in Store
                  </label>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label style={labelStyle}>English Description</label>
                <textarea rows={2} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Handcrafted chocolates with velvety smooth ganache..."
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>Arabic Description</label>
                <textarea rows={2} dir="rtl" value={form.descriptionAr}
                  onChange={e => setForm({ ...form, descriptionAr: e.target.value })}
                  placeholder="وصف المنتج باللغة العربية..."
                  style={{ ...inputStyle, fontFamily: 'var(--font-arabic)', resize: 'vertical' }} />
              </div>

              {/* Submit row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 22px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    background: t.cancelBtn.bg, color: t.cancelBtn.color, fontWeight: 600,
                  }}
                >Cancel</button>
                <button type="submit" disabled={isSaving}
                  style={{
                    padding: '10px 28px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#C89B6A,#A87747)',
                    color: '#1B120C', fontWeight: 700, fontSize: '0.9rem',
                    opacity: isSaving ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(200,155,106,0.3)',
                  }}
                >
                  {isSaving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save to Database')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
