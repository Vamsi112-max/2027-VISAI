import React, { useState } from 'react';
import { INNOVATION_TRACKS } from '../../data/visaiData';
import { ArrowRight, Sparkles, BookOpen, Layers, Users, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TracksSection({ onExploreProblems }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All 17 SDG Tracks' },
    { id: 'track-ai', label: 'AI & Data Science' },
    { id: 'track-clean-energy', label: 'Smart Energy & Cities' },
    { id: 'track-health', label: 'Health & Biotech' },
    { id: 'track-hardware', label: 'Robotics & Hardware' },
  ];

  const filteredTracks = selectedFilter === 'all'
    ? INNOVATION_TRACKS
    : INNOVATION_TRACKS.filter(t => t.id === selectedFilter);

  const getCardBg = (theme) => {
    switch (theme) {
      case 'lavender': return { bg: '#F8F5FE', badge: 'badge-lavender', accent: '#7C3AED' };
      case 'lime': return { bg: '#F9FCE8', badge: 'badge-lime', accent: '#84CC16' };
      case 'peach': return { bg: '#FEF3F0', badge: 'badge-peach', accent: '#EA580C' };
      case 'mint': return { bg: '#F0FDF7', badge: 'badge-mint', accent: '#10B981' };
      case 'sky': return { bg: '#F0F8FE', badge: 'badge-sky', accent: '#0284C7' };
      default: return { bg: '#FFFFFF', badge: 'badge-dark', accent: '#FF5A36' };
    }
  };

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)' }}>
      <div className="container">
        
        {/* Section Header with Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="var(--whiz-coral)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--whiz-coral)', letterSpacing: '0.04em' }}>
                Engineering Domains
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)', fontWeight: 900, color: 'var(--whiz-dark)' }}>
              Featured Innovation Tracks
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Select a domain aligned with United Nations Sustainable Development Goals to solve real challenges.
            </p>
          </div>

          {/* Filter Pills like WhizKid */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                className={`filter-pill ${selectedFilter === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredTracks.map(track => {
            const styling = getCardBg(track.colorTheme);
            return (
              <div
                key={track.id}
                className="bento-card"
                style={{
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span className={`badge ${styling.badge}`}>
                      {track.subtitle}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      {track.psCount}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                    {track.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {track.description}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--canvas-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Domain Prize</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>{track.prize}</div>
                  </div>

                  <button
                    className="btn btn-dark btn-sm"
                    onClick={onExploreProblems}
                    style={{ fontWeight: 700 }}
                  >
                    <span>Explore PS</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
