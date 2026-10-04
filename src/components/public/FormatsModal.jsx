import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Presentation, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

export default function FormatsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('abstract'); // 'abstract' | 'ppt'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const abstractTemplateText = `“PROJECT TITLE HERE”
FIRST AUTHOR, SECOND AUTHOR, THIRD AUTHOR

Corresponding Author Email ID: author@example.com
NAME OF THE COLLEGE, CITY

SDG Goals / Hackathon Problem Statement: [Specify SDG Goal or PS ID]

Abstract (Maximum 700 Words):
[Describe the problem context, proposed engineering/software solution, architecture, key innovations, experimental results, and societal/industry impact here.]

Keywords: Minimum Two (e.g. IoT, Artificial Intelligence, Edge Computing)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(abstractTemplateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(24, 26, 32, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: 820,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '1px solid var(--canvas-border)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--canvas-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FDFBF7'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--whiz-coral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              <BookOpen size={14} /> Official Guidelines
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
              VISAI Submission Formats
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F3EFE6',
              border: 'none',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--whiz-dark)',
              transition: 'transform 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '0.85rem 1.75rem',
          borderBottom: '1px solid var(--canvas-border)',
          background: '#FFFFFF'
        }}>
          <button
            onClick={() => setActiveTab('abstract')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.2rem',
              borderRadius: 'var(--r-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'abstract' ? 'var(--whiz-coral)' : '#F3EFE6',
              color: activeTab === 'abstract' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={15} />
            📋 Abstract Format
          </button>

          <button
            onClick={() => setActiveTab('ppt')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.2rem',
              borderRadius: 'var(--r-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'ppt' ? 'var(--whiz-coral)' : '#F3EFE6',
              color: activeTab === 'ppt' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Presentation size={15} />
            📊 Presentation (PPT) Format
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.5rem 1.75rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {activeTab === 'abstract' ? (
            <>
              {/* Abstract Info Banner */}
              <div style={{
                background: '#FFF4EE',
                border: '1px solid #FFE0D6',
                borderRadius: '16px',
                padding: '1.1rem 1.3rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.9rem'
              }}>
                <Sparkles size={20} color="var(--whiz-coral)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--whiz-dark)', lineHeight: 1.5 }}>
                  <strong>Mandatory Abstract Rules:</strong> Abstracts must be within <strong>700 words</strong>, include at least <strong>two keywords</strong>, and clearly specify the United Nations SDG theme or Industry Hackathon Problem Statement.
                </div>
              </div>

              {/* Download Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="/downloads/VISAI_Abstract_Format.docx"
                  download="VISAI_Abstract_Format.docx"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
                >
                  <Download size={15} />
                  Download Word Template (.docx)
                </a>

                <a
                  href="/downloads/VISAI_Abstract_Format.pdf"
                  download="VISAI_Abstract_Format.pdf"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.85rem', padding: '0.6rem 1.2rem', background: '#FFFFFF', border: '1px solid var(--canvas-border)' }}
                >
                  <Download size={15} />
                  Download PDF Sample (.pdf)
                </a>

                <button
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#F6FBD4',
                    color: '#4F610D',
                    border: '1px solid #E6EE9C',
                    borderRadius: 'var(--r-full)',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Template Text'}
                </button>
              </div>

              {/* Template Text Preview Box */}
              <div style={{
                background: '#FAF8F4',
                border: '1px solid var(--canvas-border)',
                borderRadius: '16px',
                padding: '1.25rem',
                fontFamily: 'Georgia, serif',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                color: '#2A2E3D',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.15rem', marginBottom: '0.4rem', color: '#181A20' }}>
                  “TITLE OF THE PROJECT”
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.8rem', color: '#4A5060' }}>
                  FIRST AUTHOR, SECOND AUTHOR, THIRD AUTHOR
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                  <strong>Corresponding Author Email ID:</strong> prajwala.28p@gmail.com
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem', color: '#4A5060' }}>
                  NAME OF THE COLLEGE, CITY
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem', padding: '0.4rem 0.6rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--canvas-border)' }}>
                  SDG Goals / Hackathon Problem Statement: <u>LIFE ON LAND / INDUSTRY STATEMENT</u>
                </div>
                <div style={{ marginTop: '0.8rem', fontWeight: 800, fontSize: '0.95rem' }}>
                  Abstract (Maximum 700 Words)
                </div>
                <p style={{ marginTop: '0.35rem', color: '#555A68', fontSize: '0.88rem', textAlign: 'justify' }}>
                  Forests and agricultural lands are critical for biodiversity, climate regulation, and food security, yet their monitoring remains challenging when performed using traditional manual methods. GreenSight introduces a smart vegetation management system that combines LiDAR sensing and artificial intelligence to deliver precise, scalable, and efficient analysis...
                </p>
                <div style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>
                  <strong>Keywords:</strong> Minimum Two (e.g. LiDAR, Precision Forestry, 3D Point Cloud).
                </div>
              </div>
            </>
          ) : (
            <>
              {/* PPT Info Banner */}
              <div style={{
                background: '#ECE6FA',
                border: '1px solid #DDD3F5',
                borderRadius: '16px',
                padding: '1.1rem 1.3rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.9rem'
              }}>
                <Sparkles size={20} color="#482C9E" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.88rem', color: '#311E6B', lineHeight: 1.5 }}>
                  <strong>Jury Presentation Guidelines:</strong> Keep your presentation concise (typically <strong>7 to 10 slides</strong>). Focus heavily on the <strong>CDIO (Conceive, Design, Implement, Operate) framework</strong>, hardware/software architecture, and demonstrable live prototype results.
                </div>
              </div>

              {/* Download Button */}
              <div>
                <a
                  href="/downloads/VISAI_2027_Presentation_Template.pptx"
                  download="VISAI_2027_Presentation_Template.pptx"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.88rem', padding: '0.65rem 1.3rem' }}
                >
                  <Download size={16} />
                  Download Official PPTX Template (.pptx)
                </a>
              </div>

              {/* Slide Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
                {[
                  { num: 'Slide 1', title: 'Title & Team Information', desc: 'Project Title, Team ID, Members, Guide, and Chosen SDG / Industry Problem Statement.' },
                  { num: 'Slide 2', title: 'Problem & Motivation', desc: 'Context, current system limitations, target users, and why solving this matters.' },
                  { num: 'Slide 3', title: 'Proposed Solution & USP', desc: 'Core engineering innovation, Unique Selling Point, and expected technical benefits.' },
                  { num: 'Slide 4', title: 'System Architecture', desc: 'Block diagram, hardware schematics, cloud data pipeline, and software flow.' },
                  { num: 'Slide 5', title: 'Implementation (CDIO)', desc: 'Sensor selection, protocols (MQTT/LoRa), ML models, and prototype fabrication.' },
                  { num: 'Slide 6', title: 'Working Prototype & Demo', desc: 'Hardware photos, application screenshots, live jury demo steps, and test metrics.' },
                  { num: 'Slide 7', title: 'Feasibility & SDG Impact', desc: 'Bill of Materials (BOM), mass production costing, scalability, and measurable SDG impact.' },
                  { num: 'Slide 8', title: 'Conclusion & Roadmap', desc: 'Achievements, pre-incubation roadmap at Vel Tech TBI, patent/IP plan, and Q&A.' }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--canvas-border)',
                      borderRadius: '14px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="badge badge-lavender" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                        {s.num}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                      {s.title}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--canvas-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FDFBF7'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Organized by Vel Tech R&D Institute • VISAI 2027
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
