import React from 'react';
import { SOCIAL_LINKS } from '../../data/visaiData';
import { MessageSquare, Send, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon } from '../shared/BrandIcons';

export default function SocialLinksHub() {
  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'Instagram': return <InstagramIcon size={24} />;
      case 'Linkedin': return <LinkedinIcon size={24} />;
      case 'Youtube': return <YoutubeIcon size={24} />;
      case 'Github': return <GithubIcon size={24} />;
      case 'MessageSquare': return <MessageSquare size={24} />;
      case 'Send': return <Send size={24} />;
      default: return <ExternalLink size={24} />;
    }
  };

  return (
    <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--canvas-border)', borderBottom: '1px solid var(--canvas-border)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="var(--whiz-coral)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--whiz-coral)', letterSpacing: '0.04em' }}>
              Connect & Build
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.75rem' }}>
            Social Channels & Developer Ecosystem
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Follow official VISAI hackathon social media for live updates, access developer tools, code repositories, and community discussion rooms.
          </p>
        </div>

        {/* Social Media Grid (WhizKid Style Bento Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {SOCIAL_LINKS.map(social => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="social-card"
              style={{
                borderLeft: `5px solid ${social.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--r-lg)',
                  background: social.bgColor, color: social.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getSocialIcon(social.icon)}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--whiz-coral)', fontSize: '0.8rem', fontWeight: 800 }}>
                  <span>Join / Follow</span>
                  <ArrowUpRight size={15} />
                </div>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.2rem' }}>
                {social.name}
              </h4>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: social.color, marginBottom: '0.65rem' }}>
                {social.handle}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {social.description}
              </p>

              <div style={{
                marginTop: 'auto',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--canvas-border)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}>
                <span>{social.followers}</span>
                <span>{social.postsCount}</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
