import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAuthenticated, getAdminUser, logoutUser,
  fetchProducts, checkBackendStatus
} from '../api';
import AdminDashboard from '../components/AdminDashboard';
import Toast from '../components/Toast';
import {
  LogOut, ExternalLink, Coffee, Database, User,
  LayoutDashboard, Package, ChevronRight, Menu, X,
  TrendingUp, ShoppingBag, Tag
} from 'lucide-react';

/* ─── Sidebar nav items ─────────────────────────────────── */
const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'profile', label: 'Profile', icon: User },
];

/* ─── Home Tab ──────────────────────────────────────────── */
function HomeTab({ products, onGoToProducts }) {
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

      {/* Recent Products + Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {/* Recent Products Card */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111' }}>Recent Products</h3>
            <button
              onClick={onGoToProducts}
              style={{
                background: 'none', border: 'none', color: '#C89B6A',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>

          {recent.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No products found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 0', borderBottom: '1px solid #f5f5f5',
                }}>
                  <img
                    src={p.imageUrl || '/logo-circle.png'}
                    alt={p.name}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/logo-circle.png'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{p.category}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#C89B6A' }}>
                    AED {p.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              Product Management
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Easily add new specialty roasts, chocolates, or artisanal nuts, modify pricing, update descriptions, and toggle stock availability in real time.
            </p>
          </div>
          <button
            onClick={onGoToProducts}
            style={{
              background: 'linear-gradient(135deg, #C89B6A, #A87747)',
              color: '#1B120C', fontWeight: 700, border: 'none',
              padding: '12px 20px', borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '0.92rem',
            }}
          >
            <Package size={18} />
            Manage Products
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Tab ───────────────────────────────────────── */
function ProfileTab({ adminUser }) {
  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>
          Admin Profile
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
          Your account details and session information
        </p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C89B6A, #A87747)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 800, color: '#1B120C',
          }}>
            {(adminUser?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>
              {adminUser?.fullName || 'Admin User'}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#6b7280', marginTop: '2px' }}>
              Administrator
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Full Name
            </div>
            <div style={{ fontSize: '0.95rem', color: '#111', fontWeight: 500, marginTop: '2px' }}>
              {adminUser?.fullName || '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email Address
            </div>
            <div style={{ fontSize: '0.95rem', color: '#111', fontWeight: 500, marginTop: '2px' }}>
              {adminUser?.email || '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Role
            </div>
            <div style={{ fontSize: '0.95rem', color: '#111', fontWeight: 500, marginTop: '2px' }}>
              Store Administrator
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Status
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>Active Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main AdminDashboardPage Component ─────────────────── */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [toasts, setToasts] = useState([]);

  const adminUser = getAdminUser();
  const storeUrl = import.meta.env.VITE_STORE_URL || 'https://al-rafa-roastery-afhyb7jjp-sufiya3.vercel.app';

  /* Toast helpers */
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

  /* Auth check */
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  /* Load data */
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
      const ok = await checkBackendStatus();
      setDbConnected(ok);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F8F9FB' }}>

      {/* ── SIDEBAR (Dark luxury theme) ────────────────────── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '72px',
        minWidth: sidebarOpen ? '240px' : '72px',
        transition: 'all 0.25s ease',
        background: 'linear-gradient(180deg, #1B120C 0%, #140D08 100%)',
        borderRight: '1px solid rgba(200,155,106,0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 20,
        overflow: 'hidden',
      }}>
        {/* Top: Logo + Brand */}
        <div>
          <div style={{
            padding: sidebarOpen ? '20px 20px 24px' : '20px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(200,155,106,0.15)',
          }}>
            <img
              src="/logo-circle.png"
              alt="Logo"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1px solid #C89B6A', flexShrink: 0,
              }}
            />
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 700,
                  fontSize: '0.9rem', color: '#F7F1E8', whiteSpace: 'nowrap',
                  letterSpacing: '0.05em',
                }}>
                  AL RAFA
                </div>
                <div style={{ fontSize: '0.72rem', color: '#C89B6A', fontWeight: 600 }}>
                  Admin Portal
                </div>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  title={!sidebarOpen ? label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: sidebarOpen ? '11px 14px' : '11px 0',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? 'linear-gradient(135deg, rgba(200,155,106,0.2), rgba(200,155,106,0.08))' : 'transparent',
                    color: active ? '#C89B6A' : 'rgba(247,241,232,0.6)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.88rem',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? 'inset 0 0 0 1px rgba(200,155,106,0.3)' : 'none',
                  }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {sidebarOpen && <span>{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Visit Shop + Logout */}
        <div style={{
          padding: sidebarOpen ? '16px 14px' : '16px 8px',
          borderTop: '1px solid rgba(200,155,106,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* Customer Store Link */}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={!sidebarOpen ? 'Visit Storefront' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: sidebarOpen ? '9px 12px' : '9px 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: '8px',
              color: 'rgba(247,241,232,0.5)',
              textDecoration: 'none',
              fontSize: '0.82rem',
              transition: 'color 0.2s',
            }}
          >
            <ExternalLink size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>View Storefront</span>}
          </a>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: sidebarOpen ? '9px 12px' : '9px 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: '8px',
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Sign Out</span>}
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
            {/* DB status badge */}
            {/* <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 10px', borderRadius: '8px',
              background: dbConnected ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${dbConnected ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              fontSize: '0.78rem',
              color: dbConnected ? '#4ade80' : '#f87171',
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: dbConnected ? '#22c55e' : '#ef4444',
              }} />
              <span>{dbConnected ? 'API Connected' : 'Connecting API...'}</span>
            </div> */}

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

        {/* ── CONTENT AREA ─────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#F8F9FB' }}>
          {activeTab === 'home' && (
            <HomeTab
              products={products}
              onGoToProducts={() => setActiveTab('products')}
            />
          )}
          {activeTab === 'products' && (
            <AdminDashboard
              products={products}
              onRefresh={loadData}
              onBackToShop={() => window.open(storeUrl, '_blank')}
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
