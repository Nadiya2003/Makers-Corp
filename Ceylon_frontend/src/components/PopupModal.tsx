'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gavel } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header Image Area */}
            <div className="h-32 bg-gradient-to-br from-primary to-orange-400 relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay" />
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                <Gavel className="w-8 h-8 text-primary" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 text-center">
              <h3 className="font-display font-bold text-2xl text-dark mb-3">New Update</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Now offering a live Japan auction bidding experience! Get real-time access to thousands
                of vehicles directly from Japanese auction houses.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleExplore}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/25"
                >
                  Explore Now
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
