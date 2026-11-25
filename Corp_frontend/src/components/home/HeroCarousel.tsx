'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink, Pause, Play } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  heading: string;
  body: string;
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
  bgTone: string;
}

const SLIDES: Slide[] = [
  {
    id: 'global',
    badge: 'Japan Direct Export Showroom',
    heading: 'Vehicles from Japan. Sourced for Your Market.',
    body: 'Browse Japanese inventory or tell us what you’re looking for. We inspect, negotiate, and export directly to your destination port.',
    primaryCta: {
      text: 'Browse Inventory',
      href: '/vehicles'
    },
    secondaryCta: {
      text: 'Request a Vehicle',
      href: '/request-a-vehicle'
    },
    imageSrc: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Lexus LX executive export SUV uncropped complete source view',
    bgTone: '#171717'
  },
  {
    id: 'india',
    badge: 'Specialized Market Destination',
    heading: 'Explore Vehicles for India',
    body: 'Tell us the model you’re looking for. Our team handles auction sourcing, pre-export inspection, and documentation for international export.',
    primaryCta: {
      text: 'Explore India',
      href: '/destinations/asia/india'
    },
    imageSrc: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'High-performance Japanese sports coupe uncropped complete source view',
    bgTone: '#121212'
  },
  {
    id: 'sri-lanka',
    badge: 'Sri Lanka Dedicated Partner',
    heading: 'Shopping in Sri Lanka?',
    body: 'Visit Makers Ceylon for Sri Lanka vehicle listings, local team contact, and Colombo port delivery support.',
    primaryCta: {
      text: 'Visit Makers Ceylon',
      href: 'https://makersceylon.com/',
      isExternal: true
    },
    imageSrc: '/images/cars-lineup.png',
    imageAlt: 'Makers Ceylon complete vehicle lineup with all models fully visible from bumper to bumper',
    bgTone: '#1a1a1a'
  }
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
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  // Autoplay management: respects pause state, hover, focus, and reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isPaused || isHovered || isFocused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);

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

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section
      className="w-full bg-[#111111] border-b border-neutral-300 relative select-none rounded-none"
      aria-label="Featured vehicle export spotlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP / TABLET HERO (md:block)
          Full viewport width with complete uncropped image on right & solid panel on left
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full h-[380px] lg:h-[420px] overflow-hidden bg-[#141414]">
        {/* Slide Layers */}
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={`desk-${slide.id}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${SLIDES.length}: ${slide.heading}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{ backgroundColor: slide.bgTone }}
            >
              {/* Full Uncropped Source Image Container */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[62%] h-full flex items-center justify-end pr-4 sm:pr-8 lg:pr-12 pointer-events-none">
                <div className="relative w-full h-[92%]">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 70vw, 60vw"
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="object-contain object-right"
                  />
                </div>
              </div>

              {/* Localized Left Scrim for Desktop Typography Contrast without darkening the car */}
              <div className="absolute inset-y-0 left-0 w-[55%] lg:w-[48%] bg-gradient-to-r from-[#111111] via-[#111111]/95 to-transparent z-10 pointer-events-none" />

              {/* Foreground Live HTML Text Panel */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-md lg:max-w-lg bg-[#111111]/90 backdrop-blur-sm p-6 lg:p-8 border-l-4 border-[#ff6a00] rounded-none shadow-2xl">
                  {/* Market Tag */}
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-[#ff6a00] rounded-none" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight mb-2.5">
                    {slide.heading}
                  </h1>

                  {/* Body copy */}
                  <p className="text-xs lg:text-sm text-neutral-300 leading-relaxed mb-5">
                    {slide.body}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3">
                    {slide.primaryCta.isExternal ? (
                      <a
                        href={slide.primaryCta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs lg:text-sm px-5 py-2.5 rounded-none shadow-md transition-all active:scale-95"
                      >
                        <span>{slide.primaryCta.text}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={slide.primaryCta.href}
                        className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs lg:text-sm px-5 py-2.5 rounded-none shadow-md transition-all active:scale-95"
                      >
                        <span>{slide.primaryCta.text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {slide.secondaryCta && (
                      <Link
                        href={slide.secondaryCta.href}
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 font-bold text-xs lg:text-sm px-4 py-2.5 rounded-none transition-all"
                      >
                        <span>{slide.secondaryCta.text}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE HERO (< md)
          Show complete source image at top with separate rectangular panel below
          Guarantees uncropped vehicles with zero text overlap!
         ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full bg-[#111111]">
        {/* Full Uncropped Source Image Container */}
        <div
          className="relative w-full h-[220px] sm:h-[260px] flex items-center justify-center p-3"
          style={{ backgroundColor: currentSlide.bgTone }}
        >
          <div className="relative w-full h-full">
            <Image
              src={currentSlide.imageSrc}
              alt={currentSlide.imageAlt}
              fill
              sizes="100vw"
              priority={currentIndex === 0}
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* Separate Rectangular Text Panel Below Photo */}
        <div className="bg-[#111111] text-white p-4 sm:p-5 border-t border-neutral-800 rounded-none">
          <div className="inline-flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 bg-[#ff6a00] rounded-none" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a00]">
              {currentSlide.badge}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight mb-2">
            {currentSlide.heading}
          </h1>

          <p className="text-xs text-neutral-300 leading-relaxed mb-4">
            {currentSlide.body}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {currentSlide.primaryCta.isExternal ? (
              <a
                href={currentSlide.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs px-4 py-2 rounded-none shadow-sm active:scale-95"
              >
                <span>{currentSlide.primaryCta.text}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={currentSlide.primaryCta.href}
                className="inline-flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-bold text-xs px-4 py-2 rounded-none shadow-sm active:scale-95"
              >
                <span>{currentSlide.primaryCta.text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {currentSlide.secondaryCta && (
              <Link
                href={currentSlide.secondaryCta.href}
                className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 font-bold text-xs px-3.5 py-2 rounded-none"
              >
                <span>{currentSlide.secondaryCta.text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SQUARE CONTROLS & RECTANGULAR INDICATORS (Across all screens)
         ───────────────────────────────────────────────────────────── */}
      {/* Square Previous Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-[35%] md:top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-neutral-900/90 hover:bg-[#ff6a00] text-white flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-[#ff6a00]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Square Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-[35%] md:top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-neutral-900/90 hover:bg-[#ff6a00] text-white flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-[#ff6a00]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Bar: Rectangular Slide Indicators & Visible Pause/Play Control */}
      <div className="absolute bottom-3 right-4 z-30 flex items-center gap-2 bg-[#111111]/90 border border-neutral-700 px-3 py-1.5 rounded-none">
        {/* Pause/Play Button */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded-none"
          title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
        >
          {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
        </button>

        <span className="text-neutral-600 text-[10px]" aria-hidden="true">|</span>

        {/* Rectangular Indicators */}
        <div role="tablist" aria-label="Slide indicators" className="flex items-center gap-1.5">
          {SLIDES.map((slide, idx) => (
            <button
              key={`dot-${slide.id}`}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}: ${slide.heading}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all rounded-none ${
                idx === currentIndex
                  ? 'w-7 sm:w-9 bg-[#ff6a00]'
                  : 'w-4 sm:w-5 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
