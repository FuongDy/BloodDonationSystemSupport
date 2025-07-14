// src/components/otp/OTPResendSection.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

const OTPResendSection = ({ 
  canResend, 
  isResending, 
  countdown, 
  onResendOTP, 
  formatTime 
}) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 mb-2">
        Không nhận được mã?
      </p>
      {canResend ? (
        <button
          onClick={onResendOTP}
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
  );
};

export default OTPResendSection;
