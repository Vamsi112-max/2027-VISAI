import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import InlineEditBox from '../admin/InlineEditBox';

export default function CustomDynamicPage({ page, onNavigateHome }) {
  const { isVisualEditMode } = useSiteContent();

  if (!page) return null;

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', minHeight: '85vh', paddingBottom: '5rem' }}>
      <div className="container">
        
        {/* Header Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 3.5rem' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <span
              className={`badge badge-${page.theme || 'lavender'}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1.1rem' }}
            >
              <InlineEditBox fieldPath={`customPages.${page.id}.badge`} fieldLabel="Page Badge" value={page.badge || 'Official VISAI Page'} />
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.85rem' }}>
            <InlineEditBox fieldPath={`customPages.${page.id}.title`} fieldLabel="Page Main Title" value={page.title} />
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 720, margin: '0 auto' }}>
            <InlineEditBox fieldPath={`customPages.${page.id}.subtitle`} fieldLabel="Page Subtitle" value={page.subtitle} />
          </p>
        </div>

        {/* Main Content Box */}
        <div
          className={`bento-card card-pastel-${page.theme || 'lavender'}`}
          style={{
            maxWidth: 960,
            margin: '0 auto 3rem',
            padding: '2.5rem',
            background: '#FFFFFF',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            <InlineEditBox
              fieldPath={`customPages.${page.id}.content`}
              fieldLabel="Page Main Content"
              value={page.content}
              type="textarea"
            />
          </div>
        </div>

        {/* Feature Highlights Grid */}
        {page.cards && page.cards.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              maxWidth: 960,
              margin: '0 auto',
            }}
          >
            {page.cards.map((card, idx) => (
              <div
                key={idx}
                className="bento-card"
                style={{
                  padding: '1.75rem',
                  background: '#FFFFFF',
                  border: '1px solid var(--canvas-border)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'var(--pastel-peach-bg)',
                    color: 'var(--whiz-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                  {card.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
