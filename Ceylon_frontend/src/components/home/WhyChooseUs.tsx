'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Search, Zap, Globe, Headphones,
  CheckCircle, Star, Shield, Truck, ThumbsUp,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { normalizeImageUrl } from '@/lib/imageUtils';

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign, Search, Zap, Globe,
  HeadphonesIcon: Headphones,
  CheckCircle, Star, Shield, Truck, ThumbsUp,
};

export function WhyChooseUs() {
  const { settings } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const whyChooseUsData: any = settings?.homepage?.whyChooseUs || {
    subtitle: 'The Ceylon Advantage',
    title: 'Why Choose Us',
    reasons: [],
    backgroundImage: ''
  };

  const defaultReasons = [
    {
      icon: 'DollarSign',
      title: 'Competitive Pricing',
      desc: 'Direct access means no hidden markups.',
    },
    {
      icon: 'Search',
      title: 'Transparent Process',
      desc: 'Clear breakdown of all costs and fees.',
    },
    {
      icon: 'Zap',
      title: 'Fast Documentation',
      desc: 'Quick processing of all legal paperwork.',
    },
    {
      icon: 'Globe',
      title: 'Strong Japan Network',
      desc: 'Partnerships with top auction houses.',
    },
    {
      icon: 'HeadphonesIcon',
      title: 'After-Sales Support',
      desc: 'Dedicated support even after delivery.',
    },
  ];

  const reasons =
    whyChooseUsData.reasons && whyChooseUsData.reasons.length > 0
      ? whyChooseUsData.reasons
      : defaultReasons;

  const CARD_COLORS = [
    { from: 'from-orange-500', to: 'to-orange-600', shadow: 'shadow-orange-500/40', text: 'group-hover:text-orange-500' },
    { from: 'from-black', to: 'to-gray-900', shadow: 'shadow-black/40', text: 'group-hover:text-white' },
    { from: 'from-orange-400', to: 'to-orange-500', shadow: 'shadow-orange-500/40', text: 'group-hover:text-orange-400' },
    { from: 'from-gray-900', to: 'to-black', shadow: 'shadow-black/40', text: 'group-hover:text-white' },
    { from: 'from-orange-600', to: 'to-orange-700', shadow: 'shadow-orange-600/40', text: 'group-hover:text-orange-500' },
  ];

  return (
    <section id="why-us" className="relative py-16 sm:py-24 lg:py-32 bg-[#050505] overflow-hidden border-t border-neutral-900">
      
      {/* Background Image & Ambient Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src={normalizeImageUrl(whyChooseUsData.backgroundImage) || "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop"} 
          alt="Dark vehicle background" 
          className="w-full h-full object-cover opacity-25"
        />
        {/* Subtle orange glow accents */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/5 border-l-2 border-primary mb-6"
          >
            <span className="text-primary font-black tracking-[0.22em] uppercase text-[11px]">
              {whyChooseUsData.subtitle}
            </span>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight uppercase mb-4"
          >
            {whyChooseUsData.title}
          </motion.h3>
        </div>

        <div className="relative">
          {/* Mobile Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-20 w-10 h-10 bg-neutral-900/90 rounded-none flex items-center justify-center text-white border border-neutral-700 shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-20 w-10 h-10 bg-neutral-900/90 rounded-none flex items-center justify-center text-white border border-neutral-700 shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-visible md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 justify-start md:justify-center px-4 md:px-0 py-4 snap-x snap-mandatory -mx-4 md:mx-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {reasons.map((reason, index) => {
              const Icon = ICON_MAP[reason.icon] || CheckCircle;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="group relative shrink-0 w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col bg-neutral-900/80 hover:bg-neutral-900 rounded-none p-7 border border-neutral-800 hover:border-primary shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  
                  <div className="w-13 h-13 sm:w-14 sm:h-14 bg-neutral-800 border border-neutral-700/80 rounded-none flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
                  </div>
                  
                  <h4 className="font-display font-black text-base sm:text-lg text-white mb-2.5 uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                    {reason.title}
                  </h4>
                  
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                    {reason.desc}
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
