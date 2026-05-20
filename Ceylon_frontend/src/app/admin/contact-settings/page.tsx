'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Map as MapIcon
} from 'lucide-react';

export default function ContactSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [contactData, setContactData] = useState({
    footer: {
      address: '123 Import Avenue, Colombo 03, Sri Lanka',
      email: 'info@ceylonimports.lk',
      phone: '+94 77 123 4567'
    },
    contactPage: {
      title: 'Contact Us',
      description: "We'd love to hear from you. Get in touch with us today...",
      workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
      googleMapUrl: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        setContactData(prev => ({
          footer: {
            address: data.data.footer?.address || prev.footer.address,
            email: data.data.footer?.email || prev.footer.email,
            phone: data.data.footer?.phone || prev.footer.phone
          },
          contactPage: {
            title: data.data.contactPage?.title || prev.contactPage.title,
            description: data.data.contactPage?.description || prev.contactPage.description,
            workingHours: data.data.contactPage?.workingHours || prev.contactPage.workingHours,
            googleMapUrl: data.data.contactPage?.googleMapUrl || prev.contactPage.googleMapUrl
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch contact settings');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      
      // Update both footer and contactPage objects
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          footer: {
            ...contactData.footer
          },
          contactPage: contactData.contactPage 
        })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'Contact details updated successfully.');
      } else {
        showStatus('error', data.message || 'Update failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">Business Contact Info</h1>
        <p className="text-gray-500 font-medium text-sm">Manage your office location, phone numbers, and contact page details.</p>
      </div>

      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <AlertCircle size={24} />}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Contact Data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Direct Contact Info */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Contact Channels</h3>
               
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Office Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                    <input 
                      type="text" 
                      value={contactData.footer.phone}
                      onChange={(e) => setContactData({
                        ...contactData, 
                        footer: { ...contactData.footer, phone: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Business Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                    <input 
                      type="email" 
                      value={contactData.footer.email}
                      onChange={(e) => setContactData({
                        ...contactData, 
                        footer: { ...contactData.footer, email: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Physical Office Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-6 text-orange-600" size={18} />
                    <textarea 
                      value={contactData.footer.address}
                      onChange={(e) => setContactData({
                        ...contactData, 
                        footer: { ...contactData.footer, address: e.target.value }
                      })}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
               </div>
            </div>

            {/* Contact Page Specifics */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contact Page Elements</h3>
               
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Working Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                    <input 
                      type="text" 
                      value={contactData.contactPage.workingHours}
                      onChange={(e) => setContactData({
                        ...contactData, 
                        contactPage: { ...contactData.contactPage, workingHours: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                    />
                  </div>
               </div>

               <div>
                   <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Google Maps Embed URL</label>
                   
                   {/* Instructions */}
                   <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-3 text-xs text-orange-700 space-y-1.5">
                     <p className="font-black uppercase tracking-wide text-orange-600">How to get the correct URL:</p>
                     <ol className="list-decimal list-inside space-y-1 font-medium">
                       <li>Open <strong>Google Maps</strong> and search your location</li>
                       <li>Click <strong>Share</strong> → <strong>Embed a map</strong> tab</li>
                       <li>Copy the URL inside <code className="bg-orange-100 px-1 rounded">src="..."</code> of the iframe code</li>
                       <li>Paste that URL below (starts with <code className="bg-orange-100 px-1 rounded">https://www.google.com/maps/embed</code>)</li>
                     </ol>
                   </div>

                   <div className="relative">
                     <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                     <input 
                       type="text" 
                       value={contactData.contactPage.googleMapUrl}
                       onChange={(e) => setContactData({
                         ...contactData, 
                         contactPage: { ...contactData.contactPage, googleMapUrl: e.target.value }
                       })}
                       placeholder="https://www.google.com/maps/embed?pb=..."
                       className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                     />
                   </div>

                   {/* URL Warning */}
                   {contactData.contactPage.googleMapUrl && !contactData.contactPage.googleMapUrl.includes('google.com/maps/embed') && (
                     <div className="mt-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-bold flex items-center gap-2">
                       <span>⚠️</span>
                       <span>This doesn't look like a Maps embed URL. Make sure to use the embed src URL, not a share link.</span>
                     </div>
                   )}

                   {/* Live Preview */}
                   {contactData.contactPage.googleMapUrl && contactData.contactPage.googleMapUrl.includes('google.com/maps/embed') && (
                     <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 h-48">
                       <iframe
                         src={contactData.contactPage.googleMapUrl}
                         className="w-full h-full border-0"
                         allowFullScreen
                         loading="lazy"
                         referrerPolicy="no-referrer-when-downgrade"
                       />
                     </div>
                   )}
                </div>

               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Contact Page Intro Text</label>
                  <textarea 
                    value={contactData.contactPage.description}
                    onChange={(e) => setContactData({
                      ...contactData, 
                      contactPage: { ...contactData.contactPage, description: e.target.value }
                    })}
                    rows={4}
                    placeholder="We'd love to hear from you. Get in touch with us today..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                  />
               </div>
            </div>

          </div>

          <div className="flex justify-end">
             <button 
               type="submit" disabled={submitting}
               className="bg-black hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl"
             >
               {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Business Details</>}
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
