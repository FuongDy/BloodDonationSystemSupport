// src/utils/dialogs.js

/**
 * Dialog utilities
 * 
 * Utilities để thay thế các browser APIs như confirm, alert
 * với implementations an toàn hơn cho linting và testing.
 */

/**
 * Safe confirm dialog
 * @param {string} message - Confirmation message
 * @returns {boolean} User confirmation result
 */
export const safeConfirm = (message) => {
  // eslint-disable-next-line no-alert
  return window.confirm(message);
};

/**
 * Safe alert dialog
 * @param {string} message - Alert message
 */
export const safeAlert = (message) => {
  // eslint-disable-next-line no-alert
  window.alert(message);
};

/**
 * Safe prompt dialog
 * @param {string} message - Prompt message
 * @param {string} defaultText - Default input text
 * @returns {string|null} User input or null if cancelled
 */
export const safePrompt = (message, defaultText = '') => {
  // eslint-disable-next-line no-alert
  return window.prompt(message, defaultText);
};

export default {
  safeConfirm,
  safeAlert,
  safePrompt,
};
