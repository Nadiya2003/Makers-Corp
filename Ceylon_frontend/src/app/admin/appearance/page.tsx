'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Mail, Phone, MapPin, Share2, Upload } from 'lucide-react';

export default function AppearanceManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    footer: {
      logo: '',
      aboutText: '',
      address: '',
      email: '',
      phone: '',
      copyrightText: '',
      socialLinks: []
    }
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'FooterLogo');

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
          footer: {
            ...settings.footer,
            logo: uploadedUrl
          }
        });
        setMessage('Logo uploaded successfully! Click Save Changes to apply.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Network error during upload');
    } finally {
      setIsUploading(false);
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

  const handleSocialLinkChange = (platform: string, field: 'url' | 'visible', value: any) => {
    const existingLinks = settings.footer.socialLinks || [];
    const index = existingLinks.findIndex((link: any) => link.platform === platform);
    
    if (index >= 0) {
      const updatedLinks = [...existingLinks];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      setSettings({ ...settings, footer: { ...settings.footer, socialLinks: updatedLinks } });
    } else {
      const newLink = { platform, url: field === 'url' ? value : '', icon: platform, visible: field === 'visible' ? value : true };
      setSettings({ ...settings, footer: { ...settings.footer, socialLinks: [...existingLinks, newLink] } });
    }
  };

  const getSocialLink = (platform: string) => {
    return (settings.footer.socialLinks || []).find((link: any) => link.platform === platform) || { url: '', visible: true };
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
        setMessage('Appearance updated successfully!');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Appearance & Footer</h1>
          <p className="text-gray-500">Manage your website's contact info and footer content.</p>
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
        {/* Contact Info */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={settings.footer.phone}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.footer.email}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
              <input
                type="text"
                value={settings.footer.address}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, address: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Footer Settings */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layout className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Footer Content</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.footer.logo || ''}
                  onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, logo: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="https://example.com/logo.png"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Logo">
                  <input type="file" className="hidden" accept="image/*" onChange={handleDirectUpload} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
              {settings.footer.logo && (
                <div className="mt-3 p-3 bg-gray-950 border border-gray-800 rounded-lg flex items-center gap-4">
                  <span className="text-xs font-semibold text-gray-400">Preview:</span>
                  <img
                    src={settings.footer.logo}
                    alt="Footer Logo Preview"
                    className="h-10 w-auto object-contain bg-white/5 p-1 rounded"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Footer Text</label>
              <textarea
                value={settings.footer.aboutText}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, aboutText: e.target.value } })}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                value={settings.footer.copyrightText}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, copyrightText: e.target.value } })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Share2 className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Social Media Links</h2>
          </div>
          <div className="space-y-4">
            {['Facebook', 'Instagram', 'TikTok', 'YouTube'].map((platform) => {
              const link = getSocialLink(platform);
              return (
                <div key={platform} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="w-24 text-sm font-semibold text-gray-700">{platform}</span>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(platform, 'url', e.target.value)}
                    className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                    placeholder={`https://${platform.toLowerCase()}.com/...`}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-600">Show</span>
                    <input
                      type="checkbox"
                      checked={link.visible !== false}
                      onChange={(e) => handleSocialLinkChange(platform, 'visible', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-600"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
