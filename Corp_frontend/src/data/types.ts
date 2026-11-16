export type AvailabilityStatus = 'Available' | 'Reserved' | 'Sold';

export type SourceType = 'Confirmed Makers Inventory' | 'Partner Stock' | 'Auction Sourcing Offer';

export type BodyType =
  | 'SUVs & 4x4'
  | 'Sedans & Hatchbacks'
  | 'Vans & MPVs'
  | 'Trucks & Commercial'
  | 'Luxury & Performance'
  | 'Kei Cars';

export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid';

export type TransmissionType = 'Automatic' | 'Manual' | 'Dual-Clutch' | 'CVT';

export type SteeringType = 'RHD' | 'LHD';

export type ReviewState = 'reviewed_for_quotation' | 'import_check_required' | 'not_offered';

export type PriceBasis = 'FOB' | 'CIF' | 'QUOTE_ONLY';

export interface Vehicle {
  id: string;
  stockId: string; // e.g. "MCJ-2024-8801"
  slug: string;
  make: string;
  model: string;
  grade: string;
  modelCode: string;
  year: number;
  firstRegistrationDate: string; // "YYYY/MM"
  mileageKm: number;
  fuel: FuelType;
  transmission: TransmissionType;
  engineCc: number;
  drivetrain: '2WD' | '4WD' | 'AWD';
  steering: SteeringType;
  bodyType: BodyType;
  seats: number;
  color: string;
  conditionGrade: string; // e.g. "5.0/A"
  inspectionStatus: string; // e.g. "JEVIC Inspected", "Makers Certified 150-Point"
  auctionSheetUrl?: string;
  sourceType: SourceType;
  availability: AvailabilityStatus;
  lastAvailabilityCheck: string; // ISO date
  priceFOB: {
    amount: number;
    currency: 'USD';
    port: string;
  };
  referencePriceLKR?: {
    minLKR: number;
    maxLKR: number;
    label: string;
  };
  images: string[];
  keyFeatures: string[];
  overview: string;
  isFeatured?: boolean;
}

export interface SupportedPort {
  id: string;
  name: string;
  transitDays: string;
  oceanFreightUSD: number;
  isPrimary?: boolean;
}

export interface ApprovedContact {
  title: string;
  phone: string;
  email: string;
  whatsapp: string;
  address?: string;
  workingHours?: string;
}

export interface DestinationGuidance {
  summary: string;
  regulatoryNotes: string[];
  maxVehicleAgeYears?: number;
  steeringsPermitted: SteeringType[];
  importDutiesSummary?: string;
  clearanceNotice: string;
}

export interface Market {
  isoCode: string;
  slug: string;
  name: string;
  region: 'Asia' | 'Africa';
  publishState: 'active' | 'inquiry_only' | 'unpublished';
  defaultCurrency: 'USD' | 'JPY' | 'INR' | 'LKR';
  supportedPorts: SupportedPort[];
  approvedContact: ApprovedContact;
  guidance: DestinationGuidance;
  campaignHeroSubtitle?: string;
  verifiedLocalServices?: string[];
}

export interface VehicleMarketReview {
  stockId: string;
  marketSlug: string;
  reviewState: ReviewState;
  reviewer: string;
  reviewDate: string;
  validUntil: string;
  regulatoryNotes: string;
  targetPorts?: string[];
}

export interface VehicleOffer {
  stockId: string;
  marketSlug: string;
  portId?: string;
  priceBasis: PriceBasis;
  amount: number;
  currency: 'USD' | 'JPY' | 'INR' | 'LKR';
  validUntil: string;
  inclusions: string[];
  exclusions: string[];
}

export interface LeadSubmission {
  sourceRoute: string;
  stockId?: string;
  vehicleTitle?: string;
  destination: string;
  port?: string;
  buyerType: 'Individual' | 'Dealer / Importer';
  name: string;
  contactMethod: 'WhatsApp' | 'Email' | 'Phone';
  phone?: string;
  email?: string;
  notes?: string;
  budget?: string;
  leadType: 'stock_quote' | 'import_check' | 'vehicle_sourcing';
}
