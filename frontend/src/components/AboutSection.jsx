import React from 'react';
import { Award, Flame, Heart, Coffee } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" style={{
      padding: '90px 0',
      backgroundColor: 'rgba(23, 15, 10, 0.95)',
      borderTop: '1px solid var(--border-gold)',
      borderBottom: '1px solid var(--border-gold)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid var(--border-gold)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(200, 155, 106, 0.15)',
              height: '420px',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80" 
                alt="Artisanal Roastery and Chocolates"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '16px',
                backgroundColor: 'rgba(27, 18, 12, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid var(--border-gold)'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                  Ras Al Khaimah Heritage
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Hand-roasting beans & dipping artisan chocolates since day one.
                </div>
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '12px'
            }}>
              <Coffee size={16} />
              <span>Our Artisanal Heritage</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '16px',
              color: 'var(--text-cream)'
            }}>
              The Story of <span className="gold-gradient-text">Al Rafa Roastery</span>
            </h2>

            <div style={{
              fontFamily: 'var(--font-arabic)',
              fontSize: '1.25rem',
              color: 'var(--accent-gold)',
              marginBottom: '18px',
              direction: 'rtl'
            }}>
              شغف في التحميص، وحرفية في صناعة الشوكولاتة الفاخرة
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px', fontSize: '0.98rem' }}>
              Born in Ras Al Khaimah, United Arab Emirates, Al Rafa Roastery was founded on a simple promise: 
              uncompromising dedication to taste. We select single-origin green coffee beans from the high-altitude 
              estates of Ethiopia, Colombia, and Yemen, roasting them in small batches to preserve their nuanced aromas.
            </p>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px', fontSize: '0.98rem' }}>
              Our master chocolatiers blend premium European cacao with the finest local delicacies — from crisp 
              California pistachios to succulent royal dates, creating a symphony of textures and flavors.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <Flame size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Small Batch Roasts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Never mass-produced</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <Heart size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pure Ingredients</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>100% natural cocoa butter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
