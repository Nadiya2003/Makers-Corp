'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Loader2, Layout, Info, Upload, Plus, Trash2, Star } from 'lucide-react';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';

export default function HomepageManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const savedRef = useRef<string>('');
  const [settings, setSettings] = useState({
    homepage: {
      hero: {
        title: '',
        subtitle: '',
        backgroundImage: '',
        ctaText: '',
        ctaLink: '',
        noticeTitle: 'LIMITED AUCTION SLOTS WEEKLY!',
        noticeSubtitle: 'Secure your vehicle before the next auction cycle.'
      },
      about: {
        title: '',
        description: '',
        image: '',
        stats: [
          { value: '10+', label: 'Years Experience' },
          { value: '500+', label: 'Vehicles Imported' }
        ] as { value: string; label: string }[]
      },
      whyChooseUs: {
        subtitle: 'The Ceylon Advantage',
        title: 'Why Choose Us',
        reasons: [] as { icon: string; title: string; desc: string }[]
      },
      howItWorks: {
        subtitle: 'Simple Process',
        title: 'How It Works',
        description: "Importing a vehicle doesn't have to be complicated. We've streamlined the process into 4 simple steps.",
        backgroundImage: '',
        steps: [] as { icon: string; title: string; description: string }[]
      }
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: 'hero' | 'about', field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'Homepage');

    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      });
      
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const uploadedUrl = data.data[0].url;
        setSettings({
          ...settings,
          homepage: {
            ...settings.homepage,
            [section]: {
              ...(settings.homepage as any)[section],
              [field]: uploadedUrl
            }
          }
        });
        setMessage('Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleHowItWorksBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'Homepage');
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, backgroundImage: data.data[0].url } } }));
        setMessage('Background image uploaded! Click Save Changes to apply.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch {
      setMessage('Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
      const data = await res.json();
      if (data.success) {
        const fetched = data.data;

        // If no stats saved in DB yet, pre-populate with the live defaults
        if (
          !fetched?.homepage?.about?.stats ||
          fetched.homepage.about.stats.length === 0
        ) {
          if (fetched?.homepage?.about) {
            fetched.homepage.about.stats = [
              { value: '10+', label: 'Years Experience' },
              { value: '500+', label: 'Vehicles Imported' },
            ];
          }
        }

        // Pre-populate Why Choose Us if empty
        if (!fetched?.homepage?.whyChooseUs || !fetched.homepage.whyChooseUs.reasons || fetched.homepage.whyChooseUs.reasons.length === 0) {
          if (!fetched.homepage) fetched.homepage = {};
          fetched.homepage.whyChooseUs = {
            subtitle: 'The Ceylon Advantage',
            title: 'Why Choose Us',
            reasons: [
              { icon: 'DollarSign', title: 'Competitive Pricing', desc: 'Direct access means no hidden markups.' },
              { icon: 'Search', title: 'Transparent Process', desc: 'Clear breakdown of all costs and fees.' },
              { icon: 'Zap', title: 'Fast Documentation', desc: 'Quick processing of all legal paperwork.' },
              { icon: 'Globe', title: 'Strong Japan Network', desc: 'Partnerships with top auction houses.' },
              { icon: 'HeadphonesIcon', title: 'After-Sales Support', desc: 'Dedicated support even after delivery.' },
            ]
          };
        }

        // Pre-populate How It Works if empty
        if (!fetched?.homepage?.howItWorks || !fetched.homepage.howItWorks.steps || fetched.homepage.howItWorks.steps.length === 0) {
          if (!fetched.homepage) fetched.homepage = {};
          fetched.homepage.howItWorks = {
            subtitle: fetched?.homepage?.howItWorks?.subtitle || 'Simple Process',
            title: fetched?.homepage?.howItWorks?.title || 'How It Works',
            description: fetched?.homepage?.howItWorks?.description || "Importing a vehicle doesn't have to be complicated. We've streamlined the process into 4 simple steps.",
            backgroundImage: fetched?.homepage?.howItWorks?.backgroundImage || '',
            steps: [
              { icon: 'Search', title: 'Choose Vehicle', description: 'Select from our inventory or live auctions.' },
              { icon: 'CreditCard', title: 'Confirm & Payment', description: 'Secure your vehicle with an initial deposit.' },
              { icon: 'Ship', title: 'Import & Shipping', description: 'We handle shipping and customs clearance.' },
              { icon: 'MapPin', title: 'Delivery in Sri Lanka', description: 'Receive your vehicle right at your doorstep.' },
            ]
          };
        }

        setSettings(fetched);
        savedRef.current = JSON.stringify(fetched);
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Track dirty state whenever settings change
  useEffect(() => {
    if (savedRef.current) {
      setIsDirty(JSON.stringify(settings) !== savedRef.current);
    }
  }, [settings]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage('');
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        savedRef.current = JSON.stringify(settings);
        setIsDirty(false);
        setMessage('Homepage updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving settings: ' + data.message);
      }
    } catch (err) {
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  useUnsavedChanges(isDirty, handleSave);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Homepage Management</h1>
          <p className="text-gray-500">Update content for your main landing page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">

        {/* Hero Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layout className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.homepage.hero.title}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, title: e.target.value } } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
              <textarea
                value={settings.homepage.hero.subtitle}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, subtitle: e.target.value } } })}
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Title (Floating Badge)</label>
                <input
                  type="text"
                  value={settings.homepage.hero.noticeTitle || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, noticeTitle: e.target.value } } })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Subtitle</label>
                <input
                  type="text"
                  value={settings.homepage.hero.noticeSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, noticeSubtitle: e.target.value } } })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={settings.homepage.hero.ctaText}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, ctaText: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Link</label>
                <input
                  type="text"
                  value={settings.homepage.hero.ctaLink}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, ctaLink: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.homepage.hero.backgroundImage}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, hero: { ...settings.homepage.hero, backgroundImage: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="https://example.com/hero-bg.jpg"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDirectUpload(e, 'hero', 'backgroundImage')} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Info className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">About Section</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.homepage.about.title}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, title: e.target.value } } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description Content</label>
              <textarea
                value={settings.homepage.about.description}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, description: e.target.value } } })}
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.homepage.about.image}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, image: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDirectUpload(e, 'about', 'image')} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
            </div>

            {/* Stats Editor */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Stat Cards</label>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    homepage: {
                      ...settings.homepage,
                      about: {
                        ...settings.homepage.about,
                        stats: [...(settings.homepage.about.stats || []), { value: '', label: '' }]
                      }
                    }
                  })}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all border border-orange-200"
                >
                  <Plus size={14} /> Add Stat
                </button>
              </div>
              <div className="space-y-3">
                {(settings.homepage.about.stats || []).map((stat: { value: string; label: string }, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...(settings.homepage.about.stats || [])];
                          newStats[idx] = { ...newStats[idx], value: e.target.value };
                          setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, stats: newStats } } });
                        }}
                        placeholder="e.g. 10+"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...(settings.homepage.about.stats || [])];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, stats: newStats } } });
                        }}
                        placeholder="e.g. Years Experience"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = (settings.homepage.about.stats || []).filter((_: any, i: number) => i !== idx);
                        setSettings({ ...settings, homepage: { ...settings.homepage, about: { ...settings.homepage.about, stats: newStats } } });
                      }}
                      className="mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(settings.homepage.about.stats || []).length === 0 && (
                  <p className="text-xs text-gray-400 font-medium text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No stat cards yet. Click "Add Stat" to create one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Why Choose Us Section</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={settings.homepage.whyChooseUs?.subtitle || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, subtitle: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. The Ceylon Advantage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={settings.homepage.whyChooseUs?.title || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, title: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. Why Choose Us"
                />
              </div>
            </div>

            {/* Reasons Editor */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Reason Cards</label>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    homepage: {
                      ...settings.homepage,
                      whyChooseUs: {
                        ...settings.homepage.whyChooseUs,
                        reasons: [...(settings.homepage.whyChooseUs?.reasons || []), { icon: 'CheckCircle', title: '', desc: '' }]
                      }
                    }
                  })}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all border border-orange-200"
                >
                  <Plus size={14} /> Add Reason
                </button>
              </div>
              <div className="space-y-3">
                {(settings.homepage.whyChooseUs?.reasons || []).map((reason: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="w-32">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Icon</label>
                      <select
                        value={reason.icon}
                        onChange={(e) => {
                          const newReasons = [...(settings.homepage.whyChooseUs?.reasons || [])];
                          newReasons[idx] = { ...newReasons[idx], icon: e.target.value };
                          setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, reasons: newReasons } } });
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      >
                        <option value="DollarSign">DollarSign</option>
                        <option value="Search">Search</option>
                        <option value="Zap">Zap</option>
                        <option value="Globe">Globe</option>
                        <option value="HeadphonesIcon">Headphones</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="Star">Star</option>
                        <option value="Shield">Shield</option>
                        <option value="Truck">Truck</option>
                        <option value="ThumbsUp">ThumbsUp</option>
                      </select>
                    </div>
                    <div className="flex-[1]">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Title</label>
                      <input
                        type="text"
                        value={reason.title}
                        onChange={(e) => {
                          const newReasons = [...(settings.homepage.whyChooseUs?.reasons || [])];
                          newReasons[idx] = { ...newReasons[idx], title: e.target.value };
                          setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, reasons: newReasons } } });
                        }}
                        placeholder="Title..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all mb-2"
                      />
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                      <textarea
                        value={reason.desc}
                        onChange={(e) => {
                          const newReasons = [...(settings.homepage.whyChooseUs?.reasons || [])];
                          newReasons[idx] = { ...newReasons[idx], desc: e.target.value };
                          setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, reasons: newReasons } } });
                        }}
                        rows={2}
                        placeholder="Description..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newReasons = (settings.homepage.whyChooseUs?.reasons || []).filter((_: any, i: number) => i !== idx);
                        setSettings({ ...settings, homepage: { ...settings.homepage, whyChooseUs: { ...settings.homepage.whyChooseUs, reasons: newReasons } } });
                      }}
                      className="mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(settings.homepage.whyChooseUs?.reasons || []).length === 0 && (
                  <p className="text-xs text-gray-400 font-medium text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No reason cards yet. Click "Add Reason" to create one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layout className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">How It Works Section</h2>
          </div>

          <div className="space-y-6">
            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={settings.homepage.howItWorks?.subtitle || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, howItWorks: { ...settings.homepage.howItWorks, subtitle: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. Simple Process"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={settings.homepage.howItWorks?.title || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, howItWorks: { ...settings.homepage.howItWorks, title: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. How It Works"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
              <textarea
                value={settings.homepage.howItWorks?.description || ''}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, howItWorks: { ...settings.homepage.howItWorks, description: e.target.value } } })}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                placeholder="Brief description of the process..."
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.homepage.howItWorks?.backgroundImage || ''}
                  onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, howItWorks: { ...settings.homepage.howItWorks, backgroundImage: e.target.value } } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="https://example.com/bg.jpg"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                  <input type="file" className="hidden" accept="image/*" onChange={handleHowItWorksBgUpload} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
              {settings.homepage.howItWorks?.backgroundImage && (
                <div className="mt-3 p-3 bg-gray-950 border border-gray-800 rounded-lg">
                  <span className="text-xs font-semibold text-gray-400 block mb-2">Preview:</span>
                  <img src={settings.homepage.howItWorks.backgroundImage} alt="BG Preview" className="h-20 w-full object-cover rounded opacity-60" />
                </div>
              )}
            </div>

            {/* Steps Editor */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Process Steps</label>
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, steps: [...(s.homepage.howItWorks?.steps || []), { icon: 'Search', title: '', description: '' }] } } }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all border border-orange-200"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>
              <div className="space-y-3">
                {(settings.homepage.howItWorks?.steps || []).map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="w-32">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Icon</label>
                      <select
                        value={step.icon}
                        onChange={(e) => {
                          const newSteps = [...(settings.homepage.howItWorks?.steps || [])];
                          newSteps[idx] = { ...newSteps[idx], icon: e.target.value };
                          setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, steps: newSteps } } }));
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      >
                        <option value="Search">Search</option>
                        <option value="CreditCard">CreditCard</option>
                        <option value="Ship">Ship</option>
                        <option value="MapPin">MapPin</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="Star">Star</option>
                        <option value="Truck">Truck</option>
                        <option value="Globe">Globe</option>
                        <option value="Zap">Zap</option>
                        <option value="Phone">Phone</option>
                        <option value="DollarSign">DollarSign</option>
                      </select>
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Step Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...(settings.homepage.howItWorks?.steps || [])];
                          newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                          setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, steps: newSteps } } }));
                        }}
                        placeholder="e.g. Choose Vehicle"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all mb-2"
                      />
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Step Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...(settings.homepage.howItWorks?.steps || [])];
                          newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                          setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, steps: newSteps } } }));
                        }}
                        rows={2}
                        placeholder="e.g. Select from our inventory or live auctions."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSteps = (settings.homepage.howItWorks?.steps || []).filter((_: any, i: number) => i !== idx);
                        setSettings(s => ({ ...s, homepage: { ...s.homepage, howItWorks: { ...s.homepage.howItWorks, steps: newSteps } } }));
                      }}
                      className="mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(settings.homepage.howItWorks?.steps || []).length === 0 && (
                  <p className="text-xs text-gray-400 font-medium text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No steps yet. Click "Add Step" to create one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
