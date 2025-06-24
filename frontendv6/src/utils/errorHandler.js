// src/utils/errorHandler.js
import React from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

// Error severity levels
export const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};

// Error types
export const ERROR_TYPES = {
    NETWORK: 'network',
    VALIDATION: 'validation',
    AUTHENTICATION: 'authentication',
    AUTHORIZATION: 'authorization',
    SERVER: 'server',
    CLIENT: 'client',
    UNKNOWN: 'unknown',
};

// HTTP status code to error type mapping
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

// Get user-friendly error messages
export const getErrorMessage = (errorType, statusCode) => {
    const messages = {
        [ERROR_TYPES.NETWORK]: 'Mất kết nối mạng. Vui lòng kiểm tra kết nối internet.',
        [ERROR_TYPES.VALIDATION]: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
        [ERROR_TYPES.AUTHENTICATION]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        [ERROR_TYPES.AUTHORIZATION]: 'Bạn không có quyền thực hiện hành động này.',
        [ERROR_TYPES.SERVER]: 'Lỗi máy chủ. Vui lòng thử lại sau.',
        [ERROR_TYPES.CLIENT]: 'Yêu cầu không hợp lệ.',
        [ERROR_TYPES.UNKNOWN]: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
    };
    if (statusCode === 404) return 'Không tìm thấy trang hoặc dữ liệu được yêu cầu.';
    if (statusCode === 429) return 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.';
    return messages[errorType] || messages[ERROR_TYPES.UNKNOWN];
};

// Determine error severity based on type and status code
const getErrorSeverity = (errorType, statusCode) => {
    if (errorType === ERROR_TYPES.AUTHENTICATION) return ERROR_SEVERITY.HIGH;
    if (errorType === ERROR_TYPES.SERVER) return ERROR_SEVERITY.HIGH;
    if (errorType === ERROR_TYPES.NETWORK) return ERROR_SEVERITY.MEDIUM;
    if (statusCode >= 500) return ERROR_SEVERITY.HIGH;
    if (statusCode >= 400) return ERROR_SEVERITY.MEDIUM;
    return ERROR_SEVERITY.LOW;
};

// Handle axios errors
const handleAxiosError = (error, parsed) => {
    parsed.statusCode = error.response.status;
    parsed.type = STATUS_CODE_MAP[error.response.status] || ERROR_TYPES.SERVER;
    parsed.message = error.response.data?.message || getErrorMessage(parsed.type, parsed.statusCode);
    parsed.details = error.response.data;
    parsed.source = 'api';
    return parsed;
};

// Handle network errors
const handleNetworkError = (error, parsed) => {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = getErrorMessage(ERROR_TYPES.NETWORK);
    parsed.source = 'network';
    return parsed;
};

// Handle validation errors
const handleValidationError = (error, parsed) => {
    parsed.type = ERROR_TYPES.VALIDATION;
    parsed.message = error.message;
    parsed.source = 'validation';
    parsed.details = error.errors;
    return parsed;
};

// Handle JavaScript errors
const handleJavaScriptError = (error, parsed) => {
    parsed.message = error.message;
    parsed.type = ERROR_TYPES.CLIENT;
    parsed.source = 'javascript';
    parsed.details = { stack: error.stack, name: error.name };
    return parsed;
};

// Parse error object to extract relevant information
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

    if (error.response) {
        handleAxiosError(error, parsed);
    } else if (error._request) {
        handleNetworkError(error, parsed);
    } else if (error.name === 'ValidationError') {
        handleValidationError(error, parsed);
    } else if (error instanceof Error) {
        handleJavaScriptError(error, parsed);
    } else if (typeof error === 'string') {
        parsed.message = error;
    } else if (typeof error === 'object') {
        parsed.message = error.message || 'Unknown error';
        parsed.type = error.type || ERROR_TYPES.UNKNOWN;
        parsed.statusCode = error.statusCode;
        parsed.details = error.details;
        parsed.source = error.source || 'unknown';
    }

    parsed.severity = getErrorSeverity(parsed.type, parsed.statusCode);
    return parsed;
};

// Show toast notification based on error severity
const showToast = (parsedError) => {
    const duration = parsedError.severity === ERROR_SEVERITY.HIGH ? 8000 : 5000;
    const options = { duration };

    switch (parsedError.severity) {
        case ERROR_SEVERITY.CRITICAL:
        case ERROR_SEVERITY.HIGH:
            toast.error(parsedError.message, options);
            break;
        case ERROR_SEVERITY.MEDIUM:
            toast.error(parsedError.message, options);
            break;
        case ERROR_SEVERITY.LOW:
            toast(parsedError.message, options);
            break;
        default:
            toast.error(parsedError.message, options);
    }
};

// Handle authentication errors
const handleAuthError = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

// Main error handler function
export const handleError = (error, options = {}) => {
    const { showToast: showToastOpt = true, logToStore = true, logToConsole = true, source = 'unknown' } = options;
    const parsedError = parseError(error);
    parsedError.source = source;
    
    // Log to console in development
    if (logToConsole && typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        console.error('Error handled:', parsedError);
    }

    // Add to global error store
    if (logToStore) {
        const { addError } = useAppStore.getState();
        addError(parsedError);
    }

    // Show toast notification
    if (showToastOpt) showToast(parsedError);

    // Handle authentication errors
    if (parsedError.type === ERROR_TYPES.AUTHENTICATION) handleAuthError();

    return parsedError;
};

// API Error Handler specifically for axios interceptors
export const apiErrorHandler = error => {
    const parsedError = handleError(error, { source: 'api', showToast: true, logToStore: true });
    return Promise.reject(parsedError);
};

// Handle API errors trong components với toast notifications
export const handleApiError = (error, options = {}) => {
    const { fallbackMessage, showToast: showToastOpt = true } = options;
    const parsedError = parseError(error);
    const message = fallbackMessage || parsedError.message;

    // Show toast notification
    if (showToastOpt) {
        const duration = parsedError.severity === ERROR_SEVERITY.HIGH ? 8000 : 5000;
        const toastOptions = { duration };

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
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        console.error('API Error:', parsedError);
    }

    // Add to store
    const { addError } = useAppStore.getState();
    addError({...parsedError, source: 'api' });

    // Handle auth errors
    if (parsedError.type === ERROR_TYPES.AUTHENTICATION) handleAuthError();

    return parsedError;
};

// Async wrapper that automatically handles errors
export const withErrorHandling = (asyncFn, errorOptions = {}) => {
    return async(...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            const parsedError = handleError(error, {
                source: errorOptions.source || 'async-operation',
                ...errorOptions,
            });
            if (errorOptions.rethrow !== false) throw parsedError;
            return null;
        }
    };
};

// Hook for error handling in React components
export const useErrorHandler = (source = 'component') => {
    return React.useCallback(
        (error, options = {}) => handleError(error, { source, ...options }), 
        [source]
    );
};

// Global unhandled error listeners
export const setupGlobalErrorHandlers = () => {
    window.addEventListener('error', event => {
        handleError(event.error, { source: 'global-error', showToast: false });
    });
    window.addEventListener('unhandledrejection', event => {
        handleError(event.reason, { source: 'unhandled-promise', showToast: false });
    });
};

export default handleError;