'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Globe, ChevronRight, Filter, Car, Layers } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { markets } from '@/data';

export function HeroCompactSearch() {
  const router = useRouter();
  const { destinationSlug, setDestination } = useMarket();

  const [keyword, setKeyword] = useState('');
  const [make, setMake] = useState('All');
  const [bodyType, setBodyType] = useState('All');
  const [destination, setSelectedDest] = useState(destinationSlug || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (make !== 'All') params.set('make', make);
    if (bodyType !== 'All') params.set('body', bodyType);
    if (destination) {
      params.set('destination', destination);
      setDestination(destination);
    }

    router.push(`/vehicles?${params.toString()}`);
  };

  const makes = ['All', 'Toyota', 'Lexus', 'Nissan', 'Honda', 'Suzuki', 'Mercedes-Benz'];
  const bodyTypes = [
    'All',
    'SUVs & 4x4',
    'Luxury & Performance',
    'Vans & MPVs',
    'Sedans & Hatchbacks',
    'Trucks & Commercial'
  ];

  return (
    <section className="bg-white border-b border-slate-200 pt-5 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Opening Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              Japan Direct Inventory Showroom
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Find Your Next Vehicle in Japan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Browse Japan-sourced stock. Choose your destination and request a written shipping quote with verified specifications.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3.5 py-2 rounded-md transition-colors"
            >
              <span>Browse All Stock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Compact Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="bg-slate-50 border border-slate-300/80 rounded-lg p-2.5 sm:p-3 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {/* Keyword / Stock ID */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-0.5">
                Keyword, Model, or Stock ID
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. GT-R, LX 600, Hiace, MCJ-2024..."
                  className="w-full bg-white border border-slate-200 rounded pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Make Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-0.5">
                Make
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
              >
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Makes' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-0.5">
                Vehicle Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
              >
                {bodyTypes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt === 'All' ? 'All Body Types' : bt}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-0.5">
                Destination Market
              </label>
              <select
                value={destination}
                onChange={(e) => {
                  setSelectedDest(e.target.value);
                  setDestination(e.target.value || null);
                }}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
              >
                <option value="">Global Showroom (All)</option>
                <option value="india">India (Nhava Sheva/Chennai)</option>
                <option value="sri-lanka">Sri Lanka (Colombo Port)</option>
                <option value="kenya">Kenya (Mombasa Port)</option>
                <option value="pakistan">Pakistan (Inquiry Only)</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Quick Searches:</span>
              <button
                type="button"
                onClick={() => router.push('/vehicles?make=Toyota&body=SUVs+%26+4x4')}
                className="hover:text-orange-600 hover:underline"
              >
                Toyota SUVs
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => router.push('/vehicles?destination=india')}
                className="hover:text-orange-600 hover:underline"
              >
                India Reviewed
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => router.push('/vehicles?destination=sri-lanka')}
                className="hover:text-orange-600 hover:underline"
              >
                Sri Lanka Stock
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-[0.99]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Vehicles</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
