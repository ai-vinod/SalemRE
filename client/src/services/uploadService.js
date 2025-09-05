import api from './api';

const uploadService = {
  /**
   * Upload property images (admin only)
   * @param {FormData} formData - Form data containing images
   * @returns {Promise} - Response from API
   */
  uploadPropertyImages: async (formData) => {
    try {
      const response = await api.post('/upload/property', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload property images' };
    }
  },

  /**
   * Upload blog image (admin only)
   * @param {FormData} formData - Form data containing image
   * @returns {Promise} - Response from API
   */
  uploadBlogImage: async (formData) => {
    try {
      const response = await api.post('/upload/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload blog image' };
    }
  },

  /**
   * Upload user avatar (authenticated users)
   * @param {FormData} formData - Form data containing avatar image
   * @returns {Promise} - Response from API
   */
  uploadAvatar: async (formData) => {
    try {
      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload avatar' };
    }
  },

  /**
   * Remove image from Cloudinary (admin only)
   * @param {Object} data - Object containing public_id of image to remove
   * @returns {Promise} - Response from API
   */
  removeImage: async (data) => {
    try {
      const response = await api.post('/upload/remove', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove image' };
    }
  }
};

export default uploadService;