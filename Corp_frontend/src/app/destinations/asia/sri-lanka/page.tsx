import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketBySlug, vehicles } from '@/data';
import { getReviewState } from '@/data/reviews';
import { DestinationTemplate } from '@/components/destination/DestinationTemplate';

export const metadata: Metadata = {
  title: 'Sri Lanka Vehicle Import Program — Makers Corp Japan',
  description:
    'Established Japan vehicle sourcing with Makers Ceylon Colombo liaison desk. Bank LC support, mandatory JEVIC pre-export inspection, and Colombo sea port delivery. Genuine physical stock.'
};

export default function SriLankaDestinationPage() {
  const market = getMarketBySlug('sri-lanka');
  if (!market) notFound();

  // All vehicles reviewed for quotation into Sri Lanka
  const reviewedVehicles = vehicles.filter((v) => {
    const state = getReviewState(v.stockId, 'sri-lanka');
    return state === 'reviewed_for_quotation';
  });

  const faqs = [
    {
      question: 'How are payments processed from Sri Lanka for Japan vehicle imports?',
      answer:
        'Orders are primarily processed through commercial bank Letters of Credit (LC) opened via verified commercial banks in Sri Lanka (e.g. Commercial Bank, Sampath Bank, Hatton National Bank). Our Colombo liaison desk assists with proforma invoice terms aligned with Central Bank of Sri Lanka (CBSL) regulations.'
    },
    {
      question: 'What is the JEVIC pre-shipment inspection requirement?',
      answer:
        'Sri Lanka Customs requires mandatory pre-export roadworthiness, structural integrity, and genuine mileage certification issued by JEVIC (Japan Export Vehicle Inspection Center) or JAAI. Every vehicle shipped by Makers Corp Japan undergoes this inspection before vessel loading.'
    },
    {
      question: 'What do the indicative LKR prices displayed on listings represent?',
      answer:
        'Indicative LKR figures represent estimated landed market valuations in Sri Lanka based on active customs tariffs, CIF ocean freight, and prevailing market transactions. The contractual invoice is issued in base FOB (Japan) or CIF (Colombo) USD in strict accordance with Incoterms 2020.'
    },
    {
      question: 'What local services are provided in Sri Lanka?',
      answer:
        'Through our dedicated Colombo liaison office at 123 Import Avenue, Colombo 03 (+94 77 123 4567), buyers receive in-person documentation support, bank LC coordination, port wharf clearance assistance at Colombo Port, and secured car-carrier transport islandwide.'
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
