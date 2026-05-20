'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Link as LinkIcon,
  Type,
  FileText
} from 'lucide-react';

export default function SeoSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data && data.data.seo) {
        setSeoData(data.data.seo);
      }
    } catch (err) {
      console.error('Failed to fetch SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seo: seoData })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'SEO configuration updated successfully.');
      } else {
        showStatus('error', data.message || 'Update failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">SEO & Search Analytics</h1>
        <p className="text-gray-500 font-medium text-sm">Optimize how Makers Ceylon appears in Google and other search engines.</p>
      </div>

      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <AlertCircle size={24} />}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Retrieving Indexing Data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm space-y-10">
            
            {/* Meta Title */}
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                     <Type size={18} />
                  </div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Page Title</label>
               </div>
               <input 
                 type="text" 
                 value={seoData.metaTitle}
                 onChange={(e) => setSeoData({...seoData, metaTitle: e.target.value})}
                 placeholder="e.g. Makers Ceylon — Premium Japanese Vehicles"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
               />
               <p className="text-[10px] text-gray-400 font-bold">Recommended: 50-60 characters. Current: {seoData.metaTitle.length}</p>
            </div>

            {/* Meta Description */}
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                     <FileText size={18} />
                  </div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Description</label>
               </div>
               <textarea 
                 value={seoData.metaDescription}
                 onChange={(e) => setSeoData({...seoData, metaDescription: e.target.value})}
                 placeholder="Enter a brief summary of your website for search results..."
                 rows={4}
                 className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all"
               />
               <p className="text-[10px] text-gray-400 font-bold">Recommended: 150-160 characters. Current: {seoData.metaDescription.length}</p>
            </div>

            {/* Keywords */}
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                     <Search size={18} />
                  </div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search Keywords (Comma Separated)</label>
               </div>
               <input 
                 type="text" 
                 value={seoData.keywords}
                 onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                 placeholder="e.g. Japan cars, Sri Lanka, JDM, imports, car auctions"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
               />
            </div>

            {/* Google Preview Simulation */}
            <div className="pt-10 border-t border-gray-100 space-y-4">
               <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Google Search Preview</label>
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-lg">
                  <p className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer truncate mb-1">
                    {seoData.metaTitle || 'Makers Ceylon — Premium Japanese Vehicles'}
                  </p>
                  <p className="text-[#006621] text-sm mb-1">https://makersceylon.com</p>
                  <p className="text-[#545454] text-sm line-clamp-2">
                    {seoData.metaDescription || 'Your trusted partner for importing premium Japanese vehicles to Sri Lanka. Transparent pricing and live auction access.'}
                  </p>
               </div>
            </div>

          </div>

          <div className="flex justify-end">
             <button 
               type="submit" disabled={submitting}
               className="bg-black hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
             >
               {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save SEO Settings</>}
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
