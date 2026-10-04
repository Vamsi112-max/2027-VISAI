import React, { useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { X, Plus, Sparkles, Layout, MessageSquare, Award, ArrowRight } from 'lucide-react';

export default function AddBlockModal() {
  const { isAddBlockModalOpen, setIsAddBlockModalOpen, addCustomBlock } = useSiteContent();

  const [form, setForm] = useState({
    type: 'banner',
    title: 'Hackathon Innovation Hub & Hardware Testing Guidelines',
    subtitle: 'Important guidelines for participants bringing physical embedded IoT kits, sensors & laptops.',
    content: 'All teams are requested to bring their own microcontroller dev boards (ESP32 / Arduino / Raspberry Pi) and multi-meter kits. 24/7 power outlets, soldering stations, and oscilloscope test benches are provided at Vel Tech Lab 4.',
    buttonText: 'View Lab Guidelines',
    buttonUrl: '#',
    theme: 'lime', // 'lime' | 'peach' | 'lavender' | 'yellow' | 'mint'
    badge: '⚡ Hardware Update',
    position: 'after-hero',
    padding: 'normal',
  });

  if (!isAddBlockModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomBlock(form);
    setIsAddBlockModalOpen(false);
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
      onClick={() => setIsAddBlockModalOpen(false)}
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
                background: 'var(--pastel-lime-bg)',
                color: 'var(--pastel-lime-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layout size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                Add New Content Section / Box
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Wix-Style Dynamic Block Creator
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddBlockModalOpen(false)}
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
          {/* Block Type & Theme Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Block Layout Type
              </label>
              <select
                className="form-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="banner">Full-Width Bento Banner</option>
                <option value="bento-card">Highlighted Bento Callout</option>
                <option value="cta">Call to Action Box</option>
              </select>
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
                <option value="lime">Pastel Lime (#F6FBD4)</option>
                <option value="peach">Pastel Peach (#FFE7DF)</option>
                <option value="lavender">Pastel Lavender (#ECE6FA)</option>
                <option value="yellow">Pastel Yellow (#FFF4CC)</option>
                <option value="mint">Pastel Mint (#E6F9F0)</option>
              </select>
            </div>
          </div>

          {/* Badge & Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Badge Pill Text
              </label>
              <input
                className="form-input"
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. 🚀 Special Track"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Section Headline Title
              </label>
              <input
                className="form-input"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter title..."
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Subtitle / Tagline
            </label>
            <input
              className="form-input"
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Short description..."
              style={{ width: '100%' }}
            />
          </div>

          {/* Main Body Content */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Detailed Paragraph Text
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Detailed guidelines, info or announcements..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Button & Link */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Button Text
              </label>
              <input
                className="form-input"
                type="text"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                placeholder="e.g. Register / Learn More"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Button URL / Action
              </label>
              <input
                className="form-input"
                type="text"
                value={form.buttonUrl}
                onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })}
                placeholder="e.g. #problems or https://..."
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Placement Position */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Page Placement Position
            </label>
            <select
              className="form-input"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="after-hero">Right Below Hero Showcase</option>
              <option value="after-sdg">After 8 SDG Themes Grid</option>
              <option value="after-steps">After 3 Simple Steps Section</option>
              <option value="before-footer">Before Footer Bottom Section</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAddBlockModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-coral btn-sm"
              style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} />
              <span>Insert Box into Live Page</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
