import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../hooks/api';
import { fireConfetti } from '../utils/confetti';

const STORAGE_KEY = 'visai_live_site_content_v2';

export const DEFAULT_SITE_CONTENT = {
  themeSettings: {
    borderRadius: '28px', // '28px' (Bento Rounded) | '16px' (Standard) | '6px' (Sharp) | '9999px' (Pill)
    sectionSpacing: 'normal', // 'compact' | 'normal' | 'spacious'
    accentColor: '#FF5A36',
    brandName: 'VISAI 2027',
    institutionName: 'Vel Tech R&D Institute',
  },
  hero: {
    badge: 'VISAI 2027 • 17th International SDG Hackathon',
    titleLine1: 'Innovate, Build, Transform:',
    titleLine2Gradient: 'Bright Futures',
    titleLine2Accent: 'Begin Here.',
    subtitle: '17 UN SDG Tracks • 36-Hour National Prototype Sprint • ₹5,00,000+ Prize Pool • Organized by Vel Tech R&D Institute',
    slides: [
      {
        id: 'slide-mentors',
        theme: 'yellow',
        title: 'Young Innovators,',
        highlight: 'Big Breakthroughs! ✨',
        description: 'Every edition is a transformative journey in our Innovation Arena, MakerSpaces & Cloud AI Labs.',
        badgeText: '40+ Mentors & Industry Jury',
        badgeSub: 'From Google, Bosch, Microsoft & IEEE',
        avatars: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        ],
        photoSrc: '/images/gallery/hero_hackathon.jpg',
        photoBadge: 'VISAI Action Arena',
        photoTitle: '36-Hour Prototype Sprint',
        photoSub: 'IoT • Edge AI • Hardware Testing',
        ctaPills: ['SDG 1–17', 'Robotics', 'Industry 5.0'],
        ctaText: 'We believe every student engineer has the potential to engineer solutions that change lives.',
        ctaButton: 'Getting Started',
      },
      {
        id: 'slide-arena',
        theme: 'lime',
        title: '36 Hours Non-Stop,',
        highlight: 'Live Hardware & Code! ⚡',
        description: 'Student innovators assembling circuits, microcontrollers and training real-time AI models on site.',
        badgeText: 'National Innovator Arena',
        badgeSub: 'Across 350+ Colleges Nationwide',
        avatars: [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
        ],
        photoSrc: '/images/gallery/grand_stage.jpg',
        photoBadge: 'Grand Finale Auditorium',
        photoTitle: 'National Valedictory Stage',
        photoSub: '₹5,00,000 Cash Pool • TBI Grants',
        ctaPills: ['Cash Prizes', 'Patent Filing', 'TBI Incubation'],
        ctaText: 'Top prototypes receive direct seed funding and incubation support through Vel Tech Technology Business Incubator.',
        ctaButton: 'View Past Winners',
      },
      {
        id: 'slide-robotics',
        theme: 'peach',
        title: 'Hardware & MakerSpace,',
        highlight: 'Robotics Obstacle Arena! 🤖',
        description: 'High-speed testing tracks for LiDAR rovers, surveillance drones, and sub-sea marine robotic prototypes.',
        badgeText: 'Vel Tech MakerSpace Lab 4',
        badgeSub: '3D Printers • Oscilloscopes • SMD Benches',
        avatars: [
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        ],
        photoSrc: '/images/gallery/robotics_demo.jpg',
        photoBadge: 'Robotics Arena 2026',
        photoTitle: 'Hardware Prototype Track',
        photoSub: 'Autonomous Rovers • Microcontroller Nodes',
        ctaPills: ['Hardware', 'IoT Telemetry', 'TinyML'],
        ctaText: 'Test your physical embedded prototypes in real-time with comprehensive sensor benches and 24/7 technical mentors.',
        ctaButton: 'Explore Hardware PS',
      },
      {
        id: 'slide-jury',
        theme: 'lavender',
        title: 'Double-Blind Review,',
        highlight: 'Industry Jury Evaluations! ⚖️',
        description: 'Senior tech leads from Nicola Foundation, IEEE, CREDAI & Microsoft evaluate scalability and societal impact.',
        badgeText: '32 Domain Specialists',
        badgeSub: 'Clean Energy • Smart Cities • Health AI',
        avatars: [
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        ],
        photoSrc: '/images/gallery/jury_pitching.jpg',
        photoBadge: 'Evaluation Hub',
        photoTitle: 'Industry Live Pitching',
        photoSub: 'Stall Demos • Code & Circuit Inspection',
        ctaPills: ['5-Slide PPT', 'Repo Review', 'Live Pitch'],
        ctaText: 'Showcase your prototype directly to executive evaluators and industry heads with guaranteed feedback scorecards.',
        ctaButton: 'View Rules & Rubric',
      },
    ],
  },
  sdgSection: {
    badge: '17 UN Global Goals',
    title: '8 Hackathon Innovation SDG Themes',
    subtitle: 'Explore 24+ curated real-world problem statements tailored for engineering breakthroughs.',
  },
  threeSteps: {
    badge: 'How It Works',
    title: 'Innovation in 3 Simple Steps!',
    subtitle: 'From team formation to on-site live prototype evaluation and seed funding.',
  },
  prizePool: {
    badge: 'National Rewards & Grants',
    title: '₹5,00,000+ Grand Prize Pool & Incubation Grants',
    subtitle: 'Cash prizes, seed funding, prototyping hardware grants, and fast-track patent facilitation.',
  },
  customBlocks: [],
  customPages: [],
};

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SITE_CONTENT, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load local site content:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [draftContent, setDraftContent] = useState(content);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeEditModal, setActiveEditModal] = useState(null);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ saving: false, success: false, error: null });

  // Sync from backend on initial mount
  useEffect(() => {
    api.get('/content')
      .then(res => {
        if (res.data?.content) {
          const merged = { ...DEFAULT_SITE_CONTENT, ...res.data.content };
          setContent(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {
        // Try fallback to event-settings
        api.get('/admin/event-settings')
          .then(res => {
            const settings = res.data?.settings || [];
            const contentSetting = settings.find(s => s.setting_key === 'site_content_json');
            if (contentSetting && contentSetting.setting_value) {
              try {
                const parsed = JSON.parse(contentSetting.setting_value);
                const merged = { ...DEFAULT_SITE_CONTENT, ...parsed };
                setContent(merged);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (err) {}
            }
          })
          .catch(() => {});
      });
  }, []);

  const { user } = useAuth();
  const isAdmin = user && (user.role === 'super_admin' || user.role === 'admin');

  // Auto-disable visual edit mode if user is not admin or logs out
  useEffect(() => {
    if (!isAdmin && isVisualEditMode) {
      setIsVisualEditMode(false);
      setActiveEditModal(null);
    }
  }, [isAdmin, isVisualEditMode]);

  // Update draft whenever edit mode begins or content updates
  useEffect(() => {
    if (!isVisualEditMode) {
      setDraftContent(content);
      setPendingChanges([]);
    }
  }, [isVisualEditMode, content]);

  // Enter Visual Edit Mode (Restricted Strictly to Admins)
  const startVisualEdit = () => {
    if (!isAdmin) {
      console.warn('[VisualEdit] Unauthorized: Super Admin role required to edit site content');
      return;
    }
    setDraftContent(JSON.parse(JSON.stringify(content)));
    setPendingChanges([]);
    setIsVisualEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit Visual Edit Mode without saving
  const exitVisualEdit = () => {
    setDraftContent(content);
    setPendingChanges([]);
    setIsVisualEditMode(false);
    setActiveEditModal(null);
  };

  // Helper to set deeply nested draft field
  const updateDraftField = (fieldPath, newValue, fieldLabel = fieldPath) => {
    setDraftContent(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = fieldPath.split('.');
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!cur[p]) cur[p] = {};
        cur = cur[p];
      }
      const lastKey = parts[parts.length - 1];
      const oldValue = cur[lastKey];
      cur[lastKey] = newValue;

      // Track change
      setPendingChanges(ch => {
        const filtered = ch.filter(c => c.fieldPath !== fieldPath);
        return [
          ...filtered,
          {
            fieldPath,
            fieldLabel,
            oldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || ''),
            newValue: typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || ''),
            timestamp: new Date().toLocaleTimeString(),
          },
        ];
      });

      return copy;
    });
  };

  // Add a new custom block
  const addCustomBlock = (block) => {
    const newBlock = {
      id: 'blk-' + Date.now(),
      type: block.type || 'banner', // 'banner' | 'bento-card' | 'feature' | 'cta'
      title: block.title || 'New Announcement Section',
      subtitle: block.subtitle || 'Custom content box added via Live Visual Builder',
      content: block.content || 'Share important updates, accommodation details, or developer guidelines.',
      buttonText: block.buttonText || 'Learn More',
      buttonUrl: block.buttonUrl || '#',
      theme: block.theme || 'lime', // 'lime' | 'peach' | 'lavender' | 'yellow' | 'mint'
      badge: block.badge || '✨ Live Update',
      padding: block.padding || 'normal', // 'compact' | 'normal' | 'spacious'
      position: block.position || 'after-hero', // 'after-hero' | 'after-sdg' | 'after-steps' | 'before-footer'
    };

    setDraftContent(prev => {
      const updated = { ...prev, customBlocks: [...(prev.customBlocks || []), newBlock] };
      setPendingChanges(ch => [
        ...ch,
        {
          fieldPath: `customBlocks.${newBlock.id}`,
          fieldLabel: `Added New Content Box: "${newBlock.title}"`,
          oldValue: 'None (New Block)',
          newValue: `${newBlock.title} [${newBlock.type}]`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return updated;
    });
  };

  // Delete a custom block
  const deleteCustomBlock = (blockId) => {
    setDraftContent(prev => {
      const removed = (prev.customBlocks || []).find(b => b.id === blockId);
      const updated = {
        ...prev,
        customBlocks: (prev.customBlocks || []).filter(b => b.id !== blockId),
      };
      setPendingChanges(ch => [
        ...ch,
        {
          fieldPath: `customBlocks.${blockId}`,
          fieldLabel: `Deleted Content Box: "${removed?.title || blockId}"`,
          oldValue: removed?.title || 'Block',
          newValue: 'Deleted / Removed',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return updated;
    });
  };

  // Add a new custom page (Wix-Style Page Creation)
  const addCustomPage = (page) => {
    const newPage = {
      id: 'page-' + Date.now(),
      slug: page.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      navLabel: page.navLabel || 'New Page',
      title: page.title || 'Custom Page Title',
      subtitle: page.subtitle || 'Page description created with Visual Builder',
      badge: page.badge || 'Official VISAI 2027 Page',
      content: page.content || 'Content for this custom page. You can add paragraphs, guidelines, FAQs, or contact info.',
      bannerImage: page.bannerImage || '',
      theme: page.theme || 'lavender',
      cards: page.cards || [
        { title: 'Feature 1', description: 'Description for item 1', icon: 'Sparkles' },
        { title: 'Feature 2', description: 'Description for item 2', icon: 'Award' },
        { title: 'Feature 3', description: 'Description for item 3', icon: 'ShieldCheck' },
      ],
    };

    setDraftContent(prev => {
      const updated = { ...prev, customPages: [...(prev.customPages || []), newPage] };
      setPendingChanges(ch => [
        ...ch,
        {
          fieldPath: `customPages.${newPage.id}`,
          fieldLabel: `Created New Page & Navigation Tab: "${newPage.navLabel}" (/${newPage.slug})`,
          oldValue: 'None (New Page)',
          newValue: `${newPage.navLabel} [/${newPage.slug}]`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return updated;
    });
  };

  // Delete a custom page
  const deleteCustomPage = (pageId) => {
    setDraftContent(prev => {
      const removed = (prev.customPages || []).find(p => p.id === pageId);
      const updated = {
        ...prev,
        customPages: (prev.customPages || []).filter(p => p.id !== pageId),
      };
      setPendingChanges(ch => [
        ...ch,
        {
          fieldPath: `customPages.${pageId}`,
          fieldLabel: `Deleted Custom Page: "${removed?.navLabel || pageId}"`,
          oldValue: removed?.navLabel || 'Page',
          newValue: 'Deleted',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return updated;
    });
  };

  // Publish all changes live to TiDB Cloud & SQLite & Local Storage
  const publishAllChanges = async () => {
    setSaveStatus({ saving: true, success: false, error: null });
    try {
      const payloadString = JSON.stringify(draftContent);
      
      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, payloadString);
      setContent(draftContent);

      // Persist to backend database setting
      await api.put('/admin/event-settings/site_content_json', { value: payloadString }).catch(() => {});

      setSaveStatus({ saving: false, success: true, error: null });
      setIsReviewModalOpen(false);
      setIsVisualEditMode(false);
      setPendingChanges([]);
      fireConfetti();
      
      return { success: true };
    } catch (err) {
      console.error('Failed to publish changes to DB:', err);
      // Even if backend call fails, save locally
      setContent(draftContent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftContent));
      setSaveStatus({ saving: false, success: true, error: null });
      setIsReviewModalOpen(false);
      setIsVisualEditMode(false);
      fireConfetti();
      return { success: true };
    }
  };

  // Reset to default factory template
  const resetToDefaults = () => {
    setDraftContent(DEFAULT_SITE_CONTENT);
    setContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem(STORAGE_KEY);
    api.put('/admin/event-settings/site_content_json', { value: JSON.stringify(DEFAULT_SITE_CONTENT) }).catch(() => {});
    setIsVisualEditMode(false);
    setIsReviewModalOpen(false);
    setPendingChanges([]);
  };

  const activeContent = isVisualEditMode ? draftContent : content;

  return (
    <SiteContentContext.Provider
      value={{
        content: activeContent,
        rawContent: content,
        draftContent,
        isVisualEditMode,
        pendingChanges,
        isReviewModalOpen,
        activeEditModal,
        isAddBlockModalOpen,
        isAddPageModalOpen,
        isThemeModalOpen,
        saveStatus,
        startVisualEdit,
        exitVisualEdit,
        updateDraftField,
        addCustomBlock,
        deleteCustomBlock,
        addCustomPage,
        deleteCustomPage,
        publishAllChanges,
        resetToDefaults,
        setIsReviewModalOpen,
        setActiveEditModal,
        setIsAddBlockModalOpen,
        setIsAddPageModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return ctx;
}
