'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { vehicles as staticVehicles, Vehicle } from '@/data';
import { fetchLiveVehicles } from '@/lib/api';
import { useMarket } from '@/context/MarketContext';
import { useSettings } from '@/context/SettingsContext';

export function LatestVehiclesSection() {
  const { destinationSlug, market } = useMarket();
  const { settings } = useSettings();
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(staticVehicles);

  useEffect(() => {
    let isMounted = true;
    fetchLiveVehicles().then((live) => {
      if (isMounted && live && live.length > 0) {
        setVehicleList(live);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionConfig = settings?.homepage?.latestVehiclesSection;
  const tagText = sectionConfig?.tag || 'LIVE INVENTORY FEED · TOKYO & YOKOHAMA YARDS';
  const subtitleText = sectionConfig?.subtitle || (destinationSlug && market
    ? `Showing genuine Japan stock with review status for ${market.name}`
    : 'Physical export inventory inspected and ready for container or Ro-Ro booking');
  const bannerImage = sectionConfig?.bannerImage || '/images/fuji-header-banner.jpg';
  const viewAllLabel = sectionConfig?.viewAllText || 'View Full Inventory';

  // Show available physical vehicles (targeting 8-10 units)
  const availableVehicles = vehicleList
    .filter((v) => v.availability !== 'Sold')
    .slice(0, 8);

  return (
    <section className="bg-white py-6 sm:py-8 border-b border-neutral-200 rounded-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Mount Fuji Japanese Port Backdrop matching reference */}
        <div className="relative mb-6 sm:mb-8 rounded-none overflow-hidden border border-neutral-200 shadow-sm bg-neutral-900 min-h-[140px] sm:min-h-[170px] flex items-center">
          {/* Background Panoramic Graphic */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bannerImage}
              alt="Mount Fuji and Japanese Export Port Yard"
              fill
              priority
              className="object-cover object-right sm:object-center opacity-90"
            />
            {/* Gradient Overlay for high legibility on left and vibrant orange accent on right edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 sm:via-white/70 to-transparent" />
            <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#ff6a00]/30 to-transparent pointer-events-none" />
          </div>

          {/* Header Content */}
          <div className="relative z-10 w-full p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-none shrink-0" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-800">
                  {tagText}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-none">
                Latest Vehicles in <span className="text-[#ff6a00]">Japan</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 font-medium max-w-xl">
                {subtitleText}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ff6a00] hover:text-[#e55f00] bg-white/95 hover:bg-white px-4 py-2.5 rounded-none border border-[#ffd1ad] shadow-sm hover:shadow transition-all"
              >
                <span>{viewAllLabel} ({vehicleList.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
