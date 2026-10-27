import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { fetchProducts, checkBackendStatus } from './api';
import { Search, SlidersHorizontal, RefreshCw, AlertTriangle, Coffee } from 'lucide-react';

// ─── Customer Shop Page ──────────────────────────────────────────────
function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Cart
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('alrafa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alrafa_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cartItems]);

  // Load products from backend
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setDbConnected(true);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      const ok = await checkBackendStatus();
      setDbConnected(ok);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: qty }];
      }
    });
    showToast(`Added ${qty}x ${product.name} to cart`, 'success');
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart cleared', 'info');
  };

  // Product categories list
  const categories = [
    'ALL',
    'Specialty Drinks',
    'Coffee Beans',
    'Premium Nuts',
    'Luxury Chocolates',
    'Dates & Confections'
  ];

  // Filtered & Sorted products
  const displayedProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(searchTerm)) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      return (b.tag === 'bestseller' || b.tag === 'signature') ? 1 : -1;
    });

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        cartCount={cartTotalCount}
        setIsCartOpen={setIsCartOpen}
        dbConnected={dbConnected}
      />

      <main style={{ flexGrow: 1 }}>
        <Hero 
          onExploreClick={() => {
            const el = document.getElementById('shop-menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Shop Section */}
        <section id="shop-menu" style={{ padding: '80px 0 60px' }}>
          <div className="container">
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                <Coffee size={16} />
                <span>Artisanal Selection</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                color: 'var(--text-cream)',
                marginBottom: '10px'
              }}>
                Our Menu & Roastery Shop
              </h2>
              <div style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '1.2rem',
                color: 'var(--accent-gold)',
                direction: 'rtl'
              }}>
                تشكيلة القهوة المحمصة، الشوكولاتة البلجيكية، والمكسرات الفاخرة
              </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {/* Category Pills */}
              <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '9999px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? 'var(--accent-gold)' : 'var(--border-gold)',
                      backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat ? '#1B120C' : 'var(--text-cream)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.25s ease',
                      boxShadow: selectedCategory === cat ? '0 4px 15px rgba(200, 155, 106, 0.3)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar & Sort selector */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px 20px',
                borderRadius: '16px',
                border: '1px solid var(--border-gold)'
              }}>
                <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px', maxWidth: '450px' }}>
                  <Search size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-faint)'
                  }} />
                  <input 
                    type="text"
                    placeholder="Search chocolates, coffee, nuts, or dates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px 10px 42px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-cream)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SlidersHorizontal size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#2B1D14',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--text-cream)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="featured">Featured / Bestsellers</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--accent-gold)', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading roastery products from PostgreSQL...</p>
              </div>
            ) : error ? (
              <div className="glass-panel" style={{
                padding: '40px',
                textAlign: 'center',
                maxWidth: '550px',
                margin: '0 auto',
                borderColor: 'rgba(239, 68, 68, 0.4)'
              }}>
                <AlertTriangle size={42} color="#f87171" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#f87171', marginBottom: '8px' }}>
                  Database Connection Issue
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  {error}
                </p>
                <button onClick={loadData} className="btn-gold">
                  <RefreshCw size={16} />
                  <span>Try Reconnecting</span>
                </button>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No items match your search or filter.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                  className="btn-outline-gold"
                  style={{ marginTop: '12px' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {displayedProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

// ─── Root App with Routes ─────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShopPage />} />
      <Route path="*" element={<ShopPage />} />
    </Routes>
  );
}
