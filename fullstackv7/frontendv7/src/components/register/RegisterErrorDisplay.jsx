// src/components/register/RegisterErrorDisplay.jsx
import React from 'react';

const RegisterErrorDisplay = ({ validationErrors }) => {
  if (!validationErrors.general) {
    return null;
  }

  return (
    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
      <h4 className='text-sm font-medium text-red-800 mb-2'>
        Lỗi khác:
      </h4>
      <ul className='text-xs text-red-600 space-y-1'>
        {validationErrors.general.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
    </div>
  );
};

export default RegisterErrorDisplay;
