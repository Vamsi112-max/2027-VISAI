import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle, XCircle, FileText, 
  Eye, DownloadCloud, AlertTriangle, Users, ClipboardCheck,
  UserPlus, Tag, BarChart3, Radio, Database, Building2, Settings,
  Wrench, Edit3, Image, Type, Layout, LogOut, ArrowUpRight,
  TrendingUp, Activity, Layers, Zap, Clock, BookOpen, Award
} from 'lucide-react';

export default function AdminDashboard({ siteContent, onUpdateSiteContent, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Rich Mock Submissions Data with complete member details & jury assignment
  const [submissions, setSubmissions] = useState([
    { 
      id: 'VISAI-2027-48291', 
      teamName: 'Team ByteCraft Innovators', 
      statementCode: 'VISAI-SDG09-IND03', 
      statementTitle: 'Automated Micro-Grid Energy Balancing & Demand Forecasting for Smart Industrial Plants',
      partner: 'Ashok Leyland / UN SDG 09',
      track: 'Software (36-Hour Hackathon)',
      status: 'Pending Review', 
      assignedJury: '',
      pptFile: 'ByteCraft_Presentation_Draft.pptx', 
      pdfFile: 'ByteCraft_SDG09_Technical_Abstract.pdf', 
      abstractText: 'Our solution implements a real-time IoT edge telemetry stack with predictive neural network demand forecasting to balance renewable micro-grid loads in manufacturing plants.',
      adminAttachment: null,
      rejectionComment: '',
      members: [
        {
          role: 'Team Leader',
          name: 'Arjun Ramanathan',
          email: 'arjun.r@srmist.edu.in',
          contact: '+91 9876543210',
          gender: 'Male',
          age: '20',
          college: 'SRM Institute of Science and Technology',
          address: 'Kattankulathur, Chengalpattu, Tamil Nadu - 603203',
          year: '3rd Year B.Tech CSE'
        },
        {
          role: 'Team Member 2',
          name: 'Kavya Suresh',
          email: 'kavya.s@srmist.edu.in',
          contact: '+91 9876543211',
          gender: 'Female',
          age: '21',
          college: 'SRM Institute of Science and Technology',
          address: 'Kattankulathur, Chengalpattu, Tamil Nadu - 603203',
          year: '3rd Year B.Tech ECE'
        },
        {
          role: 'Team Member 3',
          name: 'Gokul Nath',
          email: 'gokul.n@srmist.edu.in',
          contact: '+91 9876543212',
          gender: 'Male',
          age: '20',
          college: 'SRM Institute of Science and Technology',
          address: 'Kattankulathur, Chengalpattu, Tamil Nadu - 603203',
          year: '3rd Year B.Tech AI & Data Science'
        }
      ]
    },
    { 
      id: 'VISAI-2027-89124', 
      teamName: 'EcoRobotics Nexus', 
      statementCode: 'VISAI-SDG11-HW02', 
      statementTitle: 'Autonomous Waste Sorting & Sensor-Fused Segregation Rover for Smart Cities',
      partner: 'L&T Valves / UN SDG 11',
      track: 'Hardware (7-10 Days Prototype)',
      status: 'Approved', 
      assignedJury: 'JURY-01 (Dr. Ramesh Babu)',
      pptFile: 'EcoRobotics_Hardware_Architecture.pptx', 
      pdfFile: 'EcoRobotics_System_Design_Report.pdf', 
      abstractText: 'A multi-spectral optical sorting rover built with dual LiDAR, load-cell strain gauges, and pneumatic ejectors for automated municipal waste segregation.',
      adminAttachment: 'VISAI_Official_Hardware_Clearance_Pass.pdf',
      rejectionComment: '',
      members: [
        {
          role: 'Team Leader',
          name: 'Priya Dharshini',
          email: 'priya@veltech.edu.in',
          contact: '+91 9712345678',
          gender: 'Female',
          age: '21',
          college: 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute',
          address: 'Avadi, Chennai, Tamil Nadu - 600062',
          year: '4th Year Mechanical'
        },
        {
          role: 'Team Member 2',
          name: 'Rajesh Kannan',
          email: 'rajesh@veltech.edu.in',
          contact: '+91 9712345679',
          gender: 'Male',
          age: '22',
          college: 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute',
          address: 'Avadi, Chennai, Tamil Nadu - 600062',
          year: '4th Year Robotics Engineering'
        }
      ]
    }
  ]);
  const [rejectionComment, setRejectionComment] = useState('');
  const [selectedSubForVerify, setSelectedSubForVerify] = useState(null);
  const [selectedJuryForPush, setSelectedJuryForPush] = useState('');
  const [adminFileUpload, setAdminFileUpload] = useState('');

  // Jury Management
  const [juries, setJuries] = useState([{ id: 'JURY-01', name: 'Dr. Ramesh Babu', email: 'ramesh@visai.in', sdg: 'SDG 09' }]);
  const [newJury, setNewJury] = useState({ name: '', email: '', password: '', sdg: '' });
  const [jurySuccess, setJurySuccess] = useState('');

  // Coordinator Management
  const [coordinators, setCoordinators] = useState([{ id: 'COORD-01', name: 'Srinath K', email: 'srinath@visai.in' }]);
  const [newCoord, setNewCoord] = useState({ name: '', email: '', password: '' });
  const [coordSuccess, setCoordSuccess] = useState('');

  // Rich Default CMS Content Structure covering all sections
  const defaultCMSContent = {
    hero: {
      badge: 'VEL TECH PRESENTS • VISAI 2027 • 17TH EDITION',
      title: siteContent?.hero?.title || 'Real Problems. Real Innovation. Real Impact.',
      description: siteContent?.hero?.description || 'Transforming conventional project exhibitions into a high-octane 36 / 48-Hour SDG & Industry Innovation Hackathon. Direct industry problem statements from Ashok Leyland, Renault Nissan, L&T Valves, and UN SDG targets with peer-reviewed publication in the official VISAI 2027 Innovation Souvenir.',
      exploreCta: 'Explore Industry Challenges',
      souvenirCta: 'Innovation Souvenir Book'
    },
    tracks: {
      title: siteContent?.tracks?.title || 'Dual Release Track System',
      description: siteContent?.tracks?.description || 'Choose your domain. Software teams build from scratch on-spot; Hardware teams get 7-10 days for component sourcing and architecture.',
      softwareDesc: 'Software problem statements are released exclusively at the hackathon venue. Teams ideate, code, integrate models, and deploy working MVPs under official 36/48-hour time constraint.',
      hardwareDesc: 'Hardware challenges released 7-10 days before the event to allow research, component sourcing, and architecture design. Full prototype assembly happens live at the hackathon.'
    },
    sdgs: {
      title: siteContent?.sdgs?.title || 'Industry Challenges & Unique Code System',
      description: siteContent?.sdgs?.description || 'Every problem statement is sourced directly from corporate and research partners and mapped to an official UN SDG goal with a unique identifier like VISAI-SDG06-IND01.',
      sdgHeader: 'UN SDG & Industry Mapped Matrix'
    },
    timeline: {
      title: siteContent?.timeline?.title || 'Hackathon Operations Timeline',
      description: siteContent?.timeline?.description || 'Strict 4-Gate internal evaluation system during the 36/48 hour hackathon.',
      round1: 'Problem & Solution Validation (20% Weightage)',
      round2: 'Technical Review & Architecture Check (25% Weightage)',
      round3: 'Prototype & MVP Demonstration (25% Weightage)',
      round4: 'Grand Jury & Industry Finale (30% Weightage)'
    },
    stalls: {
      title: siteContent?.stalls?.title || 'Interactive Expo & Tech Stalls',
      description: siteContent?.stalls?.description || 'Experience innovation hands-on. Explore leading tech demonstrations, food stalls, and interactive showcases.',
      techStallPrice: '₹1,500 onwards',
      foodStallPrice: '₹5,000 – ₹6,000 onwards',
      expoDesc: 'Designed for hardware component vendors, ed-tech tools, recruitment kiosks, and student-led startup promotions.'
    },
    footer: {
      phone: '+1800 212 7649',
      email: 'visai@veltech.edu.in',
      address: '400 Feet Outer Ring Road, Avadi, Chennai - 600062'
    }
  };

  // CMS Studio & Live Preview States
  const [editorContent, setEditorContent] = useState(defaultCMSContent);
  const [cmsActiveSection, setCmsActiveSection] = useState('hero'); // 'hero' | 'tracks' | 'sdgs' | 'timeline' | 'stalls' | 'footer'
  const [cmsViewMode, setCmsViewMode] = useState('edit'); // 'edit' | 'preview' | 'split'
  const [showSaveSummaryModal, setShowSaveSummaryModal] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');
  const [publishLogs, setPublishLogs] = useState([
    { id: 'PUB-101', timestamp: '1 hour ago', author: 'Super Admin', summary: 'Updated Main Hero Title & Description' },
    { id: 'PUB-102', timestamp: '3 hours ago', author: 'Super Admin', summary: 'Modified Dual Track venue release guidelines' }
  ]);

  const handleApprove = (id) => {
    setSubmissions(submissions.map(sub => sub.id === id ? { ...sub, status: 'Approved' } : sub));
    if (selectedSubForVerify && selectedSubForVerify.id === id) {
      setSelectedSubForVerify(prev => ({ ...prev, status: 'Approved' }));
    }
  };
  const handleReject = (e) => {
    e.preventDefault();
    setSubmissions(submissions.map(sub => sub.id === selectedSubForVerify.id ? { ...sub, status: 'Rejected', comment: rejectionComment } : sub));
    if (selectedSubForVerify) {
      setSelectedSubForVerify(prev => ({ ...prev, status: 'Rejected', comment: rejectionComment }));
    }
    setRejectionComment('');
  };
  const handlePushToJury = (subId, juryId) => {
    if (!juryId) return alert('Please select a Jury member from the list');
    const selectedJury = juries.find(j => j.id === juryId);
    const juryLabel = selectedJury ? `${selectedJury.name} (${selectedJury.id} - ${selectedJury.sdg})` : juryId;
    setSubmissions(submissions.map(sub => sub.id === subId ? { ...sub, assignedJury: juryLabel } : sub));
    if (selectedSubForVerify && selectedSubForVerify.id === subId) {
      setSelectedSubForVerify(prev => ({ ...prev, assignedJury: juryLabel }));
    }
    alert(`Statement & submission data successfully pushed to Jury: ${juryLabel}`);
  };
  const handleAdminUploadAttachment = (subId, fileName) => {
    if (!fileName) return;
    setSubmissions(submissions.map(sub => sub.id === subId ? { ...sub, adminAttachment: fileName } : sub));
    if (selectedSubForVerify && selectedSubForVerify.id === subId) {
      setSelectedSubForVerify(prev => ({ ...prev, adminAttachment: fileName }));
    }
    alert(`Attachment "${fileName}" successfully attached by Admin to team ${subId}`);
  };
  const handleCreateJury = (e) => {
    e.preventDefault();
    const id = `JURY-${Math.floor(10 + Math.random() * 90)}`;
    setJuries([...juries, { id, name: newJury.name, email: newJury.email, sdg: newJury.sdg }]);
    setNewJury({ name: '', email: '', password: '', sdg: '' });
    setJurySuccess(`Jury account created: ${id}`);
    setTimeout(() => setJurySuccess(''), 5000);
  };
  const handleCreateCoord = (e) => {
    e.preventDefault();
    const id = `COORD-${Math.floor(10 + Math.random() * 90)}`;
    setCoordinators([...coordinators, { id, name: newCoord.name, email: newCoord.email }]);
    setNewCoord({ name: '', email: '', password: '' });
    setCoordSuccess(`Coordinator account created: ${id}`);
    setTimeout(() => setCoordSuccess(''), 5000);
  };

  const handleOpenSaveSummary = (e) => {
    e.preventDefault();
    setShowSaveSummaryModal(true);
  };

  const handleConfirmPublishCMS = () => {
    onUpdateSiteContent(editorContent);
    const newLog = {
      id: `PUB-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      author: 'Super Admin',
      summary: `Updated Website Content (${cmsActiveSection.toUpperCase()} & Multi-Section Live Elements)`
    };
    setPublishLogs([newLog, ...publishLogs]);
    setShowSaveSummaryModal(false);
    setPublishSuccessMsg('Website content successfully published live to the public server!');
    setTimeout(() => setPublishSuccessMsg(''), 6000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'jury', label: 'Jury Accounts', icon: UserPlus },
    { id: 'coordinator', label: 'Coordinator Accounts', icon: Wrench },
    { id: 'cms', label: 'Website CMS Studio', icon: Edit3 },
    { id: 'preview', label: 'Live Site Preview', icon: Eye },
    { id: 'audit', label: 'Publish Audit Logs', icon: Clock },
    { id: 'receipts', label: 'Receipts', icon: FileText },
    { id: 'problems', label: 'Statements', icon: Database },
    { id: 'college', label: 'Colleges', icon: Building2 },
    { id: 'broadcast', label: 'Broadcasts', icon: Radio },
    { id: 'tracks', label: 'Tracks', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div style={{ padding: '0 1.5rem 2.5rem' }}>
      
      {/* Top Bar Navigation matching exact UI reference */}
      <div style={{ 
        marginBottom: '2rem', 
        background: '#ffffff', 
        position: 'sticky', 
        top: '0.75rem', 
        zIndex: 50, 
        padding: '0.6rem 1.25rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '1.25rem',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Left Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            background: '#dc2626', 
            borderRadius: '12px', 
            color: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(220, 38, 38, 0.25)'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              VISAI 2027 Admin
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginTop: '1px' }}>
              SUPER ADMIN PANEL
            </span>
          </div>
        </div>

        {/* Center Nav Items Tabs */}
        <nav style={{ 
          display: 'flex', 
          gap: '0.35rem', 
          overflowX: 'auto', 
          padding: '0.2rem 0', 
          flex: 1, 
          margin: '0 0.5rem',
          scrollbarWidth: 'thin'
        }}>
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.45rem', 
                  padding: '0.5rem 0.9rem', 
                  borderRadius: '10px', 
                  border: 'none',
                  background: isActive ? '#fef2f2' : 'transparent', 
                  color: isActive ? '#dc2626' : '#475569', 
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer', 
                  transition: 'all 0.15s ease-in-out', 
                  whiteSpace: 'nowrap', 
                  fontSize: '0.865rem'
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right: Logout Pill Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              borderRadius: '9999px',
              padding: '0.5rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#dc2626',
              border: '1px solid #fecdd3',
              background: '#fff1f2',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              boxShadow: '0 2px 6px rgba(225, 29, 72, 0.08)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff1f2'}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* TAB 1: OVERVIEW & MASTER DASHBOARD CONTROL CENTER */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Metrics KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              
              <div className="glass-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Registered Teams</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0 0' }}>1,420</h3>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '12px', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
                  <TrendingUp size={14} /> <span>+14.2% from last week</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Approved Submissions</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', margin: '0.25rem 0 0' }}>890</h3>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: '#ecfdf5', borderRadius: '12px', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={22} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                  <span>Verified PPT & PDF Abstracts</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pending Jury Review</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', margin: '0.25rem 0 0' }}>340</h3>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: '#fffbeb', borderRadius: '12px', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={22} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                  <span>Assigned to {juries.length + 14} Jury Experts</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue Cleared</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', margin: '0.25rem 0 0' }}>₹14.2L</h3>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: '#f3e8ff', borderRadius: '12px', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
                  <span>100% Verification Receipts Issued</span>
                </div>
              </div>

            </div>

            {/* Main Operational Analysis Section (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
              
              {/* Left Column: Charts, Track Split, UN SDGs & Gate Progression */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Track Split & Domain Distribution */}
                <div className="glass-card" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={20} color="#2563eb" /> Track Distribution (Software vs. Hardware)
                  </h3>
                  
                  {/* Visual Split Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      <span style={{ color: '#2563eb' }}>Software Track (62% - 880 Teams)</span>
                      <span style={{ color: '#059669' }}>Hardware Track (38% - 540 Teams)</span>
                    </div>
                    <div style={{ height: '14px', width: '100%', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '62%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
                      <div style={{ width: '38%', background: 'linear-gradient(90deg, #10b981, #059669)' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Software Domain</span>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#1e3a8a' }}>36-Hour Continuous Coding • On-spot Problem Statements</p>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>Hardware Domain</span>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#064e3b' }}>7-10 Days Advance Problem Statement Release for Prototyping</p>
                    </div>
                  </div>
                </div>

                {/* 4-Gate Hackathon Progression Tracker */}
                <div className="glass-card" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={20} color="#d97706" /> 4-Gate Operational Pipeline Status
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                    
                    <div style={{ background: '#f8fafc', padding: '1.25rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '32px', height: '32px', background: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '0.85rem' }}>G1</div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Gate 1</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Abstract Verification</span>
                      <div style={{ marginTop: '0.75rem', padding: '0.25rem', background: '#d1fae5', color: '#059669', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>85% Done</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.25rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '32px', height: '32px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '0.85rem' }}>G2</div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Gate 2</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Prototype Review</span>
                      <div style={{ marginTop: '0.75rem', padding: '0.25rem', background: '#fef3c7', color: '#d97706', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>40% Active</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.25rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '0.85rem' }}>G3</div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Gate 3</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Jury Pitching</span>
                      <div style={{ marginTop: '0.75rem', padding: '0.25rem', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Pending</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.25rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '0.85rem' }}>G4</div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Gate 4</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Souvenir & Prizes</span>
                      <div style={{ marginTop: '0.75rem', padding: '0.25rem', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Upcoming</div>
                    </div>

                  </div>
                </div>

                {/* Top Participating Colleges Leaderboard */}
                <div className="glass-card" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={20} color="#7c3aed" /> Top Participating Colleges
                  </h3>
                  
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Institution</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Registered Teams</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Verification Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>#1</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e293b' }}>Vel Tech Rangarajan Dr. Sagunthala R&D Institute</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>142 Teams</td>
                          <td style={{ padding: '0.85rem 1rem' }}><span style={{ background: '#d1fae5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>100% Cleared</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>#2</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e293b' }}>SRM Institute of Science and Technology</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>118 Teams</td>
                          <td style={{ padding: '0.85rem 1rem' }}><span style={{ background: '#d1fae5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>98% Cleared</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>#3</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e293b' }}>Anna University (CEG Campus)</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>95 Teams</td>
                          <td style={{ padding: '0.85rem 1rem' }}><span style={{ background: '#d1fae5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>95% Cleared</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>#4</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1e293b' }}>Indian Institute of Technology (IIT) Madras</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>64 Teams</td>
                          <td style={{ padding: '0.85rem 1rem' }}><span style={{ background: '#d1fae5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>100% Cleared</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column: Quick Action Shortcuts & Live Activity Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Quick Action Command Center */}
                <div className="glass-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={18} color="#ef4444" /> Quick Admin Controls
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    <button 
                      onClick={() => setActiveTab('submissions')}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ClipboardCheck size={16} color="#059669"/> Review Submissions</span>
                      <span style={{ background: '#ef4444', color: '#fff', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>1 Pending</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('jury')}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserPlus size={16} color="#dc2626"/> Add Jury Account</span>
                      <ArrowUpRight size={16} color="#64748b" />
                    </button>

                    <button 
                      onClick={() => setActiveTab('coordinator')}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wrench size={16} color="#059669"/> Add Coordinator Account</span>
                      <ArrowUpRight size={16} color="#64748b" />
                    </button>

                    <button 
                      onClick={() => setActiveTab('cms')}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit3 size={16} color="#2563eb"/> Edit Live Website (CMS)</span>
                      <ArrowUpRight size={16} color="#64748b" />
                    </button>

                  </div>
                </div>

                {/* Live System Activity Feed Stream */}
                <div className="glass-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} color="#2563eb" /> Live Activity Feed
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                    
                    <div style={{ borderLeft: '3px solid #059669', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Team ByteCraft uploaded PPT & PDF</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Just now • VISAI-2027-48291</span>
                    </div>

                    <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Dr. Ramesh Babu evaluated statement</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>12 mins ago • SDG 09 Track</span>
                    </div>

                    <div style={{ borderLeft: '3px solid #d97706', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Coordinator Srinath checked in 4 candidates</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>45 mins ago • Venue Gate B</span>
                    </div>

                    <div style={{ borderLeft: '3px solid #7c3aed', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Website CMS hero text updated</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>1 hour ago • Admin Action</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Placeholder for remaining tabs */}
        {['problems', 'college', 'broadcast', 'tracks', 'settings'].includes(activeTab) && (
          <div className="glass-card" style={{ padding: '6rem 2rem', background: '#fff', textAlign: 'center' }}>
            <Database size={48} color="#94a3b8" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>This administrative module is currently being provisioned. Data tables and configurations will appear here soon.</p>
          </div>
        )}

        {/* TAB: WEBSITE CMS STUDIO SUITE */}
        {activeTab === 'cms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* CMS Header & Section Selector Toolbar */}
            <div className="glass-card" style={{ padding: '1.75rem 2.25rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={24} color="#2563eb" /> Live Website CMS Studio
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Select any website section to edit titles, descriptions, track details, stall prices, and helpline data.</p>
              </div>

              {/* View Mode Toggle: Edit vs Live Preview */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.3rem', borderRadius: '10px', gap: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => setCmsViewMode('edit')}
                  className="btn btn-sm"
                  style={{
                    background: cmsViewMode === 'edit' ? '#fff' : 'transparent',
                    color: cmsViewMode === 'edit' ? '#2563eb' : '#64748b',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: cmsViewMode === 'edit' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                    border: 'none',
                    fontSize: '0.8rem'
                  }}
                >
                  <Edit3 size={14} /> Edit Form
                </button>
                <button
                  type="button"
                  onClick={() => setCmsViewMode('preview')}
                  className="btn btn-sm"
                  style={{
                    background: cmsViewMode === 'preview' ? '#fff' : 'transparent',
                    color: cmsViewMode === 'preview' ? '#2563eb' : '#64748b',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: cmsViewMode === 'preview' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                    border: 'none',
                    fontSize: '0.8rem'
                  }}
                >
                  <Eye size={14} /> Live Canvas Preview
                </button>
              </div>
            </div>

            {publishSuccessMsg && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} /> {publishSuccessMsg}
              </div>
            )}

            {/* CMS Section Pills Navigation Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
              {[
                { id: 'hero', label: 'Main Hero Banner', icon: Type },
                { id: 'tracks', label: 'Dual Release Tracks', icon: Tag },
                { id: 'sdgs', label: 'Problem Statements & SDGs', icon: Database },
                { id: 'timeline', label: 'Operations Timeline', icon: Clock },
                { id: 'stalls', label: 'Expo & Tech Stalls', icon: Building2 },
                { id: 'footer', label: 'Footer & Helpline Contacts', icon: Layout }
              ].map(sec => {
                const Icon = sec.icon;
                const isActive = cmsActiveSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setCmsActiveSection(sec.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', borderRadius: '9999px', border: '1px solid',
                      borderColor: isActive ? '#2563eb' : '#e2e8f0', background: isActive ? '#eff6ff' : '#fff', color: isActive ? '#2563eb' : '#64748b',
                      fontWeight: isActive ? 800 : 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontSize: '0.85rem'
                    }}
                  >
                    <Icon size={15} />
                    <span>{sec.label}</span>
                  </button>
                )
              })}
            </div>

            {/* MAIN CMS FORM & LIVE CANVAS VIEW */}
            {cmsViewMode === 'edit' && (
              <form onSubmit={handleOpenSaveSummary}>
                <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  
                  {/* SECTION 1: HERO */}
                  {cmsActiveSection === 'hero' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Type size={18} color="#2563eb" /> Edit Main Hero Section
                      </h3>
                      <div className="form-group">
                        <label className="form-label">Top Announcement Badge Text</label>
                        <input type="text" className="form-input" value={editorContent.hero.badge} onChange={e => setEditorContent({...editorContent, hero: {...editorContent.hero, badge: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Main Headline / Hero Title</label>
                        <input type="text" className="form-input" style={{ fontWeight: 700 }} value={editorContent.hero.title} onChange={e => setEditorContent({...editorContent, hero: {...editorContent.hero, title: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Hero Description Subtitle</label>
                        <textarea rows={4} className="form-textarea" value={editorContent.hero.description} onChange={e => setEditorContent({...editorContent, hero: {...editorContent.hero, description: e.target.value}})}></textarea>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Primary Action Button Label</label>
                          <input type="text" className="form-input" value={editorContent.hero.exploreCta} onChange={e => setEditorContent({...editorContent, hero: {...editorContent.hero, exploreCta: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Secondary Action Button Label</label>
                          <input type="text" className="form-input" value={editorContent.hero.souvenirCta} onChange={e => setEditorContent({...editorContent, hero: {...editorContent.hero, souvenirCta: e.target.value}})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: TRACKS */}
                  {cmsActiveSection === 'tracks' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={18} color="#059669" /> Edit Dual Release Tracks (SW & HW)
                      </h3>
                      <div className="form-group">
                        <label className="form-label">Track Section Header Title</label>
                        <input type="text" className="form-input" value={editorContent.tracks.title} onChange={e => setEditorContent({...editorContent, tracks: {...editorContent.tracks, title: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Track Overview Subtitle</label>
                        <textarea rows={2} className="form-textarea" value={editorContent.tracks.description} onChange={e => setEditorContent({...editorContent, tracks: {...editorContent.tracks, description: e.target.value}})}></textarea>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Software Track (36/48-Hour On-Spot) Details</label>
                        <textarea rows={3} className="form-textarea" value={editorContent.tracks.softwareDesc} onChange={e => setEditorContent({...editorContent, tracks: {...editorContent.tracks, softwareDesc: e.target.value}})}></textarea>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Hardware Track (7-10 Days Pre-Release) Details</label>
                        <textarea rows={3} className="form-textarea" value={editorContent.tracks.hardwareDesc} onChange={e => setEditorContent({...editorContent, tracks: {...editorContent.tracks, hardwareDesc: e.target.value}})}></textarea>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: SDGS */}
                  {cmsActiveSection === 'sdgs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={18} color="#d97706" /> Edit Problem Statements & UN SDG Section
                      </h3>
                      <div className="form-group">
                        <label className="form-label">Problem Statements Header Title</label>
                        <input type="text" className="form-input" value={editorContent.sdgs.title} onChange={e => setEditorContent({...editorContent, sdgs: {...editorContent.sdgs, title: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Statements Subtitle & Description</label>
                        <textarea rows={3} className="form-textarea" value={editorContent.sdgs.description} onChange={e => setEditorContent({...editorContent, sdgs: {...editorContent.sdgs, description: e.target.value}})}></textarea>
                      </div>
                      <div className="form-group">
                        <label className="form-label">UN SDG 2030 Matrix Banner Label</label>
                        <input type="text" className="form-input" value={editorContent.sdgs.sdgHeader} onChange={e => setEditorContent({...editorContent, sdgs: {...editorContent.sdgs, sdgHeader: e.target.value}})} />
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: TIMELINE */}
                  {cmsActiveSection === 'timeline' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} color="#7c3aed" /> Edit Operations Timeline & Evaluation Rounds
                      </h3>
                      <div className="form-group">
                        <label className="form-label">Timeline Section Title</label>
                        <input type="text" className="form-input" value={editorContent.timeline.title} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, title: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Timeline Description</label>
                        <textarea rows={2} className="form-textarea" value={editorContent.timeline.description} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, description: e.target.value}})}></textarea>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Round 1 Evaluation Title & Weightage</label>
                          <input type="text" className="form-input" value={editorContent.timeline.round1} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, round1: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Round 2 Evaluation Title & Weightage</label>
                          <input type="text" className="form-input" value={editorContent.timeline.round2} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, round2: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Round 3 Evaluation Title & Weightage</label>
                          <input type="text" className="form-input" value={editorContent.timeline.round3} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, round3: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Round 4 Grand Jury Finale Weightage</label>
                          <input type="text" className="form-input" value={editorContent.timeline.round4} onChange={e => setEditorContent({...editorContent, timeline: {...editorContent.timeline, round4: e.target.value}})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 5: STALLS */}
                  {cmsActiveSection === 'stalls' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} color="#dc2626" /> Edit Interactive Expo & Tech Stalls
                      </h3>
                      <div className="form-group">
                        <label className="form-label">Expo Section Title</label>
                        <input type="text" className="form-input" value={editorContent.stalls.title} onChange={e => setEditorContent({...editorContent, stalls: {...editorContent.stalls, title: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Expo Description</label>
                        <textarea rows={2} className="form-textarea" value={editorContent.stalls.description} onChange={e => setEditorContent({...editorContent, stalls: {...editorContent.stalls, description: e.target.value}})}></textarea>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Tech / Business Stall Pricing</label>
                          <input type="text" className="form-input" value={editorContent.stalls.techStallPrice} onChange={e => setEditorContent({...editorContent, stalls: {...editorContent.stalls, techStallPrice: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Food & Beverage Stall Pricing</label>
                          <input type="text" className="form-input" value={editorContent.stalls.foodStallPrice} onChange={e => setEditorContent({...editorContent, stalls: {...editorContent.stalls, foodStallPrice: e.target.value}})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 6: FOOTER */}
                  {cmsActiveSection === 'footer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layout size={18} color="#2563eb" /> Edit Footer & Helpline Information
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Helpline Phone Number</label>
                          <input type="text" className="form-input" value={editorContent.footer.phone} onChange={e => setEditorContent({...editorContent, footer: {...editorContent.footer, phone: e.target.value}})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Official Contact Email</label>
                          <input type="text" className="form-input" value={editorContent.footer.email} onChange={e => setEditorContent({...editorContent, footer: {...editorContent.footer, email: e.target.value}})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Campus & Event Venue Address</label>
                        <input type="text" className="form-input" value={editorContent.footer.address} onChange={e => setEditorContent({...editorContent, footer: {...editorContent.footer, address: e.target.value}})} />
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 800, background: '#2563eb', borderColor: '#2563eb' }}>
                      Save Updates & Review Change Summary
                    </button>
                  </div>

                </div>
              </form>
            )}

            {/* LIVE CANVAS PREVIEW */}
            {cmsViewMode === 'preview' && (
              <div className="glass-card" style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Real-Time Live Website Canvas Preview</h3>
                  <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>Live Data Sync Active</span>
                </div>

                <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                  
                  {/* Hero Canvas */}
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>{editorContent.hero.badge}</span>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginTop: '1rem', marginBottom: '1rem' }}>{editorContent.hero.title}</h1>
                    <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '700px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>{editorContent.hero.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>{editorContent.hero.exploreCta}</button>
                      <button className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>{editorContent.hero.souvenirCta}</button>
                    </div>
                  </div>

                  {/* Tracks Canvas */}
                  <div style={{ padding: '2rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', color: '#0f172a' }}>{editorContent.tracks.title}</h2>
                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>{editorContent.tracks.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '12px' }}>
                        <h4 style={{ fontWeight: 800, color: '#1e40af', margin: '0 0 0.5rem' }}>Software Track (36 Hours)</h4>
                        <p style={{ fontSize: '0.85rem', color: '#1e3a8a', margin: 0 }}>{editorContent.tracks.softwareDesc}</p>
                      </div>
                      <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '12px' }}>
                        <h4 style={{ fontWeight: 800, color: '#065f46', margin: '0 0 0.5rem' }}>Hardware Track (7-10 Days)</h4>
                        <p style={{ fontSize: '0.85rem', color: '#064e3b', margin: 0 }}>{editorContent.tracks.hardwareDesc}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SAVE SUMMARY MODAL */}
            {showSaveSummaryModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
                <div className="glass-card" style={{ background: '#fff', width: '100%', maxWidth: '650px', padding: '2rem', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={22} color="#059669" /> Website Publish Change Summary
                    </h3>
                    <button onClick={() => setShowSaveSummaryModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><XCircle size={22} /></button>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Please review the updated website content summary below before publishing live to the public server:
                  </p>

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div><strong style={{ color: '#2563eb' }}>• Target Section:</strong> {cmsActiveSection.toUpperCase()}</div>
                    <div><strong style={{ color: '#1e293b' }}>• Hero Title:</strong> "{editorContent.hero.title}"</div>
                    <div><strong style={{ color: '#1e293b' }}>• Track Strategy:</strong> "{editorContent.tracks.title}"</div>
                    <div><strong style={{ color: '#1e293b' }}>• Expo Stall Pricing:</strong> {editorContent.stalls.techStallPrice}</div>
                    <div><strong style={{ color: '#1e293b' }}>• Contact Helpline:</strong> {editorContent.footer.phone}</div>
                    <div><strong style={{ color: '#059669' }}>• Author & Server:</strong> Super Admin (Live Server Broadcast Ready)</div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setShowSaveSummaryModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '0.85rem' }}>
                      Cancel & Edit More
                    </button>
                    <button type="button" onClick={handleConfirmPublishCMS} className="btn btn-primary" style={{ flex: 1.5, background: '#059669', borderColor: '#059669', padding: '0.85rem', fontWeight: 800 }}>
                      Confirm & Push Live to Site
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: LIVE SITE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={24} color="#2563eb" /> Live Public Website Preview
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Inspect how the landing page renders for public visitors with your live CMS content.</p>

            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>{editorContent.hero.badge}</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginTop: '1rem' }}>{editorContent.hero.title}</h1>
                <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '750px', margin: '1rem auto 2rem' }}>{editorContent.hero.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PUBLISH AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={24} color="#7c3aed" /> Website CMS Publish Audit Logs
            </h2>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem' }}>Log ID</th>
                    <th style={{ padding: '1rem' }}>Timestamp</th>
                    <th style={{ padding: '1rem' }}>Author / Admin</th>
                    <th style={{ padding: '1rem' }}>Change Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {publishLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{log.id}</td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{log.timestamp}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>{log.author}</td>
                      <td style={{ padding: '1rem', color: '#334155' }}>{log.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: COORDINATOR MANAGEMENT */}
        {activeTab === 'coordinator' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Coordinator Account Creation</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={18} color="#059669"/> Add Coordinator
                </h3>
                {coordSuccess && <div style={{ background: '#ecfdf5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>{coordSuccess}</div>}
                <form onSubmit={handleCreateCoord}>
                  <div className="form-group"><label className="form-label">Name</label>
                    <input type="text" required className="form-input" value={newCoord.name} onChange={e => setNewCoord({...newCoord, name: e.target.value})} placeholder="e.g. Srinath K" />
                  </div>
                  <div className="form-group"><label className="form-label">Email</label>
                    <input type="email" required className="form-input" value={newCoord.email} onChange={e => setNewCoord({...newCoord, email: e.target.value})} />
                  </div>
                  <div className="form-group"><label className="form-label">Password</label>
                    <input type="text" required className="form-input" value={newCoord.password} onChange={e => setNewCoord({...newCoord, password: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#059669', borderColor: '#059669' }}>Create Coordinator Account</button>
                </form>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Active Coordinators</h3>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead><tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}><th style={{ padding: '0.75rem 1rem' }}>Details</th></tr></thead>
                    <tbody>
                      {coordinators.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1rem' }}><div style={{ fontWeight: 700, color: '#1e293b' }}>{c.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.email} • {c.id}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: JURY MANAGEMENT */}
        {activeTab === 'jury' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Jury Creation & Assignment</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={18} color="#dc2626"/> Add New Jury Account
                </h3>
                {jurySuccess && <div style={{ background: '#ecfdf5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>{jurySuccess}</div>}
                <form onSubmit={handleCreateJury}>
                  <div className="form-group">
                    <label className="form-label">Jury Name</label>
                    <input type="text" required className="form-input" value={newJury.name} onChange={e => setNewJury({...newJury, name: e.target.value})} placeholder="e.g. Dr. Rajesh Kumar" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" required className="form-input" value={newJury.email} onChange={e => setNewJury({...newJury, email: e.target.value})} placeholder="rajesh@university.edu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Temporary Password</label>
                    <input type="text" required className="form-input" value={newJury.password} onChange={e => setNewJury({...newJury, password: e.target.value})} placeholder="Password123!" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign SDG Track / Topic</label>
                    <select required className="form-input" value={newJury.sdg} onChange={e => setNewJury({...newJury, sdg: e.target.value})}>
                      <option value="">-- Select SDG Assignment --</option>
                      <option value="SDG 09">SDG 09: Industry, Innovation and Infrastructure</option>
                      <option value="SDG 11">SDG 11: Sustainable Cities and Communities</option>
                      <option value="SDG 04">SDG 04: Quality Education</option>
                      <option value="ALL">All Categories</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#dc2626', borderColor: '#dc2626' }}>Create & Activate Jury</button>
                </form>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Active Jury Members</h3>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead><tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}><th style={{ padding: '0.75rem 1rem' }}>Jury Details</th><th style={{ padding: '0.75rem 1rem' }}>Assigned SDG</th></tr></thead>
                    <tbody>
                      {juries.map(j => (
                        <tr key={j.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1rem' }}><div style={{ fontWeight: 700, color: '#1e293b' }}>{j.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{j.email} • {j.id}</div></td>
                          <td style={{ padding: '1rem' }}><span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Tag size={12}/> {j.sdg}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SUBMISSION VERIFICATION */}
        {activeTab === 'submissions' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Submission Approvals & Jury Allocation</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Review full team profiles, verify PPT/PDF abstracts, assign to Jury, or attach updated statements.</p>
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem' }}>Team Details</th>
                    <th style={{ padding: '1rem' }}>Statement & Track</th>
                    <th style={{ padding: '1rem' }}>Documents</th>
                    <th style={{ padding: '1rem' }}>Assigned Jury</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{sub.teamName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{sub.id}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        <div style={{ fontWeight: 700, color: '#2563eb' }}>{sub.statementCode}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub.track}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {sub.pptFile && <span style={{ padding: '0.2rem 0.5rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>PPT</span>}
                          {sub.pdfFile && <span style={{ padding: '0.2rem 0.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>PDF</span>}
                          {sub.adminAttachment && <span style={{ padding: '0.2rem 0.5rem', background: '#ecfdf5', color: '#059669', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Admin File</span>}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {sub.assignedJury ? (
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <UserPlus size={12}/> {sub.assignedJury}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: sub.status === 'Approved' ? '#d1fae5' : sub.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: sub.status === 'Approved' ? '#059669' : sub.status === 'Rejected' ? '#dc2626' : '#d97706' }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button onClick={() => setSelectedSubForVerify(sub)} className="btn btn-sm btn-primary" style={{ background: '#0f172a', borderColor: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                          <Eye size={14} /> Full Application Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FULL APPLICATION PROFILE MODAL */}
            {selectedSubForVerify && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
                <div className="glass-card" style={{ background: '#fff', width: '100%', maxWidth: '1050px', maxHeight: '92vh', overflowY: 'auto', padding: '0', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  
                  {/* Modal Header */}
                  <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10, borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Application Profile: {selectedSubForVerify.teamName}</h3>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{selectedSubForVerify.id}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Track: {selectedSubForVerify.track}</span>
                    </div>
                    <button onClick={() => setSelectedSubForVerify(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><XCircle size={26} /></button>
                  </div>

                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* SECTION 1: PROBLEM STATEMENT & PARTNER DETAILS */}
                    <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                      <h4 style={{ fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={18} color="#2563eb" /> Problem Statement & Partner Sponsorship
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Statement Code & Title</span>
                          <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '1rem' }}>{selectedSubForVerify.statementCode}</div>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '0.25rem' }}>{selectedSubForVerify.statementTitle}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Mapped Partner / UN SDG</span>
                          <div style={{ fontWeight: 700, color: '#059669', marginTop: '0.25rem' }}>{selectedSubForVerify.partner}</div>
                        </div>
                      </div>
                      {selectedSubForVerify.abstractText && (
                        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                          <strong>Technical Abstract Summary:</strong> {selectedSubForVerify.abstractText}
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: ADMIN PUSH TO JURY & STATEMENT ATTACHMENT CONTROLS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      
                      {/* Push to Jury */}
                      <div style={{ padding: '1.5rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '14px' }}>
                        <h4 style={{ fontWeight: 800, color: '#6b21a8', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <UserPlus size={18} color="#7c3aed" /> Admin Push to Jury
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#6b21a8', marginBottom: '1rem' }}>Assign this application & statement to a designated Jury member for scoring.</p>
                        
                        {selectedSubForVerify.assignedJury ? (
                          <div style={{ background: '#f3e8ff', color: '#6b21a8', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Currently Assigned to: {selectedSubForVerify.assignedJury}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', fontStyle: 'italic' }}>Not pushed to Jury yet.</div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select 
                            className="form-input" 
                            style={{ flex: 1, fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                            value={selectedJuryForPush}
                            onChange={(e) => setSelectedJuryForPush(e.target.value)}
                          >
                            <option value="">-- Select Jury Expert --</option>
                            {juries.map(j => (
                              <option key={j.id} value={j.id}>{j.name} ({j.id} - {j.sdg})</option>
                            ))}
                          </select>
                          <button 
                            type="button"
                            onClick={() => handlePushToJury(selectedSubForVerify.id, selectedJuryForPush)}
                            className="btn btn-primary"
                            style={{ background: '#7c3aed', borderColor: '#7c3aed', fontSize: '0.85rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
                          >
                            Push to Jury
                          </button>
                        </div>
                      </div>

                      {/* Admin Attach Custom Statement / Document */}
                      <div style={{ padding: '1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px' }}>
                        <h4 style={{ fontWeight: 800, color: '#065f46', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <UploadCloud size={18} color="#059669" /> Attach Admin Statement / File
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#065f46', marginBottom: '1rem' }}>Upload modified problem statements or official feedback for this team.</p>
                        
                        {selectedSubForVerify.adminAttachment && (
                          <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Attached: {selectedSubForVerify.adminAttachment}</span>
                            <a href={`#download-${selectedSubForVerify.adminAttachment}`} onClick={(e) => { e.preventDefault(); alert(`Downloading Admin File: ${selectedSubForVerify.adminAttachment}`); }} style={{ color: '#059669', fontWeight: 800 }}>Download</a>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ flex: 1, fontSize: '0.85rem', padding: '0.4rem 0.6rem' }} 
                            placeholder="Enter File Name e.g. Updated_Statement.pdf"
                            value={adminFileUpload}
                            onChange={(e) => setAdminFileUpload(e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => { handleAdminUploadAttachment(selectedSubForVerify.id, adminFileUpload); setAdminFileUpload(''); }}
                            className="btn btn-primary"
                            style={{ background: '#059669', borderColor: '#059669', fontSize: '0.85rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
                          >
                            Attach File
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* SECTION 3: UPLOADED SUBMISSION DOCUMENTS & DOWNLOADS */}
                    <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                      <h4 style={{ fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} color="#2563eb" /> Submitted Documents & Download Files
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        
                        <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Presentation Slide Deck</span>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginTop: '0.2rem' }}>{selectedSubForVerify.pptFile || 'No PPT Uploaded'}</div>
                          </div>
                          {selectedSubForVerify.pptFile && (
                            <button 
                              onClick={() => alert(`Downloading Presentation File: ${selectedSubForVerify.pptFile}`)} 
                              className="btn btn-sm btn-secondary" 
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#2563eb', borderColor: '#bfdbfe' }}
                            >
                              <DownloadCloud size={14} /> Download
                            </button>
                          )}
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Technical Abstract Document</span>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginTop: '0.2rem' }}>{selectedSubForVerify.pdfFile || 'No PDF Uploaded'}</div>
                          </div>
                          {selectedSubForVerify.pdfFile && (
                            <button 
                              onClick={() => alert(`Downloading PDF File: ${selectedSubForVerify.pdfFile}`)} 
                              className="btn btn-sm btn-secondary" 
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            >
                              <DownloadCloud size={14} /> Download
                            </button>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* SECTION 4: COMPLETE TEAM MEMBER DETAILS (ALL 8 FIELDS PER MEMBER) */}
                    <div>
                      <h4 style={{ fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} color="#2563eb" /> Complete Team Members Roster (Full Details)
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedSubForVerify.members && selectedSubForVerify.members.map((member, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                                {idx + 1}. {member.name}
                              </span>
                              <span style={{ background: member.role === 'Team Leader' ? '#dbeafe' : '#f1f5f9', color: member.role === 'Team Leader' ? '#1e40af' : '#475569', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {member.role}
                              </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                              <div><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Email Address</span><strong style={{ color: '#1e293b' }}>{member.email}</strong></div>
                              <div><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Contact Number</span><strong style={{ color: '#1e293b' }}>{member.contact}</strong></div>
                              <div><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Gender</span><strong style={{ color: '#1e293b' }}>{member.gender}</strong></div>
                              <div><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Age</span><strong style={{ color: '#1e293b' }}>{member.age} yrs</strong></div>
                              <div><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Year of Study</span><strong style={{ color: '#2563eb' }}>{member.year}</strong></div>
                              <div style={{ gridColumn: 'span 3' }}><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>College Name</span><strong style={{ color: '#1e293b' }}>{member.college}</strong></div>
                              <div style={{ gridColumn: 'span 4' }}><span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>College Address</span><span style={{ color: '#475569' }}>{member.address}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 5: APPROVAL / REJECTION ACTIONS */}
                    <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {selectedSubForVerify.status === 'Approved' ? (
                        <div style={{ background: '#d1fae5', color: '#059669', padding: '1rem 1.5rem', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                          <CheckCircle size={22} /> Application & Submission Approved by Admin
                        </div>
                      ) : (
                        <form onSubmit={handleReject}>
                          <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ color: '#dc2626', fontWeight: 700 }}>Reason for Rejection (Required if rejecting)</label>
                            <textarea rows={2} className="form-textarea" placeholder="e.g. PPT presentation incomplete or problem statement mismatch..." value={rejectionComment} onChange={(e) => setRejectionComment(e.target.value)}></textarea>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => handleApprove(selectedSubForVerify.id)} className="btn btn-primary" style={{ flex: 1, background: '#10b981', borderColor: '#10b981', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}>
                              Approve Submission & Profile
                            </button>
                            <button type="submit" disabled={!rejectionComment.trim()} className="btn btn-secondary" style={{ flex: 1, color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}>
                              Reject Application
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* OTHER TABS OMITTED FOR BREVITY AS REQUESTED - ONLY SHOWING CMS, COORD, JURY */}
        {activeTab === 'candidates' && (<div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>Candidate Verification Data...</div>)}
        {activeTab === 'receipts' && (<div className="glass-card" style={{ padding: '2.5rem', background: '#fff' }}>Candidate Receipts Data...</div>)}

      </div>
    </div>
  );
}
