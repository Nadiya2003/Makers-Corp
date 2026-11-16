'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, ShieldCheck, Ship, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { markets } from '@/data';

export function ShopByDestination() {
  const router = useRouter();
  const { setDestination } = useMarket();

  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>International Delivery Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shop by Destination Market
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Select your delivery country to filter vehicles with verified import conformity and obtain route-specific shipping quotations.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 px-3.5 py-2 rounded-md border border-slate-200 transition-colors shrink-0"
          >
            <span>All Destinations Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Featured Markets: India & Sri Lanka Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* India Launch Card */}
          <div className="bg-slate-50 border-2 border-slate-200 hover:border-orange-500 rounded-xl p-5 sm:p-6 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Active Launch Route
                </span>
                <span className="text-xs font-bold text-slate-400">Asia Region</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                India (Direct Import Program)
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Direct export of high-value Japanese performance cars, luxury SUVs, and specialized commercial transports complying with DGFT direct import guidelines.
              </p>

              <div className="my-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                onClick={() => {
                  setDestination('india');
                  router.push('/destinations/asia/india');
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded text-center transition-colors shadow-sm"
              >
                Explore India Route & Stock
              </button>
              <button
                onClick={() => {
                  setDestination('india');
                  router.push('/vehicles?destination=india');
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded transition-colors"
              >
                View India Stock
              </button>
            </div>
          </div>

          {/* Sri Lanka Established Market Card */}
          <div className="bg-slate-50 border-2 border-slate-200 hover:border-orange-500 rounded-xl p-5 sm:p-6 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Established Route · Colombo Liaison
                </span>
                <span className="text-xs font-bold text-slate-400">Asia Region</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                Sri Lanka (Makers Ceylon Liaison Desk)
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Proven Japan auction sourcing with bank Letter of Credit (LC) support, mandatory JEVIC pre-export inspection, and Colombo port clearance assistance.
              </p>

              <div className="my-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    <strong>Discharge Ports:</strong> Colombo Sea Port, Hambantota Ro-Ro
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Local Liaison:</strong> 123 Import Avenue, Colombo 03 (+94 77 123 4567)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setDestination('sri-lanka');
                  router.push('/destinations/asia/sri-lanka');
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded text-center transition-colors shadow-sm"
              >
                Explore Sri Lanka Route & Services
              </button>
              <button
                onClick={() => {
                  setDestination('sri-lanka');
                  router.push('/vehicles?destination=sri-lanka');
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded transition-colors"
              >
                View Sri Lanka Stock
              </button>
            </div>
          </div>
        </div>

        {/* Other Global Markets Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            More Regional Destination Corridors
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/destinations/africa"
              onClick={() => setDestination('kenya')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Kenya (Mombasa Port)</div>
                <div className="text-[10px] text-slate-500">QISJ Inspection · Active Ro-Ro</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Active
              </span>
            </Link>

            <Link
              href="/destinations/africa"
              onClick={() => setDestination('tanzania')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Tanzania (Dar es Salaam)</div>
                <div className="text-[10px] text-slate-500">TBS Inspection · East Africa Transit</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Active
              </span>
            </Link>

            <Link
              href="/destinations/asia/pakistan"
              onClick={() => setDestination('pakistan')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded p-3 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Pakistan (Karachi Port)</div>
                <div className="text-[10px] text-slate-500">Personal Baggage / Gift SRO Schemes</div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Inquiry Only
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
