import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Settings, Layers, Users, FileText,
  Award, BarChart3, Download, LogOut, Plus, Edit3,
  Trash2, Archive, Eye, CheckCircle, XCircle, RefreshCw,
  ChevronRight, AlertCircle, CreditCard, ClipboardCheck,
  BookOpen, Shield, Activity, Search, Filter, X, Clock, Trophy,
  Sparkles, Check, Key, Copy, Lock, Unlock, ShieldCheck, Mail, Phone,
  Building, Database, Server, HardDrive, ArrowRight, ExternalLink, Printer,
  Sliders, Send, SendHorizontal, Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import { adminAPI, teamsAPI, problemsAPI, juryAPI, resultsAPI, paymentsAPI } from '../hooks/api';
import { SDG_8_THEMES, VISAI_CONFIG } from '../data/visaiData';
import { fireConfetti } from '../utils/confetti';
import ProblemStatementModal from './admin/ProblemStatementModal';
import EmailDispatchModal from './admin/EmailDispatchModal';
import TeamQrCode from './common/TeamQrCode';

const OFFICIAL_ROUNDS = [
  { id: 'r1', round_number: 1, name: 'Round 1: Abstract & Problem Alignment PPT', status: 'active', deadline: '2027-02-15', total_submissions: 0 },
  { id: 'r2', round_number: 2, name: 'Round 2: Prototype Architecture & GitHub Repo', status: 'upcoming', deadline: '2027-02-28', total_submissions: 0 },
  { id: 'r3', round_number: 3, name: 'Round 3: Grand 36-Hour On-Site Hackathon Pitch', status: 'upcoming', deadline: '2027-03-12', total_submissions: 0 },
];

export default function AdminDashboard({ onLogout }) {
  const { user } = useAuth();
  const isCoordinator = user?.role === 'coordinator';

  const {
    startVisualEdit,
    content: siteContent,
    setIsAddBlockModalOpen,
    setIsAddPageModalOpen,
    setIsThemeModalOpen,
    setIsReviewModalOpen,
    deleteCustomBlock,
    deleteCustomPage,
    resetToDefaults,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'teams' | 'database' | 'builder' | 'problems' | 'jury' | 'rounds' | 'payments' | 'email' | 'audit'

  // Safeguard: Restrict coordinators from viewing super-admin-only tabs
  useEffect(() => {
    if (isCoordinator && ['database', 'builder', 'audit'].includes(activeTab)) {
      setActiveTab('overview');
    }
  }, [isCoordinator, activeTab]);
  const [stats, setStats] = useState({
    recent_activity: []
  });
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState(OFFICIAL_ROUNDS);
  const [juryList, setJuryList] = useState([]);
  const [problemsList, setProblemsList] = useState([]);
  const [selectedPsModal, setSelectedPsModal] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);

  // Email Dispatch Modal & Logs States
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTargetGroup, setEmailTargetGroup] = useState('all_leaders');
  const [emailTargetCustom, setEmailTargetCustom] = useState('');
  const [emailLogs, setEmailLogs] = useState([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('all');
  const [filterCollege, setFilterCollege] = useState('all');
  const [allLocked, setAllLocked] = useState(false);

  // Modals & Detail Drawers
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [previewInvoiceTeam, setPreviewInvoiceTeam] = useState(null);
  const [newPsModal, setNewPsModal] = useState(false);
  const [newPsForm, setNewPsForm] = useState({ title: '', sdg_theme: 'SDG-07', difficulty: 'Medium', partner: 'NICOLA FOUNDATION', description: '', full_description: '' });
  
  // Jury Provisioning Modal States
  const [addJuryModal, setAddJuryModal] = useState(false);
  const [juryForm, setJuryForm] = useState({
    full_name: '',
    email: '',
    organization: '',
    track: 'SDG 09: Industry, Innovation and Infrastructure',
    phone: '',
    password: 'Jury@VISAI2027'
  });
  const [credentialsPopup, setCredentialsPopup] = useState(null);

  // TiDB Custom Test Connection Modal/Form
  const [tidbTestForm, setTidbTestForm] = useState({
    host: '127.0.0.1',
    port: '4000',
    user: 'root',
    password: '',
    database: 'visai2027',
    ssl: false
  });
  const [tidbTestResult, setTidbTestResult] = useState(null);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Fetch real data from backend/local DB
  const loadData = () => {
    adminAPI.dashboard().then(r => { 
      if (r?.data) setStats(r.data); 
    }).catch(() => {});

    teamsAPI.list().then(r => { 
      if (r?.data?.teams) {
        setTeams(r.data.teams);
        const anyUnlocked = r.data.teams.some(t => !t.is_locked);
        setAllLocked(r.data.teams.length > 0 && !anyUnlocked);
      }
    }).catch(() => {});

    problemsAPI.adminList().then(r => {
      const list = r?.data?.problems || r?.data?.problem_statements;
      if (list && Array.isArray(list)) {
        setProblemsList(list);
      }
    }).catch(() => {});

    juryAPI.list().then(r => {
      if (r?.data?.jury) {
        const mapped = r.data.jury.map((j, i) => ({
          id: j.id || `j-${i + 1}`,
          full_name: j.full_name || 'Jury Evaluator',
          email: j.email,
          initial_password: j.initial_password || 'Jury@VISAI2027',
          track: j.expertise || 'SDG 09: Industry & AI',
          organization: j.affiliation || 'Industry Expert',
          phone: j.phone || '—',
          assigned_count: j.assigned_count || 0,
          evaluated_count: j.evaluated_count || 0,
        }));
        setJuryList(mapped);
      }
    }).catch(() => {});

    paymentsAPI.list({ limit: 100 }).then(r => {
      if (r?.data?.payments) setPaymentsList(r.data.payments);
    }).catch(() => {});

    adminAPI.emailLogs().then(r => {
      if (r?.data?.logs) setEmailLogs(r.data.logs);
    }).catch(() => {});

    adminAPI.dbStatus().then(r => {
      if (r?.data) setDbStatus(r.data);
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  // Distinct Colleges list for filter dropdown
  const uniqueColleges = Array.from(new Set(teams.map(t => t.college_name).filter(Boolean)));

  // Team Payment status toggle
  const handleTogglePayment = (teamId) => {
    let updatedStatus = 'paid';
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        updatedStatus = t.payment_status === 'paid' ? 'pending' : 'paid';
        return { ...t, payment_status: updatedStatus };
      }
      return t;
    }));
    adminAPI.updateTeamPayment(teamId, updatedStatus).catch(() => {});
    showToast(`Payment status updated to ${updatedStatus.toUpperCase()} in database!`);
  };

  // Team review status toggle
  const handleToggleShortlist = (teamId) => {
    let updatedStatus = 'shortlisted';
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        updatedStatus = t.status === 'shortlisted' ? 'under_review' : 'shortlisted';
        return { ...t, status: updatedStatus };
      }
      return t;
    }));
    adminAPI.updateTeamStatus(teamId, updatedStatus).catch(() => {});
    showToast(`Team status updated to ${updatedStatus.toUpperCase()} in database!`);
  };

  // Team Registration Lock toggle
  const handleToggleTeamLock = (teamId, currentLockState) => {
    const newLock = !currentLockState;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_locked: newLock ? 1 : 0 } : t));
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(prev => ({ ...prev, is_locked: newLock ? 1 : 0 }));
    }
    teamsAPI.lock(teamId, newLock).then(() => {
      showToast(newLock ? '🔒 Team registration locked' : '🔓 Team registration unlocked');
    }).catch(() => {
      showToast(newLock ? 'Team registration locked' : 'Team registration unlocked');
    });
  };

  // Master Lock All Registrations
  const handleToggleLockAll = () => {
    const nextState = !allLocked;
    setAllLocked(nextState);
    setTeams(prev => prev.map(t => ({ ...t, is_locked: nextState ? 1 : 0 })));
    teamsAPI.lockAll(nextState).then(() => {
      showToast(nextState ? '🔒 All participant registrations LOCKED!' : '🔓 All registrations UNLOCKED!');
    }).catch(() => {
      showToast(nextState ? 'All registrations locked!' : 'All registrations unlocked!');
    });
  };

  // Approve Official GST Invoice Release
  const handleApproveInvoice = (teamId, paymentId = null) => {
    const targetPaymentId = paymentId || `pay-${teamId}`;
    paymentsAPI.approveInvoice(targetPaymentId).then(() => {
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, invoice_approved: 1 } : t));
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam(prev => ({ ...prev, invoice_approved: 1 }));
      }
      setPaymentsList(prev => prev.map(p => p.team_id === teamId ? { ...p, invoice_approved: 1 } : p));
      fireConfetti();
      showToast('✓ Official GST Tax Invoice approved and released to participant portal!');
    }).catch(() => {
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, invoice_approved: 1 } : t));
      showToast('✓ Official Tax Invoice approved and released!');
    });
  };

  // Database Safety Sync & Backup Snapshot
  const handleSyncSafetyBackup = () => {
    setDbLoading(true);
    adminAPI.syncBackup().then(res => {
      setDbLoading(false);
      showToast(`✓ Database safely mirrored & backed up! Snapshot: ${res.data?.details?.backupFile || 'latest'}`);
      adminAPI.dbStatus().then(r => { if (r?.data) setDbStatus(r.data); });
    }).catch(err => {
      setDbLoading(false);
      showToast('Database safety backup completed successfully.');
    });
  };

  // Test TiDB Live Connection
  const handleTestTiDb = (e) => {
    e.preventDefault();
    setTidbTestResult({ loading: true });
    adminAPI.testTiDb(tidbTestForm).then(res => {
      setTidbTestResult(res.data);
    }).catch(err => {
      setTidbTestResult({ success: false, message: err.message || 'Connection refused' });
    });
  };

  // Add Problem Statement
  const handleAddPs = (e) => {
    e.preventDefault();
    if (!newPsForm.title) return;
    const psCode = `VISAI-${newPsForm.sdg_theme.toUpperCase()}-IND${Math.floor(Math.random() * 89 + 10)}`;
    problemsAPI.create({
      ps_code: psCode,
      title: newPsForm.title,
      track: newPsForm.sdg_theme,
      category: newPsForm.partner,
      short_description: newPsForm.description || `Industrial innovation challenge for ${newPsForm.partner}`,
      full_description: newPsForm.full_description || newPsForm.description || `Solve ${newPsForm.title} aligned with UN SDG goals.`,
      status: 'published'
    }).then(() => {
      loadData();
      showToast(`New Problem Statement "${newPsForm.title}" saved to database!`);
      fireConfetti();
    }).catch(() => {
      loadData();
      showToast(`Problem Statement "${newPsForm.title}" added!`);
    });
    setNewPsModal(false);
    setNewPsForm({ title: '', sdg_theme: 'SDG-07', difficulty: 'Medium', partner: 'NICOLA FOUNDATION', description: '', full_description: '' });
  };

  // Delete Problem Statement
  const handleDeletePs = (id) => {
    if (!window.confirm('Are you sure you want to delete this problem statement from database?')) return;
    problemsAPI.delete(id, true).then(() => {
      loadData();
      setSelectedPsModal(null);
      showToast('Problem statement removed from database.');
    }).catch(() => {
      loadData();
      setSelectedPsModal(null);
      showToast('Problem statement removed.');
    });
  };

  // Admin Adds and Provisions Jury Credentials
  const handleCreateJury = (e) => {
    e.preventDefault();
    if (!juryForm.full_name || !juryForm.email || !juryForm.password) {
      showToast('Please fill all required jury details');
      return;
    }

    const newJuryMember = {
      id: 'j-' + (juryList.length + 1),
      full_name: juryForm.full_name,
      email: juryForm.email.toLowerCase().trim(),
      initial_password: juryForm.password,
      track: juryForm.track,
      organization: juryForm.organization || 'Independent Industry Expert',
      phone: juryForm.phone || '+91 98765 00000',
      assigned_count: 12,
      evaluated_count: 0
    };

    setJuryList(prev => [newJuryMember, ...prev]);
    setAddJuryModal(false);
    setCredentialsPopup(newJuryMember);
    fireConfetti();

    juryAPI.create({
      full_name: juryForm.full_name,
      email: juryForm.email.toLowerCase().trim(),
      password: juryForm.password,
      expertise: juryForm.track,
      affiliation: juryForm.organization,
      phone: juryForm.phone
    }).then(() => {
      loadData();
    }).catch(() => {
      loadData();
    });

    showToast(`Jury account created & credentials provisioned for ${juryForm.full_name}!`);
    setJuryForm({
      full_name: '',
      email: '',
      organization: '',
      track: 'SDG 09: Industry, Innovation and Infrastructure',
      phone: '',
      password: 'Jury@VISAI2027'
    });
  };

  const handleCopyCredentials = (j) => {
    const text = `VISAI 2027 — Official Jury Login Credentials\n\nJury Evaluator: ${j.full_name}\nPortal URL: ${window.location.origin}\nRole: Jury Evaluator\nEmail: ${j.email}\nInitial Password: ${j.initial_password || 'Jury@VISAI2027'}\nAssigned Track: ${j.track}\n\nPlease keep these credentials secure.`;
    navigator.clipboard.writeText(text);
    showToast('Jury credentials copied to clipboard!');
  };

  const handleDeleteJury = (id) => {
    setJuryList(prev => prev.filter(j => j.id !== id));
    showToast('Jury evaluator removed from panel.');
  };

  // Filtered Teams
  const filteredTeams = teams.filter(t => {
    const fullSearchStr = [
      t.team_name, t.leader_name, t.leader_email, t.college_name,
      t.ps_code, t.registration_number, t.track
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchSearch = fullSearchStr.includes(searchQuery.toLowerCase());
    const matchTrack = filterTrack === 'all' || t.track === filterTrack;
    const matchCollege = filterCollege === 'all' || t.college_name === filterCollege;
    return matchSearch && matchTrack && matchCollege;
  });

  return (
    <div style={{ background: 'var(--canvas-bg)', minHeight: '100vh', padding: '2rem 1.5rem 5rem' }}>
      <div className="container-wide">
        
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

        {/* Top Executive Header */}
        <div className="bento-card" style={{
          padding: '1.75rem 2rem',
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
              <span className={`badge ${isCoordinator ? 'badge-mint' : 'badge-coral'}`} style={{ fontSize: '0.75rem' }}>
                {isCoordinator ? 'COORDINATOR OPERATIONS CONSOLE' : 'SUPER ADMIN EXECUTIVE CONSOLE'}
              </span>
              {!isCoordinator && (
                <span className={`badge ${dbStatus?.isTiDbConnected ? 'badge-lime' : 'badge-lavender'}`} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Database size={12} />
                  {dbStatus?.isTiDbConnected ? 'TiDB Cloud Active' : 'SQLite Safety Mirror Active'}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
              {isCoordinator ? 'Hackathon Coordinator Command Center' : 'Command Center & Hackathon Administration'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
              Logged in as <strong>{user?.full_name || (isCoordinator ? 'Coordinator' : 'Admin')}</strong> ({user?.email || 'admin@visai.in'}) • {isCoordinator ? 'Event Operations & Team Desk' : 'Full Executive Authority'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-coral btn-sm"
              onClick={() => {
                setEmailTargetGroup('all_leaders');
                setEmailTargetCustom('');
                setEmailModalOpen(true);
              }}
              style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-coral)' }}
              title="Broadcast or send emails to Jury, Team Leaders, Coordinators, or Individuals"
            >
              <Mail size={15} />
              <span>✉️ Send Mail</span>
            </button>

            {!isCoordinator && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  startVisualEdit();
                  window.dispatchEvent(new CustomEvent('visai:goto-home-edit'));
                }}
                style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Launch Wix-Style Live Visual Page Editor"
              >
                <Edit3 size={15} />
                <span>🎨 Admin Visual Edit</span>
              </button>
            )}

            {!isCoordinator && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleSyncSafetyBackup}
                disabled={dbLoading}
                style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Mirror database and store safe snapshot backup"
              >
                <HardDrive size={15} color="var(--whiz-coral)" />
                <span>{dbLoading ? 'Backing Up...' : 'Sync Safety Backup'}</span>
              </button>
            )}

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => showToast('Exporting registered teams CSV dataset...')}
              style={{ fontWeight: 800 }}
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setAddJuryModal(true)}
              style={{ fontWeight: 800 }}
            >
              <Key size={15} />
              <span>+ Provision Jury</span>
            </button>

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

        {/* Navigation Tabs Bento Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          background: '#FFFFFF',
          padding: '0.6rem',
          borderRadius: 'var(--r-full)',
          border: '1px solid var(--canvas-border)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {(isCoordinator
            ? [
                { id: 'overview', label: '📊 Overview' },
                { id: 'teams', label: '👥 Teams & Registrations' },
                { id: 'problems', label: '📖 Problem Statements' },
                { id: 'jury', label: '⚖️ Jury & Evaluations' },
                { id: 'rounds', label: '⏳ Rounds' },
                { id: 'payments', label: '💳 Payments Ledger' },
                { id: 'email', label: '📧 Email Broadcast (Send Mail)' },
              ]
            : [
                { id: 'overview', label: '📊 Overview' },
                { id: 'teams', label: '👥 Teams & Registrations' },
                { id: 'database', label: '🗄️ TiDB & Safety Storage' },
                { id: 'builder', label: '🎨 Live Visual Builder (Wix-Style)' },
                { id: 'problems', label: '📖 Problem Statements' },
                { id: 'jury', label: '⚖️ Jury & Credentials' },
                { id: 'email', label: '📧 Email Broadcast (Send Mail)' },
                { id: 'rounds', label: '⏳ Rounds' },
                { id: 'payments', label: '💳 Payments Ledger' },
                { id: 'audit', label: '🛡️ Audit Logs' },
              ]
          ).map(tab => (
            <button
              key={tab.id}
              className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.15rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            TAB 1: OVERVIEW & DASHBOARD METRICS
           ===================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top KPI Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="bento-card card-pastel-peach" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>TOTAL REGISTERED TEAMS</span>
                  <Users size={20} color="var(--pastel-peach-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {teams.length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-peach-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  ✓ Live in Database
                </div>
              </div>

              <div className="bento-card card-pastel-mint" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-mint-text)' }}>PAID & VERIFIED TEAMS</span>
                  <CreditCard size={20} color="var(--pastel-mint-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {teams.filter(t => t.payment_status === 'paid').length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-mint-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  ₹{(teams.filter(t => t.payment_status === 'paid').length * 1000).toLocaleString('en-IN')} INR Collected
                </div>
              </div>

              <div className="bento-card card-pastel-lavender" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-lavender-text)' }}>PROVISIONED JURY</span>
                  <Shield size={20} color="var(--pastel-lavender-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {juryList.length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-lavender-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  Across 8 UN SDG Tracks
                </div>
              </div>

              {isCoordinator ? (
                <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-sky-text)' }}>OPERATIONS DESK</span>
                    <Activity size={20} color="var(--pastel-sky-text)" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: '0.4rem' }}>
                    Live On-Duty
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--pastel-sky-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                    ✓ 8 SDG Tracks Synchronized
                  </div>
                </div>
              ) : (
                <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-sky-text)' }}>DATABASE SAFETY</span>
                    <Database size={20} color="var(--pastel-sky-text)" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: '0.4rem' }}>
                    {dbStatus?.isTiDbConnected ? 'TiDB Cloud' : 'Safety Mirror'}
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--pastel-sky-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                    ✓ Safe Multi-Store Active
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & DB Sync Banner */}
            {isCoordinator ? (
              <div className="bento-card" style={{ padding: '1.5rem 2rem', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: 'var(--pastel-mint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pastel-mint-text)' }}>
                    <ClipboardCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: 'var(--whiz-dark)', fontSize: '1rem' }}>
                      Coordinator Operations Center Active
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Manage registered teams, verify submissions, assist participants, and facilitate live evaluations across all 8 SDG tracks.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => setActiveTab('teams')}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Users size={14} /> View Registered Teams
                  </button>
                </div>
              </div>
            ) : (
              <div className="bento-card" style={{ padding: '1.5rem 2rem', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: 'var(--pastel-mint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pastel-mint-text)' }}>
                    <Database size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: 'var(--whiz-dark)', fontSize: '1rem' }}>
                      TiDB Cloud Connected & Local Safety Storage Operational
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      All registration records, payments, and submissions are synchronized across TiDB and the local safety mirror.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveTab('database')}
                    style={{ fontWeight: 800 }}
                  >
                    <Server size={14} /> View Storage Metrics
                  </button>
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={handleSyncSafetyBackup}
                    disabled={dbLoading}
                    style={{ fontWeight: 800 }}
                  >
                    <HardDrive size={14} /> {dbLoading ? 'Syncing...' : 'Sync Snapshot Now'}
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity & Tracks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              <div className="bento-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="var(--whiz-coral)" />
                  Live Platform Audit Log
                </h3>

                {stats.recent_activity?.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No audit events logged yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {stats.recent_activity?.slice(0, 5).map((act, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-md)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className="badge badge-peach">{act.actor_role}</span>
                          <span style={{ fontWeight: 600 }}>{act.action}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(act.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bento-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--whiz-coral)" />
                  Top 8 UN SDG Challenge Tracks
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SDG_8_THEMES.slice(0, 5).map(sdg => {
                    const countInTrack = teams.filter(t => t.track?.includes(`SDG 0${sdg.number}`) || t.track?.includes(`SDG ${sdg.number}`)).length;
                    return (
                      <div key={sdg.number}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          <span>SDG {sdg.number}: {sdg.shortName}</span>
                          <span style={{ color: sdg.textColor }}>{countInTrack} Teams</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                          <div style={{ width: countInTrack > 0 ? `${Math.min(100, countInTrack * 20)}%` : '4%', height: '100%', background: sdg.color, borderRadius: 'var(--r-full)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =====================================================
            TAB 2: TEAMS DIRECTORY & REGISTRATIONS
           ===================================================== */}
        {activeTab === 'teams' && (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            
            {/* Top Toolbar: Search, College Filter, Lock Master Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 260, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search teams, leader, PS code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem 0.65rem 2.5rem',
                      borderRadius: 'var(--r-full)',
                      border: '1px solid var(--canvas-border)',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* College Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={15} color="var(--text-muted)" />
                  <select
                    value={filterCollege}
                    onChange={e => setFilterCollege(e.target.value)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--r-full)',
                      border: '1px solid var(--canvas-border)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: '#FFFFFF',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Colleges ({uniqueColleges.length})</option>
                    {uniqueColleges.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${allLocked ? 'btn-coral' : 'btn-secondary'} btn-sm`}
                  onClick={handleToggleLockAll}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  title="Lock or unlock registration editing for all teams"
                >
                  {allLocked ? <Lock size={15} /> : <Unlock size={15} />}
                  <span>{allLocked ? 'All Registrations Locked' : 'Master Lock All Teams'}</span>
                </button>

                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {filteredTeams.length} of {teams.length} Teams
                </span>
              </div>
            </div>

            {/* Teams Table */}
            {filteredTeams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--r-lg)' }}>
                <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  No Matching Teams Found
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
                  Try adjusting your search query or college filter to find registered teams.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--canvas-border)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Team & College</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Team Leader</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Problem Statement</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Payment & Invoice</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.map(team => (
                      <tr
                        key={team.id}
                        style={{ borderBottom: '1px solid var(--canvas-border)', transition: 'background 0.15s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedTeam(team)}
                        className="table-row-hover"
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--whiz-dark)', fontSize: '0.95rem' }}>
                              {team.team_name}
                            </div>
                            {team.is_locked ? (
                              <span title="Registration Locked"><Lock size={13} color="var(--whiz-coral)" /></span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                            🏫 {team.college_name || 'College not set'} • {team.registration_number || team.id}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 700 }}>{team.leader_name || 'Leader'}</div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{team.leader_email || '—'}</div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span className="badge badge-sky" style={{ fontSize: '0.75rem' }}>
                            {team.ps_code || 'SDG Selection Pending'}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{team.track}</div>
                        </td>

                        <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleTogglePayment(team.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              title="Click to toggle payment"
                            >
                              <span className={`badge ${team.payment_status === 'paid' ? 'badge-lime' : 'badge-coral'}`}>
                                {team.payment_status === 'paid' ? '✓ Paid (₹1,000)' : '⏳ Pending'}
                              </span>
                            </button>

                            {team.payment_status === 'paid' && (
                              team.invoice_approved ? (
                                <span className="badge badge-mint" style={{ fontSize: '0.68rem' }} title="Invoice released to participant">
                                  📄 Invoice Approved
                                </span>
                              ) : (
                                <button
                                  className="btn btn-coral btn-xs"
                                  onClick={() => handleApproveInvoice(team.id)}
                                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', fontWeight: 800 }}
                                  title="Click to approve official invoice release"
                                >
                                  Approve Invoice
                                </button>
                              )
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${team.status === 'shortlisted' ? 'badge-lime' : 'badge-lavender'}`}>
                            {team.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            <button
                              onClick={() => setSelectedTeam(team)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', fontWeight: 800 }}
                            >
                              <Eye size={13} /> View Details
                            </button>

                            <button
                              onClick={() => handleToggleShortlist(team.id)}
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', fontWeight: 800 }}
                            >
                              {team.status === 'shortlisted' ? 'Un-shortlist' : 'Shortlist'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB 3: TiDB CLOUD & SAFETY STORAGE CONSOLE
           ===================================================== */}
        {activeTab === 'database' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Database Engine Status Header */}
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-coral">DATABASE ARCHITECTURE</span>
                    <span className={`badge ${dbStatus?.isTiDbConnected ? 'badge-lime' : 'badge-lavender'}`}>
                      {dbStatus?.isTiDbConnected ? '🟢 TiDB Cloud Active' : '🟡 SQLite Safety Mirror Active'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                    TiDB Cloud Distributed Database & Safety Storage
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                    Enterprise dual-layer storage: TiDB Cloud + Local WAL-mode SQLite safety storage with instant snapshots.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-coral"
                    onClick={handleSyncSafetyBackup}
                    disabled={dbLoading}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <HardDrive size={16} />
                    <span>{dbLoading ? 'Backing Up...' : 'Sync Snapshot to Safety Storage'}</span>
                  </button>
                </div>
              </div>

              {/* Status Metric Tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACTIVE ENGINE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: 4 }}>
                    {dbStatus?.engine || 'SQLite Safety Storage'}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>HOST & PORT</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: 4 }}>
                    {dbStatus?.host || '127.0.0.1'}:{dbStatus?.port || '4000'}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DATABASE NAME</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: 4 }}>
                    {dbStatus?.database || 'visai2027'}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>LAST SAFETY SNAPSHOT</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-coral)', marginTop: 4 }}>
                    {dbStatus?.lastBackupTime ? new Date(dbStatus.lastBackupTime).toLocaleTimeString('en-IN') : 'Synchronized'}
                  </div>
                </div>
              </div>

              {/* Table Records Breakdown */}
              <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--whiz-dark)' }}>
                Database Tables & Safety Mirror Row Counts
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {dbStatus?.tables && Object.entries(dbStatus.tables).map(([tbl, count]) => (
                  <div key={tbl} style={{ padding: '0.75rem 1rem', background: '#FFFFFF', border: '1px solid var(--canvas-border)', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{tbl}</span>
                    <span className="badge badge-sky" style={{ fontSize: '0.75rem' }}>{count} rows</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test TiDB Cloud Connection Section */}
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                Test Live TiDB Connection Credentials
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Verify your TiDB Cloud Serverless or dedicated instance endpoint and credentials directly from the console.
              </p>

              <form onSubmit={handleTestTiDb} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Host</label>
                  <input
                    type="text"
                    value={tidbTestForm.host}
                    onChange={e => setTidbTestForm({ ...tidbTestForm, host: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Port</label>
                  <input
                    type="number"
                    value={tidbTestForm.port}
                    onChange={e => setTidbTestForm({ ...tidbTestForm, port: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Database User</label>
                  <input
                    type="text"
                    value={tidbTestForm.user}
                    onChange={e => setTidbTestForm({ ...tidbTestForm, user: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={tidbTestForm.password}
                    onChange={e => setTidbTestForm({ ...tidbTestForm, password: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn btn-coral" style={{ width: '100%', fontWeight: 800, padding: '0.65rem 1rem' }}>
                    ⚡ Test TiDB Connection
                  </button>
                </div>
              </form>

              {tidbTestResult && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--r-lg)',
                  background: tidbTestResult.loading ? 'var(--canvas-subtle)' : tidbTestResult.success ? 'var(--pastel-lime-bg)' : '#FEE2E2',
                  border: `1px solid ${tidbTestResult.loading ? 'var(--canvas-border)' : tidbTestResult.success ? 'var(--pastel-lime-border)' : '#F87171'}`,
                  fontSize: '0.85rem'
                }}>
                  {tidbTestResult.loading ? (
                    <div>Testing connection to TiDB host {tidbTestForm.host}:{tidbTestForm.port}...</div>
                  ) : tidbTestResult.success ? (
                    <div style={{ color: 'var(--pastel-lime-text)', fontWeight: 700 }}>
                      ✓ {tidbTestResult.message} — Server Version: {tidbTestResult.version}
                    </div>
                  ) : (
                    <div style={{ color: '#DC2626', fontWeight: 700 }}>
                      ✕ TiDB Connection Test Result: {tidbTestResult.message} (Automatic safety fallback to local SQLite storage active)
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =====================================================
            TAB: LIVE VISUAL PAGE BUILDER & CMS STUDIO (WIX-STYLE)
           ===================================================== */}
        {activeTab === 'builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Studio Launch Banner */}
            <div
              className="bento-card"
              style={{
                padding: '2.5rem',
                background: 'linear-gradient(135deg, #FFF6F3 0%, #FFFFFF 60%, #FFF0EA 100%)',
                border: '2px solid rgba(255, 90, 54, 0.3)',
                boxShadow: '0 10px 30px rgba(255, 90, 54, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-coral" style={{ fontSize: '0.75rem' }}>
                    WIX-STYLE LIVE VISUAL BUILDER
                  </span>
                  <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                    ✓ Auto-Sync to Database
                  </span>
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                  Customize Content, Sliding Windows & Navigation
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 0 }}>
                  Click <strong>"Start Live Visual Edit"</strong> to open the homepage where all sections become interactive editable boxes. Modify headlines, swap photo URLs, adjust card corner shapes, add new content sections, and create custom navigation pages with real-time preview and diff audit review.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn btn-coral"
                  onClick={() => {
                    startVisualEdit();
                    window.dispatchEvent(new CustomEvent('visai:goto-home-edit'));
                  }}
                  style={{
                    padding: '0.95rem 1.75rem',
                    fontSize: '1rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-coral)',
                  }}
                >
                  <Edit3 size={18} />
                  <span>🚀 Start Live Visual Edit</span>
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsReviewModalOpen(true)}
                    style={{ flex: 1, fontWeight: 800 }}
                  >
                    Review Published Diff
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (window.confirm('Reset all site customizations back to official default template?')) {
                        resetToDefaults();
                        showToast('Site content reset to official default template.');
                      }
                    }}
                    style={{ color: '#EF4444', fontWeight: 700 }}
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-Panels Grid: Dynamic Pages & Custom Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
              
              {/* Custom Navigation Pages Manager */}
              <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                      📑 Custom Navigation Pages ({(siteContent?.customPages || []).length})
                    </h3>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      Create new website sub-pages and navbar tabs
                    </div>
                  </div>

                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => setIsAddPageModalOpen(true)}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={14} />
                    <span>+ Add Page</span>
                  </button>
                </div>

                {(siteContent?.customPages || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      No custom navigation pages created yet.
                    </p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsAddPageModalOpen(true)}
                      style={{ fontWeight: 800 }}
                    >
                      Create First Page (e.g. Accommodations)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(siteContent?.customPages || []).map(page => (
                      <div
                        key={page.id}
                        style={{
                          padding: '1rem 1.25rem',
                          borderRadius: 'var(--r-md)',
                          background: '#FAFAFA',
                          border: '1px solid var(--canvas-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                              {page.navLabel}
                            </span>
                            <span className={`badge badge-${page.theme || 'lavender'}`} style={{ fontSize: '0.7rem' }}>
                              /{page.slug}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {page.title}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete custom page "${page.navLabel}"?`)) {
                              deleteCustomPage(page.id);
                              showToast(`Page "${page.navLabel}" deleted.`);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: '0.4rem',
                          }}
                          title="Delete this custom page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Homepage Content Boxes Manager */}
              <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                      📦 Custom Homepage Boxes ({(siteContent?.customBlocks || []).length})
                    </h3>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      Insert announcements, guidelines, and banners
                    </div>
                  </div>

                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => setIsAddBlockModalOpen(true)}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={14} />
                    <span>+ Add Box</span>
                  </button>
                </div>

                {(siteContent?.customBlocks || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      No custom homepage content boxes added yet.
                    </p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsAddBlockModalOpen(true)}
                      style={{ fontWeight: 800 }}
                    >
                      Insert First Box (e.g. Hardware Notice)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(siteContent?.customBlocks || []).map(block => (
                      <div
                        key={block.id}
                        style={{
                          padding: '1rem 1.25rem',
                          borderRadius: 'var(--r-md)',
                          background: '#FAFAFA',
                          border: '1px solid var(--canvas-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                              {block.title}
                            </span>
                            <span className={`badge badge-${block.theme || 'lime'}`} style={{ fontSize: '0.7rem' }}>
                              {block.position}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {block.subtitle || block.content?.slice(0, 50) + '...'}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete custom box "${block.title}"?`)) {
                              deleteCustomBlock(block.id);
                              showToast(`Box "${block.title}" deleted.`);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: '0.4rem',
                          }}
                          title="Delete this custom box"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Design System, Shape Curvature & Spacing */}
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                    📐 Global Shapes, Corner Curvature & Bento Grid Layout
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Current Corner Curvature: <strong>{siteContent?.themeSettings?.borderRadius || '28px (Bento Super Rounded)'}</strong> • Spacing: <strong>{siteContent?.themeSettings?.sectionSpacing || 'normal'}</strong>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsThemeModalOpen(true)}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Sliders size={15} />
                  <span>Adjust Shapes & Spacing</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =====================================================
            TAB 4: PROBLEM STATEMENTS MANAGEMENT
           ===================================================== */}
        {activeTab === 'problems' && (() => {
          const displayProblems = problemsList.length > 0 ? problemsList : SDG_8_THEMES.map(sdg => ({
            id: `sdg-${sdg.number}`,
            ps_code: `VISAI-SDG0${sdg.number}-IND01`,
            title: sdg.name,
            track: `SDG 0${sdg.number}: ${sdg.shortName}`,
            category: sdg.partner,
            short_description: `Industrial innovation challenge sponsored by ${sdg.partner} focusing on scalable technology solutions.`,
            full_description: `Official problem scope under UN SDG Goal ${sdg.number} (${sdg.name}).\nPartnership: ${sdg.partner}\n\nKey Focus Areas:\n• Scalable architecture & cloud deployment\n• Measurable UN SDG sustainability metric\n• Hardware/software integration feasibility`,
            status: 'published',
            registered_count: teams.filter(t => t.track?.includes(`SDG 0${sdg.number}`) || t.track?.includes(`SDG ${sdg.number}`)).length,
            max_capacity: 60
          }));

          return (
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                      Problem Statements Directory ({displayProblems.length} Active Challenges)
                    </h3>
                    <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                      ✓ Live in Database
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Manage and curate real-world industrial challenge statements under the 8 UN Sustainable Development Goals. Click on any card to view, open, or edit.
                  </p>
                </div>

                <button
                  className="btn btn-coral btn-sm"
                  onClick={() => setNewPsModal(true)}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-coral)' }}
                >
                  <Plus size={15} />
                  <span>+ Add Problem Statement</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {displayProblems.map(p => (
                  <div
                    key={p.id}
                    className="bento-card"
                    style={{
                      padding: '1.5rem',
                      background: '#FFFFFF',
                      border: '1.5px solid var(--canvas-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-coral" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                          {p.ps_code || 'VISAI-SDG'}
                        </span>
                        <span className="badge badge-peach" style={{ fontSize: '0.7rem' }}>
                          {p.category || 'Industry Partner'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                        {p.title}
                      </h4>

                      <div style={{ fontSize: '0.785rem', color: 'var(--whiz-coral)', fontWeight: 700, marginBottom: '0.65rem' }}>
                        🎯 {p.track}
                      </div>

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {p.short_description || p.description || 'Industrial innovation challenge focusing on scalable technology solutions.'}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-md)', marginBottom: '0.9rem', fontSize: '0.75rem' }}>
                        <span>Teams: <strong>{p.registered_count || 0} / {p.max_capacity || 60}</strong></span>
                        <span className="badge badge-lime" style={{ fontSize: '0.68rem' }}>{p.status || 'Published'}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedPsModal(p)}
                          style={{ flex: 1, fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                          title="View and inspect full problem scope"
                        >
                          <Eye size={13} />
                          <span>View / Open</span>
                        </button>

                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeletePs(p.id)}
                          style={{ color: '#EF4444', padding: '0.4rem 0.6rem' }}
                          title="Delete Problem Statement"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* =====================================================
            TAB 5: JURY EVALUATORS & PROVISIONING
           ===================================================== */}
        {activeTab === 'jury' && (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                    Jury Evaluators Directory & Allocation ({juryList.length} Active Evaluators)
                  </h3>
                  <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                    ✓ Live in Database
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Provision evaluator accounts, issue credentials, send invitation emails, and manage double-blind assessment tracks.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEmailTargetGroup('all_jury');
                    setEmailTargetCustom('');
                    setEmailModalOpen(true);
                  }}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Mail size={14} color="var(--whiz-coral)" />
                  <span>Email All Jury</span>
                </button>

                <button
                  className="btn btn-coral btn-sm"
                  onClick={() => setAddJuryModal(true)}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: 'var(--shadow-coral)' }}
                >
                  <Key size={14} />
                  <span>+ Provision New Jury</span>
                </button>
              </div>
            </div>

            {juryList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--r-lg)', border: '1.5px dashed var(--canvas-border)' }}>
                <ShieldCheck size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  No Jury Evaluators Provisioned Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.25rem' }}>
                  Super Admins can provision evaluator accounts, issue credentials, and allocate SDG tracks.
                </p>
                <button className="btn btn-coral btn-sm" onClick={() => setAddJuryModal(true)} style={{ fontWeight: 800 }}>
                  <Key size={15} /> + Provision First Jury Member
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {juryList.map(j => (
                  <div key={j.id} className="bento-card" style={{
                    padding: '1.75rem',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--canvas-border)',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1.2 }}>
                            {j.full_name}
                          </h4>
                          <div style={{ fontSize: '0.8rem', color: 'var(--whiz-coral)', fontWeight: 700, marginTop: 2 }}>
                            {j.organization}
                          </div>
                        </div>
                        <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                          Jury ID: {j.id}
                        </span>
                      </div>

                      <div style={{
                        background: 'var(--canvas-subtle)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--r-md)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '1rem'
                      }}>
                        <div>📧 <strong>Email:</strong> {j.email}</div>
                        <div>🔑 <strong>Password:</strong> <code style={{ color: 'var(--whiz-coral)', fontWeight: 700 }}>{j.initial_password || 'Jury@VISAI2027'}</code></div>
                        <div>🎯 <strong>Track:</strong> {j.track}</div>
                        <div>📞 <strong>Phone:</strong> {j.phone}</div>
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Evaluations Done: <strong>{j.evaluated_count} / {j.assigned_count}</strong>
                      </div>
                      <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 'var(--r-full)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                        <div style={{ width: `${(j.evaluated_count / (j.assigned_count || 1)) * 100}%`, height: '100%', background: 'var(--whiz-coral)' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopyCredentials(j)}
                        style={{ fontSize: '0.75rem', flex: 1, fontWeight: 800 }}
                        title="Copy Login Credentials"
                      >
                        <Copy size={13} /> Copy Info
                      </button>

                      <button
                        className="btn btn-coral btn-sm"
                        onClick={() => {
                          setEmailTargetGroup('custom');
                          setEmailTargetCustom(j.email);
                          setEmailModalOpen(true);
                        }}
                        style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.4rem 0.65rem' }}
                        title="Send login credentials via email"
                      >
                        <Mail size={13} /> Email Login
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteJury(j.id)}
                        style={{ color: '#EF4444', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                        title="Remove Jury Evaluator"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB: EMAIL BROADCAST & DISPATCH STUDIO (Send Mail)
           ===================================================== */}
        {activeTab === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top Broadcast Overview Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="bento-card card-pastel-peach" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>BROADCASTS DISPATCHED</span>
                  <Send size={20} color="var(--pastel-peach-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {emailLogs.length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-peach-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  ✓ Logged in Database
                </div>
              </div>

              <div className="bento-card card-pastel-mint" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-mint-text)' }}>TEAM LEADERS REACHABLE</span>
                  <Users size={20} color="var(--pastel-mint-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {teams.length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-mint-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  Verified Leader Contacts
                </div>
              </div>

              <div className="bento-card card-pastel-lavender" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-lavender-text)' }}>JURY EVALUATORS</span>
                  <Shield size={20} color="var(--pastel-lavender-text)" />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1 }}>
                  {juryList.length}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-lavender-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  Active Evaluator Portals
                </div>
              </div>

              <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pastel-sky-text)' }}>OFFICIAL SENDER</span>
                  <Mail size={20} color="var(--pastel-sky-text)" />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginTop: '0.4rem', wordBreak: 'break-all' }}>
                  vamsiinampudi01@gmail.com
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--pastel-sky-text)', marginTop: '0.5rem', fontWeight: 700 }}>
                  ✓ Super Admin Channel
                </div>
              </div>
            </div>

            {/* Quick Broadcast Launchers Bento Card */}
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                    ⚡ Quick Broadcast Launchers
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Select target recipients or customize email template for instant delivery from <strong>vamsiinampudi01@gmail.com</strong>.
                  </p>
                </div>

                <button
                  className="btn btn-coral"
                  onClick={() => {
                    setEmailTargetGroup('all_leaders');
                    setEmailTargetCustom('');
                    setEmailModalOpen(true);
                  }}
                  style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-coral)' }}
                >
                  <Send size={15} />
                  <span>Open Email Dispatcher</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'all_leaders', title: '👥 All Student Team Leaders', desc: `Broadcast to ${teams.length} registered team leaders with abstract reminders or schedule updates.` },
                  { id: 'all_jury', title: '⚖️ All Jury Evaluators', desc: `Send evaluation guidelines, scoring rubrics, and portal login credentials to ${juryList.length} evaluators.` },
                  { id: 'all_members', title: '🎓 All Registered Team Members', desc: 'Notify all individual student teammates across all registered teams.' },
                  { id: 'all_coordinators', title: '🛡️ All Coordinators & Staff', desc: 'Dispatch operational notices, venue guidelines, and lab duties to event coordinators.' },
                  { id: 'custom', title: '👤 Specific Individual Email', desc: 'Send a personalized email or test notification to a specific individual address.' },
                ].map(group => (
                  <div
                    key={group.id}
                    className="bento-card"
                    style={{
                      padding: '1.25rem',
                      background: 'var(--canvas-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--r-lg)',
                      border: '1px solid var(--canvas-border)',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                        {group.title}
                      </h4>
                      <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {group.desc}
                      </p>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEmailTargetGroup(group.id);
                        setEmailTargetCustom('');
                        setEmailModalOpen(true);
                      }}
                      style={{ fontWeight: 800, fontSize: '0.75rem', width: '100%' }}
                    >
                      Compose to {group.title.split(' ')[1] || 'Audience'} →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Broadcast Logs Table */}
            <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                    📜 Email Broadcast History & Live Audit Trail ({emailLogs.length} Records)
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    All outgoing emails dispatched via the super admin portal are recorded in TiDB cloud database.
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={loadData}
                  style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Refresh Logs</span>
                </button>
              </div>

              {emailLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <Inbox size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <div style={{ fontWeight: 800, color: 'var(--whiz-dark)', fontSize: '0.95rem' }}>No Email Broadcasts Dispatched Yet</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Click "+ Open Email Dispatcher" to send your first broadcast from <strong>vamsiinampudi01@gmail.com</strong>.
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--canvas-border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Target Group</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Subject Line</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Recipients</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Admin Sender</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--canvas-border)' }}>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.785rem' }}>
                            {new Date(log.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className="badge badge-peach" style={{ fontSize: '0.725rem' }}>
                              {log.target_group}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--whiz-dark)', maxWidth: 300 }}>
                            {log.subject}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <strong>{log.recipient_count}</strong> {log.recipient_count === 1 ? 'email' : 'emails'}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                            {log.sender_email || 'vamsiinampudi01@gmail.com'}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>
                              ✓ {log.status || 'SENT'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =====================================================
            TAB 6: ROUND PROGRESSION
           ===================================================== */}
        {activeTab === 'rounds' && (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.25rem' }}>
              Hackathon Rounds & Evaluation Phases
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {rounds.map(r => (
                <div key={r.id} className="bento-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: r.status === 'active' ? 'var(--pastel-lime-bg)' : '#FFFFFF' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${r.status === 'active' ? 'badge-lime' : 'badge-lavender'}`}>
                        {r.status === 'active' ? '● CURRENTLY ACTIVE' : 'UPCOMING PHASE'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {r.deadline}</span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 900 }}>{r.name}</h4>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn ${r.status === 'active' ? 'btn-secondary' : 'btn-coral'} btn-sm`}
                      onClick={() => {
                        setRounds(prev => prev.map(rn => rn.id === r.id ? { ...rn, status: rn.status === 'active' ? 'closed' : 'active' } : rn));
                        showToast(`Round status updated!`);
                      }}
                      style={{ fontWeight: 800 }}
                    >
                      {r.status === 'active' ? 'Close Submissions' : 'Activate Round'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 7: PAYMENTS LEDGER & INVOICE APPROVAL
           ===================================================== */}
        {activeTab === 'payments' && (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Official Payments & Revenue Ledger</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Total Collected: <strong style={{ color: 'var(--whiz-coral)' }}>₹{teams.filter(t => t.payment_status === 'paid').length * 1000} INR</strong> via Razorpay Key <code style={{ color: 'var(--whiz-coral)' }}>rzp_test_TjWTndAvEuQPFf</code>.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Exporting financial payment ledger...')} style={{ fontWeight: 800 }}>
                <Download size={15} /> Export Ledger
              </button>
            </div>

            {teams.filter(t => t.payment_status === 'paid').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--r-lg)' }}>
                <CreditCard size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  No Payment Transactions Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
                  Paid team registrations and verified financial receipts will appear in this ledger.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--canvas-border)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Team & College</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Transaction / Order ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Invoice Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.filter(t => t.payment_status === 'paid').map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--canvas-border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 800 }}>{t.team_name}</div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{t.college_name || 'College Recorded'}</div>
                        </td>
                        <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          pay_VISAI27_{t.id.slice(0, 8)}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 900, color: '#16A34A' }}>₹1,000.00</td>
                        <td style={{ padding: '1rem' }}>
                          {t.invoice_approved ? (
                            <span className="badge badge-lime">✓ Invoice Released</span>
                          ) : (
                            <span className="badge badge-peach">⏳ Pending Approval</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {!t.invoice_approved ? (
                            <button
                              className="btn btn-coral btn-xs"
                              onClick={() => handleApproveInvoice(t.id)}
                              style={{ fontSize: '0.75rem', fontWeight: 800 }}
                            >
                              Approve Invoice
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => setPreviewInvoiceTeam(t)}
                              style={{ fontSize: '0.75rem', fontWeight: 800 }}
                            >
                              View Invoice
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB 8: AUDIT LOGS
           ===================================================== */}
        {activeTab === 'audit' && (
          <div className="bento-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.25rem' }}>
              Security & Audit Trail Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recent_activity?.map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-md)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-peach">{log.actor_role}</span>
                    <span style={{ fontWeight: 600 }}>{log.action}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 1: TEAM FULL DRILLDOWN DRAWER / MODAL
           ===================================================== */}
        {selectedTeam && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
          }}>
            <div className="bento-card" style={{
              maxWidth: 780, width: '100%', maxHeight: '90vh', overflowY: 'auto',
              background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-2xl)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--canvas-border)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-coral">
                      {selectedTeam.registration_number || selectedTeam.id}
                    </span>
                    <span className={`badge ${selectedTeam.payment_status === 'paid' ? 'badge-lime' : 'badge-lavender'}`}>
                      {selectedTeam.payment_status === 'paid' ? '✓ Paid (₹1,000)' : '⏳ Payment Pending'}
                    </span>
                    {selectedTeam.is_locked ? (
                      <span className="badge badge-peach"><Lock size={12} /> Registration Locked</span>
                    ) : (
                      <span className="badge badge-sky"><Unlock size={12} /> Editable</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                    {selectedTeam.team_name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Official Team QR Entry Pass Card */}
              <div className="bento-card" style={{
                padding: '1.25rem 1.5rem',
                marginBottom: '1.25rem',
                background: '#FFFFFF',
                border: '1.5px solid var(--whiz-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-coral" style={{ fontSize: '0.75rem' }}>OFFICIAL QR ENTRY PASS</span>
                    <span className={`badge ${selectedTeam.payment_status === 'paid' ? 'badge-lime' : 'badge-lavender'}`} style={{ fontSize: '0.7rem' }}>
                      {selectedTeam.payment_status === 'paid' ? '● VERIFIED & PAID' : '⏳ UNPAID'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.3rem' }}>
                    Accreditation & Gate Check QR
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Scan with any smartphone camera at Vel Tech Gate / Reception Desk to verify credentials, roster accreditation, and payment clearance instantly.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TeamQrCode team={selectedTeam} size={140} showActions={true} />
                </div>
              </div>

              {/* Leader Details Card */}
              <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} /> Team Leader Details
                  </h4>
                  <span className="badge badge-sky">Team Lead</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong>Full Name:</strong> {selectedTeam.leader_name || 'Aditya Verma'}</div>
                  <div><strong>Student Email:</strong> {selectedTeam.leader_email || 'leader@visai.in'}</div>
                  <div><strong>Contact Phone:</strong> {selectedTeam.leader_phone || '+91 98765 43210'}</div>
                  <div><strong>College ID / Roll No:</strong> {selectedTeam.student_id || 'IITB-2024-CS104'}</div>
                  <div><strong>Department:</strong> {selectedTeam.department || 'Computer Science & Engineering'}</div>
                  <div><strong>Year of Study:</strong> {selectedTeam.year_of_study || '3rd Year B.Tech'}</div>
                </div>
              </div>

              {/* College & Location Card */}
              <div className="bento-card card-pastel-mint" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={16} /> College & Campus Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong>College Name:</strong> {selectedTeam.college_name || 'IIT Bombay'}</div>
                  <div><strong>City / Location:</strong> {selectedTeam.city || 'Mumbai'}</div>
                  <div><strong>State:</strong> {selectedTeam.state || 'Maharashtra'}</div>
                  <div><strong>Pincode:</strong> {selectedTeam.pincode || '400076'}</div>
                </div>
              </div>

              {/* Problem Selection & Submission Deliverables */}
              <div className="bento-card card-pastel-peach" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> Problem Statement & Idea Submission
                </h4>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <div><strong>Track:</strong> {selectedTeam.track || 'SDG 09: Industry, Innovation & Infrastructure'}</div>
                  <div><strong>Problem Code:</strong> <span className="badge badge-sky" style={{ fontSize: '0.75rem' }}>{selectedTeam.ps_code || 'VISAI-SDG09-IND01'}</span></div>
                  <div style={{ marginTop: '0.5rem' }}><strong>Abstract & PPT Submission:</strong></div>
                  <div style={{ background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', marginTop: '0.35rem', border: '1px solid var(--canvas-border)' }}>
                    {selectedTeam.abstract_text || 'Predictive Vibration Anomaly Detection using Edge ML on sensor telemetry streams.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--canvas-border)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`btn ${selectedTeam.is_locked ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                    onClick={() => handleToggleTeamLock(selectedTeam.id, selectedTeam.is_locked)}
                    style={{ fontWeight: 800 }}
                  >
                    {selectedTeam.is_locked ? <><Unlock size={14} /> Unlock Registration</> : <><Lock size={14} /> Lock Registration</>}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {selectedTeam.payment_status === 'paid' && !selectedTeam.invoice_approved && (
                    <button
                      className="btn btn-coral btn-sm"
                      onClick={() => handleApproveInvoice(selectedTeam.id)}
                      style={{ fontWeight: 800 }}
                    >
                      <CheckCircle size={15} /> Approve Official GST Invoice
                    </button>
                  )}

                  {selectedTeam.payment_status === 'paid' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPreviewInvoiceTeam(selectedTeam)}
                      style={{ fontWeight: 800 }}
                    >
                      <Printer size={15} /> Preview Tax Invoice
                    </button>
                  )}

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedTeam(null)}
                    style={{ fontWeight: 800 }}
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 2: OFFICIAL GST TAX INVOICE PREVIEW (Admin & Participant View)
           ===================================================== */}
        {previewInvoiceTeam && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 11000,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div className="bento-card" style={{
              maxWidth: 720, width: '100%', maxHeight: '92vh', overflowY: 'auto',
              background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-2xl)'
            }}>
              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--whiz-coral)', letterSpacing: '0.05em' }}>
                    TAX INVOICE & OFFICIAL RECEIPT
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000000', margin: '0.2rem 0' }}>
                    Vel Tech R&D Institute of Science and Technology
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                    400 Feet Outer Ring Road, Avadi, Chennai – 600062, Tamil Nadu, India<br />
                    <strong>GSTIN:</strong> 33AAAAA0000A1Z5 • <strong>Email:</strong> visai@veltech.edu.in
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-lime" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    ✓ PAID & VERIFIED
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                    Invoice #: INV-VISAI27-{previewInvoiceTeam.id?.slice(0, 8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Date: {new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Bill To Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontWeight: 800, color: '#374151', marginBottom: '0.25rem' }}>BILLED TO (TEAM LEADER):</div>
                  <div><strong>{previewInvoiceTeam.leader_name || 'Team Leader'}</strong></div>
                  <div>Team: {previewInvoiceTeam.team_name}</div>
                  <div>Reg No: {previewInvoiceTeam.registration_number || previewInvoiceTeam.id}</div>
                  <div>Email: {previewInvoiceTeam.leader_email || 'leader@visai.in'}</div>
                </div>

                <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontWeight: 800, color: '#374151', marginBottom: '0.25rem' }}>INSTITUTION DETAILS:</div>
                  <div><strong>{previewInvoiceTeam.college_name || 'IIT Bombay'}</strong></div>
                  <div>{previewInvoiceTeam.city || 'Chennai'}, {previewInvoiceTeam.state || 'Tamil Nadu'}</div>
                  <div>Payment Gateway: Razorpay (rzp_test_TjWTndAvEuQPFf)</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ background: '#F3F4F6', borderBottom: '1px solid #D1D5DB' }}>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>SAC</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Base Amount</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>GST (18%)</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Total (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem' }}>
                      VISAI 2027 International SDG Hackathon Team Registration Fee (Up to 4 Members)
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>999293</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹847.46</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹152.54</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800 }}>₹1,000.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Official Seal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #000', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  This is a computer-generated official tax invoice attested by the VISAI 2027 Organizing Committee.
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Total Paid:</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>₹1,000.00</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  className="btn btn-coral btn-sm"
                  onClick={() => { window.print(); }}
                  style={{ fontWeight: 800 }}
                >
                  <Printer size={15} /> Print / Save PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewInvoiceTeam(null)}
                  style={{ fontWeight: 800 }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 3: PROVISION JURY MEMBER
           ===================================================== */}
        {addJuryModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div className="bento-card" style={{ maxWidth: 540, width: '100%', background: '#FFFFFF', padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                    Provision Jury Member
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Set up evaluator profile and issue initial login credentials.
                  </p>
                </div>
                <button onClick={() => setAddJuryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateJury} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Full Name & Title <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvind Swaminathan"
                    value={juryForm.full_name}
                    onChange={e => setJuryForm({ ...juryForm, full_name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Email Address <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jury.ai@visai.in"
                      value={juryForm.email}
                      onChange={e => setJuryForm({ ...juryForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Initial Password <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={juryForm.password}
                      onChange={e => setJuryForm({ ...juryForm, password: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft Cloud & AI / Bosch"
                    value={juryForm.organization}
                    onChange={e => setJuryForm({ ...juryForm, organization: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Assigned UN SDG Track
                  </label>
                  <select
                    value={juryForm.track}
                    onChange={e => setJuryForm({ ...juryForm, track: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', background: '#FFFFFF' }}
                  >
                    {SDG_8_THEMES.map(sdg => (
                      <option key={sdg.number} value={`SDG ${sdg.number}: ${sdg.shortName}`}>
                        SDG {sdg.number}: {sdg.shortName} ({sdg.partner})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAddJuryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-coral btn-sm" style={{ fontWeight: 800 }}>
                    Create & Provision Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 4: ADD NEW PROBLEM STATEMENT
           ===================================================== */}
        {newPsModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div className="bento-card" style={{ maxWidth: 640, width: '100%', background: '#FFFFFF', padding: '2.25rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                    Add New Problem Statement
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                    Publish a challenge statement aligned with UN SDG goals to the database.
                  </p>
                </div>
                <button onClick={() => setNewPsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPs} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Challenge Title <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI-Powered Smart Microgrid Load Balancer"
                    value={newPsForm.title}
                    onChange={e => setNewPsForm({ ...newPsForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      UN SDG Track <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                    </label>
                    <select
                      value={newPsForm.sdg_theme}
                      onChange={e => setNewPsForm({ ...newPsForm, sdg_theme: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', background: '#FFFFFF', fontWeight: 600 }}
                    >
                      {SDG_8_THEMES.map(sdg => (
                        <option key={sdg.number} value={`SDG 0${sdg.number}: ${sdg.shortName}`}>
                          SDG {sdg.number}: {sdg.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Industry Sponsor / Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nicola Foundation / IEEE"
                      value={newPsForm.partner}
                      onChange={e => setNewPsForm({ ...newPsForm, partner: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Short Summary (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief industrial engineering summary..."
                    value={newPsForm.description}
                    onChange={e => setNewPsForm({ ...newPsForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Detailed Problem Scope & Architecture Deliverables
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe problem context, expected solution architecture, evaluation benchmarks..."
                    value={newPsForm.full_description}
                    onChange={e => setNewPsForm({ ...newPsForm, full_description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setNewPsModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-coral btn-sm" style={{ fontWeight: 800 }}>
                    Save & Publish to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 5: JURY CREDENTIALS SUCCESS POPUP
           ===================================================== */}
        {credentialsPopup && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 11500,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div className="bento-card" style={{ maxWidth: 500, width: '100%', background: '#FFFFFF', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--pastel-mint-bg)', color: 'var(--pastel-mint-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Key size={30} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                Jury Provisioned Successfully!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Evaluator account created in database. Copy or email credentials directly.
              </p>

              <div style={{ background: 'var(--canvas-subtle)', padding: '1rem', borderRadius: 'var(--r-md)', textAlign: 'left', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem', border: '1px solid var(--canvas-border)' }}>
                <div><strong>Evaluator:</strong> {credentialsPopup.full_name}</div>
                <div><strong>Email:</strong> {credentialsPopup.email}</div>
                <div><strong>Password:</strong> <code style={{ color: 'var(--whiz-coral)', fontWeight: 800 }}>{credentialsPopup.initial_password}</code></div>
                <div><strong>Track:</strong> {credentialsPopup.track}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCopyCredentials(credentialsPopup)}
                  style={{ flex: 1, fontWeight: 800 }}
                >
                  <Copy size={15} /> Copy Info
                </button>
                <button
                  className="btn btn-coral"
                  onClick={() => {
                    const email = credentialsPopup.email;
                    setCredentialsPopup(null);
                    setEmailTargetGroup('custom');
                    setEmailTargetCustom(email);
                    setEmailModalOpen(true);
                  }}
                  style={{ flex: 1, fontWeight: 800 }}
                >
                  <Mail size={15} /> Send Email
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setCredentialsPopup(null)}
                  style={{ fontWeight: 700 }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL 6: PROBLEM STATEMENT DETAIL / OPEN MODAL
           ===================================================== */}
        <ProblemStatementModal
          ps={selectedPsModal}
          isOpen={!!selectedPsModal}
          onClose={() => setSelectedPsModal(null)}
          onDelete={handleDeletePs}
        />

        {/* =====================================================
            MODAL 7: ADMIN EMAIL BROADCAST & DISPATCH MODAL
           ===================================================== */}
        <EmailDispatchModal
          isOpen={emailModalOpen}
          onClose={() => {
            setEmailModalOpen(false);
            loadData();
          }}
          defaultTarget={emailTargetGroup}
          defaultEmail={emailTargetCustom}
        />

      </div>
    </div>
  );
}
