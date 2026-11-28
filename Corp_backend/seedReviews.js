require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://markersCeylon:markersCeylon43234Dfdsdf@main-cluster.vqngjf9.mongodb.net/markersCeylon?retryWrites=true&w=majority&appName=Main-Cluster';

const reviewsData = [
  {
    customerName: 'Rajesh Patel',
    country: 'India',
    companyName: 'Patel Luxury Motors Import',
    designation: 'Managing Director',
    rating: 5,
    reviewText: 'Imported two Land Cruiser 300 ZX units directly through Makers Corp Japan. The JEVIC pre-shipment inspection reports and physical chassis verification matched 100% upon arrival at Nhava Sheva port. Exceptional transparency on FOB invoicing and direct Ro-Ro booking.',
    reviewDate: new Date('2026-11-12'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isPublished: true,
    isFeatured: true
  },
  {
    customerName: 'Duminda Senanayake',
    country: 'Sri Lanka',
    companyName: 'Senanayake Auto Holdings',
    designation: 'Fleet & Procurement Director',
    rating: 5,
    reviewText: 'Working with Makers Corp Tokyo in coordination with Makers Ceylon has been completely seamless. The commercial LC was verified without delay, and our brand-new Toyota Raize and Honda N-BOX units cleared Colombo port on schedule with original MLIT export certificates.',
    reviewDate: new Date('2026-11-04'),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isPublished: true,
    isFeatured: true
  },
  {
    customerName: 'Captain Michael Obiero',
    country: 'Kenya',
    companyName: 'Rift Valley Commercial Logistics',
    designation: 'Operations Director',
    rating: 5,
    reviewText: 'Sourced three Isuzu Forward trucks and a 2.0T Elf tipper for our logistics fleet. The mechanical roadworthiness checks and hydraulic body inspection passed QISJ/KEBS compliance on the first audit. Arrived at Mombasa port in 18 days.',
    reviewDate: new Date('2026-10-24'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isPublished: true,
    isFeatured: true
  },
  {
    customerName: 'David Sterling',
    country: 'United Kingdom',
    companyName: 'Sterling 4x4 Imports Ltd',
    designation: 'Principal Specialist',
    rating: 5,
    reviewText: 'Acquired a museum-grade Grade 5.0 Land Cruiser Prado and a Suzuki Jimny Sierra. The Tokyo yard team provided detailed high-resolution undercarriage scans and chassis reports prior to freight booking. Highly recommended for genuine JDM stock.',
    reviewDate: new Date('2026-10-18'),
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    isPublished: true,
    isFeatured: false
  },
  {
    customerName: 'Tariq Al-Mansoor',
    country: 'United Arab Emirates',
    companyName: 'Al-Mansoor Prestige Motors',
    designation: 'Head of Purchasing',
    rating: 5,
    reviewText: 'Makers Corp Japan is our premier procurement partner for luxury 4x4s and Japanese sports stock. Verified odometer certification and dedicated container consolidation from Yokohama make international transactions hassle-free.',
    reviewDate: new Date('2026-10-02'),
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    isPublished: true,
    isFeatured: false
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const count = await Review.countDocuments();
    console.log(`Current review count: ${count}`);

    for (const r of reviewsData) {
      await Review.findOneAndUpdate(
        { customerName: r.customerName, country: r.country },
        r,
        { upsert: true, new: true }
      );
      console.log(`Upserted review from ${r.customerName} (${r.country})`);
    }

    const total = await Review.countDocuments();
    console.log(`Reviews seed complete. Total in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
