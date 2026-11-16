import { Vehicle } from './types';

export const vehicles: Vehicle[] = [
  {
    id: 'mcj-gtr-nismo-2022',
    stockId: 'MCJ-2024-8801',
    slug: '2022-nissan-gt-r-nismo-6ba-r35',
    make: 'Nissan',
    model: 'GT-R',
    grade: 'NISMO Special Edition',
    modelCode: '6BA-R35',
    year: 2022,
    firstRegistrationDate: '2022/05',
    mileageKm: 5400,
    fuel: 'Petrol',
    transmission: 'Dual-Clutch',
    engineCc: 3799,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'Luxury & Performance',
    seats: 4,
    color: 'Brilliant White Pearl / Carbon Fiber',
    conditionGrade: '5.0/A',
    inspectionStatus: 'Makers Certified 150-Point & JEVIC Passed',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T09:30:00Z',
    priceFOB: {
      amount: 198000,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      'VR38DETT Twin-Turbo V6 (600 PS / 652 Nm)',
      'Carbon-ceramic Brembo brake system',
      'Exclusively tuned NISMO Bilstein DampTronic suspension',
      'Dry carbon-fiber engine hood with NACA ducts & carbon roof',
      'NISMO Recaro carbon-backed racing bucket seats',
      'Rays 20-inch forged aluminum wheels with red rim accent'
    ],
    overview:
      'A museum-grade 2022 Nissan GT-R NISMO Special Edition sourced from private Japanese collector storage in Kanagawa. Documented maintenance history, original Japanese export verification certificate in hand, and flawless chassis condition.',
    isFeatured: true
  },
  {
    id: 'mcj-lexus-lx600-2023',
    stockId: 'MCJ-2024-8802',
    slug: '2023-lexus-lx-600-executive-3ba-vja310w',
    make: 'Lexus',
    model: 'LX 600',
    grade: 'Executive 4-Seater VIP',
    modelCode: '3BA-VJA310W',
    year: 2023,
    firstRegistrationDate: '2023/03',
    mileageKm: 8900,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 3444,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 4,
    color: 'Sonic Quartz White Pearl',
    conditionGrade: '4.5/A',
    inspectionStatus: 'Makers Certified 150-Point',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T11:00:00Z',
    priceFOB: {
      amount: 115000,
      currency: 'USD',
      port: 'FOB Nagoya'
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      'V35A-FTS 3.5L Twin-Turbo V6 (409 HP)',
      'Executive rear independent ottoman massage seats with footrests',
      'Rear Seat Entertainment 11.6-inch dual screens',
      'Mark Levinson 25-speaker Reference 3D Surround Sound',
      'Multi-Terrain Select with Crawl Control & Active Height Control (AHC)',
      'Digital rear-view mirror and Head-Up Display (HUD)'
    ],
    overview:
      'Premier Japanese executive specification LX 600 VIP. Sourced directly from corporate fleet in Aichi with full Lexus dealer service records, clean Japanese de-registration document, and premium interior trim.',
    isFeatured: true
  },
  {
    id: 'mcj-lexus-lx700h-2024',
    stockId: 'MCJ-2024-8803',
    slug: '2024-lexus-lx-700h-overtrail-hybrid',
    make: 'Lexus',
    model: 'LX 700h',
    grade: 'Overtrail Edition Hybrid',
    modelCode: 'VJA310-HYB',
    year: 2024,
    firstRegistrationDate: '2024/09',
    mileageKm: 350,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    engineCc: 3444,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 5,
    color: 'Moon Desert / Black Roof',
    conditionGrade: 'S/A (Brand New Delivery)',
    inspectionStatus: 'Pre-Delivery Factory Quality Inspected',
    sourceType: 'Auction Sourcing Offer',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-14T16:00:00Z',
    priceFOB: {
      amount: 138000,
      currency: 'USD',
      port: 'FOB Kobe'
    },
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      'Parallel hybrid system pairing 3.5L Twin-Turbo V6 with permanent magnet motor',
      'Front, center, and rear electronic locking differentials',
      'Specialized 18-inch matte gray off-road wheels with all-terrain tires',
      'AC inverter providing 2,400W external power output',
      'Exclusive khaki leather upholstery with open-pore wood accents'
    ],
    overview:
      'Latest production 2024 LX 700h Overtrail Edition hybrid, available via Tokyo dealer allocation. Offered for pre-booking with destination homologation check required.',
    isFeatured: true
  },
  {
    id: 'mcj-toyota-hiace-2021',
    stockId: 'MCJ-2024-8804',
    slug: '2021-toyota-hiace-super-gl-dark-prime-ii-3df-gdh201v',
    make: 'Toyota',
    model: 'Hiace',
    grade: 'Super GL Dark Prime II',
    modelCode: '3DF-GDH201V',
    year: 2021,
    firstRegistrationDate: '2021/08',
    mileageKm: 34200,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCc: 2754,
    drivetrain: '2WD',
    steering: 'RHD',
    bodyType: 'Vans & MPVs',
    seats: 5,
    color: 'White Pearl Crystal Shine',
    conditionGrade: '4.5/B',
    inspectionStatus: 'JEVIC Inspected & Mileage Certified',
    sourceType: 'Partner Stock',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T08:15:00Z',
    priceFOB: {
      amount: 26500,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    referencePriceLKR: {
      minLKR: 28500000,
      maxLKR: 31000000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '1GD-FTV 2.8L Clean Diesel Turbo Engine',
      'Toyota Safety Sense with pre-collision auto braking',
      'Dark Prime II exclusive dark chrome grille & mahogany black leather steering',
      'Dual rear sliding doors with easy-closer mechanism',
      'Fold-flat rear executive bench for cargo or passenger layout'
    ],
    overview:
      'Top-tier spec Toyota Hiace Super GL Dark Prime II. Renowned for supreme commercial reliability, comfortable passenger accommodation, and strong resale value across Asia and East Africa.',
    isFeatured: true
  },
  {
    id: 'mcj-landcruiser-300-2022',
    stockId: 'MCJ-2024-8805',
    slug: '2022-toyota-land-cruiser-300-zx-3ba-vja300w',
    make: 'Toyota',
    model: 'Land Cruiser',
    grade: '300 Series ZX',
    modelCode: '3BA-VJA300W',
    year: 2022,
    firstRegistrationDate: '2022/07',
    mileageKm: 14200,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 3444,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 7,
    color: 'Precious White Pearl',
    conditionGrade: '5.0/A',
    inspectionStatus: 'Makers Certified 150-Point',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T12:00:00Z',
    priceFOB: {
      amount: 89000,
      currency: 'USD',
      port: 'FOB Nagoya'
    },
    referencePriceLKR: {
      minLKR: 95000000,
      maxLKR: 105000000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '3.5L V6 Twin-Turbo Petrol (415 PS)',
      'Electronic Kinetic Dynamic Suspension System (E-KDSS)',
      'Modelista aero kit with 20-inch high-gloss alloy wheels',
      '3-row 7-seater power fold setup with rear ventilation',
      'JBL Synthesis premium 14-speaker sound system',
      'Full 360-degree Panoramic View Monitor with underfloor terrain view'
    ],
    overview:
      'Pristine condition flagship Land Cruiser 300 ZX. One previous private owner in Osaka, full Toyota official service log, zero accidents, ready for immediate export shipment.',
    isFeatured: true
  },
  {
    id: 'mcj-prado-txl-2022',
    stockId: 'MCJ-2024-8806',
    slug: '2022-toyota-land-cruiser-prado-tx-l-3ba-trj150w',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    grade: 'TX L-Package 7-Seater',
    modelCode: '3BA-TRJ150W',
    year: 2022,
    firstRegistrationDate: '2022/04',
    mileageKm: 18600,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2693,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 7,
    color: 'Attitude Black Mica',
    conditionGrade: '4.5/A',
    inspectionStatus: 'JEVIC Inspected',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T10:00:00Z',
    priceFOB: {
      amount: 37800,
      currency: 'USD',
      port: 'FOB Kobe'
    },
    referencePriceLKR: {
      minLKR: 38500000,
      maxLKR: 42000000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '2.7L 2TR-FE 4-Cylinder Petrol Engine',
      'Full leather interior with ventilated front cooling seats',
      'Power sunroof with tilt and slide function',
      'Roof rails, side steps, and rear privacy glass',
      'Toyota Safety Sense with radar cruise control'
    ],
    overview:
      'High-demand 7-passenger Prado TX L-Package in sleek Black Mica. Well-maintained Japanese family vehicle with verified low mileage and reliable mechanical foundation.',
    isFeatured: true
  },
  {
    id: 'mcj-honda-vezel-2022',
    stockId: 'MCJ-2024-8807',
    slug: '2022-honda-vezel-ehev-z-6aa-rv5',
    make: 'Honda',
    model: 'Vezel',
    grade: 'e:HEV Z',
    modelCode: '6AA-RV5',
    year: 2022,
    firstRegistrationDate: '2022/02',
    mileageKm: 21400,
    fuel: 'Hybrid',
    transmission: 'CVT',
    engineCc: 1496,
    drivetrain: '2WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 5,
    color: 'Premium Sunlight White Pearl',
    conditionGrade: '4.5/A',
    inspectionStatus: 'JEVIC Inspected',
    sourceType: 'Partner Stock',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-14T14:00:00Z',
    priceFOB: {
      amount: 17900,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    referencePriceLKR: {
      minLKR: 14500000,
      maxLKR: 16500000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '1.5L e:HEV 2-motor intelligent hybrid drivetrain',
      'Hands-free power tailgate with walk-away close',
      'Honda SENSING advanced driver assistance system',
      'Half-leather heated front seats & wireless smartphone charger',
      'LED active cornering headlights & signature front light strip'
    ],
    overview:
      'Exceptionally fuel-efficient modern urban crossover. Popular choice for South Asian markets seeking outstanding city mileage and refined cabin aesthetics.',
    isFeatured: false
  },
  {
    id: 'mcj-suzuki-swift-2021',
    stockId: 'MCJ-2024-8808',
    slug: '2021-suzuki-swift-rs-dualjet-5ba-zc83s',
    make: 'Suzuki',
    model: 'Swift',
    grade: 'RS Dualjet Safety Package',
    modelCode: '5BA-ZC83S',
    year: 2021,
    firstRegistrationDate: '2021/06',
    mileageKm: 28400,
    fuel: 'Petrol',
    transmission: 'CVT',
    engineCc: 1242,
    drivetrain: '2WD',
    steering: 'RHD',
    bodyType: 'Sedans & Hatchbacks',
    seats: 5,
    color: 'Speedy Blue Metallic',
    conditionGrade: '4.0/B',
    inspectionStatus: 'JEVIC Inspected',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T07:45:00Z',
    priceFOB: {
      amount: 9200,
      currency: 'USD',
      port: 'FOB Kobe'
    },
    referencePriceLKR: {
      minLKR: 8500000,
      maxLKR: 9800000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '1.2L K12C Dualjet 4-cylinder engine with paddle shifters',
      'RS aero body kit with rear spoiler and side skirts',
      'Dual Sensor Brake Support (DSBS) collision mitigation',
      'Sport bucket seats with red contrast stitching',
      '16-inch diamond-cut alloy wheels'
    ],
    overview:
      'Sporty and agile Japanese hatchback offering exceptional reliability and low running costs. Clean interior, fully inspected chassis, ready for port loading.',
    isFeatured: false
  },
  {
    id: 'mcj-toyota-alphard-2023',
    stockId: 'MCJ-2024-8810',
    slug: '2023-toyota-alphard-executive-lounge-3ba-agh30w',
    make: 'Toyota',
    model: 'Alphard',
    grade: 'Executive Lounge VIP',
    modelCode: '3BA-AGH30W',
    year: 2023,
    firstRegistrationDate: '2023/05',
    mileageKm: 9800,
    fuel: 'Petrol',
    transmission: 'CVT',
    engineCc: 2493,
    drivetrain: '2WD',
    steering: 'RHD',
    bodyType: 'Vans & MPVs',
    seats: 7,
    color: 'Burning Black Crystal Shine',
    conditionGrade: '5.0/A',
    inspectionStatus: 'Makers Certified 150-Point',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T11:45:00Z',
    priceFOB: {
      amount: 58000,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    referencePriceLKR: {
      minLKR: 65000000,
      maxLKR: 72000000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      'First-class airline style power reclining ottoman seats with stowable tables',
      'Rear ceiling 13.3-inch entertainment display with HDMI input',
      'JBL 17-speaker Premium Sound System',
      'Nappa leather upholstery with metal-wood inlays',
      'Dual sunroof and 16-color ambient ceiling LED lighting'
    ],
    overview:
      'The benchmark for Japanese luxury mobility. Designed for VIP transport, high-level business executives, and luxury hotels.',
    isFeatured: true
  },
  {
    id: 'mcj-mercedes-g63-2022',
    stockId: 'MCJ-2024-8814',
    slug: '2022-mercedes-benz-g63-amg-magno-japan-spec-rhd',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    grade: 'G63 AMG Magno Edition',
    modelCode: '4BA-463350',
    year: 2022,
    firstRegistrationDate: '2022/04',
    mileageKm: 15800,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 3982,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'Luxury & Performance',
    seats: 5,
    color: 'Night Black Magno (Matte)',
    conditionGrade: '5.0/A',
    inspectionStatus: 'Makers Certified 150-Point & Mercedes Japan Service Records',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T12:30:00Z',
    priceFOB: {
      amount: 182000,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '4.0L V8 Biturbo AMG Engine (585 hp / 850 Nm)',
      'AMG Night Package II with matte carbon exterior trims',
      'Burmester Surround Sound System',
      'Exclusive two-tone Bengal Red / Black designo Nappa leather',
      '22-inch AMG forged cross-spoke wheels in matte black'
    ],
    overview:
      'Genuine Japanese-delivered RHD Mercedes-Benz G63 AMG Magno Edition. Sourced directly from prestigious Tokyo dealership network with complete maintenance pedigree.',
    isFeatured: true
  },
  {
    id: 'mcj-toyota-hilux-2023',
    stockId: 'MCJ-2024-8812',
    slug: '2023-toyota-hilux-gr-sport-3df-gun125',
    make: 'Toyota',
    model: 'Hilux',
    grade: 'GR Sport Double Cab',
    modelCode: '3DF-GUN125',
    year: 2023,
    firstRegistrationDate: '2023/02',
    mileageKm: 11200,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCc: 2393,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'Trucks & Commercial',
    seats: 5,
    color: 'Emotional Red II',
    conditionGrade: '4.5/A',
    inspectionStatus: 'Makers Certified 150-Point',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T13:00:00Z',
    priceFOB: {
      amount: 34500,
      currency: 'USD',
      port: 'FOB Nagoya'
    },
    referencePriceLKR: {
      minLKR: 36000000,
      maxLKR: 39500000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '2.4L Clean Diesel Turbo Engine with Part-Time 4WD',
      'GR-tuned suspension with monotube shock absorbers',
      'Dedicated GR Sport wide-body overfenders and front fascia',
      'Synthetic suede and genuine leather sport seats with GR embroidery',
      'Heavy-duty bed liner and rear sports bar'
    ],
    overview:
      'Rugged, highly capable pickup engineered with Gazoo Racing chassis tuning. Excellent utility and durability for commercial fleets and overland expeditions.',
    isFeatured: false
  },
  {
    id: 'mcj-jimny-sierra-2022',
    stockId: 'MCJ-2024-8813',
    slug: '2022-suzuki-jimny-sierra-jc-3ba-jb74w',
    make: 'Suzuki',
    model: 'Jimny Sierra',
    grade: 'JC 4WD',
    modelCode: '3BA-JB74W',
    year: 2022,
    firstRegistrationDate: '2022/08',
    mileageKm: 15400,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 1460,
    drivetrain: '4WD',
    steering: 'RHD',
    bodyType: 'SUVs & 4x4',
    seats: 4,
    color: 'Kinetic Yellow / Black 2-Tone',
    conditionGrade: '4.5/A',
    inspectionStatus: 'JEVIC Inspected',
    sourceType: 'Partner Stock',
    availability: 'Available',
    lastAvailabilityCheck: '2026-11-15T09:00:00Z',
    priceFOB: {
      amount: 18400,
      currency: 'USD',
      port: 'FOB Kobe'
    },
    referencePriceLKR: {
      minLKR: 18500000,
      maxLKR: 21000000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      '1.5L K15B 4-cylinder engine with low-range transfer gear',
      'Ladder frame chassis with 3-link rigid axle suspension',
      'LED projector headlights with high-pressure washers',
      'Cruise control and Dual Sensor Brake Support',
      '15-inch gunmetal aluminum wheels'
    ],
    overview:
      'Iconic Japanese compact off-roader with true ladder-frame 4x4 capability. Sourced from Hyogo Prefecture in immaculate mechanical shape.',
    isFeatured: false
  },
  {
    id: 'mcj-toyota-aqua-2022-sold',
    stockId: 'MCJ-2024-8816',
    slug: '2022-toyota-aqua-z-6aa-mxpk11-sold',
    make: 'Toyota',
    model: 'Aqua',
    grade: 'Z Package Hybrid',
    modelCode: '6AA-MXPK11',
    year: 2022,
    firstRegistrationDate: '2022/03',
    mileageKm: 21200,
    fuel: 'Hybrid',
    transmission: 'CVT',
    engineCc: 1490,
    drivetrain: '2WD',
    steering: 'RHD',
    bodyType: 'Sedans & Hatchbacks',
    seats: 5,
    color: 'Clear Beige Metallic',
    conditionGrade: '4.5/A',
    inspectionStatus: 'JEVIC Inspected (Archived Sale)',
    sourceType: 'Confirmed Makers Inventory',
    availability: 'Sold',
    lastAvailabilityCheck: '2026-11-10T10:00:00Z',
    priceFOB: {
      amount: 14200,
      currency: 'USD',
      port: 'FOB Yokohama'
    },
    referencePriceLKR: {
      minLKR: 12500000,
      maxLKR: 13800000,
      label: 'Indicative Sri Lanka Landed Valuation'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    keyFeatures: [
      'Bipolar nickel-hydrogen battery hybrid technology',
      '10.5-inch large touchscreen infotainment display',
      'Color Head-Up Display (HUD)',
      'Class-leading fuel efficiency (>33 km/L WLTC)',
      'Advanced Park automated parking assistance'
    ],
    overview:
      'THIS VEHICLE HAS BEEN SOLD. Listing retained for stock reference and customs invoice tracking. Please consult our team or submit a Sourcing Request to procure a matching unit.',
    isFeatured: false
  }
];

export function getVehicleByStockIdOrSlug(identifier: string): Vehicle | undefined {
  if (!identifier) return undefined;
  const cleanId = identifier.trim().toLowerCase();
  return vehicles.find(
    (v) =>
      v.stockId.toLowerCase() === cleanId ||
      v.slug.toLowerCase() === cleanId ||
      v.id.toLowerCase() === cleanId ||
      identifier.toLowerCase().startsWith(v.stockId.toLowerCase())
  );
}

export function getActiveVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.availability !== 'Sold');
}

export function getFeaturedVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.isFeatured && v.availability !== 'Sold');
}
