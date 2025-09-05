const { cloudinary, deleteImage } = require('../utils/cloudinary');

/**
 * @desc    Upload property images
 * @route   POST /api/upload/property
 * @access  Private (Admin only)
 */
const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalname: file.originalname
    }));

    res.status(200).json({
      success: true,
      count: uploadedImages.length,
      data: uploadedImages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Upload blog post image
 * @route   POST /api/upload/blog
 * @access  Private (Admin only)
 */
const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const uploadedImage = {
      url: req.file.path,
      publicId: req.file.filename,
      originalname: req.file.originalname
    };

    res.status(200).json({
      success: true,
      data: uploadedImage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Upload user avatar
 * @route   POST /api/upload/avatar
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const uploadedImage = {
      url: req.file.path,
      publicId: req.file.filename,
      originalname: req.file.originalname
    };

    // Update user avatar in database
    req.user.avatar = uploadedImage.url;
    await req.user.save();

    res.status(200).json({
      success: true,
      data: uploadedImage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private (Admin only)
 */
const removeImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, error: 'Public ID is required' });
    }

    const result = await deleteImage(publicId);

    if (result.result !== 'ok') {
      return res.status(400).json({ success: false, error: 'Failed to delete image' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  uploadPropertyImages,
  uploadBlogImage,
  uploadAvatar,
  removeImage
};