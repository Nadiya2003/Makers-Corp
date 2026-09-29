'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, BadgeCheck, Briefcase, Search } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Search,
      title: 'Direct Sourcing from Japan',
      description: 'Exclusive access to USS, CAA & premier Japanese auto auction houses.',
    },
    {
      icon: FileCheck,
      title: 'Bank Approved Documents',
      description: '100% genuine, bank-verifiable import documentation & customs clearance.',
    },
    {
      icon: BadgeCheck,
      title: 'Verified Inspection',
      description: 'Rigorous JEVIC & auction grade verification before shipment.',
    },
    {
      icon: Briefcase,
      title: 'End-to-End Handling',
      description: 'Full logistics management from Tokyo port to your doorstep in Sri Lanka.',
    },
  ];

  return (
    <section className="relative z-30 -mt-8 sm:-mt-12 lg:-mt-16 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-white hover:bg-white p-7 sm:p-8 rounded-none border border-gray-200/90 hover:border-primary shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top showroom accent indicator */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                <div>
                  {/* Clean Icon Container */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white border border-gray-200/90 rounded-none flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg text-dark mb-3 leading-snug uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
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
