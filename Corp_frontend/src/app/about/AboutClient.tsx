'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Search, FileText, Globe, MapPin, Phone, Mail, AlertCircle, Compass, Target } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const markets = [
  { name: 'India', slug: '/destinations/asia/india', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Sri Lanka', slug: '/destinations/asia/sri-lanka', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Kenya', slug: '/destinations/africa', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Tanzania', slug: '/destinations/africa', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Pakistan', slug: '/destinations/asia/pakistan', status: 'Inquiry Only', badge: 'bg-amber-100 text-amber-800' },
];

export function AboutClient() {
  const { settings } = useSettings();
  const about = settings?.aboutPage;

  const title = about?.title || 'About Makers Corp Japan';
  const tagline = about?.tagline || 'Precision Japanese Vehicle Export Operations';
  const content = about?.content ||
    'Makers Corp Japan was founded with a single mission: to provide verified, premium Japanese-market vehicles directly to international buyers and dealerships worldwide. We believe that sourcing and exporting a vehicle from Japan should be transparent, cost-effective, and completely reliable.';
  const mission = about?.mission ||
    'To provide a seamless, transparent, and highly reliable vehicle export service connecting verified Tokyo, Yokohama, Kobe, and Nagoya inventory with international buyers worldwide.';
  const vision = about?.vision ||
    'To be the most trusted and preferred Japanese automotive export partner globally, known for our inspection integrity and customer-centric approach.';
  const heroImage = about?.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80';
  const directors = about?.directors || [];
  const galleryImages = about?.galleryImages || [];

  const contactPhone = settings?.footer?.phone || '+81 3 5555 0198';
  const contactEmail = settings?.footer?.email || 'japan@makers-corp.com';
  const contactAddress = settings?.footer?.address || 'Tokyo Export Hub, Minato-ku, Tokyo 105-0004, Japan';

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#111111] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-4xl mx-auto z-10">
          <p className="text-[#ff6a00] text-xs font-black uppercase tracking-widest mb-3">{tagline}</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-neutral-300 text-base md:text-lg max-w-3xl leading-relaxed font-medium">
            {content}
          </p>
        </div>
      </section>

      {/* Mission & Vision Strip */}
      <section className="py-12 px-4 bg-neutral-900 text-white border-y border-neutral-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-none">
            <div className="flex items-center gap-2 mb-3 text-[#ff6a00]">
              <Target className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Our Mission</h3>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">{mission}</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-none">
            <div className="flex items-center gap-2 mb-3 text-[#ff6a00]">
              <Compass className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Our Vision</h3>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">{vision}</p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-neutral-900 mb-10 text-center uppercase tracking-tight">Our Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Transparent Sourcing',
                body: 'Every vehicle in our catalog is a real unit with an authentic stock ID. We inspect the grade, chassis codes, and condition before listing.',
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Independent Inspection',
                body: 'Pre-export inspection is carried out by recognized agencies — JEVIC, JAAI, QISJ, or KEBS — matching destination compliance standards.',
              },
              {
                icon: <FileText className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Honest Documentation',
                body: 'Proforma invoices state FOB or CIF terms with zero hidden fees. Original Japanese export certificates and bills of lading are couriered via DHL.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-neutral-300 rounded-none p-6 shadow-2xs hover:border-[#ff6a00] transition-colors">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-bold text-neutral-900 text-base mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directors Section (if populated in Admin) */}
      {directors && directors.length > 0 && (
        <section className="py-16 px-4 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-neutral-900 mb-8 text-center uppercase tracking-tight">Executive Leadership</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {directors.map((d, i) => (
                <div key={i} className="bg-white border border-neutral-300 p-5 rounded-none text-center">
                  {d.image && (
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-neutral-200">
                      <Image src={d.image} alt={d.name} fill className="object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold text-neutral-900 text-sm">{d.name}</h4>
                  <p className="text-xs text-[#ff6a00] font-semibold mb-2">{d.role}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">{d.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery (if populated in Admin) */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-14 px-4 bg-white border-t border-neutral-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 text-center mb-6">Tokyo Yard & Export Staging Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square bg-neutral-100 overflow-hidden border border-neutral-200">
                  <Image src={img} alt={`Gallery image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Summary */}
      <section className="py-16 px-4 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-neutral-300 rounded-none p-6">
            <h3 className="font-black text-neutral-900 text-base mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ff6a00]" /> Head Operations Desk
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-[#ff6a00] transition">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{contactPhone}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-neutral-300 rounded-none p-6">
            <h3 className="font-black text-neutral-900 text-base mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ff6a00]" /> Sri Lanka Liaison — Makers Ceylon
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
              <li>Official export partner handling Sri Lanka CIF quotations, LC coordination, and Colombo port delivery.</li>
              <li className="pt-2">
                <a
                  href="https://makersceylon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:underline"
                >
                  Visit MAKERS CEYLON ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-black uppercase tracking-wider text-xs px-6 py-3 rounded-none transition shadow-sm"
          >
            Get in Touch with Tokyo Desk
          </Link>
        </div>
      </section>
    </main>
  );
}
