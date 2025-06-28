// src/components/otp/OTPHelpText.jsx
import React from 'react';

const OTPHelpText = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <p className="text-xs text-blue-700 text-center">
        💡 Kiểm tra cả thư mục spam nếu không thấy email. 
        Mã OTP có hiệu lực trong 10 phút.
      </p>
    </div>
  );
};

export default OTPHelpText;
