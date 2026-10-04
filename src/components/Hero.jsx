import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Sparkles, Users, Award, Play,
  ChevronRight, ChevronLeft, Globe, Layers,
  CheckCircle2, Cpu, Trophy, Zap, ShieldCheck,
  Image as ImageIcon, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import InlineEditBox from './admin/InlineEditBox';

export default function Hero({ onRegister, onExploreProblems, onExploreGallery }) {
  const { user } = useAuth();
  const { content, isVisualEditMode } = useSiteContent();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const heroData = content?.hero || {};
  const slides = (heroData.slides && heroData.slides.length > 0) ? heroData.slides : [
    {
      id: 'slide-mentors',
      theme: 'yellow',
      title: 'Young Innovators,',
      highlight: 'Big Breakthroughs! ✨',
      description: 'Every edition is a transformative journey in our Innovation Arena, MakerSpaces & Cloud AI Labs.',
      badgeText: '40+ Mentors & Industry Jury',
      badgeSub: 'From Google, Bosch, Microsoft & IEEE',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      ],
      photoSrc: '/images/gallery/hero_hackathon.jpg',
      photoBadge: 'VISAI Action Arena',
      photoTitle: '36-Hour Prototype Sprint',
      photoSub: 'IoT • Edge AI • Hardware Testing',
      ctaPills: ['SDG 1–17', 'Robotics', 'Industry 5.0'],
      ctaText: 'We believe every student engineer has the potential to engineer solutions that change lives.',
      ctaButton: 'Getting Started',
    },
    {
      id: 'slide-arena',
      theme: 'lime',
      title: '36 Hours Non-Stop,',
      highlight: 'Live Hardware & Code! ⚡',
      description: 'Student innovators assembling circuits, microcontrollers and training real-time AI models on site.',
      badgeText: 'National Innovator Arena',
      badgeSub: 'Across 350+ Colleges Nationwide',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
      ],
      photoSrc: '/images/gallery/grand_stage.jpg',
      photoBadge: 'Grand Finale Auditorium',
      photoTitle: 'National Valedictory Stage',
      photoSub: '₹5,00,000 Cash Pool • TBI Grants',
      ctaPills: ['Cash Prizes', 'Patent Filing', 'TBI Incubation'],
      ctaText: 'Top prototypes receive direct seed funding and incubation support through Vel Tech Technology Business Incubator.',
      ctaButton: 'View Past Winners',
    },
    {
      id: 'slide-robotics',
      theme: 'peach',
      title: 'Hardware & MakerSpace,',
      highlight: 'Robotics Obstacle Arena! 🤖',
      description: 'High-speed testing tracks for LiDAR rovers, surveillance drones, and sub-sea marine robotic prototypes.',
      badgeText: 'Vel Tech MakerSpace Lab 4',
      badgeSub: '3D Printers • Oscilloscopes • SMD Benches',
      avatars: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      ],
      photoSrc: '/images/gallery/robotics_demo.jpg',
      photoBadge: 'Robotics Arena 2026',
      photoTitle: 'Hardware Prototype Track',
      photoSub: 'Autonomous Rovers • Microcontroller Nodes',
      ctaPills: ['Hardware', 'IoT Telemetry', 'TinyML'],
      ctaText: 'Test your physical embedded prototypes in real-time with comprehensive sensor benches and 24/7 technical mentors.',
      ctaButton: 'Explore Hardware PS',
    },
    {
      id: 'slide-jury',
      theme: 'lavender',
      title: 'Double-Blind Review,',
      highlight: 'Industry Jury Evaluations! ⚖️',
      description: 'Senior tech leads from Nicola Foundation, IEEE, CREDAI & Microsoft evaluate scalability and societal impact.',
      badgeText: '32 Domain Specialists',
      badgeSub: 'Clean Energy • Smart Cities • Health AI',
      avatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      ],
      photoSrc: '/images/gallery/jury_pitching.jpg',
      photoBadge: 'Evaluation Hub',
      photoTitle: 'Industry Live Pitching',
      photoSub: 'Stall Demos • Code & Circuit Inspection',
      ctaPills: ['5-Slide PPT', 'Repo Review', 'Live Pitch'],
      ctaText: 'Showcase your prototype directly to executive evaluators and industry heads with guaranteed feedback scorecards.',
      ctaButton: 'View Rules & Rubric',
    },
  ];

  // Auto-Slide Timer (every 4.5 seconds when not hovered and not editing)
  useEffect(() => {
    if (isPaused || isVisualEditMode) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, isVisualEditMode, slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
  const nextIdx = (currentSlide + 1) % slides.length;

  const activeSlide = slides[currentSlide] || slides[0];
  const prevSlideData = slides[prevIdx] || slides[0];
  const nextSlideData = slides[nextIdx] || slides[0];

  // Touch Swipe Handlers for Mobile Sliding
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    touchStartX.current = null;
  };

  return (
    <section className="whiz-hero-wrapper" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '3rem' }}>
      <div className="container-wide" style={{ position: 'relative' }}>
        
        {/* Top Header Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: 920, margin: '0 auto 2.5rem' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: '#FFFFFF',
            border: '1px solid var(--canvas-border)',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '1.25rem'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--whiz-coral)',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              <InlineEditBox fieldPath="hero.badge" fieldLabel="Hero Badge" value={heroData.badge || 'VISAI 2027 • 17th International SDG Hackathon'} />
            </span>
          </div>

          <h1 className="hero-main-title">
            <InlineEditBox as="span" fieldPath="hero.titleLine1" fieldLabel="Hero Title Line 1" value={heroData.titleLine1 || 'Innovate, Build, Transform:'} />
            <br />
            <span style={{
              color: 'var(--whiz-dark)',
              display: 'inline-block',
            }}>
              <InlineEditBox as="span" fieldPath="hero.titleLine2Gradient" fieldLabel="Hero Title Gradient" value={heroData.titleLine2Gradient || 'Bright Futures'} />
            </span>{' '}
            <span style={{
              color: 'var(--whiz-coral)',
              display: 'inline-block',
              position: 'relative'
            }}>
              <InlineEditBox as="span" fieldPath="hero.titleLine2Accent" fieldLabel="Hero Title Accent" value={heroData.titleLine2Accent || 'Begin Here.'} />
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 760,
            margin: '0 auto',
            fontWeight: 500
          }}>
            <InlineEditBox fieldPath="hero.subtitle" fieldLabel="Hero Subtitle" value={heroData.subtitle || '17 UN SDG Tracks • 36-Hour National Prototype Sprint • ₹5,00,000+ Prize Pool • Organized by Vel Tech R&D Institute'} />
          </p>
        </div>

        {/* =========================================================================
            MULTI-LAYER 3D SLIDING WINDOWS SHOWCASE (Center Stage + Left/Right Depth Cards)
           ========================================================================= */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            perspective: '1400px',
          }}
        >
          {/* Outer Sliding Carousel Track Container */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              position: 'relative',
              width: '100%',
            }}
          >

            {/* =====================================================
                FAR LEFT BACKGROUND PEEKING SLIDING WINDOW CARD
               ===================================================== */}
            <div
              onClick={prevSlide}
              className={`sliding-window-bg-card sliding-window-left card-pastel-${prevSlideData.theme}`}
              title="Click to view previous slide window"
              style={{
                width: '260px',
                height: '410px',
                borderRadius: 'var(--r-2xl)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0,
                opacity: 0.55,
                transform: 'rotateY(18deg) scale(0.88) translateZ(-60px)',
                cursor: 'pointer',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {/* Peek Label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-dark" style={{ fontSize: '0.68rem', opacity: 0.9 }}>
                  ◀ Previous
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                  {prevSlideData.badgeText?.slice(0, 18)}...
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.25rem' }}>
                  {prevSlideData.title}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>
                  {prevSlideData.highlight}
                </div>
              </div>

              {/* Mini Preview Thumbnail */}
              <div style={{ height: 130, borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={prevSlideData.photoSrc}
                  alt={prevSlideData.photoTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex', alignItems: 'flex-end', padding: '0.5rem'
                }}>
                  <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                    {prevSlideData.photoTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================================
                CENTER ACTIVE 3-CARD BENTO SLIDING WINDOW
               ===================================================== */}
            <div
              style={{
                flex: '1 1 1100px',
                maxWidth: '1100px',
                display: 'grid',
                gridTemplateColumns: 'minmax(270px, 1fr) minmax(360px, 1.4fr) minmax(270px, 1fr)',
                gap: '1.25rem',
                alignItems: 'stretch',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
              }}
              className="hero-bento-grid"
            >
              
              {/* Left Card: Mentors & Innovation Network */}
              <div
                className={`bento-card card-pastel-${activeSlide.theme}`}
                style={{
                  padding: '1.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  minHeight: '430px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  animation: 'fadeIn 0.35s ease-out'
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      <InlineEditBox
                        fieldPath={`hero.slides.${currentSlide}.title`}
                        fieldLabel={`Slide ${currentSlide + 1} Title`}
                        value={activeSlide.title}
                      />
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.5rem' }}>
                    <InlineEditBox
                      fieldPath={`hero.slides.${currentSlide}.highlight`}
                      fieldLabel={`Slide ${currentSlide + 1} Highlight`}
                      value={activeSlide.highlight}
                    />
                  </h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.55, opacity: 0.9 }}>
                    <InlineEditBox
                      fieldPath={`hero.slides.${currentSlide}.description`}
                      fieldLabel={`Slide ${currentSlide + 1} Description`}
                      value={activeSlide.description}
                      type="textarea"
                    />
                  </p>
                </div>

                {/* Avatar Stack Box - Fixed non-overflowing container */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--r-xl)',
                  padding: '0.75rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  marginTop: 'auto',
                  flexShrink: 0
                }}>
                  <div className="avatar-stack" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {(activeSlide.avatars || []).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Mentor"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #FFFFFF',
                          marginLeft: i === 0 ? 0 : -8,
                          flexShrink: 0
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      color: 'var(--whiz-dark)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <InlineEditBox
                        fieldPath={`hero.slides.${currentSlide}.badgeText`}
                        fieldLabel={`Slide ${currentSlide + 1} Badge Text`}
                        value={activeSlide.badgeText}
                      />
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.2,
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <InlineEditBox
                        fieldPath={`hero.slides.${currentSlide}.badgeSub`}
                        fieldLabel={`Slide ${currentSlide + 1} Badge Sub`}
                        value={activeSlide.badgeSub}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Card: Interactive Live Photo / Prototype Arena */}
              <div
                className="hero-photo-card"
                style={{
                  minHeight: '430px',
                  height: '100%',
                  position: 'relative',
                  borderRadius: 'var(--r-2xl)',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
                  animation: 'fadeIn 0.35s ease-out'
                }}
              >
                <InlineEditBox
                  fieldPath={`hero.slides.${currentSlide}.photoSrc`}
                  fieldLabel={`Slide ${currentSlide + 1} Image URL`}
                  value={activeSlide.photoSrc}
                  type="image"
                  style={{ width: '100%', height: '100%' }}
                >
                  <img
                    src={activeSlide.photoSrc}
                    alt={activeSlide.photoTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </InlineEditBox>
                
                {/* Top Playful Ribbon */}
                <div className="squiggly-ribbon" style={{ zIndex: 5 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#10B981', display: 'inline-block',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                  <span>
                    <InlineEditBox
                      fieldPath={`hero.slides.${currentSlide}.photoBadge`}
                      fieldLabel={`Slide ${currentSlide + 1} Photo Ribbon`}
                      value={activeSlide.photoBadge}
                    />
                  </span>
                </div>

                {/* Bottom Glassmorphic Control Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  right: 14,
                  background: 'rgba(24, 26, 32, 0.90)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--r-xl)',
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#FFFFFF',
                  zIndex: 5
                }}>
                  <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.925rem', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <InlineEditBox
                        fieldPath={`hero.slides.${currentSlide}.photoTitle`}
                        fieldLabel={`Slide ${currentSlide + 1} Photo Title`}
                        value={activeSlide.photoTitle}
                      />
                    </div>
                    <div style={{ fontSize: '0.735rem', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <InlineEditBox
                        fieldPath={`hero.slides.${currentSlide}.photoSub`}
                        fieldLabel={`Slide ${currentSlide + 1} Photo Sub`}
                        value={activeSlide.photoSub}
                      />
                    </div>
                  </div>
                  <button
                    onClick={onExploreGallery}
                    style={{
                      background: 'var(--whiz-coral)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--r-full)',
                      padding: '0.45rem 1rem',
                      fontSize: '0.785rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: 'var(--shadow-coral)',
                      flexShrink: 0
                    }}
                  >
                    <span>View Gallery</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Right Card: Action & SDGs Capsules */}
              <div
                className={`bento-card card-pastel-${activeSlide.theme || 'lavender'}`}
                style={{
                  padding: '1.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  minHeight: '430px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  animation: 'fadeIn 0.35s ease-out'
                }}
              >
                {/* Pills Capsules */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {(activeSlide.ctaPills || []).map(p => (
                    <span key={p} className={`badge badge-${activeSlide.theme || 'lavender'}`} style={{ fontSize: '0.75rem' }}>
                      {p}
                    </span>
                  ))}
                </div>

                <div style={{ margin: 'auto 0' }}>
                  <p style={{ fontSize: '0.9rem', color: `var(--pastel-${activeSlide.theme || 'lavender'}-text)`, lineHeight: 1.6, fontWeight: 600 }}>
                    <InlineEditBox
                      fieldPath={`hero.slides.${currentSlide}.ctaText`}
                      fieldLabel={`Slide ${currentSlide + 1} CTA Text`}
                      value={activeSlide.ctaText}
                      type="textarea"
                    />
                  </p>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: 'auto' }}>
                  {!user ? (
                    <button
                      className="btn btn-coral"
                      onClick={onRegister}
                      style={{ width: '100%', padding: '0.85rem 1.25rem', fontWeight: 800 }}
                    >
                      <span>{activeSlide.ctaButton || 'Register Now'}</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-dark"
                      onClick={() => window.dispatchEvent(new CustomEvent('visai:goto-dashboard'))}
                      style={{ width: '100%', padding: '0.85rem 1.25rem' }}
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* =====================================================
                FAR RIGHT BACKGROUND PEEKING SLIDING WINDOW CARD
               ===================================================== */}
            <div
              onClick={nextSlide}
              className={`sliding-window-bg-card sliding-window-right card-pastel-${nextSlideData.theme}`}
              title="Click to view next slide window"
              style={{
                width: '260px',
                height: '410px',
                borderRadius: 'var(--r-2xl)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0,
                opacity: 0.55,
                transform: 'rotateY(-18deg) scale(0.88) translateZ(-60px)',
                cursor: 'pointer',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {/* Peek Label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                  {nextSlideData.badgeText?.slice(0, 18)}...
                </span>
                <span className="badge badge-dark" style={{ fontSize: '0.68rem', opacity: 0.9 }}>
                  Next ▶
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.25rem' }}>
                  {nextSlideData.title}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>
                  {nextSlideData.highlight}
                </div>
              </div>

              {/* Mini Preview Thumbnail */}
              <div style={{ height: 130, borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={nextSlideData.photoSrc}
                  alt={nextSlideData.photoTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex', alignItems: 'flex-end', padding: '0.5rem'
                }}>
                  <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                    {nextSlideData.photoTitle}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sliding Window Navigation Controls (Left/Right Arrows & Dots) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '1.75rem'
          }}>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide Window"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid var(--canvas-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={20} color="var(--whiz-dark)" />
            </button>

            {/* Slide Indicator Dots */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: currentSlide === idx ? 32 : 10,
                    height: 10,
                    borderRadius: 'var(--r-full)',
                    background: currentSlide === idx ? 'var(--whiz-coral)' : 'var(--canvas-border-strong)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next Slide Window"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid var(--canvas-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={20} color="var(--whiz-dark)" />
            </button>
          </div>

        </div>

      </div>

      <style>{`
        .sliding-window-bg-card:hover {
          opacity: 0.88 !important;
          transform: rotateY(0deg) scale(0.94) translateZ(0px) !important;
        }
        @media (max-width: 1280px) {
          .sliding-window-bg-card {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .hero-bento-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-photo-card {
            min-height: 290px !important;
            height: 290px !important;
          }
        }
      `}</style>
    </section>
  );
}
