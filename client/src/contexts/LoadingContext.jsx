import { createContext, useState, useContext } from 'react';

const LoadingContext = createContext(null);

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const isLoading = (key) => {
    return !!loadingStates[key];
  };

  const value = {
    setLoading,
    isLoading,
    loadingStates
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};