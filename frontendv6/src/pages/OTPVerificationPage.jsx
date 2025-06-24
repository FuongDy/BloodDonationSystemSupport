// src/pages/OTPVerificationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { verifyAndRegister, requestRegistration, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Get registration data from navigation state
  const registrationData = location.state?.registrationData;
  const email = registrationData?.email;

  useEffect(() => {
    // Redirect if no registration data
    if (!registrationData) {
      toast.error('Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.');
      navigate('/register');
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [registrationData, navigate]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = digits[i] || '';
        }
        setOtp(newOtp);
        // Focus last filled input or next empty one
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    try {
      await verifyAndRegister({
        email,
        otp: otpCode,
      });
      toast.success('Xác thực thành công! Chào mừng bạn đến với hệ thống.');
      navigate('/login');
    } catch {
      toast.error('Mã OTP không đúng hoặc đã hết hạn.');
      // Clear OTP and focus first input
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await requestRegistration(registrationData);
      setCountdown(60);
      toast.success('Mã OTP mới đã được gửi đến email của bạn.');
    } catch {
      toast.error('Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate('/register', { state: { formData: registrationData } });
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center'>
          <Shield className='h-12 w-12 text-red-600' />
        </div>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Xác thực OTP
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Chúng tôi đã gửi mã gồm 6 chữ số đến
          <br />
          <span className='font-medium text-red-600'>{email}</span>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* OTP Input Fields */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2 text-center'>
                Nhập mã OTP
              </label>
              <div className='flex justify-center space-x-2'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className='w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading || otp.join('').length !== 6}
              isLoading={isLoading}
              variant='primary'
              size='lg'
            >
              Xác thực
            </Button>

            {/* Resend OTP */}
            <div className='text-center'>
              {countdown > 0 ? (
                <p className='text-sm text-gray-500'>
                  Gửi lại mã sau {countdown}s
                </p>
              ) : (
                <button
                  type='button'
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className='text-sm text-red-600 hover:text-red-500 font-medium disabled:opacity-50'
                >
                  {isResending ? (
                    <>
                      <RefreshCw className='w-4 h-4 animate-spin inline mr-1' />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi lại mã OTP'
                  )}
                </button>
              )}
            </div>

            {/* Go Back Button */}
            <button
              type='button'
              onClick={handleGoBack}
              className='w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-500'
            >
              <ArrowLeft className='w-4 h-4 mr-1' />
              Quay lại trang đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;

