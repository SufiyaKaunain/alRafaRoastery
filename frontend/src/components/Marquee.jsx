import React from 'react';

export default function Marquee({ lang = 'en' }) {
  const isAr = lang === 'ar';
  const textEn = "☕ AL RAFA ROASTERY | Premium Arabic Coffee & Fresh Nuts | Belgium Chocolates & Luxury Sweets | Dates • Dry Fruits • Gift Hampers |";
  const textAr = "☕ محمص الرفاع | قهوة عربية فاخرة ومكسرات طازجة | شوكولاتة بلجيكية وحلويات فاخرة | تمور • فواكه مجففة • هدايا وتوزيعات |";
  const displayText = isAr ? textAr : textEn;

  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundColor: 'var(--shop-primary)',
        color: '#ffffff',
        padding: '12px 0',
        overflow: 'hidden',
        fontSize: '0.86rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
      aria-label="Roastery Announcements"
    >
      <div className="kc-marquee">
        <span>{displayText}</span>
        <span>{displayText}</span>
        <span>{displayText}</span>
        <span>{displayText}</span>
      </div>
    </section>
  );
}

