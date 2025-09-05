import { createContext, useState, useContext } from 'react';

const ErrorContext = createContext(null);

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState({});

  const setError = (key, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [key]: errorMessage
    }));
  };

  const clearError = (key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasError = (key) => {
    return !!errors[key];
  };

  const getError = (key) => {
    return errors[key] || '';
  };

  const value = {
    setError,
    clearError,
    clearAllErrors,
    hasError,
    getError,
    errors
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};