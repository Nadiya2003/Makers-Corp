'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Video } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { normalizeImageUrl } from '@/lib/imageUtils';

export function Footer() {
  const { settings } = useSettings();

  const footerData = settings?.footer || {
    logo: '',
    image: '',
    imageVisible: true,
    aboutText: 'Your trusted partner for importing premium Japanese vehicles directly to Sri Lanka. Better prices, transparent process, and complete peace of mind.',
    address: '123 Import Avenue, Colombo 03, Sri Lanka',
    phone: '+94 77 123 4567',
    email: 'info@ceylonimports.lk',
    copyrightText: `© ${new Date().getFullYear()} Makers Ceylon. All rights reserved.`,
    socialLinks: [] as Array<{ platform: string; url: string; visible?: boolean }>
  };

  const siteName = settings?.siteName || 'Makers Ceylon';
  const footerLogo = normalizeImageUrl(footerData.logo || settings?.logo);

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'tiktok': return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.11 7.47-1.87 1.83-4.52 2.84-7.1 2.63-2.69-.17-5.24-1.61-6.68-3.95-1.39-2.22-1.66-5.06-.69-7.46 1.05-2.58 3.39-4.51 6.13-5.06 1.04-.21 2.1-.22 3.14-.15v4.11c-.52-.08-1.04-.15-1.57-.13-1.09.03-2.18.52-2.88 1.34-.84.97-1.15 2.37-.8 3.63.32 1.19 1.25 2.16 2.39 2.58 1.4.52 3.03.38 4.29-.44 1.11-.74 1.76-1.97 1.85-3.32.06-2.55.02-5.11.03-7.66l.01-10.42z" />
        </svg>
      );
      default: return <Video className="w-5 h-5" />;
    }
  };

  let socialLinks = footerData.socialLinks;
  if (!socialLinks || socialLinks.length === 0) {
    socialLinks = [
      { platform: 'Facebook', url: '#', visible: true },
      { platform: 'Instagram', url: '#', visible: true },
      { platform: 'TikTok', url: '#', visible: true },
      { platform: 'YouTube', url: '#', visible: true }
    ];
  }

  const visibleSocialLinks = socialLinks.filter(
    (link: any) => link.visible !== false && link.url
  );

  const footerBgImage = normalizeImageUrl(footerData.image) || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1600&auto=format&fit=crop';

  return (
    <footer className="relative bg-[#050505] text-gray-300 py-8 sm:py-14 lg:py-16 border-t border-white/5 overflow-hidden">
      {/* Creative Split Footer Background */}
      {footerData.imageVisible && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Image fills the container, avoiding any middle-screen cut-off line */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={footerBgImage}
              alt="Footer background" 
              className="w-full h-full object-cover object-center opacity-40"
            />
            {/* Warm orange tint to brand the image */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-transparent to-blue-900/20" />
          </div>
          {/* Strong left-to-right fade so content is perfectly readable. 
              Using multiple stops to create a seamless blend from solid black to transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505] sm:via-[#050505]/80 to-transparent" />
          {/* Bottom fade for clean bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505] to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <p className="text-sm leading-relaxed text-gray-400 text-justify">
              {footerData.aboutText}
            </p>
            
            {/* Social Links */}
            {visibleSocialLinks.length > 0 && (
              <div className="flex items-center gap-4 pt-2">
                {visibleSocialLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 hover:bg-primary text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                    aria-label={link.platform}
                  >
                    {renderSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
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
                <a href="/#inquiry" className="hover:text-primary transition-colors">Contact Us</a>
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
                <span className="text-gray-400">{settings?.header?.contactNumber || footerData.phone}</span>
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
