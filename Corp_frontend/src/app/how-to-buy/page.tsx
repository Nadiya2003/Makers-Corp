import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search, MapPin, FileText, ShieldCheck, Ship, Package,
  CreditCard, HelpCircle, ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Buy — Vehicle Export Process | Makers Corp Japan',
  description:
    'Step-by-step guide to importing a vehicle from Japan. Browse stock, request a proforma invoice, pre-export inspection, ocean freight and document delivery.',
};

const steps = [
  {
    num: '01',
    title: 'Browse & Shortlist',
    body: 'Use the catalog to find vehicles. Filter by destination, body type, year range, fuel and budget. Save the stock ID of any unit you are interested in — you will need it for the quote request.',
    tip: 'Use the destination filter to see only vehicles reviewed for your market.',
  },
  {
    num: '02',
    title: 'Destination Check',
    body: 'Select your destination country on the vehicle detail page. The page shows whether that vehicle has been reviewed for your market. For units marked "Import Check Required", we conduct a review and report back — typically within one business day.',
    tip: 'Review status is vehicle-specific. A vehicle reviewed for India is not automatically reviewed for Sri Lanka.',
  },
  {
    num: '03',
    title: 'Request a Proforma Invoice',
    body: 'Submit a quote request for your shortlisted vehicle(s). We provide an itemised proforma covering the FOB Japan price, ocean freight estimate, and marine insurance. The CIF total is to your nominated destination port.',
    tip: 'Import duties, VAT, local taxes and registration fees are always excluded. Your customs agent calculates those.',
  },
  {
    num: '04',
    title: 'Pre-Export Inspection',
    body: 'Before shipment, vehicles are inspected by an independent agency. The required agency depends on your destination country (see table below). The inspection report and grading sheet are couriered with the vehicle documents.',
    tip: 'Inspection bookings are made once your deposit is confirmed. The inspection result is as-issued — we do not control grading outcomes.',
  },
  {
    num: '05',
    title: 'Ocean Freight & Tracking',
    body: 'We coordinate with RoRo or container carriers. You receive a Bill of Lading and tracking reference once the vessel departs. Transit times: India and Sri Lanka 10–18 days; East Africa 20–28 days. Confirm current estimates with your clearing agent.',
    tip: 'RoRo (Roll-on Roll-off) is standard for most markets. Container shipping is available on request.',
  },
  {
    num: '06',
    title: 'Document Delivery & Clearance',
    body: 'We courier original export documents to you or your nominated agent: title/deregistration certificate, Bill of Lading, inspection certificate, and commercial invoice. Your local customs agent handles clearance. We provide document support throughout.',
    tip: 'Allow 3–5 working days for document courier to reach your agent after the vessel departs.',
  },
];

const inspectionTable = [
  { market: 'India', agency: 'JAAI or JEVIC', note: 'Confirm with India Desk at time of quote' },
  { market: 'Sri Lanka', agency: 'JEVIC (preferred)', note: 'JAAI also accepted' },
  { market: 'Kenya', agency: 'KEBS + JEVIC / QISJ', note: 'KEBS pre-export inspection is mandatory' },
  { market: 'Tanzania', agency: 'TBS + JEVIC / QISJ', note: 'TBS pre-export inspection is mandatory' },
  { market: 'Other markets', agency: 'Confirm with export desk', note: 'Requirements vary by country' },
];

const faqs = [
  {
    q: 'Can I request a vehicle not in stock?',
    a: "Yes. Use the Request a Vehicle form to submit your requirements — make, model, year range, budget and destination. We search Japan's auction network and dealer connections and report back with availability and preliminary pricing.",
  },
  {
    q: 'Are prices FOB or CIF?',
    a: 'Listed prices are FOB (Free on Board) Japan — covering the vehicle to the port of loading. CIF quotes (freight and insurance included to your destination port) are provided per request. Duties and local taxes are always excluded from both.',
  },
  {
    q: 'How long does the whole process take?',
    a: 'From proforma approval and deposit to arrival at your destination port: typically 6–10 weeks, depending on payment confirmation, inspection scheduling and vessel availability. Transit alone is 10–28 days depending on destination.',
  },
  {
    q: 'Is a deposit refundable?',
    a: 'Deposits are non-refundable once a pre-export inspection has been booked. The specific deposit amount and terms are stated in your proforma invoice before you commit.',
  },
  {
    q: 'Do you ship to a country not listed?',
    a: 'Contact the export desk. We evaluate new markets on request. If a market has an established import process and a recognized pre-export inspection requirement, we can usually accommodate it.',
  },
];

export default function HowToBuyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ff8a33] text-sm font-semibold uppercase tracking-widest mb-3">Export Process</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">How Vehicle Export Works</h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            From Japan to your destination: a clear, documented process. No hidden steps, no surprises on duties.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-10">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-none bg-[#ff6a00] text-white flex items-center justify-center font-bold text-lg shadow-md">
                {step.num}
              </div>
              <div className={`flex-1 ${i < steps.length - 1 ? 'border-b border-neutral-100 pb-10' : ''}`}>
                <h2 className="text-xl font-bold text-[#111111] mb-2">{step.title}</h2>
                <p className="text-neutral-600 leading-relaxed mb-3">{step.body}</p>
                <div className="bg-[#fff4eb] border border-[#ffd1ad] rounded-none px-4 py-2 text-sm text-[#cc5500]">
                  <strong>Note:</strong> {step.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment + Inspection table */}
      <section className="py-14 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-5 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#ff6a00]" /> Payment
            </h2>
            <ul className="space-y-4 text-neutral-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#ff6a00] font-bold mt-0.5">→</span>
                <span><strong>Telegraphic Transfer (TT / Wire)</strong> — standard for all transactions. Bank details provided in the proforma invoice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6a00] font-bold mt-0.5">→</span>
                <span><strong>Letter of Credit (LC)</strong> — available for large or fleet orders. Confirm with the export desk at quote stage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6a00] font-bold mt-0.5">→</span>
                <span><strong>Deposit structure:</strong> typically 30% to hold the vehicle and book inspection; balance payable before shipment. Exact terms stated in proforma invoice.</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-5 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#ff6a00]" /> Inspection by Destination
            </h2>
            <div className="rounded-none border border-neutral-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-neutral-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Market</th>
                    <th className="text-left px-4 py-3 font-semibold">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {inspectionTable.map((row) => (
                    <tr key={row.market} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-[#111111]">{row.market}</td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-700">{row.agency}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{row.note}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-8 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#ff6a00]" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-neutral-100 pb-6">
                <h3 className="font-semibold text-[#111111] mb-2">{faq.q}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-neutral-400 mb-8">Browse available stock or tell us what you need.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vehicles"
              className="bg-[#ff6a00] hover:bg-[#e55f00] text-white font-semibold px-8 py-3 rounded-none transition flex items-center justify-center gap-2"
            >
              Browse Vehicles <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/request-a-vehicle"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-none transition flex items-center justify-center gap-2"
            >
              Request a Vehicle
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
