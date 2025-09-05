import api from './api';

const propertyService = {
  /**
   * Get all properties with optional filtering, sorting, and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response from API
   */
  getProperties: async (params = {}) => {
    try {
      const response = await api.get('/properties', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch properties' };
    }
  },

  /**
   * Get featured properties
   * @returns {Promise} - Response from API
   */
  getFeaturedProperties: async () => {
    try {
      const response = await api.get('/properties/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured properties' };
    }
  },

  /**
   * Get single property by ID
   * @param {string} id - Property ID
   * @returns {Promise} - Response from API
   */
  getProperty: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property' };
    }
  },

  /**
   * Create new property (admin only)
   * @param {Object} propertyData - Property data
   * @returns {Promise} - Response from API
   */
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create property' };
    }
  },

  /**
   * Update property (admin only)
   * @param {string} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise} - Response from API
   */
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update property' };
    }
  },

  /**
   * Delete property (admin only)
   * @param {string} id - Property ID
   * @returns {Promise} - Response from API
   */
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete property' };
    }
  },

  /**
   * Set main image for property (admin only)
   * @param {string} propertyId - Property ID
   * @param {string} imageId - Image ID to set as main
   * @returns {Promise} - Response from API
   */
  setMainImage: async (propertyId, imageId) => {
    try {
      const response = await api.put(`/properties/${propertyId}/images/${imageId}/main`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set main image' };
    }
  }
};

export default propertyService;