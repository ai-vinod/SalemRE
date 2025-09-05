import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

// Hook to manage loading states
export const useLoading = () => {
  const { loading, setLoading, clearLoading } = useContext(LoadingContext);
  return { loading, setLoading, clearLoading };
};

// Hook to manage error states
export const useError = () => {
  const { error, setError, clearError } = useContext(LoadingContext);
  return { error, setError, clearError };
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const clearLoadingState = (key) => {
    setLoading(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const setErrorState = (key, message) => {
    setError(prev => ({ ...prev, [key]: message }));
  };

  const clearErrorState = (key) => {
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
