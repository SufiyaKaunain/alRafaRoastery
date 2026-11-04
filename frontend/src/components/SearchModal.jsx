import React, { useState, useEffect, useRef } from 'react';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct, lang = 'en' }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = products.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameAr && p.nameAr.includes(query)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '550px', padding: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--shop-border)', paddingBottom: '12px' }}>
          <span style={{ fontSize: '1.2rem', color: 'var(--shop-primary)' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={isAr ? 'ابحث عن اسم المنتج، القهوة، المكسرات...' : 'Search by product name, roasts, nuts...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          />
          <button onClick={onClose} style={{ color: 'var(--shop-text-muted)', fontSize: '1.2rem', padding: '4px' }}>
            ✕
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {query.trim() && results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--shop-text-muted)' }}>
              {isAr ? 'لم يتم العثور على منتجات مطابقة.' : 'No products found matching your search.'}
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  direction: isAr ? 'rtl' : 'ltr',
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {isAr && product.nameAr ? product.nameAr : product.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--shop-primary)' }}>
                    AED {Number(product.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

