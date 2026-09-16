import React, { useState } from 'react';
import { STALLS_DATA } from '../data/visaiData';
import { Store, DollarSign, CheckCircle2, Coffee, Cpu, Sparkles, Send } from 'lucide-react';

export default function StallsExpo({ content }) {
  const [inquirySent, setInquirySent] = useState(false);

  return (
    <section id="stalls" className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="badge-tag">
            <Store size={14} />
            <span>Campus Expo & Commercial Hub</span>
          </div>
          <h2 className="section-title">
            {content?.title || "Stalls & Sponsorship Expo"}
          </h2>
          <p className="section-subtitle">
            {content?.description || "A bustling ecosystem connecting student innovators with commercial technology vendors, startup showcases, and campus dining during the 36/48-hour event."}
          </p>
        </div>

        {/* Category Pricing Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Tech Stall Card */}
          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #2563eb', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '10px', color: '#2563eb' }}>
                <Cpu size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Technology / Business Stall</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Makers, Kits, Startups</span>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.5rem' }}>
              ₹1,500 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>onwards</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
              Designed for hardware component vendors, ed-tech tools, recruitment kiosks, and student-led startup promotions.
            </p>
            <ul style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#2563eb" /> 10x10 Covered Booth + 24/7 Power
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#2563eb" /> Direct exposure to 1,200+ attendees
              </li>
            </ul>
          </div>

          {/* Food Stall Card */}
          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #d97706', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '10px', color: '#b45309' }}>
                <Coffee size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Food & Beverage Stall</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Open Quadrangle Food Court</span>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', marginBottom: '0.5rem' }}>
              ₹5,000 – ₹6,000 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>onwards</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
              Exclusive spots in the central hackathon courtyard catering round-the-clock coffee, quick meals, snacks, and juices.
            </p>
            <ul style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#d97706" /> High volume midnight footfall
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#d97706" /> Dedicated waste disposal & water link
              </li>
            </ul>
          </div>

          {/* Sponsor Pavilion Card */}
          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #059669', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#d1fae5', padding: '0.5rem', borderRadius: '10px', color: '#059669' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Corporate Exhibition</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ashok Leyland, Renault, L&T</span>
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>
              Partner Sponsored
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
              Interactive showcase featuring autonomous vehicle rigs, valve cross-sections, and on-spot talent acquisition interviews.
            </p>
            <ul style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#059669" /> Prime central foyer placement
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} color="#059669" /> Brand logo on VISAI Souvenir Book
              </li>
            </ul>
          </div>
        </div>

        {/* Current Stalls Table */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Confirmed Expo Exhibitors & Locations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', background: '#f8fafc' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Stall Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Offering</th>
                </tr>
              </thead>
              <tbody>
                {STALLS_DATA.map((stall) => (
                  <tr key={stall.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{stall.name}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{stall.category}</td>
                    <td style={{ padding: '1rem', color: '#2563eb', fontWeight: 600 }}>{stall.location}</td>
                    <td style={{ padding: '1rem' }}>{stall.offering}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
