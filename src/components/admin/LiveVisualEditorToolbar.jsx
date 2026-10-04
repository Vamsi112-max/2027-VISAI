import React from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  Sparkles, Plus, FilePlus, Sliders, CheckCircle,
  X, RotateCcw, Eye, Save, Palette, Layers, Box
} from 'lucide-react';

export default function LiveVisualEditorToolbar() {
  const {
    isVisualEditMode,
    pendingChanges,
    exitVisualEdit,
    setIsReviewModalOpen,
    setIsAddBlockModalOpen,
    setIsAddPageModalOpen,
    setIsThemeModalOpen,
    draftContent,
  } = useSiteContent();

  if (!isVisualEditMode) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9990,
        background: 'rgba(24, 26, 32, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '2px solid var(--whiz-coral)',
        padding: '0.65rem 1.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        color: '#FFFFFF',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      {/* Left Title & Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>LIVE VISUAL SITE BUILDER</span>
            <span
              style={{
                fontSize: '0.65rem',
                background: 'var(--whiz-coral)',
                color: '#fff',
                padding: '2px 7px',
                borderRadius: '8px',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Wix-Style Mode
            </span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'rgba(255,255,255,0.7)' }}>
            Click any boxed section or text to edit • Drag, add pages or shapes live
          </div>
        </div>
      </div>

      {/* Center Tool Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Add Block */}
        <button
          className="btn btn-sm"
          onClick={() => setIsAddBlockModalOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--r-full)',
            padding: '0.45rem 0.95rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={15} color="var(--whiz-coral)" />
          <span>+ Add Block / Box</span>
        </button>

        {/* Add Page */}
        <button
          className="btn btn-sm"
          onClick={() => setIsAddPageModalOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--r-full)',
            padding: '0.45rem 0.95rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
          }}
        >
          <FilePlus size={15} color="#A78BFA" />
          <span>+ Add Page</span>
        </button>

        {/* Adjust Shapes & Curves */}
        <button
          className="btn btn-sm"
          onClick={() => setIsThemeModalOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--r-full)',
            padding: '0.45rem 0.95rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
          }}
        >
          <Sliders size={15} color="#FBBF24" />
          <span>Adjust Shapes & Curves</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Pending Changes Counter Badge */}
        {pendingChanges.length > 0 && (
          <span
            style={{
              background: 'rgba(255, 90, 54, 0.25)',
              border: '1px solid var(--whiz-coral)',
              color: '#FFA18C',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--r-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {pendingChanges.length} Change(s) Pending
          </span>
        )}

        {/* Done & Review Changes Button */}
        <button
          onClick={() => setIsReviewModalOpen(true)}
          style={{
            background: 'var(--whiz-coral)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--r-full)',
            padding: '0.5rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-coral)',
          }}
        >
          <CheckCircle size={16} />
          <span>Done & Review Changes</span>
        </button>

        {/* Exit Button */}
        <button
          onClick={exitVisualEdit}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.8)',
            borderRadius: 'var(--r-full)',
            padding: '0.5rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
}
