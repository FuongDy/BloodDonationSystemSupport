// src/utils/dateUtils.js

/**
 * Utility functions for date formatting and conversion
 */

/**
 * Formats date for backend API (dd-MM-yyyy format)
 * @param {string} dateString - Date string from HTML date input (YYYY-MM-DD)
 * @returns {string} Date string in dd-MM-yyyy format
 */
export const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    
    // If already in dd-MM-yyyy format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
    }
    
    // Convert from YYYY-MM-DD (HTML input format) to dd-MM-yyyy
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }
    
    // Try to parse as Date object and format
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    } catch (error) {
        console.warn('Invalid date format:', dateString);
    }
    
    return null;
};

/**
 * Formats date for HTML date input (YYYY-MM-DD format)
 * @param {string} dateString - Date string from backend (dd-MM-yyyy)
 * @returns {string} Date string in YYYY-MM-DD format for HTML input
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
    
    // Convert from dd-MM-yyyy (backend format) to YYYY-MM-DD
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }
    
    // Try to parse as Date object and format
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch (error) {
        console.warn('Invalid date format:', dateString);
    }
    
    return '';
};

/**
 * Formats date for display (dd-MM-yyyy format)
 * @param {string} dateString - Date string from any source
 * @returns {string} Date string in dd-MM-yyyy format for display
 */
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // If already in dd-MM-yyyy format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
    }
    
    // Convert from YYYY-MM-DD to dd-MM-yyyy
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }
    
    // Try to parse as Date object and format
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    } catch (error) {
        console.warn('Invalid date format:', dateString);
    }
    
    return '';
};

/**
 * Validates date format dd-MM-yyyy
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid dd-MM-yyyy format
 */
export const isValidDateFormat = (dateString) => {
    if (!dateString) return false;
    
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month, year] = dateString.split('-').map(Number);
    
    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
};

/**
 * Gets current date in dd-MM-yyyy format
 * @returns {string} Current date in dd-MM-yyyy format
 */
export const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * Checks if date is today or in the future (not in the past)
 * @param {string} dateString - Date string in dd-MM-yyyy format
 * @returns {boolean} True if date is today or in the future
 */
export const isDateTodayOrFuture = (dateString) => {
    if (!dateString || !isValidDateFormat(dateString)) return false;
    
    const [day, month, year] = dateString.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return inputDate >= today;
};

/**
 * Checks if date is in the past
 * @param {string} dateString - Date string in dd-MM-yyyy format
 * @returns {boolean} True if date is in the past
 */
export const isDateInPast = (dateString) => {
    if (!dateString || !isValidDateFormat(dateString)) return false;
    
    const [day, month, year] = dateString.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return inputDate < today;
};

/**
 * Checks if date is in the future
 * @param {string} dateString - Date string in dd-MM-yyyy format
 * @returns {boolean} True if date is in the future
 */
export const isDateInFuture = (dateString) => {
    if (!dateString || !isValidDateFormat(dateString)) return false;
    
    const [day, month, year] = dateString.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return inputDate > today;
};
