const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Makers Corp Japan' },
  tagline: { type: String, default: 'Vehicles Sourced From Japan' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  
  // Header Management
  header: {
    navLinks: [
      { label: { type: String }, url: { type: String } }
    ],
    showSearch: { type: Boolean, default: true },
    contactNumber: { type: String, default: '+81 3-5555-0199' },
    whatsappNumber: { type: String, default: '+81 90-1234-5678' },
    announcementTicker: [
      { text: { type: String }, link: { type: String }, external: { type: Boolean, default: false } }
    ]
  },

  // Footer Management
  footer: {
    logo: { type: String, default: '' },
    image: { type: String, default: '' },
    imageVisible: { type: Boolean, default: true },
    aboutText: { type: String, default: 'Premier Japanese automobile exporter specializing in verified physical yard inventory, professional JEVIC/JAAI compliance audits, and worldwide container & Ro-Ro vessel shipping.' },
    address: { type: String, default: 'Makers Building, 4-12-8 Ginza, Chuo-ku, Tokyo 104-0061, Japan' },
    email: { type: String, default: 'japan@makers-corp.com' },
    phone: { type: String, default: '+81 3-5555-0199' },
    workingHours: { type: String, default: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)' },
    socialLinks: [
      { platform: { type: String }, url: { type: String }, icon: { type: String }, visible: { type: Boolean, default: true } }
    ],
    copyrightText: { type: String, default: '© 2026 MAKERS CORP JAPAN. All rights reserved. Registered Export Company No. 0100-01-192837.' }
  },

  // Homepage Content Sections
  homepage: {
    heroSlides: [
      {
        id: { type: String, default: 'slide-1' },
        badge: { type: String, default: 'JAPANESE VEHICLE EXPORT · WORLDWIDE SHIPPING' },
        title: { type: String, default: 'FROM JAPAN TO THE GLOBE' },
        subtitle: { type: String, default: 'Discover exceptional Japanese vehicles sourced directly from Japan and exported to international markets. From premium SUVs and luxury 4x4s to iconic Japanese automobiles, we connect global buyers with quality vehicles from Japan through tailored sourcing and export solutions.' },
        subBadge: { type: String, default: 'Sourced Directly from Japan (Tokyo · Yokohama · Nagoya · Kobe)' },
        image: { type: String, default: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80' },
        ctaPrimary: {
          text: { type: String, default: 'EXPLORE VEHICLES' },
          link: { type: String, default: '/vehicles' }
        },
        ctaSecondary: {
          text: { type: String, default: 'REQUEST EXPORT ENQUIRY' },
          link: { type: String, default: '/request-a-vehicle' }
        }
      }
    ],
    searchConfig: {
      quickSearches: { type: [String], default: ['Toyota SUVs', 'India Reviewed', 'Sri Lanka Stock'] },
      destinationMarkets: { type: [String], default: ['Global', 'India', 'Sri Lanka', 'Pakistan', 'United Kingdom', 'Kenya', 'Tanzania', 'Uganda', 'Cyprus', 'New Zealand', 'Australia', 'Guyana', 'Jamaica'] }
    },
    campaignHighlights: [
      {
        id: { type: String, default: 'india-market' },
        market: { type: String, default: 'INDIA MARKET' },
        badge: { type: String, default: 'PRIORITY ROUTE' },
        title: { type: String, default: 'Explore Japan-Sourced Vehicles' },
        description: { type: String, default: 'Direct homologation checks & JNPT / Chennai shipping for luxury SUVs & sports stock.' },
        linkText: { type: String, default: 'Explore India' },
        linkUrl: { type: String, default: '/destinations/asia/india' },
        isExternal: { type: Boolean, default: false }
      },
      {
        id: { type: String, default: 'sri-lanka-market' },
        market: { type: String, default: 'SRI LANKA MARKET' },
        badge: { type: String, default: 'MAKERS CEYLON' },
        title: { type: String, default: 'Explore Vehicles & Local Support' },
        description: { type: String, default: 'Official vehicle export partner MAKERS CEYLON. Bank LC coordination & Colombo port delivery.' },
        linkText: { type: String, default: 'Visit MAKERS CEYLON' },
        linkUrl: { type: String, default: 'https://makersceylon.com/' },
        isExternal: { type: Boolean, default: true }
      },
      {
        id: { type: String, default: 'export-guide' },
        market: { type: String, default: 'Export Process' },
        badge: { type: String, default: '' },
        title: { type: String, default: 'A Step-by-Step Export Guide' },
        description: { type: String, default: 'Clear breakdown of JEVIC audits, FOB/CIF terms, ocean freight tracking, and delivery.' },
        linkText: { type: String, default: 'Read the Guide' },
        linkUrl: { type: String, default: '/how-to-buy' },
        isExternal: { type: Boolean, default: false }
      },
      {
        id: { type: String, default: 'made-to-order' },
        market: { type: String, default: 'MADE-TO-ORDER' },
        badge: { type: String, default: '' },
        title: { type: String, default: "Tell Us What You're Looking For" },
        description: { type: String, default: "Can't find your specific model or trim? We source directly from Japanese dealer & auction networks." },
        linkText: { type: String, default: 'Request a Vehicle' },
        linkUrl: { type: String, default: '/request-a-vehicle' },
        isExternal: { type: Boolean, default: false }
      }
    ],
    categoryDiscovery: {
      passengerTitle: { type: String, default: 'VEHICLES' },
      passengerSubtitle: { type: String, default: 'Passenger Cars · Luxury SUVs · Executive MPVs · Sports · Hybrids' },
      passengerCountLabel: { type: String, default: '8 CATEGORIES' },
      commercialTitle: { type: String, default: 'COMMERCIAL VEHICLES' },
      commercialSubtitle: { type: String, default: 'Isuzu, Hino, Fuso, UD Trucks · Buses · Cargo Vans · Heavy Duty' },
      commercialCountLabel: { type: String, default: '12 CATEGORIES' },
      spotlight: {
        tag: { type: String, default: 'FEATURED FAMILY · 01 | JAPAN DIRECT 4X4' },
        manufacturer: { type: String, default: 'TOYOTA MOTOR CORPORATION · TAHARA & YOSHIWARA PLANTS' },
        title: { type: String, default: 'TOYOTA LAND CRUISER' },
        description: { type: String, default: 'Explore the legendary Land Cruiser family. Discover iconic Japanese 4x4 vehicles engineered for exceptional performance, durability, and off-road capability. Covering all major generations from the modern 300 & 250 series to the heavy-duty 70, 200, and Prado lines.' },
        image: { type: String, default: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
        generations: [
          {
            code: { type: String, default: '300 Series' },
            name: { type: String, default: 'LC GEN 300 Series' },
            link: { type: String, default: '/vehicles?model=Land%20Cruiser%20300' }
          },
          {
            code: { type: String, default: '250 Series' },
            name: { type: String, default: 'LC GEN 250 Series' },
            link: { type: String, default: '/vehicles?model=Land%20Cruiser%20250' }
          },
          {
            code: { type: String, default: '70 Series' },
            name: { type: String, default: 'LC GEN 70 Series' },
            link: { type: String, default: '/vehicles?model=Land%20Cruiser%2070' }
          },
          {
            code: { type: String, default: '200 Series' },
            name: { type: String, default: 'LC GEN 200 Series' },
            link: { type: String, default: '/vehicles?model=Land%20Cruiser%20200' }
          },
          {
            code: { type: String, default: 'Prado 150' },
            name: { type: String, default: 'LC GEN Prado 150' },
            link: { type: String, default: '/vehicles?model=Prado%20150' }
          },
          {
            code: { type: String, default: 'Prado 120' },
            name: { type: String, default: 'LC GEN Prado 120' },
            link: { type: String, default: '/vehicles?model=Prado%20120' }
          }
        ],
        ctaPrimaryText: { type: String, default: 'EXPLORE LAND CRUISER SERIES' },
        ctaPrimaryLink: { type: String, default: '/vehicles?make=Toyota&model=Land+Cruiser' },
        ctaSecondaryText: { type: String, default: 'VIEW IN-STOCK (FOB JAPAN)' },
        ctaSecondaryLink: { type: String, default: '/vehicles' }
      }
    },
    latestVehiclesSection: {
      tag: { type: String, default: 'LIVE INVENTORY FEED · TOKYO & YOKOHAMA YARDS' },
      title: { type: String, default: 'Latest Vehicles in Japan' },
      subtitle: { type: String, default: 'Physical export inventory inspected and ready for container or Ro-Ro booking' },
      bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1920&q=80' },
      viewAllText: { type: String, default: 'View Full Inventory' }
    }
  },

  // SEO Settings
  seo: {
    metaTitle: { type: String, default: 'Makers Corp Japan | Verified Physical Export Inventory' },
    metaDescription: { type: String, default: 'Direct Japanese vehicle exporter. Verified physical inventory in Tokyo & Yokohama yards, certified JEVIC inspections, and global shipping.' },
    keywords: { type: String, default: 'Japanese vehicle export, Tokyo cars, FOB Japan, JEVIC certified, Land Cruiser export, Japan auto auction' }
  },

  // Theme Colors
  theme: {
    primaryColor: { type: String, default: '#ff6a00' },
    secondaryColor: { type: String, default: '#111111' },
    accentColor: { type: String, default: '#ff6a00' }
  },

  // About Page
  aboutPage: {
    title: { type: String, default: 'About Makers Corp Japan' },
    tagline: { type: String, default: 'Precision Japanese Vehicle Export Operations' },
    content: { type: String, default: 'Headquartered in Tokyo with secure staging yards across Yokohama and Nagoya, Makers Corp Japan connects international dealers and private clients directly to verified Japanese physical automobile inventory.' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
    mission: { type: String, default: 'To provide unmatched transparency, verified vehicle condition standards, and seamless international maritime logistics for global automotive buyers.' },
    vision: { type: String, default: 'To be the most trusted Japanese automotive export partner worldwide, known for authentic stock and zero-compromise inspection standards.' }
  },

  // Contact Page
  contactPage: {
    title: { type: String, default: 'Contact Tokyo Export Operations' },
    description: { type: String, default: 'Reach our direct export desk in Tokyo for stock inquiries, custom auction sourcing, and CIF freight calculations.' },
    workingHours: { type: String, default: 'Mon - Fri: 9:00 AM - 6:00 PM JST (UTC+9)' },
    phone: { type: String, default: '+81 3-5555-0199' },
    email: { type: String, default: 'japan@makers-corp.com' },
    address: { type: String, default: 'Makers Building, 4-12-8 Ginza, Chuo-ku, Tokyo 104-0061, Japan' },
    googleMapUrl: { type: String, default: '' }
  }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
