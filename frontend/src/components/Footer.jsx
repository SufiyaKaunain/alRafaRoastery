import React from 'react';
import { Coffee, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#140D08',
      borderTop: '1px solid var(--border-gold)',
      padding: '48px 0 32px',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/logo-circle.png" 
              alt="Al Rafa Roastery" 
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--accent-gold)' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-cream)', fontSize: '1.1rem' }}>
                AL RAFA ROASTERY
              </div>
              <div style={{ fontFamily: 'var(--font-arabic)', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                محمص الرفاع — رأس الخيمة
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem' }}>
            <a href="#shop-menu" style={{ color: 'var(--text-cream)', textDecoration: 'none' }}>Menu & Shop</a>
            <a href="#about" style={{ color: 'var(--text-cream)', textDecoration: 'none' }}>Our Story</a>
            <a href="#contact" style={{ color: 'var(--text-cream)', textDecoration: 'none' }}>Location</a>
          </div>
        </div>

        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-faint)'
        }}>
          <div>
            © {new Date().getFullYear()} Al Rafa Roastery. All rights reserved. Ras Al Khaimah, UAE.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built with React + ASP.NET Core + PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
