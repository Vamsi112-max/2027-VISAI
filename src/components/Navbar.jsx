import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  BookOpen, 
  Code2, 
  Cpu, 
  LogOut, 
  User, 
  ShieldCheck, 
  Award, 
  Wrench, 
  ExternalLink 
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '../data/visaiData';

export default function Navbar({ activeTab, setActiveTab, currentRole, onLogout, onOpenAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const currentCred = DEMO_CREDENTIALS.find(c => c.role === currentRole);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Hackathon Timeline' },
    { id: 'tracks', label: 'Tracks (SW & HW)' },
    { id: 'problems', label: 'Problem Statements' },
    { id: 'sdgs', label: 'SDG Matrix' },
    { id: 'stalls', label: 'Expo & Stalls' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: '0.75rem',
      zIndex: 50,
      padding: '0 1.25rem',
      pointerEvents: 'none'
    }}>
      <div style={{ 
        maxWidth: '1240px', 
        margin: '0 auto',
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '9999px',
        boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.4rem 1rem',
        pointerEvents: 'auto',
        position: 'relative'
      }}>
        
        {/* Brand & Logo matching screenshot */}
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: '0.5rem' }} 
          onClick={() => setActiveTab('overview')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src="/visai-logo.png" 
              alt="VISAI" 
              style={{ 
                height: '38px', 
                objectFit: 'contain'
              }} 
            />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#0f172a',
              marginTop: '-3px'
            }}>
              2027
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.35rem' }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? '#e0edff' : 'transparent',
                  border: 'none',
                  color: isActive ? '#2563eb' : '#334155',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: isActive ? '0.45rem 1.15rem' : '0.45rem 0.85rem',
                  borderRadius: '9999px',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '0.01em'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Role & Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.35rem' }}>
          {currentRole ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '9999px' }}>
              <button
                onClick={() => setActiveTab('portal')}
                className="btn btn-sm"
                style={{
                  background: currentCred?.color || '#1e3a8a',
                  color: '#fff',
                  boxShadow: `0 2px 10px ${currentCred?.color || '#1e3a8a'}55`,
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.45rem 1.1rem',
                  fontWeight: 700
                }}
              >
                <User size={14} />
                <span>{currentCred?.badge || 'My Portal'}</span>
              </button>

              <button
                onClick={onLogout}
                className="btn btn-sm btn-secondary"
                title="Log out back to public view"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{ 
                background: '#1e3a8a', 
                color: '#ffffff', 
                borderRadius: '9999px', 
                padding: '0.55rem 1.35rem', 
                fontWeight: 700, 
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#172554'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a8a'}
            >
              Portal Login
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.5rem',
              borderRadius: '50%'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          marginTop: '1rem',
          padding: '1.25rem',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
          pointerEvents: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: activeTab === item.id ? '#eff6ff' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: activeTab === item.id ? '#2563eb' : '#475569',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {item.label}
                </button>
                {/* Mobile SubItems Display */}
                {item.subItems && (
                  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem', marginTop: '0.25rem', borderLeft: '2px solid #e2e8f0', marginLeft: '1rem' }}>
                    {item.subItems.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(sub.id);
                          setMobileMenuOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          padding: '0.5rem',
                          color: '#64748b',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
              {!currentRole && (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '12px', padding: '0.85rem' }}
                >
                  Sign In / Role Switcher
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
