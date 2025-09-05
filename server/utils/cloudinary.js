const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for property images
const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'salem-re/properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
    format: 'webp'
  }
});

// Configure storage for blog post images
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'salem-re/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
    format: 'webp'
  }
});

// Configure storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'salem-re/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
    format: 'webp'
  }
});

// Create multer upload instances
const uploadPropertyImage = multer({ storage: propertyStorage });
const uploadBlogImage = multer({ storage: blogStorage });
const uploadAvatar = multer({ storage: avatarStorage });

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  if (!publicId) return null;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

module.exports = {
  uploadPropertyImage,
  uploadBlogImage,
  uploadAvatar,
  deleteImage,
  cloudinary
};