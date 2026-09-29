'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { normalizeImageUrl } from '@/lib/imageUtils';

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
      normalizeImageUrl(rawAbout?.image) ||
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
      {/* Subtle Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            {/* Showroom Image Frame - Sharp Architectural Rectangle */}
            <div className="relative aspect-[4/3] rounded-none overflow-hidden shadow-2xl z-10 border border-gray-200 group">
              <Image
                src={aboutData.image}
                alt={aboutData.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Showroom Trust Badge - Sharp Luxury Spec Plaque */}
            <div className="hidden sm:block absolute -right-6 -bottom-6 bg-neutral-900 text-white p-5 rounded-none shadow-2xl border border-neutral-700/80 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-none flex items-center justify-center text-primary font-black text-2xl font-display">
                  10+
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Years of Excellence</p>
                  <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">Trust & Quality Assured</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text + Stats Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-primary/10 border-l-2 border-primary mb-6">
              <span className="text-primary font-black tracking-[0.22em] uppercase text-[11px]">
                Who We Are
              </span>
            </div>
            
            <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-dark mb-6 tracking-tight leading-tight uppercase">
              {aboutData.title}
            </h3>
            
            <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line text-justify lg:text-left relative z-10">
              {aboutData.description}
            </p>

            {stats.length > 0 && (
              <div ref={statsRef} className="mt-10 sm:mt-12 w-full grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="group relative bg-gray-50/70 hover:bg-white p-6 sm:p-8 rounded-none shadow-sm hover:shadow-xl border border-gray-200/80 hover:border-primary transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    <p className="text-primary font-black text-3xl sm:text-4xl lg:text-5xl mb-2 tabular-nums font-display tracking-tight">
                      {animationStarted ? (
                        <StatCardRaw value={stat.value} started={animationStarted} />
                      ) : (
                        '0'
                      )}
                    </p>
                    <p className="text-gray-500 font-black text-[11px] sm:text-xs uppercase tracking-widest group-hover:text-dark transition-colors">
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
