'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Car,
  Truck,
  Shield,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { vehicles } from '@/data';

export function ShopByType() {
  const router = useRouter();

  // Calculate actual populated counts from vehicles database
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
    <section className="bg-slate-50 border-b border-slate-200/80 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Shop by Category
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              · Direct results from genuine Japan inventory
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Filters:</span>
            <button
              onClick={() => router.push('/vehicles?category=Hybrid')}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
            >
              Hybrid / EV
            </button>
            <button
              onClick={() => router.push('/vehicles?steering=RHD')}
              className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 transition-colors"
            >
              RHD Only
            </button>
          </div>
        </div>

        {/* Category Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/vehicles?body=${encodeURIComponent(cat.slug)}`}
                className="group bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-400 rounded-md p-2.5 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded bg-slate-100 group-hover:bg-orange-100 text-slate-700 group-hover:text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 truncate transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cat.count} Units Available
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
