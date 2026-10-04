import React from 'react';
import { Compass, Cpu, Trophy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import InlineEditBox from '../admin/InlineEditBox';

export default function ThreeStepsBento({ onRegister, onExploreProblems }) {
  const { content } = useSiteContent();
  const stepData = content?.threeSteps || {};

  const steps = [
    {
      step: '01',
      title: 'Discover & Form Team',
      desc: 'Browse 17 SDG Tracks, assemble your multidisciplinary squad of 1–4 innovators, and register your team.',
      theme: 'lime',
      cardClass: 'card-pastel-lime',
      badgeClass: 'badge-lime',
      photo: '/images/gallery/hero_hackathon.jpg',
      points: ['Explore 17 SDG Challenges', 'Register 1–4 Student Team', 'Download Slide Deck Format'],
      action: 'Browse Problems',
      actionHandler: onExploreProblems,
    },
    {
      step: '02',
      title: 'Build & Prototype',
      desc: 'Submit Round 1 Abstract, qualify for the 36-hour sprint, and build with 1-on-1 industry architect guidance.',
      theme: 'lavender',
      cardClass: 'card-pastel-lavender',
      badgeClass: 'badge-lavender',
      photo: '/images/gallery/robotics_demo.jpg',
      points: ['Round 1 Online PPT Review', 'Vel Tech MakerSpace Access', '24/7 Mentorship & WiFi'],
      action: 'View Schedule',
      actionHandler: onExploreProblems,
    },
    {
      step: '03',
      title: 'Pitch & Win Big',
      desc: 'Present your live prototype at the grand project expo, pitch to executive jury, and win from ₹5,00,000+ prize pool.',
      theme: 'peach',
      cardClass: 'card-pastel-peach',
      badgeClass: 'badge-peach',
      photo: '/images/gallery/grand_stage.jpg',
      points: ['Live Exhibition Booth Demo', 'National Jury Evaluation', 'Cash Prizes & Startup Incubation'],
      action: 'Register Today',
      actionHandler: onRegister,
    },
  ];

  return (
    <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--canvas-border)', borderBottom: '1px solid var(--canvas-border)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--whiz-coral)', letterSpacing: '0.04em' }}>
              <InlineEditBox fieldPath="threeSteps.badge" fieldLabel="Steps Badge" value={stepData.badge || 'How VISAI Works'} />
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            <InlineEditBox fieldPath="threeSteps.title" fieldLabel="Steps Title" value={stepData.title || 'Innovation In 3 Simple Steps!'} />
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            <InlineEditBox fieldPath="threeSteps.subtitle" fieldLabel="Steps Subtitle" value={stepData.subtitle || 'From online registration and problem selection to the grand 36-hour physical prototype sprint.'} />
          </p>
        </div>

        {/* 3 Step Bento Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.75rem'
        }} className="three-steps-grid">
          {steps.map((item) => (
            <div
              key={item.step}
              className={`bento-card ${item.cardClass}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem 1.75rem'
              }}
            >
              <div>
                {/* Header with Step Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className={`badge ${item.badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.9rem' }}>
                    Step {item.step}
                  </span>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#FFFFFF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {item.step}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.65rem', lineHeight: 1.25 }}>
                  {item.title}
                </h3>
                
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', opacity: 0.95 }}>
                  {item.desc}
                </p>

                {/* Photo Thumbnail in Card */}
                <div style={{
                  height: 150,
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  border: '2px solid #FFFFFF'
                }}>
                  <img
                    src={item.photo}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Checklist Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {item.points.map((pt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#FFFFFF', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <button
                onClick={item.actionHandler}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--r-full)',
                  background: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  color: 'var(--whiz-dark)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.action}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .three-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
