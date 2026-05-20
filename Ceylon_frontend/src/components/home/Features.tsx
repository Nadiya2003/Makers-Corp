'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ship, FileCheck, ShieldCheck, Handshake, Search, BadgeCheck, Briefcase } from 'lucide-react';

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
    <section className="relative z-30 -mt-8 sm:-mt-12 lg:-mt-24 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/40 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100/50">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-5 sm:p-6 lg:p-10 flex flex-col items-center text-center group hover:bg-orange-50/40 transition-colors"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-50 to-white rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 border border-orange-100/50">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-black text-base sm:text-lg text-dark mb-2 sm:mb-3 leading-tight uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed max-w-[200px]">
                    {feature.description}
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
