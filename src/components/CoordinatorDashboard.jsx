import React, { useState } from 'react';
import { 
  Wrench, Users, CheckCircle, Search, UserCheck, Activity, PackageCheck, Coffee
} from 'lucide-react';

export default function CoordinatorDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [candidates, setCandidates] = useState([
    { id: 'CAND-001', name: 'Arjun Ramanathan', team: 'VISAI-2027-48291', contact: '+91 9876543210', attendance: false },
    { id: 'CAND-003', name: 'Gokul Nath', team: 'VISAI-2027-48291', contact: '+91 9876543212', attendance: true }
  ]);

  const toggleAttendance = (id) => setCandidates(candidates.map(c => c.id === id ? { ...c, attendance: !c.attendance } : c));
  const filteredCandidates = candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.team.toLowerCase().includes(searchTerm.toLowerCase()));

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Activity },
    { id: 'attendance', label: 'Attendance Tracking', icon: Users },
    { id: 'logistics', label: 'Logistics Verification', icon: PackageCheck },
    { id: 'food', label: 'Food & Accommodations', icon: Coffee }
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
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap' }}>Coordinator Panel</h3>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Venue Operations</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'thin', flex: 1, margin: '0 1rem' }} className="no-scrollbar">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: 'none',
                  background: isActive ? '#ecfdf5' : 'transparent', color: isActive ? '#047857' : '#64748b', fontWeight: isActive ? 700 : 600,
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
        
        {['overview', 'logistics', 'food'].includes(activeTab) && (
          <div className="glass-card" style={{ padding: '4rem', background: '#fff', textAlign: 'center' }}>
            <Wrench size={48} color="#94a3b8" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>This coordinator module is currently being provisioned.</p>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Attendance Tracking</h3>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" placeholder="Search..." className="form-input" style={{ paddingLeft: '2.5rem', borderRadius: '9999px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead><tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}><th style={{ padding: '1rem' }}>Candidate</th><th style={{ padding: '1rem' }}>Team ID</th><th style={{ padding: '1rem' }}>Status</th><th style={{ padding: '1rem' }}>Action</th></tr></thead>
                <tbody>
                  {filteredCandidates.map(cand => (
                    <tr key={cand.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}><div style={{ fontWeight: 700 }}>{cand.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cand.id}</div></td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{cand.team}</td>
                      <td style={{ padding: '1rem' }}>{cand.attendance ? <span style={{ padding: '0.3rem 0.6rem', background: '#d1fae5', color: '#059669', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Present</span> : <span style={{ padding: '0.3rem 0.6rem', background: '#fee2e2', color: '#dc2626', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Absent</span>}</td>
                      <td style={{ padding: '1rem' }}><button onClick={() => toggleAttendance(cand.id)} className="btn btn-sm" style={{ background: cand.attendance ? '#f1f5f9' : '#10b981', color: cand.attendance ? '#64748b' : '#fff', borderColor: cand.attendance ? '#cbd5e1' : '#10b981' }}>{cand.attendance ? 'Mark Absent' : <><UserCheck size={14}/> Mark Present</>}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
