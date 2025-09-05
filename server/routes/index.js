const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const blogRoutes = require('./blogRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/blog', blogRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/upload', uploadRoutes);

// API health check route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Salem Real Estate API is running',
    version: '1.0.0'
  });
});

module.exports = router;