'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Target, Award, ArrowRight, Loader2, X, ChevronLeft, ChevronRight, Users, Globe, Star, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DirectorsCarousel } from '@/components/about/DirectorsCarousel';
import { normalizeImageUrl } from '@/lib/imageUtils';

// ─── Default gallery fallback ──────────────────────────────────────────────────
const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
];

const DEFAULT_VALUES = [
  { icon: Users, title: 'Customer First', desc: 'Every decision we make starts with what\'s best for our customers.' },
  { icon: Globe, title: 'Global Reach', desc: 'Extensive partnerships with Japan\'s top auction houses.' },
  { icon: Star, title: 'Proven Excellence', desc: 'Years of experience delivering vehicles across Sri Lanka.' },
  { icon: CheckCircle, title: '100% Transparent', desc: 'Full visibility into pricing, bidding, and customs processes.' },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2 rounded-none hover:bg-white/10 transition-colors">
        <X size={28} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-3 rounded-none hover:bg-white/10 transition-colors">
        <ChevronLeft size={32} />
      </button>
      <motion.div
        key={index}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-[90vw] max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={images[index]} alt={`Gallery ${index + 1}`} fill className="object-contain rounded-none" />
      </motion.div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-3 rounded-none hover:bg-white/10 transition-colors">
        <ChevronRight size={32} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
        {index + 1} / {images.length}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AboutUsClient() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [content, setContent] = useState({
    title: 'About Makers Ceylon',
    content: 'Ceylon Imports was founded with a single mission: to revolutionize the vehicle import process in Sri Lanka. We believe that importing a car from Japan should be transparent, cost-effective, and completely stress-free.',
    image: 'https://images.unsplash.com/photo-1562426509-5044a121aa49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    mission: 'To provide a seamless, transparent, and highly reliable vehicle import service that empowers our customers to purchase their dream cars directly from Japan.',
    vision: 'To be the most trusted and preferred vehicle import partner in Sri Lanka, known for our integrity and customer-centric approach.',
    directorsBg: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop',
    galleryImages: [] as string[],
    directors: [] as { name: string; role: string; bio: string; image: string; }[]
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const baseUrl = apiUrl.replace(/\/api$/, '');
      const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return normalizeImageUrl(url);
        return normalizeImageUrl(`${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`);
      };

      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data && data.data.aboutPage) {
        const page = data.data.aboutPage;
        setContent(prev => ({
          title: page.title || prev.title,
          content: page.content || prev.content,
          image: page.image ? getImageUrl(page.image) : prev.image,
          mission: page.mission || prev.mission,
          vision: page.vision || prev.vision,
          directorsBg: page.directorsBg ? getImageUrl(page.directorsBg) : prev.directorsBg,
          galleryImages: page.galleryImages?.length > 0 ? page.galleryImages.map((img: string) => getImageUrl(img)) : prev.galleryImages,
          directors: page.directors?.length > 0 ? page.directors.map((d: any) => ({ ...d, image: getImageUrl(d.image) })) : prev.directors
        }));
      }
    } catch (err) {
      console.error('Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  const gallery = content.galleryImages.length > 0 ? content.galleryImages : DEFAULT_GALLERY;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % gallery.length : null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="w-full pt-20 overflow-x-hidden">

      {/* ── Hero with Parallax ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[55vh] sm:h-[65vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 scale-110">
          <Image
            src={content.image}
            alt="About Us Banner"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        </motion.div>


        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-none mb-6 border-l-2 border-l-primary"
          >
            <Star size={14} /> Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white mb-5 leading-tight"
          >
            {content.title.split(' ').map((word, i) => {
              const isBrand = word.toLowerCase().includes('makers') || word.toLowerCase().includes('ceylon');
              return (
                <span key={i} className={isBrand ? 'text-primary' : ''}>
                  {word}{' '}
                </span>
              );
            })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-justify sm:text-center sm:text-balance"
          >
            Your trusted partner in importing premium Japanese vehicles directly to Sri Lanka.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 border border-white/30 rounded-none flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 bg-primary rounded-none" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Who We Are ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-32 bg-gray-50 relative overflow-hidden">
        {/* Subtle grid pattern without blur blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white border border-gray-200 border-l-2 border-l-primary shadow-sm mb-6">
                <span className="w-2 h-2 rounded-none bg-primary animate-pulse" />
                <span className="text-primary font-black uppercase tracking-widest text-[10px]">Who We Are</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight mb-6">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-300 rounded-none mb-8" />
              <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed whitespace-pre-wrap text-justify">
                {content.content}
              </p>
            </motion.div>

            {/* Right: Values Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DEFAULT_VALUES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                      whileHover={{ y: -4 }}
                      className="group relative bg-white rounded-none p-8 shadow-sm hover:shadow-xl border border-gray-200 hover:border-primary transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gray-50 group-hover:bg-primary rounded-none border border-gray-200 group-hover:border-primary flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm">
                          <Icon className="w-7 h-7 text-dark group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                        </div>
                        <h4 className="font-display font-black text-xl text-dark mb-3 group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Photo Gallery ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 50%, #f97316 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">Our World</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-3 mb-4">A Glimpse Inside</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Click any photo to explore in full view</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[240px] md:auto-rows-[280px]">
            {gallery.slice(0, 6).map((img, i) => {
              let gridClass = 'col-span-1 row-span-1';
              if (i === 0) gridClass = 'col-span-2 md:col-span-2 row-span-2';
              if (i === 5) gridClass = 'col-span-2 md:col-span-1 row-span-1';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openLightbox(i)}
                  className={`relative overflow-hidden rounded-none border border-neutral-800 cursor-pointer group ${gridClass}`}
                >
                  <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 border border-neutral-700 rounded-none p-3"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="text-white font-bold text-lg"></span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={gallery}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>

      {/* ── Mission & Vision ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">What drives us</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-dark mt-3">Mission & Vision</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, label: 'Our Mission', text: content.mission, color: 'from-orange-500 to-orange-600' },
              { icon: Shield, label: 'Our Vision', text: content.vision, color: 'from-gray-800 to-gray-900' },
            ].map(({ icon: Icon, label, text, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="relative bg-white rounded-none shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
                <div className="p-8 sm:p-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-none flex items-center justify-center mb-6 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-dark mb-4">{label}</h3>
                  <p className="text-gray-500 leading-relaxed text-base sm:text-lg">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board of Directors ─────────────────────────────────────────────────── */}
      {content.directors && content.directors.length > 0 && (
        <section className="py-20 sm:py-32 relative overflow-hidden">
          {/* Vehicle Background Image - clearly visible on dark overlay */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.directorsBg}
              alt="Directors background"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark dramatic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-orange-950/80" />
            {/* Subtle orange glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Top fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          </div>

          {/* Orange accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white/10 backdrop-blur-md border border-white/20 border-l-2 border-l-orange-500 mb-6">
                <span className="w-2 h-2 rounded-none bg-[#ff6a00] animate-pulse" />
                <span className="text-[#ff8a33] font-black tracking-[0.25em] uppercase text-xs">Leadership</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mt-2 mb-4">
                Board of <span className="text-[#ff6a00]">Directors</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-none mx-auto mb-4" />
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">Meet the visionary leaders behind Makers Ceylon.</p>
            </motion.div>
            <DirectorsCarousel directors={content.directors} />
          </div>
        </section>
      )}

      {/* ── Why Choose Us ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at top, rgba(249,115,22,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">The Difference</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-3 mb-4">The Makers Ceylon Difference</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">We don&apos;t just import cars; we deliver peace of mind.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Direct Auction Access', desc: 'We provide you with direct access to USS, TAA, and other major auction houses in Japan.', number: '01' },
              { title: '100% Transparency', desc: 'You see the actual auction sheet, the real bid price, and a clear breakdown of all taxes and fees.', number: '02' },
              { title: 'Quality Assurance', desc: 'Every vehicle undergoes strict JAAI inspection and verification before leaving Japan.', number: '03' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 rounded-none p-8 group hover:bg-white/10 transition-all"
              >
                <div className="text-7xl font-black text-white/5 group-hover:text-primary/10 transition-colors absolute top-4 right-6 font-display select-none">
                  {item.number}
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-none border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Award className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-display font-bold text-xl text-white mb-3 uppercase tracking-tight">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14 text-center"
          >
            <button
              onClick={() => router.push('/contact')}
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-none font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 group"
            >
              Contact Us Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
