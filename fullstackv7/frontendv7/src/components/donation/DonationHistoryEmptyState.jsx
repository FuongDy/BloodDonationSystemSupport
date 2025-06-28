// src/components/donation/DonationHistoryEmptyState.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';

const DonationHistoryEmptyState = () => {
  return (
    <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
      <div className='text-gray-400 mb-4'>
        <Heart className='w-16 h-16 mx-auto' />
      </div>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
        Chưa có lịch sử hiến máu
      </h3>
      <p className='text-gray-600 mb-6'>
        Bạn chưa có lần hiến máu nào. Hãy bắt đầu hành trình cứu người của
        bạn ngay hôm nay!
      </p>
      <Link
        to='/request-donation'
        className='inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
      >
        <Heart className='w-5 h-5 mr-2' />
        Đăng Ký Hiến Máu Ngay
        <ChevronRight className='w-5 h-5 ml-2' />
      </Link>
    </div>
  );
};

export default DonationHistoryEmptyState;
