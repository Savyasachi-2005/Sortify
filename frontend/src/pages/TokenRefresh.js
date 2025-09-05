import axios from 'axios';
import { API_BASE } from '../services/api';

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
  const response = await axios.post(`${API_BASE}/api/auth/refresh`, {
      token: refreshToken
    });
    
    // Check if the response has the expected format
    if (!response.data || !response.data.access_token) {
      console.error('Invalid response format from server:', response.data);
      throw new Error('Invalid response format from server');
    }
    
    const { access_token, refresh_token, user } = response.data;
    
    // Update tokens in localStorage
    localStorage.setItem('access_token', access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }
    
    // Update user data if present
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    throw error;
  }
};
