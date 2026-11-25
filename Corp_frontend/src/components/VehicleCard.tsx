'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Gauge, Settings, Compass, MessageCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Vehicle, ReviewState } from '@/data';
import { useMarket } from '@/context/MarketContext';
import { getReviewState } from '@/data/reviews';
import { getEffectivePrice } from '@/data/offers';

interface VehicleCardProps {
  vehicle: Vehicle;
  destinationOverride?: string | null;
  priority?: boolean;
}

export function VehicleCard({ vehicle, destinationOverride, priority = false }: VehicleCardProps) {
  const { destinationSlug, formatPrice, selectedPortId } = useMarket();

  const activeDestination = destinationOverride !== undefined ? destinationOverride : destinationSlug;
  const reviewState: ReviewState = getReviewState(vehicle.stockId, activeDestination);

  const priceInfo = getEffectivePrice(vehicle.stockId, activeDestination, selectedPortId);
  const formatted = formatPrice(priceInfo.amount);

  const isSold = vehicle.availability === 'Sold';
  const isReserved = vehicle.availability === 'Reserved';

  const destinationName = activeDestination
    ? activeDestination === 'india'
      ? 'India'
      : activeDestination === 'sri-lanka'
      ? 'Sri Lanka'
      : activeDestination === 'pakistan'
      ? 'Pakistan'
      : activeDestination.charAt(0).toUpperCase() + activeDestination.slice(1)
    : null;

  return (
    <div
      className={`group flex flex-col bg-white rounded-none border transition-all duration-150 overflow-hidden ${
        isSold
          ? 'border-neutral-200 opacity-80'
          : 'border-neutral-300 hover:border-[#ff6a00] hover:shadow-md'
      }`}
    >
      {/* Top Image Section */}
      <Link href={`/vehicles/${vehicle.slug}`} className="relative block aspect-[16/10] bg-neutral-100 overflow-hidden rounded-none">
        <Image
          src={vehicle.images[0] || '/images/vehicle.jpg'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.stockId}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges (Rectangular tags) */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 items-center">
          {/* Year & Condition Grade */}
          <span className="px-2 py-0.5 bg-neutral-900/95 text-white text-[11px] font-bold tracking-wider rounded-none">
            {vehicle.year} · Grade {vehicle.conditionGrade}
          </span>

          {/* Availability Status */}
          {isSold ? (
            <span className="px-2 py-0.5 bg-neutral-800 text-white text-[11px] font-black uppercase tracking-wider rounded-none">
              Sold
            </span>
          ) : isReserved ? (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider rounded-none">
              Reserved
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-none">
              Available
            </span>
          )}
        </div>

        {/* Stock ID Plaque bottom right */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 bg-white/95 text-neutral-900 text-[10px] font-mono font-bold tracking-tight rounded-none border border-neutral-300 shadow-sm">
            {vehicle.stockId}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Destination Review Status Badge (When Destination Active) */}
          {destinationName && (
            <div className="mb-2">
              {reviewState === 'reviewed_for_quotation' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  Reviewed for {destinationName}
                </span>
              ) : reviewState === 'import_check_required' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-none border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                  {destinationName} Import Check Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-none border border-rose-300">
                  ✕ Not Offered for {destinationName}
                </span>
              )}
            </div>
          )}

          {/* Vehicle Make, Model, Grade */}
          <Link href={`/vehicles/${vehicle.slug}`} className="block group-hover:text-[#ff6a00] transition-colors">
            <h3 className="font-black text-sm sm:text-base text-neutral-900 leading-snug line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-neutral-500 font-medium line-clamp-1 mt-0.5">
              {vehicle.grade} · {vehicle.modelCode}
            </p>
          </Link>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 my-3 pt-2 pb-2.5 border-y border-neutral-200 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-semibold text-neutral-900">{vehicle.mileageKm.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Settings className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Compass className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-bold text-neutral-800">{vehicle.steering} ({vehicle.drivetrain})</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call to Actions */}
        <div className="pt-1">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {priceInfo.priceBasis === 'CIF'
                  ? `CIF Price (${priceInfo.portLabel})`
                  : priceInfo.priceBasis === 'FOB'
                  ? `FOB Price (${priceInfo.portLabel})`
                  : 'Quotation Basis'}
              </div>
              <div className="flex items-baseline gap-1.5">
                {priceInfo.priceBasis === 'QUOTE_ONLY' || isSold ? (
                  <span className="text-sm font-bold text-neutral-700">
                    {isSold ? 'Sold' : 'Quote on Request'}
                  </span>
                ) : (
                  <>
                    <span className="text-lg font-black text-neutral-900 leading-none">
                      {formatted.formatted}
                    </span>
                    {formatted.isConverted && (
                      <span className="text-[10px] text-neutral-500 font-medium">
                        (~ USD {priceInfo.amount.toLocaleString()})
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Source Type Tag */}
            <span className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-none border border-neutral-300 font-semibold">
              {vehicle.sourceType === 'Confirmed Makers Inventory' ? 'Verified Stock' : 'Partner Stock'}
            </span>
          </div>

          {/* Action Row (Square Corners) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 py-2 rounded-none border border-neutral-200 transition-colors text-center"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            </Link>

            {isSold ? (
              <Link
                href={`/request-a-vehicle?model=${encodeURIComponent(`${vehicle.make} ${vehicle.model}`)}`}
                className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#ff6a00] bg-orange-50 hover:bg-orange-100 py-2 rounded-none border border-orange-200 transition-colors text-center"
              >
                <span>Source Similar</span>
              </Link>
            ) : (
              <a
                href={`https://wa.me/818012345678?text=${encodeURIComponent(
                  `Hi Makers Corp Japan, I am interested in quoting ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock ID: ${vehicle.stockId})${
                    destinationName ? ` for destination: ${destinationName}` : ''
                  }.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 py-2 rounded-none transition-colors"
                aria-label={`WhatsApp quote for ${vehicle.stockId}`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                <span>Quote</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
