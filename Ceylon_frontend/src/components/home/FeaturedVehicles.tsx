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
    <div className="group relative h-full flex flex-col bg-white/40 hover:bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-3 border border-orange-300/30 hover:border-orange-400/60 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="relative h-[220px] sm:h-[260px] rounded-[2rem] overflow-hidden bg-white/50 mb-4 flex-shrink-0">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button
            onClick={onQuickView}
            className="w-full bg-white/90 backdrop-blur-md text-dark py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all active:scale-95 border border-white/50"
          >
            Quick View
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[9px] font-black text-dark uppercase tracking-widest border border-white/50">
            {vehicle.year} Model
          </span>
        </div>
      </div>

      <div className="px-3 pb-3">
        <h4 className="font-display font-black text-lg text-dark leading-tight uppercase group-hover:text-primary transition-colors mb-3 line-clamp-1">
          {vehicle.name}
        </h4>

        <div className="flex items-center gap-3 mb-5 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40">
          <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500 border-r border-gray-200/50">
            <Fuel className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold uppercase truncate">{vehicle.fuel}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500">
            <Settings className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold uppercase truncate">{vehicle.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Price</span>
            <span className="text-lg font-black text-primary leading-none">
              {/^(USD|JPY|EUR|GBP|AUD|LKR)/i.test(vehicle.price.trim()) ? vehicle.price : `LKR ${vehicle.price}`}
            </span>
          </div>
          <button
            onClick={onQuickView}
            className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md flex items-center justify-center text-dark hover:bg-primary hover:text-white hover:rotate-45 transition-all duration-300 active:scale-95 border border-white/50"
          >
            <ArrowRight className="w-4 h-4" />
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
    <section id="vehicles" className="py-16 sm:py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
            >
              <Sparkles className="w-3 h-3" /> Premium Collection
            </motion.div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-dark leading-none uppercase tracking-tighter">
              Featured <span className="text-primary">Inventory</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-lg max-w-xl">
              Swipe through our exclusive selection of premium Japanese vehicles, available for immediate import.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => { setActiveTab('auction'); setIsTransitioning(false); }}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'auction'
                    ? 'bg-white text-dark shadow-md'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                Auction Vehicles
              </button>
              <button
                onClick={() => { setActiveTab('commercial'); setIsTransitioning(false); }}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'commercial'
                    ? 'bg-white text-dark shadow-md'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                Commercial Vehicles
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ x: 5 }}
              onClick={handleExplore}
              className="hidden sm:flex items-center gap-3 text-dark font-black uppercase tracking-[0.15em] text-sm group"
            >
              Explore Full Collection
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all bg-white">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 w-full">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Auction Data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-red-100 shadow-sm">
            <p className="text-red-500 font-bold mb-6 text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
            >
              Refresh Inventory
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold text-lg mb-2">No Featured Vehicles</p>
            <p className="text-gray-400 text-sm mb-8">Check back soon — we're updating our inventory.</p>
            <button
              onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
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
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md hover:bg-primary hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-100 hover:border-primary transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95"
                  title="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md hover:bg-primary hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-100 hover:border-primary transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95"
                  title="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Dot Indicators */}
            {n > 1 && (
              <div className="flex justify-center gap-2.5 mt-10">
                {vehicles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setCurrentIndex(index + visibleCount);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-primary shadow-sm' : 'w-2.5 bg-gray-200 hover:bg-gray-300'
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

        <button
          onClick={handleExplore}
          className="mt-8 sm:hidden w-full flex items-center justify-center gap-3 bg-gray-200 hover:bg-gray-300 text-dark font-black py-6 rounded-[2rem] transition-all uppercase tracking-widest text-xs"
        >
          View Full Collection
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
