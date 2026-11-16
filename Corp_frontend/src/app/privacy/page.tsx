import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Makers Corp Japan',
  description: 'Privacy policy for Makers Corp Japan vehicle export marketplace.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: November 2026</p>

        <p className="text-slate-700 mb-10">
          This policy describes how Makers Corp Japan collects and uses information when you use our website.
        </p>

        {/* Section 1 — Information We Collect */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-slate-800 mb-1">Contact Form Submissions</h3>
              <p className="text-slate-700">
                When you submit an inquiry form we collect your name, email address, phone number,
                destination preference, and vehicle requirements. This information is used solely to
                respond to your inquiry.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-slate-800 mb-1">Cookies</h3>
              <p className="text-slate-700">
                We use session and analytics cookies. We do not sell cookie data. You can disable
                non-essential cookies in your browser settings.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-slate-800 mb-1">WhatsApp</h3>
              <p className="text-slate-700">
                Clicking a WhatsApp link on our website opens the WhatsApp application on your
                device. We do not receive or store WhatsApp message content on our servers.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-slate-800 mb-1">Inquiry Reference Numbers</h3>
              <p className="text-slate-700">
                Randomly generated identifiers are stored temporarily server-side to track inquiry
                routing. These are not linked to your personal browsing history.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — How We Use It */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>To respond to your inquiries</li>
            <li>To provide vehicle export quotations</li>
            <li>To route your inquiry to the correct regional desk</li>
            <li>To improve our website</li>
          </ul>
        </section>

        {/* Section 3 — Who We Share It With */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Who We Share Your Information With</h2>
          <p className="text-slate-700 mb-3">
            We share your information with regional desk partners — India Desk, Sri Lanka
            Liaison&nbsp;/&nbsp;Makers Ceylon, and Africa Trade Desk — for the purpose of responding
            to your inquiry. We do not sell your data to third parties.
          </p>
        </section>

        {/* Section 4 — Data Retention */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Data Retention</h2>
          <p className="text-slate-700">
            Inquiry data is retained for up to 2 years for transaction record purposes. You may
            request deletion by emailing{' '}
            <a
              href="mailto:export@makerscorpjapan.com"
              className="text-orange-600 hover:underline"
            >
              export@makerscorpjapan.com
            </a>
            .
          </p>
        </section>

        {/* Section 5 — Your Rights */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
          <p className="text-slate-700">
            You have the right to access, correct, or request deletion of your personal data.
            Contact us at{' '}
            <a
              href="mailto:export@makerscorpjapan.com"
              className="text-orange-600 hover:underline"
            >
              export@makerscorpjapan.com
            </a>{' '}
            to exercise these rights.
          </p>
        </section>

        {/* Section 6 — No Personal Data in URLs */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">6. No Personal Data in URLs</h2>
          <p className="text-slate-700">
            Vehicle detail pages, destination pages, and filter URLs do not contain personal
            identifiers. URL parameters are used only for filtering and navigation.
          </p>
        </section>

        {/* Section 7 — Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Contact</h2>
          <p className="text-slate-700">
            For questions about this privacy policy, contact us at{' '}
            <a
              href="mailto:export@makerscorpjapan.com"
              className="text-orange-600 hover:underline"
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
