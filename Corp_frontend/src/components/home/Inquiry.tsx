'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';

import { useSettings } from '@/context/SettingsContext';

export function Inquiry() {
  const { settings } = useSettings();
  
  const contactData = settings?.footer || {
    phone: '+94 77 123 4567',
    email: 'info@ceylonimports.lk',
    address: '123 Import Avenue, Colombo 03, Sri Lanka'
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/inquiries`, formData);
      setSuccess('Thank you for your inquiry! We will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        vehicle: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="inquiry" className="py-16 sm:py-24 lg:py-32 bg-gray-50 flex justify-center border-t border-gray-200">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Showroom Inquiries Container */}
        <div className="bg-white rounded-none border border-neutral-200 shadow-2xl flex flex-col lg:flex-row overflow-hidden">
          
          {/* ── Left Column: Contact Details & Map ── */}
          <div className="lg:w-[45%] bg-[#111111] text-white p-8 sm:p-10 lg:p-12 relative flex flex-col">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/5 border-l-2 border-primary mb-6 w-fit">
              <span className="text-primary font-black tracking-[0.22em] uppercase text-[11px]">
                Direct Line
              </span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-3 text-white">
              Get in Touch
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-md">
              Ready to import your dream Japanese vehicle? Submit your inquiry or connect directly with our specialist team.
            </p>

            <div className="space-y-7 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Call Us</p>
                  <p className="font-bold text-white text-sm">{settings?.header?.contactNumber || contactData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Email Us</p>
                  <p className="font-bold text-white text-sm break-all sm:break-normal">{contactData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Showroom & Office</p>
                  <p className="font-bold text-white text-sm leading-snug max-w-[250px] whitespace-pre-line">
                    {contactData.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <a
                href={`https://wa.me/${(() => {
                  const numStr = settings?.header?.whatsappNumber || settings?.header?.contactNumber || contactData.phone;
                  let cleanNum = numStr.replace(/\D/g, '');
                  if (cleanNum.startsWith('0')) {
                    cleanNum = '94' + cleanNum.substring(1);
                  }
                  return cleanNum;
                })()}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc57] text-white px-6 py-3.5 rounded-none font-black uppercase tracking-widest text-xs transition-colors w-full shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              {settings?.contactPage?.googleMapUrl ? (
                <div className="bg-[#1c1c1c] rounded-none h-44 flex items-center justify-center overflow-hidden relative border border-neutral-800">
                  <iframe
                    src={settings.contactPage.googleMapUrl}
                    className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="bg-[#1c1c1c] rounded-none h-44 flex items-center justify-center overflow-hidden relative border border-neutral-800">
                  <div className="flex flex-col items-center text-neutral-500">
                    <MapPin className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Colombo, Sri Lanka</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Contact Form ── */}
          <div className="lg:w-[55%] p-8 sm:p-10 lg:p-12 bg-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 border-l-2 border-primary mb-4 w-fit">
                <span className="text-primary font-black tracking-[0.22em] uppercase text-[10px]">
                  Direct Request
                </span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-dark mb-2 uppercase tracking-tight">
                Send an Inquiry
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-8">
                Provide your vehicle details and our import managers will respond within 24 hours.
              </p>

              {success && (
                <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 p-4 rounded-none mb-6 text-xs font-bold">{success}</div>
              )}
              {error && (
                <div className="bg-rose-50 text-rose-800 border-l-4 border-rose-500 p-4 rounded-none mb-6 text-xs font-bold">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-none border border-gray-200 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white text-sm font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-none border border-gray-200 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white text-sm font-medium"
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicle" className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                    Interested Vehicle Brand / Model
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-none border border-gray-200 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white text-sm font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select a brand</option>
                    <optgroup label="Japanese Brands">
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Mazda">Mazda</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Subaru">Subaru</option>
                      <option value="Lexus">Lexus</option>
                      <option value="Daihatsu">Daihatsu</option>
                      <option value="Isuzu">Isuzu</option>
                    </optgroup>
                    <optgroup label="European & Other">
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                      <option value="Other">Other / Commercial Vehicle</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                    Specific Requirements / Budget
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-none border border-gray-200 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white resize-none text-sm font-medium"
                    placeholder="Provide details on model year, auction grade preference, or import budget..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-black uppercase tracking-widest py-4 rounded-none transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
