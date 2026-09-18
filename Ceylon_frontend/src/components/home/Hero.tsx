'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Clock, ShieldCheck, FileText, Package, Check, Award, Ship, Landmark, Truck } from 'lucide-react';
import Image from 'next/image';

import { useSettings } from '@/context/SettingsContext';

export function Hero() {
  const { settings } = useSettings();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroData = settings?.homepage?.hero;
  const backgroundImage = heroData?.backgroundImage || '/images/background image.jpeg';
  const heroTitle = heroData?.title || 'YOUR DREAM VEHICLE,\nDIRECTLY FROM JAPAN';
  const heroSubtitle = heroData?.subtitle || 'FROM JAPAN AUCTION TO YOUR DRIVEWAY — WE HANDLE EVERYTHING.';
  const ctaText = heroData?.ctaText || 'GET YOUR IMPORT PRICE NOW';
  const ctaLink = heroData?.ctaLink || '#inquiry';

  const contactNumber = settings?.header?.contactNumber || settings?.footer?.phone || '077 123 4567';
  const whatsappUrl = `https://wa.me/${(() => {
    const numStr = settings?.header?.whatsappNumber || settings?.header?.contactNumber || settings?.footer?.phone || contactNumber;
    let cleanNum = numStr.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '94' + cleanNum.substring(1);
    }
    return cleanNum;
  })()}`;

  // Helper to split title into two lines based on newline or default comma
  const rawTitle = heroTitle.replace(/\\n/g, '\n');
  let titleLines = [rawTitle];
  let showComma = false;

  if (rawTitle.includes('\n')) {
    titleLines = rawTitle.split('\n');
  } else if (rawTitle.includes(',')) {
    titleLines = rawTitle.split(',');
    showComma = true; // We removed it by splitting, so add it back
  } else if (rawTitle.toUpperCase().includes('DIRECTLY FROM JAPAN')) {
    const idx = rawTitle.toUpperCase().indexOf('DIRECTLY FROM JAPAN');
    titleLines = [rawTitle.substring(0, idx).trim(), rawTitle.substring(idx)];
    showComma = true; // Add comma after the first part
  }

  const sideFeatures = [
    { icon: Award, label: 'BEST PRICES GUARANTEED', section: 'why-us' },
    { icon: Ship, label: 'DIRECT FROM JAPAN', section: 'how-it-works' },
    { icon: Landmark, label: 'BANK-APPROVED PROCESS', section: 'inquiry' },
    { icon: Truck, label: 'ISLANDWIDE DELIVERY', section: 'how-it-works' },
  ];

  // --- Background pan on mobile via touch events on the section ---
  const bgWrapperRef = useRef<HTMLDivElement>(null);
  const [bgX, setBgX] = useState(0);
  const bgXRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalGesture = useRef<boolean | null>(null);
  const [bgTransition, setBgTransition] = useState('none');
  const autoPanTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cinematic auto-pan on mount (mobile only):
  // Center → sweep left → sweep right → settle at center
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 640) return;
    const vw = window.innerWidth;
    const center = -(vw * 0.5);   // middle of 200vw image

    // Start at center with no transition
    setBgX(center);
    bgXRef.current = center;
    setBgTransition('none');

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      autoPanTimers.current.push(id);
    };

    // 700ms  → sweep left to show left edge
    schedule(() => {
      setBgTransition('transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)');
      setBgX(0);
    }, 700);

    // 2700ms → sweep right to show right edge
    schedule(() => {
      setBgTransition('transform 2.8s cubic-bezier(0.4, 0, 0.2, 1)');
      setBgX(-vw);
    }, 2700);

    // 5700ms → glide back to center
    schedule(() => {
      setBgTransition('transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)');
      setBgX(center);
      bgXRef.current = center;
    }, 5700);

    return () => autoPanTimers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640) return;
    // Cancel auto-pan so user takes control immediately
    autoPanTimers.current.forEach(clearTimeout);
    autoPanTimers.current = [];
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalGesture.current = null;
    setBgTransition('none');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (isHorizontalGesture.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontalGesture.current = Math.abs(dx) > Math.abs(dy);
    }
    if (!isHorizontalGesture.current) return;
    const maxLeft = -window.innerWidth;
    const newX = Math.min(0, Math.max(maxLeft, bgXRef.current + dx));
    setBgX(newX);
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 640) return;
    bgXRef.current = bgX;
    setBgTransition('transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)');
  };

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 pt-20 lg:pt-[5.5rem] pb-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile Swipeable Background (Hidden on sm+) */}
        <div
          ref={bgWrapperRef}
          className="sm:hidden absolute top-0 left-0 h-full w-[200vw]"
          style={{
            transform: `translateX(${bgX}px)`,
            transition: bgTransition,
          }}
        >
          <Image
            src={backgroundImage}
            alt="Premium Japanese Vehicle Background"
            fill
            className="object-cover object-[center_30%]"
            priority
          />
        </div>

        {/* Desktop Static Background (Hidden on mobile) */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Premium Japanese Vehicle Background"
            fill
            className="object-cover md:object-[center_15%] lg:object-[center_5%]"
            priority
          />
        </div>
        {/* Static overlays */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-50 to-transparent z-10" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 60% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 45%, transparent 100%)' }} />
        {/* Mobile swipe hint */}
        <div className="sm:hidden absolute bottom-[12rem] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
          <span className="text-white text-[9px] font-bold tracking-widest uppercase opacity-80">← Swipe to explore →</span>
        </div>
      </div>

      <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 relative z-10 flex-grow flex flex-col justify-start pt-0 sm:pt-1 lg:pt-0 xl:pt-1 pb-4 sm:pb-6">

        {/* Bulletproof 3-Column Grid for Desktop to Prevent Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-[140px_minmax(0,1fr)_140px] xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-4 xl:gap-6 w-full items-stretch flex-grow lg:flex-grow-0">

          {/* Left Column: Side Features */}
          <div className="hidden lg:flex flex-col justify-start mt-0 xl:mt-2 items-start gap-3 xl:gap-4 z-20 lg:pl-10 xl:pl-20">
            {sideFeatures.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => scrollToSection(item.section)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="group flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] xl:w-[5.5rem] xl:h-[5.5rem] bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-black/5 border border-white/60 hover:bg-white hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-1 transition-all duration-500"
              >
                <item.icon className="w-5 h-5 xl:w-6 xl:h-6 text-primary mb-1.5 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-[7px] xl:text-[8px] font-black text-dark text-center px-1.5 leading-tight uppercase tracking-tighter">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Center Column: Main Content Stack */}
          <div className="flex flex-col items-center justify-start text-center w-full max-w-4xl relative z-10 mx-auto h-full lg:h-auto">
            <div className="flex flex-col items-center justify-start w-full">

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-[1.75rem] sm:text-4xl lg:text-[3rem] xl:text-[3.6rem] font-display font-black leading-[1.2] sm:leading-[1.25] tracking-tight uppercase mb-3 lg:mb-2 px-2 sm:px-0"
              >
                <div className="flex flex-col gap-0.2">
                  <span className="text-primary sm:whitespace-nowrap drop-shadow-md break-words">
                    {titleLines[0]}{titleLines.length > 1 && showComma && !titleLines[0].endsWith(',') ? ',' : ''}
                  </span>
                  {titleLines.length > 1 && (
                    <span className="text-dark sm:whitespace-nowrap drop-shadow-md leading-[1.1] break-words">
                      {titleLines[1].trim()}
                    </span>
                  )}
                </div>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block bg-gray-600/75 backdrop-blur-md rounded-xl sm:rounded-full px-3 sm:px-6 py-2 sm:py-2 mb-4 border border-gray-500 shadow-sm mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-auto"
              >
                <span className="text-white font-bold text-[8.5px] sm:text-[10px] xl:text-[11px] uppercase tracking-[0.15em] leading-relaxed sm:leading-tight block text-center break-words">
                  {heroSubtitle}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xs sm:text-sm lg:text-base font-bold text-dark/90 max-w-xl mb-4 lg:mb-3 leading-snug px-4 drop-shadow-sm"
              >
                <span className="text-primary">Auction-grade</span> vehicles. Transparent pricing. <span className="text-primary">End-to-end</span> import handling. Safely delivered to your doorstep in <span className="text-primary">Sri Lanka</span>.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 lg:mb-3 w-full px-4"
              >
                <a
                  href="#inquiry"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('inquiry');
                  }}
                  className="bg-primary hover:bg-primary-hover text-white px-4 sm:px-5 xl:px-7 py-2 sm:py-3 xl:py-3.5 rounded-xl font-black text-[8px] sm:text-[10px] xl:text-[11px] uppercase tracking-widest shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-1.5 sm:gap-2 group active:scale-95"
                >
                  {ctaText}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/85 backdrop-blur-md hover:bg-white text-dark px-4 sm:px-5 xl:px-7 py-2 sm:py-3 xl:py-3.5 rounded-xl font-black text-[8px] sm:text-[10px] xl:text-[11px] uppercase tracking-widest shadow-xl border border-white/80 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#25D366]" />
                  CHAT WITH AN IMPORT SPECIALIST
                </a>
              </motion.div>

              {/* Mobile-only checkmarks — shown right after buttons, above the cars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex sm:hidden flex-nowrap items-center justify-center gap-x-3 mt-3 mb-1 w-full px-1"
              >
                <div className="flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[9px] drop-shadow-sm whitespace-nowrap">Free Consultation</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                <div className="flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[9px] drop-shadow-sm whitespace-nowrap">No Hidden Charges</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                <div className="flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[9px] drop-shadow-sm whitespace-nowrap">Fast Response</span>
                </div>
              </motion.div>

            </div>

            <div className="flex-grow min-h-[10rem] lg:hidden"></div>

            <div className="flex flex-col items-center w-full mt-auto lg:mt-0 mb-2 sm:mb-0 z-20 pb-2 sm:pb-0">
              {/* Checkmarks — desktop/tablet only (mobile version is above buttons) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hidden sm:flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-3 sm:mb-2 w-full px-4"
              >
                <div className="flex items-center gap-1.5 shrink">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[11px] lg:text-xs drop-shadow-sm">Free Consultation</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-500 shrink-0" />
                <div className="flex items-center gap-1.5 shrink">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[11px] lg:text-xs drop-shadow-sm">No Hidden Charges</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-500 shrink-0" />
                <div className="flex items-center gap-1.5 shrink">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={3} />
                  <span className="text-dark font-black text-[11px] lg:text-xs drop-shadow-sm">Fast Response</span>
                </div>
              </motion.div>

              {/* Bottom Feature Bar (Directly below checkmarks) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-row sm:inline-flex items-center justify-between sm:justify-center bg-dark/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 sm:px-5 border border-white/10 gap-1 sm:gap-5 shadow-2xl relative z-10 w-[calc(100%-1rem)] sm:w-auto mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 shrink-0" strokeWidth={1.5} />
                  <span className="text-white font-black text-[5.5px] sm:text-[7px] xl:text-[8px] uppercase tracking-wider sm:tracking-widest leading-[1.2] sm:leading-[1.3] text-center sm:text-left">
                    <span className="sm:hidden">JAPAN AUCTION<br />VERIFIED</span>
                    <span className="hidden sm:inline">JAPAN AUCTION<br />VERIFIED VEHICLES</span>
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-white/20 sm:hidden"></div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none sm:border-l sm:border-white/20 sm:pl-5">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 shrink-0" strokeWidth={1.5} />
                  <span className="text-white font-black text-[5.5px] sm:text-[7px] xl:text-[8px] uppercase tracking-wider sm:tracking-widest leading-[1.2] sm:leading-[1.3] text-center sm:text-left">
                    <span className="sm:hidden">TRANSPARENT<br />COST</span>
                    <span className="hidden sm:inline">TRANSPARENT COST<br />BREAKDOWN</span>
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-white/20 sm:hidden"></div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none sm:border-l sm:border-white/20 sm:pl-5">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 shrink-0" strokeWidth={1.5} />
                  <span className="text-white font-black text-[5.5px] sm:text-[7px] xl:text-[8px] uppercase tracking-wider sm:tracking-widest leading-[1.2] sm:leading-[1.3] text-center sm:text-left">
                    <span className="sm:hidden">END-TO-END<br />IMPORT</span>
                    <span className="hidden sm:inline">END-TO-END IMPORT<br />MANAGEMENT</span>
                  </span>
                </div>
              </motion.div>

              {/* Mobile Feature Icons Row */}
              <div className="flex lg:hidden justify-center flex-wrap gap-2 mt-4 sm:mt-6 w-full px-2 mb-2">
                {sideFeatures.map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => scrollToSection(item.section)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex flex-col items-center justify-center w-[3.5rem] h-[3.5rem] sm:w-[4.5rem] sm:h-[4.5rem] bg-white/50 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg border border-white/30 hover:bg-white/70 transition-all"
                  >
                    <item.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary mb-1 sm:mb-1.5" />
                    <span className="text-[5.5px] sm:text-[7px] font-black text-dark text-center px-0.5 leading-tight uppercase tracking-tighter">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>

            </div>

          </div>

          {/* Right Column: Floating Badge (Hidden on lg, visible on xl) */}
          <div className="hidden lg:flex flex-col justify-start items-end mt-2 xl:mt-4 z-20 h-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hidden xl:flex bg-dark/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/10 w-[260px] items-start gap-3"
            >
              <Clock className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-white font-black text-[9px] uppercase tracking-widest mb-1 leading-tight">{settings?.homepage?.hero?.noticeTitle || 'LIMITED AUCTION SLOTS WEEKLY!'}</h4>
                <p className="text-gray-400 text-[8px] font-bold leading-relaxed">{settings?.homepage?.hero?.noticeSubtitle || 'Secure your vehicle before the next auction cycle.'}</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section >
  );
}
