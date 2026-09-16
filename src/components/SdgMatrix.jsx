import React, { useState } from 'react';
import { SDG_LIST, INITIAL_PROBLEM_STATEMENTS } from '../data/visaiData';
import { Globe, ArrowUpRight, Sparkles, CheckCircle2, X } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function SdgMatrix({ content, onFilterBySdg }) {
  const [activeSdg, setActiveSdg] = useState(null);
  const [selectedSdgDetails, setSelectedSdgDetails] = useState(null);

  return (
    <section id="sdgs" className="section" style={{ background: '#f1f5f9' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="badge-tag">
            <Globe size={14} />
            <span>United Nations Agenda 2030</span>
          </div>
          <h2 className="section-title">
            {content?.title || "17 Sustainable Development Goals (SDGs)"}
          </h2>
          <p className="section-subtitle">
            {content?.description || "VISAI shifted from conventional department streams into UN SDG-driven innovation. Every project tackles real-world engineering challenges mapped directly to SDG targets."}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {SDG_LIST.map((sdg) => {
            const problemCount = INITIAL_PROBLEM_STATEMENTS.filter(p => p.sdgId === sdg.id).length;
            const isHovered = activeSdg?.id === sdg.id;
            const IconComponent = Icons[sdg.icon] || Globe;

            return (
              <div
                key={sdg.id}
                onMouseEnter={() => setActiveSdg(sdg)}
                onMouseLeave={() => setActiveSdg(null)}
                onClick={() => {
                  setSelectedSdgDetails(sdg);
                }}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  background: sdg.color,
                  borderRadius: '12px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isHovered ? '0 10px 25px -5px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  transform: isHovered ? 'scale(1.03)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
              >
                {/* Top Section: Number */}
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  fontFamily: 'var(--font-display)',
                  marginBottom: '0.2rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {sdg.id}
                </div>

                {/* SDG Name */}
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  lineHeight: 1.15,
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {sdg.name}
                </div>

                {/* Large Centered 2D Icon with shadow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -40%)',
                  opacity: 0.9,
                  filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.25))',
                  zIndex: 1
                }}>
                  <IconComponent size={65} strokeWidth={1.5} color="#ffffff" />
                </div>

                {/* Arrow Icon on Hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: sdg.color,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}>
                    <ArrowUpRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SDG Focus Banner */}
        <div className="glass-card" style={{
          padding: '2.25rem 2.5rem',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: '16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Sparkles size={18} />
                <span>Why SDG Mapping Matters for Students</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                Accreditation & Global Innovation Recognition
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.65 }}>
                Participation in VISAI earns students and participating universities prestigious credentials with accreditation bodies such as <strong>NAAC</strong> and <strong>NBA</strong>. Furthermore, top teams gain international visibility and patent acceleration via Vel Tech R&D Institute.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Direct mentorship from MNC R&D Directors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Vel Tech Sponsored International Trip to Malaysia for top teams</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Publication in the Official VISAI 2027 Innovation Souvenir</span>
              </div>
            </div>
          </div>
        </div>

        {/* SDG Details Modal */}
        {selectedSdgDetails && (
          <div className="modal-overlay" onClick={() => setSelectedSdgDetails(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: selectedSdgDetails.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                    fontWeight: 900
                  }}>
                    {selectedSdgDetails.id}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                      {selectedSdgDetails.name}
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      UN Agenda 2030 • Objective {selectedSdgDetails.id}
                    </span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedSdgDetails(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ paddingBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
                  Associated Problem Statements
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {INITIAL_PROBLEM_STATEMENTS.filter(p => p.sdgId === selectedSdgDetails.id).length > 0 ? (
                    INITIAL_PROBLEM_STATEMENTS.filter(p => p.sdgId === selectedSdgDetails.id).map(prob => (
                      <div key={prob.id} style={{
                        padding: '1.25rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {prob.track} Track
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {prob.code}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                          {prob.title}
                        </h5>
                        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                          {prob.description}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>
                          <span style={{ color: '#64748b' }}>Industry Partner:</span> {prob.industryPartner}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f1f5f9', borderRadius: '12px', color: '#64748b' }}>
                      No active problem statements for this SDG yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
