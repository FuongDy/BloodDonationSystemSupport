// src/utils/toastHelpers.js
import toast from 'react-hot-toast';
import { FORM_SUCCESS_MESSAGES, FORM_ERROR_MESSAGES, createFormErrorToast } from './validationSchemas';

export const showToast = (type, message, options = {}) => {
    // Dismiss existing toasts to prevent spam
    toast.dismiss();
    
    const defaultOptions = {
        duration: type === 'error' ? 2000 : 1500, // Error messages stay longer
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

export const showSuccessToast = (action, customMessage) => {
    const message = customMessage || FORM_SUCCESS_MESSAGES[action] || '✅ Thao tác thành công!';
    return showToast('success', message);
};

export const showErrorToast = (error, customMessage) => {
    const message = customMessage || FORM_ERROR_MESSAGES[error] || '❌ Có lỗi xảy ra!';
    return showToast('error', message);
};

export const showValidationErrors = (errors) => {
    createFormErrorToast(errors, showToast);
};

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

export const dismissLoadingToast = (toastId, success, message) => {
    toast.dismiss(toastId);
    setTimeout(() => {
        showToast(success ? 'success' : 'error', message);
    }, 100);
};

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
