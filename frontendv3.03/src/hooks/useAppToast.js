import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

export const useAppToast = () => {
  const showSuccess = useCallback((msg) => toast.success(msg, { position: 'top-right' }), []);
  const showError = useCallback((msg) => toast.error(msg, { position: 'top-right' }), []);
  const showInfo = useCallback((msg) => toast(msg, { position: 'top-right' }), []);
  const showToast = useCallback((msg, type = 'info') => {
    switch (type) {
      case 'success':
        return showSuccess(msg);
      case 'error':
        return showError(msg);
      default:
        return showInfo(msg);
    }
  }, [showSuccess, showError, showInfo]);
  
  return { showSuccess, showError, showInfo, showToast };
};
