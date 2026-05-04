'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Globe2, Landmark, Truck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function FloatingIcons() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToInquiry = () => {
    if (pathname !== '/') {
      router.push('/#inquiry');
    } else {
      const element = document.getElementById('inquiry');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const features = [
    { icon: Tag, label: 'Best Prices' },
    { icon: Globe2, label: 'Direct from Japan' },
    { icon: Landmark, label: 'Bank Approved' },
    { icon: Truck, label: 'Islandwide Delivery' },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 pl-2">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.button
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            onClick={scrollToInquiry}
            className="group relative flex items-center bg-white shadow-soft rounded-r-xl p-3 hover:bg-primary transition-colors border border-gray-100 border-l-0"
          >
            <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-dark text-white text-sm font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
              {feature.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-dark" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
