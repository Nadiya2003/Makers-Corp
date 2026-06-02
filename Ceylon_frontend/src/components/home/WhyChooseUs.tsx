'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Search, Zap, Globe, Headphones,
  CheckCircle, Star, Shield, Truck, ThumbsUp,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

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
    <section id="why-us" className="relative py-16 sm:py-24 lg:py-32 bg-[#050505] overflow-hidden">
      
      {/* Orange & Black Vibe Background Image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src={whyChooseUsData.backgroundImage || "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop"} 
          alt="Dark vehicle background" 
          className="w-full h-full object-cover opacity-40"
        />
        {/* Subtle orange glow accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-700/10 rounded-full blur-[130px] animate-pulse delay-700" />
        <div className="absolute top-[30%] left-[15%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[90px] animate-pulse delay-1000" />
        
        {/* Gradients to blend edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 animate-bounce" />
            <span className="text-white font-black tracking-[0.25em] uppercase text-xs">
              {whyChooseUsData.subtitle}
            </span>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-gray-400 tracking-tight leading-tight mb-4"
          >
            {whyChooseUsData.title}
          </motion.h3>
        </div>

        <div className="relative">
          {/* Mobile Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-20 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-20 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Hide native scrollbar via standard CSS styles */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-visible md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-start md:justify-center px-4 md:px-0 py-4 snap-x snap-mandatory -mx-4 md:mx-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {reasons.map((reason, index) => {
              const Icon = ICON_MAP[reason.icon] || CheckCircle;
              const color = CARD_COLORS[index % CARD_COLORS.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 40 }}
                  className="group relative shrink-0 w-[85vw] sm:w-[60vw] md:w-auto snap-center"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem]`} />
                  
                  {/* Removed overflow-hidden so hover translate-y is not clipped */}
                  <div className="relative h-full flex flex-col items-center sm:items-start text-center sm:text-left bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 lg:p-8 shadow-2xl border border-orange-300/20 hover:border-orange-400/50 hover:-translate-y-2 transition-all duration-500 z-10">
                    
                    {/* Smaller icon container (w-14 h-14) to save vertical space */}
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${color.from} ${color.to} rounded-2xl flex items-center justify-center mb-5 lg:mb-6 shadow-lg group-hover:${color.shadow} transition-all duration-500 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10" strokeWidth={1.5} />
                    </div>
                    
                    {/* Adjusted text sizing */}
                    <h4 className={`font-display font-black text-lg lg:text-xl text-white mb-3 ${color.text} transition-colors duration-300`}>
                      {reason.title}
                    </h4>
                    
                    <p className="text-gray-400 text-xs lg:text-sm font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {reason.desc}
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
