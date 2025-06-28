// src/components/register/TermsAgreement.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsAgreement = ({ 
  formData, 
  validationErrors, 
  authLoading, 
  isFetchingBloodTypes, 
  onChange 
}) => {
  return (
    <div className='bg-gray-50 rounded-lg p-4'>
      <div className='flex items-start'>
        <input
          id='agreeTerms'
          name='agreeTerms'
          type='checkbox'
          checked={formData.agreeTerms}
          onChange={onChange}
          disabled={authLoading || isFetchingBloodTypes}
          required
          className={`w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1 ${
            validationErrors.agreeTerms ? 'border-red-500' : ''
          }`}
        />
        <label
          htmlFor='agreeTerms'
          className='ml-2 block text-sm text-gray-700'
        >
          Tôi đã đọc và đồng ý với{' '}
          <Link
            to='/terms'
            className='font-medium text-red-600 hover:text-red-500 hover:underline'
          >
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link
            to='/privacy'
            className='font-medium text-red-600 hover:text-red-500 hover:underline'
          >
            Chính sách bảo mật
          </Link>{' '}
          của hệ thống.
        </label>
      </div>
      {validationErrors.agreeTerms && (
        <p className='mt-1 text-xs text-red-600'>
          {validationErrors.agreeTerms}
        </p>
      )}
    </div>
  );
};

export default TermsAgreement;
