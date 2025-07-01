import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false); // For login/register actions
  const [isAuthenticating, setIsAuthenticating] = useState(true); // For initial auth check

  const handleAuthSuccess = authData => {
    const { accessToken, token, ...userData } = authData;
    // Support both 'token' and 'accessToken' from backend
    const authToken = accessToken || token;

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const login = async credentials => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      handleAuthSuccess(data);
      toast.success('Đăng nhập thành công!');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Email hoặc mật khẩu không đúng.';
      toast.error(errorMessage);
      throw error; // Re-throw for component-level handling if needed
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // No need to redirect here, ProtectedRoute will handle it
  }, []);

  const requestRegistration = async registerRequest => {
    setIsLoading(true);
    try {
      // console.log('AuthContext: Starting registration request with data:', registerRequest);
      
      const response = await authService.requestOtp(registerRequest);
      
      // console.log('AuthContext: Registration/OTP request successful:', response);
      
      // Only show success toast if we actually got a successful response
      if (response && response.success) {
        toast.success('Mã OTP đã được gửi đến email của bạn.');
      } else {
        console.warn('AuthContext: Strange response format - success without proper response data', response);
      }
      
      return response; // Return the standardized response object
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      // Enhanced error handling with better fallback messages
      let errorMessage = 'Yêu cầu đăng ký thất bại.';
      
      if (error.response) {
        // Get error message from response data
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
          // console.log('Error response data (string):', error.response.data);
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
          // console.log('Error response data (object with message):', error.response.data);
        } else {
          // console.log('Error response data (unknown format):', error.response.data);
        }
        
        // console.log('Error status:', error.response.status);
      } else {
        // console.log('Network or other error (no response):', error);
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async verifyRequest => {
    setIsLoading(true);
    try {
      // console.log('AuthContext: Starting verification with data:', verifyRequest);
      
      const response = await authService.verifyAndRegister(verifyRequest);
      
      // console.log('AuthContext: Verification successful:', response);
      
      toast.success(
        response.data || 'Tài khoản đã được xác minh và tạo thành công!'
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Verification error in AuthContext:', error);
      
      let errorMessage = 'Xác minh OTP thất bại.';
      
      if (error.response) {
        // Get error message from response data
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
          // console.log('Error response data (string):', error.response.data);
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
          // console.log('Error response data (object with message):', error.response.data);
        } else {
          // console.log('Error response data (unknown format):', error.response.data);
        }
        
        // console.log('Error status:', error.response.status);
      } else {
        // console.log('Network or other error (no response):', error);
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // This assumes you have a /me or /profile endpoint to validate the token
          // and get user data.
          const userData = await authService.getProfile();
          setUser(userData);
        } catch {
          // Token is invalid or expired
          logout();
        }
      }
      setIsAuthenticating(false);
    };

    verifyToken();
  }, [token, logout]);

  // Add verifyOTP function
  const verifyOTP = async (otpData) => {
    setIsLoading(true);
    try {
      // console.log('Verifying OTP with data:', otpData);
      const response = await authService.verifyOTP(otpData);
      // console.log('OTP verification response:', response);
      
      if (response) {
        toast.success('Xác thực OTP thành công!');
        return { success: true, data: response };
      } else {
        throw new Error('Không nhận được phản hồi xác thực OTP hợp lệ');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      let errorMessage = 'Xác thực OTP thất bại.';
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add resendOTP function
  const resendOTP = async (emailData) => {
    setIsLoading(true);
    try {
      // console.log('Requesting resend OTP with data:', emailData);
      const response = await authService.resendOTP(emailData);
      // console.log('Resend OTP response:', response);
      
      if (response) {
        toast.success('Mã OTP mới đã được gửi đến email của bạn!');
        return { success: true, data: response };
      } else {
        throw new Error('Không nhận được phản hồi gửi lại OTP hợp lệ');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      let errorMessage = 'Không thể gửi lại mã OTP.';
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    setUser,
    token,
    isLoading,
    isAuthenticating,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    requestRegistration,
    verifyAndRegister,
    verifyOTP,
    resendOTP,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};
