'use client';

import { useState, useId } from 'react';

const DESTINATION_OPTIONS = [
  'Global',
  'India',
  'Sri Lanka',
  'Kenya',
  'Tanzania',
  'Pakistan',
  'Other',
];

const INQUIRY_TYPES = [
  'Stock Inquiry',
  'Get a Quote',
  'Request a Vehicle',
  'General',
];

function generateRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'MCJ-';
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const formId = useId();
  const [state, setState] = useState<FormState>('idle');
  const [refNum, setRefNum] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check (client-side mirror; server should also check)
    if (data.get('website')) {
      setState('idle');
      return;
    }

    const payload = {
      fullName: data.get('fullName'),
      email: data.get('email'),
      phone: data.get('phone'),
      destination: data.get('destination'),
      inquiryType: data.get('inquiryType'),
      message: data.get('message'),
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const ref = generateRef();
        setRefNum(ref);
        setState('success');
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(
          body?.message ?? 'Something went wrong. Please try again or email us directly.'
        );
        setState('error');
      }
    } catch {
      setErrorMsg(
        'Could not reach the server. Please try again or email export@makerscorpjapan.com directly.'
      );
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Inquiry Received
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          We aim to respond within one business day. For urgent inquiries,
          WhatsApp is fastest.
        </p>
        <p className="text-xs text-slate-500">
          Reference number:{' '}
          <span className="font-mono font-semibold text-slate-700">{refNum}</span>
        </p>
        <button
          onClick={() => setState('idle')}
          className="mt-5 text-sm text-orange-600 hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
        autoComplete="off"
      />

      {/* Full Name */}
      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${formId}-email`} className={labelClass}>
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor={`${formId}-phone`} className={labelClass}>
          Phone / WhatsApp{' '}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 234 567 8900"
          className={inputClass}
        />
      </div>

      {/* Destination */}
      <div>
        <label htmlFor={`${formId}-destination`} className={labelClass}>
          Destination Country
        </label>
        <select
          id={`${formId}-destination`}
          name="destination"
          className={inputClass}
          defaultValue="Global"
        >
          {DESTINATION_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Inquiry Type */}
      <div>
        <label htmlFor={`${formId}-type`} className={labelClass}>
          Inquiry Type
        </label>
        <select
          id={`${formId}-type`}
          name="inquiryType"
          className={inputClass}
          defaultValue="Stock Inquiry"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${formId}-message`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          placeholder="Tell us what you are looking for — make, model, year range, destination port, budget, or any other details."
          className={`${inputClass} resize-y`}
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Inquiry'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        We aim to respond within one business day. For urgent inquiries,
        WhatsApp is fastest.
      </p>
    </form>
  );
}
