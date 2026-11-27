'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, ShieldCheck, Ship, Search, ExternalLink } from 'lucide-react';

interface CampaignCard {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  subtext: string;
  actionText: string;
  href: string;
  isExternal?: boolean;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const campaigns: CampaignCard[] = [
  {
    id: 'india-launch',
    tag: 'India Market',
    tagColor: 'bg-emerald-700 text-white',
    headline: 'Explore Japan-Sourced Vehicles',
    subtext: 'Direct homologation checks & JNPT / Chennai shipping for luxury SUVs & sports stock.',
    actionText: 'Explore India',
    href: '/destinations/asia/india',
    image: '/images/India campagincard.png',
    icon: Globe,
  },
  {
    id: 'sri-lanka-desk',
    tag: 'Sri Lanka Market',
    tagColor: 'bg-[#ff6a00] text-white',
    headline: 'Explore Vehicles & Local Support',
    subtext: 'Official vehicle export partner MAKERS CEYLON. Bank LC coordination & Colombo port delivery.',
    actionText: 'Visit MAKERS CEYLON',
    href: 'https://makersceylon.com/',
    isExternal: true,
    image: '/images/Sri Lanka campagincard.png',
    icon: ShieldCheck,
  },
  {
    id: 'how-to-buy-guide',
    tag: 'Export Process',
    tagColor: 'bg-neutral-800 text-white',
    headline: 'A Step-by-Step Export Guide',
    subtext: 'Clear breakdown of JEVIC audits, FOB/CIF terms, ocean freight tracking, and delivery.',
    actionText: 'Read the Guide',
    href: '/how-to-buy',
    image: '/images/Step-by-Step Export Guide.png',
    icon: Ship,
  },
  {
    id: 'custom-sourcing',
    tag: 'Made-to-Order',
    tagColor: 'bg-neutral-900 text-white',
    headline: 'Tell Us What You’re Looking For',
    subtext: 'Can’t find your specific model or trim? We source directly from Japanese dealer & auction networks.',
    actionText: 'Request a Vehicle',
    href: '/request-a-vehicle',
    image: '/images/Custom Japanese Car Sourcing.png',
    icon: Search,
  },
];

export function CampaignBannerStrip() {
  return (
    <section className="bg-white py-5 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Strip */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-none shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              Featured Export Highlights &amp; Markets
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500 hidden sm:inline font-medium">
            Direct Tokyo yard dispatches &amp; regional import routes
          </span>
        </div>

        {/* 4 Compact Campaign Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 snap-x">
          {campaigns.map((card, idx) => {
            const Icon = card.icon;
            const CardWrapper = card.isExternal ? 'a' : Link;
            const extraProps = card.isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <CardWrapper
                key={card.id}
                href={card.href}
                {...extraProps}
                className="group relative bg-white border border-neutral-300 hover:border-[#ff6a00] rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between min-w-[280px] sm:min-w-0 snap-center"
              >
                {/* Visual Image Header */}
                <div className="relative h-32 w-full overflow-hidden bg-neutral-100 rounded-none">
                  <Image
                    src={card.image}
                    alt={card.headline}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none shadow-xs flex items-center gap-1 ${card.tagColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {card.tag}
                    </span>
                  </div>

                  {idx === 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#ff6a00] text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none">
                        Priority Route
                      </span>
                    </div>
                  )}

                  {card.id === 'sri-lanka-desk' && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white text-neutral-900 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none border border-neutral-300">
                        MAKERS CEYLON
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 group-hover:text-[#ff6a00] transition-colors leading-snug mb-1">
                      {card.headline}
                    </h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                      {card.subtext}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff6a00] group-hover:text-[#e55f00] flex items-center gap-1">
                      {card.actionText}
                      {card.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      )}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 group-hover:text-neutral-600">
                      {card.isExternal ? 'Official Site' : 'Learn more'}
                    </span>
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
