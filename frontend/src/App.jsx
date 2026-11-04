import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { fetchProducts } from './api';
import { FEATURED_FALLBACK_PRODUCTS, CATEGORIES } from './data/storeData';

export default function App() {
  const [products, setProducts] = useState(FEATURED_FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('alrafa_lang') || 'en';
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Cart state
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('alrafa_cart') || '[]');
    } catch {
      return [];
    }
  });

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('alrafa_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Update HTML dir and language attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('alrafa_lang', lang);
  }, [lang]);

  // Load products from API
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge API data with fallback images if needed
          setProducts(data);
        }
      } catch (err) {
        console.warn('API products fetch fallback:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Cart handlers
  const handleAddToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const key = `${product.id}-${product.selectedWeight || 'default'}`;
      const existing = prev.find((i) => `${i.id}-${i.selectedWeight || 'default'}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.selectedWeight || 'default'}` === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    if (location.pathname !== '/shop') {
      navigate('/shop');
    }
  };

  const cartTotalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--shop-bg)' }}>
      {/* Kartlly Header */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        lang={lang}
        setLang={setLang}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content View */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                onProductClick={(p) => setSelectedProduct(p)}
                onSelectCategory={handleSelectCategory}
                lang={lang}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                products={products}
                onProductClick={(p) => setSelectedProduct(p)}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                lang={lang}
              />
            }
          />
          <Route path="/pages/about" element={<AboutPage lang={lang} />} />
          <Route path="/pages/contact" element={<ContactPage lang={lang} />} />
          <Route
            path="*"
            element={
              <HomePage
                products={products}
                onProductClick={(p) => setSelectedProduct(p)}
                onSelectCategory={handleSelectCategory}
                lang={lang}
              />
            }
          />
        </Routes>
      </main>

      {/* Exact Kartlly Footer */}
      <Footer lang={lang} />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        lang={lang}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        lang={lang}
      />
    </div>
  );
}
