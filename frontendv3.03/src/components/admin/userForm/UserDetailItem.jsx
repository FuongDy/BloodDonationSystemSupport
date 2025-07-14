// src/components/admin/userForm/UserDetailItem.jsx
import React from 'react';

const UserDetailItem = ({
  icon: _IconComponent,
  label,
  value,
  highlight = false,
  isEditable = false,
  fieldName = '',
  fieldType = 'text',
  options = [],
  rows = 1,
  isEditMode = false,
  formData = {},
  onInputChange = () => {},
  errors = {},
  isSubmitting = false,
}) => {
  return (
    <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
      <dt className='text-sm font-medium text-gray-500 flex items-center'>
        {_IconComponent && <_IconComponent size={16} className='mr-2 text-red-600' />}
        {label}
        {isEditMode && isEditable && (
          <span className='text-red-500 ml-1'>*</span>
        )}
      </dt>
      <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2`}>
        {isEditMode && isEditable ? (
          // Edit mode - render input/select/textarea
          <>
            {fieldType === 'select' ? (
              <select
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onInputChange}
                disabled={isSubmitting}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : fieldType === 'textarea' ? (
              <textarea
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onInputChange}
                disabled={isSubmitting}
                rows={rows}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
              />
            ) : fieldType === 'checkbox' ? (
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  name={fieldName}
                  checked={formData[fieldName] || false}
                  onChange={onInputChange}
                  disabled={isSubmitting}
                  className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                />
                <span className='ml-2 text-sm text-gray-900'>
                  {formData[fieldName] ? 'Có' : 'Không'}
                </span>
              </div>
            ) : (
              <input
                type={fieldType}
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onInputChange}
                disabled={isSubmitting}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`}
              />
            )}
            {errors[fieldName] && (
              <p className='mt-1 text-xs text-red-600'>{errors[fieldName]}</p>
            )}
          </>
        ) : (
          // View mode - render value
          <span
            className={
              highlight ? 'font-semibold text-red-700' : 'text-gray-900'
            }
          >
            {value !== null && value !== undefined && value !== '' ? (
              value
            ) : (
              <span className='italic text-gray-400'>Chưa có thông tin</span>
            )}
          </span>
        )}
      </dd>
    </div>
  );
};

export default UserDetailItem;
