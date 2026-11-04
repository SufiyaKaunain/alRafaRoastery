import React from 'react';
import { STORE_INFO } from '../data/storeData';

export default function ContactPage({ lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <div className="max-w-shop px-shop" style={{ paddingTop: '50px', paddingBottom: '70px', maxWidth: '800px', margin: '0 auto', direction: isAr ? 'rtl' : 'ltr' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
        {isAr ? 'تواصل معنا' : 'Contact Us'}
      </h1>
      <p style={{ color: 'var(--shop-text-muted)', fontSize: '1rem', marginBottom: '32px' }}>
        {isAr
          ? 'نحن هنا لخدمتك دائماً. يسعدنا استقبال استفساراتك وطلباتك الخاصة والمناسبات.'
          : 'We are always delighted to hear from you. Get in touch for custom orders, roastery inquiries, and event catering.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div style={{ backgroundColor: 'var(--shop-card)', border: '1px solid var(--shop-border)', padding: '24px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>📞</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            {isAr ? 'الهاتف والواتساب' : 'Phone & WhatsApp'}
          </h3>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--shop-primary)', fontWeight: 700, fontSize: '1.1rem' }}
          >
            {STORE_INFO.phone}
          </a>
        </div>

        <div style={{ backgroundColor: 'var(--shop-card)', border: '1px solid var(--shop-border)', padding: '24px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>📍</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            {isAr ? 'الموقع' : 'Location'}
          </h3>
          <p style={{ color: 'var(--shop-text-muted)', margin: 0 }}>
            {isAr ? STORE_INFO.locationAr : STORE_INFO.location}
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--shop-card)', border: '1px solid var(--shop-border)', padding: '24px', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🕒</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            {isAr ? 'ساعات العمل' : 'Opening Hours'}
          </h3>
          <p style={{ color: 'var(--shop-text-muted)', margin: 0 }}>
            {isAr ? STORE_INFO.hoursAr : STORE_INFO.hours}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', backgroundColor: 'var(--shop-card)', border: '1px solid var(--shop-border)', padding: '32px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
          {isAr ? 'تحدث مباشرة مع فريق المحمص' : 'Chat Directly with Our Roastery Team'}
        </h3>
        <p style={{ color: 'var(--shop-text-muted)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
          {isAr
            ? 'اطلب مباشرة، استفسر عن الهدايا والتوزيعات، أو احصل على توصيات الخبراء عبر واتساب.'
            : 'Order gifts, inquire about corporate packages, or get personalized recommendations directly on WhatsApp.'}
        </p>
        <a
          href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Al Rafa Roastery, I would like to inquire about your roastery products.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          💬 {isAr ? 'بدء محادثة واتساب الآن' : 'Start WhatsApp Chat Now'}
        </a>
      </div>
    </div>
  );
}

