import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to extract error messages
const getErrorMessage = (error) => {
  console.log('Error object:', error); // Debug log
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    
    // If detail is an array of validation errors
    if (Array.isArray(detail)) {
      return detail.map(err => {
        if (typeof err === 'string') return err;
        if (err.msg) return `${err.loc?.join('.')} - ${err.msg}`;
        return JSON.stringify(err);
      }).join(', ');
    }
    
    // If detail is a string
    if (typeof detail === 'string') {
      return detail;
    }
    
    // If detail is an object
    if (detail.msg) {
      return detail.msg;
    }
  }
  
  return error?.message || 'An error occurred';
};

const setupAuthenticatedRequest = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = API_BASE;

  // Configure axios defaults and restore session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Set up axios defaults
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token and get user data
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
        const userData = response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to restore session:', error);
        if (error.response?.status === 401) {
          // Only clear storage on actual auth errors
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
  // Clear, structured logs for diagnostics
  console.log('[Auth] Sending signup data:', JSON.parse(JSON.stringify(userData)));
  console.log('[Auth] Signup URL:', `${API_BASE_URL}/api/auth/signup`);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
  console.log('[Auth] Signup response:', response.data);
      
      const { user: userResponseData, access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userResponseData));
      setupAuthenticatedRequest();
      
      setUser(userResponseData);
      toast.success('Signup successful!');
      
      return { success: true, user: userResponseData };
    } catch (err) {
      // Log as much context as possible
      console.error('[Auth] Signup error:', err);
      if (err.response) {
        console.error('[Auth] Error status:', err.response.status);
        console.error('[Auth] Error headers:', err.response.headers);
        console.error('[Auth] Error data:', err.response.data);
      } else if (err.request) {
        console.error('[Auth] No response received. Request details:', err.request);
      }
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Log what's being sent
      console.log('Sending login credentials:', credentials);
      
      // Make sure credentials have email and password properties
      if (!credentials.email || !credentials.password) {
        const errorMsg = "Email and password are required";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // Make sure you have the correct payload structure
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('Login data being sent:', loginData);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Login response:', response.data);
      
      const { user: userResponseData, access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userResponseData));
      setupAuthenticatedRequest();
      
      setUser(userResponseData);
      toast.success('Login successful!');
      
      return { success: true, user: userResponseData };
    } catch (err) {
      console.error('Login error:', err);
      
      // Enhanced error handling
      let errorMessage = getErrorMessage(err);
      
      // Check for specific error details
      if (err.response?.data?.detail) {
        errorMessage = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Invalid email or password';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    toast.success('Logout successful!');
  };

  const verifyAndLogin = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        throw new Error("No verification token provided");
      }
      
      // Set the token in localStorage and axios headers
      localStorage.setItem('access_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get the user data with the token
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('User data from verification:', response.data);
      
      setUser(response.data);
      toast.success('Email verified successfully!');
      
      return { success: true, user: response.data };
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(`Verification failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    verifyAndLogin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};