// src/components/otp/OTPInputGroup.jsx
import React from 'react';

const OTPInputGroup = ({ 
  otp, 
  otpRefs, 
  validationError, 
  loading, 
  onOtpChange, 
  onKeyDown 
}) => {
  return (
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
            onChange={(e) => onOtpChange(index, e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => onKeyDown(index, e)}
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
  );
};

export default OTPInputGroup;
