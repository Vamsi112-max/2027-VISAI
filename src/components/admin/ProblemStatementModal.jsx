import React from 'react';
import { X, BookOpen, Building, Users, Award, CheckCircle, Trash2, Edit3, ExternalLink } from 'lucide-react';

export default function ProblemStatementModal({ ps, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !ps) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 11000,
        backgroundColor: 'rgba(24, 26, 32, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1.5px solid var(--canvas-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-coral" style={{ fontSize: '0.75rem' }}>
                {ps.ps_code}
              </span>
              <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
                {ps.track}
              </span>
              {ps.category && (
                <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                  {ps.category}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
              {ps.title}
            </h3>
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

        {/* Modal Content */}
        <div style={{ padding: '1.75rem 2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Summary */}
          <div className="bento-card" style={{ padding: '1.25rem', background: '#FAFAFA' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
              Overview & Executive Summary
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {ps.short_description || 'Industrial engineering challenge statement aligned with UN SDG goals.'}
            </p>
          </div>

          {/* Full Description */}
          {ps.full_description && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                Detailed Problem Scope & Architecture Expectations
              </h4>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {ps.full_description}
              </div>
            </div>
          )}

          {/* Capacity and Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--pastel-lime-bg)', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pastel-lime-text)' }}>REGISTERED TEAMS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                {ps.registered_count || 0} Teams
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--pastel-peach-bg)', border: '1px solid rgba(255, 90, 54, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>MAX CAPACITY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                {ps.max_capacity || 60} Slots
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--pastel-lavender-bg)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pastel-lavender-text)' }}>STATUS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', textTransform: 'capitalize' }}>
                {ps.status || 'Published'}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1.5px solid var(--canvas-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {onDelete && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onDelete(ps.id)}
              style={{ color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Trash2 size={15} />
              <span>Delete Problem Statement</span>
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              style={{ fontWeight: 800 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
