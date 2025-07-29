import React from 'react';
import { useRegister } from '../hooks/useRegister';
import {
  RegisterHeroSection,
  RegisterMobileHeader,
  RegisterDesktopHeader,
  RegisterForm,
  RegisterFooter,
} from '../components/register';

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
