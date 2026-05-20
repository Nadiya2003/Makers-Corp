'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Search, Zap, Globe, HeadphonesIcon } from 'lucide-react';

export function WhyChooseUs() {
  const reasons = [
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      desc: 'Direct access means no hidden markups.',
    },
    {
      icon: Search,
      title: 'Transparent Process',
      desc: 'Clear breakdown of all costs and fees.',
    },
    {
      icon: Zap,
      title: 'Fast Documentation',
      desc: 'Quick processing of all legal paperwork.',
    },
    {
      icon: Globe,
      title: 'Strong Japan Network',
      desc: 'Partnerships with top auction houses.',
    },
    {
      icon: HeadphonesIcon,
      title: 'After-Sales Support',
      desc: 'Dedicated support even after delivery.',
    },
  ];

  return (
    <section id="why-us" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          The Ceylon Advantage
        </h2>
        <h3 className="font-display font-bold text-3xl sm:text-4xl text-dark mb-8 sm:mb-16">Why Choose Us</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm border border-gray-100 hover:bg-primary hover:text-white text-primary transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg text-dark mb-2">{reason.title}</h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{reason.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
