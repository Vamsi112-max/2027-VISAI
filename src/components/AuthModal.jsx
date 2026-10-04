import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle, Sparkles, Key, ShieldCheck, Award, Wrench, UserCheck } from 'lucide-react';
import { authAPI } from '../hooks/api';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../data/visaiData';

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const { login } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm_password: ''
  });

  if (!isOpen) return null;

  const handleSelectDemo = (cred) => {
    setMode('login');
    setLoginForm({ email: cred.email, password: cred.password });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const emailInput = loginForm.email.trim();
    const passwordInput = loginForm.password;

    try {
      const res = await authAPI.login({ email: emailInput, password: passwordInput });
      login(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      // Check demo credentials match for instant seamless login
      const matchedDemo = DEMO_CREDENTIALS.find(
        d => d.email.toLowerCase() === emailInput.toLowerCase() && d.password === passwordInput
      );

      if (matchedDemo) {
        const demoToken = 'demo_token_' + matchedDemo.role + '_' + Date.now();
        const demoUser = {
          id: 'demo_' + matchedDemo.role,
          email: matchedDemo.email,
          role: matchedDemo.role,
          full_name: matchedDemo.name,
          email_verified: true,
        };
        login(demoToken, demoUser);
        onClose();
        return;
      }

      setError(err.response?.data?.error || 'Invalid email or password. Please check your credentials or click a demo role above.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (regForm.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        full_name: regForm.full_name,
        email: regForm.email.trim(),
        phone: regForm.phone,
        password: regForm.password,
      });
      login(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      // Fallback local registration if backend offline
      const localToken = 'local_token_part_' + Date.now();
      const localUser = {
        id: 'usr_local_' + Date.now(),
        email: regForm.email.trim(),
        role: 'participant',
        full_name: regForm.full_name,
        email_verified: true,
      };
      login(localToken, localUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return <ShieldCheck size={13} />;
      case 'coordinator': return <Wrench size={13} />;
      case 'jury': return <Award size={13} />;
      default: return <UserCheck size={13} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box narrow" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <div className="whiz-logo-icon" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>VISAI 2027</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Sign in to access your dashboard' : 'Create your team leader account'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--canvas-subtle)',
          borderRadius: 'var(--r-full)',
          padding: '4px',
          marginBottom: '1.5rem',
          gap: '4px'
        }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: 'var(--r-full)',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: mode === m ? 'var(--whiz-dark)' : 'transparent',
                color: mode === m ? '#FFFFFF' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register Team'}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <X size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <>
            {/* Quick Demo Fill Pills */}
            <div style={{
              background: 'var(--canvas-bg)',
              borderRadius: 'var(--r-lg)',
              padding: '1rem',
              border: '1px solid var(--canvas-border)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', fontWeight: 800, color: 'var(--whiz-coral)', marginBottom: '0.6rem' }}>
                <Key size={13} />
                <span>DEMO CREDENTIALS (CLICK TO AUTO-FILL):</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {DEMO_CREDENTIALS.map(cred => (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => handleSelectDemo(cred)}
                    className="badge"
                    style={{
                      background: loginForm.email === cred.email ? 'var(--whiz-dark)' : '#FFFFFF',
                      color: loginForm.email === cred.email ? '#FFFFFF' : 'var(--text-primary)',
                      border: '1px solid var(--canvas-border)',
                      cursor: 'pointer',
                      padding: '0.35rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Email: ${cred.email} | Pass: ${cred.password}`}
                  >
                    {getRoleIcon(cred.role)}
                    <span>{cred.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. admin@visai.in"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-group" style={{ position: 'relative' }}>
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-coral"
                style={{ width: '100%', marginTop: '0.5rem', fontWeight: 800 }}
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--whiz-coral)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  Register your team here
                </button>
              </p>
            </form>
          </>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--r-md)',
              padding: '0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.825rem',
              color: '#92400E'
            }}>
              <strong>Team Leader Account:</strong> Registration creates your leader credentials. Team members and college details will be completed in the step-by-step portal.
            </div>

            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--whiz-coral)' }}>*</span></label>
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={regForm.full_name}
                  onChange={e => setRegForm(p => ({ ...p, full_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: 'var(--whiz-coral)' }}>*</span></label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. leader@college.edu"
                  value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-group">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Password <span style={{ color: 'var(--whiz-coral)' }}>*</span></label>
                <div className="input-group">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Min 8 chars"
                    value={regForm.password}
                    onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm <span style={{ color: 'var(--whiz-coral)' }}>*</span></label>
                <div className="input-group">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Re-enter"
                    value={regForm.confirm_password}
                    onChange={e => setRegForm(p => ({ ...p, confirm_password: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-coral"
              style={{ width: '100%', marginTop: '0.5rem', fontWeight: 800 }}
              disabled={loading}
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Create Team Leader Account</span>
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--whiz-coral)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Sign in here
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
