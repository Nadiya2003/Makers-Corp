'use client';

import { useState, useRef } from 'react';

type Mode = 'specific' | 'general';

const DESTINATION_OPTIONS = [
  'India',
  'Sri Lanka',
  'Kenya',
  'Tanzania',
  'Pakistan',
  'Other',
];

const BODY_TYPE_OPTIONS = [
  'SUV/4x4',
  'Sedan',
  'Hatchback',
  'Van/MPV',
  'Truck/Commercial',
  'Luxury/Performance',
  'Other',
];

const FUEL_OPTIONS = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];

const STEERING_OPTIONS = ['Any', 'RHD', 'LHD'];

const BUDGET_RANGES = [
  'Under $10k',
  '$10k–$20k',
  '$20k–$35k',
  '$35k–$60k',
  '$60k+',
];

const VEHICLE_CATEGORIES = [
  'SUV/4x4',
  'Sedan/Hatchback',
  'Van/MPV',
  'Truck/Commercial',
  'Luxury',
  'Hybrid/EV',
];

function generateRef() {
  return 'MCJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function RequestVehicleForm() {
  const [mode, setMode] = useState<Mode>('specific');
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Specific form state
  const [specificForm, setSpecificForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    destinationCountry: '',
    destinationPort: '',
    make: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    bodyType: '',
    fuel: '',
    steering: '',
    maxBudget: '',
    notes: '',
    honeypot: '',
  });

  // General form state
  const [generalForm, setGeneralForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    destinationCountry: '',
    budgetRange: '',
    categories: [] as string[],
    message: '',
  });

  const handleSpecificChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setSpecificForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setGeneralForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryToggle = (cat: string) => {
    setGeneralForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot check
    if (mode === 'specific' && specificForm.honeypot) return;

    setLoading(true);
    setError('');

    try {
      const payload =
        mode === 'specific'
          ? { leadType: 'vehicle_sourcing', mode: 'specific', ...specificForm }
          : { leadType: 'vehicle_sourcing', mode: 'general', ...generalForm };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      const data = await res.json().catch(() => ({}));
      setRefNumber(data.referenceNumber || generateRef());
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly at export@makerscorpjapan.com.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-none p-8 text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-[#111111] mb-2">Request Received</h2>
        <p className="text-neutral-700 mb-4">
          Your reference number is{' '}
          <span className="font-mono font-semibold text-[#ff6a00]">{refNumber}</span>.
        </p>
        <p className="text-neutral-600">
          We will respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-8 bg-neutral-100 rounded-none p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode('specific')}
          className={`px-5 py-2 rounded-none text-sm font-semibold transition-colors ${
            mode === 'specific'
              ? 'bg-[#ff6a00] text-white shadow'
              : 'text-neutral-600 hover:text-[#111111]'
          }`}
        >
          Specific Model Request
        </button>
        <button
          type="button"
          onClick={() => setMode('general')}
          className={`px-5 py-2 rounded-none text-sm font-semibold transition-colors ${
            mode === 'general'
              ? 'bg-[#ff6a00] text-white shadow'
              : 'text-neutral-600 hover:text-[#111111]'
          }`}
        >
          General Sourcing Inquiry
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {mode === 'specific' ? (
          <div className="space-y-5">
            {/* Honeypot */}
            <input
              type="text"
              name="honeypot"
              value={specificForm.honeypot}
              onChange={handleSpecificChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={specificForm.fullName}
                  onChange={handleSpecificChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={specificForm.email}
                  onChange={handleSpecificChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={specificForm.phone}
                  onChange={handleSpecificChange}
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Destination Country <span className="text-[#ff6a00]">*</span>
                </label>
                <select
                  name="destinationCountry"
                  value={specificForm.destinationCountry}
                  onChange={handleSpecificChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  <option value="">Select country…</option>
                  {DESTINATION_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Destination Port
              </label>
              <input
                type="text"
                name="destinationPort"
                value={specificForm.destinationPort}
                onChange={handleSpecificChange}
                placeholder="e.g. Nhava Sheva, Colombo, Mombasa"
                className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Your freight forwarder can confirm the preferred port.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Vehicle Make <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={specificForm.make}
                  onChange={handleSpecificChange}
                  required
                  placeholder="e.g. Toyota, Nissan, Mitsubishi"
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Model <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={specificForm.model}
                  onChange={handleSpecificChange}
                  required
                  placeholder="e.g. Land Cruiser, X-Trail, Outlander"
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Year Range
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    name="yearFrom"
                    value={specificForm.yearFrom}
                    onChange={handleSpecificChange}
                    placeholder="From"
                    min="1990"
                    max="2030"
                    className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  />
                  <span className="text-neutral-400">–</span>
                  <input
                    type="number"
                    name="yearTo"
                    value={specificForm.yearTo}
                    onChange={handleSpecificChange}
                    placeholder="To"
                    min="1990"
                    max="2030"
                    className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Max Budget (USD)
                </label>
                <input
                  type="number"
                  name="maxBudget"
                  value={specificForm.maxBudget}
                  onChange={handleSpecificChange}
                  placeholder="e.g. 25000"
                  min="0"
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Body Type
                </label>
                <select
                  name="bodyType"
                  value={specificForm.bodyType}
                  onChange={handleSpecificChange}
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  <option value="">Any</option>
                  {BODY_TYPE_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Fuel Preference
                </label>
                <select
                  name="fuel"
                  value={specificForm.fuel}
                  onChange={handleSpecificChange}
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  {FUEL_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Steering
                </label>
                <select
                  name="steering"
                  value={specificForm.steering}
                  onChange={handleSpecificChange}
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  {STEERING_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Notes / Specific Requirements
              </label>
              <textarea
                name="notes"
                value={specificForm.notes}
                onChange={handleSpecificChange}
                rows={4}
                placeholder="Any specific requirements, trim levels, features, or other notes…"
                className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
              />
            </div>
          </div>
        ) : (
          /* General Sourcing Inquiry */
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={generalForm.fullName}
                  onChange={handleGeneralChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email <span className="text-[#ff6a00]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={generalForm.email}
                  onChange={handleGeneralChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={generalForm.phone}
                  onChange={handleGeneralChange}
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Destination Country <span className="text-[#ff6a00]">*</span>
                </label>
                <select
                  name="destinationCountry"
                  value={generalForm.destinationCountry}
                  onChange={handleGeneralChange}
                  required
                  className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
                >
                  <option value="">Select country…</option>
                  {DESTINATION_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Budget Range
              </label>
              <select
                name="budgetRange"
                value={generalForm.budgetRange}
                onChange={handleGeneralChange}
                className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-white"
              >
                <option value="">Prefer not to say</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vehicle Categories of Interest
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {VEHICLE_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 cursor-pointer rounded-none border px-4 py-2.5 text-sm transition-colors ${
                      generalForm.categories.includes(cat)
                        ? 'border-[#ff6a00] bg-[#fff4eb] text-[#e55f00]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={generalForm.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-orange-600"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={generalForm.message}
                onChange={handleGeneralChange}
                rows={4}
                placeholder="Describe what you're looking for — budget, quantities, preferred specs, intended use…"
                className="w-full border border-neutral-300 rounded-none px-4 py-2.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-none p-3">
            {error}
          </p>
        )}

        <div className="mt-7">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff6a00] text-white font-semibold px-8 py-3 rounded-none hover:bg-[#e55f00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
