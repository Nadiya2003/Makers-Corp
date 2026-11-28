require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Article = require('./models/Article');
const SiteSettings = require('./models/SiteSettings');

// Sample real vehicles from verified Makers Corp Japan data
const realVehicles = [
  {
    name: "2026 Toyota Raize Z Package",
    stockId: "MCJ-2026-8901",
    slug: "2026-toyota-raize-z-package-5ba-a200a",
    make: "Toyota",
    model: "Raize",
    modelCode: "5BA-A200A",
    year: 2026,
    conditionGrade: "Grade S/A (Brand New)",
    inspectionStatus: "Makers Certified 150-Point & JEVIC Passed",
    mileage: "15 km",
    mileageKm: 15,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "RHD (2WD)",
    engineCc: 996,
    engineCapacity: "996 cc",
    bodyType: "SUV",
    exteriorColor: "Silver Metallic",
    fobPort: "FOB NAGOYA",
    priceUSD: 39000,
    priceFOB: "USD 39,000",
    price: "USD 39,000",
    isAvailable: true,
    availability: "Available in Japan Yard",
    sourceType: "Physical Stock (Japan Yard)",
    category: "SUV",
    isFeatured: true,
    status: "Available",
    image: "https://res.cloudinary.com/gfyrhihe/image/upload/v1794198075/assets/nd47o9jilrxpuiox6hvj.jpg",
    images: [
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794198075/assets/nd47o9jilrxpuiox6hvj.jpg",
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794198079/assets/xb37obnbapcljic0iuoo.jpg",
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794198081/assets/eyfvjkjqdnlwp8gm9zy4.jpg",
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794198087/assets/azzdminhoekdwliebrid.jpg"
    ],
    keyFeatures: [
      "Genuine Japanese vehicle sourcing",
      "Competitive sourcing prices",
      "Transparent import process",
      "Vehicle selection and inspection in Japan",
      "Professional support from Japan to destination port"
    ],
    overview: "2026 Toyota Raize Z Package — Direct from Japan Yard. Inspected and ready for Ro-Ro booking."
  },
  {
    name: "2026 Honda N-BOX Custom",
    stockId: "MCJ-2026-8902",
    slug: "2026-honda-n-box-custom-6ba-jf5",
    make: "Honda",
    model: "N-BOX",
    modelCode: "6BA-JF5",
    year: 2026,
    conditionGrade: "Grade S/A (Brand New)",
    inspectionStatus: "Makers Certified 150-Point & JEVIC Passed",
    mileage: "25 km",
    mileageKm: 25,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "RHD (2WD)",
    engineCc: 658,
    engineCapacity: "658 cc",
    bodyType: "Kei Cars",
    exteriorColor: "Crystal Black Pearl",
    fobPort: "FOB YOKOHAMA",
    priceUSD: 25500,
    priceFOB: "USD 25,500",
    price: "USD 25,500",
    isAvailable: true,
    availability: "Available in Japan Yard",
    sourceType: "Physical Stock (Japan Yard)",
    category: "Hatchback",
    isFeatured: true,
    status: "Available",
    image: "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200844/assets/iayyr5h6jgkgdgw62682.png",
    images: [
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200844/assets/iayyr5h6jgkgdgw62682.png",
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200853/assets/lvesmskpyryiexzjrnk9.png",
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200855/assets/y0urew25dgmgxtw1axv5.png"
    ],
    keyFeatures: [
      "Direct Japanese vehicle sourcing",
      "Spacious Honda Cabin",
      "Transparent purchasing process",
      "Reliable Ro-Ro shipping arrangements"
    ],
    overview: "2026 Honda N-BOX Custom — Direct from Japan. Superb city ergonomics and fuel economy."
  },
  {
    name: "2026 Suzuki Wagon R Custom Z Hybrid",
    stockId: "MCJ-2026-8903",
    slug: "2026-suzuki-wagon-r-custom-z-hybrid-5aa-mh95s",
    make: "Suzuki",
    model: "Wagon R",
    modelCode: "5AA-MH95S",
    year: 2026,
    conditionGrade: "Grade S/A (Brand New)",
    inspectionStatus: "Makers Certified 150-Point & JEVIC Passed",
    mileage: "10 km",
    mileageKm: 10,
    fuel: "Hybrid",
    transmission: "Automatic",
    drivetrain: "RHD (2WD)",
    engineCc: 657,
    engineCapacity: "657 cc",
    bodyType: "Kei Cars",
    exteriorColor: "Midnight Violet Metallic",
    fobPort: "FOB KOBE",
    priceUSD: 24000,
    priceFOB: "USD 24,000",
    price: "USD 24,000",
    isAvailable: true,
    availability: "Available in Japan Yard",
    sourceType: "Physical Stock (Japan Yard)",
    category: "Hatchback",
    isFeatured: true,
    status: "Available",
    image: "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200921/assets/a2q0o0l7g0i852mdfa45.png",
    images: [
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200921/assets/a2q0o0l7g0i852mdfa45.png"
    ],
    keyFeatures: [
      "Suzuki Smart Hybrid Technology",
      "Grade S/A delivery mileage",
      "Dual Sensor Brake Support II"
    ],
    overview: "2026 Suzuki Wagon R Custom Z Hybrid — Ultra-efficient commuter ready for immediate export."
  },
  {
    name: "2026 Toyota Raize Hybrid Z Dual-Tone",
    stockId: "MCJ-2026-8904",
    slug: "2026-toyota-raize-hybrid-z-dual-tone-5aa-a202a",
    make: "Toyota",
    model: "Raize",
    modelCode: "5AA-A202A",
    year: 2026,
    conditionGrade: "Grade S/A (Brand New)",
    inspectionStatus: "Makers Certified 150-Point & JEVIC Passed",
    mileage: "35 km",
    mileageKm: 35,
    fuel: "Hybrid",
    transmission: "Automatic",
    drivetrain: "RHD (2WD)",
    engineCc: 1198,
    engineCapacity: "1,198 cc",
    bodyType: "SUV",
    exteriorColor: "Pearl White / Black Roof Dual-Tone",
    fobPort: "FOB NAGOYA",
    priceUSD: 39000,
    priceFOB: "USD 39,000",
    price: "USD 39,000",
    isAvailable: true,
    availability: "Available in Japan Yard",
    sourceType: "Physical Stock (Japan Yard)",
    category: "SUV",
    isFeatured: true,
    status: "Available",
    image: "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200940/assets/x27bcfvovg953qefwylq.png",
    images: [
      "https://res.cloudinary.com/gfyrhihe/image/upload/v1794200940/assets/x27bcfvovg953qefwylq.png"
    ],
    keyFeatures: [
      "e-SMART Hybrid Electric Drive",
      "Factory Dual-Tone Aesthetic",
      "Toyota Safety Sense Active Suite"
    ],
    overview: "2026 Toyota Raize Hybrid Z Dual-Tone — Top-spec compact SUV directly from Japan Yard."
  }
];

const realArticles = [
  {
    title: "How Buying a Vehicle From Japan Works",
    slug: "how-buying-a-vehicle-from-japan-works",
    category: "BUYING GUIDES",
    readTime: "6 min",
    excerpt: "From selecting verified physical stock in Japanese yards to independent pre-export inspection, proforma agreement, and vessel tracking — understand the full export workflow.",
    coverImage: "/images/Japan Vehicle Export Guide.png",
    author: {
      name: "Kenji Takahashi",
      role: "Export Operations Desk, Tokyo"
    },
    isFeatured: true,
    isPublished: true,
    content: "Importing a motor vehicle directly from Japan has become the benchmark standard for international buyers seeking superior mechanical condition, documented service histories, and high factory specification. However, navigating international logistics, export inspections, and proforma terms requires a structured understanding of the export journey.\n\n### Stage 1: Stock Identification & Chassis Verification\nEvery legitimate export vehicle in Japan is accompanied by an Export Certificate (Massho) or De-Registration Document issued by Japan’s Ministry of Land, Infrastructure, Transport and Tourism (MLIT).\n\n### Stage 2: Destination Conformity Check\nBefore proceeding to a contract, our export compliance team verifies whether the vehicle meets destination-specific import laws.\n\n### Stage 3: Proforma Invoice & Transparent Quotation\nOnce a unit is shortlisted, a formal written Proforma Invoice is issued explicitly itemizing FOB and CIF costs.\n\n### Stage 4: Independent Pre-Shipment Inspection\nPrior to vessel loading, the vehicle is transported to designated inspection centers (JEVIC, JAAI, or QISJ) for impartial auditing.\n\n### Stage 5: Ocean Freight & Document Delivery\nVehicles are shipped either via Ro-Ro or container carrier with full DHL document tracking."
  },
  {
    title: "What to Check Before Requesting an Export Quote",
    slug: "what-to-check-before-requesting-an-export-quote",
    category: "BUYING GUIDES",
    readTime: "5 min",
    excerpt: "Avoid costly import delays by verifying age thresholds, emissions compliance, steering orientation, and port selection before requesting your written export proforma.",
    coverImage: "/images/Export Quote Checklist for Car Shipping.png",
    author: {
      name: "Hiroshi Sato",
      role: "Homologation Specialist, Yokohama"
    },
    isFeatured: false,
    isPublished: true,
    content: "Submitting a vehicle inquiry is the first step toward acquiring a Japan-sourced vehicle. However, international vehicle import is governed by rigid national customs protocols that vary dramatically by territory.\n\n### 1. Age Restrictions & Registration Dates\nMost importing countries calculate vehicle age based on the Japanese First Registration Date (Shoken date) rather than calendar year.\n\n### 2. Steering Configuration (RHD vs. LHD)\nWhile RHD is standard across Japan, the UK, Australia, New Zealand, India, Sri Lanka, and Cyprus, markets in the Americas and Europe often mandate Left-Hand Drive.\n\n### 3. Engine Capacity and Tariff Tiers\nIn many nations, customs duties scale with engine displacement. Verify local tariff schedules before finalizing.\n\n### 4. Nominated Discharge Port\nOcean freight rates and transit frequencies differ between primary hub ports and feeder ports."
  },
  {
    title: "Understanding Japanese Vehicle Inspection Standards: JEVIC, JAAI, & Auction Grades",
    slug: "understanding-japanese-auction-grading-and-inspection",
    category: "VEHICLE REVIEWS",
    readTime: "7 min",
    excerpt: "Demystifying auction grades from 3.5 to 5.0, interior condition scores, and third-party pre-export audits so you can buy with total technical confidence.",
    coverImage: "/images/Japanese Vehicle Inspection Standards Explained.png",
    author: {
      name: "Kenji Takahashi",
      role: "Export Operations Desk, Tokyo"
    },
    isFeatured: false,
    isPublished: true,
    content: "Japan is renowned for the world’s most meticulous and transparent automotive grading ecosystem. Unlike traditional used-car markets that rely on subjective dealer descriptions, Japanese auction houses and export agencies adhere to standardized evaluation rubrics.\n\n### The Overall Condition Grade Scale\n- Grade S / 6: Brand new or delivery-mileage vehicle (under 12 months old, virtually zero imperfections).\n- Grade 5.0: Superb condition with minimal mileage and pristine mechanical and body presentation.\n- Grade 4.5: Very high grade, clean interior and exterior with only minor microscopic blemishes.\n- Grade 4.0: Well-maintained daily driver, clean engine bay, normal age-appropriate wear.\n- Grade 3.5: Noticeable cosmetic scratches, stone chips, or higher mileage, mechanically sound.\n- Grade R / RA: Repair history with factory-standard panel replacement.\n\n### Pre-Export Odometer Certification\nOdometer rollback fraud is virtually nonexistent in authorized Japanese export channels because agencies like JEVIC cross-reference the digital readout against the MLIT national registration records."
  }
];

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Seed SiteSettings
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
      console.log('✅ Created default SiteSettings document');
    } else {
      console.log('ℹ️ SiteSettings document already exists');
    }

    // 2. Seed / Upsert Vehicles
    for (const vData of realVehicles) {
      await Vehicle.findOneAndUpdate(
        { stockId: vData.stockId },
        { $set: vData },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Upserted ${realVehicles.length} verified physical vehicles into MongoDB`);

    // 3. Seed / Upsert Articles
    for (const aData of realArticles) {
      await Article.findOneAndUpdate(
        { slug: aData.slug },
        { $set: aData },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Upserted ${realArticles.length} verified articles into MongoDB`);

    // 4. Ensure Super Admin
    let admin = await User.findOne({ email: 'admin@makers-corp.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@makers-corp.com',
        password: 'MakersCorp@2026!',
        role: 'admin'
      });
      console.log('✅ Seeded Super Admin: admin@makers-corp.com');
    } else {
      console.log('ℹ️ Super Admin admin@makers-corp.com already exists');
    }

    console.log('\n🎉 ALL DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedAll();
