const { BlogPost, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all blog posts with filtering, sorting and pagination
 * @route   GET /api/blog
 * @access  Public
 */
const getBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Status filter (default to published posts for public API)
    filter.status = req.query.status || 'published';
    
    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Tag filter
    if (req.query.tag) {
      filter.tags = { [Op.contains]: [req.query.tag] };
    }
    
    // Search by title or content
    if (req.query.search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { content: { [Op.iLike]: `%${req.query.search}%` } }
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
    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: filter,
      limit,
      offset: startIndex,
      order,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar']
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
      data: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get single blog post by ID or slug
 * @route   GET /api/blog/:id
 * @access  Public
 */
const getBlogPost = async (req, res) => {
  try {
    let post;
    
    // Check if param is a number (ID) or string (slug)
    if (isNaN(req.params.id)) {
      // Find by slug
      post = await BlogPost.findOne({
        where: { slug: req.params.id },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar']
          }
        ]
      });
    } else {
      // Find by ID
      post = await BlogPost.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar']
          }
        ]
      });
    }
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Create new blog post
 * @route   POST /api/blog
 * @access  Private (Admin only)
 */
const createBlogPost = async (req, res) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;
    
    const post = await BlogPost.create(req.body);
    
    res.status(201).json({
      success: true,
      data: post
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
 * @desc    Update blog post
 * @route   PUT /api/blog/:id
 * @access  Private (Admin only)
 */
const updateBlogPost = async (req, res) => {
  try {
    let post = await BlogPost.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    
    // Make sure user is post author or admin
    if (post.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this post' });
    }
    
    // Update post
    await post.update(req.body);
    
    res.status(200).json({
      success: true,
      data: post
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
 * @desc    Delete blog post
 * @route   DELETE /api/blog/:id
 * @access  Private (Admin only)
 */
const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    
    // Make sure user is post author or admin
    if (post.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this post' });
    }
    
    await post.destroy();
    
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
 * @desc    Get blog categories
 * @route   GET /api/blog/categories
 * @access  Public
 */
const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogPost.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { status: 'published' }
    });
    
    const categoryList = categories.map(cat => cat.category);
    
    res.status(200).json({
      success: true,
      count: categoryList.length,
      data: categoryList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Get blog tags
 * @route   GET /api/blog/tags
 * @access  Public
 */
const getBlogTags = async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      attributes: ['tags'],
      where: { status: 'published' }
    });
    
    // Extract all tags and flatten the array
    let allTags = [];
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        allTags = [...allTags, ...post.tags];
      }
    });
    
    // Get unique tags
    const uniqueTags = [...new Set(allTags)];
    
    res.status(200).json({
      success: true,
      count: uniqueTags.length,
      data: uniqueTags
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogCategories,
  getBlogTags
};