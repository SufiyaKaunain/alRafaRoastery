import React from 'react';
import { ShoppingBag, Eye, MessageCircle, Star } from 'lucide-react';

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  const getTagBadge = (tag) => {
    if (!tag) return null;
    const lower = tag.toLowerCase();
    let bg = 'rgba(200, 155, 106, 0.9)';
    let text = '#1B120C';
    let label = tag.toUpperCase();

    if (lower === 'bestseller') {
      bg = '#eab308';
      text = '#000';
      label = '★ BESTSELLER';
    } else if (lower === 'signature') {
      bg = '#c084fc';
      text = '#000';
      label = '✦ SIGNATURE';
    }

    return (
      <span style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: bg,
        color: text,
        fontSize: '0.68rem',
        fontWeight: 800,
        padding: '3px 8px',
        borderRadius: '4px',
        letterSpacing: '0.06em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        zIndex: 2
      }}>
        {label}
      </span>
    );
  };

  return (
    <div 
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-gold)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        background: 'rgba(35, 23, 16, 0.85)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'var(--accent-gold)';
        e.currentTarget.style.boxShadow = '0 16px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(200, 155, 106, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-gold)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        backgroundColor: '#1B120C',
        overflow: 'hidden',
      }}>
        {getTagBadge(product.tag)}

        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600'} 
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600';
          }}
        />

        {/* Category Tag overlay */}
        <span style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(27, 18, 12, 0.85)',
          color: 'var(--accent-gold)',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid rgba(200, 155, 106, 0.3)',
          backdropFilter: 'blur(4px)'
        }}>
          {product.category || 'General'}
        </span>
      </div>

      {/* Content Area */}
      <div style={{
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-cream)',
              lineHeight: 1.3
            }}>
              {product.name}
            </h3>
            {product.weight && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                fontWeight: 600,
                marginLeft: '6px',
                whiteSpace: 'nowrap'
              }}>
                {product.weight}
              </span>
            )}
          </div>

          {/* Arabic Title */}
          {product.nameAr && (
            <div style={{
              fontFamily: 'var(--font-arabic)',
              fontSize: '0.95rem',
              color: 'var(--accent-gold)',
              marginBottom: '8px',
              direction: 'rtl',
              textAlign: 'right'
            }}>
              {product.nameAr}
            </div>
          )}

          {/* Description */}
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description || 'Artisanal roastery selection, carefully packaged for optimal flavor.'}
          </p>
        </div>

        {/* Footer / Price & CTA */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--accent-gold)'
              }}>
                {Number(product.price).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                AED
              </span>
            </div>

            <button
              onClick={() => onQuickView(product)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
            <button
              onClick={() => onAddToCart(product)}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.85rem',
                borderRadius: '8px'
              }}
            >
              <ShoppingBag size={15} />
              <span>Add to Cart</span>
            </button>

            <a
              href={`https://wa.me/971562211571?text=${encodeURIComponent(`Hi Al Rafa Roastery, I would like to order: ${product.name} (${Number(product.price).toFixed(2)} AED)`)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Order on WhatsApp"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.28)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
