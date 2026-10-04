import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle, Clock, AlertCircle, ChevronRight,
  LogOut, Star, FileText, ExternalLink, Send, Check,
  Search, Sliders, ShieldCheck, Sparkles, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { juryAPI } from '../hooks/api';
import { fireConfetti } from '../utils/confetti';

export default function JuryDashboard({ onLogout }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'completed'
  const [toastMsg, setToastMsg] = useState('');

  // Fetch real assignments from backend API
  useEffect(() => {
    juryAPI.assignments().then(r => {
      if (r?.data?.assignments && r.data.assignments.length > 0) {
        setAssignments(r.data.assignments);
      }
    }).catch(() => {});
  }, []);

  // Rubric Scores State for Selected Team
  const [rubricScores, setRubricScores] = useState({
    innovation: 22,
    architecture: 22,
    sdg_impact: 23,
    feasibility: 22,
    presentation: 21,
  });
  const [juryComments, setJuryComments] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const openEvaluation = (item) => {
    setSelectedEval(item);
    setRubricScores({
      innovation: item.scores?.innovation || 20,
      architecture: item.scores?.architecture || 20,
      sdg_impact: item.scores?.sdg_impact || 20,
      feasibility: item.scores?.feasibility || 20,
      presentation: 20,
    });
    setJuryComments(item.comments || '');
  };

  const handleSaveEvaluation = (e) => {
    e.preventDefault();
    const total = Object.values(rubricScores).reduce((a, b) => a + Number(b), 0);
    setAssignments(prev => prev.map(a => {
      if (a.id === selectedEval.id) {
        return {
          ...a,
          status: 'completed',
          scores: rubricScores,
          total_score: total,
          comments: juryComments
        };
      }
      return a;
    }));

    // Persist to database
    juryAPI.submitEvaluation(selectedEval.id, {
      scores: [
        { criteria_id: 'crit-innov', score: rubricScores.innovation },
        { criteria_id: 'crit-arch', score: rubricScores.architecture },
        { criteria_id: 'crit-sdg', score: rubricScores.sdg_impact },
        { criteria_id: 'crit-feas', score: rubricScores.feasibility },
        { criteria_id: 'crit-pres', score: rubricScores.presentation },
      ],
      comments: juryComments,
      total_score: total
    }).catch(() => {});

    fireConfetti();
    showToast(`Evaluation for ${selectedEval.team_name} saved to database with score ${total}/100!`);
    setSelectedEval(null);
  };

  const filteredList = assignments.filter(a => {
    if (filterTab === 'pending') return a.status === 'pending';
    if (filterTab === 'completed') return a.status === 'completed';
    return true;
  });

  const completedCount = assignments.filter(a => a.status === 'completed').length;

  return (
    <div style={{ background: 'var(--canvas-bg)', minHeight: '100vh', padding: '2rem 1.5rem 5rem' }}>
      <div className="container">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
            background: 'var(--whiz-dark)', color: '#FFFFFF', padding: '0.9rem 1.5rem',
            borderRadius: 'var(--r-full)', boxShadow: 'var(--shadow-xl)', display: 'flex',
            alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <CheckCircle size={18} color="var(--whiz-coral)" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Jury Portal Header */}
        <div className="bento-card" style={{
          padding: '2rem 2.25rem',
          background: '#FFFFFF',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                INDUSTRY JURY EVALUATION CONSOLE
              </span>
              <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                ● DOUBLE-BLIND RUBRIC ACTIVE
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
              {user?.full_name || 'Dr. Arvind Swaminathan'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
              Specialization: <strong>AI & Cloud Distributed Systems</strong> • Evaluated <strong>{completedCount} of {assignments.length} Teams</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              background: 'var(--pastel-lime-bg)', padding: '0.6rem 1.25rem',
              borderRadius: 'var(--r-xl)', textAlign: 'center', border: '1.5px solid var(--pastel-lime-border)'
            }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--pastel-lime-text)' }}>
                {completedCount} / {assignments.length}
              </span>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pastel-lime-text)' }}>
                COMPLETED
              </div>
            </div>

            <button
              className="btn btn-ghost btn-sm"
              onClick={onLogout}
              style={{ color: '#EF4444', fontWeight: 700 }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Evaluation View or Assigned Submissions List */}
        {selectedEval ? (
          <div className="bento-card" style={{ padding: '2.25rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedEval(null)}
                style={{ fontWeight: 800 }}
              >
                ← Back to All Submissions
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-sky">{selectedEval.ps_code}</span>
                <span className={`badge ${selectedEval.status === 'completed' ? 'badge-lime' : 'badge-coral'}`}>
                  {selectedEval.status === 'completed' ? '✓ Evaluated' : '⏳ Pending'}
                </span>
              </div>
            </div>

            {/* Team Details Strip */}
            <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--pastel-sky-text)', marginBottom: '0.25rem' }}>
                {selectedEval.team_name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--pastel-sky-text)', fontWeight: 700, marginBottom: '0.75rem' }}>
                🏫 {selectedEval.college_name} • {selectedEval.track}
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--pastel-sky-text)', marginBottom: '1rem' }}>
                "{selectedEval.abstract}"
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={selectedEval.submitted_ppt}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-coral btn-sm"
                  style={{ fontSize: '0.8rem', fontWeight: 800 }}
                >
                  <Download size={14} /> Download 5-Slide PPT Deck
                </a>
                <a
                  href={selectedEval.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', fontWeight: 800 }}
                >
                  <ExternalLink size={14} /> Inspect GitHub Repo
                </a>
              </div>
            </div>

            {/* Rubric Sliders Form */}
            <form onSubmit={handleSaveEvaluation}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.25rem' }}>
                Scoring Rubric (5 Standardized Criteria)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { key: 'innovation', label: '1. Innovation, Novelty & Creativity', desc: 'Is the core engineering concept novel compared to standard commercial off-the-shelf solutions?' },
                  { key: 'architecture', label: '2. Technical Architecture & Implementation', desc: 'Soundness of system design, code quality, edge IoT / cloud efficiency, and modularity.' },
                  { key: 'sdg_impact', label: '3. UN SDG Alignment & Real-World Impact', desc: 'Direct measurable contribution towards the targeted Sustainable Development Goal metrics.' },
                  { key: 'feasibility', label: '4. Commercial Feasibility & Prototyping', desc: 'Practicality of manufacturing, cost-benefit ratio, and hardware lab viability.' },
                  { key: 'presentation', label: '5. Presentation & Live Demonstration Clarity', desc: 'Clarity of the 5-slide PPT abstract, circuit schematics, and demo video walk-through.' },
                ].map(crit => (
                  <div key={crit.key} style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>{crit.label}</label>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>
                        {rubricScores[crit.key]} / 20 pts
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{crit.desc}</p>

                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={rubricScores[crit.key]}
                      onChange={e => setRubricScores({ ...rubricScores, [crit.key]: Number(e.target.value) })}
                      style={{ width: '100%', accentColor: 'var(--whiz-coral)' }}
                    />
                  </div>
                ))}
              </div>

              {/* Total Score Banner */}
              <div style={{
                background: 'var(--pastel-lime-bg)', padding: '1.25rem 1.5rem',
                borderRadius: 'var(--r-lg)', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1.5rem', border: '1.5px solid var(--pastel-lime-border)'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--pastel-lime-text)' }}>
                  Total Evaluated Score
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--pastel-lime-text)' }}>
                  {Object.values(rubricScores).reduce((a, b) => a + Number(b), 0)} / 100
                </span>
              </div>

              {/* Qualitative Feedback Textbox */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem', display: 'block' }}>
                  Qualitative Feedback & Recommendations for the Team
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide constructive feedback regarding algorithmic efficiency, hardware component choice, or business model scalability..."
                  value={juryComments}
                  onChange={e => setJuryComments(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.875rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedEval(null)}>Cancel</button>
                <button type="submit" className="btn btn-coral btn-sm" style={{ fontWeight: 800, padding: '0.65rem 1.75rem' }}>
                  <Check size={16} />
                  <span>Lock & Submit Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: 'all', label: `All Teams (${assignments.length})` },
                  { id: 'pending', label: `Pending (${assignments.filter(a => a.status === 'pending').length})` },
                  { id: 'completed', label: `Completed (${completedCount})` },
                ].map(t => (
                  <button
                    key={t.id}
                    className={`filter-pill ${filterTab === t.id ? 'active' : ''}`}
                    onClick={() => setFilterTab(t.id)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignments List or Clean Empty State */}
            {filteredList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--r-lg)', border: '1.5px dashed var(--canvas-border)' }}>
                <Award size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  No Team Submissions Assigned Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>
                  The Super Admin will allocate team project submissions to your SDG specialization track for double-blind rubric evaluation.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredList.map(item => (
                  <div
                    key={item.id}
                    className="bento-card"
                    style={{
                      padding: '1.5rem',
                      background: item.status === 'completed' ? '#FFFFFF' : 'var(--whiz-coral-light)',
                      border: item.status === 'completed' ? '1px solid var(--canvas-border)' : '1.5px solid var(--whiz-coral)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-sky">{item.ps_code}</span>
                        <span className={`badge ${item.status === 'completed' ? 'badge-lime' : 'badge-coral'}`}>
                          {item.status === 'completed' ? `✓ Scored: ${item.total_score}/100` : '⏳ Needs Evaluation'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.2rem' }}>
                        {item.team_name}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        🏫 {item.college_name} • {item.track}
                      </div>
                    </div>

                    <button
                      className={`btn ${item.status === 'completed' ? 'btn-secondary' : 'btn-coral'} btn-sm`}
                      onClick={() => openEvaluation(item)}
                      style={{ fontWeight: 800 }}
                    >
                      {item.status === 'completed' ? 'Review / Edit Marks' : 'Evaluate Prototype →'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
