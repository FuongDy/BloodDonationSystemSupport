// src/services/apiClient.js
import axios from 'axios';
import authService from './authService'; // Thêm: Import authService

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm: Interceptor để xử lý lỗi response
apiClient.interceptors.response.use(
    (response) => {
        return response; // Trả về response nếu không có lỗi
    },
    (error) => {
        // Xử lý lỗi token hết hạn (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Kiểm tra xem có phải lỗi từ trang login không để tránh vòng lặp vô hạn
            if (window.location.pathname !== '/login') {
                authService.logout();
                window.location.href = '/login?sessionExpired=true'; // Chuyển hướng về trang login
            }
        }
        return Promise.reject(error);
    }
);


export default apiClient;