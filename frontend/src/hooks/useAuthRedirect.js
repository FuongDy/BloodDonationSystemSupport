// src/hooks/useAuthRedirect.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const requireAuth = (action, message = 'Vui lòng đăng nhập để tiếp tục') => {
    if (!isAuthenticated) {
      toast.error(message);
      navigate('/register', { replace: true });
      return false;
    }
    if (action) {
      action();
    }
    return true;
  };

  const requireAuthForAction = (action, message) => () => {
    requireAuth(action, message);
  };

  return {
    requireAuth,
    requireAuthForAction,
    isAuthenticated
  };
};

export default useAuthRedirect;
