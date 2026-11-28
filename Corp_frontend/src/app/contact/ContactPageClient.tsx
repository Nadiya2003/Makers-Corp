'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const desks = [
  {
    title: 'Tokyo Export Hub',
    icon: '🇯🇵',
    email: 'export@makerscorpjapan.com',
    whatsapp: null,
    whatsappNote: 'WhatsApp number — confirm before publishing',
    handles: ['Global inquiries', 'FOB quotations', 'Shipping coordination', 'General vehicle questions'],
  },
  {
    title: 'India Desk',
    icon: '🇮🇳',
    email: 'india@makerscorpjapan.com',
    whatsapp: null,
    handles: ['India CIF quotations', 'Homologation guidance', 'BH-series registration questions'],
  },
  {
    title: 'Sri Lanka Liaison',
    subtitle: 'Operated by Makers Ceylon',
    icon: '🇱🇰',
    email: 'export@makerscorpjapan.com',
    whatsapp: null,
    whatsappNote: 'Sri Lanka WhatsApp — confirm before publishing',
    handles: ['Sri Lanka CIF quotations', 'CPTAD clearance support', 'Local delivery coordination'],
  },
  {
    title: 'Africa Trade Desk',
    icon: '🌍',
    email: 'africa@makerscorpjapan.com',
    whatsapp: null,
    handles: ['Kenya & Tanzania CIF', 'KEBS / TBS pre-export inspection', 'East Africa shipping routes'],
  },
];

const destinations = ['Global (USD)', 'India', 'Sri Lanka', 'Kenya', 'Tanzania', 'Pakistan', 'Other'];
const inquiryTypes = ['Stock Inquiry', 'Get a Quote', 'Request a Vehicle', 'General'];

function generateRef() {
  return 'MCJ-' + Date.now().toString(36).toUpperCase().slice(-6);
}

export function ContactPageClient() {
  const { settings } = useSettings();
  const contact = settings?.contactPage;

  const pageTitle = contact?.title || 'Get in Touch';
  const pageDescription = contact?.description || 'Our team handles export inquiries, destination checks, and quotation requests. Choose the desk closest to your market or use the form below.';
  const workingHours = contact?.workingHours || 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)';
  const hubEmail = contact?.email || settings?.footer?.email || 'japan@makers-corp.com';
  const hubPhone = contact?.phone || settings?.footer?.phone || '+81 3-5555-0199';
  const hubAddress = contact?.address || settings?.footer?.address || 'Tokyo Export Hub, Minato-ku, Tokyo 105-0004, Japan';
  const whatsappRaw = (settings?.header?.whatsappNumber || '+81 80-4893-1674').replace(/[^0-9]/g, '');

  const dynamicDesks = [
    {
      title: 'Tokyo Export Hub',
      icon: '🇯🇵',
      email: hubEmail,
      phone: hubPhone,
      whatsapp: whatsappRaw,
      handles: ['Global inquiries', 'FOB quotations', 'Shipping coordination', 'General vehicle questions'],
    },
    {
      title: 'India Desk',
      icon: '🇮🇳',
      email: 'india-desk@makerscorp.jp',
      phone: hubPhone,
      whatsapp: whatsappRaw,
      handles: ['India CIF quotations', 'Homologation guidance', 'BH-series registration questions'],
    },
    {
      title: 'Sri Lanka Liaison',
      subtitle: 'Operated by Makers Ceylon',
      icon: '🇱🇰',
      email: 'export@makerscorpjapan.com',
      phone: '+94 77 123 4567',
      whatsapp: '94771234567',
      handles: ['Sri Lanka CIF quotations', 'CPTAD clearance support', 'Local delivery coordination'],
    },
    {
      title: 'Africa Trade Desk',
      icon: '🌍',
      email: 'africa@makerscorpjapan.com',
      phone: hubPhone,
      whatsapp: whatsappRaw,
      handles: ['Kenya & Tanzania CIF', 'KEBS / TBS pre-export inspection', 'East Africa shipping routes'],
    },
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    inquiryType: '',
    message: '',
    _honey: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [refId, setRefId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form._honey) return; // honeypot
    setStatus('sending');
    setErrorMsg('');

    const ref = generateRef();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          destination: form.destination,
          inquiryType: form.inquiryType,
          message: form.message,
          leadType: 'contact',
          referenceId: ref,
          _honey: form._honey,
        }),
      });

      if (res.ok) {
        setRefId(ref);
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || 'Something went wrong. Please try again or email us directly.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Could not reach the server. Please email export@makerscorpjapan.com directly.');
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#111111] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ff6a00] text-xs font-black uppercase tracking-widest mb-3">Tokyo Export Operations</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">{pageTitle}</h1>
          <p className="text-neutral-300 text-base md:text-lg max-w-2xl leading-relaxed">
            {pageDescription}
          </p>
        </div>
      </section>

      {/* Desk cards */}
      <section className="py-14 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Clock className="w-4 h-4 text-neutral-500" />
            <p className="text-neutral-600 text-xs sm:text-sm font-medium">
              Operations Desk Working Hours: <strong>{workingHours}</strong>. Direct WhatsApp inquiries are monitored 7 days a week.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {dynamicDesks.map((desk) => (
              <div key={desk.title} className="bg-white border border-neutral-300 rounded-none p-6 shadow-2xs hover:border-[#ff6a00] transition-colors">
                <p className="text-2xl mb-2">{desk.icon}</p>
                <h3 className="font-bold text-[#111111] text-lg">{desk.title}</h3>
                {desk.subtitle && (
                  <p className="text-neutral-500 text-xs mb-1">{desk.subtitle}</p>
                )}
                <div className="mt-3 space-y-2">
                  <a
                    href={`mailto:${desk.email}`}
                    className="flex items-center gap-2 text-sm text-neutral-700 hover:text-[#ff6a00] transition"
                  >
                    <Mail className="w-4 h-4 text-neutral-400" /> {desk.email}
                  </a>
                  {desk.whatsapp ? (
                    <a
                      href={`https://wa.me/${desk.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-neutral-700 hover:text-green-600 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Direct Desk
                    </a>
                  ) : null}
                  {desk.phone ? (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" /> {desk.phone}
                    </div>
                  ) : null}
                </div>
                <ul className="mt-4 space-y-1 pt-3 border-t border-neutral-100">
                  {desk.handles.map((h) => (
                    <li key={h} className="text-xs text-neutral-500 flex items-start gap-1.5">
                      <span className="text-[#ff6a00] mt-0.5">•</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Send an Inquiry</h2>
          <p className="text-neutral-600 text-sm mb-8">No account required. We&apos;ll reply to your email.</p>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-none p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-[#111111] text-lg mb-1">Inquiry Received</h3>
              <p className="text-neutral-600 text-sm mb-3">
                Your reference number is <strong className="font-mono text-[#ff6a00]">{refId}</strong>
              </p>
              <p className="text-neutral-500 text-sm">We aim to respond within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <input type="text" name="_honey" value={form._honey} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                    placeholder="+81 80 0000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Destination Country</label>
                  <select
                    name="destination" value={form.destination} onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Inquiry Type</label>
                <select
                  name="inquiryType" value={form.inquiryType} onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  <option value="">Select type</option>
                  {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={5}
                  className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent resize-none"
                  placeholder="Tell us what you're looking for, your stock ID of interest, or any questions..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-none p-3">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#ff6a00] hover:bg-[#e55f00] disabled:opacity-60 text-white font-semibold py-3 rounded-none transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                By submitting, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-[#ff6a00]">privacy policy</a>.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Map & Office Address */}
      <section className="py-8 px-4 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-5xl mx-auto space-y-4">
          {contact?.googleMapUrl ? (
            <div className="w-full h-80 rounded-none overflow-hidden border border-neutral-300 shadow-xs mb-4">
              <iframe
                src={contact.googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tokyo Operations Desk Location"
              />
            </div>
          ) : null}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#ff6a00] flex-shrink-0 mt-0.5" />
            <p className="text-neutral-600 text-sm">
              <strong className="text-neutral-900">Tokyo Headquarters Operations Desk:</strong> {hubAddress}.
              Official vehicle export inspections and container/Ro-Ro bill of lading processing handled direct from Tokyo and Yokohama yards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
