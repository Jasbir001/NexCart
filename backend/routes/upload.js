const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit files to 5MB
  }
});

// @route   POST /api/upload
// @desc    Upload an image & compress it to WebP
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E4)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    // Process image with Sharp:
    // 1. Resize to fit inside 800x800 box (web-optimized size)
    // 2. Convert to WebP format
    // 3. Set quality to 80 (perfect balance of compression and quality)
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Return the relative URL of the uploaded image
    const imageUrl = `/uploads/${filename}`;

    return res.json({
      success: true,
      message: 'Image uploaded and optimized successfully',
      url: imageUrl
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
