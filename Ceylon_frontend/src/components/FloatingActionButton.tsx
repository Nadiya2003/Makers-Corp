'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToInquiry = () => {
    const element = document.getElementById('inquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToInquiry}
          className="fixed bottom-8 right-8 z-[90] bg-primary/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-[0_8px_32px_0_rgba(255,107,0,0.3)] border border-white/20 hover:bg-primary hover:-translate-y-1 transition-all group flex items-center gap-3 active:scale-95"
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 leading-none">Questions?</span>
            <span className="text-xs font-black uppercase tracking-widest leading-none mt-1">Get a Quote</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform border border-white/10">
            <MessageSquareText className="w-6 h-6" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
