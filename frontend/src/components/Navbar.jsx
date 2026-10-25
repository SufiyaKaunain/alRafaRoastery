import React, { useState } from 'react';
import { ShoppingBag, Store, Phone, MapPin, Coffee, Menu, X, Database } from 'lucide-react';

export default function Navbar({
  cartCount,
  setIsCartOpen,
  dbConnected
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(27, 18, 12, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-gold)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Brand Logo & Name */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <img
            src="/logo-circle.png"
            alt="Al Rafa Roastery Logo"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'contain',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 0 15px rgba(200, 155, 106, 0.3)'
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-cream)',
              lineHeight: 1.1
            }}>
              AL RAFA ROASTERY
            </div>
            <div style={{
              fontFamily: 'var(--font-arabic)',
              fontSize: '0.9rem',
              color: 'var(--accent-gold)',
              letterSpacing: '0.02em',
              fontWeight: 600
            }}>
              محمص الرفاع للشوكولاتة والقهوة
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px',
        }} className="desktop-nav">
          <a
            href="#shop-menu"
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '8px 12px',
              transition: 'color 0.2s'
            }}
          >
            Menu & Shop
          </a>

          <a
            href="#about"
            style={{
              color: 'var(--text-cream)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              padding: '8px 12px',
              transition: 'color 0.2s'
            }}
          >
            Our Story
          </a>

          <a
            href="#contact"
            style={{
              color: 'var(--text-cream)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              padding: '8px 12px',
              transition: 'color 0.2s'
            }}
          >
            Location
          </a>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--accent-gold)',
                color: '#1B120C',
                fontSize: '0.75rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-only">
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              padding: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: 'var(--accent-gold)',
                color: '#1B120C',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--text-cream)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#1B120C',
          borderBottom: '1px solid var(--border-gold)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <a
            href="#shop-menu"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '8px 0'
            }}
          >
            Menu & Shop
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-cream)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '8px 0'
            }}
          >
            Our Story
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-cream)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '8px 0'
            }}
          >
            Location
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4ade80' }}>
            <Database size={14} />
            <span>PostgreSQL: {dbConnected ? 'Online' : 'Reconnecting...'}</span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
