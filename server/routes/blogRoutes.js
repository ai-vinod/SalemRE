const express = require('express');
const router = express.Router();
const { 
  getBlogPosts, 
  getBlogPost, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  getCategories,
  getTags
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getBlogPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:id', getBlogPost);

// Protected routes (admin only)
router.post('/', protect, admin, createBlogPost);
router.put('/:id', protect, admin, updateBlogPost);
router.delete('/:id', protect, admin, deleteBlogPost);

module.exports = router;