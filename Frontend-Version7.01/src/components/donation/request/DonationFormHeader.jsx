// src/components/donation/request/DonationFormHeader.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const DonationFormHeader = () => {
  return (
    <div className='text-center mb-8'>
      <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
        <Calendar className='h-8 w-8 text-red-600' />
      </div>
      <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
        Thông tin đặt lịch
      </h2>
      <p className='text-gray-600 text-sm sm:text-base break-words'>
        Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
      </p>
    </div>
  );
};

export default DonationFormHeader;
