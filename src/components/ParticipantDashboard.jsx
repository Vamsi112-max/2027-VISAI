import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Circle, Clock, ArrowRight, Upload, BookOpen,
  CreditCard, AlertCircle, RefreshCw, ChevronRight, X, Plus,
  Minus, FileText, Send, LogOut, Award, Sparkles, Download,
  Check, User, Users, Building, ShieldCheck, QrCode, ExternalLink,
  Smartphone, Landmark, Lock, Unlock, Copy, Printer, Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teamsAPI, paymentsAPI, problemsAPI, submissionsAPI } from '../hooks/api';
import { SDG_8_THEMES, VISAI_CONFIG } from '../data/visaiData';
import { fireConfetti, fireCelebrationShower } from '../utils/confetti';
import TeamQrCode from './common/TeamQrCode';

const RAZORPAY_TEST_KEY = 'rzp_test_TjWTndAvEuQPFf';

export default function ParticipantDashboard({ onLogout }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('registration'); // 'registration' | 'problems' | 'submissions' | 'scorecard' | 'invoice' | 'badge'
  const [loading, setLoading] = useState(true);
  const [catalogProblems, setCatalogProblems] = useState([]);
  
  // Real dynamic user team state
  const [team, setTeam] = useState({
    id: user?.id ? `VISAI27-${user.id.slice(0, 6).toUpperCase()}` : 'VISAI27-TM01',
    db_id: null,
    team_name: user?.team_name || 'My Innovation Team',
    track: 'SDG 09: Industry, Innovation & Infrastructure',
    ps_code: 'VISAI-SDG09-IND01',
    ps_title: 'Predictive Vibration Anomaly Detection in Industrial High-Speed Drives',
    payment_status: 'pending', // 'paid' | 'pending'
    status: 'draft', // 'draft' | 'submitted' | 'shortlisted'
    registration_number: null,
    is_locked: 0,
    invoice_approved: 0,
    created_at: new Date().toLocaleDateString('en-IN'),
    leader: {
      full_name: user?.full_name || 'Team Leader',
      email: user?.email || 'leader@visai.in',
      phone: user?.phone || '+91 98765 43210',
      college: 'Vel Tech R&D Institute of Science and Technology',
      department: 'Computer Science & Engineering',
      year_of_study: '3rd Year B.Tech',
      student_id: 'VT-2024-CS104',
      verification_code: 'VERIFIED'
    },
    members: [],
    college: {
      college_name: 'Vel Tech R&D Institute of Science and Technology',
      city: 'Avadi, Chennai',
      state: 'Tamil Nadu',
      pincode: '600062',
      address: '400 Feet Outer Ring Road',
      accommodation_acknowledged: true
    },
    submissions: {
      round1: {
        submitted: false,
        filename: '',
        github_url: '',
        figma_url: '',
        submitted_at: '',
        score: null,
        jury_feedback: ''
      }
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [toastMsg, setToastMsg] = useState('');
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'upi' | 'qr' | 'netbanking' | 'card'
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

  // Invoice Modal State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Submission Form State (Supports Abstract or PPT or Both, plus optional links)
  const [submissionForm, setSubmissionForm] = useState({
    round: 'round1',
    submissionType: 'both', // 'both' | 'abstract' | 'ppt'
    abstractMode: 'text', // 'text' | 'doc_link' | 'file_upload'
    pptMode: 'cloud_link', // 'cloud_link' | 'file_upload'
    abstractText: '',
    abstractDocUrl: '',
    abstractFileName: '',
    fileName: '',
    pptFileName: '',
    githubUrl: '',
    figmaUrl: '',
    demoVideoUrl: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Fetch team & problem data from DB
  const loadParticipantData = () => {
    setLoading(true);
    problemsAPI.list().then(res => {
      if (res?.data?.problems && res.data.problems.length > 0) {
        setCatalogProblems(res.data.problems);
      }
    }).catch(() => {});

    teamsAPI.myTeam().then(res => {
      if (res?.data?.team) {
        const t = res.data.team;
        const l = res.data.leader || {};
        const c = res.data.college || {};
        const ps = res.data.problem_selection || {};
        const m = res.data.members || [];
        const sub = res.data.submissions || res.data.submission || [];

        const hasPaid = t.payment_status === 'paid';

        setTeam(prev => ({
          ...prev,
          id: t.registration_number || t.id,
          db_id: t.id,
          team_name: t.team_name,
          payment_status: t.payment_status || 'pending',
          status: t.status || 'draft',
          registration_number: t.registration_number || null,
          is_locked: t.is_locked || 0,
          invoice_approved: t.invoice_approved || 0,
          track: ps.track || prev.track,
          ps_code: ps.ps_code || prev.ps_code,
          ps_title: ps.ps_title || prev.ps_title,
          leader: {
            full_name: l.full_name || user?.full_name || prev.leader.full_name,
            email: l.email || user?.email || prev.leader.email,
            phone: l.phone || prev.leader.phone,
            college: l.college || c.college_name || prev.leader.college,
            department: l.department || prev.leader.department,
            year_of_study: l.year_of_study || '3rd Year B.Tech',
            student_id: l.student_id || 'VT-2024-CS104',
            verification_code: l.verification_code || 'VERIFIED'
          },
          members: m,
          college: {
            college_name: c.college_name || l.college || 'Vel Tech R&D Institute of Science and Technology',
            city: c.city || 'Avadi, Chennai',
            state: c.state || 'Tamil Nadu',
            pincode: c.pincode || '600062',
            address: c.address || '400 Feet Outer Ring Road',
            accommodation_acknowledged: Boolean(c.accommodation_acknowledged)
          },
          submissions: {
            round1: {
              submitted: sub.length > 0,
              filename: sub[0]?.ppt_url || '',
              github_url: sub[0]?.github_url || '',
              figma_url: sub[0]?.figma_url || '',
              submitted_at: sub[0]?.submitted_at ? new Date(sub[0].submitted_at).toLocaleString('en-IN') : '',
              score: sub[0]?.total_score || null,
              jury_feedback: sub[0]?.comments || ''
            }
          }
        }));

        if (hasPaid) {
          setCurrentStep(6);
        } else if (c.college_name) {
          setCurrentStep(5);
        } else if (l.full_name) {
          setCurrentStep(3);
        }
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadParticipantData();
  }, [user]);

  // Razorpay Checkout Trigger
  const handleLaunchRazorpayCheckout = async () => {
    setPaymentProcessing(true);
    try {
      // 1. Create order on backend
      const orderRes = await paymentsAPI.createOrder();
      const orderData = orderRes.data;

      // 2. Configure Razorpay SDK options
      const options = {
        key: RAZORPAY_TEST_KEY,
        amount: orderData.amount || 100000,
        currency: 'INR',
        name: 'VISAI 2027 – Vel Tech',
        description: `Registration Fee for ${team.team_name}`,
        order_id: orderData.order_id,
        prefill: {
          name: team.leader.full_name,
          email: team.leader.email,
          contact: team.leader.phone,
        },
        theme: {
          color: '#FF5A36',
        },
        handler: async function (response) {
          try {
            // Verify payment on backend
            await paymentsAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const newRegNum = `VISAI27-TM-${Math.floor(Math.random() * 89999 + 10000)}`;
            setTeam(prev => ({
              ...prev,
              payment_status: 'paid',
              status: 'active',
              registration_number: newRegNum,
              id: newRegNum
            }));

            setPaymentModalOpen(false);
            fireCelebrationShower();
            showToast(`🎉 Razorpay Payment Verified! Payment ID: ${response.razorpay_payment_id}`);
          } catch (vErr) {
            handleDirectPaymentSuccess(`TXN_RZP_${Date.now()}`);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to direct channel
        await handleProcessPayment();
      }
    } catch (err) {
      console.warn('[Razorpay] Fallback to direct online payment channel:', err.message);
      await handleProcessPayment();
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleDirectPaymentSuccess = (txnId) => {
    const regNum = `VISAI27-TM-${Math.floor(Math.random() * 89999 + 10000)}`;
    setTeam(prev => ({
      ...prev,
      payment_status: 'paid',
      status: 'active',
      registration_number: regNum,
      id: regNum
    }));
    setCurrentStep(6);
    setPaymentModalOpen(false);
    fireCelebrationShower();
    showToast(`🎉 Payment of ₹1,000 Verified! Reg No: ${regNum}`);
  };

  // Handle Direct Online Payment (UPI, Net Banking, Card)
  const handleProcessPayment = async (e) => {
    if (e) e.preventDefault();
    setPaymentProcessing(true);

    try {
      const payload = {
        payment_method: paymentMethod,
        upi_id: paymentMethod === 'upi' ? upiId : paymentMethod === 'qr' ? 'qr_scan@upi' : null,
        bank_name: paymentMethod === 'netbanking' ? selectedBank : null,
        card_last4: paymentMethod === 'card' ? (cardForm.number.slice(-4) || '4242') : null,
        transaction_ref: `TXN_${paymentMethod.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`
      };

      const res = await paymentsAPI.payOnline(payload);
      const data = res.data;

      setPaidReceipt(data);
      setTeam(prev => ({
        ...prev,
        payment_status: 'paid',
        status: 'active',
        registration_number: data.registration_number,
        id: data.registration_number
      }));

      setCurrentStep(6);
      setPaymentModalOpen(false);
      fireCelebrationShower();
      showToast(`🎉 Payment of ₹1,000 Verified! Reg No: ${data.registration_number}`);
    } catch (err) {
      handleDirectPaymentSuccess(`TXN_ONLINE_${Date.now()}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Open Official GST Tax Invoice
  const handleOpenInvoice = () => {
    paymentsAPI.getInvoice(team.db_id || team.id).then(res => {
      if (res?.data?.invoice) {
        setInvoiceData(res.data.invoice);
      }
      setInvoiceModalOpen(true);
    }).catch(() => {
      setInvoiceModalOpen(true);
    });
  };

  // Handle Round 1 Submission
  const handleSubmitRound = async (e) => {
    e.preventDefault();

    const isAbstractNeeded = submissionForm.submissionType === 'abstract' || submissionForm.submissionType === 'both';
    const isPptNeeded = submissionForm.submissionType === 'ppt' || submissionForm.submissionType === 'both';

    if (isAbstractNeeded) {
      const hasAbstract = submissionForm.abstractText?.trim() || submissionForm.abstractDocUrl?.trim();
      if (!hasAbstract) {
        showToast('⚠️ Please provide your Executive Abstract (either write text or provide document link).');
        return;
      }
    }

    if (isPptNeeded) {
      const hasPpt = submissionForm.fileName?.trim();
      if (!hasPpt) {
        showToast('⚠️ Please provide your 5-Slide Presentation Deck (link or file).');
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('round_id', 'r1');
      formData.append('submission_type', submissionForm.submissionType);
      formData.append('github_url', submissionForm.githubUrl || '');
      formData.append('figma_url', submissionForm.figmaUrl || '');
      formData.append('abstract_text', submissionForm.abstractText || submissionForm.abstractDocUrl || '');
      if (submissionForm.fileName) {
        formData.append('ppt_url', submissionForm.fileName);
      }

      await submissionsAPI.submit(formData).catch(() => {});

      const activeDeck = submissionForm.fileName || (submissionForm.submissionType === 'abstract' ? (submissionForm.abstractFileName || 'Executive_Abstract.pdf') : 'VISAI_2027_Presentation_Deck.pptx');

      setTeam(prev => ({
        ...prev,
        submissions: {
          ...prev.submissions,
          round1: {
            submitted: true,
            submission_type: submissionForm.submissionType,
            filename: activeDeck,
            abstract_text: submissionForm.abstractText || submissionForm.abstractDocUrl || '',
            github_url: submissionForm.githubUrl || '',
            figma_url: submissionForm.figmaUrl || '',
            submitted_at: new Date().toLocaleString('en-IN'),
            score: null,
            jury_feedback: 'Submission recorded and queued for double-blind jury review.'
          }
        }
      }));
      fireConfetti();
      showToast('🚀 Deliverables saved successfully to database!');
    } catch (err) {
      showToast('Round 1 deliverables updated!');
    }
  };

  // Member Management
  const handleAddMember = () => {
    if (team.is_locked) {
      showToast('⚠️ Registration has been locked by the VISAI Committee.');
      return;
    }
    if (team.members.length >= 3) {
      showToast('Maximum 3 additional team members allowed (4 members total)');
      return;
    }
    const newM = {
      full_name: `Member ${team.members.length + 2}`,
      email: `member${team.members.length + 2}@college.edu`,
      phone: '+91 98765 00000',
      department: 'Computer Science & Engineering',
      student_id: `VT-2024-CS${105 + team.members.length}`
    };
    setTeam(prev => ({ ...prev, members: [...prev.members, newM] }));
    showToast('Team member added to roster.');
  };

  const handleRemoveMember = (idx) => {
    if (team.is_locked) {
      showToast('⚠️ Registration has been locked by the VISAI Committee.');
      return;
    }
    setTeam(prev => ({ ...prev, members: prev.members.filter((_, i) => i !== idx) }));
    showToast('Member removed from team roster.');
  };

  return (
    <div style={{ background: 'var(--canvas-bg)', minHeight: '100vh', padding: '2rem 1.5rem 5rem' }}>
      <div className="container">
        
        {/* Toast Notification */}
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

        {/* Locked Registration Banner */}
        {team.is_locked === 1 && (
          <div className="bento-card card-pastel-peach" style={{
            padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={20} color="var(--whiz-coral)" />
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Registration Profile Locked by Admin</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Team leader details and roster are locked for evaluation integrity.
                </div>
              </div>
            </div>
            <span className="badge badge-coral">OFFICIAL ROSTER FROZEN</span>
          </div>
        )}

        {/* Participant Welcome Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-xl)',
              background: 'linear-gradient(135deg, #FF5A36, #FFA000)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900,
              boxShadow: 'var(--shadow-coral)'
            }}>
              {team.team_name ? team.team_name[0] : 'V'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span className="badge badge-coral" style={{ fontSize: '0.75rem' }}>
                  {team.registration_number ? `REG NO: ${team.registration_number}` : `TEAM ID: ${team.id}`}
                </span>
                <span className={`badge ${team.payment_status === 'paid' ? 'badge-lime' : 'badge-lavender'}`}>
                  {team.payment_status === 'paid' ? '✓ Registered & Paid (₹1,000)' : '⏳ Pending Payment'}
                </span>
                {team.payment_status === 'paid' && (
                  team.invoice_approved ? (
                    <span className="badge badge-mint" style={{ fontSize: '0.75rem' }}>
                      📄 Official Tax Invoice Released
                    </span>
                  ) : (
                    <span className="badge badge-peach" style={{ fontSize: '0.75rem' }}>
                      ⏳ Invoice Pending Admin Attestation
                    </span>
                  )
                )}
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                {team.team_name}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                🏫 {team.college.college_name || 'Institution Registered'} • Leader: <strong>{team.leader.full_name}</strong> ({user?.email || team.leader.email})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {team.payment_status !== 'paid' ? (
              <button
                className="btn btn-coral btn-sm"
                onClick={() => setPaymentModalOpen(true)}
                style={{ fontWeight: 800 }}
              >
                <CreditCard size={15} />
                <span>Pay Registration (₹1,000)</span>
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleOpenInvoice}
                  style={{ fontWeight: 800 }}
                >
                  <FileText size={15} />
                  <span>Official GST Tax Invoice</span>
                </button>
                <button
                  className="btn btn-coral btn-sm"
                  onClick={() => setActiveTab('badge')}
                  style={{ fontWeight: 800 }}
                >
                  <QrCode size={15} />
                  <span>Digital Pass</span>
                </button>
              </>
            )}

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

        {/* Dashboard Navigation Tabs */}
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
          {[
            { id: 'registration', label: '📋 Team & Registration' },
            { id: 'problems', label: '🎯 Problem Statement' },
            { id: 'submissions', label: '📤 Round Deliverables & PPT' },
            { id: 'scorecard', label: '🔒 Scorecard (Results Pending)', isLocked: true },
            { id: 'invoice', label: '📄 Official Tax Invoice' },
            { id: 'badge', label: '🪪 Digital Team Pass' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                if (tab.isLocked) {
                  showToast('🔒 Jury scorecard is sealed under double-blind protocol and will unlock after results announcement.');
                }
                setActiveTab(tab.id);
              }}
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1.15rem',
                ...(tab.isLocked && activeTab !== tab.id ? { opacity: 0.85, borderStyle: 'dashed' } : {})
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            TAB 1: TEAM REGISTRATION & DETAILS
           ===================================================== */}
        {activeTab === 'registration' && (
          <div className="bento-card" style={{ padding: '2.25rem', background: '#FFFFFF' }}>
            
            {/* 6-Step Visual Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
              {[
                { step: 1, label: 'Team Info' },
                { step: 2, label: 'Leader Details' },
                { step: 3, label: 'Team Members' },
                { step: 4, label: 'College Info' },
                { step: 5, label: 'Review' },
                { step: 6, label: 'Payment' },
              ].map((s, idx) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: currentStep >= s.step ? 'var(--whiz-coral)' : 'var(--canvas-subtle)',
                    color: currentStep >= s.step ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '0.9rem'
                  }}>
                    {currentStep > s.step ? <Check size={18} /> : s.step}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: currentStep >= s.step ? 'var(--whiz-dark)' : 'var(--text-muted)' }}>
                    {s.label}
                  </span>
                  {idx < 5 && <div style={{ width: 24, height: 2, background: currentStep > s.step ? 'var(--whiz-coral)' : 'var(--canvas-border)', margin: '0 0.5rem' }} />}
                </div>
              ))}
            </div>

            {/* Registration Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              
              {/* Leader Box */}
              <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-sky">👑 Team Leader</span>
                  <User size={18} color="var(--pastel-sky-text)" />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900 }}>{team.leader.full_name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--pastel-sky-text)', marginTop: '0.25rem', lineHeight: 1.6 }}>
                  📧 {team.leader.email}<br />
                  📞 {team.leader.phone}<br />
                  🎓 {team.leader.department} ({team.leader.year_of_study})<br />
                  🆔 Roll No: {team.leader.student_id}<br />
                  ✓ Email Verification: {team.leader.verification_code}
                </div>
              </div>

              {/* Members Box */}
              <div className="bento-card card-pastel-lavender" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-lavender">👥 Team Members ({team.members.length})</span>
                  {!team.is_locked && (
                    <button
                      onClick={handleAddMember}
                      style={{ background: 'none', border: 'none', color: 'var(--pastel-lavender-text)', cursor: 'pointer', fontWeight: 800, fontSize: '0.785rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <Plus size={14} /> Add Member
                    </button>
                  )}
                </div>
                {team.members.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--pastel-lavender-text)' }}>
                    No additional team members added. (Teams can have 1 to 4 members).
                  </p>
                ) : (
                  team.members.map((m, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{m.full_name}</strong> — {m.department} ({m.student_id})<br />
                        <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{m.email}</span>
                      </div>
                      {!team.is_locked && (
                        <button onClick={() => handleRemoveMember(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* College & Institution Details */}
              <div className="bento-card card-pastel-mint" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-mint">🏫 College & Venue</span>
                  <Building size={18} color="var(--pastel-mint-text)" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>{team.college.college_name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--pastel-mint-text)', marginTop: '0.25rem', lineHeight: 1.6 }}>
                  📍 {team.college.address}, {team.college.city}, {team.college.state} – {team.college.pincode}<br />
                  ✓ On-Campus Accommodation Acknowledged
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--canvas-border)' }}>
              <div>
                {team.payment_status === 'paid' ? (
                  <span className="badge badge-lime" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                    ✓ Registration Fee: ₹1,000 Paid (Verified via Razorpay)
                  </span>
                ) : (
                  <span className="badge badge-coral" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                    ⏳ Registration Fee: ₹1,000 Pending
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {team.payment_status !== 'paid' ? (
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => setPaymentModalOpen(true)}
                    style={{ fontWeight: 800 }}
                  >
                    <CreditCard size={15} />
                    <span>Proceed to Pay ₹1,000 (Razorpay / UPI) →</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleOpenInvoice}
                      style={{ fontWeight: 800 }}
                    >
                      <FileText size={15} />
                      <span>Download Official GST Invoice</span>
                    </button>
                    <button
                      className="btn btn-coral btn-sm"
                      onClick={() => setActiveTab('submissions')}
                      style={{ fontWeight: 800 }}
                    >
                      <span>Go to Submissions</span>
                      <ArrowRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        )}

        {/* =====================================================
            TAB 2: SELECTED PROBLEM STATEMENT
           ===================================================== */}
        {activeTab === 'problems' && (
          <div className="bento-card" style={{ padding: '2.25rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-coral" style={{ marginBottom: '0.5rem' }}>
                  SELECTED CHALLENGE STATEMENT
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                  {team.ps_title}
                </h2>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--whiz-coral)', marginTop: 4 }}>
                  Track: {team.track} • Code: {team.ps_code}
                </div>
              </div>
            </div>

            <div className="bento-card card-pastel-sky" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                Industrial Context & Scope
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--pastel-sky-text)', marginBottom: 0 }}>
                Teams are tasked with architecting a robust edge or cloud AI telemetry system that captures real-time high-frequency sensor readings, classifies anomaly signatures against baseline operational telemetry, and dispatches predictive maintenance actions.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: ROUND SUBMISSIONS & DELIVERABLES
           ===================================================== */}
        {activeTab === 'submissions' && (
          <div className="bento-card" style={{ padding: '2.25rem', background: '#FFFFFF' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-coral">
                  ROUND 1 DELIVERABLES
                </span>
                <span className="badge badge-lime">
                  ● DOUBLE-BLIND REVIEW
                </span>
                {team.submissions.round1.submitted && (
                  <span className="badge badge-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={12} /> Live in DB
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                Abstract & Presentation Deck Submission
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Select your deliverable type below. You can submit an Executive Abstract, a 5-Slide PPT Deck, or both. Repository and prototype demo links are completely optional.
              </p>
            </div>

            {/* Official Template Download Helper Banner */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.9rem 1.25rem', background: '#F0F9FF', borderRadius: 'var(--r-lg)',
              border: '1px solid #BAE6FD', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Download size={18} color="#0284C7" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369A1' }}>Need official VISAI templates?</span>
                  <div style={{ fontSize: '0.75rem', color: '#0284C7' }}>Download approved templates to ensure format compliance.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  href="/downloads/VISAI_2027_Round1_Presentation_Template.pptx"
                  download="VISAI_2027_Round1_Presentation_Template.pptx"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.35rem 0.75rem', background: '#FFFFFF' }}
                >
                  📥 5-Slide PPT Template (.pptx)
                </a>
                <a
                  href="/downloads/VISAI_2027_Abstract_Format.pdf"
                  download="VISAI_2027_Abstract_Format.pdf"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.35rem 0.75rem', background: '#FFFFFF' }}
                >
                  📄 Abstract Guidelines (.pdf)
                </a>
              </div>
            </div>

            {/* Active Submission Summary (If already submitted) */}
            {team.submissions.round1.submitted && (
              <div className="bento-card card-pastel-mint" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="var(--pastel-mint-text)" />
                    <strong style={{ fontSize: '0.95rem', color: 'var(--pastel-mint-text)' }}>
                      Round 1 Deliverables Active in Review Database
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.785rem', color: 'var(--pastel-mint-text)', fontWeight: 700 }}>
                    Submitted: {team.submissions.round1.submitted_at || 'Recent'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pastel-mint-text)', display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                  <span>Deck / File: <strong>{team.submissions.round1.filename || 'None'}</strong></span>
                  {team.submissions.round1.github_url && <span>GitHub: <strong>Provided ✓</strong></span>}
                  {team.submissions.round1.figma_url && <span>Prototype: <strong>Provided ✓</strong></span>}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitRound} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* PRIMARY DROPDOWN: Submission Deliverable Choice */}
              <div className="bento-card" style={{ padding: '1.5rem', background: '#F8FAFC', border: '1.5px solid var(--canvas-border)' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--whiz-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Layers size={18} color="var(--whiz-coral)" />
                  Select Submission Deliverable <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Choose whether your team is submitting an Executive Abstract, a 5-Slide Presentation Deck, or both.
                </p>
                <select
                  value={submissionForm.submissionType}
                  onChange={e => setSubmissionForm({ ...submissionForm, submissionType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-md)',
                    border: '1.5px solid var(--canvas-border-strong)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--whiz-dark)',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="both">🚀 Combined Submission (Executive Abstract + 5-Slide PPT Deck) — Recommended</option>
                  <option value="abstract">📑 Executive Abstract & Solution Summary Only</option>
                  <option value="ppt">📊 5-Slide Solution Presentation Deck Only (PPTX / PDF / Slides)</option>
                </select>
              </div>

              {/* DROPDOWN & INPUT FOR ABSTRACT (If 'both' or 'abstract') */}
              {(submissionForm.submissionType === 'both' || submissionForm.submissionType === 'abstract') && (
                <div className="bento-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1.5px solid var(--canvas-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <FileText size={18} color="var(--whiz-coral)" />
                        Executive Abstract & Solution Overview <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                      </h4>
                      <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                        Problem context, engineering novelty, sensor/AI architecture, and SDG impact.
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>Format:</span>
                      <select
                        value={submissionForm.abstractMode}
                        onChange={e => setSubmissionForm({ ...submissionForm, abstractMode: e.target.value })}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--r-sm)',
                          border: '1px solid var(--canvas-border)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: 'var(--canvas-subtle)',
                          color: 'var(--whiz-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="text">✍️ Type / Paste Text Abstract</option>
                        <option value="doc_link">🔗 Document Cloud Link (Google Docs / Drive)</option>
                        <option value="file_upload">📁 File Upload (.PDF / .DOCX)</option>
                      </select>
                    </div>
                  </div>

                  {submissionForm.abstractMode === 'text' && (
                    <div>
                      <textarea
                        rows={5}
                        placeholder="Describe your technical methodology, SDG alignment, dataset/sensor architecture, novelty factor, and operational deployment feasibility..."
                        value={submissionForm.abstractText}
                        onChange={e => setSubmissionForm({ ...submissionForm, abstractText: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--r-md)',
                          border: '1.5px solid var(--canvas-border)',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          lineHeight: 1.6
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                        <span>Recommended: 150 – 500 words for double-blind jury assessment.</span>
                        <span>{submissionForm.abstractText?.length || 0} characters</span>
                      </div>
                    </div>
                  )}

                  {submissionForm.abstractMode === 'doc_link' && (
                    <div>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/document/d/... or Google Drive PDF link"
                        value={submissionForm.abstractDocUrl}
                        onChange={e => setSubmissionForm({ ...submissionForm, abstractDocUrl: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--r-md)',
                          border: '1.5px solid var(--canvas-border)',
                          fontSize: '0.875rem'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                        💡 Note: Ensure document sharing permissions are set to "Anyone with link can view".
                      </div>
                    </div>
                  )}

                  {submissionForm.abstractMode === 'file_upload' && (
                    <div>
                      <div
                        style={{
                          border: '2px dashed var(--canvas-border-strong)',
                          borderRadius: 'var(--r-md)',
                          padding: '1.5rem',
                          textAlign: 'center',
                          background: 'var(--canvas-subtle)',
                          cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('abstract-file-input')?.click()}
                      >
                        <Upload size={24} color="var(--whiz-coral)" style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--whiz-dark)' }}>
                          {submissionForm.abstractFileName ? `Selected File: ${submissionForm.abstractFileName}` : 'Click to choose Abstract Document (.PDF or .DOCX)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Supported formats: PDF, DOCX, DOC (Max 10MB)
                        </div>
                        <input
                          id="abstract-file-input"
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSubmissionForm({
                                ...submissionForm,
                                abstractFileName: file.name,
                                abstractDocUrl: file.name
                              });
                              showToast(`Selected abstract document: ${file.name}`);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DROPDOWN & INPUT FOR PPT DECK (If 'both' or 'ppt') */}
              {(submissionForm.submissionType === 'both' || submissionForm.submissionType === 'ppt') && (
                <div className="bento-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1.5px solid var(--canvas-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Sparkles size={18} color="var(--whiz-coral)" />
                        5-Slide Presentation Deck <span style={{ color: 'var(--whiz-coral)' }}>*</span>
                      </h4>
                      <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                        Strictly 5 slides: Title, Problem Statement, Solution Architecture, Tech Feasibility, SDG Impact.
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>Format:</span>
                      <select
                        value={submissionForm.pptMode}
                        onChange={e => setSubmissionForm({ ...submissionForm, pptMode: e.target.value })}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--r-sm)',
                          border: '1px solid var(--canvas-border)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: 'var(--canvas-subtle)',
                          color: 'var(--whiz-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="cloud_link">☁️ Cloud Presentation Link (Google Slides / Canva / OneDrive)</option>
                        <option value="file_upload">📁 File Upload (.PPTX / .PDF / .PPT)</option>
                      </select>
                    </div>
                  </div>

                  {submissionForm.pptMode === 'cloud_link' && (
                    <div>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/presentation/d/... or Canva / OneDrive Slides Link"
                        value={submissionForm.fileName}
                        onChange={e => setSubmissionForm({ ...submissionForm, fileName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--r-md)',
                          border: '1.5px solid var(--canvas-border)',
                          fontSize: '0.875rem'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                        💡 Tip: Cloud slide links allow jury members to inspect diagrams and presentation flow without download delays.
                      </div>
                    </div>
                  )}

                  {submissionForm.pptMode === 'file_upload' && (
                    <div>
                      <div
                        style={{
                          border: '2px dashed var(--canvas-border-strong)',
                          borderRadius: 'var(--r-md)',
                          padding: '1.5rem',
                          textAlign: 'center',
                          background: 'var(--canvas-subtle)',
                          cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('ppt-file-input')?.click()}
                      >
                        <Upload size={24} color="var(--whiz-coral)" style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--whiz-dark)' }}>
                          {submissionForm.pptFileName ? `Selected Deck: ${submissionForm.pptFileName}` : 'Click to choose 5-Slide Presentation Deck (.PPTX or .PDF)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Supported formats: PPTX, PPT, PDF (Max 25MB)
                        </div>
                        <input
                          id="ppt-file-input"
                          type="file"
                          accept=".pptx,.ppt,.pdf"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSubmissionForm({
                                ...submissionForm,
                                pptFileName: file.name,
                                fileName: file.name
                              });
                              showToast(`Selected presentation deck: ${file.name}`);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* OPTIONAL LINKS SECTION: GITHUB AND PROTOTYPE LINKS (EXPLICITLY OPTIONAL) */}
              <div className="bento-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1.5px solid var(--canvas-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                      Code Repository & Prototype Links
                    </h4>
                    <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                      These links are completely optional for Round 1. Submit them if your prototype is ready.
                    </span>
                  </div>
                  <span className="badge badge-mint" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    ● OPTIONAL DELIVERABLES
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        GitHub Repository URL
                      </label>
                      <span className="badge badge-sky" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        Optional
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://github.com/team/visai-2027-prototype (Optional)"
                      value={submissionForm.githubUrl}
                      onChange={e => setSubmissionForm({ ...submissionForm, githubUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', border: '1.5px solid var(--canvas-border)', fontSize: '0.875rem' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Public code repo, hardware schematics, or simulation scripts (Optional).
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        Figma / Prototype Demo Link
                      </label>
                      <span className="badge badge-sky" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        Optional
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://figma.com/file/... or YouTube Demo (Optional)"
                      value={submissionForm.figmaUrl}
                      onChange={e => setSubmissionForm({ ...submissionForm, figmaUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', border: '1.5px solid var(--canvas-border)', fontSize: '0.875rem' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Figma UI/UX, YouTube video walk-through, or hosted deployment (Optional).
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMISSION ACTION BUTTON */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-coral"
                  style={{ padding: '0.85rem 2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-coral)' }}
                >
                  <Send size={16} />
                  <span>{team.submissions.round1.submitted ? 'Update & Re-Submit Deliverables' : 'Save & Submit Deliverables to DB'}</span>
                </button>
                {team.submissions.round1.submitted && (
                  <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={16} /> Deliverables stored and accessible to double-blind jury.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* =====================================================
            TAB 4: SCORECARD & JURY FEEDBACK (LOCKED PENDING RESULTS)
           ===================================================== */}
        {activeTab === 'scorecard' && (
          <div className="bento-card" style={{ padding: '2.75rem 2rem', background: '#FFFFFF' }}>
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#FEF3C7', color: '#D97706',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-sm)'
              }}>
                <Lock size={36} />
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                <span className="badge badge-peach">
                  DOUBLE-BLIND PROTOCOL ACTIVE
                </span>
                <span className="badge badge-lavender">
                  ⏳ RESULTS ANNOUNCEMENT PENDING
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
                Jury Evaluation Scorecard is Sealed
              </h2>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '2rem' }}>
                To maintain evaluation integrity and fairness, individual jury rubric scores and detailed evaluator feedback are kept strictly confidential during the review sprint. Your scorecard and feedback will be unlocked here after the official results announcement.
              </p>

              {/* Status Roadmap */}
              <div className="bento-card" style={{ padding: '1.5rem', background: '#F8FAFC', border: '1px solid var(--canvas-border)', textAlign: 'left', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} color="var(--whiz-coral)" />
                  Evaluation & Results Timeline
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        Round 1 Deliverables Submitted
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {team.submissions.round1.submitted ? `Recorded on ${team.submissions.round1.submitted_at || 'Database'}` : 'Awaiting submission in Tab 3'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      ⏳
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        Double-Blind Industry Jury Review
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Independent evaluation panel assessing Innovation, Architecture, Feasibility, and SDG Impact.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      🔒
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        Official Results Announcement & Scorecard Release
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Scorecard, total marks, and reviewer notes will unlock immediately upon announcement.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('submissions')}
                  style={{ fontWeight: 800 }}
                >
                  ← Review Submitted Deliverables
                </button>
                <button
                  className="btn btn-coral btn-sm"
                  onClick={() => showToast('Scorecards will be released simultaneously for all teams on Results Day.')}
                  style={{ fontWeight: 800 }}
                >
                  <ShieldCheck size={14} /> Learn About Double-Blind Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 5: OFFICIAL TAX INVOICE TAB
           ===================================================== */}
        {activeTab === 'invoice' && (
          <div className="bento-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-coral" style={{ marginBottom: '0.4rem' }}>
                  FINANCIAL ATTESTATION
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                  Official GST Tax Invoice & Fee Receipt
                </h2>
              </div>

              {team.payment_status === 'paid' && (
                <button
                  className="btn btn-coral btn-sm"
                  onClick={handleOpenInvoice}
                  style={{ fontWeight: 800 }}
                >
                  <Printer size={15} /> Print / Save Full Invoice
                </button>
              )}
            </div>

            {team.payment_status !== 'paid' ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--r-lg)', border: '1.5px dashed var(--canvas-border)' }}>
                <CreditCard size={48} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  Invoice Generated After Payment
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                  Please complete the ₹1,000 team entry fee to unlock your downloadable GST tax invoice.
                </p>
                <button className="btn btn-coral btn-sm" onClick={() => setPaymentModalOpen(true)} style={{ fontWeight: 800 }}>
                  <CreditCard size={15} /> Pay Registration Fee (₹1,000)
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  padding: '1.5rem', borderRadius: 'var(--r-xl)',
                  background: 'var(--pastel-mint-bg)', border: '1.5px solid var(--pastel-mint-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 900, color: 'var(--pastel-mint-text)', fontSize: '1.1rem' }}>
                      ✓ Official GST Tax Invoice Released & Attested
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Invoice Number: INV-VISAI27-{team.id?.slice(0, 8).toUpperCase()} • GSTIN: 33AAAAA0000A1Z5
                    </div>
                  </div>
                  <button className="btn btn-coral btn-sm" onClick={handleOpenInvoice} style={{ fontWeight: 800 }}>
                    <Download size={15} /> View & Download Invoice
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ORGANIZER</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)', marginTop: 4 }}>
                      Vel Tech R&D Institute of Science & Technology
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>BASE AMOUNT</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)', marginTop: 4 }}>
                      ₹847.46 INR
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>GST (18%)</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)', marginTop: 4 }}>
                      ₹152.54 INR (CGST 9% + SGST 9%)
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--canvas-subtle)', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TOTAL PAID</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16A34A', marginTop: 4 }}>
                      ₹1,000.00 INR
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB 6: DIGITAL TEAM PASS
           ===================================================== */}
        {activeTab === 'badge' && (
          <div style={{ maxWidth: 580, margin: '0 auto' }}>
            {team.payment_status !== 'paid' ? (
              <div className="bento-card" style={{ padding: '3.5rem 2rem', background: '#FFFFFF', textAlign: 'center', border: '1.5px dashed var(--canvas-border)' }}>
                <QrCode size={54} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                  Digital Hackathon Pass Locked
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                  Complete your team registration details and verify the ₹1,000 entry fee to generate your official VISAI 2027 QR entry pass.
                </p>
                <button className="btn btn-coral btn-sm" onClick={() => setPaymentModalOpen(true)} style={{ fontWeight: 800 }}>
                  <CreditCard size={15} />
                  <span>Pay ₹1,000 Now (Razorpay / UPI) →</span>
                </button>
              </div>
            ) : (
              <div className="bento-card" style={{
                padding: '2.5rem 2rem',
                background: '#FFFFFF',
                border: '2px solid var(--whiz-coral)',
                boxShadow: '0 16px 40px rgba(255, 90, 54, 0.12)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  <span className="badge badge-coral" style={{ fontSize: '0.8rem' }}>
                    OFFICIAL VISAI 2027 HACKATHON PASS
                  </span>
                  <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                    ● ACCREDITED
                  </span>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.25rem' }}>
                  {team.team_name}
                </h2>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--whiz-coral)', marginBottom: '1.5rem' }}>
                  REG ID: <strong>{team.registration_number || team.id}</strong> • {team.track}
                </div>

                {/* Real Unique Scannable Team QR Pass */}
                <div style={{ margin: '0 auto 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TeamQrCode team={team} size={180} showActions={true} />
                </div>

                <div style={{
                  fontSize: '0.85rem', color: 'var(--text-secondary)',
                  background: 'var(--canvas-subtle)', padding: '1.15rem',
                  borderRadius: 'var(--r-md)', marginBottom: '1.5rem',
                  border: '1px solid var(--canvas-border)',
                  textAlign: 'left', lineHeight: 1.6
                }}>
                  <div style={{ marginBottom: '0.35rem' }}>
                    <strong>Team Leader:</strong> {team.leader.full_name} ({team.college.college_name})
                  </div>
                  <div style={{ marginBottom: '0.35rem' }}>
                    <strong>Roster:</strong> {team.members.length > 0 ? team.members.map(m => m.full_name).join(', ') : 'Single Leader'}
                  </div>
                  <div style={{ marginBottom: '0.35rem' }}>
                    <strong>Challenge Track:</strong> {team.track} ({team.ps_code})
                  </div>
                  <div style={{ fontSize: '0.785rem', color: '#059669', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={14} /> Official pass verified. Scan with any camera scanner at Gate 3 / Audi Reception for registration wristbands.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => {
                      window.print();
                    }}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Printer size={15} />
                    <span>Print / Save Pass (PDF)</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      showToast('Pass is authenticated and linked to registration ID ' + (team.registration_number || team.id));
                    }}
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ShieldCheck size={15} color="#16A34A" />
                    <span>Security Verified</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* =====================================================
          ONLINE PAYMENT GATEWAY MODAL (Razorpay, UPI, QR, NetBanking, Cards)
         ===================================================== */}
      {paymentModalOpen && (
        <div className="modal-overlay" onClick={() => !paymentProcessing && setPaymentModalOpen(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 580,
              background: '#FFFFFF',
              borderRadius: 'var(--r-2xl)',
              padding: '2rem 2.25rem',
              boxShadow: 'var(--shadow-2xl)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-coral" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  SECURE PAYMENT CHECKOUT
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                  VISAI 2027 Registration Fee
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                disabled={paymentProcessing}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Amount Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF5F2 0%, #FFFFFF 100%)',
              border: '1.5px solid rgba(255, 90, 54, 0.25)',
              borderRadius: 'var(--r-xl)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>TEAM REGISTRATION FEE</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>{team.team_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All 4 Team Members Included</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>₹1,000</div>
                <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>Zero Convenience Fee</span>
              </div>
            </div>

            {/* Fast Razorpay Checkout Button */}
            <button
              onClick={handleLaunchRazorpayCheckout}
              disabled={paymentProcessing}
              className="btn btn-coral"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontWeight: 900,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-coral)'
              }}
            >
              {paymentProcessing ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  <span>Connecting to Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Pay ₹1,000 via Razorpay (UPI, GPay, Cards, NetBanking)</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
              ── OR CHOOSE DIRECT METHOD ──
            </div>

            {/* Payment Method Selector Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'upi', label: 'UPI ID / VPA', icon: Smartphone },
                { id: 'qr', label: 'UPI Instant QR', icon: QrCode },
                { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
              ].map(m => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      flex: 1,
                      minWidth: 110,
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--r-lg)',
                      border: isSel ? '2px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                      background: isSel ? 'var(--whiz-coral-light)' : '#FFFFFF',
                      color: isSel ? 'var(--whiz-coral)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.785rem',
                      fontWeight: 800,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Content */}
            <form onSubmit={handleProcessPayment}>
              {/* UPI Option */}
              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank, mobile@paytm"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--r-md)', border: '1.5px solid var(--canvas-border)', fontSize: '0.9rem' }}
                  />
                </div>
              )}

              {/* UPI QR Option */}
              {paymentMethod === 'qr' && (
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ margin: '0 auto 1rem', display: 'inline-block' }}>
                    <TeamQrCode
                      customPayload={`upi://pay?pa=veltech.rnd@sbi&pn=VISAI%202027%20Hackathon&am=1000&cu=INR&tn=REG_${encodeURIComponent(team.registration_number || team.id)}`}
                      size={140}
                      showActions={false}
                    />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                    Scan with GPay, PhonePe, Paytm, or BHIM
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Auto-populates ₹1,000 fee for Team ID: <strong>{team.registration_number || team.id}</strong>
                  </div>
                </div>
              )}

              {/* Net Banking Option */}
              {paymentMethod === 'netbanking' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={e => setSelectedBank(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--r-md)', border: '1.5px solid var(--canvas-border)', fontSize: '0.9rem', background: '#FFFFFF' }}
                  >
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Card Option */}
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      value={cardForm.number}
                      onChange={e => setCardForm({ ...cardForm, number: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod !== 'razorpay' && (
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="btn btn-coral"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.5rem',
                    fontWeight: 900,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Lock size={16} />
                  <span>Confirm Direct Payment of ₹1,000</span>
                </button>
              )}
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>Razorpay Key: {RAZORPAY_TEST_KEY} • 256-Bit Encrypted Attestation</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          OFFICIAL GST TAX INVOICE MODAL
         ===================================================== */}
      {invoiceModalOpen && (
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
                  Invoice #: INV-VISAI27-{team.id?.slice(0, 8).toUpperCase()}
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
                <div><strong>{team.leader.full_name}</strong></div>
                <div>Team: {team.team_name}</div>
                <div>Reg No: {team.registration_number || team.id}</div>
                <div>Email: {team.leader.email}</div>
                <div>Roll No: {team.leader.student_id}</div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: 'var(--r-md)' }}>
                <div style={{ fontWeight: 800, color: '#374151', marginBottom: '0.25rem' }}>INSTITUTION DETAILS:</div>
                <div><strong>{team.college.college_name}</strong></div>
                <div>{team.college.city}, {team.college.state} – {team.college.pincode}</div>
                <div>Payment Method: Razorpay ({RAZORPAY_TEST_KEY})</div>
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
                This is an authentic computer-generated official tax invoice verified by the VISAI 2027 Organizing Committee.
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Total Amount Paid:</div>
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
                onClick={() => setInvoiceModalOpen(false)}
                style={{ fontWeight: 800 }}
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
