'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  Image as ImageIcon,
  Grid
} from 'lucide-react';

export default function VehiclesManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Gallery Picker States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [targetField, setTargetField] = useState<{ type: 'main' | 'gallery', index?: number } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    images: [] as string[],
    year: '',
    mileage: '',
    fuel: 'Petrol',
    engine: '',
    transmission: 'Auto',
    drive: '2WD',
    seats: '5',
    color: '',
    description: '',
    category: 'SUV',
    status: 'Available',
    isFeatured: false
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/vehicles`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setPickerLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
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

  const openPicker = (type: 'main' | 'gallery', index?: number) => {
    setTargetField({ type, index });
    setIsPickerOpen(true);
    fetchGallery();
  };

  const selectImage = (url: string) => {
    if (targetField?.type === 'main') {
      setFormData({ ...formData, image: url });
    } else if (targetField?.type === 'gallery' && targetField.index !== undefined) {
      const newImages = [...formData.images];
      newImages[targetField.index] = url;
      setFormData({ ...formData, images: newImages });
    }
    setIsPickerOpen(false);
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVehicles(vehicles.filter((v: any) => v._id !== id));
        showStatus('success', 'Vehicle removed from inventory.');
      } else {
        showStatus('error', data.message || 'Delete failed');
      }
    } catch (err) {
      showStatus('error', 'Network error while deleting.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log('Submitting form data:', formData);
    
    const token = localStorage.getItem('adminToken');
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
    
    const url = editingVehicle 
      ? `${apiUrl}/vehicles/${editingVehicle._id}`
      : `${apiUrl}/vehicles`;
    
    const method = editingVehicle ? 'PUT' : 'POST';

    const cleanedFormData = {
      ...formData,
      images: formData.images.filter(img => img && img.trim() !== '')
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedFormData)
      });
      
      const data = await res.json();
      console.log('Response from server:', data);
      
      if (data.success) {
        await fetchVehicles();
        setShowModal(false);
        setEditingVehicle(null);
        showStatus('success', editingVehicle ? 'Vehicle details updated successfully!' : 'New vehicle added to inventory!');
        resetForm();
      } else {
        if (res.status === 401) {
          showStatus('error', 'Session expired. Please log in again.');
          setTimeout(() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          showStatus('error', data.message || 'Failed to save vehicle. Please check all fields.');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      showStatus('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', price: '', image: '', images: [], year: '', mileage: '', fuel: 'Petrol', 
      engine: '', transmission: 'Auto', drive: '2WD', seats: '5', 
      color: '', description: '', category: 'SUV', status: 'Available', isFeatured: false
    });
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name || '',
      price: vehicle.price || '',
      image: vehicle.image || '',
      images: vehicle.images || [],
      year: vehicle.year || '',
      mileage: vehicle.mileage || '',
      fuel: vehicle.fuel || 'Petrol',
      engine: vehicle.engine || '',
      transmission: vehicle.transmission || 'Auto',
      drive: vehicle.drive || '2WD',
      seats: vehicle.seats?.toString() || '5',
      color: vehicle.color || '',
      description: vehicle.description || '',
      category: vehicle.category || 'SUV',
      status: vehicle.status || 'Available',
      isFeatured: vehicle.isFeatured || false
    });
    setShowModal(true);
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const filteredVehicles = vehicles.filter((v: any) => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicles Management</h1>
          <p className="text-gray-500 font-medium">Add, update, and manage your vehicle inventory.</p>
        </div>
        <button
          onClick={() => { setEditingVehicle(null); resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest text-xs"
        >
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right duration-500 ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <AlertCircle size={24} />}
          <div className="flex flex-col">
             <span className="text-xs font-black uppercase tracking-widest opacity-60">{statusMessage.type === 'success' ? 'Success' : 'Error'}</span>
             <span className="font-bold">{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by vehicle name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm text-xs uppercase tracking-widest">
          <Filter size={18} /> Filters
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVehicles.map((vehicle: any) => (
            <div key={vehicle._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={vehicle.image || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600'} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleEdit(vehicle)} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl scale-90 group-hover:scale-100 duration-300">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(vehicle._id)} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl scale-90 group-hover:scale-100 duration-300 delay-75">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   <div className={`text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-lg ${
                    vehicle.status === 'Sold' ? 'bg-red-600' : vehicle.status === 'Reserved' ? 'bg-amber-600' : 'bg-black'
                   }`}>
                    {vehicle.status || 'Available'}
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-gray-900 font-bold text-lg mb-1 truncate leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight">{vehicle.name}</h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">LKR {vehicle.price}</p>
                <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Year</span>
                    <span className="text-[11px] font-bold text-gray-700">{vehicle.year}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Fuel</span>
                    <span className="text-[11px] font-bold text-gray-700">{vehicle.fuel}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Trans</span>
                    <span className="text-[11px] font-bold text-gray-700">{vehicle.transmission}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="bg-white border border-gray-200 w-full max-w-5xl rounded-[2.5rem] p-10 relative z-10 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                  {editingVehicle ? <Edit2 size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                    {editingVehicle ? 'Update Vehicle' : 'New Listing'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                <X size={28} className="text-gray-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Vehicle Name / Model</label>
                    <input
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold text-lg focus:outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Listing Price (LKR)</label>
                      <input
                        type="text" required value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold">
                        <option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Van</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Main Preview</label>
                   <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 relative group">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                          <Camera size={40} className="mb-2" />
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Images Manager */}
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                       <Camera size={16} /> Visual Media Manager
                    </h3>
                    <button type="button" onClick={handleAddImage} className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2">
                       <Plus size={14} /> Add Gallery Slot
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Primary Image */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-[9px] font-black text-orange-600 uppercase tracking-widest">Main Thumbnail</label>
                        <button 
                          type="button" 
                          onClick={() => openPicker('main')} 
                          className="bg-orange-600/10 text-orange-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center gap-1 border border-orange-600/20"
                        >
                          <Grid size={10} /> Choose from Gallery
                        </button>
                      </div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-orange-600/20 bg-white shadow-inner">
                        <img 
                          src={formData.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                          alt="Main" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                          }}
                        />
                        {!formData.image && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text" required value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-[11px] font-bold text-gray-600 focus:border-orange-600 transition-all"
                          placeholder="Paste or Select URL"
                        />
                      </div>
                    </div>

                    {/* Gallery Images */}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Gallery Photo #{idx + 1}</label>
                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={() => openPicker('gallery', idx)} 
                              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                            >
                              Gallery
                            </button>
                            <button type="button" onClick={() => handleRemoveImage(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-white">
                          <img 
                            src={img || 'https://via.placeholder.com/400x300?text=Add+Photo'} 
                            alt={`Gallery ${idx}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                        <div className="relative">
                           <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                           <input
                             type="text" value={img}
                             onChange={(e) => handleImageChange(idx, e.target.value)}
                             className="w-full bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-[11px] font-bold text-gray-600 focus:border-orange-600 transition-all"
                             placeholder="Paste or Select URL"
                           />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-4 flex items-center gap-4">
                   <div className="h-px bg-gray-100 flex-grow" />
                   <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Specifications</h3>
                   <div className="h-px bg-gray-100 flex-grow" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Year</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Mileage (KM)</label>
                  <input type="text" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Fuel</label>
                  <select value={formData.fuel} onChange={(e) => setFormData({ ...formData, fuel: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold">
                    <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Transmission</label>
                  <select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold">
                    <option>Auto</option><option>Manual</option><option>Tiptronic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Engine (CC)</label>
                  <input type="text" value={formData.engine} onChange={(e) => setFormData({ ...formData, engine: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Drive</label>
                  <input type="text" value={formData.drive} onChange={(e) => setFormData({ ...formData, drive: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Seats</label>
                  <input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase text-center">Color</label>
                  <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Status</label>
                  <div className="flex flex-wrap gap-4">
                     <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="bg-gray-100 rounded-xl px-6 py-4 font-bold text-sm">
                        <option>Available</option><option>Sold</option><option>Reserved</option>
                     </select>
                     <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                        <input
                          type="checkbox" id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-6 h-6 rounded-lg text-orange-600"
                        />
                        <label htmlFor="isFeatured" className="text-xs font-black uppercase">Featured</label>
                     </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-gray-900 font-medium focus:border-orange-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-5 pt-10 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-4 font-black uppercase text-[10px] text-gray-400 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-black hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : editingVehicle ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsPickerOpen(false)} />
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 relative z-10 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Media Library</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select an image for your listing</p>
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
                     {mediaGallery.length === 0 && (
                       <div className="col-span-full py-20 text-center">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No media found in library.</p>
                       </div>
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
