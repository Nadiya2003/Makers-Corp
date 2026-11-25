import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Search, FileText, Globe, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — Makers Corp Japan',
  description:
    'Makers Corp Japan is a vehicle export specialist connecting international buyers to genuine vehicles sourced from Japan. Pre-export inspection, transparent documentation.',
};

const markets = [
  { name: 'India', slug: '/destinations/asia/india', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Sri Lanka', slug: '/destinations/asia/sri-lanka', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Kenya', slug: '/destinations/africa', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Tanzania', slug: '/destinations/africa', status: 'Active', badge: 'bg-green-100 text-green-800' },
  { name: 'Pakistan', slug: '/destinations/asia/pakistan', status: 'Inquiry Only', badge: 'bg-amber-100 text-amber-800' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ff8a33] text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Makers Corp Japan
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            A vehicle export specialist connecting international buyers to genuine stock sourced from Japan.
            We handle sourcing, inspection and shipping documentation — you handle clearance at your end.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-10 text-center">Our Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Transparent Sourcing',
                body: 'Every vehicle in our catalog is a real unit with a stock reference. We identify the source, grade, and condition before listing. We do not inflate specifications or availability.',
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Independent Inspection',
                body: 'Pre-export inspection is carried out by recognized third-party agencies — JEVIC, JAAI, QISJ, KEBS or TBS — depending on your destination. The report ships with the vehicle.',
              },
              {
                icon: <FileText className="w-7 h-7 text-[#ff6a00]" />,
                title: 'Honest Documentation',
                body: 'Proforma invoices clearly state what is included (FOB or CIF) and what is excluded (duties, local taxes, registration). We do not issue documents that misrepresent the transaction.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-neutral-200 rounded-none p-6">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#111111] text-lg mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we source */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-5">How We Source Vehicles</h2>
            <div className="space-y-5">
              {[
                {
                  step: '01',
                  title: 'Auction Procurement',
                  body: 'Japan operates the world\'s most transparent vehicle auction network. We access auction grades, inspection sheets and history records before any unit is offered.',
                },
                {
                  step: '02',
                  title: 'Dealer & Trade Networks',
                  body: 'Direct relationships with Japanese dealers give us access to stock not on the public auction floor, including de-registered fleet units, low-mileage trade-ins, and specification-specific searches.',
                },
                {
                  step: '03',
                  title: 'Destination-Specific Review',
                  body: 'Before offering a vehicle to a specific market, we review whether the specification — engine size, steering, emissions rating — is consistent with that country\'s import patterns. This review is logged and time-stamped.',
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-none bg-[#ff6a00] text-white text-sm font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-semibold text-[#111111] mb-1">{s.title}</p>
                    <p className="text-neutral-600 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-none p-8">
            <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#ff6a00]" /> Inspection Agencies We Work With
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              {[
                { name: 'JEVIC', desc: 'Japan Export Vehicle Inspection Centre — widely recognized in Asia and Africa' },
                { name: 'JAAI', desc: 'Japan Auto Appraisal Institute — accepted in India and select Asian markets' },
                { name: 'QISJ', desc: 'Quality Inspection Services Japan — accepted in some African markets' },
                { name: 'KEBS', desc: 'Kenya Bureau of Standards pre-export inspection (required for Kenya)' },
                { name: 'TBS', desc: 'Tanzania Bureau of Standards pre-export inspection (required for Tanzania)' },
              ].map((a) => (
                <li key={a.name} className="flex gap-3">
                  <span className="font-semibold text-[#ff6a00] w-12 flex-shrink-0">{a.name}</span>
                  <span className="text-neutral-500">{a.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#111111]">Our Active Markets</h2>
            <Link href="/destinations" className="text-[#ff6a00] font-medium text-sm hover:underline flex items-center gap-1">
              <Globe className="w-4 h-4" /> All Destinations
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {markets.map((m) => (
              <Link
                key={m.name}
                href={m.slug}
                className="border border-neutral-200 rounded-none p-4 hover:border-[#ffba85] hover:shadow-sm transition group"
              >
                <p className="font-semibold text-[#111111] group-hover:text-[#ff6a00] mb-2">{m.name}</p>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-none ${m.badge}`}>
                  {m.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact summary */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-neutral-200 rounded-none p-6">
            <h3 className="font-semibold text-[#111111] text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ff6a00]" /> Tokyo Export Hub
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href="mailto:export@makerscorpjapan.com" className="hover:text-[#ff6a00] transition">
                  export@makerscorpjapan.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-500 italic text-xs">WhatsApp number — confirm before publishing</span>
              </li>
            </ul>
          </div>
          <div className="bg-white border border-neutral-200 rounded-none p-6">
            <h3 className="font-semibold text-[#111111] text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ff6a00]" /> Sri Lanka Liaison — Makers Ceylon
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li>Operated by Makers Ceylon (the Sri Lanka entity)</li>
              <li>Handles Sri Lanka CIF quotations, CPTAD clearance support, and local delivery coordination</li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href="mailto:export@makerscorpjapan.com" className="hover:text-[#ff6a00] transition">
                  export@makerscorpjapan.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white font-semibold px-6 py-3 rounded-none transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Legal notice */}
      <section className="py-10 px-4 bg-[#111111]">
        <div className="max-w-4xl mx-auto flex items-start gap-3 text-neutral-400 text-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-neutral-300">Registered entity notice:</strong> Makers Corp Japan is a trading name
            pending formal corporate registration. Registered entity details will be published upon confirmation.
            All quotations and export documentation are issued under the verified entity name. For current registered
            details, contact{' '}
            <a href="mailto:export@makerscorpjapan.com" className="text-[#ff8a33] hover:underline">
              export@makerscorpjapan.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
