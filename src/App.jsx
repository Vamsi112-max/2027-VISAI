import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PastHighlightsBento from './components/public/PastHighlightsBento';
import ThreeStepsBento from './components/public/ThreeStepsBento';
import TracksSection from './components/public/TracksSection';
import GalleryPage from './components/public/GalleryPage';
import TeamAndTreePage from './components/public/TeamAndTreePage';
import SocialLinksHub from './components/public/SocialLinksHub';
import Sdg8ThemesSection from './components/public/Sdg8ThemesSection';
import SponsorsSection from './components/public/SponsorsSection';
import BottomCtaBanner from './components/public/BottomCtaBanner';
import ProblemsPage from './components/public/ProblemsPage';
import PrizePoolSection from './components/public/PrizePoolSection';
import LiveRegistrationHud from './components/public/LiveRegistrationHud';
import BackToTopWidget from './components/public/BackToTopWidget';
import CustomBlocksRenderer from './components/public/CustomBlocksRenderer';
import CustomDynamicPage from './components/public/CustomDynamicPage';
import FormatsModal from './components/public/FormatsModal';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ParticipantDashboard from './components/ParticipantDashboard';
import AdminDashboard from './components/AdminDashboard';
import JuryDashboard from './components/JuryDashboard';
import LiveVisualEditorToolbar from './components/admin/LiveVisualEditorToolbar';
import EditFieldModal from './components/admin/EditFieldModal';
import AddBlockModal from './components/admin/AddBlockModal';
import AddPageModal from './components/admin/AddPageModal';
import ThemeAdjusterModal from './components/admin/ThemeAdjusterModal';
import ReviewChangesModal from './components/admin/ReviewChangesModal';
import { resultsAPI } from './hooks/api';
import { TIMELINE_EVENTS, FAQS, VISAI_CONFIG } from './data/visaiData';
import { ChevronDown, Clock, CheckCircle, HelpCircle, Trophy, Sparkles, MapPin, Building, Globe, Award, ShieldCheck, Download, Search } from 'lucide-react';

// =====================================================
// PUBLIC SUB-PAGES (WhizKid Pastel Bento Style)
// =====================================================

function TimelinePage() {
  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '80vh' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: '#FFFFFF',
            border: '1px solid var(--canvas-border)',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '1rem'
          }}>
            <Clock size={15} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Important Deadlines & Milestones
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Event Schedule & Milestones
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Key deadlines, online abstract submission reviews, and the grand 36-hour on-site hackathon timeline.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {TIMELINE_EVENTS.map((event, i) => {
            const isCompleted = event.status === 'completed';
            return (
              <div
                key={i}
                className={`bento-card ${isCompleted ? 'card-pastel-lime' : 'card-pastel-lavender'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem 1.75rem',
                  background: '#FFFFFF'
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--r-lg)',
                  background: isCompleted ? '#F6FBD4' : '#ECE6FA',
                  color: isCompleted ? '#4F610D' : '#482C9E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 900,
                  fontSize: '1.1rem'
                }}>
                  {event.badge || `0${i + 1}`}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                      {event.phase}
                    </h3>
                    <span className={`badge ${isCompleted ? 'badge-lime' : 'badge-lavender'}`}>
                      {event.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0, lineHeight: 1.5 }}>
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQPage() {
  const [open, setOpen] = useState(null);
  const [selectedCat, setSelectedCat] = useState('all');
  const [faqSearch, setFaqSearch] = useState('');

  const categories = ['all', 'Eligibility', 'Teams', 'Payment', 'Submissions', 'Venue & Hardware', 'Evaluation'];

  const filteredFaqs = FAQS.filter(f => {
    const matchCat = selectedCat === 'all' || f.category === selectedCat;
    const matchSearch = !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '80vh' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: 'var(--pastel-peach-bg)',
            border: '1px solid rgba(255, 90, 54, 0.25)',
            marginBottom: '1rem'
          }}>
            <HelpCircle size={15} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>
              Rules & Common Inquiries
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Find clear answers regarding team criteria, PPT submission formats, hardware lab facilities, and jury scoring.
          </p>
        </div>

        {/* Search FAQ */}
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto 2rem' }}>
          <input
            className="form-input"
            placeholder="Search rules, guidelines, eligibility..."
            value={faqSearch}
            onChange={e => setFaqSearch(e.target.value)}
            style={{ paddingLeft: '2.8rem', width: '100%', borderRadius: 'var(--r-full)', background: '#FFFFFF' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
              style={{ textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.length === 0 ? (
            <div className="bento-card" style={{ textAlign: 'center', padding: '2.5rem', background: '#FFFFFF' }}>
              <p style={{ color: 'var(--text-muted)' }}>No questions found matching "{faqSearch}".</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="bento-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: open === i ? '1.5px solid var(--whiz-coral)' : '1px solid var(--canvas-border)'
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '1rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: open === i ? 'var(--whiz-coral-light)' : 'var(--canvas-subtle)',
                      color: open === i ? 'var(--whiz-coral)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <HelpCircle size={16} />
                    </div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--whiz-dark)', fontFamily: 'var(--font-sans)' }}>
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      color: 'var(--text-muted)',
                      transition: 'transform 0.25s ease',
                      transform: open === i ? 'rotate(180deg)' : 'none',
                      flexShrink: 0
                    }}
                  />
                </button>
                
                {open === i && (
                  <div style={{
                    padding: '0 1.5rem 1.35rem 3.75rem',
                    fontSize: '0.925rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    borderTop: '1px solid var(--canvas-border)',
                    paddingTop: '1rem'
                  }}>
                    {faq.a}
                    {faq.category && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                          Category: {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ResultsPage() {
  const [results, setResults] = useState(null);
  useEffect(() => {
    resultsAPI.list().then(r => setResults(r.data.results || [])).catch(() => setResults([]));
  }, []);

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: '#FFFFFF',
            border: '1px solid var(--canvas-border)',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '1rem'
          }}>
            <Trophy size={15} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              National Innovation Leaderboard
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Official Competition Results
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Verified jury evaluation scores, track winners, and national award recipients for VISAI 2027.
          </p>
        </div>

        {results === null ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{
              width: 40, height: 40, border: '3px solid #FFE0D6', borderTopColor: 'var(--whiz-coral)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
            }} />
            <p>Loading official results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bento-card" style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'var(--whiz-coral-light)', color: 'var(--whiz-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Trophy size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
              Results Not Yet Published
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              The VISAI 2027 jury evaluation is scheduled during the grand on-site project expo. Official verified ranks, certificates, and prize distribution details will appear right here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 840, margin: '0 auto' }}>
            {results.map((r, i) => (
              <div key={i} className="bento-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF' }}>
                {r.rank && (
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: i === 0 ? '#FFF8E1' : i === 1 ? '#F3F4F6' : '#FFF3E0',
                    border: '2px solid',
                    borderColor: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : '#CD7C0A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', fontWeight: 900,
                    color: i === 0 ? '#D97706' : i === 1 ? '#6B7280' : '#92400E',
                    flexShrink: 0
                  }}>
                    {r.rank}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{r.team_name}</span>
                    {r.award && <span className="badge badge-peach">{r.award}</span>}
                    <span className={`badge ${r.status === 'selected' ? 'badge-lime' : 'badge-dark'}`}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {r.college_name && <span>🏫 {r.college_name}</span>}
                    {r.ps_code && <span>📌 {r.ps_code}</span>}
                    {r.round_name && <span>🎯 Round: {r.round_name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =====================================================
// APP SHELL
// =====================================================

function AppShell() {
  const { user, logout, loading } = useAuth();
  const { content, isVisualEditMode } = useSiteContent();
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [formatsModalOpen, setFormatsModalOpen] = useState(false);

  // Global dashboard navigation listener
  useEffect(() => {
    const handle = () => setActiveTab('dashboard');
    window.addEventListener('visai:goto-dashboard', handle);
    return () => window.removeEventListener('visai:goto-dashboard', handle);
  }, []);

  // Global switch to home view for visual edit mode
  useEffect(() => {
    const handleEdit = () => {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('visai:goto-home-edit', handleEdit);
    return () => window.removeEventListener('visai:goto-home-edit', handleEdit);
  }, []);

  const isAdmin = user && (user.role === 'super_admin' || user.role === 'admin');
  const isCoordinator = user && user.role === 'coordinator';
  const isJury = user && user.role === 'jury';

  // Auto route to role-appropriate dashboard on login
  useEffect(() => {
    if (user && activeTab === 'home') {
      if (user.role === 'participant' || user.role === 'coordinator' || user.role === 'jury') {
        setActiveTab('dashboard');
      }
    }
  }, [user, activeTab]);

  // Apply custom dynamic theme variables (border-radius curves)
  useEffect(() => {
    if (content?.themeSettings?.borderRadius) {
      const radius = content.themeSettings.borderRadius;
      document.documentElement.style.setProperty('--r-2xl', radius === '9999px' ? '32px' : radius);
    }
  }, [content?.themeSettings?.borderRadius]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--canvas-bg)' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #FFE0D6', borderTopColor: 'var(--whiz-coral)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700 }}>Loading VISAI 2027...</p>
      </div>
    );
  }

  // Dashboard Role Routing
  if (user && activeTab === 'dashboard') {
    const handleLogout = () => {
      logout();
      setActiveTab('home');
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--canvas-bg)' }}>
        {isAdmin && <LiveVisualEditorToolbar />}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenAuth={() => setAuthModalOpen(true)} />
        {user.role === 'super_admin' && <AdminDashboard onLogout={handleLogout} />}
        {user.role === 'coordinator' && <AdminDashboard onLogout={handleLogout} />}
        {user.role === 'jury' && <JuryDashboard onLogout={handleLogout} />}
        {user.role === 'participant' && <ParticipantDashboard onLogout={handleLogout} />}
        
        {/* Visual Builder Modals (Super Admin Only) */}
        {isAdmin && (
          <>
            <EditFieldModal />
            <AddBlockModal />
            <AddPageModal />
            <ThemeAdjusterModal />
            <ReviewChangesModal />
          </>
        )}
      </div>
    );
  }

  // Check if custom page is active
  const customPages = content?.customPages || [];
  const currentCustomPage = customPages.find(p => `custom-${p.id}` === activeTab || p.slug === activeTab);

  // Public Web Pages Routing
  const renderPage = () => {
    // Strict isolation for Jury and Coordinator:
    // They must only see their evaluation/operations console, never the public marketing sections
    if (isJury) {
      return <JuryDashboard onLogout={() => { logout(); setActiveTab('home'); }} />;
    }
    if (isCoordinator) {
      return <AdminDashboard onLogout={() => { logout(); setActiveTab('home'); }} />;
    }

    if (currentCustomPage) {
      return <CustomDynamicPage page={currentCustomPage} onNavigateHome={() => setActiveTab('home')} />;
    }

    switch (activeTab) {
      case 'sdgs':
        return <Sdg8ThemesSection onExploreProblems={() => setActiveTab('problems')} />;
      case 'sponsors':
        return <SponsorsSection />;
      case 'problems':
        return <ProblemsPage onRegister={() => setAuthModalOpen(true)} />;
      case 'gallery':
        return <GalleryPage />;
      case 'teams':
        return <TeamAndTreePage />;
      case 'timeline':
        return <TimelinePage />;
      case 'rules':
        return <FAQPage />;
      case 'results':
        return <ResultsPage />;
      case 'dashboard':
        return user ? (
          <div>
            <ParticipantDashboard onLogout={() => { logout(); setActiveTab('home'); }} />
          </div>
        ) : null;
      default:
        return (
          <>
            {/* Sliding Windows Hero Showcase */}
            <Hero
              onRegister={() => setAuthModalOpen(true)}
              onExploreProblems={() => setActiveTab('problems')}
              onExploreGallery={() => setActiveTab('gallery')}
            />

            {/* Custom Blocks: Placed right after Hero */}
            <CustomBlocksRenderer position="after-hero" />

            {/* 8 UN Sustainable Development Goals Grid */}
            <Sdg8ThemesSection
              onExploreProblems={() => setActiveTab('problems')}
            />

            {/* Custom Blocks: Placed right after SDG Themes */}
            <CustomBlocksRenderer position="after-sdg" />

            {/* Innovation in 3 Simple Steps! */}
            <ThreeStepsBento
              onRegister={() => setAuthModalOpen(true)}
              onExploreProblems={() => setActiveTab('problems')}
            />

            {/* Custom Blocks: Placed right after Steps */}
            <CustomBlocksRenderer position="after-steps" />

            {/* ₹5,00,000+ Prize Pool & Innovation Grants */}
            <PrizePoolSection
              onOpenRegister={() => setAuthModalOpen(true)}
            />

            {/* Official Sponsors & Knowledge Partners */}
            <SponsorsSection />

            {/* Social Redirection Channels & Developer Hub */}
            <SocialLinksHub />

            {/* Custom Blocks: Placed before Footer CTA */}
            <CustomBlocksRenderer position="before-footer" />

            {/* Ready to Ignite Innovation CTA Banner */}
            <BottomCtaBanner
              onRegister={() => setAuthModalOpen(true)}
            />
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--canvas-bg)' }}>
      {/* Live Visual Editor Top Dock (Strictly Admins Only) */}
      {isAdmin && <LiveVisualEditorToolbar />}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenAuth={() => setAuthModalOpen(true)} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {/* Real-Time Live Registration Notification HUD */}
      {!user && activeTab === 'home' && (
        <LiveRegistrationHud onOpenRegister={() => setAuthModalOpen(true)} />
      )}

      {/* Floating Back to Top Button */}
      <BackToTopWidget />

      {/* Hide marketing footer for Coordinator & Jury portals */}
      {!isJury && !isCoordinator && (
        <Footer onOpenAuth={() => setAuthModalOpen(true)} onNavigate={setActiveTab} onOpenFormats={() => setFormatsModalOpen(true)} />
      )}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <FormatsModal isOpen={formatsModalOpen} onClose={() => setFormatsModalOpen(false)} />

      {/* Visual Builder Modals (Strictly Admins Only) */}
      {isAdmin && (
        <>
          <EditFieldModal />
          <AddBlockModal />
          <AddPageModal />
          <ThemeAdjusterModal />
          <ReviewChangesModal />
        </>
      )}
    </div>
  );
}

// =====================================================
// ROOT APP
// =====================================================

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <AppShell />
      </SiteContentProvider>
    </AuthProvider>
  );
}
