import React, { useState } from 'react';
import { Menu, X, LogOut, ChevronDown, User, Sparkles, Image, Users, GitFork, BookOpen, Clock, HelpCircle, Trophy, Edit3, Palette, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import { VISAI_CONFIG, NAV_LINKS } from '../data/visaiData';
import InlineEditBox from './admin/InlineEditBox';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout } = useAuth();
  const { content, isVisualEditMode, startVisualEdit } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setActiveTab('home');
  };

  const roleLabel = {
    participant: 'Participant',
    jury: 'Jury Member',
    coordinator: 'Coordinator',
    super_admin: 'Super Admin',
  };

  const roleBadgeClass = {
    participant: 'badge-sky',
    jury: 'badge-lavender',
    coordinator: 'badge-mint',
    super_admin: 'badge-peach',
  };

  const getNavIcon = (id) => {
    switch (id) {
      case 'problems': return <BookOpen size={15} />;
      case 'gallery': return <Image size={15} />;
      case 'teams': return <GitFork size={15} />;
      case 'timeline': return <Clock size={15} />;
      case 'rules': return <HelpCircle size={15} />;
      case 'results': return <Trophy size={15} />;
      default: return <FileText size={15} />;
    }
  };

  // Merge default nav links with custom pages created by Admin
  const customPages = content?.customPages || [];
  const customNavLinks = customPages.map(p => ({
    id: `custom-${p.id}`,
    label: p.navLabel,
    badge: 'New',
    isCustom: true,
    pageData: p,
  }));

  const allNavLinks = [...NAV_LINKS, ...customNavLinks];

  return (
    <nav className="whiz-navbar">
      <div className="container-wide">
        <div className="whiz-nav-inner">
          {/* Logo */}
          <button
            className="whiz-logo"
            onClick={() => {
              if (user && (user.role === 'coordinator' || user.role === 'jury')) {
                setActiveTab('dashboard');
              } else {
                setActiveTab('home');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="whiz-logo-icon">
              <Sparkles size={20} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                VISAI<span style={{ color: 'var(--whiz-coral)' }}>.27</span>
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {user?.role === 'jury' ? '⚖️ Jury Portal' : user?.role === 'coordinator' ? '📋 Coordinator Portal' : (content?.themeSettings?.institutionName || 'Vel Tech R&D')}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links in pill container for participants & public visitors */}
          {(!user || user.role === 'participant') && (
            <div className="whiz-nav-links">
              {allNavLinks.map(link => (
                <button
                  key={link.id}
                  className={`whiz-nav-link ${activeTab === link.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  {getNavIcon(link.id)}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span style={{
                      background: 'var(--whiz-coral)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--r-full)',
                      fontWeight: 800,
                      marginLeft: '0.2rem'
                    }}>
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Role specific header badges in center for Jury */}
          {user?.role === 'jury' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#F5F3FF', padding: '0.45rem 1.15rem', borderRadius: 'var(--r-full)', border: '1px solid #DDD6FE' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6D28D9', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⚖️ Evaluation Workspace
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '0.15rem 0.6rem', borderRadius: 'var(--r-full)' }}>
                Double-Blind Scoring
              </span>
            </div>
          )}

          {/* Role specific header badges in center for Coordinator */}
          {user?.role === 'coordinator' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ECFDF5', padding: '0.45rem 1.15rem', borderRadius: 'var(--r-full)', border: '1px solid #A7F3D0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📋 Coordinator Operations
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#D1FAE5', padding: '0.15rem 0.6rem', borderRadius: 'var(--r-full)' }}>
                Track & Desk Workspace
              </span>
            </div>
          )}

          {/* User / Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Quick Admin Visual Editor Button for logged-in Admins Only */}
            {user && (user.role === 'super_admin' || user.role === 'admin') && !isVisualEditMode && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  setActiveTab('home');
                  startVisualEdit();
                }}
                style={{
                  background: 'linear-gradient(135deg, #FF5A36, #FF8A00)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--r-full)',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-coral)',
                  cursor: 'pointer',
                }}
                title="Launch Wix-Style Live Visual Page Editor"
              >
                <Edit3 size={14} />
                <span>Admin Visual Edit</span>
              </button>
            )}

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.45rem 0.9rem', borderRadius: 'var(--r-full)',
                    background: '#FFFFFF', border: '1px solid var(--canvas-border-strong)',
                    cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF5A36, #FFA000)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.8rem', fontWeight: 800,
                  }}>
                    {(user.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown size={15} color="var(--text-muted)" />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', border: '1px solid var(--canvas-border)', borderRadius: 'var(--r-xl)',
                    boxShadow: 'var(--shadow-xl)', minWidth: 220, zIndex: 200,
                    overflow: 'hidden', animation: 'fadeIn 0.15s ease-out',
                  }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--canvas-border)', background: 'var(--canvas-subtle)' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {user.full_name || 'Innovator'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        {user.email}
                      </div>
                      <span className={`badge ${roleBadgeClass[user.role] || 'badge-sky'}`}>
                        {roleLabel[user.role] || user.role}
                      </span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <button
                        onClick={() => { setActiveTab('dashboard'); setUserMenuOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%',
                          padding: '0.7rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                          borderRadius: 'var(--r-sm)',
                        }}
                      >
                        <User size={16} color="var(--whiz-coral)" /> Go to Dashboard
                      </button>

                      {user && (user.role === 'super_admin' || user.role === 'admin') && (
                        <button
                          onClick={() => {
                            setActiveTab('home');
                            setUserMenuOpen(false);
                            startVisualEdit();
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%',
                            padding: '0.7rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.875rem', fontWeight: 700, color: 'var(--whiz-coral)',
                            borderRadius: 'var(--r-sm)',
                          }}
                        >
                          <Edit3 size={16} /> Live Visual Page Builder
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%',
                          padding: '0.7rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.875rem', fontWeight: 600, color: '#EF4444',
                          borderRadius: 'var(--r-sm)',
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={onOpenAuth}
                  style={{ fontWeight: 700 }}
                >
                  Log In
                </button>
                <button
                  className="btn btn-coral btn-sm"
                  onClick={onOpenAuth}
                  style={{ fontWeight: 800 }}
                >
                  Register Now
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              className="btn btn-ghost btn-sm mobile-hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            background: '#FFFFFF',
            borderRadius: 'var(--r-xl)',
            border: '1px solid var(--canvas-border)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {user && (user.role === 'coordinator' || user.role === 'jury') ? (
              <>
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-md)',
                    background: user.role === 'jury' ? '#7C3AED' : 'var(--whiz-coral)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <User size={16} />
                  <span>{user.role === 'jury' ? '⚖️ Jury Evaluation Portal' : '📋 Coordinator Operations'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-md)',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              allNavLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-md)',
                    background: activeTab === link.id ? 'var(--whiz-dark)' : 'transparent',
                    color: activeTab === link.id ? '#FFFFFF' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {getNavIcon(link.id)}
                    {link.label}
                  </span>
                  {link.badge && (
                    <span style={{
                      background: 'var(--whiz-coral)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--r-full)'
                    }}>
                      {link.badge}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .mobile-hamburger-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
