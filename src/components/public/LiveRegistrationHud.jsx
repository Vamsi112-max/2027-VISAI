import React, { useState, useEffect } from 'react';
import { Sparkles, Users, X, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

const LIVE_EVENTS = [
  { team: 'VISAI 2027 Portal Live', college: 'Vel Tech R&D Institute, Chennai', track: '8 SDG Tracks', desc: 'Registrations officially open for all student engineers', color: '#FD6925' },
  { team: '₹5,00,000+ Prize & Grant Pool', college: 'Nicola Foundation & CREDAI', track: 'TBI Incubation', desc: '₹1,00,000 Grand Prize + $10,000 TBI Incubation Support', color: '#FCC30B' },
  { team: 'Round 1 Abstract Submission', college: 'Important Milestone', track: 'Deadline: Feb 15', desc: 'Submit max 10-slide problem alignment pitch deck', color: '#26BDE2' },
  { team: 'Double-Blind Jury Panel', college: 'Industry & Academic Specialists', track: '100 Pts Rubric', desc: 'Standardized evaluation across 5 innovation criteria', color: '#3F7E44' },
  { team: '36-Hour Grand Finale', college: 'Vel Tech Campus, Chennai', track: 'March 12–14', desc: 'Complimentary food & hostel stay for finalist teams', color: '#0A97D9' },
];

export default function LiveRegistrationHud({ onOpenRegister }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isDismissed || isPaused) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
        setVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [isDismissed, isPaused]);

  if (isDismissed) return null;

  const current = LIVE_EVENTS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        left: '1.75rem',
        zIndex: 9990,
        maxWidth: 360,
        width: 'calc(100vw - 3.5rem)',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--r-xl)',
        padding: '1rem 1.25rem',
        border: '1.5px solid rgba(255, 90, 54, 0.25)',
        boxShadow: '0 16px 36px -8px rgba(30, 41, 59, 0.16), 0 0 0 1px rgba(255, 90, 54, 0.1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}
    >
      {/* Pulse Beacon */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'var(--pastel-peach-bg)',
          color: 'var(--whiz-coral)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900
        }}>
          <Zap size={20} />
        </div>
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#22C55E',
          border: '2px solid #FFFFFF',
          animation: 'pulse 2s infinite'
        }} />
      </div>

      {/* Event Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="badge" style={{
            background: current.color + '22',
            color: '#1E293B',
            border: `1px solid ${current.color}66`,
            fontSize: '0.68rem',
            padding: '0.15rem 0.45rem',
            fontWeight: 800
          }}>
            {current.track}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
            ● LIVE ACTIVITY
          </span>
        </div>

        <div style={{
          fontSize: '0.875rem',
          fontWeight: 900,
          color: 'var(--whiz-dark)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {current.team}
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {current.college} • {current.desc}
        </div>
      </div>

      {/* Action / Dismiss */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
        <button
          onClick={() => setIsDismissed(true)}
          title="Dismiss HUD"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <X size={15} />
        </button>

        {onOpenRegister && (
          <button
            onClick={onOpenRegister}
            title="Register Team"
            style={{
              background: 'var(--whiz-coral)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
