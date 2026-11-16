'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Gavel, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle2, 
  AlertCircle,
  X,
  Globe,
  ExternalLink,
  Upload,
  Grid,
  Image as ImageIcon
} from 'lucide-react';

export default function AuctionManagement() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuction, setEditingAuction] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Gallery States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: 'Online',
    image: '',
    status: 'Upcoming',
    link: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auctions`);
      const data = await res.json();
      if (data.success) {
        setAuctions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch auctions');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setPickerLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMediaGallery(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery');
    } finally {
      setPickerLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'Auctions');

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
        await fetchGallery();
        setFormData({ ...formData, image: uploadedUrl });
        setIsPickerOpen(false);
        showStatus('success', 'Image uploaded and selected!');
      } else {
        showStatus('error', data.message || 'Upload failed');
      }
    } catch (err) {
      showStatus('error', 'Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const [directUploadProgress, setDirectUploadProgress] = useState(false);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setDirectUploadProgress(true);
    const formDataObj = new FormData();
    formDataObj.append('photos', e.target.files[0]);
    formDataObj.append('category', 'Auctions');

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
        setFormData({ ...formData, image: uploadedUrl });
        showStatus('success', 'Image uploaded successfully!');
      } else {
        showStatus('error', data.message || 'Upload failed');
      }
    } catch (err) {
      showStatus('error', 'Network error during upload');
    } finally {
      setDirectUploadProgress(false);
      e.target.value = '';
    }
  };

  const openPicker = () => {
    setIsPickerOpen(true);
    fetchGallery();
  };

  const selectImage = (url: string) => {
    setFormData({ ...formData, image: url });
    setIsPickerOpen(false);
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this auction?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auctions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAuctions(auctions.filter((a: any) => a._id !== id));
        showStatus('success', 'Auction event deleted.');
      }
    } catch (err) {
      showStatus('error', 'Delete failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = sessionStorage.getItem('adminToken');
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
    
    const url = editingAuction ? `${apiUrl}/auctions/${editingAuction._id}` : `${apiUrl}/auctions`;
    const method = editingAuction ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', editingAuction ? 'Auction updated.' : 'Auction created.');
        setShowModal(false);
        fetchAuctions();
      } else {
        showStatus('error', data.message || 'Save failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (auction: any) => {
    setEditingAuction(auction);
    setFormData({
      title: auction.title || '',
      description: auction.description || '',
      date: auction.date ? new Date(auction.date).toISOString().split('T')[0] : '',
      time: auction.time || '',
      location: auction.location || 'Online',
      image: auction.image || '',
      status: auction.status || 'Upcoming',
      link: auction.link || '',
      isFeatured: auction.isFeatured || false
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">Live Auctions</h1>
          <p className="text-gray-500 font-medium text-sm">Schedule and manage vehicle auction events.</p>
        </div>
        <button
          onClick={() => { setEditingAuction(null); setFormData({ title: '', description: '', date: '', time: '', location: 'Online', image: '', status: 'Upcoming', link: '', isFeatured: false }); setShowModal(true); }}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-orange-600/20"
        >
          <Plus size={16} /> Schedule Auction
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

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Fetching Auctions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction: any) => (
            <div key={auction._id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
               <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img src={auction.image || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800'} alt={auction.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4">
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${
                        auction.status === 'Live' ? 'bg-red-600 animate-pulse' : auction.status === 'Ended' ? 'bg-gray-500' : 'bg-black'
                     }`}>
                        {auction.status}
                     </span>
                  </div>
               </div>
               <div className="p-8">
                  <h3 className="text-gray-900 font-black text-xl uppercase tracking-tighter mb-4 group-hover:text-orange-600 transition-colors line-clamp-1">{auction.title}</h3>
                  <div className="space-y-3 mb-8">
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                        <Calendar size={14} className="text-orange-600" /> {new Date(auction.date).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                        <Clock size={14} className="text-orange-600" /> {auction.time}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                        <MapPin size={14} className="text-orange-600" /> {auction.location}
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <button onClick={() => handleEdit(auction)} className="flex-grow bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2">
                        <Edit2 size={12} /> Edit Event
                     </button>
                     <button onClick={() => handleDelete(auction._id)} className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
          {auctions.length === 0 && (
             <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Gavel size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No auctions scheduled yet.</p>
             </div>
          )}
        </div>
      )}

      {/* Auction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-4xl rounded-[3rem] relative z-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col overflow-hidden">
             {/* Sticky Header */}
             <div className="flex items-center justify-between p-10 pb-6 bg-white z-20">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                      <Gavel size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                      {editingAuction ? 'Modify Auction' : 'Schedule New Auction'}
                   </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                   <X size={28} className="text-gray-400 group-hover:rotate-90 transition-transform" />
                </button>
             </div>

             {/* Scrollable Content */}
             <div className="flex-grow overflow-y-auto p-10 pt-4 custom-scrollbar">

             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Auction Title</label>
                      <input 
                        type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-orange-600 outline-none transition-all"
                        placeholder="e.g. Premium SUV Collection Auction"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Auction Date</label>
                      <input 
                        type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-orange-600 outline-none transition-all"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Start Time</label>
                      <input 
                        type="text" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-orange-600 outline-none transition-all"
                        placeholder="e.g. 10:00 AM"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Location / Platform</label>
                      <input 
                        type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:border-orange-600 outline-none transition-all"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-6 py-4 font-bold">
                         <option>Upcoming</option><option>Live</option><option>Ended</option>
                      </select>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Auction External Link (URL)</label>
                      <div className="relative">
                         <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         <input 
                           type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:border-orange-600 outline-none transition-all"
                           placeholder="https://auction-platform.com/event/123"
                         />
                      </div>
                   </div>
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Cover Image</label>
                       <div className="flex flex-col md:flex-row gap-6">
                          <label className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative group cursor-pointer block hover:border-orange-600 transition-colors">
                             <input
                               type="file"
                               accept="image/*"
                               className="hidden"
                               onChange={handleDirectUpload}
                             />
                             {directUploadProgress ? (
                               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                 <Loader2 size={32} className="text-orange-600 animate-spin mb-2" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Uploading...</span>
                               </div>
                             ) : null}
                             {formData.image ? (
                               <>
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                   <Upload size={24} className="text-white" />
                                 </div>
                                 <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                               </>
                             ) : (
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                                  <Upload size={32} className="mb-2" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Click to Upload</span>
                               </div>
                             )}
                          </label>
                          <div className="flex-grow space-y-4">
                             <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                  type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:border-orange-600 outline-none transition-all text-sm"
                                  placeholder="Paste image URL or use Gallery"
                                />
                             </div>
                             <button 
                               type="button" 
                               onClick={openPicker}
                               className="w-full bg-orange-600/10 text-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 hover:text-white transition-all border border-orange-600/20 flex items-center justify-center gap-2"
                             >
                                <Grid size={16} /> Choose from Media Library
                             </button>
                          </div>
                       </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                   <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
                   <button 
                     type="submit" disabled={submitting}
                     className="bg-black hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
                   >
                     {submitting ? <Loader2 size={16} className="animate-spin" /> : editingAuction ? 'Update Auction' : 'Publish Auction'}
                   </button>
                </div>
             </form>
             </div>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setIsPickerOpen(false)} />
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 relative z-10 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Media Library</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select or upload an image</p>
                </div>
                <button onClick={() => setIsPickerOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
             </div>

             {pickerLoading ? (
               <div className="flex-grow flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Library...</p>
               </div>
             ) : (
               <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {/* Upload Button Card */}
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       disabled={isUploading}
                       className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-orange-600/30 hover:border-orange-600 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 bg-gray-50 shadow-sm"
                     >
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Upload New</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                     </button>

                     {mediaGallery.map((item: any) => (
                       <button 
                        key={item._id}
                        onClick={() => selectImage(item.url)}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-600 transition-all shadow-sm"
                       >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                             <p className="text-[9px] font-black text-white uppercase truncate">{item.name}</p>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
