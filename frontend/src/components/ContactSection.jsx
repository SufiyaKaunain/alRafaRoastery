import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" style={{
      padding: '90px 0',
      backgroundColor: '#1B120C',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-gold)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '10px'
          }}>
            <MapPin size={16} />
            <span>Visit Us in Ras Al Khaimah</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-cream)',
            marginBottom: '12px'
          }}>
            Store Location & Contact
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Drop by our roastery to experience the aroma of freshly roasted beans, or connect with our team directly.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Address Card */}
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              margin: '0 auto 16px'
            }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-cream)' }}>
              Location
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Al Muntasir Road, opposite Indian School<br />
              Ras Al Khaimah, United Arab Emirates
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Al+Muntasir+Road+opposite+Indian+School+Ras+Al+Khaimah"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <ExternalLink size={14} />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Direct Phone & WhatsApp */}
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              margin: '0 auto 16px'
            }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-cream)' }}>
              Phone & WhatsApp
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Call: <a href="tel:0562211571" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>0562211571</a><br />
              WhatsApp: +971 56 221 1571
            </p>
            <a
              href="https://wa.me/971562211571?text=Hello%20Al%20Rafa%20Roastery!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Email & Hours */}
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              margin: '0 auto 16px'
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-cream)' }}>
              Hours & Email
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Saturday – Friday: 8:00 AM – 11:30 PM<br />
              <a href="mailto:Info.alrafaroast@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem' }}>
                Info.alrafaroast@gmail.com
              </a>
            </p>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              Open Daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
