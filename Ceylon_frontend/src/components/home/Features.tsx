'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, BadgeCheck, Briefcase, Search } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Search,
      title: 'Direct Sourcing from Japan',
      description: 'We work with trusted Japanese auctions & dealers.',
    },
    {
      icon: FileCheck,
      title: 'Bank Approved Documents',
      description: 'All documents are bank verifiable & 100% genuine.',
    },
    {
      icon: BadgeCheck,
      title: 'Verified Inspection (JEVIC & Others)',
      description: 'Quality checked by verified inspection organizations.',
    },
    {
      icon: Briefcase,
      title: 'End-to-End Handling',
      description: 'From Japan to your doorstep - we handle everything.',
    },
  ];

  return (
    <section className="relative z-30 -mt-8 sm:-mt-12 lg:-mt-24 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 50 }}
                className="group relative"
              >
                {/* Glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-orange-400/0 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative h-full p-6 sm:p-8 flex flex-col items-center text-center bg-white/80 group-hover:bg-primary backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden z-10">
                  {/* Subtle inner decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
                  
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-500">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="relative font-display font-black text-lg sm:text-xl text-dark group-hover:text-white mb-3 leading-tight uppercase tracking-tight transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="relative text-gray-500 group-hover:text-white/90 text-sm font-semibold leading-relaxed max-w-[220px] transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
