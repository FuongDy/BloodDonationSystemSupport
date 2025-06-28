// src/services/authService.js
import apiClient from './apiClient';

const requestOtp = async (registerRequest, frontImage, backImage) => {
  try {
    // Log what we're sending to help debug
    // console.log('Sending registration data to backend:', JSON.stringify(registerRequest));
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    
    // Add registration data as JSON string
    formData.append('registrationData', JSON.stringify(registerRequest));
    
    // Add CCCD images
    if (frontImage) {
      formData.append('frontImage', frontImage);
    }
    if (backImage) {
      formData.append('backImage', backImage);
    }
    
    const response = await apiClient.post(
      '/auth/register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // console.log('Backend response for OTP request:', response);
    
    // Return a standardized success response object
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Auth service error:', error.message);
    // Log more detailed error information for debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      console.error('Full error object:', error);
    } else {
      console.error('Network or other error (no response):', error);
    }
    
    throw error;
  }
};

const verifyAndRegister = async verifyRequest => {
  try {
    // console.log('Sending OTP verification data to backend:', JSON.stringify(verifyRequest));
    const response = await apiClient.post(
      '/auth/register/verify',
      verifyRequest
    );
    // console.log('OTP verification response from backend:', response);
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Verify and register error:', error.message);
    // Log more detailed error information for debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Network or other error (no response):', error);
    }
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

const getProfile = async () => {
  try {
    const response = await apiClient.get('/users/me/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.message);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
const register = async userData => {
  try {
    // Validate and format data before sending
    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth, // YYYY-MM-DD format
      password: userData.password,
      bloodTypeId: userData.bloodTypeId,
    };

    // Remove null/undefined values
    Object.keys(payload).forEach(key => {
      if (
        payload[key] === null ||
        payload[key] === undefined ||
        payload[key] === ''
      ) {
        if (key === 'address' || key === 'bloodTypeId') {
          payload[key] = null; // Keep null for optional fields
        } else {
          delete payload[key];
        }
      }
    });

    // console.log('Auth service sending payload:', payload);

    const response = await apiClient.post('/auth/register', payload);

    return response.data;
  } catch (error) {
    console.error('Auth service register error:', error);
    throw error;
  }
};

/**
 * Verify OTP for account activation
 * @param {Object} otpData - OTP verification data
 * @returns {Promise<Object>} Verification response
 */
const verifyOTP = async otpData => {
  try {
    // console.log('Sending OTP verification data to backend:', JSON.stringify(otpData));
    const response = await apiClient.post('/auth/register/verify', otpData);
    // console.log('OTP verification response from backend:', response);
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Auth service verify OTP error:', error);
    // Log more detailed error information for debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Network or other error (no response):', error);
    }
    throw error;
  }
};

/**
 * Resend OTP to email
 * @param {Object} emailData - Email data containing email
 * @returns {Promise<Object>} Resend response
 */
const resendOTP = async emailData => {
  try {
    // console.log('Requesting resend OTP with data:', JSON.stringify(emailData));
    
    // Use the existing registration endpoint with minimal data (just email) to request a new OTP
    const response = await apiClient.post('/auth/register/request-otp', {
      email: emailData.email,
      // Including empty required fields to satisfy backend validation
      fullName: " ", // These will be ignored since the email already exists
      password: " ",
      phone: " ",
      address: " ",
      dateOfBirth: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    });
    
    // console.log('Resend OTP response from backend:', response);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Auth service resend OTP error:', error);
    // Log more detailed error information for debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Network or other error (no response):', error);
    }
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
  register,
  verifyOTP,
  resendOTP,
};

export default authService;
