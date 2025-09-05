import api from './api';

const dashboardService = {
  /**
   * Get dashboard statistics and recent data
   * @returns {Promise} - Response from API
   */
  getDashboardData: async () => {
    try {
      // Get all dashboard data from the dashboard endpoint
      const response = await api.get('/dashboard/stats');
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },
};

export default dashboardService;