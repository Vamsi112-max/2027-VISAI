import React, { useState } from 'react';
import { GALLERY_DATA, VISAI_CONFIG } from '../../data/visaiData';
import { Image, Video, Sparkles, Trophy, Play, X, Download, Share2, Filter, Layers, ExternalLink, Calendar, MapPin } from 'lucide-react';

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMedia, setActiveMedia] = useState(null);

  const yearTabs = [
    { id: 'all', label: 'All Editions' },
    { id: '2026', label: 'VISAI 2026' },
    { id: '2025', label: 'VISAI 2025' },
    { id: '2024', label: 'VISAI 2024' },
    { id: '2023', label: 'VISAI 2023' },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All Media' },
    { id: 'Award Ceremony', label: '🏆 Award Ceremony' },
    { id: 'Hackathon Floor', label: '💻 Hackathon Floor' },
    { id: 'Videos & Recaps', label: '🎬 Videos & Recaps' },
    { id: 'Demos & Jury', label: '🔬 Demos & Jury' },
    { id: 'Robotics & Hardware', label: '🤖 Robotics & Hardware' },
    { id: 'Mentorship', label: '🤝 Mentorship' },
  ];

  // Filtering
  const filteredMedia = GALLERY_DATA.filter(item => {
    const matchYear = selectedYear === 'all' || item.year === selectedYear;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchYear && matchCategory;
  });

  const yearSummaries = {
    '2026': {
      title: 'VISAI 2026 — 16th National Edition',
      participants: '2,160+ Innovators',
      teams: '540 Teams',
      prize: '₹5,00,000 Awarded',
      winner: 'Team Innovate_X (Autonomous Drone AI for Flood Relief)',
      theme: 'AI & Sustainable Infrastructure',
    },
    '2025': {
      title: 'VISAI 2025 — 15th Milestone Edition',
      participants: '1,950+ Innovators',
      teams: '480 Teams',
      prize: '₹4,50,000 Awarded',
      winner: 'Team SmartGrid (Decentralized Solar IoT Telemetry)',
      theme: 'Clean Energy & Smart Cities',
    },
    '2024': {
      title: 'VISAI 2024 — 14th National Edition',
      participants: '1,800+ Innovators',
      teams: '420 Teams',
      prize: '₹3,50,000 Awarded',
      winner: 'Team BioSense (Edge AI Non-invasive Diagnostic Kit)',
      theme: 'Healthcare & Precision Agriculture',
    },
    '2023': {
      title: 'VISAI 2023 — 13th National Edition',
      participants: '1,600+ Innovators',
      teams: '380 Teams',
      prize: '₹3,00,000 Awarded',
      winner: 'Team AeroTech (Autonomous High-Altitude Rover)',
      theme: 'Robotics & Disaster Management',
    },
  };

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Gallery Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 3rem' }}>
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
            <Image size={15} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Official Media Archive • 16+ Editions Legacy
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '1rem' }}>
            VISAI Hackathon Gallery & Videos
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Explore high-resolution photography, live jury pitch sessions, robotics arena action, and celebratory grand finale videos from past VISAI hackathons.
          </p>
        </div>

        {/* Year Selector Tabs (Large WhizKid Style Pills) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {yearTabs.map(tab => (
            <button
              key={tab.id}
              className={`filter-pill ${selectedYear === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedYear(tab.id)}
              style={{
                fontSize: '0.95rem',
                padding: '0.65rem 1.4rem',
                fontWeight: 800
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Year Summary Card (if specific year selected) */}
        {selectedYear !== 'all' && yearSummaries[selectedYear] && (
          <div className="bento-card card-pastel-lavender" style={{ marginBottom: '2.5rem', padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-lavender" style={{ marginBottom: '0.4rem' }}>Edition Summary</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--pastel-lavender-text)' }}>
                  {yearSummaries[selectedYear].title}
                </h3>
              </div>
              <div className="badge badge-coral" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                {yearSummaries[selectedYear].prize}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--r-lg)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Participation</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>{yearSummaries[selectedYear].participants}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Teams Shortlisted</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>{yearSummaries[selectedYear].teams}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Grand Winner</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-coral)' }}>{yearSummaries[selectedYear].winner}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Theme Alignment</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{yearSummaries[selectedYear].theme}</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.45rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '0.4rem' }}>
            Filter Media:
          </span>
          {categoryFilters.map(cat => (
            <button
              key={cat.id}
              className={`badge ${selectedCategory === cat.id ? 'badge-dark' : 'badge-white'}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                cursor: 'pointer',
                padding: '0.45rem 0.95rem',
                fontSize: '0.825rem',
                border: '1px solid var(--canvas-border)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {filteredMedia.map(item => (
            <div
              key={item.id}
              className="bento-card"
              onClick={() => setActiveMedia(item)}
              style={{
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Media Container */}
              <div style={{ height: 230, position: 'relative', overflow: 'hidden', background: '#181A20' }}>
                <img
                  src={item.thumbnail || item.src}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />

                {/* Video Play Badge if Video */}
                {item.type === 'video' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)'
                  }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: '50%',
                      background: 'var(--whiz-coral)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#FFFFFF', boxShadow: '0 4px 20px rgba(255, 90, 54, 0.5)'
                    }}>
                      <Play size={24} fill="#FFFFFF" style={{ marginLeft: 3 }} />
                    </div>
                  </div>
                )}

                {/* Pill Top Badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '0.4rem' }}>
                  <span className="badge badge-coral">{item.edition}</span>
                  <span className="badge badge-white">{item.category}</span>
                </div>

                {item.type === 'video' && (
                  <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                    <span className="badge badge-dark">
                      <Video size={12} /> Video
                    </span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {item.caption}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--canvas-border)' }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {item.stats}
                  </span>
                  <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--whiz-coral)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {item.type === 'video' ? 'Watch Video' : 'View Full Image'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Lightbox Modal */}
        {activeMedia && (
          <div className="lightbox-backdrop" onClick={() => setActiveMedia(null)}>
            <div className="lightbox-card" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close-btn" onClick={() => setActiveMedia(null)}>
                <X size={20} />
              </button>

              <div className="lightbox-media-container">
                {activeMedia.type === 'video' ? (
                  <div style={{ width: '100%', height: '500px', maxWidth: '100%' }}>
                    <iframe
                      src={activeMedia.src}
                      title={activeMedia.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img src={activeMedia.src} alt={activeMedia.title} />
                )}
              </div>

              <div className="lightbox-details">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-coral">{activeMedia.edition}</span>
                    <span className="badge badge-dark">{activeMedia.category}</span>
                    {activeMedia.tags?.map((tag, i) => (
                      <span key={i} className="badge badge-lime">#{tag}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {activeMedia.stats}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                  {activeMedia.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeMedia.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
