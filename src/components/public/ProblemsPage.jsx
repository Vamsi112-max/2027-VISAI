import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Sparkles, Download, Layers, Users, ChevronRight, CheckCircle, ExternalLink, X, FileText, Award } from 'lucide-react';
import { problemsAPI } from '../../hooks/api';
import { SDG_8_THEMES } from '../../data/visaiData';

export default function ProblemsPage({ onRegister }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [selectedPs, setSelectedPs] = useState(null);

  useEffect(() => {
    problemsAPI.list()
      .then(r => {
        const ps = r?.data?.problems || [];
        if (ps.length > 0) {
          setProblems(ps);
        } else {
          // Pre-seed from SDG 8 Themes
          const fallbackList = SDG_8_THEMES.map((theme, i) => ({
            id: `ps-${theme.code}`,
            ps_code: `VISAI-${theme.code.toUpperCase()}-IND01`,
            title: theme.psExamples?.[0] || theme.title,
            track: `SDG ${theme.number}: ${theme.shortName}`,
            category: theme.partner,
            short_description: `Address real-world engineering challenges under UN SDG ${theme.number} in collaboration with ${theme.partner}.`,
            full_description: `Develop a functional working hardware or software prototype solving ${theme.psExamples?.[0]}. Teams must submit a structured pitch deck (max 10 slides), GitHub repository / architecture diagram, and demonstrate verifiable impact aligned with ${theme.title}.`,
            rubric: [
              'Innovation & Originality (20 pts)',
              'Technical Feasibility & Architecture (20 pts)',
              'SDG Alignment & Real Impact (20 pts)',
              'Prototype Demonstration (20 pts)',
              'Pitch Presentation & Q&A (20 pts)'
            ],
            color: theme.color,
            bgColor: theme.bgColor,
            textColor: theme.textColor,
            borderColor: theme.borderColor,
            registered_count: 0,
            remaining_capacity: 60,
            max_capacity: 60
          }));
          setProblems(fallbackList);
        }
      })
      .catch(() => {
        const fallbackList = SDG_8_THEMES.map((theme, i) => ({
          id: `ps-${theme.code}`,
          ps_code: `VISAI-${theme.code.toUpperCase()}-IND01`,
          title: theme.psExamples?.[0] || theme.title,
          track: `SDG ${theme.number}: ${theme.shortName}`,
          category: theme.partner,
          short_description: `Address real-world engineering challenges under UN SDG ${theme.number} in collaboration with ${theme.partner}.`,
          full_description: `Develop a functional working prototype solving ${theme.psExamples?.[0]}. Teams must submit a structured pitch deck (max 10 slides), architecture diagram, and demonstrate verifiable impact aligned with ${theme.title}.`,
          rubric: [
            'Innovation & Originality (20 pts)',
            'Technical Feasibility & Architecture (20 pts)',
            'SDG Alignment & Real Impact (20 pts)',
            'Prototype Demonstration (20 pts)',
            'Pitch Presentation & Q&A (20 pts)'
          ],
          color: theme.color,
          bgColor: theme.bgColor,
          textColor: theme.textColor,
          borderColor: theme.borderColor,
          registered_count: 0,
          remaining_capacity: 60,
          max_capacity: 60
        }));
        setProblems(fallbackList);
      })
      .finally(() => setLoading(false));
  }, []);

  const tracks = [...new Set(problems.map(p => p.track).filter(Boolean))];

  const filtered = problems.filter(ps => {
    const q = search.toLowerCase();
    const matchSearch = !q || ps.title.toLowerCase().includes(q) || ps.ps_code.toLowerCase().includes(q) || (ps.short_description || '').toLowerCase().includes(q) || (ps.category || '').toLowerCase().includes(q);
    const matchTrack = !trackFilter || ps.track === trackFilter;
    return matchSearch && matchTrack;
  });

  const handleDownloadStarterPack = () => {
    const content = `VISAI 2027 — 17th INTERNATIONAL SDG & INDUSTRY INNOVATION HACKATHON
OFFICIAL PROBLEM STATEMENTS CATALOG & STARTER KIT
Host: Vel Tech R&D Institute of Science and Technology, Chennai
Total Prize Pool: ₹5,00,000+ & Incubation Support

========================================================================
8 UN SUSTAINABLE DEVELOPMENT GOAL (SDG) CHALLENGE TRACKS:
========================================================================

${problems.map((p, idx) => `
[${idx + 1}] PROBLEM CODE: ${p.ps_code}
TRACK: ${p.track}
TITLE: ${p.title}
KNOWLEDGE/CHALLENGE PARTNER: ${p.category}
SUMMARY: ${p.short_description}
DETAILED BRIEF: ${p.full_description || 'Refer to portal for full problem statement'}
EVALUATION CRITERIA (100 PTS TOTAL):
  1. Innovation & Novelty (20 pts)
  2. Technical Feasibility & Scalability (20 pts)
  3. SDG Alignment & Impact (20 pts)
  4. Working Prototype / Code Demonstration (20 pts)
  5. Pitch Clarity & Q&A Defense (20 pts)
------------------------------------------------------------------------`).join('\n')}

========================================================================
SUBMISSION GUIDELINES:
- Team Size: 2 to 4 Students (Interdisciplinary teams encouraged)
- Round 1: Abstract & Problem Alignment PPT (Max 10 slides)
- Round 2: Architecture & GitHub Repository
- Round 3: Grand 36-Hour On-Site Hackathon at Vel Tech Chennai Campus
========================================================================
Portal URL: ${window.location.origin}
Inquiries: visai@veltech.edu.in | +91 1800 212 7669
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VISAI_2027_Problem_Statements_Starter_Kit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '80vh' }}>
      <div className="container-wide">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: 'var(--pastel-peach-bg)',
            border: '1px solid rgba(255, 90, 54, 0.25)',
            marginBottom: '1rem'
          }}>
            <BookOpen size={15} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>
              8 UN SDG Tracks • Industrial Challenges
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Problem Statements Catalog
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680, margin: '0 auto 1.5rem' }}>
            Select your challenge statement across Clean Energy, Clean Water, Smart Cities, AI, Climate, Oceans, and Agriculture supported by top industry leaders.
          </p>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadStarterPack}
            style={{ fontWeight: 800, padding: '0.6rem 1.25rem', boxShadow: 'var(--shadow-xs)' }}
          >
            <Download size={15} />
            <span>Download Official Starter Pack (.TXT)</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-xl)',
          padding: '1.25rem',
          border: '1px solid var(--canvas-border)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              className="form-input"
              placeholder="Search challenge by keywords, track, or partner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.8rem', width: '100%' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`filter-pill ${trackFilter === '' ? 'active' : ''}`}
              onClick={() => setTrackFilter('')}
            >
              All Tracks ({problems.length})
            </button>
            {tracks.map(t => (
              <button
                key={t}
                className={`filter-pill ${trackFilter === t ? 'active' : ''}`}
                onClick={() => setTrackFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <div style={{
              width: 44, height: 44, border: '4px solid #FFE0D6', borderTopColor: 'var(--whiz-coral)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
            }} />
            <p style={{ fontWeight: 600 }}>Loading problem statements...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bento-card" style={{ textAlign: 'center', padding: '3rem', background: '#FFFFFF' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No problem statements found matching "{search}".</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {filtered.map(ps => {
              const maxCap = ps.max_capacity || 60;
              const remCap = ps.remaining_capacity ?? 25;
              const registered = ps.registered_count || (maxCap - remCap);
              const pct = Math.min(100, Math.round((registered / maxCap) * 100));

              return (
                <div
                  key={ps.id}
                  className="bento-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    padding: '1.75rem',
                    borderLeft: `5px solid ${ps.color || 'var(--whiz-coral)'}`,
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      <span className="badge badge-dark" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {ps.ps_code}
                      </span>
                      {ps.category && (
                        <span className="badge badge-peach" style={{ fontSize: '0.7rem' }}>
                          Partner: {ps.category}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: ps.color || 'var(--whiz-coral)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {ps.track}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.6rem', lineHeight: 1.35 }}>
                      {ps.title}
                    </h3>

                    {ps.short_description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                        {ps.short_description}
                      </p>
                    )}
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      marginBottom: '0.4rem'
                    }}>
                      <span>{registered} Teams Registered</span>
                      <span>{remCap} Slots Remaining</span>
                    </div>

                    <div style={{
                      height: 6,
                      borderRadius: 'var(--r-full)',
                      background: 'var(--canvas-subtle)',
                      overflow: 'hidden',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        borderRadius: 'var(--r-full)',
                        background: pct > 80 ? 'var(--whiz-coral)' : '#10B981'
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedPs(ps)}
                        style={{ flex: 1, fontSize: '0.78rem', fontWeight: 800 }}
                      >
                        <FileText size={13} /> View Full Brief
                      </button>

                      {onRegister && (
                        <button
                          className="btn btn-coral btn-sm"
                          onClick={onRegister}
                          style={{ fontSize: '0.78rem', fontWeight: 800 }}
                        >
                          Select PS & Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedPs && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div className="bento-card" style={{ maxWidth: 640, width: '100%', background: '#FFFFFF', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span className="badge badge-dark" style={{ fontFamily: 'monospace', marginBottom: '0.4rem', display: 'inline-flex' }}>
                    {selectedPs.ps_code}
                  </span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedPs.color || 'var(--whiz-coral)' }}>
                    {selectedPs.track}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: '0.2rem' }}>
                    {selectedPs.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedPs(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={22} />
                </button>
              </div>

              <div style={{
                background: 'var(--canvas-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--r-lg)',
                marginBottom: '1.5rem',
                border: '1px solid var(--canvas-border)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  🏢 Challenge & Knowledge Partner:
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--whiz-coral)', fontWeight: 800 }}>
                  {selectedPs.category || 'Vel Tech Industrial Consortium'}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                  Problem Scope & Requirements:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {selectedPs.full_description || selectedPs.short_description}
                </p>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.65rem' }}>
                  Jury Evaluation Rubric (100 Points Total):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(selectedPs.rubric || [
                    'Innovation & Originality (20 pts)',
                    'Technical Feasibility & Architecture (20 pts)',
                    'SDG Alignment & Impact (20 pts)',
                    'Prototype Demonstration (20 pts)',
                    'Pitch Presentation & Q&A (20 pts)'
                  ]).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      <CheckCircle size={15} color="var(--whiz-coral)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPs(null)}>Close</button>
                {onRegister && (
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => {
                      setSelectedPs(null);
                      onRegister();
                    }}
                    style={{ fontWeight: 800 }}
                  >
                    Register With This Problem Statement
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
