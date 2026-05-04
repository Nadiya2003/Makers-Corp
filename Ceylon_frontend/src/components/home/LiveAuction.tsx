'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export function LiveAuction() {
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

  return (
    <section id="live-auction" className="py-24 bg-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-bold mb-6 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LIVE FEATURE
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Experience Live Japan Auction Bidding
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Get exclusive access to thousands of vehicles daily. Watch live bids, track your
              favorite cars, and secure the best deals directly from Japanese auction houses with our
              transparent bidding system.
            </p>

            <ul className="space-y-4 mb-10">
              {['Real-time bidding access', 'Full translation of auction sheets', 'Historical price data analysis'].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {item}
                  </li>
                )
              )}
            </ul>

            <button
              onClick={scrollToInquiry}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
            >
              <Gavel className="w-5 h-5" />
              Join Live Auction
            </button>
          </motion.div>

          {/* Auction Card UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl"
          >
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Auction Vehicle"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full" /> LIVE
              </div>
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-mono border border-white/10">
                ID: USS-Tokyo-4592
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white mb-1">Toyota Harrier Z</h3>
                  <p className="text-gray-400 text-sm">2022 • 4.5 Grade • 15,000 km</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Current Bid</p>
                  <p className="font-display font-bold text-3xl text-primary">¥ 3,450,000</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 text-sm font-medium">Time Remaining</span>
                </div>
                <div className="flex gap-2 font-mono text-lg font-bold text-white">
                  <span className="bg-gray-900 px-2 py-1 rounded">{formatTime(timeLeft.hours)}</span>:
                  <span className="bg-gray-900 px-2 py-1 rounded">{formatTime(timeLeft.minutes)}</span>:
                  <span className="bg-gray-900 px-2 py-1 rounded text-primary">
                    {formatTime(timeLeft.seconds)}
                  </span>
                </div>
              </div>

              <button
                onClick={scrollToInquiry}
                className="w-full bg-white hover:bg-gray-100 text-dark font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Place Bid Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
