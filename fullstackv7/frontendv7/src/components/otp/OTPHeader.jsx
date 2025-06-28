// src/components/otp/OTPHeader.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const OTPHeader = ({ onGoBack }) => {
  return (
    <button
      onClick={onGoBack}
      className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Quay lại đăng ký
    </button>
  );
};

export default OTPHeader;
