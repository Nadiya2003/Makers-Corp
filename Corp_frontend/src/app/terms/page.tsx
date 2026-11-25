import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Trade — Makers Corp Japan',
  description:
    'Terms of trade for vehicle export quotations, proforma invoices, and purchase transactions — Makers Corp Japan.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Terms of Trade</h1>
        <p className="text-sm text-neutral-500 mb-10">Last updated: November 2026</p>

        <p className="text-neutral-700 mb-10">
          These terms apply to vehicle export quotations, proforma invoices, and purchase
          transactions facilitated by Makers Corp Japan.
        </p>

        {/* Section 1 — Price Basis and Definitions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">1. Price Basis and Definitions</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">FOB — Free on Board</h3>
              <p className="text-neutral-700">
                Price covers the vehicle to the port of loading in Japan. Does not include ocean
                freight, marine insurance, or destination charges.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">CIF — Cost, Insurance, Freight</h3>
              <p className="text-neutral-700">
                Price covers the vehicle, ocean freight, and marine insurance to the named
                destination port. CIF is a destination-specific calculation — quotes are not
                transferable between ports.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">QOR — Quote on Request</h3>
              <p className="text-neutral-700">
                Price available on application. Requires destination and port confirmation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — Exclusions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">2. Exclusions from All Quotes</h2>
          <p className="text-neutral-700 mb-3">
            The following are always excluded from any quotation issued by Makers Corp Japan:
          </p>
          <ul className="list-disc list-inside text-neutral-700 space-y-2">
            <li>Import duties and customs taxes</li>
            <li>VAT, GST, or equivalent consumption taxes</li>
            <li>Local registration fees</li>
            <li>Port handling at the destination</li>
            <li>Inland transport at the destination</li>
            <li>Local compliance modifications</li>
            <li>Any charges levied by destination country authorities</li>
          </ul>
        </section>

        {/* Section 3 — Destination Review Disclaimer */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">3. Destination Review Disclaimer</h2>
          <p className="text-neutral-700">
            A vehicle marked <strong>&quot;Reviewed for Quotation&quot;</strong> for a specific
            market means Makers Corp Japan has assessed that the vehicle specification is consistent
            with common import patterns for that market at the time of review. It is not a guarantee
            of customs clearance, compliance approval, or eligibility under any specific regulation.
            Import conditions change. Buyers are advised to confirm clearance requirements with a
            licensed customs agent in the destination country before committing to purchase.
          </p>
        </section>

        {/* Section 4 — Exchange Rate Disclaimer */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">4. Exchange Rate Disclaimer</h2>
          <p className="text-neutral-700">
            Prices in JPY, INR, LKR or other currencies shown on the website are calculated using
            indicative exchange rates and are for reference only. All transactions are confirmed in
            USD unless otherwise stated in the proforma invoice.
          </p>
        </section>

        {/* Section 5 — Deposits and Cancellation */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">5. Deposits and Cancellation</h2>
          <p className="text-neutral-700">
            Deposits are confirmed per transaction in the proforma invoice. Deposits are
            non-refundable once a pre-export inspection has been booked. Cancellation terms are
            stated in the proforma invoice.
          </p>
        </section>

        {/* Section 6 — Inspection and Grading */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">6. Inspection and Grading</h2>
          <p className="text-neutral-700">
            Pre-export inspection is conducted by an independent third-party agency (JEVIC, JAAI,
            QISJ, KEBS, TBS, or equivalent as required by the destination country). Makers Corp
            Japan does not control the grading outcome. Inspection reports are provided as-issued.
          </p>
        </section>

        {/* Section 7 — Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">7. Limitation of Liability</h2>
          <p className="text-neutral-700">
            Makers Corp Japan is not liable for delays caused by vessel schedules, port congestion,
            customs examination, or regulatory changes at the destination. We are not liable for the
            accuracy of local duty or tax estimates.
          </p>
        </section>

        {/* Section 8 — Registered Entity Notice */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">8. Registered Entity Notice</h2>
          <p className="text-neutral-700">
            Makers Corp Japan is a trading name pending formal corporate registration. All invoices
            and legal documents are issued under the verified registered entity name, which will be
            communicated at the time of transaction.
          </p>
        </section>

        {/* Section 9 — Governing Law */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">9. Governing Law</h2>
          <p className="text-neutral-700">
            Governing law is to be confirmed upon formal registration. Disputes will be referred to
            the jurisdiction of the registered entity.
          </p>
        </section>

        {/* Section 10 — Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">10. Contact</h2>
          <p className="text-neutral-700">
            For questions about these terms, contact us at{' '}
            <a
              href="mailto:export@makerscorpjapan.com"
              className="text-[#ff6a00] hover:underline"
            >
              export@makerscorpjapan.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
