require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');

async function updateSettings() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB');

    const update = {
      siteName: 'Makers Corp Japan',
      tagline: 'Vehicles Sourced From Japan',
      logo: '/images/makers-logo.png',
      header: {
        navLinks: [
          { label: 'HOME', url: '/' },
          { label: 'INVENTORY', url: '/vehicles' },
          { label: 'DESTINATIONS', url: '/destinations' },
          { label: 'HOW TO BUY', url: '/how-to-buy' },
          { label: 'NEWS & REVIEWS', url: '/news' },
          { label: 'ABOUT', url: '/about' },
          { label: 'CONTACT', url: '/contact' }
        ],
        contactNumber: '+81 3-5555-0199',
        whatsappNumber: '+81 90-1234-5678',
        announcementTicker: [
          { text: 'Enquiries', link: '/contact', external: false },
          { text: 'Sri Lanka Customers → Makers Ceylon ↗', link: 'https://makersceylon.com', external: true },
          { text: 'Browse Vehicles from Japan', link: '/vehicles', external: false },
          { text: 'India Export Enquiries', link: '/destinations/asia/india', external: false },
          { text: 'Direct Tokyo Operations Desk', link: '/contact', external: false },
          { text: '100% Genuine Physical Inventory', link: '/vehicles', external: false }
        ]
      },
      footer: {
        logo: '/images/makers-logo.png',
        aboutText: 'Premier Japanese vehicle exporter specializing in verified physical yard inventory, professional JEVIC/JAAI compliance audits, and worldwide container & Ro-Ro vessel shipping.',
        address: 'Makers Building, 4-12-8 Ginza, Chuo-ku, Tokyo 104-0061, Japan',
        email: 'japan@makers-corp.com',
        phone: '+81 3-5555-0199',
        workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)',
        socialLinks: [
          { platform: 'WhatsApp', url: 'https://wa.me/819012345678', icon: 'MessageCircle', visible: true },
          { platform: 'Facebook', url: 'https://facebook.com/makerscorpjapan', icon: 'Facebook', visible: true },
          { platform: 'Instagram', url: 'https://instagram.com/makerscorpjapan', icon: 'Instagram', visible: true }
        ],
        copyrightText: '© 2026 MAKERS CORP JAPAN. All rights reserved. Registered Export Company No. 0100-01-192837.'
      },
      homepage: {
        heroSlides: [
          {
            id: 'slide-1',
            badge: 'JAPANESE VEHICLE EXPORT · WORLDWIDE SHIPPING',
            title: 'FROM JAPAN TO THE GLOBE',
            subtitle: 'Discover exceptional Japanese vehicles sourced directly from Japan and exported to international markets. From premium SUVs and luxury 4x4s to iconic Japanese automobiles, we connect global buyers with quality vehicles from Japan through tailored sourcing and export solutions.',
            subBadge: 'Sourced Directly from Japan (Tokyo · Yokohama · Nagoya · Kobe)',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
            ctaPrimary: {
              text: 'EXPLORE VEHICLES',
              link: '/vehicles'
            },
            ctaSecondary: {
              text: 'REQUEST EXPORT ENQUIRY',
              link: '/request-a-vehicle'
            }
          }
        ],
        searchConfig: {
          quickSearches: ['Toyota SUVs', 'India Reviewed', 'Sri Lanka Stock'],
          destinationMarkets: ['Global', 'India', 'Sri Lanka', 'Pakistan', 'United Kingdom', 'Kenya', 'Tanzania', 'Uganda', 'Cyprus', 'New Zealand', 'Australia', 'Guyana', 'Jamaica']
        },
        campaignHighlights: [
          {
            id: 'india-market',
            market: 'INDIA MARKET',
            badge: 'PRIORITY ROUTE',
            title: 'Explore Japan-Sourced Vehicles',
            description: 'Direct homologation checks & JNPT / Chennai shipping for luxury SUVs & sports stock.',
            linkText: 'Explore India',
            linkUrl: '/destinations/asia/india',
            isExternal: false
          },
          {
            id: 'sri-lanka-market',
            market: 'SRI LANKA MARKET',
            badge: 'MAKERS CEYLON',
            title: 'Explore Vehicles & Local Support',
            description: 'Official vehicle export partner MAKERS CEYLON. Bank LC coordination & Colombo port delivery.',
            linkText: 'Visit MAKERS CEYLON',
            linkUrl: 'https://makersceylon.com/',
            isExternal: true
          },
          {
            id: 'export-guide',
            market: 'Export Process',
            badge: '',
            title: 'A Step-by-Step Export Guide',
            description: 'Clear breakdown of JEVIC audits, FOB/CIF terms, ocean freight tracking, and delivery.',
            linkText: 'Read the Guide',
            linkUrl: '/how-to-buy',
            isExternal: false
          },
          {
            id: 'made-to-order',
            market: 'MADE-TO-ORDER',
            badge: '',
            title: "Tell Us What You're Looking For",
            description: "Can't find your specific model or trim? We source directly from Japanese dealer & auction networks.",
            linkText: 'Request a Vehicle',
            linkUrl: '/request-a-vehicle',
            isExternal: false
          }
        ],
        categoryDiscovery: {
          passengerTitle: 'VEHICLES',
          passengerSubtitle: 'Passenger Cars · Luxury SUVs · Executive MPVs · Sports · Hybrids',
          passengerCountLabel: '8 CATEGORIES',
          commercialTitle: 'COMMERCIAL VEHICLES',
          commercialSubtitle: 'Isuzu, Hino, Fuso, UD Trucks · Buses · Cargo Vans · Heavy Duty',
          commercialCountLabel: '12 CATEGORIES',
          spotlight: {
            tag: 'FEATURED FAMILY · 01 | JAPAN DIRECT 4X4',
            manufacturer: 'TOYOTA MOTOR CORPORATION · TAHARA & YOSHIWARA PLANTS',
            title: 'TOYOTA LAND CRUISER',
            description: 'Explore the legendary Land Cruiser family. Discover iconic Japanese 4x4 vehicles engineered for exceptional performance, durability, and off-road capability. Covering all major generations from the modern 300 & 250 series to the heavy-duty 70, 200, and Prado lines.',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
            generations: [
              { code: '300 Series', name: 'LC GEN 300 Series', link: '/vehicles?model=Land%20Cruiser%20300' },
              { code: '250 Series', name: 'LC GEN 250 Series', link: '/vehicles?model=Land%20Cruiser%20250' },
              { code: '70 Series', name: 'LC GEN 70 Series', link: '/vehicles?model=Land%20Cruiser%2070' },
              { code: '200 Series', name: 'LC GEN 200 Series', link: '/vehicles?model=Land%20Cruiser%20200' },
              { code: 'Prado 150', name: 'LC GEN Prado 150', link: '/vehicles?model=Prado%20150' },
              { code: 'Prado 120', name: 'LC GEN Prado 120', link: '/vehicles?model=Prado%20120' }
            ],
            ctaPrimaryText: 'EXPLORE LAND CRUISER SERIES',
            ctaPrimaryLink: '/vehicles?make=Toyota&model=Land+Cruiser',
            ctaSecondaryText: 'VIEW IN-STOCK (FOB JAPAN)',
            ctaSecondaryLink: '/vehicles'
          }
        },
        latestVehiclesSection: {
          tag: 'LIVE INVENTORY FEED · TOKYO & YOKOHAMA YARDS',
          title: 'Latest Vehicles in Japan',
          subtitle: 'Physical export inventory inspected and ready for container or Ro-Ro booking',
          bannerImage: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1920&q=80',
          viewAllText: 'View Full Inventory'
        }
      },
      seo: {
        metaTitle: 'Makers Corp Japan | Verified Physical Export Inventory',
        metaDescription: 'Direct Japanese vehicle exporter. Verified physical inventory in Tokyo & Yokohama yards, certified JEVIC inspections, and global shipping.',
        keywords: 'Japanese vehicle export, Tokyo cars, FOB Japan, JEVIC certified, Land Cruiser export, Japan auto auction'
      },
      theme: {
        primaryColor: '#ff6a00',
        secondaryColor: '#111111',
        accentColor: '#ff6a00'
      },
      aboutPage: {
        title: 'About Makers Corp Japan',
        tagline: 'Precision Japanese Vehicle Export Operations',
        content: 'Headquartered in Tokyo with secure staging yards across Yokohama and Nagoya, Makers Corp Japan connects international dealers and private clients directly to verified Japanese physical automobile inventory.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        mission: 'To provide unmatched transparency, verified vehicle condition standards, and seamless international maritime logistics for global automotive buyers.',
        vision: 'To be the most trusted Japanese automotive export partner worldwide, known for authentic stock and zero-compromise inspection standards.'
      },
      contactPage: {
        title: 'Contact Tokyo Export Operations',
        description: 'Reach our direct export desk in Tokyo for stock inquiries, custom auction sourcing, and CIF freight calculations.',
        workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)',
        phone: '+81 3-5555-0199',
        email: 'japan@makers-corp.com',
        address: 'Makers Building, 4-12-8 Ginza, Chuo-ku, Tokyo 104-0061, Japan',
        googleMapUrl: ''
      }
    };

    await SiteSettings.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
    console.log('✅ SiteSettings updated successfully with Makers Corp Japan data');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateSettings();
