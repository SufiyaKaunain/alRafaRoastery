import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  isAuthenticated, getAdminUser, logoutUser,
  fetchProducts, checkBackendStatus
} from '../../api';
import AdminDashboard from '../../components/AdminDashboard';
import Toast from '../../components/Toast';
import {
  LogOut, Store, Coffee, Database, User,
  LayoutDashboard, Package, ChevronRight, Menu, X,
  TrendingUp, ShoppingBag, Tag, AlertCircle
} from 'lucide-react';

/* ─── Sidebar nav items ─────────────────────────────────── */
const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'profile', label: 'Profile', icon: User },
];

/* ─── Home Tab ──────────────────────────────────────────── */
function HomeTab({ products, dbConnected, onGoToProducts }) {
  const total = products.length;
  const available = products.filter(p => p.isAvailable).length;
  const categories = new Set(products.map(p => p.category)).size;
  const avgPrice = total > 0
    ? (products.reduce((s, p) => s + Number(p.price), 0) / total).toFixed(1)
    : '0';

  const stats = [
    { label: 'Total Products', value: total, color: '#C89B6A', bg: '#FFF8F0', icon: Package },
    { label: 'Available in Stock', value: available, color: '#16a34a', bg: '#F0FDF4', icon: ShoppingBag },
    { label: 'Categories', value: categories, color: '#2563eb', bg: '#EFF6FF', icon: Tag },
    { label: 'Avg. Price (AED)', value: `${avgPrice}`, color: '#7c3aed', bg: '#F5F3FF', icon: TrendingUp },
  ];

  // last 5 added products
  const recent = [...products].slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>
          Dashboard Overview
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
          Welcome back! Here's what's happening with your roastery.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '36px',
      }}>
        {stats.map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111', lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* DB Status */}
      {/* <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: dbConnected ? '#22c55e' : '#ef4444',
          boxShadow: dbConnected ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
          flexShrink: 0,
        }} />
        <div>
          <span style={{ fontWeight: 700, color: dbConnected ? '#15803d' : '#dc2626', fontSize: '0.9rem' }}>
            {dbConnected ? 'PostgreSQL Connected' : 'Database Disconnected'}
          </span>
          <span style={{ color: '#9ca3af', fontSize: '0.83rem', marginLeft: '10px' }}>
            localhost:5432 · alrafa_roastery · ASP.NET Core API
          </span>
        </div>
      </div> */}

      {/* Recent Products */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>Recent Products</h3>
          <button
            onClick={onGoToProducts}
            style={{
              fontSize: '0.82rem', color: '#C89B6A', fontWeight: 700,
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recent.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No products yet.</p>
          )}
          {recent.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '10px 0',
              borderBottom: '1px solid #f5f5f5',
            }}>
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=100'; }}
              />
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{p.category}</div>
              </div>
              <div style={{ fontWeight: 700, color: '#C89B6A', fontSize: '0.9rem', flexShrink: 0 }}>
                {Number(p.price).toFixed(2)} AED
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                background: p.isAvailable ? '#dcfce7' : '#fee2e2',
                color: p.isAvailable ? '#15803d' : '#dc2626',
              }}>
                {p.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Tab ───────────────────────────────────────── */
function ProfileTab({ adminUser }) {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>
          My Profile
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
          Your admin account details.
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '20px', padding: '40px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
        maxWidth: '520px',
      }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C89B6A, #A87747)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: '#1B120C',
            flexShrink: 0,
          }}>
            {(adminUser?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111' }}>
              {adminUser?.fullName || 'Admin'}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '9999px',
              background: '#FFF8F0', border: '1px solid #C89B6A',
              color: '#A87747', fontSize: '0.78rem', fontWeight: 700,
              marginTop: '4px',
            }}>
              <Coffee size={12} />
              Admin · Al Rafa Roastery
            </div>
          </div>
        </div>

        {/* Fields */}
        {[
          { label: 'Full Name', value: adminUser?.fullName || '—' },
          { label: 'Email Address', value: adminUser?.email || '—' },
          { label: 'Role', value: 'Administrator' },
          { label: 'Access Level', value: 'Full CRUD — Product Management' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', gap: '4px',
            padding: '16px 0', borderBottom: '1px solid #f5f5f5',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </div>
            <div style={{ fontSize: '0.97rem', fontWeight: 600, color: '#111' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const adminUser = getAdminUser();
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin', { replace: true });
  }, [navigate]);

  const loadData = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setDbConnected(true);
    } catch {
      setDbConnected(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      setDbConnected(await checkBackendStatus());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { logoutUser(); navigate('/admin'); };

  if (!isAuthenticated()) return null;

  const SIDEBAR_W = sidebarOpen ? '240px' : '72px';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8F9FB' }}>

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        background: 'linear-gradient(180deg, #1B120C 0%, #231710 100%)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(200,155,106,0.2)',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        zIndex: 20,
      }}>
        {/* Brand */}
        <div style={{
          padding: sidebarOpen ? '28px 20px 20px' : '28px 0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(200,155,106,0.15)',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #C89B6A, #A87747)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Coffee size={18} color="#1B120C" />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.9rem', fontWeight: 700,
                color: '#F7F1E8', letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}>
                AL RAFA
              </div>
              <div style={{ fontSize: '0.7rem', color: '#C89B6A', fontWeight: 600, letterSpacing: '0.1em' }}>
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                title={!sidebarOpen ? label : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarOpen ? '12px 20px' : '12px 0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: active
                    ? 'linear-gradient(90deg, rgba(200,155,106,0.18) 0%, rgba(200,155,106,0.06) 100%)'
                    : 'none',
                  border: 'none',
                  borderLeft: active ? '3px solid #C89B6A' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  color: active ? '#C89B6A' : 'rgba(247,241,232,0.6)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  letterSpacing: '0.01em',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          borderTop: '1px solid rgba(200,155,106,0.15)',
          padding: sidebarOpen ? '16px 20px' : '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: sidebarOpen ? 'flex-start' : 'center',
        }}>
          <Link
            to="/"
            title={!sidebarOpen ? 'Back to Shop' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'rgba(247,241,232,0.55)', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 500,
              padding: '8px 0',
              transition: 'color 0.18s',
            }}
          >
            <Store size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Back to Shop</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none',
              color: '#f87171', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600,
              padding: '8px 0',
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ─────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── HEADER ──────────────────────────────────────── */}
        <header style={{
          height: '64px',
          background: 'linear-gradient(90deg, #1B120C 0%, #2B1D14 100%)',
          borderBottom: '1px solid rgba(200,155,106,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          zIndex: 10,
        }}>
          {/* Left: hamburger + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: 'rgba(200,155,106,0.1)',
                border: '1px solid rgba(200,155,106,0.2)',
                borderRadius: '8px', padding: '7px',
                color: '#C89B6A', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(247,241,232,0.5)', fontSize: '0.85rem' }}>
              <span>Admin</span>
              <ChevronRight size={14} />
              <span style={{ color: '#C89B6A', fontWeight: 700 }}>
                {NAV_ITEMS.find(n => n.key === activeTab)?.label}
              </span>
            </div>
          </div>

          {/* Right: DB status + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

            {/* User chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '10px',
              background: 'rgba(200,155,106,0.1)',
              border: '1px solid rgba(200,155,106,0.25)',
            }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#C89B6A,#A87747)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 800, color: '#1B120C',
              }}>
                {(adminUser?.fullName || 'A')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#F7F1E8', fontWeight: 600 }}>
                {adminUser?.fullName?.split(' ')[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* ── CONTENT AREA (white) ─────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#F8F9FB' }}>
          {activeTab === 'home' && (
            <HomeTab
              products={products}
              dbConnected={dbConnected}
              onGoToProducts={() => setActiveTab('products')}
            />
          )}
          {activeTab === 'products' && (
            <AdminDashboard
              products={products}
              onRefresh={loadData}
              onBackToShop={() => navigate('/')}
              showToast={showToast}
              dbConnected={dbConnected}
              lightMode
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab adminUser={adminUser} />
          )}
        </main>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
