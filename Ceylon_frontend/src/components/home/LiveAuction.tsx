'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp, Sparkles } from 'lucide-react';
// import Image from 'next/image';

export function LiveAuction() {
  /* 
  // --- AUCTION LOGIC PRESERVED FOR FUTURE USE ---
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  const scrollToInquiry = () => {
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };
  */

  return (
    <section id="live-auction" className="py-12 sm:py-16 lg:py-24 bg-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            NEW FEATURE
          </div>
          
          <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-6xl text-white mb-6 sm:mb-8 leading-tight">
            Live Auctions <span className="text-primary">Coming Soon</span>
          </h2>
          
          <p className="text-gray-400 text-base sm:text-xl mb-10 sm:mb-12 leading-relaxed">
            Our state-of-the-art live auction system is currently under development. 
            Soon, you'll be able to bid on premium Japanese vehicles in real-time 
            directly from our platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: TrendingUp, label: "Real-time Bidding" },
              { icon: Gavel, label: "Direct Auction Access" },
              { icon: Clock, label: "Instant Notifications" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-white font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary/30 w-full sm:w-auto"
            >
              Get Notified on Launch
            </button>
            <p className="text-gray-500 text-sm">Stay tuned for updates!</p>
          </div>
        </motion.div>
      </div>

      {/* 
      // --- ORIGINAL AUCTION UI PRESERVED FOR FUTURE USE ---
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-content">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">Experience Live Japan Auction Bidding</h2>
            ... (Refer to previous version for full content)
          </div>
          <div className="auction-card">
            ... (Refer to previous version for full content)
          </div>
        </div>
      </div>
      */}
    </section>
  );
}
