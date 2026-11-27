'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Car, Layers, ArrowRight, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { vehicles, Vehicle } from '@/data';

type HighEndCategory = 'all' | 'suv' | 'sports' | 'mpv' | 'offroad';

export function CuratedShelves() {
  const [activeTab, setActiveTab] = useState<HighEndCategory>('all');

  // Define High-End Sourcing Collection
  // High-end models: GT-R, LX600, LX700h, G-Class, Land Cruiser 300, Alphard, Vellfire, Lexus LM, Porsche 911, Fairlady Z
  const highEndModels = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.availability === 'Sold') return false;
      const modelLower = v.model.toLowerCase();
      const makeLower = v.make.toLowerCase();
      return (
        v.priceFOB.amount >= 45000 ||
        makeLower === 'lexus' ||
        makeLower === 'porsche' ||
        makeLower === 'mercedes-benz' ||
        modelLower.includes('gt-r') ||
        modelLower.includes('land cruiser') ||
        modelLower.includes('alphard') ||
        modelLower.includes('vellfire') ||
        modelLower.includes('fairlady')
      );
    });
  }, []);

  const luxurySuvs = useMemo(() => {
    return highEndModels.filter(
      (v) =>
        v.bodyType === 'SUVs & 4x4' ||
        v.model.toLowerCase().includes('lx') ||
        v.model.toLowerCase().includes('land cruiser') ||
        v.model.toLowerCase().includes('g-class')
    );
  }, [highEndModels]);

  const sportsPerformance = useMemo(() => {
    return highEndModels.filter(
      (v) =>
        v.bodyType === 'Luxury & Performance' ||
        v.model.toLowerCase().includes('gt-r') ||
        v.model.toLowerCase().includes('911') ||
        v.model.toLowerCase().includes('fairlady')
    );
  }, [highEndModels]);

  const luxuryMpvs = useMemo(() => {
    return highEndModels.filter(
      (v) =>
        v.bodyType === 'Vans & MPVs' &&
        (v.model.toLowerCase().includes('alphard') ||
          v.model.toLowerCase().includes('vellfire') ||
          v.model.toLowerCase().includes('lm'))
    );
  }, [highEndModels]);

  const offroad = useMemo(() => {
    return highEndModels.filter(
      (v) =>
        v.drivetrain === '4WD' &&
        (v.model.toLowerCase().includes('land cruiser') ||
          v.model.toLowerCase().includes('overtrail') ||
          v.model.toLowerCase().includes('g-class') ||
          v.model.toLowerCase().includes('lx'))
    );
  }, [highEndModels]);

  const displayedVehicles = useMemo(() => {
    switch (activeTab) {
      case 'suv':
        return luxurySuvs;
      case 'sports':
        return sportsPerformance;
      case 'mpv':
        return luxuryMpvs;
      case 'offroad':
        return offroad;
      case 'all':
      default:
        return highEndModels;
    }
  }, [activeTab, luxurySuvs, sportsPerformance, luxuryMpvs, offroad, highEndModels]);

  return (
    <section className="bg-white py-12 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-none shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ff6a00]">
                Specialized Export Categories · Japan Direct Showroom
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              High-End Vehicle Collection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-medium">
              Handpicked premium Japanese-market vehicles inspected in Tokyo, Yokohama, Kobe &amp; Nagoya yards.
              Exclusive access to collector sports cars, executive VIP MPVs, and luxury 4x4 SUVs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-[#ff6a00] bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-none border border-neutral-300 transition-colors"
            >
              <span>Explore All {vehicles.length} Vehicles</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ff6a00]" />
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs (Square Corners) */}
        <div className="flex flex-wrap items-center gap-2 pb-2 mb-6 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-none border ${
              activeTab === 'all'
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>All High-End</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-bold ${
                activeTab === 'all' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {highEndModels.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suv')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-none border ${
              activeTab === 'suv'
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Luxury SUVs</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-bold ${
                activeTab === 'suv' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {luxurySuvs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sports')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-none border ${
              activeTab === 'sports'
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Sports &amp; Performance</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-bold ${
                activeTab === 'sports' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {sportsPerformance.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mpv')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-none border ${
              activeTab === 'mpv'
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Luxury &amp; Executive MPVs</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-bold ${
                activeTab === 'mpv' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {luxuryMpvs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offroad')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-none border ${
              activeTab === 'offroad'
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Premium Off-Road 4x4</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-bold ${
                activeTab === 'offroad' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {offroad.length}
            </span>
          </button>
        </div>

        {/* 4-Column Desktop Layout (Screen-aware responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayedVehicles.map((vehicle, idx) => (
            <VehicleCard key={`highend-${vehicle.id}`} vehicle={vehicle} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom Premium Sourcing Banner */}
        <div className="mt-8 p-5 bg-neutral-900 text-white rounded-none border-l-4 border-[#ff6a00] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#ff6a00]">
                Japan Sourcing &amp; Auction Concierge
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Looking for a specific model, collector grade, or rare JDM specification?
            </div>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              We inspect over 150,000 weekly units across USS, TAA, CAA, and ARAI Japanese dealer auction halls with
              physical video and translation of Japanese auction inspection sheets.
            </p>
          </div>

          <Link
            href="/request-a-vehicle"
            className="shrink-0 inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-none transition-colors shadow-sm"
          >
            <span>Request Custom Sourcing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
