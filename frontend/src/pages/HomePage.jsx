import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import Marquee from '../components/Marquee';
import BannerSlider from '../components/BannerSlider';
import { STORE_INFO } from '../data/storeData';

export default function HomePage({
  products,
  onProductClick,
  onSelectCategory,
  lang = 'en',
}) {
  const isAr = lang === 'ar';

  // Take top 8 products for the featured section
  const featuredProducts = products.slice(0, 8);

  return (
    <div>
      {/* 1. Hero Banner with overlay text */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(200px, 32vw, 360px)', position: 'relative' }}>
        <img
          src={STORE_INFO.bannerUrl}
          alt={STORE_INFO.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)',
          }}
        />
        <div
          className="max-w-shop px-shop"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            color: '#fff',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {STORE_INFO.name}
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)', color: 'var(--shop-accent)', fontWeight: 500, marginTop: '4px' }}>
            {isAr ? 'طعم الأصالة، ولمسة من الفخامة' : 'A Taste of Tradition, A Touch of Luxury'}
          </p>
        </div>
      </div>

      {/* 2. Marquee Ticker */}
      <Marquee lang={lang} />

      {/* 3. Intro Tagline Section */}
      <section style={{ backgroundColor: 'color-mix(in srgb, var(--shop-text) 4%, var(--shop-bg))' }}>
        <div className="max-w-shop px-shop" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--shop-primary)',
              marginBottom: '12px',
            }}
          >
            {isAr ? 'محمص الرفاع · رأس الخيمة' : 'AL RAFA ROASTERY · RAS AL KHAIMAH'}
          </p>
          <h2
            className="kc-display"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              maxWidth: '850px',
              margin: '0 auto 16px',
            }}
          >
            {isAr ? 'طعم الأصالة، ولمسة من الفخامة' : 'A Taste of Tradition, A Touch of Luxury'}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--shop-text-muted)',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {isAr
              ? 'حبوب بن مختارة بعناية، مكسرات طازجة ومحمصة يومياً، شوكولاتة بلجيكية فاخرة، وضيافة إماراتية أصيلة تصلك أينما كنت.'
              : 'Hand-selected beans, freshly roasted nuts, artisanal Belgian chocolates, and authentic Emirati hospitality — delivered to your door.'}
          </p>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="max-w-shop px-shop" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', direction: isAr ? 'rtl' : 'ltr' }}>
            {isAr ? 'المميزة' : 'Featured'}
          </h2>
          <Link
            to="/shop"
            style={{ fontSize: '0.9rem', color: 'var(--shop-primary)', fontWeight: 600, opacity: 0.9 }}
          >
            {isAr ? 'عرض الكل ←' : 'View all →'}
          </Link>
        </div>

        <div className="grid-cols-shop">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* 5. Visual Banner: Discover the Taste of Arabia */}
      <section
        style={{
          position: 'relative',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          margin: '20px 0',
        }}
      >
        <img
          src={STORE_INFO.discoverBanner}
          alt="Discover Arabia"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div
          className="max-w-shop px-shop"
          style={{
            position: 'relative',
            zIndex: 2,
            paddingTop: '60px',
            paddingBottom: '60px',
            color: '#fff',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          <p style={{ color: 'var(--shop-primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {isAr ? 'اكتشف مذاق الضيافة العربية' : 'DISCOVER THE TASTE OF ARABIA'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, maxWidth: '650px', marginBottom: '18px' }}>
            {isAr ? 'صنعت بشغف، وحمصت بكل إتقان' : 'Crafted with Passion, Roasted to Perfection'}
          </h2>
          <Link to="/shop" className="btn-primary">
            {isAr ? 'استكشف منتجاتنا' : 'Explore Our Roasts'}
          </Link>
        </div>
      </section>

      {/* 6. Why Al Rafa Roastery / Quality You Can Taste */}
      <section style={{ backgroundColor: 'color-mix(in srgb, var(--shop-text) 3%, var(--shop-bg))' }}>
        <div className="max-w-shop px-shop" style={{ padding: '60px 20px' }}>
          <div style={{ textAlign: isAr ? 'right' : 'left', marginBottom: '32px' }}>
            <p style={{ color: 'var(--shop-primary)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {isAr ? 'لماذا محمص الرفاع' : 'WHY AL RAFA ROASTERY'}
            </p>
            <h2 className="kc-display" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 700, color: '#fff' }}>
              {isAr ? 'جودة تتذوقها في كل حبة' : 'Quality You Can Taste'}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                icon: '☕',
                title: isAr ? 'قهوة عربية فاخرة' : 'Premium Arabic Coffee',
                desc: isAr
                  ? 'محامص تراثية أصيلة مع الهيل والزعفران وأسرار التحميص الإماراتي.'
                  : 'Artisanal heritage roasts infused with cardamom, saffron, and master roasting secrets.',
              },
              {
                icon: '🥜',
                title: isAr ? 'مكسرات وفواكه مجففة' : 'Quality Nuts & Dry Fruits',
                desc: isAr
                  ? 'فستق أمريكي جامبو، كاجو ذهبي، لوز محمص، وعين جمل طازج يُحمص يومياً.'
                  : 'Jumbo pistachios, golden cashews, roasted almonds, and Chile walnuts roasted daily.',
              },
              {
                icon: '🍫',
                title: isAr ? 'شوكولاتة وحلويات فاخرة' : 'Chocolates & Sweet Treats',
                desc: isAr
                  ? 'شوكولاتة بلجيكية فاخرة، تمور محشوة، وحلويات عربية للمناسبات والضيافة.'
                  : 'Decadent Belgian chocolates, stuffed dates, and authentic Arabic sweets.',
              },
              {
                icon: '🌿',
                title: isAr ? 'بهارات وتوابل فاخرة' : 'Premium Spices',
                desc: isAr
                  ? 'توابل شرقية أصيلة منتقاة بعناية لنكهات لا مثيل لها.'
                  : 'Authentic Middle Eastern spices and aromatics for extraordinary flavor.',
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--shop-card)',
                  border: '1px solid var(--shop-border)',
                  borderRadius: 'var(--shop-radius)',
                  padding: '24px',
                  direction: isAr ? 'rtl' : 'ltr',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--shop-text-muted)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Built Around One Great Cup */}
      <section className="max-w-shop px-shop" style={{ padding: '60px 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '40px',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          <div style={{ overflow: 'hidden', borderRadius: 'var(--shop-radius)' }}>
            <img
              src={STORE_INFO.oneCupBanner}
              alt="Built Around One Great Cup"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>

          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '16px' }}>
              {isAr ? 'فنجان واحد يجمع الأصالة والإتقان' : 'Built Around One Great Cup'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--shop-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              {isAr
                ? 'من قلب رأس الخيمة، يجمع محمص الرفاع بين أجيال من تقاليد إعداد القهوة العربية والتحميص العصري الدقيق. نحن نضمن لك تجربة استثنائية مع كل رشفة وكل حبة.'
                : 'From the heart of Ras Al Khaimah, Al Rafa Roastery brings together generations of authentic coffee tradition and contemporary precision roasting.'}
            </p>
            <Link to="/pages/about" className="btn-secondary">
              {isAr ? 'قصتنا الكاملة' : 'Our Story'}
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Shop by Category Grid */}
      <CategoryGrid onSelectCategory={onSelectCategory} lang={lang} />

      {/* 9. Promotional Banner Slider */}
      <BannerSlider />
    </div>
  );
}

