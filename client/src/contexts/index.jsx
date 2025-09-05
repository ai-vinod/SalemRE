import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { LoadingProvider, useLoading } from './LoadingContext';
import { ErrorProvider, useError } from './ErrorContext';

export {
  AuthProvider,
  useAuth,
  LoadingProvider,
  useLoading,
  ErrorProvider,
  useError
};

// Combined provider for all contexts
export const AppProviders = ({ children }) => {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LoadingProvider>
    </ErrorProvider>
  );
};