import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeData';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang = 'en',
}) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let msg = `*☕ AL RAFA ROASTERY ORDER*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerName.trim()) msg += `*Customer:* ${customerName.trim()}\n`;
    if (deliveryAddress.trim()) msg += `*Delivery Location:* ${deliveryAddress.trim()}\n`;
    msg += `\n*Order Items:*\n`;

    cartItems.forEach((item, index) => {
      const lineTotal = (Number(item.price) * item.quantity).toFixed(2);
      msg += `${index + 1}. *${item.name}*`;
      if (item.selectedWeight) msg += ` (${item.selectedWeight})`;
      msg += `\n   Qty: ${item.quantity} × AED ${Number(item.price).toFixed(2)} = AED ${lineTotal}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Estimated Total:* AED ${totalAmount.toFixed(2)}\n`;

    if (notes.trim()) {
      msg += `*Special Notes:* ${notes.trim()}\n`;
    }

    msg += `\n_Ordered via Al Rafa Roastery Online Store_`;

    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 60,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isAr ? 'auto' : 0,
          left: isAr ? 0 : 'auto',
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--shop-bg)',
          borderLeft: isAr ? 'none' : '1px solid var(--shop-border)',
          borderRight: isAr ? '1px solid var(--shop-border)' : 'none',
          zIndex: 61,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
          animation: 'slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--shop-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🛍️</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {isAr ? `سلة المشتريات (${totalCount})` : `Shopping Cart (${totalCount})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: '6px',
              color: 'var(--shop-text-muted)',
              fontSize: '1.3rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Item List */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--shop-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '14px', opacity: 0.4 }}>☕</div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                {isAr ? 'السلة فارغة حالياً' : 'Your cart is empty'}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                {isAr ? 'تصفح محامصنا والشوكولاتة والمكسرات لإضافة منتجات.' : 'Explore our roasts, chocolates, and nuts to add items.'}
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedWeight || 'default'}`}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'var(--shop-card)',
                  borderRadius: '10px',
                  border: '1px solid var(--shop-border)',
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  {item.selectedWeight && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--shop-primary)' }}>
                      {item.selectedWeight}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginTop: '4px' }}>
                    AED {(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Qty & Remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{ color: '#ef4444', fontSize: '0.8rem', padding: '2px' }}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      border: '1px solid var(--shop-border)',
                    }}
                  >
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '2px 8px', color: '#fff', fontSize: '0.9rem' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '2px 8px', color: '#fff', fontSize: '0.9rem' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--shop-border)',
              backgroundColor: 'var(--shop-bg-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Inputs */}
            <input
              type="text"
              placeholder={isAr ? 'الاسم الكريم (اختياري)' : 'Your Name (optional)'}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--shop-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />

            <input
              type="text"
              placeholder={isAr ? 'عنوان التوصيل أو الإمارة...' : 'Delivery Address / City in UAE...'}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--shop-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />

            <input
              type="text"
              placeholder={isAr ? 'ملاحظات خاصة (مثل درجة الطحن)...' : 'Special notes (e.g. grind level)...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--shop-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '4px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--shop-text-muted)' }}>
                {isAr ? 'الإجمالي التقديري:' : 'Estimated Total:'}
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--shop-primary)' }}>
                AED {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="btn-wa"
              style={{ width: '100%', padding: '13px', fontSize: '0.95rem' }}
            >
              <span>💬</span>
              <span>{isAr ? 'إرسال الطلب عبر واتساب (056 221 1571)' : 'Order via WhatsApp (056 221 1571)'}</span>
            </button>

            <button
              onClick={onClearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--shop-text-faint)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isAr ? 'إفراغ السلة بالكامل' : 'Clear entire cart'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
