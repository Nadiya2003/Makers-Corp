'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Search, CreditCard, Ship, MapPin,
  CheckCircle, Star, Truck, Globe, Zap, Phone, DollarSign,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

// Map icon name strings to actual components
const ICON_MAP: Record<string, React.ElementType> = {
  Search, CreditCard, Ship, MapPin, CheckCircle,
  Star, Truck, Globe, Zap, Phone, DollarSign,
};

const DEFAULT_STEPS = [
  { icon: 'Search',     title: 'Choose Vehicle',        description: 'Select from our inventory or live auctions.' },
  { icon: 'CreditCard', title: 'Confirm & Payment',     description: 'Secure your vehicle with an initial deposit.' },
  { icon: 'Ship',       title: 'Import & Shipping',     description: 'We handle shipping and customs clearance.' },
  { icon: 'MapPin',     title: 'Delivery in Sri Lanka', description: 'Receive your vehicle right at your doorstep.' },
];

export function HowItWorks() {
  const { settings } = useSettings();

  const raw = (settings as any)?.homepage?.howItWorks;

  const subtitle         = raw?.subtitle         || 'Simple Process';
  const title            = raw?.title            || 'How It Works';
  const description      = raw?.description      || "Importing a vehicle doesn't have to be complicated. We've streamlined the process into 4 simple steps.";
  const backgroundImage  = raw?.backgroundImage  || '';
  const steps: { icon: string; title: string; description: string }[] =
    raw?.steps && raw.steps.length > 0 ? raw.steps : DEFAULT_STEPS;

  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Process background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            priority={false}
          />
        )}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gray-50 to-transparent opacity-10" />
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-primary/15 rounded-full blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
              {subtitle}
            </span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 tracking-tight leading-tight"
          >
            {title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="relative pt-4 sm:pt-6">
          {/* Connecting Line (Desktop) with Gradient */}
          <div className="hidden lg:block absolute top-[5rem] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = ICON_MAP[step.icon] || Search;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 40 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative mb-8 mt-2">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-orange-600 text-white rounded-full flex items-center justify-center font-black text-sm sm:text-base shadow-[0_0_20px_rgba(249,115,22,0.4)] z-20 border-2 border-[#0A0A0A] group-hover:scale-110 transition-transform duration-500">
                      {index + 1}
                    </div>
                    
                    {/* Icon Container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#111111] rounded-3xl flex items-center justify-center border border-orange-300/20 group-hover:border-orange-400/50 transition-all duration-500 relative z-10 overflow-hidden group-hover:-translate-y-2 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 group-hover:text-primary transition-colors duration-500 relative z-10" strokeWidth={1.5} />
                    </div>
                    
                    {/* Glow behind icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-orange-300/20 rounded-3xl p-6 w-full h-full hover:bg-white/10 transition-colors duration-500 hover:border-orange-400/40 shadow-xl group-hover:-translate-y-1">
                    <h4 className="font-display font-black text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
