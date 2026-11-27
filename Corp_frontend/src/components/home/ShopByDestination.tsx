'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, ShieldCheck, Ship, MapPin, ExternalLink } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export function ShopByDestination() {
  const router = useRouter();
  const { setDestination } = useMarket();

  return (
    <section className="bg-white py-12 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>International Delivery Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Shop by Destination Market
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl font-medium">
              Select your delivery country to filter vehicles with verified import conformity and obtain route-specific shipping quotations.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-[#ff6a00] bg-white hover:bg-neutral-100 px-3.5 py-2 rounded-none border border-neutral-300 transition-colors shrink-0"
          >
            <span>All Destinations Directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff6a00]" />
          </Link>
        </div>

        {/* Featured Markets: India & Sri Lanka Side-by-Side (Square Corners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* India Launch Card */}
          <div className="bg-white border-2 border-neutral-300 hover:border-[#ff6a00] rounded-none p-5 sm:p-6 transition-all group flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-none" />
                  Active Launch Route
                </span>
                <span className="text-xs font-bold text-neutral-400">Asia Region</span>
              </div>

              <h3 className="text-lg font-black text-neutral-900 group-hover:text-[#ff6a00] transition-colors">
                India (Direct Import Program)
              </h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed font-medium">
                Direct export of high-value Japanese performance cars, luxury SUVs, and specialized commercial transports complying with DGFT direct import guidelines.
              </p>

              <div className="my-4 pt-3 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    <strong>Discharge Ports:</strong> Nhava Sheva (JNPT / Mumbai), Chennai, Mundra
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Campaign Models:</strong> Nissan GT-R NISMO, Lexus LX 600, LX 700h, Hiace
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDestination('india');
                  router.push('/destinations/asia/india');
                }}
                className="flex-1 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold py-2.5 px-4 rounded-none text-center transition-colors shadow-sm"
              >
                Explore India Route & Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination('india');
                  router.push('/vehicles?destination=india');
                }}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-bold py-2.5 px-4 rounded-none transition-colors"
              >
                View India Stock
              </button>
            </div>
          </div>

          {/* Sri Lanka Established Market Card */}
          <div className="bg-white border-2 border-neutral-300 hover:border-[#ff6a00] rounded-none p-5 sm:p-6 transition-all group flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-none border border-neutral-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff6a00] rounded-none" />
                  Established Route · Colombo Liaison
                </span>
                <span className="text-xs font-bold text-neutral-400">Asia Region</span>
              </div>

              <h3 className="text-lg font-black text-neutral-900 group-hover:text-[#ff6a00] transition-colors">
                Sri Lanka (Makers Ceylon Liaison Desk)
              </h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed font-medium">
                Proven Japan auction sourcing with bank Letter of Credit (LC) support, mandatory JEVIC pre-export inspection, and Colombo port clearance assistance.
              </p>

              <div className="my-4 pt-3 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    <strong>Discharge Ports:</strong> Colombo Sea Port, Hambantota Ro-Ro
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                  <span>
                    <strong>Local Liaison:</strong> 123 Import Avenue, Colombo 03 (+94 77 123 4567)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="https://makersceylon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-none text-center transition-colors shadow-sm"
              >
                <span>Visit MAKERS CEYLON</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setDestination('sri-lanka');
                  router.push('/destinations/asia/sri-lanka');
                }}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-xs font-bold py-2.5 px-4 rounded-none transition-colors"
              >
                Explore Route Details
              </button>
            </div>
          </div>
        </div>

        {/* Other Global Markets Strip (Square Corners) */}
        <div className="bg-neutral-50 border border-neutral-300 rounded-none p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">
            More Regional Destination Corridors
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/destinations/africa"
              onClick={() => setDestination('kenya')}
              className="bg-white hover:bg-[#fff4eb] border border-neutral-300 hover:border-[#ff6a00] rounded-none p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">Kenya (Mombasa Port)</div>
                <div className="text-[10px] text-neutral-500">QISJ Inspection · Active Ro-Ro</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-300">
                Active
              </span>
            </Link>

            <Link
              href="/destinations/africa"
              onClick={() => setDestination('tanzania')}
              className="bg-white hover:bg-[#fff4eb] border border-neutral-300 hover:border-[#ff6a00] rounded-none p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">Tanzania (Dar es Salaam)</div>
                <div className="text-[10px] text-neutral-500">TBS Inspection · East Africa Transit</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-300">
                Active
              </span>
            </Link>

            <Link
              href="/destinations/asia/pakistan"
              onClick={() => setDestination('pakistan')}
              className="bg-white hover:bg-[#fff4eb] border border-neutral-300 hover:border-[#ff6a00] rounded-none p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">Pakistan (Karachi Port)</div>
                <div className="text-[10px] text-neutral-500">Personal Baggage / Gift SRO Schemes</div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-none border border-amber-300">
                Inquiry Only
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
