import api from './api';

const userService = {
  /**
   * Get all users with optional filtering, sorting, and pagination (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response from API
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  /**
   * Get single user by ID (admin only)
   * @param {string} id - User ID
   * @returns {Promise} - Response from API
   */
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  /**
   * Create new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} - Response from API
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  /**
   * Update user (admin only)
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response from API
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  /**
   * Delete user (admin only)
   * @param {string} id - User ID
   * @returns {Promise} - Response from API
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  /**
   * Get user stats (admin only)
   * @param {string} id - User ID
   * @returns {Promise} - Response from API
   */
  getUserStats: async (id) => {
    try {
      const response = await api.get(`/users/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user stats' };
    }
  }
};

export default userService;