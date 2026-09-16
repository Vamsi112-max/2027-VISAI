import React, { useState } from 'react';
import { HACKATHON_ROUNDS } from '../data/visaiData';
import { 
  GitCommit, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Calendar, 
  Users, 
  FileText, 
  Trophy 
} from 'lucide-react';

export default function HackathonTimeline({ content }) {
  const [activeTab, setActiveTab] = useState('rounds'); // 'rounds' or 'lifecycle'

  const lifecycleSteps = [
    {
      step: '01',
      title: 'Open Registration & Screening',
      timeline: '30–45 Days Prior',
      desc: 'Registrations open via Unstop & portal. Teams access dummy/sample SDG challenges and submit an Initial Abstract or PPT explaining problem understanding, tech approach, and impact.',
      icon: Users
    },
    {
      step: '02',
      title: 'Shortlisting & Track Assignment',
      timeline: '20 Days Prior',
      desc: 'Rigorous peer screening separates accepted teams into 💻 Software Track or 🔧 Hardware Track to guarantee high competitive standards.',
      icon: CheckCircle2
    },
    {
      step: '03',
      title: 'Dual Release Strategy',
      timeline: '7-10 Days Prior & On-Spot',
      desc: 'Hardware problem statements released 7–10 days early for component sourcing. Software problem statements released strictly on-spot at the hackathon venue.',
      icon: Clock
    },
    {
      step: '04',
      title: '36 / 48-Hour Main Hackathon',
      timeline: 'Event Weekend',
      desc: 'Non-stop hacking with four structured evaluation milestones (Validation, Tech Review, MVP Prototype, Grand Jury Finale). Food, rest areas, and tech support provided 24/7.',
      icon: Trophy
    },
    {
      step: '05',
      title: 'Final Abstract & Souvenir Publication',
      timeline: 'Finale & Post-Event',
      desc: 'Selected projects submit structured final abstracts that are compiled automatically into the official VISAI 2027 Innovation Book, connecting finalists to patents and incubation.',
      icon: FileText
    }
  ];

  return (
    <section id="timeline" className="section">
      <div className="container">
        
        <div className="section-header">
          <div className="badge-tag">
            <Calendar size={14} />
            <span>End-to-End Innovation Process</span>
          </div>
          <h2 className="section-title">
            {content?.title || "The Hackathon Model"}
          </h2>
          <p className="section-subtitle">
            {content?.description || "Moving beyond conventional science exhibitions to a time-pressured, industry-mentored, multi-stage innovation lifecycle."}
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`btn ${activeTab === 'rounds' ? 'btn-primary' : 'btn-secondary'}`}
          >
            4 Internal Evaluation Rounds
          </button>
          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`btn ${activeTab === 'lifecycle' ? 'btn-primary' : 'btn-secondary'}`}
          >
            5-Stage Complete Lifecycle
          </button>
        </div>

        {/* 4 INTERNAL EVALUATION ROUNDS VIEW */}
        {activeTab === 'rounds' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {HACKATHON_ROUNDS.map((round, idx) => (
              <div
                key={round.round}
                className="glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: idx === 3 ? '4px solid #7c3aed' : '4px solid #2563eb',
                  position: 'relative',
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: idx === 3 ? '#7c3aed' : '#2563eb',
                      background: idx === 3 ? '#f5f3ff' : '#eff6ff',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: `1px solid ${idx === 3 ? '#ddd6fe' : '#bfdbfe'}`
                    }}>
                      {round.round}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#b45309',
                      background: '#fef3c7',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px',
                      border: '1px solid #fde68a'
                    }}>
                      Weightage: {round.weightage}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {round.title}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    color: '#2563eb',
                    marginBottom: '1rem',
                    fontWeight: 700
                  }}>
                    <Clock size={14} />
                    <span>{round.hours}</span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {round.focus}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.8rem',
                  color: '#64748b'
                }}>
                  <strong style={{ color: '#0f172a' }}>Evaluator:</strong> {round.evaluator}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5-STAGE LIFECYCLE VIEW */}
        {activeTab === 'lifecycle' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {lifecycleSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="glass-card"
                    style={{
                      padding: '1.75rem 2rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      background: '#ffffff'
                    }}
                  >
                    <div style={{
                      minWidth: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {step.step}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {step.title}
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#1d4ed8',
                          background: '#eff6ff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          border: '1px solid #bfdbfe'
                        }}>
                          {step.timeline}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
