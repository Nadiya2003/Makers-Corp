const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, default: 'Online' },
  image: { type: String },
  status: { type: String, enum: ['Upcoming', 'Live', 'Ended'], default: 'Upcoming' },
  link: { type: String }, // External auction link
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
