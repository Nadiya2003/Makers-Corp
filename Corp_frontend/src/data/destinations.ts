import { Market } from './types';

export const markets: Market[] = [
  {
    isoCode: 'IN',
    slug: 'india',
    name: 'India',
    region: 'Asia',
    publishState: 'active',
    defaultCurrency: 'USD',
    supportedPorts: [
      {
        id: 'in-nhava-sheva',
        name: 'Nhava Sheva (JNPT / Mumbai)',
        transitDays: '14-18 Days',
        oceanFreightUSD: 1650,
        isPrimary: true
      },
      {
        id: 'in-chennai',
        name: 'Chennai Port',
        transitDays: '16-20 Days',
        oceanFreightUSD: 1750
      },
      {
        id: 'in-mundra',
        name: 'Mundra Port (Gujarat)',
        transitDays: '15-19 Days',
        oceanFreightUSD: 1700
      }
    ],
    approvedContact: {
      title: 'Makers Corp Japan — India Desk',
      phone: '+81 3 5555 0198',
      email: 'india-desk@makerscorp.jp',
      whatsapp: '818012345678',
      address: 'Export Operations Hub, Minato-ku, Tokyo 105-0004, Japan',
      workingHours: '09:00 - 18:00 JST (Monday - Saturday)'
    },
    guidance: {
      summary:
        'Direct vehicle importation into India is governed by Directorate General of Foreign Trade (DGFT) policy and Indian Customs tariff rules. Luxury and performance models with engine capacity >3,000cc (petrol) or >2,500cc (diesel) and homologated categories qualify under specific direct import or EPCG routes.',
      regulatoryNotes: [
        'Right-Hand Drive (RHD) configuration is mandatory for all road vehicles imported into India.',
        'High-value luxury/supercar categories (FOB > $40,000 / engine capacity >3.0L) qualify under the liberalized DGFT direct import scheme without individual ARAI homologation requirements.',
        'Vehicles not meeting the unrestricted threshold require individual testing or import under specialized categories (e.g. transfer of residence, EPCG scheme, or diplomat quota).',
        'Speedometer reading must indicate km/h, and headlights must align with left-hand traffic driving standards.',
        'Customs duties, GST (28%), and compensation cess (up to 22%) are assessed by Indian Customs at the port of discharge.'
      ],
      steeringsPermitted: ['RHD'],
      clearanceNotice:
        'Makers Corp Japan provides FOB Japan or CIF Nhava Sheva/Chennai shipping terms. Quoted CIF amounts do NOT include Indian customs duty, integrated GST, port handling (CHA fees), or local RTO registration.'
    },
    campaignHeroSubtitle:
      'Direct Japan sourcing for premium performance, ultra-luxury SUVs, and specialized commercial transports reviewed for India entry routes.',
    verifiedLocalServices: [
      'Pre-export Japanese Export Certificate & JEVIC / JAAI inspection verification',
      'Port-to-port ocean freight to Nhava Sheva, Chennai, and Mundra',
      'Bill of Lading, Commercial Invoice & Packing List dispatch via DHL',
      'Dedicated India import specialist consultation prior to proforma confirmation'
    ]
  },
  {
    isoCode: 'LK',
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    region: 'Asia',
    publishState: 'active',
    defaultCurrency: 'USD',
    supportedPorts: [
      {
        id: 'lk-colombo',
        name: 'Colombo Sea Port',
        transitDays: '12-16 Days',
        oceanFreightUSD: 1450,
        isPrimary: true
      },
      {
        id: 'lk-hambantota',
        name: 'Hambantota International Port (Ro-Ro)',
        transitDays: '14-18 Days',
        oceanFreightUSD: 1400
      }
    ],
    approvedContact: {
      title: 'Makers Ceylon (Official Sri Lanka Operations Liaison)',
      phone: '+94 77 123 4567',
      email: 'srilanka@makerscorp.jp',
      whatsapp: '94771234567',
      address: '123 Import Avenue, Colombo 03, Sri Lanka',
      workingHours: '08:30 - 17:30 IST (Monday - Saturday)'
    },
    guidance: {
      summary:
        'Established import route with full local liaison assistance in Colombo. Sri Lanka regulations require Right-Hand Drive (RHD) and adherence to Ministry of Finance age limits (passenger cars within 2-3 years, commercial vans within 4-5 years depending on active circulars).',
      regulatoryNotes: [
        'RHD mandatory. JEVIC/JAAI pre-shipment condition and mileage verification certificate required for customs entry.',
        'Payment terms typically executed through Letter of Credit (LC) via verified commercial banks in Sri Lanka.',
        'Local indicative market prices in LKR represent estimated landed market valuations in Sri Lanka and are distinct from base FOB Japan amounts.'
      ],
      steeringsPermitted: ['RHD'],
      maxVehicleAgeYears: 3,
      clearanceNotice:
        'Makers Corp Japan provides verified FOB Japan and CIF Colombo shipping options. Sri Lanka port clearance and customs duty settlement can be handled in coordination with our Colombo liaison office.'
    },
    campaignHeroSubtitle:
      'Direct Japan auction sourcing with established Colombo port delivery, bank LC support, and complete pre-shipment certification.',
    verifiedLocalServices: [
      'Colombo liaison office with dedicated customer support and documentation assistance',
      'Bank LC processing support with leading Sri Lankan commercial banks',
      'Verified JEVIC pre-shipment structural inspection and genuine mileage guarantee',
      'Port clearance coordination and secure car-carrier delivery across Sri Lanka'
    ]
  },
  {
    isoCode: 'PK',
    slug: 'pakistan',
    name: 'Pakistan',
    region: 'Asia',
    publishState: 'inquiry_only',
    defaultCurrency: 'USD',
    supportedPorts: [
      {
        id: 'pk-karachi',
        name: 'Karachi Port (KPT / Port Qasim)',
        transitDays: '18-22 Days',
        oceanFreightUSD: 1800,
        isPrimary: true
      }
    ],
    approvedContact: {
      title: 'Makers Corp Japan — Global Sourcing Desk',
      phone: '+81 3 5555 0198',
      email: 'inquiry@makerscorp.jp',
      whatsapp: '818012345678',
      address: 'Export Operations Hub, Minato-ku, Tokyo 105-0004, Japan',
      workingHours: '09:00 - 18:00 JST (Monday - Friday)'
    },
    guidance: {
      summary:
        'Next-market sourcing route currently available on an inquiry-only basis. Vehicle imports into Pakistan are strictly regulated under Personal Baggage, Gift, or Transfer of Residence schemes with specific age criteria.',
      regulatoryNotes: [
        'Right-Hand Drive (RHD) vehicles only.',
        'Import schemes require eligible overseas Pakistani sponsorship under official passport schemes.',
        'Maximum vehicle age is capped at 3 years for passenger cars and 5 years for 4x4/SUVs under current SROs.'
      ],
      steeringsPermitted: ['RHD'],
      maxVehicleAgeYears: 3,
      clearanceNotice:
        'Stock listings for Pakistan are displayed for quotation and sourcing consultation only. Orders proceed via confirmed custom proforma after import entitlement check.'
    },
    campaignHeroSubtitle:
      'Specialized sourcing and quotation for Pakistan import schemes (Personal Baggage, Gift, and Transfer of Residence).',
    verifiedLocalServices: [
      'Direct sourcing from USS, TAA, and CAA Tokyo auction networks',
      'Pre-shipment verification and de-registration export certificate'
    ]
  },
  {
    isoCode: 'KE',
    slug: 'kenya',
    name: 'Kenya',
    region: 'Africa',
    publishState: 'active',
    defaultCurrency: 'USD',
    supportedPorts: [
      {
        id: 'ke-mombasa',
        name: 'Mombasa Port (Kilindini Harbour)',
        transitDays: '22-28 Days',
        oceanFreightUSD: 1950,
        isPrimary: true
      }
    ],
    approvedContact: {
      title: 'Makers Corp Japan — Africa Trade Desk',
      phone: '+81 3 5555 0198',
      email: 'africa@makerscorp.jp',
      whatsapp: '818012345678',
      address: 'Export Operations Hub, Minato-ku, Tokyo 105-0004, Japan',
      workingHours: '09:00 - 18:00 JST (Monday - Friday)'
    },
    guidance: {
      summary:
        'Direct Ro-Ro shipping to Mombasa Port under Kenya Bureau of Standards (KEBS) KS 1515:2000 road safety compliance.',
      regulatoryNotes: [
        'Strict 8-year age rule: Year of first registration must be within 8 years of import date.',
        'Right-Hand Drive (RHD) mandatory.',
        'Mandatory QISJ (Quality Inspection Services Japan) pre-export roadworthiness inspection certificate required.'
      ],
      steeringsPermitted: ['RHD'],
      maxVehicleAgeYears: 8,
      clearanceNotice:
        'All prices quoted CIF Mombasa include ocean freight, marine insurance, and QISJ inspection certificate. Excludes Kenya Revenue Authority (KRA) import duty, excise duty, and VAT.'
    },
    campaignHeroSubtitle:
      'Direct Ro-Ro shipping to Mombasa with full QISJ pre-export roadworthiness certification.',
    verifiedLocalServices: [
      'QISJ pre-export inspection booked and certified in Japan',
      'Direct Ro-Ro vessel booking from Yokohama/Kobe to Mombasa',
      'Fast DHL dispatch of original Bill of Lading, QISJ, and Export Certificate'
    ]
  },
  {
    isoCode: 'TZ',
    slug: 'tanzania',
    name: 'Tanzania',
    region: 'Africa',
    publishState: 'active',
    defaultCurrency: 'USD',
    supportedPorts: [
      {
        id: 'tz-dar-es-salaam',
        name: 'Dar es Salaam Port',
        transitDays: '24-30 Days',
        oceanFreightUSD: 2050,
        isPrimary: true
      }
    ],
    approvedContact: {
      title: 'Makers Corp Japan — Africa Trade Desk',
      phone: '+81 3 5555 0198',
      email: 'africa@makerscorp.jp',
      whatsapp: '818012345678',
      address: 'Export Operations Hub, Minato-ku, Tokyo 105-0004, Japan',
      workingHours: '09:00 - 18:00 JST (Monday - Friday)'
    },
    guidance: {
      summary:
        'Reliable direct Ro-Ro and containerized shipping to Dar es Salaam Port serving Tanzania domestic buyers and transit routes to Zambia, Rwanda, and DRC.',
      regulatoryNotes: [
        'Right-Hand Drive (RHD) standard for Tanzania road traffic.',
        'Vehicles older than 10 years are subject to additional environmental dumping excise tax.',
        'TBS (Tanzania Bureau of Standards) certified roadworthiness inspection executed prior to vessel departure.'
      ],
      steeringsPermitted: ['RHD'],
      clearanceNotice:
        'CIF Dar es Salaam shipping terms include marine insurance and export verification. Domestic customs duty and TRA valuation assessed upon arrival.'
    },
    campaignHeroSubtitle:
      'Direct Japan vehicle export to Dar es Salaam serving Tanzania and East Africa transit corridors.',
    verifiedLocalServices: [
      'TBS pre-shipment roadworthiness inspection',
      'Port-to-port ocean freight to Dar es Salaam'
    ]
  }
];

export function getMarketBySlug(slug: string): Market | undefined {
  if (!slug) return undefined;
  return markets.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
}

export function getMarketsByRegion(region: 'Asia' | 'Africa'): Market[] {
  return markets.filter((m) => m.region === region && m.publishState !== 'unpublished');
}

export function getAllPublishedMarkets(): Market[] {
  return markets.filter((m) => m.publishState !== 'unpublished');
}
