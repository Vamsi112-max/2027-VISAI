import React, { useState } from 'react';
import { PREVIOUS_YEAR_PHOTOS, GALLERY_DATA } from '../../data/visaiData';
import { ArrowUpRight, Trophy, Sparkles, Eye, Play, X, ExternalLink } from 'lucide-react';

export default function PastHighlightsBento({ onExploreGallery }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getCardClass = (theme) => {
    switch (theme) {
      case 'lime': return 'card-pastel-lime';
      case 'lavender': return 'card-pastel-lavender';
      case 'peach': return 'card-pastel-peach';
      case 'mint': return 'card-pastel-mint';
      case 'sky': return 'card-pastel-sky';
      default: return 'card-pastel-yellow';
    }
  };

  const getBadgeClass = (theme) => {
    switch (theme) {
      case 'lime': return 'badge-lime';
      case 'lavender': return 'badge-lavender';
      case 'peach': return 'badge-peach';
      case 'mint': return 'badge-mint';
      case 'sky': return 'badge-sky';
      default: return 'badge-dark';
    }
  };

  return (
    <section className="section-sm">
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="var(--whiz-coral)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--whiz-coral)', letterSpacing: '0.04em' }}>
                Previous Editions Legacy
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'var(--whiz-dark)' }}>
              Top Highlights from Previous VISAI Editions
            </h2>
          </div>

          <button
            onClick={onExploreGallery}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 800 }}
          >
            <span>View Full Gallery ({GALLERY_DATA.length}+ Media)</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* 6-Card Bento Showcase Grid (WhizKid Style) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'minmax(210px, auto)',
          gap: '1.25rem'
        }} className="highlights-bento-grid">
          
          {/* Card 1: Pastel Card with mini content */}
          <div
            className={`bento-card ${getCardClass(PREVIOUS_YEAR_PHOTOS[0].colorTheme)}`}
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[0])}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge ${getBadgeClass(PREVIOUS_YEAR_PHOTOS[0].colorTheme)}`}>
                {PREVIOUS_YEAR_PHOTOS[0].category}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>VISAI {PREVIOUS_YEAR_PHOTOS[0].year}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.25 }}>
                {PREVIOUS_YEAR_PHOTOS[0].title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, opacity: 0.9 }}>
                {PREVIOUS_YEAR_PHOTOS[0].caption}
              </p>
            </div>
          </div>

          {/* Card 2: Big Photo Bento Card */}
          <div
            className="bento-card"
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[1])}
            style={{
              padding: 0,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '230px'
            }}
          >
            <img
              src={PREVIOUS_YEAR_PHOTOS[1].src}
              alt={PREVIOUS_YEAR_PHOTOS[1].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              color: '#FFFFFF'
            }}>
              <span className="badge badge-coral" style={{ alignSelf: 'flex-start', marginBottom: '0.4rem' }}>
                {PREVIOUS_YEAR_PHOTOS[1].badge}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                {PREVIOUS_YEAR_PHOTOS[1].title}
              </h4>
            </div>
          </div>

          {/* Card 3: Pastel Coral Card */}
          <div
            className={`bento-card ${getCardClass(PREVIOUS_YEAR_PHOTOS[2].colorTheme)}`}
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[2])}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge ${getBadgeClass(PREVIOUS_YEAR_PHOTOS[2].colorTheme)}`}>
                {PREVIOUS_YEAR_PHOTOS[2].category}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>VISAI {PREVIOUS_YEAR_PHOTOS[2].year}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.25 }}>
                {PREVIOUS_YEAR_PHOTOS[2].title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, opacity: 0.9 }}>
                {PREVIOUS_YEAR_PHOTOS[2].caption}
              </p>
            </div>
          </div>

          {/* Card 4: Photo Bento Card */}
          <div
            className="bento-card"
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[3])}
            style={{
              padding: 0,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '230px'
            }}
          >
            <img
              src={PREVIOUS_YEAR_PHOTOS[3].src}
              alt={PREVIOUS_YEAR_PHOTOS[3].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              color: '#FFFFFF'
            }}>
              <span className="badge badge-mint" style={{ alignSelf: 'flex-start', marginBottom: '0.4rem' }}>
                {PREVIOUS_YEAR_PHOTOS[3].badge}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                {PREVIOUS_YEAR_PHOTOS[3].title}
              </h4>
            </div>
          </div>

          {/* Card 5: Pastel Lavender Card */}
          <div
            className={`bento-card ${getCardClass(PREVIOUS_YEAR_PHOTOS[4].colorTheme)}`}
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[4])}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge ${getBadgeClass(PREVIOUS_YEAR_PHOTOS[4].colorTheme)}`}>
                {PREVIOUS_YEAR_PHOTOS[4].category}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>VISAI {PREVIOUS_YEAR_PHOTOS[4].year}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.25 }}>
                {PREVIOUS_YEAR_PHOTOS[4].title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, opacity: 0.9 }}>
                {PREVIOUS_YEAR_PHOTOS[4].caption}
              </p>
            </div>
          </div>

          {/* Card 6: Photo Card */}
          <div
            className="bento-card"
            onClick={() => setSelectedMedia(PREVIOUS_YEAR_PHOTOS[5])}
            style={{
              padding: 0,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '230px'
            }}
          >
            <img
              src={PREVIOUS_YEAR_PHOTOS[5].src}
              alt={PREVIOUS_YEAR_PHOTOS[5].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              color: '#FFFFFF'
            }}>
              <span className="badge badge-yellow" style={{ alignSelf: 'flex-start', marginBottom: '0.4rem', background: '#FFF3C4', color: '#8C6207' }}>
                {PREVIOUS_YEAR_PHOTOS[5].badge}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                {PREVIOUS_YEAR_PHOTOS[5].title}
              </h4>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Media Modal */}
      {selectedMedia && (
        <div className="lightbox-backdrop" onClick={() => setSelectedMedia(null)}>
          <div className="lightbox-card" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedMedia(null)}>
              <X size={20} />
            </button>
            <div className="lightbox-media-container">
              <img src={selectedMedia.src} alt={selectedMedia.title} />
            </div>
            <div className="lightbox-details">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span className="badge badge-coral">VISAI {selectedMedia.year}</span>
                <span className="badge badge-dark">{selectedMedia.category}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                {selectedMedia.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {selectedMedia.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .highlights-bento-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
