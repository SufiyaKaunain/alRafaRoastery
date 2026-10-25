import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../api';
import { Eye, EyeOff, Lock, Mail, User, Coffee, ArrowLeft, UserPlus } from 'lucide-react';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signupUser(fullName, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(61, 42, 29, 0.5) 0%, #1B120C 70%)',
      padding: '20px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-120px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(circle, rgba(200, 155, 106, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '440px',
        background: 'rgba(43, 29, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-gold)',
        borderRadius: '24px',
        padding: '48px 36px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Back to Shop */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem',
          marginBottom: '28px', transition: 'color 0.2s',
        }}>
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), #A87747)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(200, 155, 106, 0.3)',
          }}>
            <Coffee size={28} color="#1B120C" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700,
            color: 'var(--text-cream)', marginBottom: '6px',
          }}>
            Create Admin Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register to manage Al Rafa Roastery products
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171', fontSize: '0.88rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem',
              fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-faint)',
              }} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                style={{
                  width: '100%', padding: '13px 16px 13px 44px',
                  borderRadius: '12px', border: '1px solid var(--border-gold)',
                  backgroundColor: 'rgba(27, 18, 12, 0.7)',
                  color: 'var(--text-cream)', fontSize: '0.95rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem',
              fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-faint)',
              }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alrafa.com"
                style={{
                  width: '100%', padding: '13px 16px 13px 44px',
                  borderRadius: '12px', border: '1px solid var(--border-gold)',
                  backgroundColor: 'rgba(27, 18, 12, 0.7)',
                  color: 'var(--text-cream)', fontSize: '0.95rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem',
              fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-faint)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={{
                  width: '100%', padding: '13px 48px 13px 44px',
                  borderRadius: '12px', border: '1px solid var(--border-gold)',
                  backgroundColor: 'rgba(27, 18, 12, 0.7)',
                  color: 'var(--text-cream)', fontSize: '0.95rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-faint)', cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem',
              fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-faint)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                style={{
                  width: '100%', padding: '13px 16px 13px 44px',
                  borderRadius: '12px', border: '1px solid var(--border-gold)',
                  backgroundColor: 'rgba(27, 18, 12, 0.7)',
                  color: 'var(--text-cream)', fontSize: '0.95rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%', padding: '14px', fontSize: '1rem',
              marginTop: '8px', justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}>
          Already have an account?{' '}
          <Link to="/admin" style={{
            color: 'var(--accent-gold)', fontWeight: 700,
            textDecoration: 'none',
          }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
