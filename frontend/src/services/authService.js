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
  
  // DEBUG: Log response để kiểm tra
  console.log('=== getProfile API Response ===');
  console.log('Full response:', response);
  console.log('Response data:', response.data);
  console.log('User role:', response.data?.role);
  console.log('User role_id:', response.data?.role_id);
  console.log('================================');
  
  // Nếu API chỉ trả về role string, convert thành role_id
  const userData = response.data;
  if (userData && !userData.role_id && userData.role) {
    // Mapping role string thành role_id
    const roleMapping = {
      'ADMIN': 4,
      'STAFF': 3,
      'USER': 2,
      'MEMBER': 2,
      'DONOR': 2
    };
    userData.role_id = roleMapping[userData.role.toUpperCase()] || 2;
    console.log('Mapped role_id:', userData.role_id);
  }
  
  return userData;
};

// No need for logout() or getCurrentUser() here anymore,
// as they are managed by AuthContext and apiClient interceptors.

export const authService = {
  requestOtp,
  verifyAndRegister,
  login,
  getProfile,
};
