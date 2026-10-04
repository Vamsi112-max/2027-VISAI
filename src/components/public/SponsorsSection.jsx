import React from 'react';
import { SPONSORS_DATA } from '../../data/visaiData';
import { Sparkles, ExternalLink, Award, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

// =====================================================
// AUTHENTIC BRAND SVG LOGOS (Matching Screenshot 2)
// =====================================================

function NicolaFoundationLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#004D99" strokeWidth="4" fill="#F0F7FF" />
        <circle cx="50" cy="50" r="38" stroke="#004D99" strokeWidth="2" strokeDasharray="3 3" />
        {/* Globe Grid */}
        <ellipse cx="50" cy="50" rx="30" ry="14" stroke="#004D99" strokeWidth="2" />
        <line x1="50" y1="12" x2="50" y2="88" stroke="#004D99" strokeWidth="2" />
        {/* Laurel leaves */}
        <path d="M22 65 C20 45, 30 30, 48 24" stroke="#004D99" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 65 C80 45, 70 30, 52 24" stroke="#004D99" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="40" r="7" fill="#004D99" />
        <path d="M42 66 C42 56, 58 56, 58 66 Z" fill="#004D99" />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#004D99', letterSpacing: '0.05em', fontFamily: 'serif' }}>
          NICOLA
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#004D99', letterSpacing: '0.08em' }}>
          FOUNDATION
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#555', fontStyle: 'italic', letterSpacing: '0.02em', marginTop: 2 }}>
          Impacting lives
        </div>
      </div>
    </div>
  );
}

function CredaiLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 10H6V21H18V10H22L12 2Z" fill="#C02626" />
          <path d="M9 21V13H15V21H9Z" fill="#FFFFFF" />
        </svg>
        <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0A6836', letterSpacing: '0.04em', fontFamily: 'system-ui, sans-serif' }}>
          CREDAÎ
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0A6836', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: -2 }}>
        CHENNAI
      </div>
    </div>
  );
}

function IeeeEpsLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%', background: '#00629B',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        fontWeight: 900, fontSize: '0.85rem', flexShrink: 0
      }}>
        EPS
      </div>
      <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00629B', letterSpacing: '0.05em' }}>
          IEEE
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#002855' }}>
          ELECTRONICS
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#00629B' }}>
          PACKAGING SOCIETY
        </div>
      </div>
    </div>
  );
}

function IeeePsesLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="#003865" strokeWidth="5" fill="#E6F0FA" />
        <ellipse cx="50" cy="50" rx="36" ry="16" stroke="#003865" strokeWidth="3" />
        <line x1="50" y1="6" x2="50" y2="94" stroke="#003865" strokeWidth="3" />
        <line x1="6" y1="50" x2="94" y2="50" stroke="#003865" strokeWidth="3" />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#003865', letterSpacing: '0.04em' }}>
          PSES
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00629B' }}>
          Product Safety Engineering Society
        </div>
      </div>
    </div>
  );
}

function TelLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 64, height: 44, borderRadius: 6, background: '#4D7C0F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.06em'
      }}>
        TEL
      </div>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#365314', textTransform: 'uppercase', marginTop: 4, letterSpacing: '0.05em' }}>
        TURBO ENERGY
      </div>
    </div>
  );
}

function ViruksaLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="44" height="28" viewBox="0 0 100 60" fill="none">
        <path d="M10 50 Q30 10 50 35 Q70 10 90 50 Q50 30 10 50 Z" fill="url(#viruksa-grad)" />
        <circle cx="50" cy="18" r="7" fill="#F97316" />
        <defs>
          <linearGradient id="viruksa-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0369A1', letterSpacing: '0.08em', marginTop: 2 }}>
        VIRUKSA
      </div>
    </div>
  );
}

function AxisCadesLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #0369A1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 900
      }}>
        ⨁
      </div>
      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', letterSpacing: '0.04em' }}>
        AXISCADES
      </span>
    </div>
  );
}

function AmrepLogo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857', letterSpacing: '0.06em' }}>
        AMREP<sup style={{ fontSize: '0.65rem' }}>®</sup>
      </div>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#065F46', letterSpacing: '0.02em', marginTop: 1 }}>
        Amalgamations Repco Limited
      </div>
    </div>
  );
}

function CbsLogo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.05rem' }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1E293B', fontFamily: 'sans-serif' }}>c</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#DC2626', fontFamily: 'sans-serif' }}>bs</span>
      </div>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1E293B', letterSpacing: '0.05em', marginTop: -2 }}>
        Technologies
      </div>
    </div>
  );
}

function VelTechTbiLogo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#6D28D9', letterSpacing: '0.04em' }}>
        Vel Tech TBI
      </div>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Technology Business Incubator
      </div>
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section className="section" style={{ background: '#FAF7F0', borderBottom: '1px solid var(--canvas-border)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--r-full)',
            background: '#FFFFFF',
            border: '1px solid var(--canvas-border)',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              Industry & Academic Backing
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Official Sponsors & Partners
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            VISAI 2027 is proudly supported by leading industrial conglomerates, international technical societies, and philanthropic foundations.
          </p>
        </div>

        {/* =====================================================
            1. PRIZE SPONSORSHIP & KNOWLEDGE PARTNER (NICOLA FOUNDATION)
           ===================================================== */}
        <div style={{ maxWidth: 640, margin: '0 auto 2.75rem', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontFamily: 'serif',
            fontWeight: 800,
            color: 'var(--whiz-dark)',
            marginBottom: '1rem',
            letterSpacing: '0.01em'
          }}>
            Prize Sponsorship & Knowledge Partner
          </h3>

          <div className="bento-card" style={{
            padding: '2.25rem 2rem',
            background: '#FFFFFF',
            border: '2px solid rgba(0, 77, 153, 0.2)',
            boxShadow: '0 8px 30px rgba(0, 77, 153, 0.06)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '1.25rem 2.5rem',
              borderRadius: 'var(--r-lg)',
              border: '1.5px solid #E0F2FE',
              display: 'inline-block',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <NicolaFoundationLogo />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-sky" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                ⭐ Global Philanthropic Prize Patron
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              Charitable trust championing life-changing youth education, health outreach, and funding student innovator cash prizes for VISAI 2027.
            </p>
          </div>
        </div>

        {/* =====================================================
            2. TITLE SPONSOR (CREDAI CHENNAI)
           ===================================================== */}
        <div style={{ maxWidth: 640, margin: '0 auto 2.75rem', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontFamily: 'serif',
            fontWeight: 800,
            color: 'var(--whiz-dark)',
            marginBottom: '1rem',
            letterSpacing: '0.01em'
          }}>
            Title Sponsor
          </h3>

          <div className="bento-card" style={{
            padding: '2.25rem 2rem',
            background: '#FFFFFF',
            border: '2px solid rgba(10, 104, 54, 0.2)',
            boxShadow: '0 8px 30px rgba(10, 104, 54, 0.06)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '1.25rem 3rem',
              borderRadius: 'var(--r-lg)',
              border: '1.5px solid #DCFCE7',
              display: 'inline-block',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <CredaiLogo />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-lime" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                🏆 National Title Partner
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              Confederation of Real Estate Developers’ Associations of India (Chennai Chapter), promoting smart infrastructure and sustainable urban living.
            </p>
          </div>
        </div>

        {/* =====================================================
            3. TECHNICAL PARTNERS (IEEE EPS & IEEE PSES)
           ===================================================== */}
        <div style={{ maxWidth: 860, margin: '0 auto 2.75rem', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontFamily: 'serif',
            fontWeight: 800,
            color: 'var(--whiz-dark)',
            marginBottom: '1.25rem',
            letterSpacing: '0.01em'
          }}>
            Technical Partner
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="bento-card" style={{
              padding: '1.75rem 1.5rem',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <div style={{
                background: '#F8FAFC',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--r-md)',
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <IeeeEpsLogo />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Advancing semiconductor packaging, electronic materials, and hardware innovation standards.
              </p>
            </div>

            <div className="bento-card" style={{
              padding: '1.75rem 1.5rem',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <div style={{
                background: '#F8FAFC',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--r-md)',
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <IeeePsesLogo />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Global authority on product safety, risk engineering, and electronic regulatory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            4. KNOWLEDGE PARTNERS (TEL, VIRUKSA, AXISCADES, AMREP, CBS)
           ===================================================== */}
        <div style={{ maxWidth: 1040, margin: '0 auto 2.75rem', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontFamily: 'serif',
            fontWeight: 800,
            color: 'var(--whiz-dark)',
            marginBottom: '1.25rem',
            letterSpacing: '0.01em'
          }}>
            Knowledge Partner
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* TEL */}
            <div className="bento-card" style={{
              padding: '1.5rem 1rem', background: '#FFFFFF',
              border: '1px solid var(--canvas-border)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140
            }}>
              <TelLogo />
            </div>

            {/* VIRUKSA */}
            <div className="bento-card" style={{
              padding: '1.5rem 1rem', background: '#FFFFFF',
              border: '1px solid var(--canvas-border)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140
            }}>
              <ViruksaLogo />
            </div>

            {/* AXISCADES */}
            <div className="bento-card" style={{
              padding: '1.5rem 1rem', background: '#FFFFFF',
              border: '1px solid var(--canvas-border)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140
            }}>
              <AxisCadesLogo />
            </div>

            {/* AMREP */}
            <div className="bento-card" style={{
              padding: '1.5rem 1rem', background: '#FFFFFF',
              border: '1px solid var(--canvas-border)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140
            }}>
              <AmrepLogo />
            </div>

            {/* CBS */}
            <div className="bento-card" style={{
              padding: '1.5rem 1rem', background: '#FFFFFF',
              border: '1px solid var(--canvas-border)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140
            }}>
              <CbsLogo />
            </div>
          </div>
        </div>

        {/* =====================================================
            5. BRANDING PARTNER
           ===================================================== */}
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontFamily: 'serif',
            fontWeight: 800,
            color: 'var(--whiz-dark)',
            marginBottom: '1rem',
            letterSpacing: '0.01em'
          }}>
            Branding Partner
          </h3>

          <div className="bento-card" style={{
            padding: '1.75rem 2rem',
            background: '#FFFFFF',
            border: '1px solid var(--canvas-border)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#F5F3FF',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid #DDD6FE',
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}>
              <VelTechTbiLogo />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto', lineHeight: 1.5 }}>
              DST-supported Technology Business Incubator offering seed grants, prototyping maker labs, and incubation support for winning teams.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
