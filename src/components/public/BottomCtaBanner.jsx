import React from 'react';
import { ArrowRight, Sparkles, Rocket, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import InlineEditBox from '../admin/InlineEditBox';
import { VISAI_CONFIG } from '../../data/visaiData';

export default function BottomCtaBanner({ onRegister }) {
  const { user } = useAuth();
  const { content } = useSiteContent();
  const ctaData = content?.bottomCta || {};

  return (
    <section className="section-sm" style={{ background: 'var(--canvas-bg)' }}>
      <div className="container">
        <div
          className="bento-card card-pastel-lime"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--r-3xl)',
            border: '2px solid var(--pastel-lime-border)'
          }}
        >
          {/* Subtle playful background circles */}
          <div style={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--r-full)',
              background: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '1.25rem'
            }}>
              <Rocket size={14} color="var(--whiz-coral)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                <InlineEditBox
                  fieldPath="bottomCta.badge"
                  fieldLabel="Bottom CTA Badge"
                  value={ctaData.badge || '₹5,00,000+ Prize Pool • National Recognition'}
                />
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              color: 'var(--pastel-lime-text)',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}>
              <InlineEditBox
                fieldPath="bottomCta.title"
                fieldLabel="Bottom CTA Title"
                value={ctaData.title || 'Ready To Transform Your Ideas Into Real-World Impact?'}
              />
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--pastel-lime-text)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              opacity: 0.95,
              fontWeight: 600
            }}>
              <InlineEditBox
                fieldPath="bottomCta.subtitle"
                fieldLabel="Bottom CTA Subtitle"
                value={ctaData.subtitle || 'Join 5,000+ young innovators at VISAI 2027. Form your squad of 1 to 4 members and submit your abstract today.'}
                type="textarea"
              />
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {!user ? (
                <button
                  className="btn btn-coral btn-xl"
                  onClick={onRegister}
                  style={{ fontWeight: 800, padding: '1rem 2.4rem' }}
                >
                  <Users size={18} />
                  <span>Register Your Team Now</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="btn btn-dark btn-xl"
                  onClick={() => window.dispatchEvent(new CustomEvent('visai:goto-dashboard'))}
                  style={{ fontWeight: 800, padding: '1rem 2.4rem' }}
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.825rem', fontWeight: 700, color: 'var(--pastel-lime-text)' }}>
              <span>✓ Instant Registration</span>
              <span>✓ ₹1,000 per Team</span>
              <span>✓ Hybrid Evaluation</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
