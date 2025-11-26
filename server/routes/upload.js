const express = require('express');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Upload images (authenticated)
router.post('/images', authenticate, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Return array of file URLs
    const fileUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.json({ 
      message: 'Images uploaded successfully',
      images: fileUrls 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

module.exports = router;

