'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { vehicles } from '@/data';
import { useMarket } from '@/context/MarketContext';

export function LatestVehiclesSection() {
  const { destinationSlug, market } = useMarket();

  // Show available physical vehicles (targeting 8-10 units)
  const availableVehicles = vehicles
    .filter((v) => v.availability !== 'Sold')
    .slice(0, 8);

  return (
    <section className="bg-white py-8 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Live Inventory Feed · Tokyo & Yokohama Yards
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Latest Vehicles in Japan
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5 font-medium">
              {destinationSlug && market
                ? `Showing genuine Japan stock with review status for ${market.name}`
                : 'Physical export inventory inspected and ready for container or Ro-Ro booking'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:text-[#e55f00] bg-[#fff4eb] hover:bg-[#ffe8d6] px-3.5 py-2 rounded-none border border-[#ffd1ad] transition-colors"
            >
              <span>View Full Inventory ({vehicles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Visible Responsive Grid (Square Corners) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {availableVehicles.map((vehicle, idx) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-4 bg-neutral-50 border border-neutral-300 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#ffe8d6] text-[#ff6a00] flex items-center justify-center shrink-0 border border-[#ffd1ad]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Looking for a specific model, year, or trim not displayed?
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">
                Our Tokyo sourcing specialists inspect dealer auctions and private inventories across Japan daily.
              </div>
            </div>
          </div>

          <Link
            href="/request-a-vehicle"
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-none transition-colors"
          >
            <span>Request Vehicle Sourcing</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff6a00]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
