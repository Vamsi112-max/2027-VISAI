import React, { useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { X, Plus, FilePlus, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function AddPageModal() {
  const { isAddPageModalOpen, setIsAddPageModalOpen, addCustomPage } = useSiteContent();

  const [form, setForm] = useState({
    navLabel: 'Accommodations',
    slug: 'accommodations',
    title: 'Participant Accommodations & Campus Hostel Guide',
    subtitle: 'Free 3-day on-campus hostel stay, food court coupons, and Wi-Fi credentials for outstation finalists.',
    badge: 'Campus Amenities',
    content: 'Vel Tech R&D Institute provides air-conditioned guest suites and separate male/female student dormitories equipped with hot water, high-speed 1Gbps Wi-Fi, and 24/7 security. Transport shuttle buses run from Chennai Central & Airport.',
    theme: 'lavender',
  });

  if (!isAddPageModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.navLabel || !form.title) return;
    addCustomPage(form);
    setIsAddPageModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 26, 32, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsAddPageModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 620,
          width: '100%',
          padding: '2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'var(--pastel-lavender-bg)',
                color: 'var(--pastel-lavender-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FilePlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                Create New Page / Navigation Tab
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Wix-Style Dynamic Website Page Builder
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddPageModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.4rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Nav Label & Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Navbar Tab Title
              </label>
              <input
                className="form-input"
                type="text"
                required
                value={form.navLabel}
                onChange={(e) => {
                  const label = e.target.value;
                  const autoSlug = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  setForm({ ...form, navLabel: label, slug: autoSlug });
                }}
                placeholder="e.g. Accommodations"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Page URL Identifier (Slug)
              </label>
              <input
                className="form-input"
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. accommodations"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Badge & Color Theme */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Header Badge Pill
              </label>
              <input
                className="form-input"
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. Guide & Amenities"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Color Palette Theme
              </label>
              <select
                className="form-input"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="lavender">Pastel Lavender</option>
                <option value="peach">Pastel Peach</option>
                <option value="lime">Pastel Lime</option>
                <option value="mint">Pastel Mint</option>
                <option value="yellow">Pastel Yellow</option>
              </select>
            </div>
          </div>

          {/* Page Main Headline Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Main Headline Title
            </label>
            <input
              className="form-input"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Participant Accommodations & Food Guide"
              style={{ width: '100%' }}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Subtitle / Overview
            </label>
            <input
              className="form-input"
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Summary description..."
              style={{ width: '100%' }}
            />
          </div>

          {/* Detailed Content */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Detailed Page Information
            </label>
            <textarea
              className="form-input"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write full page content, instructions, schedules, contacts, etc."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAddPageModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-coral btn-sm"
              style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} />
              <span>Create Page & Add to Navigation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
