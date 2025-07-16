// src/utils/toastHelpers.js
import toast from 'react-hot-toast';
import { FORM_SUCCESS_MESSAGES, FORM_ERROR_MESSAGES, createFormErrorToast } from './validationSchemas';

/**
 * Enhanced toast utility for consistent error/success messaging across the app
 */

/**
 * Show optimized toast with auto-dismiss and consistent styling
 * @param {string} type - Toast type: 'success', 'error', 'loading'
 * @param {string} message - Message to display
 * @param {Object} options - Additional toast options
 */
export const showToast = (type, message, options = {}) => {
    // Dismiss existing toasts to prevent spam
    toast.dismiss();
    
    const defaultOptions = {
        duration: type === 'error' ? 3000 : 2000, // Error messages stay longer
        position: 'top-center',
        style: {
            borderRadius: '10px',
            background: type === 'error' ? '#fef2f2' : type === 'success' ? '#f0fdf4' : '#ffffff',
            color: type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#374151',
            fontWeight: '500',
            maxWidth: '400px',
        },
        ...options,
    };

    return toast[type](message, defaultOptions);
};

/**
 * Show success message for common form actions
 * @param {string} action - Action type from FORM_SUCCESS_MESSAGES
 * @param {string} customMessage - Optional custom message
 */
export const showSuccessToast = (action, customMessage) => {
    const message = customMessage || FORM_SUCCESS_MESSAGES[action] || '✅ Thao tác thành công!';
    return showToast('success', message);
};

/**
 * Show error message for common form failures
 * @param {string} error - Error type from FORM_ERROR_MESSAGES
 * @param {string} customMessage - Optional custom message
 */
export const showErrorToast = (error, customMessage) => {
    const message = customMessage || FORM_ERROR_MESSAGES[error] || '❌ Có lỗi xảy ra!';
    return showToast('error', message);
};

/**
 * Show validation errors from form
 * @param {Object} errors - Validation errors object
 */
export const showValidationErrors = (errors) => {
    createFormErrorToast(errors, showToast);
};

/**
 * Show loading toast for async operations
 * @param {string} message - Loading message
 * @returns {string} Toast ID for dismissing later
 */
export const showLoadingToast = (message = '⏳ Đang xử lý...') => {
    return toast.loading(message, {
        style: {
            borderRadius: '10px',
            background: '#ffffff',
            color: '#374151',
            fontWeight: '500',
        },
    });
};

/**
 * Dismiss loading toast and show result
 * @param {string} toastId - Toast ID from showLoadingToast
 * @param {boolean} success - Whether operation was successful
 * @param {string} message - Result message
 */
export const dismissLoadingToast = (toastId, success, message) => {
    toast.dismiss(toastId);
    setTimeout(() => {
        showToast(success ? 'success' : 'error', message);
    }, 100);
};

/**
 * Show notification for backend API errors
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default error message
 */
export const showApiErrorToast = (error, defaultMessage = 'Có lỗi xảy ra!') => {
    if (!error.response) {
        showErrorToast('NETWORK_ERROR');
        return;
    }

    const { status, data } = error.response;

    switch (status) {
        case 400:
            if (data.errors) {
                // Field validation errors
                showValidationErrors(data.errors);
            } else {
                showToast('error', `⚠️ ${data.message || defaultMessage}`);
            }
            break;
        case 401:
            showErrorToast('UNAUTHORIZED');
            break;
        case 403:
            showErrorToast('FORBIDDEN');
            break;
        case 409:
            // Conflict errors (duplicate data, etc.)
            if (data.message.toLowerCase().includes('email')) {
                showErrorToast('DUPLICATE_EMAIL');
            } else if (data.message.toLowerCase().includes('cccd')) {
                showErrorToast('CCCD_EXISTS');
            } else {
                showToast('error', `⚠️ ${data.message || defaultMessage}`);
            }
            break;
        case 500:
            showErrorToast('SERVER_ERROR');
            break;
        default:
            showToast('error', `⚠️ ${data.message || defaultMessage}`);
    }
};

/**
 * Medical validation specific toasts
 */
export const showMedicalValidationToast = (field, value, range) => {
    const messages = {
        bloodPressure: `💓 Huyết áp ${value} nằm ngoài khoảng bình thường (${range})`,
        heartRate: `💗 Nhịp tim ${value} bpm nằm ngoài khoảng bình thường (${range})`,
        temperature: `🌡️ Nhiệt độ ${value}°C nằm ngoài khoảng bình thường (${range})`,
        weight: `⚖️ Cân nặng ${value}kg nằm ngoài khoảng cho phép (${range})`,
        hemoglobin: `🩸 Mức hemoglobin ${value} g/dL nằm ngoài khoảng bình thường (${range})`,
    };

    showToast('error', messages[field] || `⚠️ Giá trị ${value} không hợp lệ`);
};

/**
 * Progress notification for multi-step processes
 */
export const showProgressToast = (step, total, action) => {
    const progress = Math.round((step / total) * 100);
    return toast.loading(`⏳ ${action}... (${progress}%)`, {
        style: {
            borderRadius: '10px',
            background: '#ffffff',
            color: '#374151',
            fontWeight: '500',
        },
    });
};

export default {
    showToast,
    showSuccessToast,
    showErrorToast,
    showValidationErrors,
    showLoadingToast,
    dismissLoadingToast,
    showApiErrorToast,
    showMedicalValidationToast,
    showProgressToast,
};
