'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

export function About() {
  const { settings } = useSettings();

  const aboutData = settings?.homepage?.about || {
    title: 'ABOUT MAKERS CEYLON',
    description: 'We are your dedicated partner in importing high-quality Japanese vehicles directly to Sri Lanka. With years of expertise and a commitment to transparency, we simplify the complex process of vehicle importation.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop'
  };

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-10 border-8 border-white">
              <Image
                src={aboutData.image}
                alt={aboutData.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative background elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
              Who We Are
            </h2>
            <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark mb-6 sm:mb-8 uppercase leading-tight">
              {aboutData.title}
            </h3>
            <div className="space-y-6">
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {aboutData.description}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4">
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[140px]">
                <p className="text-primary font-black text-2xl sm:text-3xl mb-1">10+</p>
                <p className="text-gray-600 font-bold text-xs sm:text-sm uppercase tracking-wider">Years Experience</p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[140px]">
                <p className="text-primary font-black text-2xl sm:text-3xl mb-1">500+</p>
                <p className="text-gray-600 font-bold text-xs sm:text-sm uppercase tracking-wider">Vehicles Imported</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
