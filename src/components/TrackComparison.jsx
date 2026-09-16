import React, { useState } from 'react';
import { 
  Code2, 
  Cpu, 
  Clock, 
  MapPin, 
  Layers, 
  Check, 
  AlertTriangle, 
  FileCode, 
  HardDrive,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function TrackComparison({ content }) {
  const [activeView, setActiveView] = useState('both'); // 'both', 'software', 'hardware'

  return (
    <section id="tracks" className="section" style={{ background: '#f1f5f9' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="badge-tag">
            <Layers size={14} />
            <span>Dual Innovation Tracks</span>
          </div>
          <h2 className="section-title">
            {content?.title || "Structured for Excellence"}
          </h2>
          <p className="section-subtitle">
            {content?.description || "To ensure fair competition, optimal resource allocation, and authentic hackathon development, VISAI 2027 operates under two strictly separated tracks."}
          </p>
        </div>

        {/* Track Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveView('both')}
            className={`btn btn-sm ${activeView === 'both' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Compare Both Tracks
          </button>
          <button
            onClick={() => setActiveView('software')}
            className={`btn btn-sm ${activeView === 'software' ? 'btn-primary' : 'btn-secondary'}`}
          >
            💻 Software Track Only
          </button>
          <button
            onClick={() => setActiveView('hardware')}
            className={`btn btn-sm ${activeView === 'hardware' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔧 Hardware Track Only
          </button>
        </div>

        {/* Dual Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: activeView === 'both' ? 'repeat(auto-fit, minmax(460px, 1fr))' : '1fr',
          gap: '2rem',
          maxWidth: activeView === 'both' ? '1200px' : '780px',
          margin: '0 auto'
        }}>
          
          {/* SOFTWARE TRACK CARD */}
          {(activeView === 'both' || activeView === 'software') && (
            <div className="glass-card" style={{
              padding: '2.5rem',
              borderTop: '4px solid #0284c7',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Code2 size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>💻 Software Track</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Cloud, AI/ML, Cyber & Full-Stack</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge-tag track-software" style={{ margin: 0 }}>
                    On-Spot Venue Release
                  </span>
                </div>
              </div>

              {/* Technologies Included */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Technologies & Domains:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['Artificial Intelligence', 'Machine Learning', 'Web Applications', 'Mobile Apps', 'Cloud Computing', 'Data Science', 'Cybersecurity', 'Blockchain & Web3'].map((tech) => (
                    <span key={tech} style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#334155',
                      fontWeight: 600
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Release Strategy & Rules */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Clock size={16} /> Release Strategy: Venue Launch Only
                </div>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                  Problem statements are kept confidential until the opening ceremony of VISAI 2027. Teams will receive their problem statement directly at their hacking station. No pre-written code repositories are permitted; all Git commits must originate during the official 36 / 48 hours.
                </p>
              </div>

              {/* Journey Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#0284c7" /> Understand Problem & Ideate Architecture (0 - 4h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#0284c7" /> API, Model Training & Core Feature Coding (4 - 24h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#0284c7" /> Testing, Dockerization & Live Cloud Deployment (24 - 36h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#0284c7" /> Final Abstract Submission for VISAI Souvenir Publication
                </div>
              </div>
            </div>
          )}

          {/* HARDWARE TRACK CARD */}
          {(activeView === 'both' || activeView === 'hardware') && (
            <div className="glass-card" style={{
              padding: '2.5rem',
              borderTop: '4px solid #059669',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#d1fae5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Cpu size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>🔧 Hardware Track</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>IoT, Robotics, Sensors & Embedded</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge-tag track-hardware" style={{ margin: 0 }}>
                    7-10 Days Pre-Release
                  </span>
                </div>
              </div>

              {/* Technologies Included */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Technologies & Domains:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['Internet of Things (IoT)', 'Embedded Systems', 'Industrial Robotics', 'Smart Sensors', 'Automation & PLC', 'Smart Devices', 'Power Electronics', 'Wearables'].map((tech) => (
                    <span key={tech} style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#334155',
                      fontWeight: 600
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Release Strategy & Rules */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Zap size={16} /> Release Strategy: 7–10 Days Early Window
                </div>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                  Released 7-10 days prior so shortlisted teams can conduct research, design circuit schematics, and arrange components. <strong>Important:</strong> Fully assembled prototypes built prior to the event are disqualified. Assembly, wiring, firmware flashing, and calibration must take place live at the venue.
                </p>
              </div>

              {/* Journey Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#059669" /> Component Procurement & Architecture Planning (Pre-event)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#059669" /> Coordinator Hardware Safety Clearance & Check-in
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#059669" /> Physical Prototyping, Soldering & Firmware Bench Test (0 - 36h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} color="#059669" /> Final Abstract Submission & Grand Jury Working Demo
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
