import { Metadata } from 'next';
import Link from 'next/link';
import { getMarketsByRegion } from '@/data';
import { Globe, Ship, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Asia Vehicle Export Destinations — Makers Corp Japan',
  description: 'Direct Japan vehicle exports to Asia: India launch route, Sri Lanka established liaison desk, and Pakistan sourcing corridor.'
};

export default function AsiaDestinationsPage() {
  const asiaMarkets = getMarketsByRegion('Asia');

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <span> / </span>
          <Link href="/destinations" className="hover:text-slate-800">Destinations</Link>
          <span> / </span>
          <span className="font-bold text-slate-900">Asia</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
            Regional Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Asia Vehicle Export Corridors
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Makers Corp Japan provides dedicated export operations across South Asia. We support DGFT direct importation into India, bank LC processing and Colombo liaison support for Sri Lanka, and specialized sourcing for Pakistan import schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {asiaMarkets.map((m) => (
            <div
              key={m.slug}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {m.isoCode}
                  </span>
                  {m.publishState === 'active' ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Route
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Inquiry Only
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {m.campaignHeroSubtitle || m.guidance.summary}
                </p>

                <div className="space-y-1 text-[11px] text-slate-500 mb-4 pt-3 border-t border-slate-100">
                  <div className="font-semibold text-slate-700">Supported Discharge Ports:</div>
                  {m.supportedPorts.map((p) => (
                    <div key={p.id} className="flex items-center gap-1.5 text-slate-600">
                      <Ship className="w-3 h-3 text-slate-400" />
                      <span>{p.name} ({p.transitDays})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/destinations/asia/${m.slug}`}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 px-3 rounded text-center transition-colors shadow-sm"
                >
                  Explore Route
                </Link>
                <Link
                  href={`/vehicles?destination=${m.slug}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded transition-colors"
                >
                  Stock
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
