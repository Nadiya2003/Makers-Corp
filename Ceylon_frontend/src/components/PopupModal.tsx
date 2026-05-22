'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gavel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show modal after a short delay on initial load
    const timer = setTimeout(() => {
      const hasSeenModal = sessionStorage.getItem('hasSeenAuctionModal');
      if (!hasSeenModal) {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenAuctionModal', 'true');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    setIsOpen(false);
    router.push('/#live-auction');
    setTimeout(() => {
      const element = document.getElementById('live-auction');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
            <div className="h-36 sm:h-48 relative group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Japan Auction Preview"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                New Feature
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-2xl text-white leading-none">Japan Live Auction</h3>
                    <p className="text-white/70 text-xs mt-1 font-medium">Direct Bidding Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-8">
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 leading-relaxed font-medium">
                  We've just integrated <span className="text-dark font-bold">Live Auction Access</span>.
                  Now you can bid on thousands of premium vehicles directly from Japan's most exclusive auction houses in real-time.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Real-time Bidding', icon: '⚡' },
                    { label: 'Full History Reports', icon: '📋' },
                    { label: 'Direct Import', icon: '🚢' },
                    { label: 'Verified Condition', icon: '✅' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExplore}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-primary/25 active:scale-[0.98]"
                >
                  Start Exploring
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 sm:flex-none px-6 sm:px-8 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
