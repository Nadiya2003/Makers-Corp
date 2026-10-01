'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Settings, ArrowRight, Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { VehicleDetailModal } from '@/components/VehicleDetailModal';
import { normalizeImageUrl } from '@/lib/imageUtils';

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
}

// ─── Reusable Vehicle Card ────────────────────────────────────────────────────
function VehicleCard({ vehicle, onQuickView }: { vehicle: Vehicle; onQuickView: () => void }) {
  return (
    <div className="group relative h-full flex flex-col bg-white rounded-none p-3.5 sm:p-4 border border-gray-200/90 hover:border-primary shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Top showroom accent indicator on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Vehicle Image Container - Sharp Square Box */}
      <div className="relative h-[220px] sm:h-[260px] rounded-none overflow-hidden bg-gray-100 mb-4 flex-shrink-0 border border-gray-100">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          draggable={false}
        />
        {/* Quick View Overlay Button - Sharp Square */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button
            onClick={onQuickView}
            className="w-full bg-white/95 backdrop-blur-md text-dark py-3.5 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all active:scale-[0.98] border border-white/60 shadow-lg"
          >
            Quick View
          </button>
        </div>
        {/* Year Model Badge - Sharp Showroom Spec Plaque */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-none text-[9px] font-black text-dark uppercase tracking-widest border-l-2 border-primary shadow-sm">
            {vehicle.year} Model
          </span>
        </div>
      </div>

      <div className="px-1 pb-1 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-display font-black text-lg text-dark leading-tight uppercase group-hover:text-primary transition-colors mb-3 line-clamp-1">
            {vehicle.name}
          </h4>

          {/* Specifications Box - Sharp Rectangular Division */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50/80 backdrop-blur-sm rounded-none border border-gray-200/60">
            <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500 border-r border-gray-200">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold uppercase truncate">{vehicle.fuel}</span>
            </div>
            <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500">
              <Settings className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold uppercase truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Button - Sharp Square */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
            <span className="text-lg font-black text-primary leading-none">
              {/^(USD|JPY|EUR|GBP|AUD|LKR)/i.test(vehicle.price.trim()) ? vehicle.price : `LKR ${vehicle.price}`}
            </span>
          </div>
          <button
            onClick={onQuickView}
            aria-label="View vehicle details"
            className="w-10 h-10 rounded-none bg-gray-100 flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white transition-all duration-300 active:scale-95 border border-gray-200/60 group-hover:border-primary"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}


export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'auction' | 'commercial'>('auction');

  // ── HOOKS FOR CAROUSEL ──────────────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(4); // starts at visibleCount
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch data
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
        const baseUrl = apiUrl.replace(/\/api$/, '');
        const getImageUrl = (url: string) => {
          if (!url) return '';
          if (url.startsWith('http')) return normalizeImageUrl(url);
          return normalizeImageUrl(`${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`);
        };

        const endpoint = activeTab === 'auction' ? '/vehicles' : '/commercial-vehicles';
        const response = await axios.get(`${apiUrl}${endpoint}`);
        if (response.data.success) {
          const processedVehicles = response.data.data.map((v: any) => ({
            ...v,
            image: getImageUrl(v.image),
            images: v.images ? v.images.map((img: string) => getImageUrl(img)) : []
          }));
          setVehicles(processedVehicles);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load featured vehicles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [activeTab]);

  // Detect screen size & set visibleCount
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setVisibleCount(4);
      else if (w >= 1024) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync currentIndex when visibleCount changes
  useEffect(() => {
    setCurrentIndex(visibleCount);
  }, [visibleCount]);

  const n = vehicles.length;

  // Build clones using modulo for infinite scroll
  const clonesBefore: Vehicle[] = [];
  for (let i = 0; i < visibleCount; i++) {
    if (n > 0) {
      const idx = ((n - visibleCount + i) % n + n) % n;
      clonesBefore.push(vehicles[idx]);
    }
  }
  const clonesAfter: Vehicle[] = [];
  for (let i = 0; i < visibleCount; i++) {
    if (n > 0) {
      clonesAfter.push(vehicles[i % n]);
    }
  }
  const extendedVehicles = n > 0 ? [...clonesBefore, ...vehicles, ...clonesAfter] : [];

  // Slide controls
  const nextSlide = () => {
    if (!isTransitioning || n <= 1) return;
    setCurrentIndex((prev) => prev + 1);
  };
  const prevSlide = () => {
    if (!isTransitioning || n <= 1) return;
    setCurrentIndex((prev) => prev - 1);
  };

  // Infinite loop boundary check
  useEffect(() => {
    if (!isTransitioning || n <= 1) return;
    if (currentIndex >= n + visibleCount) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(visibleCount);
      }, 520);
      return () => clearTimeout(t);
    } else if (currentIndex < visibleCount) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(n + visibleCount - 1);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [currentIndex, isTransitioning, n, visibleCount]);

  // Re-enable transition after instant jump
  useEffect(() => {
    if (!isTransitioning && n > 1) {
      const frame = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning, n]);

  // Auto-play
  useEffect(() => {
    if (n <= 1 || isHovered || isDragging || isModalOpen) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }
    autoPlayTimer.current = setInterval(nextSlide, 3500);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [n, isHovered, isDragging, currentIndex, isTransitioning, isModalOpen]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (n <= 1) return;
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || n <= 1) return;
    setDragOffset(e.touches[0].clientX - dragStartX.current);
  };
  const handleTouchEnd = () => {
    if (!isDragging || n <= 1) return;
    setIsDragging(false);
    if (dragOffset > 60) prevSlide();
    else if (dragOffset < -60) nextSlide();
    setDragOffset(0);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (n <= 1) return;
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || n <= 1) return;
    setDragOffset(e.clientX - dragStartX.current);
  };
  const handleMouseUp = () => handleTouchEnd();

  const handleExplore = () => {
    router.push('/vehicles');
  };

  const openDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 1200;
  const dragOffsetPercent = n > 0 ? (dragOffset / trackWidth) * 100 : 0;
  const translationPercent = n > 0 ? -(currentIndex * (100 / extendedVehicles.length)) + dragOffsetPercent : 0;
  const activeIndex = n > 0 ? ((currentIndex - visibleCount) % n + n) % n : 0;

  return (
    <section id="vehicles" className="pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 bg-gray-50 relative overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      {/* Subtle Automotive Grid & Watermark Texture */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.035]">
        <div className="absolute -top-16 -right-10 text-[12rem] xl:text-[15rem] font-black tracking-tighter text-black uppercase font-display leading-none">
          JAPAN
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Creative Automotive Header */}
        <div className="mb-10 sm:mb-12">
          {/* Top Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/80 mb-5">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 border-l-2 border-primary text-primary text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Sparkles className="w-3 h-3" /> Our Vehicles
              </motion.div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200/90 text-neutral-600 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Japan Auction Stock
              </div>
            </div>

            {/* Verified Trust Signals */}
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-black">✓</span> 100% Inspected
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-black">✓</span> USS & CAA Auctions
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-black">✓</span> Islandwide Delivery
              </span>
            </div>
          </div>

          {/* Main Title & Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-dark leading-tight uppercase tracking-tight whitespace-normal sm:whitespace-nowrap">
                Find Your <span className="text-primary">Next Vehicle</span>
              </h2>
              <p className="mt-2 text-gray-500 font-medium text-sm sm:text-base max-w-2xl">
                Explore our latest vehicles sourced directly from Japan with auction-grade inspection and full transparency.
              </p>
            </div>

            {/* Controls: Category Switcher + View All */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-end">
              <div className="flex items-center p-1 bg-white rounded-none border border-neutral-200/90 shadow-xs">
                <button
                  onClick={() => { setActiveTab('auction'); setIsTransitioning(false); }}
                  className={`px-4 sm:px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'auction'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-dark'
                  }`}
                >
                  Auction Vehicles
                </button>
                <button
                  onClick={() => { setActiveTab('commercial'); setIsTransitioning(false); }}
                  className={`px-4 sm:px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'commercial'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-dark'
                  }`}
                >
                  Commercial Vehicles
                </button>
              </div>

              <motion.button
                whileHover={{ x: 3 }}
                onClick={handleExplore}
                className="hidden sm:inline-flex items-center gap-2.5 bg-neutral-900 hover:bg-primary text-white font-black text-xs uppercase tracking-widest px-5 py-3 transition-colors shadow-xs group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 w-full">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Auction Data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-none border border-red-200 shadow-sm">
            <p className="text-red-500 font-bold mb-6 text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-dark text-white px-8 py-4 rounded-none font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
            >
              Refresh Inventory
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-none border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-bold text-lg mb-2">No Featured Vehicles</p>
            <p className="text-gray-400 text-sm mb-8">Check back soon — we're updating our inventory.</p>
            <button
              onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 py-4 rounded-none font-black uppercase tracking-widest text-xs hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              Inquire About a Vehicle
            </button>
          </div>
        ) : mounted ? (
          // When vehicles fit in the visible area, show a simple static grid (no clones/carousel)
          n <= visibleCount ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 py-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="flex flex-col">
                  <VehicleCard vehicle={vehicle} onQuickView={() => openDetails(vehicle)} />
                </div>
              ))}
            </div>
          ) : (
          <div
            className="relative w-full py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsDragging(false);
              setDragOffset(0);
            }}
          >
            {/* Slider Viewport */}
            <div className="relative w-full overflow-hidden py-10 -my-10 px-2 -mx-2">
              <div
                ref={trackRef}
                className="flex select-none cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translate3d(${translationPercent}%, 0, 0)`,
                  transition: (isDragging || !isTransitioning) ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                  width: `${(extendedVehicles.length / visibleCount) * 100}%`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {extendedVehicles.map((vehicle, index) => (
                  <div
                    key={`${vehicle._id}-${index}`}
                    style={{ width: `${100 / extendedVehicles.length}%` }}
                    className="flex flex-col px-3 sm:px-4"
                  >
                    <VehicleCard vehicle={vehicle} onQuickView={() => {
                      if (!isDragging && Math.abs(dragOffset) < 10) openDetails(vehicle);
                    }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {n > 1 && (
              <div className="hidden md:flex absolute top-[40%] -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-20 px-0 sm:px-2">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-none bg-white/95 backdrop-blur-md hover:bg-neutral-900 hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-200 hover:border-neutral-900 transition-all duration-300 pointer-events-auto active:scale-95"
                  title="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-none bg-white/95 backdrop-blur-md hover:bg-neutral-900 hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-200 hover:border-neutral-900 transition-all duration-300 pointer-events-auto active:scale-95"
                  title="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Dot Indicators */}
            {n > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {vehicles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setCurrentIndex(index + visibleCount);
                    }}
                    className={`h-1.5 rounded-none transition-all duration-300 ${activeIndex === index ? 'w-8 bg-primary shadow-sm' : 'w-3 bg-gray-300 hover:bg-gray-400'
                      }`}
                    title={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          )
        ) : (
          // Hydration-safe fallback before mount: pure CSS responsive grid matching carousel slots
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 py-4">
            {vehicles.slice(0, 4).map((vehicle, index) => (
              <div 
                key={vehicle._id} 
                className={`flex flex-col ${
                  index === 1 ? 'hidden sm:flex' : 
                  index === 2 ? 'hidden lg:flex' : 
                  index === 3 ? 'hidden xl:flex' : ''
                }`}
              >
                <VehicleCard vehicle={vehicle} onQuickView={() => openDetails(vehicle)} />
              </div>
            ))}
          </div>
        )}

        <VehicleDetailModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* View All Vehicles Bottom CTA */}
        <div className="mt-12 text-center flex justify-center">
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-neutral-900 hover:bg-primary text-white font-black py-4 px-8 sm:px-12 rounded-none transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95 group"
          >
            <span>View All Vehicles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
