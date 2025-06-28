// src/components/register/RegisterForm.jsx
import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';
import SecuritySection from './SecuritySection';
import IdCardUploadSection from './IdCardUploadSection';
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
  onFileUpload,
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
        />        <SecuritySection
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
        <IdCardUploadSection
          formData={formData}
          validationErrors={validationErrors}
          authLoading={authLoading}
          onChange={onChange}
          onFileUpload={onFileUpload}
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
