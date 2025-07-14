// src/components/donation/request/AuthNotice.jsx
import React from 'react';
import { Info } from 'lucide-react';

const AuthNotice = ({ isAuthenticated }) => {
  if (isAuthenticated) return null;

  return (
    <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
      <div className='flex items-start'>
        <Info className='h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0' />
        <div>
          <h3 className='text-sm font-medium text-yellow-800'>
            Cần đăng nhập để đặt lịch
          </h3>
          <p className='text-sm text-yellow-700 mt-1'>
            Bạn có thể xem thông tin và quy trình hiến máu. Để đặt lịch hẹn, vui lòng đăng nhập hoặc đăng ký tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthNotice;
