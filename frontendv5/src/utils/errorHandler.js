// src/utils/errorHandler.js
import React from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

/**
 * Global Error Handler Utility
 * Provides centralized error handling for the application
 */

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Error types
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown',
};

/**
 * HTTP status code to error type mapping
 */
const STATUS_CODE_MAP = {
  400: ERROR_TYPES.VALIDATION,
  401: ERROR_TYPES.AUTHENTICATION,
  403: ERROR_TYPES.AUTHORIZATION,
  404: ERROR_TYPES.CLIENT,
  422: ERROR_TYPES.VALIDATION,
  429: ERROR_TYPES.CLIENT,
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.NETWORK,
  503: ERROR_TYPES.NETWORK,
  504: ERROR_TYPES.NETWORK,
};

/**
 * Get user-friendly error messages
 * @param {string} errorType - Error type
 * @param {number} statusCode - HTTP status code
 * @returns {string} - User-friendly error message
 */
const getErrorMessage = (errorType, statusCode) => {
  const messages = {
    [ERROR_TYPES.NETWORK]:
      'Mất kết nối mạng. Vui lòng kiểm tra kết nối internet.',
    [ERROR_TYPES.VALIDATION]:
      'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
    [ERROR_TYPES.AUTHENTICATION]:
      'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    [ERROR_TYPES.AUTHORIZATION]: 'Bạn không có quyền thực hiện hành động này.',
    [ERROR_TYPES.SERVER]: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    [ERROR_TYPES.CLIENT]: 'Yêu cầu không hợp lệ.',
    [ERROR_TYPES.UNKNOWN]: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  };

  // Special cases for specific status codes
  if (statusCode === 404) {
    return 'Không tìm thấy trang hoặc dữ liệu được yêu cầu.';
  }

  if (statusCode === 429) {
    return 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.';
  }

  return messages[errorType] || messages[ERROR_TYPES.UNKNOWN];
};

/**
 * Determine error severity based on type and status code
 * @param {string} errorType - Error type
 * @param {number} statusCode - HTTP status code
 * @returns {string} - Error severity level
 */
const getErrorSeverity = (errorType, statusCode) => {
  if (errorType === ERROR_TYPES.AUTHENTICATION) return ERROR_SEVERITY.HIGH;
  if (errorType === ERROR_TYPES.SERVER) return ERROR_SEVERITY.HIGH;
  if (errorType === ERROR_TYPES.NETWORK) return ERROR_SEVERITY.MEDIUM;
  if (statusCode >= 500) return ERROR_SEVERITY.HIGH;
  if (statusCode >= 400) return ERROR_SEVERITY.MEDIUM;
  return ERROR_SEVERITY.LOW;
};

/**
 * Parse error object to extract relevant information
 * @param {Error|Object} error - Error object
 * @returns {Object} - Parsed error information
 */
const parseError = error => {
  const parsed = {
    message: 'Unknown error',
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.LOW,
    statusCode: null,
    source: 'unknown',
    details: null,
    timestamp: new Date().toISOString(),
  };

  // Handle axios errors
  if (error.response) {
    parsed.statusCode = error.response.status;
    parsed.type = STATUS_CODE_MAP[error.response.status] || ERROR_TYPES.SERVER;
    parsed.message =
      error.response.data?.message ||
      getErrorMessage(parsed.type, parsed.statusCode);
    parsed.details = error.response.data;
    parsed.source = 'api';
  }
  // Handle network errors
  else if (error.request) {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = getErrorMessage(ERROR_TYPES.NETWORK);
    parsed.source = 'network';
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    parsed.type = ERROR_TYPES.VALIDATION;
    parsed.message = error.message;
    parsed.source = 'validation';
    parsed.details = error.errors;
  }
  // Handle JavaScript errors
  else if (error instanceof Error) {
    parsed.message = error.message;
    parsed.type = ERROR_TYPES.CLIENT;
    parsed.source = 'javascript';
    parsed.details = {
      stack: error.stack,
      name: error.name,
    };
  }
  // Handle string errors
  else if (typeof error === 'string') {
    parsed.message = error;
  }
  // Handle custom error objects
  else if (typeof error === 'object') {
    parsed.message = error.message || 'Unknown error';
    parsed.type = error.type || ERROR_TYPES.UNKNOWN;
    parsed.statusCode = error.statusCode;
    parsed.details = error.details;
    parsed.source = error.source || 'unknown';
  }

  parsed.severity = getErrorSeverity(parsed.type, parsed.statusCode);

  return parsed;
};

/**
 * Main error handler function
 * @param {Error|Object} error - Error to handle
 * @param {Object} options - Handling options
 * @param {boolean} options.showToast - Show toast notification
 * @param {boolean} options.logToStore - Log to global store
 * @param {boolean} options.logToConsole - Log to console
 * @param {string} options.source - Error source identifier
 * @returns {Object} - Parsed error object
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logToStore = true,
    logToConsole = true,
    source = 'unknown',
  } = options;

  const parsedError = parseError(error);
  parsedError.source = source;

  // Log to console in development
  if (logToConsole && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.error('Error handled:', parsedError);
  }

  // Add to global error store
  if (logToStore) {
    const { addError } = useAppStore.getState();
    addError(parsedError);
  }

  // Show toast notification
  if (showToast) {
    const toastOptions = {
      duration: parsedError.severity === ERROR_SEVERITY.HIGH ? 8000 : 5000,
    };

    switch (parsedError.severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        toast.error(parsedError.message, toastOptions);
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.error(parsedError.message, toastOptions);
        break;
      case ERROR_SEVERITY.LOW:
        toast(parsedError.message, toastOptions);
        break;
      default:
        toast.error(parsedError.message, toastOptions);
    }
  }

  // Handle authentication errors
  if (parsedError.type === ERROR_TYPES.AUTHENTICATION) {
    // Clear auth token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return parsedError;
};

/**
 * API Error Handler specifically for axios interceptors
 * @param {Object} error - Axios error object
 * @returns {Promise} - Rejected promise with parsed error
 */
export const apiErrorHandler = error => {
  const parsedError = handleError(error, {
    source: 'api',
    showToast: true,
    logToStore: true,
  });

  return Promise.reject(parsedError);
};

/**
 * Handle API errors trong components với toast notifications
 * @param {Error} error - Error object
 * @param {Object} options - Additional options
 * @returns {Object} Parsed error
 */
export const handleApiError = (error, options = {}) => {
  const { fallbackMessage, showToast = true } = options;

  const parsedError = parseError(error);

  // Use fallback message if provided
  const message = fallbackMessage || parsedError.message;

  // Show toast notification
  if (showToast) {
    const toastOptions = {
      duration: parsedError.severity === ERROR_SEVERITY.HIGH ? 8000 : 5000,
    };

    switch (parsedError.severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        toast.error(message, toastOptions);
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.error(message, toastOptions);
        break;
      case ERROR_SEVERITY.LOW:
        toast(message, toastOptions);
        break;
      default:
        toast.error(message, toastOptions);
    }
  }

  // Log error
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.error('API Error:', parsedError);
  }

  // Add to store
  const { addError } = useAppStore.getState();
  addError({ ...parsedError, source: 'api' });

  // Handle auth errors
  if (parsedError.type === ERROR_TYPES.AUTHENTICATION) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return parsedError;
};

/**
 * Async wrapper that automatically handles errors
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} errorOptions - Error handling options
 * @returns {Function} - Wrapped async function
 */
export const withErrorHandling = (asyncFn, errorOptions = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const parsedError = handleError(error, {
        source: errorOptions.source || 'async-operation',
        ...errorOptions,
      });

      if (errorOptions.rethrow !== false) {
        throw parsedError;
      }

      return null;
    }
  };
};

/**
 * Hook for error handling in React components
 * @param {string} source - Error source identifier
 * @returns {Function} - Error handler function
 */
export const useErrorHandler = (source = 'component') => {
  return React.useCallback(
    (error, options = {}) => {
      return handleError(error, {
        source,
        ...options,
      });
    },
    [source]
  );
};

/**
 * Global unhandled error listeners
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', event => {
    handleError(event.error, {
      source: 'global-error',
      showToast: false, // Avoid spam
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    handleError(event.reason, {
      source: 'unhandled-promise',
      showToast: false, // Avoid spam
    });
  });
};

export default handleError;
