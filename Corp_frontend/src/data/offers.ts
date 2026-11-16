import { VehicleOffer, PriceBasis } from './types';
import { vehicles } from './vehicles';

export const vehicleOffers: VehicleOffer[] = [
  // --- INDIA OFFERS (CIF Nhava Sheva / Chennai) ---
  {
    stockId: 'MCJ-2024-8801', // GT-R NISMO
    marketSlug: 'india',
    portId: 'in-nhava-sheva',
    priceBasis: 'QUOTE_ONLY', // High-value unit requiring custom containerization & insurance quote
    amount: 198000,
    currency: 'USD',
    validUntil: '2026-12-10',
    inclusions: [
      'Vehicle purchase price in Japan',
      'Japanese export certificate & de-registration'
    ],
    exclusions: [
      'Ocean freight & specialized containerization (quoted upon destination port confirmation)',
      'Indian Customs import duties, IGST (28%), and compensation cess (22%)',
      'Port clearance (Customs House Agent charges) at Nhava Sheva',
      'Local RTO road tax and registration'
    ]
  },
  {
    stockId: 'MCJ-2024-8802', // LX 600
    marketSlug: 'india',
    portId: 'in-nhava-sheva',
    priceBasis: 'CIF',
    amount: 117200, // FOB 115,000 + freight & insurance 2,200
    currency: 'USD',
    validUntil: '2026-12-08',
    inclusions: [
      'Vehicle FOB purchase in Japan',
      'Ocean freight to Nhava Sheva (JNPT) / Mumbai Port',
      'Marine transit insurance policy (110% CIF value cover)',
      'Export certificate and de-registration documentation'
    ],
    exclusions: [
      'Indian Customs import duty (tariff line 870324)',
      'Integrated Goods and Services Tax (IGST) & cess',
      'Terminal Handling Charges (THC) and CHA fees at Mumbai',
      'Local state road tax and RTO vehicle registration'
    ]
  },
  {
    stockId: 'MCJ-2024-8805', // Land Cruiser 300 ZX
    marketSlug: 'india',
    portId: 'in-nhava-sheva',
    priceBasis: 'CIF',
    amount: 91100, // FOB 89,000 + 2,100
    currency: 'USD',
    validUntil: '2026-12-09',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ocean freight to Nhava Sheva (JNPT)',
      'Marine insurance cover to Indian port',
      'JAAI / JEVIC inspection certification'
    ],
    exclusions: [
      'Indian Customs tariff settlement and GST cess',
      'Port storage or demurrage charges if incurred',
      'Local registration and inland transit'
    ]
  },
  {
    stockId: 'MCJ-2024-8814', // Mercedes G63 AMG
    marketSlug: 'india',
    portId: 'in-nhava-sheva',
    priceBasis: 'CIF',
    amount: 184500, // FOB 182,000 + 2,500
    currency: 'USD',
    validUntil: '2026-12-11',
    inclusions: [
      'Vehicle purchase price in Japan',
      'Direct container ocean freight to Nhava Sheva',
      'Full marine insurance',
      'Export verification and de-registration documents'
    ],
    exclusions: [
      'Indian customs import duties and IGST',
      'Port clearance fees at Nhava Sheva',
      'Local state registration'
    ]
  },

  // --- SRI LANKA OFFERS (CIF Colombo) ---
  {
    stockId: 'MCJ-2024-8804', // Hiace
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 28100, // FOB 26,500 + 1,600
    currency: 'USD',
    validUntil: '2026-12-10',
    inclusions: [
      'Vehicle purchase price in Japan',
      'Direct Ro-Ro ocean freight to Colombo Sea Port',
      'Marine insurance policy to Colombo',
      'JEVIC roadworthiness & genuine mileage certificate'
    ],
    exclusions: [
      'Sri Lanka Customs import duty and PAL/CESS',
      'Sri Lanka Ports Authority (SLPA) port clearance charges',
      'Local Department of Motor Traffic (DMT) registration'
    ]
  },
  {
    stockId: 'MCJ-2024-8806', // Prado TX L
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 39600, // FOB 37,800 + 1,800
    currency: 'USD',
    validUntil: '2026-12-10',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ocean freight to Colombo Port',
      'Marine insurance cover',
      'JEVIC inspection certificate'
    ],
    exclusions: [
      'Sri Lanka import duties and luxury excise tax',
      'Port clearance and local delivery charges'
    ]
  },
  {
    stockId: 'MCJ-2024-8807', // Vezel
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 19450, // FOB 17,900 + 1,550
    currency: 'USD',
    validUntil: '2026-12-08',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ro-Ro shipping to Colombo Port',
      'Marine transit insurance',
      'JEVIC pre-export inspection certificate'
    ],
    exclusions: [
      'Customs import duty, VAT, and port handling in Colombo'
    ]
  },
  {
    stockId: 'MCJ-2024-8808', // Swift RS
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 10650, // FOB 9,200 + 1,450
    currency: 'USD',
    validUntil: '2026-12-08',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ocean freight to Colombo',
      'Marine insurance policy',
      'JEVIC certificate'
    ],
    exclusions: [
      'Customs import duties and local port handling'
    ]
  },
  {
    stockId: 'MCJ-2024-8810', // Alphard Executive Lounge
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 60200, // FOB 58,000 + 2,200
    currency: 'USD',
    validUntil: '2026-12-09',
    inclusions: [
      'Vehicle purchase price in Japan',
      'Ro-Ro / container freight to Colombo Sea Port',
      'Marine insurance cover to Colombo',
      'Makers Certified 150-Point inspection & JEVIC cert'
    ],
    exclusions: [
      'Sri Lanka Customs duties and port clearance fees'
    ]
  },
  {
    stockId: 'MCJ-2024-8812', // Hilux GR Sport
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 36400, // FOB 34,500 + 1,900
    currency: 'USD',
    validUntil: '2026-12-09',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ro-Ro shipping to Colombo Port',
      'Marine insurance cover'
    ],
    exclusions: [
      'Customs duties and port clearance'
    ]
  },
  {
    stockId: 'MCJ-2024-8813', // Jimny Sierra
    marketSlug: 'sri-lanka',
    portId: 'lk-colombo',
    priceBasis: 'CIF',
    amount: 20100, // FOB 18,400 + 1,700
    currency: 'USD',
    validUntil: '2026-12-09',
    inclusions: [
      'Vehicle FOB price in Japan',
      'Ro-Ro freight to Colombo',
      'Marine insurance policy'
    ],
    exclusions: [
      'Customs import taxes and port clearance'
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

  // Fallback to FOB
  return {
    priceBasis: 'FOB',
    amount: vehicle.priceFOB.amount,
    currency: 'USD',
    isEstimate: false,
    portLabel: vehicle.priceFOB.port
  };
}
