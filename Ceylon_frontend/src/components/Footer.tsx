'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export function Footer() {
  const { settings } = useSettings();

  const footerData = settings?.footer || {
    logo: '',
    aboutText: 'Your trusted partner for importing premium Japanese vehicles directly to Sri Lanka. Better prices, transparent process, and complete peace of mind.',
    address: '123 Import Avenue, Colombo 03, Sri Lanka',
    phone: '+94 77 123 4567',
    email: 'info@ceylonimports.lk',
    copyrightText: `© ${new Date().getFullYear()} Makers Ceylon. All rights reserved.`
  };

  const siteName = settings?.siteName || 'Makers Ceylon';
  const footerLogo = footerData.logo || settings?.logo;

  return (
    <footer className="bg-[#020617] text-gray-300 py-8 sm:py-14 lg:py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {footerLogo ? (
                <img
                  src={footerLogo}
                  alt={siteName}
                  className="h-12 w-auto object-contain object-left"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-display font-bold text-xl">
                    {siteName.charAt(0)}
                  </div>
                  <span className="font-display font-bold text-xl tracking-tight text-white uppercase">
                    {siteName}
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {footerData.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#vehicles" className="hover:text-primary transition-colors">Featured Vehicles</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Our Services</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li className="text-gray-400">Direct Japan Sourcing</li>
              <li className="text-gray-400">Live Auction Bidding</li>
              <li className="text-gray-400">Bank Loan Assistance</li>
              <li className="text-gray-400">Customs Clearance</li>
              <li className="text-gray-400">Islandwide Delivery</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Contact Info</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">{footerData.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <span className="text-gray-400">{footerData.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <span className="text-gray-400">{footerData.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 text-center text-xs sm:text-sm text-gray-500">
          <p>{footerData.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
