'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Star, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PopupAdManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [settings, setSettings] = useState({
    popupAd: {
      enabled: false,
      title: 'Special Offer!',
      description: '',
      image: '',
      badgeText: 'New Feature',
      buttonText: 'Learn More',
      buttonLink: '/',
      dismissText: 'Maybe Later'
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
      const data = await res.json();
      if (data.success && data.data && data.data.popupAd) {
        setSettings({ popupAd: data.data.popupAd });
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'PopupAd');

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
        setSettings({
          popupAd: {
            ...settings.popupAd,
            [field]: data.data[0].url
          }
        });
        showStatus('success', 'Image uploaded successfully!');
      } else {
        showStatus('error', 'Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      showStatus('error', 'Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // We only send the popupAd object to update just this part of the settings
        body: JSON.stringify({ popupAd: settings.popupAd }),
      });

      const data = await res.json();
      if (data.success) {
        showStatus('success', 'Popup Ad settings updated successfully!');
      } else {
        showStatus('error', 'Error saving settings: ' + data.message);
      }
    } catch (err) {
      showStatus('error', 'An error occurred while saving.');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Startup Popup Ad</h1>
          <p className="text-gray-500">Configure the promotional popup that appears when visitors land on your site.</p>
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

      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <AlertCircle size={24} />}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="text-orange-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Popup Ad Configuration</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.popupAd?.enabled || false}
                onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, enabled: e.target.checked } })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Enable Popup Ad</span>
            </label>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Popup Title</label>
                <input
                  type="text"
                  value={settings.popupAd?.title || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, title: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. Special Offer!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={settings.popupAd?.badgeText || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, badgeText: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="e.g. New Feature"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popup Description</label>
              <textarea
                value={settings.popupAd?.description || ''}
                onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, description: e.target.value } })}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                placeholder="Description for the popup..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popup Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.popupAd?.image || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, image: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  placeholder="https://example.com/popup-image.jpg"
                />
                <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'image')} disabled={isUploading} />
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </label>
              </div>
              {settings.popupAd?.image && (
                <div className="mt-4 max-w-sm rounded-xl overflow-hidden border border-gray-200">
                  <img src={settings.popupAd.image} alt="Popup preview" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={settings.popupAd?.buttonText || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, buttonText: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={settings.popupAd?.buttonLink || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, buttonLink: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dismiss Text</label>
                <input
                  type="text"
                  value={settings.popupAd?.dismissText || ''}
                  onChange={(e) => setSettings({ ...settings, popupAd: { ...settings.popupAd, dismissText: e.target.value } })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
