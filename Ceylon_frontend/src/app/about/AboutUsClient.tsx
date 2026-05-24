'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DirectorsCarousel } from '@/components/about/DirectorsCarousel';

export function AboutUsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    title: 'About Makers Ceylon',
    content: 'Ceylon Imports was founded with a single mission: to revolutionize the vehicle import process in Sri Lanka. We believe that importing a car from Japan should be transparent, cost-effective, and completely stress-free.',
    image: 'https://images.unsplash.com/photo-1562426509-5044a121aa49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    mission: 'To provide a seamless, transparent, and highly reliable vehicle import service that empowers our customers to purchase their dream cars directly from Japan.',
    vision: 'To be the most trusted and preferred vehicle import partner in Sri Lanka, known for our integrity and customer-centric approach.',
    directors: [] as { name: string; role: string; bio: string; image: string; }[]
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data && data.data.aboutPage) {
        // Only update if content exists, otherwise use defaults
        const page = data.data.aboutPage;
        setContent({
          title: page.title || content.title,
          content: page.content || content.content,
          image: page.image || content.image,
          mission: page.mission || content.mission,
          vision: page.vision || content.vision,
          directors: page.directors || content.directors
        });
      }
    } catch (err) {
      console.error('Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative h-[30vh] sm:h-[40vh] min-h-[280px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.image}
            alt="About Us Banner"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-3 sm:mb-4"
          >
            {content.title.split(' ').map((word, i) => {
              const isBrand = word.toLowerCase().includes('makers') || word.toLowerCase().includes('ceylon');
              return (
                <span key={i} className={isBrand ? "text-primary" : ""}>
                  {word}{' '}
                </span>
              );
            })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Your trusted partner in importing premium Japanese vehicles.
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl text-dark mb-6">Who We Are</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
            {content.content}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-7 sm:p-10 rounded-3xl shadow-soft border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-dark mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                {content.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-7 sm:p-10 rounded-3xl shadow-soft border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-dark mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                {content.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      {content.directors && content.directors.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl text-dark mb-4">
                Board of Directors
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the visionary leaders behind Makers Ceylon.
              </p>
            </div>

            <DirectorsCarousel directors={content.directors} />
          </div>
        </section>
      )}

      {/* Detailed Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl text-dark mb-4">
              The Makers Ceylon Difference
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don&apos;t just import cars; we deliver peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Direct Auction Access',
                desc: 'We provide you with direct access to USS, TAA, and other major auction houses in Japan.',
              },
              {
                title: '100% Transparency',
                desc: 'You see the actual auction sheet, the real bid price, and a clear breakdown of all taxes and fees.',
              },
              {
                title: 'Quality Assurance',
                desc: 'Every vehicle undergoes strict JAAI inspection and verification before leaving Japan.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-display font-bold text-xl text-dark mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => router.push('/contact')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary/30"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
