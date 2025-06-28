// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Simple API hook với flexible options
 * @param {Function} apiFunc - API function to call
 * @param {Object} options - Configuration options
 */
const useApi = (apiFunc, options = {}) => {
  const {
    showToast = true,
    loadingMessage = 'Đang xử lý yêu cầu...',
    successMessage = 'Yêu cầu thành công!',
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setData(null);
      
      let toastId = null;
      if (showToast) {
        toastId = toast.loading(loadingMessage);
      }

      try {
        const result = await apiFunc(...args);
        setData(result);
        
        if (showToast) {
          toast.success(successMessage, { id: toastId });
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        setError(error);
        
        if (showToast) {
          const errorMessage = error?.response?.data?.message || 
                             error?.message || 
                             'Đã có lỗi xảy ra';
          toast.error(`Lỗi: ${errorMessage}`, { id: toastId });
        }
        
        if (onError) {
          onError(error);
        }
        
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, showToast, loadingMessage, successMessage, onSuccess, onError]
  );

  return { data, error, loading, request };
};

export { useApi };
export default useApi;
