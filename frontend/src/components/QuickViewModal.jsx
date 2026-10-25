import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Plus, Minus, Tag } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 95,
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '750px',
          backgroundColor: '#1E140D',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          position: 'relative',
          border: '1px solid var(--accent-gold)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            color: 'var(--text-cream)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div style={{ height: '100%', minHeight: '300px', backgroundColor: '#140D08' }}>
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600'} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600'; }}
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(200, 155, 106, 0.15)',
                color: 'var(--accent-gold)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {product.category}
              </span>
              {product.weight && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                  Weight: {product.weight}
                </span>
              )}
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-cream)', marginBottom: '4px' }}>
              {product.name}
            </h2>

            {product.nameAr && (
              <div style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '1.2rem',
                color: 'var(--accent-gold)',
                marginBottom: '14px',
                direction: 'rtl'
              }}>
                {product.nameAr}
              </div>
            )}

            <div style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              marginBottom: '16px'
            }}>
              {Number(product.price).toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AED</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              {product.description}
            </p>

            {product.descriptionAr && (
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                direction: 'rtl',
                fontFamily: 'var(--font-arabic)',
                marginBottom: '20px'
              }}>
                {product.descriptionAr}
              </p>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quantity:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '4px 12px',
                border: '1px solid var(--border-gold)'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-cream)', cursor: 'pointer' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-cream)', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="btn-gold"
                style={{ width: '100%' }}
              >
                <ShoppingBag size={18} />
                <span>Add {quantity} to Cart ({(Number(product.price) * quantity).toFixed(2)} AED)</span>
              </button>

              <a
                href={`https://wa.me/971562211571?text=${encodeURIComponent(`Hi Al Rafa Roastery, I would like to order: ${quantity}x ${product.name} (${(Number(product.price) * quantity).toFixed(2)} AED)`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
                style={{ padding: '12px' }}
                title="Direct WhatsApp Order"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
