import React from 'react';
import { VISAI_CONFIG, SOCIAL_LINKS, NAV_LINKS } from '../data/visaiData';
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon } from './shared/BrandIcons';

export default function Footer({ onOpenAuth, onNavigate }) {
  return (
    <footer style={{
      background: '#FFFFFF',
      borderTop: '1px solid var(--canvas-border)',
      padding: '4.5rem 0 2.5rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
          gap: '3rem',
          marginBottom: '3.5rem'
        }} className="footer-grid">
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div className="whiz-logo-icon">
                <Sparkles size={20} color="#fff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                  VISAI<span style={{ color: 'var(--whiz-coral)' }}>.27</span>
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Vel Tech R&D
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              17th International SDG & Industry Innovation Hackathon organized by <strong>{VISAI_CONFIG.host}</strong>, Avadi, Chennai.
            </p>

            {/* Social Redirection Icons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a
                href="https://www.instagram.com/visai_hackathon"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#FDF2F4', color: '#E1306C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="Instagram"
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/visai-hackathon"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#EEF6FD', color: '#0A66C2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>

              <a
                href="https://www.youtube.com/@veltechuniversity"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#FFF1F1', color: '#FF0000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>

              <a
                href="https://github.com/visai-hackathon"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#F6F8FA', color: '#24292F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {NAV_LINKS.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.875rem', color: 'var(--text-secondary)',
                      fontWeight: 600, padding: 0, textAlign: 'left',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--whiz-coral)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization & Downloads */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '1.25rem' }}>
              Structure & Formats
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('teams')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, padding: 0 }}
                >
                  🌳 Org Hierarchy Tree
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('teams')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, padding: 0 }}
                >
                  📋 PPT & Abstract Format
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('gallery')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, padding: 0 }}
                >
                  📸 Past Edition Archives
                </button>
              </li>
              <li>
                <a href="https://sdgs.un.org/goals" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  🌐 UN SDG 1–17 Framework
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '1.25rem' }}>
              Institution & Helpdesk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--whiz-coral)" />
                <a href={`mailto:${VISAI_CONFIG.contactEmail}`} style={{ color: 'var(--whiz-dark)', fontWeight: 700 }}>
                  {VISAI_CONFIG.contactEmail}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--whiz-coral)" />
                <span>{VISAI_CONFIG.helpline}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--whiz-coral)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{VISAI_CONFIG.hostAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--canvas-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2027 VISAI. Vel Tech R&D Institute of Science and Technology. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Engineered with</span>
            <Heart size={14} color="var(--whiz-coral)" fill="var(--whiz-coral)" />
            <span>for Student Innovators</span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
