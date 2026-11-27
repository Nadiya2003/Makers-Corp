export type NewsCategory =
  | 'Buying Guides'
  | 'Vehicle Reviews'
  | 'Country Guides'
  | 'Shipment Updates'
  | 'Company News';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: NewsCategory;
  excerpt: string;
  content: string[]; // Structured paragraphs & markdown-like blocks
  keyTakeaways?: string[];
  coverImage: string;
  author: {
    name: string;
    role: string;
  };
  publishedAt: string; // ISO format e.g. "2026-11-10"
  readTimeMinutes: number;
  featured?: boolean;
  relatedVehicleFilter?: {
    make?: string;
    bodyType?: string;
  };
}

export const articles: Article[] = [
  {
    id: 'art-001',
    slug: 'how-buying-a-vehicle-from-japan-works',
    title: 'How Buying a Vehicle From Japan Works',
    subtitle: 'A transparent, step-by-step export walkthrough from Tokyo yards to your destination port',
    category: 'Buying Guides',
    excerpt:
      'From selecting verified physical stock in Japanese yards to independent pre-export inspection, proforma agreement, and vessel tracking — understand the full export workflow.',
    coverImage:
      '/images/Japan Vehicle Export Guide.png',
    author: {
      name: 'Kenji Takahashi',
      role: 'Export Operations Desk, Tokyo',
    },
    publishedAt: '2026-11-05',
    readTimeMinutes: 6,
    featured: true,
    keyTakeaways: [
      'Always verify genuine physical chassis numbers and original deregistration certificates before payment.',
      'Independent third-party audits (JEVIC, JAAI, or QISJ) provide objective roadworthiness grading.',
      'FOB covers vehicle charges in Japan; CIF includes ocean freight and marine transit insurance to your port.',
      'Import duties, taxes, and destination port clearance remain the responsibility of the local importer.'
    ],
    content: [
      'Importing a motor vehicle directly from Japan has become the benchmark standard for international buyers seeking superior mechanical condition, documented service histories, and high factory specification. However, navigating international logistics, export inspections, and proforma terms requires a structured understanding of the export journey.',
      '### Stage 1: Stock Identification & Chassis Verification',
      'The process begins with identifying a physical vehicle in yard stock or issuing a target sourcing brief. Every legitimate export vehicle in Japan is accompanied by an Export Certificate (Massho) or De-Registration Document issued by Japan’s Ministry of Land, Infrastructure, Transport and Tourism (MLIT). At Makers Corp Japan, our catalog lists genuine physical units with verified chassis model codes (e.g., 6BA-R35, 3BA-VJA310W) and actual odometer readings rather than speculative auction listings.',
      '### Stage 2: Destination Conformity Check',
      'Before proceeding to a contract, our export compliance team verifies whether the vehicle meets destination-specific import laws. For example, India imposes strict CIF valuation and homologation criteria, while Sri Lanka and East African nations (Kenya, Tanzania) enforce strict vehicle age restrictions (such as maximum 3 to 8 years from first registration) and mandatory pre-shipment radiation and roadworthiness inspection.',
      '### Stage 3: Proforma Invoice & Transparent Quotation',
      'Once a unit is shortlisted, a formal written Proforma Invoice is issued. We explicitly itemize the price basis:\n- **FOB (Free on Board):** Covers vehicle purchase, Japanese inland transportation, customs export clearance, and port terminal handling in Japan.\n- **CIF (Cost, Insurance & Freight):** Adds ocean freight to the nominated discharge port (e.g. Nhava Sheva, Colombo, or Mombasa) plus comprehensive marine transit cargo insurance.\nLocal destination taxes, customs duties, port demurrage, and registration are always excluded and handled by your licensed clearing agent.',
      '### Stage 4: Independent Pre-Shipment Inspection',
      'Prior to vessel loading, the vehicle is transported to designated inspection centers for impartial auditing:\n- **JEVIC (Japan Export Vehicle Inspection Centre):** Structural integrity, odometer tampering check, radiation detection, and mechanical roadworthiness.\n- **JAAI (Japan Auto Appraisal Institute):** Accepted across key Asian jurisdictions for valuation and compliance grading.\n- **QISJ / KEBS / TBS:** Tailored to East African trade regulations.',
      '### Stage 5: Ocean Freight & Document Delivery',
      'Vehicles are shipped either via Ro-Ro (Roll-on/Roll-off specialized car carriers) or in secured 20ft/40ft shipping containers. Once the vessel departs Japanese waters, the original Bill of Lading (B/L), Export Certificate, Commercial Invoice, and Inspection Certificate are dispatched via DHL or FedEx to the buyer or clearing agent for prompt customs clearance upon arrival.'
    ]
  },
  {
    id: 'art-002',
    slug: 'what-to-check-before-requesting-an-export-quote',
    title: 'What to Check Before Requesting an Export Quote',
    subtitle: 'Critical vehicle specifications and destination rules to confirm before committing funds',
    category: 'Buying Guides',
    excerpt:
      'Avoid costly import delays by verifying age thresholds, emissions compliance, steering orientation, and port selection before requesting your written export proforma.',
    coverImage:
      '/images/Export Quote Checklist for Car Shipping.png',
    author: {
      name: 'Hiroshi Sato',
      role: 'Homologation Specialist, Yokohama',
    },
    publishedAt: '2026-11-08',
    readTimeMinutes: 5,
    featured: false,
    keyTakeaways: [
      'Double check your country’s maximum age rule based on First Registration Date, not manufacture year.',
      'Ensure the steering orientation (RHD vs LHD) is legally permitted in your jurisdiction.',
      'Understand CIF quotation boundaries: marine insurance ends at the discharge port quay.',
      'Confirm whether your port has direct Ro-Ro car carrier service or requires container consolidation.'
    ],
    content: [
      'Submitting a vehicle inquiry is the first step toward acquiring a Japan-sourced vehicle. However, international vehicle import is governed by rigid national customs protocols that vary dramatically by territory. Reviewing these five technical points before submitting your quote request ensures a smooth transaction.',
      '### 1. Age Restrictions & Registration Dates',
      'Most importing countries calculate vehicle age based on the Japanese First Registration Date (Shoken date) rather than the calendar manufacturing year. For example, a vehicle manufactured in November 2021 but registered in March 2022 may qualify differently depending on customs valuation windows. Always check the exact year and month on the listing plaque.',
      '### 2. Steering Configuration (RHD vs. LHD)',
      'The vast majority of domestic Japanese market (JDM) vehicles are Right-Hand Drive (RHD). While RHD is standard and legal in Japan, the UK, Australia, New Zealand, India, Sri Lanka, Kenya, and Cyprus, markets in the Americas, Middle East, and Continental Europe often mandate Left-Hand Drive (LHD). We stock both JDM RHD models and select European-spec LHD vehicles (such as Mercedes-Benz AMG and Porsche). Verify your local Ministry of Transport requirements.',
      '### 3. Engine Capacity and Tariff Tiers',
      'In many nations, customs duties scale exponentially with engine displacement. For instance, engines under 1,500cc or hybrid powertrains often attract reduced excise duties, whereas powerplants exceeding 2,500cc or 3,000cc (like 3.5L V6 or 5.5L V8 engines) may face luxury taxation. Check your clearing agent’s tariff schedule before finalizing your budget.',
      '### 4. Nominated Discharge Port',
      'When requesting a CIF quotation, specify your exact preferred port of entry. Ocean freight rates and vessel transit frequencies differ significantly between primary hub ports (e.g. JNPT Mumbai, Colombo Port, Mombasa) and feeder or regional ports. Providing the precise port allows us to book direct Ro-Ro sailings with the shortest transit times.'
    ]
  },
  {
    id: 'art-003',
    slug: 'understanding-japanese-auction-grading-and-inspection',
    title: 'Understanding Japanese Vehicle Inspection Standards: JEVIC, JAAI, & Auction Grades',
    subtitle: 'How to read Japanese vehicle inspection sheets and verify authentic mechanical condition',
    category: 'Vehicle Reviews',
    excerpt:
      'Demystifying auction grades from 3.5 to 5.0, interior condition scores, and third-party pre-export audits so you can buy with total technical confidence.',
    coverImage:
      '/images/Japanese Vehicle Inspection Standards Explained.png',
    author: {
      name: 'Kenji Takahashi',
      role: 'Export Operations Desk, Tokyo',
    },
    publishedAt: '2026-10-28',
    readTimeMinutes: 7,
    featured: false,
    keyTakeaways: [
      'Grade 4.5 and 5.0 indicate exceptionally well-maintained vehicles with negligible cosmetic wear.',
      'Grade R or RA denotes past panel repairs or structural rectifications, fully disclosed on the sheet.',
      'Japanese auction inspection sheets provide mapped diagrams of scratches (A1–A3) and dents (U1–U3).',
      'Third-party audits verify odometer readings against historical registration databases to prevent rollbacks.'
    ],
    content: [
      'Japan is renowned for the world’s most meticulous and transparent automotive grading ecosystem. Unlike traditional used-car markets that rely on subjective dealer descriptions, Japanese auction houses and export agencies adhere to standardized evaluation rubrics.',
      '### The Overall Condition Grade Scale',
      '- **Grade S / 6:** Brand new or delivery-mileage vehicle (under 12 months old, virtually zero imperfections).\n- **Grade 5.0:** Superb condition with minimal mileage and pristine mechanical and body presentation.\n- **Grade 4.5:** Very high grade, clean interior and exterior with only minor microscopic blemishes.\n- **Grade 4.0:** Well-maintained daily driver, clean engine bay, normal age-appropriate wear.\n- **Grade 3.5:** Noticeable cosmetic scratches, stone chips, or higher mileage, mechanically sound.\n- **Grade R / RA:** Repair history. A fender, bumper, or panel has been repaired or replaced to factory standard.',
      '### Interior Grading (A to D)',
      'The interior receives an independent letter grade:\n- **A:** Pristine, smoke-free, no seat bolster wear or dashboard marks.\n- **B:** Clean condition, subtle wear consistent with vehicle age.\n- **C:** Noticeable scuffs, cigarette burn, or light headliner staining.\n- **D:** Heavy wear requiring professional detailing or reupholstery.',
      '### Pre-Export Odometer Certification',
      'Odometer rollback fraud is virtually nonexistent in authorized Japanese export channels because agencies like JEVIC and JAAI cross-reference the digital readout against the MLIT national registration records. If any discrepancy exists, the inspection certificate is stamped as unverified. Makers Corp Japan strictly refuses unverified mileage inventory.'
    ]
  },
  {
    id: 'art-004',
    slug: 'direct-import-regulations-india-and-sri-lanka-comparison',
    title: 'Export Review: Direct Sourcing for India vs. Sri Lanka Markets',
    subtitle: 'Comparing duty structures, approved ports, and import documentation between South Asian destinations',
    category: 'Country Guides',
    excerpt:
      'How vehicle export requirements differ between India (DGFT direct import, FOB valuation thresholds) and Sri Lanka (Makers Ceylon liaison support, commercial LC).',
    coverImage:
      '/images/Japanese Vehicle Inspection Standards Explained.png',
    author: {
      name: 'Hiroshi Sato',
      role: 'Homologation Specialist, Yokohama',
    },
    publishedAt: '2026-10-15',
    readTimeMinutes: 5,
    featured: false,
    keyTakeaways: [
      'India allows direct personal import of new or high-value homologated vehicles under specific DGFT guidelines.',
      'Sri Lanka operations are coordinated with our local liaison office (Makers Ceylon) in Colombo.',
      'Ocean transit from Japanese ports to Colombo or Mumbai averages between 12 and 18 days.',
      'Letter of Credit (LC) and bank transfer protocols must strictly reflect proforma vehicle chassis numbers.'
    ],
    content: [
      'South Asia represents a premier corridor for Japanese automotive export. However, the legal and financial frameworks governing automotive imports into India and Sri Lanka are fundamentally distinct.',
      '### India Import Parameters',
      'Under current Directorate General of Foreign Trade (DGFT) guidelines, imported vehicles into India must be Right-Hand Drive (RHD), feature speedometers calibrated in km/h, and comply with homologation or specific CIF valuation thresholds for passenger vehicles. Key discharge ports include JNPT (Nhava Sheva, Mumbai) and Chennai Port. Makers Corp Japan pre-screens all units destined for India for DGFT suitability.',
      '### Sri Lanka Operations & Local Liaison',
      'For Sri Lankan buyers, our transactions are seamlessly supported by Makers Ceylon, our verified liaison partner headquartered in Colombo. This partnership ensures that commercial invoices, bill of lading documentation, and JEVIC certificates align precisely with Sri Lanka Customs and Department of Import and Export Control requirements.',
      '### Transit & Vessel Schedules',
      'Direct Ro-Ro sailings depart Yokohama, Nagoya, and Kobe ports bi-weekly, reaching Colombo Port in approximately 12–15 days and Nhava Sheva in 14–18 days. Full vessel tracking and Bill of Lading documentation are supplied upon departure.'
    ]
  }
];

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) || articles[0];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: NewsCategory | 'All'): Article[] {
  if (category === 'All') return articles;
  return articles.filter((a) => a.category === category);
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  return articles
    .filter((a) => a.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.category === current.category) return -1;
      return 0;
    })
    .slice(0, limit);
}
