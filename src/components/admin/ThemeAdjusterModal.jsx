import React from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { X, Sliders, Check, Sparkles, Box, Maximize2 } from 'lucide-react';

export default function ThemeAdjusterModal() {
  const { isThemeModalOpen, setIsThemeModalOpen, draftContent, updateDraftField } = useSiteContent();

  if (!isThemeModalOpen) return null;

  const currentRadius = draftContent?.themeSettings?.borderRadius || '28px';
  const currentSpacing = draftContent?.themeSettings?.sectionSpacing || 'normal';

  const radiusOptions = [
    { value: '28px', label: 'WhizKid Bento Super Rounded (28px)', desc: 'Playful, modern, rounded bento box curves (Default)' },
    { value: '16px', label: 'Modern Rounded (16px)', desc: 'Clean, balanced sleek corners' },
    { value: '6px', label: 'Minimalist Sharp (6px)', desc: 'Technical, geometric, engineering look' },
    { value: '9999px', label: 'Capsule / Pill Curves', desc: 'Ultra rounded smooth capsule corners' },
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Compact Spacing', desc: 'Tighter sections, higher information density' },
    { value: 'normal', label: 'Balanced Spacing (Default)', desc: 'Standard breathing room and clean grid flow' },
    { value: 'spacious', label: 'Spacious & Airy', desc: 'Large vertical padding and luxurious margins' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 26, 32, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 580,
          width: '100%',
          padding: '2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'var(--pastel-peach-bg)',
                color: 'var(--whiz-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                Adjust Shapes, Curves & Spacing
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Global Site Design & Layout Controller
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.4rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Corner Radius Options */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            📐 Card & Bento Box Corner Curvature (Shape)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {radiusOptions.map((opt) => {
              const isSelected = currentRadius === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => updateDraftField('themeSettings.borderRadius', opt.value, 'Card Corner Curvature')}
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                    background: isSelected ? 'var(--pastel-peach-bg)' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {opt.desc}
                    </div>
                  </div>
                  {isSelected && <Check size={18} color="var(--whiz-coral)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Spacing Options */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            ↕️ Section Padding & Vertical Spacing
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {spacingOptions.map((opt) => {
              const isSelected = currentSpacing === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => updateDraftField('themeSettings.sectionSpacing', opt.value, 'Section Spacing')}
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                    background: isSelected ? 'var(--pastel-peach-bg)' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {opt.desc}
                    </div>
                  </div>
                  {isSelected && <Check size={18} color="var(--whiz-coral)" />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-coral btn-sm"
            onClick={() => setIsThemeModalOpen(false)}
            style={{ fontWeight: 800 }}
          >
            Done Adjusting Shapes
          </button>
        </div>
      </div>
    </div>
  );
}
