'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { convertMapUrl } from '@/lib/mapUtils';

export function ContactUsClient() {
  const [loadingContent, setLoadingContent] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    footer: {
      address: '123 Import Avenue, Colombo 03, Sri Lanka',
      email: 'info@ceylonimports.lk',
      phone: '+94 77 123 4567'
    },
    contactPage: {
      title: 'Contact Us',
      description: 'Have a question or ready to import? Our team is here to help you every step of the way.',
      workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
      googleMapUrl: ''
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        setContactInfo({
          footer: {
            address: data.data.footer?.address || contactInfo.footer.address,
            email: data.data.footer?.email || contactInfo.footer.email,
            phone: data.data.footer?.phone || contactInfo.footer.phone
          },
          contactPage: {
            title: data.data.contactPage?.title || contactInfo.contactPage.title,
            description: data.data.contactPage?.description || contactInfo.contactPage.description,
            workingHours: data.data.contactPage?.workingHours || contactInfo.contactPage.workingHours,
            googleMapUrl: data.data.contactPage?.googleMapUrl || ''
          }
        });
      }
    } catch (err) {
      console.error('Failed to fetch contact content');
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const response = await axios.post(`${apiUrl}/contact`, formData);
      setSuccess('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        phone: '',
        vehicle: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
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

  if (loadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="w-full pt-20">
      {/* Header */}
      <div className="bg-dark text-white py-8 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4"
          >
            {contactInfo.contactPage.title.split(' ').map((word, i) => (
              <span key={i} className={i === contactInfo.contactPage.title.split(' ').length - 1 ? "text-primary" : ""}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0"
          >
            {contactInfo.contactPage.description}
          </motion.p>
        </div>
      </div>

      <section className="py-8 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Details & Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-soft border border-gray-100">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-dark mb-5 sm:mb-6">
                  Contact Information
                </h3>

                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Phone</p>
                      <p className="font-semibold text-dark text-base sm:text-lg whitespace-pre-wrap">{contactInfo.footer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Email</p>
                      <p className="font-semibold text-dark text-base sm:text-lg break-all sm:break-normal">{contactInfo.footer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Office Address</p>
                      <p className="font-semibold text-dark text-base sm:text-lg leading-snug sm:leading-relaxed whitespace-pre-wrap">
                        {contactInfo.footer.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Business Hours</p>
                      <p className="font-semibold text-dark text-base sm:text-lg">
                        {contactInfo.contactPage.workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
                  <a
                    href={`https://wa.me/${contactInfo.footer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold transition-colors w-full text-base sm:text-lg shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    Quick Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-64 sm:h-80 flex items-center justify-center border border-gray-300 overflow-hidden relative shadow-inner">
                {(() => {
                  const mapResult = convertMapUrl(contactInfo.contactPage.googleMapUrl);
                  if (mapResult.embedUrl) {
                    return (
                      <iframe 
                        src={mapResult.embedUrl} 
                        className="w-full h-full border-0"
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    );
                  }
                  return (
                    <>
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 grayscale mix-blend-multiply" />
                      <div className="relative z-10 flex flex-col items-center text-gray-600 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm">
                        <MapPin className="w-8 h-8 mb-2 text-primary" />
                        <span className="font-medium text-xs uppercase tracking-widest font-black">Map not configured</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-soft border border-gray-100"
            >
              <h3 className="font-display font-bold text-xl sm:text-2xl text-dark mb-6 sm:mb-8">Send us a Message</h3>

              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6">{success}</div>
              )}
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-gray-50 focus:bg-white text-base"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-gray-50 focus:bg-white text-base"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Interested Vehicle Brand
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-gray-50 focus:bg-white appearance-none text-base"
                  >
                    <option value="" disabled>
                      Select a brand
                    </option>
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-gray-50 focus:bg-white resize-none text-base"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-base active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
