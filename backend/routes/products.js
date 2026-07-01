const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by numeric id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, originalPrice, category, images, description, stock, badge, specs } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    // Auto-increment custom numeric id
    const lastProduct = await Product.findOne().sort('-id');
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: nextId,
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      images: images || [],
      description,
      stock: Number(stock) || 0,
      badge,
      specs: specs || {}
    });

    const createdProduct = await product.save();
    return res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, originalPrice, category, images, description, stock, badge, specs } = req.body;

    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
    product.category = category || product.category;
    product.images = images || product.images;
    product.description = description || product.description;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.badge = badge !== undefined ? badge : product.badge;
    product.specs = specs || product.specs;

    const updatedProduct = await product.save();
    return res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a new review for a product
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, text, image } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ success: false, message: 'Please add a rating and comment' });
    }

    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Optional: Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.name === req.user.name // Simple match, or user ID if we stored user ID
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed by this user' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      text,
      verified: true, // Logged in review is verified
      image: image || undefined
    };

    product.reviews.unshift(review);
    product.reviewsCount = product.reviews.length;
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();
    return res.status(201).json({ success: true, message: 'Review added successfully', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
