'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck,
  Car,
  Image as ImageIcon,
  DollarSign,
  Settings as SettingsIcon,
  ShieldCheck,
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';

// Resolve relative backend image paths (local upload fallback) to absolute URLs
const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
function resolveImgUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/public/') || url.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${url}`;
  }
  return url;
}

interface VehicleFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const PASSENGER_CATEGORIES = [
  'SUVs & 4x4',
  'Land Cruiser Family',
  'Luxury & Performance',
  'Vans & MPVs',
  'Sedans & Hatchbacks',
  'Kei Cars',
  'Coupes & Convertibles',
  'Hybrid & Electric'
];

const COMMERCIAL_CATEGORIES = [
  'Trucks (Medium & Heavy Duty)',
  'Light Commercial Vehicles (1.5T – 3.5T)',
  'Dump Trucks & Hydraulic Tippers',
  'Refrigerated & Cold Chain Freezers',
  'Box Trucks & Wing-Body Vans',
  'Buses & Long-Distance Coaches',
  'Minibuses & Commuters (14–29 Seats)',
  'Commercial Pickup Trucks (4x4)',
  'Special Purpose & Crane Trucks'
];

const JAPAN_PORTS = [
  'FOB Yokohama',
  'FOB Nagoya',
  'FOB Kobe',
  'FOB Tokyo',
  'FOB Osaka',
  'FOB Hakata',
  'CIF Destination Port'
];

const CONDITION_GRADES = [
  'Grade S/A (Brand New)',
  'Grade 5.0 (Near Mint / Pristine)',
  'Grade 4.5 (Excellent Condition)',
  'Grade 4.0 (Very Good / Clean)',
  'Grade 3.5 (Good / Daily Driver)',
  'Grade R / RA (Repaired to Standard)'
];

const POPULAR_MAKES = [
  'Toyota',
  'Lexus',
  'Honda',
  'Nissan',
  'Suzuki',
  'Mazda',
  'Mitsubishi',
  'Subaru',
  'Daihatsu',
  'Isuzu',
  'Hino',
  'Mitsubishi Fuso',
  'UD Trucks',
  'Mercedes-Benz',
  'Porsche',
  'BMW'
];

export function VehicleForm({ initialData, isEdit = false }: VehicleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [vehicleType, setVehicleType] = useState<'Vehicles' | 'Commercial Vehicles'>(
    initialData?.vehicleType ||
    (initialData?.bodyType?.includes('Commercial') || initialData?.bodyType?.includes('Truck')
      ? 'Commercial Vehicles'
      : 'Vehicles')
  );

  const [formData, setFormData] = useState({
    stockId: initialData?.stockId || `MCJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    make: initialData?.make || 'Toyota',
    model: initialData?.model || '',
    modelCode: initialData?.modelCode || '',
    grade: initialData?.grade || '',
    year: initialData?.year || new Date().getFullYear(),
    name: initialData?.name || '',
    category: initialData?.category || (vehicleType === 'Vehicles' ? 'SUVs & 4x4' : 'Trucks (Medium & Heavy Duty)'),
    bodyType: initialData?.bodyType || 'SUVs & 4x4',
    conditionGrade: initialData?.conditionGrade || 'Grade S/A (Brand New)',
    inspectionStatus: initialData?.inspectionStatus || 'Makers Certified 150-Point & JEVIC Passed',
    mileageKm: initialData?.mileageKm ?? 25,
    fuel: initialData?.fuel || 'Petrol',
    transmission: initialData?.transmission || 'Automatic',
    engineCc: initialData?.engineCc ?? 1500,
    drivetrain: initialData?.drivetrain || '2WD',
    steering: initialData?.steering || 'RHD',
    seats: initialData?.seats ?? 5,
    doors: initialData?.doors ?? 5,
    color: initialData?.color || initialData?.exteriorColor || 'Pearl White',
    interiorColor: initialData?.interiorColor || 'Black',
    priceUSD: initialData?.priceUSD ?? 35000,
    priceType: initialData?.priceType || 'FOB',
    fobPort: initialData?.fobPort || initialData?.priceFOB?.port || 'FOB Yokohama',
    destinationMarket: initialData?.destinationMarket || 'Global',
    destinationPort: initialData?.destinationPort || '',
    availability: initialData?.availability || 'Available in Japan Yard',
    status: initialData?.status || 'Available',
    isFeatured: Boolean(initialData?.isFeatured),
    isPublished: initialData?.isPublished !== undefined ? Boolean(initialData?.isPublished) : true,
    overview: initialData?.overview || '',
    description: initialData?.description || '',
    keyFeatures: initialData?.keyFeatures?.length
      ? initialData.keyFeatures
      : [
          'Genuine Japanese Vehicle Sourcing',
          'Independent Third-Party Pre-Export Inspection Passed',
          'Original MLIT Deregistration Certificate Available',
          'Direct Tokyo & Yokohama Port Dispatch'
        ],
    images: initialData?.images?.length
      ? initialData.images
      : initialData?.image
      ? [initialData.image]
      : [] as string[],
    // Commercial Specs
    commercialBodyType: initialData?.commercialSpecs?.commercialBodyType || initialData?.commercialBodyType || '',
    payloadCapacity: initialData?.commercialSpecs?.payloadCapacity || initialData?.payloadCapacity || '',
    grossVehicleWeight: initialData?.commercialSpecs?.grossVehicleWeight || initialData?.grossVehicleWeight || '',
    dimensions: initialData?.commercialSpecs?.dimensions || { length: '', width: '', height: '' },
    wheelbase: initialData?.commercialSpecs?.wheelbase || '',
    axles: initialData?.commercialSpecs?.axles || '',
    exportNotes: initialData?.exportNotes || ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-generate vehicle title if user hasn't typed a custom one
  useEffect(() => {
    if (!isEdit && formData.make && formData.model) {
      const generated = `${formData.year} ${formData.make} ${formData.model} ${formData.grade}`.trim();
      setFormData((prev) => ({ ...prev, name: generated }));
    }
  }, [formData.make, formData.model, formData.grade, formData.year, isEdit]);

  const handleTypeSwitch = (type: 'Vehicles' | 'Commercial Vehicles') => {
    setVehicleType(type);
    setFormData((prev) => ({
      ...prev,
      category: type === 'Vehicles' ? PASSENGER_CATEGORIES[0] : COMMERCIAL_CATEGORIES[0],
      bodyType: type === 'Vehicles' ? 'SUVs & 4x4' : 'Trucks & Commercial'
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fd = new FormData();
        fd.append('photos', file);
        fd.append('category', 'Vehicle');

        const res = await fetch(`${apiUrl}/media`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd
        });
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          uploadedUrls.push(data.data[0].url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        setStatusMessage({
          type: 'success',
          text: `Successfully uploaded ${uploadedUrls.length} vehicle photograph(s).`
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Image upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [selected] = imgs.splice(index, 1);
      return { ...prev, images: [selected, ...imgs] };
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (publishState: boolean) => {
    if (!formData.name.trim() || !formData.make.trim() || !formData.model.trim()) {
      setStatusMessage({ type: 'error', text: 'Vehicle Title, Brand, and Model are required.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const payload = {
      ...formData,
      vehicleType,
      isPublished: publishState,
      status: publishState ? formData.status : 'Draft',
      price: `USD ${Number(formData.priceUSD).toLocaleString()}`,
      priceFOB: `USD ${Number(formData.priceUSD).toLocaleString()}`,
      mileage: `${Number(formData.mileageKm).toLocaleString()} km`,
      image: formData.images[0] || '/images/vehicle.jpg',
      commercialSpecs: vehicleType === 'Commercial Vehicles' ? {
        commercialBodyType: formData.commercialBodyType,
        payloadCapacity: formData.payloadCapacity,
        grossVehicleWeight: formData.grossVehicleWeight,
        dimensions: formData.dimensions,
        wheelbase: formData.wheelbase,
        axles: formData.axles
      } : undefined
    };

    try {
      const endpoint = isEdit
        ? `${apiUrl}/vehicles/${initialData._id || initialData.id}`
        : `${apiUrl}/vehicles`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: isEdit ? 'Vehicle updated successfully!' : 'Vehicle published to inventory successfully!'
        });
        setTimeout(() => {
          router.push('/admin/vehicles');
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Operation failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Network communication error.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vehicles"
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  MAKERS CORP JAPAN · VEHICLE DESK
                </span>
                <span className="text-xs px-2 py-0.5 bg-[#fff4eb] text-[#ff6a00] font-bold rounded-md border border-[#ffd1ad]">
                  {isEdit ? 'EDIT VEHICLE' : 'ADD NEW VEHICLE'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight leading-none mt-0.5">
                {formData.name || 'Untitled Japanese Vehicle'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {initialData?.slug && (
              <a
                href={`/vehicles/${initialData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <span>Live View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-[#ff6a00] hover:bg-[#e55f00] rounded-lg transition-colors shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Vehicle' : 'Publish Vehicle'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Status Notification Alert */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-semibold">{statusMessage.text}</span>
          </div>
        )}

        {/* =========================================================================
            PRIMARY VEHICLE TYPE SELECTOR (PASSENGER VEHICLES vs. COMMERCIAL VEHICLES)
            ========================================================================= */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                STEP 01 · VEHICLE DIVISION
              </span>
              <h2 className="text-base font-black text-neutral-900">Select Vehicle Division Type</h2>
            </div>
            <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
              Form specifications update dynamically
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeSwitch('Vehicles')}
              className={`p-4 rounded-xl text-left border-2 transition-all flex items-center gap-4 ${
                vehicleType === 'Vehicles'
                  ? 'border-[#ff6a00] bg-[#fff8f2] shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  vehicleType === 'Vehicles' ? 'bg-[#ff6a00] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-neutral-900">PASSENGER VEHICLES</span>
                  {vehicleType === 'Vehicles' && (
                    <span className="text-[10px] bg-[#ff6a00] text-white font-bold px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  SUVs & 4x4, Land Cruiser, Sedans, Luxury, Kei Cars, Hatchbacks, MPVs
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSwitch('Commercial Vehicles')}
              className={`p-4 rounded-xl text-left border-2 transition-all flex items-center gap-4 ${
                vehicleType === 'Commercial Vehicles'
                  ? 'border-[#ff6a00] bg-[#fff8f2] shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  vehicleType === 'Commercial Vehicles' ? 'bg-[#ff6a00] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-neutral-900">COMMERCIAL VEHICLES</span>
                  {vehicleType === 'Commercial Vehicles' && (
                    <span className="text-[10px] bg-[#ff6a00] text-white font-bold px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Isuzu, Hino, Fuso, UD Trucks · Tippers, Freezers, Heavy Duty & Buses
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* SECTION A: Basic Vehicle Information */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100">
                <FileText className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  SECTION A · Basic Vehicle Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Brand / Make */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    MAKE / BRAND *
                  </label>
                  <select
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    {POPULAR_MAKES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    MODEL NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Land Cruiser, Raize, Elf, Canter"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Grade / Trim */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    GRADE / TRIM
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. ZX, GR Sport, Custom, 2.0T High Deck"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Model Code */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    JDM MODEL CODE
                  </label>
                  <input
                    type="text"
                    value={formData.modelCode}
                    onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                    placeholder="e.g. 3BA-VJA300W, 5BA-A200A, NMR85"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 font-mono focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Manufacturing Year */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    MANUFACTURING YEAR *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    min={1990}
                    max={2030}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Stock ID */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    STOCK REFERENCE ID *
                  </label>
                  <input
                    type="text"
                    value={formData.stockId}
                    onChange={(e) => setFormData({ ...formData, stockId: e.target.value })}
                    placeholder="MCJ-2026-XXXX"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 font-mono font-bold focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Category Selection */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    VEHICLE CATEGORY *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, bodyType: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] font-semibold"
                  >
                    {(vehicleType === 'Vehicles' ? PASSENGER_CATEGORIES : COMMERCIAL_CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Title */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    PUBLIC VEHICLE TITLE *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 2026 Toyota Land Cruiser 300 ZX (3BA-VJA300W)"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Overview Text */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    SHORT OVERVIEW / SUMMARY
                  </label>
                  <input
                    type="text"
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Brief 1-sentence summary shown on cards and headers"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Full Description */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    FULL VEHICLE DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed condition assessment, export options, interior appointments, and maintenance history."
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: Technical Specifications */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100">
                <SettingsIcon className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  SECTION B · Technical Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Engine Capacity */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    ENGINE CC
                  </label>
                  <input
                    type="number"
                    value={formData.engineCc}
                    onChange={(e) => setFormData({ ...formData, engineCc: Number(e.target.value) })}
                    placeholder="e.g. 1498"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    FUEL TYPE
                  </label>
                  <select
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    TRANSMISSION
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="Automatic">Automatic (AT / CVT)</option>
                    <option value="Manual">Manual (5MT / 6MT)</option>
                    <option value="Dual-Clutch">Dual-Clutch (DCT)</option>
                  </select>
                </div>

                {/* Drivetrain */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    DRIVETRAIN
                  </label>
                  <select
                    value={formData.drivetrain}
                    onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="2WD">2WD (FWD / RWD)</option>
                    <option value="4WD">4WD (Selectable / Full-Time)</option>
                    <option value="AWD">AWD (All-Wheel Drive)</option>
                  </select>
                </div>

                {/* Mileage km */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    MILEAGE (KM) *
                  </label>
                  <input
                    type="number"
                    value={formData.mileageKm}
                    onChange={(e) => setFormData({ ...formData, mileageKm: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Steering */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    STEERING POSITION
                  </label>
                  <select
                    value={formData.steering}
                    onChange={(e) => setFormData({ ...formData, steering: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="RHD">Right-Hand Drive (RHD)</option>
                    <option value="LHD">Left-Hand Drive (LHD)</option>
                  </select>
                </div>

                {/* Exterior Color */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    EXTERIOR COLOUR
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g. Pearl White, Attitude Black"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Seats & Doors */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    SEATING CAPACITY
                  </label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    min={1}
                    max={60}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Condition Grade */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    AUCTION / CONDITION GRADE
                  </label>
                  <select
                    value={formData.conditionGrade}
                    onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    {CONDITION_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inspection Status */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    INSPECTION & VERIFICATION STATUS
                  </label>
                  <input
                    type="text"
                    value={formData.inspectionStatus}
                    onChange={(e) => setFormData({ ...formData, inspectionStatus: e.target.value })}
                    placeholder="Makers Certified 150-Point & JEVIC Passed"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: Commercial Vehicle Specifications (Conditional) */}
            {vehicleType === 'Commercial Vehicles' && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-amber-200">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                    SECTION C · Commercial Fleet & Logistics Specifications
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                      COMMERCIAL BODY TYPE
                    </label>
                    <input
                      type="text"
                      value={formData.commercialBodyType}
                      onChange={(e) => setFormData({ ...formData, commercialBodyType: e.target.value })}
                      placeholder="e.g. Hydraulic Tipper, Aluminum Wing Van, Flatbed"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                      PAYLOAD CAPACITY
                    </label>
                    <input
                      type="text"
                      value={formData.payloadCapacity}
                      onChange={(e) => setFormData({ ...formData, payloadCapacity: e.target.value })}
                      placeholder="e.g. 2.0 Ton, 4.0 Ton, 10.0 Ton"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                      GROSS VEHICLE WEIGHT (GVW)
                    </label>
                    <input
                      type="text"
                      value={formData.grossVehicleWeight}
                      onChange={(e) => setFormData({ ...formData, grossVehicleWeight: e.target.value })}
                      placeholder="e.g. 5,500 kg, 8,000 kg"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                      WHEELBASE
                    </label>
                    <input
                      type="text"
                      value={formData.wheelbase}
                      onChange={(e) => setFormData({ ...formData, wheelbase: e.target.value })}
                      placeholder="e.g. 2,500 mm / Standard / Long"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                      NUMBER OF AXLES
                    </label>
                    <input
                      type="text"
                      value={formData.axles}
                      onChange={(e) => setFormData({ ...formData, axles: e.target.value })}
                      placeholder="e.g. 2-Axle (4x2), 3-Axle (6x4)"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION E: Vehicle Photographs */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ff6a00]" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                    SECTION E · Vehicle Photographs ({formData.images.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload Photos</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {formData.images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 hover:border-[#ff6a00] rounded-xl p-8 text-center cursor-pointer transition-colors bg-neutral-50/50"
                >
                  <ImageIcon className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-800">
                    Click to upload high-resolution vehicle photographs
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Supports JPG, PNG, WEBP. First uploaded photo serves as the primary card cover image.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200"
                    >
                      <Image
                        src={resolveImgUrl(img)}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-[#ff6a00] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                            COVER
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(idx)}
                            className="p-1.5 bg-white/90 hover:bg-white text-neutral-900 rounded text-[10px] font-bold"
                            title="Set as Main Cover"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Features Bullet List */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  Key Verification & Specification Bullets
                </h3>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Leather Ventilated Seats, Adaptive Radar Cruise, Sunroof"
                  className="flex-grow bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-neutral-900 hover:bg-[#ff6a00] text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Add Bullet
                </button>
              </div>

              <div className="space-y-2">
                {formData.keyFeatures.map((feat: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  >
                    <span className="text-neutral-800 font-medium">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-neutral-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Pricing, Export, & Publishing Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* SECTION D: Pricing & Export Information */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100">
                <DollarSign className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  SECTION D · Pricing & Export Port
                </h3>
              </div>

              <div className="space-y-4">
                {/* Price USD */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    PRICE (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                      min={0}
                      className="w-full bg-white border border-neutral-300 rounded-lg pl-7 pr-3 py-2 text-sm text-neutral-900 font-black focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Displays on public vehicle card and detail page
                  </span>
                </div>

                {/* Price Type */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    PRICE BASIS / INCOTERMS
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="FOB">FOB (Free on Board - Japan Port)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                  </select>
                </div>

                {/* Departure Port */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    DEPARTURE PORT IN JAPAN
                  </label>
                  <select
                    value={formData.fobPort}
                    onChange={(e) => setFormData({ ...formData, fobPort: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] font-semibold"
                  >
                    {JAPAN_PORTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Market */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    TARGET DESTINATION
                  </label>
                  <select
                    value={formData.destinationMarket}
                    onChange={(e) => setFormData({ ...formData, destinationMarket: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="Global">Global Showroom (All Markets)</option>
                    <option value="India">India (Nhava Sheva / Chennai)</option>
                    <option value="Sri Lanka">Sri Lanka (Colombo Port)</option>
                    <option value="Kenya">Kenya (Mombasa Port)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Tanzania">Tanzania (Dar es Salaam)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION F: Publishing & Website Display */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100">
                <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  SECTION F · Publishing Controls
                </h3>
              </div>

              <div className="space-y-4">
                {/* Yard Availability Status */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    YARD AVAILABILITY STATUS
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        availability: val,
                        status: val.includes('Sold') ? 'Sold' : val.includes('Reserved') ? 'Reserved' : 'Available'
                      });
                    }}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] font-bold"
                  >
                    <option value="Available in Japan Yard">Available in Japan Yard</option>
                    <option value="Reserved">Reserved (Deposit Received)</option>
                    <option value="Sold">Sold (Export Dispatched)</option>
                  </select>
                </div>

                {/* Featured Status Toggle */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Featured Vehicle</span>
                    <span className="text-[11px] text-neutral-500 block">
                      Display on homepage Latest Vehicles showcase
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6a00]" />
                  </label>
                </div>

                {/* Publication Status Toggle */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Published Publicly</span>
                    <span className="text-[11px] text-neutral-500 block">
                      Toggle live visibility on website showroom
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
