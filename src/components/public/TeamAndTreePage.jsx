import React, { useState } from 'react';
import { TEAMS_DATA, ORG_TREE_STRUCTURE, FORMAT_TREE_STRUCTURE, ORGANIZING_HIERARCHY_EXECUTIVE, VISAI_CONFIG } from '../../data/visaiData';
import { GitFork, Users, Sparkles, Mail, Globe, Award, ChevronDown, ChevronRight, Shield, Crown, Code, Layers, CheckCircle2, Check, Download, Building, Phone, ExternalLink } from 'lucide-react';
import { LinkedinIcon, InstagramIcon, GithubIcon } from '../shared/BrandIcons';

export default function TeamAndTreePage() {
  const [activeView, setActiveView] = useState('executive'); // 'executive' | 'tree' | 'profiles' | 'formats'
  const [teamCategory, setTeamCategory] = useState('all');

  const filteredMembers = teamCategory === 'all'
    ? TEAMS_DATA
    : TEAMS_DATA.filter(m => m.category === teamCategory);

  const getThemeClass = (color) => {
    switch (color) {
      case 'lime': return { card: 'card-pastel-lime', badge: 'badge-lime', border: '#DCE888' };
      case 'lavender': return { card: 'card-pastel-lavender', badge: 'badge-lavender', border: '#CEC1F5' };
      case 'peach': return { card: 'card-pastel-peach', badge: 'badge-peach', border: '#F7B5A3' };
      case 'mint': return { card: 'card-pastel-mint', badge: 'badge-mint', border: '#A4E8C5' };
      case 'sky': return { card: 'card-pastel-sky', badge: 'badge-sky', border: '#9DCEFA' };
      default: return { card: 'card-pastel-yellow', badge: 'badge-dark', border: '#FCE178' };
    }
  };

  return (
    <section className="section" style={{ background: '#FAF7F0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 2.5rem' }}>
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
            <GitFork size={14} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              VISAI 2027 Governance & Team Leadership
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '1rem' }}>
            Organizing Committee & Leadership
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Meet the academic leadership, industry relations deans, convener committee, and student taskforces organizing India’s 17th International SDG Hackathon.
          </p>
        </div>

        {/* View Switcher Navigation Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          <button
            className={`filter-pill ${activeView === 'executive' ? 'active' : ''}`}
            onClick={() => setActiveView('executive')}
            style={{ fontSize: '0.925rem', padding: '0.65rem 1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Award size={16} />
            <span>🏛️ Organizing Hierarchy</span>
          </button>

          <button
            className={`filter-pill ${activeView === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveView('tree')}
            style={{ fontSize: '0.925rem', padding: '0.65rem 1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <GitFork size={16} />
            <span>🌳 Interactive Org Tree</span>
          </button>

          <button
            className={`filter-pill ${activeView === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveView('profiles')}
            style={{ fontSize: '0.925rem', padding: '0.65rem 1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Users size={16} />
            <span>👥 Team Profiles & Directory</span>
          </button>

          <button
            className={`filter-pill ${activeView === 'formats' ? 'active' : ''}`}
            onClick={() => setActiveView('formats')}
            style={{ fontSize: '0.925rem', padding: '0.65rem 1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Layers size={16} />
            <span>📋 Submission Formats Tree</span>
          </button>
        </div>

        {/* =====================================================
            VIEW 1: EXACT EXECUTIVE ORGANIZING HIERARCHY (From User Screenshot 1)
           ===================================================== */}
        {activeView === 'executive' && (
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            
            {/* 1. Chief Convener Card */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'serif',
                fontWeight: 800,
                color: 'var(--whiz-dark)',
                letterSpacing: '0.02em',
                marginBottom: '1rem',
              }}>
                Chief Convener
              </div>

              <div className="bento-card" style={{
                maxWidth: 680,
                margin: '0 auto',
                padding: '2.5rem 2rem',
                background: '#FFFFFF',
                border: '1.5px solid rgba(37, 99, 235, 0.25)',
                boxShadow: '0 8px 30px rgba(37, 99, 235, 0.08)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: '#2563EB',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {ORGANIZING_HIERARCHY_EXECUTIVE.chiefConvener.name}
                </div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#EF4444',
                  marginBottom: '1.25rem'
                }}>
                  {ORGANIZING_HIERARCHY_EXECUTIVE.chiefConvener.title}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 1.25rem' }}>
                  Leading international industry relations, corporate problem statement vetting, technology transfer, and startup seed incubation.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href={`mailto:${ORGANIZING_HIERARCHY_EXECUTIVE.chiefConvener.email}`} className="badge badge-sky" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                    <Mail size={14} /> {ORGANIZING_HIERARCHY_EXECUTIVE.chiefConvener.email}
                  </a>
                  <span className="badge badge-lavender" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                    <Building size={14} /> Vel Tech R&D Institute
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="tree-line-vertical" style={{ height: 32, marginBottom: '3rem' }} />

            {/* 2. CONVENER Card */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'serif',
                fontWeight: 800,
                color: 'var(--whiz-dark)',
                letterSpacing: '0.04em',
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}>
                CONVENER
              </div>

              <div className="bento-card" style={{
                maxWidth: 680,
                margin: '0 auto',
                padding: '2.5rem 2rem',
                background: '#FFFFFF',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.06)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: '#2563EB',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {ORGANIZING_HIERARCHY_EXECUTIVE.convener.name}
                </div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#EF4444',
                  marginBottom: '1.25rem'
                }}>
                  {ORGANIZING_HIERARCHY_EXECUTIVE.convener.title}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 1.25rem' }}>
                  Steering nationwide corporate partnerships, industry technical society tie-ups, and participant mentorship structures.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href={`mailto:${ORGANIZING_HIERARCHY_EXECUTIVE.convener.email}`} className="badge badge-peach" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                    <Mail size={14} /> {ORGANIZING_HIERARCHY_EXECUTIVE.convener.email}
                  </a>
                  <span className="badge badge-mint" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                    <Award size={14} /> Industry Relations Office
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="tree-line-vertical" style={{ height: 32, marginBottom: '3rem' }} />

            {/* 3. CO-CONVENER'S (2 Columns Matching Screenshot 1) */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'serif',
                fontWeight: 800,
                color: 'var(--whiz-dark)',
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
                textTransform: 'uppercase'
              }}>
                CO-CONVENER’S
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '1.5rem',
                maxWidth: 820,
                margin: '0 auto'
              }}>
                {ORGANIZING_HIERARCHY_EXECUTIVE.coConveners.map((co, idx) => (
                  <div key={idx} className="bento-card" style={{
                    padding: '2rem 1.75rem',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--canvas-border)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      color: '#2563EB',
                      marginBottom: '0.4rem',
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {co.name}
                    </div>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#EF4444',
                      marginBottom: '1rem'
                    }}>
                      {co.title}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {co.affiliation}
                    </p>
                    <a href={`mailto:${co.email}`} className="badge badge-sky" style={{ fontSize: '0.785rem', padding: '0.35rem 0.8rem' }}>
                      <Mail size={13} /> {co.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="tree-line-vertical" style={{ height: 32, marginBottom: '3rem' }} />

            {/* 4. ORGANIZING TEAM SUMMARY */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'serif',
                fontWeight: 800,
                color: 'var(--whiz-dark)',
                letterSpacing: '0.04em',
                marginBottom: '1.5rem',
                textTransform: 'uppercase'
              }}>
                ORGANIZING TEAM
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem'
              }}>
                {ORGANIZING_HIERARCHY_EXECUTIVE.organizingTeamHeads.map((head, idx) => (
                  <div key={idx} className="bento-card card-pastel-lavender" style={{ padding: '1.5rem 1.25rem', textAlign: 'center', background: '#FFFFFF' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                      {head.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-coral)', marginBottom: '0.35rem' }}>
                      {head.role}
                    </div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      {head.dept}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =====================================================
            VIEW 2: INTERACTIVE FULL ORGANIZATIONAL TREE
           ===================================================== */}
        {activeView === 'tree' && (
          <div className="tree-container">
            
            {/* Level 1: Chief Patrons */}
            <div className="bento-card card-pastel-peach" style={{ maxWidth: 640, width: '100%', textAlign: 'center', padding: '1.75rem' }}>
              <span className="badge badge-peach" style={{ marginBottom: '0.5rem' }}>
                <Crown size={14} /> Apex Institutional Leadership
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--pastel-peach-text)', marginBottom: '0.4rem' }}>
                {ORG_TREE_STRUCTURE.name}
              </h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--whiz-dark)', marginBottom: '0.6rem' }}>
                {ORG_TREE_STRUCTURE.members.join(' • ')}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--pastel-peach-text)', opacity: 0.9 }}>
                {ORG_TREE_STRUCTURE.description}
              </p>
            </div>

            <div className="tree-line-vertical" />

            {/* Level 2: Steering Committee & Leadership */}
            <div className="bento-card card-pastel-lavender" style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '1.6rem' }}>
              <span className="badge badge-lavender" style={{ marginBottom: '0.5rem' }}>
                <Shield size={14} /> Vice Chancellor & Advisory Council
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--pastel-lavender-text)', marginBottom: '0.4rem' }}>
                {ORG_TREE_STRUCTURE.children[0].name}
              </h3>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                {ORG_TREE_STRUCTURE.children[0].members.join(' • ')}
              </p>
              <p style={{ fontSize: '0.825rem', color: 'var(--pastel-lavender-text)', opacity: 0.9 }}>
                {ORG_TREE_STRUCTURE.children[0].description}
              </p>
            </div>

            <div className="tree-line-vertical" />

            {/* Level 3: Chief Convener & Convener Chairs */}
            <div className="bento-card card-pastel-lime" style={{ maxWidth: 640, width: '100%', textAlign: 'center', padding: '1.75rem' }}>
              <span className="badge badge-lime" style={{ marginBottom: '0.5rem' }}>
                <Award size={14} /> Convener Executive Directorate
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--pastel-lime-text)', marginBottom: '0.4rem' }}>
                Prof. Dr. P. Chandrakumar (Chief Convener) & Prof. C. S. Siva Kumar (Convener)
              </h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                Co-Conveners: Dr. A. Mutharasan & Dr. S. Vinson Joshua
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--pastel-lime-text)', opacity: 0.9 }}>
                Responsible for corporate problem statement vetting, IEEE & industrial sponsor tie-ups, track scheduling, and live jury evaluations.
              </p>
            </div>

            <div className="tree-line-vertical" />

            {/* Level 4: 4 Operational Wings */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '1.25rem',
              width: '100%',
              marginTop: '0.5rem'
            }}>
              {ORG_TREE_STRUCTURE.children[0].children[0].children.map(wing => {
                const styling = getThemeClass(wing.color);
                return (
                  <div key={wing.id} className={`bento-card ${styling.card}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className={`badge ${styling.badge}`} style={{ marginBottom: '0.6rem' }}>
                        {wing.title}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                        {wing.name}
                      </h4>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                        Lead: {wing.lead}
                      </div>
                      <p style={{ fontSize: '0.825rem', lineHeight: 1.5, opacity: 0.9, marginBottom: '1.25rem' }}>
                        {wing.description}
                      </p>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: 'var(--r-md)', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Working Units:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {wing.children.map(sub => (
                          <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--whiz-dark)' }}>
                            <span>• {sub.name}</span>
                            <span className="badge badge-coral" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{sub.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* =====================================================
            VIEW 3: TEAM PROFILES DIRECTORY
           ===================================================== */}
        {activeView === 'profiles' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {[
                { id: 'all', label: 'All Leadership & Teams' },
                { id: 'faculty', label: 'Chief Convener & Conveners' },
                { id: 'leadership', label: 'Patrons & Chancellor' },
                { id: 'jury', label: 'Industry Jury Leads' },
                { id: 'students', label: 'Student Core Leads' },
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`filter-pill ${teamCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setTeamCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Profiles Bento Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  className="bento-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.75rem',
                    background: '#FFFFFF'
                  }}
                >
                  <div>
                    {/* Avatar & Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 'var(--r-xl)',
                          objectFit: 'cover',
                          border: '2px solid var(--canvas-border)'
                        }}
                      />
                      <div>
                        <span className="badge badge-coral" style={{ marginBottom: '0.25rem' }}>
                          {member.badge}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1.2 }}>
                          {member.name}
                        </h4>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--whiz-coral)', marginBottom: '0.25rem' }}>
                      {member.designationTitle || member.role}
                    </div>

                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.9rem', fontWeight: 600 }}>
                      {member.department}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      {member.bio}
                    </p>
                  </div>

                  {/* Social & Contact Redirection Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--canvas-border)'
                  }}>
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#EEF6FD', color: '#0A66C2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon size={16} />
                      </a>
                    )}

                    {member.socials.github && (
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#F6F8FA', color: '#24292F',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="GitHub Profile"
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}

                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#FDF2F4', color: '#E1306C',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Instagram Profile"
                      >
                        <InstagramIcon size={16} />
                      </a>
                    )}

                    {member.socials.email && (
                      <a
                        href={`mailto:${member.socials.email}`}
                        style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#F0FDF4', color: '#16A34A',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </a>
                    )}

                    {member.socials.website && (
                      <a
                        href={member.socials.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#F3EFE6', color: 'var(--whiz-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Official Website"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 4: HACKATHON & SUBMISSION FORMATS TREE
           ===================================================== */}
        {activeView === 'formats' && (
          <div style={{ maxWidth: 940, margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                End-to-End Submission & Evaluation Workflow Tree
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Follow the structured step-by-step pipeline from registration to the grand valedictory awards ceremony.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {FORMAT_TREE_STRUCTURE.map((item, idx) => {
                const styling = getThemeClass(item.color);
                return (
                  <div key={idx} className={`bento-card ${styling.card}`} style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge ${styling.badge}`} style={{ fontSize: '0.85rem' }}>
                          {item.step}
                        </span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '0.75rem',
                      background: '#FFFFFF',
                      padding: '1.25rem',
                      borderRadius: 'var(--r-lg)',
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                      {item.items.map((point, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          <CheckCircle2 size={16} color="var(--whiz-coral)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Downloads Strip */}
            <div className="bento-card" style={{ marginTop: '2.5rem', background: '#FFFFFF', textAlign: 'center', padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                Official Templates & Documentation
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Download the standardized 5-slide PPT deck template, abstract guidelines, and rubric checklist.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="/templates/VISAI_2027_Abstract_Template.pptx"
                  download
                  className="btn btn-coral btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <Download size={15} />
                  <span>Download PPT Template (.pptx)</span>
                </a>
                <a
                  href="/templates/VISAI_2027_Brochure.pdf"
                  download
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <Download size={15} />
                  <span>Official Brochure (PDF)</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
