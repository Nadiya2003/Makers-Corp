import { VehicleMarketReview, ReviewState } from './types';

export const vehicleMarketReviews: VehicleMarketReview[] = [
  // --- SRI LANKA (LK) REVIEWS ---
  {
    stockId: 'MCJ-2026-8901', // Toyota Raize Z Package 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Colombo Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '2026 brand new registration. 1.0L Turbo compact SUV. JEVIC inspected. Eligible for commercial LC opening.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8902', // Honda N-BOX Custom 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '2026 Kei car. 660cc petrol. Eligible for standard automotive import quota.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8903', // Suzuki Wagon R Custom Z Hybrid 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '2026 hybrid hatchback. Only 10 km mileage. Fully compliant with CBSL LC clearance regulations.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8904', // Toyota Raize Hybrid Z 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '1.2L Series Hybrid compact SUV. High fuel efficiency. Verified for Colombo discharge.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8905', // Toyota Roomy 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '1.0L compact MPV with sliding doors. Ideal family transport. Clean JEVIC pre-export certificate.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8906', // Toyota Alphard Executive Lounge 2026
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: 'Flagship executive luxury MPV. 43 km delivery condition. Tourism permit or direct bank LC compliant.',
    targetPorts: ['lk-hambantota']
  },
  {
    stockId: 'MCJ-2026-8907', // Mitsubishi Delica D:2 Hybrid 2024
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '1.2L Hybrid MPV. 19,945 km verified mileage. Valid Japanese Shaken inspection documentation.',
    targetPorts: ['lk-Hambantota']
  },
  {
    stockId: 'MCJ-2026-8908', // Daihatsu Move G Two-Tone 2025
    marketSlug: 'sri-lanka',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'S. Perera (Hambantota Operations Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '2025 Move G. 20 km near-new condition. Certified accident-free with valid Shaken.',
    targetPorts: ['lk-Hambantota']
  },

  // --- INDIA (IN) REVIEWS ---
  {
    stockId: 'MCJ-2026-8906', // Toyota Alphard Executive Lounge
    marketSlug: 'india',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'T. Kenji (Senior Homologation Specialist, Tokyo)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '2.48L Executive Lounge MPV. Premium grade. Eligible for direct import route and corporate fleet clearance.',
    targetPorts: ['in-nhava-sheva', 'in-chennai']
  },
  {
    stockId: 'MCJ-2026-8901', // Toyota Raize
    marketSlug: 'india',
    reviewState: 'import_check_required',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: 'Sub-3.0L displacement. Import requires individual embassy or specialized diplomatic transfer clearance.',
    targetPorts: ['in-nhava-sheva']
  },
  {
    stockId: 'MCJ-2026-8904', // Toyota Raize Hybrid
    marketSlug: 'india',
    reviewState: 'import_check_required',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: 'Series hybrid system. Specific customs tariff heading verification needed before proforma.',
    targetPorts: ['in-nhava-sheva']
  },
  {
    stockId: 'MCJ-2026-8902', // Honda N-BOX
    marketSlug: 'india',
    reviewState: 'not_offered',
    reviewer: 'M. Sharma (India Compliance Liaison)',
    reviewDate: '2026-11-20',
    validUntil: '2027-11-20',
    regulatoryNotes: '660cc Kei car falls below non-homologated direct import threshold into India.'
  },

  // --- KENYA (KE) REVIEWS ---
  {
    stockId: 'MCJ-2026-8901', // Toyota Raize Z
    marketSlug: 'kenya',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'D. Ochieng (Nairobi Trade Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-12-31',
    regulatoryNotes: '2026 model well within 8-year age rule. QISJ certificate required before vessel departure.',
    targetPorts: ['ke-mombasa']
  },
  {
    stockId: 'MCJ-2026-8906', // Toyota Alphard Executive Lounge
    marketSlug: 'kenya',
    reviewState: 'reviewed_for_quotation',
    reviewer: 'D. Ochieng (Nairobi Trade Desk)',
    reviewDate: '2026-11-20',
    validUntil: '2027-12-31',
    regulatoryNotes: 'High-end VIP transport. QISJ passed. Compliant with KEBS guidelines.',
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
  const now = new Date().toISOString().split('T')[0];
  if (review.validUntil < now) {
    return 'import_check_required';
  }
  return review.reviewState;
}

export function isVehicleEligibleForMarket(stockId: string, marketSlug?: string | null): boolean {
  if (!marketSlug) return true;
  const state = getReviewState(stockId, marketSlug);
  return state === 'reviewed_for_quotation';
}
