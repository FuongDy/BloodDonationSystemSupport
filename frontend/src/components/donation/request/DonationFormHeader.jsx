// src/components/donation/request/DonationFormHeader.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const DonationFormHeader = () => {
  return (
    <div className='text-center mb-8'>
      <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
        <Heart className='h-8 w-8 text-red-600' />
      </div>
      <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
        Đăng ký hiến máu
      </h2>
      <p className='text-gray-600 text-sm sm:text-base break-words'>
        Vui lòng kiểm tra thông tin cá nhân và điền đầy đủ thông tin để đăng ký hiến máu
      </p>
    </div>
  );
};

export default DonationFormHeader;
