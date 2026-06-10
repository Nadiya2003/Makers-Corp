const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  year: {
    type: String
  },
  fuel: {
    type: String
  },
  mileage: {
    type: String
  },
  price: {
    type: String,
    required: true
  },
  engine: {
    type: String
  },
  transmission: {
    type: String,
    enum: ['Auto', 'Manual', 'Tiptronic', 'N/A', 'Other']
  },
  drive: {
    type: String,
    default: '2WD'
  },
  seats: {
    type: Number,
    default: 5
  },
  color: {
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['SUV', 'Sedan', 'Hatchback', 'Van', 'Other'],
    default: 'Other'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available'
  },
  hiddenSpecs: {
    type: [String],
    default: []
  },
  customSpecs: {
    type: [{
      key: String,
      label: String,
      value: String
    }],
    default: []
  }
}, {
  timestamps: true,
  strict: false
});

module.exports = mongoose.model('CommercialVehicle', vehicleSchema);
