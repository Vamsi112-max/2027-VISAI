import React from 'react';
import { Phone, Mail, MapPin, Download, ExternalLink, Globe, Heart } from 'lucide-react';

export default function Footer({ onOpenAuthModal }) {
  return (
    <footer style={{
      background: '#0f172a',
      borderTop: '1px solid #1e293b',
      padding: '4.5rem 0 2.5rem',
      color: '#94a3b8'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Col 1: Brand & Institution */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                <img 
                  src="/visai-logo.png" 
                  alt="VISAI Logo" 
                  style={{ 
                    height: '36px', 
                    objectFit: 'contain'
                  }} 
                />
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  color: '#0f172a',
                  marginTop: '-4px'
                }}>
                  2027
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              17th Edition International Project Competition & 36/48-Hour SDG Hackathon organized by <strong>Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology</strong>, Avadi, Chennai.
            </p>

            <div style={{ fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="#38bdf8" />
                <span>Toll-Free Helpline: <strong>+1800 212 7669</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="#38bdf8" />
                <span>Email: <strong>visai@veltech.edu.in</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={14} color="#38bdf8" style={{ marginTop: '3px' }} />
                <span>400 Feet Outer Ring Road, Avadi, Chennai – 600062, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Innovation Tracks & Themes */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Hackathon Tracks & SDGs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><a href="#tracks" style={{ color: '#cbd5e1' }}>💻 Software Track (Venue Release)</a></li>
              <li><a href="#tracks" style={{ color: '#cbd5e1' }}>🔧 Hardware Track (7-10 Days Release)</a></li>
              <li><a href="#sdgs" style={{ color: '#cbd5e1' }}>17 UN Sustainable Development Goals</a></li>
              <li><a href="#problems" style={{ color: '#cbd5e1' }}>Industry Codes (e.g. VISAI-SDG06-IND01)</a></li>
              <li><a href="#timeline" style={{ color: '#cbd5e1' }}>4 Internal Evaluation Milestones</a></li>
            </ul>
          </div>

          {/* Col 3: Official Downloads */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Downloads & Formats
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={14} color="#38bdf8" />
                <a href="#problems" style={{ color: '#cbd5e1' }}>VISAI 2027 Official Brochure (PDF)</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={14} color="#38bdf8" />
                <a href="#problems" style={{ color: '#cbd5e1' }}>Initial Abstract & PPT Format (.pptx)</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={14} color="#38bdf8" />
                <a href="#problems" style={{ color: '#cbd5e1' }}>Hardware Track Safety Guidelines</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={14} color="#38bdf8" />
                <a href="#souvenir" style={{ color: '#cbd5e1' }}>Innovation Souvenir Book Template</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Multi-Role Portals & Logins */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Multi-Role Portal Access
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Instant role switcher and credentials for hackathon participants, grand jury evaluators, organizers, and campus coordinators.
            </p>
            <button
              onClick={onOpenAuthModal}
              className="btn btn-sm btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              Sign In to Role Portal
            </button>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Credentials banner available at top of page for instant 1-click test login.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            © 2027 Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Tagline: <em>"Real Problems. Real Innovation. Real Impact."</em></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
