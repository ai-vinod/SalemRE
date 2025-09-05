const { Inquiry, Property, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all inquiries with filtering, sorting and pagination
 * @route   GET /api/inquiries
 * @access  Private (Admin only)
 */
const getInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Property type filter
    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }
    
    // Search by name, email or message
    if (req.query.search) {
      filter[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { email: { [Op.iLike]: `%${req.query.search}%` } },
        { message: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }
    
    // Sort options
    let order = [];
    if (req.query.sort) {
      const sortField = req.query.sort.split(',')[0];
      const sortDirection = req.query.sort.split(',')[1] || 'ASC';
      order = [[sortField, sortDirection]];
    } else {
      // Default sort by createdAt DESC
      order = [['createdAt', 'DESC']];
    }
    
    // Execute query with pagination
    const { count, rows: inquiries } = await Inquiry.findAndCountAll({
      where: filter,
      limit,
      offset: startIndex,
      order,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'slug', 'type', 'location', 'price']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });
    
    // Pagination result
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: page,
      data: inquiries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get single inquiry
 * @route   GET /api/inquiries/:id
 * @access  Private (Admin only)
 */
const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'slug', 'type', 'location', 'price']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });
    
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    
    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create new inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
const createInquiry = async (req, res) => {
  try {
    // Add user to req.body if authenticated
    if (req.user) {
      req.body.userId = req.user.id;
    }
    
    const inquiry = await Inquiry.create(req.body);
    
    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Update inquiry status
 * @route   PUT /api/inquiries/:id
 * @access  Private (Admin only)
 */
const updateInquiry = async (req, res) => {
  try {
    let inquiry = await Inquiry.findByPk(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    
    // Update inquiry
    await inquiry.update(req.body);
    
    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private (Admin only)
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    
    await inquiry.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get user's inquiries
 * @route   GET /api/inquiries/user
 * @access  Private
 */
const getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'slug', 'type', 'location', 'price', 'mainImage']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getUserInquiries
};