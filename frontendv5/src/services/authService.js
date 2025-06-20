// src/services/authService.js
import apiClient from './apiClient';

const requestOtp = async registerRequest => {
  try {
    console.log('=== AUTH SERVICE REQUEST OTP ===');
    console.log('Request payload:', JSON.stringify(registerRequest, null, 2));
    console.log('Payload keys:', Object.keys(registerRequest));
    console.log('Required fields check:');
    console.log('- fullName:', registerRequest.fullName || 'MISSING');
    console.log('- email:', registerRequest.email || 'MISSING');
    console.log('- password:', registerRequest.password ? '[PROVIDED]' : 'MISSING');
    console.log('- phone:', registerRequest.phone || 'MISSING');
    console.log('- address:', registerRequest.address || 'MISSING');
    console.log('- dateOfBirth:', registerRequest.dateOfBirth || 'MISSING');
    console.log('- bloodTypeId:', registerRequest.bloodTypeId || 'MISSING');
    console.log('===============================');
    
    const response = await apiClient.post('/auth/register/request-otp', registerRequest);
    console.log('Success response:', response.data);
    return response;
  } catch (error) {
    console.error('=== AUTH SERVICE ERROR ===');
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('==========================');
    throw error;
  }
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
