const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  branding: {
    primaryFont: { type: String, default: 'Inter' },
    secondaryFont: { type: String, default: 'Inter' },
    primaryColor: { type: String, default: '#f97316' },
    secondaryColor: { type: String, default: '#0f172a' },
    accentColor: { type: String, default: '#f59e0b' },
    siteName: { type: String, default: 'PikeyTravels' },
    logoUrl: { type: String, default: '' }
  },
  hero: {
    backgroundImageUrl: { type: String, default: '' },
    headline: { type: String, default: 'Discover Your Next Adventure' },
    subheadline: { type: String, default: 'Explore the best destinations with expert guides' },
    ctaLabel: { type: String, default: 'Find Packages' },
    ctaLink: { type: String, default: '/packages' }
  },
  siteInfo: {
    isVisible: { type: Boolean, default: true },
    heading: { type: String, default: 'Why Choose PikeyTravels' },
    description: { type: String, default: 'We provide the best travel experiences' },
    images: [{ type: String }],
    stats: [{
      label: { type: String },
      value: { type: String }
    }]
  },
  sections: {
    packagesSlider: { isVisible: { type: Boolean, default: true } },
    hotelsSection: { isVisible: { type: Boolean, default: true } },
    cabsSection: { isVisible: { type: Boolean, default: true } },
    guidesSection: { isVisible: { type: Boolean, default: true } },
    reviewsSection: { isVisible: { type: Boolean, default: true } }
  },
  footer: {
    aboutText: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' }
    },
    copyrightText: { type: String, default: '© 2026 PikeyTravels. All rights reserved.' }
  },
  navItems: [{
    label: { type: String },
    path: { type: String },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    isExternal: { type: Boolean, default: false }
  }]
  ,
  adminEmails: [{ type: String }]
  ,
  guestOptions: [{ type: Number, default: [] }]
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);