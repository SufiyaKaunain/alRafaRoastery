import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/storeData';

export default function ShopPage({
  products,
  onProductClick,
  activeCategory,
  onSelectCategory,
  lang = 'en',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const isAr = lang === 'ar';

  const displayedProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (inStockOnly && p.isAvailable === false) return false;
        if (activeCategory && activeCategory !== 'ALL' && p.category !== activeCategory) {
          return false;
        }
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.nameAr && p.nameAr.includes(searchTerm)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return (b.tag === 'bestseller' || b.tag === 'popular') ? 1 : -1;
      });
  }, [products, activeCategory, searchTerm, sortBy, inStockOnly]);

  return (
    <div className="max-w-shop px-shop" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Title & Category Selector */}
      <div style={{ marginBottom: '24px', direction: isAr ? 'rtl' : 'ltr' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          {activeCategory && activeCategory !== 'ALL'
            ? activeCategory
            : isAr ? 'جميع المنتجات' : 'All Products'}
        </h1>
        <p style={{ color: 'var(--shop-text-muted)', fontSize: '0.9rem' }}>
          {isAr
            ? `عرض ${displayedProducts.length} منتج متوفر في محمص الرفاع`
            : `Showing ${displayedProducts.length} roastery products`}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--shop-card)',
          border: '1px solid var(--shop-border)',
          borderRadius: 'var(--shop-radius)',
          padding: '12px 18px',
          marginBottom: '28px',
          direction: isAr ? 'rtl' : 'ltr',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', maxWidth: '400px', position: 'relative' }}>
          <input
            type="text"
            placeholder={isAr ? 'بحث بالاسم...' : 'Search by name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--shop-border)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          />
        </div>

        {/* Sort & In stock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* In stock toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--shop-text-muted)' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: 'var(--shop-primary)' }}
            />
            <span>{isAr ? 'المتوفر فقط' : 'In stock only'}</span>
          </label>

          {/* Sort By Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--shop-border)',
              borderRadius: '8px',
              color: '#fff',
              padding: '8px 12px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="featured" style={{ background: '#241912' }}>{isAr ? 'المميز' : 'Featured'}</option>
            <option value="newest" style={{ background: '#241912' }}>{isAr ? 'الأحدث' : 'Newest'}</option>
            <option value="price-asc" style={{ background: '#241912' }}>{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
            <option value="price-desc" style={{ background: '#241912' }}>{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--shop-text-muted)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            {isAr ? 'لا توجد منتجات تطابق بحثك.' : 'No products found matching your criteria.'}
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setSearchTerm('');
              onSelectCategory('ALL');
              setInStockOnly(false);
            }}
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid-cols-shop">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
}

