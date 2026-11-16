'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  Ship,
  FileCheck,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1120] text-slate-300 pt-14 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Pillar Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800/90 flex items-center justify-center shrink-0 text-orange-400 border border-slate-700/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">100% Genuine Physical Inventory</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every listed unit is physically verified in Japan with authentic chassis numbers, genuine mileage records, and documented de-registration certificates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800/90 flex items-center justify-center shrink-0 text-orange-400 border border-slate-700/60">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Transparent Shipping Terms</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Clear distinction between FOB Japan and CIF destination port amounts. Explicit disclosure of what is included and excluded before quotation confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800/90 flex items-center justify-center shrink-0 text-orange-400 border border-slate-700/60">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Destination Review Protocol</div>
              <p className="text-slate-400 text-xs leading-relaxed">
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
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white font-black text-lg">
                M
              </div>
              <span className="font-extrabold text-base tracking-tight text-white uppercase">
                Makers Corp <span className="text-orange-500 font-bold">Japan</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs pr-4">
              A specialized Japanese vehicle export marketplace connecting verified Tokyo, Yokohama, Kobe, and Nagoya stock with international buyers across Asia, East Africa, and global right-hand-drive markets.
            </p>

            <div className="space-y-2 text-slate-300 text-xs pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium">Head Operations Desk:</span> Tokyo Export Hub, Minato-ku, Tokyo 105-0004, Japan
                  <span className="block text-[11px] text-slate-500 italic mt-0.5">
                    (Registered entity confirmation pending formal corporate registration publication)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium">Sri Lanka Operations Liaison:</span> 123 Import Avenue, Colombo 03, Sri Lanka
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-slate-300">Japan HQ: +81 3 5555 0198 | SL Desk: +94 77 123 4567</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-slate-300">export@makerscorp.jp | india-desk@makerscorp.jp</span>
              </div>
            </div>
          </div>

          {/* Sourcing & Stock */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Inventory Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/vehicles" className="hover:text-orange-400 transition-colors">
                  All Japan Stock
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=SUVs+%26+4x4" className="hover:text-orange-400 transition-colors">
                  SUVs & 4x4
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Luxury+%26+Performance" className="hover:text-orange-400 transition-colors">
                  Luxury & Performance
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Vans+%26+MPVs" className="hover:text-orange-400 transition-colors">
                  Vans & MPVs (Hiace / Alphard)
                </Link>
              </li>
              <li>
                <Link href="/vehicles?body=Trucks+%26+Commercial" className="hover:text-orange-400 transition-colors">
                  Trucks & Commercial
                </Link>
              </li>
              <li>
                <Link href="/request-a-vehicle" className="text-orange-400 font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Custom Sourcing Request</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Destination Markets
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/destinations/asia/india" className="hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>India (Launch Route)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations/asia/sri-lanka" className="hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>Sri Lanka (Colombo Desk)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations/asia/pakistan" className="hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>Pakistan (Karachi)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">Inquiry Only</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations/africa" className="hover:text-orange-400 transition-colors">
                  Kenya & Tanzania
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-orange-400 transition-colors font-semibold text-slate-200">
                  All Destinations Directory →
                </Link>
              </li>
            </ul>
          </div>

          {/* Process & Trust */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Buyer Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/how-to-buy" className="hover:text-orange-400 transition-colors">
                  Export Process Guide
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-orange-400 transition-colors text-orange-400">
                  News & Reviews (Media Center)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  About Makers Corp Japan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  Head Office & Desks
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-400 transition-colors">
                  Terms & Shipping Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure Disclaimer */}
        <div className="pt-6 pb-6 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400">Legal & Commercial Notice:</strong> Makers Corp Japan operates as a vehicle sourcing and international trade export marketplace. “Reviewed for quotation” indicates an internal documentation and specification review and does not constitute a guarantee of customs clearance, individual import licensing, or destination road transport registration.
          </p>
          <p>
            Quoted CIF (Cost, Insurance, and Freight) prices include vehicle cost, ocean freight to the named discharge port, and marine cargo transit insurance. Quoted amounts strictly exclude destination country import tariffs, value-added taxes (e.g. GST/VAT), demurrage, port handling charges, customs broker fees, and domestic vehicle registration fees.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © {currentYear} Makers Corp Japan. All rights reserved. Global Export Division.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Terms of Trade</Link>
            <span>·</span>
            <Link href="/contact" className="hover:underline">Contact Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
