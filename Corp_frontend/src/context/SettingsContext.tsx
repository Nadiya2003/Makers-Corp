'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { normalizeSettingsImages } from '@/lib/imageUtils';

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  subBadge: string;
  image: string;
  ctaPrimary?: { text: string; link: string };
  ctaSecondary?: { text: string; link: string };
}

export interface CampaignHighlight {
  id: string;
  market: string;
  badge: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  isExternal?: boolean;
}

export interface AboutPageSettings {
  title: string;
  tagline?: string;
  content: string;
  image: string;
  mission: string;
  vision: string;
  directorsBg?: string;
  galleryImages?: string[];
  directors?: Array<{ name: string; role: string; bio: string; image: string }>;
}

export interface ContactPageSettings {
  title: string;
  description: string;
  workingHours: string;
  phone: string;
  email: string;
  address: string;
  googleMapUrl: string;
}

export interface Settings {
  siteName: string;
  tagline?: string;
  logo: string;
  favicon: string;
  header: {
    navLinks: Array<{ label: string; url: string }>;
    showSearch: boolean;
    contactNumber: string;
    whatsappNumber?: string;
    tagline?: string;
    announcementTicker?: Array<{ text: string; link: string; external?: boolean }>;
  };
  footer: {
    logo?: string;
    image?: string;
    imageVisible?: boolean;
    aboutText: string;
    address: string;
    email: string;
    phone: string;
    workingHours?: string;
    socialLinks: Array<{ platform: string; url: string; icon: string; visible?: boolean }>;
    copyrightText: string;
  };
  homepage: {
    heroSlides?: HeroSlide[];
    searchConfig?: {
      quickSearches: string[];
      destinationMarkets: string[];
    };
    campaignHighlights?: CampaignHighlight[];
    categoryDiscovery?: {
      passengerTitle: string;
      passengerSubtitle: string;
      passengerCountLabel: string;
      commercialTitle: string;
      commercialSubtitle: string;
      commercialCountLabel: string;
      spotlight: {
        tag: string;
        manufacturer: string;
        title: string;
        description: string;
        image: string;
        generations: Array<{ code: string; name: string; link: string }>;
        ctaPrimaryText?: string;
        ctaPrimaryLink?: string;
        ctaSecondaryText?: string;
        ctaSecondaryLink?: string;
      };
    };
    latestVehiclesSection?: {
      tag: string;
      title: string;
      subtitle: string;
      bannerImage: string;
      viewAllText: string;
    };
    destinationsList?: any[];
    hero?: {
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
  aboutPage?: AboutPageSettings;
  contactPage?: ContactPageSettings;
}

function deepMergeSettings(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const sVal = source[key];
    const tVal = target ? target[key] : undefined;

    if (sVal === undefined || sVal === null) {
      continue;
    }

    if (Array.isArray(sVal)) {
      output[key] = sVal.length > 0 ? sVal : (tVal || []);
    } else if (typeof sVal === 'object') {
      output[key] = deepMergeSettings(tVal || {}, sVal);
    } else {
      output[key] = sVal;
    }
  }

  return output;
}

export function broadcastSettingsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mcj_settings_updated'));
    try {
      localStorage.setItem('mcj_settings_version', Date.now().toString());
    } catch {}
  }
}

export const defaultSettings: Settings = {
  siteName: 'Makers Corp Japan',
  tagline: 'Vehicles Sourced From Japan',
  logo: '/images/makers-logo.png',
  favicon: '',
  header: {
    navLinks: [
      { label: 'HOME', url: '/' },
      { label: 'INVENTORY', url: '/vehicles' },
      { label: 'DESTINATIONS', url: '/destinations' },
      { label: 'HOW TO BUY', url: '/how-to-buy' },
      { label: 'NEWS & REVIEWS', url: '/news' },
      { label: 'ABOUT', url: '/about' },
      { label: 'CONTACT', url: '/contact' }
    ],
    showSearch: true,
    contactNumber: '+81 3-5555-0199',
    whatsappNumber: '+81 90-1234-5678',
    tagline: 'Vehicles Sourced From Japan · Global Export',
    announcementTicker: [
      { text: 'Enquiries', link: '/contact', external: false },
      { text: 'Sri Lanka Customers → Makers Ceylon ↗', link: 'https://makersceylon.com', external: true },
      { text: 'Browse Vehicles from Japan', link: '/vehicles', external: false },
      { text: 'India Export Enquiries', link: '/destinations/asia/india', external: false },
      { text: 'Direct Tokyo Operations Desk', link: '/contact', external: false },
      { text: '100% Genuine Physical Inventory', link: '/vehicles', external: false }
    ]
  },
  footer: {
    logo: '/images/makers-logo.png',
    image: '',
    imageVisible: false,
    aboutText:
      'Premier Japanese automobile exporter specializing in verified physical yard inventory, professional JEVIC/JAAI compliance audits, and worldwide container & Ro-Ro vessel shipping.',
    address: 'Makers Building, 4-12-8 Ginza, Chuo-ku, Tokyo 104-0061, Japan',
    email: 'japan@makers-corp.com',
    phone: '+81 3-5555-0199',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)',
    copyrightText: `© ${new Date().getFullYear()} MAKERS CORP JAPAN. All rights reserved. Registered Export Company No. 0100-01-192837.`,
    socialLinks: [
      { platform: 'WhatsApp', url: 'https://wa.me/819012345678', icon: 'MessageCircle', visible: true },
      { platform: 'Facebook', url: 'https://facebook.com/makerscorpjapan', icon: 'Facebook', visible: true },
      { platform: 'Instagram', url: 'https://instagram.com/makerscorpjapan', icon: 'Instagram', visible: true }
    ]
  },
  homepage: {
    heroSlides: [
      {
        id: 'slide-1',
        badge: 'JAPANESE VEHICLE EXPORT · WORLDWIDE SHIPPING',
        title: 'FROM JAPAN TO THE GLOBE',
        subtitle: 'Discover exceptional Japanese vehicles sourced directly from Japan and exported to international markets. From premium SUVs and luxury 4x4s to iconic Japanese automobiles, we connect global buyers with quality vehicles from Japan through tailored sourcing and export solutions.',
        subBadge: 'Sourced Directly from Japan (Tokyo · Yokohama · Nagoya · Kobe)',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
        ctaPrimary: {
          text: 'EXPLORE VEHICLES',
          link: '/vehicles'
        },
        ctaSecondary: {
          text: 'REQUEST EXPORT ENQUIRY',
          link: '/request-a-vehicle'
        }
      }
    ],
    searchConfig: {
      quickSearches: ['Toyota SUVs', 'India Reviewed', 'Sri Lanka Stock'],
      destinationMarkets: ['Global', 'India', 'Sri Lanka', 'Pakistan', 'United Kingdom', 'Kenya', 'Tanzania', 'Uganda', 'Cyprus', 'New Zealand', 'Australia', 'Guyana', 'Jamaica']
    },
    campaignHighlights: [
      {
        id: 'india-market',
        market: 'INDIA MARKET',
        badge: 'PRIORITY ROUTE',
        title: 'Explore Japan-Sourced Vehicles',
        description: 'Direct homologation checks & JNPT / Chennai shipping for luxury SUVs & sports stock.',
        linkText: 'Explore India',
        linkUrl: '/destinations/asia/india',
        isExternal: false
      },
      {
        id: 'sri-lanka-market',
        market: 'SRI LANKA MARKET',
        badge: 'MAKERS CEYLON',
        title: 'Explore Vehicles & Local Support',
        description: 'Official vehicle export partner MAKERS CEYLON. Bank LC coordination & Colombo port delivery.',
        linkText: 'Visit MAKERS CEYLON',
        linkUrl: 'https://makersceylon.com/',
        isExternal: true
      },
      {
        id: 'export-guide',
        market: 'Export Process',
        badge: '',
        title: 'A Step-by-Step Export Guide',
        description: 'Clear breakdown of JEVIC audits, FOB/CIF terms, ocean freight tracking, and delivery.',
        linkText: 'Read the Guide',
        linkUrl: '/how-to-buy',
        isExternal: false
      },
      {
        id: 'made-to-order',
        market: 'MADE-TO-ORDER',
        badge: '',
        title: "Tell Us What You're Looking For",
        description: "Can't find your specific model or trim? We source directly from Japanese dealer & auction networks.",
        linkText: 'Request a Vehicle',
        linkUrl: '/request-a-vehicle',
        isExternal: false
      }
    ],
    categoryDiscovery: {
      passengerTitle: 'VEHICLES',
      passengerSubtitle: 'Passenger Cars · Luxury SUVs · Executive MPVs · Sports · Hybrids',
      passengerCountLabel: '8 CATEGORIES',
      commercialTitle: 'COMMERCIAL VEHICLES',
      commercialSubtitle: 'Isuzu, Hino, Fuso, UD Trucks · Buses · Cargo Vans · Heavy Duty',
      commercialCountLabel: '12 CATEGORIES',
      spotlight: {
        tag: 'FEATURED FAMILY · 01 | JAPAN DIRECT 4X4',
        manufacturer: 'TOYOTA MOTOR CORPORATION · TAHARA & YOSHIWARA PLANTS',
        title: 'TOYOTA LAND CRUISER',
        description: 'Explore the legendary Land Cruiser family. Discover iconic Japanese 4x4 vehicles engineered for exceptional performance, durability, and off-road capability. Covering all major generations from the modern 300 & 250 series to the heavy-duty 70, 200, and Prado lines.',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        generations: [
          { code: '300 Series', name: 'LC GEN 300 Series', link: '/vehicles?model=Land%20Cruiser%20300' },
          { code: '250 Series', name: 'LC GEN 250 Series', link: '/vehicles?model=Land%20Cruiser%20250' },
          { code: '70 Series', name: 'LC GEN 70 Series', link: '/vehicles?model=Land%20Cruiser%2070' },
          { code: '200 Series', name: 'LC GEN 200 Series', link: '/vehicles?model=Land%20Cruiser%20200' },
          { code: 'Prado 150', name: 'LC GEN Prado 150', link: '/vehicles?model=Prado%20150' },
          { code: 'Prado 120', name: 'LC GEN Prado 120', link: '/vehicles?model=Prado%20120' }
        ],
        ctaPrimaryText: 'EXPLORE LAND CRUISER SERIES',
        ctaPrimaryLink: '/vehicles?make=Toyota&model=Land+Cruiser',
        ctaSecondaryText: 'VIEW IN-STOCK (FOB JAPAN)',
        ctaSecondaryLink: '/vehicles'
      }
    },
    latestVehiclesSection: {
      tag: 'LIVE INVENTORY FEED · TOKYO & YOKOHAMA YARDS',
      title: 'Latest Vehicles in Japan',
      subtitle: 'Physical export inventory inspected and ready for container or Ro-Ro booking',
      bannerImage: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1920&q=80',
      viewAllText: 'View Full Inventory'
    }
  },
  seo: {
    metaTitle: 'Makers Corp Japan | Verified Physical Export Inventory',
    metaDescription:
      'Direct Japanese vehicle exporter. Verified physical inventory in Tokyo & Yokohama yards, certified JEVIC inspections, and global shipping.',
    keywords: 'Japanese vehicle export, Tokyo cars, FOB Japan, JEVIC certified, Land Cruiser export, Japan auto auction'
  },
  theme: {
    primaryColor: '#ff6a00',
    secondaryColor: '#111111',
    accentColor: '#ff6a00'
  },
  aboutPage: {
    title: 'About Makers Corp Japan',
    tagline: 'Precision Japanese Vehicle Export Operations',
    content: 'Makers Corp Japan was founded with a single mission: to provide verified, premium Japanese-market vehicles directly to international buyers and dealerships worldwide. We believe that sourcing and exporting a vehicle from Japan should be transparent, cost-effective, and completely reliable.',
    image: 'https://images.unsplash.com/photo-1562426509-5044a121aa49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    mission: 'To provide a seamless, transparent, and highly reliable vehicle export service connecting verified Tokyo, Yokohama, Kobe, and Nagoya inventory with international buyers worldwide.',
    vision: 'To be the most trusted and preferred Japanese automotive export partner globally, known for our inspection integrity and customer-centric approach.',
    directorsBg: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop'
    ],
    directors: []
  },
  contactPage: {
    title: 'Contact Us',
    description: "We'd love to hear from you. Get in touch with our Tokyo operations desk today.",
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)',
    phone: '+81 3-5555-0199',
    email: 'japan@makers-corp.com',
    address: 'Tokyo Export Hub, Minato-ku, Tokyo 105-0004, Japan',
    googleMapUrl: ''
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
    if (initialSettings) return normalizeSettingsImages(deepMergeSettings(defaultSettings, initialSettings));
    return defaultSettings;
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${apiUrl}/settings`, {
        cache: 'no-store',
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data) {
        const isMakersCorp =
          !data.data.siteName ||
          data.data.siteName.toLowerCase().includes('makers corp');

        if (isMakersCorp) {
          const merged = normalizeSettingsImages(deepMergeSettings(defaultSettings, data.data));
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
          if (parsed && (!parsed.siteName || parsed.siteName.toLowerCase().includes('makers corp'))) {
            setSettings(normalizeSettingsImages(deepMergeSettings(defaultSettings, parsed)));
          } else {
            localStorage.removeItem('mcj_site_settings');
          }
        }
      } catch {}
    }
    fetchSettings();

    // Listen for custom broadcast event across admin and frontend
    const handleBroadcast = () => {
      fetchSettings();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mcj_settings_version' || e.key === 'mcj_site_settings') {
        fetchSettings();
      }
    };

    window.addEventListener('mcj_settings_updated', handleBroadcast);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('mcj_settings_updated', handleBroadcast);
      window.removeEventListener('storage', handleStorage);
    };
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
