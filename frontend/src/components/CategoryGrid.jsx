import React from 'react';
import { CATEGORIES } from '../data/storeData';

export default function CategoryGrid({ onSelectCategory, lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <section className="max-w-shop px-shop" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', direction: isAr ? 'rtl' : 'ltr' }}>
          {isAr ? 'تسوق حسب الفئة' : 'Shop by Category'}
        </h2>
      </div>

      <div className="ks-cat-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="ks-cat-tile"
            onClick={() => onSelectCategory(cat.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectCategory(cat.name); }}
          >
            <div className="ks-cat-thumb-wrap">
              <img
                src={cat.thumbUrl}
                alt={cat.name}
                loading="lazy"
              />
            </div>
            <div className="ks-cat-name" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              {isAr ? cat.nameAr : cat.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

