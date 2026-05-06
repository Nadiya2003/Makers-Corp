'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Award, Ship, Landmark, Truck } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sideFeatures = [
    { icon: Award, label: 'BEST PRICES GUARANTEED', section: 'why-us' },
    { icon: Ship, label: 'DIRECT FROM JAPAN', section: 'how-it-works' },
    { icon: Landmark, label: 'BANK-APPROVED PROCESS', section: 'inquiry' },
    { icon: Truck, label: 'ISLANDWIDE DELIVERY', section: 'how-it-works' },
  ];

  return (
    <section className="relative min-h-screen lg:min-h-[90vh] flex flex-col pt-32 lg:pt-36 bg-white overflow-hidden">
      {/* Background Image - Mount Fuji & City Skyline */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Mount Fuji and Tokyo Skyline"
          fill
          className="object-cover object-center opacity-40 blur-[2px] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-grow flex flex-col">
        <div className="relative grid lg:grid-cols-[1fr_2fr_1fr] gap-8 items-center flex-grow">

          {/* Left: Side Features - Glassy Vertical Boxes - Scaled Up More */}
          <div className="hidden lg:flex flex-col gap-5 self-center">
            {sideFeatures.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => scrollToSection(item.section)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="group flex flex-col items-center justify-center w-28 h-28 bg-white/40 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-black/5 border border-white/30 hover:bg-white/70 hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-1 transition-all duration-500"
              >
                <item.icon className="w-8 h-8 text-primary mb-2.5 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-[10px] font-black text-dark text-center px-1 leading-tight uppercase tracking-tighter">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Center: Main Content */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Trusted Japanese Importers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-dark leading-[1.05] mb-6 uppercase"
            >
              IMPORT YOUR <br />
              <span className="text-primary italic">DREAM VEHICLE</span> <br />
              DIRECTLY FROM JAPAN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl font-bold text-gray-500 mb-10 tracking-wide max-w-xl"
            >
              Better Prices. Trusted Process. Complete Peace of Mind.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <button
                onClick={() => scrollToSection('inquiry')}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 group active:scale-95"
              >
                Get a Quote
              </button>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-dark border-2 border-white/40 px-10 py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:border-primary/20 active:scale-95 shadow-lg shadow-black/5"
              >
                Contact via WhatsApp <MessageCircle className="w-5 h-5 text-green-500" />
              </a>
            </motion.div>
          </div>

          {/* Right Spacer for Layout Balance */}
          <div className="hidden lg:block" />
        </div>

        {/* Cars Visual - Centered Lineup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative mt-8 flex justify-center items-end w-full"
        >
          <div className="relative w-full max-w-6xl">
            <Image
              src="/images/cars-lineup.png"
              alt="Japanese Car Lineup"
              width={2000}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
            {/* Ground Shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-black/5 blur-3xl rounded-[100%] -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
