'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Search, CreditCard, Ship, MapPin,
  CheckCircle, Star, Truck, Globe, Zap, Phone, DollarSign,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { normalizeImageUrl } from '@/lib/imageUtils';

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
  const backgroundImage  = normalizeImageUrl(raw?.backgroundImage)  || '';
  let steps: { icon: string; title: string; description: string }[] =
    raw?.steps && raw.steps.length > 0 ? raw.steps : DEFAULT_STEPS;

  // Ensure there are always 4 steps by filling missing ones from DEFAULT_STEPS
  if (steps.length < 4) {
    steps = [
      ...steps,
      ...DEFAULT_STEPS.slice(steps.length, 4)
    ];
  }

  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden border-t border-neutral-900">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Process background"
            fill
            className="object-cover opacity-15 mix-blend-overlay"
            priority={false}
          />
        )}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/5 border-l-2 border-primary mb-6"
          >
            <span className="text-primary font-black tracking-[0.22em] uppercase text-[11px]">
              {subtitle}
            </span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white mb-5 tracking-tight leading-tight uppercase"
          >
            {title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-base sm:text-lg font-medium max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="relative pt-2 sm:pt-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[1px] bg-neutral-800 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = ICON_MAP[step.icon] || Search;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative flex flex-col bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-primary p-7 sm:p-8 rounded-none transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  {/* Top showroom accent indicator */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                  <div className="flex items-center justify-between mb-8">
                    {/* Icon Box */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 bg-neutral-800 border border-neutral-700/80 rounded-none flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
                    </div>

                    {/* Step Number Plaque */}
                    <span className="font-mono font-black text-2xl sm:text-3xl text-neutral-600 group-hover:text-primary transition-colors duration-300">
                      0{index + 1}
                    </span>
                  </div>

                  <h4 className="font-display font-black text-lg sm:text-xl text-white mb-3 tracking-tight uppercase group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h4>
                  
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
