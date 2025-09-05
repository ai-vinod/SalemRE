const { User, Property, Inquiry, BlogPost } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get dashboard statistics and recent data
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const userCount = await User.count();
    const propertyCount = await Property.count();
    const inquiryCount = await Inquiry.count();
    const blogPostCount = await BlogPost.count();
    
    // Get recent properties
    const recentProperties = await Property.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'type', 'price', 'status', 'createdAt']
    });
    
    // Get recent inquiries
    const recentInquiries = await Inquiry.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'phone', 'propertyId', 'propertyTitle', 'message', 'status', 'createdAt']
    });
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userCount,
          properties: propertyCount,
          inquiries: inquiryCount,
          blogPosts: blogPostCount
        },
        recentProperties,
        recentInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};