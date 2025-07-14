// src/components/staff/StaffEmptyState.jsx
import React from 'react';
import { FileX } from 'lucide-react';

const StaffEmptyState = ({ 
  message = 'Không có dữ liệu', 
  icon: Icon = FileX,
  description,
  action 
}) => (
  <div className='text-center text-gray-500 py-16'>
    <div className='flex flex-col items-center space-y-6'>
      <div className='relative'>
        <div className='w-20 h-20 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 flex items-center justify-center'>
          <Icon className='w-10 h-10 text-orange-400' />
        </div>
        <div className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center'>
          <div className='w-2 h-2 rounded-full bg-orange-400'></div>
        </div>
      </div>
      <div className='space-y-2 max-w-md'>
        <h3 className='text-xl font-semibold text-gray-700'>{message}</h3>
        {description && (
          <p className='text-gray-500 leading-relaxed'>{description}</p>
        )}
      </div>
      {action && (
        <div className='pt-4'>
          {action}
        </div>
      )}
    </div>
  </div>
);

export default StaffEmptyState;
