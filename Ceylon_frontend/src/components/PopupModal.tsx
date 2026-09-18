'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gavel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { normalizeImageUrl } from '@/lib/imageUtils';

export function PopupModal() {
  const { settings, loading } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const ad = settings?.popupAd;

  useEffect(() => {
    if (loading) return;

    if (ad?.enabled) {
      const hasSeenModal = sessionStorage.getItem('hasSeenPopupAd');
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('hasSeenPopupAd', 'true');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, ad?.enabled]);

  const handleExplore = () => {
    setIsOpen(false);
    if (ad?.buttonLink) {
      if (ad.buttonLink.startsWith('#')) {
        const element = document.querySelector(ad.buttonLink);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (ad.buttonLink.startsWith('/#')) {
        router.push(ad.buttonLink);
        setTimeout(() => {
          const id = ad.buttonLink.replace('/#', '#');
          const element = document.querySelector(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        router.push(ad.buttonLink);
      }
    }
  };

  if (!ad?.enabled) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
          >
            {/* Header Image Area */}
            <div className="h-36 sm:h-48 relative group overflow-hidden bg-gray-100">
              {ad.image && (
                <Image
                  src={normalizeImageUrl(ad.image)}
                  alt={ad.title || 'Popup Ad'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

              {/* Badge */}
              {ad.badgeText && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                  {ad.badgeText}
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-display font-black text-2xl text-white leading-none drop-shadow-md">{ad.title}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-8">
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExplore}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-primary/25 active:scale-[0.98]"
                >
                  {ad.buttonText || 'Learn More'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 sm:flex-none px-6 sm:px-8 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  {ad.dismissText || 'Maybe Later'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
