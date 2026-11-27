'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface PopularModel {
  id: string;
  year: number;
  make: string;
  model: string;
  displayName: string;
  image: string;
  imageAlt: string;
  makeParam: string;
  modelParam?: string;
  bodyParam?: string;
  fuelParam?: string;
}

// 12 Authentic Japanese Market Popular Models (2 full rows of 6 on desktop)
const POPULAR_MODELS: PopularModel[] = [
  {
    id: 'toyota-lc-300',
    year: 2022,
    make: 'Toyota',
    model: 'Land Cruiser',
    displayName: 'Land Cruiser 300',
    image: '/images/land cruiser.jpg',
    imageAlt: 'Toyota Land Cruiser 300 Series ZX',
    makeParam: 'Toyota',
    modelParam: 'Land Cruiser',
  },
  {
    id: 'toyota-prado',
    year: 2022,
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    displayName: 'Land Cruiser Prado',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Toyota Land Cruiser Prado TX L-Package',
    makeParam: 'Toyota',
    modelParam: 'Land Cruiser Prado',
  },
  {
    id: 'lexus-lx600',
    year: 2023,
    make: 'Lexus',
    model: 'LX 600',
    displayName: 'LX 600 VIP',
    image: 'images/lexus lx.jpg',
    imageAlt: 'Lexus LX 600 Executive 4-Seater VIP',
    makeParam: 'Lexus',
    modelParam: 'LX 600',
  },
  {
    id: 'lexus-lx700h',
    year: 2024,
    make: 'Lexus',
    model: 'LX 700h',
    displayName: 'LX 700h Hybrid',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Lexus LX 700h Overtrail Edition Hybrid',
    makeParam: 'Lexus',
    modelParam: 'LX 700h',
  },
  {
    id: 'nissan-gtr-nismo',
    year: 2022,
    make: 'Nissan',
    model: 'GT-R',
    displayName: 'GT-R NISMO',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Nissan GT-R NISMO Special Edition',
    makeParam: 'Nissan',
    modelParam: 'GT-R',
  },
  {
    id: 'mercedes-g63-amg',
    year: 2022,
    make: 'Mercedes-Benz',
    model: 'G-Class',
    displayName: 'G63 AMG Magno',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Mercedes-Benz G-Class G63 AMG Magno Edition',
    makeParam: 'Mercedes-Benz',
    modelParam: 'G-Class',
  },
  {
    id: 'toyota-alphard-vip',
    year: 2023,
    make: 'Toyota',
    model: 'Alphard',
    displayName: 'Alphard Executive',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Toyota Alphard Executive Lounge VIP',
    makeParam: 'Toyota',
    modelParam: 'Alphard',
  },
  {
    id: 'toyota-vellfire-z',
    year: 2023,
    make: 'Toyota',
    model: 'Vellfire',
    displayName: 'Vellfire Z Premier',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Toyota Vellfire Z Premier Turbo Executive',
    makeParam: 'Toyota',
    modelParam: 'Vellfire',
  },
  {
    id: 'lexus-lm500h',
    year: 2024,
    make: 'Lexus',
    model: 'LM',
    displayName: 'LM 500h VIP',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Lexus LM 500h Executive 4-Seater VIP',
    makeParam: 'Lexus',
    modelParam: 'LM',
  },
  {
    id: 'porsche-911-carrera',
    year: 2022,
    make: 'Porsche',
    model: '911',
    displayName: '911 Carrera 4S',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Porsche 911 Carrera 4S Japan Spec RHD',
    makeParam: 'Porsche',
    modelParam: '911',
  },
  {
    id: 'nissan-fairlady-z',
    year: 2023,
    make: 'Nissan',
    model: 'Fairlady Z',
    displayName: 'Fairlady Z 6MT',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Nissan Fairlady Z Version ST Manual',
    makeParam: 'Nissan',
    modelParam: 'Fairlady Z',
  },
  {
    id: 'suzuki-jimny-sierra',
    year: 2022,
    make: 'Suzuki',
    model: 'Jimny Sierra',
    displayName: 'Jimny Sierra JC',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Suzuki Jimny Sierra JC 4WD',
    makeParam: 'Suzuki',
    modelParam: 'Jimny Sierra',
  },
];

function buildVehicleUrl(model: PopularModel): string {
  const params = new URLSearchParams();
  if (model.makeParam && model.makeParam !== 'All') params.set('make', model.makeParam);
  if (model.modelParam && model.modelParam !== 'All') params.set('model', model.modelParam);
  if (model.bodyParam && model.bodyParam !== 'All') params.set('body', model.bodyParam);
  if (model.fuelParam && model.fuelParam !== 'All') params.set('fuel', model.fuelParam);
  return `/vehicles?${params.toString()}`;
}

function PopularModelCard({ model }: { model: PopularModel }) {
  const href = buildVehicleUrl(model);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-neutral-200/90 hover:border-[#ff6a00]/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40"
    >
      {/* Complete Vehicle Photo with object-contain to never crop important car parts */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-neutral-50/80 to-neutral-100/40 p-2.5 sm:p-3 overflow-hidden flex items-center justify-center">
        <Image
          src={model.image}
          alt={model.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>

      {/* Model Information Underneath Image */}
      <div className="px-3 py-3 border-t border-neutral-100/90 flex flex-col justify-between flex-1 bg-white">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
            {model.year} · {model.make}
          </span>
          <h3 className="text-xs sm:text-sm font-black text-neutral-900 group-hover:text-[#ff6a00] transition-colors leading-snug line-clamp-1">
            {model.year} {model.make} {model.displayName}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export function PopularModelsSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Popular Models
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-medium">
              Explore the most popular vehicles from Japan.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ff6a00] hover:text-[#e55f00] hover:underline transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid: 6 per row on desktop (xl), 4 on laptop (lg), 3 on tablet (md), 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {POPULAR_MODELS.map((model) => (
            <PopularModelCard key={model.id} model={model} />
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#ff6a00] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#e55f00] transition-colors shadow-sm"
          >
            <span>View All Popular Vehicles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
