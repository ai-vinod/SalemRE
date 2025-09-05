const express = require('express');
const router = express.Router();
const { 
  uploadPropertyImages, 
  uploadBlogImage, 
  uploadAvatar, 
  removeImage 
} = require('../controllers/uploadController');
const { 
  uploadPropertyImage, 
  uploadBlogImage: blogImageUpload, 
  uploadAvatar: avatarUpload 
} = require('../utils/cloudinary');
const { protect, admin } = require('../middleware/auth');

// Property image upload (admin only)
router.post(
  '/property', 
  protect, 
  admin, 
  uploadPropertyImage.array('images', 10), 
  uploadPropertyImages
);

// Blog image upload (admin only)
router.post(
  '/blog', 
  protect, 
  admin, 
  blogImageUpload.single('image'), 
  uploadBlogImage
);

// Avatar upload (any authenticated user)
router.post(
  '/avatar', 
  protect, 
  avatarUpload.single('avatar'), 
  uploadAvatar
);

// Delete image (admin only)
router.delete('/:publicId', protect, admin, removeImage);

module.exports = router;