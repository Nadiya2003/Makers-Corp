'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, BadgeCheck, Briefcase, Search } from 'lucide-react';

export function Features() {
  const features = [
    {
      step: '01',
      tag: 'AUCTION ACCESS',
      micro: 'USS • CAA • TAA',
      icon: Search,
      title: 'Direct Sourcing from Japan',
      description: 'Exclusive access to USS, CAA & premier Japanese auto auction houses.',
    },
    {
      step: '02',
      tag: 'VERIFIED LC',
      micro: '100% Genuine Docs',
      icon: FileCheck,
      title: 'Bank Approved Documents',
      description: '100% genuine, bank-verifiable import documentation & customs clearance.',
    },
    {
      step: '03',
      tag: 'INSPECTION',
      micro: 'JEVIC & Grade Verified',
      icon: BadgeCheck,
      title: 'Verified Inspection',
      description: 'Rigorous JEVIC & auction grade verification before shipment.',
    },
    {
      step: '04',
      tag: 'LOGISTICS',
      micro: 'Doorstep Delivery',
      icon: Briefcase,
      title: 'End-to-End Handling',
      description: 'Full logistics management from Tokyo port to your doorstep in Sri Lanka.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-neutral-50/50 to-white border-t border-b border-gray-200/80 relative z-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Automotive Grid & Watermark Texture */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.035]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] sm:text-[9rem] lg:text-[12rem] font-black tracking-widest text-black uppercase font-display leading-none whitespace-nowrap">
          MAKERS CEYLON
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Creative Header - 1-Line Title Guaranteed */}
        <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-primary/40" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 border-l-2 border-primary text-primary text-[10px] font-black uppercase tracking-[0.25em]"
            >
              Trust & Security
            </motion.div>
            <div className="h-px w-8 sm:w-12 bg-primary/40" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] text-dark leading-tight uppercase tracking-tight whitespace-normal sm:whitespace-nowrap"
          >
            Why Import With <span className="text-primary">Makers Ceylon</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-3 text-gray-500 font-medium text-sm sm:text-base max-w-2xl mx-auto"
          >
            Direct auction access, bank-verified transparency, and complete end-to-end import peace of mind.
          </motion.p>
        </div>

        {/* 4 Creative Service & Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative bg-white p-7 sm:p-8 rounded-none border border-gray-200/90 hover:border-primary shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top showroom accent indicator */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 pointer-events-none" />

                <div>
                  {/* Top Bar: Icon + Step Code */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200/90 rounded-none flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-primary group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
                    </div>

                    <div className="font-mono text-[11px] font-black tracking-widest text-gray-300 group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-primary/60 rounded-full" />
                      {feature.step}
                    </div>
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg text-dark mb-2.5 leading-snug uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Technical Status Bar */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 group-hover:text-dark uppercase tracking-wider transition-colors">
                  <span className="text-[9px] font-mono text-gray-400 group-hover:text-neutral-700">{feature.tag}</span>
                  <span className="text-primary font-mono text-[9px]">[{feature.micro}]</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
