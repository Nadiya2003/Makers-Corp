'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';
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
    <section className="bg-white py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Live Inventory Feed · Tokyo & Yokohama Yards
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Vehicles in Japan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {destinationSlug && market
                ? `Showing genuine Japan stock with review status for ${market.name}`
                : 'Physical export inventory inspected and ready for container or Ro-Ro booking'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-md transition-colors"
            >
              <span>View Full Inventory ({vehicles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Visible Responsive Grid (Not swipe-only carousel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {availableVehicles.map((vehicle, idx) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Looking for a specific model, year, or trim not displayed?
              </div>
              <div className="text-[11px] text-slate-500">
                Our Tokyo sourcing specialists inspect dealer auctions and private inventories across Japan daily.
              </div>
            </div>
          </div>

          <Link
            href="/request-a-vehicle"
            className="shrink-0 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
          >
            <span>Request Vehicle Sourcing</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
