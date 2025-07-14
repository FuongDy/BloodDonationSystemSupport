// src/pages/OTPVerificationPage.jsx
import React from 'react';
import { useOTPVerification } from '../hooks/useOTPVerification';
import {
  OTPHeader,
  OTPTitle,
  OTPForm,
  OTPResendSection,
  OTPHelpText,
} from '../components/otp';

const OTPVerificationPage = () => {
  const {
    otp,
    isResending,
    countdown,
    canResend,
    validationError,
    loading,
    email,
    otpRefs,
    handleOtpChange,
    handleKeyDown,
    handleSubmit,
    handleResendOTP,
    handleGoBack,
    formatTime,
  } = useOTPVerification();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <OTPHeader onGoBack={handleGoBack} />

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <OTPTitle email={email} />

          <OTPForm
            otp={otp}
            otpRefs={otpRefs}
            validationError={validationError}
            loading={loading}
            onOtpChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
          />

          <OTPResendSection
            canResend={canResend}
            isResending={isResending}
            countdown={countdown}
            onResendOTP={handleResendOTP}
            formatTime={formatTime}
          />

          <OTPHelpText />
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
