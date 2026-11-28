'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Loader2, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Image as ImageIcon,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';
import { broadcastSettingsUpdated } from '@/context/SettingsContext';

type TabKey = 'hero' | 'search' | 'campaigns' | 'category' | 'latest';

export default function HomepageManagement() {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const [settings, setSettings] = useState({
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
    }
  });

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data?.homepage) {
        setSettings(prev => ({
          ...prev,
          homepage: {
            ...prev.homepage,
            ...data.data.homepage
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Generic Cloudinary image upload handler
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !uploadTarget) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('photos', e.target.files[0]);
    formData.append('category', 'Homepage');

    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const url = data.data[0].url;

        if (uploadTarget.startsWith('heroSlide-')) {
          const index = parseInt(uploadTarget.split('-')[1]);
          const updatedSlides = [...settings.homepage.heroSlides];
          updatedSlides[index].image = url;
          setSettings(prev => ({
            ...prev,
            homepage: { ...prev.homepage, heroSlides: updatedSlides }
          }));
        } else if (uploadTarget === 'spotlightImage') {
          setSettings(prev => ({
            ...prev,
            homepage: {
              ...prev.homepage,
              categoryDiscovery: {
                ...prev.homepage.categoryDiscovery,
                spotlight: {
                  ...prev.homepage.categoryDiscovery.spotlight,
                  image: url
                }
              }
            }
          }));
        } else if (uploadTarget === 'latestBanner') {
          setSettings(prev => ({
            ...prev,
            homepage: {
              ...prev.homepage,
              latestVehiclesSection: {
                ...prev.homepage.latestVehiclesSection,
                bannerImage: url
              }
            }
          }));
        }
        showNotification('success', 'Image uploaded successfully!');
      } else {
        showNotification('error', data.message || 'Upload failed');
      }
    } catch (err) {
      showNotification('error', 'Network error during upload');
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
      e.target.value = '';
    }
  };

  const triggerUpload = (targetKey: string) => {
    setUploadTarget(targetKey);
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          homepage: settings.homepage
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.data) {
          try {
            localStorage.setItem('mcj_site_settings', JSON.stringify(data.data));
          } catch {}
        }
        broadcastSettingsUpdated();
        showNotification('success', 'Homepage content updated & published live!');
      } else {
        showNotification('error', data.message || 'Failed to save changes');
      }
    } catch (err) {
      showNotification('error', 'Network error during save');
    } finally {
      setSaving(false);
    }
  };

  // Hero slide handlers
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      badge: 'JAPANESE VEHICLE EXPORT · WORLDWIDE SHIPPING',
      title: 'TITLE OF NEW SLIDE',
      subtitle: 'Description of export stock and sourcing logistics...',
      subBadge: 'Sourced Directly from Japan (Tokyo · Yokohama · Nagoya)',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
      ctaPrimary: { text: 'EXPLORE VEHICLES', link: '/vehicles' },
      ctaSecondary: { text: 'REQUEST QUOTE', link: '/request-a-vehicle' }
    };
    setSettings(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        heroSlides: [...prev.homepage.heroSlides, newSlide]
      }
    }));
  };

  const handleRemoveSlide = (idx: number) => {
    if (settings.homepage.heroSlides.length <= 1) {
      showNotification('error', 'You must keep at least 1 hero slide');
      return;
    }
    const updated = settings.homepage.heroSlides.filter((_, i) => i !== idx);
    setSettings(prev => ({
      ...prev,
      homepage: { ...prev.homepage, heroSlides: updated }
    }));
  };

  // Quick searches handlers
  const [newQuickTag, setNewQuickTag] = useState('');
  const handleAddQuickTag = () => {
    if (!newQuickTag.trim()) return;
    setSettings(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        searchConfig: {
          ...prev.homepage.searchConfig,
          quickSearches: [...(prev.homepage.searchConfig.quickSearches || []), newQuickTag.trim()]
        }
      }
    }));
    setNewQuickTag('');
  };

  const handleRemoveQuickTag = (tagIdx: number) => {
    setSettings(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        searchConfig: {
          ...prev.homepage.searchConfig,
          quickSearches: prev.homepage.searchConfig.quickSearches.filter((_, i) => i !== tagIdx)
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading Homepage CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadImage}
        accept="image/*"
        className="hidden"
      />

      {/* Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all shadow-md ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Frontpage Experience Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Homepage Content Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Synchronize Hero Slides, Compact Search, Campaign Cards, Category Spotlights, and Inventory Header directly with MongoDB.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-orange-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:shadow-orange-600/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: 'hero', label: '1. Hero Carousel', icon: Layers },
          { id: 'search', label: '2. Compact Search', icon: Compass },
          { id: 'campaigns', label: '3. Campaign Highlights (4 Cards)', icon: Sparkles },
          { id: 'category', label: '4. Land Cruiser Spotlight', icon: Sliders },
          { id: 'latest', label: '5. Latest Vehicles Header', icon: ImageIcon }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO CAROUSEL */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Hero Slides</h2>
              <p className="text-xs text-gray-500">Manage carousel slides visible on top of the homepage.</p>
            </div>
            <button
              onClick={handleAddSlide}
              className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors border border-orange-200"
            >
              <Plus size={14} /> Add Slide
            </button>
          </div>

          <div className="space-y-6">
            {settings.homepage.heroSlides.map((slide, sIdx) => (
              <div key={slide.id || sIdx} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-black text-white font-black text-xs rounded-lg flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Slide #{sIdx + 1}: {slide.title || 'Untitled'}</h3>
                  </div>
                  {settings.homepage.heroSlides.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlide(sIdx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={slide.badge}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].badge = e.target.value;
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Sub-Badge (Yard Sourcing Info)
                    </label>
                    <input
                      type="text"
                      value={slide.subBadge}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].subBadge = e.target.value;
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Main Headline (e.g. FROM JAPAN TO THE GLOBE)
                  </label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const updated = [...settings.homepage.heroSlides];
                      updated[sIdx].title = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Slide Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={slide.subtitle}
                    onChange={(e) => {
                      const updated = [...settings.homepage.heroSlides];
                      updated[sIdx].subtitle = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Background Yard Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].image = e.target.value;
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => triggerUpload(`heroSlide-${sIdx}`)}
                      disabled={isUploading}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {isUploading && uploadTarget === `heroSlide-${sIdx}` ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>Upload Image</span>
                    </button>
                  </div>
                  {slide.image && (
                    <div className="mt-3 relative w-full h-32 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Primary & Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                      Primary Button
                    </span>
                    <input
                      type="text"
                      value={slide.ctaPrimary?.text}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].ctaPrimary = { ...updated[sIdx].ctaPrimary, text: e.target.value };
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      placeholder="Button Label (e.g. EXPLORE VEHICLES)"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={slide.ctaPrimary?.link}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].ctaPrimary = { ...updated[sIdx].ctaPrimary, link: e.target.value };
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      placeholder="Button Target URL (/vehicles)"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                      Secondary Button
                    </span>
                    <input
                      type="text"
                      value={slide.ctaSecondary?.text}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].ctaSecondary = { ...updated[sIdx].ctaSecondary, text: e.target.value };
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      placeholder="Button Label (e.g. REQUEST EXPORT ENQUIRY)"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={slide.ctaSecondary?.link}
                      onChange={(e) => {
                        const updated = [...settings.homepage.heroSlides];
                        updated[sIdx].ctaSecondary = { ...updated[sIdx].ctaSecondary, link: e.target.value };
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, heroSlides: updated } }));
                      }}
                      placeholder="Button Target URL (/request-a-vehicle)"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPACT SEARCH CONFIG */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Compact Search Bar</h2>
            <p className="text-xs text-gray-500">Configure quick search filter tags and target destination markets.</p>
          </div>

          {/* Quick searches chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Quick Searches Chips (Clickable shortcut buttons below search bar)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(settings.homepage.searchConfig.quickSearches || []).map((tag, tIdx) => (
                <span 
                  key={tIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveQuickTag(tIdx)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newQuickTag}
                onChange={(e) => setNewQuickTag(e.target.value)}
                placeholder="Add new tag (e.g. Lexus LX 600, Hybrid 4x4)"
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddQuickTag}
                className="px-4 py-2 bg-black hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Destination Markets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Destination Markets List (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={(settings.homepage.searchConfig.destinationMarkets || []).join(', ')}
              onChange={(e) => {
                const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    searchConfig: {
                      ...prev.homepage.searchConfig,
                      destinationMarkets: list
                    }
                  }
                }));
              }}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Controls the options available in the "Destination Market" dropdown selector.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGN HIGHLIGHTS (4 CARDS) */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Featured Export Highlights (4 Cards)</h2>
            <p className="text-xs text-gray-500">Edit the 4 campaign route cards displayed directly underneath the search bar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.homepage.campaignHighlights.map((card, cIdx) => (
              <div key={card.id || cIdx} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                    Card #{cIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={card.badge}
                    onChange={(e) => {
                      const updated = [...settings.homepage.campaignHighlights];
                      updated[cIdx].badge = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                    }}
                    placeholder="Badge (e.g. PRIORITY ROUTE)"
                    className="px-2 py-1 text-right text-[10px] font-bold uppercase tracking-wider bg-transparent border-b border-gray-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Market Header (e.g. INDIA MARKET)
                  </label>
                  <input
                    type="text"
                    value={card.market}
                    onChange={(e) => {
                      const updated = [...settings.homepage.campaignHighlights];
                      updated[cIdx].market = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...settings.homepage.campaignHighlights];
                      updated[cIdx].title = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => {
                      const updated = [...settings.homepage.campaignHighlights];
                      updated[cIdx].description = e.target.value;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Link Label
                    </label>
                    <input
                      type="text"
                      value={card.linkText}
                      onChange={(e) => {
                        const updated = [...settings.homepage.campaignHighlights];
                        updated[cIdx].linkText = e.target.value;
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Target URL
                    </label>
                    <input
                      type="text"
                      value={card.linkUrl}
                      onChange={(e) => {
                        const updated = [...settings.homepage.campaignHighlights];
                        updated[cIdx].linkUrl = e.target.value;
                        setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={Boolean(card.isExternal)}
                    onChange={(e) => {
                      const updated = [...settings.homepage.campaignHighlights];
                      updated[cIdx].isExternal = e.target.checked;
                      setSettings(prev => ({ ...prev, homepage: { ...prev.homepage, campaignHighlights: updated } }));
                    }}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-gray-600">Open in external tab (Makers Ceylon)</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY DISCOVERY & LAND CRUISER SPOTLIGHT */}
      {activeTab === 'category' && (
        <div className="space-y-6">
          {/* Division Headers */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Category Switcher Divisions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Division 01: Vehicles</span>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={settings.homepage.categoryDiscovery.passengerTitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      homepage: {
                        ...prev.homepage,
                        categoryDiscovery: { ...prev.homepage.categoryDiscovery, passengerTitle: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={settings.homepage.categoryDiscovery.passengerSubtitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      homepage: {
                        ...prev.homepage,
                        categoryDiscovery: { ...prev.homepage.categoryDiscovery, passengerSubtitle: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">Division 02: Commercial Vehicles</span>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={settings.homepage.categoryDiscovery.commercialTitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      homepage: {
                        ...prev.homepage,
                        categoryDiscovery: { ...prev.homepage.categoryDiscovery, commercialTitle: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={settings.homepage.categoryDiscovery.commercialSubtitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      homepage: {
                        ...prev.homepage,
                        categoryDiscovery: { ...prev.homepage.categoryDiscovery, commercialSubtitle: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Land Cruiser Spotlight */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Featured Family: Land Cruiser Spotlight</h3>
                <p className="text-xs text-gray-500">Controls the Land Cruiser banner with 300, 250, 70, 200 series generation tags.</p>
              </div>
              <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                High Priority Showcase
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Top Tag</label>
                <input
                  type="text"
                  value={settings.homepage.categoryDiscovery.spotlight.tag}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    homepage: {
                      ...prev.homepage,
                      categoryDiscovery: {
                        ...prev.homepage.categoryDiscovery,
                        spotlight: { ...prev.homepage.categoryDiscovery.spotlight, tag: e.target.value }
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Plant / Manufacturer Info</label>
                <input
                  type="text"
                  value={settings.homepage.categoryDiscovery.spotlight.manufacturer}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    homepage: {
                      ...prev.homepage,
                      categoryDiscovery: {
                        ...prev.homepage.categoryDiscovery,
                        spotlight: { ...prev.homepage.categoryDiscovery.spotlight, manufacturer: e.target.value }
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Spotlight Title</label>
              <input
                type="text"
                value={settings.homepage.categoryDiscovery.spotlight.title}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    categoryDiscovery: {
                      ...prev.homepage.categoryDiscovery,
                      spotlight: { ...prev.homepage.categoryDiscovery.spotlight, title: e.target.value }
                    }
                  }
                }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Spotlight Narrative</label>
              <textarea
                rows={3}
                value={settings.homepage.categoryDiscovery.spotlight.description}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    categoryDiscovery: {
                      ...prev.homepage.categoryDiscovery,
                      spotlight: { ...prev.homepage.categoryDiscovery.spotlight, description: e.target.value }
                    }
                  }
                }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium leading-relaxed"
              />
            </div>

            {/* Spotlight Image */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Spotlight Image URL (Land Cruiser 300 / Desert / Yard)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.homepage.categoryDiscovery.spotlight.image}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    homepage: {
                      ...prev.homepage,
                      categoryDiscovery: {
                        ...prev.homepage.categoryDiscovery,
                        spotlight: { ...prev.homepage.categoryDiscovery.spotlight, image: e.target.value }
                      }
                    }
                  }))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => triggerUpload('spotlightImage')}
                  disabled={isUploading}
                  className="px-4 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {isUploading && uploadTarget === 'spotlightImage' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>Upload</span>
                </button>
              </div>
              {settings.homepage.categoryDiscovery.spotlight.image && (
                <div className="mt-3 relative w-full h-36 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  <img 
                    src={settings.homepage.categoryDiscovery.spotlight.image} 
                    alt="Spotlight preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LATEST VEHICLES HEADER */}
      {activeTab === 'latest' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Latest Vehicles in Japan Section</h2>
            <p className="text-xs text-gray-500">Edit the top header banner and subtitle above the 4 live inventory cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Section Tag
              </label>
              <input
                type="text"
                value={settings.homepage.latestVehiclesSection.tag}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    latestVehiclesSection: { ...prev.homepage.latestVehiclesSection, tag: e.target.value }
                  }
                }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Main Heading
              </label>
              <input
                type="text"
                value={settings.homepage.latestVehiclesSection.title}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    latestVehiclesSection: { ...prev.homepage.latestVehiclesSection, title: e.target.value }
                  }
                }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Subtitle (e.g. Physical export inventory inspected and ready for container or Ro-Ro booking)
            </label>
            <input
              type="text"
              value={settings.homepage.latestVehiclesSection.subtitle}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                homepage: {
                  ...prev.homepage,
                  latestVehiclesSection: { ...prev.homepage.latestVehiclesSection, subtitle: e.target.value }
                }
              }))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Fuji Banner Image */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mount Fuji / Tokyo Port Banner Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.homepage.latestVehiclesSection.bannerImage}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  homepage: {
                    ...prev.homepage,
                    latestVehiclesSection: { ...prev.homepage.latestVehiclesSection, bannerImage: e.target.value }
                  }
                }))}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => triggerUpload('latestBanner')}
                disabled={isUploading}
                className="px-4 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isUploading && uploadTarget === 'latestBanner' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                <span>Upload</span>
              </button>
            </div>
            {settings.homepage.latestVehiclesSection.bannerImage && (
              <div className="mt-3 relative w-full h-32 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                <img 
                  src={settings.homepage.latestVehiclesSection.bannerImage} 
                  alt="Banner preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
