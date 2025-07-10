// src/hooks/useSimpleApi.js
import { useState, useCallback } from 'react';

/**
 * Ultra-simple API hook - no toast, minimal overhead
 * Ideal for internal operations or when you want full control
 */
const useSimpleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, onFinally } = options;
    
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      } else {
        // Re-throw if no error handler provided
        throw err;
      }
    } finally {
      setLoading(false);
      
      if (onFinally) {
        onFinally();
      }
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
};

export { useSimpleApi };
export default useSimpleApi;
