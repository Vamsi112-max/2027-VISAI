import React, { useState } from 'react';
import { 
  CheckCircle2, UploadCloud, FileText, 
  MapPin, Home, Tent, CreditCard, Check, AlertTriangle,
  LayoutDashboard, Users, Target, Activity, Building, DownloadCloud
} from 'lucide-react';

export default function ParticipantDashboard({ onPublishAbstractToSouvenir, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [teamStatus, setTeamStatus] = useState('Draft'); 
  const [adminComments, setAdminComments] = useState('');
  
  const [teamData, setTeamData] = useState({
    uniqueId: 'VISAI-2027-' + Math.floor(10000 + Math.random() * 90000),
    teamName: 'ByteCraft Innovators',
    problemStatement: 'VISAI-SDG09-IND03',
  });

  const [members, setMembers] = useState([{
    role: 'Team Leader', name: 'Arjun Ramanathan', email: 'arjun@example.com',
    contact: '9876543210', gender: 'Male', age: '20', college: 'SRM Institute',
    address: 'Chennai, Tamil Nadu', year: '3rd Year'
  }]);

  const [uploads, setUploads] = useState({ attempts: 0, abstractText: '', pptFile: null, pdfFile: null });
  const [logistics, setLogistics] = useState({ accommodationRequired: false, arrivalDate: '', stallRequired: false, stallType: '' });

  const handleAddMember = () => {
    setMembers([...members, { role: 'Member', name: '', email: '', contact: '', gender: '', age: '', college: '', address: '', year: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const submitTeamDetails = (e) => {
    e.preventDefault();
    setTeamStatus('Registered');
    setActiveTab('home');
  };

  const handleFileUpload = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setUploads(prev => ({ ...prev, [type]: e.target.files[0].name }));
    }
  };

  const submitDocuments = (e) => {
    e.preventDefault();
    if (uploads.attempts >= 3) return;
    setUploads(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    setTeamStatus('Submitted');
    setAdminComments('Pending Admin Review');
  };

  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: Home },
    { id: 'statement', label: 'Problem Statement', icon: Target },
    { id: 'team', label: 'Team Details Form', icon: Users },
    { id: 'uploads', label: 'Document Submissions', icon: UploadCloud },
    { id: 'stalls', label: 'Exhibition Stalls', icon: Tent },
    { id: 'accommodation', label: 'Accommodation', icon: Building },
    { id: 'receipts', label: 'Verification Receipts', icon: CreditCard }
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
          <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '10px', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap' }}>Participant Panel</h3>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, fontFamily: 'monospace' }}>{teamData.uniqueId}</span>
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
                  background: isActive ? '#eff6ff' : 'transparent', color: isActive ? '#2563eb' : '#475569', fontWeight: isActive ? 700 : 500,
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

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Status Header */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem 2rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Current Registration Phase</h4>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{teamStatus} Status</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Team Identity Number</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>{teamData.uniqueId}</div>
          </div>
        </div>

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="glass-card" style={{ padding: '3rem 2.5rem', background: '#fff', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <LayoutDashboard size={40} color="#64748b" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Welcome to your Participant Panel</h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>Please use the top menu to complete your team details, select your statement, and upload documents.</p>
          </div>
        )}

        {/* TAB 3: TEAM DETAILS COMPREHENSIVE FORM */}
        {activeTab === 'team' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Comprehensive Team Details</h2>
                <p style={{ color: '#64748b', margin: 0 }}>Please fill out all 8 required fields for each member.</p>
              </div>
              <button type="button" onClick={handleAddMember} className="btn btn-sm btn-secondary" style={{ background: '#f1f5f9' }}>+ Add Member</button>
            </div>
            
            <form onSubmit={submitTeamDetails}>
              {members.map((member, index) => (
                <div key={index} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                  <h4 style={{ fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{member.role === 'Team Leader' ? 'Team Leader' : `Team Member ${index}`}</span>
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name</label><input type="text" required className="form-input" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Email Address</label><input type="email" required className="form-input" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Contact Number</label><input type="tel" required className="form-input" value={member.contact} onChange={(e) => handleMemberChange(index, 'contact', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Gender</label><select required className="form-input" value={member.gender} onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Age</label><input type="number" required className="form-input" value={member.age} onChange={(e) => handleMemberChange(index, 'age', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label" style={{ fontSize: '0.8rem' }}>Year of Study</label><input type="text" required className="form-input" placeholder="e.g. 3rd Year" value={member.year} onChange={(e) => handleMemberChange(index, 'year', e.target.value)} /></div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label" style={{ fontSize: '0.8rem' }}>College Name</label><input type="text" required className="form-input" value={member.college} onChange={(e) => handleMemberChange(index, 'college', e.target.value)} /></div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label" style={{ fontSize: '0.8rem' }}>College Address</label><textarea required rows={2} className="form-textarea" value={member.address} onChange={(e) => handleMemberChange(index, 'address', e.target.value)}></textarea></div>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>Save All Team Details</button>
            </form>
          </div>
        )}

        {/* TAB 2: PROBLEM STATEMENT */}
        {activeTab === 'statement' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={22} color="#2563eb" /> Allocated Problem Statement
            </h2>
            
            <div style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {teamData.problemStatement}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                    Predictive Valve Wear & Cavitation Analytics for High-Pressure Hydro Systems
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                    Industry Sponsor: Larsen & Toubro (L&T) Valves • UN SDG 09
                  </span>
                </div>
                <span style={{ background: '#d1fae5', color: '#059669', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>
                  Statement Allocated & Confirmed
                </span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Build an acoustic emission ML model capable of distinguishing laminar fluid flow from internal cavitation vortexes in superheated steam valves. Non-invasive telemetry stack required with real-time browser inferencing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>Technologies & Stack:</strong>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>Python, PyTorch, Audio Signal Processing, WebAssembly (WASM), Next.js, FastAPI, TimescaleDB</span>
                </div>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>Industry Incentive & Contract:</strong>
                  <span style={{ color: '#059669', fontWeight: 700 }}>₹50,000 Direct Pilot Contract + Patent Filing & Incubation Support</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENT SUBMISSIONS */}
        {activeTab === 'uploads' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Document Submissions</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Upload your 6-slide PPT presentation and Technical Abstract PDF for Jury evaluation.</p>
              </div>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                Attempts: {uploads.attempts} of 3 Used
              </span>
            </div>

            <form onSubmit={submitDocuments}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                  <UploadCloud size={36} color="#2563eb" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem' }}>PPT Presentation Slide Deck (.pptx)</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Maximum file size: 25MB • Must follow 6-slide format</p>
                  <input type="file" accept=".ppt,.pptx" onChange={e => handleFileUpload(e, 'pptFile')} style={{ fontSize: '0.85rem' }} />
                  {uploads.pptFile && <div style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>Attached: {uploads.pptFile}</div>}
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                  <FileText size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem' }}>Technical Abstract Document (.pdf)</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Maximum file size: 10MB • For Souvenir publication</p>
                  <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'pdfFile')} style={{ fontSize: '0.85rem' }} />
                  {uploads.pdfFile && <div style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>Attached: {uploads.pdfFile}</div>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Executive Abstract Summary Text</label>
                <textarea rows={4} className="form-textarea" placeholder="Provide a 150-word concise abstract summary of your solution..." value={uploads.abstractText} onChange={e => setUploads({...uploads, abstractText: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={uploads.attempts >= 3} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}>
                {uploads.attempts >= 3 ? 'Maximum Upload Attempts Reached' : 'Submit Documents for Admin & Jury Review'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: EXHIBITION STALLS */}
        {activeTab === 'stalls' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tent size={22} color="#059669" /> Exhibition Stall Registration
            </h2>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', margin: '0 0 0.5rem' }}>Showcase Your Hardware / Prototype at VISAI Tech Expo</h3>
              <p style={{ color: '#047857', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Registered participant teams get priority stall allocation in Hall A & Hall B for live public demonstrations and MNC HR talent acquisition interviews.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Stall Configuration</h4>
                <div className="form-group">
                  <label className="form-label">Stall Category</label>
                  <select className="form-input" value={logistics.stallType} onChange={e => setLogistics({...logistics, stallType: e.target.value, stallRequired: true})}>
                    <option value="">Select Stall Type</option>
                    <option value="Tech Stall">Tech & Prototype Stall (₹1,500 - Covered Booth + 24/7 Power)</option>
                    <option value="Food Stall">Food & Beverage Stall (₹5,000 - Open Quadrangle)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Special Equipment Needs</label>
                  <input type="text" className="form-input" placeholder="e.g. 230V High-Power Outlet, Soldering Ventilation" />
                </div>
                <button type="button" onClick={() => alert('Stall reservation request submitted to Venue Coordinator!')} className="btn btn-primary" style={{ width: '100%', background: '#059669', borderColor: '#059669' }}>
                  Reserve Stall Spot
                </button>
              </div>

              <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Allocated Location</h4>
                <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div><strong>Venue Zone:</strong> Hall A - Maker Space & Demo Booths</div>
                  <div><strong>Power Grid:</strong> 24/7 Uninterrupted Supply</div>
                  <div><strong>Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>Available & Pre-Approved</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ACCOMMODATION */}
        {activeTab === 'accommodation' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={22} color="#7c3aed" /> Campus Accommodation & Logistics
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Hostel & Arrival Request Form</h4>
                <div className="form-group">
                  <label className="form-label">Expected Campus Arrival Date & Time</label>
                  <input type="datetime-local" className="form-input" value={logistics.arrivalDate} onChange={e => setLogistics({...logistics, arrivalDate: e.target.value})} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="accom" checked={logistics.accommodationRequired} onChange={e => setLogistics({...logistics, accommodationRequired: e.target.checked})} />
                  <label htmlFor="accom" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Require Campus Hostel Accommodation (Free for Outstation Teams)</label>
                </div>
                <button type="button" onClick={() => alert('Accommodation request submitted to Campus Coordinator!')} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Submit Accommodation Details
                </button>
              </div>

              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ fontWeight: 800, color: '#6b21a8', marginBottom: '1rem' }}>Campus Gate Pass Info</h4>
                <div style={{ fontSize: '0.85rem', color: '#6b21a8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div><strong>Hostel Block:</strong> Vel Tech Campus Block C</div>
                  <div><strong>Dining Pass:</strong> 24/7 Midnight Food Court Tokens</div>
                  <button type="button" onClick={() => alert('Downloading Gate Pass PDF...')} className="btn btn-sm btn-secondary" style={{ color: '#7c3aed', borderColor: '#c084fc', background: '#fff', marginTop: '0.5rem' }}>
                    <DownloadCloud size={14} /> Download Campus Gate Pass
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RECEIPTS */}
        {activeTab === 'receipts' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={22} color="#2563eb" /> Verification Receipts & Passes
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Registration Payment Receipt</h4>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div><strong>Receipt ID:</strong> <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>REC-VISAI-94182</span></div>
                  <div><strong>Amount Paid:</strong> ₹1,500.00</div>
                  <div><strong>Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>Cleared & Verified</span></div>
                  <div><strong>Payment Date:</strong> September 16, 2026</div>
                </div>
                <button type="button" onClick={() => alert('Downloading Registration Receipt PDF...')} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <DownloadCloud size={16} /> Download Official Payment Receipt
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Team Identity Badge</h4>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div><strong>Team Name:</strong> {teamData.teamName}</div>
                  <div><strong>Team ID:</strong> <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{teamData.uniqueId}</span></div>
                  <div><strong>Lead Member:</strong> Arjun Ramanathan</div>
                  <div><strong>Track:</strong> Software Track</div>
                </div>
                <button type="button" onClick={() => alert('Downloading Official Team ID Badge PDF...')} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <DownloadCloud size={16} /> Download Team ID Badge Pass
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
