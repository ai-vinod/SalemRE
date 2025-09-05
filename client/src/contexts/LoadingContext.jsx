import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

// Hook to manage loading states
export const useLoading = () => {
  const { loading, setLoading, clearLoading } = useContext(LoadingContext);
  return { loading, setLoading, clearLoading };
};

// Error handling is now managed in ErrorContext.jsx

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({}); // State for managing errors

  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const clearLoadingState = (key) => {
    setLoading(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const setErrorState = (key, message) => { // Function to set an error
    setError(prev => ({ ...prev, [key]: message }));
  };

  const clearErrorState = (key) => { // Function to clear an error
    setError(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const value = {
    loading,
    setLoading: setLoadingState,
    clearLoading: clearLoadingState,
    error,
    setError: setErrorState,
    clearError: clearErrorState,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;