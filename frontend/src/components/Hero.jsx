import React from 'react';
import { Sparkles, Coffee, Award, MessageCircle, ChevronDown } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section style={{
      position: 'relative',
      padding: '90px 0 80px',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(61, 42, 29, 0.6) 0%, rgba(27, 18, 12, 1) 75%)',
      borderBottom: '1px solid var(--border-gold)'
    }}>
      {/* Decorative ambient glow orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(200, 155, 106, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Roastery Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(200, 155, 106, 0.12)',
          border: '1px solid var(--border-gold)',
          color: 'var(--accent-gold)',
          fontSize: '0.82rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '24px'
        }}>
          <Sparkles size={14} />
          <span>Ras Al Khaimah · Artisanal Roastery & Chocolatier</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '16px',
          letterSpacing: '0.02em',
        }}>
          From Bean to Box — <br />
          <span className="gold-gradient-text">Crafted with Pure Passion</span>
        </h1>

        {/* Arabic Tagline */}
        <div style={{
          fontFamily: 'var(--font-arabic)',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          color: 'var(--accent-gold)',
          fontWeight: 700,
          marginBottom: '20px',
          letterSpacing: '0.02em',
          direction: 'rtl'
        }}>
          أرقى أنواع القهوة المختصة، المكسرات المحمصة، والشوكولاتة الفاخرة
        </div>

        {/* Description */}
        <p style={{
          maxWidth: '680px',
          margin: '0 auto 36px',
          color: 'var(--text-muted)',
          fontSize: '1.05rem',
          lineHeight: 1.7
        }}>
          Welcome to Al Rafa Roastery. Located in Ras Al Khaimah, we bring you freshly roasted specialty coffee beans, 
          silky Belgian-style chocolates, and freshly salted artisan nuts for true connoisseurs.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '50px'
        }}>
          <button 
            onClick={onExploreClick}
            className="btn-gold"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            <Coffee size={18} />
            <span>Explore Menu & Shop</span>
          </button>

          <a 
            href="https://wa.me/971562211571?text=Hello%20Al%20Rafa%20Roastery,%20I%20would%20like%20to%20place%20an%20order!" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-outline-gold"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            <MessageCircle size={18} />
            <span>Order on WhatsApp</span>
          </a>
        </div>

        {/* Quick Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <Coffee size={24} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-cream)' }}>100% Arabica Specialty</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fresh daily in-house roasting</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <Award size={24} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-cream)' }}>Belgian Style Chocolate</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Handmade velvety ganache & bonbons</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <Sparkles size={24} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-cream)' }}>Artisan Nuts & Dates</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hot-air roasted California nuts</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <MessageCircle size={24} style={{ margin: '0 auto' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-cream)' }}>Instant UAE WhatsApp</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick direct delivery coordination</div>
          </div>
        </div>
      </div>
    </section>
  );
}
