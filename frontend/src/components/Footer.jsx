import React from 'react';
import { STORE_INFO } from '../data/storeData';

export default function Footer({ lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <footer className="ks-footer">
      <div className="max-w-shop px-shop" style={{ paddingTop: '40px', paddingBottom: '32px' }}>
        <div className="kc-prose" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>
            {isAr ? STORE_INFO.nameAr : 'Al Rafaa Roastery'}
          </div>
          <div style={{ color: 'var(--shop-text-muted)', maxWidth: '600px', marginBottom: '16px' }}>
            {isAr
              ? 'شوكولاتة بلجيكية فاخرة، قهوة عربية، تمور، مكسرات، فواكه مجففة، وحلويات عربية تقليدية.'
              : 'Premium Belgian chocolates, Arabic coffee, dates, nuts, dry fruits, and traditional Arabic sweets.'}
          </div>

          <div style={{ color: 'var(--shop-primary)', fontWeight: 600, marginTop: '16px', marginBottom: '6px' }}>
            {isAr ? 'تواصل معنا:' : 'Contact Us:'}
          </div>
          <div>
            {isAr ? 'الهاتف / واتساب:' : 'Phone / WhatsApp:'}{' '}
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline' }}
            >
              {STORE_INFO.phone}
            </a>
          </div>
          <div>
            {isAr ? 'الموقع:' : 'Location:'} {isAr ? STORE_INFO.locationAr : STORE_INFO.location}
          </div>
          <div>
            {isAr ? 'ساعات العمل:' : 'Opening Hours:'} {isAr ? STORE_INFO.hoursAr : STORE_INFO.hours}
          </div>
          <div>
            {isAr ? 'إنستغرام:' : 'Instagram:'}{' '}
            <a
              href="https://instagram.com/alrafaroast"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--shop-primary)', fontWeight: 600 }}
            >
              {STORE_INFO.instagram}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--shop-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--shop-text-faint)',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          <span>© {new Date().getFullYear()} {STORE_INFO.name}</span>
          <a
            href="https://kartlly.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ opacity: 0.7, transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            Powered by Kartlly
          </a>
        </div>
      </div>
    </footer>
  );
}
