import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  // Setting withCredentials to false since we're manually adding the auth token in headers
  withCredentials: false,
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we get a 401, clear the token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API key management
export const updateApiKey = (apiKey) => {
  return api.put('/api/users/api-key', { api_key: apiKey });
};

// Email management
export const sendTaskResultEmail = (tasks, processedTasks) => {
  return api.post('/api/email/send-task-result', {
    tasks: tasks,
    processed_tasks: processedTasks
  });
};

export default api;
