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
  [key: string]: any;
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

let cachedSpecs: SpecSetting[] | null = null;

export function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [specSettings, setSpecSettings] = useState<SpecSetting[]>(cachedSpecs || FALLBACK_SPECS);
  const [specsLoaded, setSpecsLoaded] = useState(!!cachedSpecs);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [vehicle?._id]);

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
      .catch(() => {})
      .finally(() => setSpecsLoaded(true));
  }, []);

  if (!vehicle) return null;

  const allImages = [vehicle.image, ...(vehicle.images || [])].filter(Boolean);

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const visibleSpecs = specSettings
    .filter(s => s.visible && !(vehicle.hiddenSpecs || []).includes(s.key))
    .map(s => {
      const IconComponent = ICON_MAP[s.icon] || Info;
      const value = vehicle[s.key];
      const displayValue = (value !== undefined && value !== null && value !== '') ? String(value) : 'N/A';
      return { icon: IconComponent, label: s.label, value: displayValue };
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal — wide, fixed height, two-column flex */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-[98vw] lg:w-[92vw] xl:w-[88vw] max-w-[1500px] h-[92vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* ── Close Button ── */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-full z-[60] transition-all group shadow-lg hover:shadow-xl active:scale-90"
            >
              <X size={20} className="text-dark group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* ── LEFT: Full-height image panel (no scroll) ── */}
            <div className="relative w-full lg:w-[52%] h-[260px] sm:h-[340px] lg:h-full bg-gray-950 flex-shrink-0 overflow-hidden">
              {/* Main image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={allImages[activeImageIndex]}
                    alt={`${vehicle.name} - Image ${activeImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 z-20"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 z-20"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Thumbnail strip */}
                  <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-2xl max-w-[88%] overflow-x-auto no-scrollbar z-20">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-primary scale-110 shadow-lg shadow-primary/30'
                            : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                      >
                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Status badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                  {vehicle.status}
                </span>
              </div>

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute top-5 right-16 z-20">
                  <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-black rounded-full">
                    {activeImageIndex + 1} / {allImages.length}
                  </span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Scrollable details panel ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 lg:p-12 xl:p-14">
              {/* Vehicle name & price */}
              <div className="mb-8">
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Premium Selection</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-black text-dark uppercase tracking-tighter leading-none mb-6">
                  {vehicle.name}
                </h2>
                <div className="flex items-end gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Price</span>
                    <span className="text-3xl sm:text-4xl font-black text-primary leading-none">
                      {vehicle.price.toUpperCase().includes('LKR') ? vehicle.price : `LKR ${vehicle.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spec grid */}
              {visibleSpecs.length > 0 ? (
                <div className={`grid gap-3 mb-8 ${
                  visibleSpecs.length <= 4
                    ? 'grid-cols-2'
                    : visibleSpecs.length <= 6
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {visibleSpecs.map((spec, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors">
                      <spec.icon className="w-5 h-5 text-primary mb-2.5" />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1 truncate" title={spec.label}>
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-dark truncate">{spec.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8 py-6 text-center text-gray-300 text-xs font-black uppercase tracking-widest">
                  No specifications configured
                </div>
              )}

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-dark uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Overview
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium italic whitespace-pre-line text-sm">
                  {vehicle.description || 'This premium Japanese vehicle has been carefully inspected and is ready for import. Our team handles all documentation, auction bidding, and shipping directly to your doorstep in Sri Lanka.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    onClose();
                    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-primary/25 active:scale-95"
                >
                  <CheckCircle2 size={20} />
                  Reserve Vehicle
                </button>
                <a
                  href={`https://wa.me/94771234567?text=Hi, I am interested in the ${vehicle.name}. Please send more details and auction sheets.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-dark hover:bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-black/15 active:scale-95"
                >
                  <MessageCircle size={20} className="text-green-400" />
                  WhatsApp Us
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 sm:gap-10 justify-center py-5 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auction Verified</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ready to Ship</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
