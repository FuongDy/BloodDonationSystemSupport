// src/components/register/RegisterDesktopHeader.jsx
import React from 'react';

const RegisterDesktopHeader = () => {
  return (
    <div className='hidden lg:block text-center mb-6'>
      <h2 className='text-3xl font-bold text-gray-900 mb-2'>
        Tạo tài khoản mới
      </h2>
      <p className='text-gray-600'>
        Điền thông tin để tham gia cộng đồng
      </p>
    </div>
  );
};

export default RegisterDesktopHeader;
