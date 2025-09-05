import api from './api';

const inquiryService = {
  /**
   * Create new inquiry (public)
   * @param {Object} inquiryData - Inquiry data
   * @returns {Promise} - Response from API
   */
  createInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit inquiry' };
    }
  },

  /**
   * Get user's inquiries (protected)
   * @returns {Promise} - Response from API
   */
  getUserInquiries: async () => {
    try {
      const response = await api.get('/inquiries/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inquiries' };
    }
  },

  /**
   * Get all inquiries with optional filtering, sorting, and pagination (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response from API
   */
  getInquiries: async (params = {}) => {
    try {
      const response = await api.get('/inquiries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inquiries' };
    }
  },

  /**
   * Get single inquiry by ID (admin only)
   * @param {string} id - Inquiry ID
   * @returns {Promise} - Response from API
   */
  getInquiry: async (id) => {
    try {
      const response = await api.get(`/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inquiry' };
    }
  },

  /**
   * Update inquiry (admin only)
   * @param {string} id - Inquiry ID
   * @param {Object} inquiryData - Updated inquiry data
   * @returns {Promise} - Response from API
   */
  updateInquiry: async (id, inquiryData) => {
    try {
      const response = await api.put(`/inquiries/${id}`, inquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update inquiry' };
    }
  },

  /**
   * Delete inquiry (admin only)
   * @param {string} id - Inquiry ID
   * @returns {Promise} - Response from API
   */
  deleteInquiry: async (id) => {
    try {
      const response = await api.delete(`/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete inquiry' };
    }
  }
};

export default inquiryService;