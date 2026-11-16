const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    vehicle: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      enum: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mazda', 'Other'],
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
