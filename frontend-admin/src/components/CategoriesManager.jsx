import React, { useState, useEffect } from 'react';
import {
  Tag, Plus, Edit2, Trash2, Search, RefreshCw, AlertCircle,
  CheckCircle, FolderPlus, Layers, Package, Calendar, X, Save
} from 'lucide-react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api';

const getCategoryEmoji = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('chocolate')) return '🍫';
  if (n.includes('nut')) return '🥜';
  if (n.includes('arabic') || n.includes('gulf')) return '☕';
  if (n.includes('african') || n.includes('origin')) return '🌍';
  if (n.includes('turkish')) return '🇹🇷';
  if (n.includes('date')) return '🌴';
  if (n.includes('sweet') || n.includes('baklava')) return '🍬';
  if (n.includes('spice')) return '🌿';
  if (n.includes('coffee') || n.includes('bean') || n.includes('espresso')) return '☕';
  if (n.includes('drink') || n.includes('latte') || n.includes('brew') || n.includes('tea')) return '🥤';
  return '🏷️';
};

export default function CategoriesManager({ onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
    deleting: false,
    deleteProducts: false,
  });
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    category_name: '',
    category_nameAr: '',
  });
  const [formError, setFormError] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCategoriesData = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      showToast('Failed to load categories: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ category_name: '', category_nameAr: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      category_name: cat.category_name || cat.name || '',
      category_nameAr: cat.category_nameAr || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.category_name.trim();
    if (!name) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingCategory) {
        // UPDATE
        const catId = editingCategory.category_Id || editingCategory.id;
        await updateCategory(catId, {
          category_name: name,
          category_nameAr: form.category_nameAr.trim() || null,
        });
        showToast(`Category "${name}" updated successfully!`, 'success');
      } else {
        // CREATE
        await createCategory({
          category_name: name,
          category_nameAr: form.category_nameAr.trim() || null,
        });
        showToast(`Category "${name}" created successfully!`, 'success');
      }

      closeModal();
      await loadCategoriesData();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (cat) => {
    setDeleteModal({
      isOpen: true,
      category: cat,
      deleting: false,
      deleteProducts: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      category: null,
      deleting: false,
      deleteProducts: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) return;
    const cat = deleteModal.category;
    const catId = cat.category_Id || cat.id;
    const catName = cat.category_name || cat.name || '';
    const deleteProducts = Boolean(deleteModal.deleteProducts);

    setDeleteModal(prev => ({ ...prev, deleting: true }));
    try {
      const res = await deleteCategory(catId, deleteProducts, catName);
      const msg = res?.message || (deleteProducts
        ? `Category "${catName}" and all its products were permanently deleted.`
        : `Category "${catName}" deleted.`);
      showToast(msg, deleteProducts ? 'error' : 'info');
      closeDeleteModal();
      await loadCategoriesData();
      if (onCategoriesChanged) {
        await onCategoriesChanged();
      }
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, 'error');
      setDeleteModal(prev => ({ ...prev, deleting: false }));
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter(c => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    const en = (c.category_name || c.name || '').toLowerCase();
    const ar = (c.category_nameAr || '').toLowerCase();
    const idStr = String(c.category_Id || c.id || '');
    return en.includes(s) || ar.includes(s) || idStr.includes(s);
  });

  const totalLinkedProducts = categories.reduce((sum, c) => sum + (c.count || 0), 0);
  const activeWithProducts = categories.filter(c => (c.count || 0) > 0).length;

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: toast.type === 'error' ? '#EF4444' : (toast.type === 'info' ? '#3B82F6' : '#10B981'),
          color: '#FFFFFF',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#111827',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Tag size={24} color="#C89B6A" /> Category Management
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.92rem' }}>
            Add, update, organize and delete roastery categories stored in PostgreSQL.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={loadCategoriesData}
            title="Refresh categories from database"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '9999px',
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>

          <button
            onClick={openAddModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #C89B6A, #A87747)',
              border: 'none',
              color: '#35251B',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(200,155,106,0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Plus size={18} strokeWidth={2.5} /> Add New Category
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C89B6A', flexShrink: 0,
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              {categories.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '3px' }}>
              Total DB Categories
            </div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#16A34A', flexShrink: 0,
          }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              {activeWithProducts}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '3px' }}>
              Active with Products
            </div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2563EB', flexShrink: 0,
          }}>
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              {totalLinkedProducts}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '3px' }}>
              Total Products Linked
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E5E7EB',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '260px',
        }}>
          <Search size={17} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search categories by English, Arabic, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              background: '#F9FAFB',
              color: '#111827',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ fontSize: '0.84rem', color: '#6B7280', fontWeight: 600 }}>
          Showing <span style={{ color: '#111827', fontWeight: 700 }}>{filteredCategories.length}</span> of {categories.length} categories
        </div>
      </div>

      {/* Categories Table Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Name (English)</th>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arabic Name (الاسم بالعربية)</th>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Products</th>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => {
                const catName = c.category_name || c.name || '';
                const catId = c.category_Id || c.id;
                const emoji = getCategoryEmoji(catName);
                const count = c.count || 0;
                const dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

                return (
                  <tr
                    key={catId}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* ID */}
                    <td style={{ padding: '16px 20px', fontSize: '0.86rem', color: '#6B7280', fontWeight: 600 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#F3F4F6',
                        color: '#374151',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        #{catId}
                      </span>
                    </td>

                    {/* Category Name EN */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{emoji}</span>
                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.94rem' }}>
                          {catName}
                        </span>
                      </div>
                    </td>

                    {/* Arabic Name */}
                    <td style={{ padding: '16px 20px' }}>
                      {c.category_nameAr ? (
                        <span style={{
                          fontFamily: 'var(--font-arabic)',
                          fontSize: '0.96rem',
                          color: '#374151',
                          fontWeight: 600,
                          direction: 'rtl',
                          display: 'inline-block',
                        }}>
                          {c.category_nameAr}
                        </span>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.84rem' }}>—</span>
                      )}
                    </td>

                    {/* Linked Products Count */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: count > 0 ? '#ECFDF5' : '#F3F4F6',
                        color: count > 0 ? '#059669' : '#6B7280',
                        border: `1px solid ${count > 0 ? '#A7F3D0' : '#E5E7EB'}`,
                      }}>
                        <Package size={13} />
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '16px 20px', fontSize: '0.84rem', color: '#6B7280' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} color="#9CA3AF" />
                        {dateStr}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(c)}
                          title="Edit Category"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: '#F3F4F6',
                            border: '1px solid #D1D5DB',
                            color: '#374151',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(c)}
                          title="Delete Category"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '56px 20px', color: '#6B7280' }}>
            <Tag size={40} color="#D1D5DB" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              No categories found
            </div>
            <div style={{ fontSize: '0.88rem', color: '#9CA3AF', marginBottom: '18px' }}>
              {searchTerm ? 'Try searching for another keyword.' : 'Get started by creating your first category.'}
            </div>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #C89B6A, #A87747)',
                  border: 'none',
                  color: '#35251B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                + Add Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#35251B',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(200,155,106,0.2)', border: '1px solid #C89B6A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C89B6A',
                }}>
                  <Tag size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F7F1E8' }}>
                    {editingCategory ? `Edit Category #${editingCategory.category_Id || editingCategory.id}` : 'Add New Category'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#C89B6A' }}>
                    PostgreSQL Categories Table Synchronization
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {formError && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <AlertCircle size={16} /> {formError}
                </div>
              )}

              {/* Category Name (EN) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#111827', marginBottom: '7px' }}>
                  Category Name (English) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artisanal Cold Brews"
                    value={form.category_name}
                    onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#111827',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '1.2rem', pointerEvents: 'none',
                  }}>
                    {getCategoryEmoji(form.category_name)}
                  </span>
                </div>
              </div>

              {/* Category Name (Arabic) */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#111827' }}>
                    اسم الفئة (Arabic Name)
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>Optional / اختياري</span>
                </div>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: مشروبات مقطرة وباردة"
                  value={form.category_nameAr}
                  onChange={(e) => setForm({ ...form, category_nameAr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#111827',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    outline: 'none',
                    fontFamily: 'var(--font-arabic)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Live Preview Box */}
              {form.category_name && (
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: '#FAF7F2',
                  border: '1px solid #E8DFD8',
                  marginBottom: '24px',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6D53', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Live Preview in Admin & Storefront
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{getCategoryEmoji(form.category_name)}</span>
                    <span style={{ fontWeight: 700, color: '#35251B', fontSize: '0.94rem' }}>
                      {form.category_name}
                    </span>
                    {form.category_nameAr && (
                      <span style={{ color: '#8C6D53', fontSize: '0.88rem', fontFamily: 'var(--font-arabic)' }}>
                        ({form.category_nameAr})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    color: '#374151',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: '#35251B',
                    border: '1px solid #35251B',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(53,37,27,0.3)',
                  }}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> {editingCategory ? 'Update Category' : 'Save Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal.isOpen && deleteModal.category && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid #E5E7EB',
            padding: '26px',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '50%',
              background: '#FEE2E2', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Delete Category?
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '18px' }}>
              Are you sure you want to delete <strong style={{ color: '#111827' }}>"{deleteModal.category.category_name || deleteModal.category.name}"</strong>?
            </p>

            {/* Prompt for products under this category */}
            {deleteModal.category.count > 0 ? (
              <div style={{
                textAlign: 'left',
                background: '#FAF7F2',
                border: '1px solid #E8DFD8',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '22px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#35251B',
                  marginBottom: '12px',
                }}>
                  <Package size={18} color="#C89B6A" />
                  What should happen to the {deleteModal.category.count} product{deleteModal.category.count > 1 ? 's' : ''} in this category?
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Choice 1: Keep products (unassign) */}
                  <div
                    onClick={() => setDeleteModal(prev => ({ ...prev, deleteProducts: false }))}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1.5px solid ${!deleteModal.deleteProducts ? '#C89B6A' : '#E5E7EB'}`,
                      background: !deleteModal.deleteProducts ? '#FFF8F0' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="deleteProductsChoice"
                      checked={!deleteModal.deleteProducts}
                      onChange={() => setDeleteModal(prev => ({ ...prev, deleteProducts: false }))}
                      style={{ marginTop: '2px', accentColor: '#C89B6A', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>
                        Keep products (Unlink category)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '3px' }}>
                        The {deleteModal.category.count} product{deleteModal.category.count > 1 ? 's' : ''} will remain safe in PostgreSQL and can be reassigned anytime.
                      </div>
                    </div>
                  </div>

                  {/* Choice 2: Also delete products */}
                  <div
                    onClick={() => setDeleteModal(prev => ({ ...prev, deleteProducts: true }))}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1.5px solid ${deleteModal.deleteProducts ? '#DC2626' : '#E5E7EB'}`,
                      background: deleteModal.deleteProducts ? '#FEF2F2' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="deleteProductsChoice"
                      checked={deleteModal.deleteProducts}
                      onChange={() => setDeleteModal(prev => ({ ...prev, deleteProducts: true }))}
                      style={{ marginTop: '2px', accentColor: '#DC2626', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#DC2626' }}>
                        Delete products under this category too
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#991B1B', marginTop: '3px' }}>
                        ⚠️ Permanently deletes all {deleteModal.category.count} product{deleteModal.category.count > 1 ? 's' : ''} under "{deleteModal.category.category_name || deleteModal.category.name}" from the database.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#F3F4F6',
                color: '#6B7280',
                fontSize: '0.84rem',
                marginBottom: '20px',
              }}>
                This category has 0 products assigned.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  color: '#374151',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteModal.deleting}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: deleteModal.deleteProducts ? '#B91C1C' : '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: deleteModal.deleting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                {deleteModal.deleting
                  ? 'Deleting...'
                  : deleteModal.deleteProducts
                    ? `Delete Category & ${deleteModal.category.count} Product${deleteModal.category.count > 1 ? 's' : ''}`
                    : 'Delete Category Only'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

