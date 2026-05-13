'use client';

import React, { useState, useEffect } from 'react';
import { 
  Info, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Type,
  FileText,
  Target,
  Eye
} from 'lucide-react';

export default function AboutUsSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [aboutData, setAboutData] = useState({
    title: 'About Makers Ceylon',
    content: 'Ceylon Imports was founded with a single mission: to revolutionize the vehicle import process in Sri Lanka. We believe that importing a car from Japan should be transparent, cost-effective, and completely stress-free.',
    image: 'https://images.unsplash.com/photo-1562426509-5044a121aa49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    mission: 'To provide a seamless, transparent, and highly reliable vehicle import service that empowers our customers to purchase their dream cars directly from Japan.',
    vision: 'To be the most trusted and preferred vehicle import partner in Sri Lanka, known for our integrity and customer-centric approach.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data && data.data.aboutPage) {
        const page = data.data.aboutPage;
        setAboutData(prev => ({
          title: page.title || prev.title,
          content: page.content || prev.content,
          image: page.image || prev.image,
          mission: page.mission || prev.mission,
          vision: page.vision || prev.vision
        }));
      }
    } catch (err) {
      console.error('Failed to fetch About Us settings');
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
      const token = localStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ aboutPage: aboutData })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'About Us content updated successfully.');
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
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">About Us Content</h1>
        <p className="text-gray-500 font-medium text-sm">Manage the story and mission behind Makers Ceylon.</p>
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
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Content Manager...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm space-y-10">
            
            {/* Main Title & Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Page Headline</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      value={aboutData.title}
                      onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">About Section Image (URL)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      value={aboutData.image}
                      onChange={(e) => setAboutData({...aboutData, image: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                      placeholder="Paste image URL here"
                    />
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                 {aboutData.image ? (
                   <img src={aboutData.image} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-center">
                      <ImageIcon size={40} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Preview Image</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <FileText className="text-orange-600" size={18} />
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Story / Description</label>
               </div>
               <textarea 
                 value={aboutData.content}
                 onChange={(e) => setAboutData({...aboutData, content: e.target.value})}
                 rows={10}
                 className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all leading-relaxed"
                 placeholder="Tell your company story here..."
               />
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="text-blue-600" size={18} />
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Our Mission</label>
                  </div>
                  <textarea 
                    value={aboutData.mission}
                    onChange={(e) => setAboutData({...aboutData, mission: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all"
                  />
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Eye className="text-emerald-600" size={18} />
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Our Vision</label>
                  </div>
                  <textarea 
                    value={aboutData.vision}
                    onChange={(e) => setAboutData({...aboutData, vision: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all"
                  />
               </div>
            </div>

          </div>

          <div className="flex justify-end">
             <button 
               type="submit" disabled={submitting}
               className="bg-black hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
             >
               {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save About Us Content</>}
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
