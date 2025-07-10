// src/components/otp/OTPSubmitButton.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const OTPSubmitButton = ({ loading, otp, onSubmit }) => {
  const isDisabled = loading || otp.some(digit => !digit);
  
  return (
    <button
      type="submit"
      disabled={isDisabled}
      onClick={onSubmit}
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
  );
};

export default OTPSubmitButton;
