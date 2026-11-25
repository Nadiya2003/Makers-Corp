'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Globe,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Check,
  ArrowRight,
  Pause,
  Play,
  ExternalLink
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

interface AnnouncementItem {
  text: string;
  href: string;
  isExternal?: boolean;
}

const ANNOUNCEMENT_ITEMS: AnnouncementItem[] = [
  { text: 'Browse Vehicles from Japan', href: '/vehicles' },
  { text: 'India Export Enquiries', href: '/destinations/asia/india' },
  {
    text: 'Sri Lanka Customers → Makers Ceylon',
    href: 'https://makersceylon.com/',
    isExternal: true
  }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    destinationSlug,
    market,
    setDestination,
    clearDestination,
    displayCurrency,
    setDisplayCurrency
  } = useMarket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setDestMenuOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDestMenuOpen(false);
        setCurrencyMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDestMenuOpen(false);
    setCurrencyMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/vehicles' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'How to Buy', href: '/how-to-buy' },
    { name: 'News & Reviews', href: '/news' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      {/* 1. Promotional Ticker Strip (Scrolls away with normal flow) */}
      <div
        className="bg-[#111111] text-neutral-200 text-xs h-8 sm:h-9 border-b border-neutral-800 px-3 sm:px-6 relative z-30 flex items-center justify-between overflow-hidden"
        role="region"
        aria-label="Export announcements"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 group">
            {/* Visible Pause Control */}
            <button
              type="button"
              onClick={() => setIsTickerPaused((prev) => !prev)}
              aria-label={isTickerPaused ? 'Play announcement ticker' : 'Pause announcement ticker'}
              className="inline-flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0 rounded-none focus-visible:outline-[#ff6a00]"
              title={isTickerPaused ? 'Resume scrolling' : 'Pause scrolling'}
            >
              {isTickerPaused ? (
                <Play className="w-3 h-3 fill-current" />
              ) : (
                <Pause className="w-3 h-3 fill-current" />
              )}
            </button>

            {/* Marquee Track */}
            <div className="overflow-hidden flex-1 relative">
              <div
                className="animate-marquee flex items-center group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
                style={isTickerPaused ? { animationPlayState: 'paused' } : undefined}
              >
                {/* Primary Loop */}
                <div className="flex items-center shrink-0">
                  {ANNOUNCEMENT_ITEMS.map((item, idx) => (
                    <React.Fragment key={`announce-p-${idx}`}>
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#ff6a00] hover:underline inline-flex items-center gap-1 font-medium transition-colors text-[11px] sm:text-xs text-neutral-200"
                        >
                          <span>{item.text}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="hover:text-[#ff6a00] hover:underline inline-flex items-center gap-1 font-medium transition-colors text-[11px] sm:text-xs text-neutral-200"
                        >
                          {item.text}
                        </Link>
                      )}
                      <span className="text-[#ff6a00] font-bold mx-3 sm:mx-5 select-none" aria-hidden="true">
                        ·
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Duplicated Loop for Marquee */}
                <div className="flex items-center shrink-0" aria-hidden="true">
                  {ANNOUNCEMENT_ITEMS.map((item, idx) => (
                    <React.Fragment key={`announce-dup-${idx}`}>
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={-1}
                          className="hover:text-[#ff6a00] hover:underline inline-flex items-center gap-1 font-medium transition-colors text-[11px] sm:text-xs text-neutral-200"
                        >
                          <span>{item.text}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          tabIndex={-1}
                          className="hover:text-[#ff6a00] hover:underline inline-flex items-center gap-1 font-medium transition-colors text-[11px] sm:text-xs text-neutral-200"
                        >
                          {item.text}
                        </Link>
                      )}
                      <span className="text-[#ff6a00] font-bold mx-3 sm:mx-5 select-none">·</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-neutral-400 font-medium shrink-0">
            <span>Direct Tokyo Operations Desk</span>
            <span>·</span>
            <span className="text-white font-semibold">100% Genuine Physical Inventory</span>
          </div>
        </div>
      </div>

      {/* 2. SHARED STICKY HEADER CONTAINER (Stays visible & functional while scrolling) */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm transition-all duration-150">
        {/* Row 1: Brand Header & Utility Selectors */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Official Makers Brand Logo & Identity */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/images/makers-logo.png"
                  alt="Makers Corp Japan Official Logo"
                  width={40}
                  height={40}
                  priority
                  className="object-contain w-9 h-9 sm:w-10 sm:h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-xl tracking-tight text-neutral-900 uppercase leading-none">
                  Makers Corp <span className="text-[#ff6a00] font-black">Japan</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-bold tracking-wider uppercase mt-0.5">
                  Vehicles Sourced from Japan
                </span>
              </div>
            </Link>

            {/* Right: Destination & Currency Selectors (Directly accessible on desktop AND mobile) + Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Destination Selector Dropdown */}
              <div className="relative" ref={destRef}>
                <button
                  type="button"
                  onClick={() => {
                    setDestMenuOpen(!destMenuOpen);
                    setCurrencyMenuOpen(false);
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 py-1 px-2 sm:px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 rounded-none text-[11px] sm:text-xs font-semibold transition-colors focus-visible:outline-[#ff6a00]"
                  title="Select destination market"
                  aria-expanded={destMenuOpen}
                  aria-haspopup="true"
                >
                  <Globe className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                  <span className="hidden sm:inline text-neutral-600 font-medium">Market:</span>
                  <span className="font-bold text-neutral-900 truncate max-w-[85px] sm:max-w-none">
                    {market ? market.name : 'Global'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
                </button>

                {destMenuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-64 bg-white shadow-2xl border border-neutral-300 rounded-none py-1.5 z-[70] text-neutral-900 text-xs"
                    role="menu"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                      Select Destination Market
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        clearDestination();
                        setDestMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-orange-50 rounded-none ${
                        !destinationSlug ? 'bg-orange-50 text-[#ff6a00] font-bold' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-neutral-500" />
                        Global (FOB Japan / All Stock)
                      </span>
                      {!destinationSlug && <Check className="w-3.5 h-3.5 text-[#ff6a00]" />}
                    </button>

                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Asia Markets
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination('india');
                        setDestMenuOpen(false);
                        router.push('/destinations/asia/india');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 rounded-none ${
                        destinationSlug === 'india' ? 'bg-orange-50 text-[#ff6a00] font-bold' : ''
                      }`}
                    >
                      <span>India (Nhava Sheva / Chennai)</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-800 px-1 py-0.5 font-bold rounded-none">
                        Active
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDestination('sri-lanka');
                        setDestMenuOpen(false);
                        router.push('/destinations/asia/sri-lanka');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 rounded-none ${
                        destinationSlug === 'sri-lanka' ? 'bg-orange-50 text-[#ff6a00] font-bold' : ''
                      }`}
                    >
                      <span>Sri Lanka (Colombo Port)</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-800 px-1 py-0.5 font-bold rounded-none">
                        Active
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDestination('pakistan');
                        setDestMenuOpen(false);
                        router.push('/destinations/asia/pakistan');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 rounded-none ${
                        destinationSlug === 'pakistan' ? 'bg-orange-50 text-[#ff6a00] font-bold' : ''
                      }`}
                    >
                      <span>Pakistan (Karachi Port)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 font-bold rounded-none">
                        Inquiry
                      </span>
                    </button>

                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Africa Markets
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination('kenya');
                        setDestMenuOpen(false);
                        router.push('/destinations/africa');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 rounded-none ${
                        destinationSlug === 'kenya' ? 'bg-orange-50 text-[#ff6a00] font-bold' : ''
                      }`}
                    >
                      <span>Kenya (Mombasa Port)</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-800 px-1 py-0.5 font-bold rounded-none">
                        Active
                      </span>
                    </button>

                    <div className="border-t border-neutral-100 mt-1.5 pt-1 px-3 py-1 bg-neutral-50">
                      <Link
                        href="/destinations"
                        onClick={() => setDestMenuOpen(false)}
                        className="text-[#ff6a00] font-bold hover:underline flex items-center justify-between text-[11px]"
                      >
                        <span>View All Destinations</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Selector Dropdown */}
              <div className="relative" ref={currRef}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyMenuOpen(!currencyMenuOpen);
                    setDestMenuOpen(false);
                  }}
                  className="flex items-center gap-1 py-1 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 rounded-none text-[11px] sm:text-xs font-bold transition-colors focus-visible:outline-[#ff6a00]"
                  title="Select display currency"
                  aria-expanded={currencyMenuOpen}
                  aria-haspopup="true"
                >
                  <span>{displayCurrency}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {currencyMenuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-28 bg-white shadow-2xl border border-neutral-300 rounded-none py-1 z-[70] text-neutral-900 text-xs"
                    role="menu"
                  >
                    {(['USD', 'JPY', 'INR', 'LKR'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => {
                          setDisplayCurrency(curr);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 flex items-center justify-between rounded-none ${
                          displayCurrency === curr ? 'font-bold text-[#ff6a00] bg-orange-50/50' : ''
                        }`}
                      >
                        <span>{curr}</span>
                        {displayCurrency === curr && <Check className="w-3 h-3 text-[#ff6a00]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* WhatsApp Quote Button (Desktop) */}
              <a
                href="https://wa.me/818012345678?text=Hello%20Makers%20Corp%20Japan,%20I%20am%20inquiring%20about%20vehicle%20export%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-3.5 py-1.5 rounded-none text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95"
                title="Direct WhatsApp export inquiry"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
                <span className="hidden md:inline">WhatsApp Quote</span>
                <span className="md:hidden">WhatsApp</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-neutral-800 hover:text-neutral-950 border border-neutral-300 lg:hidden rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a00]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Primary Navigation Row (Clean single line with visible Home link) */}
        <div className="hidden lg:block border-t border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 py-0.5" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const isHome = item.href === '/';
                const isActive = isHome ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-none border-b-2 ${
                      isActive
                        ? 'text-[#ff6a00] border-[#ff6a00] bg-orange-50/60 font-black'
                        : 'text-neutral-700 hover:text-[#ff6a00] hover:bg-neutral-50 border-transparent'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Slides below Row 1, keeping utility selectors accessible) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 px-4 pt-3 pb-5 shadow-2xl animate-in slide-in-from-top-1 duration-150 rounded-none">
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const isHome = item.href === '/';
                const isActive = isHome ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-none ${
                      isActive
                        ? 'text-[#ff6a00] bg-orange-50 font-black border-l-4 border-[#ff6a00]'
                        : 'text-neutral-800 hover:text-[#ff6a00] hover:bg-neutral-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-col gap-2">
              <a
                href="https://wa.me/818012345678?text=Hello%20Makers%20Corp%20Japan,%20I%20am%20inquiring%20about%20vehicle%20export%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-none text-xs font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Instant WhatsApp Quote</span>
              </a>
              <Link
                href="/request-a-vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-orange-700 text-white py-2 rounded-none text-xs font-bold shadow-sm"
              >
                <span>Request a Vehicle</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
