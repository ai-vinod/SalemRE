const express = require('express');
const router = express.Router();
const { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getFeaturedProperties
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getProperty);

// Protected routes (admin only)
router.post('/', protect, admin, createProperty);
router.put('/:id', protect, admin, updateProperty);
router.delete('/:id', protect, admin, deleteProperty);

module.exports = router;