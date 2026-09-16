import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Trophy, 
  ArrowRight, 
  Cpu, 
  Code2, 
  BookOpen, 
  Globe, 
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Plane,
  Building,
  Layers,
  Award
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    badge: "17th Edition Landmark Model",
    title: "From Project Expo to 36 / 48-Hour High-Impact Hackathon",
    subtitle: "Students solve real-world problems under time constraints, collaborate directly with MNCs, and develop practical commercial solutions.",
    highlight: "Real Problems. Real Innovation. Real Impact.",
    icon: Layers,
    color: "#2563eb",
    bgTint: "#eff6ff"
  },
  {
    id: 2,
    badge: "Global Recognition & Incentives",
    title: "Seed Grants & Sponsored International Trip to Malaysia",
    subtitle: "Vel Tech fully funds the top 2 performing student teams to present their engineering achievements at a leading Malaysian university.",
    highlight: "Plus patent filing assistance & Vel Tech TBI pre-seed incubation.",
    icon: Plane,
    color: "#d97706",
    bgTint: "#fffbeb"
  },
  {
    id: 3,
    badge: "Industry Problem Statements",
    title: "42+ Real Challenges from Ashok Leyland, Renault Nissan & L&T",
    subtitle: "Thirteen leading automotive, energy, and tech corporations have provided authentic industrial engineering challenges mapped to UN SDGs.",
    highlight: "Direct internship, pre-placement, and pilot contract opportunities.",
    icon: Building,
    color: "#059669",
    bgTint: "#f0fdf4"
  },
  {
    id: 4,
    badge: "Dual Track Release Strategy",
    title: "Software (On-Spot Venue) vs Hardware (7-10 Days Prior)",
    subtitle: "Software teams build everything from scratch during the hackathon; Hardware teams receive challenges early for component sourcing & research.",
    highlight: "Strict anti-plagiarism and live bench prototype verification.",
    icon: Code2,
    color: "#0284c7",
    bgTint: "#f0f9ff"
  },
  {
    id: 5,
    badge: "Automated Digital Publication",
    title: "Official VISAI 2027 Innovation Souvenir & Project Book",
    subtitle: "Every approved innovation is automatically structured, peer-reviewed, and published into the permanent VISAI compendium.",
    highlight: "Official NAAC / NBA accredited innovation documentation.",
    icon: BookOpen,
    color: "#7c3aed",
    bgTint: "#f5f3ff"
  }
];

export default function Hero({ onExploreProblems, onEnterPortal, onOpenSouvenir, heroContent }) {
  // Live Countdown state to VISAI Hackathon Kickoff
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 38,
    seconds: 19
  });

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  const currentHeroSlide = HERO_SLIDES[activeSlide];
  const IconComponent = currentHeroSlide.icon;

  return (
    <section className="section" style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Top Tagline Pill */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="badge-tag">
            <Sparkles size={14} className="float-element" />
            <span>Vel Tech Presents • VISAI 2027 • 17th Edition</span>
          </div>
        </div>

        {/* Hero Main Heading */}
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto 1.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            color: '#0f172a',
            marginBottom: '1.25rem'
          }}>
            {heroContent?.title.split('.').map((sentence, idx, arr) => (
              <React.Fragment key={idx}>
                {idx === arr.length - 2 ? (
                  <span className="gradient-text-cyan">{sentence}.</span>
                ) : (
                  sentence + (idx < arr.length - 1 ? '.' : '')
                )}
                {' '}
              </React.Fragment>
            ))}
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
            color: '#475569',
            lineHeight: 1.65,
            maxWidth: '820px',
            margin: '0 auto'
          }}>
            {heroContent?.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          <button onClick={onExploreProblems} className="btn btn-lg btn-primary">
            <span>Explore Industry Challenges</span>
            <ArrowRight size={18} />
          </button>

          <button onClick={onEnterPortal} className="btn btn-lg btn-secondary">
            <span>Enter Role Portals & Demo Login</span>
          </button>

          <button onClick={onOpenSouvenir} className="btn btn-lg btn-amber">
            <BookOpen size={18} />
            <span>Innovation Souvenir Book</span>
          </button>
        </div>

        {/* MULTI-SLIDE SHOWCASE CAROUSEL (Hero Presentation Slides) */}
        <div className="glass-card" style={{
          padding: '2rem 2.5rem',
          maxWidth: '1080px',
          margin: '0 auto 3rem',
          background: currentHeroSlide.bgTint,
          border: `2px solid ${currentHeroSlide.color}33`,
          borderRadius: '20px',
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.08)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: currentHeroSlide.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={22} />
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: currentHeroSlide.color,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {currentHeroSlide.badge}
              </span>
            </div>

            {/* Carousel Slide Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="btn btn-sm btn-secondary"
                style={{ padding: '0.35rem 0.6rem' }}
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>
                Slide {activeSlide + 1} of {HERO_SLIDES.length}
              </span>
              <button
                onClick={() => setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length)}
                className="btn btn-sm btn-secondary"
                style={{ padding: '0.35rem 0.6rem' }}
                title="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {currentHeroSlide.title}
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            {currentHeroSlide.subtitle}
          </p>
          <div style={{ fontSize: '0.85rem', color: currentHeroSlide.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} />
            <span>{currentHeroSlide.highlight}</span>
          </div>

          {/* Slide Indicator Dots */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem' }}>
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: activeSlide === idx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeSlide === idx ? currentHeroSlide.color : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Dual Track Banner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1080px',
          margin: '0 auto 3.5rem'
        }}>
          {/* Software Track Box */}
          <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden', borderTop: '4px solid #0284c7' }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(2, 132, 199, 0.08)',
              borderRadius: '50%',
              filter: 'blur(20px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: '#e0f2fe', padding: '0.6rem', borderRadius: '12px', color: '#0284c7' }}>
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>💻 Software Track</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>AI, Cloud, Cyber, Mobile & Web</span>
                </div>
              </div>
              <span className="track-software" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                On-Spot Release
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Software problem statements are released <strong>exclusively at the hackathon venue</strong>. Teams ideate, code, integrate models, and deploy working MVPs under official 36/48-hour time constraint.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
              <span>• Zero Pre-Coding</span>
              <span>• Live Verification</span>
              <span>• AI & ML Benchmarks</span>
            </div>
          </div>

          {/* Hardware Track Box */}
          <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden', borderTop: '4px solid #059669' }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(5, 150, 105, 0.08)',
              borderRadius: '50%',
              filter: 'blur(20px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: '#d1fae5', padding: '0.6rem', borderRadius: '12px', color: '#059669' }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>🔧 Hardware Track</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>IoT, Robotics, Embedded & Sensors</span>
                </div>
              </div>
              <span className="track-hardware" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                7-10 Days Pre-Release
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Hardware challenges released <strong>7–10 days before the event</strong> to allow research, component sourcing, and architecture design. Full prototype assembly happens live at the hackathon.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
              <span>• Component Procurement</span>
              <span>• Safety Screening</span>
              <span>• Live Bench Prototyping</span>
            </div>
          </div>
        </div>

        {/* Live Countdown & Stats Strip */}
        <div className="glass-card" style={{
          padding: '2rem 2.5rem',
          maxWidth: '1080px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderColor: '#cbd5e1',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Countdown Box */}
            <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Clock size={14} color="#2563eb" />
                <span>Countdown to Kickoff</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{timeLeft.days}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>DAYS</div>
                </div>
                <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>:</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{timeLeft.hours}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>HRS</div>
                </div>
                <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>:</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{timeLeft.minutes}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>MIN</div>
                </div>
                <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>:</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{timeLeft.seconds}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>SEC</div>
                </div>
              </div>
            </div>

            {/* Stat 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-display)' }}>
                Awards
              </div>
              <div style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
                Seed Grants & Incubation Support
              </div>
            </div>

            {/* Stat 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                303+
              </div>
              <div style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
                Shortlisted Teams Nationwide
              </div>
            </div>

            {/* Stat 3 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)' }}>
                Malaysia
              </div>
              <div style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
                Fully-Funded International Trip
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
