const express = require('express');
const router = express.Router();
const { 
  getInquiries, 
  getInquiry, 
  createInquiry, 
  updateInquiry, 
  deleteInquiry,
  getUserInquiries
} = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', createInquiry);

// Protected routes
router.get('/user', protect, getUserInquiries);

// Admin routes
router.get('/', protect, admin, getInquiries);
router.get('/:id', protect, admin, getInquiry);
router.put('/:id', protect, admin, updateInquiry);
router.delete('/:id', protect, admin, deleteInquiry);

module.exports = router;