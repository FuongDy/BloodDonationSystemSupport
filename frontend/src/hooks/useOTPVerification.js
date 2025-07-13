// src/hooks/useOTPVerification.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import { otpVerificationSchema } from '../utils/validationSchemas';

export const useOTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, loading } = useAuth();
  const { setLoading } = useAppStore();

  // Get registration data from navigation state
  const { email } = location.state || {};

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      console.error('No email found in location state');
      showNotification('Phiên làm việc đã hết hạn. Vui lòng đăng ký lại.', 'error');
      navigate('/register');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate, location.state]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValidationError('');

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    try {
      // Validate OTP
      await otpVerificationSchema.validate({ email, otp: otpCode });
      setValidationError('');
      
      setLoading(true);
      
      // Verify OTP with backend
      const response = await verifyOTP({ email, otp: otpCode });
      
      if (response && response.success) {
        showNotification('Xác thực thành công! Tài khoản đã được tạo.', 'success');
        navigate('/login');
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Xác thực OTP thất bại. Định dạng phản hồi không hợp lệ.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.name === 'ValidationError') {
        // Yup validation error
        setValidationError(error.message);
      } else if (error.response) {
        // API error with response
        const status = error.response.status;
        const apiError = error.response.data;
        
        console.error(`API error (${status}):`, apiError);
        
        if (typeof apiError === 'string') {
          // Plain text error message
          setValidationError(apiError);
          showNotification(apiError, 'error');
        } else if (apiError?.message) {
          // Object with message property
          setValidationError(apiError.message);
          showNotification(apiError.message, 'error');
        } else {
          // Default error message for API errors
          setValidationError(`Lỗi máy chủ (${status}). Vui lòng thử lại.`);
          showNotification(`Lỗi máy chủ (${status}). Vui lòng thử lại.`, 'error');
        }
      } else {
        // Network or other errors
        setValidationError(error.message || 'Có lỗi xảy ra khi xác thực OTP');
        showNotification(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isResending) return;
    
    try {
      setIsResending(true);
      
      const response = await resendOTP({ email });
      
      if (response && response.success) {
        showNotification('Mã OTP mới đã được gửi!', 'success');
        setOtp(['', '', '', '', '', '']);
        setCountdown(60);
        setCanResend(false);
        otpRefs.current[0]?.focus();
      } else {
        console.error('Unexpected resend OTP response format:', response);
        throw new Error('Không thể gửi lại mã OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      let errorMessage = 'Không thể gửi lại mã OTP. Vui lòng thử lại.';
      
      if (error.response) {
        const status = error.response.status;
        const apiError = error.response.data;
        
        console.error(`API error (${status}):`, apiError);
        
        if (typeof apiError === 'string') {
          errorMessage = apiError;
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        } else {
          errorMessage = `Lỗi máy chủ (${status}). Vui lòng thử lại sau.`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate('/register');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    // State
    otp,
    isResending,
    countdown,
    canResend,
    validationError,
    loading,
    email,
    otpRefs,
    
    // Actions
    handleOtpChange,
    handleKeyDown,
    handleSubmit,
    handleResendOTP,
    handleGoBack,
    formatTime,
  };
};
