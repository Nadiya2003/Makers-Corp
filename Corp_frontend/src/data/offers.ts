import { VehicleOffer, PriceBasis } from './types';
import { vehicles } from './vehicles';

export const vehicleOffers: VehicleOffer[] = [
  // --- SRI LANKA OFFERS (CIF Colombo / Hambantota) ---
  {
    stockId: 'MCJ-2026-8901', // Toyota Raize Z Package 2026
    marketSlug: 'sri-lanka',
    portId: 'lk-hambantota',
    priceBasis: 'QUOTE_ONLY',
    amount: 39000 - 42000,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase price in Japan yard',
      'Japanese export certificate & de-registration',
      'JEVIC roadworthiness pre-shipment inspection'
    ],
    exclusions: [
      'Ocean freight & transit insurance (quoted upon LC terms)',
      'Sri Lanka Customs import duty, excise tax & VAT (settled at Colombo Port)',
      'Port clearance and local landing delivery'
    ]
  },
  {
    stockId: 'MCJ-2026-8902', // Honda N-BOX Custom 2026
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Japanese export de-registration',
      'JEVIC inspection certificate'
    ],
    exclusions: [
      'Ocean freight to Colombo',
      'Sri Lanka customs clearing & local registration'
    ]
  },
  {
    stockId: 'MCJ-2026-8903', // Suzuki Wagon R Hybrid
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Japanese export de-registration',
      'JEVIC inspection'
    ],
    exclusions: [
      'Ocean freight to Colombo',
      'Sri Lanka customs clearing'
    ]
  },
  {
    stockId: 'MCJ-2026-8904', // Toyota Raize Hybrid Z
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Japanese export documentation',
      'JEVIC inspection'
    ],
    exclusions: [
      'Ocean freight & insurance',
      'Sri Lanka customs taxes'
    ]
  },
  {
    stockId: 'MCJ-2026-8905', // Toyota Roomy 2026
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Export certificate',
      'JEVIC inspection'
    ],
    exclusions: [
      'Freight & local duties'
    ]
  },
  {
    stockId: 'MCJ-2026-8906', // Toyota Alphard Executive Lounge 2026
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Export certificate & de-registration',
      'JEVIC luxury pre-export inspection'
    ],
    exclusions: [
      'Specialized container ocean freight',
      'Sri Lanka import tariffs and luxury cess'
    ]
  },
  {
    stockId: 'MCJ-2026-8907', // Mitsubishi Delica D:2 Hybrid 2024
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Shaken inspection renewal record',
      'Export certificate'
    ],
    exclusions: [
      'Freight to Colombo',
      'Sri Lanka taxes'
    ]
  },
  {
    stockId: 'MCJ-2026-8908', // Daihatsu Move G Two-Tone 2025
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase in Japan',
      'Japanese export certificate',
      'JEVIC inspection'
    ],
    exclusions: [
      'Freight & Sri Lanka customs duties'
    ]
  },

  // --- INDIA OFFERS (CIF Nhava Sheva / Chennai) ---
  {
    stockId: 'MCJ-2026-8906', // Alphard Executive Lounge
    marketSlug: 'india',
    portId: 'in-nhava-sheva',
    priceBasis: 'QUOTE_ONLY',
    amount: 0,
    currency: 'USD',
    validUntil: '2027-11-20',
    inclusions: [
      'Vehicle purchase price in Japan',
      'Japanese export certificate & de-registration'
    ],
    exclusions: [
      'Ocean freight to Nhava Sheva',
      'Indian Customs duties (Basic Duty + IGST 28% + Cess)',
      'Local RTO road tax and registration'
    ]
  }
];

export function getVehicleOffer(
  stockId: string,
  marketSlug?: string | null,
  portId?: string | null
): VehicleOffer | undefined {
  if (!stockId || !marketSlug) return undefined;
  const match = vehicleOffers.find((o) => {
    if (o.stockId.toLowerCase() !== stockId.toLowerCase()) return false;
    if (o.marketSlug.toLowerCase() !== marketSlug.toLowerCase()) return false;
    if (portId && o.portId && o.portId.toLowerCase() !== portId.toLowerCase()) return false;
    return true;
  });
  return match;
}

export function getEffectivePrice(
  stockId: string,
  marketSlug?: string | null,
  portId?: string | null
): {
  priceBasis: PriceBasis;
  amount: number;
  currency: 'USD';
  isEstimate: boolean;
  portLabel?: string;
} {
  const vehicle = vehicles.find((v) => v.stockId.toLowerCase() === stockId.toLowerCase());
  if (!vehicle) {
    return { priceBasis: 'QUOTE_ONLY', amount: 0, currency: 'USD', isEstimate: false };
  }

  // If vehicle has 0 amount, quotation basis only
  if (!vehicle.priceFOB || vehicle.priceFOB.amount === 0) {
    return {
      priceBasis: 'QUOTE_ONLY',
      amount: 0,
      currency: 'USD',
      isEstimate: false,
      portLabel: vehicle.priceFOB?.port || 'FOB Yokohama'
    };
  }

  if (!marketSlug) {
    return {
      priceBasis: 'FOB',
      amount: vehicle.priceFOB.amount,
      currency: 'USD',
      isEstimate: false,
      portLabel: vehicle.priceFOB.port
    };
  }

  const offer = getVehicleOffer(stockId, marketSlug, portId);
  if (offer && offer.priceBasis === 'CIF') {
    return {
      priceBasis: 'CIF',
      amount: offer.amount,
      currency: 'USD',
      isEstimate: false,
      portLabel: offer.portId || 'Named Port'
    };
  }

  if (offer && offer.priceBasis === 'QUOTE_ONLY') {
    return {
      priceBasis: 'QUOTE_ONLY',
      amount: 0,
      currency: 'USD',
      isEstimate: false,
      portLabel: offer.portId || vehicle.priceFOB.port
    };
  }

  return {
    priceBasis: 'FOB',
    amount: vehicle.priceFOB.amount,
    currency: 'USD',
    isEstimate: false,
    portLabel: vehicle.priceFOB.port
  };
}
