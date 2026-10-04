import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { Edit3, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';

export default function InlineEditBox({
  fieldPath,
  fieldLabel,
  value,
  type = 'text', // 'text' | 'textarea' | 'image' | 'theme'
  children,
  style = {},
  className = '',
  as = 'span',
}) {
  const { user } = useAuth();
  const { isVisualEditMode, setActiveEditModal } = useSiteContent();

  const isAdmin = user && (user.role === 'super_admin' || user.role === 'admin');

  if (!isVisualEditMode || !isAdmin) {
    const Component = as;
    return <Component className={className} style={style}>{children || value}</Component>;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveEditModal({
      fieldPath,
      fieldLabel: fieldLabel || fieldPath,
      currentValue: value,
      type,
    });
  };

  const Component = as;

  return (
    <Component
      className={`visual-editable-box ${className}`}
      onClick={handleClick}
      style={{
        position: 'relative',
        display: as === 'span' ? 'inline-block' : undefined,
        cursor: 'pointer',
        outline: '2px dashed #FF5A36',
        outlineOffset: '4px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        ...style,
      }}
      title={`Click to edit: ${fieldLabel || fieldPath}`}
    >
      {children || value}

      {/* Floating Edit Indicator Badge */}
      <span
        style={{
          position: 'absolute',
          top: '-12px',
          right: '-8px',
          background: '#FF5A36',
          color: '#FFFFFF',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.68rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          boxShadow: '0 2px 8px rgba(255,90,54,0.4)',
          zIndex: 40,
          pointerEvents: 'none',
          letterSpacing: '0.02em',
        }}
      >
        {type === 'image' ? <ImageIcon size={11} /> : <Edit3 size={11} />}
        <span>Edit</span>
      </span>
    </Component>
  );
}
