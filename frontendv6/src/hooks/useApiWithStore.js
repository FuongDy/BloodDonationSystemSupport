// src/hooks/useApiWithStore.js
import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { handleApiError } from '../utils/errorHandler';

/**
 * Custom hook để sử dụng API services với Zustand store
 *
 * Provides unified interface cho API calls với:
 * - Global loading state management
 * - Error handling và notifications
 * - Success notifications
 * - Loading state cleanup
 *
 * @param {string} loadingKey - Unique key cho loading state
 * @returns {Object} API utilities
 */
export const useApiWithStore = (loadingKey = 'default') => {
  const { setLoading, showNotification } = useAppStore();

  /**
   * Execute API call với comprehensive error handling và loading states
   *
   * @param {Function} apiCall - API function to execute
   * @param {Object} options - Configuration options
   * @param {string} options.successMessage - Success notification message
   * @param {string} options.errorMessage - Custom error message
   * @param {boolean} options.showSuccess - Show success notification (default: false)
   * @param {boolean} options.showError - Show error notification (default: true)
   * @param {Function} options.onSuccess - Success callback
   * @param {Function} options.onError - Error callback
   * @param {Function} options.onFinally - Finally callback
   * @returns {Promise} API call result
   */
  const executeApi = useCallback(
    async (
      apiCall,
      {
        successMessage,
        errorMessage,
        showSuccess = false,
        showError = true,
        onSuccess,
        onError,
        onFinally,
      } = {}
    ) => {
      try {
        setLoading(loadingKey, true);
        const result = await apiCall();

        // Handle success
        if (successMessage && showSuccess) {
          showNotification(successMessage, 'success');
        }

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        // Enhanced error handling
        if (showError) {
          const finalErrorMessage = error?.response?.data?.message || 
                                   error?.message || 
                                   errorMessage || 
                                   'Đã có lỗi xảy ra';
          
          handleApiError(error, showNotification, {
            fallbackMessage: finalErrorMessage,
          });
        }

        if (onError && typeof onError === 'function') {
          onError(error);
        }

        throw error; // Re-throw để caller có thể handle nếu cần
      } finally {
        setLoading(loadingKey, false);
        if (onFinally && typeof onFinally === 'function') {
          onFinally();
        }
      }
    },
    [setLoading, showNotification, loadingKey]
  );

  /**
   * Check if specific operation is loading
   */
  const isLoading = useAppStore(state => state.loading[loadingKey] || false);

  /**
   * Get all loading states
   */
  const loadingStates = useAppStore(state => state.loading);

  /**
   * Check if any operation is loading
   */
  const isAnyLoading = useAppStore(state =>
    Object.values(state.loading).some(loading => loading)
  );

  return {
    executeApi,
    isLoading,
    loadingStates,
    isAnyLoading,
    setLoading: isLoading => setLoading(loadingKey, isLoading),
  };
};

/**
 * Hook để sử dụng multiple API operations với shared loading key
 *
 * @param {string} baseKey - Base loading key
 * @returns {Object} Multiple API handlers
 */
export const useMultipleApi = (baseKey = 'multi') => {
  const { setLoading, showNotification } = useAppStore();

  /**
   * Execute multiple API calls với loading management
   *
   * @param {Array} apiCalls - Array of API calls với config
   * @param {Object} options - Global options
   * @returns {Promise} All results
   */
  const executeMultiple = useCallback(
    async (apiCalls, options = {}) => {
      const loadingKeys = apiCalls.map((_, index) => `${baseKey}_${index}`);

      try {
        // Set loading cho tất cả operations
        loadingKeys.forEach(key => setLoading(key, true));

        // Execute all API calls
        const results = await Promise.allSettled(
          apiCalls.map(async ({ apiCall, config = {} }) => {
            try {
              const result = await apiCall();
              return { status: 'fulfilled', value: result, config };
            } catch (error) {
              return { status: 'rejected', reason: error, config };
            }
          })
        );

        // Process results
        const successCount = results.filter(
          r => r.status === 'fulfilled'
        ).length;
        const errorCount = results.filter(r => r.status === 'rejected').length;

        // Show summary notification if configured
        if (options.showSummary) {
          if (errorCount === 0) {
            showNotification(
              options.successMessage ||
                `Đã hoàn thành ${successCount} thao tác thành công`,
              'success'
            );
          } else if (successCount === 0) {
            showNotification(
              options.errorMessage || `${errorCount} thao tác thất bại`,
              'error'
            );
          } else {
            showNotification(
              `${successCount} thành công, ${errorCount} thất bại`,
              'warning'
            );
          }
        }

        return results;
      } finally {
        // Clear loading states
        loadingKeys.forEach(key => setLoading(key, false));
      }
    },
    [setLoading, showNotification, baseKey]
  );

  return {
    executeMultiple,
  };
};

export default useApiWithStore;


