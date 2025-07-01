// src/components/donation/DonationHistoryHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const DonationHistoryHeader = () => {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
            <Heart className='w-8 h-8 text-red-500 mr-3 fill-current' />
            Lịch Sử Hiến Máu
          </h1>
          <p className='mt-2 text-gray-600'>
            Theo dõi toàn bộ hành trình hiến máu của bạn
          </p>
        </div>
        <Link
          to='/request-donation'
          className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center'
        >
          <Heart className='w-5 h-5 mr-2' />
          Đăng Ký Hiến Máu
        </Link>
      </div>
    </div>
  );
};

export default DonationHistoryHeader;
