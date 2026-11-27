'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
  Compass,
  Car,
  Truck,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  Box,
  CornerDownRight,
  ChevronDown
} from 'lucide-react';

/* =========================================================================
   TYPE DEFINITIONS
   ========================================================================= */

type DivisionType = 'vehicles' | 'commercial';
type SubViewType = 'overview' | 'land-cruiser' | 'trucks';

interface PassengerCategory {
  index: string;
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  families: string[];
  isFeatured?: boolean;
}

interface CommercialCategory {
  index: string;
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  capacity: string;
  isFeatured?: boolean;
}

interface LandCruiserSeries {
  series: string;
  code: string;
  years: string;
  headline: string;
  description: string;
  engineSpecs: string;
  image: string;
  status: 'In Stock' | 'Auction Sourcing' | 'Partner Stock';
  stockSlug?: string;
  filterHref: string;
  sourcingHref: string;
}

interface TruckManufacturer {
  brand: string;
  tagline: string;
  country: string;
  image: string;
  description: string;
  models: {
    name: string;
    classType: string;
    tonnage: string;
  }[];
  applications: string[];
  filterHref: string;
  sourcingHref: string;
}

/* =========================================================================
   DATA DEFINITIONS (100% AUTHENTIC JAPANESE AUTOMOTIVE MODELS)
   ========================================================================= */

const PASSENGER_CATEGORIES: PassengerCategory[] = [
  {
    index: '01',
    id: 'suvs-4x4',
    name: 'SUVs & 4x4',
    subtitle: 'Land Cruiser · Prado · Harrier · RAV4 · Jimny · Patrol',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=SUVs+%26+4x4',
    families: ['Land Cruiser', 'Prado', 'Jimny', 'Harrier', 'RAV4', 'Raize'],
    isFeatured: true,
  },
  {
    index: '02',
    id: 'mpvs-minivans',
    name: 'MPVs & Minivans',
    subtitle: 'Alphard · Vellfire · Hiace · Serena · Stepwgn · Delica',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Vans+%26+MPVs',
    families: ['Alphard', 'Vellfire', 'Hiace VIP', 'Serena', 'Stepwgn', 'Delica D:5'],
  },
  {
    index: '03',
    id: 'sedans',
    name: 'Sedans',
    subtitle: 'Toyota Crown · Century · Camry · Corolla · Nissan Skyline',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Sedans+%26+Hatchbacks',
    families: ['Crown', 'Century', 'Camry', 'Corolla', 'Skyline'],
  },
  {
    index: '04',
    id: 'sports-performance',
    name: 'Sports Cars',
    subtitle: 'Nissan GT-R · Fairlady Z · Porsche 911 · Supra · Civic Type R',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Luxury+%26+Performance',
    families: ['GT-R NISMO', 'Fairlady Z', '911 Carrera', 'Supra', 'Civic Type R'],
  },
  {
    index: '05',
    id: 'hatchbacks',
    name: 'Hatchbacks',
    subtitle: 'Suzuki Swift · Toyota Aqua · Yaris · Honda Fit',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Sedans+%26+Hatchbacks',
    families: ['Swift RS', 'Aqua Hybrid', 'Yaris Cross', 'Fit e:HEV'],
  },
  {
    index: '06',
    id: 'coupes-convertibles',
    name: 'Coupes & Convertibles',
    subtitle: 'Lexus LC 500 · Mazda Roadster / Miata · Fairlady Z 6MT',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Luxury+%26+Performance',
    families: ['Lexus LC', 'Roadster', '86 / BRZ', 'Fairlady Z'],
  },
  {
    index: '07',
    id: 'kei-cars',
    name: 'Kei Cars',
    subtitle: 'Suzuki Hustler · Spacia · Daihatsu Tanto · Honda N-BOX',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Right-Hand+Drive',
    families: ['Hustler', 'N-BOX Custom', 'Tanto Custom', 'Spacia Gear'],
  },
  {
    index: '08',
    id: 'hybrid-electric',
    name: 'Hybrid & Electric',
    subtitle: 'Lexus LX 700h · Honda Vezel e:HEV · Prius · Nissan Leaf',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Hybrid',
    families: ['LX 700h Hybrid', 'Vezel e:HEV', 'Prius PHEV', 'Ariya'],
  },
];

const COMMERCIAL_CATEGORIES: CommercialCategory[] = [
  {
    index: '01',
    id: 'trucks-main',
    name: 'Trucks',
    subtitle: 'Isuzu Elf & Forward · Hino Dutro · Fuso Canter · UD Quon',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: '2.0T to 25.0T Payload',
    isFeatured: true,
  },
  {
    index: '02',
    id: 'light-commercial',
    name: 'Light Commercial Vehicles',
    subtitle: 'Toyota Dyna · Isuzu Elf 2T · Nissan Atlas · TownAce',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: '1.5T to 3.5T GVW',
  },
  {
    index: '03',
    id: 'heavy-duty',
    name: 'Heavy-Duty & Prime Movers',
    subtitle: 'Isuzu Giga · Hino Profia · Fuso Super Great · UD Quon',
    image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: '10T to 45T GCW',
  },
  {
    index: '04',
    id: 'dump-trucks',
    name: 'Dump Trucks & Tippers',
    subtitle: 'Hydraulic Tippers · ShinMaywa & Kyokuto Bodies',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: '2T, 4T & 10T Tippers',
  },
  {
    index: '05',
    id: 'refrigerated',
    name: 'Refrigerated & Cold Chain',
    subtitle: 'Sub-Zero Freezers · Topre & Denso Chilled Box Units',
    image: 'https://images.unsplash.com/photo-1586191582152-ee6e40d046d1?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: '-30°C to +15°C Range',
  },
  {
    index: '06',
    id: 'box-trucks',
    name: 'Box Trucks & Wing-Body',
    subtitle: 'Dry Freight Aluminum Vans · Power Liftgates · Wing Siders',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: 'Dry Cargo & Distribution',
  },
  {
    index: '07',
    id: 'buses-coaches',
    name: 'Buses & Coaches',
    subtitle: 'Hino Selega · Isuzu Gala · Mitsubishi Aero Queen (30–50 Seats)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Vans+%26+MPVs',
    capacity: '30 to 55 Passenger Seats',
  },
  {
    index: '08',
    id: 'minibuses',
    name: 'Minibuses & Commuters',
    subtitle: 'Toyota Coaster · Nissan Civilian · Mitsubishi Rosa (14–29 Seats)',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Vans+%26+MPVs',
    capacity: '14 to 29 Passenger Seats',
  },
  {
    index: '09',
    id: 'pickup-trucks',
    name: 'Pickup Trucks',
    subtitle: 'Toyota Hilux GR Sport · Double Cab 4x4 · Commercial Spec',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Trucks+%26+Commercial',
    capacity: '1.0T Payload · 3.5T Towing',
  },
  {
    index: '10',
    id: 'cargo-vans',
    name: 'Vans & Cargo Vans',
    subtitle: 'Toyota Hiace Van Long DX/GL · Nissan NV350 Caravan',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?body=Vans+%26+MPVs',
    capacity: '1,000kg to 1,250kg Cargo',
  },
  {
    index: '11',
    id: 'special-purpose',
    name: 'Special Purpose Vehicles',
    subtitle: 'Unic Crane Trucks · Aerial Work Platforms · Garbage Compactors',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    href: '/vehicles?category=Commercial+Vehicles',
    capacity: 'Municipal & Engineering',
  },
  {
    index: '12',
    id: 'construction-industrial',
    name: 'Construction & Industrial',
    subtitle: 'Forklifts (Toyota/Komatsu) · Mini Excavators · Concrete Mixers',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    href: '/request-a-vehicle?category=Industrial',
    capacity: 'Industrial Equipment',
  },
];

const LAND_CRUISER_SERIES: LandCruiserSeries[] = [
  {
    series: 'Land Cruiser 300 Series',
    code: '3BA-VJA300W / 3DF-FJA300W',
    years: '2021 – Present',
    headline: 'Flagship Modern Luxury Expedition',
    description:
      'The pinnacle of modern Land Cruiser engineering. Built on the rigid TNGA-F ladder frame with electronic E-KDSS, Multi-Terrain Monitor, Fingerprint authentication, and twin-turbo powertrains.',
    engineSpecs: '3.5L V6 Twin-Turbo (415 PS) / 3.3L V6 Twin-Turbo Diesel (309 PS) · 10-Speed AT',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    status: 'In Stock',
    stockSlug: '/vehicles/2022-toyota-land-cruiser-300-zx-3ba-vja300w',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+300',
  },
  {
    series: 'Land Cruiser 250 Series',
    code: 'GDJ250W / TRJ250W',
    years: '2024 – Present',
    headline: 'Purposeful Next-Gen Heritage 4x4',
    description:
      'The core practical Land Cruiser model returning to clean geometric upright proportions. Features full-time 4WD, electric power steering, stabilizer disconnect mechanism (SDM), and Toyota Safety Sense.',
    engineSpecs: '2.8L 1GD-FTV Turbo Diesel (204 PS) / 2.7L 2TR-FE Dual VVT-i Petrol',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    status: 'Auction Sourcing',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+250',
  },
  {
    series: 'Land Cruiser 70 Series',
    code: '3DF-GDJ76W / GRJ79 Heavy Duty',
    years: '1984 – Present (Re-Released 2024)',
    headline: 'Indestructible Heavy-Duty Workhorse',
    description:
      'The legendary live-axle overland benchmark built for military, mining, and extreme expedition reliability. Unrivalled durability with manual transfer case and mechanical differential locks.',
    engineSpecs: '2.8L 1GD-FTV Diesel (6-Speed Super ECT) / 4.5L 1VD-FTV V8 Diesel',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    status: 'Partner Stock',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+70',
  },
  {
    series: 'Land Cruiser 200 Series',
    code: 'CBA-URJ202W / UZJ200W',
    years: '2007 – 2021',
    headline: 'Continent-Crossing V8 Luxury Benchmark',
    description:
      'Renowned naturally aspirated V8 reliability with KDSS hydraulic suspension and Crawl Control. Highly sought after worldwide for bulletproof longevity and VIP armored conversions.',
    engineSpecs: '4.6L 1UR-FE V8 (318 PS) / 5.7L 3UR-FE V8 (381 PS) · 6-Speed / 8-Speed AT',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    status: 'Partner Stock',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+200',
  },
  {
    series: 'Land Cruiser Prado 150 Series',
    code: '3BA-TRJ150W / 3DF-GDJ150W',
    years: '2009 – 2023',
    headline: 'Global 7-Seater Luxury Mid-Size 4x4',
    description:
      'The worldwide favourite versatile luxury off-roader. Premium leather appointments, sunroof, electric 3rd row folding, and accessible maintenance with JEVIC certified export history.',
    engineSpecs: '2.7L 2TR-FE (163 PS) / 2.8L 1GD-FTV Clean Diesel (204 PS) · 6-Speed AT',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    status: 'In Stock',
    stockSlug: '/vehicles/2022-toyota-land-cruiser-prado-tx-l-3ba-trj150w',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser+Prado',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+Prado',
  },
  {
    series: 'Land Cruiser Prado 120 Series',
    code: 'CBA-TRJ120W / RZJ120W',
    years: '2002 – 2009',
    headline: 'Proven Overland Durability & High Value',
    description:
      'Celebrated for its straightforward mechanical layout, Torsen limited-slip differential, and remarkable low total cost of ownership across Asia, Africa, and island markets.',
    engineSpecs: '2.7L 3RZ/2TR Petrol / 3.4L 5VZ-FE / 4.0L 1GR-FE V6',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    status: 'Auction Sourcing',
    filterHref: '/vehicles?make=Toyota&model=Land+Cruiser+Prado',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Land+Cruiser+Prado',
  },
];

const TRUCK_MANUFACTURERS: TruckManufacturer[] = [
  {
    brand: 'Isuzu Motors Japan',
    tagline: 'Japan’s #1 Commercial Diesel Truck Builder',
    country: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80',
    description:
      'Renowned for bulletproof 4JJ1 and 6HK1 clean diesel powertrains, high thermal efficiency, and minimal downtime across global distribution networks.',
    models: [
      { name: 'ELF Series (N-Series)', classType: 'Light-Duty Truck', tonnage: '2.0T – 4.5T Payload' },
      { name: 'FORWARD Series (F-Series)', classType: 'Medium-Duty Cargo', tonnage: '4.0T – 11.0T GVW' },
      { name: 'GIGA Series (C&E Series)', classType: 'Heavy Tractor & Tipper', tonnage: '10.0T – 25.0T GCW' },
    ],
    applications: ['Hydraulic Dumpers', 'Freezer Boxes', 'Dry Freight Wing-Bodies', 'Flatbed Haulers'],
    filterHref: '/vehicles?category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=Isuzu&category=Trucks',
  },
  {
    brand: 'Hino Motors (Toyota Group)',
    tagline: 'Premium Heavy Logistics & Long-Distance Transit',
    country: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80',
    description:
      'The heavy-duty logistics arm of the Toyota Group. Legendary cabin ergonomics, air suspension chassis, and robust J05 and A09 diesel engines.',
    models: [
      { name: 'DUTRO Series', classType: 'Urban Light Distribution', tonnage: '2.0T – 3.5T Payload' },
      { name: 'RANGER Series', classType: 'Medium Haulage Benchmark', tonnage: '4.0T – 12.0T Payload' },
      { name: 'PROFIA Series', classType: 'Heavy Long-Haul Prime Mover', tonnage: '15.0T – 25.0T+ Tractor' },
    ],
    applications: ['Intercity Wing-Bodies', 'Container Chassis', 'Heavy Dumpers', 'Cold-Chain Transport'],
    filterHref: '/vehicles?category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=Hino&category=Trucks',
  },
  {
    brand: 'Mitsubishi Fuso Truck & Bus',
    tagline: 'Global Commercial Engineering & Daimler Alliance',
    country: 'Kawasaki, Japan',
    image: 'https://images.unsplash.com/photo-1586191582152-ee6e40d046d1?auto=format&fit=crop&w=900&q=80',
    description:
      'Home to the iconic Canter, the world’s most exported light commercial truck. Combining German Daimler quality control with Japanese manufacturing precision.',
    models: [
      { name: 'CANTER Series', classType: 'Global Light Truck Champion', tonnage: '2.0T – 4.5T Payload' },
      { name: 'FIGHTER Series', classType: 'Medium-Duty Workhorse', tonnage: '4.0T – 9.0T Payload' },
      { name: 'SUPER GREAT Series', classType: 'Heavy Haulage Flagship', tonnage: '10.0T – 25.0T Gross' },
    ],
    applications: ['Refrigerated Cold-Storage', 'Garbage Compactors', 'Crane Mount Trucks', 'Box Bodies'],
    filterHref: '/vehicles?category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=Mitsubishi+Fuso&category=Trucks',
  },
  {
    brand: 'UD Trucks (Formerly Nissan Diesel)',
    tagline: 'High-Torque Heavy Powertrain Specialist',
    country: 'Saitama, Japan',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    description:
      'Engineered for extreme reliability under harsh operating conditions, steep topography, and heavy industrial duty cycles. Features the ESCOT automated transmission.',
    models: [
      { name: 'CONDOR Series', classType: 'Medium Urban Cargo', tonnage: '4.0T – 11.0T GVW' },
      { name: 'QUON Series', classType: 'Heavy-Duty 8x4 / Tractor Head', tonnage: '15.0T – 26.0T GCW' },
    ],
    applications: ['Heavy Quarry Dumpers', 'Bulk Fuel Tankers', 'Interstate Trailers', 'Concrete Mixers'],
    filterHref: '/vehicles?category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=UD+Trucks&category=Trucks',
  },
  {
    brand: 'Toyota Commercial Trucks',
    tagline: 'Unmatched Part Interchangeability & Reliability',
    country: 'Toyota City, Japan',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    description:
      'Compact cab-over platforms delivering exceptional turning radius in congested ports and urban centers. Supported by the global Toyota service footprint.',
    models: [
      { name: 'DYNA Series', classType: 'Light Cab-Over Commercial', tonnage: '1.5T – 3.5T Payload' },
      { name: 'TOYOACE Series', classType: 'Dropside Flatbed & Crew Cab', tonnage: '1.5T – 3.0T Payload' },
    ],
    applications: ['Dropside Flatbeds', 'Tailgate Lifters', 'Aerial Bucket Platforms', 'City Delivery'],
    filterHref: '/vehicles?make=Toyota&category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=Toyota&model=Dyna',
  },
  {
    brand: 'Nissan Commercial Trucks',
    tagline: 'Agile Urban Distribution Platforms',
    country: 'Yokohama, Japan',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80',
    description:
      'Engineered for nimble navigation, low loading heights, and easy cabin access for regional logistics and service technicians.',
    models: [
      { name: 'ATLAS Series (F24 / H43)', classType: 'Light Urban Commercial', tonnage: '1.5T – 3.5T Payload' },
      { name: 'CONDOR Legacy Series', classType: 'Medium Distribution', tonnage: '4.0T – 7.0T Payload' },
    ],
    applications: ['City Freight', 'Moving Box Vans', 'Dropside Tippers', 'Municipal Maintenance'],
    filterHref: '/vehicles?make=Nissan&category=Commercial+Vehicles',
    sourcingHref: '/request-a-vehicle?make=Nissan&model=Atlas',
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export function VehicleDiscoveryExperience() {
  const [division, setDivision] = useState<DivisionType>('vehicles');
  const [subView, setSubView] = useState<SubViewType>('overview');

  const sectionId = useId();

  // Switch division resets subView back to root overview
  const handleDivisionChange = (newDivision: DivisionType) => {
    setDivision(newDivision);
    setSubView('overview');
  };

  return (
    <section
      id={`vehicle-discovery-experience-${sectionId}`}
      className="w-full bg-white border-t border-neutral-200 py-12 sm:py-16 selection:bg-[#ff6a00] selection:text-white"
      aria-label="Vehicle Categories Discovery Experience"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION HEADER: EDITORIAL APEX & TECHNICAL BADGES */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-neutral-500 font-mono text-[11px] uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#ff6a00] inline-block" />
              <span>Direct Japan Sourcing · Physical Stock & Auction Access</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight uppercase leading-none">
              Explore Our <span className="text-[#ff6a00]">Vehicle Collection</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2.5 max-w-2xl font-medium leading-relaxed">
              Discover Japan’s automotive excellence. Explore an extensive collection of passenger vehicles and commercial transport solutions, sourced directly from Japan for global markets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-[#ff6a00] text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-sm group"
            >
              <span>View All Inventory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DIVISION SELECTOR: VEHICLES vs. COMMERCIAL VEHICLES */}
        {/* ================================================================= */}
        <div className="mt-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-1.5 bg-neutral-100 border border-neutral-200">
            {/* Division A: VEHICLES */}
            <button
              type="button"
              onClick={() => handleDivisionChange('vehicles')}
              className={`relative flex items-center justify-between p-4 sm:p-5 text-left transition-all duration-200 rounded-none ${division === 'vehicles'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50 border border-neutral-200'
                }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 rounded-none transition-colors ${division === 'vehicles' ? 'bg-[#ff6a00] text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                >
                  <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-[#ff6a00] font-bold uppercase">
                      DIVISION 01
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-mono uppercase tracking-wider ${division === 'vehicles'
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-neutral-200 text-neutral-600'
                        }`}
                    >
                      8 Categories
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    Vehicles
                  </h3>
                  <p
                    className={`text-xs mt-0.5 line-clamp-1 font-medium ${division === 'vehicles' ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                  >
                    Passenger Cars · Luxury SUVs · Executive MPVs · Sports · Hybrids
                  </p>
                </div>
              </div>

              {division === 'vehicles' && (
                <div className="hidden sm:flex items-center text-[#ff6a00] text-xs font-mono font-bold uppercase tracking-wider gap-1">
                  <span>Active</span>
                  <span className="w-2 h-2 bg-[#ff6a00] rounded-full animate-pulse" />
                </div>
              )}
            </button>

            {/* Division B: COMMERCIAL VEHICLES */}
            <button
              type="button"
              onClick={() => handleDivisionChange('commercial')}
              className={`relative flex items-center justify-between p-4 sm:p-5 text-left transition-all duration-200 rounded-none ${division === 'commercial'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50 border border-neutral-200'
                }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 rounded-none transition-colors ${division === 'commercial' ? 'bg-[#ff6a00] text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                >
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-[#ff6a00] font-bold uppercase">
                      DIVISION 02
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-mono uppercase tracking-wider ${division === 'commercial'
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-neutral-200 text-neutral-600'
                        }`}
                    >
                      12 Categories
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    Commercial Vehicles
                  </h3>
                  <p
                    className={`text-xs mt-0.5 line-clamp-1 font-medium ${division === 'commercial' ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                  >
                    Isuzu, Hino, Fuso, UD Trucks · Buses · Cargo Vans · Heavy Duty
                  </p>
                </div>
              </div>

              {division === 'commercial' && (
                <div className="hidden sm:flex items-center text-[#ff6a00] text-xs font-mono font-bold uppercase tracking-wider gap-1">
                  <span>Active</span>
                  <span className="w-2 h-2 bg-[#ff6a00] rounded-full animate-pulse" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* INTERACTIVE BREADCRUMB BAR WITH SMOOTH DRILL-DOWN / BACK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between py-3 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider border border-neutral-800 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-neutral-400">COLLECTION</span>
            <span className="text-neutral-600">/</span>
            <button
              type="button"
              onClick={() => setSubView('overview')}
              className={`hover:text-[#ff6a00] transition-colors ${subView === 'overview' ? 'text-[#ff6a00] font-bold' : 'text-neutral-300'
                }`}
            >
              {division === 'vehicles' ? 'PASSENGER VEHICLES' : 'COMMERCIAL TRANSPORT'}
            </button>

            {subView === 'land-cruiser' && (
              <>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-400">SUVs & 4x4</span>
                <span className="text-neutral-600">/</span>
                <span className="text-[#ff6a00] font-bold">TOYOTA LAND CRUISER FAMILY</span>
              </>
            )}

            {subView === 'trucks' && (
              <>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-400">TRUCKS</span>
                <span className="text-neutral-600">/</span>
                <span className="text-[#ff6a00] font-bold">JAPANESE TRUCK COLLECTION</span>
              </>
            )}
          </div>

          {subView !== 'overview' && (
            <button
              type="button"
              onClick={() => setSubView('overview')}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#ff6a00] hover:text-white font-bold transition-colors ml-4 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Categories</span>
            </button>
          )}
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: VEHICLES DIVISION – OVERVIEW */}
        {/* ================================================================= */}
        {division === 'vehicles' && subView === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* DOMINANT EDITORIAL SPOTLIGHT: TOYOTA LAND CRUISER FAMILY */}
            <div className="relative bg-neutral-900 text-white overflow-hidden border border-neutral-800 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
                {/* Visual Imagery */}
                <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85"
                    alt="Toyota Land Cruiser 300 Series Flagship 4x4"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover object-center scale-102 hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#ff6a00] text-white text-[10px] font-mono font-black uppercase tracking-widest">
                      FEATURED FAMILY · 01
                    </span>
                    <span className="px-2 py-1 bg-black/80 backdrop-blur-xs text-neutral-300 text-[10px] font-mono uppercase tracking-wider border border-neutral-700">
                      JAPAN DIRECT 4X4
                    </span>
                  </div>
                </div>

                {/* Editorial Copy & Interactive Sizing */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 bg-neutral-900/90 lg:bg-transparent">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                      Toyota Motor Corporation · Tahara & Yoshiwara Plants
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      Toyota <span className="text-[#ff6a00]">Land Cruiser</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-3 font-medium">
                      Explore the legendary Land Cruiser family. Discover iconic Japanese 4x4 vehicles engineered for exceptional performance, durability, and off-road capability. Covering all major generations from the modern 300 & 250 series to the heavy-duty 70, 200, and Prado lines.
                    </p>

                    {/* Generation Series Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-5">
                      {['300 Series', '250 Series', '70 Series', '200 Series', 'Prado 150', 'Prado 120'].map(
                        (ser, idx) => (
                          <div
                            key={idx}
                            className="bg-neutral-800/80 border border-neutral-700/80 px-2 py-1.5 text-center"
                          >
                            <span className="block font-mono text-[9px] text-[#ff6a00] font-bold">LC GEN</span>
                            <span className="text-[11px] font-black text-white truncate block">{ser}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Call to Actions */}
                  <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setSubView('land-cruiser')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-md group"
                    >
                      <span>Explore Land Cruiser Series</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                      href="/vehicles?make=Toyota&model=Land+Cruiser"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider rounded-none border border-neutral-700 transition-colors"
                    >
                      <span>View In-Stock (FOB Japan)</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICKSTRIP: FEATURED JAPANESE MODEL FAMILIES */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>Featured Japanese Model Families</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Select a flagship family to inspect available stock
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  //{ name: 'Toyota Land Cruiser', action: () => setSubView('land-cruiser'), isSpecial: true },
                  { name: 'Toyota Land Cruser', href: '/vehicles?make=Toyota&model=Land+C+land-cruiser' },
                  { name: 'Toyota Prado', href: '/vehicles?make=Toyota&model=Land+Cruiser+Prado' },
                  { name: 'Toyota Alphard', href: '/vehicles?make=Toyota&model=Alphard' },
                  { name: 'Toyota Vellfire', href: '/vehicles?make=Toyota&model=Vellfire' },
                  { name: 'Toyota Hiace VIP', href: '/vehicles?make=Toyota&model=Hiace' },
                  { name: 'Toyota Harrier', href: '/vehicles?make=Toyota' },
                  { name: 'Toyota RAV4', href: '/vehicles?make=Toyota' },
                  { name: 'Nissan GT-R NISMO', href: '/vehicles?make=Nissan&model=GT-R' },
                  { name: 'Nissan Patrol', href: '/vehicles?make=Nissan' },
                  { name: 'Lexus LX 600 / 700h', href: '/vehicles?make=Lexus' },
                  { name: 'Suzuki Jimny Sierra', href: '/vehicles?make=Suzuki&model=Jimny+Sierra' },
                  { name: 'Honda Vezel e:HEV', href: '/vehicles?make=Honda&model=Vezel' },
                  { name: 'Porsche 911 Carrera', href: '/vehicles?make=Porsche' },
                ].map((item, i) =>
                  /*item.action ? (
                    <button
                      key={i}
                      type="button"
                      onClick={item.action}
                      className="px-3 py-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      <CornerDownRight className="w-3 h-3" />
                    </button>
                  ) : */(
                  <Link
                    key={i}
                    href={item.href || '/vehicles'}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
                  >
                    {item.name}
                  </Link>
                )
                )}
              </div>
            </div>

            {/* ASYMMETRICAL EDITORIAL CATEGORY CARDS (PASSENGER) */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
                  Passenger Vehicle Categories [01 — 08]
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  Browse by body structure & operational classification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PASSENGER_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="group relative bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                  >
                    {/* Image Area */}
                    <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black text-white bg-black/80 px-2 py-0.5 border border-neutral-700">
                          {cat.index}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#ff6a00] transition-colors leading-tight">
                          {cat.name}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-3">
                          {cat.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cat.families.slice(0, 3).map((fam, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 border border-neutral-200 uppercase"
                            >
                              {fam}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        {cat.id === 'suvs-4x4' ? (
                          <button
                            type="button"
                            onClick={() => setSubView('land-cruiser')}
                            className="text-[11px] font-bold text-[#ff6a00] hover:text-[#e55f00] inline-flex items-center gap-1"
                          >
                            <span>Explore LC Family</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <Link
                            href={cat.href}
                            className="text-[11px] font-bold text-neutral-900 group-hover:text-[#ff6a00] inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Explore Category</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={cat.href}
                          className="w-6 h-6 bg-neutral-100 group-hover:bg-[#ff6a00] group-hover:text-white flex items-center justify-center transition-colors text-neutral-600"
                          title={`View ${cat.name} in inventory`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: TOYOTA LAND CRUISER DEDICATED FAMILY DISCOVERY */}
        {/* ================================================================= */}
        {division === 'vehicles' && subView === 'land-cruiser' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Grand Land Cruiser Header Banner */}
            <div className="relative bg-neutral-900 text-white border border-neutral-800 overflow-hidden">
              <div className="relative min-h-[300px] sm:min-h-[340px] flex items-center">
                <Image
                  src="https://images.unsplash.com/photo-1598113972648-a4c7a44b2bec?auto=format&fit=crop&w=1600&q=85"
                  alt="Toyota Land Cruiser Family Expedition Lineup"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent w-full md:w-[75%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ff6a00] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                      OFFICIAL MODEL FAMILY DISCOVERY
                    </span>
                    <span className="text-neutral-400 font-mono text-xs">· TOYOTA 4X4 SERIES</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                    Toyota Land Cruiser
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                    Explore the legendary Land Cruiser family. Discover iconic Japanese 4x4 vehicles engineered for exceptional performance, durability, and off-road capability.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubView('overview')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to All Categories</span>
                    </button>
                    <Link
                      href="/vehicles?make=Toyota&model=Land+Cruiser"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Browse All Land Cruiser Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Land Cruiser Model Series Cards */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
                  Select a Land Cruiser Generation Series
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  6 Core Generations Available for Export
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {LAND_CRUISER_SERIES.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md group"
                  >
                    <div>
                      {/* Series Image */}
                      <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.series}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-white bg-black/85 px-2 py-0.5 border border-neutral-700">
                            GEN 0{index + 1}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold ${item.status === 'In Stock'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#ff6a00] transition-colors leading-tight">
                            {item.series}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-300 block">
                            {item.years} · {item.code}
                          </span>
                        </div>
                      </div>

                      {/* Series Specs & Description */}
                      <div className="p-4 space-y-2.5">
                        <p className="text-xs text-neutral-700 font-semibold leading-snug">
                          {item.headline}
                        </p>
                        <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                          {item.description}
                        </p>
                        <div className="p-2 bg-neutral-50 border border-neutral-200 text-[10px] font-mono text-neutral-700">
                          <span className="font-bold text-[#ff6a00] uppercase block">Drivetrain:</span>
                          <span className="truncate block">{item.engineSpecs}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-2 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
                      {item.stockSlug ? (
                        <Link
                          href={item.stockSlug}
                          className="flex-1 text-center py-2.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                        >
                          View In-Stock Unit
                        </Link>
                      ) : (
                        <Link
                          href={item.filterHref}
                          className="flex-1 text-center py-2.5 bg-neutral-900 hover:bg-[#ff6a00] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Filter Inventory
                        </Link>
                      )}
                      <Link
                        href={item.sourcingHref}
                        className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors text-center"
                        title="Request sourcing quotation"
                      >
                        Source Unit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: COMMERCIAL VEHICLES DIVISION – OVERVIEW */}
        {/* ================================================================= */}
        {division === 'commercial' && subView === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* DOMINANT EDITORIAL SPOTLIGHT: JAPANESE TRUCK COLLECTION */}
            <div className="relative bg-neutral-900 text-white overflow-hidden border border-neutral-800 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
                {/* Truck Visual Imagery */}
                <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=85"
                    alt="Japanese Commercial Trucks Fleet Isuzu Hino Fuso"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover object-center scale-102 hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#ff6a00] text-white text-[10px] font-mono font-black uppercase tracking-widest">
                      FEATURED FLEET · 01
                    </span>
                    <span className="px-2 py-1 bg-black/80 backdrop-blur-xs text-neutral-300 text-[10px] font-mono uppercase tracking-wider border border-neutral-700">
                      COMMERCIAL & LOGISTICS
                    </span>
                  </div>
                </div>

                {/* Editorial Copy */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 bg-neutral-900/90 lg:bg-transparent">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                      Isuzu · Hino · Mitsubishi Fuso · UD Trucks · Toyota · Nissan
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      Japanese <span className="text-[#ff6a00]">Truck Collection</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-3 font-medium">
                      Explore reliable Japanese commercial trucks engineered for logistics, construction, distribution, and industrial operations. Direct export with containerization and Ro-Ro shipping to Colombo, Nhava Sheva, Mombasa, Dar es Salaam, and global ports.
                    </p>

                    {/* Truck Manufacturer Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-5">
                      {['ISUZU (Elf/Giga)', 'HINO (Profia)', 'FUSO (Canter)', 'UD TRUCKS', 'TOYOTA DYNA', 'NISSAN ATLAS'].map(
                        (mk, idx) => (
                          <div
                            key={idx}
                            className="bg-neutral-800/80 border border-neutral-700/80 px-2 py-1.5 text-center"
                          >
                            <span className="block font-mono text-[9px] text-[#ff6a00] font-bold">OEM</span>
                            <span className="text-[11px] font-black text-white truncate block">{mk}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setSubView('trucks')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-md group"
                    >
                      <span>Explore Truck Manufacturers</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                      href="/vehicles?category=Commercial+Vehicles"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider rounded-none border border-neutral-700 transition-colors"
                    >
                      <span>View Commercial Stock</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMERCIAL CATEGORIES GRID (12 SPECIALIZED COMMERCIAL CATEGORIES) */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
                  Commercial Transport Categories [01 — 12]
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  Engineered for distribution, construction, passenger transit & haulage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COMMERCIAL_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="group relative bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                  >
                    {/* Visual */}
                    <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black text-white bg-black/80 px-2 py-0.5 border border-neutral-700">
                          {cat.index}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-300 bg-neutral-900/80 px-1.5 py-0.5 border border-neutral-700">
                          {cat.capacity}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#ff6a00] transition-colors leading-tight">
                          {cat.name}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-3">
                          {cat.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        {cat.id === 'trucks-main' ? (
                          <button
                            type="button"
                            onClick={() => setSubView('trucks')}
                            className="text-[11px] font-bold text-[#ff6a00] hover:text-[#e55f00] inline-flex items-center gap-1"
                          >
                            <span>Explore Truck Makers</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <Link
                            href={cat.href}
                            className="text-[11px] font-bold text-neutral-900 group-hover:text-[#ff6a00] inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Explore Category</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={cat.href}
                          className="w-6 h-6 bg-neutral-100 group-hover:bg-[#ff6a00] group-hover:text-white flex items-center justify-center transition-colors text-neutral-600"
                          title={`View ${cat.name} in inventory`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: JAPANESE TRUCKS DEDICATED DISCOVERY (MANUFACTURERS & FAMILIES) */}
        {/* ================================================================= */}
        {division === 'commercial' && subView === 'trucks' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Grand Truck Header Banner */}
            <div className="relative bg-neutral-900 text-white border border-neutral-800 overflow-hidden">
              <div className="relative min-h-[300px] sm:min-h-[340px] flex items-center">
                <Image
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=85"
                  alt="Japanese Commercial Trucks Haulage Lineup"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent w-full md:w-[75%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ff6a00] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                      COMMERCIAL DISCOVERY
                    </span>
                    <span className="text-neutral-400 font-mono text-xs">· OEM HAULAGE & LOGISTICS</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                    Japanese Truck Collection
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                    Explore reliable Japanese commercial trucks engineered for logistics, construction, distribution, and industrial operations.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubView('overview')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to All Categories</span>
                    </button>
                    <Link
                      href="/vehicles?category=Commercial+Vehicles"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Browse Available Commercial Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Japanese Truck Manufacturers Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
                  Select a Japanese Truck Manufacturer & Explore Model Families
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  6 Core Japanese OEMs Represented
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {TRUCK_MANUFACTURERS.map((oem, index) => (
                  <div
                    key={index}
                    className="bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md group"
                  >
                    <div>
                      {/* Manufacturer Image */}
                      <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden">
                        <Image
                          src={oem.image}
                          alt={oem.brand}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-white bg-black/85 px-2 py-0.5 border border-neutral-700">
                            OEM 0{index + 1}
                          </span>
                          <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700">
                            {oem.country}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#ff6a00] transition-colors leading-tight">
                            {oem.brand}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-300 block">
                            {oem.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Models & Lineage */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                          {oem.description}
                        </p>

                        {/* Model Families in this OEM */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono font-bold text-neutral-900 uppercase block">
                            Supported Model Ranges:
                          </span>
                          {oem.models.map((mod, mi) => (
                            <div
                              key={mi}
                              className="p-2 bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-black text-neutral-900 uppercase">{mod.name}</span>
                                <span className="block text-[10px] text-neutral-500">{mod.classType}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#ff6a00] bg-orange-50 px-1.5 py-0.5 border border-orange-200">
                                {mod.tonnage}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Applications */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {oem.applications.map((app, ai) => (
                            <span
                              key={ai}
                              className="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-2 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
                      <Link
                        href={oem.filterHref}
                        className="flex-1 text-center py-2.5 bg-neutral-900 hover:bg-[#ff6a00] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Explore Stock
                      </Link>
                      <Link
                        href={oem.sourcingHref}
                        className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors text-center"
                        title="Request quotation for this brand"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
