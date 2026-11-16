import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketBySlug, vehicles } from '@/data';
import { getReviewState } from '@/data/reviews';
import { DestinationTemplate } from '@/components/destination/DestinationTemplate';

export const metadata: Metadata = {
  title: 'Pakistan Vehicle Sourcing Desk (Inquiry Only) — Makers Corp Japan',
  description:
    'Next-market Japan vehicle sourcing desk for Pakistan under Personal Baggage, Gift, and Transfer of Residence schemes. Shipping to Karachi Port.'
};

export default function PakistanDestinationPage() {
  const market = getMarketBySlug('pakistan');
  if (!market) notFound();

  // For Pakistan (inquiry only), no units are pre-approved for immediate sale without scheme validation
  const reviewedVehicles: typeof vehicles = [];

  const faqs = [
    {
      question: 'What are the current rules for importing vehicles into Pakistan from Japan?',
      answer:
        'Commercial vehicle imports into Pakistan are strictly restricted under federal trade policy. Vehicle imports are permitted only under three specific schemes for overseas Pakistanis: Personal Baggage, Gift Scheme, and Transfer of Residence (TR), subject to maximum age restrictions (up to 3 years for passenger cars and 5 years for SUVs/4x4).'
    },
    {
      question: 'Why is this route marked as Inquiry Only?',
      answer:
        'Because Pakistani import entitlement depends on individual expatriate passport tenure and bank foreign exchange remittance certification (PRC), Makers Corp Japan does not list generic direct-purchase stock. Every transaction proceeds on a custom made-to-order sourcing basis once eligibility is established.'
    },
    {
      question: 'Which ports handle shipments into Pakistan?',
      answer:
        'Vessels discharge at Karachi Port (KPT) or Port Muhammad Bin Qasim. Shipping documents, de-registration certificates, and Bill of Lading are dispatched via DHL to the importer or designated customs clearing agent in Karachi.'
    }
  ];

  return (
    <DestinationTemplate
      market={market}
      reviewedVehicles={reviewedVehicles}
      faqItems={faqs}
    />
  );
}
