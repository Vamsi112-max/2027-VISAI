import React, { useState } from 'react';
import axios from 'axios';
import { DEMO_CREDENTIALS } from '../data/visaiData';
import { X, Key, ShieldCheck, UserCheck, Award, Wrench, Lock, Mail, ArrowRight, User, Phone } from 'lucide-react';

const roleIcons = {
  admin: ShieldCheck,
  participant: UserCheck,
  jury: Award,
  coordinator: Wrench
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = details, 2 = otp verification (for register)
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handlePreFill = (cred) => {
    setIsLogin(true);
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // For demo fast-login fallback
      const matched = DEMO_CREDENTIALS.find(
        c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );
      if (matched) {
        onLoginSuccess(matched.role);
        onClose();
        return;
      }
      
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess(res.data.role);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/request-otp', { email });
      setSuccessMsg(`OTP Sent (Dev: 123456)`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, phone, password, otp });
      setSuccessMsg('Registration successful! Please login.');
      setIsLogin(true);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Key size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                VISAI 2027 Portal
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {isLogin ? 'Login to access your dashboard' : 'Register for VISAI 2027'}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Form Toggle */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }} className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>Login</button>
          <button onClick={() => { setIsLogin(false); setStep(1); setError(''); setSuccessMsg(''); }} className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>Register</button>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {successMsg && <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMsg}</div>}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="form-input" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="form-input" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <span>Login</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Login */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Demo Accounts (1-Click Login):</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {DEMO_CREDENTIALS.map(cred => (
                  <div key={cred.role} onClick={() => handlePreFill(cred)} style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cred.color }}></div>
                    {cred.badge}
                  </div>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={step === 1 ? handleRequestOtp : handleRegisterSubmit}>
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="form-input" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="form-input" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone" className="form-input" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" className="form-input" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  <span>Request OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Development OTP</label>
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 123456" className="form-input" />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>* Use 123456 for development testing.</p>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  <span>Verify & Register</span>
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
