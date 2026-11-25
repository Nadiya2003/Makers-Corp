'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Car,
  Truck,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { vehicles } from '@/data';

export function ShopByType() {
  const router = useRouter();

  const getCount = (bodyType: string) => {
    return vehicles.filter((v) => v.bodyType === bodyType && v.availability !== 'Sold').length;
  };

  const categories = [
    {
      name: 'SUVs & 4x4',
      slug: 'SUVs & 4x4',
      icon: Compass,
      count: getCount('SUVs & 4x4'),
      description: 'Prado, Land Cruiser, Vezel'
    },
    {
      name: 'Luxury & Performance',
      slug: 'Luxury & Performance',
      icon: Sparkles,
      count: getCount('Luxury & Performance'),
      description: 'GT-R NISMO, G63 AMG'
    },
    {
      name: 'Vans & MPVs',
      slug: 'Vans & MPVs',
      icon: Car,
      count: getCount('Vans & MPVs'),
      description: 'Hiace, Alphard Executive'
    },
    {
      name: 'Trucks & Commercial',
      slug: 'Trucks & Commercial',
      icon: Truck,
      count: getCount('Trucks & Commercial'),
      description: 'Hilux GR Sport, Pickups'
    },
    {
      name: 'Sedans & Hatchbacks',
      slug: 'Sedans & Hatchbacks',
      icon: Shield,
      count: getCount('Sedans & Hatchbacks'),
      description: 'Swift RS, Aqua'
    }
  ];

  return (
    <section className="bg-white border-b border-neutral-200 py-4 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff6a00] rounded-none shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
              Shop by Category
            </span>
            <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
              · Direct results from genuine Japan inventory
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 text-[11px] font-medium">Quick Filters:</span>
            <button
              type="button"
              onClick={() => router.push('/vehicles?category=Hybrid')}
              className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-none border border-emerald-300 transition-colors"
            >
              Hybrid / EV
            </button>
            <button
              type="button"
              onClick={() => router.push('/vehicles?steering=RHD')}
              className="text-[11px] font-bold text-neutral-800 bg-white hover:bg-neutral-100 px-2 py-0.5 rounded-none border border-neutral-300 transition-colors"
            >
              RHD Only
            </button>
          </div>
        </div>

        {/* Category Tiles Grid (Square Corners) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/vehicles?body=${encodeURIComponent(cat.slug)}`}
                className="group bg-white hover:bg-[#fff4eb]/50 border border-neutral-300 hover:border-[#ff6a00] rounded-none p-2.5 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-none bg-neutral-100 group-hover:bg-[#ffe8d6] text-neutral-700 group-hover:text-[#ff6a00] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff6a00] truncate transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate font-medium">
                      {cat.count} Units Available
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#ff6a00] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
