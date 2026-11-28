'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { useSettings } from '@/context/SettingsContext';

export function HeroCompactSearch() {
  const router = useRouter();
  const { destinationSlug, setDestination } = useMarket();
  const { settings } = useSettings();

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

  const makes = [
    'All',
    'Toyota',
    'Lexus',
    'Nissan',
    'Honda',
    'Suzuki',
    'Mazda',
    'Mitsubishi',
    'Subaru',
    'Daihatsu',
    'Isuzu',
    'UD Trucks',
    'Mercedes-Benz',
    'BMW',
    'Audi'
  ]

  const bodyTypes = [
    'All',
    'SUVs & 4x4',
    'Sedans',
    'Hatchbacks',
    'Luxury & Performance',
    'Vans & MPVs',
    'Pickup Trucks',
    'Trucks & Commercial'
  ];

  return (
    <section
      className="relative bg-white border-b border-neutral-300 py-6 sm:py-8 rounded-none overflow-hidden"
      aria-label="Quick Vehicle Search"
    >
      {/* Quick Vehicle Search Section - White Background */}

      {/* Keep your existing vehicle search content here */}



      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Search Bar Floating White Card (matching reference screenshot) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/50">
          {/* Header inside Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-sm shrink-0" />
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wide text-neutral-900">
                SEARCH VEHICLE INVENTORY
              </h2>
              <span className="hidden md:inline text-xs text-neutral-500 font-medium">
                — Filter by Stock ID, Make, Body Type or Export Destination
              </span>
            </div>

            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#ff6a00] transition-colors shrink-0"
            >
              <span>Browse All Inventory</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ff6a00]" />
            </Link>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Keyword / Stock ID */}
              <div className="lg:col-span-2 relative">
                <label htmlFor="search-keyword" className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  KEYWORD, MODEL, OR STOCK ID
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-keyword"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. GT-R, LX 600, Hiace, MCJ-2024..."
                    className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>

              {/* Make Selector */}
              <div>
                <label htmlFor="search-make" className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  MAKE
                </label>
                <select
                  id="search-make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
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
                <label htmlFor="search-body" className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  VEHICLE TYPE
                </label>
                <select
                  id="search-body"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
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
                <label htmlFor="search-destination" className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  DESTINATION MARKET
                </label>
                <select
                  id="search-destination"
                  value={destination}
                  onChange={(e) => {
                    setSelectedDest(e.target.value);
                    setDestination(e.target.value || null);
                  }}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] font-semibold"
                >
                  <option value="">Select a Destination</option>
                  <option value="india">India (Nhava Sheva/Chennai)</option>
                  <option value="sri-lanka">Sri Lanka (Colombo Port)</option>
                  <option value="kenya">Kenya (Mombasa Port)</option>
                  <option value="pakistan">Pakistan (Inquiry Only)</option>
                </select>
              </div>
            </div>

            {/* Action Row & Quick Chips */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                <span className="font-bold text-neutral-700">Quick Searches:</span>
                {(settings?.homepage?.searchConfig?.quickSearches || ['Toyota SUVs', 'India Reviewed', 'Sri Lanka Stock']).map((qs, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (qs.toLowerCase().includes('toyota')) router.push('/vehicles?make=Toyota&body=SUVs+%26+4x4');
                      else if (qs.toLowerCase().includes('india')) router.push('/vehicles?destination=india');
                      else if (qs.toLowerCase().includes('sri lanka')) router.push('/vehicles?destination=sri-lanka');
                      else router.push(`/vehicles?q=${encodeURIComponent(qs)}`);
                    }}
                    className="bg-neutral-50 hover:bg-[#fff4eb] text-neutral-700 hover:text-[#ff6a00] px-3 py-1 rounded-md border border-neutral-200 transition-colors font-medium text-xs shadow-2xs"
                  >
                    {qs}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white px-7 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.99] ml-auto sm:ml-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>SEARCH VEHICLES</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
