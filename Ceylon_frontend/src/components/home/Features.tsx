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
    <section className="relative z-20 py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-black text-lg text-dark mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
