import api from './api';

const blogService = {
  /**
   * Get all blog posts with optional filtering, sorting, and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response from API
   */
  getBlogPosts: async (params = {}) => {
    try {
      const response = await api.get('/blog', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch blog posts' };
    }
  },

  /**
   * Get single blog post by ID
   * @param {string} id - Blog post ID
   * @returns {Promise} - Response from API
   */
  getBlogPost: async (id) => {
    try {
      const response = await api.get(`/blog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch blog post' };
    }
  },

  /**
   * Get all blog categories
   * @returns {Promise} - Response from API
   */
  getCategories: async () => {
    try {
      const response = await api.get('/blog/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  /**
   * Get all blog tags
   * @returns {Promise} - Response from API
   */
  getTags: async () => {
    try {
      const response = await api.get('/blog/tags');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tags' };
    }
  },

  /**
   * Create new blog post (admin only)
   * @param {Object} blogData - Blog post data
   * @returns {Promise} - Response from API
   */
  createBlogPost: async (blogData) => {
    try {
      const response = await api.post('/blog', blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create blog post' };
    }
  },

  /**
   * Update blog post (admin only)
   * @param {string} id - Blog post ID
   * @param {Object} blogData - Updated blog post data
   * @returns {Promise} - Response from API
   */
  updateBlogPost: async (id, blogData) => {
    try {
      const response = await api.put(`/blog/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update blog post' };
    }
  },

  /**
   * Delete blog post (admin only)
   * @param {string} id - Blog post ID
   * @returns {Promise} - Response from API
   */
  deleteBlogPost: async (id) => {
    try {
      const response = await api.delete(`/blog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete blog post' };
    }
  }
};

export default blogService;