import React from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { Sparkles, ArrowRight, Trash2, Edit3, ExternalLink } from 'lucide-react';
import InlineEditBox from '../admin/InlineEditBox';

export default function CustomBlocksRenderer({ position }) {
  const { content, isVisualEditMode, deleteCustomBlock } = useSiteContent();

  const blocks = (content?.customBlocks || []).filter(b => b.position === position);
  if (blocks.length === 0) return null;

  return (
    <div className="custom-blocks-container" style={{ margin: '2rem 0' }}>
      <div className="container">
        {blocks.map((block) => {
          const themeClass = `card-pastel-${block.theme || 'lime'}`;
          return (
            <div
              key={block.id}
              className={`bento-card ${themeClass}`}
              style={{
                padding: '2.5rem',
                marginBottom: '1.75rem',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                background: '#FFFFFF',
              }}
            >
              {/* Admin Delete Block Handle in Visual Edit Mode */}
              {isVisualEditMode && (
                <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '0.5rem', zIndex: 50 }}>
                  <button
                    onClick={() => deleteCustomBlock(block.id)}
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--r-full)',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    }}
                    title="Delete this custom box"
                  >
                    <Trash2 size={13} />
                    <span>Delete Box</span>
                  </button>
                </div>
              )}

              {/* Badge */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span className={`badge badge-${block.theme || 'lime'}`} style={{ fontSize: '0.8rem' }}>
                  <InlineEditBox
                    fieldPath={`customBlocks.${block.id}.badge`}
                    fieldLabel={`Block Badge (${block.title})`}
                    value={block.badge || '✨ Live Announcement'}
                  />
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.65rem' }}>
                <InlineEditBox
                  fieldPath={`customBlocks.${block.id}.title`}
                  fieldLabel={`Block Title (${block.title})`}
                  value={block.title}
                />
              </h3>

              {/* Subtitle */}
              {block.subtitle && (
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <InlineEditBox
                    fieldPath={`customBlocks.${block.id}.subtitle`}
                    fieldLabel={`Block Subtitle (${block.title})`}
                    value={block.subtitle}
                  />
                </div>
              )}

              {/* Main Content */}
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 840 }}>
                <InlineEditBox
                  fieldPath={`customBlocks.${block.id}.content`}
                  fieldLabel={`Block Content (${block.title})`}
                  value={block.content}
                  type="textarea"
                />
              </p>

              {/* Button / Action */}
              {block.buttonText && (
                <div>
                  <a
                    href={block.buttonUrl || '#'}
                    className="btn btn-coral btn-sm"
                    style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>{block.buttonText}</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
