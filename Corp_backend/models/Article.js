const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'BUYING GUIDES',
      'MARKET UPDATES',
      'SHIPPING & LOGISTICS',
      'VEHICLE REVIEWS',
      'AUCTION GUIDES',
      'EXPORT PROCESS'
    ],
    default: 'BUYING GUIDES'
  },
  readTime: {
    type: String,
    default: '5 min'
  },
  author: {
    name: { type: String, default: 'Kenji Takahashi' },
    role: { type: String, default: 'Export Operations Desk, Tokyo' },
    avatar: { type: String, default: '' }
  },
  tags: {
    type: [String],
    default: []
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
