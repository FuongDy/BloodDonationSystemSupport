// src/components/staff/StaffLoadingState.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const StaffLoadingState = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className='text-center text-gray-500 py-12'>
    <div className='flex flex-col items-center space-y-4'>
      <div className='relative'>
        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 flex items-center justify-center'>
          <Loader2 className='w-8 h-8 text-orange-500 animate-spin' />
        </div>
        <div className='absolute inset-0 rounded-full border-2 border-orange-300 animate-pulse opacity-50'></div>
      </div>
      <div className='space-y-2'>
        <p className='text-lg font-medium text-gray-700'>{message}</p>
        <p className='text-sm text-gray-500'>Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  </div>
);

export default StaffLoadingState;
