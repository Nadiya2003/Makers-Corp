'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export function TrustAndProcess() {
  const steps = [
    {
      step: '01',
      title: 'Vehicle Selection & Destination Check',
      description:
        'Choose a physical vehicle from our stock or submit a custom sourcing request. Our homologation team verifies eligibility for your destination country.'
    },
    {
      step: '02',
      title: 'Proforma Invoice & Payment Agreement',
      description:
        'Receive a written Proforma Invoice with explicit FOB or CIF terms. Payment is executed via secure international bank wire transfer or verified commercial Letter of Credit (LC).'
    },
    {
      step: '03',
      title: 'Pre-Shipment Yard Inspection',
      description:
        'The vehicle undergoes mandatory roadworthiness, structural, and odometer verification (JEVIC, JAAI, or QISJ according to destination requirements).'
    },
    {
      step: '04',
      title: 'Ocean Freight & Document Dispatch',
      description:
        'Booking on first available Ro-Ro or container vessel to your destination discharge port. Original Bill of Lading and Export Certificate are dispatched via DHL.'
    }
  ];

  return (
    <section className="bg-white py-14 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step-by-Step Export Process */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-[#ff6a00] uppercase tracking-widest block mb-1">
              Transparent International Trade
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              How Vehicle Export Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-medium">
              A structured 4-step process designed to give international buyers complete certainty before vessel departure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white border border-neutral-300 rounded-none p-5 shadow-sm hover:border-[#ff6a00] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-black text-[#ff6a00]/40 mb-3">{s.step}</div>
                  <h3 className="font-black text-sm text-neutral-900 mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/how-to-buy"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:underline"
            >
              <span>Read the Complete Step-by-Step Export & Customs Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2 Column Trust Block: Dealer Inquiries & Official Head Office Details (Square Corners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dealer & Commercial Importer Desk */}
          <div className="bg-white border border-neutral-300 rounded-none p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-none bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4 border border-neutral-200">
                <Building className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <h3 className="text-lg font-black text-neutral-900 mb-2">
                Dealer & Volume Importer Program
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4 font-medium">
                Are you an established vehicle dealership or commercial fleet operator in India, Sri Lanka, or East Africa? We offer multi-unit container loading, dedicated auction bidding lines, and scheduled Ro-Ro space allocation.
              </p>

              <div className="space-y-2 text-xs text-neutral-700 mb-6 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Consolidated container packing (up to 4 vehicles per 40ft HC container)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent bidding logs with verifiable auction transaction sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom commercial invoice documentation aligned with local customs requirements</span>
                </div>
              </div>
            </div>

            <Link
              href="/contact?type=dealer"
              className="w-full bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-4 rounded-none text-center transition-colors shadow-sm"
            >
              Contact Our Dealer Desk
            </Link>
          </div>

          {/* Official Verification & Sourcing Callout (Near Black) */}
          <div className="bg-[#111111] text-white border border-neutral-800 rounded-none p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-none bg-neutral-800 text-[#ff6a00] flex items-center justify-center mb-4 border border-neutral-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                Need a Model Not In Stock?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-medium">
                Our Tokyo export coordinators access daily major Japanese auto auctions (USS Tokyo, TAA, CAA, USS Yokohama). We will locate, inspect, and quote matching units within 24 hours.
              </p>

              <div className="bg-neutral-900 border border-neutral-700 rounded-none p-3.5 mb-6 text-xs text-neutral-300 space-y-1 font-medium">
                <div className="text-[11px] font-bold text-[#ff6a00] uppercase tracking-wider mb-1">
                  Verified Contact Information
                </div>
                <div>Head Office Desk: +81 3 5555 0198 (Tokyo, Japan)</div>
                <div>Sri Lanka Operations Desk: +94 77 123 4567 (Colombo 03)</div>
                <div>Direct Sourcing Email: export@makerscorp.jp</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/request-a-vehicle"
                className="bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold py-2.5 px-3 rounded-none text-center transition-colors shadow-sm"
              >
                Request Sourcing
              </Link>
              <a
                href="https://wa.me/818012345678?text=Hello%20Makers%20Corp%20Japan,%20I%20would%20like%20to%20request%20a%20vehicle%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-none text-center transition-colors shadow-sm"
              >
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
