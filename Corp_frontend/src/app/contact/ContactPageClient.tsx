'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

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
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Our team handles export inquiries, destination checks, and quotation requests. Choose the desk
            closest to your market or use the form below.
          </p>
        </div>
      </section>

      {/* Desk cards */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Clock className="w-4 h-4 text-slate-500" />
            <p className="text-slate-600 text-sm">
              We aim to respond within one business day. For urgent inquiries, WhatsApp is fastest.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {desks.map((desk) => (
              <div key={desk.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-2xl mb-2">{desk.icon}</p>
                <h3 className="font-bold text-slate-900 text-lg">{desk.title}</h3>
                {desk.subtitle && (
                  <p className="text-slate-500 text-xs mb-1">{desk.subtitle}</p>
                )}
                <div className="mt-3 space-y-2">
                  <a
                    href={`mailto:${desk.email}`}
                    className="flex items-center gap-2 text-sm text-slate-700 hover:text-orange-600 transition"
                  >
                    <Mail className="w-4 h-4 text-slate-400" /> {desk.email}
                  </a>
                  {desk.whatsapp ? (
                    <a
                      href={`https://wa.me/${desk.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-700 hover:text-green-600 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-400" /> WhatsApp
                    </a>
                  ) : desk.whatsappNote ? (
                    <p className="flex items-center gap-2 text-xs text-amber-600 italic">
                      <Phone className="w-4 h-4" /> {desk.whatsappNote}
                    </p>
                  ) : null}
                </div>
                <ul className="mt-4 space-y-1">
                  {desk.handles.map((h) => (
                    <li key={h} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-orange-500 mt-0.5">•</span> {h}
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Send an Inquiry</h2>
          <p className="text-slate-600 text-sm mb-8">No account required. We'll reply to your email.</p>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Inquiry Received</h3>
              <p className="text-slate-600 text-sm mb-3">
                Your reference number is <strong className="font-mono text-orange-600">{refId}</strong>
              </p>
              <p className="text-slate-500 text-sm">We aim to respond within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <input type="text" name="_honey" value={form._honey} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+81 80 0000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination Country</label>
                  <select
                    name="destination" value={form.destination} onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Inquiry Type</label>
                <select
                  name="inquiryType" value={form.inquiryType} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">Select type</option>
                  {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={5}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us what you're looking for, your stock ID of interest, or any questions..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-orange-600">privacy policy</a>.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Map placeholder note */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-500 text-sm">
            <strong className="text-slate-700">Registered address:</strong> Pending formal corporate registration
            publication. Physical office details will be listed here upon confirmation. All correspondence
            and documentation is handled via the email addresses above.
          </p>
        </div>
      </section>
    </main>
  );
}
