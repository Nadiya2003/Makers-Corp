'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Fuel, Cog, ShieldCheck, ExternalLink } from 'lucide-react';

interface PopularModel {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  category: string;
  image: string;
  engine: string;
  transmission: string;
  drive: string;
  badge?: string;
  searchQuery: string;
}

const POPULAR_MODELS: PopularModel[] = [
  {
    id: 'land-cruiser-300',
    name: 'Land Cruiser 300',
    brand: 'Toyota',
    tagline: 'ZX & GR Sport Flagship 4WD',
    category: 'Full-Size SUV',
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80',
    engine: '3.5L Twin-Turbo V6 / 3.3L Diesel',
    transmission: '10-Speed Auto',
    drive: 'Full-Time 4WD',
    badge: 'Worldwide Best Seller',
    searchQuery: 'Land Cruiser'
  },
  {
    id: 'toyota-raize',
    name: 'Toyota Raize',
    brand: 'Toyota',
    tagline: 'Z Package 1.0L Turbo / e-SMART',
    category: 'Compact SUV',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    engine: '1.0L Turbo / 1.2L Hybrid',
    transmission: 'CVT Automatic',
    drive: '2WD / 4WD',
    badge: 'Top Export Demand',
    searchQuery: 'Raize'
  },
  {
    id: 'toyota-alphard',
    name: 'Alphard Executive Lounge',
    brand: 'Toyota',
    tagline: 'VIP Captain Reclining Suites',
    category: 'Luxury MPV',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    engine: '2.5L Hybrid / 3.5L V6',
    transmission: 'Direct-Shift Auto',
    drive: 'E-Four AWD',
    badge: 'VIP Preferred',
    searchQuery: 'Alphard'
  },
  {
    id: 'suzuki-jimny-sierra',
    name: 'Jimny Sierra JC',
    brand: 'Suzuki',
    tagline: 'Legendary Off-Road AllGrip Pro',
    category: 'Compact 4x4',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    engine: '1.5L K15B DOHC',
    transmission: '4-AT / 5-MT',
    drive: 'Part-Time 4WD',
    badge: 'High Resale Value',
    searchQuery: 'Jimny'
  },
  {
    id: 'lexus-lx600',
    name: 'Lexus LX 600',
    brand: 'Lexus',
    tagline: 'Executive VIP Ultra Luxury',
    category: 'Prestige SUV',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    engine: '3.5L V6 Twin-Turbo',
    transmission: '10-Speed Direct',
    drive: 'AWD w/ Multi-Terrain',
    badge: 'Presidential Grade',
    searchQuery: 'LX600'
  },
  {
    id: 'honda-n-box',
    name: 'Honda N-BOX Custom',
    brand: 'Honda',
    tagline: 'L Turbo Honda SENSING Edition',
    category: 'Kei Micro Van',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    engine: '660cc Turbo Earth Dreams',
    transmission: 'CVT',
    drive: 'FF / 4WD',
    badge: '#1 Kei in Japan',
    searchQuery: 'N-BOX'
  },
  {
    id: 'isuzu-elf',
    name: 'Isuzu Elf Truck',
    brand: 'Isuzu',
    tagline: 'Commercial Dump / Aluminum Van',
    category: 'Commercial Truck',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    engine: '3.0L / 5.2L Turbo Diesel',
    transmission: 'Smoother-Ex / MT',
    drive: 'Rear Wheel Drive',
    badge: 'Heavy Fleet Ready',
    searchQuery: 'Elf'
  },
  {
    id: 'toyota-harrier',
    name: 'Toyota Harrier',
    brand: 'Toyota',
    tagline: 'Z Leather Package Hybrid',
    category: 'Crossover SUV',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    engine: '2.5L Dynamic Force Hybrid',
    transmission: 'E-CVT',
    drive: 'E-Four AWD',
    badge: 'Smooth Luxury',
    searchQuery: 'Harrier'
  }
];

export function PopularModelsSection() {
  return (
    <section className="bg-neutral-50 py-10 sm:py-14 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#ff6a00] bg-[#fff4eb] px-2 py-0.5 border border-[#ffd1ad]">
                <Flame className="w-3 h-3 text-[#ff6a00]" />
                Most Demanded in 2026
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
              Popular Export Models
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
              Consistently requested across East Africa, Caribbean, South Asia & Oceania. Inspected, documented, and ready for global shipment.
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-[#ff6a00] bg-white hover:bg-neutral-50 px-4 py-2.5 rounded-none border border-neutral-300 shadow-2xs transition-all shrink-0"
          >
            Explore Full Inventory
            <ArrowRight className="w-3.5 h-3.5 text-[#ff6a00]" />
          </Link>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_MODELS.map((model) => (
            <Link
              key={model.id}
              href={`/vehicles?search=${encodeURIComponent(model.searchQuery)}`}
              className="group bg-white border border-neutral-200 hover:border-[#ff6a00] transition-all flex flex-col overflow-hidden shadow-2xs hover:shadow-md"
            >
              {/* Image Container */}
              <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={model.image}
                  alt={`${model.brand} ${model.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Top Left */}
                {model.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider bg-[#ff6a00] text-white px-2 py-0.5 shadow-xs">
                    {model.badge}
                  </span>
                )}

                {/* Brand & Category Bottom Left */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                    {model.brand} · {model.category}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">
                    {model.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <p className="text-[11px] font-semibold text-neutral-600 line-clamp-1 mb-2.5">
                    {model.tagline}
                  </p>

                  {/* Micro Specs */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-[#ff6a00]" />
                        Engine
                      </span>
                      <span className="font-semibold text-neutral-800 text-right truncate max-w-[130px]">
                        {model.engine}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Cog className="w-3 h-3 text-neutral-400" />
                        Drive / Trans
                      </span>
                      <span className="font-semibold text-neutral-800 text-right truncate max-w-[130px]">
                        {model.drive}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#ff6a00] group-hover:translate-x-0.5 transition-transform">
                  <span className="text-[11px] uppercase tracking-wider font-black">
                    Search Stock
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ff6a00]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
