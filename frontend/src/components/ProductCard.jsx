import React from 'react';

const FALLBACK_IMG = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/logo/8c14d44b-5b57-4114-b9a6-d76d966e012d/md.webp";

export default function ProductCard({ product, onClick, onAddToCart, lang = 'en' }) {
  const isAr = lang === 'ar';
  const name = isAr && product.nameAr ? product.nameAr : product.name;
  const priceFormatted = Number(product.price).toFixed(2);

  return (
    <div
      className="ks-product-tile"
      onClick={() => onClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(product); }}
    >
      {/* Image container */}
      <div className="ks-product-img-wrap">
        <img
          src={product.imageUrl || FALLBACK_IMG}
          alt={name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />

        {/* Tag badge */}
        {product.tag && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: isAr ? 'auto' : '8px',
              right: isAr ? '8px' : 'auto',
              backgroundColor: 'var(--shop-primary)',
              color: 'var(--shop-bg)',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {product.tag}
          </span>
        )}

        {product.isAvailable === false && (
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {isAr ? 'نفذت الكمية' : 'Out of Stock'}
          </span>
        )}
      </div>

      {/* Product Title */}
      <h2
        className="ks-product-title"
        style={{
          direction: isAr ? 'rtl' : 'ltr',
          textAlign: isAr ? 'right' : 'left',
        }}
      >
        {name}
      </h2>

      {/* Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: '6px',
          direction: isAr ? 'rtl' : 'ltr',
        }}
      >
        <span className="ks-price">
          AED {priceFormatted}
        </span>

        {product.weight && (
          <span style={{ fontSize: '0.72rem', color: 'var(--shop-text-faint)' }}>
            {product.weight.split(',')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
