const { User, Property, Inquiry } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all users with filtering, sorting and pagination
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Search by name or email
    if (req.query.search) {
      filter[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { email: { [Op.iLike]: `%${req.query.search}%` } }
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
    const { count, rows: users } = await User.findAndCountAll({
      where: filter,
      limit,
      offset: startIndex,
      order,
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });
    
    // Pagination result
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private (Admin only)
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create new user (admin)
 * @route   POST /api/users
 * @access  Private (Admin only)
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt
      }
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
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin only)
 */
const updateUser = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Update user
    const { name, email, role, phone, status, avatar } = req.body;
    
    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.status = status || user.status;
    user.avatar = avatar || user.avatar;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
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
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Prevent deleting the last admin user
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot delete the last admin user' });
      }
    }
    
    await user.destroy();
    
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
 * @desc    Get user stats (properties, inquiries)
 * @route   GET /api/users/:id/stats
 * @access  Private (Admin only)
 */
const getUserStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Get property count
    const propertyCount = await Property.count({ where: { userId: req.params.id } });
    
    // Get inquiry count
    const inquiryCount = await Inquiry.count({ where: { userId: req.params.id } });
    
    // Get recent properties
    const recentProperties = await Property.findAll({
      where: { userId: req.params.id },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    // Get recent inquiries
    const recentInquiries = await Inquiry.findAll({
      where: { userId: req.params.id },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        propertyCount,
        inquiryCount,
        recentProperties,
        recentInquiries
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};