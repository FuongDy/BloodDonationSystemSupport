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

/**
 * Send forgot password request
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Auth service forgot password error:', error);
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
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response
 */
const resetPassword = async (token, newPassword) => {
    try {
        console.log('Resetting password with token (length):', token.length);
        console.log('New password (length):', newPassword.length);
        
        // Đảm bảo token được xử lý đúng (không hiển thị toàn bộ token vì lý do bảo mật)
        const tokenPreview = token.length > 10 ? 
            `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : 
            '***token-too-short***';
        console.log('Token preview:', tokenPreview);
        
        // Thử nhiều kiểu payload khác nhau để phù hợp với mong đợi của backend
        const payload = {
            token: token,
            newPassword: newPassword, // Một số API mong đợi newPassword
            password: newPassword     // Một số API khác mong đợi password
        };
        
        console.log('Reset password payload structure:', 
                    { token: tokenPreview, password: '*'.repeat(newPassword.length) });
        
        // Thử sử dụng cách truyền tham số khác
        const response = await apiClient.post('/auth/reset-password', payload);
        
        console.log('Reset password response status:', response.status);
        console.log('Reset password response data:', response.data);
        
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Auth service reset password error:', error);
        if (error.response) {
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);
            
            // Thông báo chi tiết hơn về lỗi
            if (typeof error.response.data === 'string') {
                console.error('Error details (string):', error.response.data);
            } else if (error.response.data?.message) {
                console.error('Error message:', error.response.data.message);
            }
        } else {
            console.error('Network or other error (no response):', error);
        }
        throw error;
    }
};

/**
 * Validate reset password token
 * @param {string} token - Reset token
 * @returns {Promise<Object>} Response
 */
const validateResetToken = async (token) => {
    try {
        console.log('Validating reset token, token length:', token.length);
        
        // Thử sử dụng endpoint cụ thể với token trong URL
        // Nhiều API sẽ mong đợi token trong URL path thay vì query param
        const response = await apiClient.post('/auth/validate-reset-token', { token });
        
        console.log('Token validation response:', response);
        
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Auth service validate reset token error:', error);
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
    forgotPassword,
    resetPassword,
    validateResetToken,
};

export default authService;