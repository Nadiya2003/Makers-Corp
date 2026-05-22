'use client';

import React from 'react';
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

  const backgroundImage = settings?.homepage?.hero?.backgroundImage || '/images/background image.jpeg';

  const sideFeatures = [
    { icon: Award, label: 'BEST PRICES GUARANTEED', section: 'why-us' },
    { icon: Ship, label: 'DIRECT FROM JAPAN', section: 'how-it-works' },
    { icon: Landmark, label: 'BANK-APPROVED PROCESS', section: 'inquiry' },
    { icon: Truck, label: 'ISLANDWIDE DELIVERY', section: 'how-it-works' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 pt-20 pb-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Premium Japanese Vehicle Background"
          fill
          className="object-cover object-right-top"
          priority
        />
        {/* Gradient overlays */}
        {/* Bottom fade to page background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-50 to-transparent z-10" />
        {/* Centre radial glow so text is readable over the ship */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 60% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 45%, transparent 100%)' }} />
      </div>

      <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 relative z-10 flex-grow flex flex-col justify-start pt-0 sm:pt-2 lg:pt-2 xl:pt-4 pb-4 sm:pb-6">

        {/* Bulletproof 3-Column Grid for Desktop to Prevent Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-[140px_minmax(0,1fr)_140px] xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-4 xl:gap-6 w-full items-stretch">

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
          <div className="flex flex-col items-center justify-start text-center w-full max-w-4xl relative z-10 mx-auto">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[2rem] sm:text-4xl lg:text-[3rem] xl:text-[3.6rem] font-display font-black leading-[1.25] tracking-tight uppercase mb-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-primary sm:whitespace-nowrap drop-shadow-md">
                  YOUR DREAM VEHICLE,
                </span>

                <span className="text-dark sm:whitespace-nowrap drop-shadow-md leading-[1.1]">
                  DIRECTLY FROM JAPAN
                </span>
              </div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block bg-gray-600/75 backdrop-blur-md rounded-xl sm:rounded-full px-3 sm:px-6 py-2 sm:py-2 mb-4 border border-gray-500 shadow-sm mx-4 sm:mx-0"
            >
              <span className="text-white font-bold text-[8.5px] sm:text-[10px] xl:text-[11px] uppercase tracking-[0.15em] leading-relaxed sm:leading-tight block text-center">
                FROM JAPAN AUCTION TO YOUR DRIVEWAY — WE HANDLE EVERYTHING.
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs sm:text-sm lg:text-base font-bold text-dark/90 max-w-xl mb-5 leading-snug px-4 drop-shadow-sm"
            >
              <span className="text-primary">Auction-grade</span> vehicles. Transparent pricing. <span className="text-primary">End-to-end</span> import handling. Safely delivered to your doorstep in <span className="text-primary">Sri Lanka</span>.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5 w-full px-4"
            >
              <button
                onClick={() => scrollToSection('inquiry')}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-5 xl:px-7 py-3 xl:py-3.5 rounded-xl font-black text-[10px] xl:text-[11px] uppercase tracking-widest shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                GET YOUR IMPORT PRICE NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-white/85 backdrop-blur-md hover:bg-white text-dark px-5 xl:px-7 py-3 xl:py-3.5 rounded-xl font-black text-[10px] xl:text-[11px] uppercase tracking-widest shadow-xl border border-white/80 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                CHAT WITH AN IMPORT SPECIALIST
              </a>
            </motion.div>

            {/* Checkmarks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 mb-2 px-4"
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                <span className="text-dark font-black text-[11px] sm:text-xs drop-shadow-sm">Free Consultation</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-500 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                <span className="text-dark font-black text-[11px] sm:text-xs drop-shadow-sm">No Hidden Charges</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-500 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                <span className="text-dark font-black text-[11px] sm:text-xs drop-shadow-sm">Fast Response</span>
              </div>
            </motion.div>

            {/* Bottom Feature Bar (Directly below checkmarks) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-flex flex-col sm:flex-row items-center justify-center bg-dark/90 backdrop-blur-xl rounded-2xl p-2 sm:p-3 sm:px-5 border border-white/10 gap-3 sm:gap-5 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white/80 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white font-black text-[7px] xl:text-[8px] uppercase tracking-widest leading-[1.3] text-left">JAPAN AUCTION<br />VERIFIED VEHICLES</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:border-l sm:border-white/20 sm:pl-5">
                <FileText className="w-4 h-4 text-white/80 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white font-black text-[7px] xl:text-[8px] uppercase tracking-widest leading-[1.3] text-left">TRANSPARENT COST<br />BREAKDOWN</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:border-l sm:border-white/20 sm:pl-5">
                <Package className="w-4 h-4 text-white/80 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white font-black text-[7px] xl:text-[8px] uppercase tracking-widest leading-[1.3] text-left">END-TO-END IMPORT<br />MANAGEMENT</span>
              </div>
            </motion.div>

            {/* Mobile Feature Icons Row */}
            <div className="flex lg:hidden justify-center flex-wrap gap-2 mt-6 w-full px-2 mb-4">
              {sideFeatures.map((item, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => scrollToSection(item.section)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex flex-col items-center justify-center w-[4rem] h-[4rem] sm:w-[4.5rem] sm:h-[4.5rem] bg-white/50 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg border border-white/30 hover:bg-white/70 transition-all"
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-1 sm:mb-1.5" />
                  <span className="text-[6px] sm:text-[7px] font-black text-dark text-center px-0.5 leading-tight uppercase tracking-tighter">
                    {item.label}
                  </span>
                </motion.button>
              ))}
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
                <h4 className="text-white font-black text-[9px] uppercase tracking-widest mb-1 leading-tight">LIMITED AUCTION SLOTS WEEKLY!</h4>
                <p className="text-gray-400 text-[8px] font-bold leading-relaxed">Secure your vehicle before the next auction cycle.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section >
  );
}
