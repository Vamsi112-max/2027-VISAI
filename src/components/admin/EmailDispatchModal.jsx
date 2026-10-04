import React, { useState, useEffect } from 'react';
import {
  Mail, Send, Users, Shield, UserCheck, X, Check,
  Sparkles, FileText, Clock, AlertCircle, RefreshCw,
  Eye, CheckCircle2, Copy, Layers, ExternalLink
} from 'lucide-react';
import { adminAPI } from '../../hooks/api';
import { fireConfetti } from '../../utils/confetti';

const PRESET_TEMPLATES = [
  {
    id: 'abstract_reminder',
    name: '⏰ Round 1 Abstract Submission Deadline Reminder',
    subject: 'Action Required: VISAI 2027 Round 1 Abstract Submission Deadline Approaching',
    target: 'all_leaders',
    body: `Dear {{name}} (Team: {{team_name}}),

This is an official reminder from the VISAI 2027 Organizing Committee regarding your Round 1 Abstract & Problem Alignment PPT submission for track "{{track}}".

Key Submission Guidelines:
• Ensure your 5-slide pitch deck adheres to the official PPT rubric format.
• Upload your abstract summary and GitHub architecture link before the portal closing deadline.
• Double-check your team member credentials in the participant portal.

Access your team dashboard here: {{portal_url}}

If you have any questions, feel free to reply directly to this email at {{admin_email}}.

Best regards,
Prof. Dr. P. Chandrakumar & VISAI Organizing Committee
Vel Tech R&D Institute of Science and Technology, Chennai`,
  },
  {
    id: 'payment_verified',
    name: '💳 Registration Payment Verified & Invoice Available',
    subject: 'Payment Confirmed: VISAI 2027 Registration & Official GST Invoice',
    target: 'all_leaders',
    body: `Dear {{name}},

We are pleased to confirm that your team "{{team_name}}" registration fee payment for VISAI 2027 has been successfully verified and approved by the finance committee!

Your official GST Tax Receipt and Admission Pass are now unlocked for download in your dashboard:
{{portal_url}}

Next Steps:
1. Complete your problem statement selection if not already finalized.
2. Download the official VISAI 2027 slide deck starter kit.
3. Prepare your prototype architecture diagram.

Host College: {{college}}

Warm regards,
VISAI 2027 Finance & Registration Secretariat
Vel Tech R&D Institute`,
  },
  {
    id: 'jury_credentials',
    name: '⚖️ Jury Evaluator Welcome & Login Credentials',
    subject: 'Official Invitation: VISAI 2027 Jury Panel & Evaluation Portal Credentials',
    target: 'all_jury',
    body: `Dear {{name}},

On behalf of Vel Tech R&D Institute and our knowledge partners (Nicola Foundation, IEEE, CREDAI & Microsoft), we are honored to invite you as an Official Jury Evaluator for VISAI 2027.

Assigned Evaluation Track: {{track}}

Your Secure Evaluator Login Credentials:
• Portal URL: {{portal_url}}
• Login Email: {{name}} / Registered Email
• {{credentials}}

Evaluation Guidelines:
• Please log in to review assigned team abstract pitch decks and prototype repositories.
• The double-blind scoring rubric (Innovation, Feasibility, SDG Impact, Prototype Execution) is accessible directly on your jury dashboard.

Thank you for mentoring and evaluating India's brightest student innovators.

Sincerely,
VISAI 2027 Jury Directorate
Email: {{admin_email}}`,
  },
  {
    id: 'hardware_logistics',
    name: '🤖 Hardware Lab, MakerSpace & Wi-Fi Logistics',
    subject: 'Logistics Guide: 36-Hour Prototype Sprint & Lab Facilities at Vel Tech',
    target: 'all_leaders',
    body: `Hello {{name}} and Team {{team_name}},

As we gear up for the grand 36-hour physical prototype sprint at Vel Tech R&D Institute, here is essential logistical information for your on-campus participation:

1. Hardware & MakerSpace Facilities:
• 24/7 access to Vel Tech MakerSpace Lab 4 with 3D printers, digital oscilloscopes, SMD rework stations, and sensor test benches.
• High-speed 1Gbps dedicated campus Wi-Fi network.
• Continuous power backup benches with international power strips.

2. On-Campus Accommodation & Meals:
• Air-conditioned dormitory suites and food court coupon passes provided.
• Free campus shuttle buses running from Chennai Central Railway Station & Airport.

View full guidelines and schedule: {{portal_url}}

Best of luck with your prototype build!

VISAI 2027 Operations Team
Vel Tech R&D Institute, Chennai`,
  },
  {
    id: 'custom_announcement',
    name: '📢 Custom Executive Announcement',
    subject: 'VISAI 2027: Important Update from Organizing Committee',
    target: 'everyone',
    body: `Dear {{name}},

We hope your hackathon preparations are progressing with great momentum.

[Write your custom announcement, schedule updates, or guidelines here...]

To access your personalized dashboard and live schedule, visit:
{{portal_url}}

For urgent assistance, reach out to us at {{admin_email}}.

Warm regards,
Executive Organizing Committee
VISAI 2027 • Vel Tech R&D Institute`,
  },
];

export default function EmailDispatchModal({ isOpen, onClose, defaultTarget = 'all_leaders', defaultEmail = '' }) {
  const [targetGroup, setTargetGroup] = useState(defaultTarget);
  const [customEmail, setCustomEmail] = useState(defaultEmail);
  const [customName, setCustomName] = useState('');
  const [subject, setSubject] = useState(PRESET_TEMPLATES[0].subject);
  const [bodyText, setBodyText] = useState(PRESET_TEMPLATES[0].body);
  const [senderEmail, setSenderEmail] = useState('vamsiinampudi01@gmail.com');
  const [selectedTemplate, setSelectedTemplate] = useState('abstract_reminder');
  
  const [sending, setSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState(null);
  const [recipientPreview, setRecipientPreview] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Update preview recipient count
  useEffect(() => {
    if (!isOpen) return;
    adminAPI.emailRecipientsPreview({ target_group: targetGroup, custom_email: customEmail, custom_name: customName })
      .then(res => {
        setRecipientCount(res.data?.count || 0);
        setRecipientPreview(res.data?.recipients || []);
      })
      .catch(() => {
        setRecipientCount(1);
      });
  }, [targetGroup, customEmail, customName, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmplId) => {
    const tmpl = PRESET_TEMPLATES.find(t => t.id === tmplId);
    if (!tmpl) return;
    setSelectedTemplate(tmplId);
    setSubject(tmpl.subject);
    setBodyText(tmpl.body);
    setTargetGroup(tmpl.target);
  };

  const handleInsertTag = (tag) => {
    setBodyText(prev => prev + ` {{${tag}}}`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !bodyText) {
      setErrorMsg('Please enter both email subject and message content.');
      return;
    }

    if (targetGroup === 'custom' && !customEmail) {
      setErrorMsg('Please enter the recipient email address.');
      return;
    }

    setSending(true);
    setErrorMsg('');

    try {
      const res = await adminAPI.sendEmail({
        target_group: targetGroup,
        custom_email: customEmail,
        custom_name: customName,
        subject,
        body_text: bodyText,
        body_html: bodyText.replace(/\n/g, '<br/>'),
        sender_email: senderEmail,
      });

      setDispatchResult(res.data);
      setSending(false);
      fireConfetti();
    } catch (err) {
      setSending(false);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to dispatch email');
    }
  };

  const targetLabels = {
    all_leaders: '👥 All Student Team Leaders',
    all_jury: '⚖️ All Jury Evaluators',
    all_members: '🎓 All Registered Team Members',
    all_coordinators: '🛡️ All Coordinators & Admins',
    everyone: '🌐 Everyone (All Users)',
    custom: '👤 Individual / Specific Email',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 11000,
        backgroundColor: 'rgba(24, 26, 32, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 860,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1.5px solid var(--canvas-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #FFF8F5 0%, #FFFFFF 100%)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: '12px',
                background: 'var(--pastel-peach-bg)', color: 'var(--whiz-coral)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                  Email Broadcast & Dispatch Center
                </h3>
                <span className="badge badge-coral" style={{ fontSize: '0.7rem' }}>
                  ADMIN DISPATCH
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official email channel: <strong>{senderEmail}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '0.4rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Success Result View */}
          {dispatchResult ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', animation: 'fadeIn 0.3s ease-out' }}>
              <div
                style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: 'var(--pastel-lime-bg)', color: 'var(--pastel-lime-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle2 size={38} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                Broadcast Successfully Dispatched!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                {dispatchResult.message}
              </p>

              <div
                style={{
                  background: '#FAFAFA',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  maxWidth: 620,
                  margin: '0 auto 2rem',
                  textAlign: 'left',
                  border: '1px solid var(--canvas-border)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                  Dispatch Summary:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><strong>Sender:</strong> {dispatchResult.sender}</div>
                  <div><strong>Audience:</strong> {targetLabels[dispatchResult.targetGroup] || dispatchResult.targetGroup}</div>
                  <div><strong>Total Delivered:</strong> {dispatchResult.totalDispatched} email(s)</div>
                  <div><strong>Status:</strong> ✓ Synced & Logged to DB</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDispatchResult(null)}
                  style={{ fontWeight: 800 }}
                >
                  Send Another Email
                </button>
                <button
                  className="btn btn-coral"
                  onClick={onClose}
                  style={{ fontWeight: 800 }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Error alert */}
              {errorMsg && (
                <div
                  style={{
                    padding: '0.85rem 1.25rem', borderRadius: '12px',
                    background: '#FEE2E2', color: '#B91C1C',
                    fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={17} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Sender & Target Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
                {/* Sender Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                    From (Admin Sender)
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    style={{ width: '100%', background: 'var(--canvas-subtle)', fontWeight: 700 }}
                  />
                </div>

                {/* Target Audience Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                    Send To (Target Audience) {recipientCount !== null && `(${recipientCount} recipients)`}
                  </label>
                  <select
                    className="form-input"
                    value={targetGroup}
                    onChange={e => setTargetGroup(e.target.value)}
                    style={{ width: '100%', fontWeight: 700, background: '#FFFFFF' }}
                  >
                    <option value="all_leaders">👥 All Student Team Leaders</option>
                    <option value="all_jury">⚖️ All Jury Evaluators</option>
                    <option value="all_members">🎓 All Registered Team Members</option>
                    <option value="all_coordinators">🛡️ All Coordinators</option>
                    <option value="everyone">🌐 Everyone (All Registered Users)</option>
                    <option value="custom">👤 Specific Individual Email</option>
                  </select>
                </div>
              </div>

              {/* Individual / Custom Email Input */}
              {targetGroup === 'custom' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', background: 'var(--pastel-peach-bg)', padding: '1rem', borderRadius: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                      Recipient Email Address *
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      required
                      placeholder="e.g. innovator@university.edu"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      style={{ width: '100%', background: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                      Recipient Full Name (Optional)
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      style={{ width: '100%', background: '#FFFFFF' }}
                    />
                  </div>
                </div>
              )}

              {/* Preset Template Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                    Choose Ready-Made Official Template:
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {PRESET_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleApplyTemplate(t.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--r-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: selectedTemplate === t.id ? '1.5px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                        background: selectedTemplate === t.id ? 'var(--pastel-peach-bg)' : '#FFFFFF',
                        color: selectedTemplate === t.id ? 'var(--whiz-coral)' : 'var(--text-primary)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {t.name.split(' ')[0]} {t.name.split(' ').slice(1, 4).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.35rem' }}>
                  Email Subject Line *
                </label>
                <input
                  className="form-input"
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{ width: '100%', fontWeight: 700 }}
                  placeholder="Subject..."
                />
              </div>

              {/* Personalization Variable Tags Bar */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="var(--whiz-coral)" />
                  <span>Click to insert dynamic personalization variables:</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['name', 'team_name', 'track', 'college', 'portal_url', 'credentials', 'admin_email'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      style={{
                        background: 'var(--canvas-subtle)',
                        border: '1px solid var(--canvas-border)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.725rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: 'var(--whiz-dark)',
                      }}
                    >
                      + {`{{${tag}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                    Email Message Content (Plain text or HTML) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 800, color: 'var(--whiz-coral)',
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                    }}
                  >
                    <Eye size={13} />
                    <span>{previewMode ? 'Hide Preview' : 'Show Live Preview'}</span>
                  </button>
                </div>

                {previewMode ? (
                  <div
                    style={{
                      background: '#FAFAFA',
                      border: '1.5px solid var(--whiz-coral)',
                      borderRadius: 'var(--r-lg)',
                      padding: '1.25rem',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      fontSize: '0.875rem',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--canvas-border)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      <strong>Preview for:</strong> {recipientPreview[0]?.name || 'Rahul Sharma'} ({recipientPreview[0]?.email || 'innovator@visai.in'})
                    </div>
                    {bodyText
                      .replace(/\{\{name\}\}/gi, recipientPreview[0]?.name || 'Rahul Sharma')
                      .replace(/\{\{team_name\}\}/gi, recipientPreview[0]?.team_name || 'Team CyberNovas')
                      .replace(/\{\{track\}\}/gi, recipientPreview[0]?.track || 'SDG 09: Industry & AI')
                      .replace(/\{\{portal_url\}\}/gi, 'http://localhost:5173')
                      .replace(/\{\{admin_email\}\}/gi, senderEmail)
                    }
                  </div>
                ) : (
                  <textarea
                    className="form-input"
                    rows={8}
                    required
                    value={bodyText}
                    onChange={e => setBodyText(e.target.value)}
                    style={{ width: '100%', resize: 'vertical', lineHeight: 1.6, fontSize: '0.875rem' }}
                    placeholder="Write your email announcement or instructions..."
                  />
                )}
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--canvas-border)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ready to send to <strong>{recipientCount || 1}</strong> recipient(s)
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-coral"
                    style={{
                      padding: '0.65rem 1.5rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: 'var(--shadow-coral)',
                    }}
                  >
                    <Send size={16} />
                    <span>{sending ? 'Dispatching Emails...' : `Send Email (${recipientCount || 1})`}</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
