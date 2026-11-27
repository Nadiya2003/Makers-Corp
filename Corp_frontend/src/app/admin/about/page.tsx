'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Eye,
  Users,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';

export default function AboutUsSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const savedRef = useRef<string>('');
  
  const [aboutData, setAboutData] = useState({
    title: 'About Makers Corp Japan',
    content: 'Makers Corp Japan was founded with a single mission: to provide verified, premium Japanese-market vehicles directly to international buyers and dealerships worldwide. We believe that sourcing and exporting a vehicle from Japan should be transparent, cost-effective, and completely reliable.',
    image: 'https://images.unsplash.com/photo-1562426509-5044a121aa49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    mission: 'To provide a seamless, transparent, and highly reliable vehicle export service connecting verified Tokyo, Yokohama, Kobe, and Nagoya inventory with international buyers worldwide.',
    vision: 'To be the most trusted and preferred Japanese automotive export partner globally, known for our inspection integrity and customer-centric approach.',
    directorsBg: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop',
    galleryImages: [] as string[],
    directors: [] as { name: string; role: string; bio: string; image: string; }[]
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
        const DEFAULT_GALLERY = [
          'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
        ];
        
        const merged = {
          title: page.title || aboutData.title,
          content: page.content || aboutData.content,
          image: page.image || aboutData.image,
          mission: page.mission || aboutData.mission,
          vision: page.vision || aboutData.vision,
          directorsBg: page.directorsBg || aboutData.directorsBg,
          galleryImages: page.galleryImages && page.galleryImages.length > 0 ? page.galleryImages : DEFAULT_GALLERY,
          directors: page.directors || aboutData.directors
        };
        setAboutData(merged);
        savedRef.current = JSON.stringify(merged);
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Failed to fetch About Us settings');
    } finally {
      setLoading(false);
    }
  };

  // Track dirty state whenever aboutData changes
  useEffect(() => {
    if (savedRef.current) {
      setIsDirty(JSON.stringify(aboutData) !== savedRef.current);
    }
  }, [aboutData]);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'About');

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
        onSuccess(data.data[0].url);
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

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        body: JSON.stringify({ aboutPage: aboutData })
      });
      const data = await res.json();
      if (data.success) {
        savedRef.current = JSON.stringify(aboutData);
        setIsDirty(false);
        showStatus('success', 'About Us content updated successfully.');
      } else {
        showStatus('error', data.message || 'Update failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  }, [aboutData]);

  useUnsavedChanges(isDirty, handleSubmit);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">About Us Content</h1>
        <p className="text-gray-500 font-medium text-sm">Manage the story and mission behind Makers Corp Japan.</p>
      </div>

      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-none shadow-2xl transition-all animate-in slide-in-from-right border border-gray-800 ${
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
          <div className="bg-white border border-gray-200 rounded-none p-10 shadow-sm space-y-10">
            
            {/* Main Title & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Page Headline</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      value={aboutData.title}
                      onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">About Section Image (URL)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={aboutData.image}
                        onChange={(e) => setAboutData({...aboutData, image: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-none pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                        placeholder="Paste image URL here"
                      />
                    </div>
                    <label className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 rounded-none cursor-pointer transition-colors border border-gray-200" title="Upload Image">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutData({...aboutData, image: url}))} disabled={isUploading} />
                      {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                    </label>
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-none overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center relative">
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
                 className="w-full bg-gray-50 border border-gray-200 rounded-none px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all leading-relaxed"
                 placeholder="Tell your company story here..."
               />
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="text-blue-600" size={18} />
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Our Mission</label>
                  </div>
                  <textarea 
                    value={aboutData.mission}
                    onChange={(e) => setAboutData({...aboutData, mission: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-6 py-4 text-sm font-medium outline-none focus:border-orange-600 transition-all"
                  />
               </div>
            </div>

            {/* Board of Directors */}
            <div className="pt-6 border-t border-gray-100 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Users className="text-purple-600" size={20} />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Board of Directors</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAboutData({
                    ...aboutData,
                    directors: [...aboutData.directors, { name: '', role: '', bio: '', image: '' }]
                  })}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-none transition-all border border-orange-200 whitespace-nowrap uppercase tracking-wider"
                >
                  <Plus size={14} /> Add Director
                </button>
              </div>

              {/* Directors Background Image */}
              <div className="bg-gray-50 border border-gray-200 rounded-none p-5 space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Background Image</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="text" 
                      value={aboutData.directorsBg}
                      onChange={(e) => setAboutData({...aboutData, directorsBg: e.target.value})}
                      placeholder="Paste background image URL here..."
                      className="w-full bg-white border border-gray-200 rounded-none pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
                  <label className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 rounded-none cursor-pointer transition-colors font-bold text-xs whitespace-nowrap" title="Upload Background Image">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutData({...aboutData, directorsBg: url}))} disabled={isUploading} />
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Upload
                  </label>
                </div>
                {aboutData.directorsBg && (
                  <div className="relative rounded-none overflow-hidden h-28 border border-gray-200">
                    <img src={aboutData.directorsBg} alt="Directors BG Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4">
                      <span className="text-white text-xs font-bold">Background Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {aboutData.directors.map((director, idx) => (
                  <div key={idx} className="relative group bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm">
                    {/* Photo */}
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                      {director.image ? (
                        <img src={director.image} alt={director.name || 'Director'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}
                      {/* Photo overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <label className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-none cursor-pointer hover:bg-orange-50 transition-colors">
                          <Upload size={13} />
                          {director.image ? 'Change' : 'Upload'}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                            const d = [...aboutData.directors];
                            d[idx] = { ...d[idx], image: url };
                            setAboutData({ ...aboutData, directors: d });
                          })} disabled={isUploading} />
                        </label>
                        {director.image && (
                          <button
                            type="button"
                            onClick={() => {
                              const d = [...aboutData.directors];
                              d[idx] = { ...d[idx], image: '' };
                              setAboutData({ ...aboutData, directors: d });
                            }}
                            className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-none hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        value={director.name}
                        onChange={(e) => {
                          const d = [...aboutData.directors];
                          d[idx] = { ...d[idx], name: e.target.value };
                          setAboutData({ ...aboutData, directors: d });
                        }}
                        placeholder="Name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-2.5 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                      />
                      <input
                        type="text"
                        value={director.role}
                        onChange={(e) => {
                          const d = [...aboutData.directors];
                          d[idx] = { ...d[idx], role: e.target.value };
                          setAboutData({ ...aboutData, directors: d });
                        }}
                        placeholder="Role / Title"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-2.5 py-1.5 text-xs text-orange-600 font-semibold focus:outline-none focus:border-orange-600 transition-all"
                      />
                      <textarea
                        value={director.bio}
                        onChange={(e) => {
                          const d = [...aboutData.directors];
                          d[idx] = { ...d[idx], bio: e.target.value };
                          setAboutData({ ...aboutData, directors: d });
                        }}
                        rows={5}
                        placeholder="Short Bio..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-none px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-orange-600 transition-all resize-none"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteIdx(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-400 hover:text-red-600 hover:bg-white rounded-none shadow transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
                      title="Remove director"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {aboutData.directors.length === 0 && (
                <p className="text-xs text-gray-400 font-medium text-center py-6 bg-gray-50 rounded-none border border-dashed border-gray-200">
                  No directors added yet. Click &quot;Add Director&quot; to create one.
                </p>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="pt-6 border-t border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-pink-600" size={20} />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Photo Gallery</h3>
                </div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-none transition-all border border-orange-200 cursor-pointer uppercase tracking-wider">
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add Photo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                    setAboutData({ ...aboutData, galleryImages: [...aboutData.galleryImages, url] });
                  })} disabled={isUploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {aboutData.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-none overflow-hidden bg-gray-50 border border-gray-200 group">
                    <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = aboutData.galleryImages.filter((_, i) => i !== idx);
                          setAboutData({ ...aboutData, galleryImages: newImages });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-none transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {aboutData.galleryImages.length === 0 && (
                  <div className="col-span-full">
                    <p className="text-xs text-gray-400 font-medium text-center py-6 bg-gray-50 rounded-none border border-dashed border-gray-200">
                      No gallery photos added yet. Click &quot;Add Photo&quot; to upload some.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end">
             <button 
               type="submit" disabled={submitting}
               className="bg-black hover:bg-orange-600 text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
             >
               {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save About Us Content</>}
             </button>
          </div>
        </form>
      )}

      {/* ── Confirm Delete Director Dialog ─────────── */}
      {confirmDeleteIdx !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDeleteIdx(null)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-none shadow-2xl p-8 max-w-sm w-full text-center z-10 animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="w-14 h-14 bg-red-100 rounded-none flex items-center justify-center mx-auto mb-4 border border-red-200">
              <Trash2 className="text-red-500" size={26} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Remove Director?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove{' '}
              <span className="font-bold text-gray-800">
                {aboutData.directors[confirmDeleteIdx]?.name || 'this director'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setConfirmDeleteIdx(null)}
                className="flex-1 px-5 py-2.5 rounded-none border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const newDirectors = aboutData.directors.filter((_, i) => i !== confirmDeleteIdx);
                  setAboutData({ ...aboutData, directors: newDirectors });
                  setConfirmDeleteIdx(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-none bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
