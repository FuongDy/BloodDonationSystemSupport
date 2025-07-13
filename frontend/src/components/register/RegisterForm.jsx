// src/components/register/RegisterForm.jsx
import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';
// IdCardUploadSection đã được chuyển sang UserProfileEditPage
// Việc upload ảnh CCCD không còn bắt buộc khi đăng ký
import SecuritySection from './SecuritySection';
import TermsAgreement from './TermsAgreement';
import RegisterSubmitButton from './RegisterSubmitButton';
import RegisterErrorDisplay from './RegisterErrorDisplay';

const RegisterForm = ({ 
  formData, 
  validationErrors, 
  authLoading, 
  isFetchingBloodTypes, 
  bloodTypesFromApi, 
  showPassword, 
  showConfirmPassword, 
  onChange, 
  onSubmit, 
  onToggleShowPassword, 
  onToggleShowConfirmPassword, 
  handleAddressSelect,
  isFormValid 
}) => {
  return (
    <div className='bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100'>
      <form onSubmit={onSubmit} className='space-y-6'>
        <PersonalInfoSection
          formData={formData}
          validationErrors={validationErrors}
          authLoading={authLoading}
          isFetchingBloodTypes={isFetchingBloodTypes}
          bloodTypesFromApi={bloodTypesFromApi}
          onChange={onChange}
          handleAddressSelect={handleAddressSelect}
        />

        <SecuritySection
          formData={formData}
          validationErrors={validationErrors}
          authLoading={authLoading}
          isFetchingBloodTypes={isFetchingBloodTypes}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onChange={onChange}
          onToggleShowPassword={onToggleShowPassword}
          onToggleShowConfirmPassword={onToggleShowConfirmPassword}
        />

        <TermsAgreement
          formData={formData}
          validationErrors={validationErrors}
          authLoading={authLoading}
          isFetchingBloodTypes={isFetchingBloodTypes}
          onChange={onChange}
        />

        <RegisterSubmitButton
          authLoading={authLoading}
          isFormValid={isFormValid}
        />

        <RegisterErrorDisplay validationErrors={validationErrors} />
      </form>
    </div>
  );
};

export default RegisterForm;
