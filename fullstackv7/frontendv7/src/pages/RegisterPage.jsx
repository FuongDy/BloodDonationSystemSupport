import React from 'react';
import { useRegister } from '../hooks/useRegister';
import {
  RegisterHeroSection,
  RegisterMobileHeader,
  RegisterDesktopHeader,
  RegisterForm,
  RegisterFooter,
} from '../components/register';

/**
 * RegisterPage Component
 *
 * Trang đăng ký tài khoản với form validation toàn diện sử dụng Yup schema,
 * global state management với Zustand, và error handling nâng cao.
 *
 * Features:
 * - Multi-step form validation với Yup
 * - Real-time validation feedback
 * - Password strength validation
 * - Blood type selection từ API
 * - Global state management
 * - Comprehensive error handling
 * - Loading states
 *
 * @returns {JSX.Element} RegisterPage component
 */
const RegisterPage = () => {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    bloodTypesFromApi,
    isFetchingBloodTypes,
    validationErrors,
    authLoading,
    handleInputChange,
    handleSubmit,
    handleFileUpload,
    handleAddressSelect,
    toggleShowPassword,
    toggleShowConfirmPassword,
    isFormValid,
  } = useRegister();

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      {/* Background Pattern */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-30 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-30 blur-3xl'></div>
      </div>

      <div className='relative min-h-screen flex'>
        <RegisterHeroSection />

        {/* Right Side - Register Form */}
        <div className='w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-8'>
          <div className='max-w-2xl w-full'>
            <RegisterMobileHeader />
            <RegisterDesktopHeader />

            <RegisterForm
              formData={formData}
              validationErrors={validationErrors}
              authLoading={authLoading}
              isFetchingBloodTypes={isFetchingBloodTypes}
              bloodTypesFromApi={bloodTypesFromApi}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onFileUpload={handleFileUpload}
              handleAddressSelect={handleAddressSelect}
              onToggleShowPassword={toggleShowPassword}
              onToggleShowConfirmPassword={toggleShowConfirmPassword}
              isFormValid={isFormValid}
            />

            <RegisterFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
