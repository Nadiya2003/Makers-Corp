'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { normalizeSettingsImages } from '@/lib/imageUtils';

export interface Settings {
  siteName: string;
  logo: string;
  favicon: string;
  header: {
    navLinks: Array<{ label: string; url: string }>;
    showSearch: boolean;
    contactNumber: string;
    whatsappNumber?: string;
    tagline?: string;
  };
  footer: {
    logo?: string;
    image?: string;
    imageVisible?: boolean;
    aboutText: string;
    address: string;
    email: string;
    phone: string;
    socialLinks: Array<{ platform: string; url: string; icon: string; visible?: boolean }>;
    copyrightText: string;
  };
  homepage: {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage: string;
      ctaText: string;
      ctaLink: string;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export const defaultSettings: Settings = {
  siteName: 'Makers Corp Japan',
  logo: '',
  favicon: '',
  header: {
    navLinks: [
      { label: 'Vehicles', url: '/vehicles' },
      { label: 'Destinations', url: '/destinations' },
      { label: 'How to Buy', url: '/how-to-buy' },
      { label: 'News & Reviews', url: '/news' },
      { label: 'Request a Vehicle', url: '/request-a-vehicle' },
      { label: 'About', url: '/about' },
      { label: 'Contact', url: '/contact' }
    ],
    showSearch: true,
    contactNumber: '+81 3 5555 0198',
    whatsappNumber: '818012345678',
    tagline: 'Vehicles Sourced from Japan · Global Export'
  },
  footer: {
    logo: '',
    image: '',
    imageVisible: false,
    aboutText:
      'Makers Corp Japan is an international vehicle export marketplace connecting verified Japanese stock with global buyers. Verified condition inspections, direct port-to-port ocean freight, and transparent quotation.',
    address: 'Export Operations Hub, Minato-ku, Tokyo 105-0004, Japan',
    email: 'export@makerscorp.jp',
    phone: '+81 3 5555 0198',
    copyrightText: `© ${new Date().getFullYear()} Makers Corp Japan. All rights reserved. Registered entity & address subject to final verification.`,
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook', visible: true },
      { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', visible: true },
      { platform: 'YouTube', url: 'https://youtube.com', icon: 'youtube', visible: true }
    ]
  },
  homepage: {
    hero: {
      title: 'Find Your Next Vehicle in Japan',
      subtitle: 'Browse Japan-sourced stock. Choose your destination and request a shipping quote.',
      backgroundImage: '/images/background image.jpeg',
      ctaText: 'Search Vehicles',
      ctaLink: '/vehicles'
    }
  },
  seo: {
    metaTitle: 'Makers Corp Japan — Global Vehicle Export Marketplace',
    metaDescription:
      'Browse genuine vehicles sourced from Japan. Transparent FOB and CIF pricing, destination import checks for India, Sri Lanka and Africa, and written quotations.',
    keywords: 'Japan car export, Japanese used cars, buy cars from Japan, import JDM cars, Japan vehicle export marketplace, Makers Corp Japan'
  },
  theme: {
    primaryColor: '#EA580C',
    secondaryColor: '#0F172A',
    accentColor: '#F97316'
  }
};

const SettingsContext = createContext<{
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {}
});

export function SettingsProvider({
  children,
  initialSettings = null
}: {
  children: React.ReactNode;
  initialSettings?: Settings | null;
}) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (initialSettings) return normalizeSettingsImages({ ...defaultSettings, ...initialSettings });
    return defaultSettings;
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${apiUrl}/settings`, {
        cache: 'no-store',
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data) {
        // Only accept settings if they are for Makers Corp Japan (do not overwrite with legacy Ceylon settings)
        const isMakersCorp =
          data.data.siteName &&
          data.data.siteName.toLowerCase().includes('makers corp');

        if (isMakersCorp) {
          const merged = normalizeSettingsImages({ ...defaultSettings, ...data.data });
          setSettings(merged);
          try {
            localStorage.setItem('mcj_site_settings', JSON.stringify(merged));
          } catch {}
        }
      }
    } catch (err) {
      // Gracefully continue using defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSettings) {
      try {
        const cached = localStorage.getItem('mcj_site_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.siteName && parsed.siteName.toLowerCase().includes('makers corp')) {
            setSettings(normalizeSettingsImages(parsed));
          } else {
            localStorage.removeItem('mcj_site_settings');
          }
        }
      } catch {}
    }
    fetchSettings();
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
