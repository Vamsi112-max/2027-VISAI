import React from 'react';
import { SDG_8_THEMES } from '../../data/visaiData';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

// =====================================================
// OFFICIAL UN SDG SVG ICONS (Exact Match to Screenshot 3)
// =====================================================

function SdgSunIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function SdgWaterIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.3" />
      <path d="M12 12v4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function SdgCitiesIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function SdgIndustryIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  );
}

function SdgClimateIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 9a3 3 0 0 0-3 3" />
    </svg>
  );
}

function SdgFishIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M18 12v.5" />
      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
      <path d="M2 12h3" />
    </svg>
  );
}

function SdgInfinityIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c-2-2.5-4-4-6.5-4a4.5 4.5 0 1 0 0 9c2.5 0 4.5-1.5 6.5-4 2 2.5 4 4 6.5 4a4.5 4.5 0 1 0 0-9c-2.5 0-4.5 1.5-6.5 4Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function SdgTreesIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 16v6" />
      <path d="M13 19v3" />
      <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-4 4.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H8l-3 3.3a1 1 0 0 0 .7 1.7H13" />
    </svg>
  );
}

import { useSiteContent } from '../../context/SiteContentContext';
import InlineEditBox from '../admin/InlineEditBox';

export default function Sdg8ThemesSection({ onExploreProblems }) {
  const { content } = useSiteContent();
  const sdgData = content?.sdgSection || {};

  const getSdgIcon = (name) => {
    switch (name) {
      case 'Sun': return <SdgSunIcon />;
      case 'Droplet': return <SdgWaterIcon />;
      case 'Building2': return <SdgCitiesIcon />;
      case 'Factory': return <SdgIndustryIcon />;
      case 'Eye': return <SdgClimateIcon />;
      case 'Fish': return <SdgFishIcon />;
      case 'Infinity': return <SdgInfinityIcon />;
      case 'Trees': return <SdgTreesIcon />;
      default: return <SdgSunIcon />;
    }
  };

  return (
    <section className="section" style={{ background: '#FAF7F0', borderTop: '1px solid var(--canvas-border)', borderBottom: '1px solid var(--canvas-border)' }}>
      <div className="container">
        
        {/* Header (Matching User Screenshot 3 Exact Typography) */}
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 3.5rem' }}>
          <div style={{
            fontSize: '1rem',
            fontStyle: 'italic',
            fontFamily: 'serif',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
            letterSpacing: '0.02em'
          }}>
            <InlineEditBox fieldPath="sdgSection.badge" fieldLabel="SDG Section Badge" value={sdgData.badge || 'Sustainable Development Goals'} />
          </div>

          <h2 style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            fontFamily: 'serif',
            color: 'var(--whiz-dark)',
            lineHeight: 1.25,
            marginBottom: '1rem',
            letterSpacing: '-0.01em'
          }}>
            <InlineEditBox fieldPath="sdgSection.title" fieldLabel="SDG Section Title" value={sdgData.title || 'Projects Are Invited Under 8 SDG Themes Set By United Nations'} />
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 740, margin: '0 auto' }}>
            <InlineEditBox fieldPath="sdgSection.subtitle" fieldLabel="SDG Section Subtitle" value={sdgData.subtitle || 'Align your engineering solution with the UN 2030 Agenda. Build hardware or software prototypes addressing verified industry challenge statements.'} />
          </p>
        </div>

        {/* 8 SDG Themes Grid (Matching Screenshot 3 Layout & Colors) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }} className="sdg-8-grid">
          {SDG_8_THEMES.map((theme) => (
            <div
              key={theme.number}
              className="bento-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: '#FFFFFF',
                border: '1px solid var(--canvas-border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
              onClick={onExploreProblems}
            >
              {/* Official SDG Color Square Icon Box */}
              <div style={{
                width: 68,
                height: 68,
                borderRadius: 'var(--r-md)',
                background: theme.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                boxShadow: `0 6px 16px ${theme.color}40`,
                flexShrink: 0
              }}>
                {getSdgIcon(theme.iconName)}
              </div>

              {/* Title Matching Screenshot 3 */}
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--whiz-dark)',
                marginBottom: '0.65rem',
                lineHeight: 1.35,
                minHeight: '2.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {theme.title}
              </h3>

              {/* SDG Tag Pill */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: theme.textColor,
                  background: theme.bgColor,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--r-full)',
                  border: `1px solid ${theme.borderColor}`
                }}>
                  SDG {theme.number} • {theme.shortName}
                </span>
              </div>

              <p style={{
                fontSize: '0.825rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: '1.25rem',
                flex: 1
              }}>
                {theme.description}
              </p>

              {/* Action Button */}
              <div style={{
                width: '100%',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--canvas-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: 'var(--whiz-coral)',
                fontSize: '0.825rem',
                fontWeight: 800
              }}>
                <span>Explore Statements</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 1100px) {
          .sdg-8-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .sdg-8-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
