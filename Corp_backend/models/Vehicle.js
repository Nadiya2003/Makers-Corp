const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stockId: {
    type: String,
    trim: true
  },
  make: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  modelCode: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  conditionGrade: {
    type: String,
    default: 'Grade S/A (Brand New)'
  },
  inspectionStatus: {
    type: String,
    default: 'Makers Certified 150-Point & JEVIC Passed'
  },
  mileage: {
    type: String
  },
  mileageKm: {
    type: Number,
    default: 0
  },
  fuel: {
    type: String
  },
  transmission: {
    type: String,
    default: 'Automatic'
  },
  drivetrain: {
    type: String,
    default: 'RHD (2WD)'
  },
  engineCc: {
    type: Number
  },
  engineCapacity: {
    type: String
  },
  bodyType: {
    type: String
  },
  exteriorColor: {
    type: String
  },
  fobPort: {
    type: String,
    default: 'FOB YOKOHAMA'
  },
  priceUSD: {
    type: Number,
    default: 0
  },
  priceFOB: {
    type: String
  },
  price: {
    type: String
  },
  priceLKR: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  availability: {
    type: String,
    default: 'Available in Japan Yard'
  },
  sourceType: {
    type: String,
    default: 'Physical Stock (Japan Yard)'
  },
  image: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  features: {
    type: [String],
    default: []
  },
  keyFeatures: {
    type: [String],
    default: []
  },
  overview: {
    type: String
  },
  description: {
    type: String
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  slug: {
    type: String
  },
  destinations: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    default: 'SUV'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved', 'In Transit'],
    default: 'Available'
  }
}, {
  timestamps: true,
  strict: false
});

// Auto-fill legacy compatibility fields before save
vehicleSchema.pre('save', function(next) {
  // Auto-compose name from make+model+year if not set
  if (!this.name || !this.name.trim()) {
    const parts = [this.year, this.make, this.model, this.grade].filter(Boolean);
    if (parts.length > 0) {
      this.name = parts.join(' ').trim();
    }
  }
  // Map alternate field names
  if (this.fuelType && !this.fuel) {
    this.fuel = this.fuelType;
  }
  if (this.fobPriceUSD !== undefined && !this.priceUSD) {
    this.priceUSD = this.fobPriceUSD;
  }
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  if (!this.price && this.priceFOB) {
    this.price = this.priceFOB;
  }
  if (!this.price && this.priceUSD) {
    this.price = `USD ${this.priceUSD.toLocaleString()}`;
  }
  if (!this.priceFOB && this.priceUSD) {
    this.priceFOB = `USD ${this.priceUSD.toLocaleString()}`;
  }
  if (!this.slug && this.name) {
    const safeStock = this.stockId ? `-${this.stockId.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '';
    this.slug = (this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + safeStock).replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
