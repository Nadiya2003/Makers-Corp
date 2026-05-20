const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Makers Ceylon' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  
  // Header Management
  header: {
    navLinks: [
      { label: { type: String }, url: { type: String } }
    ],
    showSearch: { type: Boolean, default: true },
    contactNumber: { type: String, default: '' }
  },

  // Footer Management
  footer: {
    aboutText: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    socialLinks: [
      { platform: { type: String }, url: { type: String }, icon: { type: String } }
    ],
    copyrightText: { type: String, default: '© 2024 Makers Ceylon. All rights reserved.' }
  },

  // Homepage Content
  homepage: {
    hero: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      backgroundImage: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' }
    },
    about: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      image: { type: String, default: '' },
      stats: [
        {
          value: { type: String, default: '' },
          label: { type: String, default: '' }
        }
      ]
    },
    services: [
      { title: { type: String }, description: { type: String }, icon: { type: String } }
    ],
    whyChooseUs: {
      subtitle: { type: String, default: 'The Ceylon Advantage' },
      title: { type: String, default: 'Why Choose Us' },
      reasons: [
        {
          icon: { type: String, default: 'CheckCircle' },
          title: { type: String, default: '' },
          desc: { type: String, default: '' }
        }
      ]
    }
  },

  // SEO Settings
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: String, default: '' }
  },

  // Theme Colors
  theme: {
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#ffffff' },
    accentColor: { type: String, default: '#fbbf24' }
  },

  // About Page
  aboutPage: {
    title: { type: String, default: 'About Makers Ceylon' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    directors: [
      {
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        bio: { type: String, default: '' },
        image: { type: String, default: '' }
      }
    ]
  },

  // Contact Page
  contactPage: {
    title: { type: String, default: 'Contact Us' },
    description: { type: String, default: '' },
    workingHours: { type: String, default: 'Mon - Fri: 9:00 AM - 6:00 PM' },
    googleMapUrl: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
