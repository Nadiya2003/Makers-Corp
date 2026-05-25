'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  logo: string;
  favicon: string;
  header: {
    navLinks: Array<{ label: string, url: string }>;
    showSearch: boolean;
    contactNumber: string;
  };
  footer: {
    logo?: string;
    aboutText: string;
    address: string;
    email: string;
    phone: string;
    socialLinks: Array<{ platform: string, url: string, icon: string, visible?: boolean }>;
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
    about: {
      title: string;
      description: string;
      image: string;
      stats?: Array<{ value: string; label: string }>;
    };
    services?: Array<{ title: string; description: string; icon: string }>;
    whyChooseUs?: {
      subtitle: string;
      title: string;
      reasons: Array<{ icon: string; title: string; desc: string }>;
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
  aboutPage?: {
    title: string;
    content: string;
    image: string;
    mission: string;
    vision: string;
    directors: Array<{
      name: string;
      role: string;
      bio: string;
      image: string;
    }>;
  };
  contactPage?: {
    title: string;
    description: string;
    workingHours: string;
    googleMapUrl: string;
  };
  popupAd?: {
    enabled: boolean;
    title: string;
    description: string;
    image: string;
    badgeText: string;
    buttonText: string;
    buttonLink: string;
    dismissText: string;
  };
}

const SettingsContext = createContext<{
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
