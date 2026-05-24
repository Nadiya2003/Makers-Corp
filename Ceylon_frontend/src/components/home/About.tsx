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
    <section id="about" className="py-12 sm:py-16 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-10 border-8 border-white">
              <Image
                src={aboutData.image}
                alt={aboutData.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
          </motion.div>

          {/* Text + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
              Who We Are
            </h2>
            <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark mb-6 sm:mb-8 uppercase leading-tight">
              {aboutData.title}
            </h3>
            <div className="space-y-6">
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {aboutData.description}
              </p>
            </div>

            {stats.length > 0 && (
              <div ref={statsRef} className="mt-8 sm:mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                {stats.map((stat, i) => (
                  <StatCard
                    key={i}
                    value={stat.value}
                    label={stat.label}
                    started={animationStarted}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
