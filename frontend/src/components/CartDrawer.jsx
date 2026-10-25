import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 
    0
  );

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `*☕ AL RAFA ROASTERY ORDER*\n\n`;
    if (customerName.trim()) {
      message += `*Customer:* ${customerName.trim()}\n`;
    }
    message += `*Items:*\n`;

    cartItems.forEach((item, index) => {
      const lineTotal = (Number(item.price) * item.quantity).toFixed(2);
      message += `${index + 1}. ${item.name} (${item.quantity}x) — ${lineTotal} AED\n`;
    });

    message += `\n*Total Amount:* ${totalAmount.toFixed(2)} AED\n`;

    if (notes.trim()) {
      message += `*Notes:* ${notes.trim()}\n`;
    }

    message += `\n_Ordered via Al Rafa Roastery Online Store_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/971562211571?text=${encoded}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 90,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease forwards'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#1E140D',
          borderLeft: '1px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--accent-gold)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-cream)' }}>
              Your Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)'
            }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>Browse our chocolate & coffee roastery menu and add items to your basket.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '12px',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600'} 
                  alt={item.name}
                  style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid var(--border-gold)'
                  }}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600'; }}
                />
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-cream)' }}>
                    {item.name}
                  </div>
                  {item.weight && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                      {item.weight}
                    </div>
                  )}
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                    {(Number(item.price) * item.quantity).toFixed(2)} AED
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    border: '1px solid var(--border-gold)'
                  }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-cream)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-cream)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-gold)',
            backgroundColor: 'rgba(27, 18, 12, 0.98)'
          }}>
            <div style={{ marginBottom: '14px' }}>
              <input 
                type="text"
                placeholder="Your Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--text-cream)',
                  fontSize: '0.85rem',
                  marginBottom: '8px'
                }}
              />
              <input 
                type="text"
                placeholder="Special instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--text-cream)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '18px'
            }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Estimated Total:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {totalAmount.toFixed(2)} AED
              </span>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                backgroundColor: '#22c55e',
                color: '#fff',
                borderColor: '#16a34a'
              }}
            >
              <MessageCircle size={20} />
              <span>Send Order to WhatsApp (0562211571)</span>
            </button>

            <button
              onClick={onClearCart}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                fontSize: '0.78rem',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Clear entire cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
