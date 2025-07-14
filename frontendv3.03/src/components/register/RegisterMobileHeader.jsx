// src/components/register/RegisterMobileHeader.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const RegisterMobileHeader = () => {
  return (
    <div className='lg:hidden text-center mb-6'>
      <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
        <Heart className='w-8 h-8 text-red-600' />
      </div>
      <h1 className='text-2xl font-bold text-gray-900 mb-2'>
        Đăng ký tài khoản
      </h1>
      <p className='text-gray-600'>
        Tham gia cộng đồng hiến máu nhân đạo
      </p>
    </div>
  );
};

export default RegisterMobileHeader;
