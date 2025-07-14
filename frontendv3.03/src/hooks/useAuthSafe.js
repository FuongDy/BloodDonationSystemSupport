// src/hooks/useAuthSafe.js
import { useAuth } from './useAuth';

/**
 * Safe wrapper for useAuth that handles hot reload issues
 * Returns default values if AuthContext is not available
 */
export const useAuthSafe = () => {
  try {
    return useAuth();
  } catch (error) {
    console.warn('AuthContext not available, using fallback:', error.message);
    return {
      user: null,
      token: null,
      isLoading: false,
      isAuthenticating: false,
      login: async () => {
        console.warn('Auth login called but context not available');
        throw new Error('Authentication service not available');
      },
      logout: () => {
        console.warn('Auth logout called but context not available');
      },
      register: async () => {
        console.warn('Auth register called but context not available');
        throw new Error('Authentication service not available');
      },
      verifyOtp: async () => {
        console.warn('Auth verifyOtp called but context not available');
        throw new Error('Authentication service not available');
      },
      resendOtp: async () => {
        console.warn('Auth resendOtp called but context not available');
        throw new Error('Authentication service not available');
      },
      updateProfile: async () => {
        console.warn('Auth updateProfile called but context not available');
        throw new Error('Authentication service not available');
      },
      clearAuthData: () => {
        console.warn('Auth clearAuthData called but context not available');
      },
      checkAuthStatus: async () => {
        console.warn('Auth checkAuthStatus called but context not available');
        return false;
      }
    };
  }
};
