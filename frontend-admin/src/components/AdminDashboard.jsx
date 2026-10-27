import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '../api';

const PRESET_IMAGES = [
  { label: 'Belgian Milk Chocolate', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600' },
  { label: 'Dark Chocolate 70%', url: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600' },
  { label: 'Chocolate Gift Box', url: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=600' },
  { label: 'Stuffed Dates Box', url: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600' },
  { label: 'Spanish Latte', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600' },
  { label: 'Pistachio Latte', url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600' },
  { label: 'Espresso Beans', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600' },
  { label: 'Arabic Coffee', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600' },
  { label: 'Roasted Pistachios', url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600' },
  { label: 'Chocolate Dipped Dates', url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600' },
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

  const initialForm = {
    name: '', nameAr: '', description: '', descriptionAr: '',
    price: '', category: 'Luxury Chocolates', weight: '250g',
    imageUrl: PRESET_IMAGES[0].url, tag: '', isAvailable: true,
  };
  const [form, setForm] = useState(initialForm);

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

              {/* Image URL */}
              <div>
                <label style={labelStyle}>Product Image URL</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="url" value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..." style={{ ...inputStyle, flexGrow: 1 }} />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview"
                      style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: t.textFaint }}>Quick presets:</span>
                  {PRESET_IMAGES.slice(0, 5).map(img => (
                    <button type="button" key={img.label}
                      onClick={() => setForm({ ...form, imageUrl: img.url })}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem',
                        background: t.presetBtn.bg, border: `1px solid ${t.presetBtn.border}`, color: t.presetBtn.color,
                      }}
                    >{img.label}</button>
                  ))}
                </div>
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
