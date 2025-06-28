// src/components/otp/OTPTitle.jsx
import React from 'react';
import { Mail } from 'lucide-react';

const OTPTitle = ({ email }) => {
  return (
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
  );
};

export default OTPTitle;
