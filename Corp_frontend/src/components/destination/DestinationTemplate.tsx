'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Ship,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import { Market, Vehicle } from '@/data';
import { useMarket } from '@/context/MarketContext';
import { VehicleCard } from '@/components/VehicleCard';
import { getReviewState } from '@/data/reviews';

interface DestinationTemplateProps {
  market: Market;
  reviewedVehicles: Vehicle[];
  campaignModels?: Vehicle[];
  faqItems?: Array<{ question: string; answer: string }>;
}

export function DestinationTemplate({
  market,
  reviewedVehicles,
  campaignModels = [],
  faqItems = []
}: DestinationTemplateProps) {
  const { setDestination, setPortId, selectedPortId } = useMarket();

  // Set current destination in context on mount
  useEffect(() => {
    setDestination(market.slug);
    if (market.supportedPorts.length > 0 && !selectedPortId) {
      const primary = market.supportedPorts.find((p) => p.isPrimary) || market.supportedPorts[0];
      setPortId(primary.id);
    }
  }, [market.slug, setDestination, setPortId, market.supportedPorts, selectedPortId]);

  const isInquiryOnly = market.publishState === 'inquiry_only';

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-neutral-800">Home</Link>
          <span> / </span>
          <Link href="/destinations" className="hover:text-neutral-800">Destinations</Link>
          <span> / </span>
          <Link href={`/destinations/${market.region.toLowerCase()}`} className="hover:text-neutral-800">
            {market.region}
          </Link>
          <span> / </span>
          <span className="font-bold text-[#111111]">{market.name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white border border-neutral-200 rounded-none p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a00] bg-[#fff4eb] px-2.5 py-0.5 rounded-none border border-[#ffd1ad]">
                  {market.region} Destination Corridor
                </span>

                {isInquiryOnly ? (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-none border border-amber-200">
                    Inquiry Only / Sourcing Desk
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-200">
                    Active Export Route
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
                Japanese Vehicle Export to {market.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                {market.campaignHeroSubtitle || market.guidance.summary}
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="shrink-0 bg-neutral-50 p-4 rounded-none border border-neutral-200 flex flex-col gap-2 min-w-[240px]">
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Route Status
              </div>
              <div className="text-sm font-extrabold text-[#111111]">
                {isInquiryOnly ? 'Made-to-Order Sourcing' : `${reviewedVehicles.length} Units Reviewed`}
              </div>
              <a
                href={`https://wa.me/${market.approvedContact.whatsapp}?text=${encodeURIComponent(
                  `Hello Makers Corp Japan, I am inquiring about shipping vehicles to ${market.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-none text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                <span>Contact {market.name} Desk</span>
              </a>
              <Link
                href="/request-a-vehicle"
                className="flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white py-2 px-3 rounded-none text-xs font-bold transition-colors"
              >
                <span>Request Custom Sourcing</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Regulatory Guidance & Supported Discharge Ports */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Regulatory Guidance (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-none p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShieldCheck className="w-5 h-5 text-[#ff6a00]" />
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-[#111111]">
                Regulatory Guidance & Import Framework
              </h2>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              {market.guidance.summary}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Compliance Highlights
              </div>
              {market.guidance.regulatoryNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-none text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Shipping Terms & Customs Notice
              </div>
              <p className="text-[11px] leading-relaxed">
                {market.guidance.clearanceNotice}
              </p>
            </div>
          </div>

          {/* Supported Ports & Verified Local Services (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Discharge Ports */}
            <div className="bg-white border border-neutral-200 rounded-none p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 mb-3">
                <Ship className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">
                  Supported Discharge Ports
                </h3>
              </div>

              <div className="space-y-2.5">
                {market.supportedPorts.map((port) => (
                  <div
                    key={port.id}
                    className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-none flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#111111]">{port.name}</div>
                      <div className="text-[11px] text-neutral-500">Transit: {port.transitDays}</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#ff6a00] bg-white px-2 py-1 rounded-none border border-neutral-200">
                      Est. Freight: ${port.oceanFreightUSD}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved Contact Desk */}
            <div className="bg-white border border-neutral-200 rounded-none p-6 shadow-sm text-xs text-neutral-600 space-y-2.5">
              <div className="font-bold text-[#111111] text-xs uppercase tracking-wider pb-2 border-b border-neutral-100">
                Approved Market Contact Desk
              </div>
              <div className="font-bold text-neutral-800">{market.approvedContact.title}</div>
              {market.approvedContact.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6a00] shrink-0 mt-0.5" />
                  <span>{market.approvedContact.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>{market.approvedContact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>{market.approvedContact.email}</span>
              </div>
              {market.approvedContact.workingHours && (
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{market.approvedContact.workingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Campaign Models (if India Launch or Specialized) */}
        {campaignModels.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6a00]">
                  Curated Priority Models
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                  Featured Campaign Models for {market.name}
                </h2>
              </div>
              <Link
                href={`/vehicles?destination=${market.slug}`}
                className="text-xs font-bold text-[#ff6a00] hover:underline"
              >
                Browse All Reviewed Stock →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {campaignModels.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  destinationOverride={market.slug}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviewed Inventory Grid */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Verified Export Records
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                Vehicles Reviewed for {market.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Units evaluated by our homologation specialist for {market.name} customs entry
              </p>
            </div>

            <Link
              href={`/vehicles?destination=${market.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] bg-[#fff4eb] hover:bg-[#ffe8d6] px-3 py-1.5 rounded-none transition-colors"
            >
              <span>View In Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {reviewedVehicles.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-none p-8 sm:p-12 text-center">
              <div className="w-12 h-12 rounded-none bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-[#ff6a00]" />
              </div>
              <h3 className="text-base font-bold text-[#111111] mb-1">
                No Stock Currently Pre-Reviewed for {market.name}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-5">
                We do not pad our destination catalog with unreviewed vehicles. Submit a Sourcing & Import Check to have our Tokyo team inspect and quote a specific vehicle.
              </p>
              <Link
                href={`/request-a-vehicle?destination=${market.slug}`}
                className="inline-flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold px-4 py-2 rounded-none transition-colors"
              >
                <span>Request Custom Sourcing & Import Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reviewedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  destinationOverride={market.slug}
                />
              ))}
            </div>
          )}
        </div>

        {/* FAQs */}
        {faqItems.length > 0 && (
          <div className="bg-white border border-neutral-200 rounded-none p-6 sm:p-8 mb-8 shadow-sm">
            <h3 className="font-extrabold text-base text-[#111111] uppercase tracking-wider mb-6">
              Frequently Asked Questions: Vehicle Import into {market.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {faqItems.map((faq, i) => (
                <div key={i} className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-none">
                  <div className="font-bold text-[#111111] mb-1.5 text-xs">{faq.question}</div>
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
