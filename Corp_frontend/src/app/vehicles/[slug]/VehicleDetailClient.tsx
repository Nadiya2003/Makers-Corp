'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Compass,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Ship,
  HelpCircle,
  Share2,
  Check,
  AlertTriangle,
  X,
  Globe
} from 'lucide-react';
import { Vehicle, ReviewState, PriceBasis } from '@/data';
import { useMarket } from '@/context/MarketContext';
import { getReviewState, getVehicleReview } from '@/data/reviews';
import { getEffectivePrice, getVehicleOffer } from '@/data/offers';
import { markets, vehicles } from '@/data';
import { VehicleCard } from '@/components/VehicleCard';
import { fetchLiveVehicles } from '@/lib/api';

export function VehicleDetailClient({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const {
    destinationSlug,
    setDestination,
    selectedPortId,
    setPortId,
    formatPrice,
    displayCurrency
  } = useMarket();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quote Form State
  const [formName, setFormName] = useState('');
  const [formContactMethod, setFormContactMethod] = useState<'WhatsApp' | 'Email' | 'Phone'>('WhatsApp');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBuyerType, setFormBuyerType] = useState<'Individual' | 'Dealer / Importer'>('Individual');
  const [formNotes, setFormNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<null | { leadId: string; routedTo: string }>(null);
  const [formError, setFormError] = useState('');

  // Load live vehicles from DB for alternative recommendations
  const [liveVehicles, setLiveVehicles] = useState(vehicles);
  React.useEffect(() => {
    fetchLiveVehicles()
      .then((v) => { if (v && v.length > 0) setLiveVehicles(v); })
      .catch(() => {});
  }, []);

  // 3-Question Matrix evaluation
  const activeDest = destinationSlug;
  const currentMarket = markets.find((m) => m.slug === activeDest);
  const reviewState: ReviewState = getReviewState(vehicle.stockId, activeDest);
  const reviewDetails = getVehicleReview(vehicle.stockId, activeDest);

  const priceInfo = getEffectivePrice(vehicle.stockId, activeDest, selectedPortId);
  const currentOffer = getVehicleOffer(vehicle.stockId, activeDest, selectedPortId);
  const formattedPrice = formatPrice(priceInfo.amount);

  const isSold = vehicle.availability === 'Sold';
  const isReserved = vehicle.availability === 'Reserved';

  // Find alternatives from live DB vehicles (includes admin-uploaded vehicles)
  const alternativeVehicles = liveVehicles
    .filter((v) => v.stockId !== vehicle.stockId && v.availability !== 'Sold')
    .slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          contactMethod: formContactMethod,
          phone: formPhone,
          email: formEmail,
          destination: activeDest ? activeDest.toUpperCase() : 'GLOBAL',
          port: selectedPortId || 'Any primary discharge port',
          buyerType: formBuyerType,
          leadType: 'stock_quote',
          stockId: vehicle.stockId,
          vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.grade})`,
          notes: formNotes,
          sourceRoute: window.location.pathname
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormSubmitted({ leadId: data.leadId, routedTo: data.routedTo });
      } else {
        setFormError(data.message || 'Error submitting quote request.');
      }
    } catch (err) {
      setFormError('Failed to connect to quotation service. Please use WhatsApp for immediate quotation.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Makers Corp Japan,\n\nI am requesting a written quote for:\nVehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.grade})\nStock ID: ${vehicle.stockId}\nModel Code: ${vehicle.modelCode}\nDestination: ${currentMarket ? currentMarket.name : 'Global / Not Set'}\nPort: ${selectedPortId || 'Primary'}\nListing: ${typeof window !== 'undefined' ? window.location.href : ''}`
  );

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <a href="/" className="hover:text-neutral-800">Home</a>
            <span>/</span>
            <a href="/vehicles" className="hover:text-neutral-800">Vehicles</a>
            <span>/</span>
            <span className="font-semibold text-neutral-800 truncate">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-white border border-neutral-200 px-2.5 py-1 rounded-none hover:bg-neutral-50 transition-colors shrink-0"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Listing'}</span>
          </button>
        </div>

        {/* SOLD BANNER (When Vehicle is Sold) */}
        {isSold && (
          <div className="mb-6 p-4 bg-[#111111] text-white rounded-none border-l-4 border-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm uppercase tracking-wide">
                  This Vehicle Has Been Sold
                </div>
                <div className="text-xs text-neutral-300">
                  Stock record {vehicle.stockId} is archived for customs and bill of lading reference. Quote requests are disabled.
                </div>
              </div>
            </div>

            <a
              href={`/request-a-vehicle?model=${encodeURIComponent(`${vehicle.make} ${vehicle.model}`)}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold px-4 py-2 rounded-none shrink-0 transition-colors"
            >
              <span>Source Matching Unit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Vehicle Header Title Section */}
        <div className="bg-white border border-neutral-200 rounded-none p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#111111] text-white text-xs font-mono font-bold tracking-wider rounded-none">
                  Stock: {vehicle.stockId}
                </span>
                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-none border border-neutral-200">
                  Chassis / Model: {vehicle.modelCode}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-none border border-emerald-200">
                  Grade {vehicle.conditionGrade}
                </span>
                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-none">
                  {vehicle.sourceType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-sm font-semibold text-neutral-500 mt-0.5">
                {vehicle.grade} · First Reg: {vehicle.firstRegistrationDate}
              </p>
            </div>

            {/* Price Plaque */}
            <div className="text-left md:text-right shrink-0 bg-neutral-50 md:bg-transparent p-3 md:p-0 rounded-none border md:border-0 border-neutral-200">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {priceInfo.priceBasis === 'CIF'
                  ? `CIF Price (${priceInfo.portLabel})`
                  : priceInfo.priceBasis === 'FOB'
                  ? `FOB Price (${priceInfo.portLabel})`
                  : 'Quotation Basis'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#111111]">
                {isSold ? (
                  <span className="text-neutral-500">SOLD</span>
                ) : priceInfo.priceBasis === 'QUOTE_ONLY' ? (
                  <span className="text-xl text-neutral-700">Quote on Request</span>
                ) : (
                  formattedPrice.formatted
                )}
              </div>
              {formattedPrice.isConverted && !isSold && priceInfo.priceBasis !== 'QUOTE_ONLY' && (
                <div className="text-xs text-neutral-500 font-medium">
                  (~ USD ${priceInfo.amount.toLocaleString()} base)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Gallery & Right Conversion Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Column: Gallery & Technical Specs (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery */}
            <div className="bg-white border border-neutral-200 rounded-none p-3 sm:p-4 shadow-sm">
              {/* Primary Large Image */}
              <div className="relative aspect-[16/10] bg-neutral-100 rounded-none overflow-hidden mb-3">
                <Image
                  src={vehicle.images[selectedImage] || '/images/vehicle.jpg'}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {vehicle.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-14 rounded-none overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-[#ff6a00] scale-95 ring-1 ring-[#ff6a00]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3-Question Evaluation Plaque */}
            <div className="bg-white border border-neutral-200 rounded-none p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <h3 className="font-extrabold text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
                  Three-Question Verification Matrix
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Last checked: {new Date(vehicle.lastAvailabilityCheck).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Question 1: Physical Availability */}
                <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-none">
                  <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">
                    1. Physical Availability
                  </div>
                  <div className="text-sm font-black text-[#111111] flex items-center gap-1.5">
                    {isSold ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-neutral-500" />
                        Sold (Archived)
                      </>
                    ) : isReserved ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Reserved
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Confirmed Available
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Inspected physical unit in Japan export yard.
                  </div>
                </div>

                {/* Question 2: Destination Review */}
                <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-none">
                  <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">
                    2. Destination Review ({activeDest ? activeDest.toUpperCase() : 'Global'})
                  </div>
                  <div className="text-sm font-black text-[#111111] flex items-center gap-1.5">
                    {reviewState === 'reviewed_for_quotation' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Reviewed for Quotation
                      </>
                    ) : reviewState === 'import_check_required' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Import Check Required
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Not Offered
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {activeDest
                      ? `Conformity reviewed for ${activeDest.toUpperCase()} import policy.`
                      : 'Select a destination country to assess route eligibility.'}
                  </div>
                </div>

                {/* Question 3: Current Route Pricing */}
                <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-none">
                  <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">
                    3. Route Pricing Status
                  </div>
                  <div className="text-sm font-black text-[#111111] flex items-center gap-1.5">
                    {isSold ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-neutral-400" />
                        Unavailable (Sold)
                      </>
                    ) : priceInfo.priceBasis === 'CIF' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Valid Listed CIF
                      </>
                    ) : priceInfo.priceBasis === 'FOB' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Valid Listed FOB
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Quote on Request
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {priceInfo.priceBasis === 'CIF'
                      ? 'Ocean freight and marine insurance calculated.'
                      : 'FOB Japan yard amount listed. Ocean freight quoted upon request.'}
                  </div>
                </div>
              </div>

              {/* Reviewer Note when Destination is Active */}
              {reviewDetails && reviewDetails.regulatoryNotes && (
                <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-none text-xs text-[#111111]">
                  <strong>Specialist Review Note ({reviewDetails.reviewer}):</strong>{' '}
                  {reviewDetails.regulatoryNotes}
                </div>
              )}
            </div>

            {/* Comprehensive Technical Specifications Table */}
            <div className="bg-white border border-neutral-200 rounded-none p-5 shadow-sm">
              <h3 className="font-extrabold text-sm text-[#111111] uppercase tracking-wider mb-4">
                Detailed Vehicle Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Stock Number:</span>
                  <span className="font-mono font-bold text-[#111111]">{vehicle.stockId}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Chassis / Model Code:</span>
                  <span className="font-bold text-[#111111]">{vehicle.modelCode}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Model Year:</span>
                  <span className="font-bold text-[#111111]">{vehicle.year}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">First Registration Date:</span>
                  <span className="font-bold text-[#111111]">{vehicle.firstRegistrationDate}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Mileage (Verified):</span>
                  <span className="font-bold text-[#111111]">{vehicle.mileageKm.toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Engine Displacement:</span>
                  <span className="font-bold text-[#111111]">{vehicle.engineCc.toLocaleString()} cc</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Fuel Type:</span>
                  <span className="font-bold text-[#111111]">{vehicle.fuel}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Transmission:</span>
                  <span className="font-bold text-[#111111]">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Drivetrain:</span>
                  <span className="font-bold text-[#111111]">{vehicle.drivetrain}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Steering Side:</span>
                  <span className="font-bold text-[#111111]">{vehicle.steering} (Right-Hand Drive)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Body Style:</span>
                  <span className="font-bold text-[#111111]">{vehicle.bodyType}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Seating Capacity:</span>
                  <span className="font-bold text-[#111111]">{vehicle.seats} Seats</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Exterior Color:</span>
                  <span className="font-bold text-[#111111]">{vehicle.color}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Inspection Status:</span>
                  <span className="font-bold text-emerald-700">{vehicle.inspectionStatus}</span>
                </div>
              </div>
            </div>

            {/* Key Features & Overview */}
            <div className="bg-white border border-neutral-200 rounded-none p-5 shadow-sm">
              <h3 className="font-extrabold text-sm text-[#111111] uppercase tracking-wider mb-3">
                Key Features & Equipment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 mb-6">
                {vehicle.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-xs text-[#111111] uppercase tracking-wider mb-2">
                Inspector Overview
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 rounded-none border border-neutral-200/80">
                {vehicle.overview}
              </p>
            </div>
          </div>

          {/* Right Column: Destination Checker, Pricing Inclusions, and Leads (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Destination Selection Plaque */}
            <div className="bg-white border border-neutral-200 rounded-none p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">
                  Destination Import Check
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">
                    Select Your Country
                  </label>
                  <select
                    value={activeDest || ''}
                    onChange={(e) => setDestination(e.target.value || null)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-neutral-800 font-semibold focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value="">Global Showroom (FOB Terms)</option>
                    <option value="india">India (Direct Import Program)</option>
                    <option value="sri-lanka">Sri Lanka (Colombo Port)</option>
                    <option value="kenya">Kenya (Mombasa Port)</option>
                    <option value="tanzania">Tanzania (Dar es Salaam)</option>
                    <option value="pakistan">Pakistan (Inquiry Only)</option>
                  </select>
                </div>

                {currentMarket && currentMarket.supportedPorts.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1">
                      Discharge Port
                    </label>
                    <select
                      value={selectedPortId || ''}
                      onChange={(e) => setPortId(e.target.value || null)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-neutral-800 focus:outline-none focus:border-[#ff6a00]"
                    >
                      {currentMarket.supportedPorts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.transitDays})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Price Terms & Inclusions */}
              <div className="border-t border-neutral-100 pt-3 text-xs">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-bold text-neutral-700">Price Basis:</span>
                  <span className="font-mono font-bold text-[#ff6a00]">
                    {priceInfo.priceBasis} {priceInfo.portLabel ? `(${priceInfo.portLabel})` : ''}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-500 space-y-1 mt-2">
                  <div className="font-semibold text-neutral-700">What is Included:</div>
                  {currentOffer ? (
                    currentOffer.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-emerald-700">
                        <Check className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-600">
                      • Base vehicle cost in Japan yard
                      <br />• Official export certificate & de-registration
                    </div>
                  )}

                  <div className="font-semibold text-neutral-700 pt-1.5">What is Excluded:</div>
                  <div className="text-neutral-500 text-[10px] leading-relaxed">
                    Destination import duty, local VAT/GST, port demurrage, customs brokerage, and domestic vehicle registration.
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="bg-white border border-neutral-200 rounded-none p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111] mb-2">
                Order & Quotation Desk
              </h3>

              {isSold ? (
                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-none text-xs text-center">
                  This unit has been sold. Quotation submissions are closed.
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="w-full bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs py-3 rounded-none transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Official Written Quote</span>
                  </button>

                  <a
                    href={`https://wa.me/818012345678?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-none transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>WhatsApp Export Specialist</span>
                  </a>
                </>
              )}

              {/* Sri Lanka Reference Note when active */}
              {activeDest === 'sri-lanka' && vehicle.referencePriceLKR && (
                <div className="mt-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-none text-[11px] text-neutral-600">
                  <div className="font-bold text-neutral-800">
                    {vehicle.referencePriceLKR.label}:
                  </div>
                  <div className="font-bold text-emerald-700 text-xs">
                    LKR {(vehicle.referencePriceLKR.minLKR / 100000).toFixed(1)} Lakhs – {(vehicle.referencePriceLKR.maxLKR / 100000).toFixed(1)} Lakhs
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Estimated landed market valuation in Sri Lanka. Excludes individual bank LC margin.
                  </div>
                </div>
              )}
            </div>

            {/* Operations Contact Desk */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-none p-4 text-xs text-neutral-600 space-y-2">
              <div className="font-bold text-[#111111] text-xs uppercase tracking-wider">
                Direct Contact Desks
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>Tokyo Export Hub: +81 3 5555 0198</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>Sri Lanka Desk: +94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>inquiry@makerscorp.jp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar / Alternative Vehicles Recommendations */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#111111] tracking-tight">
                {isSold ? 'Recommended Alternative Vehicles' : 'Similar Vehicles in Showroom'}
              </h3>
              <p className="text-xs text-neutral-500">
                Explore matching genuine physical stock available for export loading
              </p>
            </div>
            <a href="/vehicles" className="text-xs font-bold text-[#ff6a00] hover:underline">
              View All Stock →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alternativeVehicles.map((alt) => (
              <VehicleCard key={alt.id} vehicle={alt} />
            ))}
          </div>
        </div>
      </div>

      {/* QUOTATION MODAL */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-lg w-full p-6 text-neutral-800 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setQuoteModalOpen(false);
                setFormSubmitted(null);
                setFormError('');
              }}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">
                  Quotation Request Received
                </h3>
                <p className="text-xs text-neutral-600 mb-4">
                  Reference Code: <strong className="font-mono text-[#111111]">{formSubmitted.leadId}</strong>
                  <br />
                  Routed to queue: <strong className="text-[#ff6a00]">{formSubmitted.routedTo}</strong>
                </p>
                <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                  Our Tokyo trade coordinator is preparing your official Proforma quotation and will contact you via your preferred channel ({formContactMethod}).
                </p>

                <button
                  onClick={() => {
                    setQuoteModalOpen(false);
                    setFormSubmitted(null);
                  }}
                  className="bg-[#111111] text-white text-xs font-bold px-5 py-2.5 rounded-none hover:bg-neutral-800"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#ff6a00] tracking-wider">
                    Official Written Quotation
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#111111]">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    Stock ID: <span className="font-mono font-bold text-neutral-800">{vehicle.stockId}</span>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-none border border-rose-200">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter your name or dealership name"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Preferred Channel *
                    </label>
                    <select
                      value={formContactMethod}
                      onChange={(e) => setFormContactMethod(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00]"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Buyer Type
                    </label>
                    <select
                      value={formBuyerType}
                      onChange={(e) => setFormBuyerType(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00]"
                    >
                      <option value="Individual">Individual Buyer</option>
                      <option value="Dealer / Importer">Dealer / Commercial Importer</option>
                    </select>
                  </div>
                </div>

                {formContactMethod === 'WhatsApp' || formContactMethod === 'Phone' ? (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      WhatsApp / Phone Number (With Country Code) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210 or +94 77 123 4567"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00] focus:bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. buyer@example.com"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00] focus:bg-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Destination Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value={activeDest ? activeDest.toUpperCase() : 'GLOBAL / TOKYO HUB'}
                      className="w-full bg-neutral-100 border border-neutral-200 rounded-none p-2 text-xs text-neutral-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Port of Discharge
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedPortId || 'Primary Discharge Port'}
                      className="w-full bg-neutral-100 border border-neutral-200 rounded-none p-2 text-xs text-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Specific Requirements or Questions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Request CIF Nhava Sheva container loading, LC payment inquiry, JEVIC certificate..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-none p-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00] focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs py-2.5 rounded-none transition-colors shadow-sm disabled:opacity-50"
                  >
                    {formSubmitting ? 'Sending Request...' : 'Submit Quotation Request'}
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center mt-2">
                    Your contact information will only be used to provide your vehicle quotation. No marketing spam.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
