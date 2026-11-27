'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
}

// 10 Exact Categories requested by user
const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'suvs-4x4',
    name: 'SUVs & 4x4',
    subtitle: 'Land Cruiser, Prado, Jimny',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese SUV and 4x4 Export Vehicles',
    href: '/vehicles?body=SUVs+%26+4x4',
  },
  {
    id: 'luxury-cars',
    name: 'Luxury Cars',
    subtitle: 'G-Class, LX 600, S-Class',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury Japanese and Continental Vehicles',
    href: '/vehicles?body=Luxury+%26+Performance',
  },
  {
    id: 'sports-cars',
    name: 'Sports Cars',
    subtitle: 'GT-R NISMO, 911, Fairlady Z',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Sports and Performance Cars',
    href: '/vehicles?body=Luxury+%26+Performance',
  },
  {
    id: 'hybrid-vehicles',
    name: 'Hybrid Vehicles',
    subtitle: 'Vezel, Aqua, LX 700h',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Hybrid and Plug-in Vehicles',
    href: '/vehicles?category=Hybrid',
  },
  {
    id: 'electric-vehicles',
    name: 'Electric Vehicles',
    subtitle: 'Zero Emission EV Imports',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Electric Vehicles',
    href: '/vehicles?category=Electric',
  },
  {
    id: 'sedans',
    name: 'Sedans',
    subtitle: 'Swift, Aqua, Executive Sedans',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Sedans and Compact Cars',
    href: '/vehicles?body=Sedans+%26+Hatchbacks',
  },
  {
    id: 'mpvs-minivans',
    name: 'MPVs & Minivans',
    subtitle: 'Alphard, Vellfire, LM 500h',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Executive MPVs and Minivans',
    href: '/vehicles?body=Vans+%26+MPVs',
  },
  {
    id: 'commercial-vehicles',
    name: 'Commercial Vehicles',
    subtitle: 'Hiace Van, Delivery Vans',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Commercial Export Vehicles',
    href: '/vehicles?category=Commercial+Vehicles',
  },
  {
    id: 'pickup-trucks',
    name: 'Pickup Trucks',
    subtitle: 'Hilux GR Sport Double Cab',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese 4x4 Pickup Trucks',
    href: '/vehicles?body=Trucks+%26+Commercial',
  },
  {
    id: 'vans-buses',
    name: 'Vans & Buses',
    subtitle: 'Hiace Commuter, Passenger Shuttles',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Japanese Passenger Vans and Shuttles',
    href: '/vehicles?body=Vans+%26+MPVs',
  },
];

function VehicleCategoryCard({ category }: { category: VehicleCategory }) {
  return (
    <Link
      href={category.href}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-900 aspect-[16/10] sm:aspect-[4/3] block shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
    >
      {/* Background Image */}
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
      />

      {/* Scrim Gradient for Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Card Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4">
        <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-300 uppercase tracking-wider leading-none mb-1 line-clamp-1">
          {category.subtitle}
        </span>
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-black text-white leading-tight group-hover:text-[#ff6a00] transition-colors">
            {category.name}
          </h3>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#ff6a00] transition-colors shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function VehicleCategoriesSection() {
  return (
    <section className="w-full bg-neutral-50 py-10 sm:py-14 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 pb-3 border-b border-neutral-200/70">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Explore Vehicle Categories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-medium">
              Find the right vehicle for your market and business requirements.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#ff6a00] hover:text-[#e55f00] transition-colors"
          >
            <span>Browse All Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid: 5 columns on desktop (10 total = 2 rows of 5), 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {VEHICLE_CATEGORIES.map((category) => (
            <VehicleCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
