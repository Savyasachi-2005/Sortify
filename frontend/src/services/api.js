import axios from 'axios';
import { refreshToken } from '../pages/TokenRefresh';

// Create a custom axios instance
export const API_BASE = (() => {
  const fromWindow = typeof window !== 'undefined' && window.env && window.env.VITE_API_BASE_URL;
  const fromImportMeta = import.meta?.env?.VITE_API_BASE_URL;
  const fromProcess = typeof process !== 'undefined' ? process.env?.VITE_API_BASE_URL : undefined;
  const inferred = fromWindow || fromImportMeta || fromProcess;

  if (inferred) return inferred;

  // If running on non-localhost and no env is set, default to Render URL
  if (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost') {
    return 'https://sortify-y45h.onrender.com';
  }

  return 'http://localhost:8000';
})();

const api = axios.create({
  baseURL: API_BASE,
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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshToken();
        
        // Update the header for this request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Process other requests in the queue
        processQueue(null, newToken);
        
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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
// Task management
export const getTasks = () => {
  return api.get('/api/tasks/');
};

export const deleteTask = (taskId) => {
  return api.delete(`/api/tasks/${taskId}`);
};

export const updateTaskStatus = (taskId, status) => {
  return api.patch(`/api/tasks/${taskId}/status`, { status });
};

// Create/save a task (manual entry uses same schema as processed task)
export const saveTask = (task) => {
  // expects: { original_task, smart_task, priority }
  return api.post('/api/tasks/save', task);
};

export default api;
