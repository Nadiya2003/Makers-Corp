'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Ship, MapPin } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Choose Vehicle',
      description: 'Select from our inventory or live auctions.',
    },
    {
      icon: CreditCard,
      title: 'Confirm & Payment',
      description: 'Secure your vehicle with an initial deposit.',
    },
    {
      icon: Ship,
      title: 'Import & Shipping',
      description: 'We handle shipping and customs clearance.',
    },
    {
      icon: MapPin,
      title: 'Delivery in Sri Lanka',
      description: 'Receive your vehicle right at your doorstep.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
            Simple Process
          </h2>
          <h3 className="font-display font-bold text-3xl sm:text-4xl text-dark mb-6">How It Works</h3>
          <p className="text-gray-600 text-lg">
            Importing a vehicle doesn&apos;t have to be complicated. We&apos;ve streamlined the process into
            4 simple steps.
          </p>
        </div>

          <div className="relative pt-4 sm:pt-6">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[4rem] sm:top-[5rem] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 sm:mb-6 border-4 border-white group-hover:border-primary transition-colors duration-300 relative">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-dark group-hover:text-primary transition-colors" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-lg sm:text-xl text-dark mb-2 sm:mb-3">{step.title}</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
