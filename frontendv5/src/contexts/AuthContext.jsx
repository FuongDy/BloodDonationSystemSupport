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
      const response = await authService.requestOtp(registerRequest);
      toast.success(response.data || 'Mã OTP đã được gửi đến email của bạn.');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Yêu cầu đăng ký thất bại.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async verifyRequest => {
    setIsLoading(true);
    try {
      const response = await authService.verifyAndRegister(verifyRequest);
      toast.success(
        response.data || 'Tài khoản đã được xác minh và tạo thành công!'
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Xác minh OTP thất bại.';
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
        } catch (_error) {
          // Token is invalid or expired
          logout();
        }
      }
      setIsAuthenticating(false);
    };

    verifyToken();
  }, [token, logout]);

  const contextValue = {
    user,
    token,
    isLoading,
    isAuthenticating,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    requestRegistration,
    verifyAndRegister,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};
