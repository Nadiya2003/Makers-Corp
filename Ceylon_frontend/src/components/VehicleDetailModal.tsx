'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Fuel, 
  Gauge, 
  Settings, 
  Users, 
  Palette, 
  Zap,
  Info,
  CheckCircle2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Award,
  Layers,
  Cpu,
  Disc,
  Radio,
  Compass,
  Activity,
  Tag,
  Box,
  Package,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

// ─── Icon name → lucide component map ──────────────────────────────────────
const ICON_MAP: Record<string, any> = {
  Calendar, Fuel, Settings, Zap, Gauge, Info, Users, Palette,
  Star, Shield, Award, Layers, Cpu, Disc, Radio, Compass,
  Activity, Tag, Box, Package
};

interface Vehicle {
  _id: string;
  name: string;
  image: string;
  images?: string[];
  year: string;
  fuel: string;
  mileage: string;
  price: string;
  engine: string;
  transmission: string;
  drive: string;
  seats: number;
  color: string;
  description: string;
  status: string;
  category?: string;
  [key: string]: any; // allows custom spec keys
}

interface SpecSetting {
  key: string;
  label: string;
  icon: string;
  visible: boolean;
  isDefault: boolean;
  order: number;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

// Default specs used as fallback if API call fails
const FALLBACK_SPECS: SpecSetting[] = [
  { key: 'year',         label: 'Year',         icon: 'Calendar', visible: true, isDefault: true, order: 0 },
  { key: 'fuel',         label: 'Fuel Type',    icon: 'Fuel',     visible: true, isDefault: true, order: 1 },
  { key: 'transmission', label: 'Transmission', icon: 'Settings', visible: true, isDefault: true, order: 2 },
  { key: 'engine',       label: 'Engine',       icon: 'Zap',      visible: true, isDefault: true, order: 3 },
  { key: 'mileage',      label: 'Mileage',      icon: 'Gauge',    visible: true, isDefault: true, order: 4 },
  { key: 'drive',        label: 'Drive Type',   icon: 'Info',     visible: true, isDefault: true, order: 5 },
  { key: 'seats',        label: 'Seats',        icon: 'Users',    visible: true, isDefault: true, order: 6 },
  { key: 'color',        label: 'Color',        icon: 'Palette',  visible: true, isDefault: true, order: 7 },
];

// Cache the spec settings for the lifetime of the page session
let cachedSpecs: SpecSetting[] | null = null;

export function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [specSettings, setSpecSettings] = useState<SpecSetting[]>(cachedSpecs || FALLBACK_SPECS);
  const [specsLoaded, setSpecsLoaded] = useState(!!cachedSpecs);

  // Reset image index when vehicle changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [vehicle?._id]);

  // Fetch spec visibility settings once (cached)
  useEffect(() => {
    if (cachedSpecs) return;
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
    fetch(`${apiUrl}/settings/vehicle-specs`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const sorted = [...data.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          cachedSpecs = sorted;
          setSpecSettings(sorted);
        }
      })
      .catch(() => {
        // silently fall back to defaults
      })
      .finally(() => setSpecsLoaded(true));
  }, []);

  if (!vehicle) return null;

  const allImages = [vehicle.image, ...(vehicle.images || [])].filter(Boolean);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Build visible spec items dynamically from admin settings
  const visibleSpecs = specSettings
    .filter(s => s.visible && !(vehicle.hiddenSpecs || []).includes(s.key))
    .map(s => {
      const IconComponent = ICON_MAP[s.icon] || Info;
      const value = vehicle[s.key];
      // Format value: undefined/null/empty → 'N/A'
      const displayValue = (value !== undefined && value !== null && value !== '') ? String(value) : 'N/A';
      return { icon: IconComponent, label: s.label, value: displayValue };
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-6xl rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative z-10 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-4 bg-white/80 hover:bg-white backdrop-blur-md rounded-full z-[60] transition-colors group shadow-md"
            >
              <X size={20} className="text-dark group-hover:rotate-90 transition-transform" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section - Interactive Gallery */}
              <div className="relative h-[280px] sm:h-[380px] lg:h-auto min-h-[280px] sm:min-h-[380px] lg:min-h-[450px] bg-gray-900 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={allImages[activeImageIndex]}
                      alt={`${vehicle.name} - Image ${activeImageIndex + 1}`}
                      fill
                      className="object-contain lg:object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Thumbnails Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-2xl max-w-[90%] overflow-x-auto no-scrollbar">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                            activeImageIndex === idx ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt="Thumbnail" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  <span className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                    {vehicle.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-10 lg:p-16">
                <div className="mb-10">
                  <div className="flex flex-col mb-4">
                    <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-2">Premium Selection</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-dark uppercase tracking-tighter leading-none">
                      {vehicle.name}
                    </h2>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Price</span>
                       <span className="text-4xl font-black text-primary leading-none">
                         {vehicle.price.toUpperCase().includes('LKR') ? vehicle.price : `LKR ${vehicle.price}`}
                       </span>
                    </div>
                    {/^\d+(,\d+)*$/.test(vehicle.price.trim()) && (
                      <span className="text-lg font-bold text-gray-300 line-through decoration-primary/30 mb-1">
                        LKR {(parseInt(vehicle.price.replace(/,/g, '')) * 1.08).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dynamic spec grid — respects admin visibility settings */}
                {visibleSpecs.length > 0 ? (
                  <div className={`grid gap-3 sm:gap-4 mb-8 sm:mb-12 ${
                    visibleSpecs.length <= 4
                      ? 'grid-cols-2'
                      : visibleSpecs.length <= 6
                      ? 'grid-cols-2 sm:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}>
                    {visibleSpecs.map((spec, idx) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-primary/20 transition-colors">
                        <spec.icon className="w-5 h-5 text-primary mb-3" />
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{spec.label}</p>
                        <p className="text-[13px] font-bold text-dark truncate">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8 py-6 text-center text-gray-300 text-xs font-black uppercase tracking-widest">
                    No specifications configured
                  </div>
                )}

                <div className="mb-12">
                  <h3 className="text-xs font-black text-dark uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Professional Overview
                  </h3>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
                    <p className="text-gray-500 leading-relaxed font-medium pl-2 italic">
                      {vehicle.description || 'This premium Japanese vehicle has been carefully inspected and is ready for import. Our team handles all documentation, auction bidding, and shipping directly to your doorstep in Sri Lanka.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={() => {
                      onClose();
                      document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-grow flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white py-6 rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 active:scale-95"
                  >
                    <CheckCircle2 size={20} />
                    Reserve Vehicle
                  </button>
                  <a
                    href={`https://wa.me/94771234567?text=Hi, I am interested in the ${vehicle.name}. Please send more details and auction sheets.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow flex items-center justify-center gap-3 bg-dark hover:bg-black text-white py-6 rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-black/20 active:scale-95"
                  >
                    <MessageCircle size={20} className="text-green-500" />
                    WhatsApp Us
                  </a>
                </div>

                <div className="mt-10 flex items-center gap-8 justify-center py-6 border-t border-gray-100">
                   <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auction Verified</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ready to Ship</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
