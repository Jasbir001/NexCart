const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => 'rev-' + Date.now() + Math.random().toString(36).substring(2, 7)
  },
  name: {
    type: String,
    required: [true, 'Please add a name for the review']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: [true, 'Please add review comments']
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  verified: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
});

const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  originalPrice: {
    type: Number
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 0
  },
  badge: {
    type: String
  },
  specs: {
    type: Map,
    of: String,
    default: {}
  },
  reviews: [ReviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
