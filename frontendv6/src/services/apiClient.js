// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  config => {
    // Get token directly from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and other global errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Remove the token from storage
      localStorage.removeItem('token');

      // Redirect to the login page, but avoid a redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        // You might want to show a toast message here as well
        // For example: toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
