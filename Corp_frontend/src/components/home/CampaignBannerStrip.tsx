'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, ShieldCheck, Ship, Search, Sparkles } from 'lucide-react';

interface CampaignCard {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  subtext: string;
  actionText: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const campaigns: CampaignCard[] = [
  {
    id: 'india-launch',
    tag: 'India Market',
    tagColor: 'bg-emerald-600 text-white',
    headline: 'Explore Japan-Sourced Vehicles',
    subtext: 'Direct homologation checks & JNPT / Chennai shipping for luxury SUVs & sports stock.',
    actionText: 'Explore India',
    href: '/destinations/asia/india',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    icon: Globe,
  },
  {
    id: 'sri-lanka-desk',
    tag: 'Sri Lanka Market',
    tagColor: 'bg-blue-600 text-white',
    headline: 'Explore Vehicles & Local Support',
    subtext: 'Supported by Makers Ceylon liaison in Colombo. Verified LC and CPTAD documentation.',
    actionText: 'View Sri Lanka',
    href: '/destinations/asia/sri-lanka',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    icon: ShieldCheck,
  },
  {
    id: 'how-to-buy-guide',
    tag: 'Export Process',
    tagColor: 'bg-amber-600 text-white',
    headline: 'A Step-by-Step Export Guide',
    subtext: 'Clear breakdown of JEVIC audits, FOB/CIF terms, ocean freight tracking, and delivery.',
    actionText: 'Read the Guide',
    href: '/how-to-buy',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    icon: Ship,
  },
  {
    id: 'custom-sourcing',
    tag: 'Made-to-Order',
    tagColor: 'bg-orange-600 text-white',
    headline: 'Tell Us What You’re Looking For',
    subtext: 'Can’t find your specific model or trim? We source directly from Japanese dealer & auction networks.',
    actionText: 'Request a Vehicle',
    href: '/request-a-vehicle',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    icon: Search,
  },
];

export function CampaignBannerStrip() {
  return (
    <section className="bg-slate-50 py-5 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Strip */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Featured Export Highlights & Markets
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Direct Tokyo yard dispatches & regional import routes
          </span>
        </div>

        {/* Compact Horizontal Grid / Mobile Snap Swiper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {campaigns.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group relative bg-white border border-slate-200 hover:border-orange-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-w-[280px] sm:min-w-0 snap-center"
              >
                {/* Visual Image Header */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={card.image}
                    alt={card.headline}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1 ${card.tagColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {card.tag}
                    </span>
                  </div>

                  {idx === 0 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                        Priority Route
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors leading-snug mb-1">
                      {card.headline}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {card.subtext}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600 group-hover:text-orange-700 flex items-center gap-1">
                      {card.actionText}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-600">
                      Learn more
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
