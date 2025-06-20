// src/services/authService.js
import apiClient from './apiClient';

const requestOtp = registerRequest => {
  return apiClient.post('/auth/register/request-otp', registerRequest);
};

const verifyAndRegister = verifyRequest => {
  return apiClient.post('/auth/register/verify', verifyRequest);
};

const login = async credentials => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data; // The interceptor in apiClient will handle the response
};

const getProfile = async () => {
  const response = await apiClient.get('/users/me/profile'); // Match với UserController
  return response.data;
};

// No need for logout() or getCurrentUser() here anymore,
// as they are managed by AuthContext and apiClient interceptors.

export const authService = {
  requestOtp,
  verifyAndRegister,
  login,
  getProfile,
};
