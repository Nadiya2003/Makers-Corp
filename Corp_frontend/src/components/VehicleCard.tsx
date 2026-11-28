'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Gauge, Settings, Compass, MessageCircle, ArrowRight, ShieldCheck, AlertCircle, Ship } from 'lucide-react';
import { Vehicle, ReviewState } from '@/data';
import { useMarket } from '@/context/MarketContext';
import { getReviewState } from '@/data/reviews';
import { getEffectivePrice } from '@/data/offers';

// Resolve relative backend image paths (local upload fallback) to absolute URLs
const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
function resolveImgUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/public/') || url.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${url}`;
  }
  return url;
}

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

  const departurePort = vehicle.priceFOB?.port || 'FOB Yokohama';

  return (
    <div
      className={`group flex flex-col bg-white rounded-none border transition-all duration-200 overflow-hidden ${isSold
          ? 'border-neutral-200 opacity-80'
          : 'border-neutral-300 hover:border-[#ff6a00] hover:shadow-lg'
        }`}
    >
      {/* 1. Large, High-Quality Vehicle Photograph */}
      <Link href={`/vehicles/${vehicle.slug}`} className="relative block aspect-[16/10] bg-neutral-100 overflow-hidden rounded-none">
        <Image
          src={resolveImgUrl(vehicle.images[0] || '/images/vehicle.jpg')}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.stockId}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* 2. Manufacturing Year and Auction Grade + 3. Availability Status Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 items-center">
          <span className="px-2 py-0.5 bg-[#111111]/95 text-white text-[10px] sm:text-[11px] font-bold tracking-wider rounded-none">
            {vehicle.year} · Grade {vehicle.conditionGrade}
          </span>

          {isSold ? (
            <span className="px-2 py-0.5 bg-neutral-800 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-none">
              Sold
            </span>
          ) : isReserved ? (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-none">
              Reserved
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-none">
              Available in Japan Yard
            </span>
          )}
        </div>

        {/* Stock ID Plaque bottom right */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 bg-white/95 text-neutral-900 text-[10px] font-mono font-bold tracking-tight rounded-none border border-neutral-300 shadow-xs">
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

          {/* 4. Vehicle Name & Model */}
          <Link href={`/vehicles/${vehicle.slug}`} className="block group-hover:text-[#ff6a00] transition-colors">
            <h3 className="font-black text-sm sm:text-base text-neutral-900 leading-snug line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {/* 5. Vehicle Variant */}
            <p className="text-xs text-neutral-500 font-medium line-clamp-1 mt-0.5">
              {vehicle.grade} · {vehicle.modelCode}
            </p>
          </Link>

          {/* Quick Specs Grid (6. Mileage, 7. Fuel, 8. Transmission, 9. Steering & Drivetrain) */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 my-3 pt-2 pb-2.5 border-y border-neutral-200 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 truncate" title={`Verified Mileage: ${vehicle.mileageKm.toLocaleString()} km`}>
              <Gauge className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-semibold text-neutral-900">{vehicle.mileageKm.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={`Fuel Type: ${vehicle.fuel}`}>
              <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={`Transmission: ${vehicle.transmission}`}>
              <Settings className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={`Steering: ${vehicle.steering} | Drivetrain: ${vehicle.drivetrain}`}>
              <Compass className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-bold text-neutral-800">{vehicle.steering} ({vehicle.drivetrain})</span>
            </div>
          </div>

          {/* 11. Stock Verification Status */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded-none border border-neutral-200 w-full truncate">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{vehicle.inspectionStatus || 'Makers Certified 150-Point · Yard Verified'}</span>
            </div>
          </div>
        </div>

        {/* 10. FOB Price & Japanese Departure Port + Call to Actions */}
        <div className="pt-1">
          <div className="flex items-baseline justify-between mb-3 bg-neutral-50/70 p-2 border border-neutral-200">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <Ship className="w-3 h-3 text-neutral-400 shrink-0" />
                <span>{departurePort}</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                {priceInfo.priceBasis === 'QUOTE_ONLY' || isSold ? (
                  <span className="text-sm font-black text-neutral-700">
                    {isSold ? 'Sold' : 'Quote on Request'}
                  </span>
                ) : (
                  <>
                    <span className="text-base sm:text-lg font-black text-[#111111] leading-none">
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

            {/* Verification tag */}
            <span className="text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-none border border-emerald-300 font-extrabold shrink-0">
              Verified Stock
            </span>
          </div>

          {/* Action Row: 12. View Details & 13. Request a Quote (Square Corners) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 py-2.5 rounded-none border border-neutral-300 transition-colors text-center"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            </Link>

            {isSold ? (
              <Link
                href={`/request-a-vehicle?model=${encodeURIComponent(`${vehicle.make} ${vehicle.model}`)}`}
                className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#ff6a00] bg-[#fff4eb] hover:bg-[#ffe8d6] py-2.5 rounded-none border border-[#ffd1ad] transition-colors text-center"
              >
                <span>Source Similar</span>
              </Link>
            ) : (
              <a
                href={`https://wa.me/818048931674?text=${encodeURIComponent(
                  `Hi Makers Corp Japan, I would like to request an official written quote for:\n${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.grade})\nStock ID: ${vehicle.stockId}\nDeparture Port: ${departurePort}${destinationName ? `\nDestination Country: ${destinationName}` : ''
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#ff6a00] hover:bg-[#e55f00] py-2.5 rounded-none transition-colors shadow-xs text-center"
                aria-label={`Request quote for ${vehicle.stockId}`}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Request a Quote</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
