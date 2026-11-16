import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketBySlug, vehicles } from '@/data';
import { getReviewState } from '@/data/reviews';
import { DestinationTemplate } from '@/components/destination/DestinationTemplate';

export const metadata: Metadata = {
  title: 'India Vehicle Import Program — Makers Corp Japan',
  description:
    'Direct Japan vehicle export to India. Verified high-value luxury SUVs, supercars, and commercial transports reviewed under DGFT direct import guidelines. Ports: Nhava Sheva (Mumbai), Chennai, Mundra.'
};

export default function IndiaDestinationPage() {
  const market = getMarketBySlug('india');
  if (!market) notFound();

  // Campaign priority models specified in prompt:
  // Nissan GT-R NISMO, Lexus LX 600, Lexus LX 700h, Toyota Hiace
  const campaignStockIds = ['MCJ-2024-8801', 'MCJ-2024-8802', 'MCJ-2024-8803', 'MCJ-2024-8804'];
  const campaignModels = vehicles.filter((v) => campaignStockIds.includes(v.stockId));

  // Only vehicles with reviewed_for_quotation qualify for the primary destination grid
  const reviewedVehicles = vehicles.filter((v) => {
    const state = getReviewState(v.stockId, 'india');
    return state === 'reviewed_for_quotation';
  });

  const faqs = [
    {
      question: 'Which vehicles can be directly imported into India without individual ARAI homologation?',
      answer:
        'Under Directorate General of Foreign Trade (DGFT) policy, new or pre-owned vehicles with an FOB value of $40,000 USD or more, or engine capacity exceeding 3,000cc (petrol) or 2,500cc (diesel), qualify for direct import without requiring individual ARAI homologation certificates, provided they meet standard RHD and ECE safety conformity.'
    },
    {
      question: 'What are the mandatory specifications for vehicles entering Indian ports?',
      answer:
        'Vehicles must be Right-Hand Drive (RHD), feature speedometers calibrated in km/h, and have headlamp beam patterns suitable for left-hand road traffic. Left-hand drive vehicles are strictly prohibited under Indian Motor Vehicles regulations.'
    },
    {
      question: 'Which discharge ports are supported for container or Ro-Ro shipment?',
      answer:
        'Makers Corp Japan ships primarily to Nhava Sheva (JNPT / Mumbai Port) and Chennai Port. Mundra Port (Gujarat) is also available for containerized shipments. Custom clearances are coordinated with your licensed Customs House Agent (CHA).'
    },
    {
      question: 'What is included in the quoted CIF price?',
      answer:
        'Quoted CIF (Cost, Insurance, Freight) prices cover the vehicle purchase price in Japan, pre-export export certificate documentation, sea freight to Nhava Sheva or Chennai, and comprehensive marine transit insurance. Indian customs duties (100-125% basic duty), IGST (28%), compensation cess, and local RTO registration are settled directly by the importer upon customs assessment.'
    }
  ];

  return (
    <DestinationTemplate
      market={market}
      reviewedVehicles={reviewedVehicles}
      campaignModels={campaignModels}
      faqItems={faqs}
    />
  );
}
