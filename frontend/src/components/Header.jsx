import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STORE_INFO, CATEGORIES } from '../data/storeData';

export default function Header({
  cartCount = 0,
  onOpenCart = () => {},
  onOpenSearch = () => {},
  lang = 'en',
  setLang = () => {},
  activeCategory = 'ALL',
  onSelectCategory = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAr = lang === 'ar';

  return (
    <header className="ks-header" data-cnav-style="pills">
      {/* Top Header Bar */}
      <div className="max-w-shop px-shop ks-header-top">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            padding: '8px',
            color: '#fff',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
          }}
          className="mobile-only-btn"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <img
            src={STORE_INFO.logoUrl}
            alt={STORE_INFO.name}
            style={{
              height: '54px',
              width: 'auto',
              maxWidth: 'min(14rem, 45vw)',
              objectFit: 'contain',
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="ks-menu desktop-only-nav"
          style={{
            marginLeft: isAr ? '0' : '16px',
            marginRight: isAr ? '16px' : '0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
          }}
          aria-label="Menu"
        >
          <Link
            to="/shop"
            style={{
              opacity: location.pathname === '/shop' ? 1 : 0.75,
              color: location.pathname === '/shop' ? 'var(--shop-primary)' : '#fff',
            }}
          >
            {isAr ? 'المتجر' : 'Shop'}
          </Link>
          <Link
            to="/pages/about"
            style={{
              opacity: location.pathname === '/pages/about' ? 1 : 0.75,
              color: location.pathname === '/pages/about' ? 'var(--shop-primary)' : '#fff',
            }}
          >
            {isAr ? 'من نحن' : 'About Us'}
          </Link>
          <Link
            to="/pages/contact"
            style={{
              opacity: location.pathname === '/pages/contact' ? 1 : 0.75,
              color: location.pathname === '/pages/contact' ? 'var(--shop-primary)' : '#fff',
            }}
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </nav>

        {/* Right actions */}
        <div style={{ marginLeft: isAr ? '0' : 'auto', marginRight: isAr ? 'auto' : '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search Button */}
          <button
            type="button"
            aria-label="Search"
            onClick={onOpenSearch}
            style={{
              padding: '8px',
              color: '#fff',
              opacity: 0.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Language Toggle (Kartlly Style: ع / EN) */}
          <button
            type="button"
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--shop-primary)',
              border: '1px solid var(--shop-border)',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'EN' : 'ع'}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            aria-label="Cart"
            onClick={onOpenCart}
            style={{
              position: 'relative',
              padding: '8px',
              color: '#fff',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
                  backgroundColor: 'var(--shop-primary)',
                  color: 'var(--shop-bg)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-header Categories Pills Nav */}
      <nav className="ks-category-nav max-w-shop" aria-label="Categories">
        <button
          type="button"
          className={`ks-category-link ${!activeCategory || activeCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectCategory('ALL')}
        >
          {isAr ? 'الكل' : 'All Products'}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className={`ks-category-link ${activeCategory === cat.name || activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.name)}
          >
            {isAr ? cat.nameAr : cat.name}
          </button>
        ))}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--shop-border)',
            backgroundColor: 'var(--shop-bg)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontSize: '1rem', fontWeight: 600, color: '#fff' }}
          >
            {isAr ? 'المتجر' : 'Shop'}
          </Link>
          <Link
            to="/pages/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontSize: '1rem', fontWeight: 600, color: '#fff' }}
          >
            {isAr ? 'من نحن' : 'About Us'}
          </Link>
          <Link
            to="/pages/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontSize: '1rem', fontWeight: 600, color: '#fff' }}
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </Link>

          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--shop-border)', fontSize: '0.85rem', color: 'var(--shop-text-muted)' }}>
            <div>{STORE_INFO.phone}</div>
            <div>{isAr ? STORE_INFO.locationAr : STORE_INFO.location}</div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-only-nav { display: none !important; }
          .mobile-only-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .desktop-only-nav { display: flex !important; }
          .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export { Header };

