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
  Eye,
  Users,
  Plus,
  Trash2,
  Upload
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
    vision: 'To be the most trusted and preferred vehicle import partner in Sri Lanka, known for our integrity and customer-centric approach.',
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
        
        setAboutData(prev => ({
          title: page.title || prev.title,
          content: page.content || prev.content,
          image: page.image || prev.image,
          mission: page.mission || prev.mission,
          vision: page.vision || prev.vision,
          galleryImages: page.galleryImages && page.galleryImages.length > 0 ? page.galleryImages : DEFAULT_GALLERY,
          directors: page.directors || prev.directors
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

  const [isUploading, setIsUploading] = useState(false);

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
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                        placeholder="Paste image URL here"
                      />
                    </div>
                    <label className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 rounded-2xl cursor-pointer transition-colors border border-gray-100" title="Upload Image">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutData({...aboutData, image: url}))} disabled={isUploading} />
                      {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                    </label>
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

            {/* Board of Directors */}
            <div className="pt-6 border-t border-gray-50 space-y-6">
              <div className="flex items-center justify-between">
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
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all border border-orange-200"
                >
                  <Plus size={14} /> Add Director
                </button>
              </div>

              <div className="space-y-4">
                {aboutData.directors.map((director, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0 flex items-center justify-center relative">
                      {director.image ? (
                        <img src={director.image} alt={director.name || 'Director'} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-[1] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Name</label>
                          <input
                            type="text"
                            value={director.name}
                            onChange={(e) => {
                              const newDirectors = [...aboutData.directors];
                              newDirectors[idx] = { ...newDirectors[idx], name: e.target.value };
                              setAboutData({ ...aboutData, directors: newDirectors });
                            }}
                            placeholder="John Doe"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Role / Designation</label>
                          <input
                            type="text"
                            value={director.role}
                            onChange={(e) => {
                              const newDirectors = [...aboutData.directors];
                              newDirectors[idx] = { ...newDirectors[idx], role: e.target.value };
                              setAboutData({ ...aboutData, directors: newDirectors });
                            }}
                            placeholder="Managing Director"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={director.image}
                            onChange={(e) => {
                              const newDirectors = [...aboutData.directors];
                              newDirectors[idx] = { ...newDirectors[idx], image: e.target.value };
                              setAboutData({ ...aboutData, directors: newDirectors });
                            }}
                            placeholder="https://..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                          />
                          <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded-lg cursor-pointer transition-colors border border-gray-200 shrink-0" title="Upload Image">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                              const newDirectors = [...aboutData.directors];
                              newDirectors[idx] = { ...newDirectors[idx], image: url };
                              setAboutData({ ...aboutData, directors: newDirectors });
                            })} disabled={isUploading} />
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Short Bio</label>
                        <textarea
                          value={director.bio}
                          onChange={(e) => {
                            const newDirectors = [...aboutData.directors];
                            newDirectors[idx] = { ...newDirectors[idx], bio: e.target.value };
                            setAboutData({ ...aboutData, directors: newDirectors });
                          }}
                          rows={2}
                          placeholder="Short description..."
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-600 transition-all"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newDirectors = aboutData.directors.filter((_, i) => i !== idx);
                        setAboutData({ ...aboutData, directors: newDirectors });
                      }}
                      className="mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {aboutData.directors.length === 0 && (
                  <p className="text-xs text-gray-400 font-medium text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No directors added yet. Click "Add Director" to create one.
                  </p>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="pt-6 border-t border-gray-50 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-pink-600" size={20} />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Photo Gallery</h3>
                </div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all border border-orange-200 cursor-pointer">
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add Photo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                    setAboutData({ ...aboutData, galleryImages: [...aboutData.galleryImages, url] });
                  })} disabled={isUploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {aboutData.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 group">
                    <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = aboutData.galleryImages.filter((_, i) => i !== idx);
                          setAboutData({ ...aboutData, galleryImages: newImages });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {aboutData.galleryImages.length === 0 && (
                  <div className="col-span-full">
                    <p className="text-xs text-gray-400 font-medium text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      No gallery photos added yet. Click "Add Photo" to upload some.
                    </p>
                  </div>
                )}
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
