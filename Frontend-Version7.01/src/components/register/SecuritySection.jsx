// src/components/register/SecuritySection.jsx
import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const SecuritySection = ({ 
  formData, 
  validationErrors, 
  authLoading, 
  isFetchingBloodTypes, 
  showPassword, 
  showConfirmPassword, 
  onChange, 
  onToggleShowPassword, 
  onToggleShowConfirmPassword 
}) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'>
        <Lock className='w-5 h-5 mr-2 text-red-600' />
        Thông tin bảo mật
      </h3>

      {/* Password Fields */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Mật khẩu *
          </label>
          <div className='relative'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={onChange}
              placeholder='Ít nhất 6 ký tự'
              required
              disabled={authLoading || isFetchingBloodTypes}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                validationErrors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
            />
            <button
              type='button'
              onClick={onToggleShowPassword}
              disabled={authLoading}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              {showPassword ? (
                <EyeOff className='w-5 h-5' />
              ) : (
                <Eye className='w-5 h-5' />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className='text-xs text-red-600'>
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Xác nhận mật khẩu *
          </label>
          <div className='relative'>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={onChange}
              placeholder='Nhập lại mật khẩu'
              required
              disabled={authLoading || isFetchingBloodTypes}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                validationErrors.confirmPassword
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
            />
            <button
              type='button'
              onClick={onToggleShowConfirmPassword}
              disabled={authLoading}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              {showConfirmPassword ? (
                <EyeOff className='w-5 h-5' />
              ) : (
                <Eye className='w-5 h-5' />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className='text-xs text-red-600'>
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
