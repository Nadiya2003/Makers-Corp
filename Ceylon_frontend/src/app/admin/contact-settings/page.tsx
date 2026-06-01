'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { convertMapUrl } from '@/lib/mapUtils';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ContactSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const savedRef = useRef<string>('');
  
  const [contactData, setContactData] = useState({
    header: {
      contactNumber: '077 123 4567',
      whatsappNumber: ''
    },
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
          header: {
            contactNumber: data.data.header?.contactNumber || prev.header.contactNumber,
            whatsappNumber: data.data.header?.whatsappNumber || prev.header.whatsappNumber
          },
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
        // snapshot for dirty tracking (build from actual data, not the merged prev)
        const snapshot = {
          header: { 
            contactNumber: data.data.header?.contactNumber || '',
            whatsappNumber: data.data.header?.whatsappNumber || ''
          },
          footer: {
            address: data.data.footer?.address || '',
            email: data.data.footer?.email || '',
            phone: data.data.footer?.phone || ''
          },
          contactPage: {
            title: data.data.contactPage?.title || '',
            description: data.data.contactPage?.description || '',
            workingHours: data.data.contactPage?.workingHours || '',
            googleMapUrl: data.data.contactPage?.googleMapUrl || ''
          }
        };
        savedRef.current = JSON.stringify(snapshot);
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Failed to fetch contact settings');
    } finally {
      setLoading(false);
    }
  };

  // Track dirty state whenever contactData changes
  useEffect(() => {
    if (savedRef.current) {
      setIsDirty(JSON.stringify(contactData) !== savedRef.current);
    }
  }, [contactData]);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  /** Auto-resolve short links (maps.app.goo.gl / goo.gl/maps) via backend proxy */
  const resolveShortLink = async (shortUrl: string) => {
    setIsResolvingUrl(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/map-resolve?url=${encodeURIComponent(shortUrl)}`);
      const data = await res.json();
      if (data.success && data.resolvedUrl) {
        // Update the field with the resolved full URL
        setContactData(prev => ({
          ...prev,
          contactPage: { ...prev.contactPage, googleMapUrl: data.resolvedUrl }
        }));
      } else {
        showStatus('error', 'Could not resolve the short link. Please paste the full Google Maps share URL.');
      }
    } catch {
      showStatus('error', 'Network error while resolving the map link.');
    } finally {
      setIsResolvingUrl(false);
    }
  };


  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validate and convert the map URL before saving
    const rawMapUrl = contactData.contactPage.googleMapUrl;
    let resolvedMapUrl = rawMapUrl;

    if (rawMapUrl) {
      const mapResult = convertMapUrl(rawMapUrl);
      if (mapResult.status === 'shortlink') {
        // Should not happen — the onChange already resolves short links.
        // As a safety net, try resolving again and abort this submit.
        resolveShortLink(rawMapUrl);
        showStatus('error', 'Please wait for the link to resolve, then save again.');
        return;
      }
      if (mapResult.status === 'invalid') {
        showStatus('error', 'The map URL is not a valid Google Maps link. Please check and try again.');
        return;
      }
      if (mapResult.embedUrl) {
        resolvedMapUrl = mapResult.embedUrl;
      }
    }

    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          header: { ...contactData.header },
          footer: { ...contactData.footer },
          contactPage: {
            ...contactData.contactPage,
            googleMapUrl: resolvedMapUrl
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state to show the resolved URL
        setContactData(prev => ({
          ...prev,
          contactPage: { ...prev.contactPage, googleMapUrl: resolvedMapUrl }
        }));
        savedRef.current = JSON.stringify({
          ...contactData,
          contactPage: { ...contactData.contactPage, googleMapUrl: resolvedMapUrl }
        });
        setIsDirty(false);
        showStatus('success', 'Contact details updated successfully.');
      } else {
        showStatus('error', data.message || 'Update failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }

  }, [contactData]);

  useUnsavedChanges(isDirty, handleSubmit);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Direct Contact Info */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Contact Channels</h3>
               
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Primary Contact Number (Calls)</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl focus-within:border-orange-600 transition-all p-3 custom-phone-wrapper">
                    <PhoneInput
                      defaultCountry="LK"
                      international
                      value={contactData.header.contactNumber}
                      onChange={(value) => setContactData({
                        ...contactData, 
                        header: { ...contactData.header, contactNumber: value || '' }
                      })}
                      className="w-full bg-transparent px-2 text-sm font-bold outline-none"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">WhatsApp Number</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl focus-within:border-orange-600 transition-all p-3 custom-phone-wrapper">
                    <PhoneInput
                      defaultCountry="LK"
                      international
                      value={contactData.header.whatsappNumber}
                      onChange={(value) => setContactData({
                        ...contactData, 
                        header: { ...contactData.header, whatsappNumber: value || '' }
                      })}
                      className="w-full bg-transparent px-2 text-sm font-bold outline-none"
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
                   <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Google Maps URL</label>

                   {/* Instructions */}
                   <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-3 text-xs text-blue-700 space-y-1.5">
                     <p className="font-black uppercase tracking-wide text-blue-600">How to add your map (any method works):</p>
                     <ol className="list-decimal list-inside space-y-1 font-medium text-blue-600">
                       <li>Open <strong>Google Maps</strong> and search your location</li>
                       <li>Click <strong>Share</strong> → <strong>Copy link</strong></li>
                       <li>Paste it below — the system will convert it automatically ✨</li>
                     </ol>
                     <p className="text-blue-500 font-medium pt-1 border-t border-blue-100">All Google Maps formats are supported (share links, embed URLs, short links).</p>
                   </div>

                   <div className="relative">
                     <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" size={18} />
                     {isResolvingUrl && (
                       <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 animate-spin" size={18} />
                     )}
                     <input 
                       type="text"
                       value={contactData.contactPage.googleMapUrl}
                       onChange={(e) => {
                         const val = e.target.value;
                         setContactData({
                           ...contactData,
                           contactPage: { ...contactData.contactPage, googleMapUrl: val }
                         });
                         // Auto-resolve short links immediately on paste
                         if (val.includes('goo.gl/maps/') || val.includes('maps.app.goo.gl/')) {
                           resolveShortLink(val);
                         }
                       }}
                       placeholder="Paste any Google Maps link..."
                       disabled={isResolvingUrl}
                       className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all disabled:opacity-60"
                     />
                   </div>

                   {/* Status Feedback */}
                   {isResolvingUrl ? (
                     <div className="mt-2 border rounded-xl p-3 text-xs font-bold bg-blue-50 border-blue-100 text-blue-700 flex items-center gap-2">
                       <Loader2 size={14} className="animate-spin shrink-0" />
                       Resolving short link — please wait...
                     </div>
                   ) : (() => {
                     const result = convertMapUrl(contactData.contactPage.googleMapUrl);
                     if (result.status === 'empty') return null;
                     const colorMap = {
                       embed:     'bg-green-50 border-green-100 text-green-700',
                       share:     'bg-green-50 border-green-100 text-green-700',
                       shortlink: 'bg-amber-50 border-amber-100 text-amber-700',
                       invalid:   'bg-red-50 border-red-100 text-red-600',
                     };
                     const cls = colorMap[result.status] || colorMap.invalid;
                     return (
                       <div className={`mt-2 border rounded-xl p-3 text-xs font-bold ${cls}`}>
                         {result.message}
                       </div>
                     );
                   })()}

                   {/* Live Preview */}
                   {(() => {
                     const result = convertMapUrl(contactData.contactPage.googleMapUrl);
                     if (!result.embedUrl) return null;
                     return (
                       <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 h-48">
                         <iframe
                           src={result.embedUrl}
                           className="w-full h-full border-0"
                           allowFullScreen
                           loading="lazy"
                           referrerPolicy="no-referrer-when-downgrade"
                         />
                       </div>
                     );
                   })()}
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
               type="submit" disabled={submitting || isResolvingUrl}
               className="bg-black hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
             >
               {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Business Details</>}
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
