// src/pages/OTPVerificationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import { otpVerificationSchema } from '../utils/validationSchemas';

const OTPVerificationPage = () => {
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
    console.log('OTPVerificationPage mounted with state:', location.state);
    console.log('Email from location state:', email);
    
    // Redirect if no email provided
    if (!email) {
      console.error('No email found in location state');
      showNotification('Phiên làm việc đã hết hạn. Vui lòng đăng ký lại.', 'error');
      navigate('/register');
      return;
    }
    
    console.log('Valid email found, continuing with OTP verification flow');

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
      
      console.log('Submitting OTP verification with:', { email, otp: otpCode });
      
      // Verify OTP with backend
      const response = await verifyOTP({ email, otp: otpCode });
      
      console.log('OTP verification response:', response);
      
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
      
      console.log('Requesting resend OTP for email:', email);
      
      const response = await resendOTP({ email });
      
      console.log('Resend OTP response:', response);
      
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/register')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đăng ký
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Xác thực tài khoản
            </h1>
            <p className="text-gray-600">
              Mã OTP đã được gửi đến email
            </p>
            <p className="text-red-600 font-medium mt-1">
              {email}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 text-center block">
                Nhập mã OTP (6 chữ số)
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      validationError
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-red-500'
                    }`}
                    autoComplete="off"
                  />
                ))}
              </div>
              {validationError && (
                <p className="text-xs text-red-600 text-center mt-2">
                  {validationError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.some(digit => !digit)}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </div>
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Không nhận được mã?
            </p>
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="inline-flex items-center text-red-600 hover:text-red-500 font-medium transition-colors"
              >
                {isResending ? (
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1" />
                )}
                {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Gửi lại sau {formatTime(countdown)}
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              💡 Kiểm tra cả thư mục spam nếu không thấy email. 
              Mã OTP có hiệu lực trong 10 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
