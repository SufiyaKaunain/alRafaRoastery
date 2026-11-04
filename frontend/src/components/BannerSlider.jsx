import React, { useState, useEffect } from 'react';
import { SLIDERS } from '../data/storeData';

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-shop px-shop" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--shop-radius)' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {SLIDERS.map((slide) => (
            <div key={slide.id} style={{ minWidth: '100%', flexShrink: 0 }}>
              <img
                src={slide.imageUrl}
                alt="Al Rafa Promotion"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {SLIDERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              style={{
                width: currentSlide === idx ? '22px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === idx ? 'var(--shop-primary)' : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

