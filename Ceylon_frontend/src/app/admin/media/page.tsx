'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Search, 
  Image as ImageIcon, 
  Copy, 
  CheckCircle2, 
  X,
  Upload,
  FileImage
} from 'lucide-react';

export default function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Upload States
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('General');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);

      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showStatus('error', 'Please select at least one image');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });
    formData.append('category', category);

    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        await fetchMedia();
        setShowModal(false);
        setSelectedFiles([]);
        setPreviews([]);
        showStatus('success', data.message || 'Images uploaded successfully!');
      } else {
        if (res.status === 401) {
          showStatus('error', 'Session expired. Please log in again.');
          setTimeout(() => {
            sessionStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          showStatus('error', data.message || 'Failed to upload images');
        }
      }
    } catch (err) {
      showStatus('error', 'Network error occurred during upload.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this image?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMedia(media.filter((m: any) => m._id !== id));
        showStatus('success', 'Image deleted.');
      }
    } catch (err) {
      showStatus('error', 'Failed to delete image.');
    }
  };

  const filteredMedia = media.filter((m: any) => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">Media Gallery</h1>
          <p className="text-gray-500 font-medium text-sm">Manage local assets and device uploads.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
        >
          <Upload size={18} /> Upload from Device
        </button>
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <X size={24} />}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600 transition-all font-bold"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Accessing Local Storage...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map((item: any) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 relative">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img 
                  src={item.url} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handleCopy(item.url, item._id)}
                    className="p-3 bg-white text-gray-900 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
                  >
                    {copiedId === item._id ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-3 bg-white text-gray-900 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-black text-[10px] truncate uppercase tracking-tight">{item.name}</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.category}</p>
              </div>
            </div>
          ))}
          
          {filteredMedia.length === 0 && (
            <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
               <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No assets found.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Upload Media</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select images from your device</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <X size={28} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-[2rem] py-16 flex flex-col items-center justify-center gap-4 hover:border-orange-600 hover:bg-orange-50/30 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-600 group-hover:bg-white group-hover:shadow-xl transition-all">
                   <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Click to browse files</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple 
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Files ({previews.length})</label>
                  <div className="grid grid-cols-4 gap-4">
                    {previews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeSelectedFile(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Target Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600 transition-all"
                >
                  <option>General</option>
                  <option>Interior</option>
                  <option>Exterior</option>
                  <option>Engine</option>
                  <option>Documents</option>
                </select>
              </div>

              <div className="pt-6">
                 <button
                    type="submit"
                    disabled={submitting || selectedFiles.length === 0}
                    className="w-full bg-black hover:bg-orange-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Uploading to Server...
                      </>
                    ) : (
                      `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                    )}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
