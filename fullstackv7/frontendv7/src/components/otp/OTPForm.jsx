// src/components/otp/OTPForm.jsx
import React from 'react';
import OTPInputGroup from './OTPInputGroup';
import OTPSubmitButton from './OTPSubmitButton';

const OTPForm = ({ 
  otp,
  otpRefs,
  validationError,
  loading,
  onOtpChange,
  onKeyDown,
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <OTPInputGroup
        otp={otp}
        otpRefs={otpRefs}
        validationError={validationError}
        loading={loading}
        onOtpChange={onOtpChange}
        onKeyDown={onKeyDown}
      />
      
      <OTPSubmitButton
        loading={loading}
        otp={otp}
        onSubmit={onSubmit}
      />
    </form>
  );
};

export default OTPForm;
