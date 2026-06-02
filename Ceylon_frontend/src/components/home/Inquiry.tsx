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
    <section id="inquiry" className="py-12 sm:py-20 lg:py-24 bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Container */}
        <div className="bg-white rounded-[2rem] border border-primary/40 shadow-2xl shadow-orange-500/5 flex flex-col lg:flex-row overflow-hidden">
          
          {/* ── Left Column: Contact Details & Map ── */}
          <div className="lg:w-[45%] bg-[#111] text-white p-8 sm:p-10 lg:p-12 relative flex flex-col">
            {/* Subtle top-right glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <h3 className="font-display font-bold text-3xl sm:text-4xl mb-3 relative z-10">
              Get in Touch
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-10 max-w-md relative z-10">
              Ready to import your dream vehicle? Fill out the form or contact us directly.
            </p>

            <div className="space-y-8 flex-1 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Call Us</p>
                  <p className="font-semibold text-white">{settings?.header?.contactNumber || contactData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-gray-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email Us</p>
                  <p className="font-semibold text-white break-all sm:break-normal">{contactData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Visit Us</p>
                  <p className="font-semibold text-white leading-snug max-w-[250px] whitespace-pre-line">
                    {contactData.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 relative z-10">
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
                className="flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white px-6 py-3.5 rounded-xl font-medium transition-colors w-full text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              {settings?.contactPage?.googleMapUrl ? (
                <div className="bg-[#222] rounded-xl h-48 flex items-center justify-center overflow-hidden relative">
                  <iframe
                    src={settings.contactPage.googleMapUrl}
                    className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="bg-[#222] rounded-xl h-48 flex items-center justify-center overflow-hidden relative">
                  <div className="flex flex-col items-center text-gray-500">
                    <MapPin className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Map not configured</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Contact Form ── */}
          <div className="lg:w-[55%] p-8 sm:p-10 lg:p-12 bg-white">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-dark mb-8">
              Send an Inquiry
            </h3>

            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm">{success}</div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vehicle" className="block text-sm text-gray-600 mb-2">
                  Interested Vehicle Brand
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white appearance-none text-sm cursor-pointer"
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
                  <optgroup label="Korean Brands">
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                  </optgroup>
                  <optgroup label="European / Other">
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </optgroup>
                  <option value="Other">Other / Not Listed</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-600 mb-2">
                  Message / Specific Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50/50 focus:bg-white resize-none text-sm"
                  placeholder="Tell us about the specific model, year, or budget you have in mind..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#e66a00] disabled:bg-primary/50 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm mt-4"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
