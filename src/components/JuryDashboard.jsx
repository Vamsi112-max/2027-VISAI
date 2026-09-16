import React, { useState } from 'react';
import { 
  Award, FileText, ChevronRight, Presentation, Check, Filter, Tag, Target, Users
} from 'lucide-react';

export default function JuryDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [assignedSdg, setAssignedSdg] = useState('SDG 09'); 
  
  const allTeams = [
    { id: 'VISAI-2027-48291', teamName: 'Team ByteCraft', statement: 'VISAI-SDG09-IND03', sdg: 'SDG 09', status: 'Pending Review', marks: null }
  ];

  const [marksForm, setMarksForm] = useState({ innovation: '', technical: '', impact: '', presentation: '', comments: '' });
  const [teams, setTeams] = useState(allTeams);

  const filteredTeams = assignedSdg === 'ALL' ? teams : teams.filter(t => t.sdg === assignedSdg);

  const calculateTotal = () => (Number(marksForm.innovation) || 0) + (Number(marksForm.technical) || 0) + (Number(marksForm.impact) || 0) + (Number(marksForm.presentation) || 0);

  const handleEvaluate = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    setTeams(teams.map(t => t.id === selectedSubmission.id ? { ...t, status: 'Evaluated', marks: total } : t));
    setSelectedSubmission(null);
    setActiveTab('assigned');
    setMarksForm({ innovation: '', technical: '', impact: '', presentation: '', comments: '' });
  };

  const navItems = [
    { id: 'assigned', label: 'Assigned Teams', icon: Users },
    { id: 'evaluation', label: 'Document Evaluation', icon: FileText },
    { id: 'scoreboards', label: 'Final Scoreboards', icon: Target }
  ];

  return (
    <div style={{ padding: '0 1.5rem 2.5rem' }}>
      
      {/* Top Bar Navigation */}
      <div className="glass-card" style={{ 
        marginBottom: '2rem', 
        background: '#fff', 
        position: 'sticky', 
        top: '1rem', 
        zIndex: 50, 
        padding: '0.75rem 1.25rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #d97706, #b45309)', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap' }}>Jury Portal</h3>
            <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>Evaluator Panel</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'thin', flex: 1, margin: '0 1rem' }} className="no-scrollbar">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if(tab.id !== 'evaluation') setSelectedSubmission(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: 'none',
                  background: isActive ? '#fffbeb' : 'transparent', color: isActive ? '#b45309' : '#64748b', fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontSize: '0.85rem'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-sm btn-secondary"
            style={{ 
              borderRadius: '9999px', 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              fontWeight: 700,
              color: '#dc2626',
              borderColor: '#fca5a5',
              background: '#fef2f2',
              whiteSpace: 'nowrap'
            }}
          >
            Logout
          </button>
        )}
      </div>

      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Evaluation Portal</h2></div>
          <div style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Simulate Jury Login:</span>
            <select className="form-input" style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.85rem' }} value={assignedSdg} onChange={e => {setAssignedSdg(e.target.value); setActiveTab('assigned'); setSelectedSubmission(null);}}>
              <option value="SDG 09">SDG 09</option><option value="SDG 11">SDG 11</option><option value="ALL">All SDGs</option>
            </select>
          </div>
        </div>

        {activeTab === 'assigned' && !selectedSubmission && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Assigned Teams</h3>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead><tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}><th style={{ padding: '1rem' }}>Team</th><th style={{ padding: '1rem' }}>SDG</th><th style={{ padding: '1rem' }}>Status</th><th style={{ padding: '1rem' }}>Action</th></tr></thead>
                <tbody>
                  {filteredTeams.map(team => (
                    <tr key={team.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}><div style={{ fontWeight: 700 }}>{team.teamName}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{team.id}</div></td>
                      <td style={{ padding: '1rem' }}>{team.sdg}</td>
                      <td style={{ padding: '1rem' }}>{team.status === 'Evaluated' ? <span style={{color: '#059669', fontWeight: 700}}>Evaluated</span> : <span style={{color: '#d97706', fontWeight: 700}}>Pending</span>}</td>
                      <td style={{ padding: '1rem' }}><button onClick={() => {setSelectedSubmission(team); setActiveTab('evaluation');}} className="btn btn-sm btn-primary">Evaluate</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENT & PROTOTYPE EVALUATION FORM */}
        {activeTab === 'evaluation' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#d97706" /> Interactive Evaluation & Scoring Rubric
            </h3>

            {selectedSubmission ? (
              <form onSubmit={handleEvaluate}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#92400e' }}>Evaluating Team: {selectedSubmission.teamName} ({selectedSubmission.id})</div>
                  <span style={{ fontSize: '0.85rem', color: '#b45309' }}>Statement Code: {selectedSubmission.statement} • Track: {selectedSubmission.sdg}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">1. Innovation & Originality (Max 25 Marks)</label>
                    <input type="number" min="0" max="25" required className="form-input" placeholder="e.g. 23" value={marksForm.innovation} onChange={e => setMarksForm({...marksForm, innovation: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">2. Technical Architecture & Code (Max 25 Marks)</label>
                    <input type="number" min="0" max="25" required className="form-input" placeholder="e.g. 22" value={marksForm.technical} onChange={e => setMarksForm({...marksForm, technical: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">3. SDG & Industrial Impact (Max 25 Marks)</label>
                    <input type="number" min="0" max="25" required className="form-input" placeholder="e.g. 24" value={marksForm.impact} onChange={e => setMarksForm({...marksForm, impact: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">4. MVP Demonstration & Pitch (Max 25 Marks)</label>
                    <input type="number" min="0" max="25" required className="form-input" placeholder="e.g. 23" value={marksForm.presentation} onChange={e => setMarksForm({...marksForm, presentation: e.target.value})} />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Calculated Total Composite Score:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', fontFamily: 'monospace' }}>{calculateTotal()} / 100 Marks</span>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Jury Feedback & Souvenir Publication Recommendation</label>
                  <textarea rows={3} className="form-textarea" placeholder="Provide constructive feedback for student team..." value={marksForm.comments} onChange={e => setMarksForm({...marksForm, comments: e.target.value})}></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#d97706', borderColor: '#d97706', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}>
                  Submit Final Jury Marks & Approve Abstract
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <Users size={36} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <p>Please select a team from the "Assigned Teams" tab to begin evaluation.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FINAL SCOREBOARDS & LEADERBOARD */}
        {activeTab === 'scoreboards' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="#059669" /> Live Evaluated Leaderboard & Scoreboards
            </h3>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem' }}>Rank</th>
                    <th style={{ padding: '1rem' }}>Team & Institution</th>
                    <th style={{ padding: '1rem' }}>SDG Track</th>
                    <th style={{ padding: '1rem' }}>Composite Score</th>
                    <th style={{ padding: '1rem' }}>Souvenir Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#d97706' }}>🥇 #1</td>
                    <td style={{ padding: '1rem' }}><div style={{ fontWeight: 800, color: '#1e293b' }}>VoltGuardians</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIT Tiruchirappalli • VISAI-2027-104</div></td>
                    <td style={{ padding: '1rem' }}>SDG 07</td>
                    <td style={{ padding: '1rem', fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>97 / 100</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#d1fae5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Grand Winner</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#475569' }}>🥈 #2</td>
                    <td style={{ padding: '1rem' }}><div style={{ fontWeight: 800, color: '#1e293b' }}>OmniTrack</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>CEG Guindy • VISAI-2027-102</div></td>
                    <td style={{ padding: '1rem' }}>SDG 11</td>
                    <td style={{ padding: '1rem', fontWeight: 900, color: '#2563eb', fontSize: '1.1rem' }}>94 / 100</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Best Prototype</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#b45309' }}>🥉 #3</td>
                    <td style={{ padding: '1rem' }}><div style={{ fontWeight: 800, color: '#1e293b' }}>Team ByteCraft</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>Vel Tech R&D Institute • VISAI-2027-101</div></td>
                    <td style={{ padding: '1rem' }}>SDG 09</td>
                    <td style={{ padding: '1rem', fontWeight: 900, color: '#2563eb', fontSize: '1.1rem' }}>92 / 100</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Souvenir Published</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
