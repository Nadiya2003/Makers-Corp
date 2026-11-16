import { VehicleMarketReview, ReviewState } from './types';

export const vehicleMarketReviews: VehicleMarketReview[] = [
  // --- INDIA (IN) REVIEWS ---
  {
    stockId: 'MCJ-2024-8801', // Nissan GT-R NISMO
    marketSlug: 'india',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-10',
    validUntil: '2026-12-10',
    regulatoryNotes:
      'Engine capacity 3,799cc exceeds 3,000cc threshold. Eligible for DGFT direct import route without individual ARAI homologation. RHD verified. Headlamp beam pattern alignment required prior to container departure.',
    targetPorts: ['in-nhava-sheva', 'in-chennai']
  },
  {
    stockId: 'MCJ-2024-8802', // Lexus LX 600
    marketSlug: 'india',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-08',
    validUntil: '2026-12-08',
    regulatoryNotes:
      '3.5L Twin-Turbo petrol. Verified DGFT direct import eligibility. Speedometer in km/h. Clean Japanese de-registration export certificate prepared.',
    targetPorts: ['in-nhava-sheva', 'in-chennai', 'in-mundra']
  },
  {
    stockId: 'MCJ-2024-8803', // Lexus LX 700h
    marketSlug: 'india',
    reviewState: 'import_check_required',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-12',
    validUntil: '2026-11-26',
    regulatoryNotes:
      'New hybrid powertrain architecture requires confirmation of customs tariff heading (870340) and state-specific hybrid rebate qualification before proforma issuance.',
    targetPorts: ['in-nhava-sheva']
  },
  {
    stockId: 'MCJ-2024-8804', // Toyota Hiace
    marketSlug: 'india',
    reviewState: 'import_check_required',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-05',
    validUntil: '2026-11-20',
    regulatoryNotes:
      'Commercial van classification (5-seater Super GL). Entry requires specific commercial importer code or specialized conversion clearance. Individual import check required.',
    targetPorts: ['in-nhava-sheva']
  },
  {
    stockId: 'MCJ-2024-8805', // Land Cruiser 300 ZX
    marketSlug: 'india',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-09',
    validUntil: '2026-12-09',
    regulatoryNotes:
      'Engine capacity 3,444cc exceeds 3.0L direct import limit. RHD compliant. Verified fitment for Nhava Sheva discharge.',
    targetPorts: ['in-nhava-sheva', 'in-chennai', 'in-mundra']
  },
  {
    stockId: 'MCJ-2024-8814', // Mercedes G63 AMG
    marketSlug: 'india',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-11',
    validUntil: '2026-12-11',
    regulatoryNotes:
      '4.0L V8 petrol Japan delivery RHD. FOB exceeds $40,000 threshold. Full compliance for direct import customs entry.',
    targetPorts: ['in-nhava-sheva', 'in-chennai']
  },
  {
    stockId: 'MCJ-2024-8807', // Honda Vezel (1.5L)
    marketSlug: 'india',
    reviewState: 'not_offered',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-01',
    validUntil: '2027-11-01',
    regulatoryNotes:
      'Engine capacity 1,496cc does not meet the >3,000cc DGFT direct import exemption threshold and lacks ARAI type approval. Not offered for standard Indian consumer import.'
  },
  {
    stockId: 'MCJ-2024-8808', // Suzuki Swift (1.2L)
    marketSlug: 'india',
    reviewState: 'not_offered',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-01',
    validUntil: '2027-11-01',
    regulatoryNotes:
      'Engine capacity 1,242cc falls below the non-homologated luxury threshold. Not offered for India.'
  },
  {
    stockId: 'MCJ-2024-8813', // Jimny Sierra (1.5L)
    marketSlug: 'india',
    reviewState: 'not_offered',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-01',
    validUntil: '2027-11-01',
    regulatoryNotes:
      'Sub-3.0L displacement does not meet unrestricted luxury import requirements into India.'
  },

  // --- SRI LANKA (LK) REVIEWS ---
  {
    stockId: 'MCJ-2024-8804', // Toyota Hiace
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-10',
    validUntil: '2026-12-10',
    regulatoryNotes:
      '2021 model within permitted age threshold for commercial dual-purpose vans. JEVIC inspection booked. Eligible for LC opening.',
    targetPorts: ['lk-colombo', 'lk-hambantota']
  },
  {
    stockId: 'MCJ-2024-8805', // Land Cruiser 300 ZX
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-10',
    validUntil: '2026-12-10',
    regulatoryNotes:
      '2022 registration. Eligible for permit / commercial LC import under active Ministry of Finance circulars.',
    targetPorts: ['lk-colombo']
  },
  {
    stockId: 'MCJ-2024-8806', // Prado TX L
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-10',
    validUntil: '2026-12-10',
    regulatoryNotes:
      '2022/04 registration. Fully verified for Colombo sea port clearance with valid JEVIC certification.',
    targetPorts: ['lk-colombo']
  },
  {
    stockId: 'MCJ-2024-8807', // Honda Vezel
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-08',
    validUntil: '2026-12-08',
    regulatoryNotes:
      'High-demand hybrid crossover. Verified age <3 years. Approved for Colombo delivery.',
    targetPorts: ['lk-colombo']
  },
  {
    stockId: 'MCJ-2024-8808', // Suzuki Swift RS
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-08',
    validUntil: '2026-12-08',
    regulatoryNotes:
      'Economical compact hatchback. Verified low mileage and clean JEVIC report.',
    targetPorts: ['lk-colombo']
  },
  {
    stockId: 'MCJ-2024-8810', // Alphard Executive Lounge
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-09',
    validUntil: '2026-12-09',
    regulatoryNotes:
      'VIP luxury MPV. Tourism permit or direct bank LC compliant.',
    targetPorts: ['lk-colombo']
  },
  {
    stockId: 'MCJ-2024-8812', // Hilux GR Sport
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-09',
    validUntil: '2026-12-09',
    regulatoryNotes:
      'Double cab 4WD diesel pickup. Within commercial age guidelines.',
    targetPorts: ['lk-colombo', 'lk-hambantota']
  },
  {
    stockId: 'MCJ-2024-8813', // Jimny Sierra
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-09',
    validUntil: '2026-12-09',
    regulatoryNotes:
      'Compact 4x4. Verified registration and emissions clearance.',
    targetPorts: ['lk-colombo']
  },

  // --- KENYA (KE) REVIEWS ---
  {
    stockId: 'MCJ-2024-8804', // Hiace
    marketSlug: 'kenya',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'D. Ochieng (Nairobi Trade Desk)',
    reviewDate: '2026-11-01',
    validUntil: '2026-12-31',
    regulatoryNotes: '2021 model within 8-year age rule. QISJ certificate required before loading.',
    targetPorts: ['ke-mombasa']
  },
  {
    stockId: 'MCJ-2024-8806', // Prado TX L
    marketSlug: 'kenya',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'D. Ochieng (Nairobi Trade Desk)',
    reviewDate: '2026-11-01',
    validUntil: '2026-12-31',
    regulatoryNotes: '2022 model. High demand in Kenya. QISJ passed.',
    targetPorts: ['ke-mombasa']
  }
];

export function getVehicleReview(stockId: string, marketSlug?: string | null): VehicleMarketReview | undefined {
  if (!stockId || !marketSlug) return undefined;
  return vehicleMarketReviews.find(
    (r) => r.stockId.toLowerCase() === stockId.toLowerCase() && r.marketSlug.toLowerCase() === marketSlug.toLowerCase()
  );
}

export function getReviewState(stockId: string, marketSlug?: string | null): ReviewState {
  if (!marketSlug) return 'reviewed_for_quotation';
  const review = getVehicleReview(stockId, marketSlug);
  if (!review) return 'import_check_required';
  // Check validity date
  const now = new Date().toISOString().split('T')[0];
  if (review.validUntil < now) {
    return 'import_check_required'; // Expired reviews require re-check
  }
  return review.reviewState;
}

export function isVehicleEligibleForMarket(stockId: string, marketSlug?: string | null): boolean {
  if (!marketSlug) return true;
  const state = getReviewState(stockId, marketSlug);
  return state === 'reviewed_for_quotation';
}
