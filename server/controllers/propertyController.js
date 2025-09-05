const { Property, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all properties with filtering, sorting and pagination
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Status filter (default to active properties for public API)
    filter.status = req.query.status || 'active';
    
    // Type filter
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Location filter
    if (req.query.location) {
      filter.location = { [Op.iLike]: `%${req.query.location}%` };
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = {
        [Op.between]: [req.query.minPrice, req.query.maxPrice]
      };
    } else if (req.query.minPrice) {
      filter.price = { [Op.gte]: req.query.minPrice };
    } else if (req.query.maxPrice) {
      filter.price = { [Op.lte]: req.query.maxPrice };
    }
    
    // Bedrooms filter
    if (req.query.bedrooms) {
      filter.bedrooms = { [Op.gte]: req.query.bedrooms };
    }
    
    // Bathrooms filter
    if (req.query.bathrooms) {
      filter.bathrooms = { [Op.gte]: req.query.bathrooms };
    }
    
    // Search by title or description
    if (req.query.search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }
    
    // Featured properties filter
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
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
    const { count, rows: properties } = await Property.findAndCountAll({
      where: filter,
      limit,
      offset: startIndex,
      order,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'avatar']
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
      data: properties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get single property by ID or slug
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getProperty = async (req, res) => {
  try {
    let property;
    
    // Check if param is a number (ID) or string (slug)
    if (isNaN(req.params.id)) {
      // Find by slug
      property = await Property.findOne({
        where: { slug: req.params.id },
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone', 'avatar']
          }
        ]
      });
    } else {
      // Find by ID
      property = await Property.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone', 'avatar']
          }
        ]
      });
    }
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    // Increment views
    property.views += 1;
    await property.save();
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create new property
 * @route   POST /api/properties
 * @access  Private
 */
const createProperty = async (req, res) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;
    
    const property = await Property.create(req.body);
    
    res.status(201).json({
      success: true,
      data: property
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
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private
 */
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findByPk(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    // Make sure user is property owner or admin
    if (property.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this property' });
    }
    
    // Update property
    await property.update(req.body);
    
    res.status(200).json({
      success: true,
      data: property
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
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    // Make sure user is property owner or admin
    if (property.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this property' });
    }
    
    await property.destroy();
    
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
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  Public
 */
const getFeaturedProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    const properties = await Property.findAll({
      where: {
        isFeatured: true,
        status: 'active'
      },
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties
};