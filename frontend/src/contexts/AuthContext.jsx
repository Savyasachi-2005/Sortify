import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000';

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending signup data:', userData); // Debug log
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Signup response:', response.data); // Debug log
      
      const { user: userResponseData, access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userResponseData);
      toast.success('Signup successful!');
      
      return { success: true, user: userResponseData };
    } catch (err) {
      console.error('Signup error:', err); // Debug log
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
      
      const { user: userResponseData, access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
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