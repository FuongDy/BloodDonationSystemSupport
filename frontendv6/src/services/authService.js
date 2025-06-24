// src/services/authService.js
import apiClient from './apiClient';

const requestOtp = async registerRequest => {
    try {
        const response = await apiClient.post('/auth/register/request-otp', registerRequest);
        return response;
    } catch (error) {
        console.error('Auth service error:', error.message);
        throw error;
    }
};

const verifyAndRegister = async verifyRequest => {
    try {
        const response = await apiClient.post('/auth/register/verify', verifyRequest);
        return response;
    } catch (error) {
        console.error('Verify and register error:', error.message);
        throw error;
    }
};

const login = async credentials => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
};

const getProfile = async() => {
    try {
        const response = await apiClient.get('/users/me/profile');
        return response.data;
    } catch (error) {
        console.error('Get profile error:', error.message);
        throw error;
    }
};

// No need for logout() or getCurrentUser() here anymore,
// as they are managed by AuthContext and apiClient interceptors.

export const authService = {
    requestOtp,
    verifyAndRegister,
    login,
    getProfile,
};


