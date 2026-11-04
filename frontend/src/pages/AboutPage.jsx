import React from 'react';
import { STORE_INFO } from '../data/storeData';

export default function AboutPage({ lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <div className="max-w-shop px-shop" style={{ paddingTop: '50px', paddingBottom: '70px', maxWidth: '800px', margin: '0 auto', direction: isAr ? 'rtl' : 'ltr' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>
        {isAr ? 'عن محمص الرفاع' : 'About Al Rafa Roastery'}
      </h1>

      <div style={{ color: 'var(--shop-text-muted)', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p>
          {isAr
            ? 'تأسس محمص الرفاع في إمارة رأس الخيمة، حاملاً رؤية تهدف إلى إعادة إحياء تقاليد القهوة العربية الأصيلة وتقديم أرقى أنواع الشوكولاتة البلجيكية والمكسرات الطازجة المحمصة بحرفية عالية.'
            : 'Established in the Emirate of Ras Al Khaimah, Al Rafa Roastery was founded with a passion to revive the time-honored traditions of Arabic coffee, while bringing world-class Belgian chocolates and fresh artisanal roasted nuts directly to coffee connoisseurs.'}
        </p>

        <img
          src={STORE_INFO.oneCupBanner}
          alt="Al Rafa Roastery Heritage"
          style={{ width: '100%', borderRadius: '12px', margin: '10px 0' }}
        />

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '10px' }}>
          {isAr ? 'شغفنا بالجودة والتحميص' : 'Our Passion for Roasting & Craft'}
        </h2>

        <p>
          {isAr
            ? 'نختار حبوب البن الخضراء من أفضل المزارع في إثيوبيا، كولومبيا، اليمن، والبرازيل، ونحمصها يومياً في محمصنا لضمان أقصى درجات النقاء وعمق النكهة. كما نقدم تشكيلة لا تُضاهى من المكسرات الجامبو المحمصة بالهواء الساخن بدون زيوت مهدرجة.'
            : 'We source green beans from prestigious high-altitude origins across Ethiopia, Colombia, Yemen, and Brazil, roasting them in small batches daily to achieve peak aromatic intensity. Complementing our coffee is an exquisite range of hot-air roasted nuts, Belgian pralines, and royal dates.'}
        </p>

        <div style={{ backgroundColor: 'var(--shop-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--shop-border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--shop-primary)', marginBottom: '8px' }}>
            {isAr ? 'قيمنا' : 'Our Core Promise'}
          </h3>
          <p style={{ margin: 0 }}>
            {isAr
              ? 'الأصالة الإماراتية، الجودة الخالصة بدون مساومة، والضيافة الدافئة التي تليق بكل بيت ومناسبة.'
              : 'Emirati authenticity, uncompromised artisanal freshness, and the warm hospitality of true Arabian heritage.'}
          </p>
        </div>
      </div>
    </div>
  );
}

