import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Check, Copy, ExternalLink, QrCode as QrIcon } from 'lucide-react';

export default function TeamQrCode({ team, size = 180, showActions = false, customPayload = null }) {
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const teamId = team?.registration_number || team?.id || 'VISAI27-TM-DEFAULT';
  const teamName = team?.team_name || 'Innovation Team';
  const leaderName = team?.leader?.full_name || team?.leader_name || 'Team Leader';
  const collegeName = team?.college?.college_name || team?.college_name || 'Institution';
  const trackName = team?.track || 'SDG Innovation';

  // Structured verified pass string readable by any camera scanner or committee validator
  const defaultPayload = [
    `=== VISAI 2027 OFFICIAL ENTRY PASS ===`,
    `TEAM: ${teamName}`,
    `REG ID: ${teamId}`,
    `LEADER: ${leaderName}`,
    `COLLEGE: ${collegeName}`,
    `TRACK: ${trackName}`,
    `STATUS: ${team?.payment_status === 'paid' ? 'VERIFIED & PAID ✓' : 'REGISTRATION PENDING'}`,
    `VENUE: Vel Tech R&D Institute, Avadi, Chennai`,
    `PASS CODE: VT-HACK-${teamId.replace(/[^A-Z0-9]/gi, '')}`,
    `VERIFY: https://visai.veltech.edu.in/verify?team=${teamId}`
  ].join('\n');

  const payload = customPayload || defaultPayload;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(payload, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    })
      .then(url => {
        if (isMounted) {
          setQrUrl(url);
          setError(false);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [payload, size]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `VISAI2027_QR_${teamId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (error || !qrUrl) {
    return (
      <div style={{
        width: size, height: size,
        background: '#F8FAFC',
        borderRadius: '16px',
        border: '2px dashed var(--canvas-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '0.5rem', margin: '0 auto'
      }}>
        <QrIcon size={32} color="var(--whiz-coral)" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          Generating QR...
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        padding: '10px',
        background: '#FFFFFF',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        border: '1.5px solid var(--canvas-border-strong)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={qrUrl}
          alt={`Official QR Pass for ${teamName}`}
          style={{
            width: size,
            height: size,
            display: 'block',
            borderRadius: '10px'
          }}
        />
        {/* Subtle Brand Badge in Bottom Corner */}
        <div style={{
          position: 'absolute',
          bottom: 4,
          right: 8,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.6rem',
          fontWeight: 900,
          color: 'var(--whiz-coral)',
          letterSpacing: '0.04em',
          border: '1px solid #FFE0D6'
        }}>
          VISAI.27
        </div>
      </div>

      {showActions && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
          <button
            onClick={handleDownload}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.35rem 0.75rem' }}
            title="Download high-resolution QR PNG"
          >
            <Download size={13} /> Download QR (.png)
          </button>
          <button
            onClick={handleCopyPayload}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.35rem 0.75rem' }}
            title="Copy verification payload text"
          >
            {copied ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      )}
    </div>
  );
}
