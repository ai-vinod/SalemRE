const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

// All dashboard routes are protected and require admin access
router.use(protect, admin);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

module.exports = router;