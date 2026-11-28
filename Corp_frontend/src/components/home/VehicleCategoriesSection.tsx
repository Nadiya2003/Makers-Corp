'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Truck, ArrowRight, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  count: string;
  href: string;
  division: 'passenger' | 'commercial';
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'suvs-4x4',
    name: 'SUVs & 4x4',
    subtitle: 'Land Cruiser · Prado · Harrier · Jimny',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    count: 'Physical Stock',
    href: '/vehicles?body=SUVs+%26+4x4',
    division: 'passenger'
  },
  {
    id: 'luxury-performance',
    name: 'Luxury & Performance',
    subtitle: 'Lexus LX 600 · GT-R · Century · Alphard',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    count: 'VIP Sourcing',
    href: '/vehicles?body=Luxury+%26+Performance',
    division: 'passenger'
  },
  {
    id: 'mpvs-minivans',
    name: 'Executive MPVs & Vans',
    subtitle: 'Alphard · Vellfire · Hiace VIP · Serena',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    count: 'In Stock',
    href: '/vehicles?body=Vans+%26+MPVs',
    division: 'passenger'
  },
  {
    id: 'kei-compact',
    name: 'Kei Cars & Compacts',
    subtitle: 'Toyota Raize · Honda N-BOX · Wagon R',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    count: 'High Demand',
    href: '/vehicles?category=Right-Hand+Drive',
    division: 'passenger'
  },
  {
    id: 'commercial-trucks',
    name: 'Medium & Heavy Trucks',
    subtitle: 'Isuzu Elf · Hino Dutro · Fuso Canter',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    count: '2T - 25T Payload',
    href: '/vehicles?category=Commercial+Vehicles',
    division: 'commercial'
  },
  {
    id: 'specialized-logistics',
    name: 'Tippers & Cold-Chain',
    subtitle: 'Hydraulic Dumps · Sub-Zero Freezers',
    image: 'https://images.unsplash.com/photo-1586191582152-ee6e40d046d1?auto=format&fit=crop&w=600&q=80',
    count: 'Fleet Ready',
    href: '/vehicles?category=Commercial+Vehicles',
    division: 'commercial'
  }
];

export function VehicleCategoriesSection() {
  const { settings } = useSettings();

  return (
    <section className="bg-white py-10 sm:py-14 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-none shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                JDM Categories & Export Divisions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
              Vehicle Categories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
              Explore passenger automobiles, luxury VIP transports, and heavy commercial fleet units directly inspected in Japan.
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:text-[#e55f00] bg-white hover:bg-[#fff4eb] px-4 py-2.5 rounded-none border border-[#ffd1ad] shadow-2xs transition-all shrink-0"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative bg-white border border-neutral-300 hover:border-[#ff6a00] rounded-none overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#111111]/90 text-white text-[10px] font-bold tracking-wider rounded-none">
                    {cat.count}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-black text-neutral-900 group-hover:text-[#ff6a00] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-1 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#ff6a00]">
                  <span>Explore Inventory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export default VehicleCategoriesSection;
