'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  Check,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { markets } from '@/data';

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
  const [isScrolled, setIsScrolled] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setDestMenuOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDestMenuOpen(false);
    setCurrencyMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Stock Inventory', href: '/vehicles' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'How to Buy', href: '/how-to-buy' },
    { name: 'News & Reviews', href: '/news' },
    { name: 'Request a Vehicle', href: '/request-a-vehicle' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      {/* Top Notification / Market Context Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="inline-flex items-center gap-1 font-semibold text-orange-400 uppercase tracking-wider text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Japan Direct Export
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 truncate">
              {destinationSlug && market
                ? `Showing inventory reviewed for ${market.name} (${market.supportedPorts.map(p => p.name).join(', ')})`
                : 'Global Showroom: Real vehicles in Japan with authentic chassis numbers & export checks'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Destination Indicator & Switcher */}
            <div className="relative" ref={destRef}>
              <button
                onClick={() => setDestMenuOpen(!destMenuOpen)}
                className="flex items-center gap-1.5 py-0.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-medium transition-colors"
                title="Select destination country"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span>Destination:</span>
                <span className="font-bold text-orange-400">
                  {market ? market.name : 'Global (All)'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {destMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Choose Destination
                  </div>
                  <button
                    onClick={() => {
                      clearDestination();
                      setDestMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-orange-50 ${
                      !destinationSlug ? 'bg-orange-50/70 text-orange-600 font-bold' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      Global (All Stock / FOB Japan)
                    </span>
                    {!destinationSlug && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>

                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Asia Markets
                  </div>
                  <button
                    onClick={() => {
                      setDestination('india');
                      setDestMenuOpen(false);
                      router.push('/destinations/asia/india');
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 ${
                      destinationSlug === 'india' ? 'bg-orange-50/70 text-orange-600 font-bold' : ''
                    }`}
                  >
                    <span>India (Nhava Sheva / Chennai)</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                      Active
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDestination('sri-lanka');
                      setDestMenuOpen(false);
                      router.push('/destinations/asia/sri-lanka');
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 ${
                      destinationSlug === 'sri-lanka' ? 'bg-orange-50/70 text-orange-600 font-bold' : ''
                    }`}
                  >
                    <span>Sri Lanka (Colombo Port)</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                      Active
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDestination('pakistan');
                      setDestMenuOpen(false);
                      router.push('/destinations/asia/pakistan');
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 ${
                      destinationSlug === 'pakistan' ? 'bg-orange-50/70 text-orange-600 font-bold' : ''
                    }`}
                  >
                    <span>Pakistan (Karachi Port)</span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                      Inquiry Only
                    </span>
                  </button>

                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Africa Markets
                  </div>
                  <button
                    onClick={() => {
                      setDestination('kenya');
                      setDestMenuOpen(false);
                      router.push('/destinations/africa');
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-orange-50 ${
                      destinationSlug === 'kenya' ? 'bg-orange-50/70 text-orange-600 font-bold' : ''
                    }`}
                  >
                    <span>Kenya (Mombasa)</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                      Active
                    </span>
                  </button>

                  <div className="border-t border-slate-100 mt-1.5 pt-1 px-3 py-1 bg-slate-50">
                    <Link
                      href="/destinations"
                      onClick={() => setDestMenuOpen(false)}
                      className="text-orange-600 font-semibold hover:underline flex items-center justify-between"
                    >
                      <span>View All Destinations</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={currRef}>
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1 py-0.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-medium transition-colors"
              >
                <span>{displayCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-50 text-slate-800 text-xs">
                  {(['USD', 'JPY', 'INR', 'LKR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setDisplayCurrency(curr);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 flex items-center justify-between ${
                        displayCurrency === curr ? 'font-bold text-orange-600' : ''
                      }`}
                    >
                      <span>{curr}</span>
                      {displayCurrency === curr && <Check className="w-3 h-3 text-orange-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 bg-white transition-all duration-200 ${
          isScrolled ? 'shadow-md py-2.5' : 'border-b border-slate-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 bg-orange-600 rounded flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-orange-700 transition-colors">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 uppercase leading-none">
                  Makers Corp <span className="text-orange-600 font-bold">Japan</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                  Vehicles Sourced From Japan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'text-orange-600 bg-orange-50 font-black'
                        : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/vehicles"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search Stock ID</span>
              </Link>

              <a
                href="https://wa.me/818012345678?text=Hello%20Makers%20Corp%20Japan,%20I%20am%20inquiring%20about%20vehicle%20export%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp Quote</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/vehicles"
                className="p-2 text-slate-600 hover:text-orange-600 rounded-md"
                aria-label="Search Vehicles"
              >
                <Search className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-md focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Market Banner */}
            <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Destination</div>
                <div className="text-xs font-extrabold text-slate-800">
                  {market ? market.name : 'Global Showroom'}
                </div>
              </div>
              <Link
                href="/destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200"
              >
                Change
              </Link>
            </div>

            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
              <a
                href="https://wa.me/818012345678?text=Hello%20Makers%20Corp%20Japan,%20I%20am%20inquiring%20about%20vehicle%20export%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md text-sm font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Instant WhatsApp Quote</span>
              </a>
              <Link
                href="/request-a-vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-md text-sm font-bold shadow-sm"
              >
                <span>Request Made-to-Order Sourcing</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
