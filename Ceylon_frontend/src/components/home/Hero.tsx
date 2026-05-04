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
    <section className="relative min-h-screen flex flex-col pt-32 overflow-hidden bg-white">
      {/* Background Image - Mount Fuji - More prominent but clean */}
      <div className="absolute inset-0 z-0 h-[65%]">
        <Image
          src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Mount Fuji and Tokyo Skyline"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-grow flex flex-col">
        <div className="grid lg:grid-cols-[auto_1fr] gap-16 items-start pt-8">
          {/* Side Features - Desktop */}
          <div className="hidden lg:flex flex-col gap-6">
            {sideFeatures.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => scrollToSection(item.section)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="group flex flex-col items-center justify-center w-24 h-24 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 rounded-2xl hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                <item.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black text-dark text-center px-2 leading-tight uppercase tracking-tighter">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center text-center lg:text-left lg:items-start max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Trusted Japanese Importers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-dark leading-[0.95] mb-8"
            >
              IMPORT YOUR <br />
              <span className="text-primary italic">DREAM VEHICLE</span> <br />
              DIRECTLY FROM JAPAN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl font-bold text-gray-400 mb-12 tracking-wide max-w-xl"
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
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-dark border-2 border-gray-100 px-10 py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:border-primary/10 active:scale-95 shadow-sm"
              >
                Contact via WhatsApp <MessageCircle className="w-5 h-5 text-green-500" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Cars Visual - Clean and integrated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="relative mt-16 lg:-mt-20 flex justify-center items-end"
        >
          <div className="relative w-full max-w-6xl h-[350px] sm:h-[500px]">
            {/* Center Main Car - Using a high-quality SUV with shadow */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[75%] z-20">
              <div className="relative group">
                <Image
                  src="https://images.unsplash.com/photo-1542362567-b054cc42197f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Premium SUV"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/10 blur-2xl rounded-[100%]" />
              </div>
            </div>
            
            {/* Left Car */}
            <div className="absolute left-0 bottom-4 w-[40%] z-10 opacity-70 blur-[1px] hover:blur-0 transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="White Crossover"
                width={800}
                height={400}
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>

            {/* Right Car */}
            <div className="absolute right-0 bottom-4 w-[40%] z-10 opacity-70 blur-[1px] hover:blur-0 transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Silver SUV"
                width={800}
                height={400}
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
