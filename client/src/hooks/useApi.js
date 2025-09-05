import { useLoading } from '../contexts/LoadingContext';
import { useError } from '../contexts/ErrorContext';

/**
 * Custom hook for handling API requests with loading and error states
 * @returns {Object} API request handler functions
 */
export const useApi = () => {
  const { setLoading } = useLoading();
  const { setError, clearError } = useError();

  /**
   * Execute an API request with loading and error handling
   * @param {string} key - Unique identifier for this request (for loading/error state)
   * @param {Function} apiCall - The API function to call
   * @param {Object} options - Additional options
   * @param {boolean} options.showLoading - Whether to show loading state
   * @param {boolean} options.showError - Whether to set error state on failure
   * @returns {Promise} - The result of the API call
   */
  const request = async (key, apiCall, { showLoading = true, showError = true } = {}) => {
    if (showLoading) {
      setLoading(key, true);
    }
    
    if (showError) {
      clearError(key);
    }
    
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      if (showError) {
        setError(key, error.message || 'An error occurred');
      }
      throw error;
    } finally {
      if (showLoading) {
        setLoading(key, false);
      }
    }
  };

  return { request };
};

export default useApi;