'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Search, FileText, Package } from 'lucide-react';

const destinations = ['India', 'Sri Lanka', 'Kenya', 'Tanzania', 'Pakistan', 'Other'];
const bodyTypes = ['SUV / 4x4', 'Sedan', 'Hatchback', 'Van / MPV', 'Truck / Commercial', 'Luxury / Performance', 'Other'];
const fuelOptions = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const steeringOptions = ['Any', 'RHD', 'LHD'];
const budgetRanges = ['Under $10,000', '$10,000 – $20,000', '$20,000 – $35,000', '$35,000 – $60,000', '$60,000+'];
const categoryOptions = ['SUV / 4x4', 'Sedan / Hatchback', 'Van / MPV', 'Truck / Commercial', 'Luxury', 'Hybrid / EV'];

function generateRef() {
  return 'MCJ-' + Date.now().toString(36).toUpperCase().slice(-6);
}

type Mode = 'specific' | 'general';

export function RequestVehicleClient() {
  const [mode, setMode] = useState<Mode>('specific');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [refId, setRefId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Specific model form
  const [specific, setSpecific] = useState({
    name: '', email: '', phone: '', destination: '', port: '',
    make: '', model: '', yearFrom: '', yearTo: '',
    bodyType: '', fuel: '', steering: '', budgetUsd: '', notes: '', _honey: '',
  });

  // General inquiry form
  const [general, setGeneral] = useState({
    name: '', email: '', phone: '', destination: '',
    budgetRange: '', message: '', _honey: '',
    categories: [] as string[],
  });

  const handleSpecificChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpecific((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneral((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (cat: string) => {
    setGeneral((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = mode === 'specific' ? specific : { ...general, categories: general.categories.join(', ') };
    if ((payload as any)._honey) return;
    setStatus('sending');
    setErrorMsg('');
    const ref = generateRef();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, leadType: 'vehicle_sourcing', mode, referenceId: ref }),
      });
      if (res.ok) { setRefId(ref); setStatus('success'); }
      else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || 'Something went wrong. Please try emailing export@makerscorpjapan.com directly.');
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
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Sourcing Request</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Vehicle</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            {`Can't find what you're looking for? Tell us what you need. We source vehicles through Japan's
            auction network and dealer connections.`}
          </p>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* Form column */}
          <div className="lg:col-span-2">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-8 w-full">
              {(['specific', 'general'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setStatus('idle'); }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${
                    mode === m
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m === 'specific' ? 'Specific Model Request' : 'General Sourcing Inquiry'}
                </button>
              ))}
            </div>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Request Received</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Reference: <strong className="font-mono text-orange-600">{refId}</strong>
                </p>
                <p className="text-slate-500 text-sm mb-6">We will respond within one business day with availability and preliminary pricing.</p>
                <Link href="/vehicles" className="inline-flex items-center gap-2 text-orange-600 font-medium text-sm hover:underline">
                  Continue browsing stock <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : mode === 'specific' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="_honey" value={specific._honey} onChange={handleSpecificChange} className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required><input type="text" name="name" value={specific.name} onChange={handleSpecificChange} required placeholder="Your name" /></Field>
                  <Field label="Email" required><input type="email" name="email" value={specific.email} onChange={handleSpecificChange} required placeholder="you@example.com" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Phone / WhatsApp"><input type="tel" name="phone" value={specific.phone} onChange={handleSpecificChange} placeholder="+81 80 0000 0000" /></Field>
                  <Field label="Destination Country" required>
                    <select name="destination" value={specific.destination} onChange={handleSpecificChange} required>
                      <option value="">Select destination</option>
                      {destinations.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Destination Port" hint="Your freight forwarder can confirm the preferred port">
                  <input type="text" name="port" value={specific.port} onChange={handleSpecificChange} placeholder="e.g. JNPT Mumbai, Colombo Port" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Vehicle Make" required><input type="text" name="make" value={specific.make} onChange={handleSpecificChange} required placeholder="e.g. Toyota" /></Field>
                  <Field label="Model" required><input type="text" name="model" value={specific.model} onChange={handleSpecificChange} required placeholder="e.g. Land Cruiser Prado" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Year From"><input type="number" name="yearFrom" value={specific.yearFrom} onChange={handleSpecificChange} placeholder="e.g. 2018" min="1990" max="2026" /></Field>
                  <Field label="Year To"><input type="number" name="yearTo" value={specific.yearTo} onChange={handleSpecificChange} placeholder="e.g. 2023" min="1990" max="2026" /></Field>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <Field label="Body Type">
                    <select name="bodyType" value={specific.bodyType} onChange={handleSpecificChange}>
                      <option value="">Any</option>
                      {bodyTypes.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Fuel">
                    <select name="fuel" value={specific.fuel} onChange={handleSpecificChange}>
                      {fuelOptions.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </Field>
                  <Field label="Steering">
                    <select name="steering" value={specific.steering} onChange={handleSpecificChange}>
                      {steeringOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Max Budget (USD)" hint="Leave blank if flexible">
                  <input type="number" name="budgetUsd" value={specific.budgetUsd} onChange={handleSpecificChange} placeholder="e.g. 25000" min="0" />
                </Field>
                <Field label="Specific Requirements / Notes">
                  <textarea name="notes" value={specific.notes} onChange={handleSpecificChange} rows={4} placeholder="Grade preference, mileage limit, colour, right-hand drive requirement, etc." className="resize-none" />
                </Field>
                {status === 'error' && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{errorMsg}</p>}
                <SubmitBtn label="Submit Request" sending={status === 'sending'} />
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="_honey" value={general._honey} onChange={handleGeneralChange} className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required><input type="text" name="name" value={general.name} onChange={handleGeneralChange} required placeholder="Your name" /></Field>
                  <Field label="Email" required><input type="email" name="email" value={general.email} onChange={handleGeneralChange} required placeholder="you@example.com" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Phone / WhatsApp"><input type="tel" name="phone" value={general.phone} onChange={handleGeneralChange} placeholder="+81 80 0000 0000" /></Field>
                  <Field label="Destination Country" required>
                    <select name="destination" value={general.destination} onChange={handleGeneralChange} required>
                      <option value="">Select destination</option>
                      {destinations.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Budget Range">
                  <select name="budgetRange" value={general.budgetRange} onChange={handleGeneralChange}>
                    <option value="">Select range</option>
                    {budgetRanges.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Categories of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat} type="button" onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition ${
                          general.categories.includes(cat)
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-orange-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Message / Additional Details">
                  <textarea name="message" value={general.message} onChange={handleGeneralChange} rows={4} placeholder="Tell us more about what you're looking for..." className="resize-none" />
                </Field>
                {status === 'error' && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{errorMsg}</p>}
                <SubmitBtn label="Submit Inquiry" sending={status === 'sending'} />
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">How sourcing works</h3>
              <ul className="space-y-4">
                {[
                  { icon: <Search className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />, text: 'We search auction records and dealer stock matching your specification — make, model, year, grade and condition.' },
                  { icon: <FileText className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />, text: 'We provide a preliminary price range and availability estimate. No commitment required at this stage.' },
                  { icon: <Package className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />, text: 'You receive a formal proforma invoice before committing to purchase. Inspection and shipping are arranged after deposit confirmation.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    {item.icon} {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <p className="text-sm text-orange-900 font-medium mb-1">Already see a vehicle you like?</p>
              <p className="text-xs text-orange-700 mb-3">Use the quote button on any vehicle detail page to request a destination-specific proforma.</p>
              <Link href="/vehicles" className="inline-flex items-center gap-1 text-orange-700 text-sm font-semibold hover:underline">
                Browse stock <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              We respond within one business day. By submitting this form you agree to our{' '}
              <Link href="/privacy" className="underline hover:text-orange-600">privacy policy</Link>.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

// Helper components
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactElement;
}) {
  const inputClass = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white";
  const child = React.cloneElement(children, {
    className: (children.props.className || '') + ' ' + inputClass,
  });
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {child}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function SubmitBtn({ label, sending }: { label: string; sending: boolean }) {
  return (
    <button
      type="submit" disabled={sending}
      className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
    >
      {sending ? 'Sending…' : label}
    </button>
  );
}
