import { createContext, useState, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authService } from '../services'
import api from '../utils/api'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token')
          setUser(null)
        } else {
          setUser(decoded)
          // Set authorization header for all requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Invalid token', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token } = response
      localStorage.setItem('token', token)
      
      const decoded = jwtDecode(token)
      setUser(decoded)
      
      // Set authorization header for all requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      // Update the user state with new information
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        // Merge the updated user data with the decoded token data
        setUser({ ...decoded, ...response.user });
      }
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile. Please try again.'
      };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await authService.updatePassword(passwordData);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update password. Please try again.'
      };
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(prevUser => ({ ...prevUser, ...userData }));
      return { success: true };
    } catch (error) {
      console.error('Failed to refresh user data', error);
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    updateProfile,
    updatePassword,
    refreshUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}