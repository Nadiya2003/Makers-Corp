'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Search, Zap, Globe, Headphones,
  CheckCircle, Star, Shield, Truck, ThumbsUp,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign, Search, Zap, Globe,
  HeadphonesIcon: Headphones,
  CheckCircle, Star, Shield, Truck, ThumbsUp,
};

export function WhyChooseUs() {
  const { settings } = useSettings();

  const whyChooseUsData = settings?.homepage?.whyChooseUs || {
    subtitle: 'The Ceylon Advantage',
    title: 'Why Choose Us',
    reasons: []
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

  return (
    <section id="why-us" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          {whyChooseUsData.subtitle}
        </h2>
        <h3 className="font-display font-bold text-3xl sm:text-4xl text-dark mb-8 sm:mb-16">
          {whyChooseUsData.title}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {reasons.map((reason, index) => {
            // Dynamically load the icon, defaulting to CheckCircle if not found
            const Icon = ICON_MAP[reason.icon] || CheckCircle;
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
                <h4 className="font-display font-bold text-base sm:text-lg text-dark mb-2">
                  {reason.title}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
