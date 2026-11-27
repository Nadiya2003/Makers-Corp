'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Grid,
  Upload,
  SlidersHorizontal,
  Eye,
  EyeOff,
  GripVertical,
  ListChecks,
  Pencil,
  Save,
  RotateCcw
} from 'lucide-react';

// ─── Icon name → lucide component map used in the spec manager ──────────────
const ICON_OPTIONS = [
  'Calendar','Fuel','Settings','Zap','Gauge','Info','Users','Palette',
  'Star','Shield','Award','Layers','Cpu','Disc','Radio','Compass',
  'Activity','Tag','Box','Package'
];

export default function VehiclesManagement() {
  // ── Page-level tab ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'vehicles' | 'specs'>('vehicles');

  // ── Vehicle list states ─────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Gallery Picker States ───────────────────────────────────────────────────
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [targetField, setTargetField] = useState<{ type: 'main' | 'gallery', index?: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ── Vehicle Form State ──────────────────────────────────────────────────────
  const [formData, setFormData] = useState<any>({
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
    isFeatured: false,
    hiddenSpecs: [] as string[],
    customSpecs: [] as { key: string; label: string; value: string }[]
  });

  // ── Per-vehicle custom spec states ──────────────────────────────────────────
  const [newCustomSpec, setNewCustomSpec] = useState({ label: '', value: '' });
  const [showAddCustomSpec, setShowAddCustomSpec] = useState(false);

  // ── Price Range Generator States ──────────────────────────────────────────
  const [priceType, setPriceType] = useState<'fixed' | 'range'>('fixed');
  const [priceUnit, setPriceUnit] = useState<string>('M');
  const [fixedPrice, setFixedPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const PRICE_UNITS = [
    { value: 'LKR', label: 'LKR (Exact)' },
    { value: 'Lakhs', label: 'Lakhs' },
    { value: 'M', label: 'M (Millions)' },
    { value: 'B', label: 'B (Billions)' },
    { value: 'T', label: 'T (Thousands)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'AUD', label: 'AUD ($)' }
  ];

  const updatePriceField = (type: 'fixed' | 'range', min: string, max: string, fixed: string, unit: string) => {
    let priceStr = '';
    const isIntl = ['USD', 'JPY', 'EUR', 'GBP', 'AUD'].includes(unit);
    if (type === 'fixed') {
      if (unit === 'LKR' || isIntl) {
        const rawNum = fixed.replace(/,/g, '');
        if (/^\d+$/.test(rawNum)) {
          const formatted = parseInt(rawNum).toLocaleString('en-US');
          priceStr = isIntl ? `${unit} ${formatted}` : formatted;
        } else {
          priceStr = isIntl ? `${unit} ${fixed}` : fixed;
        }
      } else {
        priceStr = `${fixed}${unit === 'Lakhs' ? ' Lakhs' : unit}`;
      }
    } else {
      if (unit === 'LKR' || isIntl) {
        const rawMin = min.replace(/,/g, '');
        const rawMax = max.replace(/,/g, '');
        const formattedMin = /^\d+$/.test(rawMin) ? parseInt(rawMin).toLocaleString('en-US') : min;
        const formattedMax = /^\d+$/.test(rawMax) ? parseInt(rawMax).toLocaleString('en-US') : max;
        priceStr = isIntl ? `${unit} ${formattedMin} - ${formattedMax}` : `${formattedMin} - ${formattedMax}`;
      } else {
        const suffix = unit === 'Lakhs' ? ' Lakhs' : unit;
        priceStr = `${min}${suffix} - ${max}${suffix}`;
      }
    }
    setFormData((prev: any) => ({ ...prev, price: priceStr }));
  };

  const handleFixedPriceChange = (val: string) => {
    setFixedPrice(val);
    updatePriceField(priceType, minPrice, maxPrice, val, priceUnit);
  };

  const handleMinPriceChange = (val: string) => {
    setMinPrice(val);
    updatePriceField(priceType, val, maxPrice, fixedPrice, priceUnit);
  };

  const handleMaxPriceChange = (val: string) => {
    setMaxPrice(val);
    updatePriceField(priceType, minPrice, val, fixedPrice, priceUnit);
  };

  const handleUnitChange = (val: string) => {
    setPriceUnit(val);
    updatePriceField(priceType, minPrice, maxPrice, fixedPrice, val);
  };

  const handlePriceTypeChange = (type: 'fixed' | 'range') => {
    setPriceType(type);
    updatePriceField(type, minPrice, maxPrice, fixedPrice, priceUnit);
  };

  // ── Spec Settings States ────────────────────────────────────────────────────
  const [specs, setSpecs] = useState<any[]>([]);
  const [specsLoading, setSpecsLoading] = useState(false);
  const [specsSaving, setSpecsSaving] = useState(false);
  const [editingSpecIdx, setEditingSpecIdx] = useState<number | null>(null);
  const [editingSpecData, setEditingSpecData] = useState<any>(null);
  const [newSpec, setNewSpec] = useState({ key: '', label: '', icon: 'Star', visible: true });
  const [showAddSpec, setShowAddSpec] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchSpecs();
  }, []);

  useEffect(() => {
    if (showModal || isPickerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal, isPickerOpen]);

  // ── API helpers ─────────────────────────────────────────────────────────────
  const apiUrl = () => (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const token = () => sessionStorage.getItem('adminToken');

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${apiUrl()}/vehicles`);
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (err) {
      console.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setPickerLoading(true);
    try {
      const res = await fetch(`${apiUrl()}/media`, {
        headers: { 'Authorization': `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) setMediaGallery(data.data);
    } catch (err) {
      console.error('Failed to fetch gallery');
    } finally {
      setPickerLoading(false);
    }
  };

  // ── Spec API ────────────────────────────────────────────────────────────────
  const fetchSpecs = async () => {
    setSpecsLoading(true);
    try {
      const res = await fetch(`${apiUrl()}/settings/vehicle-specs`);
      const data = await res.json();
      if (data.success) {
        setSpecs(data.data.map((s: any, i: number) => ({ ...s, order: s.order ?? i })));
      }
    } catch (err) {
      console.error('Failed to fetch specs');
    } finally {
      setSpecsLoading(false);
    }
  };

  const saveSpecs = async (specsToSave?: any[]) => {
    const payload = specsToSave || specs;
    setSpecsSaving(true);
    try {
      const res = await fetch(`${apiUrl()}/settings/vehicle-specs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token()}`
        },
        body: JSON.stringify({ specs: payload })
      });
      const data = await res.json();
      if (data.success) {
        setSpecs(data.data);
        showStatus('success', 'Specification settings saved!');
      } else {
        showStatus('error', data.message || 'Failed to save specs');
      }
    } catch (err) {
      showStatus('error', 'Network error saving specs');
    } finally {
      setSpecsSaving(false);
    }
  };

  const toggleSpecVisibility = (idx: number) => {
    setSpecs(prev => prev.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s));
  };

  const deleteCustomSpec = (idx: number) => {
    if (!confirm('Remove this custom specification?')) return;
    setSpecs(prev => prev.filter((_, i) => i !== idx));
  };

  const startEditSpec = (idx: number) => {
    setEditingSpecIdx(idx);
    setEditingSpecData({ ...specs[idx] });
  };

  const saveEditSpec = () => {
    if (!editingSpecData.label.trim() || !editingSpecData.key.trim()) {
      showStatus('error', 'Key and Label are required');
      return;
    }
    setSpecs(prev => prev.map((s, i) => i === editingSpecIdx ? { ...editingSpecData } : s));
    setEditingSpecIdx(null);
    setEditingSpecData(null);
  };

  const addNewSpec = () => {
    if (!newSpec.key.trim() || !newSpec.label.trim()) {
      showStatus('error', 'Key and Label are required');
      return;
    }
    // ensure key is unique
    if (specs.some(s => s.key === newSpec.key.trim())) {
      showStatus('error', 'A spec with that key already exists');
      return;
    }
    const spec = {
      key: newSpec.key.trim().toLowerCase().replace(/\s+/g, '_'),
      label: newSpec.label.trim(),
      icon: newSpec.icon,
      visible: newSpec.visible,
      isDefault: false,
      order: specs.length
    };
    setSpecs(prev => [...prev, spec]);
    setNewSpec({ key: '', label: '', icon: 'Star', visible: true });
    setShowAddSpec(false);
    showStatus('success', 'New specification added. Click "Save Changes" to apply.');
  };

  // ── Gallery picker ──────────────────────────────────────────────────────────
  const openPicker = (type: 'main' | 'gallery', index?: number) => {
    setTargetField({ type, index });
    setIsPickerOpen(true);
    fetchGallery();
  };

  const [directUploadProgress, setDirectUploadProgress] = useState<{ type: 'main' | 'gallery', index?: number } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('photos', e.target.files[0]);
    formDataUpload.append('category', 'Vehicles');
    try {
      const res = await fetch(`${apiUrl()}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token()}` },
        body: formDataUpload
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        await fetchGallery();
        selectImage(data.data[0].url);
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

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery', index?: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setDirectUploadProgress({ type, index });
    const formDataUpload = new FormData();
    formDataUpload.append('photos', e.target.files[0]);
    formDataUpload.append('category', 'Vehicles');
    try {
      const res = await fetch(`${apiUrl()}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token()}` },
        body: formDataUpload
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const uploadedUrl = data.data[0].url;
        if (type === 'main') {
          setFormData(prev => ({ ...prev, image: uploadedUrl }));
        } else if (type === 'gallery' && index !== undefined) {
          setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = uploadedUrl;
            return { ...prev, images: newImages };
          });
        }
        showStatus('success', 'Image uploaded successfully!');
      } else {
        showStatus('error', data.message || 'Upload failed');
      }
    } catch (err) {
      showStatus('error', 'Network error during upload');
    } finally {
      setDirectUploadProgress(null);
      e.target.value = '';
    }
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

  const requestDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`${apiUrl()}/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) {
        setVehicles((prev: any[]) => prev.filter((v: any) => v._id !== id));
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
    const url = editingVehicle 
      ? `${apiUrl()}/vehicles/${editingVehicle._id}`
      : `${apiUrl()}/vehicles`;
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
          'Authorization': `Bearer ${token()}`
        },
        body: JSON.stringify(cleanedFormData)
      });
      const data = await res.json();
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
            sessionStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          showStatus('error', data.message || 'Failed to save vehicle. Please check all fields.');
        }
      }
    } catch (err) {
      showStatus('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', price: '', image: '', images: [], year: '', mileage: '', fuel: 'Petrol', 
      engine: '', transmission: 'Auto', drive: '2WD', seats: '5', 
      color: '', description: '', category: 'SUV', status: 'Available', isFeatured: false,
      hiddenSpecs: [], customSpecs: []
    });
    setPriceType('fixed');
    setPriceUnit('M');
    setFixedPrice('');
    setMinPrice('');
    setMaxPrice('');
    setShowAddCustomSpec(false);
    setNewCustomSpec({ label: '', value: '' });
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
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
      isFeatured: vehicle.isFeatured || false,
      hiddenSpecs: vehicle.hiddenSpecs || [],
      customSpecs: vehicle.customSpecs || []
    });
    setShowAddCustomSpec(false);
    setNewCustomSpec({ label: '', value: '' });

    const priceStr = vehicle.price || '';
    const parts = priceStr.split('-').map((s: string) => s.trim());
    if (parts.length > 1) {
      setPriceType('range');
      const secondPart = parts[1].toUpperCase();
      const firstPart = parts[0].toUpperCase();
      let detectedUnit = 'LKR';
      
      const intlMatch = (firstPart + secondPart).match(/(USD|JPY|EUR|GBP|AUD)/);
      if (intlMatch) {
        detectedUnit = intlMatch[0];
      } else if (secondPart.includes('M') || secondPart.includes('MILLION')) {
        detectedUnit = 'M';
      } else if (secondPart.includes('LAKH') || secondPart.includes('LAKS') || secondPart.includes('LAK') || secondPart.includes('LAC')) {
        detectedUnit = 'Lakhs';
      } else if (secondPart.includes('B') || secondPart.includes('BILLION')) {
        detectedUnit = 'B';
      } else if (secondPart.includes('T') || secondPart.includes('K') || secondPart.includes('THOUSAND')) {
        detectedUnit = 'T';
      }
      setPriceUnit(detectedUnit);

      const minValMatch = parts[0].match(/\d+(?:\.\d+)?/);
      const maxValMatch = parts[1].match(/\d+(?:\.\d+)?/);
      setMinPrice(minValMatch ? minValMatch[0] : '');
      setMaxPrice(maxValMatch ? maxValMatch[0] : '');
      setFixedPrice('');
    } else {
      setPriceType('fixed');
      const upperStr = priceStr.toUpperCase();
      let detectedUnit = 'LKR';
      
      const intlMatch = upperStr.match(/(USD|JPY|EUR|GBP|AUD)/);
      if (intlMatch) {
        detectedUnit = intlMatch[0];
      } else if (upperStr.includes('M') || upperStr.includes('MILLION')) {
        detectedUnit = 'M';
      } else if (upperStr.includes('LAKH') || upperStr.includes('LAKS') || upperStr.includes('LAK') || upperStr.includes('LAC')) {
        detectedUnit = 'Lakhs';
      } else if (upperStr.includes('B') || upperStr.includes('BILLION')) {
        detectedUnit = 'B';
      } else if (upperStr.includes('T') || upperStr.includes('K') || upperStr.includes('THOUSAND')) {
        detectedUnit = 'T';
      }
      setPriceUnit(detectedUnit);

      if (detectedUnit === 'LKR' || ['USD', 'JPY', 'EUR', 'GBP', 'AUD'].includes(detectedUnit)) {
        const rawNum = priceStr.replace(/(USD|JPY|EUR|GBP|AUD)/gi, '').trim();
        setFixedPrice(rawNum);
      } else {
        const numMatch = priceStr.match(/\d+(?:\.\d+)?/);
        setFixedPrice(numMatch ? numMatch[0] : '');
      }
      setMinPrice('');
      setMaxPrice('');
    }
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

  // ── Visible spec count ──────────────────────────────────────────────────────
  const visibleCount = specs.filter(s => s.visible).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicles Management</h1>
          <p className="text-gray-500 font-medium">Add, update, and manage your vehicle inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'vehicles' && (
            <button
              onClick={() => { setEditingVehicle(null); resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest text-xs"
            >
              <Plus size={18} /> Add New Vehicle
            </button>
          )}
          {activeTab === 'specs' && (
            <button
              onClick={() => saveSpecs()}
              disabled={specsSaving}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {specsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[3000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`} style={{ animation: 'slideInRight 0.3s ease-out' }}>
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

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'vehicles'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Grid size={14} /> Inventory
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'specs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <SlidersHorizontal size={14} /> Specifications
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'specs' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {visibleCount}/{specs.length}
          </span>
        </button>
      </div>

      {/* ── TAB: VEHICLE INVENTORY ─────────────────────────────────────────── */}
      {activeTab === 'vehicles' && (
        <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle: any) => (
                <div key={vehicle._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={vehicle.image || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600'} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(vehicle)} className="p-2.5 bg-white text-gray-900 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-2xl scale-90 group-hover:scale-100 duration-300">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => requestDelete(vehicle._id)} className="p-2.5 bg-white text-gray-900 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-2xl scale-90 group-hover:scale-100 duration-300 delay-75">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                       <div className={`text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg ${
                        vehicle.status === 'Sold' ? 'bg-red-600' : vehicle.status === 'Reserved' ? 'bg-amber-600' : 'bg-black'
                       }`}>
                        {vehicle.status || 'Available'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-gray-900 font-bold text-base mb-0.5 truncate leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight">{vehicle.name}</h3>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3">LKR {vehicle.price}</p>
                    <div className="mt-auto grid grid-cols-3 gap-1.5 pt-3 border-t border-gray-100">
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Year</span>
                        <span className="text-[10px] font-bold text-gray-700">{vehicle.year}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Fuel</span>
                        <span className="text-[10px] font-bold text-gray-700">{vehicle.fuel}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Trans</span>
                        <span className="text-[10px] font-bold text-gray-700">{vehicle.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB: SPECIFICATIONS ────────────────────────────────────────────── */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          {/* Info banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex gap-4 items-start">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5">
              <ListChecks size={20} />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm mb-1">Specification Visibility Control</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Toggle which specifications are shown on the vehicle detail page in the frontend. 
                Add new custom fields for extra vehicle attributes. Default specs match the vehicle model fields.
                Click <strong>Save Changes</strong> when done.
              </p>
            </div>
          </div>

          {specsLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Specifications...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="col-span-1"></div>
                <div className="col-span-2">Key</div>
                <div className="col-span-3">Label</div>
                <div className="col-span-2">Icon</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1 text-center">Visible</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Spec rows */}
              {specs.map((spec, idx) => (
                <div key={spec.key + idx} className={`grid grid-cols-12 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50/50 transition-colors ${!spec.visible ? 'opacity-50' : ''}`}>
                  {editingSpecIdx === idx ? (
                    /* ── Inline edit row ── */
                    <div className="col-span-12 grid grid-cols-12 gap-3 items-center py-2">
                      <div className="col-span-1 text-gray-300"><GripVertical size={16} /></div>
                      <div className="col-span-2">
                        <input
                          value={editingSpecData.key}
                          onChange={e => setEditingSpecData({...editingSpecData, key: e.target.value})}
                          disabled={editingSpecData.isDefault}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="key"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          value={editingSpecData.label}
                          onChange={e => setEditingSpecData({...editingSpecData, label: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
                          placeholder="Display label"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={editingSpecData.icon}
                          onChange={e => setEditingSpecData({...editingSpecData, icon: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
                        >
                          {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${editingSpecData.isDefault ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {editingSpecData.isDefault ? 'Default' : 'Custom'}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => setEditingSpecData({...editingSpecData, visible: !editingSpecData.visible})}
                          className={`w-8 h-5 rounded-full transition-colors ${editingSpecData.visible ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-auto ${editingSpecData.visible ? 'translate-x-1.5' : '-translate-x-1.5'}`} />
                        </button>
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <button onClick={saveEditSpec} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                          <Save size={12} />
                        </button>
                        <button onClick={() => { setEditingSpecIdx(null); setEditingSpecData(null); }} className="p-1.5 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-all">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal display row ── */
                    <>
                      <div className="col-span-1 text-gray-300 cursor-grab"><GripVertical size={16} /></div>
                      <div className="col-span-2">
                        <code className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{spec.key}</code>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-bold text-gray-800">{spec.label}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{spec.icon}</span>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${spec.isDefault ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {spec.isDefault ? 'Default' : 'Custom'}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => toggleSpecVisibility(idx)}
                          className={`w-10 h-6 rounded-full transition-all duration-300 relative ${spec.visible ? 'bg-orange-500' : 'bg-gray-200'}`}
                          title={spec.visible ? 'Shown on frontend' : 'Hidden from frontend'}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${spec.visible ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="col-span-1 flex justify-end gap-1.5">
                        <button onClick={() => startEditSpec(idx)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all" title="Edit">
                          <Pencil size={12} />
                        </button>
                        {!spec.isDefault && (
                          <button onClick={() => deleteCustomSpec(idx)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all" title="Delete">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add new spec row */}
              {showAddSpec ? (
                <div className="px-6 py-5 border-b border-gray-50 bg-orange-50/30">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Plus size={12} /> New Custom Specification
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Field Key *</label>
                      <input
                        value={newSpec.key}
                        onChange={e => setNewSpec({...newSpec, key: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:border-orange-600 focus:outline-none transition-all"
                        placeholder="e.g. battery_range"
                      />
                      <p className="text-[9px] text-gray-400 mt-1">Must match vehicle data key (if applicable)</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Display Label *</label>
                      <input
                        value={newSpec.label}
                        onChange={e => setNewSpec({...newSpec, label: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:border-orange-600 focus:outline-none transition-all"
                        placeholder="e.g. Battery Range"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Icon</label>
                      <select
                        value={newSpec.icon}
                        onChange={e => setNewSpec({...newSpec, icon: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:border-orange-600 focus:outline-none transition-all"
                      >
                        {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col justify-between">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Visible on Frontend</label>
                      <div className="flex items-center gap-3 mb-1">
                        <button
                          type="button"
                          onClick={() => setNewSpec({...newSpec, visible: !newSpec.visible})}
                          className={`w-12 h-7 rounded-full transition-all duration-300 relative ${newSpec.visible ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${newSpec.visible ? 'right-1.5' : 'left-1.5'}`} />
                        </button>
                        <span className="text-xs font-bold text-gray-600">{newSpec.visible ? 'Visible' : 'Hidden'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={addNewSpec} className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all">
                      <Plus size={14} /> Add Specification
                    </button>
                    <button onClick={() => { setShowAddSpec(false); setNewSpec({ key: '', label: '', icon: 'Star', visible: true }); }} className="px-5 py-2.5 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4">
                  <button
                    onClick={() => setShowAddSpec(true)}
                    className="flex items-center gap-2 text-orange-600 text-xs font-black uppercase tracking-widest hover:text-orange-700 transition-colors group"
                  >
                    <div className="w-7 h-7 border-2 border-dashed border-orange-300 group-hover:border-orange-600 rounded-lg flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </div>
                    Add Custom Specification
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Visibility summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl font-black text-gray-900 mb-1">{specs.length}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Specs</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl font-black text-orange-600 mb-1">{visibleCount}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shown on Frontend</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl font-black text-gray-300 mb-1">{specs.length - visibleCount}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hidden</p>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (confirm('Reset all specs to defaults?')) fetchSpecs();
              }}
              className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-700 transition-colors"
            >
              <RotateCcw size={14} /> Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* ── VEHICLE FORM MODAL ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setShowModal(false)} />
          <div className="bg-white border border-gray-200 w-full max-w-5xl rounded-[2.5rem] relative z-10 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-10 pb-6 bg-white z-20">
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

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-10 pt-4 custom-scrollbar">
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
                  {/* Row 2: Price Format & Category (perfectly aligned in a 2-column grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Price Format</label>
                      <div className="flex bg-gray-100 rounded-xl p-1 text-[10px] font-black uppercase w-full">
                        <button
                          type="button"
                          onClick={() => handlePriceTypeChange('fixed')}
                          className={`flex-1 py-3.5 rounded-lg transition-all text-center ${
                            priceType === 'fixed' ? 'bg-white text-dark shadow-sm' : 'text-gray-400 hover:text-dark'
                          }`}
                        >
                          Fixed Price
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePriceTypeChange('range')}
                          className={`flex-1 py-3.5 rounded-lg transition-all text-center ${
                            priceType === 'range' ? 'bg-white text-dark shadow-sm' : 'text-gray-400 hover:text-dark'
                          }`}
                        >
                          Price Range
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Category</label>
                      <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                      >
                        <option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Van</option><option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Price Value Inputs & Unit (Grouped inside a premium card) */}
                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                    {priceType === 'fixed' ? (
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Listing Price</label>
                          <input
                            type={['LKR', 'USD', 'JPY', 'EUR', 'GBP', 'AUD'].includes(priceUnit) ? "text" : "number"}
                            step="any"
                            required
                            value={fixedPrice}
                            placeholder={priceUnit === 'LKR' ? "e.g. 18,500,000" : "e.g. 18.5"}
                            onChange={(e) => handleFixedPriceChange(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Unit</label>
                          <select
                            value={priceUnit}
                            onChange={(e) => handleUnitChange(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                          >
                            {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Min Price</label>
                          <input
                            type={['LKR', 'USD', 'JPY', 'EUR', 'GBP', 'AUD'].includes(priceUnit) ? "text" : "number"}
                            step="any"
                            required
                            value={minPrice}
                            placeholder={priceUnit === 'LKR' ? "e.g. 18,000,000" : "e.g. 18"}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Max Price</label>
                          <input
                            type={['LKR', 'USD', 'JPY', 'EUR', 'GBP', 'AUD'].includes(priceUnit) ? "text" : "number"}
                            step="any"
                            required
                            value={maxPrice}
                            placeholder={priceUnit === 'LKR' ? "e.g. 25,000,000" : "e.g. 25"}
                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Unit</label>
                          <select
                            value={priceUnit}
                            onChange={(e) => handleUnitChange(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:border-orange-600 transition-all"
                          >
                            {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                          </select>
                        </div>
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
                       <Plus size={14} /> Add Photo
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Primary Image card */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Main ★</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => openPicker('main')}
                            className="bg-orange-600/10 text-orange-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border border-orange-600/20"
                          >
                            Gallery
                          </button>
                          {formData.image && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: '' })}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                              title="Remove main image"
                            >
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                      <label className="relative aspect-video rounded-xl overflow-hidden border-2 border-orange-600/20 bg-white group cursor-pointer block hover:border-orange-600 transition-colors">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDirectUpload(e, 'main')} />
                        {directUploadProgress?.type === 'main' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                            <Loader2 size={20} className="text-orange-600 animate-spin mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-orange-600">Uploading...</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                            <Upload size={18} className="text-white" />
                          </div>
                        )}
                        {formData.image ? (
                          <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                            <Upload size={22} className="mb-1" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Upload / Select</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Gallery Images */}
                    {formData.images.map((img: string, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Photo {idx + 1}</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => openPicker('gallery', idx)}
                              className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                            >
                              Gallery
                            </button>
                            <button type="button" onClick={() => handleRemoveImage(idx)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                        <label className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-white group cursor-pointer block hover:border-orange-600 transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDirectUpload(e, 'gallery', idx)} />
                          {directUploadProgress?.type === 'gallery' && directUploadProgress.index === idx ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                              <Loader2 size={20} className="text-orange-600 animate-spin" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                              <Upload size={18} className="text-white" />
                            </div>
                          )}
                          {img ? (
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                              <Upload size={22} className="mb-1" />
                              <span className="text-[8px] font-bold uppercase tracking-widest">Upload / Select</span>
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="h-px bg-gray-100 flex-grow" />
                   <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Standard Specifications</h3>
                   <div className="h-px bg-gray-100 flex-grow" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map(spec => {
                  const isHidden = formData.hiddenSpecs?.includes(spec.key);
                  return (
                    <div key={spec.key} className={`relative bg-gray-50 border border-gray-100 rounded-2xl p-4 transition-opacity ${isHidden ? 'opacity-40' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase">
                          {spec.label}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newHidden = isHidden
                              ? (formData.hiddenSpecs || []).filter((k: string) => k !== spec.key)
                              : [...(formData.hiddenSpecs || []), spec.key];
                            setFormData({ ...formData, hiddenSpecs: newHidden });
                          }}
                          className="text-gray-300 hover:text-orange-600 transition-colors bg-white p-1 rounded-md shadow-sm"
                          title={isHidden ? 'Show this spec for this vehicle' : 'Hide this spec for this vehicle'}
                        >
                          {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                      {spec.key === 'fuel' ? (
                        <select 
                          value={formData[spec.key] || ''} 
                          onChange={(e) => setFormData({ ...formData, [spec.key]: e.target.value })} 
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 font-bold text-sm focus:border-orange-600 focus:outline-none transition-all"
                          disabled={isHidden}
                        >
                          <option value="">Select</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Electric">Electric</option>
                        </select>
                      ) : spec.key === 'transmission' ? (
                        <select 
                          value={formData[spec.key] || ''} 
                          onChange={(e) => setFormData({ ...formData, [spec.key]: e.target.value })} 
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 font-bold text-sm focus:border-orange-600 focus:outline-none transition-all"
                          disabled={isHidden}
                        >
                          <option value="">Select</option>
                          <option value="Auto">Auto</option>
                          <option value="Manual">Manual</option>
                          <option value="Tiptronic">Tiptronic</option>
                          <option value="N/A">N/A</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <input 
                          type={spec.key === 'seats' ? 'number' : 'text'} 
                          value={formData[spec.key] || ''} 
                          onChange={(e) => setFormData({ ...formData, [spec.key]: e.target.value })} 
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 font-bold text-sm focus:border-orange-600 focus:outline-none transition-all"
                          disabled={isHidden}
                        />
                      )}
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Per-Vehicle Custom Specifications */}
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600/10 rounded-xl flex items-center justify-center">
                      <Plus size={14} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Custom Specifications</h3>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">Extra details unique to this vehicle (e.g. sunroof, warranty)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomSpec(true)}
                    className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2"
                  >
                    <Plus size={12} /> Add Spec
                  </button>
                </div>

                {/* Existing custom specs as cards */}
                {(formData.customSpecs || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(formData.customSpecs as { key: string; label: string; value: string }[]).map((cs, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start justify-between gap-3 group hover:border-orange-200 transition-colors">
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{cs.label}</p>
                          <p className="text-sm font-bold text-gray-800 mt-1 truncate">{cs.value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.customSpecs || [])];
                            updated.splice(idx, 1);
                            setFormData({ ...formData, customSpecs: updated });
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  !showAddCustomSpec && (
                    <div className="text-center py-6 text-gray-300">
                      <p className="text-[10px] font-black uppercase tracking-widest">No custom specs yet — click &quot;Add Spec&quot; above</p>
                    </div>
                  )
                )}

                {/* Add new custom spec form */}
                {showAddCustomSpec && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-4">
                    <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">New Specification</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Label (e.g. Sunroof)</label>
                        <input
                          type="text"
                          value={newCustomSpec.label}
                          onChange={e => setNewCustomSpec({ ...newCustomSpec, label: e.target.value })}
                          placeholder="e.g. Sunroof, Warranty, Battery Range"
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-orange-600 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Value (e.g. Panoramic)</label>
                        <input
                          type="text"
                          value={newCustomSpec.value}
                          onChange={e => setNewCustomSpec({ ...newCustomSpec, value: e.target.value })}
                          placeholder="e.g. Panoramic, 3 Years, 600km"
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-orange-600 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCustomSpec.label.trim() || !newCustomSpec.value.trim()) return;
                          const key = newCustomSpec.label.trim().toLowerCase().replace(/\s+/g, '_');
                          const updated = [...(formData.customSpecs || []), { key, label: newCustomSpec.label.trim(), value: newCustomSpec.value.trim() }];
                          setFormData({ ...formData, customSpecs: updated });
                          setNewCustomSpec({ label: '', value: '' });
                          setShowAddCustomSpec(false);
                        }}
                        className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all"
                      >
                        <Plus size={14} /> Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddCustomSpec(false); setNewCustomSpec({ label: '', value: '' }); }}
                        className="px-5 py-2.5 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={12}
                    placeholder="Write a detailed description of this vehicle — features, condition, history, extras..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-5 text-gray-900 font-medium focus:border-orange-600 focus:outline-none transition-all text-sm leading-relaxed resize-y"
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
        </div>
      )}

      {/* Gallery Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[10000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl w-full h-full" onClick={() => setIsPickerOpen(false)} />
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

      {/* ── Delete Confirmation Dialog ──────────────────────────────────────── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2 uppercase tracking-tighter">Delete Vehicle?</h3>
            <p className="text-gray-500 text-sm text-center mb-8 font-medium">This cannot be undone. The vehicle will be permanently removed from inventory.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
     </div>
  );
}
