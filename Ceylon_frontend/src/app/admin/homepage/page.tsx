'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Info, Upload } from 'lucide-react';

export default function HomepageManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    homepage: {
      hero: {
        title: '',
        subtitle: '',
        backgroundImage: '',
        ctaText: '',
        ctaLink: ''
      },
      about: {
        title: '',
        description: '',
        image: ''
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

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const handleSave = async () => {
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
  };

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
          </div>
        </section>
      </div>
    </div>
  );
}
