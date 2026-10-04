import React, { useState } from 'react';
import { Trophy, Award, Gift, Sparkles, Flame, ShieldCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { SDG_8_THEMES } from '../../data/visaiData';
import { useSiteContent } from '../../context/SiteContentContext';
import InlineEditBox from '../admin/InlineEditBox';

export default function PrizePoolSection({ onOpenRegister }) {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const { content } = useSiteContent();
  const prizeData = content?.prizePool || {};

  return (
    <section className="section" style={{ background: 'var(--canvas-bg)', position: 'relative' }}>
      <div className="container-wide">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--r-full)',
            background: 'var(--pastel-peach-bg)',
            border: '1px solid rgba(255, 90, 54, 0.25)',
            marginBottom: '1rem'
          }}>
            <Trophy size={16} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 900, color: 'var(--pastel-peach-text)' }}>
              <InlineEditBox fieldPath="prizePool.badge" fieldLabel="Prize Badge" value={prizeData.badge || '₹5,00,000+ TOTAL REWARDS & INCUBATION POOL'} />
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--whiz-dark)', lineHeight: 1.15, marginBottom: '1rem' }}>
            <InlineEditBox fieldPath="prizePool.title" fieldLabel="Prize Title" value={prizeData.title || 'Champion Rewards & Innovation Grants'} />
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <InlineEditBox fieldPath="prizePool.subtitle" fieldLabel="Prize Subtitle" value={prizeData.subtitle || 'Celebrate your breakthrough prototypes with direct cash awards, Vel Tech TBI pre-incubation grants, IEEE technical badges, and direct angel mentorship.'} />
          </p>
        </div>

        {/* Grand Championship Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Grand Champion Card (Top Banner) */}
          <div className="bento-card" style={{
            gridColumn: '1 / -1',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, #FFF8F5 0%, #FFFFFF 50%, #FFF1EC 100%)',
            border: '2px solid rgba(255, 90, 54, 0.3)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: 160,
              height: 160,
              background: 'radial-gradient(circle, rgba(255, 90, 54, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <span className="badge badge-coral" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', marginBottom: '0.75rem', display: 'inline-flex' }}>
                  👑 VISAI 2027 OVERALL GRAND CHAMPIONS
                </span>
                <h3 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.5rem' }}>
                  ₹1,00,000 Cash Prize + ₹5,00,000 TBI Grant Support
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 640, marginBottom: 0 }}>
                  Awarded to the most impactful, high-feasibility technological breakthrough across all 8 UN SDG tracks, along with guaranteed incubation at Vel Tech TBI.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  padding: '1.25rem 1.75rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--canvas-border)',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--whiz-coral)' }}>₹1,00,000</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Direct Cash Award</div>
                </div>

                <div style={{
                  padding: '1.25rem 1.75rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--canvas-border)',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16A34A' }}>$10,000</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Vel Tech TBI Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* 8 Track Winner Bento Cards */}
          <div className="bento-card card-pastel-peach" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="badge badge-peach">8 SDG Track Winners</span>
              <Trophy size={24} color="var(--pastel-peach-text)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--pastel-peach-text)', marginBottom: '0.5rem' }}>
              ₹30,000 <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>/ Track Winner</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--pastel-peach-text)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              1st place in each of the 8 UN Sustainable Development Goal challenge streams + Nicola Foundation Certificate of Excellence.
            </p>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-peach-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} /> Total 8 Track Awards: ₹2,40,000
            </div>
          </div>

          {/* Track Runners Up */}
          <div className="bento-card card-pastel-lavender" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="badge badge-lavender">8 SDG Track Runners-Up</span>
              <Award size={24} color="var(--pastel-lavender-text)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--pastel-lavender-text)', marginBottom: '0.5rem' }}>
              ₹15,000 <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>/ Runner Up</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--pastel-lavender-text)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              2nd place in each SDG track recognizing outstanding engineering implementation, live demo, and industrial viability.
            </p>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-lavender-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} /> Total 8 Runner Awards: ₹1,20,000
            </div>
          </div>

          {/* Industry Partner Special Awards */}
          <div className="bento-card card-pastel-sky" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="badge badge-sky">Industry Partner Special Honors</span>
              <Gift size={24} color="var(--pastel-sky-text)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--pastel-sky-text)', marginBottom: '0.5rem' }}>
              ₹75,000 <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>in Special Grants</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--pastel-sky-text)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Special recognition sponsored by Nicola Foundation, CREDAI Chennai, IEEE EPS, and TEL for best hardware and sustainability models.
            </p>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-sky-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} /> 3 Partner Excellence Citations: ₹25,000 Each
            </div>
          </div>
        </div>

        {/* Benefits for Every Participant */}
        <div className="bento-card" style={{
          padding: '2rem 2.5rem',
          background: '#FFFFFF',
          border: '1px solid var(--canvas-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { title: 'IEEE Digital Badges', desc: 'Official co-branded digital verification for resumes & LinkedIn' },
            { title: 'Free On-Campus Stay', desc: 'Complimentary food & hostel stay for 36-hr grand on-site finalists' },
            { title: 'Industry Mentorship', desc: 'Direct feedback from Microsoft, Bosch, TEL, and Nicola Foundation leads' },
            { title: 'TBI Seed Grant Access', desc: 'Fast-track screening for government seed fund incubation support' },
          ].map((b, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--r-md)',
                background: 'var(--pastel-lime-bg)',
                color: 'var(--pastel-lime-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 900
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: 2 }}>{b.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
