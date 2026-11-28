'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Anchor, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

import { broadcastSettingsUpdated } from '@/context/SettingsContext';

interface DestinationItem {
  id: string;
  country: string;
  code: string;
  region: string;
  primaryPorts: string;
  ageLimit: string;
  inspectionType: string;
  active: boolean;
  notes: string;
  routeUrl: string;
}

const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: 'india',
    country: 'India',
    code: 'IN',
    region: 'South Asia',
    primaryPorts: 'JNPT (Nhava Sheva), Chennai Port',
    ageLimit: 'New & Homologated units under DGFT',
    inspectionType: 'Pre-export radiation & chassis audit',
    active: true,
    notes: 'Direct personal import guidelines, CIF valuation compliance, RHD mandatory.',
    routeUrl: '/destinations/asia/india'
  },
  {
    id: 'sri-lanka',
    country: 'Sri Lanka',
    code: 'LK',
    region: 'South Asia',
    primaryPorts: 'Colombo Port, Hambantota Port',
    ageLimit: 'Under Ministry of Finance / Customs schedules',
    inspectionType: 'JEVIC / JAAI Certified',
    active: true,
    notes: 'Liaison support handled in Colombo by Makers Ceylon. Bank LC coordination.',
    routeUrl: '/destinations/asia/sri-lanka'
  },
  {
    id: 'pakistan',
    country: 'Pakistan',
    code: 'PK',
    region: 'South Asia',
    primaryPorts: 'Karachi Port, Port Qasim',
    ageLimit: 'Max 3-5 years under Baggage / Gift scheme',
    inspectionType: 'JEVIC Certified',
    active: true,
    notes: 'Duty structures governed by FBR import regulations.',
    routeUrl: '/destinations/asia/pakistan'
  },
  {
    id: 'kenya',
    country: 'Kenya',
    code: 'KE',
    region: 'East Africa',
    primaryPorts: 'Mombasa Port (Kilindini Harbour)',
    ageLimit: 'Max 8 years from first registration date',
    inspectionType: 'KEBS / QISJ Mandatory Roadworthiness',
    active: true,
    notes: 'Euro IV emissions compliance and clean roadworthiness required.',
    routeUrl: '/destinations'
  },
  {
    id: 'tanzania',
    country: 'Tanzania',
    code: 'TZ',
    region: 'East Africa',
    primaryPorts: 'Dar es Salaam Port',
    ageLimit: 'No strict age limit (penalty over 10 years)',
    inspectionType: 'TBS Mandatory Pre-Shipment',
    active: true,
    notes: 'Transit cargo gateway for Rwanda, Burundi, and DR Congo.',
    routeUrl: '/destinations'
  },
  {
    id: 'united-kingdom',
    country: 'United Kingdom',
    code: 'GB',
    region: 'Europe',
    primaryPorts: 'Southampton, Bristol, Newcastle',
    ageLimit: 'IVA test under 10 years; exempt 10+ years',
    inspectionType: 'MOT / IVA Conformity',
    active: true,
    notes: 'JDM enthusiast vehicles, Skyline GT-R, Land Cruiser, Kei cars.',
    routeUrl: '/destinations'
  }
];

export default function DestinationsManagement() {
  const [destinations, setDestinations] = useState<DestinationItem[]>(DEFAULT_DESTINATIONS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<DestinationItem>({
    id: '',
    country: '',
    code: '',
    region: 'South Asia',
    primaryPorts: '',
    ageLimit: '',
    inspectionType: 'JEVIC Certified',
    active: true,
    notes: '',
    routeUrl: '/destinations'
  });

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/settings`);
      const data = await res.json();
      if (data.success && data.data?.homepage?.destinationsList && data.data.homepage.destinationsList.length > 0) {
        setDestinations(data.data.homepage.destinationsList);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setFormData(destinations[index]);
    } else {
      setEditingIndex(null);
      setFormData({
        id: `dest-${Date.now()}`,
        country: '',
        code: '',
        region: 'South Asia',
        primaryPorts: '',
        ageLimit: '',
        inspectionType: 'JEVIC Certified',
        active: true,
        notes: '',
        routeUrl: '/destinations'
      });
    }
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: DestinationItem[];
    if (editingIndex !== null) {
      updated = [...destinations];
      updated[editingIndex] = formData;
    } else {
      updated = [...destinations, formData];
    }
    setDestinations(updated);
    setShowModal(false);
    saveToBackend(updated);
  };

  const handleDelete = (index: number) => {
    const updated = destinations.filter((_, i) => i !== index);
    setDestinations(updated);
    saveToBackend(updated);
  };

  const handleToggleActive = (index: number) => {
    const updated = [...destinations];
    updated[index].active = !updated[index].active;
    setDestinations(updated);
    saveToBackend(updated);
  };

  const saveToBackend = async (dataToSave: DestinationItem[]) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          homepage: {
            destinationsList: dataToSave
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.data) {
          try {
            localStorage.setItem('mcj_site_settings', JSON.stringify(data.data));
          } catch {}
        }
        broadcastSettingsUpdated();
        showNotification('success', 'Destination settings synchronized with database!');
      } else {
        showNotification('error', data.message || 'Save failed');
      }
    } catch (err) {
      showNotification('error', 'Network error updating destinations');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-md ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              International Trade Corridors
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Destination Markets Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Configure import compliance rules, discharge ports, age restrictions, and liaison offices.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all"
        >
          <Plus size={16} />
          <span>Add Destination Market</span>
        </button>
      </div>

      {/* Grid of Destinations */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading Destinations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <div 
              key={dest.id || idx}
              className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                dest.active ? 'border-gray-100 hover:shadow-xl' : 'border-dashed border-gray-200 opacity-60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                      {dest.code || dest.country.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg leading-none">{dest.country}</h3>
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1 block">
                        {dest.region}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(idx)}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors ${
                      dest.active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {dest.active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <Anchor size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-700 block">Ports:</span>
                      <span className="text-gray-500 font-medium">{dest.primaryPorts}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <ShieldCheck size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-700 block">Inspection & Age:</span>
                      <span className="text-gray-500 font-medium">{dest.inspectionType} • {dest.ageLimit}</span>
                    </div>
                  </div>

                  {dest.notes && (
                    <p className="text-[11px] text-gray-400 italic pt-1 leading-relaxed">
                      "{dest.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={dest.routeUrl || '/destinations'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} /> View Page
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(idx)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Edit destination"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete destination"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                {editingIndex !== null ? 'Edit Destination' : 'Add Destination'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g. India"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Country Code (2 Letters) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. IN"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g. South Asia, East Africa, Europe"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Discharge Ports *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primaryPorts}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryPorts: e.target.value }))}
                  placeholder="e.g. JNPT (Nhava Sheva), Chennai Port"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Age Restriction
                  </label>
                  <input
                    type="text"
                    value={formData.ageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageLimit: e.target.value }))}
                    placeholder="e.g. Max 5 Years"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Required Inspection
                  </label>
                  <input
                    type="text"
                    value={formData.inspectionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspectionType: e.target.value }))}
                    placeholder="e.g. JEVIC, JAAI, QISJ"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Compliance / Sourcing Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Homologation rules, local liaison support partner..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md flex items-center gap-2"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
