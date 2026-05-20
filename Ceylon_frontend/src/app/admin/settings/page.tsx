'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Shield, Palette, Upload } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    siteName: '',
    logo: '',
    favicon: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    },
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#fbbf24'
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'Settings');

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
        setSettings({ ...settings, [field]: uploadedUrl });
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
        setMessage('Settings saved successfully!');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Settings</h1>
          <p className="text-gray-500">Configure global site settings and SEO.</p>
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

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">General Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="https://example.com/logo.png"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDirectUpload(e, 'logo')} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Settings */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">SEO & Metadata</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma separated)</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, keywords: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Theme & Colors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.theme.primaryColor}
                  onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={settings.theme.primaryColor}
                  onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                  className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.theme.accentColor}
                  onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={settings.theme.accentColor}
                  onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                  className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
