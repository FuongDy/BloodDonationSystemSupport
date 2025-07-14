// src/components/donation/DonationHistoryErrorState.jsx
import React from 'react';
import { Activity } from 'lucide-react';

const DonationHistoryErrorState = ({ error, onRetry }) => {
  return (
    <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
      <div className='text-red-500 mb-4'>
        <Activity className='w-16 h-16 mx-auto' />
      </div>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
        Có lỗi xảy ra
      </h3>
      <p className='text-gray-600 mb-4'>{error}</p>
      <button
        onClick={onRetry}
        className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors'
      >
        Thử lại
      </button>
    </div>
  );
};

export default DonationHistoryErrorState;
