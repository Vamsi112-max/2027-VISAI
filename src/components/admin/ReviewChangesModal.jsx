import React, { useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { X, CheckCircle, Save, ArrowRight, RotateCcw, AlertCircle, Sparkles, Layers, Sliders } from 'lucide-react';

export default function ReviewChangesModal() {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    pendingChanges,
    publishAllChanges,
    saveStatus,
    resetToDefaults,
    draftContent,
  } = useSiteContent();

  const [confirmPublish, setConfirmPublish] = useState(false);

  if (!isReviewModalOpen) return null;

  const handlePublish = async () => {
    await publishAllChanges();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 26, 32, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsReviewModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 780,
          width: '100%',
          padding: '2.25rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                background: 'var(--pastel-peach-bg)',
                color: 'var(--whiz-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                Review & Publish Live Changes
              </h2>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {pendingChanges.length} pending change(s) ready to sync to TiDB Cloud & SQLite
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.5rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Changes Table / List */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
          {pendingChanges.length === 0 ? (
            <div className="bento-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#FAFAFA' }}>
              <Sparkles size={36} color="var(--whiz-coral)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                No Modifications in Current Session
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 450, margin: '0 auto' }}>
                Click on any text, photo, shape or use "Add Block" / "Add Page" on the website to customize content, then review your changes here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr',
                  padding: '0.6rem 1rem',
                  fontSize: '0.785rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                  borderBottom: '1.5px solid var(--canvas-border)',
                }}
              >
                <span>Element / Field</span>
                <span>Original Value</span>
                <span>Updated Live Value</span>
              </div>

              {pendingChanges.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr',
                    gap: '1rem',
                    padding: '0.9rem 1rem',
                    borderRadius: '12px',
                    background: '#FAFAFA',
                    border: '1px solid var(--canvas-border)',
                    fontSize: '0.85rem',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--whiz-dark)' }}>{ch.fieldLabel}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ch.timestamp}</div>
                  </div>

                  <div
                    style={{
                      color: '#EF4444',
                      background: '#FEE2E2',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.785rem',
                      wordBreak: 'break-word',
                      maxHeight: '60px',
                      overflowY: 'auto',
                    }}
                  >
                    {ch.oldValue || '— (Empty)'}
                  </div>

                  <div
                    style={{
                      color: '#059669',
                      background: '#D1FAE5',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.785rem',
                      fontWeight: 700,
                      wordBreak: 'break-word',
                      maxHeight: '60px',
                      overflowY: 'auto',
                    }}
                  >
                    {ch.newValue}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Custom Sections & Pages count summary */}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>
              📦 Custom Content Blocks: {(draftContent?.customBlocks || []).length}
            </span>
            <span className="badge badge-lime" style={{ fontSize: '0.75rem' }}>
              📑 Custom Dynamic Pages: {(draftContent?.customPages || []).length}
            </span>
            <span className="badge badge-peach" style={{ fontSize: '0.75rem' }}>
              📐 Corner Curvature: {draftContent?.themeSettings?.borderRadius || '28px'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid var(--canvas-border)',
            paddingTop: '1.25rem',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (window.confirm('Reset all site customizations back to official default template?')) {
                resetToDefaults();
              }
            }}
            style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 700 }}
          >
            <RotateCcw size={14} />
            <span>Reset to Default Template</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Continue Editing
            </button>

            <button
              type="button"
              className="btn btn-coral"
              disabled={saveStatus.saving}
              onClick={handlePublish}
              style={{ padding: '0.75rem 1.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={17} />
              <span>{saveStatus.saving ? 'Publishing Live...' : 'Publish Live to Website'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
