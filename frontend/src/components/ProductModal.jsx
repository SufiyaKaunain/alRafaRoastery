import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeData';

function getWeightOptions(product) {
  if (product?.weightPrices) {
    try {
      const parsed = typeof product.weightPrices === 'string'
        ? JSON.parse(product.weightPrices)
        : product.weightPrices;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          weight: item.size || item.weight || '',
          price: Number(item.sellingPrice !== undefined ? item.sellingPrice : item.price) || 0,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
          stock: item.stockQuantity !== undefined ? item.stockQuantity : item.stock,
        })).filter(v => Boolean(v.weight));
      }
    } catch (err) {
      console.warn('Error parsing product.weightPrices:', err);
    }
  }

  // Fallback: parse comma-separated weights if available
  const weightStr = product?.weight;
  const parts = weightStr ? weightStr.split(',').map((w) => w.trim()).filter(Boolean) : ['250g', '500g', '1kg'];
  const basePrice = Number(product?.price) || 0;

  return parts.map((w, idx) => {
    let multiplier = 1;
    if (w.includes('1kg') || w.includes('1000g')) multiplier = 3.5;
    else if (w.includes('500g')) multiplier = 1.8;
    return {
      weight: w,
      price: idx === 0 ? basePrice : (Math.round(basePrice * multiplier * 2) / 2),
    };
  });
}

export default function ProductModal({ product, onClose, onAddToCart, lang = 'en' }) {
  if (!product) return null;

  const isAr = lang === 'ar';
  const name = isAr && product.nameAr ? product.nameAr : product.name;
  const desc = isAr && product.descriptionAr ? product.descriptionAr : product.description;

  const weightOptions = getWeightOptions(product);
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]?.weight || '250g');
  const [quantity, setQuantity] = useState(1);

  // Find the exact price configured for the selected weight
  const selectedOption = weightOptions.find((opt) => opt.weight === selectedWeight) || weightOptions[0];
  const unitPrice = selectedOption ? selectedOption.price : (Number(product.price) || 0);
  const currentPriceFormatted = unitPrice.toFixed(2);
  const totalPriceFormatted = (unitPrice * quantity).toFixed(2);

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Al Rafa Roastery, I would like to order:\n• ${name} (${selectedWeight}) × ${quantity}\n• Price: AED ${currentPriceFormatted} each\n• Total: AED ${totalPriceFormatted}\n\nPlease confirm availability and delivery details.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedWeight,
      price: unitPrice,
    }, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: isAr ? 'auto' : '14px',
            left: isAr ? '14px' : 'auto',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          ✕
        </button>

        {/* Modal Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {/* Product Image */}
          <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: '#000' }}>
            <img
              src={product.imageUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Category */}
            {product.category && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--shop-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.category}
              </span>
            )}

            {/* Title */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {name}
            </h2>

            {/* Description */}
            {desc && (
              <p style={{ fontSize: '0.88rem', color: 'var(--shop-text-muted)', lineHeight: 1.6 }}>
                {desc}
              </p>
            )}

            {/* Weight selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--shop-text-muted)', marginBottom: '8px' }}>
                {isAr ? 'اختر الوزن / الحجم:' : 'Select Weight / Size:'}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    type="button"
                    onClick={() => setSelectedWeight(opt.weight)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: `1.5px solid ${selectedWeight === opt.weight ? 'var(--shop-primary)' : 'var(--shop-border)'}`,
                      backgroundColor: selectedWeight === opt.weight ? 'rgba(200, 155, 92, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      color: selectedWeight === opt.weight ? 'var(--shop-primary)' : '#fff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{opt.weight}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 700 }}>
                      AED {opt.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--shop-border)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--shop-text-muted)', display: 'block' }}>
                  {isAr ? 'السعر' : 'Price'}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--shop-primary)' }}>
                  AED {totalPriceFormatted}
                </span>
              </div>

              {/* Quantity Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  border: '1px solid var(--shop-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 14px', fontSize: '1rem', color: '#fff' }}
                >
                  -
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '6px 14px', fontSize: '1rem', color: '#fff' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAdd}
                style={{ width: '100%', padding: '12px' }}
              >
                {isAr ? 'أضف إلى السلة' : 'Add to Cart'}
              </button>

              <button
                type="button"
                className="btn-wa"
                onClick={handleWhatsAppOrder}
                style={{ width: '100%', padding: '12px' }}
              >
                {isAr ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

