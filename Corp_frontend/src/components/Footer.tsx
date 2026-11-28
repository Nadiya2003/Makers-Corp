'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Ship,
  FileCheck,
  ArrowUpRight
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const footerAbout = settings?.footer?.aboutText ||
    'A specialized Japanese vehicle export marketplace connecting verified Tokyo, Yokohama, Kobe, and Nagoya stock with international buyers across Asia, East Africa, and global right-hand-drive markets.';

  const footerAddress = settings?.footer?.address || 'Tokyo Export Hub, Minato-ku, Tokyo 105-0004, Japan';
  const footerPhone = settings?.footer?.phone || '+81 3 5555 0198';
  const footerEmail = settings?.footer?.email || 'japan@makers-corp.com';
  const footerLogo = settings?.footer?.logo || settings?.logo || '/images/makers-mark.png';
  const copyrightText = settings?.footer?.copyrightText ||
    `© ${currentYear} ${settings?.siteName || 'Makers Corp Japan'}. All rights reserved. Tokyo, Japan.`;

  return (
    <footer className="bg-[#111111] text-neutral-300 pt-12 pb-8 border-t border-neutral-800 text-xs rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Pillar Highlights (Square Corners) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-neutral-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-none bg-neutral-900 flex items-center justify-center shrink-0 text-[#ff6a00] border border-neutral-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">100% Genuine Physical Inventory</div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Every listed unit is physically verified in Japan with authentic chassis numbers, genuine mileage records, and documented de-registration certificates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-none bg-neutral-900 flex items-center justify-center shrink-0 text-[#ff6a00] border border-neutral-700">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Transparent Shipping Terms</div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Clear distinction between FOB Japan and CIF destination port amounts. Explicit disclosure of what is included and excluded before quotation confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-none bg-neutral-900 flex items-center justify-center shrink-0 text-[#ff6a00] border border-neutral-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Destination Review Protocol</div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Vehicle eligibility reviewed against destination regulations (e.g. DGFT direct import for India, LC and age criteria for Sri Lanka) prior to proforma invoice.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Column Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Brand & Corporate */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src={footerLogo}
                  alt={`${settings?.siteName || 'Makers Corp Japan'} Logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-black text-base tracking-tight text-white uppercase">
                {settings?.siteName?.includes('Makers') ? (
                  <>Makers Corp <span className="text-[#ff6a00] font-black">Japan</span></>
                ) : (
                  settings?.siteName || 'Makers Corp Japan'
                )}
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs pr-4">
              {footerAbout}
            </p>

            <div className="space-y-2 text-neutral-300 text-xs pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ff6a00] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium">Head Operations Desk:</span> {footerAddress}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#ff6a00] shrink-0" />
                <span className="text-neutral-300">Japan HQ: {footerPhone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ff6a00] shrink-0" />
                <span className="text-neutral-300">{footerEmail}</span>
              </div>
            </div>
          </div>

          {/* Sourcing & Stock */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#ff6a00] pl-2">
              Inventory Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/vehicles" className="hover:text-[#ff6a00] transition-colors">
                  All Japan Stock
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=SUVs+%26+4x4" className="hover:text-[#ff6a00] transition-colors">
                  SUVs & 4x4
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Luxury+%26+Performance" className="hover:text-[#ff6a00] transition-colors">
                  Luxury & Performance
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Vans+%26+MPVs" className="hover:text-[#ff6a00] transition-colors">
                  Vans & MPVs (Hiace / Alphard)
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Trucks+%26+Commercial" className="hover:text-[#ff6a00] transition-colors">
                  Trucks & Commercial
                </Link>
              </li>
              <li>
                <Link href="/request-a-vehicle" className="text-[#ff6a00] font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Made-to-Order Sourcing</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Export Destinations */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#ff6a00] pl-2">
              Export Destinations
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/destinations/asia/india" className="hover:text-[#ff6a00] transition-colors">
                  India (Nhava Sheva / Chennai)
                </Link>
              </li>
              <li>
                <Link href="/destinations/asia/sri-lanka" className="hover:text-[#ff6a00] transition-colors">
                  Sri Lanka (Colombo Port)
                </Link>
              </li>
              <li>
                <a
                  href="https://makersceylon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Makers Ceylon SL Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/destinations/asia/pakistan" className="hover:text-[#ff6a00] transition-colors">
                  Pakistan (Karachi Port)
                </Link>
              </li>
              <li>
                <Link href="/destinations/africa" className="hover:text-[#ff6a00] transition-colors">
                  Kenya (Mombasa Port)
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-[#ff6a00] font-semibold hover:underline inline-flex items-center gap-1">
                  <span>All Destination Guides</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#ff6a00] pl-2">
              Company & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-[#ff6a00] transition-colors">
                  About Makers Corp Japan
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="hover:text-[#ff6a00] transition-colors">
                  Export Process Guide
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#ff6a00] transition-colors">
                  News & Market Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#ff6a00] transition-colors">
                  Contact Export Desk
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#ff6a00] transition-colors">
                  Terms of Trade & Export
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#ff6a00] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <div>
            {copyrightText}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-neutral-400">
              Terms of Trade
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-neutral-400">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-neutral-400">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
