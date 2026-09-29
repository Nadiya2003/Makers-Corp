'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp, Sparkles } from 'lucide-react';

export function LiveAuction() {
  return (
    <section id="live-auction" className="py-16 sm:py-20 lg:py-28 bg-[#0A0A0A] border-t border-neutral-900 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.22em] mb-8 border-l-2 border-primary">
            <Sparkles className="w-3.5 h-3.5" />
            NEW FEATURE
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight uppercase tracking-tight">
            Live Auctions <span className="text-primary">Coming Soon</span>
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg mb-12 leading-relaxed font-medium">
            Our state-of-the-art live auction system is currently under development.
            Soon, you&apos;ll be able to bid on premium Japanese vehicles in real-time
            directly from our platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: TrendingUp, label: 'Real-time Bidding', desc: 'Watch live bids update instantly from Tokyo' },
              { icon: Gavel, label: 'Direct Auction Access', desc: 'Connect to premier Japanese auction houses' },
              { icon: Clock, label: 'Instant Notifications', desc: 'Never miss your target vehicle cycle' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-7 rounded-none bg-neutral-900/80 border border-neutral-800 hover:border-primary transition-all duration-300 shadow-xl"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-12 h-12 bg-neutral-800 border border-neutral-700/80 flex items-center justify-center mx-auto mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <p className="text-white font-black text-sm uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">{item.label}</p>
                <p className="text-neutral-400 text-xs leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-none font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/30 w-full sm:w-auto active:scale-95"
            >
              Get Notified on Launch
            </button>
            <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Priority notification for registered clients</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
