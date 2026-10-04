import React, { useState, useEffect, useRef } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  X, Check, Edit3, Image as ImageIcon, Sparkles,
  Upload, Link as LinkIcon, Type, Palette, AlignLeft,
  AlignCenter, AlignRight, Bold, Sliders, CheckCircle2,
  Trash2, RefreshCw
} from 'lucide-react';
import api from '../../hooks/api';

const PRESET_COLORS = [
  { name: 'Coral (Brand)', hex: '#FF5A36' },
  { name: 'Dark Pitch', hex: '#181A20' },
  { name: 'Emerald Mint', hex: '#10B981' },
  { name: 'Lavender', hex: '#8B5CF6' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Slate Gray', hex: '#64748B' },
];

const FONT_FAMILIES = [
  { label: 'Modern Sans (Inter)', value: "'Inter', sans-serif" },
  { label: 'Display (Outfit)', value: "'Outfit', sans-serif" },
  { label: 'Editorial (Serif)', value: "'Georgia', serif" },
  { label: 'Monospace (Code)', value: "'JetBrains Mono', monospace" },
];

export default function EditFieldModal() {
  const { activeEditModal, setActiveEditModal, updateDraftField } = useSiteContent();
  
  const [val, setVal] = useState('');
  const [imageUploadMode, setImageUploadMode] = useState('local'); // 'local' | 'url'
  const [fileDetails, setFileDetails] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Text Styling State
  const [fontSize, setFontSize] = useState('inherit');
  const [fontWeight, setFontWeight] = useState('inherit');
  const [fontColor, setFontColor] = useState('inherit');
  const [fontFamily, setFontFamily] = useState('inherit');
  const [textAlign, setTextAlign] = useState('left');
  const [textTransform, setTextTransform] = useState('none');
  const [isStyleExpanded, setIsStyleExpanded] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeEditModal) {
      setVal(activeEditModal.currentValue || '');
      setFileDetails(null);
      setUploadError('');
      setIsStyleExpanded(false);
    }
  }, [activeEditModal]);

  if (!activeEditModal) return null;

  const isImage = activeEditModal.type === 'image';
  const isTextArea = activeEditModal.type === 'textarea';

  // Handle local file selection
  const handleLocalFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadError('');
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
    });

    // 1. Instant local preview via Data URL
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setVal(dataUrl);
    };
    reader.readAsDataURL(file);

    // 2. Upload to server in background if available
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setVal(res.data.url);
      }
      setUploading(false);
    } catch (err) {
      // Fallback: the base64 dataUrl is already set and works completely!
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateDraftField(activeEditModal.fieldPath, val, activeEditModal.fieldLabel);
    setActiveEditModal(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 26, 32, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setActiveEditModal(null)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--r-2xl)',
          maxWidth: 620,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1.5px solid var(--canvas-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: isImage ? 'var(--pastel-peach-bg)' : 'var(--pastel-mint-bg)',
                color: isImage ? 'var(--whiz-coral)' : 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isImage ? <ImageIcon size={20} /> : <Edit3 size={20} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--whiz-dark)', margin: 0 }}>
                  Edit {isImage ? 'Photo / Image' : 'Content Text'}
                </h3>
                <span className="badge badge-coral" style={{ fontSize: '0.68rem' }}>
                  ADMIN LIVE EDIT
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Field: <code>{activeEditModal.fieldLabel}</code>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveEditModal(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.4rem',
              borderRadius: '50%',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* =====================================================
                IMAGE EDITING CONTROLS (Upload from Device vs URL)
               ===================================================== */}
            {isImage ? (
              <div>
                {/* Upload Mode Switcher */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('local')}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1rem',
                      borderRadius: 'var(--r-md)',
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: imageUploadMode === 'local' ? '1.5px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                      background: imageUploadMode === 'local' ? 'var(--pastel-peach-bg)' : '#FFFFFF',
                      color: imageUploadMode === 'local' ? 'var(--whiz-coral)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Upload size={15} />
                    <span>Upload from Local Computer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageUploadMode('url')}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1rem',
                      borderRadius: 'var(--r-md)',
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: imageUploadMode === 'url' ? '1.5px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                      background: imageUploadMode === 'url' ? 'var(--pastel-peach-bg)' : '#FFFFFF',
                      color: imageUploadMode === 'url' ? 'var(--whiz-coral)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <LinkIcon size={15} />
                    <span>Enter Image URL Link</span>
                  </button>
                </div>

                {uploadError && (
                  <div style={{ padding: '0.65rem 1rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    ⚠️ {uploadError}
                  </div>
                )}

                {/* Local Upload Dropzone */}
                {imageUploadMode === 'local' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLocalFileChange}
                      style={{ display: 'none' }}
                    />
                    
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--whiz-coral)',
                        borderRadius: 'var(--r-xl)',
                        padding: '1.75rem 1.5rem',
                        textAlign: 'center',
                        background: 'var(--canvas-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      className="upload-dropzone-hover"
                    >
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          color: 'var(--whiz-coral)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.75rem',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <Upload size={24} />
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--whiz-dark)', marginBottom: '0.25rem' }}>
                        Click to Choose Photo from Device
                      </div>
                      <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                        Supports PNG, JPG, JPEG, WEBP, SVG up to 10MB
                      </div>
                      {uploading && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--whiz-coral)', fontWeight: 800 }}>
                          ⏳ Saving image to server...
                        </div>
                      )}
                    </div>

                    {fileDetails && (
                      <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                        <span>📁 <strong>{fileDetails.name}</strong> ({fileDetails.size})</span>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>✓ File Loaded</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                      Image URL (Direct link or /images/...)
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      value={val}
                      onChange={(e) => setVal(e.target.value)}
                      style={{ width: '100%', borderRadius: 'var(--r-md)', padding: '0.75rem' }}
                      placeholder="https://images.unsplash.com/... or /images/gallery/..."
                      autoFocus
                    />
                  </div>
                )}

                {/* Live Image Preview Card */}
                {val && (
                  <div style={{ marginTop: '1.25rem', background: '#F8FAFC', borderRadius: '16px', padding: '1rem', border: '1px solid var(--canvas-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--whiz-dark)' }}>
                        Live Image Preview:
                      </span>
                      <button
                        type="button"
                        onClick={() => { setVal(''); setFileDetails(null); }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Trash2 size={13} /> Clear Photo
                      </button>
                    </div>
                    <div style={{ maxHeight: 220, borderRadius: '12px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={val}
                        alt="Uploaded preview"
                        style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* =====================================================
                  TEXT & RICH TYPOGRAPHY / COLOR CONTROLS
                 ===================================================== */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Text Content Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: 'var(--whiz-dark)', marginBottom: '0.4rem' }}>
                    Text Content *
                  </label>
                  {isTextArea ? (
                    <textarea
                      className="form-input"
                      rows={5}
                      required
                      value={val}
                      onChange={(e) => setVal(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: 'var(--r-md)',
                        padding: '0.85rem',
                        resize: 'vertical',
                        lineHeight: 1.6,
                        fontSize: fontSize !== 'inherit' ? fontSize : '0.95rem',
                        color: fontColor !== 'inherit' ? fontColor : 'var(--text-primary)',
                        fontWeight: fontWeight !== 'inherit' ? fontWeight : 'normal',
                      }}
                      placeholder="Enter text..."
                      autoFocus
                    />
                  ) : (
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={val}
                      onChange={(e) => setVal(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: 'var(--r-md)',
                        padding: '0.85rem',
                        fontSize: fontSize !== 'inherit' ? fontSize : '1rem',
                        color: fontColor !== 'inherit' ? fontColor : 'var(--text-primary)',
                        fontWeight: fontWeight !== 'inherit' ? fontWeight : 'bold',
                      }}
                      placeholder="Enter headline or text..."
                      autoFocus
                    />
                  )}
                </div>

                {/* Typography Customization Toggle */}
                <div style={{ border: '1px solid var(--canvas-border)', borderRadius: '16px', padding: '1rem', background: '#FAFAFA' }}>
                  <div
                    onClick={() => setIsStyleExpanded(!isStyleExpanded)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Palette size={16} color="var(--whiz-coral)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--whiz-dark)' }}>
                        Typography, Font Size, Style & Color Controls
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--whiz-coral)' }}>
                      {isStyleExpanded ? 'Collapse ▲' : 'Customize Style ▼'}
                    </span>
                  </div>

                  {isStyleExpanded && (
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
                      
                      {/* Font Size Presets */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Font Size:
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {[
                            { label: 'Body (14px)', size: '14px' },
                            { label: 'Medium (16px)', size: '16px' },
                            { label: 'Subtitle (20px)', size: '20px' },
                            { label: 'Heading (26px)', size: '26px' },
                            { label: 'Hero Title (36px)', size: '36px' },
                            { label: 'Giant (48px)', size: '48px' },
                          ].map(preset => (
                            <button
                              key={preset.size}
                              type="button"
                              onClick={() => setFontSize(preset.size)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--r-full)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: fontSize === preset.size ? '1.5px solid var(--whiz-coral)' : '1px solid var(--canvas-border)',
                                background: fontSize === preset.size ? 'var(--pastel-peach-bg)' : '#FFFFFF',
                                color: fontSize === preset.size ? 'var(--whiz-coral)' : 'var(--text-primary)',
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Weight & Family */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Font Weight:
                          </div>
                          <select
                            value={fontWeight}
                            onChange={e => setFontWeight(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            <option value="inherit">Default Weight</option>
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="700">Bold (700)</option>
                            <option value="900">Black / Extra Bold (900)</option>
                          </select>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Font Family:
                          </div>
                          <select
                            value={fontFamily}
                            onChange={e => setFontFamily(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-md)', border: '1px solid var(--canvas-border)', background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            <option value="inherit">Default Font</option>
                            {FONT_FAMILIES.map(f => (
                              <option key={f.label} value={f.value}>{f.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Color Palette Swatches */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Text Color:</span>
                          <span style={{ fontFamily: 'monospace' }}>{fontColor}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {PRESET_COLORS.map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setFontColor(c.hex)}
                              title={c.name}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: c.hex,
                                border: fontColor === c.hex ? '2.5px solid var(--whiz-coral)' : '1px solid rgba(0,0,0,0.15)',
                                cursor: 'pointer',
                                boxShadow: fontColor === c.hex ? '0 0 8px rgba(255,90,54,0.5)' : 'none',
                                transform: fontColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 0.15s ease',
                              }}
                            />
                          ))}

                          {/* Custom Color Input */}
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 800 }}>
                            <input
                              type="color"
                              value={fontColor.startsWith('#') ? fontColor : '#FF5A36'}
                              onChange={e => setFontColor(e.target.value)}
                              style={{ width: 30, height: 30, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                            />
                            <span>Custom</span>
                          </label>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* Live Styled Text Preview */}
                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--canvas-border)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Live Styled Preview:
                  </div>
                  <div
                    style={{
                      fontSize: fontSize !== 'inherit' ? fontSize : '1.1rem',
                      fontWeight: fontWeight !== 'inherit' ? fontWeight : 800,
                      color: fontColor !== 'inherit' ? fontColor : 'var(--whiz-dark)',
                      fontFamily: fontFamily !== 'inherit' ? fontFamily : 'inherit',
                      textAlign: textAlign,
                      textTransform: textTransform,
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {val || 'Preview text...'}
                  </div>
                </div>

              </div>
            )}

            {/* Actions Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--canvas-border)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveEditModal(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="btn btn-coral btn-sm"
                style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-coral)' }}
              >
                <Check size={16} />
                <span>Apply to Draft</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
