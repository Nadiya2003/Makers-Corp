'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    setCount(0);
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return count;
}

// ─── Single animated stat card ────────────────────────────────────────────────
function StatCard({
  value,
  label,
  started,
}: {
  value: string;
  label: string;
  started: boolean;
}) {
  // Split e.g. "500+" → numeric=500, suffix="+"
  const match = value.match(/^(\d+)(.*)$/);
  const numeric = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const prefix = match ? '' : '';

  const count = useCountUp(numeric ?? 0, 1800, started && numeric !== null);

  const display = numeric !== null ? `${prefix}${count}${suffix}` : value;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[140px]">
      <p className="text-primary font-black text-2xl sm:text-3xl mb-1 tabular-nums">
        {display}
      </p>
      <p className="text-gray-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

// ─── Main About component ─────────────────────────────────────────────────────
export function About() {
  const { settings } = useSettings();
  const statsRef = useRef<HTMLDivElement>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Start count-up when stats row scrolls into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimationStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // TypeScript-safe access: treat aboutData as a plain object with optional stats
  const rawAbout = settings?.homepage?.about as
    | { title?: string; description?: string; image?: string; stats?: { value: string; label: string }[] }
    | undefined;

  const aboutData = {
    title: rawAbout?.title || 'ABOUT MAKERS CEYLON',
    description:
      rawAbout?.description ||
      'We are your dedicated partner in importing high-quality Japanese vehicles directly to Sri Lanka. With years of expertise and a commitment to transparency, we simplify the complex process of vehicle importation.',
    image:
      rawAbout?.image ||
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    stats: rawAbout?.stats ?? [],
  };

  const stats: { value: string; label: string }[] =
    aboutData.stats.length > 0
      ? aboutData.stats
      : [
          { value: '10+', label: 'Years Experience' },
          { value: '500+', label: 'Vehicles Imported' },
        ];

  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 40 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] z-10 border-8 border-white/50 backdrop-blur-sm group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
              <Image
                src={aboutData.image}
                alt={aboutData.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-orange-400 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-orange-400 to-amber-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
            
            <div className="hidden sm:block absolute -right-8 top-1/4 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/60 z-30 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xl">10+</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Years</p>
                  <p className="text-sm font-black text-dark leading-tight">Trust & Quality</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text + Stats Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 40 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                Who We Are
              </span>
            </div>
            
            <h3 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
              {aboutData.title}
            </h3>
            
            <div className="relative">
              {/* Decorative quote mark */}
              <span className="absolute -top-6 -left-6 text-6xl text-primary/10 font-serif font-black select-none pointer-events-none">"</span>
              <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-line text-justify relative z-10">
                {aboutData.description}
              </p>
            </div>

            {stats.length > 0 && (
              <div ref={statsRef} className="mt-10 sm:mt-14 w-full grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-slate-50/80 hover:bg-white backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 hover:border-primary/20 transition-all duration-500 group flex flex-col items-center lg:items-start text-center lg:text-left">
                    <p className="text-primary font-black text-3xl sm:text-4xl lg:text-5xl mb-2 tabular-nums group-hover:scale-110 group-hover:-translate-y-1 origin-left transition-transform duration-500">
                      {animationStarted ? (
                        <StatCardRaw value={stat.value} started={animationStarted} />
                      ) : (
                        '0'
                      )}
                    </p>
                    <p className="text-slate-500 font-bold text-xs sm:text-sm uppercase tracking-widest group-hover:text-slate-800 transition-colors">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Internal helper for raw stat counting to keep layout clean
function StatCardRaw({ value, started }: { value: string; started: boolean }) {
  const match = value.match(/^(\d+)(.*)$/);
  const numeric = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const count = useCountUp(numeric ?? 0, 1800, started && numeric !== null);
  return <>{numeric !== null ? `${count}${suffix}` : value}</>;
}
