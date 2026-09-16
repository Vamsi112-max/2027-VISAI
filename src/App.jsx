import React, { useState } from 'react';
import DraftDataTicker from './components/DraftDataTicker';
import CredentialsBanner from './components/CredentialsBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrackComparison from './components/TrackComparison';
import ProblemStatements from './components/ProblemStatements';
import SdgMatrix from './components/SdgMatrix';
import HackathonTimeline from './components/HackathonTimeline';
import SouvenirBook from './components/SouvenirBook';
import StallsExpo from './components/StallsExpo';
import AuthModal from './components/AuthModal';
import ParticipantDashboard from './components/ParticipantDashboard';
import AdminDashboard from './components/AdminDashboard';
import JuryDashboard from './components/JuryDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import Footer from './components/Footer';
import { DEMO_CREDENTIALS, SOUVENIR_ARTICLES, INITIAL_PROBLEM_STATEMENTS } from './data/visaiData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentRole, setCurrentRole] = useState(null); // null = public, or 'admin' | 'participant' | 'jury' | 'coordinator'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [additionalSouvenirArticles, setAdditionalSouvenirArticles] = useState([]);
  const [problemStatementsList, setProblemStatementsList] = useState(INITIAL_PROBLEM_STATEMENTS);
  const [siteContent, setSiteContent] = useState({
    hero: {
      title: 'Real Problems. Real Innovation. Real Impact.',
      description: 'Transforming conventional project exhibitions into a high-octane 36 / 48-Hour SDG & Industry Innovation Hackathon. Direct industry problem statements from Ashok Leyland, Renault Nissan, L&T Valves, and UN SDG targets with peer-reviewed publication in the official VISAI 2027 Innovation Souvenir.'
    },
    tracks: {
      title: 'Dual Release Track System',
      description: 'Choose your domain. Software teams build from scratch on-spot; Hardware teams get 7-10 days for component sourcing and architecture.'
    },
    sdgs: {
      title: 'UN SDG & Industry Mapped Matrix',
      description: 'Every problem statement is directly mapped to a United Nations Sustainable Development Goal and sponsored by a leading corporation.'
    },
    timeline: {
      title: 'Hackathon Operations Timeline',
      description: 'Strict 4-Gate internal evaluation system during the 36/48 hour hackathon.'
    },
    stalls: {
      title: 'Interactive Expo & Tech Stalls',
      description: 'Experience innovation hands-on. Explore leading tech demonstrations, food stalls, and interactive showcases.'
    }
  });

  // Handle direct role selection from Credentials banner
  const handleSelectRole = (role) => {
    setCurrentRole(role);
    setActiveTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishAbstractToSouvenir = (newArticle) => {
    setAdditionalSouvenirArticles(prev => [newArticle, ...prev]);
  };

  const handleAddProblemStatement = (newProb) => {
    setProblemStatementsList(prev => [newProb, ...prev]);
  };

  const handleBulkAddProblemStatements = (newProbs) => {
    setProblemStatementsList(prev => [...newProbs, ...prev]);
  };

  const handleTriggerSouvenirCompilation = () => {
    // simulated compilation action
    setActiveTab('souvenir');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSiteContent = (newContent) => {
    setSiteContent(newContent);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP FLOATING CREDENTIALS BANNER (Only in public view) */}
      {!currentRole && (
        <CredentialsBanner
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onResetToPublic={handleLogout}
        />
      )}

      {/* 2. STICKY PUBLIC NAVBAR (Only in public view - hidden after login as requested) */}
      {!currentRole && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          onLogout={handleLogout}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main style={{ flex: 1 }}>
        
        {/* If user is in a dedicated Role Portal View */}
        {activeTab === 'portal' && currentRole && (
          <div style={{ paddingBottom: '3rem', paddingTop: currentRole ? '1rem' : '1.5rem' }}>

            {currentRole === 'participant' && (
              <ParticipantDashboard 
                onPublishAbstractToSouvenir={handlePublishAbstractToSouvenir} 
                onLogout={handleLogout}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard 
                onAddProblemStatement={handleAddProblemStatement}
                onBulkAddProblemStatements={handleBulkAddProblemStatements}
                onTriggerSouvenirCompilation={handleTriggerSouvenirCompilation}
                heroContent={siteContent.hero}
                siteContent={siteContent}
                onUpdateSiteContent={handleUpdateSiteContent}
                onLogout={handleLogout}
              />
            )}

            {currentRole === 'jury' && (
              <JuryDashboard onLogout={handleLogout} />
            )}

            {currentRole === 'coordinator' && (
              <CoordinatorDashboard onLogout={handleLogout} />
            )}
          </div>
        )}

        {/* Standard Public & Event Navigation Views */}
        {activeTab !== 'portal' && (
          <>
            {activeTab === 'overview' && (
              <>
                <Hero
                  heroContent={siteContent.hero}
                  onExploreProblems={() => {
                    if (currentRole) setActiveTab('problems');
                    else setIsAuthModalOpen(true);
                  }}
                  onEnterPortal={() => {
                    if (currentRole) setActiveTab('portal');
                    else setIsAuthModalOpen(true);
                  }}
                  onOpenSouvenir={() => {
                    if (currentRole) setActiveTab('souvenir');
                    else setIsAuthModalOpen(true);
                  }}
                />
                <TrackComparison content={siteContent.tracks} />
                <ProblemStatements onSelectProblem={() => {
                  setCurrentRole('participant');
                  setActiveTab('portal');
                }} />
                <SdgMatrix content={siteContent.sdgs} onFilterBySdg={() => setActiveTab('problems')} />
                <HackathonTimeline content={siteContent.timeline} />
                {currentRole && currentRole !== 'participant' && (
                  <SouvenirBook additionalArticles={additionalSouvenirArticles} />
                )}
                <StallsExpo content={siteContent.stalls} />
              </>
            )}

            {activeTab === 'tracks' && (
              <div style={{ paddingTop: '2rem' }}>
                <TrackComparison content={siteContent.tracks} />
              </div>
            )}

            {activeTab === 'problems' && (
              <div style={{ paddingTop: '2rem' }}>
                <ProblemStatements onSelectProblem={() => {
                  setCurrentRole('participant');
                  setActiveTab('portal');
                }} />
              </div>
            )}

            {activeTab === 'sdgs' && (
              <div style={{ paddingTop: '2rem' }}>
                <SdgMatrix content={siteContent.sdgs} onFilterBySdg={() => setActiveTab('problems')} />
              </div>
            )}

            {activeTab === 'timeline' && (
              <div style={{ paddingTop: '2rem' }}>
                <HackathonTimeline content={siteContent.timeline} />
              </div>
            )}

            {activeTab === 'souvenir' && (
              <div style={{ paddingTop: '2rem' }}>
                {currentRole && currentRole !== 'participant' ? (
                  <SouvenirBook additionalArticles={additionalSouvenirArticles} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>Login Required</h3>
                    <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>You must be logged in to view the Innovation Souvenir.</p>
                    <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)}>Login to Access</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stalls' && (
              <div style={{ paddingTop: '2rem' }}>
                <StallsExpo content={siteContent.stalls} />
              </div>
            )}
          </>
        )}

      </main>

      {/* 4. FOOTER (Hidden when logged in) */}
      {!currentRole && (
        <Footer onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      )}
      {/* 5. AUTH MODAL WITH PREFILL CREDENTIALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setActiveTab('portal');
        }}
      />

    </div>
  );
}
