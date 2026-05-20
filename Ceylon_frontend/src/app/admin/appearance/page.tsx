'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Mail, Phone, MapPin, Share2 } from 'lucide-react';

export default function AppearanceManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    footer: {
      aboutText: '',
      address: '',
      email: '',
      phone: '',
      copyrightText: '',
      socialLinks: []
    }
  });

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
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">Facebook</span>
              <input type="text" className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900" placeholder="https://facebook.com/..." />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">Instagram</span>
              <input type="text" className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
