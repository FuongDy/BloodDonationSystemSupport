import { toast } from 'react-hot-toast';

export const useAppToast = () => {
  const showSuccess = msg => toast.success(msg, { position: 'top-right' });
  const showError = msg => toast.error(msg, { position: 'top-right' });
  const showInfo = msg => toast(msg, { position: 'top-right' });
  return { showSuccess, showError, showInfo };
};
