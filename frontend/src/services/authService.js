// src/services/authService.js
import apiClient from './apiClient';

const requestOtp = async registerRequest => {
    try {
        // Gửi JSON request theo backend API specification
        const registrationData = {
            fullName: registerRequest.fullName,
            email: registerRequest.email,
            phone: registerRequest.phone,
            address: registerRequest.address,
            dateOfBirth: registerRequest.dateOfBirth,
            password: registerRequest.password,
            bloodTypeId: registerRequest.bloodTypeId,
            latitude: registerRequest.latitude,
            longitude: registerRequest.longitude
        };

        const response = await apiClient.post('/auth/register', registrationData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Auth service error:', error.message);
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

const getProfile = async() => {
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
            dateOfBirth: userData.dateOfBirth, // dd-MM-yyyy format
            password: userData.password,
            bloodTypeId: userData.bloodTypeId,
            latitude: userData.latitude,
            longitude: userData.longitude
        };

        // Remove null/undefined values
        Object.keys(payload).forEach(key => {
            if (
                payload[key] === null ||
                payload[key] === undefined ||
                payload[key] === ''
            ) {
                if (key === 'address' || key === 'bloodTypeId' || key === 'latitude' || key === 'longitude') {
                    payload[key] = null; // Keep null for optional fields
                } else {
                    delete payload[key];
                }
            }
        });

        // console.log('Auth service sending payload:', payload);

        const response = await apiClient.post('/auth/register', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
        const response = await apiClient.post('/auth/register/resend-otp', {
            email: emailData.email
        });

        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Auth service resend OTP error:', error);
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