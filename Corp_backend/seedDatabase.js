require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const SiteSettings = require('./models/SiteSettings');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ceylon_imports');
    console.log('✅  Connected to MongoDB for seeding');
    
    // 1. Seed Admin User
    await User.deleteMany({ email: 'admin@makersceylon.com' });
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@makersceylon.com',
      password: 'Admin@123',
      role: 'admin'
    });
    
    console.log('✅  Admin user created (admin@makersceylon.com / Admin@123)');

    // 2. Seed Default Settings
    await SiteSettings.deleteMany({});
    
    await SiteSettings.create({
      siteName: 'Makers Ceylon',
      header: {
        navLinks: [
          { label: 'HOME', url: '/' },
          { label: 'VEHICLES', url: '/#vehicles' },
          { label: 'HOW IT WORKS', url: '/#how-it-works' },
          { label: 'WHY US', url: '/#why-us' },
          { label: 'ABOUT US', url: '/about' },
          { label: 'CONTACT US', url: '/contact' }
        ],
        showSearch: true,
        contactNumber: '077 123 4567'
      },
      footer: {
        aboutText: 'Premium Japanese vehicles direct to Sri Lanka. Better prices. Trusted process.',
        address: 'No 123, Main Street, Colombo 07, Sri Lanka',
        email: 'info@makersceylon.com',
        phone: '077 123 4567',
        socialLinks: [
          { platform: 'Facebook', url: '#', icon: 'facebook' },
          { platform: 'Instagram', url: '#', icon: 'instagram' },
          { platform: 'WhatsApp', url: '#', icon: 'whatsapp' }
        ],
        copyrightText: '© 2024 Makers Ceylon. All rights reserved.'
      },
      homepage: {
        hero: {
          title: 'IMPORT YOUR\nDREAM VEHICLE\nDIRECTLY FROM JAPAN',
          subtitle: 'Better Prices. Trusted Process. Complete Peace of Mind.',
          backgroundImage: 'https://pegasusels.com/wp-content/uploads/2023/03/81.jpg',
          ctaText: 'Get a Quote',
          ctaLink: 'inquiry'
        },
        about: {
          title: 'Your Trusted Partner in Japanese Car Imports',
          description: 'Makers Ceylon simplifies the process of importing high-quality Japanese vehicles. We handle everything from auction bidding to shipping and clearing.',
          image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200'
        }
      },
      seo: {
        metaTitle: 'Makers Ceylon | Premium Japanese Vehicle Imports',
        metaDescription: 'Direct Japanese car imports to Sri Lanka with transparent pricing and live auction access.',
        keywords: 'Japan car import, Sri Lanka, JDM, vehicle import, Makers Ceylon'
      },
      theme: {
        primaryColor: '#ff6a00',
        secondaryColor: '#1e293b',
        accentColor: '#fbbf24'
      }
    });

    console.log('✅  Default site settings seeded');
    
    process.exit();
  } catch (error) {
    console.error('❌  Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
