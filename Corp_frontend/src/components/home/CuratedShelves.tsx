'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Truck, ArrowRight } from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { vehicles } from '@/data';

export function CuratedShelves() {
  const [activeTab, setActiveTab] = useState<'luxury' | 'commercial'>('luxury');

  const luxuryVehicles = vehicles
    .filter((v) => v.bodyType === 'Luxury & Performance' || v.make === 'Lexus')
    .slice(0, 4);

  const commercialVehicles = vehicles
    .filter((v) => v.bodyType === 'Vans & MPVs' || v.bodyType === 'Trucks & Commercial')
    .slice(0, 4);

  const displayedVehicles = activeTab === 'luxury' ? luxuryVehicles : commercialVehicles;

  return (
    <section className="bg-white py-10 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a00] mb-0.5">
              Curated Japan Sourcing Collections
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Specialized Export Categories
            </h2>
          </div>

          {/* Shelf Selector Tabs (Square Corners) */}
          <div className="inline-flex p-1 bg-neutral-100 border border-neutral-300 rounded-none shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('luxury')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-bold transition-all ${
                activeTab === 'luxury'
                  ? 'bg-[#ff6a00] text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luxury & Performance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('commercial')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-bold transition-all ${
                activeTab === 'commercial'
                  ? 'bg-[#ff6a00] text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Commercial & Utility MPVs</span>
            </button>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayedVehicles.map((vehicle) => (
            <VehicleCard key={`shelf-${vehicle.id}`} vehicle={vehicle} />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href={
              activeTab === 'luxury'
                ? '/vehicles?body=Luxury+%26+Performance'
                : '/vehicles?body=Vans+%26+MPVs'
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6a00] hover:underline"
          >
            <span>
              View all {activeTab === 'luxury' ? 'Luxury & Performance' : 'Commercial & MPV'} stock
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
