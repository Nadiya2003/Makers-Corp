'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Pause,
  Play,
  Compass,
  Sparkles,
  Flame,
  Truck,
  Globe
} from 'lucide-react';
import {
  CountryFlag,
  MakersCeylonBadge,
  ExportRoutePlaque
} from './HeroExportVisuals';

interface SlideConfig {
  id: string;
  tag: string;
  badgeIcon?: React.ElementType;
  headline: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
    isExternal?: boolean;
  };
  secondaryCta?: {
    text: string;
    href: string;
    isExternal?: boolean;
  };
  imageSrc: string;
  imageAlt: string;
  targetMarket?: 'global' | 'sri-lanka' | 'india' | 'russia' | 'uae';
  showMakersCeylon?: boolean;
  routePlaque?: {
    destinationName: string;
    destinationPort: string;
    transitDays: string;
    flag: 'sri-lanka' | 'india' | 'russia' | 'uae';
    shippingType?: string;
  };
}

const CAROUSEL_SLIDES: SlideConfig[] = [
  // SLIDE 01 – FROM JAPAN TO THE GLOBE
  {
    id: 'slide-global-export',
    tag: 'Japanese Vehicle Export · Worldwide Shipping',
    badgeIcon: Compass,
    headline: 'FROM JAPAN TO THE GLOBE',
    description:
      'Discover exceptional Japanese vehicles sourced directly from Japan and exported to international markets. From premium SUVs and luxury 4x4s to iconic Japanese automobiles, we connect global buyers with quality vehicles from Japan through tailored sourcing and export solutions.',
    primaryCta: {
      text: 'Explore Vehicles',
      href: '/vehicles',
    },
    secondaryCta: {
      text: 'Request Export Enquiry',
      href: '/request-a-vehicle',
    },
    imageSrc: '/images/Japan vehicles.png',
    imageAlt: 'Japanese premium luxury 4x4 export SUV',
  },

  // SLIDE 02 – SRI LANKA DEDICATED EXPORT (MAKERS CEYLON)
  {
    id: 'slide-sri-lanka',
    tag: 'Sri Lanka Dedicated Export Liaison',
    targetMarket: 'sri-lanka',
    headline: 'Japan to Sri Lanka. Trusted Vehicle Exports.',
    description:
      'Explore quality Japanese vehicles sourced and exported for the Sri Lankan market with MAKERS CEYLON. Complete duty advice, LC handling, and Colombo/Hambantota delivery.',
    primaryCta: {
      text: 'Visit MAKERS CEYLON',
      href: 'https://makersceylon.com/',
      isExternal: true,
    },
    secondaryCta: {
      text: 'Explore Sri Lanka Stock',
      href: '/destinations/asia/sri-lanka',
    },
    imageSrc: '/images/Sri lankan vehicles.png',
    imageAlt: 'Authentic Japanese vehicle yard line ready for Colombo port dispatch',
    showMakersCeylon: true,
    /*routePlaque: {
      destinationName: 'Sri Lanka',
      destinationPort: 'Hambantota',
      transitDays: '14 – 18 Days',
      flag: 'sri-lanka',
      shippingType: 'Ro-Ro & Dedicated Container',
    },*/
  },

  // SLIDE 03 – LUXURY & EXECUTIVE VEHICLES
  {
    id: 'slide-luxury',
    tag: 'Executive & VIP Collection · Tokyo Desk',
    badgeIcon: Sparkles,
    headline: 'Experience Japanese Automotive Excellence',
    description:
      'Discover luxury vehicles, executive MPVs and premium automotive collections. Featuring Lexus LX 600, LX 700h, Alphard Executive Lounge, and Mercedes-Benz G63.',
    primaryCta: {
      text: 'Explore Luxury Vehicles',
      href: '/vehicles?body=Luxury+%26+Performance',
    },
    secondaryCta: {
      text: 'Explore Executive MPVs',
      href: '/vehicles?body=Vans+%26+MPVs',
    },
    imageSrc: '/images/Lexus LX at the Harbor.png',
    imageAlt: 'Executive Japanese luxury vehicles ready for export dispatch',
  },

  // SLIDE 04 – SPORTS & PERFORMANCE CARS
  {
    id: 'slide-sports',
    tag: 'Sports & Performance · Auction Direct',
    badgeIcon: Flame,
    headline: 'Performance Without Compromise',
    description:
      'Discover exceptional sports cars and performance vehicles from Japan. Museum-grade Nissan GT-R NISMO, Porsche 911 Carrera, and manual Fairlady Z models.',
    primaryCta: {
      text: 'Explore Sports Cars',
      href: '/vehicles?body=Luxury+%26+Performance',
    },
    secondaryCta: {
      text: 'Browse GT-R Stock',
      href: '/vehicles?make=Nissan&model=GT-R',
    },
    imageSrc: '/images/ChatGPT Image Oct 27, 2026, 12_00_38 PM-8.png',
    imageAlt: 'High-performance Japanese sports vehicle in Kanagawa yard',
  },

  // SLIDE 05 – COMMERCIAL VEHICLE EXPORTS
  {
    id: 'slide-commercial',
    tag: 'Commercial & Fleet Logistics · Ro-Ro Ready',
    badgeIcon: Truck,
    headline: 'Reliable Commercial Vehicles from Japan',
    description:
      'Find quality commercial vehicles for international business requirements. From workhorse Toyota Hiace Vans and Hilux pickups to verified heavy-duty fleet solutions.',
    primaryCta: {
      text: 'Explore Commercial Vehicles',
      href: '/vehicles?category=Commercial+Vehicles',
    },
    secondaryCta: {
      text: 'Browse Pickup Trucks',
      href: '/vehicles?body=Trucks+%26+Commercial',
    },
    imageSrc: '/images/White Suzuki Mini Truck at the Waterfront.png',
    imageAlt: 'Reliable Japanese commercial export vehicles',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  // Automatic slide movement every 5 seconds (5000ms), paused on hover/focus/reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isPaused || isHovered || isFocused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [nextSlide, isPaused, isHovered, isFocused]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  // Touch swipe support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = CAROUSEL_SLIDES[currentIndex];

  return (
    <section
      className="relative w-full bg-[#111111] overflow-hidden select-none border-b border-neutral-800"
      aria-label="Featured Japanese Vehicle Export Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* ============================================================== */}
      {/* DESKTOP & TABLET VIEWPORT (md and above) */}
      {/* ============================================================== */}
      <div className="hidden md:block relative w-full h-[460px] lg:h-[500px] bg-[#111111]">
        {/* Full-Width Background Photo with Smooth Fade Transition */}
        {CAROUSEL_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover object-right lg:object-center"
              />
              {/* Localized Dark Scrim for text legibility while keeping vehicles bright */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-transparent w-full md:w-[70%] lg:w-[58%] z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent z-10" />
            </div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8 lg:py-10 pointer-events-none">
          {/* Top Info Tag */}
          <div className="flex items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              {currentSlide.targetMarket && currentSlide.targetMarket !== 'global' && (
                <CountryFlag country={currentSlide.targetMarket} className="w-8 h-5" />
              )}
              {currentSlide.showMakersCeylon && <MakersCeylonBadge />}

              <span className="text-[11px] font-black uppercase tracking-widest text-[#ff6a00] bg-[#111111]/90 px-3 py-1 border border-neutral-700 shadow-xs inline-flex items-center gap-1.5">
                {currentSlide.badgeIcon && <currentSlide.badgeIcon className="w-3.5 h-3.5 text-[#ff6a00]" />}
                <span>{currentSlide.tag}</span>
              </span>
            </div>

            {/* Direct Sourcing Badge */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-neutral-300 bg-[#111111]/85 px-3 py-1 border border-neutral-700">
              <CountryFlag country="japan" className="w-4 h-2.5" />
              <span>Sourced Directly from Japan (Tokyo · Yokohama · Nagoya · Kobe)</span>
            </div>
          </div>

          {/* Main Headline & Description */}
          <div className="max-w-xl lg:max-w-2xl space-y-3.5 my-auto pointer-events-auto">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
              {currentSlide.headline}
            </h1>
            <p className="text-sm lg:text-base text-neutral-200 leading-relaxed font-medium">
              {currentSlide.description}
            </p>

            {/* Optional Route Plaque for Destination Slides */}
            {currentSlide.routePlaque && (
              <div className="pt-1">
                <ExportRoutePlaque {...currentSlide.routePlaque} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {currentSlide.primaryCta.isExternal ? (
                <a
                  href={currentSlide.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs lg:text-sm font-black uppercase tracking-wider px-6 py-3.5 rounded-none transition-all shadow-md group"
                >
                  <span>{currentSlide.primaryCta.text}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <Link
                  href={currentSlide.primaryCta.href}
                  className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs lg:text-sm font-black uppercase tracking-wider px-6 py-3.5 rounded-none transition-all shadow-md group"
                >
                  <span>{currentSlide.primaryCta.text}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              {currentSlide.secondaryCta && (
                <Link
                  href={currentSlide.secondaryCta.href}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs lg:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-none border border-white/20 transition-colors backdrop-blur-xs"
                >
                  <span>{currentSlide.secondaryCta.text}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Bar: Indicators & Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 pointer-events-auto">
            {/* Small Slide Indicator Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
              {CAROUSEL_SLIDES.map((slide, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Slide ${idx + 1}: ${slide.headline}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${isSelected
                      ? 'w-7 h-2 bg-[#ff6a00]'
                      : 'w-2 h-2 bg-neutral-600 hover:bg-neutral-400'
                      }`}
                  />
                );
              })}
            </div>

            {/* Manual Navigation Arrows & Pause Control */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="w-8 h-8 flex items-center justify-center bg-[#111111] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded-none transition-colors"
                title={isPaused ? 'Resume autoplay (5s)' : 'Pause autoplay'}
                aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#ff6a00]" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={prevSlide}
                className="w-8 h-8 flex items-center justify-center bg-[#111111] hover:bg-[#ff6a00] text-white border border-neutral-700 hover:border-[#ff6a00] rounded-none transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-8 h-8 flex items-center justify-center bg-[#111111] hover:bg-[#ff6a00] text-white border border-neutral-700 hover:border-[#ff6a00] rounded-none transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE VIEWPORT (Phones & Small screens) */}
      {/* ============================================================== */}
      <div className="block md:hidden w-full bg-[#111111]">
        {/* Full Image Container */}
        <div className="relative w-full h-[220px] bg-neutral-900 overflow-hidden">
          <Image
            src={currentSlide.imageSrc}
            alt={currentSlide.imageAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

          {/* Top Tag */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {currentSlide.targetMarket && currentSlide.targetMarket !== 'global' && (
              <CountryFlag country={currentSlide.targetMarket} className="w-6 h-4" />
            )}
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#111111]/90 px-2 py-0.5 border border-neutral-700">
              {currentSlide.tag}
            </span>
          </div>
        </div>

        {/* Separate Text and Action Panel below photo */}
        <div className="p-4 bg-[#111111] space-y-3.5 border-t border-neutral-800">
          {currentSlide.showMakersCeylon && (
            <div>
              <MakersCeylonBadge />
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {currentSlide.headline}
          </h2>

          <p className="text-xs text-neutral-300 leading-relaxed font-medium">
            {currentSlide.description}
          </p>

          {/* Mobile Route info */}
          {currentSlide.routePlaque && (
            <ExportRoutePlaque {...currentSlide.routePlaque} />
          )}

          {/* Primary Action Button */}
          <div className="pt-1 flex flex-col gap-2">
            {currentSlide.primaryCta.isExternal ? (
              <a
                href={currentSlide.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider py-3 rounded-none shadow-sm transition-colors text-center"
              >
                <span>{currentSlide.primaryCta.text}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={currentSlide.primaryCta.href}
                className="w-full flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider py-3 rounded-none shadow-sm transition-colors text-center"
              >
                <span>{currentSlide.primaryCta.text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {currentSlide.secondaryCta && (
              <Link
                href={currentSlide.secondaryCta.href}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-none border border-neutral-700 transition-colors text-center"
              >
                <span>{currentSlide.secondaryCta.text}</span>
              </Link>
            )}
          </div>

          {/* Mobile Indicators & Controls */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all rounded-full ${idx === currentIndex ? 'w-5 h-1.5 bg-[#ff6a00]' : 'w-1.5 h-1.5 bg-neutral-600'
                    }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevSlide}
                className="w-7 h-7 flex items-center justify-center bg-neutral-900 text-white border border-neutral-700 rounded-none text-xs"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-7 h-7 flex items-center justify-center bg-neutral-900 text-white border border-neutral-700 rounded-none text-xs"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
