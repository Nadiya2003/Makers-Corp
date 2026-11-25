'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Search, Ship, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { markets, Market } from '@/data';
import { useMarket } from '@/context/MarketContext';

export default function DestinationsDirectoryPage() {
  const { setDestination } = useMarket();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = markets.filter((m) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.region.toLowerCase().includes(query) ||
      m.supportedPorts.some((p) => p.name.toLowerCase().includes(query))
    );
  });

  const asiaMarkets = filteredMarkets.filter((m) => m.region === 'Asia');
  const africaMarkets = filteredMarkets.filter((m) => m.region === 'Africa');

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] uppercase tracking-widest mb-2">
            <Globe className="w-4 h-4" />
            <span>Global Export Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Vehicle Export Destinations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Select your destination country to browse reviewed vehicle inventory, understand local import regulations, and request CIF shipping quotes.
          </p>

          {/* Search Box */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by country, region, or port (e.g. India, Colombo, Mombasa)..."
              className="w-full bg-white border border-neutral-300 rounded-none pl-9 pr-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#ff6a00] shadow-sm"
            />
          </div>
        </div>

        {/* Asia Section */}
        {asiaMarkets.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-full" />
                <h2 className="text-xl font-black text-[#111111] tracking-tight">
                  Asia Destination Markets
                </h2>
              </div>
              <Link
                href="/destinations/asia"
                className="text-xs font-bold text-[#ff6a00] hover:underline"
              >
                View Asia Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {asiaMarkets.map((m) => (
                <div
                  key={m.slug}
                  className="bg-white border border-neutral-200 rounded-none p-5 hover:border-[#ff6a00] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-neutral-400 font-mono">
                        {m.isoCode}
                      </span>
                      {m.publishState === 'active' ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200">
                          Active Route
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-none border border-amber-200">
                          Inquiry Only
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-[#111111] mb-1">
                      {m.name}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                      {m.campaignHeroSubtitle || m.guidance.summary}
                    </p>

                    <div className="space-y-1 text-[11px] text-neutral-500 mb-4 pt-3 border-t border-neutral-100">
                      <div className="font-semibold text-neutral-700">Supported Ports:</div>
                      {m.supportedPorts.map((p) => (
                        <div key={p.id} className="flex items-center gap-1.5 text-neutral-600">
                          <Ship className="w-3 h-3 text-neutral-400" />
                          <span>{p.name} ({p.transitDays})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/destinations/asia/${m.slug}`}
                      onClick={() => setDestination(m.slug)}
                      className="flex-1 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 px-3 rounded-none text-center transition-colors shadow-sm"
                    >
                      Explore Route
                    </Link>
                    <Link
                      href={`/vehicles?destination=${m.slug}`}
                      onClick={() => setDestination(m.slug)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold py-2 px-3 rounded-none transition-colors"
                    >
                      Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Africa Section */}
        {africaMarkets.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-full" />
                <h2 className="text-xl font-black text-[#111111] tracking-tight">
                  Africa Destination Markets
                </h2>
              </div>
              <Link
                href="/destinations/africa"
                className="text-xs font-bold text-[#ff6a00] hover:underline"
              >
                View Africa Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {africaMarkets.map((m) => (
                <div
                  key={m.slug}
                  className="bg-white border border-neutral-200 rounded-none p-5 hover:border-[#ff6a00] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-neutral-400 font-mono">
                        {m.isoCode}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200">
                        Active Route
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#111111] mb-1">
                      {m.name}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                      {m.campaignHeroSubtitle || m.guidance.summary}
                    </p>

                    <div className="space-y-1 text-[11px] text-neutral-500 mb-4 pt-3 border-t border-neutral-100">
                      <div className="font-semibold text-neutral-700">Supported Ports:</div>
                      {m.supportedPorts.map((p) => (
                        <div key={p.id} className="flex items-center gap-1.5 text-neutral-600">
                          <Ship className="w-3 h-3 text-neutral-400" />
                          <span>{p.name} ({p.transitDays})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href="/destinations/africa"
                      onClick={() => setDestination(m.slug)}
                      className="flex-1 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 px-3 rounded-none text-center transition-colors shadow-sm"
                    >
                      Explore Africa Desk
                    </Link>
                    <Link
                      href={`/vehicles?destination=${m.slug}`}
                      onClick={() => setDestination(m.slug)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold py-2 px-3 rounded-none transition-colors"
                    >
                      Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
